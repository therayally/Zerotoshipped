import { keyframes } from '@emotion/react';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import ChatBubbleRounded from '@mui/icons-material/ChatBubbleRounded';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import RocketLaunchRounded from '@mui/icons-material/RocketLaunchRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import { allLessons, TRACKS, lessonsInTrack } from '../content/course';
import { logo } from '../content/logos';
import { Logo } from './Panels';
import { LogoTile } from './Art';
import { useInView } from './Blocks';

// The public front page at tinyappcode.com for anyone not signed in: what this is, why it is fun, who made it, and the doors in.
const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }`;
const still = { '@media (prefers-reduced-motion: reduce)': { animation: 'none', transition: 'none', opacity: 1, transform: 'none' } };

const minutes = (track) => allLessons.filter((l) => l.track === track).reduce((n, l) => n + (l.minutes || 0), 0);
const promptCount = (() => {
  const walk = (bs) => (bs || []).reduce((n, b) => n + (b.t === 'prompt' ? 1 : 0) + (b.t === 'deeper' ? walk(b.blocks) : 0), 0);
  return allLessons.reduce((n, l) => n + walk(l.body), 0);
})();
const firstAppHours = Math.round(minutes(1) / 60);

function Reveal({ children, delay = 0 }) {
  const [ref, seen] = useInView();
  return (
    <Box ref={ref} sx={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(18px)', transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s`, ...still }}>
      {children}
    </Box>
  );
}

function Section({ id, eyebrow, title, intro, children, tint }) {
  const { t } = useTheme();
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-title`} sx={{ py: { xs: 7, md: 11 }, px: 2, background: tint ? t.surface : 'transparent', scrollMarginTop: 64 }}>
      <Box sx={{ maxWidth: 1120, mx: 'auto' }}>
        <Reveal>
          <Typography sx={{ color: t.accentText, fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{eyebrow}</Typography>
          <Typography id={`${id}-title`} variant="h3" component="h2" sx={{ fontWeight: 800, mt: 1, fontSize: { xs: '1.9rem', md: '2.6rem' }, lineHeight: 1.15, maxWidth: 760 }}>{title}</Typography>
          {intro && <Typography sx={{ color: 'text.secondary', mt: 1.5, fontSize: { xs: '1.05rem', md: '1.15rem' }, maxWidth: 720 }}>{intro}</Typography>}
        </Reveal>
        <Box sx={{ mt: { xs: 4, md: 6 } }}>{children}</Box>
      </Box>
    </Box>
  );
}

function Shot({ src, alt, phone }) {
  const { t } = useTheme();
  return (
    <Box sx={{ borderRadius: phone ? '28px' : '10px', overflow: 'hidden', border: phone ? '8px solid #111' : `1px solid ${t.border}`, boxShadow: '0 24px 60px rgba(20,30,90,0.22)', background: '#fff', maxWidth: phone ? 300 : 'none', mx: phone ? 'auto' : 0 }}>
      {!phone && (
        <Box sx={{ display: 'flex', gap: 0.75, px: 1.5, py: 1, background: t.surface2, borderBottom: `1px solid ${t.border}` }} aria-hidden="true">
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </Box>
      )}
      <Box component="img" src={src} alt={alt} loading="lazy" sx={{ display: 'block', width: '100%', height: 'auto' }} />
    </Box>
  );
}

export default function Landing({ onLogin, onSignup, colorMode, toggleColor }) {
  const { t } = useTheme();
  const tools = ['claude', 'github', 'vercel', 'neon', 'stripe', 'square', 'cloudflare', 'figma'].map(logo);
  const cta = (big) => (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', md: big ? 'flex-start' : 'center' } }}>
      <Button variant="contained" size="large" onClick={onSignup} endIcon={<ArrowForwardRounded />} sx={{ px: 3, py: 1.4, fontSize: '1.05rem' }}>Start free</Button>
      <Button variant="outlined" size="large" onClick={onLogin} sx={{ px: 3, py: 1.4, fontSize: '1.05rem', color: big ? '#fff' : undefined, borderColor: big ? 'rgba(255,255,255,0.5)' : undefined, background: big ? 'rgba(255,255,255,0.08)' : undefined, '&:hover': big ? { borderColor: '#fff', background: 'rgba(255,255,255,0.16)' } : undefined }}>I have an account</Button>
    </Box>
  );

  return (
    <Box sx={{ background: t.bg, minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Top bar: logo, section links, and the sign-in doors */}
      <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 20, background: t.surface, borderBottom: `1px solid ${t.border}`, backdropFilter: 'blur(8px)' }}>
        <Box sx={{ maxWidth: 1120, mx: 'auto', px: 2, height: 64, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box component="a" href="/" aria-label="TinyAppCode home"><Logo size={20} /></Box>
          <Box component="nav" aria-label="Page" sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 3 }}>
            {[['#vibe', 'What is vibe coding?'], ['#inside', 'Inside the course'], ['#ray', 'Meet the developer'], ['#faq', 'FAQ']].map(([h, l]) => (
              <Box key={h} component="a" href={h} sx={{ color: 'text.secondary', textDecoration: 'none', fontWeight: 600, fontSize: 14.5, '&:hover': { color: 'text.primary' } }}>{l}</Box>
            ))}
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button onClick={toggleColor} aria-label={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} sx={{ minWidth: 40, width: 40, height: 40, color: 'text.secondary' }}>
              {colorMode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </Button>
            <Button variant="outlined" onClick={onLogin} sx={{ whiteSpace: 'nowrap' }}>Log in</Button>
            <Button variant="contained" onClick={onSignup} sx={{ whiteSpace: 'nowrap', display: { xs: 'none', sm: 'inline-flex' } }}>Start free</Button>
          </Box>
        </Box>
      </Box>

      <main>
        {/* Hero */}
        <Box component="section" aria-labelledby="hero-title" sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: 'linear-gradient(135deg, #0B1033 0%, #1B2A8F 45%, #4B2BB5 100%)', px: 2, pt: { xs: 6, md: 9 }, pb: { xs: 7, md: 10 },
          '&::before': { content: '""', position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)' } }}>
          <Box sx={{ position: 'relative', maxWidth: 1120, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: { xs: 4, md: 6 }, alignItems: 'center' }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.6, borderRadius: '99px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', fontWeight: 700, fontSize: 14 }}>
                <AutoAwesomeRounded sx={{ fontSize: 17 }} /> Learn to vibe code in a few hours. Free.
              </Box>
              <Typography id="hero-title" variant="h1" sx={{ fontWeight: 800, mt: 2.5, fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' }, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Build real apps just by talking to AI.
              </Typography>
              <Typography sx={{ mt: 2.5, fontSize: { xs: '1.1rem', md: '1.25rem' }, opacity: 0.92, maxWidth: 560, mx: { xs: 'auto', md: 0 } }}>
                TinyAppCode is a free course that takes you from "I have never coded" to a real app, live on the internet, taking payments. You describe what you want in plain English, the AI writes the code, and we show you every click.
              </Typography>
              <Box sx={{ mt: 4 }}>{cta(true)}</Box>
              <Box sx={{ mt: 3, display: 'flex', gap: { xs: 1.5, sm: 3 }, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, opacity: 0.9, fontSize: 14.5 }}>
                {['No coding experience needed', 'No ads, no paywall', 'Certificate for LinkedIn'].map((x) => (
                  <Box key={x} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><CheckCircleRounded sx={{ fontSize: 17, color: '#7CE0FF' }} />{x}</Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: 'grid', placeItems: 'center' }}>
              <Box component="img" src="/brand/logo-full-dark.png" alt="The TinyAppCode mascot coding on a laptop next to a sleeping cat" sx={{ width: { xs: '82%', md: '100%' }, maxWidth: 480, height: 'auto', animation: `${float} 6s ease-in-out infinite`, ...still }} />
            </Box>
          </Box>
        </Box>

        {/* Fast-start numbers */}
        <Box sx={{ px: 2, mt: { xs: -4, md: -5 }, position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: 1000, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, background: t.surface, borderRadius: '6px', boxShadow: t.shadow, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
            {[['~1 hour', 'to understand vibe coding and talk to Claude like a pro'], [`~${firstAppHours} hours`, 'to your first app, live online and taking payments'], [String(allLessons.length), 'bite-size lessons, most under 15 minutes'], [String(promptCount), 'copy-and-paste prompts, ready to use']].map(([n, l], i) => (
              <Box key={l} sx={{ p: { xs: 2, md: 3 }, textAlign: 'center', borderRight: { md: i < 3 ? `1px solid ${t.border}` : 'none' }, borderLeft: { xs: i % 2 ? `1px solid ${t.border}` : 'none', md: 'none' }, borderTop: { xs: i > 1 ? `1px solid ${t.border}` : 'none', md: 'none' } }}>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.7rem', md: '2.2rem' }, background: t.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{n}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 0.5 }}>{l}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* What vibe coding is */}
        <Section id="vibe" eyebrow="What is vibe coding?" title="You are the director. The AI is your whole film crew."
          intro="Vibe coding means building software by describing what you want, instead of typing the code yourself. You say what you want, look at what the AI made, and steer it until it is right. No computer science degree required.">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 6 }, alignItems: 'center' }}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {[[ChatBubbleRounded, '1. You describe it', '"Make me a booking page for my barber shop where customers pick a time and pay a deposit."'],
                [AutoAwesomeRounded, '2. The AI builds it', 'Claude Code writes the code, sets up the database and connects the payments, explaining each step in plain words.'],
                [RocketLaunchRounded, '3. You ship it', 'You check it on your phone, ask for changes, then put it live on your own web address for real customers.'],
              ].map(([Icon, h, p], i) => (
                <Reveal key={h} delay={i * 0.08}>
                  <Box sx={{ display: 'flex', gap: 2, p: 2.5, borderRadius: '6px', background: t.surface, border: `1px solid ${t.border}` }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: '4px', background: t.grad, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ color: '#fff' }} /></Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{h}</Typography>
                      <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{p}</Typography>
                    </Box>
                  </Box>
                </Reveal>
              ))}
            </Box>
            <Reveal delay={0.1}>
              <Box aria-label="Example conversation with Claude" role="img" sx={{ borderRadius: '10px', background: t.code, p: { xs: 2, md: 3 }, boxShadow: '0 24px 60px rgba(20,30,90,0.25)', fontSize: 15 }}>
                <Box sx={{ display: 'flex', gap: 0.75, mb: 2 }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}</Box>
                <Box sx={{ ml: 'auto', maxWidth: '85%', background: '#3B5BFF', color: '#fff', p: 1.5, borderRadius: '12px 12px 2px 12px', width: 'fit-content' }}>Make me a booking page for my barber shop. Customers pick a time and pay a $10 deposit.</Box>
                <Box sx={{ mt: 1.5, maxWidth: '88%', background: 'rgba(255,255,255,0.08)', color: '#E6E9F5', p: 1.5, borderRadius: '12px 12px 12px 2px' }}>
                  Done. I built the booking page, a calendar for your open times, and Square checkout for the deposit. Here is your preview link to try on your phone. Want me to text you when someone books?
                </Box>
                <Box sx={{ ml: 'auto', mt: 1.5, maxWidth: '85%', background: '#3B5BFF', color: '#fff', p: 1.5, borderRadius: '12px 12px 2px 12px', width: 'fit-content' }}>Yes! And make it dark blue. 😎</Box>
              </Box>
            </Reveal>
          </Box>
        </Section>

        {/* Inside the course: real lesson screenshots */}
        <Section id="inside" tint eyebrow="Inside the course" title="Plain words, real screenshots, and prompts you just copy."
          intro="Every lesson is short, explains why before how, compares hard ideas to everyday things, and ends with a quick check. When it is time to build, you copy a prompt, paste it into Claude, and watch it work.">
          <Box sx={{ display: 'grid', gap: { xs: 6, md: 9 } }}>
            {[
              ['tour-home.jpg', 'The TinyAppCode course home page showing module cards and progress', 'Two tracks, one clear path', 'Start with Track 1 and ship one real app. Come back for Track 2 when you want to build like a pro team.', TRACKS.map((tr) => `${tr.short}: ${lessonsInTrack(tr.id).length} lessons`)],
              ['tour-lesson.jpg', 'A lesson with numbered steps and a highlighted screenshot of Figma', 'Every click, shown', 'Numbered steps with the reason for each one, and real screenshots with the exact button highlighted.', ['Step-by-step, with "why"', 'Real screenshots', 'Check-yourself questions']],
              ['tour-prompts.jpg', 'The prompt library with the Master Prompt pinned at the top', `${promptCount} copy-and-paste prompts`, 'One Master Prompt holds every rule (security, design, saving your work). Paste it once and Claude follows it for your whole project.', ['Master Prompt with all the rules', 'Search every prompt', 'Fill in the [BRACKETS]']],
            ].map(([src, alt, h, p, ticks], i) => (
              <Box key={src} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: i % 2 ? '1fr 1.4fr' : '1.4fr 1fr' }, gap: { xs: 3, md: 6 }, alignItems: 'center' }}>
                <Box sx={{ order: { xs: 0, md: i % 2 ? 1 : 0 } }}><Reveal><Shot src={`/shots/${src}`} alt={alt} /></Reveal></Box>
                <Reveal delay={0.1}>
                  <Typography variant="h4" component="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' } }}>{h}</Typography>
                  <Typography sx={{ color: 'text.secondary', mt: 1.25, fontSize: '1.08rem' }}>{p}</Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'grid', gap: 1 }}>
                    {ticks.map((x) => <Box component="li" key={x} sx={{ display: 'flex', gap: 1, alignItems: 'center', fontWeight: 600 }}><CheckCircleRounded sx={{ color: t.teal, fontSize: 20 }} />{x}</Box>)}
                  </Box>
                </Reveal>
              </Box>
            ))}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' }, gap: { xs: 3, md: 6 }, alignItems: 'center' }}>
              <Reveal><Shot phone src="/shots/tour-phone.jpg" alt="A TinyAppCode lesson open on a phone" /></Reveal>
              <Reveal delay={0.1}>
                <Typography variant="h4" component="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' } }}>Learn on your phone, build on your computer</Typography>
                <Typography sx={{ color: 'text.secondary', mt: 1.25, fontSize: '1.08rem' }}>Read a lesson on your lunch break, then build it that evening. Your progress follows your account everywhere, with dark mode and accessibility settings built in.</Typography>
                <Typography sx={{ fontWeight: 700, mt: 3 }}>The tools you will use (all with free plans to start):</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>{tools.map((ic) => <LogoTile key={ic.title} icon={ic} size={44} />)}</Box>
              </Reveal>
            </Box>
          </Box>
        </Section>

        {/* What you will build */}
        <Section id="build" eyebrow="What you will build" title="Real things for real people, not toy demos."
          intro="By the end of Track 1 you have one simple app, live on your own web address, with sign-in, a database and payments. Track 2 adds the pro stuff.">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {[['Booking and appointment apps', 'For barbers, tutors, trainers and anyone with a calendar'], ['Phone scanning apps', 'Scan barcodes or snap receipts with a phone camera'], ['AI that knows your docs', 'A chatbot that answers from your own files (RAG)'], ['Subscription apps', 'Monthly memberships with Stripe or Square'], ['Admin dashboards', 'Manage users, data and payments like a real company'], ['Your own AI agents', 'Helpers that run errands for you, safely']].map(([h, p], i) => (
              <Reveal key={h} delay={(i % 3) * 0.06}>
                <Box sx={{ p: 2.5, height: '100%', borderRadius: '6px', background: t.surface, border: `1px solid ${t.border}` }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.08rem' }}>{h}</Typography>
                  <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{p}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Section>

        {/* Meet the developer */}
        <Section id="ray" tint eyebrow="Meet the developer" title="Ray Ally, artist turned AI builder.">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.55fr 1.45fr' }, gap: { xs: 4, md: 6 }, alignItems: 'start' }}>
            <Reveal>
              <Box component="img" src="/brand/ray.jpg" alt="Ray Ally, the creator of TinyAppCode, in a portrait lit with orange and purple light" loading="lazy"
                sx={{ width: '100%', maxWidth: { xs: 220, md: 280 }, aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: '10px', display: 'block', mx: 'auto', boxShadow: '0 24px 60px rgba(20,30,90,0.25)' }} />
            </Reveal>
            <Reveal delay={0.1}>
              {[
                'Ray Ally is a graphic designer, photographer, videographer and AI artist with more than twenty years of creative and entrepreneurial experience. He studied at the Art Institute before leaving to pursue his passion for art full time.',
                'Ray built his name in beauty and pageant photography, creating polished, editorial images for contestants, models and organizations connected to Miss United States, Miss America, Miss USA and Miss Earth. His work has appeared in publications, campaigns and portfolios.',
                'Before his creative career, Ray served in the United States Air Force. Over his professional career he also became an expert in cybersecurity, and that security background led him into AI development and building software with AI.',
                'Today Ray blends both worlds: a designer\'s eye for beautiful, easy-to-use apps and a security expert\'s habits for keeping customers\' data safe. He is co-owner of Backwater Hat Co. and creates cinematic content as The Ray Ally. TinyAppCode is his free course that teaches anyone to do what he does: build real apps with AI, the right way.',
              ].map((p, i) => (
                <Typography key={i} sx={{ fontSize: { xs: '1.05rem', md: '1.12rem' }, lineHeight: 1.7, mt: i ? 2 : 0 }}>{p}</Typography>
              ))}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2.5 }}>
                {['Graphic design', 'Photography', 'Videography', 'AI art', 'Cybersecurity', 'AI development', 'U.S. Air Force veteran'].map((x) => (
                  <Box key={x} sx={{ px: 1.25, py: 0.5, borderRadius: '99px', fontSize: 13.5, fontWeight: 600, background: t.accentSoft, color: t.accentText }}>{x}</Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 3 }}>
                <Button variant="contained" href="https://www.tiktok.com/@therayally" target="_blank" rel="noopener noreferrer">Follow @therayally on TikTok</Button>
                <Button variant="outlined" href="https://therayally.com" target="_blank" rel="noopener noreferrer">therayally.com</Button>
              </Box>
            </Reveal>
          </Box>
        </Section>

        {/* FAQ */}
        <Section id="faq" eyebrow="Questions" title="The honest answers.">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {[
              ['Is it really free?', 'Yes. Every lesson is free, with no ads and no paywall. If it helps you, you can buy Ray a drink, but you never have to.'],
              ['Do I need to know how to code?', 'No. The course starts from zero and explains every word. The AI writes the code; you learn to steer it, check it and keep it safe.'],
              ['Can I really learn in a few hours?', `The basics of vibe coding take about an hour. Track 1, which ends with your first app live online, is about ${firstAppHours} hours of short lessons. Go at your own pace.`],
              ['What do I need?', 'A Mac or Windows computer and a Claude plan that includes Claude Code (Pro is about $20 a month). GitHub, Vercel and the other tools have free plans to start.'],
              ['Do I get a certificate?', 'Yes. Finish a track and claim a free certificate with your name, a public link anyone can check, and a one-click button to add it to LinkedIn.'],
              ['Who is it for?', 'Complete beginners, small business owners, creators and side hustlers who want to build their own tools, and anyone curious about building with AI.'],
            ].map(([q, a], i) => (
              <Reveal key={q} delay={(i % 2) * 0.06}>
                <Box sx={{ p: 2.5, height: '100%', borderRadius: '6px', background: t.surface, border: `1px solid ${t.border}` }}>
                  <Typography component="h3" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>{q}</Typography>
                  <Typography sx={{ color: 'text.secondary', mt: 0.75 }}>{a}</Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Section>

        {/* Final call to action */}
        <Box component="section" aria-label="Get started" sx={{ px: 2, pb: { xs: 7, md: 10 } }}>
          <Reveal>
            <Box sx={{ maxWidth: 1000, mx: 'auto', textAlign: 'center', color: '#fff', borderRadius: '10px', p: { xs: 4, md: 7 }, background: 'linear-gradient(135deg, #1B2A8F 0%, #4B2BB5 100%)', boxShadow: '0 24px 60px rgba(20,30,90,0.25)' }}>
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>Your first app is a few hours away.</Typography>
              <Typography sx={{ mt: 1.5, opacity: 0.9, fontSize: '1.1rem' }}>Make a free account and start the first lesson in under a minute.</Typography>
              <Box sx={{ mt: 3.5 }}>{cta(true)}</Box>
            </Box>
          </Reveal>
        </Box>
      </main>

      <Box component="footer" sx={{ borderTop: `1px solid ${t.border}`, background: t.surface, px: 2, py: 5 }}>
        <Box sx={{ maxWidth: 1120, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: 3 }}>
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <Logo size={20} />
            <Typography sx={{ color: 'text.secondary', mt: 1.5, fontSize: 14, maxWidth: 320 }}>A free course for building real apps with AI, created by Ray Ally.</Typography>
          </Box>
          {[
            ['Course', [['Start free', onSignup], ['Log in', onLogin], ['Buy me a drink', '/donate']]],
            ['Follow', [['TikTok', 'https://www.tiktok.com/@therayally'], ['therayally.com', 'https://therayally.com']]],
            ['Legal', [['Terms', '/terms'], ['Privacy', '/privacy'], ['Accessibility', '/accessibility']]],
          ].map(([h, links]) => (
            <Box key={h} sx={{ display: 'grid', gap: 1, alignContent: 'start' }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{h}</Typography>
              {links.map(([l, to]) => typeof to === 'function'
                ? <Box key={l} component="button" onClick={to} sx={{ all: 'unset', cursor: 'pointer', color: 'text.secondary', fontSize: 14, '&:hover': { color: 'text.primary' }, '&:focus-visible': { outline: `2px solid ${t.accent}` } }}>{l}</Box>
                : <Box key={l} component="a" href={to} {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} sx={{ color: 'text.secondary', fontSize: 14, textDecoration: 'none', '&:hover': { color: 'text.primary' } }}>{l}</Box>)}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
