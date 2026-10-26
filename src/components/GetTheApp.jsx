import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IosShareRounded from '@mui/icons-material/IosShareRounded';
import MoreVertRounded from '@mui/icons-material/MoreVertRounded';
import InstallMobileRounded from '@mui/icons-material/InstallMobileRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import { Logo } from './Panels';
import LegalNote from './LegalNote';

// tinyappcode.com/get-the-app: put TinyAppCode on a phone's home screen (free, no app store), like Chef Nerd's page.
// A QR code for computers, an Install button where the browser supports it, and steps for iPhone and Android.
const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);
const isAndroid = /Android/.test(ua);
const installed = () => { try { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch { return false; } };

const IOS_STEPS = [
  <>Open <b>tinyappcode.com</b> in <b>Safari</b>.</>,
  <>Tap the <b>Share</b> button <IosShareRounded sx={{ fontSize: 18, verticalAlign: 'text-bottom' }} /> (a square with an arrow pointing up). On newer iPhones it may be inside the <b>•••</b> menu.</>,
  <>Scroll down and tap <b>Add to Home Screen</b>.</>,
  <>Tap <b>Add</b>. The TinyAppCode icon is now on your home screen.</>,
];
const ANDROID_STEPS = [
  <>Open <b>tinyappcode.com</b> in <b>Chrome</b>.</>,
  <>Tap <b>Install</b> if a pop-up appears. If not, tap the menu <MoreVertRounded sx={{ fontSize: 18, verticalAlign: 'text-bottom' }} /> in the top-right corner.</>,
  <>Tap <b>Install app</b> (or <b>Add to Home screen</b>).</>,
  <>Tap <b>Install</b>. Open TinyAppCode from your home screen or app drawer.</>,
];

function Steps({ title, steps, highlight }) {
  const { t } = useTheme();
  return (
    <Box sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '12px', background: '#fff', border: highlight ? `2px solid ${t.accent}` : '1px solid #ECEEF3', boxShadow: highlight ? '0 16px 40px rgba(20,30,90,0.10)' : 'none' }}>
      <Typography component="h2" sx={{ fontWeight: 800, fontSize: '1.3rem' }}>{title}</Typography>
      {highlight && <Typography sx={{ color: t.accentText, fontWeight: 700, fontSize: 13.5, mt: 0.25 }}>This looks like your phone</Typography>}
      <Box component="ol" sx={{ m: 0, mt: 1.5, pl: 0, listStyle: 'none', display: 'grid', gap: 1.5 }}>
        {steps.map((s, i) => (
          <Box component="li" key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ width: 26, height: 26, borderRadius: '50%', background: t.accentSoft, color: t.accentText, fontWeight: 800, fontSize: 14, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</Box>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{s}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function GetTheApp() {
  const { t } = useTheme();
  const [prompt, setPrompt] = useState(() => (typeof window !== 'undefined' ? window.__installPrompt || null : null));
  const [done, setDone] = useState(installed);

  useEffect(() => {
    document.title = 'Get the app · TinyAppCode';
    const onPrompt = () => setPrompt(window.__installPrompt || null);
    const onInstalled = () => setDone(true);
    window.addEventListener('tac-install-ready', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('tac-install-ready', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    try { const r = await prompt.userChoice; if (r?.outcome === 'accepted') setDone(true); } catch { /* ignore */ }
    window.__installPrompt = null; setPrompt(null);
  };

  const iosCard = <Steps title="iPhone and iPad (Safari)" steps={IOS_STEPS} highlight={isIOS} />;
  const androidCard = <Steps title="Android (Chrome)" steps={ANDROID_STEPS} highlight={isAndroid} />;

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      <Box component="header" sx={{ borderBottom: '1px solid #ECEEF3' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, height: 64, display: 'flex', alignItems: 'center' }}>
          <Box component="a" href="/" aria-label="TinyAppCode home"><Logo size={20} /></Box>
          <Button href="/" variant="outlined" sx={{ ml: 'auto' }}>Back to TinyAppCode</Button>
        </Box>
      </Box>

      <Box component="main">
        <Box component="section" sx={{ textAlign: 'center', px: 2, pt: { xs: 5, md: 7 }, pb: { xs: 4, md: 5 }, background: '#F8F9FC', borderBottom: '1px solid #ECEEF3' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.5, borderRadius: '99px', background: '#fff', border: '1px solid #ECEEF3', fontWeight: 600, fontSize: 13.5, color: 'text.secondary' }}>
            Free · No app store needed · 30 seconds
          </Box>
          <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3rem' }, letterSpacing: '-0.02em', mt: 2, lineHeight: 1.08 }}>Get the TinyAppCode app</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '1.05rem', md: '1.15rem' }, maxWidth: 600, mx: 'auto', mt: 1.5 }}>
            Put TinyAppCode on your phone's home screen and learn on the go. It opens full screen like any other app, with the same account and progress, and it updates itself.
          </Typography>
          {done ? (
            <Box sx={{ mt: 3, display: 'inline-flex', alignItems: 'center', gap: 1, color: t.teal, fontWeight: 700 }}><CheckCircleRounded /> The app is installed on this device.</Box>
          ) : prompt ? (
            <Button variant="contained" size="large" onClick={install} startIcon={<InstallMobileRounded />} sx={{ mt: 3, px: 3, py: 1.3 }}>Install the app</Button>
          ) : null}
        </Box>

        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, py: { xs: 4, md: 6 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr' }, gap: { xs: 3, md: 5 }, alignItems: 'start' }}>
          <Box sx={{ display: { xs: isIOS || isAndroid ? 'none' : 'block', md: 'block' }, p: 2, borderRadius: '12px', border: '1px solid #ECEEF3', textAlign: 'center', boxShadow: '0 20px 50px rgba(20,30,90,0.08)' }}>
            <Box component="img" src="/brand/qr-app.svg" alt="QR code that opens tinyappcode.com on your phone" sx={{ width: '100%', height: 'auto', display: 'block' }} />
            <Typography sx={{ fontWeight: 700, mt: 1 }}>On a computer?</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>Point your phone's camera here to open TinyAppCode, then follow the steps.</Typography>
          </Box>
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {isAndroid ? <>{androidCard}{iosCard}</> : <>{iosCard}{androidCard}</>}
            </Box>
            <Box sx={{ mt: 2, p: 2, borderRadius: '10px', background: '#F8F9FC', color: 'text.secondary', fontSize: 15 }}>
              <b>Good to know:</b> the app is the same TinyAppCode as the website, so sign in with the same account and your progress follows you. There is nothing to update: new lessons appear automatically. To remove it, press and hold the icon and choose Remove (iPhone) or Uninstall (Android).
            </Box>
            <Button href="/" variant="contained" size="large" sx={{ mt: 3 }}>Open TinyAppCode</Button>
          </Box>
        </Box>
        <LegalNote newTab={false} sx={{ px: 2, pb: { xs: 12, md: 5 } }} />
      </Box>
    </Box>
  );
}
