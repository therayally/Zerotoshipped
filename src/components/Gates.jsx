import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Dialog, FormControlLabel, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocalBarRounded from '@mui/icons-material/LocalBarRounded';
import GavelRounded from '@mui/icons-material/GavelRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded';
import LockOpenRounded from '@mui/icons-material/LockOpenRounded';
import BlockRounded from '@mui/icons-material/BlockRounded';
import { FONT_MONO } from '../theme';
import { getConfig, refreshAccount, startDonation } from '../account';
import { logo } from '../content/logos';

export const TERMS_VERSION = '2026-10-26b-tos';

const terms = [
  ['Education and entertainment only', 'TinyAppCode is provided strictly for educational and entertainment purposes. Nothing here is professional, legal, financial, tax, security, compliance or medical advice.'],
  ['No warranty', 'All content, prompts, commands and code are provided "as is", without warranties of any kind. They may be incomplete, out of date or wrong. Third-party services, prices and features change without notice.'],
  ['You are responsible', 'You alone are responsible for what you build, deploy, run, publish or charge for, and for your use of any third-party service (including their costs and terms). Always review AI-generated code before using it.'],
  ['No liability', 'To the fullest extent allowed by law, the creator of this course and anyone involved in it are not liable for any loss or damage of any kind, including lost data, lost money, security incidents, service charges, or business losses, arising from your use of this course.'],
  ['Security and compliance', 'Security lessons (including OWASP and SOC 2 material) are for awareness only. Completing them does not make any product secure or compliant. A SOC 2 report can only be issued by a licensed CPA firm.'],
  ['AI can be wrong', 'AI tools can produce code or answers that are wrong or insecure. Lessons, time estimates and examples are not a promise of any result or income.'],
  ['Not affiliated', 'TinyAppCode is independent and not endorsed by Anthropic, Claude or any company named in it. Trademarks belong to their owners. Some links are labeled partner links.'],
  ['Indemnity', 'You agree to hold harmless and indemnify the creator against claims arising from your use of this course or anything you build with it.'],
  ['Your data', 'You need a free account to use the course. We store your name, email, a scrambled (hashed) password, your sign-ins and trusted devices, and any donation records, only to run your account and recognize your donations. Your lesson progress is saved to your account. We never sell your data.'],
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
      <Box tabIndex={0} role="region" aria-label="Terms of use" sx={{ px: { xs: 2.5, sm: 3.5 }, overflowY: 'auto', maxHeight: { xs: '48vh', sm: '42vh' }, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, background: t.surface2 }}>
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
          label={<Typography variant="body2">I am 18 or older, and I agree to the <Box component="a" href="/terms" target="_blank" sx={{ color: t.accentText }}>Terms of Service</Box> , <Box component="a" href="/privacy" target="_blank" sx={{ color: t.accentText }}>Privacy Policy</Box> and <Box component="a" href="/disclaimer" target="_blank" sx={{ color: t.accentText }}>Disclaimer</Box>.</Typography>}
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

// The Square logo (mark + wordmark) for the "Secure checkout by Square" line; follows the text color in both themes.
function SquareMark() {
  const { t } = useTheme();
  const icon = logo('square');
  return (
    <Box component="span" aria-label="Square" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: t.text, fontWeight: 700, fontSize: 14.5 }}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d={icon.path} fill="currentColor" /></svg>
      Square
    </Box>
  );
}

// Card brands shown under the donate button, each in its own small tile.
const CARDS = ['visa', 'mastercard', 'amex', 'discover', 'applepay', 'googlepay', 'cashapp'];

function CardMark({ k }) {
  const { t } = useTheme();
  const icon = logo(k);
  if (!icon) return null;
  return (
    <Box title={icon.title} sx={{ width: 46, height: 30, borderRadius: '4px', background: '#fff', border: `1px solid ${t.border}`, display: 'grid', placeItems: 'center' }}>
      <svg viewBox="0 0 24 24" width="30" height="20" aria-hidden="true"><path d={icon.path} fill={`#${icon.hex}`} /></svg>
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
// Everything under the header: perks, the give button, card logos, PayPal and crypto, and "Not now".
// Shared by the pop-up and the /donate page so they always match.
export function DonateBody({ active = true, onClose, account, onAccount, holdLeft = 0 }) {
  const { t } = useTheme();
  const [config, setConfig] = useState({});
  const [waiting, setWaiting] = useState(false);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Open the tab right away (so pop-up blockers allow it), then send it to the Square link the server makes.
  const give = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const tab = window.open('', '_blank');
    if (tab) tab.opener = null;
    try {
      const { url } = await startDonation(Number(amount));
      if (tab) tab.location.href = url; else window.location.href = url;
      setWaiting(true);
    } catch (ex) {
      tab?.close();
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { if (active) getConfig().then(setConfig); }, [active]);

  // After they open the donate link, check the account every 5 seconds; the window closes itself when it lands.
  useEffect(() => {
    if (!active || !waiting || !account) return undefined;
    const id = setInterval(async () => {
      const next = await refreshAccount();
      if (next) onAccount(next);
    }, 5000);
    return () => clearInterval(id);
  }, [active, waiting, account, onAccount]);

  return (
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

      <Box component="form" onSubmit={give} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {config.donate_card && account ? (
        <Box sx={{ display: 'flex', gap: 1, width: '100%', maxWidth: 340, alignSelf: 'center' }}>
          <TextField value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="Any amount" aria-label="Donation amount in dollars"
            slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment>, sx: { borderRadius: '3px', fontSize: 18, fontWeight: 600 } }, htmlInput: { inputMode: 'decimal', maxLength: 7 } }}
            sx={{ width: 150, flexShrink: 0 }} />
          <Button type="submit" variant="contained" disabled={busy || !(Number(amount) > 0)} startIcon={<LocalBarRounded fontSize="small" />} sx={{ flex: 1, py: 0.9, fontSize: 15 }}>
            {busy ? 'Opening…' : 'Buy me a drink'}
          </Button>
        </Box>
      ) : (
        <Button variant="contained" href={config.donate_square || undefined} target="_blank" rel="noopener noreferrer"
          disabled={!config.donate_square} onClick={() => setWaiting(true)} startIcon={<LocalBarRounded fontSize="small" />} sx={{ py: 0.9, px: 4, fontSize: 15, alignSelf: 'center', minWidth: 220 }}>
          Buy me a drink
        </Button>
      )}
      {waiting && account ? (
          <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, borderRadius: '4px', background: t.tealSoft }}>
            <CircularProgress size={16} sx={{ color: t.teal }} />
            <Typography variant="body2">Finish on Square's page. This window closes by itself when your drink arrives.</Typography>
          </Box>
        ) : err ? (
          <Typography variant="body2" role="alert" sx={{ color: t.warn, fontWeight: 600, textAlign: 'center' }}>{err}</Typography>
        ) : (
          config.donate_card || config.donate_square ? (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <Typography variant="body2">Any amount helps. Secure checkout by</Typography>
                <SquareMark />
              </Box>
              {account && <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>Use {account.email} so we can thank you.</Typography>}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>Card donations are almost ready. PayPal and crypto work below.</Typography>
          )
        )}
        <Box aria-label="Accepted: Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay, Cash App Pay" sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          {CARDS.map((k) => <CardMark key={k} k={k} />)}
        </Box>
      </Box>

      <Box sx={{ borderTop: `1px solid ${t.border}`, pt: 1.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', fontWeight: 600 }}>Or give with PayPal or crypto</Typography>
        {(
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.25 }}>
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
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              Donations are voluntary gifts to support a free course. They do not buy any product or access, are non-refundable and are not tax-deductible. <Box component="a" href="/terms" target="_blank" sx={{ color: 'inherit' }}>Terms</Box>
            </Typography>
          </Box>
        )}
      </Box>

      {onClose && (
        <Button onClick={onClose} disabled={holdLeft > 0} sx={{ color: 'text.secondary', alignSelf: 'center', fontVariantNumeric: 'tabular-nums' }}>
          {holdLeft > 0 ? `Not now (${holdLeft})` : 'Not now'}
        </Button>
      )}
    </Box>
  );
}

// After a module is finished, `finished` ({ number, title }) turns it into a thank-you, and "Not now"
// waits a few seconds so the message is actually seen. It never blocks the course for long.
const HOLD_SECONDS = 6;

export function DonateDialog({ open, onClose, account, onAccount, finished }) {
  const { t } = useTheme();
  const first = account?.name?.split(' ')[0];
  const [holdLeft, setHoldLeft] = useState(0);
  useEffect(() => {
    if (!open || !finished) { setHoldLeft(0); return undefined; }
    setHoldLeft(HOLD_SECONDS);
    const id = setInterval(() => setHoldLeft((n) => { if (n <= 1) { clearInterval(id); return 0; } return n - 1; }), 1000);
    return () => clearInterval(id);
  }, [open, finished]);
  const close = () => { if (holdLeft <= 0) onClose(); };

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth aria-labelledby="drink-title"
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)' } }, paper: { sx: { overflowX: 'hidden', overflowY: 'auto', m: { xs: 1.5, sm: 4 }, maxHeight: { xs: 'calc(100% - 24px)', sm: 'calc(100% - 64px)' }, width: { xs: 'calc(100% - 24px)', sm: undefined } } } }}>
      <Box sx={{ background: t.grad, color: '#fff', px: { xs: 2.5, sm: 3 }, py: { xs: 2.5, sm: 3 }, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: '0.12em', lineHeight: 1.6 }}>
            {finished ? 'Module complete' : first ? `Hey ${first}, enjoying it?` : 'Enjoying the course?'}
          </Typography>
          <Typography id="drink-title" variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1, mt: 0.5 }}>
            {finished ? `Thank you${first ? ', ' + first : ''}!` : 'Buy me a drink'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            {finished
              ? `Thanks for completing ${finished.number ? `Module ${finished.number}: ` : ''}${finished.title}. If you like this content, please consider buying me a drink. The course is free and one person makes it.`
              : 'The whole course is free. One person makes it.'}
          </Typography>
        </Box>
        <DrinkArt />
      </Box>

      <DonateBody active={open} onClose={close} account={account} onAccount={onAccount} holdLeft={holdLeft} />
    </Dialog>
  );
}
