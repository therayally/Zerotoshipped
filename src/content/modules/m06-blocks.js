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
        { t: 'why', text: 'Some products work best as an app people download, like this course. If you ever build one, the choice you make on day one decides whether your download is 5 MB or 150 MB, whether it eats your users\' memory, and how easy it is to attack.' },
        { t: 'p', text: 'Here is the trick most desktop apps use today: they are really **web apps inside a window**. You build the screens with the same web tools you already know, and a "wrapper" turns them into an app with an icon people can double-click.' },
        { t: 'table', head: ['Wrapper', 'Download size', 'Our take'], rows: [
          ['Tauri (Rust)', 'Small, about 5 to 15 MB', '**Our pick.** Fast, light and secure by default.'],
          ['Electron (Node.js)', 'Big, 100 MB or more', 'Easy and proven (Slack, VS Code), but heavy.'],
          ['Java (JavaFX)', 'Big, needs Java inside', 'Old-school. Skip it for new apps.'],
        ] },
        { t: 'p', text: 'This course you are reading is a Tauri app, which is why the download is only a few megabytes.' },
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
      title: 'SQLite vs Postgres (and no base64)',
      minutes: 11,
      body: [
        { t: 'why', text: 'AI tools make one database mistake constantly: they cram pictures and files straight into the database as giant blobs of text. Everything works fine with three test users, then slows to a crawl and gets expensive with three hundred. This lesson shows you how to spot it and what to ask for instead.' },
        { t: 'h', text: 'Two kinds of database' },
        { t: 'table', head: ['', 'SQLite', 'Postgres (Neon)'], rows: [
          ['Lives', 'In one file on the device', 'On a server in the cloud'],
          ['Best for', 'Desktop, phone and offline apps', 'Websites with many users'],
          ['Many people writing at once', 'Not really', 'Yes, that is what it is built for'],
          ['Setup', 'None', 'A few clicks in Vercel'],
        ] },
        { t: 'analogy', text: 'SQLite is a personal notebook you carry in your pocket: instant, private, perfect for one person. Postgres is the shared order book in a busy restaurant kitchen: built so many people can write in it at the same time without stepping on each other.' },
        { t: 'h', text: 'The base64 trap' },
        { t: 'p', text: '**Base64** is a way of turning a file (like a photo) into a long string of letters and numbers so it can be stored as text. AI loves this trick because it is easy. But it makes every file about a third bigger, and every time your app reads that row from the database, it drags the whole picture along with it, even when it only needed the customer\'s name.' },
        { t: 'p', text: 'The professional pattern is simple:' },
        { t: 'steps', items: [
          { do: 'Put files in **file storage** (Vercel Blob or Cloudflare R2).', why: 'File storage is built and priced for big files, and can serve them quickly around the world.' },
          { do: 'Put only the **file\'s details** in the database: its path, size, type and who owns it.', why: 'Rows stay tiny, so lists and searches stay fast.' },
          { do: 'Keep files **private** and hand out short-lived links only to the right people.', why: 'A file someone can guess the address of is a public file.' },
        ] },
        { t: 'tip', tone: 'warn', text: 'Be wary of "no-code" database tools that do not let you download all your data. Data you cannot export is data you do not really own. SQLite and Postgres can always be exported completely.' },
        { t: 'prompt', label: 'Add this to your CLAUDE.md', text: `Database rules:
- Web apps with many users: use Postgres (Neon) with Drizzle ORM.
- Desktop, mobile or offline apps: use SQLite in a file in the app's data folder.
- Never store images, PDFs, audio or video as base64 (or any blob) in the database. Upload them to object storage (Vercel Blob or Cloudflare R2), keep them private, and save only the path, size, type and owner in the database.
- Every table that holds user data has an owner column, and every query filters on it.
- All schema changes go through migration files.` },
        { t: 'deeper', title: 'Why base64 in the database really hurts', blocks: [
          { t: 'steps', items: [
            'Base64 inflates size by about **33%**, and the row is then read, backed up and copied in full every time.',
            'Big rows blow up memory and network use on every query that touches them, and serverless databases bill for that.',
            'You lose browser caching, partial downloads (needed to skip ahead in videos) and per-file access control.',
            'Object storage is far cheaper per gigabyte than database storage.',
          ] },
          { t: 'p', text: 'The upload pattern: your server gives the browser a short-lived, signed upload link for a path inside that user\'s own folder; the browser uploads straight to storage; the database saves the details; downloads go through a signed, expiring link.' },
          { t: 'p', text: 'SQLite writes one change at a time (WAL mode helps), which is perfect for single-user and offline apps. Postgres handles many simultaneous writers and adds row-level security, JSON columns and `pgvector` for AI search.' },
        ] },
        { t: 'check', q: 'Your app lets users upload profile photos. Where should the photo itself go?', options: [
          'In the database as base64 text',
          'In file storage, with only its path and owner saved in the database',
          'In the app\'s code folder',
        ], answer: 1, explain: 'Files go in file storage; the database keeps a small record pointing to them.' },
        { t: 'recap', items: [
          'SQLite for single-user/offline apps; Postgres for multi-user web apps.',
          'Never store files as base64 in the database: file storage + a small record.',
          'Prefer databases you can fully export.',
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
