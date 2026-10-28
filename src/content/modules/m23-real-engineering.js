// Track 2: real engineering for a SaaS you sell. Architecture, environments, code practices and background jobs,
// plus shipping a desktop app, keeping customers, and the legal pages your own app needs.
import { SAFE } from '../safe';

export const engineering = {
  id: 'engineering',
  title: 'Real engineering: architecture and practices',
  lessons: [
    {
      id: 'saas-architecture',
      title: 'SaaS architecture: one app, many customers',
      minutes: 14,
      figure: 'stack',
      body: [
        { t: 'why', text: 'In Track 1 you drew a simple map of one app for one customer. A **SaaS** is one app that many businesses pay for, and each one must only ever see its own data. Getting this shape right on day one is the difference between an app you can sell to a hundred customers and one you have to rebuild after the third.' },
        { t: 'analogy', text: 'A SaaS is an **apartment building**. One building (your app), one set of pipes and wiring (your code and database), many tenants (your customers). Every apartment has its own lock, and a tenant\'s key must never open a neighbour\'s door, even by accident. The landlord (you, in the super admin panel) has a master key and uses it carefully.' },
        { t: 'h', text: 'The five rules of a SaaS data model' },
        { t: 'steps', items: [
          { do: 'Every customer business is an **organization** (also called a tenant, team or workspace).', why: 'People belong to organizations, and organizations own the data. This lets a business add staff and keep its data when someone leaves.' },
          { do: 'Every table that holds customer data has an **org_id** column.', why: 'That one column is the lock on the apartment door.' },
          { do: 'Every query filters by the signed-in user\'s org_id, **on the server**.', why: 'Never trust an org_id sent from the browser. The server looks it up from the session.' },
          { do: 'People have a **role** in each organization: owner, admin, member.', why: 'Authentication says who you are. Authorization says what you are allowed to do. You need both.' },
          { do: 'Billing belongs to the **organization**, not the person.', why: 'Businesses pay as a company, and the plan should not vanish when one employee leaves.' },
        ] },
        { t: 'h', text: 'Folders that stay tidy as you grow' },
        { t: 'table', head: ['Folder', 'What lives there'], rows: [
          ['`app/`', 'Pages and API routes. Thin: they read the request, call a service, return the answer.'],
          ['`lib/services/`', 'The real business rules ("create a booking", "cancel a plan"). One file per area.'],
          ['`lib/db/`', 'The database schema and migrations (Drizzle).'],
          ['`lib/auth/`', 'Sign-in, sessions and the "is this user allowed?" checks, in one place.'],
          ['`components/`', 'Reusable pieces of the screen.'],
          ['`docs/`', 'ARCHITECTURE.md and decision records.'],
        ] },
        { t: 'p', text: 'When rules live in services instead of being sprinkled across pages, Claude can find and change them safely, and the same rule works for your website, your mobile app and your desktop app.' },
        { t: 'h', text: 'Write down big decisions' },
        { t: 'p', text: 'Pros keep short **decision records** (ADRs): one page saying what was decided, why, and what else was considered. Six months later, when Claude (or you) wants to change something, the reason is right there.' },
        { t: 'prompt', label: 'Upgrade my architecture for a SaaS', text: `Read my code and ARCHITECTURE.md. I want this to be a SaaS that many businesses pay for.
1. Show me, in plain words, what would have to change so every business (organization) only sees its own data.
2. Plan: an organizations table, memberships with roles (owner, admin, member), an org_id on every customer table, and a server-side helper that every query uses to filter by the signed-in user's organization.
3. Plan the folders: thin routes in app/, business rules in lib/services/, schema and migrations in lib/db/, all permission checks in lib/auth/.
4. Update ARCHITECTURE.md with a Mermaid diagram and write docs/decisions/0001-multi-tenant.md explaining the choice.
5. Write a test that proves a user from one organization cannot read another organization's data.
Show me the plan first and wait for my OK.${SAFE}` },
        { t: 'deeper', title: 'Going further: row-level security and the request path', blocks: [
          { t: 'p', text: 'Postgres can enforce tenancy itself with **row-level security (RLS)**: the database refuses to return rows from another org even if your code forgets the filter. It is a strong second lock. Add it once the app has paying customers.' },
          { t: 'p', text: 'Trace one request end to end: browser → route (checks input with Zod) → auth (who is this, which org, which role) → service (business rule) → database (filtered by org_id) → response (only the fields the screen needs). Every bug and every security hole lives at one of those arrows.' },
          { t: 'p', text: 'Most SaaS apps never need microservices. One well-organized app on Vercel with one Postgres database scales to thousands of customers. Split things up only when a real problem forces you to.' },
        ] },
        { t: 'check', q: 'Where should the app get the organization ID it filters by?', options: [
          'From a hidden field the browser sends',
          'From the signed-in user\'s session, on the server',
          'From the page URL',
        ], answer: 1, explain: 'Anything the browser sends can be changed. The server looks up which organization the signed-in user belongs to.' },
        { t: 'recap', items: [
          'Organizations own data; people belong to organizations with a role.',
          'Every customer table has org_id, and the server always filters by it.',
          'Thin routes, rules in services, and decisions written down.',
        ] },
      ],
    },
    {
      id: 'environments',
      title: 'Dev, preview and production (never test on real customers)',
      minutes: 10,
      body: [
        { t: 'why', text: 'Once people pay you, a broken deploy or a test that deletes real data is a very bad day. Pros keep **three copies** of the app so changes are tried safely before customers ever see them.' },
        { t: 'analogy', text: 'A theatre has **rehearsals** in an empty room (development), a **dress rehearsal** on the real stage with no audience (preview), and **opening night** (production). Nobody tries a new stunt for the first time on opening night.' },
        { t: 'table', head: ['Environment', 'Where', 'Data', 'Who sees it'], rows: [
          ['**Development**', 'Your computer', 'A Neon dev branch with fake data', 'Only you'],
          ['**Preview**', 'A Vercel preview link for each branch or pull request', 'Its own Neon branch, a copy you can break', 'You and testers'],
          ['**Production**', 'Your real domain', 'The real customer database', 'Customers'],
        ] },
        { t: 'steps', items: [
          { do: 'Work on a **branch** in GitHub, never directly on main.', why: 'Vercel builds a preview link for every branch automatically.' },
          { do: 'Turn on the **Neon + Vercel integration\'s preview branches**.', why: 'Each preview gets its own instant copy of the database, so tests never touch real customers.' },
          { do: 'Keep **separate keys** for each environment: Stripe test keys for dev and preview, live keys only in production.' },
          { do: 'Run database changes as **migrations** that apply automatically on deploy.', why: 'Hand-editing the production database is how data gets lost.' },
          { do: 'Merge to main only when the preview works and the checks pass. That merge is the release.' },
        ] },
        { t: 'prompt', label: 'Set up safe environments', text: `Set up development, preview and production for this app:
1. Check that Vercel builds a preview for every branch, and that main is production.
2. Using my Neon and Vercel access, turn on a separate Neon database branch for each preview deployment, and a dev branch for my computer.
3. Make sure Stripe (or Square) test keys are used in development and preview, and live keys only in production. List which variables are in which environment without printing any values.
4. Make database migrations run automatically on deploy.
5. Explain the new workflow to me in five plain steps.
Show me the plan first and wait for my OK.` },
        { t: 'tip', tone: 'warn', text: 'If you ever catch yourself testing a new feature on your live site with real customer data, stop. Make a branch and test it on the preview link instead.' },
        { t: 'check', q: 'Where should you try a risky database change first?', options: [
          'On production, late at night when nobody is using it',
          'On a preview deployment with its own Neon branch',
          'Nowhere, just merge it',
        ], answer: 1, explain: 'A preview with its own database branch is a full dress rehearsal that cannot hurt real customers.' },
        { t: 'recap', items: [
          'Three environments: development, preview, production.',
          'Each preview gets its own Neon branch; real data stays in production.',
          'Test keys everywhere except production; migrations run on deploy.',
        ] },
      ],
    },
    {
      id: 'code-practices',
      title: 'Code like a pro team (even when the AI types)',
      minutes: 12,
      body: [
        { t: 'why', text: 'AI writes code fast. Without a few pro habits it also writes a mess fast. These habits are what real teams use, and they make Claude dramatically more reliable on a growing codebase.' },
        { t: 'analogy', text: 'Professional kitchens run on **mise en place**: every ingredient prepped, labelled and in its spot before cooking starts. The cooking is fast because everything is where it belongs. These habits are your code\'s mise en place.' },
        { t: 'h', text: 'The habits' },
        { t: 'table', head: ['Habit', 'What it means', 'Why it matters with AI'], rows: [
          ['**TypeScript, strict**', 'Every value has a declared type', 'Catches most AI mistakes before you ever run the app'],
          ['**Validate at the edges**', 'Check every input with a schema (Zod) where it enters', 'Bad data never reaches your rules or database'],
          ['**Small files, clear names**', 'One job per file; names that say what things do', 'Claude finds and edits the right place instead of guessing'],
          ['**One change per pull request**', 'A branch and PR for each feature or fix', 'Easy to review, easy to undo'],
          ['**Lint, format, typecheck, test in CI**', 'GitHub Actions runs them on every PR', 'A robot says no before a broken change ships'],
          ['**Review before merge**', 'Ask Claude to review the diff for bugs and security', 'A second look catches what the first pass missed'],
          ['**Keep packages updated**', 'Dependabot opens PRs for updates', 'Old packages are where known security holes live'],
        ] },
        { t: 'prompt', label: 'Set up pro habits in my project', text: `Set up professional code habits in this project:
1. Turn on TypeScript strict mode and fix what it finds, in small steps.
2. Add Zod validation to every API route and server action for anything coming from the browser.
3. Add ESLint and Prettier, and npm scripts: lint, format, typecheck, test.
4. Add a GitHub Actions workflow that runs lint, typecheck and tests on every pull request.
5. Turn on Dependabot for weekly updates.
6. Add these rules to CLAUDE.md: work on a branch, one change per pull request, run lint, typecheck and tests before saying a task is done, and keep business rules in lib/services.
Explain each step in one plain sentence.${SAFE}` },
        { t: 'prompt', label: 'Review my change like a senior engineer', text: `Review the changes on this branch like a senior engineer before I merge.
Look for: bugs, missing input validation, missing permission or org_id checks, secrets in code, slow database queries, and anything that will be confusing in six months.
List problems from most to least serious, with the file and line, and a plain-words explanation. Then fix only what I approve.` },
        { t: 'tip', tone: 'info', text: 'When something keeps breaking in the same way, do not just fix it again. Ask Claude to add a rule to CLAUDE.md or a test so it can never come back.' },
        { t: 'check', q: 'Why use TypeScript strict mode when the AI writes the code?', options: [
          'It makes the app look nicer',
          'It catches many AI mistakes before the app even runs',
          'It is required by Vercel',
        ], answer: 1, explain: 'Types are a built-in checker. When Claude passes the wrong thing somewhere, the build fails instead of your customer finding it.' },
        { t: 'recap', items: [
          'Strict TypeScript and Zod catch mistakes early.',
          'Small files, one change per PR, and a robot (CI) that checks every PR.',
          'Review before merge, and turn repeated bugs into rules or tests.',
        ] },
      ],
    },
    {
      id: 'background-jobs',
      title: 'Background jobs and schedules',
      minutes: 10,
      body: [
        { t: 'why', text: 'Some work should not happen while a customer waits: sending 500 emails, making a monthly report, retrying a payment webhook, cleaning old files. Real SaaS apps do this in the **background**, on a schedule or in a queue.' },
        { t: 'analogy', text: 'A restaurant does not chop tomorrow\'s onions while your table waits for dinner. That happens at **closing time** (a scheduled job). And when the dishwasher is full, plates go on a **rack** to be washed in order (a queue). The dining room stays fast.' },
        { t: 'table', head: ['Tool', 'What it does', 'Use it for'], rows: [
          ['**Vercel Cron Jobs**', 'Calls one of your routes on a schedule', 'Nightly cleanup, daily summaries, monthly reports'],
          ['**A job queue** (for example Inngest or Upstash QStash)', 'Runs tasks later, retries them if they fail', 'Bulk emails, AI processing, anything slow'],
          ['**Webhooks**', 'Another service calls you when something happens', 'Payments, subscriptions, form submissions'],
        ] },
        { t: 'h', text: 'Three rules that prevent disasters' },
        { t: 'steps', items: [
          { do: 'Make every job **safe to run twice** (pros call this idempotent).', why: 'Retries happen. A job that charges a card or sends an email must check whether it already did.' },
          { do: '**Protect** your cron and webhook routes with a secret or a signature check.', why: 'Otherwise anyone who finds the address can trigger them.' },
          { do: '**Log and alert** when a job fails.', why: 'Background work fails silently unless you make it loud (Sentry, an email to you).' },
        ] },
        { t: 'prompt', label: 'Add a background job', text: `Add a background job to this app: [WHAT IT SHOULD DO, e.g. "every morning at 8, email each organization owner a summary of yesterday's bookings"].
1. Use Vercel Cron for the schedule, and a queue only if the work is slow or there are many items.
2. Protect the route so only Vercel Cron can call it (check the CRON_SECRET).
3. Make it safe to run twice: record what was already done.
4. Log failures to Sentry and email me if it fails.
5. Show me how to run it once by hand to test it on a preview.${SAFE}` },
        { t: 'check', q: 'Why must a "send invoice" job be safe to run twice?', options: [
          'Because jobs sometimes retry, and the customer must not get charged or emailed twice',
          'Because it makes the job faster',
          'It does not matter',
        ], answer: 0, explain: 'Retries are normal in background work. A job should check whether it already did its work before doing it again.' },
        { t: 'recap', items: [
          'Slow or scheduled work runs in the background: cron, queues and webhooks.',
          'Every job is safe to run twice, protected, and loud when it fails.',
        ] },
      ],
    },
  ],
};

export const desktopShip = {
  id: 'desktop-ship',
  title: 'Ship and sell a desktop app',
  minutes: 14,
  body: [
    { t: 'why', text: 'A desktop app can do things a website cannot: work offline, read local files, sit in the menu bar, run all day. Building one with Tauri is the easy part. Getting it onto other people\'s computers without scary warnings, updating it, and getting paid is what this lesson covers.' },
    { t: 'analogy', text: 'Shipping a desktop app is like selling packaged food. Making the food is the fun part, but stores will only stock it with a **sealed, labelled package** (code signing) and a **way to recall or replace it** (auto-updates). And you need a **till** (payments and licences).' },
    { t: 'h', text: 'The pieces' },
    { t: 'table', head: ['Piece', 'What it is', 'Cost'], rows: [
      ['**Build for Mac and Windows**', 'GitHub Actions builds both installers on every release (tauri-action)', 'Free for public repos; included minutes for private'],
      ['**Mac signing and notarization**', 'Apple checks and approves your app so Macs open it without a warning', 'Apple Developer Program, $99 a year'],
      ['**Windows signing**', 'Proves the installer came from you; avoids the blue "Windows protected your PC" screen', 'A code signing certificate or Azure Trusted Signing (paid, varies)'],
      ['**Auto-updates**', 'The app checks GitHub Releases and installs signed updates', 'Free'],
      ['**Getting paid**', 'Your SaaS account and subscription, checked by your server', 'Your normal Stripe or Square fees'],
    ] },
    { t: 'h', text: 'The smart way to sell it' },
    { t: 'p', text: 'The simplest model: your desktop app is **another front door to your SaaS**. Customers sign in with the same account, and your server checks their subscription. One account, one bill, and it works on the web, phone and desktop. Selling one-off licence keys is possible too (services like Lemon Squeezy, Polar or Keygen handle the keys), but subscriptions through your own server are easier to manage.' },
    { t: 'tip', tone: 'warn', text: 'Never put an API key or secret inside a desktop app. Anyone can unpack the installer and read it. The app calls **your server**, and your server holds the keys.' },
    { t: 'steps', items: [
      { do: 'Join the **Apple Developer Program** if you want Mac users to open your app without warnings.', why: 'It is the one cost you cannot skip on Mac.' },
      { do: 'Use the **GitHub access token** from the access tokens lesson so Claude can create releases.' },
      { do: 'Add each signing certificate and password through the **hidden terminal prompt** as GitHub Actions secrets, never in chat.' },
      { do: 'Tag a version (for example v1.0.0). GitHub Actions builds, signs and publishes the installers to a **GitHub Release**.' },
      { do: 'Link the download from your website. Future versions reach users automatically through the updater.' },
    ] },
    { t: 'prompt', label: 'Ship my desktop app', text: `Help me ship this Tauri desktop app to customers.
1. Add a GitHub Actions workflow (tauri-action) that builds signed installers for Mac (Apple Silicon and Intel) and Windows when I push a version tag.
2. Set up Mac notarization and Windows code signing. For every certificate, password or key, open a hidden terminal prompt and save it as a GitHub Actions secret with gh. Never print them and never ask me to paste them into this chat.
3. Turn on the Tauri updater with signed updates served from GitHub Releases. Store the updater signing key in my keychain and as a GitHub secret.
4. Make the app sign in to my SaaS and ask my server whether the subscription is active. No secret keys inside the app.
5. Add a Download page to my website that picks the right installer for the visitor's computer.
Show me the plan and the costs first, and wait for my OK.` },
    { t: 'check', q: 'Where should the desktop app\'s Stripe secret key live?', options: [
      'Inside the app, so it can charge cards directly',
      'Only on your server. The app asks your server.',
      'In the installer file name',
    ], answer: 1, explain: 'Everything inside a desktop app can be unpacked and read. Secrets stay on your server.' },
    { t: 'recap', items: [
      'GitHub Actions builds and publishes signed Mac and Windows installers.',
      'Mac needs the $99/year Apple Developer Program; Windows needs a signing certificate.',
      'Sell it as part of your SaaS account; no secrets inside the app.',
    ] },
  ],
};

export const customerCare = {
  id: 'customer-care',
  title: 'Keep customers: onboarding, support and churn',
  minutes: 12,
  body: [
    { t: 'why', text: 'Getting a customer is hard. Keeping one is where a SaaS actually makes money. Most people who cancel never complain first: they just get stuck, forget, or feel ignored. A few simple systems fix most of that.' },
    { t: 'analogy', text: 'Think of your favourite café. They remember your order, say hi when you walk in, fix it fast when something is wrong, and tell you about the new pastry. That is all this lesson is: being that café, automatically.' },
    { t: 'table', head: ['System', 'What it does', 'How'], rows: [
      ['**Onboarding checklist**', 'Shows new users the 3 steps to their first win', 'A small checklist on the dashboard until it is done'],
      ['**Lifecycle emails**', 'Welcome, a tip on day 2, "your trial ends in 3 days"', 'Resend plus a scheduled background job'],
      ['**Support inbox**', 'A real support@yourdomain address', 'Cloudflare Email Routing forwards it to your Gmail, free'],
      ['**Feedback button**', 'Users report problems from inside the app', 'Saves to your database and emails you'],
      ['**Changelog**', 'A page listing what is new', 'Shows customers the app is alive and improving'],
      ['**Cancel flow**', 'One question when someone cancels: why?', 'The single most useful data you will collect'],
    ] },
    { t: 'h', text: 'Numbers to watch' },
    { t: 'steps', items: [
      { do: '**Activation:** what share of sign-ups reach their first win?', why: 'If people never get value, nothing else matters.' },
      { do: '**Churn:** what share of paying customers cancel each month?', why: 'Under 5% a month is healthy for small business software.' },
      { do: '**Reply time:** how fast you answer support.', why: 'Fast, kind replies turn complaints into loyal customers.' },
    ] },
    { t: 'prompt', label: 'Add onboarding and support', text: `Help me keep customers:
1. Add an onboarding checklist to the dashboard with the 3 steps that get a new user to their first win in [MY APP]. Hide it once done.
2. Add lifecycle emails with Resend and a daily background job: welcome (right away), a helpful tip (day 2), and "your trial ends in 3 days". Include an unsubscribe link.
3. Set up support@[MY DOMAIN] with Cloudflare Email Routing to forward to my Gmail (tell me what to click if I need to do it).
4. Add a Feedback button in the app that saves the message and emails me.
5. When someone cancels, ask one optional question: "What made you cancel?" and save the answer.
6. Add a simple admin view showing activation and monthly churn.${SAFE}` },
    { t: 'check', q: 'A customer cancels. What is the most useful thing to do?', options: [
      'Nothing, they are gone',
      'Ask one short question about why, and read every answer',
      'Make cancelling harder to find',
    ], answer: 1, explain: 'Cancel reasons tell you exactly what to fix. Hiding the cancel button just makes people angry, and in many places it is against the law.' },
    { t: 'recap', items: [
      'Onboarding checklist and lifecycle emails get people to their first win.',
      'A real support inbox, a feedback button and a changelog build trust.',
      'Watch activation and churn; read every cancel reason.',
    ] },
  ],
};

export const appLegal = {
  id: 'app-legal',
  title: 'Terms, privacy and data rights for YOUR app',
  minutes: 10,
  body: [
    { t: 'why', text: 'The moment strangers sign up or pay, your app needs a few legal pages and a couple of real features behind them. Business customers will ask for them before they buy, and the law expects them, especially if anyone in Europe or California uses your app.' },
    { t: 'analogy', text: 'Legal pages are the **posted rules and receipts** of a shop: opening hours, the returns policy, what happens to your card details. Nobody reads them until something goes wrong, and then they are the only thing that matters.' },
    { t: 'table', head: ['You need', 'What it covers'], rows: [
      ['**Terms of Service**', 'Who can use the app, payments and refunds, what is not allowed, limits on your liability'],
      ['**Privacy Policy**', 'What data you collect, why, who you share it with (Neon, Vercel, Stripe, Resend…), how long you keep it'],
      ['**Data export and delete**', 'A button or a simple request process that really works'],
      ['**Cookie consent**', 'Only if you use tracking or ad cookies. Sign-in cookies do not need a banner.'],
      ['**Subprocessor list and DPA**', 'For business customers: which services touch their data, and a data processing agreement'],
      ['**Refund and cancellation rules**', 'Easy to cancel online. Several US states and the EU require it.'],
    ] },
    { t: 'prompt', label: 'Draft my legal pages and data rights', text: `Read my app and list every kind of personal data it collects and every service that receives it.
Then:
1. Draft a Terms of Service and a Privacy Policy in plain English that match what the app really does, with a "Last updated" date.
2. Add pages for them and link them in the footer and on the sign-up form ("By signing up you agree to…").
3. Add "Download my data" and "Delete my account" to account settings. Delete must really remove or anonymise the data, including in Stripe or Square where allowed.
4. Tell me whether I need a cookie banner based on what the app actually sets.
5. Write a subprocessor list page.
Mark anything you are unsure about so I can check it.${SAFE}` },
    { t: 'tip', tone: 'info', text: 'This lesson is general education, not legal advice. AI-drafted terms are a strong start; if you are signing larger business customers or handling health, financial or children\'s data, have a lawyer review them.' },
    { t: 'check', q: 'Do you need a cookie banner for a sign-in cookie?', options: [
      'Yes, every cookie needs one',
      'No. Strictly necessary cookies, like staying signed in, do not need consent. Tracking cookies do.',
      'Only on weekends',
    ], answer: 1, explain: 'Consent rules target tracking and advertising. Cookies the app needs to work are allowed.' },
    { t: 'recap', items: [
      'Terms, Privacy and real data export and delete features.',
      'List every service that touches customer data.',
      'Cookie banners only for tracking; easy online cancellation.',
    ] },
  ],
};
