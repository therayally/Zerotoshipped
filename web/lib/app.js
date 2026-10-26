// TinyAppCode API: accounts (email codes), verified donations (Square webhook), and the super admin.
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { q, one } from './db.js';

const enc = new TextEncoder();
const dec = new TextDecoder();

const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_MAX_ATTEMPTS = 5;
const CODE_MAX_SENDS = 3; // per email and purpose, per 15 minutes
const ADMIN_SESSION_S = 12 * 60 * 60;
const TRUST_DAYS = 30; // a device that passed the email code skips it for this long

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
  square_access_token: { secret: true },
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

// Resend: the key and sender come from the admin panel, or from Vercel env vars (RESEND_API_KEY, MAIL_FROM).
async function sendMail(settings, to, subject, text) {
  const key = settings.resend_api_key || env('RESEND_API_KEY');
  if (!key) {
    if (env('DEV_MODE') === '1') { console.log(`[dev] mail to ${to}: ${subject}\n${text}`); return; }
    throw new Error('Email is not set up yet. The owner needs to add a Resend API key.');
  }
  const from = settings.mail_from || env('MAIL_FROM') || 'TinyAppCode <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (!res.ok) throw new Error(`Email failed (${res.status}).`);
}

const MAIL = {
  signup: (code) => ['Confirm your TinyAppCode account', `Welcome! Your confirmation code is ${code}\n\nIt works for 10 minutes. If you did not sign up, you can ignore this email.`],
  login: (code) => ['Your TinyAppCode sign-in code', `Someone (hopefully you) signed in on a new device. Your sign-in code is ${code}\n\nIt works for 10 minutes. If this was not you, reset your password right away: your password is known to someone else.`],
  admin: (code) => ['Your TinyAppCode admin sign-in code', `Your admin sign-in code is ${code}\n\nIt works for 10 minutes. If this was not you, reset your password right away.`],
  reset: (code) => ['Reset your TinyAppCode password', `Your password reset code is ${code}\n\nIt works for 10 minutes. If you did not ask for this, you can ignore this email; your password stays the same.`],
};

// ───────────────────────── passwords (scrypt, salted)

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };
const LOCK_AFTER = 5;
const LOCK_MINUTES = 15;

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function checkPassword(password, stored) {
  const [alg, N, r, p, salt, hash] = String(stored || '').split('$');
  if (alg !== 'scrypt') return false;
  const expected = Buffer.from(hash, 'base64');
  const got = scryptSync(password, Buffer.from(salt, 'base64'), expected.length, { N: +N, r: +r, p: +p });
  return got.length === expected.length && timingSafeEqual(got, expected);
}

function passwordProblem(pw) {
  if (typeof pw !== 'string' || pw.length < 10) return 'Use at least 10 characters for your password.';
  if (pw.length > 200) return 'That password is too long.';
  return null;
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

// Creates a 6-digit code for an email and mails it. Rate limited per email and purpose.
async function sendCode(email, purpose) {
  const recent = await one('SELECT count(*)::int AS n FROM codes WHERE email = $1 AND purpose = $2 AND created_at > $3', [email, purpose, Date.now() - 15 * 60 * 1000]);
  if (recent.n >= CODE_MAX_SENDS) return json({ error: 'Too many codes asked for. Wait 15 minutes and try again.' }, 429);
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
  const hash = await sha256(`${purpose}:${email}:${code}:${secret('SESSION_SECRET')}`);
  await q('UPDATE codes SET used = TRUE WHERE email = $1 AND purpose = $2 AND used = FALSE', [email, purpose]);
  await q('INSERT INTO codes (email, purpose, code_hash, expires_at, created_at) VALUES ($1, $2, $3, $4, $5)', [email, purpose, hash, Date.now() + CODE_TTL_MS, Date.now()]);
  const [subject, text] = MAIL[purpose](code);
  await sendMail(await loadSettings(), email, subject, text);
  return null;
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

async function newSession(email, body) {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await q('INSERT INTO sessions (email, token_hash, device_id, device_name) VALUES ($1, $2, $3, $4)',
    [email, await sha256(token), clean(body.device_id, 64), clean(body.device_name, 80) || 'Computer']);
  await q('UPDATE users SET last_seen = now() WHERE email = $1', [email]);
  const u = await one('SELECT name FROM users WHERE email = $1', [email]);
  return { ok: true, email, name: u?.name || '', token, donated: !!(await donatedAt(email)) };
}

// Two-factor: after a correct password, a device needs an emailed code unless it holds a trust token from an earlier code.
async function trustDevice(email, body) {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await q(`INSERT INTO trusted_devices (email, token_hash, device_name, expires_at) VALUES ($1, $2, $3, now() + ($4 || ' days')::interval)`,
    [email, await sha256(token), clean(body.device_name, 80) || 'Computer', String(TRUST_DAYS)]);
  return token;
}

async function isTrusted(email, token) {
  if (typeof token !== 'string' || token.length < 20 || token.length > 100) return false;
  return !!(await one('SELECT 1 FROM trusted_devices WHERE email = $1 AND token_hash = $2 AND expires_at > now()', [email, await sha256(token)]));
}

async function sessionAndTrust(email, body) {
  return { ...(await newSession(email, body)), trust: await trustDevice(email, body) };
}

const SENT = { ok: true, message: 'We sent a 6-digit code to your email. Check your inbox and spam folder.' };

async function signup(body) {
  const email = normEmail(body.email);
  const name = clean(body.name, 80);
  if (!email) return json({ error: 'Please enter a valid email.' }, 400);
  if (!name) return json({ error: 'Please enter your name.' }, 400);
  const bad = passwordProblem(body.password);
  if (bad) return json({ error: bad }, 400);
  const existing = await one('SELECT email_verified FROM users WHERE email = $1', [email]);
  if (existing?.email_verified) return json({ error: 'There is already an account with this email. Sign in, or use "Forgot password".' }, 409);
  await q(`INSERT INTO users (email, name, password_hash, email_verified) VALUES ($1, $2, $3, FALSE)
           ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`, [email, name, hashPassword(body.password)]);
  const err = await sendCode(email, 'signup');
  return err || json(SENT);
}

async function confirmSignup(body) {
  const email = await checkCode(body, 'signup');
  if (email instanceof Response) return email;
  await q('UPDATE users SET email_verified = TRUE WHERE email = $1', [email]);
  await audit(email, 'account_created');
  return json(await sessionAndTrust(email, body));
}

async function resendSignup(body) {
  const email = normEmail(body.email);
  if (!email) return json({ error: 'Please enter a valid email.' }, 400);
  const u = await one('SELECT email_verified FROM users WHERE email = $1', [email]);
  if (u && !u.email_verified) { const err = await sendCode(email, 'signup'); if (err) return err; }
  return json(SENT);
}

// Checks email + password with lockout. Returns the email, or a Response.
async function checkLogin(body) {
  const email = normEmail(body.email);
  const fail = json({ error: 'That email or password is not right.' }, 401);
  if (!email || typeof body.password !== 'string') return fail;
  const u = await one('SELECT password_hash, email_verified, failed_logins, locked_until FROM users WHERE email = $1', [email]);
  if (u?.locked_until && new Date(u.locked_until) > new Date()) {
    return json({ error: `Too many wrong tries. Try again in ${LOCK_MINUTES} minutes, or reset your password.` }, 429);
  }
  if (!u || !u.password_hash || !checkPassword(body.password, u.password_hash)) {
    if (u) {
      await q(`UPDATE users SET failed_logins = failed_logins + 1,
               locked_until = CASE WHEN failed_logins + 1 >= $2 THEN now() + ($3 || ' minutes')::interval ELSE locked_until END
               WHERE email = $1`, [email, LOCK_AFTER, String(LOCK_MINUTES)]);
    }
    return fail;
  }
  if (!u.email_verified) {
    const err = await sendCode(email, 'signup');
    return err || json({ error: 'needs_verification', message: 'Confirm your email first. We sent you a new code.' }, 403);
  }
  await q('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE email = $1', [email]);
  return email;
}

async function login(body) {
  const email = await checkLogin(body);
  if (email instanceof Response) return email;
  if (await isTrusted(email, body.trust)) return json(await newSession(email, body));
  const err = await sendCode(email, 'login');
  return err || json({ needs_code: true, message: 'New device. We emailed you a 6-digit sign-in code.' });
}

async function verifyLogin(body) {
  const email = await checkCode(body, 'login');
  if (email instanceof Response) return email;
  await audit(email, 'login_new_device', clean(body.device_name, 80));
  return json(await sessionAndTrust(email, body));
}

async function forgot(body) {
  const email = normEmail(body.email);
  if (!email) return json({ error: 'Please enter a valid email.' }, 400);
  const u = await one('SELECT email_verified FROM users WHERE email = $1', [email]);
  // Same answer either way, so nobody can use this to find out who has an account.
  if (u?.email_verified) { const err = await sendCode(email, 'reset'); if (err) return err; }
  return json({ ok: true, message: 'If there is an account with this email, we sent a 6-digit reset code.' });
}

async function reset(body) {
  const bad = passwordProblem(body.password);
  if (bad) return json({ error: bad }, 400);
  const email = await checkCode(body, 'reset');
  if (email instanceof Response) return email;
  await q('UPDATE users SET password_hash = $2, failed_logins = 0, locked_until = NULL WHERE email = $1', [email, hashPassword(body.password)]);
  await q('DELETE FROM sessions WHERE email = $1', [email]); // sign out everywhere after a reset
  await q('DELETE FROM trusted_devices WHERE email = $1', [email]);
  await audit(email, 'password_reset');
  return json(await sessionAndTrust(email, body));
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
  const u = await one('SELECT name FROM users WHERE email = $1', [s.email]);
  const at = await donatedAt(s.email);
  return json({ email: s.email, name: u?.name || '', donated: !!at, donated_at: at });
}

async function signout(request) {
  const s = await sessionFrom(request);
  if (s) await q('DELETE FROM sessions WHERE id = $1', [s.id]);
  return json({ ok: true });
}

// ───────────────────────── Square: any-amount donations

const SQUARE_API = 'https://connect.squareup.com/v2';
const SQUARE_VERSION = '2025-01-23';

// Credentials come from the admin panel, or from Vercel env vars as a fallback.
function squareCreds(s) {
  return {
    token: s.square_access_token || env('SQUARE_ACCESS_TOKEN') || '',
    location: s.square_location_id || env('SQUARE_LOCATION_ID') || '',
    webhookKey: s.square_webhook_key || env('SQUARE_WEBHOOK_SIGNATURE_KEY') || '',
  };
}

// Makes a one-off Square checkout link for the amount the person typed, tagged with their account
// so the webhook can match the payment even if they use a different email at checkout.
async function donate(request, body) {
  const sess = await sessionFrom(request);
  if (!sess) return json({ error: 'Please sign in first.' }, 401);
  const s = await loadSettings();
  const sq = squareCreds(s);
  if (!sq.token || !sq.location) return json({ error: 'Card donations are not set up yet. PayPal and crypto work below.' }, 503);
  const cents = Math.round(Number(body.amount) * 100);
  const min = parseInt(s.min_donation_cents, 10) || 100;
  if (!Number.isFinite(cents) || cents < min || cents > 100000) return json({ error: `Enter an amount between $${(min / 100).toFixed(2)} and $1,000.` }, 400);
  const recent = await one("SELECT count(*)::int AS n FROM audit_log WHERE actor = $1 AND action = 'donate_link' AND created_at > now() - interval '1 hour'", [sess.email]);
  if (recent.n >= 10) return json({ error: 'Too many tries. Please wait a bit and try again.' }, 429);
  const user = await one('SELECT id FROM users WHERE email = $1', [sess.email]);
  const res = await fetch(`${SQUARE_API}/online-checkout/payment-links`, {
    method: 'POST',
    headers: { authorization: `Bearer ${sq.token}`, 'content-type': 'application/json', 'square-version': SQUARE_VERSION },
    body: JSON.stringify({
      idempotency_key: b64url(crypto.getRandomValues(new Uint8Array(18))),
      quick_pay: { name: 'TinyAppCode donation', price_money: { amount: cents, currency: 'USD' }, location_id: sq.location },
      checkout_options: { ask_for_shipping_address: false, redirect_url: new URL(request.url).origin + '/',
        accepted_payment_methods: { apple_pay: true, google_pay: true, cash_app_pay: true, afterpay_clearpay: false } },
      pre_populated_data: { buyer_email: sess.email },
      payment_note: `TinyAppCode donation acct:${user?.id ?? ''}`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.payment_link?.url) {
    console.error('square payment link failed', res.status, JSON.stringify(data.errors || []).slice(0, 300));
    return json({ error: 'Square is not answering right now. Try again in a minute.' }, 502);
  }
  await audit(sess.email, 'donate_link', `${cents}c`);
  return json({ ok: true, url: data.payment_link.url });
}

// ───────────────────────── Square webhook: the only automatic way a donation is recorded

async function squareWebhook(request) {
  const raw = await request.text();
  const settings = await loadSettings();
  const { webhookKey } = squareCreds(settings);
  if (!webhookKey) return json({ error: 'not configured' }, 503);
  const url = settings.square_webhook_url || new URL(request.url).origin + '/api/square/webhook';
  const expected = await hmac(webhookKey, url + raw, 'base64');
  if (!safeEqual(request.headers.get('x-square-hmacsha256-signature') || '', expected)) return json({ error: 'bad signature' }, 401);

  let event;
  try { event = JSON.parse(raw); } catch { return json({ error: 'bad json' }, 400); }
  const obj = event?.data?.object || {};

  if (event.type === 'payment.created' || event.type === 'payment.updated') {
    const pay = obj.payment || {};
    // Prefer the account tag from our own checkout link; fall back to the email typed at checkout.
    const acct = /acct:(\d+)/.exec(pay.note || '')?.[1];
    const tagged = acct ? await one('SELECT email FROM users WHERE id = $1', [Number(acct)]) : null;
    const email = tagged?.email || normEmail(pay.buyer_email_address);
    const amount = pay.amount_money?.amount || 0;
    const min = parseInt(settings.min_donation_cents, 10) || 100;
    const loc = squareCreds(settings).location;
    const rightLocation = !loc || pay.location_id === loc;
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
    const sq = squareCreds(s);
    pub.donate_card = !!(sq.token && sq.location);
    return json(pub, 200, { 'cache-control': 'public, max-age=60' });
  }
  if (path === '/api/health') return json({ ok: true });
  if (path === '/api/square/webhook' && method === 'POST') return squareWebhook(request);
  if (path === '/api/me' && method === 'GET') return me(request);

  if (method === 'POST') {
    const body = await request.clone().json().catch(() => ({}));
    if (path === '/api/auth/signup') return signup(body);
    if (path === '/api/auth/confirm') return confirmSignup(body);
    if (path === '/api/auth/resend') return resendSignup(body);
    if (path === '/api/auth/login') return login(body);
    if (path === '/api/auth/login/verify') return verifyLogin(body);
    if (path === '/api/donate') return donate(request, body);
    if (path === '/api/auth/forgot') return forgot(body);
    if (path === '/api/auth/reset') return reset(body);
    if (path === '/api/auth/signout') return signout(request);
    if (path === '/api/admin/login') {
      const email = await checkLogin(body);
      if (email instanceof Response) return email;
      if (!(await isAdmin(email))) return json({ error: 'Not an admin.' }, 403);
      const err = await sendCode(email, 'admin'); // the admin panel always asks for an emailed code
      return err || json({ needs_code: true, message: 'We emailed you a 6-digit sign-in code.' });
    }
    if (path === '/api/admin/login/verify') {
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
  // vercel.json sends every /api/* request to this one function; the original path is kept in the URL.
  const path = url.pathname.replace(/\/+$/, '');
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
