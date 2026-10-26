import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Dialog, FormControlLabel, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocalBarRounded from '@mui/icons-material/LocalBarRounded';
import GavelRounded from '@mui/icons-material/GavelRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded';
import LockOpenRounded from '@mui/icons-material/LockOpenRounded';
import BlockRounded from '@mui/icons-material/BlockRounded';
import { FONT_MONO } from '../theme';
import { getConfig, refreshAccount } from '../account';

export const TERMS_VERSION = '2026-10-27';

const terms = [
  ['Education and entertainment only', 'TinyAppCode is provided strictly for educational and entertainment purposes. Nothing here is professional, legal, financial, tax, security, compliance or medical advice.'],
  ['No warranty', 'All content, prompts, commands and code are provided "as is", without warranties of any kind. They may be incomplete, out of date or wrong. Third-party services, prices and features change without notice.'],
  ['You are responsible', 'You alone are responsible for what you build, deploy, run, publish or charge for, and for your use of any third-party service (including their costs and terms). Always review AI-generated code before using it.'],
  ['No liability', 'To the fullest extent allowed by law, the creator of this course and anyone involved in it are not liable for any loss or damage of any kind, including lost data, lost money, security incidents, service charges, or business losses, arising from your use of this course.'],
  ['Security and compliance', 'Security lessons (including OWASP and SOC 2 material) are for awareness only. Completing them does not make any product secure or compliant. A SOC 2 report can only be issued by a licensed CPA firm.'],
  ['Indemnity', 'You agree to hold harmless and indemnify the creator against claims arising from your use of this course or anything you build with it.'],
  ['Your data', 'You need a free account to use the course. We store your name, email, a scrambled (hashed) password, your sign-ins and trusted devices, and any donation records, only to run your account and recognize your donations. Your lesson progress is saved in your browser. We never sell your data.'],
];

export function TermsGate({ open, onAccept }) {
  const { t } = useTheme();
  const [agree, setAgree] = useState(false);
  return (
    <Dialog open={open} maxWidth="sm" fullWidth scroll="paper" aria-labelledby="terms-title"
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)' } } }}>
      <Box sx={{ p: { xs: 2.5, sm: 3.5 }, pb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '3px', display: 'grid', placeItems: 'center', background: t.surface2, border: `1px solid ${t.border}`, flexShrink: 0 }}>
          <GavelRounded sx={{ color: t.text2 }} />
        </Box>
        <Box>
          <Typography id="terms-title" variant="h5">Before you start</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Terms of use and release of liability</Typography>
        </Box>
      </Box>
      <Box sx={{ px: { xs: 2.5, sm: 3.5 }, overflowY: 'auto', maxHeight: { xs: '48vh', sm: '42vh' }, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, background: t.surface2 }}>
        {terms.map(([h, p], i) => (
          <Box key={h} sx={{ py: 1.75, borderTop: i ? `1px solid ${t.border}` : 'none' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>{i + 1}. {h}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{p}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: { xs: 2.5, sm: 3.5 }, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} sx={{ '&.Mui-checked': { color: t.accent } }} />}
          label={<Typography variant="body2">I am 18 or older, I have read these terms, and I agree to them.</Typography>}
          sx={{ alignItems: 'flex-start', m: 0, '& .MuiCheckbox-root': { mt: '-7px', ml: '-9px' } }}
        />
        <Button variant="contained" size="large" fullWidth disabled={!agree} onClick={onAccept}>Agree and continue</Button>
      </Box>
    </Dialog>
  );
}

// Decoded from the PayPal QR code.
const PAYPAL_URL = 'https://www.paypal.com/qrcodes/p2pqrc/59HTXVCYVB55J';

const wallets = [
  ['ETH', '0x2b93C53f9F02f530f91Feab56e2cCc04D79e9E48'],
  ['BTC', '39cmCz1mrYamZpQdHNRABxeY5XZvqMhoGt'],
];

function WalletRow({ label, addr }) {
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(addr); } catch { /* clipboard blocked */ }
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, pl: 1.75, borderRadius: '3px', border: `1px solid ${t.border}`, background: t.surface }}>
      <Typography variant="body2" sx={{ fontWeight: 700, width: 34, flexShrink: 0, color: t.muted }}>{label}</Typography>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: 12.5, flex: 1, minWidth: 0, wordBreak: 'break-all', lineHeight: 1.4 }}>{addr}</Typography>
      <Button size="small" variant="outlined" onClick={copy} sx={{ minWidth: 84, flexShrink: 0 }}
        startIcon={copied ? <CheckRounded fontSize="small" /> : <ContentCopyRounded fontSize="small" />}>
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </Box>
  );
}

// A glass with a straw and bubbles, drawn in the brand colors for the top of the donation window.
function DrinkArt() {
  return (
    <Box component="svg" viewBox="0 0 120 120" aria-hidden sx={{ width: { xs: 84, sm: 104 }, height: 'auto', flexShrink: 0 }}>
      <circle cx="60" cy="60" r="54" fill="rgba(255,255,255,0.12)" />
      <path d="M68 14 L58 52" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M32 44 H88 L80 100 a6 6 0 0 1 -6 5 H46 a6 6 0 0 1 -6 -5 Z" fill="rgba(255,255,255,0.92)" />
      <path d="M36 62 H84 L80 100 a6 6 0 0 1 -6 5 H46 a6 6 0 0 1 -6 -5 Z" fill="#7FD8FF" opacity="0.85" />
      <circle cx="50" cy="80" r="3.2" fill="#fff" /><circle cx="64" cy="90" r="2.4" fill="#fff" /><circle cx="70" cy="74" r="2" fill="#fff" />
      <circle cx="86" cy="44" r="11" fill="#9BE564" stroke="#fff" strokeWidth="3" />
      <path d="M86 35 V53 M77 44 H95" stroke="#fff" strokeWidth="1.6" opacity="0.8" />
    </Box>
  );
}

const PERKS = [
  [AutoStoriesRounded, 'New lessons', 'as the tools change'],
  [LockOpenRounded, 'Free for everyone', 'no paywall, ever'],
  [BlockRounded, 'No ads', 'no selling your data'],
];

// Shows at every launch until the server has a donation recorded for this person's account.
// There is deliberately no "I already donated" button: only a recorded donation closes it for good.
export function DonateDialog({ open, onClose, account, onAccount }) {
  const { t } = useTheme();
  const [config, setConfig] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [other, setOther] = useState(false);

  useEffect(() => { if (open) getConfig().then(setConfig); }, [open]);

  // After they open the donate link, check the account every 5 seconds; the window closes itself when it lands.
  useEffect(() => {
    if (!open || !waiting || !account) return undefined;
    const id = setInterval(async () => {
      const next = await refreshAccount();
      if (next) onAccount(next);
    }, 5000);
    return () => clearInterval(id);
  }, [open, waiting, account, onAccount]);

  const first = account?.name?.split(' ')[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="drink-title"
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)' } }, paper: { sx: { overflow: 'hidden' } } }}>
      <Box sx={{ background: t.grad, color: '#fff', px: { xs: 2.5, sm: 3 }, py: { xs: 2.5, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: '0.12em', lineHeight: 1.6 }}>
            {first ? `Hey ${first}, enjoying it?` : 'Enjoying the course?'}
          </Typography>
          <Typography id="drink-title" variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1, mt: 0.5 }}>Buy me a drink</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>The whole course is free. One person makes it.</Typography>
        </Box>
        <DrinkArt />
      </Box>

      <Box sx={{ p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {PERKS.map(([Icon, title, sub]) => (
            <Box key={title} sx={{ p: 1.25, borderRadius: '4px', background: t.surface2, textAlign: 'center' }}>
              <Icon sx={{ color: t.accent, fontSize: 22 }} />
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.25, mt: 0.5 }}>{title}</Typography>
              <Typography sx={{ fontSize: 11.5, color: 'text.secondary', lineHeight: 1.3 }}>{sub}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="contained" size="large" href={account && config.donate_square ? config.donate_square : undefined} target="_blank" rel="noopener noreferrer"
            disabled={!account || !config.donate_square} onClick={() => setWaiting(true)} startIcon={<LocalBarRounded />}
            sx={{ py: 1.4, fontSize: 16 }}>
            Buy me a drink
          </Button>
          {waiting && account ? (
            <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, borderRadius: '4px', background: t.tealSoft }}>
              <CircularProgress size={16} sx={{ color: t.teal }} />
              <Typography variant="body2">Waiting for your donation. This window closes by itself when it arrives.</Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {account ? <>Secure checkout by Square. Use <b>{account.email}</b> so it is matched to you.</> : 'Sign in first so we can match your donation to you.'}
            </Typography>
          )}
        </Box>

        <Box sx={{ borderTop: `1px solid ${t.border}`, pt: 1.5 }}>
          <Button size="small" fullWidth onClick={() => setOther(!other)} endIcon={<ExpandMoreRounded sx={{ transition: 'transform .2s', transform: other ? 'rotate(180deg)' : 'none' }} />}
            sx={{ color: 'text.secondary' }}>
            PayPal or crypto
          </Button>
          {other && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '4px', background: t.surface2 }}>
                <Box component="img" src="/paypal-qr.png" alt="PayPal QR code" width={80} height={80} sx={{ borderRadius: '2px', background: '#fff', p: 0.5, flexShrink: 0 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>PayPal</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Scan with your phone, or</Typography>
                  <Button size="small" variant="outlined" href={config.donate_paypal || PAYPAL_URL} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewRounded fontSize="small" />} sx={{ mt: 0.75 }}>Open PayPal</Button>
                </Box>
              </Box>
              {wallets.map(([l, a]) => <WalletRow key={l} label={l} addr={(l === 'ETH' ? config.donate_eth : config.donate_btc) || a} />)}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>PayPal and crypto are confirmed by hand, so this window may keep showing for a day or two.</Typography>
            </Box>
          )}
        </Box>

        <Button onClick={onClose} sx={{ color: 'text.secondary', alignSelf: 'center' }}>Not now</Button>
      </Box>
    </Dialog>
  );
}
