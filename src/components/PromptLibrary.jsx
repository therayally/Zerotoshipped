import { useMemo, useState } from 'react';
import { Box, Button, Chip, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchRounded from '@mui/icons-material/SearchRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { allLessons, TRACKS } from '../content/course';
import { PromptBox } from './Blocks';
import { MASTER_LABEL, MASTER_PROMPT } from '../content/master';

// Every copy-and-paste prompt in the course, collected from the lessons (including "Go deeper" sections).
function collect() {
  const out = [];
  const walk = (blocks, lesson) => (blocks || []).forEach((b) => {
    if (b.t === 'prompt' && b.text !== MASTER_PROMPT) out.push({ label: b.label || 'Prompt', text: b.text, lesson });
    if (b.t === 'deeper') walk(b.blocks, lesson);
  });
  allLessons.forEach((l) => walk(l.body, l));
  return out;
}

export default function PromptLibrary({ go }) {
  const { t } = useTheme();
  const all = useMemo(collect, []);
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState(0);
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = all.filter((p) => (!track || p.lesson.track === track)
    && words.every((w) => `${p.label} ${p.text} ${p.lesson.title} ${p.lesson.moduleTitle}`.toLowerCase().includes(w)));
  const groups = [];
  for (const p of shown) {
    const last = groups[groups.length - 1];
    if (last && last.module === p.lesson.moduleTitle) last.items.push(p);
    else groups.push({ module: p.lesson.moduleTitle, items: [p] });
  }
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: { xs: 12, md: 6 }, maxWidth: 820, mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>Prompt library</Typography>
      <Typography sx={{ color: 'text.secondary', mt: 1 }}>
        All {all.length} copy-and-paste prompts from the course in one place. Fill in the [BRACKETS] with your own details, then paste into Claude.
      </Typography>
      <Box sx={{ position: 'sticky', top: 64, zIndex: 4, background: t.bg, pt: 2, pb: 1.5 }}>
        <TextField fullWidth value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prompts: stripe, database, security, hooks…" inputProps={{ 'aria-label': 'Search prompts' }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment>, sx: { borderRadius: '3px', background: t.surface } } }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 1.25, flexWrap: 'wrap' }}>
          {[[0, 'All'], ...TRACKS.map((tr) => [tr.id, tr.short])].map(([id, l]) => (
            <Chip key={id} label={l} onClick={() => setTrack(id)} color={track === id ? 'secondary' : 'default'} variant={track === id ? 'filled' : 'outlined'} sx={{ fontWeight: 600 }} />
          ))}
          <Typography sx={{ ml: 'auto', alignSelf: 'center', fontSize: 13, color: t.muted }}>{shown.length} shown</Typography>
        </Box>
      </Box>
      {!words.length && (
        <Box component="section" sx={{ mt: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>Start here: the Master Prompt</Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>Every rule from the course in one paste. Use it at the start of every new project; Claude saves it as CLAUDE.md so it never forgets.</Typography>
          <PromptBox label={MASTER_LABEL} text={MASTER_PROMPT} />
        </Box>
      )}
      {groups.map((g) => (
        <Box key={g.module + g.items[0].lesson.id} component="section" sx={{ mt: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>{g.module}</Typography>
          {g.items.map((p, i) => (
            <Box key={p.lesson.id + i}>
              <PromptBox label={p.label} text={p.text} />
              <Button size="small" onClick={() => go(p.lesson.id)} endIcon={<ArrowForwardRounded fontSize="small" />} sx={{ mt: -1.5, mb: 1, color: t.accentText }}>
                From the lesson: {p.lesson.title}
              </Button>
            </Box>
          ))}
        </Box>
      ))}
      {!shown.length && <Typography sx={{ mt: 4, color: 'text.secondary' }}>No prompts match. Try a different word.</Typography>}
    </Box>
  );
}
