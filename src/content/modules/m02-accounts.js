import { addKey } from '../safe';

export default {
  id: 'accounts',
  title: 'Your free accounts',
  lessons: [
    {
      id: 'big-picture',
      title: 'The big picture: what each tool does',
      minutes: 8,
      figure: 'bigpicture',
      body: [
        { t: 'why', text: 'In the next few lessons you will make several free accounts. Before you do, it helps to see the whole map: which tool does which job, how they connect, and why we picked each one. Then every setup step will make sense instead of feeling like random hoops.' },
        { t: 'p', text: 'Every real web app needs the same handful of jobs done. The picture above shows them: you build with Claude, **GitHub** saves your code, **Vercel** runs it, **Cloudflare** gives it an address, and behind the scenes **Neon** remembers data, **Resend** sends email and **Stripe** takes payments.' },
        { t: 'analogy', text: 'Think of your app as a restaurant. GitHub is the recipe book (every version, kept safe). Vercel is the kitchen where meals are actually made. Cloudflare is the street address on the sign. Neon is the pantry and the order book. Resend is the person who mails receipts. Stripe is the cash register.' },
        { t: 'h', text: 'Why we picked each one' },
        { t: 'table', head: ['Tool', 'Its one job', 'Why this one', 'Free to start?'], rows: [
          ['GitHub', 'Keep every version of your code', 'Everyone uses it; Vercel and Claude plug straight in', 'Yes'],
          ['Vercel', 'Run your app on the internet', 'Made by the creators of Next.js; save to GitHub and it is live in a minute', 'Yes (Hobby plan)'],
          ['Neon', 'Store your data (users, orders)', 'Real Postgres, the industry standard, that sleeps when idle so it costs nothing', 'Yes'],
          ['Cloudflare', 'Your .com address', 'Sells domains at cost with no upsells, plus free protection', 'Domain costs about $10 a year'],
          ['Resend', 'Send email from your app', 'Simple for developers, good delivery, generous free plan', 'Yes (about 3,000 a month)'],
          ['Stripe or Square', 'Take card payments', 'Customers pay on their page, so cards never touch your app. Stripe for online software, Square for real-world businesses', 'No monthly fee; a cut of each sale'],
        ] },
        { t: 'p', text: 'You will see this picture again in each tool\'s lesson, with that tool highlighted, so you always know where you are on the map.' },
        { t: 'h', text: 'The best part: GitHub, Vercel and Neon plug into each other' },
        { t: 'p', text: 'These three are built to connect. You link them **once**, in the next three lessons, and from then on they work as one machine:' },
        { t: 'steps', items: [
          { do: '**GitHub → Vercel:** you sign up for Vercel *with* your GitHub account.', why: 'Every time Claude saves your code to GitHub, Vercel puts the new version online by itself.' },
          { do: '**Vercel → Neon:** you create your Neon database *from inside* Vercel.', why: 'Vercel hands the database\'s secret address to your app automatically. No copying passwords.' },
          { do: '**All three → Claude:** you connect them to Claude.', why: 'Now you just say "save it and put it online" and Claude handles all three.' },
        ] },
        { t: 'analogy', text: 'It is like setting up a new phone with your car and your garage door. Pairing takes a few minutes, once. After that, you pull into the driveway and the door opens and your music keeps playing, without you touching anything.' },
        { t: 'deeper', title: 'What about the alternatives?', blocks: [
          { t: 'table', head: ['Job', 'We use', 'Also fine', 'Why we did not start there'], rows: [
            ['Code hosting', 'GitHub', 'GitLab, Bitbucket', 'Fewer one-click integrations with Vercel and Claude'],
            ['Hosting', 'Vercel', 'Netlify, Cloudflare Pages, Railway', 'Good, but Next.js runs best where it is made'],
            ['Database', 'Neon', 'Supabase, PlanetScale, Turso', 'Supabase is great too; Neon is plain Postgres with fewer moving parts'],
            ['Email', 'Resend', 'Postmark, SendGrid, Amazon SES', 'More setup or older developer experience'],
            ['Payments', 'Stripe', 'Square, Paddle, Lemon Squeezy', 'Paddle and Lemon Squeezy also handle sales tax for you; worth a look for digital products'],
          ] },
          { t: 'p', text: 'None of these choices lock you in forever. Because your code lives in GitHub and your data is standard Postgres, you can move any piece later.' },
        ] },
        { t: 'check', q: 'Which tool actually runs your app so people can visit it?', options: ['GitHub', 'Vercel', 'Neon'], answer: 1, explain: 'GitHub stores the code, Neon stores the data, and Vercel is the kitchen where the app actually runs.' },
        { t: 'prompt', label: 'Explain my stack back to me', text: `I am building [MY APP IDEA]. Explain, in plain words with a real-world comparison for each, what these do for my app and how they connect: GitHub, Vercel, Neon (database), Resend (email), Stripe or Square (payments), Cloudflare (domain).
Then draw a simple text diagram showing a visitor's request going through them.
Tell me which ones I need for the very first version and which can wait.` },
        { t: 'recap', items: [
          'Each tool has one job: save code, run app, address, data, email, payments.',
          'We picked tools that are free to start and plug into each other.',
          'You can swap any piece later because nothing is locked in.',
        ] },
      ],
    },
    {
      id: 'github',
      title: 'Make a GitHub account',
      minutes: 9,
      figure: 'fit-github',
      body: [
        { t: 'why', text: [
          'Imagine working on an essay for a month and your laptop dies. Everything gone. GitHub makes sure that never happens to your app.',
          'It also gives you a time machine: every saved version of your code is kept, so if the AI breaks something tomorrow, you can go back to today in one command.',
        ] },
        { t: 'p', text: 'Two words you will hear a lot:' },
        { t: 'table', head: ['Word', 'What it means'], rows: [
          ['Git', 'A tool on your computer that saves "snapshots" of your project. Each snapshot is called a **commit**.'],
          ['GitHub', 'A website that keeps an online copy of all those snapshots. Your online copy is called a **repository** (or **repo**).'],
        ] },
        { t: 'analogy', text: 'Git is like the "save game" feature in a video game. Every time you beat a level, you save. If you die on the next level, you load your last save instead of starting over. GitHub is the cloud that stores those saves so you can load them from any computer.' },
        { t: 'h', text: 'Make your account' },
        { t: 'mock', name: 'github' },
        { t: 'steps', items: [
          { do: 'Go to **github.com** and click **Sign up**.', why: 'It is free. Use an email you actually check, because security alerts go there.' },
          { do: 'Pick a strong password you do not use anywhere else.', why: 'Whoever controls your GitHub controls your code, and later your live website.' },
          { do: 'Turn on **two-factor login**: Settings → Password and authentication. Use an authenticator app or a passkey, not text messages.', why: 'Text-message codes can be stolen by tricking your phone company (a "SIM swap"). App codes and passkeys cannot.' },
          { do: 'Save your **recovery codes** somewhere safe, like a password manager.', why: 'If you lose your phone, these codes are the only way back in.' },
        ] },
        { t: 'h', text: 'Let Claude save to GitHub for you' },
        { t: 'p', text: 'You do not need access tokens, keys or terminal commands to start. In the Claude app\'s **Code** tab, just paste this:' },
        { t: 'prompt', label: 'Connect this computer to GitHub', text: `Set up this computer to save my projects to GitHub.
Install anything that is missing and explain each step in one simple sentence before you do it.
When it is time to sign in, open GitHub in my web browser so I can sign in and click Authorize there.
Never ask me to paste a password, token or key into this chat.` },
        { t: 'p', text: 'Claude installs what is needed and opens GitHub in your browser. You sign in **on GitHub\'s own website** and click **Authorize**. Your computer gets permission, and nobody (including the AI) ever sees your password.' },
        { t: 'tip', tone: 'warn', text: 'If any app, video or AI ever asks you to paste a GitHub "personal access token" into a **chat**, say no. Tokens only ever go into the hidden terminal prompt. The access tokens lesson in Track 2 (GitHub like a pro) shows how, once you are ready to let Claude run your accounts fully.' },
        { t: 'deeper', title: 'Locking down your GitHub like a pro', blocks: [
          { t: 'steps', items: [
            '**Keep repos private** until you are ready to share. Bots scan public repos for leaked keys within minutes of a push.',
            '**Turn on secret scanning and push protection** (repo → Settings → Code security). GitHub will then block a save that contains a known type of key.',
            '**Turn on Dependabot alerts.** GitHub will warn you when a package your app uses has a known security hole.',
          ] },
          { t: 'p', text: 'Under the hood, Claude installs **Git** and the **GitHub CLI** (`gh`) and runs `gh auth login` with web sign-in. `gh` stores the resulting token in your computer\'s secure keychain, which is why you never touch it.' },
          { t: 'p', text: 'If a secret ever does reach GitHub, deleting the file is not enough: it is still in the history (every old snapshot). The real fix is to **rotate** it: make a new key at the provider and delete the old one.' },
        ] },
        { t: 'check', q: 'Why use an authenticator app instead of text-message codes for two-factor login?', options: [
          'Text messages cost money',
          'Text codes can be stolen through SIM swapping; app codes cannot',
          'GitHub does not support text messages',
        ], answer: 1, explain: 'Attackers can trick a phone company into moving your number to their SIM card. Authenticator apps and passkeys live on your device, so that trick does not work.' },
        { t: 'recap', items: [
          'Git saves snapshots (commits); GitHub stores them online (repos).',
          'Two-factor login with an app or passkey protects everything you build.',
          'Never paste passwords or keys into an AI chat.',
        ] },
      ],
    },
    {
      id: 'vercel',
      title: 'Make a Vercel account',
      minutes: 7,
      figure: 'fit-vercel',
      body: [
        { t: 'why', text: 'Right now your app can only live on your computer. Vercel is what puts it on the internet so anyone, anywhere, can open it. And once it is set up, you never "upload" anything again: save to GitHub, and your live site updates by itself.' },
        { t: 'p', text: '**Hosting** means running your app on a computer that is always on and connected to the internet. Vercel does that for you, on fast computers all around the world, so your app loads quickly whether someone opens it in Texas or Tokyo.' },
        { t: 'analogy', text: 'If GitHub is your filing cabinet, Vercel is your storefront. You keep the master copy in the cabinet. Every time you file a new version, Vercel automatically updates what is on display in the shop window.' },
        { t: 'h', text: 'Make your account' },
        { t: 'steps', items: [
          { do: 'Go to **vercel.com** and click **Sign Up**.' },
          { do: 'Pick the **Hobby** plan (free).', why: 'More on the rules of the free plan below.' },
          { do: 'Click **Continue with GitHub**.', why: 'This links the two accounts, which is what makes "save to GitHub = site updates" work.' },
          { do: 'Turn on two-factor login in Account Settings.', why: 'Your Vercel account will hold your app\'s secret keys. Protect it like your bank.' },
        ] },
        { t: 'snap', src: 'shots/vercel-signup.jpg', url: 'vercel.com/signup', caption: 'Sign up with GitHub (highlighted) so Vercel can see your code right away.', marks: [{ x: 35.5, y: 43.5, w: 29, h: 6.5 }] },
        { t: 'tip', tone: 'safe', text: 'Signing up **with GitHub** is link number one of three. GitHub and Vercel are now connected. In the next lesson you add Neon from inside Vercel, and all three are linked.' },
        { t: 'h', text: 'The free plan rule you need to know' },
        { t: 'p', text: 'Vercel\'s free **Hobby** plan is for personal projects. Asking visitors for **donations is allowed**. But if your site **sells** something, takes payments, or runs ads, Vercel counts that as commercial use, and you need **Vercel Pro** (about $20 a month) when you launch. Building and testing on Hobby is fine.' },
        { t: 'deeper', title: 'What Vercel gives you behind the scenes', blocks: [
          { t: 'steps', items: [
            '**Production deploys:** every save to your main branch goes live.',
            '**Preview deploys:** every other branch gets its own private test web address, so you can try changes before they go live.',
            '**Serverless functions:** your app\'s back-end code runs on demand. No servers for you to patch or keep running.',
            '**Environment variables:** a safe place for secret keys, separate for testing and for live.',
            '**Instant rollback:** if a release goes wrong, you can switch back to the previous one with one click.',
          ] },
          { t: 'links', items: [{ label: 'Vercel fair-use guidelines', url: 'https://vercel.com/docs/limits/fair-use-guidelines', note: 'The exact rules for the free plan' }] },
        ] },
        { t: 'check', q: 'Your app starts selling a $5 product. What does that mean for Vercel?', options: [
          'Nothing changes',
          'Selling counts as commercial use, so you need Vercel Pro',
          'You have to move to a different host',
        ], answer: 1, explain: 'Donations are fine on Hobby. Selling, payments and ads are commercial use, which needs Pro.' },
        { t: 'prompt', label: 'Connect my project to Vercel', text: `I made a Vercel account. Connect this project to it:
1. Check if the Vercel CLI is installed; if not, install it.
2. Run the login so I can sign in in my browser (tell me what to click).
3. Link this folder to a new Vercel project and deploy a preview.
4. Give me the preview link and explain the difference between a preview and production.
Never ask me to paste any token into this chat.` },
        { t: 'recap', items: [
          'Hosting puts your app online; Vercel does it automatically from GitHub.',
          'Sign up with GitHub and turn on two-factor login.',
          'Hobby is free for personal use and donations; selling needs Pro.',
        ] },
      ],
    },
    {
      id: 'neon',
      title: 'Get a database (Neon)',
      minutes: 8,
      figure: 'fit-neon',
      body: [
        { t: 'why', text: 'Almost every useful app needs to **remember** things: who signed up, what they ordered, what they wrote. Without a database, your app forgets everything the moment someone closes the page.' },
        { t: 'snap', src: 'shots/neon-marketplace.jpg', url: 'vercel.com/marketplace/neon', caption: 'Neon inside Vercel\'s marketplace: Install (highlighted) adds a real Postgres database to your project.', marks: [{ x: 22.8, y: 32, w: 5.2, h: 5 }] },
        { t: 'p', text: 'A **database** stores your app\'s information in tables, a lot like a very organized, very fast spreadsheet. One table for users, one for orders, one for messages. Your app reads from and writes to these tables thousands of times a day.' },
        { t: 'analogy', text: 'Your app is a restaurant. The database is the order book in the kitchen. Without it, the waiter takes your order, walks to the kitchen, and has already forgotten what you wanted.' },
        { t: 'p', text: 'We use **Neon**, which runs a popular, rock-solid kind of database called **Postgres**. The best part: you create it from inside Vercel, so there is no new account or password to manage.' },
        { t: 'h', text: 'Create your database' },
        { t: 'steps', items: [
          { do: 'Open your Vercel dashboard and click **Storage**.' },
          { do: 'Click **Create Database** and pick **Neon**. Choose the free plan.' },
          { do: 'Pick the region closest to most of your users.', why: 'The closer the database is to your app, the faster every page loads.' },
          { do: 'Connect it to your project.', why: 'Vercel automatically adds the secret connection details to your project, so you never have to copy and paste them.' },
        ] },
        { t: 'mock', name: 'neon' },
        { t: 'h', text: 'Why only Neon?' },
        { t: 'p', text: 'There are dozens of databases out there, and AI tools love suggesting new ones. Resist. Postgres is the industry standard, Neon scales from "my first app" to millions of rows, and keeping everything in one place (GitHub, Vercel, Neon) means fewer logins, one bill, and fewer things to secure.' },
        { t: 'tip', tone: 'warn', text: 'The connection details include your database password. They belong in Vercel\'s settings and a private `.env.local` file only. If you ever see them inside a code file, that is a bug. Ask Claude to move them.' },
        { t: 'deeper', title: 'What makes Neon special', blocks: [
          { t: 'p', text: 'Neon is **serverless Postgres**. The storage and the computer that answers queries are separate, so the computer can **scale to zero** when nobody is using your app. That is why the free tier is genuinely usable: you are not paying for a machine sitting idle.' },
          { t: 'p', text: 'Neon also supports **branching**: an instant copy of your database for testing, the same way Git branches copy your code. You can try a risky change on a branch without touching real customer data.' },
          { t: 'p', text: 'The Vercel integration injects a `DATABASE_URL` environment variable. Your code reads it on the server; it never goes to the browser.' },
        ] },
        { t: 'check', q: 'Where should your database connection details live?', options: [
          'In a code file so the AI can see them',
          'In Vercel\'s settings and a private .env.local file',
          'In your app\'s public settings page',
        ], answer: 1, explain: 'The connection string contains your database password. It only belongs in places the public can never read.' },
        { t: 'prompt', label: 'Connect my Neon database', text: `I added a Neon Postgres database through my Vercel account. Connect this project to it:
1. Pull the environment variables from Vercel into .env.local (make sure .env.local is in .gitignore).
2. Create one simple test table, insert one row, read it back, then delete the test table.
3. Tell me in plain words what worked.
Never print the database URL or password, and never ask me to paste it into this chat.` },
        { t: 'h', text: 'All three, connected' },
        { t: 'p', text: 'You now have the full chain: **GitHub** keeps your code, **Vercel** runs it and is linked to GitHub, and **Neon** is linked to Vercel. Save, and a minute later your live app is running the new code against your database. Every test branch even gets its own copy of the database automatically.' },
        { t: 'prompt', label: 'Connect GitHub, Vercel and Neon together', text: `I have GitHub, Vercel and Neon accounts. Make sure all three are connected for this project, and fix anything missing:
1. This folder is saved to a private GitHub repo.
2. That repo is connected to a Vercel project, so every push to main goes live and every other branch gets a preview link.
3. A Neon database is installed in that Vercel project through the Vercel Marketplace, with preview branches turned on, and DATABASE_URL is set for Production, Preview and Development.
4. .env.local has the development values (pulled from Vercel) and is in .gitignore.
5. Push a tiny change and show me the live link updating by itself.
Tell me what you checked in a simple checklist. Before you create or change anything in my accounts, tell me what and wait for my OK. If I need to click something in a website, tell me exactly what to click.
Never print the database URL or any password, and never ask me to paste one into this chat.` },
        { t: 'recap', items: [
          'A database is your app\'s memory, organized in tables.',
          'Neon runs Postgres and is created from inside Vercel.',
          'GitHub → Vercel → Neon are linked once; then saving puts it online by itself.',
          'Connection details are secret: environment variables only.',
        ] },
      ],
    },
    {
      id: 'connectors',
      title: 'Connect your accounts to Claude',
      minutes: 8,
      body: [
        { t: 'why', text: 'This is the shortcut that removes almost all the technical setup. Once Claude is connected to GitHub, Vercel and Neon, you can say "put my app online" or "make me a database" and Claude does it in those services for you, with your permission, instead of you clicking through five dashboards.' },
        { t: 'p', text: 'A **connector** is a safe, official link between Claude and another service. You turn it on once, sign in to that service in your browser, and choose what Claude is allowed to do. You can turn it off any time.' },
        { t: 'analogy', text: 'Connectors are like giving a trusted assistant a key card that only opens certain doors. You decide which doors. You can cancel the card whenever you want, and you never hand over your actual password.' },
        { t: 'h', text: 'Turn them on' },
        { t: 'steps', items: [
          { do: 'In the Claude app, open **Settings → Connectors**.' },
          { do: 'Find **GitHub**, click **Connect**, sign in on GitHub\'s website, and click **Authorize**.' },
          { do: 'Do the same for **Vercel** and **Neon**.', why: 'Now Claude can see your projects, deployments and databases when you ask it to.' },
          { do: 'If you do not see one in the list, click **Add custom connector** and use its official address: Vercel `https://mcp.vercel.com`, Neon `https://mcp.neon.tech/mcp`.' },
        ] },
        { t: 'h', text: 'Then just ask' },
        { t: 'prompt', label: 'Example: check everything is connected', text: `Using my GitHub, Vercel and Neon connectors:
1. List my GitHub repositories.
2. List my Vercel projects.
3. List my Neon databases.
Only read. Do not create, change or delete anything.
Tell me in simple words that each connection works.` },
        { t: 'tip', tone: 'safe', text: 'Keep Claude asking for your OK before it creates, changes, deletes or deploys anything. Reading is safe; changing live services deserves a quick look from you first.' },
        { t: 'deeper', title: 'What connectors are under the hood', blocks: [
          { t: 'p', text: 'Connectors use the **Model Context Protocol (MCP)**: each service runs an official MCP server, and Claude talks to it on your behalf. Sign-in uses **OAuth**, so the service gives Claude a limited, revocable permission instead of your password.' },
          { t: 'steps', items: [
            'Only connect official servers from the companies themselves.',
            'Choose the narrowest permissions offered (read-only where possible).',
            'Review and remove connectors you no longer use in Settings → Connectors.',
          ] },
          { t: 'p', text: 'Terminal users can add the same servers to Claude Code with `claude mcp add --transport http vercel https://mcp.vercel.com` and sign in with `/mcp`.' },
        ] },
        { t: 'check', q: 'What does Claude get when you turn on the GitHub connector?', options: [
          'Your GitHub password',
          'A limited permission you approved, which you can remove any time',
          'Full control of your computer',
        ], answer: 1, explain: 'Connectors use sign-in permissions, not passwords, and you can switch them off in Settings → Connectors.' },
        { t: 'recap', items: [
          'Connectors link Claude to GitHub, Vercel and Neon with a click.',
          'You sign in on each company\'s own site; Claude never sees passwords.',
          'Ask in plain English; keep approvals on for changes.',
        ] },
      ],
    },
    {
      id: 'secret-keys',
      title: 'Your secret keys: the terminal way',
      minutes: 8,
      body: [
        { t: 'why', text: 'Almost every service you add later (payments, email, AI) gives you a **secret key**: a long password your app uses to talk to it. Where you paste that key decides whether it stays secret. In this course there is exactly one way to do it, and it takes ten seconds.' },
        { t: 'p', text: 'The rule: a secret key is pasted **once**, into a **hidden terminal prompt** that Claude opens for you. Never into a chat, never into code, never into a screenshot.' },
        { t: 'h', text: 'How it works' },
        { t: 'steps', items: [
          { do: 'Make the key on the service\'s website (Stripe, Resend, Square and so on) and click its **Copy** button.' },
          { do: 'Paste the **Add a key** prompt below into Claude, with the key\'s name filled in.', why: 'Claude opens a terminal tab that is waiting just for your key.' },
          { do: 'Click inside that terminal tab, paste, and press Return. **Nothing appears while you paste.** That is on purpose.', why: 'Hidden typing means the key never shows on screen, in a screenshot or in your history.' },
          { do: 'Check the line it prints: how many characters it got and the last 4. If those match the website, you pasted the right thing.' },
          { do: 'Done. The key is now in your private `.env.local` file and in Vercel, marked **Sensitive** so even you cannot read it back there.' },
        ] },
        { t: 'term', title: 'Terminal', caption: 'What the hidden prompt looks like (the key itself never appears)', lines: [
          ['out', 'Paste your RESEND_API_KEY (hidden), then press Return:'],
          ['dim', 'Got 36 characters, ending in ...f3a9'],
          ['ok', '✓ Resend accepted the key'],
          ['ok', '✓ Saved to .env.local and Vercel (Sensitive)'],
        ] },
        { t: 'prompt', label: 'Add a key', text: addKey('[KEY_NAME]', '[SERVICE]') },
        { t: 'tip', tone: 'info', text: 'Pasted and nothing happened? Make sure you clicked **inside the terminal tab** first. The most common mistake is pasting into a different tab or into the chat.' },
        { t: 'tip', tone: 'warn', text: 'Pasted a key into a chat by accident? Delete that key on the service\'s website, make a new one, and add the new one with this prompt. Treat any key that has been in a chat as public.' },
        { t: 'deeper', title: 'What the prompt does under the hood', blocks: [
          { t: 'p', text: 'It uses the shell\'s silent read (`read -s`), so the characters are never echoed to the screen or saved in shell history. It trims stray spaces, checks the key against the service\'s API, then writes it to `.env.local` and pipes it into `vercel env add NAME production --sensitive`.' },
          { t: 'p', text: '**Sensitive** variables in Vercel are write-only: they can be used by your app, but nobody can view them in the dashboard again. If you ever need to change one, you replace it.' },
        ] },
        { t: 'check', q: 'Where do you paste a new secret key?', options: [
          'Into the chat, so Claude can set it up',
          'Into the hidden terminal prompt Claude opens for you',
          'Straight into the code file that uses it',
        ], answer: 1, explain: 'One paste into the hidden prompt puts it in .env.local and Vercel without it ever showing anywhere.' },
        { t: 'recap', items: [
          'Secret keys go in one place: the hidden terminal prompt.',
          'Check the character count and last 4 to confirm the paste.',
          'It saves to .env.local and Vercel (Sensitive) for you.',
        ] },
      ],
    },
    {
      id: 'access-tokens',
      title: 'Access tokens: let Claude run GitHub, Vercel and Neon',
      minutes: 10,
      body: [
        { t: 'why', text: 'To build a **SaaS you can sell**, you have to own the three things it runs on: the code (GitHub), the hosting (Vercel) and the data (Neon). An **access token** for each one lets Claude do the work in those accounts for you: make repos, push code, deploy, create databases and branches. This is exactly what all-in-one builders like Base44 cannot give you, because there the app and data live in their account, not yours.' },
        { t: 'analogy', text: 'An access token is a **valet key** for your car. It starts the car and drives it, but it cannot open the glovebox or the trunk, and you can cancel it the moment you get the car back. Your real password is the master key, and it never leaves your pocket.' },
        { t: 'table', head: ['Token', 'What Claude can do with it', 'Where you make it'], rows: [
          ['**GitHub** fine-grained token', 'Create repos, push code, open pull requests, publish desktop app releases', 'github.com → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**'],
          ['**Vercel** token', 'Create projects, set environment variables, deploy, add domains', 'vercel.com → Account Settings → **Tokens**'],
          ['**Neon** API key', 'Create databases and branches, get connection details', 'console.neon.tech → Account settings → **API keys**'],
        ] },
        { t: 'h', text: 'Make each token the safe way' },
        { t: 'steps', items: [
          { do: 'Give it a clear name, like **claude-laptop**.', why: 'If your laptop is ever lost, you know exactly which token to delete.' },
          { do: 'Set an **expiration**, like 90 days.', why: 'A token that expires cannot be abused forever if it leaks. Claude will remind you when it runs out.' },
          { do: 'On GitHub, choose **Only select repositories** (or All, if you trust this computer) and give **Read and write** for Contents, Pull requests, Workflows and Administration. Leave everything else as No access.', why: 'Only the doors Claude needs. Administration lets it create new repos for you.' },
          { do: 'On Vercel, set the **scope** to your own team only.' },
          { do: 'Click **Copy**, then use the prompt below. Paste the token **only** into the hidden terminal prompt, never into the chat.' },
        ] },
        { t: 'prompt', label: 'Give Claude my GitHub, Vercel and Neon tokens', text: `Help me give you access to my GitHub, Vercel and Neon accounts with access tokens.
For each one (GH_TOKEN for GitHub, VERCEL_TOKEN for Vercel, NEON_API_KEY for Neon), one at a time:
1. Open a terminal tab with a hidden prompt (nothing shows while I paste) and wait for me to paste the token there once.
2. Show only how many characters it got and the last 4, then test it with a read-only call (list my repos / projects / databases).
3. Store it in my computer's secure keychain (macOS Keychain, Windows Credential Manager or Linux secret-tool). For GitHub, use gh auth login --with-token so gh keeps it.
These are MY account tokens, not app secrets: never put them in .env.local, in any project folder, in code, or in Vercel environment variables.
Never print a token and never ask me to paste one into this chat.
Then tell me which token expires first and remind me a week before it does.` },
        { t: 'term', title: 'Terminal', caption: 'What it looks like (the token never appears)', lines: [
          ['out', 'Paste your GH_TOKEN (hidden), then press Return:'],
          ['dim', 'Got 93 characters, ending in ...8KqZ'],
          ['ok', '✓ GitHub accepted it: 12 repositories found'],
          ['ok', '✓ Saved to your keychain'],
        ] },
        { t: 'h', text: 'Then just ask' },
        { t: 'prompt', label: 'Set up a new SaaS on my own accounts', text: `Using my GitHub, Vercel and Neon tokens, set up a new product called [APP NAME]:
1. Create a private GitHub repo and push this folder to it.
2. Create a Vercel project linked to that repo.
3. Create a Neon database for it and save the connection string in Vercel (Sensitive) and in .env.local.
4. Deploy a preview and give me the link.
Show me the plan first and wait for my OK before you create anything.` },
        { t: 'tip', tone: 'warn', text: 'If a token is ever pasted into a chat, an email or a screenshot, delete it on that website right away and make a new one. Treat it as public.' },
        { t: 'deeper', title: 'Tokens, sign-in and connectors: which one when?', blocks: [
          { t: 'p', text: '**Browser sign-in** (the GitHub and Vercel lessons) is the easiest start: Claude never touches a token at all. **Connectors** let Claude read and act in those services from any chat. **Access tokens** are what pros use when Claude needs to do everything from the terminal on your computer, including scripts, desktop app releases and setting up whole new products in one go. All three are fine; use tokens once you are building things to sell.' },
          { t: 'p', text: 'Desktop apps (the Tauri lesson) use the GitHub token too: Claude builds the Mac and Windows installers and publishes them as a **GitHub Release**, and the app\'s auto-updater downloads new versions from there.' },
          { t: 'p', text: 'Fine-grained GitHub tokens are tied to specific repos and permissions and must expire. Avoid the old "classic" tokens: they give access to everything you own.' },
        ] },
        { t: 'check', q: 'Where does a Vercel or GitHub access token belong?', options: [
          'In .env.local next to your app\'s keys',
          'In your computer\'s secure keychain, pasted once through the hidden terminal prompt',
          'In the chat, so Claude remembers it',
        ], answer: 1, explain: 'These tokens control your whole account, not just one app, so they live in the keychain and never in a project, in Vercel or in a chat.' },
        { t: 'recap', items: [
          'Owning GitHub, Vercel and Neon is what lets you build and sell a real SaaS.',
          'Access tokens let Claude run all three for you: expiring, narrow, one per computer.',
          'Paste them only in the hidden terminal prompt; they live in your keychain.',
        ] },
      ],
    },
  ],
};
