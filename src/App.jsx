import { useEffect, useMemo, useState } from 'react';
import { Box, CssBaseline, Drawer, Snackbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { makeTheme } from './theme';
import { allLessons } from './content/course';
import { TopBar, SideNav, Home, RightRail, SIDEBAR, RAIL } from './components/Panels';
import { modules } from './content/course';
import { metaFor } from './content/meta';
import Lesson from './components/Lesson';
import { TermsGate, DonateDialog, TERMS_VERSION } from './components/Gates';
import { getAccount, refreshAccount, signOut } from './account';

// Browser storage is a convenience only: every read and write is guarded.
const store = {
  get(k, fallback) { try { const v = localStorage.getItem('zts.' + k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem('zts.' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const session = {
  get(k) { try { return sessionStorage.getItem('zts.' + k); } catch { return null; } },
  set(k) { try { sessionStorage.setItem('zts.' + k, '1'); } catch { /* storage unavailable */ } },
};

function idFromHash() {
  const id = window.location.hash.replace(/^#\/?/, '');
  return allLessons.some((l) => l.id === id) ? id : null;
}


function systemDark() {
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch { return false; }
}

export default function App() {
  const [colorMode, setColorMode] = useState(() => store.get('theme', systemDark() ? 'dark' : 'light'));
  const [done, setDone] = useState(() => new Set(store.get('done', [])));
  const [currentId, setCurrentId] = useState(() => idFromHash() || store.get('last', allLessons[0].id));
  const [view, setView] = useState(() => (idFromHash() ? 'lesson' : 'home'));
  // Dev only: ?demo skips the terms and drink pop-ups (used for marketing screenshots).
  const demo = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo');
  const [termsOk, setTermsOk] = useState(() => demo || store.get('terms', null) === TERMS_VERSION);
  const [drinkOpen, setDrinkOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [splash, setSplash] = useState(() => !session.get('splashSeen'));
  const [splashFade, setSplashFade] = useState(false);

  const [account, setAccount] = useState(() => getAccount());
  const theme = useMemo(() => makeTheme(colorMode), [colorMode]);
  const index = allLessons.findIndex((l) => l.id === currentId);
  const lesson = allLessons[index];

  useEffect(() => { refreshAccount().then(setAccount); }, []);

  // Brand splash once per launch, then fade out.
  useEffect(() => {
    if (!splash) return undefined;
    session.set('splashSeen');
    const fade = setTimeout(() => setSplashFade(true), 1300);
    const done = setTimeout(() => setSplash(false), 1800);
    return () => { clearTimeout(fade); clearTimeout(done); };
  }, [splash]);

  // Show the donation window once per launch until the server has a donation recorded for this account.
  useEffect(() => {
    if (termsOk && !splash && !demo && !account?.donated && !session.get('drinkSeen')) {
      session.set('drinkSeen');
      const id = setTimeout(() => setDrinkOpen(true), 400);
      return () => clearTimeout(id);
    }
  }, [termsOk, splash, demo, account?.donated]);

  useEffect(() => {
    const onHash = () => { const id = idFromHash(); if (id) { setCurrentId(id); setView('lesson'); } else setView('home'); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    store.set('last', currentId);
    const hash = view === 'home' ? '#/' : '#/' + currentId;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
    document.title = view === 'home' ? 'Zero to Shipped' : `${lesson.title} · Zero to Shipped`;
  }, [currentId, lesson.title, view]);

  useEffect(() => {
    document.documentElement.style.colorScheme = colorMode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colorMode === 'dark' ? '#0D1117' : '#F3F4F7');
  }, [colorMode]);

  const go = (id) => {
    setCurrentId(id);
    setView('lesson');
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const toggleColor = () => { const m = colorMode === 'dark' ? 'light' : 'dark'; setColorMode(m); store.set('theme', m); };
  const markDone = (id) => setDone((prev) => { const n = new Set(prev); n.add(id); store.set('done', [...n]); return n; });

  const onNext = () => {
    markDone(lesson.id);
    if (index < allLessons.length - 1) go(allLessons[index + 1].id);
    else setToast('You finished the course. Now go ship something.');
  };
  const onBack = () => index > 0 && go(allLessons[index - 1].id);
  const nextModule = allLessons.find((l) => l.moduleIndex === lesson.moduleIndex + 1);
  const onSkipModule = nextModule ? () => go(nextModule.id) : undefined;

  const goHome = () => { setView('home'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const openDrink = () => setDrinkOpen(true);
  const onSignOut = async () => { await signOut(); setAccount(null); setToast('Signed out on this computer.'); };
  const nav = <SideNav view={view} currentId={currentId} done={done} go={go} goHome={goHome} />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar section={view === 'home' ? 'All modules' : lesson.moduleTitle} colorMode={colorMode} toggleColor={toggleColor} openMenu={() => setMenuOpen(true)} go={go} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: `${SIDEBAR}px minmax(0,1fr)`, xl: `${SIDEBAR}px minmax(0,1fr) ${RAIL}px` }, minHeight: 'calc(100vh - 64px)' }}>
        <Box component="nav" aria-label="Course" sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', background: theme.t.surface, borderRight: `1px solid ${theme.t.border}` }}>
          {nav}
        </Box>
        <Box component="main" sx={{ minWidth: 0 }}>
          {view === 'home' ? (
            <Home currentId={currentId} done={done} go={go} openMenu={() => setMenuOpen(true)} openDrink={openDrink} />
          ) : (
            <Lesson lesson={lesson} index={index} onBack={onBack} onNext={onNext} onSkipModule={onSkipModule} />
          )}
        </Box>
        <Box component="aside" sx={{ display: { xs: 'none', xl: 'block' }, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto', background: theme.t.surface, borderLeft: `1px solid ${theme.t.border}`, scrollbarWidth: 'thin' }}>
          <RightRail go={go} openDrink={openDrink} account={account} onSignOut={onSignOut}
            title={view === 'home' ? 'Up next' : 'In this module'}
            items={view === 'home' ? allLessons.filter((l) => !done.has(l.id)).slice(0, 6) : modules[lesson.moduleIndex].lessons.map((l) => allLessons.find((x) => x.id === l.id))}
            tools={view === 'home' ? [...new Map(modules.flatMap((m) => metaFor(m.id).tools).filter((i) => !i.text).map((i) => [i.title, i])).values()].slice(0, 20) : metaFor(lesson.moduleId).tools} />
        </Box>
      </Box>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} slotProps={{ paper: { sx: { width: 'min(320px, 88vw)', background: theme.t.surface } } }}>
        {nav}
      </Drawer>

      {splash && (
        <Box aria-hidden="true" sx={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'grid', placeItems: 'center', background: colorMode === 'dark' ? '#04060E' : '#FEFEFE', opacity: splashFade ? 0 : 1, transition: 'opacity .5s ease' }}>
          <Box component="img" src={colorMode === 'dark' ? '/brand/splash-dark.jpg' : '/brand/splash-light.jpg'} alt="" sx={{ width: 'min(520px, 80vw)', height: 'auto', display: 'block' }} />
        </Box>
      )}
      <TermsGate open={!termsOk && !splash} onAccept={() => { store.set('terms', TERMS_VERSION); setTermsOk(true); }} />
      <DonateDialog open={termsOk && drinkOpen && !account?.donated} onClose={() => setDrinkOpen(false)} account={account}
        onAccount={(a) => { setAccount(a); if (a?.donated) { setDrinkOpen(false); setToast('Cheers! Your drink arrived. Thank you.'); } }} />
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast('')} message={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </ThemeProvider>
  );
}
