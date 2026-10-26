# Free course, verified donations (Vercel + Neon)

The course is free. A "Buy me a drink" window shows at every launch until a real donation is recorded on the person's account. There is no "I already donated" button.

```
App ── sign in with email code ──▶ /api/auth/*  (account saved in Neon)
App ── "Buy me a drink" ──▶ your Square donation link (same email at checkout)
Square ── signed webhook ──▶ /api/square/webhook ──▶ donation saved in Neon
App ── every launch: /api/me ──▶ donated? then the window stays closed
```

- **Card donations (Square)** are recorded automatically and matched by email. Refunds reopen the window.
- **PayPal and crypto** cannot be verified automatically; record them in **/admin → Donations**.
- **Everything lives in Neon:** users, sign-in sessions, donations, settings (secrets encrypted), admins, activity log. Tables are created on first request.

## Where things are

| Path | What |
|---|---|
| `web/` | The Vercel project (set **Root Directory = web**): website, `/admin`, and the API |
| `web/lib/app.js` | API: accounts, Square webhook, admin |
| `web/lib/db.js` | Neon connection and table setup |
| `src/account.js`, `src/components/Gates.jsx` | The app's sign-in and donation window |

## Vercel environment variables

| Name | Value |
|---|---|
| `DATABASE_URL` | Added automatically when you connect Neon (Vercel → Storage) |
| `SESSION_SECRET` | Long random string (`openssl rand -hex 32`) |
| `SETTINGS_KEY` | Another long random string |
| `SUPER_ADMIN_EMAIL` | Your email; it can always sign in to /admin |

Then sign in at `/admin` and fill in **Settings**: Square donation link and webhook key, Resend key and "send from", PayPal/ETH/BTC, download links.

Vercel's free Hobby plan allows asking for donations (it does not allow selling).
