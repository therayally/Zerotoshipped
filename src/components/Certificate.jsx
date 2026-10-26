import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkspacePremiumRounded from '@mui/icons-material/WorkspacePremiumRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import PrintRounded from '@mui/icons-material/PrintRounded';
import NorthEastRounded from '@mui/icons-material/NorthEastRounded';
import { getCertificate, issueCertificate } from '../account';

const SITE = 'https://tinyappcode.com';

// Asks for the name to print, then issues the certificate and opens its page.
export function ClaimCertificate({ open, onClose, track, account }) {
  const { t } = useTheme();
  const [name, setName] = useState(account?.name || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { if (open) { setName(account?.name || ''); setErr(''); } }, [open, account]);
  const claim = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const { id } = await issueCertificate(track.id, name.trim());
      window.location.href = `/certificate/${id}`;
    } catch (ex) { setErr(ex.message); setBusy(false); }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={claim} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WorkspacePremiumRounded sx={{ fontSize: 40, color: t.accent }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>You did it!</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{track?.title}</Typography>
          </Box>
        </Box>
        <Typography variant="body2">Type your name exactly as you want it printed on your certificate.</Typography>
        <TextField label="Name on certificate" value={name} onChange={(e) => setName(e.target.value)} required inputProps={{ maxLength: 80 }} autoFocus />
        {err && <Typography variant="body2" role="alert" sx={{ color: t.warn, fontWeight: 600 }}>{err}</Typography>}
        <Button type="submit" variant="contained" size="large" disabled={busy || !name.trim()}>{busy ? 'Making it…' : 'Get my certificate'}</Button>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Not now</Button>
      </Box>
    </Dialog>
  );
}

// tinyappcode.com/certificate/<id>: a printable, shareable certificate anyone can verify.
export function CertificatePage({ id }) {
  const { t } = useTheme();
  const [cert, setCert] = useState(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => { getCertificate(id).then(setCert).catch(() => setCert(null)); }, [id]);
  useEffect(() => { if (cert) document.title = `${cert.name} · ${cert.track_title} · TinyAppCode`; }, [cert]);
  const url = `${SITE}/certificate/${id}`;
  if (cert === undefined) return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  if (!cert) return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}><Typography variant="h5">We could not find that certificate.</Typography></Box>;
  const issued = new Date(cert.issued_at);
  const date = issued.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const linkedin = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.track_title)}&organizationName=TinyAppCode&issueYear=${issued.getFullYear()}&issueMonth=${issued.getMonth() + 1}&certUrl=${encodeURIComponent(url)}&certId=${encodeURIComponent(cert.id)}`;
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const copy = async () => { try { await navigator.clipboard.writeText(url); } catch { /* blocked */ } setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <Box sx={{ minHeight: '100vh', background: t.bg, py: { xs: 3, sm: 6 }, px: 2, '@media print': { background: '#fff', p: 0 } }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Box sx={{ position: 'relative', aspectRatio: { sm: '1.414 / 1' }, background: '#fff', color: '#16161D', borderRadius: '6px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden', '@media print': { boxShadow: 'none', borderRadius: 0 } }}>
          <Box sx={{ position: 'absolute', inset: 14, border: '2px solid #E3E6EF', borderRadius: '4px' }} />
          <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: t.grad }} />
          <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: { xs: 3, sm: 8 }, py: { xs: 5, sm: 4 }, gap: { xs: 1.5, sm: 1.25 } }}>
            <Box component="img" src="/brand/logo-full.png" alt="TinyAppCode" sx={{ height: { xs: 110, sm: 130 } }} />
            <Typography sx={{ letterSpacing: '0.3em', fontSize: 13, fontWeight: 700, color: '#5A6072', mt: 1 }}>CERTIFICATE OF COMPLETION</Typography>
            <Typography sx={{ fontSize: 15, color: '#5A6072' }}>This certifies that</Typography>
            <Typography sx={{ fontSize: { xs: 32, sm: 44 }, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.01em' }}>{cert.name}</Typography>
            <Typography sx={{ fontSize: 15, color: '#5A6072', maxWidth: 560 }}>has completed all {cert.lessons} lessons of</Typography>
            <Typography sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, background: t.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{cert.track_title}</Typography>
            <Box sx={{ display: 'flex', gap: { xs: 3, sm: 8 }, mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box><Typography sx={{ fontWeight: 700 }}>{date}</Typography><Typography sx={{ fontSize: 12.5, color: '#5A6072' }}>Date issued</Typography></Box>
              <Box><Typography sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{cert.id}</Typography><Typography sx={{ fontSize: 12.5, color: '#5A6072' }}>Certificate ID</Typography></Box>
            </Box>
            <Typography sx={{ fontSize: 12, color: '#8A90A0', mt: 1 }}>Verify at tinyappcode.com/certificate/{cert.id}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', justifyContent: 'center', mt: 3, '@media print': { display: 'none' } }}>
          <Button variant="contained" href={linkedin} target="_blank" rel="noopener noreferrer" endIcon={<NorthEastRounded />}>Add to LinkedIn profile</Button>
          <Button variant="outlined" href={share} target="_blank" rel="noopener noreferrer" endIcon={<NorthEastRounded />}>Share on LinkedIn</Button>
          <Button variant="outlined" onClick={copy} startIcon={copied ? <CheckRounded /> : <ContentCopyRounded />}>{copied ? 'Copied' : 'Copy link'}</Button>
          <Button variant="outlined" onClick={() => window.print()} startIcon={<PrintRounded />}>Save as PDF</Button>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2, '@media print': { display: 'none' } }}>
          <Button href="/" sx={{ color: t.accentText }}>Take the free course at tinyappcode.com →</Button>
        </Box>
      </Box>
    </Box>
  );
}
