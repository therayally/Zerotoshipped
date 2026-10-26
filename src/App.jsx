import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CssBaseline, Drawer, Snackbar, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { makeTheme } from './theme';
import { allLessons } from './content/course';
import { TopBar, SideNav, Home, RightRail, Logo, LogoFull, SIDEBAR, RAIL } from './components/Panels';
import { modules } from './content/course';
import { metaFor } from './content/meta';
import Lesson from './components/Lesson';
import { TermsGate, DonateDialog, DonateBody, TERMS_VERSION } from './components/Gates';
import { Inline } from './components/Blocks';
import { terms as termsDoc, privacy as privacyDoc, accessibility as accessibilityDoc, LEGAL_UPDATED } from './content/legal';
import { getConfig, fetchProgress, pushProgress, myCertificates } from './account';
import { CertificatePage, ClaimCertificate } from './components/Certificate';
import { A11yButton, A11yDialog, A11yStyles, loadA11y } from './components/Accessibility';
import PromptLibrary from './components/PromptLibrary';
import { TRACKS, lessonsInTrack } from './content/course';
import AccountGate from './components/AccountGate';
import Landing from './components/Landing';
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

// Lessons live at clean addresses like /learn/practice-run. Old #/lesson links still work and get tidied up.
function idFromUrl() {
  const id = window.location.hash.replace(/^#\/?/, '') || (window.location.pathname.match(/^\/learn\/([\w-]+)\/?$/) || [])[1] || '';
  return allLessons.some((l) => l.id === id) ? id : null;
}


function systemDark() {
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch { return false; }
}

// Full-screen brand background shown behind the terms and sign-in windows.
function GateBackdrop() {
  return (
    <Box aria-hidden="true" sx={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #0B1033 0%, #1B2A8F 45%, #4B2BB5 100%)', overflow: 'hidden',
      '&::before': { content: '""', position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)' },
      '&::after': { content: '""', position: 'absolute', width: 640, height: 640, right: -160, top: -200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,77,255,0.45), transparent 65%)' } }} />
  );
}

// tinyappcode.com/donate: a shareable, branded donation page (no sign-in needed to view it).
function DonatePage({ account, onAccount, theme }) {
  const { t } = theme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GateBackdrop />
      <Box component="main" sx={{ position: 'relative', minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 460, borderRadius: '6px', overflow: 'hidden', background: t.surface, boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
          <Box sx={{ background: theme.palette.mode === 'dark' ? '#0B0E18' : '#fff', pt: 3, pb: 1.5, display: 'grid', placeItems: 'center', borderBottom: `1px solid ${t.border}` }}>
            <LogoFull height={150} />
          </Box>
          <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: 2.5, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>Buy me a drink</Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.75 }}>TinyAppCode teaches anyone to build and launch real apps with AI, for free. If it helped you, a drink keeps it going.</Typography>
          </Box>
          <DonateBody account={account} onAccount={onAccount} onClose={() => { window.location.href = '/'; }} />
          <Box sx={{ textAlign: 'center', pb: 2.5 }}>
            <Button href="/" sx={{ color: t.accentText }}>Start the free course →</Button>
            <Box sx={{ mt: 1 }}><LegalLinks /></Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// tinyappcode.com/terms and /privacy: readable legal pages anyone can open without signing in.
function LegalPage({ doc, theme }) {
  const { t } = theme;
  const [contact, setContact] = useState('');
  useEffect(() => { document.title = `${doc.title} · TinyAppCode`; getConfig().then((c) => setContact(c.contact_email || '')); }, [doc]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" sx={{ maxWidth: 760, mx: 'auto', px: 2, py: { xs: 3, sm: 6 } }}>
        <Box component="a" href="/" sx={{ display: 'inline-block', mb: 4 }}><Logo size={22} /></Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>{doc.title}</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>Last updated {LEGAL_UPDATED}</Typography>
        <Typography sx={{ mt: 3, fontSize: '1.08rem' }}>{doc.intro}</Typography>
        {doc.sections.map(([h, paras], i) => (
          <Box key={h} component="section" sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>{i + 1}. {h}</Typography>
            {paras.map((p) => <Typography key={p} sx={{ mt: 1.25, color: 'text.primary' }}><Inline text={p} /></Typography>)}
          </Box>
        ))}
        <Box component="section" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>{doc.sections.length + 1}. Contact</Typography>
          <Typography>{contact ? <>Questions or requests: <Box component="a" href={`mailto:${contact}`} sx={{ color: t.accentText }}>{contact}</Box>. TheRayAlly, Frederick, Maryland, USA.</> : 'TheRayAlly, Frederick, Maryland, USA.'}</Typography>
        </Box>
        <Box sx={{ mt: 6, pt: 3, borderTop: `1px solid ${t.border}`, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box component="a" href="/" sx={{ color: t.accentText }}>Back to TinyAppCode</Box>
          <Box component="a" href="/terms" sx={{ color: t.accentText }}>Terms of Service</Box>
          <Box component="a" href="/privacy" sx={{ color: t.accentText }}>Privacy Policy</Box>
          <Box component="a" href="/accessibility" sx={{ color: t.accentText }}>Accessibility</Box>
          <Box component="a" href="/donate" sx={{ color: t.accentText }}>Donate</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Small footer links to the legal pages, used under sign-in and donation screens.
export function LegalLinks({ color }) {
  const sx = { color: color || 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 };
  return (
    <Typography variant="body2" sx={{ color: color || 'text.secondary', textAlign: 'center' }}>
      <Box component="a" href="/terms" target="_blank" sx={sx}>Terms</Box>{' · '}<Box component="a" href="/privacy" target="_blank" sx={sx}>Privacy</Box>{' · '}<Box component="a" href="/accessibility" target="_blank" sx={sx}>Accessibility</Box>
    </Typography>
  );
}

export default function App() {
  const [colorMode, setColorMode] = useState(() => store.get('theme', systemDark() ? 'dark' : 'light'));
  const [done, setDone] = useState(() => new Set(store.get('done', [])));
  const [currentId, setCurrentId] = useState(() => idFromUrl() || store.get('last', allLessons[0].id));
  const [view, setView] = useState(() => (idFromUrl() ? 'lesson' : store.get('view', 'home')));
  // Dev only: ?demo skips the terms and drink pop-ups (used for marketing screenshots).
  const demo = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo');
  const [termsOk, setTermsOk] = useState(() => demo || store.get('terms', null) === TERMS_VERSION);
  const [drinkOpen, setDrinkOpen] = useState(false);
  const [finishedMod, setFinishedMod] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  // Visitors who are not signed in see the landing page first; "Log in" or "Start free" opens the sign-in window.
  const [entered, setEntered] = useState(null);
  const [splash, setSplash] = useState(() => !session.get('splashSeen') && !!getAccount());
  const [splashFade, setSplashFade] = useState(false);

  const [account, setAccount] = useState(() => getAccount());
  const [claimTrack, setClaimTrack] = useState(null);
  const [a11y, setA11y] = useState(loadA11y);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [certs, setCerts] = useState({});
  const [offline, setOffline] = useState(false);
  const theme = useMemo(() => makeTheme(colorMode, a11y), [colorMode, a11y]);
  // The public landing page is always the clean, white product look.
  const landingTheme = useMemo(() => makeTheme('light', a11y), [a11y]);
  const index = allLessons.findIndex((l) => l.id === currentId);
  const lesson = allLessons[index];

  useEffect(() => { refreshAccount().then(setAccount); }, []);

  // Progress follows the account: merge what the server has with this browser, then upload anything only here.
  useEffect(() => {
    if (!account?.token) return;
    fetchProgress().then((server) => {
      if (!server) return;
      setDone((local) => {
        const merged = new Set([...local, ...server]);
        const onlyLocal = [...local].filter((id) => !server.includes(id));
        if (onlyLocal.length) pushProgress(onlyLocal, true);
        store.set('done', [...merged]);
        return merged;
      });
    });
    myCertificates().then((list) => setCerts(Object.fromEntries(list.map((c) => [c.track, c.id]))));
  }, [account?.token]);

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
    if (termsOk && !splash && (account || offline) && !demo && !account?.donated && !session.get('drinkSeen')) {
      session.set('drinkSeen');
      const id = setTimeout(() => setDrinkOpen(true), 400);
      return () => clearTimeout(id);
    }
  }, [termsOk, splash, demo, account, offline]);

  useEffect(() => {
    const onNav = () => { const id = idFromUrl(); if (id) { setCurrentId(id); setView('lesson'); } else setView('home'); };
    window.addEventListener('popstate', onNav);
    window.addEventListener('hashchange', onNav);
    return () => { window.removeEventListener('popstate', onNav); window.removeEventListener('hashchange', onNav); };
  }, []);

  // The address bar always shows just tinyappcode.com; the current lesson is remembered in the browser instead.
  useEffect(() => {
    store.set('last', currentId);
    store.set('view', view);
    const ownPage = /^\/(donate|terms|privacy|accessibility|certificate)(\/|$)/.test(window.location.pathname);
    if (!ownPage && (window.location.pathname !== '/' || window.location.hash)) history.replaceState(null, '', '/' + window.location.search);
    if (!demo && !account && !offline && !entered) document.title = 'TinyAppCode: learn to vibe code, free';
    else document.title = view === 'home' ? 'TinyAppCode' : view === 'prompts' ? 'Prompt library · TinyAppCode' : `${lesson.title} · TinyAppCode`;
  }, [currentId, lesson.title, view, demo, account, offline, entered]);

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
  // Progress: mark a lesson done (button, reaching the end, or "Done, next") or undo it. Finishing a module's last lesson celebrates.
  const setLessonDone = (id, on) => {
    if (done.has(id) === on) return;
    const n = new Set(done);
    if (on) n.add(id); else n.delete(id);
    store.set('done', [...n]);
    setDone(n);
    if (account) pushProgress([id], on);
    if (!on) return;
    const track = TRACKS.find((tr) => lessonsInTrack(tr.id).includes(id));
    if (track && !certs[track.id] && lessonsInTrack(track.id).every((x) => n.has(x))) { setClaimTrack(track); return; }
    const mod = modules.find((m) => m.lessons.some((l) => l.id === id));
    if (!mod || !mod.lessons.every((l) => n.has(l.id))) return;
    // Finishing a module says thank you with the donation window (once per module), unless they already donated.
    const thanked = store.get('thanked', []);
    if (!account?.donated && !demo && !thanked.includes(mod.id)) {
      store.set('thanked', [...thanked, mod.id]);
      setFinishedMod({ number: modules.indexOf(mod), title: mod.title });
      setDrinkOpen(true);
    } else setToast(`Module complete: ${mod.title}. Nice work!`);
  };
  const markDone = (id) => setLessonDone(id, true);

  const onNext = () => {
    markDone(lesson.id);
    if (index < allLessons.length - 1) go(allLessons[index + 1].id);
    else setToast('You finished the course. Now go ship something.');
  };
  const onBack = () => index > 0 && go(allLessons[index - 1].id);
  const nextModule = allLessons.find((l) => l.moduleIndex === lesson.moduleIndex + 1);
  const onSkipModule = nextModule ? () => go(nextModule.id) : undefined;

  const goHome = () => { setView('home'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const openDrink = () => { setFinishedMod(null); setDrinkOpen(true); };
  const onSignOut = async () => { await signOut(); setAccount(null); setEntered(null); setToast('Signed out on this computer.'); };
  const openPrompts = () => { setView('prompts'); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
  const nav = <SideNav view={view} currentId={currentId} done={done} go={go} goHome={goHome} openPrompts={openPrompts} />;
  const page = window.location.pathname.replace(/\/$/, '');
  // Accessibility settings: available on every page (floating button where there is no top bar).
  const a11yLayer = (floating) => (
    <>
      <A11yStyles prefs={a11y} />
      <A11yDialog open={a11yOpen} onClose={() => setA11yOpen(false)} prefs={a11y} setPrefs={setA11y} />
      {floating && <A11yButton floating onClick={() => setA11yOpen(true)} />}
    </>
  );
  const standalone = (el) => <ThemeProvider theme={theme}><CssBaseline />{el}{a11yLayer(true)}</ThemeProvider>;
  if (page.startsWith('/certificate/')) return standalone(<CertificatePage id={page.slice('/certificate/'.length)} />);
  if (page === '/terms') return standalone(<LegalPage doc={termsDoc} theme={theme} />);
  if (page === '/privacy') return standalone(<LegalPage doc={privacyDoc} theme={theme} />);
  if (page === '/accessibility') return standalone(<LegalPage doc={accessibilityDoc} theme={theme} />);
  if (page === '/donate') return standalone(<DonatePage account={account} onAccount={setAccount} theme={theme} />);
  // Until terms are accepted and the person is signed in, the course stays hidden behind a branded backdrop.
  const gated = !demo && (!termsOk || (!account && !offline));
  if (!demo && !account && !offline && !entered) {
    return <ThemeProvider theme={landingTheme}><CssBaseline /><Landing onLogin={() => setEntered('login')} onSignup={() => setEntered('signup')} />{a11yLayer(true)}</ThemeProvider>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {gated ? <GateBackdrop /> : (<>
      <TopBar section={view === 'home' ? 'All modules' : view === 'prompts' ? 'Prompt library' : lesson.moduleTitle} colorMode={colorMode} toggleColor={toggleColor} openMenu={() => setMenuOpen(true)} go={go} account={account} onSignOut={onSignOut} openDrink={openDrink} openA11y={() => setA11yOpen(true)} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: `${SIDEBAR}px minmax(0,1fr)`, xl: `${SIDEBAR}px minmax(0,1fr) ${RAIL}px` }, minHeight: 'calc(100vh - 64px)' }}>
        <Box component="nav" aria-label="Course" sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', background: theme.t.surface, borderRight: `1px solid ${theme.t.border}` }}>
          {nav}
        </Box>
        <Box component="main" sx={{ minWidth: 0 }}>
          {view === 'home' ? (
            <Home currentId={currentId} done={done} go={go} openMenu={() => setMenuOpen(true)} openDrink={openDrink} onClaim={setClaimTrack} certs={certs} openPrompts={openPrompts} />
          ) : view === 'prompts' ? (
            <PromptLibrary go={go} />
          ) : (
            <Lesson lesson={lesson} index={index} onBack={onBack} onNext={onNext} onSkipModule={onSkipModule} complete={done.has(lesson.id)} setComplete={(on) => setLessonDone(lesson.id, on)} />
          )}
        </Box>
        <Box component="aside" sx={{ display: { xs: 'none', xl: 'block' }, position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto', background: theme.t.surface, borderLeft: `1px solid ${theme.t.border}`, scrollbarWidth: 'thin' }}>
          <RightRail go={go} openDrink={openDrink} account={account} onSignOut={onSignOut}
            title={view === 'lesson' ? 'In this module' : 'Up next'}
            items={view !== 'lesson' ? allLessons.filter((l) => !done.has(l.id)).slice(0, 6) : modules[lesson.moduleIndex].lessons.map((l) => allLessons.find((x) => x.id === l.id))}
            tools={view !== 'lesson' ? [...new Map(modules.flatMap((m) => metaFor(m.id).tools).filter((i) => !i.text).map((i) => [i.title, i])).values()].slice(0, 20) : metaFor(lesson.moduleId).tools} />
        </Box>
      </Box>

      </>)}

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} slotProps={{ paper: { sx: { width: 'min(320px, 88vw)', background: theme.t.surface } } }}>
        {nav}
      </Drawer>

      {splash && (
        <Box aria-hidden="true" sx={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'grid', placeItems: 'center', background: colorMode === 'dark' ? '#0B0E18' : '#FFFFFF', opacity: splashFade ? 0 : 1, transition: 'opacity .5s ease' }}>
          <Box component="img" src={colorMode === 'dark' ? '/brand/logo-full-dark.png' : '/brand/logo-full.png'} alt="" sx={{ width: 'min(520px, 80vw)', height: 'auto', display: 'block' }} />
        </Box>
      )}
      <TermsGate open={!termsOk && !splash} onAccept={() => { store.set('terms', TERMS_VERSION); setTermsOk(true); }} />
      <AccountGate open={termsOk && !splash && !demo && !account && !offline} startView={entered || 'login'} onBack={() => setEntered(null)} onAccount={(a) => { setAccount(a); setToast(`Welcome${a.name ? ', ' + a.name.split(' ')[0] : ''}!`); }} onOffline={() => setOffline(true)} />
      <DonateDialog open={termsOk && drinkOpen && !account?.donated} onClose={() => { setDrinkOpen(false); setTimeout(() => setFinishedMod(null), 300); }} account={account} finished={finishedMod}
        onAccount={(a) => { setAccount(a); if (a?.donated) { setDrinkOpen(false); setToast('Cheers! Your drink arrived. Thank you.'); } }} />
      {a11yLayer(gated)}
      <ClaimCertificate open={!!claimTrack} track={claimTrack} account={account} onClose={() => setClaimTrack(null)} />
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast('')} message={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </ThemeProvider>
  );
}
