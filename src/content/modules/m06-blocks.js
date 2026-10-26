export default {
  id: 'blocks',
  title: 'Know your building blocks',
  lessons: [
    {
      id: 'languages',
      title: 'Languages: Node, Python, Rust, Java',
      minutes: 10,
      body: [
        { t: 'why', text: 'Claude can write in any programming language, which means it will sometimes pick one for you, or quietly mix three in the same project. Knowing what each language is good at lets you make that choice on purpose, and stops your app from turning into a mess that is hard to fix later.' },
        { t: 'p', text: 'A **programming language** is just a way of writing instructions for a computer. They all can do most things, but each one has a sweet spot, like how a hammer, a screwdriver and a wrench can all technically hit a nail, but only one is made for it.' },
        { t: 'table', head: ['Language', 'Think of it as', 'Best for'], rows: [
          ['JavaScript / TypeScript', 'The language of the web', 'Websites and web apps. **Your default.**'],
          ['Python', 'The language of AI and data', 'AI scripts, data crunching, automations'],
          ['Rust', 'Super fast and very safe', 'Desktop apps (with Tauri), speed-critical parts'],
          ['Java / Kotlin', 'The big-company language', 'Android apps, large corporate systems'],
          ['Swift', 'Apple\'s language', 'iPhone and Mac-only apps'],
        ] },
        { t: 'h', text: 'What is Node.js?' },
        { t: 'p', text: 'You will see "Node" everywhere. **Node.js** is not a language. It is a program that lets JavaScript run on servers and on your computer, not just inside web browsers. When people say "a Node app," they mean an app written in JavaScript or TypeScript that runs on a server.' },
        { t: 'h', text: 'Why we stick to TypeScript' },
        { t: 'p', text: 'One language for your whole app (the page people see and the server behind it) means one set of tools, one set of security checks, and an AI that does not have to switch mental gears. Every extra language roughly doubles the things you need to keep updated and secure.' },
        { t: 'analogy', text: 'Running an app in one language is like a kitchen where everyone speaks the same language. Add three more languages and orders start getting lost in translation.' },
        { t: 'prompt', label: 'Ask before you build', text: `Before writing code, tell me which language and framework you plan to use for this project and why, in 3 simple sentences.
Prefer TypeScript with Next.js for web apps.
Do not mix in a second language unless I say yes.
Put the decision in ARCHITECTURE.md.` },
        { t: 'deeper', title: 'How the languages really compare', blocks: [
          { t: 'table', head: ['', 'TypeScript/Node', 'Python', 'Rust', 'Java/Kotlin'], rows: [
            ['Memory', 'Automatic', 'Automatic', 'Checked when compiling, no garbage collector', 'Automatic (JVM)'],
            ['Speed', 'Good', 'Slower (fast libraries help)', 'Near the fastest possible', 'Very good once warmed up'],
            ['Package library', 'npm, the largest', 'PyPI, dominant in AI', 'crates.io, growing', 'Maven, huge in companies'],
            ['How well AI writes it', 'Very well', 'Very well', 'Well, but fights the compiler more', 'Well, but wordy'],
          ] },
          { t: 'p', text: 'Reach for Python when you need its AI and data libraries, Rust for desktop shells or hot paths, Kotlin or Swift for truly native mobile. Otherwise, TypeScript front to back is the safest default for a small team.' },
        ] },
        { t: 'check', q: 'What is Node.js?', options: [
          'A programming language',
          'A program that lets JavaScript run on servers and computers',
          'A database',
        ], answer: 1, explain: 'Node runs JavaScript outside the browser. The language is JavaScript (or TypeScript).' },
        { t: 'recap', items: [
          'Each language has a sweet spot; TypeScript is the default for web apps.',
          'Node.js runs JavaScript on servers.',
          'One language per app is simpler and safer. Make Claude ask before adding another.',
        ] },
      ],
    },
    {
      id: 'desktop-apps',
      title: 'Desktop apps: Rust vs Electron vs Java',
      minutes: 10,
      body: [
        { t: 'why', text: 'Some products work best as an app people download, like Slack, Discord or VS Code. If you ever build one, the choice you make on day one decides whether your download is 5 MB or 150 MB, whether it eats your users\' memory, and how easy it is to attack.' },
        { t: 'p', text: 'Here is the trick most desktop apps use today: they are really **web apps inside a window**. You build the screens with the same web tools you already know, and a "wrapper" turns them into an app with an icon people can double-click.' },
        { t: 'table', head: ['Wrapper', 'Download size', 'Our take'], rows: [
          ['Tauri (Rust)', 'Small, about 5 to 15 MB', '**Our pick.** Fast, light and secure by default.'],
          ['Electron (Node.js)', 'Big, 100 MB or more', 'Easy and proven (Slack, VS Code), but heavy.'],
          ['Java (JavaFX)', 'Big, needs Java inside', 'Old-school. Skip it for new apps.'],
        ] },
        { t: 'p', text: 'Tauri apps are tiny: a few megabytes to download, compared with 100+ for most Electron apps.' },
        { t: 'analogy', text: 'Electron is like moving house and bringing your own entire kitchen with you, appliances and all. Tauri is like moving into a place that already has a kitchen and just bringing your recipes. Same meals, much lighter truck.' },
        { t: 'prompt', label: 'Turn your web app into a desktop app', text: `Turn this web app into a desktop app with Tauri 2.
- Keep the web code the same; Tauri wraps it.
- Give the app a strict Content Security Policy.
- Only allow the permissions it truly needs (capabilities). Explain each one.
- Web links should open in the normal browser.
- Make a GitHub Actions workflow that builds Mac and Windows installers when I push a version tag.
Explain each step simply.` },
        { t: 'tip', tone: 'warn', text: 'Apps that are not **signed** show a scary "can\'t be opened" warning. Signing proves the app really came from you. Apple charges $99 a year for it; Windows needs a code-signing certificate. Plan for this before a big launch.' },
        { t: 'deeper', title: 'Why Tauri is safer than Electron', blocks: [
          { t: 'p', text: '**Electron** ships a full copy of the Chrome browser and Node.js inside every app. That gives identical behavior everywhere, but large downloads, high memory use, and a big attack surface: a cross-site scripting bug in an Electron app that has Node access can let an attacker run programs on the user\'s computer.' },
          { t: 'p', text: '**Tauri** uses the browser engine already built into the operating system and a small Rust core. It is **deny-by-default**: the web code can only use native features you list in "capability" files, and a content security policy is enforced.' },
          { t: 'steps', items: [
            '**Mac:** sign with a Developer ID certificate and **notarize** with Apple, or the app is blocked by default.',
            '**Windows:** sign with a code-signing certificate to reduce SmartScreen warnings.',
            '**Updates:** Tauri\'s updater checks a signature before installing anything.',
            '**Build in the cloud:** a Mac cannot reliably build Windows installers, so use GitHub Actions to build each one on its own system.',
          ] },
        ] },
        { t: 'check', q: 'Why is a Tauri app so much smaller than an Electron app?', options: [
          'It has fewer features',
          'It uses the browser engine already on the computer instead of shipping its own',
          'It is compressed better',
        ], answer: 1, explain: 'Electron brings a whole browser with every app. Tauri borrows the one the operating system already has.' },
        { t: 'recap', items: [
          'Most desktop apps are web apps inside a native window.',
          'Tauri: small, fast and locked down by default. Electron: easy but heavy.',
          'Plan for code signing before you launch.',
        ] },
      ],
    },
    {
      id: 'databases-compared',
      title: 'Pick a database: SQLite, Postgres, MongoDB (and the Base44 trap)',
      minutes: 14,
      body: [
        { t: 'why', text: [
          'Your database is where your customers\' data lives: their accounts, orders and history. Picking it is one of the few choices that is genuinely hard to change later, so it is worth ten minutes now.',
          'This lesson compares the databases vibe coders actually use, and explains why "all-in-one" AI builders like Base44 can quietly lock your app and its data in.',
        ] },
        { t: 'analogy', text: 'A database is a filing cabinet. **SQLite** is a filing box you keep under your own desk. **Postgres** is a big, locked office cabinet with labelled folders that a whole team can use at once. **MongoDB** is a cabinet of loose folders where every folder can hold different papers. **Base44** is renting a furnished office where the landlord owns the cabinet: easy to move in, hard to move out with your files.' },
        { t: 'h', text: 'The three kinds you will meet' },
        { t: 'table', head: ['', 'SQLite', 'Postgres', 'MongoDB'], rows: [
          ['Type', 'SQL (tables), in one file', 'SQL (tables), on a server', 'Documents (JSON-like), on a server'],
          ['Best for', 'Desktop, phone and offline apps, prototypes', 'Most web apps with many users', 'Data with no fixed shape, like logs or flexible forms'],
          ['Many people writing at once', 'Not really', 'Yes', 'Yes'],
          ['Hosted options', 'Turso (SQLite in the cloud)', 'Neon, Supabase', 'MongoDB Atlas'],
          ['Free tier', 'Free (it is a file)', 'Neon and Supabase both have one', 'Atlas has a free cluster'],
          ['Can you export everything?', 'Yes, it is one file', 'Yes (pg_dump)', 'Yes (mongodump)'],
        ] },
        { t: 'p', text: '**SQL** means your data lives in tables with fixed columns, like a spreadsheet with strict rules. **Document** databases like MongoDB store each record as a flexible bundle, so two customers can have completely different fields. Flexibility sounds nice, but for apps with users, orders and payments, strict tables catch mistakes early. That is why this course defaults to Postgres.' },
        { t: 'h', text: 'The hosted databases vibe coders use most' },
        { t: 'snap', src: 'shots/supabase.jpg', url: 'supabase.com', caption: 'Supabase: Postgres plus sign-in, file storage and realtime in one dashboard.' },
        { t: 'table', head: ['Service', 'What it is', 'Pick it when'], rows: [
          ['**Neon**', 'Plain Postgres, serverless, built into Vercel', 'You host on Vercel and want the simplest setup (this course\'s default)'],
          ['**Supabase**', 'Postgres plus sign-in, file storage and realtime', 'You want login, uploads and database from one company'],
          ['**Turso**', 'SQLite in the cloud, copies close to your users', 'Small, fast apps, or one database per customer'],
          ['**MongoDB Atlas**', 'Hosted MongoDB', 'Your data truly has no fixed shape, or a team already uses Mongo'],
          ['**Firebase**', 'Google\'s document database plus sign-in', 'Simple mobile apps that sync live; harder to query and to leave'],
        ] },
        { t: 'snap', src: 'shots/turso.jpg', url: 'turso.tech', caption: 'Turso: the SQLite file you already know, hosted in the cloud.' },
        { t: 'h', text: 'The Base44 trap (and builders like it)' },
        { t: 'snap', src: 'shots/base44.jpg', url: 'base44.com', caption: 'Base44 builds a working app from one sentence. The catch is where the app and its data live.' },
        { t: 'p', text: '**Base44** (owned by Wix) builds a full app, database and login included, from a chat. It is genuinely great for trying an idea in an afternoon. To be fair, Base44 says you own what you build. But when we checked (October 2026), the details matter:' },
        { t: 'steps', items: [
          { do: 'Exporting your code to GitHub needs a **paid plan**.', why: 'On the free plan your app only exists inside Base44.' },
          { do: 'The export gives you the **code and database layout, not your data**.', why: 'Your customers\' records stay in Base44\'s database. Moving them out is a separate, manual job.' },
          { do: 'The exported app still talks to **Base44\'s backend** for its database and login.', why: 'There is no official way to run that backend yourself, so "leaving" means rebuilding those parts.' },
          { do: 'Prices and limits are set by them.', why: 'If they raise prices or change limits after you have customers, you have little room to move.' },
        ] },
        { t: 'p', text: 'So the honest answer is: you own the code on paper, but you do not fully control where your app runs or your data lives. That is called **vendor lock-in**. It is fine for a prototype; it is risky for a business.' },
        { t: 'tip', tone: 'warn', text: 'The test for any tool: "Can I download all my data and run my app somewhere else this weekend?" With Postgres on Neon, code on GitHub and hosting on Vercel, the answer is yes. That is why this course builds that way.' },
        { t: 'h', text: 'Never put files in the database' },
        { t: 'p', text: 'One more classic AI mistake: storing photos and PDFs inside the database as giant blocks of text (called base64). It makes everything slow and expensive. Files go in file storage; the database only keeps a small note saying where each file is and who owns it. The file uploads lesson shows exactly how.' },
        { t: 'prompt', label: 'Help me pick my database', text: `Help me pick a database for [MY APP]. It has about [NUMBER] users at first, and stores [WHAT, e.g. "customers, bookings and payments"]. It [does / does not] need to work offline.
Compare SQLite (Turso), Postgres (Neon or Supabase) and MongoDB Atlas for my case in a short table: cost at my size, how hard it is to set up with you, and how easy it is to export everything and leave.
Recommend one in plain words and explain why. Then add the database rules below to CLAUDE.md.` },
        { t: 'prompt', label: 'Add this to your CLAUDE.md', text: `Database rules:
- Web apps with many users: use Postgres (Neon) with Drizzle ORM.
- Desktop, mobile or offline apps: use SQLite in a file in the app's data folder (or Turso if it must sync).
- Only use MongoDB if the data truly has no fixed shape, and explain why first.
- Never store images, PDFs, audio or video in the database. Upload them to file storage (Vercel Blob or Cloudflare R2) and save only the path, size, type and owner.
- Every table that holds user data has an owner column, and every query filters on it.
- All schema changes go through migration files.
- Keep a working export script so all data can be downloaded at any time.` },
        { t: 'prompt', label: 'Escape a builder (Base44, Lovable, Bolt)', text: `I built a prototype in [BASE44 / LOVABLE / BOLT] and exported the code to this folder.
1. Read it and list everything that still depends on that builder's servers (database, login, file storage, AI calls).
2. Make a step-by-step plan to replace each one with Neon Postgres, a normal sign-in, Vercel Blob and my own API keys (keys only through a hidden terminal prompt).
3. Write a script to export my data from the builder (or tell me exactly how to download it) and import it into Neon.
Do not change anything until I approve the plan.` },
        { t: 'deeper', title: 'SQL vs documents, in more detail', blocks: [
          { t: 'p', text: 'Postgres can also store flexible JSON in a `jsonb` column, so you get strict tables where they matter and flexible fields where you need them. That is why many teams that once picked MongoDB for flexibility now use Postgres for both.' },
          { t: 'p', text: 'SQLite writes one change at a time (WAL mode helps a lot), which is perfect for single-user and offline apps. Postgres handles many simultaneous writers and adds row-level security and `pgvector` for AI search (see the RAG lesson).' },
          { t: 'p', text: 'MongoDB shines for event logs, content with very different shapes, and huge write volumes. Its trade-off is that the database will not stop you saving a record with a missing or misspelled field, so your code must.' },
        ] },
        { t: 'check', q: 'You built an app on an all-in-one AI builder. Which question tells you if you are locked in?', options: [
          '"Does it look good on phones?"',
          '"Can I download all my data and run my app somewhere else this weekend?"',
          '"Does it have dark mode?"',
        ], answer: 1, explain: 'If the honest answer is no, you are renting, not owning. That is fine for a prototype, risky for a business.' },
        { t: 'recap', items: [
          'SQLite for one-device or offline apps; Postgres (Neon/Supabase) for most web apps; MongoDB only for truly shapeless data.',
          'Base44 and similar builders are great for prototypes but keep your data and backend on their servers.',
          'Files go in file storage, never inside the database.',
        ] },
      ],
    },
    {
      id: 'mcp',
      title: 'MCP and connectors',
      minutes: 10,
      body: [
        { t: 'why', text: 'Out of the box, Claude can only see what is on your computer. With **MCP**, it can also look at your live website\'s errors on Vercel, check your database on Neon, or read your GitHub issues, and then fix things for you. It is one of the most powerful upgrades you can make, and one of the easiest to do unsafely.' },
        { t: 'p', text: '**MCP** stands for **Model Context Protocol**. It is a standard way for AI tools to plug into other apps and services. In the Claude app, these plug-ins are called **connectors**, and you already turned on GitHub, Vercel and Neon in the "Connect your accounts to Claude" lesson.' },
        { t: 'analogy', text: 'MCP is like a USB port for AI. Before USB, every device needed its own special cable. Now one standard plug works with everything. MCP does the same for connecting AI to apps.' },
        { t: 'h', text: 'Add more connectors' },
        { t: 'steps', items: [
          { do: 'In the Claude app, open **Settings → Connectors** and browse the list (Stripe, Notion, Google Drive and many more).' },
          { do: 'Click **Connect**, sign in on that company\'s own website, and approve.', why: 'Your browser handles the login, so the AI never sees your password.' },
          { do: 'For a service not in the list, use **Add custom connector** with the company\'s official MCP address from its docs.' },
        ] },
        { t: 'h', text: 'Using it safely' },
        { t: 'p', text: 'An MCP connection gives the AI hands inside another service. That is the whole point, and also the risk. A few rules:' },
        { t: 'steps', items: [
          { do: 'Only add MCP servers from companies you trust (the official Vercel, Neon, GitHub, Stripe ones).', why: 'A shady MCP server can feed the AI misleading instructions.' },
          { do: 'Start with **read-only** requests.', why: 'Let it look before you let it touch.' },
          { do: 'Keep approvals on for anything that changes, deletes or deploys.', why: 'One wrong command on a live service is much harder to undo than one wrong line of code.' },
        ] },
        { t: 'prompt', label: 'Use it safely', text: `Use the Vercel MCP server to check my latest production deployment and any runtime errors from the last 24 hours.
Only read. Do not change, delete or redeploy anything.
Explain what you find in simple words and suggest fixes.` },
        { t: 'deeper', title: 'How MCP works, and the risks to know', blocks: [
          { t: 'p', text: 'An MCP **server** exposes tools (actions), resources (data) and prompts. An MCP **client** (Claude Code, Claude Desktop, other agents) discovers and calls them. It was introduced by Anthropic in late 2024 and is now widely adopted.' },
          { t: 'table', head: ['Transport', 'Where it runs', 'Typical use'], rows: [
            ['stdio', 'A local program Claude starts', 'Files, local databases, dev tools'],
            ['Streamable HTTP', 'A remote server, usually with OAuth sign-in', 'Online services: Vercel, Neon, GitHub, Stripe'],
          ] },
          { t: 'steps', items: [
            '`--scope local` (default): only you, only this project. `--scope project`: saved in `.mcp.json` for your team (never put secrets in it). `--scope user`: all your projects.',
            '**Tool poisoning:** a malicious server can describe its tools in ways that steer the model. Install only from verified publishers.',
            '**Prompt injection through data:** issues, emails and web pages read through MCP can contain hidden instructions. Keep write actions behind your approval.',
          ] },
          { t: 'links', items: [{ label: 'MCP specification', url: 'https://modelcontextprotocol.io' }, { label: 'Claude Code MCP docs', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' }] },
        ] },
        { t: 'check', q: 'What is the safest way to start using a new MCP connection?', options: [
          'Give it full access so it can fix everything',
          'Ask for read-only actions first and keep approvals on for changes',
          'Turn off approvals to save time',
        ], answer: 1, explain: 'Let it look before you let it touch. Changes to live services deserve a human yes.' },
        { t: 'recap', items: [
          'MCP plugs AI into other services; on claude.ai they are called connectors.',
          'Add servers with `claude mcp add`, then sign in through `/mcp`.',
          'Trusted servers only, read first, approvals on for changes.',
        ] },
      ],
    },
  ],
};
