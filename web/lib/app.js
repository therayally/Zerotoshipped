// Zero to Shipped API: accounts (email codes), verified donations (Square webhook), and the super admin.
import { q, one } from './db.js';

const enc = new TextEncoder();
const dec = new TextDecoder();

const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_MAX_ATTEMPTS = 5;
const CODE_MAX_SENDS = 3; // per email and purpose, per 15 minutes
const ADMIN_SESSION_S = 12 * 60 * 60;

// Settings the admin panel may change. Secret ones are encrypted at rest and never sent back.
const SETTINGS = {
  donate_square: { public: true },
  donate_paypal: { public: true },
  donate_eth: { public: true },
  donate_btc: { public: true },
  download_mac: { public: true },
  download_windows: { public: true },
  min_donation_cents: { public: false, fallback: '100' },
  square_location_id: { public: false },
  square_webhook_url: { public: false },
  mail_from: { public: false },
  square_webhook_key: { secret: true },
  resend_api_key: { secret: true },
};

const env = (k) => process.env[k];

// ───────────────────────── helpers

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function hmac(secret, data, encoding = 'b64url') {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return encoding === 'base64' ? btoa(String.fromCharCode(...new Uint8Array(sig))) : b64url(sig);
}

const sha256 = async (data) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(data)));

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function normEmail(v) {
  const e = String(v || '').trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null;
}

const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);

function secret(name) {
  const v = env(name);
  if (!v || v.length < 32) throw new Error(`Server is missing the ${name} secret (32+ characters).`);
  return v;
}

async function signToken(payload) {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  return `${body}.${await hmac(secret('SESSION_SECRET'), body)}`;
}

async function readToken(token) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  if (!safeEqual(sig, await hmac(secret('SESSION_SECRET'), body))) return null;
  try {
    const p = JSON.parse(dec.decode(fromB64url(body)));
    return p.exp && p.exp > Date.now() / 1000 ? p : null;
  } catch {
    return null;
  }
}

// ───────────────────────── settings (secrets encrypted with AES-GCM)

async function settingsKey() {
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(secret('SETTINGS_KEY')));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function encrypt(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await settingsKey(), enc.encode(text));
  return `${b64url(iv)}.${b64url(ct)}`;
}

async function decrypt(value) {
  const [iv, ct] = value.split('.');
  return dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64url(iv) }, await settingsKey(), fromB64url(ct)));
}

async function loadSettings() {
  const rows = await q('SELECT key, value, is_secret FROM settings');
  const out = {};
  for (const [k, def] of Object.entries(SETTINGS)) out[k] = def.fallback ?? '';
  for (const r of rows) {
    if (!(r.key in SETTINGS)) continue;
    out[r.key] = r.is_secret ? await decrypt(r.value).catch(() => '') : r.value;
  }
  return out;
}

// ───────────────────────── email

async function sendCodeEmail(settings, to, code, purpose) {
  const subject = purpose === 'admin' ? 'Your Zero to Shipped admin sign-in code' : 'Your Zero to Shipped sign-in code';
  const text = `Your code is ${code}\n\nIt works for 10 minutes. If you did not ask for this, you can ignore this email.`;
  if (!settings.resend_api_key) {
    if (env('DEV_MODE') === '1') { console.log(`[dev] ${purpose} code for ${to}: ${code}`); return; }
    throw new Error('Email is not set up yet. The owner needs to add a Resend API key in the admin panel.');
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${settings.resend_api_key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: settings.mail_from || 'Zero to Shipped <onboarding@resend.dev>', to: [to], subject, text }),
  });
  if (!res.ok) throw new Error(`Email failed (${res.status}).`);
}

// ───────────────────────── accounts and codes

async function isAdmin(email) {
  if (email === normEmail(env('SUPER_ADMIN_EMAIL'))) return 'super';
  const row = await one('SELECT role FROM admins WHERE email = $1', [email]);
  return row ? row.role : null;
}

async function donatedAt(email) {
  const row = await one("SELECT min(created_at) AS at FROM donations WHERE email = $1 AND status = 'completed'", [email]);
  return row?.at || null;
}

async function startCode(body) {
  const email = normEmail(body.email);
  const purpose = body.purpose === 'admin' ? 'admin' : 'account';
  if (!email) return json({ error: 'Please enter a valid email.' }, 400);

  const generic = json({ ok: true, message: purpose === 'admin' ? 'If this email is an admin, a code is on its way.' : 'A 6-digit code is on its way. Check your inbox and spam folder.' });
  if (purpose === 'admin' && !(await isAdmin(email))) return generic; // same answer, so admin emails cannot be probed

  const recent = await one('SELECT count(*)::int AS n FROM codes WHERE email = $1 AND purpose = $2 AND created_at > $3', [email, purpose, Date.now() - 15 * 60 * 1000]);
  if (recent.n >= CODE_MAX_SENDS) return json({ error: 'Too many codes asked for. Wait 15 minutes and try again.' }, 429);

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
  const hash = await sha256(`${purpose}:${email}:${code}:${secret('SESSION_SECRET')}`);
  await q('UPDATE codes SET used = TRUE WHERE email = $1 AND purpose = $2 AND used = FALSE', [email, purpose]);
  await q('INSERT INTO codes (email, purpose, code_hash, expires_at, created_at) VALUES ($1, $2, $3, $4, $5)', [email, purpose, hash, Date.now() + CODE_TTL_MS, Date.now()]);
  await sendCodeEmail(await loadSettings(), email, code, purpose);
  return generic;
}

// Checks a code. Returns the email on success, or a Response to send back.
async function checkCode(body, purpose) {
  const email = normEmail(body.email);
  const code = clean(body.code, 6);
  if (!email || !/^\d{6}$/.test(code)) return json({ error: 'Enter the 6-digit code from the email.' }, 400);
  const row = await one('SELECT * FROM codes WHERE email = $1 AND purpose = $2 AND used = FALSE ORDER BY id DESC LIMIT 1', [email, purpose]);
  if (!row || Number(row.expires_at) < Date.now()) return json({ error: 'That code expired. Ask for a new one.' }, 400);
  if (row.attempts >= CODE_MAX_ATTEMPTS) return json({ error: 'Too many tries. Ask for a new code.' }, 429);
  await q('UPDATE codes SET attempts = attempts + 1 WHERE id = $1', [row.id]);
  const hash = await sha256(`${purpose}:${email}:${code}:${secret('SESSION_SECRET')}`);
  if (!safeEqual(hash, row.code_hash)) return json({ error: 'That code is not right. Check the email and try again.' }, 400);
  await q('UPDATE codes SET used = TRUE WHERE id = $1', [row.id]);
  return email;
}

async function verifyAccount(body) {
  const email = await checkCode(body, 'account');
  if (email instanceof Response) return email;
  await q('INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET last_seen = now()', [email]);
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await q('INSERT INTO sessions (email, token_hash, device_id, device_name) VALUES ($1, $2, $3, $4)',
    [email, await sha256(token), clean(body.device_id, 64), clean(body.device_name, 80) || 'Computer']);
  return json({ ok: true, email, token, donated: !!(await donatedAt(email)) });
}

async function sessionFrom(request) {
  const m = (request.headers.get('authorization') || '').match(/^Bearer\s+([A-Za-z0-9_-]{20,})$/);
  if (!m) return null;
  return one('SELECT id, email FROM sessions WHERE token_hash = $1', [await sha256(m[1])]);
}

async function me(request) {
  const s = await sessionFrom(request);
  if (!s) return json({ error: 'Please sign in.' }, 401);
  await q('UPDATE sessions SET last_seen = now() WHERE id = $1', [s.id]);
  const at = await donatedAt(s.email);
  return json({ email: s.email, donated: !!at, donated_at: at });
}

async function signout(request) {
  const s = await sessionFrom(request);
  if (s) await q('DELETE FROM sessions WHERE id = $1', [s.id]);
  return json({ ok: true });
}

// ───────────────────────── Square webhook: the only automatic way a donation is recorded

async function squareWebhook(request) {
  const raw = await request.text();
  const settings = await loadSettings();
  if (!settings.square_webhook_key) return json({ error: 'not configured' }, 503);
  const url = settings.square_webhook_url || new URL(request.url).origin + '/api/square/webhook';
  const expected = await hmac(settings.square_webhook_key, url + raw, 'base64');
  if (!safeEqual(request.headers.get('x-square-hmacsha256-signature') || '', expected)) return json({ error: 'bad signature' }, 401);

  let event;
  try { event = JSON.parse(raw); } catch { return json({ error: 'bad json' }, 400); }
  const obj = event?.data?.object || {};

  if (event.type === 'payment.created' || event.type === 'payment.updated') {
    const pay = obj.payment || {};
    const email = normEmail(pay.buyer_email_address);
    const amount = pay.amount_money?.amount || 0;
    const min = parseInt(settings.min_donation_cents, 10) || 100;
    const rightLocation = !settings.square_location_id || pay.location_id === settings.square_location_id;
    if (pay.status === 'COMPLETED' && email && amount >= min && rightLocation) {
      const rows = await q("INSERT INTO donations (email, source, external_id, amount_cents) VALUES ($1, 'square', $2, $3) ON CONFLICT (external_id) DO NOTHING RETURNING id",
        [email, clean(pay.id, 100), amount]);
      if (rows.length) await audit('square', 'donation', `${email} ${amount}c`);
    }
  }

  if (event.type === 'refund.created' || event.type === 'refund.updated') {
    const refund = obj.refund || {};
    if (refund.status === 'COMPLETED' && refund.payment_id) {
      const rows = await q("UPDATE donations SET status = 'refunded' WHERE external_id = $1 AND status = 'completed' RETURNING id", [refund.payment_id]);
      if (rows.length) await audit('square', 'refund', refund.payment_id);
    }
  }
  return json({ ok: true });
}

// ───────────────────────── admin

async function audit(actor, action, detail = '') {
  await q('INSERT INTO audit_log (actor, action, detail) VALUES ($1, $2, $3)', [actor, action, clean(detail, 500)]);
}

function cookie(request, name) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

function sessionCookie(request, value, maxAge) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `zts_admin=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

async function adminSession(request) {
  const p = await readToken(cookie(request, 'zts_admin'));
  if (!p || p.t !== 'admin') return null;
  const role = await isAdmin(p.email);
  return role ? { email: p.email, role } : null;
}

async function adminApi(request, path, me) {
  const method = request.method;
  // Changes must come from our own page (SameSite cookie + custom header).
  if (method !== 'GET' && request.headers.get('x-zts') !== '1') return json({ error: 'forbidden' }, 403);
  const body = method === 'GET' ? {} : await request.json().catch(() => ({}));
  const params = new URL(request.url).searchParams;

  if (path === '/api/admin/me') return json(me);
  if (path === '/api/admin/logout') return json({ ok: true }, 200, { 'set-cookie': sessionCookie(request, '', 0) });

  if (path === '/api/admin/overview') {
    const [people, donors, total, week] = await Promise.all([
      one('SELECT count(*)::int AS n FROM users'),
      one("SELECT count(DISTINCT email)::int AS n FROM donations WHERE status = 'completed'"),
      one("SELECT COALESCE(sum(amount_cents), 0)::int AS c FROM donations WHERE status = 'completed'"),
      one("SELECT count(*)::int AS n FROM donations WHERE status = 'completed' AND created_at > now() - interval '7 days'"),
    ]);
    const recent = await q('SELECT id, email, source, amount_cents, status, created_at FROM donations ORDER BY id DESC LIMIT 8');
    return json({ people: people.n, donors: donors.n, total_cents: total.c, week: week.n, recent });
  }

  if (path === '/api/admin/people') {
    const term = `%${clean(params.get('q'), 100).toLowerCase()}%`;
    const people = await q(`SELECT u.email, u.created_at, u.last_seen,
        (SELECT count(*)::int FROM sessions s WHERE s.email = u.email) AS devices,
        (SELECT COALESCE(sum(amount_cents), 0)::int FROM donations d WHERE d.email = u.email AND d.status = 'completed') AS donated_cents
      FROM users u WHERE u.email LIKE $1 ORDER BY u.created_at DESC LIMIT 200`, [term]);
    return json({ people });
  }

  if (path === '/api/admin/donations' && method === 'GET') {
    const donations = await q('SELECT * FROM donations ORDER BY id DESC LIMIT 300');
    return json({ donations });
  }

  if (path === '/api/admin/donations' && method === 'POST') {
    const email = normEmail(body.email);
    if (!email) return json({ error: 'Enter a valid email.' }, 400);
    const source = ['paypal', 'crypto', 'cash', 'other'].includes(body.source) ? body.source : 'other';
    const cents = Math.max(0, Math.round(Number(body.amount || 0) * 100));
    await q('INSERT INTO donations (email, source, amount_cents, note) VALUES ($1, $2, $3, $4)', [email, source, cents, clean(body.note, 300)]);
    await audit(me.email, 'manual_donation', `${email} ${source} ${cents}c`);
    return json({ ok: true });
  }

  let m = path.match(/^\/api\/admin\/donations\/(\d+)\/status$/);
  if (m && method === 'POST') {
    const status = ['completed', 'refunded', 'removed'].includes(body.status) ? body.status : null;
    if (!status) return json({ error: 'Bad status.' }, 400);
    await q('UPDATE donations SET status = $1 WHERE id = $2', [status, m[1]]);
    await audit(me.email, `donation_${status}`, `#${m[1]}`);
    return json({ ok: true });
  }

  if (path === '/api/admin/sessions' && method === 'GET') {
    const email = normEmail(params.get('email')) || '';
    return json({ sessions: await q('SELECT id, device_name, created_at, last_seen FROM sessions WHERE email = $1 ORDER BY last_seen DESC', [email]) });
  }

  m = path.match(/^\/api\/admin\/sessions\/(\d+)$/);
  if (m && method === 'DELETE') {
    const s = await one('SELECT email, device_name FROM sessions WHERE id = $1', [m[1]]);
    await q('DELETE FROM sessions WHERE id = $1', [m[1]]);
    if (s) await audit(me.email, 'signed_out_device', `${s.email} (${s.device_name})`);
    return json({ ok: true });
  }

  if (path === '/api/admin/settings' && method === 'GET') {
    const s = await loadSettings();
    const out = {};
    for (const [k, def] of Object.entries(SETTINGS)) out[k] = def.secret ? { set: !!s[k] } : s[k];
    out._webhook_url = s.square_webhook_url || `${new URL(request.url).origin}/api/square/webhook`;
    return json(out);
  }

  if (path === '/api/admin/settings' && method === 'POST') {
    const changed = [];
    for (const [k, v] of Object.entries(body)) {
      const def = SETTINGS[k];
      if (!def) continue;
      const value = clean(v, 2000);
      if (def.secret && !value) continue; // blank secret field keeps the current one
      if (/^(download_|donate_paypal|donate_square|square_webhook_url)/.test(k) && value && !/^https:\/\//.test(value)) {
        return json({ error: `${k} must start with https://` }, 400);
      }
      await q(`INSERT INTO settings (key, value, is_secret, updated_at) VALUES ($1, $2, $3, now())
               ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, is_secret = EXCLUDED.is_secret, updated_at = now()`,
        [k, def.secret ? await encrypt(value) : value, !!def.secret]);
      changed.push(k);
    }
    if (changed.length) await audit(me.email, 'settings', changed.join(', '));
    return json({ ok: true, changed });
  }

  if (path.startsWith('/api/admin/admins')) {
    if (me.role !== 'super') return json({ error: 'Only the super admin can manage admins.' }, 403);
    if (method === 'GET') return json({ super: normEmail(env('SUPER_ADMIN_EMAIL')), admins: await q('SELECT email, role, created_at FROM admins ORDER BY created_at') });
    const email = normEmail(body.email);
    if (!email) return json({ error: 'Enter a valid email.' }, 400);
    if (method === 'POST') { await q("INSERT INTO admins (email, role) VALUES ($1, 'admin') ON CONFLICT DO NOTHING", [email]); await audit(me.email, 'admin_added', email); }
    if (method === 'DELETE') { await q('DELETE FROM admins WHERE email = $1', [email]); await audit(me.email, 'admin_removed', email); }
    return json({ ok: true });
  }

  if (path === '/api/admin/audit') return json({ log: await q('SELECT * FROM audit_log ORDER BY id DESC LIMIT 200') });

  return json({ error: 'not found' }, 404);
}

// ───────────────────────── router

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
};

function corsHeaders(request) {
  const origin = request.headers.get('origin');
  const allowed = (env('APP_ORIGINS') || 'tauri://localhost,http://tauri.localhost,http://localhost:5174,http://localhost:5175').split(',').map((s) => s.trim());
  if (!origin || !allowed.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

async function route(request, path) {
  const method = request.method;

  if (path === '/api/config' && method === 'GET') {
    const s = await loadSettings();
    const pub = {};
    for (const [k, def] of Object.entries(SETTINGS)) if (def.public) pub[k] = s[k];
    return json(pub, 200, { 'cache-control': 'public, max-age=60' });
  }
  if (path === '/api/health') return json({ ok: true });
  if (path === '/api/square/webhook' && method === 'POST') return squareWebhook(request);
  if (path === '/api/me' && method === 'GET') return me(request);

  if (method === 'POST') {
    const body = await request.clone().json().catch(() => ({}));
    if (path === '/api/auth/start') return startCode(body);
    if (path === '/api/auth/verify') return verifyAccount(body);
    if (path === '/api/auth/signout') return signout(request);
    if (path === '/api/admin/login') {
      const email = await checkCode(body, 'admin');
      if (email instanceof Response) return email;
      if (!(await isAdmin(email))) return json({ error: 'Not an admin.' }, 403);
      const now = Math.floor(Date.now() / 1000);
      const token = await signToken({ t: 'admin', email, iat: now, exp: now + ADMIN_SESSION_S });
      await audit(email, 'login');
      return json({ ok: true }, 200, { 'set-cookie': sessionCookie(request, token, ADMIN_SESSION_S) });
    }
  }

  if (path.startsWith('/api/admin/')) {
    const admin = await adminSession(request);
    if (!admin) return json({ error: 'Please sign in.' }, 401);
    return adminApi(request, path, admin);
  }
  return json({ error: 'not found' }, 404);
}

export async function handle(request) {
  const cors = corsHeaders(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const url = new URL(request.url);
  // vercel.json rewrites /api/<anything> to /api?route=<anything>.
  const path = url.searchParams.has('route') ? `/api/${url.searchParams.get('route')}`.replace(/\/+$/, '') : url.pathname.replace(/\/+$/, '');
  let res;
  try {
    res = await route(request, path);
  } catch (err) {
    console.error(err);
    res = json({ error: 'Something went wrong on our side. Try again in a minute.' }, 500);
  }
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...cors })) out.headers.set(k, v);
  return out;
}
