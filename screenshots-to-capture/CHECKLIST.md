# Screenshots only you can take

These screens are behind your logins, so they have to come from you. Take each one, drop the file in this folder (any name is fine, PNG or JPG), and tell Claude. Claude will crop it, **blur anything private** (keys, emails, IDs, amounts), add the yellow highlight boxes, and place it in the right lesson.

**How:** Mac: Cmd + Shift + 4, then drag a box (or press Space and click a window). Windows: Win + Shift + S.

**Tip:** use a normal-width window (not full screen on a giant monitor), and light mode if the site has it.

## Claude app (lessons: Install Claude Code, Your first app, Connect your accounts)
1. Claude app → **Code** tab → starting a new session, with the folder picker open
2. Claude app → **Settings → Connectors** (the list, with GitHub/Vercel/Neon/Square visible)

## Vercel (Go live, When setup goes sideways, Neon)
3. Project → **Settings → Environment Variables** (names visible; values are hidden anyway)
4. Project → **Storage** tab → **Create Database** → the Neon option
5. Project → **Settings → Domains** showing tinyappcode.com as Valid

## Cloudflare (Your domain, When setup goes sideways)
6. tinyappcode.com → **DNS → Records** (the grey "DNS only" clouds visible)
7. **My Profile → API Tokens → Create Token** with the "Edit zone DNS" template visible

## Resend (Send email with Resend)
8. **Domains** → tinyappcode.com showing the records as **Verified**

## Stripe (Set up Stripe), use **Test mode**
9. **Developers → API keys** (Claude will blur the keys)
10. **Developers → Webhooks → Add endpoint** form

## Square (Set up Square, donations)
11. Developer site → your app → **Webhooks → Subscriptions** (the subscription you made)
12. Square Dashboard → **Online → Payment links → Create link** with "Accept donations" visible

## Local AI (Free AI on your own computer, LM Studio, privacy)
13. **LM Studio → Discover** tab searching "Qwen3.5", with a "Full GPU offload possible" label showing
14. **LM Studio → Chat** with a model loaded and the tokens-per-second number visible
15. **LM Studio → Developer** tab with **Start server**
16. **Ollama** app chat window with the model picker open
17. Windows only, if you have a PC: **Task Manager → Performance → GPU** showing Dedicated GPU memory

## Hermes (Set up Hermes Agent)
18. The Hermes desktop app's first screen where it asks you to pick a model/provider
19. A Hermes chat (desktop or Telegram) answering a simple request

## GitHub (GitHub like a pro, Lock it down)
20. Repo → **Settings → Code security** showing secret scanning + push protection **on**
21. A **pull request** page (any PR) showing the Vercel preview link comment
