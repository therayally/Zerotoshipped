import { Box, Typography } from '@mui/material';

// The small print shown under lessons, the course home, the prompt library and the landing page footer.
export const LEGAL_LINKS = [['Terms', '/terms'], ['Privacy', '/privacy'], ['Disclaimer', '/disclaimer'], ['Accessibility', '/accessibility']];

export default function LegalNote({ align = 'center', newTab = true, sx }) {
  const link = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 };
  return (
    <Box component="aside" aria-label="Legal" sx={{ color: 'text.secondary', textAlign: align, ...sx }}>
      <Typography sx={{ fontSize: 12.5, lineHeight: 1.6, maxWidth: 760, mx: align === 'center' ? 'auto' : 0 }}>
        TinyAppCode is for education only and is not legal, financial, tax or security advice. AI tools can make mistakes, so review anything they build before you use it. Time estimates and examples are not a promise of results. TinyAppCode is independent and not affiliated with or endorsed by Anthropic or any company named; trademarks belong to their owners. Some links are labeled partner links.
      </Typography>
      <Typography sx={{ fontSize: 12.5, mt: 1 }}>
        © {new Date().getFullYear()} TheRayAlly
        {LEGAL_LINKS.map(([l, h]) => (
          <span key={h}>{' · '}<Box component="a" href={h} {...(newTab ? { target: '_blank', rel: 'noopener' } : {})} sx={link}>{l}</Box></span>
        ))}
      </Typography>
    </Box>
  );
}
