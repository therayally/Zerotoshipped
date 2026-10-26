import { SAFE } from '../safe';

// Track 2 lessons grouped into modules in course.js: launch and grow, and running the app like a company.

export const grow = [
  {
    id: 'landing-page',
    title: 'A landing page that converts',
    minutes: 11,
    body: [
      { t: 'why', text: 'Your landing page is the front door of your business. People decide in about five seconds whether to stay. A clear page turns visitors into sign-ups; a confusing one wastes every dollar and video you spend getting people there.' },
      { t: 'analogy', text: 'A landing page is a shop window. People walking by should instantly see what you sell, who it is for, and how to come in. If they have to squint, they keep walking.' },
      { t: 'h', text: 'The six parts every good landing page has' },
      { t: 'steps', items: [
        { do: '**Headline:** the result, not the feature. "Count your inventory in 10 minutes" beats "AI inventory platform."' },
        { do: '**One line under it:** who it is for and how it works.' },
        { do: '**One big button:** one action ("Start free"). Not five.' },
        { do: '**Proof:** a real screenshot, a short demo video, a customer quote.' },
        { do: '**Three benefits:** short, each with an icon or picture.' },
        { do: '**FAQ and price:** answer the worries before they become reasons to leave.' },
      ] },
      { t: 'prompt', label: 'Build my landing page', text: `Read SPEC.md and DESIGN.md, then build a landing page at the root of my site with:
a results-focused headline, one supporting line, one main button to sign up, a real screenshot of the app, three benefits, a customer quote placeholder, pricing, and an FAQ of the 5 biggest worries.
Make it fast and great on phones, add proper page titles and a social share image, and give me 3 headline options to choose from.` + SAFE },
      { t: 'tip', tone: 'info', text: 'Film a 30-second screen recording of your app solving the problem. It is the best proof on the page, and the same clip is your first TikTok.' },
      { t: 'check', q: 'Which headline is stronger?', options: [
        '"AI-powered inventory platform"',
        '"Count your inventory in 10 minutes, not an hour"',
        '"Welcome to our website"',
      ], answer: 1, explain: 'Headlines that promise a result people want beat descriptions of technology.' },
      { t: 'recap', items: [
        'Headline = the result; one line on who it is for.',
        'One button, real proof, three benefits, FAQ and price.',
        'Your demo video doubles as your first marketing post.',
      ] },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing your app',
    minutes: 10,
    body: [
      { t: 'why', text: 'Most first-time builders charge too little, or never ask for money at all. Pricing is not greedy; it is how you find out whether your app solves a real problem. People pay for things that matter to them.' },
      { t: 'analogy', text: 'Pricing is like a menu at a restaurant. Most places offer a small, a regular and a large, and most people pick the middle. Your plans can work the same way.' },
      { t: 'h', text: 'Simple pricing that works' },
      { t: 'table', head: ['Model', 'How it works', 'Good for'], rows: [
        ['**Free + paid**', 'A useful free plan; pay to unlock more', 'Apps that spread by word of mouth'],
        ['**Free trial**', 'Everything free for 7–14 days, then pay', 'Business tools with clear value'],
        ['**One-time price**', 'Pay once, use forever', 'Simple tools, templates, courses'],
        ['**Monthly subscription**', 'Pay every month (with a yearly discount)', 'Anything people use regularly'],
      ] },
      { t: 'steps', items: [
        { do: 'Price by the **value** you create, not your costs. Saves a business owner 5 hours a month? $29 is cheap for them.' },
        { do: 'Offer **2–3 plans** at most, and highlight the one most people should pick.' },
        { do: 'Offer **yearly** at about two months free.', why: 'Customers save; you get paid up front and keep them longer.' },
        { do: 'Talk to the first 10 customers about price, then adjust.' },
      ] },
      { t: 'p', text: 'To charge monthly, use the next lesson (subscriptions). It uses the exact same setup as this course\'s own donations: accounts, a hosted checkout and a signed webhook.' },
      { t: 'check', q: 'Your tool saves a small business about 5 hours a month. What should guide your price?', options: [
        'Your hosting costs',
        'The value of those 5 hours to them',
        'Whatever the cheapest competitor charges',
      ], answer: 1, explain: 'Value-based pricing: charge a fair share of what you save or earn them.' },
      { t: 'recap', items: [
        'Pick one model: free + paid, trial, one-time or subscription.',
        '2–3 plans, one highlighted; yearly with a discount.',
        'Price on value, then adjust from real customer conversations.',
      ] },
    ],
  },
  {
    id: 'launch-plan',
    title: 'Launch: TikTok, Product Hunt and search',
    minutes: 12,
    body: [
      { t: 'why', text: 'Building it is half the job. Nobody finds a new app by accident. A simple launch plan gets your first 100 users, and the habits here keep new people arriving every week.' },
      { t: 'analogy', text: 'Launching is like opening a food truck. You do not just park and wait. You post where you will be, invite friends for opening day, and hand out samples, then you keep showing up so people learn where to find you.' },
      { t: 'h', text: 'Build in public (TikTok, Reels, Shorts)' },
      { t: 'steps', items: [
        { do: 'Post short videos of what you are building: the problem, the fix, the before and after.', why: 'People follow a journey. By launch day, they are already rooting for you.' },
        { do: 'Show your screen. Real progress beats polished ads.' },
        { do: 'End with one clear next step: "link in bio to try it free."' },
      ] },
      { t: 'h', text: 'Launch day' },
      { t: 'steps', items: [
        { do: 'Email or message everyone who said they wanted it (your interview people first).' },
        { do: 'Post it on **Product Hunt**, a site where people discover new products. Prepare screenshots, a short video and a friendly first comment.' },
        { do: 'Share in a few online communities where your users hang out, following each one\'s rules about self-promotion.' },
        { do: 'Reply to every comment and message that day.' },
      ] },
      { t: 'h', text: 'Be findable on Google (search basics)' },
      { t: 'prompt', label: 'Make my site search-friendly', text: `Make my site easy for search engines:
1. A clear page title and description on every public page.
2. A sitemap and robots.txt (keep private pages like admin and account pages out of search).
3. A social share image for links.
4. Fast loading on phones.
Then tell me how to add my site to Google Search Console and submit the sitemap.` },
      { t: 'tip', tone: 'warn', text: 'Never buy fake reviews, followers or upvotes. Platforms detect it, it can get you banned, and in many places fake reviews are illegal.' },
      { t: 'check', q: 'What makes "build in public" work?', options: [
        'Posting one ad on launch day',
        'Sharing real progress over time so people follow the journey',
        'Keeping the app secret until it is perfect',
      ], answer: 1, explain: 'An audience that watched you build it is your launch-day crowd.' },
      { t: 'recap', items: [
        'Post your progress before launch; real screens beat ads.',
        'Launch day: tell your interviewees, Product Hunt, a few communities, reply to everyone.',
        'Search basics: titles, sitemap, share image, Search Console.',
      ] },
    ],
  },
];

export const run = [
  {
    id: 'backups',
    title: 'Backups you can actually restore',
    minutes: 12,
    body: [
      { t: 'why', text: [
        'One bad command, one buggy migration, one angry ex-employee, and your customers\' data is gone. Every serious company has backups, but the secret is that a backup only counts if you have **tested restoring it**.',
        'This lesson sets up three layers of protection and a 15-minute restore drill.',
      ] },
      { t: 'analogy', text: 'Backups are a spare house key. Having one is good. Having one with a neighbor, one in a lockbox, and having actually tried them in the lock is what saves you at 2 AM.' },
      { t: 'h', text: 'Three layers' },
      { t: 'table', head: ['Layer', 'What it protects', 'How'], rows: [
        ['**Code**', 'Your app itself', 'GitHub already has every version (the GitHub module covers undo)'],
        ['**Database restore points**', 'Data, back to any minute in a recent window', 'Neon keeps a history and can restore to an earlier point in time; paid plans keep it longer'],
        ['**Off-site export**', 'Data, even if your database account itself has a problem', 'A nightly export of the database saved somewhere else (another storage account)'],
      ] },
      { t: 'p', text: 'The classic rule is **3-2-1**: 3 copies of your data, on 2 different kinds of storage, with 1 somewhere else entirely.' },
      { t: 'h', text: 'Use a database branch before risky changes' },
      { t: 'p', text: 'Neon can make an instant copy of your database called a **branch**. Before a big change (a migration, a bulk edit), make a branch, try the change there, and only run it for real when it works.' },
      { t: 'prompt', label: 'Set up my backups', text: `Set up backups for my app:
1. Tell me how far back my Neon plan can restore (point-in-time) and how to restore from the Neon dashboard.
2. Add a nightly GitHub Action that exports the database (pg_dump) and stores the file in private storage outside Neon, keeping the last 14 days. Use secrets stored in GitHub Actions secrets (help me add them with a hidden terminal prompt), never in the workflow file.
3. Add a short RESTORE.md with exact steps to restore from each backup.
4. Before running any migration, always create a Neon branch first and test on it.` + SAFE },
      { t: 'h', text: 'The 15-minute restore drill (every 3 months)' },
      { t: 'steps', items: [
        { do: 'Make a new Neon branch from yesterday\'s point in time.' },
        { do: 'Point a preview copy of your app at it.' },
        { do: 'Check that a few real records are there and look right.' },
        { do: 'Delete the test branch and write the date in RESTORE.md.', why: 'Now you know it works, and how long it takes.' },
      ] },
      { t: 'check', q: 'When does a backup actually count?', options: [
        'When it is turned on',
        'When you have successfully restored from it at least once',
        'When it is very large',
      ], answer: 1, explain: 'An untested backup is a hope, not a plan.' },
      { t: 'recap', items: [
        'Three layers: GitHub for code, Neon restore points, a nightly off-site export.',
        'Branch the database before risky changes.',
        'Practice a restore every 3 months; write it down.',
      ] },
    ],
  },
  {
    id: 'admin-panel',
    title: 'Build a super admin panel (with tenants)',
    minutes: 16,
    body: [
      { t: 'why', text: [
        'Once real people use your app, you need a private control room: see who signed up, fix accounts, issue refunds, change settings, without editing the database by hand.',
        'This course has one. It is the panel at tinyappcode.com/superadmin. This lesson shows exactly how it was built, so you can build the same for your app, including **tenants** for apps that serve many businesses.',
      ] },
      { t: 'analogy', text: 'An admin panel is the manager\'s office in a store. Customers never see it, it has a lock only the manager has a key to, and there is a logbook on the desk where every action gets written down.' },
      { t: 'h', text: 'How this course\'s super admin panel works' },
      { t: 'table', head: ['Protection', 'What it does', 'Why'], rows: [
        ['**Its own private address**', '/superadmin, hidden from search engines', 'Nothing links to it, and it is not in Google'],
        ['**Only one email can sign in**', 'The super admin email is a server setting, not something you can sign up as', 'Even a hacked regular account cannot get in'],
        ['**Password + emailed code, every time**', 'Two-step sign-in on every visit', 'A stolen password alone is useless'],
        ['**A short, locked-down session**', 'A secure cookie that lasts 12 hours and ends if the password changes', 'Lost laptop? Change the password and every session ends'],
        ['**Logbook (audit log)**', 'Every sign-in, setting change, refund and donation is recorded', 'You can always see who did what, and when'],
        ['**Secrets stay secret**', 'Keys are encrypted in the database and never shown again after saving', 'Even someone looking over your shoulder cannot copy them'],
        ['**Limits on everything**', 'Rate limits on sign-in, server-side checks on every action', 'The panel cannot be brute-forced or tricked from the browser'],
      ] },
      { t: 'h', text: 'Tenants: one app, many businesses' },
      { t: 'p', text: 'If your app serves many businesses (for example, many restaurants each with their own staff and data), each business is a **tenant**. Every row in the database carries a tenant ID, and every query filters by it, so one business can never see another\'s data. The "Build real business apps" lesson goes deeper; here we add the super admin side.' },
      { t: 'figure', name: 'tenants' },
      { t: 'p', text: 'Your super admin panel then lets **you** (and only you) manage tenants:' },
      { t: 'steps', items: [
        { do: '**See every tenant:** name, plan, status, number of users, last active.' },
        { do: '**Suspend or reactivate** a tenant who has not paid or broke the rules.' },
        { do: '**Change a plan** or extend a trial.' },
        { do: '**View as tenant (read-only)** to help with support, with every look recorded in the logbook.', why: 'Support without ever changing their data by accident, and with a record they could ask to see.' },
      ] },
      { t: 'prompt', label: 'Build my super admin panel', text: `Build a super admin panel for my app at /superadmin, modeled on these rules:
- Only the email in the SUPER_ADMIN_EMAIL server setting can sign in. Not an account type anyone can sign up for.
- Password plus a 6-digit emailed code on every sign-in. A secure, HTTP-only, SameSite=Strict cookie that lasts 12 hours and stops working if the password changes.
- Hidden from search engines (noindex), never linked from the public site.
- An audit_log table: every sign-in, change, refund and "view as" is recorded with who, what and when. Show it in the panel.
- Settings with secret keys are encrypted at rest and never shown back after saving.
- Pages: Overview (key numbers), Users, Tenants (list, suspend/reactivate, change plan, read-only "view as" that is logged), Payments, Settings, Activity log.
- Every action is checked on the server; nothing is trusted from the browser. Rate-limit sign-in.
Use my existing sign-in and email-code system. Explain the security of each part in plain English when done.` + SAFE },
      { t: 'tip', tone: 'warn', text: 'Never add a "log in as this user" button that lets you act as a customer. Read-only "view as" with a logbook entry is enough for support, and it keeps you out of trouble.' },
      { t: 'deeper', title: 'Roles, least privilege and tenant isolation in the database', blocks: [
        { t: 'p', text: 'If you hire help, give them a lower role (support) that can view and add notes but cannot change keys, payment links or delete anything. In this course\'s panel, only the super admin can change keys and payment settings.' },
        { t: 'p', text: 'For strong tenant isolation, Postgres **row-level security** can enforce "only rows for this tenant" inside the database itself, so even a buggy query cannot leak another tenant\'s data.' },
        { t: 'p', text: 'Keep the admin panel\'s code separate from customer pages and give its API routes their own checks (`requireSuperAdmin`) at the top of every handler.' },
      ] },
      { t: 'check', q: 'Why is the super admin email a server setting instead of an account option?', options: [
        'It is easier to type',
        'So no one can sign up or upgrade themselves into the admin role',
        'Server settings are faster',
      ], answer: 1, explain: 'If admin is just a flag on an account, a bug can flip it. A server setting cannot be changed from the app.' },
      { t: 'recap', items: [
        'Private address, one allowed email, password + code every time, short sessions.',
        'Logbook for every action; secrets encrypted and never shown again.',
        'Tenants: tenant ID on every row; super admin can suspend, change plans, and view read-only with a log.',
      ] },
    ],
  },
];
