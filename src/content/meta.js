// Cover gradients and tools for each module. Five related blue-purple gradients keep the page varied but consistent.
import { logo } from './logos';

const G = {
  indigo: ['#2445D8', '#7B4DFF'],
  blue: ['#1474E8', '#4F7BFF'],
  lavender: ['#4B44D6', '#9C7BFF'],
  teal: ['#16819A', '#4F6BFF'],
  rose: ['#4A5BEA', '#C46CE6'],
};
const L = (...keys) => keys.map(logo);

export const moduleMeta = {
  start: { short: 'Start', g: G.indigo, tools: L('claude') },
  'ai-coder': { short: 'Claude Code', g: G.lavender, tools: L('claude', 'openai') },
  accounts: { short: 'Accounts', g: G.blue, tools: L('github', 'vercel', 'neon') },
  plan: { short: 'Planning', g: G.indigo, tools: L('github', 'mermaid') },
  build: { short: 'Build', g: G.teal, tools: L('nextjs', 'react', 'typescript') },
  ui: { short: 'Beautiful UI', g: G.rose, tools: L('googlefonts', 'mui', 'tailwind', 'dribbble') },
  blocks: { short: 'Building blocks', g: G.lavender, tools: L('typescript', 'rust', 'tauri', 'sqlite', 'mcp') },
  'data-money': { short: 'Data & money', g: G.blue, tools: L('postgres', 'neon', 'stripe') },
  live: { short: 'Go live', g: G.teal, tools: L('vercel', 'cloudflare', 'resend') },
  secure: { short: 'Security', g: G.indigo, tools: L('owasp', 'dependabot', 'docker') },
  'grown-up': { short: 'Grown-up stuff', g: G.lavender, tools: L('git', 'github') },
  'save-money': { short: 'Power tools', g: G.teal, tools: L('ollama', 'qwen', 'blender', 'krita') },
  agents: { short: 'Agents', g: G.blue, tools: L('telegram', 'docker') },
  'ai-products': { short: 'AI products', g: G.rose, tools: L('anthropic', 'postgres') },
  capstone: { short: 'Final project', g: G.indigo, tools: L('telegram', 'elevenlabs', 'stripe') },
};

export const metaFor = (moduleId) => moduleMeta[moduleId] || moduleMeta.start;
