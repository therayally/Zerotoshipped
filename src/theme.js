import { createTheme, alpha } from '@mui/material/styles';

// Neutral frame, soft blue-purple accent, with teal, sky and coral as supporting colors.
const tokens = {
  light: {
    bg: '#F5F6FA',
    surface: '#FFFFFF',
    surface2: '#F3F4F9',
    border: '#E3E6EF',
    text: '#161A2E',
    text2: '#394062',
    muted: '#6E7591',
    accent: '#5B6CF2',
    accent2: '#3BA3F5',
    accentText: '#4351D6',
    accentSoft: '#ECEFFE',
    grad: 'linear-gradient(135deg, #6976F5 0%, #3FA6F5 100%)',
    teal: '#0F9F8F',
    tealSoft: '#E5F6F3',
    sky: '#2C8DE0',
    skySoft: '#E8F3FD',
    coral: '#E5604B',
    coralSoft: '#FDEEEA',
    easy: '#1E9E63',
    easySoft: '#E7F6EE',
    nerdy: '#4F6BEB',
    nerdySoft: '#ECF0FE',
    warn: '#D9503B',
    warnSoft: '#FDEEEA',
    code: '#161A2E',
    codeText: '#E9ECF5',
    shadow: '0 1px 2px rgba(22,26,46,0.05), 0 6px 18px rgba(22,26,46,0.06)',
  },
  dark: {
    bg: '#0D0F17',
    surface: '#151826',
    surface2: '#1B1F30',
    border: '#272C42',
    text: '#EEF0F8',
    text2: '#C3C8DA',
    muted: '#8A90A8',
    accent: '#8792FA',
    accent2: '#5DB6F7',
    accentText: '#A2ABFC',
    accentSoft: 'rgba(135,146,250,0.15)',
    grad: 'linear-gradient(135deg, #7682F7 0%, #46A9F5 100%)',
    teal: '#3CCFBD',
    tealSoft: 'rgba(60,207,189,0.13)',
    sky: '#5DB6F7',
    skySoft: 'rgba(93,182,247,0.13)',
    coral: '#F58A78',
    coralSoft: 'rgba(245,138,120,0.13)',
    easy: '#3FCB8A',
    easySoft: 'rgba(63,203,138,0.13)',
    nerdy: '#7F97FA',
    nerdySoft: 'rgba(127,151,250,0.14)',
    warn: '#F58A78',
    warnSoft: 'rgba(245,138,120,0.13)',
    code: '#090B12',
    codeText: '#E9ECF5',
    shadow: '0 1px 2px rgba(0,0,0,0.4), 0 6px 18px rgba(0,0,0,0.3)',
  },
};

export const FONT_DISPLAY = '"Outfit", system-ui, -apple-system, "Segoe UI", sans-serif';
export const FONT_BODY = FONT_DISPLAY;
export const FONT_MONO = '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace';

export function makeTheme(mode) {
  const t = tokens[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: t.text, contrastText: t.surface },
      secondary: { main: t.accent },
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.text, secondary: t.muted },
      divider: t.border,
    },
    t,
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: FONT_BODY,
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.15, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, fontSize: '1.3rem', letterSpacing: '-0.01em' },
      h6: { fontWeight: 600, fontSize: '1.1rem' },
      body1: { fontSize: '1.0625rem', lineHeight: 1.7 },
      body2: { fontSize: '0.9375rem', lineHeight: 1.55 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0, fontSize: '0.95rem' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: t.bg, color: t.text },
          '::selection': { background: alpha(t.accent, 0.25) },
          a: { color: t.accentText },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 4, minHeight: 42, paddingInline: 18, lineHeight: 1.2 },
          sizeSmall: { minHeight: 32, paddingInline: 12, borderRadius: 3, fontSize: '0.85rem' },
          containedPrimary: { background: t.grad, color: '#fff', boxShadow: `0 6px 16px ${t.accent}40`, '&:hover': { background: t.grad, filter: 'brightness(1.06)' } },
          outlined: { borderColor: t.border, color: t.text, background: t.surface, '&:hover': { borderColor: t.muted, background: t.surface2 } },
          text: { color: t.text2 },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 4, width: 42, height: 42 } },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 6, boxShadow: '0 24px 80px rgba(0,0,0,0.25)' } },
      },
      MuiTooltip: { styleOverrides: { tooltip: { fontSize: '0.8rem', borderRadius: 3 } } },
    },
  });
}
