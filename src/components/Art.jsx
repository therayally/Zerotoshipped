import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { metaFor } from '../content/meta';
import { Scene } from './Illustrations';
import ModuleIcon from './ModuleIcons';
import { FONT_MONO } from '../theme';

// ───────── official logos (Simple Icons) in their brand color on a white square

function lum(hex) {
  const n = parseInt(hex, 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
}

export function LogoTile({ icon, size = 34, glass }) {
  if (!icon) return null;
  // Very light brand colors are unreadable on white, so they fall back to near-black.
  const color = lum(icon.hex) > 200 ? '#161A2E' : `#${icon.hex}`;
  return (
    <Box title={icon.title} sx={{ width: size, height: size, borderRadius: '2px', background: '#fff', border: glass ? 'none' : '1px solid #E3E6EF', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: glass ? '0 3px 10px rgba(0,0,0,0.18)' : 'none' }}>
      {icon.text ? (
        <Typography sx={{ fontSize: size * 0.26, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{icon.title}</Typography>
      ) : (
        <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} fill={color} /></svg>
      )}
    </Box>
  );
}

// ───────── module artwork: shared gradient + subject illustration

function Backdrop({ moduleId, id, w = 300, h = 300 }) {
  const { g } = metaFor(moduleId);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={g[0]} />
          <stop offset="1" stopColor={g[1]} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.7" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id}-bg)`} />
      <rect width={w} height={h} fill={`url(#${id}-glow)`} />
    </>
  );
}

function Art({ moduleId, id }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ display: 'block' }}>
      <Backdrop moduleId={moduleId} id={id} />
      <Scene moduleId={moduleId} />
    </svg>
  );
}

// Small square with the module's icon (sidebar, search, lists).
export function ModuleTile({ moduleId, size = 34 }) {
  const { g } = metaFor(moduleId);
  return (
    <Box sx={{ width: size, height: size, borderRadius: '3px', background: `linear-gradient(135deg, ${g[0]}, ${g[1]})`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <ModuleIcon moduleId={moduleId} size={Math.round(size * 0.6)} />
    </Box>
  );
}

// Square module cover with its illustration, number and tool logos.
export function ModuleCover({ moduleId, index, logos = true }) {
  const meta = metaFor(moduleId);
  return (
    <Box sx={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: '3px', overflow: 'hidden', boxShadow: '0 10px 24px rgba(22,26,46,0.18)' }}>
      <Art moduleId={moduleId} id={`c-${moduleId}`} />
      {index !== undefined && (
        <Typography sx={{ position: 'absolute', top: 8, left: 12, fontSize: 30, fontWeight: 800, color: '#fff', opacity: 0.95, letterSpacing: '-0.04em' }}>{String(index).padStart(2, '0')}</Typography>
      )}
      {logos && (
        <Box sx={{ position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: 0.75 }}>
          {meta.tools.slice(0, 4).map((ic) => <LogoTile key={ic.title} icon={ic} size={26} glass />)}
        </Box>
      )}
    </Box>
  );
}

// Wide banner: gradient across, illustration on the right, text on the left.
export function HeroBanner({ moduleId, eyebrow, title, children, height = 220 }) {
  const id = `h-${moduleId}`;
  return (
    <Box sx={{ position: 'relative', height: { xs: height * 0.9, sm: height }, overflow: 'hidden', borderRadius: '3px' }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 300 300" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <Backdrop moduleId={moduleId} id={id} />
      </svg>
      <Box sx={{ position: 'absolute', right: { xs: -40, sm: 24 }, top: 0, bottom: 0, aspectRatio: '1 / 1', opacity: { xs: 0.35, sm: 1 } }}>
        <svg width="100%" height="100%" viewBox="0 0 300 300" aria-hidden="true" style={{ display: 'block' }}><Scene moduleId={moduleId} /></svg>
      </Box>
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: { xs: 2.5, sm: 4 }, pr: { sm: `${height + 40}px` }, color: '#fff' }}>
        {eyebrow && <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>{eyebrow}</Typography>}
        <Typography component="h1" sx={{ fontSize: { xs: 28, sm: 38 }, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.025em', mt: 0.5 }}>{title}</Typography>
        {children}
      </Box>
    </Box>
  );
}

// Kept for list thumbnails.
export function LessonCover({ moduleId, height = 140 }) {
  return (
    <Box sx={{ height, borderRadius: '3px', overflow: 'hidden' }}><Art moduleId={moduleId} id={`l-${moduleId}-${height}`} /></Box>
  );
}

// ───────── browser frame for real snapshots and mockups

export function BrowserFrame({ url, children, caption }) {
  const { t } = useTheme();
  return (
    <Box component="figure" sx={{ m: 0, my: 3 }}>
      <Box sx={{ borderRadius: '3px', overflow: 'hidden', background: t.surface, boxShadow: t.shadow, border: `1px solid ${t.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.75, height: 38, background: t.surface2, borderBottom: `1px solid ${t.border}` }}>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
          </Box>
          <Box sx={{ flex: 1, height: 24, borderRadius: '4px', background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', px: 1.25, fontSize: 12.5, color: t.muted, overflow: 'hidden', whiteSpace: 'nowrap' }}>{url}</Box>
        </Box>
        {children}
      </Box>
      {caption && <Typography component="figcaption" variant="body2" sx={{ color: 'text.secondary', mt: 1.25, textAlign: 'center' }}>{caption}</Typography>}
    </Box>
  );
}

export function Snapshot({ src, url, caption }) {
  return (
    <BrowserFrame url={url} caption={caption}>
      <Box component="img" src={src} alt={caption} loading="lazy" sx={{ display: 'block', width: '100%', height: 'auto' }} />
    </BrowserFrame>
  );
}

// ───────── terminal snapshot

export function TerminalShot({ title = 'Terminal', lines, caption }) {
  const colors = { cmd: '#E9EDF3', out: '#A7B0BF', ok: '#4CC38A', accent: '#45C7B8', dim: '#6B7486' };
  return (
    <Box component="figure" sx={{ m: 0, my: 3 }}>
      <Box sx={{ borderRadius: '3px', overflow: 'hidden', background: '#101219', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.75, height: 36, background: '#18181F' }}>
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', background: c }} />)}
          </Box>
          <Typography sx={{ flex: 1, textAlign: 'center', fontSize: 12.5, color: '#8790A0', mr: 5 }}>{title}</Typography>
        </Box>
        <Box component="pre" sx={{ m: 0, p: 2.25, fontFamily: FONT_MONO, fontSize: 13.5, lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {lines.map(([kind, text], i) => (
            <Box key={i} component="span" sx={{ display: 'block', color: colors[kind] || colors.out }}>
              {kind === 'cmd' && <Box component="span" sx={{ color: colors.accent, mr: 1 }}>$</Box>}{text}
            </Box>
          ))}
        </Box>
      </Box>
      {caption && <Typography component="figcaption" variant="body2" sx={{ color: 'text.secondary', mt: 1.25, textAlign: 'center' }}>{caption}</Typography>}
    </Box>
  );
}

// ───────── clean mockups (example data only, nothing real)

function Field({ label, value, focus }) {
  const { t } = useTheme();
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: t.text2, mb: 0.5 }}>{label}</Typography>
      <Box sx={{ height: 36, borderRadius: '8px', border: `1.5px solid ${focus ? t.accent : t.border}`, display: 'flex', alignItems: 'center', px: 1.25, fontSize: 13.5, color: t.text }}>{value}</Box>
    </Box>
  );
}

function Btn({ children, tone = 'primary', small }) {
  const { t } = useTheme();
  const bg = tone === 'primary' ? t.accent : t.surface;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: small ? 28 : 36, px: small ? 1.25 : 2, borderRadius: '8px', background: bg, color: tone === 'primary' ? '#fff' : t.text, border: tone === 'primary' ? 'none' : `1px solid ${t.border}`, fontSize: small ? 12 : 13.5, fontWeight: 600 }}>{children}</Box>
  );
}

function Row({ cells, head, widths }) {
  const { t } = useTheme();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: widths, gap: 1, alignItems: 'center', px: 1.5, py: 1.1, borderBottom: `1px solid ${t.border}`, fontSize: head ? 11.5 : 13, fontWeight: head ? 600 : 400, color: head ? t.muted : t.text, textTransform: head ? 'uppercase' : 'none', letterSpacing: head ? '0.04em' : 0, fontFamily: head ? undefined : FONT_MONO }}>
      {cells.map((c, i) => <Box key={i} sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</Box>)}
    </Box>
  );
}

const mocks = {
  github: () => (
    <BrowserFrame url="github.com/signup" caption="GitHub sign-up (illustration with example data)">
      <Box sx={{ p: { xs: 2.5, sm: 4 }, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4, alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>Create your free account</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Explore GitHub's core features for individuals and organizations.</Typography>
        </Box>
        <Box>
          <Field label="Email" value="you@example.com" focus />
          <Field label="Password" value="••••••••••••••" />
          <Field label="Username" value="your-name" />
          <Btn>Continue</Btn>
        </Box>
      </Box>
    </BrowserFrame>
  ),
  neon: () => (
    <BrowserFrame url="vercel.com/dashboard/stores" caption="Vercel → Storage → Create Database (illustration)">
      <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>Create a database</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          {[['Neon', 'Serverless Postgres', true], ['Other database', 'Not needed for this course', false]].map(([n, d, on]) => (
            <Box key={n} sx={(th) => ({ p: 2, borderRadius: '12px', border: `2px solid ${on ? th.t.accent : th.t.border}`, background: on ? th.t.accentSoft : 'transparent', opacity: on ? 1 : 0.55 })}>
              <Typography sx={{ fontWeight: 700 }}>{n}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{d}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 2.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}><Btn tone="plain">Cancel</Btn><Btn>Continue</Btn></Box>
      </Box>
    </BrowserFrame>
  ),
  localhost: () => (
    <BrowserFrame url="localhost:3000" caption="Your app running on your own computer">
      <Box sx={{ px: { xs: 3, sm: 6 }, py: { xs: 5, sm: 7 }, textAlign: 'center', background: 'linear-gradient(180deg, rgba(47,178,163,0.08), transparent)' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase' }}>My App</Typography>
        <Typography sx={{ fontSize: { xs: 26, sm: 34 }, fontWeight: 700, mt: 1, lineHeight: 1.15 }}>It works. Let's build something.</Typography>
        <Box sx={{ mt: 3 }}><Btn>Get started</Btn></Box>
      </Box>
    </BrowserFrame>
  ),
  'vercel-import': () => (
    <BrowserFrame url="vercel.com/new" caption="Import your GitHub repo into Vercel (illustration)">
      <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>Import Git Repository</Typography>
        {[['my-app', 'just now', true], ['old-project', '3 months ago', false]].map(([n, w, on]) => (
          <Box key={n} sx={(th) => ({ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, borderBottom: `1px solid ${th.t.border}` })}>
            <Box sx={(th) => ({ width: 28, height: 28, borderRadius: '8px', background: th.t.surface2, border: `1px solid ${th.t.border}` })} />
            <Typography sx={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>{n} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: 13 }}>· {w}</Box></Typography>
            <Btn small tone={on ? 'primary' : 'plain'}>Import</Btn>
          </Box>
        ))}
      </Box>
    </BrowserFrame>
  ),
  dns: () => (
    <BrowserFrame url="dash.cloudflare.com · example.com · DNS" caption="Cloudflare DNS pointing at Vercel (example values; use the ones Vercel shows you)">
      <Box sx={{ p: { xs: 1.5, sm: 2.5 }, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 520 }}>
          <Row head widths="70px 90px 1fr 110px" cells={['Type', 'Name', 'Content', 'Proxy']} />
          <Row widths="70px 90px 1fr 110px" cells={['A', '@', '76.76.21.21', '● DNS only']} />
          <Row widths="70px 90px 1fr 110px" cells={['CNAME', 'www', 'cname.vercel-dns.com', '● DNS only']} />
        </Box>
      </Box>
    </BrowserFrame>
  ),
  'resend-dns': () => (
    <BrowserFrame url="resend.com/domains/example.com" caption="Resend domain records, all verified (example domain)">
      <Box sx={{ p: { xs: 1.5, sm: 2.5 }, overflowX: 'auto' }}>
        <Box sx={{ minWidth: 560 }}>
          <Row head widths="60px 150px 1fr 90px" cells={['Type', 'Name', 'Value', 'Status']} />
          <Row widths="60px 150px 1fr 90px" cells={['MX', 'send', 'feedback-smtp.…amazonses.com', '✓ Verified']} />
          <Row widths="60px 150px 1fr 90px" cells={['TXT', 'send', 'v=spf1 include:amazonses.com ~all', '✓ Verified']} />
          <Row widths="60px 150px 1fr 90px" cells={['TXT', 'resend._domainkey', 'p=MIGfMA0GCSq…', '✓ Verified']} />
          <Row widths="60px 150px 1fr 90px" cells={['TXT', '_dmarc', 'v=DMARC1; p=none;', '✓ Verified']} />
        </Box>
      </Box>
    </BrowserFrame>
  ),
};

export function Mock({ name }) {
  const M = mocks[name];
  return M ? <M /> : null;
}
