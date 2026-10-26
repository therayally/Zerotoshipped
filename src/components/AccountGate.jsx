import { useEffect, useState } from 'react';
import { Box, Button, Dialog, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import { LogoFull } from './Panels';
import { signup, resendSignup, confirmSignup, login, verifyLogin, forgotPassword, resetPassword } from '../account';

const field = { '& .MuiOutlinedInput-root': { borderRadius: '3px' } };

const TITLES = {
  signup: ['Create your free account', 'The whole course is free. If it helps you, please consider buying me a drink to keep it going.'],
  confirm: ['Check your email', ''],
  login: ['Welcome back', 'Sign in to continue.'],
  verify: ['Confirm it is you', 'Two-step sign-in keeps your account yours. This device will be remembered for 30 days.'],
  forgot: ['Reset your password', 'We will email you a 6-digit code.'],
  reset: ['Choose a new password', ''],
};

// Shown at launch until the person has an account on this computer.
export default function AccountGate({ open, onAccount, onOffline, startView = 'login', onBack }) {
  const t = useTheme();
  const [view, setView] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  const go = (v) => { setView(v); setErr(''); setMsg(''); setCode(''); };
  // Opening from the landing page picks the right form: "Start free" signs up, "Log in" signs in.
  useEffect(() => { if (open) go(startView); }, [open, startView]);

  const run = async (fn) => {
    setBusy(true); setErr('');
    try { await fn(); } catch (e) {
      if (e.offline) setOffline(true);
      if (e.data?.error === 'needs_verification') { setMsg(e.data.message); go('confirm'); setMsg(e.data.message); return; }
      setErr(e.message);
    } finally { setBusy(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (view === 'signup') run(async () => { const r = await signup(name.trim(), email.trim(), password); go('confirm'); setMsg(r.message); });
    if (view === 'confirm') run(async () => onAccount(await confirmSignup(email.trim(), code.trim())));
    if (view === 'login') run(async () => { const r = await login(email.trim(), password); if (r.needs_code) { go('verify'); setMsg(r.message); } else onAccount(r); });
    if (view === 'verify') run(async () => onAccount(await verifyLogin(email.trim(), code.trim())));
    if (view === 'forgot') run(async () => { const r = await forgotPassword(email.trim()); go('reset'); setMsg(r.message); });
    if (view === 'reset') run(async () => onAccount(await resetPassword(email.trim(), code.trim(), password)));
  };

  const pw = (label, autoComplete) => (
    <TextField label={label} type={show ? 'text' : 'password'} required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={field}
      helperText={autoComplete === 'new-password' ? 'At least 10 characters. A short sentence works great.' : undefined}
      slotProps={{
        htmlInput: { autoComplete, minLength: autoComplete === 'new-password' ? 10 : undefined },
        input: { endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} edge="end" size="small">{show ? <VisibilityOffRounded fontSize="small" /> : <VisibilityRounded fontSize="small" />}</IconButton></InputAdornment> },
      }} />
  );

  const codeField = (
    <TextField label="6-digit code" required fullWidth value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} sx={field}
      slotProps={{ htmlInput: { inputMode: 'numeric', autoComplete: 'one-time-code', style: { letterSpacing: '0.3em', fontWeight: 700 } } }} />
  );

  const [title, sub] = TITLES[view];

  return (
    <Dialog open={open} onClose={onBack} maxWidth="xs" fullWidth aria-labelledby="acct-title" slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)' } } }}>
      <Box sx={{ height: 6, background: t.t.grad }} />
      <Box component="form" onSubmit={submit} sx={{ p: { xs: 2.5, sm: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ alignSelf: 'center', mb: -0.5 }}><LogoFull height={118} /></Box>
        <Box>
          <Typography id="acct-title" variant="h5">{title}</Typography>
          {(msg || sub) && <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{msg || sub}</Typography>}
        </Box>

        {view === 'signup' && (<>
          <TextField label="Your name" required fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={field} slotProps={{ htmlInput: { autoComplete: 'name' } }} />
          <TextField label="Email" type="email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={field} slotProps={{ htmlInput: { autoComplete: 'email' } }} />
          {pw('Password', 'new-password')}
        </>)}
        {(view === 'confirm' || view === 'verify') && codeField}
        {view === 'login' && (<>
          <TextField label="Email" type="email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={field} slotProps={{ htmlInput: { autoComplete: 'email' } }} />
          {pw('Password', 'current-password')}
        </>)}
        {view === 'forgot' && <TextField label="Email" type="email" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={field} slotProps={{ htmlInput: { autoComplete: 'email' } }} />}
        {view === 'reset' && (<>{codeField}{pw('New password', 'new-password')}</>)}

        {err && <Typography variant="body2" role="alert" sx={{ color: t.t.warn, fontWeight: 600 }}>{err}</Typography>}

        <Button type="submit" variant="contained" size="large" disabled={busy}>
          {{ signup: 'Create account', confirm: 'Confirm email', login: 'Sign in', verify: 'Verify and sign in', forgot: 'Email me a code', reset: 'Save new password' }[view]}
        </Button>

        {view === 'signup' && (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: -0.5 }}>
            By creating an account you agree to the <Box component="a" href="/terms" target="_blank" sx={{ color: t.t.accentText }}>Terms</Box> and <Box component="a" href="/privacy" target="_blank" sx={{ color: t.t.accentText }}>Privacy Policy</Box>.
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
          {view === 'signup' && <Button size="small" onClick={() => go('login')}>I already have an account</Button>}
          {view === 'login' && <Button size="small" onClick={() => go('signup')}>Create an account</Button>}
          {view === 'login' && <Button size="small" onClick={() => go('forgot')}>Forgot password?</Button>}
          {view === 'confirm' && <Button size="small" disabled={busy} onClick={() => run(async () => { const r = await resendSignup(email.trim()); setMsg(r.message); })}>Send a new code</Button>}
          {view === 'verify' && <Button size="small" disabled={busy} onClick={() => run(async () => { const r = await login(email.trim(), password); setMsg(r.message || ''); })}>Send a new code</Button>}
          {(view === 'confirm' || view === 'verify' || view === 'forgot' || view === 'reset') && <Button size="small" onClick={() => go('login')}>Back to sign in</Button>}
        </Box>

        {onBack && <Button size="small" onClick={onBack} sx={{ alignSelf: 'center', color: 'text.secondary', mt: -1 }}>← Back to the home page</Button>}

        {offline && (
          <Box sx={{ p: 1.5, borderRadius: '3px', background: t.t.surface2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Can't reach the server right now. You can keep learning offline and sign in later.</Typography>
            <Button size="small" onClick={onOffline} sx={{ mt: 0.5 }}>Continue offline</Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
