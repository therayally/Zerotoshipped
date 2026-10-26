export default {
  id: 'accounts',
  title: 'Your free accounts',
  lessons: [
    {
      id: 'github',
      title: 'Make a GitHub account',
      minutes: 9,
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
        { t: 'p', text: 'You do not need access tokens, keys or terminal commands for this. In the Claude app\'s **Code** tab, just paste this:' },
        { t: 'prompt', label: 'Connect this computer to GitHub', text: `Set up this computer to save my projects to GitHub.
Install anything that is missing and explain each step in one simple sentence before you do it.
When it is time to sign in, open GitHub in my web browser so I can sign in and click Authorize there.
Never ask me to paste a password, token or key into this chat.` },
        { t: 'p', text: 'Claude installs what is needed and opens GitHub in your browser. You sign in **on GitHub\'s own website** and click **Authorize**. Your computer gets permission, and nobody (including the AI) ever sees your password.' },
        { t: 'tip', tone: 'warn', text: 'If any app, video or AI ever asks you to paste a GitHub "personal access token" into a chat, say no. Signing in through the browser is safer and you never have to handle a token.' },
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
        { t: 'snap', src: 'shots/vercel.jpg', url: 'vercel.com/signup', caption: 'Vercel sign-up. Pick Continue with GitHub.' },
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
      body: [
        { t: 'why', text: 'Almost every useful app needs to **remember** things: who signed up, what they ordered, what they wrote. Without a database, your app forgets everything the moment someone closes the page.' },
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
        { t: 'recap', items: [
          'A database is your app\'s memory, organized in tables.',
          'Neon runs Postgres and is created from inside Vercel.',
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
  ],
};
