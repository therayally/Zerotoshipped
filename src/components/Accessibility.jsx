import { useEffect, useState } from 'react';
import { Box, Button, Dialog, FormControlLabel, IconButton, Switch, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { GlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccessibilityNewRounded from '@mui/icons-material/AccessibilityNewRounded';

// Accessibility settings each person can turn on for themselves. Saved in this browser only.
export const A11Y_DEFAULTS = { textSize: 1, contrast: false, reduceMotion: false, underlineLinks: false, spacing: false };

export function loadA11y() {
  try { return { ...A11Y_DEFAULTS, ...JSON.parse(localStorage.getItem('zts.a11y') || '{}') }; } catch { return { ...A11Y_DEFAULTS }; }
}
export function saveA11y(p) { try { localStorage.setItem('zts.a11y', JSON.stringify(p)); } catch { /* storage unavailable */ } }

// Page-wide effects of the settings that are not part of the color theme.
export function A11yStyles({ prefs }) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.zoom = prefs.textSize === 1 ? '' : String(prefs.textSize);
  }, [prefs.textSize]);
  return (
    <GlobalStyles styles={{
      ...(prefs.reduceMotion && { '*, *::before, *::after': { animation: 'none !important', transition: 'none !important', scrollBehavior: 'auto !important' } }),
      ...(prefs.underlineLinks && { 'a, a *': { textDecoration: 'underline !important', textUnderlineOffset: '3px' } }),
      ...(prefs.spacing && { 'p, li, td, .MuiTypography-root': { letterSpacing: '0.03em !important', wordSpacing: '0.12em !important', lineHeight: '1.9 !important' } }),
    }} />
  );
}

const SIZES = [[1, 'Normal'], [1.15, 'Large'], [1.3, 'Extra large']];

export function A11yDialog({ open, onClose, prefs, setPrefs }) {
  const { t } = useTheme();
  const set = (k, v) => { const next = { ...prefs, [k]: v }; setPrefs(next); saveA11y(next); };
  const row = (k, label, help) => (
    <Box sx={{ py: 1.25, borderTop: `1px solid ${t.border}` }}>
      <FormControlLabel control={<Switch checked={!!prefs[k]} onChange={(e) => set(k, e.target.checked)} />} label={<Typography sx={{ fontWeight: 600 }}>{label}</Typography>} sx={{ m: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse' }} />
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>{help}</Typography>
    </Box>
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="a11y-title">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
          <AccessibilityNewRounded sx={{ color: t.accent }} />
          <Typography id="a11y-title" variant="h5" component="h2">Accessibility</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Make TinyAppCode easier to read and use. These settings are saved on this device.</Typography>
        <Typography sx={{ fontWeight: 600, mb: 1 }} id="a11y-size">Text size</Typography>
        <ToggleButtonGroup exclusive fullWidth value={prefs.textSize} onChange={(_, v) => v && set('textSize', v)} aria-labelledby="a11y-size" sx={{ mb: 2 }}>
          {SIZES.map(([v, l]) => <ToggleButton key={v} value={v} sx={{ textTransform: 'none', fontWeight: 600 }}>{l}</ToggleButton>)}
        </ToggleButtonGroup>
        {row('contrast', 'High contrast', 'Darker text and stronger colors and borders.')}
        {row('reduceMotion', 'Reduce motion', 'Turns off animations and moving effects.')}
        {row('underlineLinks', 'Underline links', 'Makes every link easy to spot without relying on color.')}
        {row('spacing', 'Easier reading spacing', 'More space between letters, words and lines. Helpful for dyslexia.')}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Button onClick={() => { setPrefs({ ...A11Y_DEFAULTS }); saveA11y({ ...A11Y_DEFAULTS }); }} sx={{ color: 'text.secondary' }}>Reset</Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button href="/accessibility" target="_blank" sx={{ color: t.accentText }}>Accessibility statement</Button>
            <Button variant="contained" onClick={onClose}>Done</Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

// Small round button that opens the settings. Shown in the top bar, and floating on pages without one.
export function A11yButton({ onClick, floating }) {
  const { t } = useTheme();
  const btn = (
    <Tooltip title="Accessibility settings">
      <IconButton onClick={onClick} aria-label="Accessibility settings" sx={{ border: `1px solid ${t.border}`, background: floating ? t.surface : undefined, '&:hover': { background: t.surface2 } }}>
        <AccessibilityNewRounded fontSize="small" />
      </IconButton>
    </Tooltip>
  );
  if (!floating) return btn;
  return <Box sx={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1400, boxShadow: '0 4px 14px rgba(0,0,0,0.25)', borderRadius: '50%', '@media print': { display: 'none' } }}>{btn}</Box>;
}
