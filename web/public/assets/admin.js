// Super admin panel. All user data is written with textContent, never innerHTML.
const $ = (id) => document.getElementById(id);

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body || method !== 'GET' ? { 'content-type': 'application/json', 'x-zts': '1' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path.startsWith('/api/admin/') && !path.startsWith('/api/admin/login')) { showLogin(); throw new Error('Please sign in.'); }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function toast(text) {
  const t = $('toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 2600);
}

function setMsg(el, text, kind = '') {
  el.textContent = text;
  el.className = `msg ${kind}`;
}

function el(tag, props = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  for (const c of children) if (c != null) n.append(c instanceof Node ? c : String(c));
  return n;
}

const money = (c) => `$${(c / 100).toFixed(2)}`;
const date = (s) => (s ? new Date(s).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '');
const statusPill = (s) => el('span', { class: `pill ${s === 'completed' ? 'pill-good' : 'pill-bad'}` }, s);

function fillRows(tbody, rows, cols, emptyText) {
  tbody.replaceChildren();
  if (!rows.length) {
    tbody.append(el('tr', {}, el('td', { class: 'empty', colspan: String(cols) }, emptyText)));
    return;
  }
  for (const r of rows) tbody.append(r);
}

// ───────── sign in

function showForm(id) {
  for (const f of ['login-form', 'code-form', 'forgot-form', 'reset-form']) $(f).hidden = f !== id;
}

function showLogin() {
  $('app').hidden = true;
  $('login').hidden = false;
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg($('login-msg'), 'Signing in…');
  try {
    const r = await api('/api/admin/login', { method: 'POST', body: { email: $('email').value.trim(), password: $('password').value } });
    $('password').value = '';
    setMsg($('login-msg'), r.message, 'ok');
    showForm('code-form');
    $('l-code').focus();
  } catch (err) { setMsg($('login-msg'), err.message, 'err'); }
});

$('code-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  setMsg($('login-msg'), 'Checking…');
  try {
    await api('/api/admin/login/verify', { method: 'POST', body: { email: $('email').value.trim(), code: $('l-code').value.trim() } });
    $('l-code').value = '';
    setMsg($('login-msg'), '');
    showForm('login-form');
    start();
  } catch (err) { setMsg($('login-msg'), err.message, 'err'); }
});

$('forgot-link').addEventListener('click', () => { $('f-email').value = $('email').value; showForm('forgot-form'); setMsg($('login-msg'), ''); });
document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => { showForm('login-form'); setMsg($('login-msg'), ''); }));

$('forgot-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const r = await api('/api/auth/forgot', { method: 'POST', body: { email: $('f-email').value.trim() } });
    setMsg($('login-msg'), r.message, 'ok');
    showForm('reset-form');
  } catch (err) { setMsg($('login-msg'), err.message, 'err'); }
});

$('reset-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/api/auth/reset', { method: 'POST', body: { email: $('f-email').value.trim(), code: $('r-code').value.trim(), password: $('r-password').value } });
    $('email').value = $('f-email').value;
    showForm('login-form');
    setMsg($('login-msg'), 'Password changed. Sign in with your new password.', 'ok');
  } catch (err) { setMsg($('login-msg'), err.message, 'err'); }
});

$('logout').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
  showLogin();
});

// ───────── tabs

const loaders = {};
function openTab(name) {
  document.querySelectorAll('.nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== name; });
  loaders[name]?.().catch((err) => toast(err.message));
}
document.querySelectorAll('.nav button').forEach((b) => b.addEventListener('click', () => openTab(b.dataset.tab)));

// ───────── overview

loaders.overview = async () => {
  const o = await api('/api/admin/overview');
  $('st-people').textContent = o.people;
  $('st-donors').textContent = o.donors;
  $('st-total').textContent = money(o.total_cents);
  $('st-week').textContent = o.week;
  fillRows($('recent'), o.recent.map((d) => el('tr', {},
    el('td', {}, d.email), el('td', {}, d.source), el('td', {}, money(d.amount_cents)), el('td', {}, statusPill(d.status)), el('td', { class: 'muted' }, date(d.created_at)),
  )), 5, 'No donations yet. Card donations show up here as soon as Square sends them.');
};

// ───────── people

loaders.people = async () => {
  const q = encodeURIComponent($('search').value.trim());
  const { people } = await api(`/api/admin/people?q=${q}`);
  fillRows($('people'), people.map((p) => el('tr', {},
    el('td', {}, p.email),
    el('td', {}, p.donated_cents > 0 ? el('span', { class: 'pill pill-good' }, money(p.donated_cents)) : el('span', { class: 'muted' }, 'not yet')),
    el('td', {}, String(p.devices)),
    el('td', { class: 'muted' }, date(p.created_at)),
    el('td', { class: 'muted' }, date(p.last_seen)),
    el('td', { class: 'actions' }, el('button', { class: 'btn btn-outline btn-sm', onclick: () => showSessions(p.email) }, 'Devices')),
  )), 6, 'Nobody has signed up yet.');
};

let searchTimer;
$('search').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => loaders.people(), 250); });

async function showSessions(email) {
  const { sessions } = await api(`/api/admin/sessions?email=${encodeURIComponent(email)}`);
  $('sessions-card').hidden = false;
  $('sessions-title').textContent = `Devices for ${email}`;
  fillRows($('sessions'), sessions.map((s) => el('tr', {},
    el('td', {}, s.device_name || 'Computer'), el('td', { class: 'muted' }, date(s.created_at)), el('td', { class: 'muted' }, date(s.last_seen)),
    el('td', { class: 'actions' }, el('button', { class: 'btn btn-outline btn-sm', onclick: async () => {
      await api(`/api/admin/sessions/${s.id}`, { method: 'DELETE' });
      toast('Device signed out');
      showSessions(email);
    } }, 'Sign out')),
  )), 4, 'No devices signed in.');
  $('sessions-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ───────── donations

loaders.donations = async () => {
  const { donations } = await api('/api/admin/donations');
  fillRows($('donations'), donations.map((d) => el('tr', {},
    el('td', {}, d.email),
    el('td', {}, d.source + (d.note ? ` · ${d.note}` : '')),
    el('td', {}, money(d.amount_cents)),
    el('td', {}, statusPill(d.status)),
    el('td', { class: 'muted' }, date(d.created_at)),
    el('td', { class: 'actions' }, d.status === 'completed'
      ? el('button', { class: 'btn btn-outline btn-sm', onclick: () => setDonation(d, 'refunded') }, 'Mark refunded')
      : el('button', { class: 'btn btn-outline btn-sm', onclick: () => setDonation(d, 'completed') }, 'Restore')),
  )), 6, 'No donations yet.');
};

async function setDonation(d, status) {
  if (status === 'refunded' && !confirm(`Mark the donation from ${d.email} as refunded? Their donation window comes back.`)) return;
  await api(`/api/admin/donations/${d.id}/status`, { method: 'POST', body: { status } });
  toast('Donation updated');
  loaders.donations();
}

$('manual').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/api/admin/donations', { method: 'POST', body: { email: $('m-email').value.trim(), source: $('m-source').value, amount: $('m-amount').value.trim(), note: $('m-note').value.trim() } });
    $('manual').reset();
    toast('Donation recorded. Their window stops showing at next launch.');
    loaders.donations();
  } catch (err) { toast(err.message); }
});

// ───────── settings

const SECRET_KEYS = ['square_webhook_key', 'square_access_token', 'resend_api_key'];

loaders.settings = async () => {
  const s = await api('/api/admin/settings');
  $('webhook-url').value = s._webhook_url;
  for (const input of $('settings').querySelectorAll('input[name]')) {
    const v = s[input.name];
    if (SECRET_KEYS.includes(input.name)) {
      input.value = '';
      input.placeholder = v?.set ? '•••••••• saved (type to replace)' : 'Not set yet';
      $(`h-${input.name}`).textContent = v?.set ? 'Saved and encrypted. It is never shown again.' : 'Not set yet.';
    } else {
      input.value = v ?? '';
    }
  }
};

$('settings').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {};
  for (const input of $('settings').querySelectorAll('input[name]')) body[input.name] = input.value.trim();
  setMsg($('settings-msg'), 'Saving…');
  try {
    await api('/api/admin/settings', { method: 'POST', body });
    setMsg($('settings-msg'), 'Saved.', 'ok');
    loaders.settings();
  } catch (err) { setMsg($('settings-msg'), err.message, 'err'); }
});

document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-copy]');
  if (!b) return;
  try { await navigator.clipboard.writeText($(b.dataset.copy).value); toast('Copied'); } catch { $(b.dataset.copy).select(); }
});

// ───────── admins

loaders.admins = async () => {
  const r = await api('/api/admin/admins');
  const rows = [el('tr', {}, el('td', {}, r.super), el('td', {}, el('span', { class: 'pill pill-info' }, 'super admin')), el('td', { class: 'muted' }, '—'), el('td'))];
  for (const a of r.admins) {
    rows.push(el('tr', {}, el('td', {}, a.email), el('td', {}, el('span', { class: 'pill pill-plain' }, a.role)), el('td', { class: 'muted' }, date(a.created_at)),
      el('td', { class: 'actions' }, el('button', { class: 'btn btn-outline btn-sm', onclick: async () => {
        if (!confirm(`Remove ${a.email} as admin?`)) return;
        await api('/api/admin/admins', { method: 'DELETE', body: { email: a.email } });
        toast('Admin removed');
        loaders.admins();
      } }, 'Remove'))));
  }
  fillRows($('admins'), rows, 4, '');
};

$('add-admin').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/api/admin/admins', { method: 'POST', body: { email: $('admin-email').value.trim() } });
    $('admin-email').value = '';
    toast('Admin added');
    loaders.admins();
  } catch (err) { toast(err.message); }
});

// ───────── activity

loaders.activity = async () => {
  const { log } = await api('/api/admin/audit');
  fillRows($('audit'), log.map((a) => el('tr', {},
    el('td', { class: 'muted' }, date(a.created_at)), el('td', {}, a.actor), el('td', {}, a.action), el('td', { class: 'muted' }, a.detail || ''),
  )), 4, 'Nothing yet.');
};

// ───────── start

async function start() {
  try {
    const me = await api('/api/admin/me');
    $('me-email').textContent = me.email;
    $('me-email').title = me.email;
    $('me-role').textContent = me.role === 'super' ? 'super admin' : 'admin';
    $('nav-admins').hidden = me.role !== 'super';
    $('login').hidden = true;
    $('app').hidden = false;
    openTab('overview');
  } catch { showLogin(); }
}

start();
