// Talks to the Zero to Shipped server. The course is free; an account only links donations to a person,
// so the donation window can stop showing once a real donation is recorded in the database.

export const API_BASE = import.meta.env.VITE_API_BASE || 'https://zerotoshipped-ruddy.vercel.app';

const read = (k) => { try { return JSON.parse(localStorage.getItem('zts.' + k)); } catch { return null; } };
const write = (k, v) => { try { v == null ? localStorage.removeItem('zts.' + k) : localStorage.setItem('zts.' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

export function deviceId() {
  let id = read('device');
  if (!id) {
    id = crypto.randomUUID();
    write('device', id);
  }
  return id;
}

function deviceName() {
  const p = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
  if (p.includes('mac')) return 'Mac';
  if (p.includes('win')) return 'Windows PC';
  if (p.includes('linux')) return 'Linux computer';
  return 'Computer';
}

async function call(path, { method = 'POST', body, token } = {}) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error('Could not reach the server. Check your internet and try again.'), { offline: true });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong.'), { status: res.status, data });
  return data;
}

export const getAccount = () => read('account');

export async function getConfig() {
  try {
    const res = await fetch(API_BASE + '/api/config');
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

const device = () => ({ device_id: deviceId(), device_name: deviceName() });

function saveSession(r) {
  const acct = { token: r.token, email: r.email, name: r.name || '', donated: !!r.donated };
  write('account', acct);
  return acct;
}

// Create account: name, email, password, then a 6-digit code emailed to confirm the address.
export const signup = (name, email, password) => call('/api/auth/signup', { body: { name, email, password } });
export const resendSignup = (email) => call('/api/auth/resend', { body: { email } });
export const confirmSignup = async (email, code) => saveSession(await call('/api/auth/confirm', { body: { email, code, ...device() } }));

export const login = async (email, password) => saveSession(await call('/api/auth/login', { body: { email, password, ...device() } }));

// Forgot password: a 6-digit code by email, then a new password.
export const forgotPassword = (email) => call('/api/auth/forgot', { body: { email } });
export const resetPassword = async (email, code, password) => saveSession(await call('/api/auth/reset', { body: { email, code, password, ...device() } }));

// Asks the server whether this account has a recorded donation. The server's database is the only source of truth.
export async function refreshAccount() {
  const acct = read('account');
  if (!acct) return null;
  try {
    const r = await call('/api/me', { method: 'GET', token: acct.token });
    const next = { ...acct, email: r.email, name: r.name || acct.name || '', donated: !!r.donated };
    write('account', next);
    return next;
  } catch (e) {
    if (e.status === 401) { write('account', null); return null; }
    return acct;
  }
}

export async function signOut() {
  const acct = read('account');
  write('account', null);
  if (acct) await call('/api/auth/signout', { token: acct.token }).catch(() => {});
}
