// Track 2: the things real apps need that tutorials skip. Phones, debugging, automatic tests, sign-in services, other AI builders, and business basics.
import { SAFE } from '../safe';

export const mobileApps = {
  id: 'mobile-apps',
  title: 'Get your app on phones: PWA or Expo',
  minutes: 14,
  body: [
    { t: 'why', text: 'Most of your customers will open your app on a phone. You have two real options: make your website installable (a PWA), or build a true App Store app with Expo. Picking the right one saves you weeks and the app store headaches you do not need yet.' },
    { t: 'analogy', text: 'A PWA is a food truck: you can open tomorrow, anywhere, with no landlord\'s approval. An App Store app is a shop in a mall: more foot traffic and a proper sign, but you pay rent, follow the mall\'s rules, and wait for approval.' },
    { t: 'table', head: ['', 'PWA (installable website)', 'Expo (real native app)'], rows: [
      ['What it is', 'Your Vercel site, with an icon on the home screen', 'A real iPhone and Android app, written in React'],
      ['App Store listing', 'No (people install from the website)', 'Yes, both stores'],
      ['Cost to publish', 'Free', 'Apple $99/year, Google $25 once'],
      ['Updates', 'Instant, every deploy', 'Through store review (Expo can push small updates instantly)'],
      ['Camera, location, notifications', 'Yes (iPhone needs it added to the home screen for push)', 'Yes, all of it, plus Bluetooth, background tasks, widgets'],
      ['Best for', 'Most first apps, tools for businesses, scanners', 'Consumer apps that need the store, heavy offline use, deep phone features'],
    ] },
    { t: 'tip', tone: 'info', text: 'Start with a PWA. If customers keep asking "is it in the App Store?", that is your signal to build the Expo version, reusing your same backend and database.' },
    { t: 'h', text: 'Option 1: make your site a PWA (an afternoon)' },
    { t: 'prompt', label: 'Turn my site into a PWA', text: `Make my app an installable PWA:
- Add a web app manifest with my name, colors and icons (192px and 512px, plus an Apple touch icon), made from my logo.
- Add a service worker that caches the app shell so it opens fast and shows a friendly offline page.
- Add an "Install app" button that appears only when the browser supports installing, with simple iPhone instructions (Share → Add to Home Screen).
- Check every screen at 375px wide: big tap targets, no sideways scrolling, safe areas for the iPhone notch.
Run a Lighthouse PWA check and tell me the results in plain words.` },
    { t: 'h', text: 'Option 2: a real app with Expo' },
    { t: 'snap', src: 'shots/expo.jpg', url: 'expo.dev', caption: 'Expo: build iPhone and Android apps with React, test on your own phone with the free Expo Go app, and publish with EAS.' },
    { t: 'steps', items: [
      { do: 'Install **Expo Go** on your phone from the App Store or Google Play.', why: 'It runs your app on your real phone while you build, by scanning a QR code.' },
      { do: 'Ask Claude to create the Expo app (prompt below) and run it.', why: 'Expo sets up both iPhone and Android in one project.' },
      { do: 'Scan the QR code in your terminal with your phone camera.', why: 'Every save in the code updates the app on your phone within seconds.' },
      { do: 'When ready to publish: join the **Apple Developer Program** ($99/year) and **Google Play Console** ($25 once).', why: 'The stores require a paid developer account. Apple also reviews every release.' },
      { do: 'Use **EAS Build** and **EAS Submit** to build and send the app to the stores.', why: 'Builds iPhone apps in the cloud, so you do not even need a Mac.' },
    ] },
    { t: 'prompt', label: 'Create my Expo app', text: `Create an Expo (React Native) app in a new folder called mobile/ for my existing app.
- It talks to my existing backend API on Vercel; do not create a second database.
- Screens: [LIST 3-5 MAIN SCREENS]. Follow my DESIGN.md colors and fonts.
- Sign-in uses the same accounts as my website. Store the session token in the phone's secure storage, never plain storage.
- Start it and show me how to open it on my phone with Expo Go.
Explain every new tool you use in plain words.${SAFE}` },
    { t: 'tip', tone: 'warn', text: 'Never put secret API keys inside a mobile app. Anyone can unpack an app and read them. The app calls your server; your server holds the keys.' },
    { t: 'check', q: 'You want customers to try your scheduling tool on their phones next week. Best first step?', options: [
      'Pay Apple $99 and wait for review',
      'Make your website a PWA they can add to their home screen',
      'Rewrite the app in Swift',
    ], answer: 1, explain: 'A PWA is live today, free, and updates instantly. Go native when customers actually need it.' },
    { t: 'recap', items: [
      'PWA first: installable website, free, instant updates.',
      'Expo when you need the App Store or deep phone features: same backend, React code.',
      'No secrets in mobile apps; the server holds the keys.',
    ] },
  ],
};

export const debugging = {
  id: 'debugging',
  title: 'Debugging: find and fix bugs like a pro (plus Sentry)',
  minutes: 14,
  body: [
    { t: 'why', text: 'Everything breaks sometimes, even at Google. The difference between beginners and pros is not fewer bugs. It is knowing where to look, giving Claude the right clues, and hearing about problems before customers email you.' },
    { t: 'analogy', text: 'Debugging is being a doctor. "I feel bad" is hard to treat. "Fever of 101 since Tuesday, cough, after a flight" gets a diagnosis. Your job is to collect the symptoms (error messages, logs, steps to reproduce) so Claude can diagnose.' },
    { t: 'h', text: 'Where errors show up' },
    { t: 'table', head: ['Place', 'How to open it', 'What it shows'], rows: [
      ['**Browser console**', 'Right-click the page → Inspect → Console (or Cmd + Option + J)', 'Errors in the page itself, in red'],
      ['**Network tab**', 'Inspect → Network, then repeat the action', 'Which request failed and its status (404 not found, 500 server crash)'],
      ['**Terminal**', 'Where `npm run dev` is running', 'Server errors while you build locally'],
      ['**Vercel logs**', 'Vercel → your project → Logs', 'Server errors on the live site'],
      ['**Sentry**', 'Your Sentry dashboard (set up below)', 'Every error real users hit, with the exact line and browser'],
    ] },
    { t: 'h', text: 'The 5-step bug recipe' },
    { t: 'steps', items: [
      { do: '**Reproduce it:** write the exact steps that cause the bug.', why: 'If you cannot make it happen on purpose, you cannot prove it is fixed.' },
      { do: '**Collect clues:** copy the full error text, a screenshot, and the console and Network output.', why: 'The full error usually says the file and line number.' },
      { do: '**Hand it all to Claude** with the prompt below.', why: 'Clues plus steps get a real fix; "it\'s broken" gets a guess.' },
      { do: '**Ask for the cause first, then the fix.**', why: 'Understanding why stops the same bug coming back somewhere else.' },
      { do: '**Add a test** so this bug can never return unnoticed.', why: 'Pros fix a bug once.' },
    ] },
    { t: 'prompt', label: 'Fix this bug (the right way)', text: `I found a bug.
What I did: [EXACT STEPS]
What I expected: [WHAT SHOULD HAPPEN]
What happened: [WHAT HAPPENED]
Error message (full text): [PASTE]
Console / Network / Vercel log output: [PASTE, or say "none"]
Where: [local / preview / live], [browser and phone or computer]

1. Explain the most likely cause in plain words before changing anything.
2. Fix the cause, not just the symptom.
3. Add a test that would have caught this.
4. Tell me how to check the fix myself.` },
    { t: 'tip', tone: 'info', text: 'Stuck in a loop where Claude keeps trying fixes that do not work? Stop. Run /rewind back to before the bug, or /clear and start fresh with the bug prompt and all the clues. A clean start often solves it in one try.' },
    { t: 'h', text: 'Sentry: hear about errors before customers do' },
    { t: 'snap', src: 'shots/sentry.jpg', url: 'sentry.io', caption: 'Sentry: catches every error your real users hit and emails you, with the exact line of code. The free plan covers small apps.' },
    { t: 'steps', items: [
      { do: 'Sign up at **sentry.io** with GitHub and create a project for your framework (for example Next.js).', why: 'Free for small apps.' },
      { do: 'Let Claude run Sentry\'s setup wizard and add the keys with the hidden terminal prompt.', why: 'The wizard wires up both the browser and the server.' },
      { do: 'Make a test error to see it arrive, then turn on **email alerts** for new issues.', why: 'Now you know about crashes within minutes.' },
    ] },
    { t: 'prompt', label: 'Add Sentry to my app', text: `Add Sentry error tracking to my app.
1. Run the official Sentry setup wizard for my framework and explain what it changed.
2. The DSN (project address) can go in .env.local as normal. The SENTRY_AUTH_TOKEN is secret: collect it only through a hidden terminal prompt, save it to .env.local and Vercel as a Sensitive variable, and never print it.
3. Do not send passwords, card details, or full email addresses to Sentry (scrub them).
4. Add a hidden test button for admins that throws a test error, so I can check it works on the live site.
5. Show me where to turn on email alerts.` },
    { t: 'check', q: 'What should you give Claude when asking it to fix a bug?', options: [
      '"It\'s broken, fix it"',
      'Exact steps, what you expected, what happened, and the full error text and logs',
      'Just a screenshot of the homepage',
    ], answer: 1, explain: 'Symptoms and clues lead to a diagnosis. Vague complaints lead to guesses.' },
    { t: 'recap', items: [
      'Errors live in the console, Network tab, terminal, Vercel logs and Sentry.',
      'Reproduce, collect clues, ask for cause first, fix, add a test.',
      'Sentry emails you about real users\' errors with the exact line.',
    ] },
  ],
};

export const playwright = {
  id: 'playwright',
  title: 'Automatic tests with Playwright (a robot that clicks your app)',
  minutes: 13,
  body: [
    { t: 'why', text: 'Every time Claude changes something, something else can quietly break: the sign-up button, the checkout, the phone layout. Clicking through your whole app after every change is impossible. **Playwright** is a free robot that does it for you, in seconds, every time.' },
    { t: 'analogy', text: 'Playwright is a mystery shopper who visits your store after every renovation: walks in, signs up, buys something, and reports exactly what went wrong, with photos.' },
    { t: 'snap', src: 'shots/playwright.jpg', url: 'playwright.dev', caption: 'Playwright: free, from Microsoft. It drives real Chrome, Firefox and Safari engines, and can pretend to be a phone.' },
    { t: 'h', text: 'What to test first' },
    { t: 'p', text: 'Do not test everything. Test the few paths that would cost you money or customers if they broke. These are called **critical paths**.' },
    { t: 'table', head: ['Critical path', 'The robot checks'], rows: [
      ['Sign up and sign in', 'A new user can create an account and get in'],
      ['The main job', 'A user can do the one thing your app is for'],
      ['Payment', 'Checkout works with a Stripe or Square test card'],
      ['Phone layout', 'Key pages work at iPhone size with no sideways scroll'],
      ['Security', 'A signed-out visitor cannot see someone else\'s data'],
    ] },
    { t: 'prompt', label: 'Add Playwright tests', text: `Add Playwright end-to-end tests to my app.
1. Install Playwright with Chrome and an iPhone-size device.
2. Write tests for my critical paths: [sign up, sign in, MAIN JOB, checkout with a test card, signed-out user cannot see private pages].
3. Use a separate test account and test data, never real customers. Store any test passwords in .env.test (gitignored), not in the test files.
4. Run them against my local app and show me the results in plain words, with screenshots of any failure.
5. Add "npm run test:e2e" and explain how to run it.` },
    { t: 'prompt', label: 'Run tests on every push (GitHub Actions)', text: `Set up GitHub Actions so my Playwright tests run automatically on every pull request.
- Build the app, start it, run the tests, and upload screenshots and the report if anything fails.
- Mark the pull request red if a test fails, so I never merge a broken change.
- Keep any test secrets in GitHub Actions secrets (help me add them; never paste them in chat).` },
    { t: 'tip', tone: 'info', text: 'Add this line to CLAUDE.md: "Run npm run test:e2e before saying a feature is done. If a test fails, fix it or explain why." Now Claude checks its own work.' },
    { t: 'deeper', title: 'Playwright superpowers', blocks: [
      { t: 'p', text: '`npx playwright codegen yoursite.com` opens a browser and writes test code as you click around. Great for your first tests.' },
      { t: 'p', text: 'The **trace viewer** replays a failed test step by step with screenshots, network and console, like a flight recorder.' },
      { t: 'p', text: 'There is also a Playwright **MCP server**, so Claude Code can drive a browser itself to check pages while it works.' },
    ] },
    { t: 'check', q: 'Which test should you write first?', options: [
      'That the footer has the right year',
      'That a new customer can sign up and pay',
      'That every button has a hover color',
    ], answer: 1, explain: 'Test what costs you money or customers if it breaks: sign-up, the main job, payment.' },
    { t: 'recap', items: [
      'Playwright is a free robot that clicks through your app after every change.',
      'Test critical paths first: sign-up, main job, payment, phone layout, privacy.',
      'Run them automatically on every pull request with GitHub Actions.',
    ] },
  ],
};

export const authServices = {
  id: 'auth-services',
  title: 'Sign-in services: build it or rent it?',
  minutes: 11,
  body: [
    { t: 'why', text: 'Sign-in looks simple and is one of the hardest things to get right: password resets, email codes, "sign in with Google", locked accounts, stolen sessions. You can let Claude build it, or plug in a service that does only this, all day, for millions of apps.' },
    { t: 'analogy', text: 'A sign-in service is hiring a professional security company for your building\'s front door instead of building your own locks. You still decide who is allowed in; they make sure the door is solid.' },
    { t: 'snap', src: 'shots/clerk.jpg', url: 'clerk.com', caption: 'Clerk: ready-made sign-in screens, Google and Apple login, two-factor and user management.' },
    { t: 'table', head: ['Option', 'What it is', 'Good when'], rows: [
      ['**Clerk**', 'Hosted sign-in with ready-made screens', 'You want it working today with the least code'],
      ['**Supabase Auth**', 'Sign-in included with Supabase', 'You already use Supabase for your database'],
      ['**Auth.js / Better Auth**', 'Free open-source libraries, users stored in YOUR database', 'You want no monthly fee and full control (more setup)'],
      ['**Firebase Auth**', 'Google\'s sign-in service', 'Mobile apps already on Firebase'],
      ['**Auth0**', 'Enterprise sign-in', 'Big business customers who need SSO'],
      ['**Build your own**', 'Claude writes it (like this course\'s site)', 'You understand the security rules and want zero lock-in'],
    ] },
    { t: 'p', text: 'This course\'s own site uses built-in sign-in: scrambled (hashed) passwords, 6-digit email codes for new devices, rate limits and lockouts. That is fine when you know the rules. For most first apps, a service or a well-known library is the safer bet.' },
    { t: 'tip', tone: 'warn', text: 'Whatever you pick, never store plain passwords, always rate-limit sign-in, and check on the server that the signed-in user owns the data they ask for. Sign-in tells you WHO someone is; your code still has to decide WHAT they may see.' },
    { t: 'prompt', label: 'Add sign-in the safe way', text: `Add sign-in to my app using [Clerk / Supabase Auth / Better Auth].
- Email sign-in plus "Continue with Google".
- Protect every private page and API route on the server, not just by hiding buttons.
- Every database query for user data filters by the signed-in user's id.
- Add a sign-out button that is easy to find, and a page where users can delete their account.
- Help me add any keys through a hidden terminal prompt only.
Explain in plain words what the service handles and what my code still has to handle.${SAFE}` },
    { t: 'check', q: 'You use Clerk for sign-in. Is your app automatically secure?', options: [
      'Yes, Clerk handles everything',
      'No: Clerk proves who the user is, but your server must still check they own the data they request',
      'Only on weekends',
    ], answer: 1, explain: 'Authentication (who) is the service\'s job. Authorization (what they may see) is still yours.' },
    { t: 'recap', items: [
      'Sign-in is hard; a service (Clerk, Supabase Auth) or library (Better Auth, Auth.js) is safer than winging it.',
      'Open-source libraries keep users in your database with no monthly fee.',
      'Sign-in says who; your server still decides what they can see.',
    ] },
  ],
};

export const aiBuilders = {
  id: 'ai-builders',
  title: 'Lovable, Bolt, v0, Replit, Base44: when to use them',
  minutes: 12,
  body: [
    { t: 'why', text: 'You will see ads for AI app builders that make an app from one sentence. They are real and genuinely useful, and also not the same as what you are learning here. Knowing when to use each saves you money and a painful rebuild later.' },
    { t: 'analogy', text: 'AI builders are a furnished apartment: move in today, but you cannot knock down walls and the landlord sets the rent. Claude Code with your own GitHub, Vercel and database is owning a house: more work up front, but every wall is yours.' },
    { t: 'snap', src: 'shots/lovable.jpg', url: 'lovable.dev', caption: 'Lovable: describe an app and get a working one in the browser, with a database through Supabase.' },
    { t: 'snap', src: 'shots/bolt.jpg', url: 'bolt.new', caption: 'Bolt: builds and runs full apps in your browser tab.' },
    { t: 'snap', src: 'shots/v0.jpg', url: 'v0.app', caption: 'v0 by Vercel: excellent at good-looking React screens that deploy straight to Vercel.' },
    { t: 'snap', src: 'shots/replit.jpg', url: 'replit.com', caption: 'Replit: an AI agent plus hosting, all in the browser.' },
    { t: 'table', head: ['Tool', 'Great for', 'Watch out for'], rows: [
      ['**Lovable**', 'Fast prototypes with login and a database', 'Credits run out fast on big apps; tied to Supabase'],
      ['**Bolt**', 'Trying ideas in the browser, no setup', 'Larger apps get harder to steer'],
      ['**v0**', 'Beautiful UI and screens, Next.js code', 'Strongest on the front end; you add the backend'],
      ['**Replit**', 'Learning, small tools, hosting in one place', 'Costs grow with usage; hosting tied to Replit'],
      ['**Base44**', 'One-sentence internal tools and prototypes', 'Data and backend stay on Base44 (see the database lesson)'],
      ['**Claude Code** (this course)', 'Real products you own, any size, any stack', 'More setup; you learn more of how it works'],
    ] },
    { t: 'h', text: 'A smart way to combine them' },
    { t: 'steps', items: [
      { do: 'Use a builder (or v0) to **prototype** the idea and the look in an afternoon.', why: 'Show it to 5 customers before investing weeks.' },
      { do: 'If people want it, **export the code to GitHub**.', why: 'Most builders let you export, sometimes only on paid plans.' },
      { do: 'Open it in **Claude Code** and move it onto your own stack (Neon, Vercel, your keys).', why: 'Now you own it, and it can grow.' },
    ] },
    { t: 'prompt', label: 'Should I use a builder for this?', text: `My idea: [DESCRIBE THE APP]. Who it is for: [WHO]. Will I charge money? [YES/NO]. Expected users in year one: [NUMBER].
Compare building it in Lovable, Bolt, v0, Replit, Base44 and Claude Code (with GitHub, Vercel and Neon) for my case.
For each: speed to first version, monthly cost at my size, how easy it is to export everything and leave, and what I would have to rebuild later.
Recommend a plan (maybe prototype in one, build in another) in plain words.` },
    { t: 'check', q: 'Your prototype in an AI builder has paying customers. What is the smart next step?', options: [
      'Keep adding features there forever',
      'Export to GitHub and move it onto a stack you own, like Claude Code + Vercel + Neon',
      'Delete it and start over with no plan',
    ], answer: 1, explain: 'Prototype fast, then own the version your business depends on.' },
    { t: 'recap', items: [
      'AI builders are great for prototypes and quick internal tools.',
      'Check export, data ownership and cost before building a business on one.',
      'Prototype there, then move to your own stack with Claude Code.',
    ] },
  ],
};

export const businessBasics = {
  id: 'business-basics',
  title: 'Business basics: LLC, taxes, sales tax and contracts',
  minutes: 14,
  body: [
    { t: 'why', text: 'The moment someone pays you, you are a business. A few boring steps now protect your personal savings, keep the tax office happy and stop client disputes. None of it is hard; most people just do not know the list exists.' },
    { t: 'analogy', text: 'An LLC is a firewall between your business and your house. If the business gets sued or owes money, the fire stays on the business side and your personal savings and car stay safe, as long as you keep the two separate.' },
    { t: 'tip', tone: 'warn', text: 'This lesson is general education for the US, not legal or tax advice. Rules differ by state and country. For your situation, talk to an accountant or lawyer; many offer a cheap first call.' },
    { t: 'h', text: 'The starter checklist' },
    { t: 'steps', items: [
      { do: '**Form an LLC** with your state\'s Secretary of State website. Fees vary by state (roughly $50 to $500).', why: 'Separates business risk from your personal money. You can do it yourself online; you do not need a paid service.' },
      { do: 'Get a free **EIN** (business tax number) from the IRS website.', why: 'Banks, Stripe and Square ask for it. It is always free from irs.gov; ignore sites that charge.' },
      { do: 'Open a **separate business bank account** and connect Stripe or Square payouts to it.', why: 'Mixing personal and business money can weaken your LLC protection and makes taxes a nightmare.' },
      { do: 'Check your city or county for a **business license**.', why: 'Some places require one even for online businesses.' },
      { do: 'Publish **Terms of Service and a Privacy Policy** in your app.', why: 'Required by payment providers and app stores, and they limit your liability.' },
      { do: 'Track income and expenses from day one and set aside about **25 to 30%** for taxes.', why: 'Nobody withholds tax for you. Self-employed people usually pay estimated taxes each quarter.' },
    ] },
    { t: 'snap', src: 'shots/sba-register.jpg', url: 'sba.gov · Register your business', caption: 'The US Small Business Administration\'s free guide to registering your business, step by step.' },
    { t: 'snap', src: 'shots/irs-ein.jpg', url: 'irs.gov · Get an EIN', caption: 'Get your EIN free, directly from the IRS. It takes about 15 minutes online.' },
    { t: 'h', text: 'Sales tax on software (the confusing part)' },
    { t: 'p', text: 'In the US, some states charge sales tax on software and subscriptions and others do not, and the rules change. Once you sell enough into a state, you may have to collect its tax. You do not have to track this by hand:' },
    { t: 'table', head: ['Option', 'How it helps'], rows: [
      ['**Stripe Tax**', 'Calculates and collects the right tax at checkout and shows where you are close to owing'],
      ['**Square**', 'Lets you set tax rates on items and invoices'],
      ['**Merchant of record** (Paddle, Lemon Squeezy)', 'They are legally the seller, handle all sales tax and VAT worldwide, and pay you; higher fee'],
    ] },
    { t: 'h', text: 'Contracts when you build for clients' },
    { t: 'p', text: 'Building apps for other businesses (like the Forward Deployed Engineering final project) needs a short written agreement every time. It should cover:' },
    { t: 'table', head: ['Section', 'Why it matters'], rows: [
      ['**Scope**', 'Exactly what you will build, and that extra requests cost extra'],
      ['**Price and payment**', 'Deposit up front (often 50%), the rest on delivery, and late fees'],
      ['**Timeline**', 'Dates, and that delays caused by the client move the dates'],
      ['**Ownership (IP)**', 'Who owns the code, usually the client after final payment'],
      ['**Hosting and keys**', 'Accounts and API keys are in the client\'s name, so they are never locked out'],
      ['**Support**', 'How long you fix bugs for free, and your rate after that'],
    ] },
    { t: 'prompt', label: 'My business setup checklist', text: `I am starting a business selling [MY APP / app-building services] from [STATE, COUNTRY].
Make me a step-by-step checklist with links to the official government sites for: forming an LLC in my state (and the fee), getting a free EIN, a local business license, sales tax on software in my state, and quarterly estimated taxes.
Mark which steps are free, which cost money, and which I should ask an accountant about. Plain words, no jargon.` },
    { t: 'prompt', label: 'Draft a client contract', text: `Draft a simple, plain-English agreement for building an app for a client.
Client: [NAME]. Project: [WHAT I AM BUILDING]. Price: [AMOUNT], [50%] deposit, rest on delivery. Timeline: [DATES]. Free bug fixes for [30] days, then [RATE]/hour.
Include scope (and that changes cost extra), ownership after final payment, accounts and keys in the client's name, confidentiality, and a limit on my liability.
Add a note at the top that I should have a lawyer review it before using it.` },
    { t: 'check', q: 'Why open a separate bank account for your LLC?', options: [
      'Banks require two accounts',
      'Mixing personal and business money can weaken the LLC\'s protection and makes taxes much harder',
      'It earns more interest',
    ], answer: 1, explain: 'The LLC firewall only works if you treat the business as truly separate.' },
    { t: 'recap', items: [
      'LLC, free EIN, separate bank account, local license, Terms and Privacy.',
      'Save 25 to 30% for taxes; use Stripe Tax or a merchant of record for sales tax.',
      'Every client job gets a short written contract: scope, payment, ownership, keys.',
    ] },
  ],
};

export const quality = {
  id: 'quality',
  title: 'Debug and test like a pro',
  lessons: [debugging, playwright],
};
