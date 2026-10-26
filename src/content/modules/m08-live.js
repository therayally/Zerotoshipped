import { SAFE, addKey } from '../safe';

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
          { do: 'Check every secret your app uses is there. Keys you saved with the hidden terminal prompt are already in Vercel, and your database link came from the Neon setup.', why: 'Your `.env.local` file never goes to GitHub, so Vercel needs its own copy of the secrets.' },
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
          'Keys saved with the hidden terminal prompt are already in Vercel; check before deploying.',
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
      figure: 'fit-resend',
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
          { do: 'Save it with the **Add a key** prompt as **RESEND_API_KEY**. Never in your code or a chat.' },
        ] },
        { t: 'prompt', label: 'Add your Resend key', text: addKey('RESEND_API_KEY', 'Resend') },
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
    {
      id: 'setup-sideways',
      title: 'When setup goes sideways (a true story)',
      minutes: 14,
      body: [
        { t: 'why', text: [
          'Every tutorial makes setup look smooth. Real life is not. While building this very course, almost everything in this lesson went wrong at least once: a key pasted into a chat, a database that was "connected" but was not, a domain that would not load, emails that only reached one inbox, and a name that was already taken.',
          'None of it was a disaster, because each problem has a simple, boring fix. Learn the fixes now and you will lose minutes instead of days.',
        ] },
        { t: 'h', text: '1. "I pasted my API key into the chat"' },
        { t: 'p', text: 'It happens to everyone, usually when you are tired and just want it to work. Once a key has been in a chat, an email or a screenshot, treat it as **public**. It is not about trusting the AI; chats get saved, synced and shared.' },
        { t: 'steps', items: [
          { do: 'Open the service (Resend, Stripe, and so on) and **delete** that key right away.', why: 'A deleted key is useless to anyone who finds it.' },
          { do: 'Create a new key with the least power it needs (for Resend: "Sending access").' },
          { do: 'Save the new key with the **Add a key** prompt: one paste into the hidden terminal prompt, which puts it in .env.local and Vercel as **Sensitive**.', why: 'Sensitive means even you cannot read it back in Vercel, so it can never leak from the dashboard.' },
          { do: 'If Claude needs a key to do a setup job, ask it to open a terminal with a **hidden prompt** so you type the key there, not in chat.' },
        ] },
        { t: 'prompt', label: 'Handle a key safely', text: addKey('[KEY_NAME]', '[SERVICE]') },
        { t: 'h', text: '2. "I connected the database" (but the app cannot see it)' },
        { t: 'p', text: 'Creating a database and connecting it to **your project** are two separate clicks. It is very easy to create one and leave it connected to nothing, or to a different project.' },
        { t: 'steps', items: [
          { do: 'In Vercel, open **your project → Settings → Environment Variables**.' },
          { do: 'Look for **DATABASE_URL** in the list.', why: 'If it is not there, your app has no database, no matter what the Storage page says.' },
          { do: 'If it is missing: **Storage → Connect Database**, pick it, and make sure **your project is ticked** before you confirm.' },
          { do: 'Redeploy. Settings only reach your app on the next deployment.' },
        ] },
        { t: 'h', text: '3. "I added the DNS records" (but the site will not load)' },
        { t: 'p', text: 'DNS is the internet\'s phone book, and it does exactly what you typed, typos included. When your domain does not work, it is almost always one of these:' },
        { t: 'table', head: ['Symptom', 'Usual cause', 'Fix'], rows: [
          ['Nothing loads at all', 'Records were never saved, or saved on a different domain', 'Open Cloudflare → the right domain → DNS, and check the records are really there'],
          ['Certificate or "too many redirects" errors', 'The orange cloud (proxy) is on', 'Click it so it turns grey: **DNS only**'],
          ['Old website shows up', 'An older A or CNAME record is still there', 'Delete the old record for the same name'],
          ['Works for you, not for others', 'DNS is still spreading around the world', 'Wait 5 to 30 minutes, then check again'],
        ] },
        { t: 'prompt', label: 'Check my domain', text: `Check whether [MYDOMAIN.COM] and www.[MYDOMAIN.COM] point to Vercel.
Look up the A and CNAME records, tell me exactly what is wrong in plain English, and what to change in Cloudflare.
Also check whether Vercel shows the domain as valid.` },
        { t: 'h', text: 'The easy way: let Claude add the records for you' },
        { t: 'p', text: 'Typing DNS records by hand is where most typos happen. Instead, give Claude a **scoped token**: a key that can only edit DNS for one domain and nothing else. This is exactly how the records for this course\'s own domain were added.' },
        { t: 'steps', items: [
          { do: 'In Cloudflare: **My Profile → API Tokens → Create Token**, and pick the **Edit zone DNS** template.' },
          { do: 'Under **Zone Resources**, choose **Specific zone** and pick your domain. Create it and click **Copy**.', why: 'If this token ever leaks, the worst anyone can do is change DNS on one domain. They cannot touch billing, other domains, or your account.' },
          { do: 'Paste the "Handle a key safely" prompt above into Claude. It opens a terminal with a hidden prompt.' },
          { do: 'Paste the token there. You will not see it appear. The prompt tells you how many characters it got and the last 4, then tests it.', why: 'Hidden typing is easy to get wrong (we pasted the wrong thing the first time). Showing only the length and last 4 lets you confirm it without revealing it.' },
          { do: 'Once it says it works, ask Claude to add the records.' },
        ] },
        { t: 'prompt', label: 'Add my DNS records', text: `Use the Cloudflare token I saved to set up DNS for [MYDOMAIN.COM]. Never print the token.
1. List the records that are there now.
2. Add the records Vercel needs for the domain and www, set to DNS only (grey cloud).
3. If Resend is set up, add my domain in Resend and copy every record it gives into Cloudflare, plus a DMARC record with p=none.
4. Ask Resend to verify, check again in a few minutes, and tell me when everything says Verified.` },
        { t: 'tip', tone: 'info', text: 'Newer Cloudflare tokens are longer (about 50 characters) and some tools reject them by mistake. If a tool says your brand-new token is invalid, test it by asking Cloudflare to list your domain instead.' },
        { t: 'h', text: '4. "Emails only arrive in my own inbox"' },
        { t: 'p', text: 'Until you verify your own domain, Resend sends from its test address, and that address can **only email you**. Your sign-up codes look like they work in testing, then fail for every real user.' },
        { t: 'steps', items: [
          { do: 'In Resend, add your domain and add its records in Cloudflare (Resend can even do this for you with a "Sign in to Cloudflare" button).' },
          { do: 'Wait for **Verified**, then send from an address on your domain, like `codes@yourdomain.com`.' },
          { do: 'Test by signing up with a **different** email address than your own.' },
        ] },
        { t: 'h', text: '5. "The name I wanted is taken"' },
        { t: 'p', text: 'Check the domain **before** you fall in love with a name, make a logo, or tell anyone. Short .com names are almost all gone. Good options: add a word ("tinyappcode" instead of "tinyapp"), or use a newer ending like .app or .dev. Buy it the same day you decide.' },
        { t: 'h', text: '6. "Mac says my app is damaged"' },
        { t: 'p', text: 'Apps downloaded from the internet must be signed with a paid Apple Developer ID ($99 a year), or macOS blocks them. That is one big reason this course moved from a download to a website: a website just works on every device, with nothing to install and nothing to sign.' },
        { t: 'h', text: 'The habit that fixes most of this: check, do not assume' },
        { t: 'p', text: '"I did it" and "it worked" are different things. After every setup step, look at the place where the result should show up: the variable in Vercel, the record in Cloudflare, the "Verified" badge in Resend, an actual email in a second inbox. Claude can do these checks for you in seconds.' },
        { t: 'prompt', label: 'Verify my whole setup', text: `Check my app's setup end to end. Do not print any secret values, only names and yes/no answers.
1. Which environment variables exist in my Vercel project (names only)? Is DATABASE_URL there?
2. Does my domain point to Vercel, and is it valid?
3. Is my sending domain verified in Resend?
4. Sign up a test account with a test email and tell me whether the code email arrives.
Tell me what is missing and exactly where to click to fix it.` },
        { t: 'deeper', title: 'Why "Sensitive" variables and hidden prompts matter', blocks: [
          { t: 'p', text: 'Secrets leak through **copies**: chat histories, terminal scrollback, screenshots, shell history, logs and support tickets. Each copy is another place to steal it from. Sensitive environment variables are write-only after saving, hidden prompts (`read -s`) never echo to the screen or shell history, and a file with permission `600` can only be read by your user account.' },
          { t: 'p', text: 'When a key may have leaked, **rotate** it (make a new one and delete the old one) instead of debating whether anyone saw it. Rotation takes two minutes; investigating takes hours.' },
          { t: 'p', text: 'Scale check: for a free course with 10,000 users, hosting and the database usually stay free or near free. The first real bill is often email, because every sign-up and new-device code is an email. Watch your email limits first.' },
        ] },
        { t: 'check', q: 'You accidentally pasted a live API key into a chat. What should you do?', options: [
          'Delete the message and hope nobody saw it',
          'Delete the key in the service, make a new one, and save the new one with the hidden terminal prompt',
          'Nothing, the chat is private',
        ], answer: 1, explain: 'Once a secret has been copied somewhere, rotate it. It takes two minutes and ends the risk completely.' },
        { t: 'recap', items: [
          'A leaked key gets deleted and replaced, never "probably fine."',
          'Connected means the variable shows up in your project, not just a database existing.',
          'Grey cloud for Vercel records; verify your email domain; test with a second inbox.',
          'A scoped token lets Claude add DNS records for one domain, with no typos.',
          'Check the result of every setup step instead of assuming.',
        ] },
      ],
    },
  ],
};
