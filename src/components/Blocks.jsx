import { useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Button, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import VerifiedUserRounded from '@mui/icons-material/VerifiedUserRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import NorthEastRounded from '@mui/icons-material/NorthEastRounded';
import LightbulbRounded from '@mui/icons-material/LightbulbRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import QuizRounded from '@mui/icons-material/QuizRounded';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import FlagRounded from '@mui/icons-material/FlagRounded';
import { FONT_MONO } from '../theme';
import { Snapshot, Mock, TerminalShot } from './Art';
import { logo } from '../content/logos';
import Figure from './Figures';

// ───────── motion: everything fades up as it scrolls into view; reduced-motion users see it still.

const still = { '@media (prefers-reduced-motion: reduce)': { opacity: 1, transform: 'none', transition: 'none', animation: 'none' } };
const pop = keyframes`0% { transform: scale(1); } 40% { transform: scale(1.025); } 100% { transform: scale(1); }`;
const shake = keyframes`0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); }`;

export function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    // Never leave content invisible: no observer, a hidden tab, or printing all show it straight away.
    if (!el || typeof IntersectionObserver === 'undefined' || document.visibilityState !== 'visible') { setSeen(true); return undefined; }
    const show = () => { setSeen(true); io.disconnect(); };
    // Anything already scrolled past (above the screen) counts as seen too.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting || e.boundingClientRect.top < 0) show(); }, { rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    const onHide = () => { if (document.visibilityState !== 'visible') show(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeprint', show);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onHide); window.removeEventListener('beforeprint', show); };
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0 }) {
  const [ref, seen] = useInView();
  return (
    <Box ref={ref} sx={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(14px)', transition: 'opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1)', transitionDelay: `${delay}ms`, ...still }}>
      {children}
    </Box>
  );
}

// ───────── real logos next to tool names written in **bold**

const BRANDS = {
  GitHub: 'github', 'GitHub Actions': 'githubactions', Git: 'git', Vercel: 'vercel', Neon: 'neon', Stripe: 'stripe', Square: 'square',
  Resend: 'resend', Cloudflare: 'cloudflare', Claude: 'claude', 'Claude Code': 'claude', Anthropic: 'anthropic', Ollama: 'ollama',
  'LM Studio': 'lmstudio', 'Hugging Face': 'huggingface', Qwen: 'qwen', Docker: 'docker', 'Next.js': 'nextjs', React: 'react',
  TypeScript: 'typescript', Tailwind: 'tailwind', 'Tailwind CSS': 'tailwind', Telegram: 'telegram', Postgres: 'postgres', PostgreSQL: 'postgres',
  Drizzle: 'drizzle', 'Drizzle ORM': 'drizzle', MCP: 'mcp', Rust: 'rust', Tauri: 'tauri', Electron: 'electron', Python: 'python',
  SQLite: 'sqlite', Dependabot: 'dependabot', OWASP: 'owasp', Blender: 'blender', Krita: 'krita', ElevenLabs: 'elevenlabs', Figma: 'figma',
  'Node.js': 'node', Node: 'node', 'Google Fonts': 'googlefonts', Mermaid: 'mermaid',
  Cursor: 'cursor', 'GitHub Copilot': 'githubcopilot', PostHog: 'posthog', TikTok: 'tiktok', 'Product Hunt': 'producthunt',
};

function BrandMark({ k }) {
  const { t } = useTheme();
  const icon = logo(k);
  if (!icon || icon.text) return null;
  const n = parseInt(icon.hex, 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  // Near-black and near-white logos follow the text color so they show in both themes.
  const fill = lum < 40 || lum > 225 ? t.text : `#${icon.hex}`;
  return (
    <svg viewBox="0 0 24 24" width="0.95em" height="0.95em" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-0.12em', marginRight: '0.3em' }}>
      <path d={icon.path} fill={fill} />
    </svg>
  );
}

// Renders **bold**, *italic* and `code` inside a string.
export function Inline({ text }) {
  const { t } = useTheme();
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith('**')) {
      const word = p.slice(2, -2);
      return <strong key={i} style={{ fontWeight: 700, color: t.text, whiteSpace: BRANDS[word] ? 'nowrap' : undefined }}>{BRANDS[word] && <BrandMark k={BRANDS[word]} />}{word}</strong>;
    }
    if (p.startsWith('`')) return (
      <code key={i} style={{ fontFamily: FONT_MONO, fontSize: '0.86em', background: t.accentSoft, color: t.accentText, borderRadius: 6, padding: '2px 6px', wordBreak: 'break-word' }}>{p.slice(1, -1)}</code>
    );
    if (p.startsWith('*')) return <em key={i}>{p.slice(1, -1)}</em>;
    return <span key={i}>{p}</span>;
  });
}

function CopyButton({ text, dark }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTheme();
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <Button size="small" onClick={copy} startIcon={copied ? <CheckRounded fontSize="small" /> : <ContentCopyRounded fontSize="small" />}
      sx={{ flexShrink: 0, minWidth: 96, color: copied ? '#fff' : dark ? '#fff' : t.accentText, background: copied ? t.accent : dark ? 'rgba(255,255,255,0.1)' : t.accentSoft, '&:hover': { background: copied ? t.accent : dark ? 'rgba(255,255,255,0.18)' : t.accentSoft, filter: 'brightness(0.97)' } }}>
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

function PromptBox({ label, text }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 3, borderRadius: '3px', background: t.surface, boxShadow: t.shadow, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, pl: 2, pr: 1.25, py: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
          <Box sx={{ width: 30, height: 30, borderRadius: '2px', background: t.grad, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <AutoAwesomeRounded sx={{ fontSize: 17, color: '#fff' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label || 'Prompt'}</Typography>
        </Box>
        <CopyButton text={text} />
      </Box>
      <Box component="pre" sx={{ m: 0, mx: 1.25, mb: 1.25, p: 2, borderRadius: '3px', fontFamily: FONT_MONO, fontSize: 13.5, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: t.text2, background: t.surface2, maxHeight: 340, overflow: 'auto' }}>
        {text}
      </Box>
    </Box>
  );
}

function CmdBox({ label, text }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 2.5, borderRadius: '3px', overflow: 'hidden', background: t.code }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, pl: 2, pr: 1.25, py: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: '#9AA3B2' }}>{label || 'Terminal'}</Typography>
        <CopyButton text={text} dark />
      </Box>
      <Box component="pre" sx={{ m: 0, px: 2, pb: 2, pt: 0.5, fontFamily: FONT_MONO, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: t.codeText }}>
        {text.split('\n').map((line, i) => (
          <Box key={i} component="span" sx={{ display: 'block' }}>
            <Box component="span" sx={{ color: '#45C7B8', userSelect: 'none', mr: 1.25 }}>$</Box>{line}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Tip({ tone = 'info', text }) {
  const { t } = useTheme();
  const map = {
    info: { bg: t.skySoft, fg: t.sky, icon: InfoRounded, label: 'Good to know' },
    warn: { bg: t.coralSoft, fg: t.coral, icon: ErrorRounded, label: 'Careful' },
    safe: { bg: t.tealSoft, fg: t.teal, icon: VerifiedUserRounded, label: 'Safety tip' },
  }[tone];
  const Icon = map.icon;
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', p: 2, pl: 2.25, my: 3, borderRadius: '3px', background: map.bg, borderLeft: `4px solid ${map.fg}` }}>
      <Icon sx={{ color: map.fg, fontSize: 21, mt: '2px', flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, color: map.fg, fontSize: 14.5, mb: 0.25 }}>{map.label}</Typography>
        <Typography variant="body2" sx={{ color: 'text.primary' }}><Inline text={text} /></Typography>
      </Box>
    </Box>
  );
}

// A step is either a string, or { do, why } to explain the reason under it.
function Steps({ items }) {
  const { t } = useTheme();
  return (
    <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, my: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((it, i) => {
        const main = typeof it === 'string' ? it : it.do;
        const why = typeof it === 'string' ? null : it.why;
        return (
          <Box component="li" key={i}>
            <Reveal delay={i * 90}>
              <Box sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start', position: 'relative' }}>
                {i < items.length - 1 && <Box sx={{ position: 'absolute', left: 14.5, top: 34, bottom: -16, width: '1.5px', background: t.border }} />}
                <Box sx={{ width: 30, height: 30, borderRadius: '2px', flexShrink: 0, display: 'grid', placeItems: 'center', background: t.grad, color: '#fff', fontSize: 14, fontWeight: 700, boxShadow: `0 4px 10px ${t.accent}33`, position: 'relative' }}>{i + 1}</Box>
                <Box sx={{ minWidth: 0, pt: '2px' }}>
                  <Typography><Inline text={main} /></Typography>
                  {why && <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}><Inline text={why} /></Typography>}
                </Box>
              </Box>
            </Reveal>
          </Box>
        );
      })}
    </Box>
  );
}

const paras = (text) => (Array.isArray(text) ? text : [text]);

function Why({ text }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 3, p: { xs: 2.25, sm: 2.75 }, borderRadius: '3px', background: t.surface, border: `1px solid ${t.border}`, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: t.grad }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <FlagRounded sx={{ fontSize: 19, color: t.accent }} />
        <Typography sx={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.accentText }}>Why this matters</Typography>
      </Box>
      {paras(text).map((p, i) => <Typography key={i} sx={{ mt: i ? 1.25 : 0, fontSize: '1.08rem' }}><Inline text={p} /></Typography>)}
    </Box>
  );
}

function Analogy({ text }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 3, display: 'flex', gap: 1.75, alignItems: 'flex-start', p: 2.25, borderRadius: '3px', background: t.tealSoft }}>
      <Box sx={{ width: 36, height: 36, borderRadius: '3px', background: t.teal, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <LightbulbRounded sx={{ color: '#fff', fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14.5, mb: 0.5, color: t.teal }}>Think of it like this</Typography>
        {paras(text).map((p, i) => <Typography key={i} sx={{ mt: i ? 1 : 0 }}><Inline text={p} /></Typography>)}
      </Box>
    </Box>
  );
}

function Deeper({ title, blocks }) {
  const { t } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ my: 3, borderRadius: '3px', border: `1px solid ${t.border}`, background: t.surface, overflow: 'hidden' }}>
      <Box component="button" onClick={() => setOpen(!open)} aria-expanded={open}
        sx={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', gap: 1.5, px: 2.25, py: 1.75, '&:hover': { background: t.surface2 }, '&:focus-visible': { outline: `2px solid ${t.accent}`, outlineOffset: -2 } }}>
        <Box sx={{ width: 30, height: 30, borderRadius: '3px', background: t.nerdySoft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <ScienceRounded sx={{ color: t.nerdy, fontSize: 18 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.nerdy }}>Go deeper</Typography>
          <Typography sx={{ fontWeight: 600, lineHeight: 1.3 }}>{title}</Typography>
        </Box>
        <ExpandMoreRounded sx={{ color: t.muted, transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </Box>
      {open && <Box sx={{ px: { xs: 2.25, sm: 3 }, pb: 2, borderTop: `1px solid ${t.border}` }}><Blocks blocks={blocks} /></Box>}
    </Box>
  );
}

function Check({ q, options, answer, explain }) {
  const { t } = useTheme();
  const [picked, setPicked] = useState(null);
  const done = picked !== null;
  return (
    <Box sx={{ my: 4, p: { xs: 2.25, sm: 2.75 }, borderRadius: '3px', background: t.surface, border: `1px solid ${t.border}`, borderTop: `3px solid ${t.sky}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <QuizRounded sx={{ fontSize: 19, color: t.sky }} />
        <Typography sx={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.sky }}>Check yourself</Typography>
      </Box>
      <Typography sx={{ fontWeight: 600, fontSize: '1.08rem', mb: 1.75 }}><Inline text={q} /></Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {options.map((o, i) => {
          const right = i === answer;
          const state = !done ? 'idle' : right ? 'right' : i === picked ? 'wrong' : 'idle';
          const color = { idle: t.border, right: t.easy, wrong: t.warn }[state];
          return (
            <Box key={i} component="button" disabled={done} onClick={() => setPicked(i)}
              sx={{ all: 'unset', cursor: done ? 'default' : 'pointer', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 1.5, px: 1.75, py: 1.25, borderRadius: '3px', border: `1.5px solid ${color}`, transition: 'border-color .2s, background .2s, transform .15s', animation: state === 'right' ? `${pop} .45s ease` : state === 'wrong' ? `${shake} .4s ease` : 'none', ...still, '&:active': done ? {} : { transform: 'scale(.99)' }, background: state === 'right' ? t.easySoft : state === 'wrong' ? t.warnSoft : 'transparent', '&:hover': done ? {} : { borderColor: t.accent }, '&:focus-visible': { outline: `2px solid ${t.accent}` } }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '2px', border: `1.5px solid ${color}`, display: 'grid', placeItems: 'center', fontSize: 12.5, fontWeight: 700, color: state === 'idle' ? t.muted : '#fff', background: state === 'right' ? t.easy : state === 'wrong' ? t.warn : 'transparent', flexShrink: 0, transition: 'all .2s' }}>{state === 'right' ? '✓' : state === 'wrong' ? '✕' : String.fromCharCode(65 + i)}</Box>
              <Typography sx={{ fontSize: 15.5 }}><Inline text={o} /></Typography>
            </Box>
          );
        })}
      </Box>
      {done && (
        <Typography sx={{ mt: 1.75, color: picked === answer ? t.easy : t.warn, fontWeight: 700 }}>
          {picked === answer ? 'Nice, that is right.' : 'Not quite.'} <Box component="span" sx={{ color: 'text.primary', fontWeight: 400 }}><Inline text={explain} /></Box>
        </Typography>
      )}
    </Box>
  );
}

function Recap({ items }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 4, p: { xs: 2.25, sm: 2.75 }, borderRadius: '3px', background: t.grad, color: '#fff' }}>
      <Typography sx={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.9, mb: 1.25 }}>What you learned</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((it, i) => (
          <Reveal key={i} delay={150 + i * 120}>
            <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
              <TaskAltRounded sx={{ fontSize: 20, mt: '3px', flexShrink: 0 }} />
              <Typography sx={{ '& strong': { color: '#fff !important' }, '& svg path': { fill: '#fff' } }}><Inline text={it} /></Typography>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
}

function Table({ head, rows }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 3, borderRadius: '3px', background: t.surface, boxShadow: t.shadow, overflowX: 'auto' }}>
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, minWidth: head.length > 3 ? 560 : 0 }}>
        <thead>
          <tr>{head.map((h, i) => (
            <Box component="th" key={i} sx={{ textAlign: 'left', p: '12px 16px', color: t.muted, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${t.border}` }}>{h}</Box>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (
              <Box component="td" key={j} sx={{ p: '13px 16px', verticalAlign: 'top', borderTop: i ? `1px solid ${t.border}` : 'none', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? t.text : t.text2, lineHeight: 1.55 }}><Inline text={c} /></Box>
            ))}</tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

function Links({ items }) {
  const { t } = useTheme();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, my: 2.5 }}>
      {items.map((l) => (
        <Link key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" underline="none"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.75, borderRadius: '3px', background: t.surface, boxShadow: t.shadow, color: t.text, transition: 'transform .15s', '&:hover': { transform: 'translateY(-2px)' } }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '3px', background: t.accentSoft, color: t.accentText, display: 'grid', placeItems: 'center', flexShrink: 0, fontWeight: 700, fontSize: 17 }}>
            {l.label.charAt(0)}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>{l.label}</Typography>
            {l.note && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{l.note}</Typography>}
          </Box>
          <NorthEastRounded sx={{ fontSize: 18, color: t.muted, flexShrink: 0 }} />
        </Link>
      ))}
    </Box>
  );
}

// A sponsor-style offer card: brand logos, headline, perks, call-to-action buttons and a disclosure line.
function Partner({ eyebrow, title, text, perks = [], ctas = [], note }) {
  const { t } = useTheme();
  return (
    <Box sx={{ my: 3.5, borderRadius: '4px', overflow: 'hidden', background: 'linear-gradient(135deg, #0B1033 0%, #23238F 55%, #5B2BC0 100%)', color: '#fff', position: 'relative', '& strong': { color: '#fff !important' }, '& strong svg path': { fill: '#fff' } }}>
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(90deg, transparent, #000 60%)' }} />
      <Box sx={{ position: 'relative', p: { xs: 2.5, sm: 3.5 } }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B9C2FF' }}>{eyebrow}</Typography>
        <Typography sx={{ fontSize: { xs: 24, sm: 30 }, fontWeight: 800, lineHeight: 1.15, mt: 1, letterSpacing: '-0.01em' }}>{title}</Typography>
        <Typography sx={{ mt: 1.25, color: 'rgba(255,255,255,0.85)', maxWidth: 560 }}><Inline text={text} /></Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${Math.min(perks.length, 3)}, 1fr)` }, gap: 1.25, mt: 2.5 }}>
          {perks.map(([big, small]) => (
            <Box key={big} sx={{ p: 1.75, borderRadius: '3px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{big}</Typography>
              <Typography sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.78)', lineHeight: 1.4 }}>{small}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, mt: 2.75, flexWrap: 'wrap' }}>
          {ctas.map((c, i) => (
            <Button key={c.label} href={c.url} target="_blank" rel="noopener noreferrer sponsored" endIcon={<NorthEastRounded />}
              sx={i === 0 ? { background: '#fff', color: '#16161D', fontWeight: 700, '&:hover': { background: '#fff', filter: 'brightness(0.94)' } } : { color: '#fff', border: '1px solid rgba(255,255,255,0.4)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>
              {c.label}
            </Button>
          ))}
        </Box>
        {note && <Typography sx={{ mt: 2, fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}><Inline text={note} /></Typography>}
      </Box>
    </Box>
  );
}

export default function Blocks({ blocks }) {
  if (!blocks) return null;
  return blocks.map((b, i) => <Reveal key={i}>{block(b, i)}</Reveal>);
}

function block(b, i) {
  {
    switch (b.t) {
      case 'p': return <Typography key={i} sx={{ my: 1.75, color: 'text.primary' }}><Inline text={b.text} /></Typography>;
      case 'h': return <Typography key={i} variant="h5" component="h3" sx={{ mt: 5, mb: 1.25 }}>{b.text}</Typography>;
      case 'steps': return <Steps key={i} items={b.items} />;
      case 'prompt': return <PromptBox key={i} label={b.label} text={b.text} />;
      case 'cmd': return <CmdBox key={i} label={b.label} text={b.text} />;
      case 'tip': return <Tip key={i} tone={b.tone} text={b.text} />;
      case 'table': return <Table key={i} head={b.head} rows={b.rows} />;
      case 'links': return <Links key={i} items={b.items} />;
      case 'partner': return <Partner key={i} {...b} />;
      case 'figure': return <Figure key={i} name={b.name} />;
      case 'snap': return <Snapshot key={i} src={b.src} url={b.url} caption={b.caption} marks={b.marks} />;
      case 'mock': return <Mock key={i} name={b.name} />;
      case 'term': return <TerminalShot key={i} title={b.title} lines={b.lines} caption={b.caption} />;
      case 'why': return <Why key={i} text={b.text} />;
      case 'analogy': return <Analogy key={i} text={b.text} />;
      case 'deeper': return <Deeper key={i} title={b.title} blocks={b.blocks} />;
      case 'check': return <Check key={i} q={b.q} options={b.options} answer={b.answer} explain={b.explain} />;
      case 'recap': return <Recap key={i} items={b.items} />;
      default: return null;
    }
  }
}
