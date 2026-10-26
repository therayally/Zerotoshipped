// Official brand logos (Simple Icons, CC0 paths). Brands the library does not carry get a plain name tile.
import {
  siClaude, siAnthropic, siGithub, siGit, siVercel, siNeon, siStripe, siCloudflare, siResend, siNextdotjs, siReact,
  siTypescript, siPython, siRust, siTauri, siElectron, siNodedotjs, siSqlite, siPostgresql, siDrizzle,
  siModelcontextprotocol, siGooglefonts, siMui, siTailwindcss, siShadcnui, siDribbble, siFigma, siOwasp, siDependabot,
  siDocker, siOllama, siQwen, siBlender, siKrita, siTelegram, siElevenlabs, siMermaid,
  siHuggingface, siGithubactions, siLmstudio, siSquare,
  siVisa, siMastercard, siAmericanexpress, siDiscover, siApplepay, siGooglepay, siCashapp,
  siGithubcopilot, siCursor, siPosthog, siTiktok, siProducthunt, siGooglesearchconsole,
  siMongodb, siSupabase, siFirebase, siTurso, siExpo, siSentry, siClerk, siAuth0, siV0, siReplit, siKaggle, siGooglegemini,
  siPwa, siAndroid, siApple, siBetterauth,
} from 'simple-icons';

const text = (title, hex) => ({ title, hex, text: true });

export const LOGOS = {
  claude: siClaude, anthropic: siAnthropic, openai: text('OpenAI', '000000'),
  github: siGithub, git: siGit, vercel: siVercel, neon: siNeon, stripe: siStripe, cloudflare: siCloudflare,
  resend: siResend, nextjs: siNextdotjs, react: siReact, typescript: siTypescript, python: siPython, rust: siRust,
  tauri: siTauri, electron: siElectron, node: siNodedotjs, sqlite: siSqlite, postgres: siPostgresql, drizzle: siDrizzle,
  mcp: siModelcontextprotocol, googlefonts: siGooglefonts, mui: siMui, tailwind: siTailwindcss, shadcn: siShadcnui,
  dribbble: siDribbble, figma: siFigma, owasp: siOwasp, dependabot: siDependabot, docker: siDocker, ollama: siOllama,
  qwen: siQwen, blender: siBlender, krita: siKrita, telegram: siTelegram, elevenlabs: siElevenlabs, mermaid: siMermaid, huggingface: siHuggingface, githubactions: siGithubactions, lmstudio: siLmstudio, square: siSquare,
  githubcopilot: siGithubcopilot, cursor: siCursor, posthog: siPosthog, tiktok: siTiktok, producthunt: siProducthunt, googlesearchconsole: siGooglesearchconsole,
  mongodb: siMongodb, supabase: siSupabase, firebase: siFirebase, turso: siTurso, expo: siExpo, sentry: siSentry, clerk: siClerk,
  auth0: siAuth0, v0: siV0, replit: siReplit, kaggle: siKaggle, gemini: siGooglegemini, pwa: siPwa, android: siAndroid, apple: siApple,
  betterauth: siBetterauth, playwright: text('Playwright', '2EAD33'), lovable: text('Lovable', 'FF4F7A'), bolt: text('Bolt', '1389FD'),
  base44: text('Base44', 'FF6B2C'),
  visa: siVisa, mastercard: siMastercard, amex: siAmericanexpress, discover: siDiscover, applepay: siApplepay, googlepay: siGooglepay, cashapp: siCashapp,
};

export const logo = (key) => LOGOS[key];
