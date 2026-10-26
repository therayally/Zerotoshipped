import { useMemo, useState } from 'react';
import { Box, Button, IconButton, InputBase, LinearProgress, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckRounded from '@mui/icons-material/CheckRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LocalBarRounded from '@mui/icons-material/LocalBarRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VerifiedRounded from '@mui/icons-material/VerifiedRounded';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import NorthEastRounded from '@mui/icons-material/NorthEastRounded';
import { modules, allLessons } from '../content/course';
import { metaFor } from '../content/meta';
import { ModuleTile, ModuleCover, HeroBanner, LogoTile } from './Art';

export const SIDEBAR = 260;
export const RAIL = 300;

const label = { fontSize: 12.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' };

// ───────── logo

// Text wordmark until the TinyAppCode logo files are in /brand.
export function Logo({ size = 22 }) {
  const { t } = useTheme();
  return (
    <Box component="span" aria-label="TinyAppCode" sx={{ display: 'inline-block', fontWeight: 800, fontSize: size, letterSpacing: '-0.02em', lineHeight: 1, color: 'text.primary' }}>
      tinyapp<Box component="span" sx={{ background: t.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>code</Box>
    </Box>
  );
}

// ───────── search

function Search({ go }) {
  const { t } = useTheme();
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return allLessons.filter((l) => l.title.toLowerCase().includes(s) || l.moduleTitle.toLowerCase().includes(s) || JSON.stringify(l.body).toLowerCase().includes(s)).slice(0, 7);
  }, [q]);
  return (
    <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 40 }}>
        <SearchRounded sx={{ color: t.muted, fontSize: 20 }} />
        <InputBase value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all lessons" fullWidth
          inputProps={{ 'aria-label': 'Search lessons' }} onKeyDown={(e) => { if (e.key === 'Escape') setQ(''); if (e.key === 'Enter' && results[0]) { go(results[0].id); setQ(''); } }}
          sx={{ fontSize: 14.5, fontStyle: q ? 'normal' : 'italic' }} />
      </Box>
      {results.length > 0 && (
        <Box sx={{ position: 'absolute', top: 48, right: 0, width: 'min(380px, 92vw)', zIndex: 40, p: 0.75, borderRadius: '3px', background: t.surface, border: `1px solid ${t.border}`, boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
          {results.map((l) => (
            <Box key={l.id} component="button" onClick={() => { go(l.id); setQ(''); }}
              sx={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', boxSizing: 'border-box', p: 1, borderRadius: '2px', '&:hover, &:focus-visible': { background: t.surface2 } }}>
              <ModuleTile moduleId={l.moduleId} size={36} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{l.title}</Typography>
                <Typography sx={{ fontSize: 12.5, color: t.muted }}>{l.moduleTitle}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ───────── top bar

export function TopBar({ section, colorMode, toggleColor, openMenu, go }) {
  const { t } = useTheme();
  const divider = `1px solid ${t.border}`;
  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 30, display: 'grid', gridTemplateColumns: { xs: 'auto 1fr auto', md: `${SIDEBAR}px 1fr auto`, xl: `${SIDEBAR}px 1fr ${RAIL}px` }, alignItems: 'stretch', height: 64, background: t.surface, borderBottom: divider }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1, md: 2.5 }, borderRight: { md: divider } }}>
        <IconButton onClick={openMenu} aria-label="Open modules" sx={{ display: { xs: 'inline-flex', md: 'none' } }}><MenuRounded /></IconButton>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}><Logo /></Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 1, md: 3 }, minWidth: 0 }}>
        <Typography sx={{ ...label, fontSize: 13, color: t.text, display: { xs: 'none', md: 'block' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{section}</Typography>
        <Box sx={{ flex: 1 }} />
        <Tooltip title={colorMode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleColor} aria-label="Toggle light and dark mode" sx={{ border: divider }}>
            {colorMode === 'dark' ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', px: 2.5, borderLeft: divider, minWidth: { md: 220, xl: 0 } }}>
        <Search go={go} />
      </Box>
    </Box>
  );
}

// ───────── left sidebar

function StatusDot({ state }) {
  const { t } = useTheme();
  if (state === 'done') return (
    <Box sx={{ width: 16, height: 16, borderRadius: '3px', background: t.easy, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <CheckRounded sx={{ fontSize: 12, color: '#fff' }} />
    </Box>
  );
  return <Box sx={{ width: 16, height: 16, borderRadius: '3px', border: `2px solid ${state === 'current' ? t.accent : t.border}`, flexShrink: 0 }} />;
}

export function SideNav({ view, currentId, done, go, goHome }) {
  const { t } = useTheme();
  const current = allLessons.find((l) => l.id === currentId);
  const pct = Math.round((done.size / allLessons.length) * 100);
  const [open, setOpen] = useState(null);
  const expanded = open ?? (view === 'lesson' ? current?.moduleId : null);
  let advShown = false;
  const row = (active) => ({ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, py: 0.9, background: active ? t.surface2 : 'transparent', boxShadow: active ? `inset 3px 0 0 ${t.accent}` : 'none', '&:hover': { background: t.surface2 }, '&:focus-visible': { outline: `2px solid ${t.accent}`, outlineOffset: -2 } });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, scrollbarWidth: 'thin' }}>
        <Box component="button" onClick={goHome} sx={{ ...row(view === 'home'), mb: 1.5 }}>
          <HomeRounded sx={{ fontSize: 20, color: view === 'home' ? t.accent : t.muted }} />
          <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>All modules</Typography>
        </Box>
        {modules.map((m, mi) => {
          const ids = m.lessons.map((l) => l.id);
          const count = ids.filter((id) => done.has(id)).length;
          const isOpen = expanded === m.id;
          const showAdv = m.advanced && !advShown;
          if (m.advanced) advShown = true;
          return (
            <Box key={m.id}>
              {(mi === 0 || showAdv) && (
                <Box sx={{ mx: 2.5, mt: mi ? 3 : 0.5, mb: 1, pb: 1, borderBottom: `1px solid ${t.border}` }}>
                  <Typography sx={{ ...label, color: t.muted }}>{showAdv ? 'Advanced' : 'Modules'}</Typography>
                </Box>
              )}
              <Box component="button" onClick={() => setOpen(isOpen ? '' : m.id)} aria-expanded={isOpen} sx={row(isOpen)}>
                <ModuleTile moduleId={m.id} size={22} />
                <Typography sx={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: isOpen ? 700 : 500, color: isOpen ? t.text : t.text2, lineHeight: 1.3 }}>{m.title}</Typography>
                {count === ids.length && <CheckRounded sx={{ fontSize: 16, color: t.easy }} />}
              </Box>
              {isOpen && (
                <Box sx={{ py: 0.5, background: t.surface2 }}>
                  {m.lessons.map((l) => {
                    const cur = view === 'lesson' && l.id === currentId;
                    const state = done.has(l.id) ? 'done' : cur ? 'current' : 'todo';
                    return (
                      <Box key={l.id} component="button" onClick={() => go(l.id)} aria-current={cur ? 'page' : undefined}
                        sx={{ all: 'unset', cursor: 'pointer', boxSizing: 'border-box', width: '100%', display: 'flex', alignItems: 'center', gap: 1.25, pl: 4.25, pr: 2.5, py: 0.8, '&:hover': { background: t.border }, '&:focus-visible': { outline: `2px solid ${t.accent}`, outlineOffset: -2 } }}>
                        <StatusDot state={state} />
                        <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: cur ? 700 : 400, color: cur ? t.text : t.text2, lineHeight: 1.35 }}>{l.title}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${t.border}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: t.text2 }}>Your progress</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: t.accentText }}>{pct}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={pct} sx={{ height: 4, borderRadius: 0, background: t.border, '& .MuiLinearProgress-bar': { background: t.grad } }} />
      </Box>
    </Box>
  );
}

// ───────── right rail

export function RightRail({ items, title = 'Up next', go, openDrink, account, onSignOut, tools }) {
  const { t } = useTheme();
  const head = (text) => (
    <Box sx={{ mb: 1.5, pb: 1, borderBottom: `1px solid ${t.border}` }}><Typography sx={{ ...label, color: t.muted }}>{text}</Typography></Box>
  );
  return (
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      <Box>
        {head(title)}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {items.map((l) => (
            <Box key={l.id} component="button" onClick={() => go(l.id)}
              sx={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, borderRadius: '2px', '&:hover p:first-of-type': { color: t.accentText }, '&:focus-visible': { outline: `2px solid ${t.accent}` } }}>
              <ModuleTile moduleId={l.moduleId} size={40} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.3, color: t.text }}>{l.title}</Typography>
                <Typography sx={{ fontSize: 12.5, color: t.muted }}>{metaFor(l.moduleId).short} · {l.minutes} min</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {tools?.length > 0 && (
        <Box>
          {head('Tools you will use')}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tools.map((ic) => <LogoTile key={ic.title} icon={ic} size={38} />)}
          </Box>
        </Box>
      )}

      <Box sx={{ position: 'relative', overflow: 'hidden', p: 2.5, borderRadius: '3px', background: t.grad, color: '#fff' }}>
        <Box sx={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <Box sx={{ position: 'absolute', right: 30, bottom: -40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <LocalBarRounded sx={{ position: 'relative', fontSize: 28 }} />
        <Typography sx={{ position: 'relative', fontSize: 19, fontWeight: 600, lineHeight: 1.25, mt: 1 }}>Helped you?<br />Buy me a drink.</Typography>
        <Box component="button" onClick={openDrink} sx={{ all: 'unset', cursor: 'pointer', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1.75, fontWeight: 700, fontSize: 14, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}>
          Cheers <NorthEastRounded sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {account && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <VerifiedRounded sx={{ color: account.donated ? t.teal : t.muted }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{account.donated ? 'Supporter, thank you' : 'Signed in'}</Typography>
            <Typography title={account.email} sx={{ fontSize: 12.5, color: t.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.email}</Typography>
          </Box>
          <Button size="small" variant="outlined" onClick={onSignOut}>Sign out</Button>
        </Box>
      )}
    </Box>
  );
}

// ───────── home

export function ModuleCard({ m, mi, done, go }) {
  const { t } = useTheme();
  const ids = m.lessons.map((l) => l.id);
  const count = ids.filter((id) => done.has(id)).length;
  return (
    <Box component="button" onClick={() => go(m.lessons[0].id)}
      sx={{ all: 'unset', cursor: 'pointer', display: 'block', minWidth: 0, '&:hover .cover': { transform: 'translateY(-4px)' }, '&:focus-visible': { outline: `2px solid ${t.accent}`, outlineOffset: 4 } }}>
      <Box className="cover" sx={{ position: 'relative', transition: 'transform .2s' }}>
        <ModuleCover moduleId={m.id} index={mi} />
        {count === ids.length && <Box sx={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: '2px', background: t.easy, display: 'grid', placeItems: 'center' }}><CheckRounded sx={{ fontSize: 17, color: '#fff' }} /></Box>}
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3, mt: 1.25, color: t.text }}>{m.title}</Typography>
      <Typography sx={{ fontSize: 13, color: t.muted, mt: 0.25 }}>{m.lessons.length} {m.lessons.length === 1 ? 'lesson' : 'lessons'} · {count} done</Typography>
    </Box>
  );
}

export function Home({ currentId, done, go, openMenu, openDrink }) {
  const { t } = useTheme();
  const current = allLessons.find((l) => l.id === currentId) || allLessons[0];
  const started = done.size > 0;
  const pct = Math.round((done.size / allLessons.length) * 100);
  const core = modules.map((m, mi) => [m, mi]).filter(([m]) => !m.advanced);
  const adv = modules.map((m, mi) => [m, mi]).filter(([m]) => m.advanced);
  const grid = { display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', sm: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))', xl: 'repeat(5, minmax(0,1fr))' }, columnGap: { xs: 2, md: 3 }, rowGap: { xs: 3, md: 4 } };
  const section = (text, n) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mt: 5, mb: 2.5, pb: 1.25, borderBottom: `1px solid ${t.border}` }}>
      <Typography sx={{ ...label, color: t.text }}>{text}</Typography>
      <Typography sx={{ fontSize: 13, color: t.muted }}>{n} modules</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: { xs: 12, md: 6 } }}>
      <HeroBanner moduleId={current.moduleId} eyebrow={started ? 'Welcome back' : 'Welcome'} title={started ? "Let's keep building." : "Let's build your first app."} height={260}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 }, mt: 2.5, flexWrap: 'wrap' }}>
          <Button onClick={() => go(current.id)} startIcon={<PlayArrowRounded />} sx={{ background: '#fff', color: '#16161D', '&:hover': { background: '#fff', filter: 'brightness(0.95)' } }}>
            {started ? 'Continue' : 'Start lesson 1'}
          </Button>
          <Box sx={{ minWidth: 0, flex: 1, maxWidth: 420 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mt: 0.75 }}>
              <Box sx={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.35)' }}><Box sx={{ width: `${Math.max(pct, 2)}%`, height: '100%', background: '#fff' }} /></Box>
              <Typography sx={{ fontSize: 12.5, opacity: 0.9, whiteSpace: 'nowrap' }}>{done.size}/{allLessons.length}</Typography>
            </Box>
          </Box>
        </Box>
      </HeroBanner>

      {section('Course', core.length)}
      <Box sx={grid}>{core.map(([m, mi]) => <ModuleCard key={m.id} m={m} mi={mi} done={done} go={go} />)}</Box>

      {section('Advanced and final project', adv.length)}
      <Box sx={grid}>{adv.map(([m, mi]) => <ModuleCard key={m.id} m={m} mi={mi} done={done} go={go} />)}</Box>

      <Box sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 25, justifyContent: 'space-around', alignItems: 'center', height: 64, background: t.surface, borderTop: `1px solid ${t.border}` }}>
        {[[HomeRounded, 'Home', () => window.scrollTo({ top: 0, behavior: 'smooth' }), true], [GridViewRounded, 'Modules', openMenu], [PlayArrowRounded, 'Continue', () => go(current.id)], [LocalBarRounded, 'Drink', openDrink]].map(([Icon, text, fn, on]) => (
          <Box key={text} component="button" onClick={fn} sx={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, color: on ? t.accentText : t.muted, fontSize: 11.5, fontWeight: 600, px: 1.5 }}>
            <Icon sx={{ fontSize: 24 }} />{text}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
