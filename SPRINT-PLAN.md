# TinyAppCode: sprint plan

A free course that takes someone who knows nothing to a live, paid, secured web app.
Audience: people coming from TikTok. Easy mode reads at about a 3rd-grade level. Nerdy mode explains the why.

Sprints are 1 week each. Each sprint ends with a demo of the live site and a short retro.

## Definition of done (every lesson)

- Easy mode: short sentences, numbered steps, every prompt has a Copy button, and every prompt that builds something carries a security rule.
- Nerdy mode: explains what is happening, why, and what can go wrong.
- At least one graphic or screenshot.
- Works in light and dark mode, on a phone and on a laptop.
- Facts checked against the vendor's own docs (install commands, prices, free-tier limits).

---

## Sprint 0: Foundation (done in this prototype)

- [x] App shell: course map, lesson pages, Easy / Nerdy toggle, progress saved on the device
- [x] Light and dark mode
- [x] Terms of use and liability release that must be accepted before the course opens
- [x] "Buy me a drink" screen on load (PayPal QR, ETH, BTC); hides for good once they say they donated
- [x] Desktop app (Tauri 2): Mac build verified locally; Mac + Windows installers built by GitHub Actions on each version tag
- [x] Fonts bundled, works fully offline, web links open in the user's browser
- [x] Skip module button on every lesson; any lesson can be opened from the plan
- [x] First pass of all 15 modules and 44 lessons (11 core + 4 advanced, ending in a real-customer final project); Claude Code first, Codex as the second opinion
- [x] Installer-style flow: Back / Done, next, step counter, module progress bar
- [x] Brand colors from therayally.com (charcoal + orange), Alata / Plus Jakarta Sans / Anonymous Pro

## Sprint 1: Content accuracy and screenshots

- Take real screenshots for every sign-up flow: GitHub, Vercel, Neon, Stripe, Cloudflare, Claude Code first run (Mac and Windows)
- Blur emails and keys in every screenshot
- Re-check every install command and plan price against current docs
- Read-aloud test of easy mode with 3 people who have never coded

## Sprint 2: Distribution and legal

- Push to GitHub, tag v0.1.0, publish the first release (free downloads via GitHub Releases)
- Apple Developer Program ($99/yr): sign and notarize the Mac app so there is no warning
- Windows code-signing certificate (or accept the SmartScreen warning for v0.1)
- Auto-updates with Tauri's updater plugin
- Optional one-page download site on Cloudflare Pages (free) with Mac/Windows buttons
- Lawyer review of the terms and liability release (the included text is a starting draft, not legal advice)
- Privacy policy page (what is stored: only progress and agreement on the user's own device)

## Sprint 2.5: Paid unlock, website, super admin (built, tested locally)

- [x] Cloudflare Worker: website + license API + super admin at /admin, D1 (SQLite) database
- [x] Square webhook (signed), refunds lock the app, under-price payments ignored
- [x] Email one-time codes, max 2 computers per purchase, offline for 30 days
- [x] Free preview: modules 0–2; Unlock screen from module 3
- [x] Super admin: sales overview, licenses, free grants, sign computers out, connect your own Square, Resend, donation and download links, add admins, activity log
- [ ] Go live: buy tinyappcode.app on Cloudflare, deploy, add Resend + Square keys in /admin (steps in LICENSING.md)
- [ ] Real end-to-end test: buy for $2, unlock, refund

## Sprint 3: Learning polish

- Quizzes at the end of each module (3 questions, no login needed)
- "Stuck?" box on every lesson with the 5 most common errors and the fix prompt for each
- Certificate of completion (generated on the device, no account)
- Search across all lessons and prompts

## Sprint 4: Video and TikTok tie-ins

- 30 to 60 second clip per lesson, embedded at the top of the page
- Short link per lesson (example: yourdomain.com/l/github) for TikTok bios and comments
- Social share images for each lesson

## Sprint 5: Deeper modules

- Hermes deep dive: writing skills, Docker backend, multi-channel gateway, with screenshots of each step
- Voice receptionist build-along with one provider end to end
- Auth module (sign-in with Clerk or Auth.js), with role checks
- Email module (Resend), background jobs, file uploads
- Mobile app module (Expo), optional

## Sprint 6: Security pass on our own site, then launch

- Run the course's own OWASP checklist and dependency scan on this site
- Security headers (CSP, HSTS), Lighthouse score 90+ on all four categories
- Launch, then watch errors and analytics for one week

---

## Course map

| Module | Lessons |
|---|---|
| 0. Start here | Welcome · What vibe coding really is |
| 1. Get Claude Code | Claude Code (and when to use Codex) · Install Claude Code · Talk to it like a pro |
| 2. Your free accounts | GitHub · Vercel · Neon |
| 3. Plan like a pro | Sprints and Scrum · System architecture |
| 4. Build your app | Your first app |
| 5. Beautiful UI | Fonts and UI kits · The 7 rules of beautiful UI · Steal like an artist · The polish pass |
| 6. Know your building blocks | Languages · Desktop apps (Tauri vs Electron vs Java) · SQLite vs Postgres · MCP and connectors |
| 7. Data and money | Your database · Stripe payments |
| 8. Go live | Deploy · Domain on Cloudflare · Email with Resend |
| 9. Lock it down | Secrets · OWASP Top 10 · CVEs · Free security scanners (/security-review, Strix, Shannon, ZAP…) · Business security standards |
| 10. Grown-up stuff | SOC 2 readiness · Run it like a real company · Launch checklist |
| 11. Power tools on a budget (advanced) | Stop burning tokens · Free local AI with Qwen · Open-source art and video tools (ArtCraft, Open Generative AI, ComfyUI) |
| 12. Agents and automation (advanced) | What an agent is · Hermes Agent · Automations |
| 13. Build AI products (advanced) | Your own chatbot · Real business apps |
| 14. Final project (advanced) | Find a customer · Website chat with a relay · Voice receptionist · Launch and hand over |

## Distribution (cost)

- The course ships as a desktop app. Downloads are hosted free on **GitHub Releases**.
- Website on your own domain. Vercel Hobby (free) allows asking for donations, but not selling things (the $2 app). Selling needs Vercel Pro (~$20/mo) or Cloudflare Pages (free, selling allowed).
- Price: $2 one-time through Square (about $1.64 kept per sale). See LICENSING.md.
- Only real cost: code signing (Apple $99/yr; Windows certificate varies) to remove install warnings.
