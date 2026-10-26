# TinyAppCode

A free desktop app that takes someone from zero to a live, paid, secured app built with AI.
Every step has an **Easy** mode (short steps plus copy-ready prompts with security rules built in) and a **Nerdy** mode (the full explanation).

Built with React + Material UI, wrapped as a desktop app with **Tauri 2** (Rust). Installers are about 5 to 10 MB, work fully offline, and need no account.

## Run it while developing

```bash
npm install
npm run tauri dev
```

To work on it in a browser instead: `npm run dev`.

## Build the Mac app on this computer

```bash
npm run tauri build
```

The `.app` and `.dmg` land in `src-tauri/target/release/bundle/`.

## Ship Mac and Windows downloads (free, via GitHub Releases)

1. Push this folder to a GitHub repo.
2. Tag a version: `git tag v0.1.0 && git push origin v0.1.0`.
3. `.github/workflows/release.yml` builds Apple Silicon Mac, Intel Mac and Windows installers and attaches them to a **draft** release.
4. Check the draft on GitHub, then click **Publish**. Share the release link (for example in your TikTok bio).

### Signing (do before a big launch)

Unsigned apps still install, but people see a warning:

- **Mac:** "cannot be opened because Apple cannot check it." They can open it from System Settings → Privacy & Security → **Open Anyway**. To remove the warning: Apple Developer Program ($99/year), then add the Apple secrets listed in the workflow.
- **Windows:** SmartScreen "Windows protected your PC" → **More info → Run anyway**. To reduce it: a code-signing certificate.

## Where things live

| What | File |
|---|---|
| All lessons (Easy and Nerdy text, prompts, commands) | `src/content/course.js` |
| Diagrams | `src/components/Figures.jsx` |
| Terms / liability release and the "Buy me a drink" screen | `src/components/Gates.jsx` |
| Colors and fonts (light and dark) | `src/theme.js` |
| Desktop app settings (window, security policy, icons) | `src-tauri/tauri.conf.json` |
| What the app is allowed to do (only open web links) | `src-tauri/capabilities/default.json` |
| Website, admin and API (Vercel + Neon) | `web/` — see `DONATIONS.md` |
| Sprint plan | `SPRINT-PLAN.md` |

Bump `TERMS_VERSION` in `Gates.jsx` whenever the terms change, so everyone is asked to agree again. Bump `version` in `src-tauri/tauri.conf.json` and `package.json` for each release.
