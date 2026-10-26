import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Dialog, FormControlLabel, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocalBarRounded from '@mui/icons-material/LocalBarRounded';
import GavelRounded from '@mui/icons-material/GavelRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import { FONT_MONO } from '../theme';
import { getConfig, refreshAccount } from '../account';

export const TERMS_VERSION = '2026-10-26';

const terms = [
  ['Education and entertainment only', 'Zero to Shipped is provided strictly for educational and entertainment purposes. Nothing here is professional, legal, financial, tax, security, compliance or medical advice.'],
  ['No warranty', 'All content, prompts, commands and code are provided "as is", without warranties of any kind. They may be incomplete, out of date or wrong. Third-party services, prices and features change without notice.'],
  ['You are responsible', 'You alone are responsible for what you build, deploy, run, publish or charge for, and for your use of any third-party service (including their costs and terms). Always review AI-generated code before using it.'],
  ['No liability', 'To the fullest extent allowed by law, the creator of this course and anyone involved in it are not liable for any loss or damage of any kind, including lost data, lost money, security incidents, service charges, or business losses, arising from your use of this course.'],
  ['Security and compliance', 'Security lessons (including OWASP and SOC 2 material) are for awareness only. Completing them does not make any product secure or compliant. A SOC 2 report can only be issued by a licensed CPA firm.'],
  ['Indemnity', 'You agree to hold harmless and indemnify the creator against claims arising from your use of this course or anything you build with it.'],
  ['Your data', 'The course works without an account. Your progress stays on your own computer. If you sign in, we store your email, your sign-in sessions and any donation records, only to recognize you and your donations. We never sell your data.'],
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

// Shows at every launch until the server has a donation recorded for this person's account.
// There is deliberately no "I already donated" button: only a recorded donation closes it for good.
export function DonateDialog({ open, onClose, account, onAccount }) {
  const { t } = useTheme();
  const [config, setConfig] = useState({});
  const [err, setErr] = useState('');
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="drink-title"
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)' } } }}>
      <Box sx={{ height: 6, background: t.grad }} />
      <Box sx={{ p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <Box sx={{ display: 'flex', gap: 1.75, alignItems: 'center' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '3px', display: 'grid', placeItems: 'center', background: t.accentSoft, flexShrink: 0 }}>
            <LocalBarRounded sx={{ color: t.accent }} />
          </Box>
          <Box>
            <Typography id="drink-title" variant="h5">Buy me a drink?</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>The whole course is free.</Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          It is built by one person. If it helps you, a drink keeps it free and up to date. This window stops showing once your donation is recorded on your account.
        </Typography>

        <Box sx={{ p: 2, borderRadius: '3px', border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: 1.25, opacity: account ? 1 : 0.55 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Donate with a card</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {account ? <>Use <b>{account.email}</b> at checkout so it is matched to your account.</> : 'Sign in first so we can match your donation to you.'}
          </Typography>
          <Button variant="contained" href={account && config.donate_square ? config.donate_square : undefined} target="_blank" rel="noopener noreferrer"
            disabled={!account || !config.donate_square} onClick={() => setWaiting(true)} startIcon={<LocalBarRounded />}>
            Buy me a drink
          </Button>
          {waiting && account && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Waiting for your donation to arrive. This closes by itself.</Typography>
            </Box>
          )}
        </Box>

        <Box>
          <Button size="small" onClick={() => setOther(!other)} endIcon={<ExpandMoreRounded sx={{ transform: other ? 'rotate(180deg)' : 'none' }} />}>Other ways to give</Button>
          {other && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: '3px', background: t.surface2 }}>
                <Box component="img" src="/paypal-qr.png" alt="PayPal QR code" width={88} height={88} sx={{ borderRadius: '2px', background: '#fff', p: 0.5, flexShrink: 0 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>PayPal</Typography>
                  <Button size="small" variant="outlined" href={config.donate_paypal || PAYPAL_URL} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewRounded fontSize="small" />} sx={{ mt: 0.75 }}>Open PayPal</Button>
                </Box>
              </Box>
              {wallets.map(([l, a]) => <WalletRow key={l} label={l} addr={(l === 'ETH' ? config.donate_eth : config.donate_btc) || a} />)}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>PayPal and crypto donations are confirmed by hand, so this window may show for a day or two after you give.</Typography>
            </Box>
          )}
        </Box>

        {err && <Typography variant="body2" role="alert" sx={{ color: t.warn, fontWeight: 600 }}>{err}</Typography>}
        <Button variant="outlined" onClick={onClose}>Not now</Button>
      </Box>
    </Dialog>
  );
}
