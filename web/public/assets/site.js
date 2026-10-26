// Fills download, price and donation links from the admin settings.
const $ = (id) => document.getElementById(id);

const CORE = ['#2A1B6E', '#7C3AED'];
const ADV = ['#4C1D95', '#C026D3'];
const G = Array.from({ length: 15 }, (_, i) => (i < 11 ? CORE : ADV));
const TILE = G.map(([a, b]) => `linear-gradient(135deg, ${a}, ${b})`);

const MODULES = [
  ['Start here', 'What vibe coding really is'],
  ['Get Claude Code', 'Install it, talk to it like a pro, and when to use Codex'],
  ['Your free accounts', 'GitHub, Vercel and Neon'],
  ['Plan like a pro', 'Sprints, Scrum and system architecture'],
  ['Build your app', 'Your first real app, live on your computer'],
  ['Beautiful UI', 'Fonts, design systems, references and the polish pass'],
  ['Know your building blocks', 'Languages, desktop apps, SQLite vs Postgres, MCP'],
  ['Data and money', 'Your database and Stripe payments'],
  ['Go live', 'Deploy, your domain on Cloudflare, email with Resend'],
  ['Lock it down', 'Secrets, OWASP, free scanners and business security standards'],
  ['Grown-up stuff', 'SOC 2 readiness, running it like a company, launch'],
  ['Power tools on a budget', 'Save tokens, free local Qwen, open-source art tools', true],
  ['Agents and automation', 'Hermes Agent and jobs that run while you sleep', true],
  ['Build AI products', 'Your own chatbot and real business apps', true],
  ['Final project', 'Build a chat relay and voice receptionist for a real customer', true],
];

const grid = $('modules');
MODULES.forEach(([title, sub, adv], i) => {
  const card = document.createElement('div');
  card.className = 'card module';
  const n = document.createElement('div');
  n.className = 'module-n';
  n.style.setProperty('--tile', TILE[i] || TILE[0]);
  n.textContent = String(i).padStart(2, '0');
  const text = document.createElement('div');
  const b = document.createElement('b');
  b.textContent = title;
  if (adv) {
    const pill = document.createElement('span');
    pill.className = 'pill pill-info';
    pill.textContent = 'advanced';
    b.append(pill);
  }
  const s = document.createElement('span');
  s.textContent = sub;
  text.append(b, s);
  card.append(n, text);
  grid.append(card);
});

$('year').textContent = String(new Date().getFullYear());

function setLink(id, url) {
  const a = $(id);
  if (!a) return;
  if (url) { a.href = url; a.hidden = false; }
}

fetch('/api/config')
  .then((r) => (r.ok ? r.json() : {}))
  .then((c) => {
    setLink('dl-mac', c.download_mac); setLink('dl-mac-hero', c.download_mac);
    setLink('dl-win', c.download_windows); setLink('dl-win-hero', c.download_windows);
    setLink('pay-paypal', c.donate_paypal);
    setLink('pay-square', c.donate_square);
    if (c.donate_eth) $('eth').textContent = c.donate_eth;
    if (c.donate_btc) $('btc').textContent = c.donate_btc;
  })
  .catch(() => {});

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const text = $(btn.dataset.copy).textContent;
  try { await navigator.clipboard.writeText(text); } catch { return; }
  const t = $('toast');
  t.textContent = 'Copied';
  t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 1500);
});
