import { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useTheme } from '@mui/material/styles';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import SkipNextRounded from '@mui/icons-material/SkipNextRounded';
import { allLessons } from '../content/course';
import { metaFor } from '../content/meta';
import Blocks, { MasterRef } from './Blocks';
import Figure from './Figures';
import { HeroBanner, LogoTile } from './Art';
import LegalNote from './LegalNote';

function Chip({ children, onClick, title }) {
  const { t } = useTheme();
  return (
    <Box component={onClick ? 'button' : 'span'} onClick={onClick} title={title}
      sx={{ all: onClick ? 'unset' : undefined, cursor: onClick ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center', gap: 0.6, height: 30, px: 1.25, borderRadius: '2px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)', '&:hover': onClick ? { background: 'rgba(255,255,255,0.28)' } : undefined, '&:focus-visible': { outline: `2px solid ${t.accent}` } }}>
      {children}
    </Box>
  );
}

export default function Lesson({ lesson, index, onBack, onNext, onSkipModule, complete, setComplete }) {
  const { t } = useTheme();
  const total = allLessons.length;
  const isLast = index === total - 1;
  const meta = metaFor(lesson.moduleId);

  // Reaching the end of a lesson marks it complete, unless the person unmarked it themselves on this visit.
  const endRef = useRef(null);
  const userUnmarked = useRef(false);
  useEffect(() => { userUnmarked.current = false; }, [lesson.id]);
  useEffect(() => {
    const el = endRef.current;
    if (!el || complete || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userUnmarked.current && window.scrollY > 200) { setComplete(true); io.disconnect(); }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [lesson.id, complete, setComplete]);
  const toggle = () => { if (complete) userUnmarked.current = true; setComplete(!complete); };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pb: 4 }}>
      <HeroBanner moduleId={lesson.moduleId} eyebrow={`Module ${lesson.moduleIndex} · ${lesson.moduleTitle}`} title={lesson.title} height={230}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          <Chip><ScheduleRounded sx={{ fontSize: 15 }} />{lesson.minutes} min</Chip>
          <Chip>Step {index + 1} of {total}</Chip>
          <Chip onClick={toggle} title={complete ? 'Click to mark as not done' : 'Mark this lesson complete'}>
            {complete ? <CheckCircleRounded sx={{ fontSize: 16 }} /> : <RadioButtonUncheckedRounded sx={{ fontSize: 16 }} />}
            {complete ? 'Completed' : 'Mark complete'}
          </Chip>
          {onSkipModule && <Chip onClick={onSkipModule} title="Already know this? Jump to the next module.">Skip module <SkipNextRounded sx={{ fontSize: 16 }} /></Chip>}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.75, ml: 'auto' }}>
            {meta.tools.map((ic) => <LogoTile key={ic.title} icon={ic} size={30} glass />)}
          </Box>
        </Box>
      </HeroBanner>

      <Box sx={{ maxWidth: 760, mx: 'auto', mt: 2 }}>
        <Blocks key={lesson.id} blocks={lesson.body.slice(0, 1)} />
        {lesson.figure && <Figure name={lesson.figure} />}
        <Blocks key={lesson.id + '-rest'} blocks={lesson.body.slice(1)} />
        <MasterRef />
        <LegalNote sx={{ mt: 3 }} />
        <Box ref={endRef} aria-hidden="true" sx={{ height: '1px' }} />

        <Box sx={{ position: 'sticky', bottom: 0, zIndex: 5, mt: 5, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 1.5, py: 1.5, background: t.bg, borderTop: `1px solid ${t.border}` }}>
          <Box>
            <Button variant="outlined" onClick={onBack} disabled={index === 0} startIcon={<ArrowBackRounded />} sx={{ whiteSpace: 'nowrap' }}>Back</Button>
          </Box>
          <Box component="button" onClick={toggle} title={complete ? 'Click to mark as not done' : 'Mark this lesson complete'}
            sx={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1, py: 0.5, borderRadius: '3px', color: complete ? t.teal : 'text.secondary', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontWeight: 600, fontSize: 14, '&:hover': { background: t.surface2 }, '&:focus-visible': { outline: `2px solid ${t.accent}` } }}>
            {complete ? <CheckCircleRounded sx={{ fontSize: 18 }} /> : <RadioButtonUncheckedRounded sx={{ fontSize: 18 }} />}
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{complete ? 'Completed' : 'Mark complete'} ·</Box> {index + 1} / {total}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={onNext} endIcon={isLast ? null : <ArrowForwardRounded />} sx={{ whiteSpace: 'nowrap' }}>
              {isLast ? 'Finish' : 'Done, next'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
