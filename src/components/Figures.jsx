import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { FONT_BODY, FONT_MONO } from '../theme';
import { useInView } from './Blocks';
import { logo } from '../content/logos';

// Diagram kit: 640-wide viewBox, crisp corners, official logos, labels with their own background.

function lum(hex) {
  const n = parseInt(hex, 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
}

function Logo({ k, x, y, size = 26 }) {
  const icon = logo(k);
  if (!icon) return null;
  const color = lum(icon.hex) > 200 ? '#161A2E' : `#${icon.hex}`;
  const s = size * 0.62;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx="2" fill="#fff" stroke="#E3E6EF" />
      {icon.text
        ? <text x={x + size / 2} y={y + size / 2 + 3} textAnchor="middle" fontSize="7.5" fontWeight="800" fill={color} fontFamily={FONT_BODY}>{icon.title}</text>
        : <path d={icon.path} fill={color} transform={`translate(${x + (size - s) / 2} ${y + (size - s) / 2}) scale(${s / 24})`} />}
    </g>
  );
}

// Simple glyphs for things that have no brand logo.
const GLYPHS = {
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0Z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z',
  tools: 'M14 7a4 4 0 0 1-5 5l-5 5 3 3 5-5a4 4 0 0 0 5-5l-2 2-3-3Z',
  result: 'M5 13l4 4L19 7',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2',
  app: 'M3 5h18v14H3Zm0 4h18',
  lock: 'M6 11h12v9H6Zm2 0V8a4 4 0 0 1 8 0v3',
};

function Glyph({ g, x, y, size = 26, color }) {
  const s = size * 0.62;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} rx="2" fill={color} />
      <path d={GLYPHS[g]} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${x + (size - s) / 2} ${y + (size - s) / 2}) scale(${s / 24})`} />
    </g>
  );
}

function Node({ x, y, w = 140, h = 58, title, sub, k, g, tone = 'accent', mono }) {
  const { t } = useTheme();
  const bar = { accent: t.accent, teal: t.teal, sky: t.sky, coral: t.coral, plain: t.muted }[tone];
  const hasIcon = k || g;
  const tx = hasIcon ? x + 46 : x + w / 2;
  const anchor = hasIcon ? 'start' : 'middle';
  return (
    <g className="fig-node" style={{ transitionDelay: `${Math.round(x * 1.3 + y * 0.6)}ms` }}>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={t.surface} stroke={t.border} />
      <rect x={x} y={y} width="4" height={h} fill={bar} />
      {k && <Logo k={k} x={x + 12} y={y + (h - 26) / 2} />}
      {g && <Glyph g={g} x={x + 12} y={y + (h - 26) / 2} color={bar} />}
      <text x={tx} y={sub ? y + h / 2 - 3 : y + h / 2 + 5} textAnchor={anchor} fontSize="14.5" fontWeight="700" fill={t.text} fontFamily={mono ? FONT_MONO : FONT_BODY}>{title}</text>
      {sub && <text x={tx} y={y + h / 2 + 15} textAnchor={anchor} fontSize="11.5" fill={t.muted} fontFamily={FONT_BODY}>{sub}</text>}
    </g>
  );
}

function Arrow({ d, dashed }) {
  const { t } = useTheme();
  return <path className={dashed ? 'fig-flow' : 'fig-arrow'} pathLength={dashed ? undefined : 1} d={d} fill="none" stroke={t.muted} strokeWidth="1.6" strokeDasharray={dashed ? '5 5' : undefined} markerEnd="url(#arr)" />;
}

// A label with its own background so lines never run through the text.
function Label({ x, y, text }) {
  const { t } = useTheme();
  const w = text.length * 6.1 + 12;
  return (
    <g className="fig-label">
      <rect x={x - w / 2} y={y - 11} width={w} height="17" rx="2" fill={t.surface2} />
      <text x={x} y={y + 1.5} textAnchor="middle" fontSize="11" fontWeight="600" fill={t.text2} fontFamily={FONT_BODY}>{text}</text>
    </g>
  );
}

const flow = keyframes`to { stroke-dashoffset: -20; }`;
const pulse = keyframes`0%, 100% { stroke-opacity: 1; } 50% { stroke-opacity: 0.35; }`;

// Diagrams build themselves when scrolled into view: boxes fade up left to right, then arrows draw, then labels.
const motion = {
  '& .fig-node': { opacity: 0, transform: 'translateY(10px)', transition: 'opacity .5s ease, transform .5s cubic-bezier(.2,.7,.2,1)' },
  '& .fig-arrow': { strokeDasharray: 1, strokeDashoffset: 1, transition: 'stroke-dashoffset .7s ease .75s' },
  '& .fig-label, & .fig-flow': { opacity: 0, transition: 'opacity .4s ease 1.2s' },
  '& .fig-pulse': { animation: `${pulse} 1.8s ease-in-out infinite` },
  '&.in .fig-node': { opacity: 1, transform: 'none' },
  '&.in .fig-arrow': { strokeDashoffset: 0 },
  '&.in .fig-label, &.in .fig-flow': { opacity: 1 },
  '&.in .fig-flow': { animation: `${flow} 1s linear infinite` },
  '@media (prefers-reduced-motion: reduce)': {
    '& .fig-node, & .fig-label, & .fig-flow': { opacity: 1, transform: 'none', transition: 'none' },
    '& .fig-arrow': { strokeDashoffset: 0, transition: 'none' },
    '& .fig-pulse, &.in .fig-flow': { animation: 'none' },
  },
};

function Frame({ h, children, caption }) {
  const { t } = useTheme();
  const [ref, seen] = useInView();
  return (
    <Box ref={ref} className={seen ? 'in' : ''} sx={{ my: 3, p: { xs: 1.5, sm: 2.5 }, borderRadius: '3px', background: t.surface2, border: `1px solid ${t.border}`, ...motion }}>
      <Box sx={{ overflowX: 'auto', mx: { xs: -1.5, sm: 0 }, px: { xs: 1.5, sm: 0 } }}>
        <svg viewBox={`0 0 640 ${h}`} width="100%" role="img" aria-label={caption} style={{ display: 'block', minWidth: 540 }}>
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={t.muted} />
            </marker>
          </defs>
          {children}
        </svg>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5, textAlign: 'center' }}>{caption}</Typography>
    </Box>
  );
}

function Stack() {
  const { t } = useTheme();
  return (
    <Frame h={300} caption="How the pieces of your app connect">
      <Node x={345} y={14} w={150} title="Cloudflare" sub="your .com" k="cloudflare" tone="coral" />
      <Node x={10} y={126} w={140} title="You" sub="+ Claude Code" k="claude" />
      <Node x={186} y={126} w={124} title="GitHub" sub="saves code" k="github" tone="plain" />
      <Node x={345} y={126} w={150} title="Vercel" sub="runs your app" k="vercel" tone="sky" />
      <Node x={530} y={126} w={100} title="Users" sub="phones" g="person" tone="teal" />
      <Node x={300} y={232} w={130} title="Neon" sub="database" k="neon" tone="teal" />
      <Node x={460} y={232} w={130} title="Stripe" sub="payments" k="stripe" tone="accent" />
      <Arrow d="M150 155 L182 155" />
      <Label x={168} y={140} text="push" />
      <Arrow d="M310 155 L341 155" />
      <Label x={327} y={140} text="deploy" />
      <Arrow d="M530 155 L499 155" />
      <Arrow d="M420 72 L420 122" dashed />
      <Arrow d="M395 184 L370 228" />
      <Arrow d="M450 184 L515 228" />
      <Glyph g="lock" x={10} y={240} size={24} color={t.coral} />
      <text x={44} y={250} fontSize="12" fontWeight="700" fill={t.text} fontFamily={FONT_BODY}>Secret keys live only</text>
      <text x={44} y={266} fontSize="12" fill={t.muted} fontFamily={FONT_BODY}>on the server, never in the browser</text>
    </Frame>
  );
}

function Sprint() {
  const { t } = useTheme();
  const cx = 320, cy = 160, r = 112;
  const steps = [
    ['Backlog', 'list of wants', -90, 'plain'],
    ['Plan', 'pick a few', -18, 'sky'],
    ['Build', 'one week', 54, 'accent'],
    ['Review', 'show it works', 126, 'teal'],
    ['Retro', 'get better', 198, 'coral'],
  ];
  return (
    <Frame h={320} caption="One sprint, over and over">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.border} strokeWidth="2" strokeDasharray="6 6" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="700" fill={t.text} fontFamily={FONT_BODY}>1 sprint</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="12" fill={t.muted} fontFamily={FONT_BODY}>about 1 week</text>
      {steps.map(([title, sub, deg, tone]) => {
        const a = (deg * Math.PI) / 180;
        return <Node key={title} x={cx + r * Math.cos(a) - 64} y={cy + r * Math.sin(a) - 27} w={128} h={54} title={title} sub={sub} tone={tone} />;
      })}
    </Frame>
  );
}

function Dns() {
  return (
    <Frame h={140} caption="Your web address points at your app">
      <Node x={10} y={52} w={160} title="mycoolapp.com" sub="typed by a visitor" g="globe" tone="teal" />
      <Node x={245} y={52} w={160} title="Cloudflare" sub="DNS only (grey)" k="cloudflare" tone="coral" />
      <Node x={480} y={52} w={150} title="Vercel" sub="serves the app" k="vercel" tone="sky" />
      <Arrow d="M170 81 L241 81" />
      <Label x={207} y={30} text="where is it?" />
      <Arrow d="M405 81 L476 81" />
      <Label x={442} y={30} text="A + CNAME" />
    </Frame>
  );
}

function Keys() {
  const { t } = useTheme();
  return (
    <Frame h={260} caption="Secrets stay on the server side of the line">
      <rect x="10" y="10" width="295" height="240" rx="3" fill={t.tealSoft} />
      <rect x="335" y="10" width="295" height="240" rx="3" fill={t.coralSoft} />
      <text x="157" y="38" textAnchor="middle" fontSize="12.5" fontWeight="800" letterSpacing="1" fill={t.teal} fontFamily={FONT_BODY}>SERVER (PRIVATE)</text>
      <text x="482" y="38" textAnchor="middle" fontSize="12.5" fontWeight="800" letterSpacing="1" fill={t.coral} fontFamily={FONT_BODY}>BROWSER (PUBLIC)</text>
      <Node x={30} y={58} w={255} h={50} title="DATABASE_URL" k="neon" tone="teal" mono />
      <Node x={30} y={120} w={255} h={50} title="STRIPE_SECRET_KEY" k="stripe" tone="teal" mono />
      <Node x={30} y={182} w={255} h={50} title="ANTHROPIC_API_KEY" k="anthropic" tone="teal" mono />
      <Node x={355} y={58} w={255} h={50} title="NEXT_PUBLIC_…" sub="public values only" g="globe" tone="coral" mono />
      <Node x={355} y={120} w={255} h={50} title="pk_… (Stripe)" sub="publishable key" k="stripe" tone="coral" mono />
      <line x1="320" y1="14" x2="320" y2="246" stroke={t.muted} strokeWidth="1.5" strokeDasharray="4 5" />
    </Frame>
  );
}

function Agent() {
  return (
    <Frame h={300} caption="An agent thinks, acts, looks at the result, and repeats">
      <Node x={240} y={14} w={160} title="Brain" sub="the AI model" k="claude" tone="accent" />
      <Node x={470} y={121} w={160} title="Hands" sub="files, web, apps" g="tools" tone="sky" />
      <Node x={240} y={228} w={160} title="Result" sub="what happened?" g="result" tone="teal" />
      <Node x={10} y={121} w={160} title="Memory" sub="notes + schedule" g="clock" tone="coral" />
      <Arrow d="M400 43 C 470 50, 540 80, 550 117" />
      <Label x={520} y={66} text="do this" />
      <Arrow d="M550 179 C 540 215, 470 250, 404 257" />
      <Arrow d="M240 257 C 170 250, 100 215, 90 183" />
      <Arrow d="M90 117 C 100 80, 170 50, 236 43" />
      <Label x={120} y={66} text="remember" />
    </Frame>
  );
}

function Tenants() {
  const { t } = useTheme();
  return (
    <Frame h={270} caption="Every company's data stays in its own box">
      <Node x={240} y={10} w={160} h={54} title="Your app" sub="checks who you are" g="app" tone="accent" />
      {[['Company A', 10], ['Company B', 230], ['Company C', 450]].map(([name, x]) => (
        <g key={name}>
          <rect x={x} y={112} width="180" height="148" rx="3" fill={t.surface} stroke={t.border} />
          <text x={x + 16} y={138} fontSize="13.5" fontWeight="800" fill={t.text} fontFamily={FONT_BODY}>{name}</text>
          <Node x={x + 12} y={152} w={156} h={44} title="users + roles" g="person" tone="sky" />
          <Node x={x + 12} y={204} w={156} h={44} title="data + files" k="postgres" tone="teal" />
          <Arrow d={`M320 64 L${x + 90} 108`} />
        </g>
      ))}
      {[205, 425].map((x) => <text key={x} x={x} y={192} textAnchor="middle" fontSize="20" fontWeight="700" fill={t.coral} fontFamily={FONT_BODY}>×</text>)}
    </Frame>
  );
}

function Spacing() {
  const { t } = useTheme();
  const steps = [4, 8, 12, 16, 24, 32, 48, 64];
  let x = 20;
  return (
    <Frame h={230} caption="Use only these spacing sizes. Repeating gaps is what makes a page feel calm.">
      {steps.map((n) => {
        const w = n * 1.25;
        const el = (
          <g key={n}>
            <rect x={x} y={150 - w} width={w} height={w} rx="1" fill={t.accentSoft} stroke={t.accent} strokeWidth="1" />
            <text x={x + w / 2} y={176} textAnchor="middle" fontSize="13" fontWeight="700" fill={t.text} fontFamily={FONT_BODY}>{n}</text>
          </g>
        );
        x += w + 12;
        return el;
      })}
      <text x={20} y={204} fontSize="12.5" fill={t.muted} fontFamily={FONT_BODY}>pixels</text>
      <rect x={430} y={30} width={190} height={120} rx={3} fill={t.surface} stroke={t.border} />
      <rect x={446} y={46} width={100} height={10} rx={2} fill={t.text} opacity={0.85} />
      <rect x={446} y={68} width={158} height={8} rx={2} fill={t.muted} opacity={0.45} />
      <rect x={446} y={84} width={130} height={8} rx={2} fill={t.muted} opacity={0.45} />
      <rect x={446} y={106} width={70} height={28} rx={3} fill={t.accent} />
      <rect x={524} y={106} width={70} height={28} rx={3} fill={t.surface} stroke={t.border} />
      <text x={525} y={176} textAnchor="middle" fontSize="12" fill={t.muted} fontFamily={FONT_BODY}>16 px padding, 8 and 12 px gaps,</text>
      <text x={525} y={192} textAnchor="middle" fontSize="12" fill={t.muted} fontFamily={FONT_BODY}>buttons the same height</text>
    </Frame>
  );
}

function Relay() {
  return (
    <Frame h={280} caption="The owner's computer only reaches out. Nothing on the internet can reach in.">
      <Node x={10} y={20} w={140} title="Customer" sub="types in chat" g="person" tone="teal" />
      <Node x={245} y={20} w={150} title="Your website" sub="on Vercel" k="vercel" tone="sky" />
      <Node x={490} y={20} w={140} title="Queue" sub="in Postgres" k="postgres" tone="plain" />
      <Node x={245} y={196} w={150} title="Relay" sub="owner's computer" g="app" tone="accent" />
      <Node x={10} y={196} w={140} title="AI" sub="Claude or Qwen" k="claude" tone="accent" />
      <Node x={490} y={196} w={140} title="Owner's phone" sub="via Telegram" k="telegram" tone="coral" />
      <Arrow d="M150 49 L241 49" />
      <Label x={196} y={34} text="question" />
      <Arrow d="M395 49 L486 49" />
      <Arrow d="M320 192 L320 82" />
      <Label x={320} y={138} text="checks every few seconds, outbound only" />
      <Arrow d="M245 225 L154 225" />
      <Label x={198} y={268} text="draft answer" />
      <Arrow d="M395 225 L486 225" />
      <Label x={440} y={268} text="hard question" />
    </Frame>
  );
}

// The whole stack, one job per box. Pass `hl` to spotlight one piece ("Where Vercel fits").
const PIECES = {
  you: { x: 10, y: 130, w: 130, title: 'You', sub: '+ Claude', k: 'claude' },
  github: { x: 170, y: 130, w: 130, title: 'GitHub', sub: 'saves your code', k: 'github', tone: 'plain' },
  vercel: { x: 330, y: 130, w: 140, title: 'Vercel', sub: 'runs your app', k: 'vercel', tone: 'sky' },
  users: { x: 500, y: 130, w: 130, title: 'Visitors', sub: 'phones, laptops', g: 'person', tone: 'teal' },
  cloudflare: { x: 330, y: 20, w: 140, title: 'Cloudflare', sub: 'your .com address', k: 'cloudflare', tone: 'coral' },
  neon: { x: 190, y: 250, w: 135, title: 'Neon', sub: 'remembers data', k: 'neon', tone: 'teal' },
  resend: { x: 340, y: 250, w: 135, title: 'Resend', sub: 'sends email', k: 'resend' },
  stripe: { x: 490, y: 250, w: 140, title: 'Stripe', sub: 'takes payments', k: 'stripe' },
};
const NAMES = { github: 'GitHub', vercel: 'Vercel', neon: 'Neon', cloudflare: 'Cloudflare', resend: 'Resend', stripe: 'Stripe' };

function BigPicture({ hl }) {
  const { t } = useTheme();
  const dim = (k) => (hl && hl !== k && k !== 'you' && k !== 'users' ? 0.3 : 1);
  return (
    <Frame h={320} caption={hl ? `Where ${NAMES[hl]} fits in your app` : 'Every piece of your app, and the one job each piece does'}>
      {Object.entries(PIECES).map(([k, p]) => (
        <g key={k} opacity={dim(k)}>
          <Node {...p} />
          {hl === k && <rect className="fig-pulse" x={p.x - 3} y={p.y - 3} width={p.w + 6} height={64} rx="4" fill="none" stroke={t.accent} strokeWidth="2.5" />}
        </g>
      ))}
      <Arrow d="M140 159 L166 159" />
      <Label x={153} y={118} text="save" />
      <Arrow d="M300 159 L326 159" />
      <Label x={313} y={204} text="auto-deploy" />
      <Arrow d="M500 159 L474 159" />
      <Label x={487} y={118} text="visit" />
      <Arrow d="M400 78 L400 126" dashed />
      <Label x={448} y={104} text="points to" />
      <Arrow d="M372 188 L270 246" />
      <Arrow d="M400 188 L405 246" />
      <Arrow d="M430 188 L555 246" />
    </Frame>
  );
}

// Git branches: main stays safe while a feature is built on its own line, previewed, then merged.
function Branches() {
  const { t } = useTheme();
  const dot = (x, y, c) => <g className="fig-node" style={{ transitionDelay: `${x * 1.6}ms` }}><circle cx={x} cy={y} r="9" fill={c} stroke={t.surface} strokeWidth="3" /></g>;
  return (
    <Frame h={210} caption="Build on a branch, preview it, then merge it into main">
      <path className="fig-arrow" pathLength={1} d="M30 150 H610" stroke={t.accent} strokeWidth="4" fill="none" />
      <path className="fig-arrow" pathLength={1} d="M170 150 C210 150 210 70 250 70 H440 C480 70 480 150 520 150" stroke={t.teal} strokeWidth="4" fill="none" />
      {[70, 170, 520, 600].map((x) => <g key={x}>{dot(x, 150, t.accent)}</g>)}
      {[290, 360, 430].map((x) => <g key={x}>{dot(x, 70, t.teal)}</g>)}
      <text x="30" y="185" fontSize="13" fontWeight="700" fill={t.accent} fontFamily={FONT_BODY}>main: the live app</text>
      <text x="250" y="40" fontSize="13" fontWeight="700" fill={t.teal} fontFamily={FONT_BODY}>branch: add-dark-mode</text>
      <Label x={360} y={104} text="Vercel preview link" />
      <Label x={520} y={118} text="merge (pull request)" />
      <Label x={360} y={185} text="each dot = a commit (a save point)" />
    </Frame>
  );
}

// Subscriptions: checkout happens on the payment company's page; only a signed webhook changes the plan.
function Subscription() {
  return (
    <Frame h={250} caption="How a subscription stays honest: only a signed message from Stripe or Square changes someone's plan">
      <Node x={10} y={20} w={135} title="Customer" sub="clicks Upgrade" g="person" tone="teal" />
      <Node x={175} y={20} w={135} title="Your server" sub="makes checkout" k="vercel" tone="sky" />
      <Node x={340} y={20} w={135} title="Checkout" sub="Stripe or Square" k="stripe" />
      <Node x={505} y={20} w={125} title="Card charged" sub="every month" g="clock" tone="coral" />
      <Node x={340} y={170} w={135} title="Webhook" sub="signed: paid" g="lock" tone="coral" />
      <Node x={175} y={170} w={135} title="Neon" sub="plan = active" k="neon" tone="teal" />
      <Node x={10} y={170} w={135} title="Your app" sub="checks on launch" g="app" />
      <Arrow d="M145 49 L171 49" />
      <Arrow d="M310 49 L336 49" />
      <Arrow d="M475 49 L501 49" />
      <Arrow d="M567 78 L470 166" />
      <Label x={540} y={130} text="each payment or cancel" />
      <Arrow d="M340 199 L314 199" />
      <Label x={327} y={238} text="verify, then save" />
      <Arrow d="M175 199 L149 199" />
    </Frame>
  );
}

// VRAM: a model that fits on the GPU runs fast; the part that spills into RAM drags every word.
function Vram() {
  const { t } = useTheme();
  const block = (x, y, w, fill, key) => <g key={key} className="fig-node" style={{ transitionDelay: `${x * 2}ms` }}><rect x={x} y={y} width={w} height={22} rx="2" fill={fill} /></g>;
  const row = (y, title, sub, fits) => (
    <g>
      <text x="10" y={y + 4} fontSize="13.5" fontWeight="700" fill={t.text} fontFamily={FONT_BODY}>{title}</text>
      <text x="10" y={y + 21} fontSize="11.5" fill={t.muted} fontFamily={FONT_BODY}>{sub}</text>
      <rect x="190" y={y - 14} width="250" height="46" rx="3" fill="none" stroke={t.accent} strokeWidth="2" />
      <text x="198" y={y - 19} fontSize="11" fontWeight="700" fill={t.accentText} fontFamily={FONT_BODY}>GPU VRAM (fast)</text>
      <rect x="470" y={y - 14} width="160" height="46" rx="3" fill="none" stroke={t.border} strokeWidth="2" strokeDasharray="4 4" />
      <text x="478" y={y - 19} fontSize="11" fontWeight="700" fill={t.muted} fontFamily={FONT_BODY}>RAM + CPU (slow)</text>
      {[0, 1, 2, 3, 4].map((i) => block(198 + i * 46, y - 2, 40, t.teal, `a${i}`))}
      {!fits && [0, 1, 2].map((i) => block(478 + i * 50, y - 2, 44, t.coral, `b${i}`))}
    </g>
  );
  return (
    <Frame h={250} caption="If the whole model fits in VRAM it runs fast. Any part that spills into RAM slows down every single word.">
      {row(50, 'Model fits', '8B model on an 8 GB GPU', true)}
      {row(160, 'Model spills over', '32B model on an 8 GB GPU', false)}
      <Label x={335} y={102} text="fast: faster than you can read" />
      <Label x={335} y={212} text="slow: a few words a second" />
    </Frame>
  );
}

const figures = { vram: Vram, subscription: Subscription, bigpicture: () => <BigPicture />, branches: Branches, spacing: Spacing, relay: Relay, stack: Stack, sprint: Sprint, dns: Dns, keys: Keys, agent: Agent, tenants: Tenants };

export default function Figure({ name }) {
  if (name.startsWith('fit-')) return <BigPicture hl={name.slice(4)} />;
  const F = figures[name];
  return F ? <F /> : null;
}
