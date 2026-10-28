// The course: two tracks built from the lesson files in ./modules. Each lesson has a single `body` of blocks.
// Track 1 ships one simple app to a real customer. Track 2 is how pros build, launch and run it.
import m00 from './modules/m00-start';
import m01 from './modules/m01-claude-code';
import m02 from './modules/m02-accounts';
import m03 from './modules/m03-plan';
import m04 from './modules/m04-build';
import m05 from './modules/m05-ui';
import m06 from './modules/m06-blocks';
import m07 from './modules/m07-data-money';
import m08 from './modules/m08-live';
import m09 from './modules/m09-secure';
import m10 from './modules/m10-grown-up';
import m11 from './modules/m11-power-tools';
import m12 from './modules/m12-agents';
import m13 from './modules/m13-ai-products';
import m14 from './modules/m14-capstone';
import m15 from './modules/m15-github';
import m16 from './modules/m16-product';
import m17 from './modules/m17-claude-pro';
import { buildMcp, aiCoders, evals, analytics } from './modules/m18-pro-tools';
import { grow, run } from './modules/m19-grow-run';
import { designPlus } from './modules/m20-design-plus';
import smartFeatures from './modules/m21-smart-features';
import { mobileApps, quality, authServices, aiBuilders, businessBasics } from './modules/m22-pro-gaps';
import { engineering, desktopShip, customerCare, appLegal } from './modules/m23-real-engineering';

const pick = (mod, ...ids) => ids.map((id) => {
  const lesson = mod.lessons.find((l) => l.id === id);
  if (!lesson) throw new Error(`Missing lesson ${id} in ${mod.id}`);
  return lesson;
});
const without = (mod, ...ids) => ({ ...mod, lessons: mod.lessons.filter((l) => !ids.includes(l.id)) });

export const TRACKS = [
  { id: 1, title: 'Track 1: Ship your first app', short: 'Ship your first app', blurb: 'One simple app, live, taking payments, in front of a real customer.' },
  { id: 2, title: 'Track 2: Build like a pro team', short: 'Build like a pro team', blurb: 'Product thinking, Scrum, Claude Code power tools, launch, and running it like a company.' },
];

const track1 = [
  m00,
  m01,
  without(m02, 'access-tokens'),
  { ...m03, title: 'Plan your app', lessons: pick(m03, 'architecture') },
  m04,
  { ...m05, lessons: [...pick(m05, 'look-good', 'ui-rules', 'ui-references'), ...designPlus, ...pick(m05, 'ui-polish')] },
  without(m07, 'subscriptions'),
  m08,
  { ...without(m09, 'security-tools', 'security-standards'), title: 'Lock it down' },
  { ...m10, title: 'Launch day', lessons: pick(m10, 'launch') },
];

// Track 2 climbs from habits (product, Claude, GitHub) to real engineering (architecture, environments, testing),
// then features and platforms, then AI, then running the business. Bonus tools and the final project come last.
const track2 = [
  { ...m16, lessons: [...m16.lessons, ...pick(m03, 'scrum')] },
  m17,
  { ...m15, lessons: [...m15.lessons, ...pick(m02, 'access-tokens')] },
  without(m06, 'mcp', 'desktop-apps'),
  engineering,
  quality,
  { id: 'mcp', title: 'MCP: connect and build your own', lessons: [...pick(m06, 'mcp'), buildMcp] },
  smartFeatures,
  { id: 'mobile', title: 'Phones and desktop apps', lessons: [mobileApps, ...pick(m06, 'desktop-apps'), desktopShip] },
  m13,
  { id: 'evals', title: 'Test your AI (evals)', lessons: evals },
  m12,
  { id: 'analytics', title: 'Analytics and experiments', lessons: analytics },
  { id: 'grow', title: 'Launch and grow', lessons: [...grow, ...pick(m07, 'subscriptions'), customerCare] },
  { id: 'company', title: 'Run it like a company', lessons: [...run, authServices, businessBasics, appLegal, ...pick(m10, 'soc2', 'run-like-a-pro'), ...pick(m09, 'security-tools', 'security-standards')] },
  { id: 'ai-coders', title: 'Other AI coders and app builders', lessons: [aiCoders, aiBuilders] },
  m11,
  { ...m14, title: 'Final project: Forward Deployed Engineering' },
];

export const modules = [
  ...track1.map((m) => ({ ...m, track: 1, advanced: false })),
  ...track2.map((m) => ({ ...m, track: 2, advanced: true })),
];

export const allLessons = modules.flatMap((m, mi) =>
  m.lessons.map((l, li) => ({ ...l, moduleId: m.id, moduleTitle: m.title, moduleIndex: mi, lessonIndex: li, track: m.track }))
);

export const lessonsInTrack = (track) => allLessons.filter((l) => l.track === track).map((l) => l.id);
