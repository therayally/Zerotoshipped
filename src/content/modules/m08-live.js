import { SAFE } from '../safe';

export default {
  id: 'live',
  title: 'Go live',
  lessons: [
    {
      id: 'deploy',
      title: 'Put it on the internet',
      minutes: 10,
      body: [
        { t: 'why', text: 'Up to now your app has lived on your computer. This lesson puts it on the internet with a real address you can text to a friend. And you only do the setup once: after today, every change you save to GitHub goes live by itself in about a minute.' },
        { t: 'p', text: '**Deploying** means taking your code and running it on a computer that is always on and connected to the internet. Vercel does the heavy lifting; you just point it at your GitHub repo.' },
        { t: 'h', text: 'Step 1: import your project' },
        { t: 'steps', items: [
          { do: 'In Vercel, click **Add New → Project**.' },
          { do: 'Find your GitHub repo in the list and click **Import**.', why: 'This is the link that makes "save to GitHub = site updates" work.' },
        ] },
        { t: 'mock', name: 'vercel-import' },
        { t: 'h', text: 'Step 2: add your secret settings' },
        { t: 'steps', items: [
          { do: 'Before deploying, open **Environment Variables**.' },
          { do: 'Add every secret your app uses (Stripe keys and so on). Your database link is already there from the Neon setup.', why: 'Your `.env.local` file never goes to GitHub, so Vercel needs its own copy of the secrets.' },
          { do: 'Click **Deploy** and wait about a minute.' },
        ] },
        { t: 'p', text: 'You will get an address like **my-app.vercel.app**. That is your app, live, on the internet. Open it on your phone. Send it to someone. You built that.' },
        { t: 'h', text: 'Step 3: check nothing leaked' },
        { t: 'p', text: 'Going live is the moment a hidden mistake becomes public. Run this check every time you deploy something important:' },
        { t: 'prompt', label: 'Check the live site', text: `My app is deployed on Vercel. Check that:
1. No secret keys show up in the browser code (search the built JavaScript for sk_, DATABASE_URL, and any other secret names).
2. All environment variables in .env.local are also set in Vercel (tell me which are missing, by name only).
3. The production build has no errors or warnings I should fix.` },
        { t: 'deeper', title: 'Branches, previews and rollbacks', blocks: [
          { t: 'p', text: 'Pushing to your main branch deploys to production. Every other branch and pull request gets its own **preview** address, so you can test a change on the real internet before it goes live.' },
          { t: 'steps', items: [
            '**Work on branches:** open a pull request, test the preview link, then merge.',
            '**Separate secrets per environment:** test keys in Preview, live keys only in Production.',
            '**Turn on Deployment Protection** for previews so strangers cannot browse unfinished work.',
            '**Know rollback:** any earlier deployment can be made live again instantly from the dashboard.',
          ] },
        ] },
        { t: 'check', q: 'Why does Vercel need its own copy of your secret settings?', options: [
          'Because .env.local is never saved to GitHub, so Vercel cannot see it',
          'Because Vercel encrypts them differently',
          'It does not; it reads them from GitHub',
        ], answer: 0, explain: 'Your secrets stay off GitHub on purpose. Vercel\'s Environment Variables page is the safe place for its copy.' },
        { t: 'recap', items: [
          'Import your GitHub repo into Vercel once; every push deploys.',
          'Add secrets in Vercel\'s Environment Variables before deploying.',
          'Check the live site for leaked secrets after important deploys.',
        ] },
      ],
    },
    {
      id: 'domain',
      title: 'Your domain on Cloudflare',
      minutes: 12,
      figure: 'dns',
      body: [
        { t: 'why', text: '**my-app.vercel.app** works, but **mycoolapp.com** is what makes people trust you. A domain is also your brand: it goes on business cards, in your TikTok bio, and in every email you send. Where you buy it and how you protect it matters more than most people realize.' },
        { t: 'p', text: 'A **domain** is your web address. **DNS** (Domain Name System) is the internet\'s phone book: when someone types your domain, DNS looks up which computer to send them to. The picture above shows that trip.' },
        { t: 'h', text: 'Why Cloudflare and not GoDaddy' },
        { t: 'table', head: ['', 'Cloudflare', 'Typical big registrar'], rows: [
          ['Price', 'What the domain actually costs, no markup', 'Cheap first year, then a big jump at renewal'],
          ['Upsells', 'None', 'Lots of add-ons pushed at checkout'],
          ['Extras', 'Free privacy, fast DNS, attack protection', 'Often paid add-ons'],
        ] },
        { t: 'h', text: 'Buy it and point it at your app' },
        { t: 'steps', items: [
          { do: 'Make a Cloudflare account and turn on two-factor login.', why: 'Whoever controls your domain controls your website **and** your email. Treat this account like your bank.' },
          { do: 'Go to **Domain Registration → Register Domains**, search for your name, and buy it.' },
          { do: 'In Vercel: open your project → **Settings → Domains**, and add your domain.' },
          { do: 'Vercel shows you a couple of records. Add each one in Cloudflare → your domain → **DNS**.', why: 'These records are the phone book entry that sends visitors to Vercel.' },
          { do: 'Set each record to **DNS only** (the grey cloud, not orange).', why: 'Vercel already speeds up and protects your site. Running it through Cloudflare too can break your security certificate.' },
          { do: 'Wait a few minutes. When Vercel says **Valid**, you are live on your own domain.' },
        ] },
        { t: 'mock', name: 'dns' },
        { t: 'deeper', title: 'What the records mean, and how to lock your domain', blocks: [
          { t: 'table', head: ['Type', 'Name', 'What it does'], rows: [
            ['A', '@ (the bare domain)', 'Points mycoolapp.com to an IP address (a computer\'s number)'],
            ['CNAME', 'www', 'Points www.mycoolapp.com to another name, which Vercel manages'],
          ] },
          { t: 'p', text: 'Always use the exact values your Vercel dashboard shows; they can be specific to your project.' },
          { t: 'steps', items: [
            'Keep **registrar lock** on (it is by default) so nobody can transfer your domain away.',
            'Turn on **DNSSEC**, which protects visitors from forged DNS answers.',
            'Use a passkey or authenticator app on the Cloudflare account.',
          ] },
        ] },
        { t: 'check', q: 'Why does the security of your Cloudflare account matter so much?', options: [
          'Because it holds your app\'s code',
          'Because whoever controls the domain controls where your website and email go',
          'Because it stores customer cards',
        ], answer: 1, explain: 'Hijack the domain and you can redirect the website and read the email. Protect it like your bank account.' },
        { t: 'recap', items: [
          'A domain is your address; DNS is the phone book that finds it.',
          'Cloudflare sells domains at cost with no upsells.',
          'Add Vercel\'s records as DNS only, then lock your domain down.',
        ] },
      ],
    },
    {
      id: 'resend',
      title: 'Send email with Resend',
      minutes: 11,
      body: [
        { t: 'why', text: 'Your app will need to send email: sign-in codes, receipts, "your order is ready." If those emails land in spam, people cannot log in or think you never sent the receipt. Setting up email properly is the difference between "it works" and "it works for real customers."' },
        { t: 'p', text: '**Resend** is a service that sends email for your app. You call it from your server code, and it handles delivery. It has a free plan that is plenty for getting started.' },
        { t: 'h', text: 'Set it up' },
        { t: 'snap', src: 'shots/resend.jpg', url: 'resend.com/signup', caption: 'Resend sign-up' },
        { t: 'steps', items: [
          { do: 'Sign up at **resend.com** and turn on two-factor login.' },
          { do: 'Click **Domains → Add Domain** and type your domain.' },
          { do: 'Resend shows some DNS records. Add each one in Cloudflare → your domain → **DNS**.', why: 'These records prove to Gmail and Outlook that you are allowed to send email from your domain. Without them, your emails go to spam.' },
          { do: 'Wait until Resend says **Verified** for each record.' },
          { do: 'Go to **API Keys → Create** and choose **Sending access** only.', why: 'Give each key the least power it needs. A sending-only key cannot delete your domains if it ever leaks.' },
          { do: 'Add the key in Vercel as **RESEND_API_KEY**. Never in your code.' },
        ] },
        { t: 'mock', name: 'resend-dns' },
        { t: 'prompt', label: 'Add email to your app', text: `Add email to my app with Resend.
- The key is RESEND_API_KEY in .env.local. Use it on the server only.
- Send from: [Your App <hello@yourdomain.com>].
- Make one reusable sendEmail function and nice-looking templates with React Email: a sign-in code email and a receipt email.
- Never put user-typed text into an email without escaping it.
- Limit how many emails one person can trigger (for example 3 codes per 15 minutes).
- If sending fails, show the user a friendly message and log the error on the server.` + SAFE },
        { t: 'p', text: 'Why limit how many emails one person can trigger? Because otherwise someone can type a stranger\'s email into your sign-in form a thousand times and use your app to spam them, which can get your domain blocked.' },
        { t: 'tip', tone: 'warn', text: 'Only email people about things they asked for. Receipts and sign-in codes are fine. Newsletters need their permission and an unsubscribe link, by law in many places.' },
        { t: 'deeper', title: 'SPF, DKIM, DMARC: the three records explained', blocks: [
          { t: 'table', head: ['Record', 'What it proves'], rows: [
            ['SPF', 'Which servers are allowed to send email for your domain'],
            ['DKIM', 'A digital signature on each email so it cannot be faked or changed'],
            ['DMARC', 'What inboxes should do with email that fails SPF or DKIM, and where to send reports'],
          ] },
          { t: 'p', text: 'Start DMARC at `p=none` to collect reports, then tighten it once all your real email passes. Gmail and Yahoo now require all three for bulk senders.' },
          { t: 'steps', items: [
            'Send from a subdomain (like `mail.yourdomain.com`) so a marketing mistake never hurts your sign-in codes.',
            'Use a unique key per email so a retry never sends twice.',
            'Listen for bounce and complaint events and stop emailing those addresses.',
            'Free tier is roughly 3,000 emails a month with a daily cap; check resend.com/pricing for current limits.',
          ] },
        ] },
        { t: 'check', q: 'Why do you add DNS records for Resend in Cloudflare?', options: [
          'To make the emails prettier',
          'To prove you are allowed to send email from your domain, so it does not land in spam',
          'To make sending faster',
        ], answer: 1, explain: 'SPF, DKIM and DMARC are your domain\'s ID card for email providers.' },
        { t: 'recap', items: [
          'Resend sends your app\'s email from your server.',
          'DNS records (SPF, DKIM, DMARC) keep you out of spam.',
          'Sending-only key, rate limits, and no newsletters without permission.',
        ] },
      ],
    },
  ],
};
