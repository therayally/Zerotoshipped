import { SAFE, addKey } from '../safe';

export default {
  id: 'data-money',
  title: 'Data and money',
  lessons: [
    {
      id: 'database',
      title: 'Hook up your database',
      minutes: 12,
      body: [
        { t: 'why', text: 'You created a Neon database earlier. Now your app needs to actually use it: save things, read them back, and, most importantly, only ever show each person **their own** data. Getting that last part wrong is the most common serious bug in AI-built apps.' },
        { t: 'h', text: 'Step 1: bring your secret settings home' },
        { t: 'p', text: 'Vercel is already holding your database\'s connection details. Ask Claude to copy them into a private file on your computer, so your app can use the same database while you build:' },
        { t: 'prompt', label: 'Bring the secret settings over', text: `Link this folder to my Vercel project and copy its environment variables into a private .env.local file.
If you need me to sign in to Vercel, open it in my browser.
Make sure .env.local is listed in .gitignore, and never print the values.` },
        { t: 'p', text: 'That `.env.local` file must **never** be saved to GitHub, which is exactly what your house rules already tell Claude. (Under the hood Claude runs `vercel link` and `vercel env pull .env.local`.)' },
        { t: 'h', text: 'Step 2: connect and create your tables' },
        { t: 'prompt', label: 'Connect the database', text: `My Neon database link is in .env.local as DATABASE_URL (do not print it).
1. Make sure .env.local is in .gitignore.
2. Add Drizzle ORM with the Neon serverless driver.
3. Create the tables from ARCHITECTURE.md as a migration and run it.
4. Make one page that saves something and shows it back, so I can see it working.
Every query must only return rows that belong to the signed-in user.` + SAFE },
        { t: 'p', text: 'A few new words in that prompt:' },
        { t: 'table', head: ['Word', 'Meaning'], rows: [
          ['ORM (Drizzle)', 'A helper that lets your code talk to the database safely, without writing raw database commands by hand'],
          ['Migration', 'A saved, numbered file describing a change to your tables, like "add a phone column." Your database history, the same way Git is your code history.'],
          ['Query', 'One question or instruction to the database, like "get all orders for this user"'],
        ] },
        { t: 'h', text: 'The most important line: "only rows that belong to the signed-in user"' },
        { t: 'p', text: 'Imagine your app shows an order at `/orders/123`. A curious customer changes it to `/orders/124` and sees someone else\'s name, address and order. That bug is called **broken access control**, and it is the number one security problem on the web.' },
        { t: 'p', text: 'The fix is boring and absolute: **every** database question about user data includes "and it belongs to the person who is signed in." And "who is signed in" must come from your server\'s login records, never from something the browser sends.' },
        { t: 'analogy', text: 'It is like a coat check. The attendant does not hand over whatever coat you point at. They check your ticket and give you **your** coat. Every single time.' },
        { t: 'tip', tone: 'safe', text: 'Never paste your database link into a chat. Claude can read it from `.env.local` without showing it, and your prompt tells it not to print it.' },
        { t: 'deeper', title: 'SQL injection, migrations and safe testing', blocks: [
          { t: 'p', text: '**SQL injection** happens when user input is glued into a database command as text. A "name" like `Robert\'); DROP TABLE users;--` can then become part of the command itself. **Parameterized queries** send the command and the values separately, so input can never become a command. Drizzle does this by default.' },
          { t: 'p', text: 'Schema changes go through versioned migration files saved in Git, never quick edits in a web dashboard, so every environment can be rebuilt exactly. Use a **Neon branch** for preview deployments so testing a migration never touches real customer data.' },
          { t: 'p', text: 'The owner check should be derived from the server session (`where userId = session.user.id`), never from an ID in the request body or URL.' },
        ] },
        { t: 'check', q: 'A customer changes /orders/123 to /orders/124 and sees someone else\'s order. What was missing?', options: [
          'A faster database',
          'A check that the order belongs to the signed-in user',
          'A prettier error page',
        ], answer: 1, explain: 'Broken access control. Every query for user data must include "belongs to the signed-in user", decided by the server.' },
        { t: 'recap', items: [
          'Claude copies your secret settings into a private .env.local file.',
          'Drizzle talks to the database safely; migrations record table changes.',
          'Every query for user data checks it belongs to the signed-in user.',
        ] },
      ],
    },
    {
      id: 'payments',
      title: 'Take payments: pick Stripe or Square',
      minutes: 10,
      figure: 'fit-stripe',
      body: [
        { t: 'why', text: [
          'Taking money is where mistakes get expensive. The good news: you never touch a card number. A payment company shows its own secure checkout page, and your app just finds out when someone paid.',
          'You only need **one** payment company. This lesson helps you pick, then the next lesson (Stripe) or the one after (Square) walks you through it click by click.',
        ] },
        { t: 'h', text: 'Pick one in 10 seconds' },
        { t: 'table', head: ['If you are building…', 'Pick', 'Why'], rows: [
          ['An online app people pay for monthly (software, a membership)', '**Stripe**', 'Best built-in subscriptions, and Claude has seen the most Stripe code, so it gets it right fastest.'],
          ['Something for a real-world business (shop, food truck, salon, events)', '**Square**', 'Takes cards in person **and** online with one account, plus registers, invoices and inventory.'],
          ['Your own small business and you want a lower rate', '**Square**', 'See the partner offer in the Square lesson.'],
          ['Not sure', '**Stripe**', 'You can always add Square later. The setup steps are almost the same.'],
        ] },
        { t: 'p', text: 'This course\'s own donation button uses Square, so you can see a real one working at tinyappcode.com/donate.' },
        { t: 'h', text: 'How every payment works (Stripe and Square are the same)' },
        { t: 'steps', items: [
          { do: 'A customer clicks **Buy**. Your server looks up the price from **its own** records.', why: 'Never trust a price sent from the browser. Anyone can change it to $0.01.' },
          { do: 'Your server asks Stripe or Square for a **checkout page** for that price.' },
          { do: 'The customer pays on **their** page, not yours.', why: 'Card numbers never touch your app, so they can never leak from it.' },
          { do: 'Stripe or Square sends your server a **webhook**: a signed message saying "this person paid."', why: 'This is the only real proof of payment.' },
          { do: 'Your server checks the signature, then marks the order paid.' },
        ] },
        { t: 'analogy', text: 'A webhook is the bank calling the shop to say "the payment cleared." The "Thank you" page your customer sees is just them telling you they paid. You trust the bank\'s call, not the customer\'s word.' },
        { t: 'h', text: 'The 3 keys you will collect (same idea for both)' },
        { t: 'table', head: ['Key', 'What it does', 'Secret?'], rows: [
          ['**Secret key** (Stripe) / **Access token** (Square)', 'Lets your server create checkouts', 'Yes. Add it with the hidden terminal prompt.'],
          ['**Webhook secret** (Stripe) / **Signature key** (Square)', 'Lets your server check a "paid" message is real', 'Yes. Same hidden prompt.'],
          ['**Publishable key** (Stripe) / **Location ID** (Square)', 'Says which account to use', 'No. Fine to paste anywhere.'],
        ] },
        { t: 'tip', tone: 'safe', text: 'Every key starts in **test mode** (Stripe) or **Sandbox** (Square): fake money, fake cards. You only switch to real money at the very end, and you add the real keys the same easy way.' },
        { t: 'check', q: 'What proves a customer actually paid?', options: [
          'They reached the "Thank you" page',
          'A webhook from Stripe or Square with a valid signature',
          'They clicked the Buy button',
        ], answer: 1, explain: 'Anyone can visit a page. Only the signed message from the payment company is real proof.' },
        { t: 'prompt', label: 'Help me pick Stripe or Square', text: `I am building [MY APP] and I sell [WHAT, e.g. "monthly memberships" or "one-off orders"] to [WHO]. I [do / do not] also sell in person.
Compare Stripe and Square for my case in a short table: fees, payouts, in-person selling, subscriptions, and how easy each is to set up with you.
Recommend one, explain why in plain words, and list exactly what I need to sign up (business info, bank account) before we start.` },
        { t: 'recap', items: [
          'Stripe for online software and subscriptions; Square for real-world businesses.',
          'Customers pay on the payment company\'s page; your app never sees cards.',
          'Only a signed webhook marks something paid. Secret keys go in the hidden terminal prompt.',
        ] },
      ],
    },
    {
      id: 'stripe',
      title: 'Set up Stripe, click by click',
      minutes: 15,
      body: [
        { t: 'why', text: 'This is the whole Stripe setup, start to finish, in test mode with fake money. Follow it in order and you will have a working Buy button by the end. Total time: about 15 minutes.' },
        { t: 'h', text: 'Part 1: make your account' },
        { t: 'snap', src: 'shots/stripe-register.jpg', url: 'dashboard.stripe.com/register', caption: 'Create your Stripe account: email, name, password, country.', marks: [{ x: 31, y: 12, w: 39, h: 76 }] },
        { t: 'steps', items: [
          { do: 'Go to **stripe.com**, sign up, and turn on two-factor login when it asks.' },
          { do: 'Look for the **Test mode** switch (top right) and make sure it is **on**.', why: 'Test mode uses fake money, so nothing you do here can charge a real card.' },
        ] },
        { t: 'h', text: 'Part 2: grab your secret key' },
        { t: 'steps', items: [
          { do: 'Click **Developers** (bottom left, or top right on some screens), then **API keys**.' },
          { do: 'Next to **Secret key** (starts with `sk_test_`), click **Reveal**, then **Copy**.' },
          { do: 'Paste the prompt below into Claude. It opens a hidden terminal prompt; click in it, paste the key, press Return.', why: 'It checks the key with Stripe and saves it to .env.local and Vercel for you.' },
        ] },
        { t: 'prompt', label: 'Add your Stripe secret key', text: addKey('STRIPE_SECRET_KEY', 'Stripe') },
        { t: 'h', text: 'Part 3: let Claude build the Buy button' },
        { t: 'prompt', label: 'Build Stripe checkout', text: `Add Stripe payments using Stripe Checkout (the Stripe-hosted payment page). We are in test mode.
- Product: [WHAT THEY ARE BUYING] for [PRICE]. Create it in my Stripe account for me if it does not exist.
- The secret key is STRIPE_SECRET_KEY in .env.local. Only use it on the server.
- Create the Checkout Session on the server. Never trust a price sent from the browser.
- Add a webhook route at /api/webhooks/stripe that verifies the signature (STRIPE_WEBHOOK_SECRET) and only then marks the order paid. Handle the same event twice safely.
- Add success and cancel pages.
- Deploy it, then tell me the exact webhook address to give Stripe.` + SAFE },
        { t: 'h', text: 'Part 4: connect the webhook' },
        { t: 'steps', items: [
          { do: 'In Stripe, click **Developers → Webhooks** (newer accounts call it **Event destinations**), then **Add endpoint** (or **Add destination**).' },
          { do: 'Paste the webhook address Claude gave you, like `https://yourapp.com/api/webhooks/stripe`.' },
          { do: 'Choose the event **checkout.session.completed** and save.' },
          { do: 'On the new endpoint, find **Signing secret** (starts with `whsec_`), click **Reveal**, then **Copy**.' },
          { do: 'Add it with the prompt below, then ask Claude to redeploy.' },
        ] },
        { t: 'prompt', label: 'Add your Stripe webhook secret', text: addKey('STRIPE_WEBHOOK_SECRET', 'Stripe') },
        { t: 'h', text: 'Part 5: test it with a fake card' },
        { t: 'snap', src: 'shots/stripe-testcards.jpg', url: 'docs.stripe.com/testing', caption: 'Stripe\'s official list of test cards. 4242 4242 4242 4242 always succeeds in test mode.' },
        { t: 'steps', items: [
          { do: 'Open your app and click **Buy**.' },
          { do: 'On Stripe\'s page, use the card **4242 4242 4242 4242**, any future date, any 3 digits, any ZIP.', why: 'This test card always succeeds and never charges anything.' },
          { do: 'Back in Stripe, open **Payments**: you will see the test payment. In your app, the order should say paid.' },
          { do: 'Not marked paid? Say to Claude: "The test payment went through but my order is not marked paid. Check the Stripe webhook logs and fix it."' },
        ] },
        { t: 'h', text: 'Part 6: go live (real money)' },
        { t: 'steps', items: [
          { do: 'In Stripe, finish **Activate account** (your business and bank details).' },
          { do: 'Switch **Test mode off**, then repeat Part 2 and Part 4 with the **live** keys (`sk_live_...` and the live `whsec_...`).', why: 'Live keys are separate from test keys. The same Add a key prompt replaces the old ones.' },
          { do: 'Make one small real purchase yourself, then refund it in Stripe to be sure everything works.' },
        ] },
        { t: 'deeper', title: 'PCI, idempotency and testing locally', blocks: [
          { t: 'p', text: 'Stripe Checkout keeps you in the lightest card-security category (PCI DSS "SAQ A") because card data goes straight from the customer to Stripe.' },
          { t: 'p', text: '**Idempotency** means handling the same event twice has the same result as once. Stripe may retry webhooks, so record each event ID and skip ones you already processed.' },
          { t: 'p', text: 'To test webhooks on your own computer, Claude can run the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.' },
          { t: 'links', items: [{ label: 'Stripe Checkout docs', url: 'https://docs.stripe.com/payments/checkout' }, { label: 'Stripe test cards', url: 'https://docs.stripe.com/testing' }] },
        ] },
        { t: 'check', q: 'You are in test mode. Which card do you use to try a purchase?', options: [
          'Your real debit card',
          '4242 4242 4242 4242 with any future date',
          'Any random 16 digits',
        ], answer: 1, explain: 'Stripe\'s test card always succeeds in test mode and never charges real money.' },
        { t: 'recap', items: [
          'Test mode on; copy the sk_test_ key into the hidden terminal prompt.',
          'Let Claude build checkout plus the webhook, then add the whsec_ secret.',
          'Test with 4242 4242 4242 4242; go live by repeating with live keys.',
        ] },
      ],
    },
    {
      id: 'square',
      title: 'Set up Square, click by click',
      minutes: 15,
      body: [
        { t: 'why', text: 'Square is the choice for real-world businesses: one account takes cards at the counter **and** online. This is the full setup in Sandbox (fake money). It is the exact setup this course\'s own donation button uses.' },
        { t: 'h', text: 'The no-code shortcut' },
        { t: 'p', text: 'Only need a simple "Pay" or "Donate" button? You might not need any code. In the Square Dashboard, go to **Online → Payment links → Create link**, pick **Collect a payment** or **Accept donations**, and paste the link on your site. Done. Use the steps below when your app needs to know **who** paid.' },
        { t: 'h', text: 'Part 1: make your developer app' },
        { t: 'snap', src: 'shots/square-signup.jpg', url: 'squareup.com/signup', caption: 'First, a free Square account (skip this if you already sell with Square).' },
        { t: 'snap', src: 'shots/square-developer.jpg', url: 'developer.squareup.com', caption: 'Then the Square Developer site: sign in (1) with the same account, then Start building (2).', marks: [{ x: 92, y: 2.5, w: 7, h: 5.5, n: 1 }, { x: 52, y: 46.5, w: 15.5, h: 7, n: 2 }] },
        { t: 'steps', items: [
          { do: 'Sign up for Square at **squareup.com** if you have not (turn on two-factor login).' },
          { do: 'Go to **developer.squareup.com** and sign in with the same account.' },
          { do: 'Click **Create an application**. If it asks "What will you build first?", tick **Accept payments** and click **Next** (or **Skip**).', why: 'That question is just a survey; it changes nothing.' },
          { do: 'Name it after your app and open it.' },
        ] },
        { t: 'h', text: 'Part 2: grab your keys' },
        { t: 'snap', src: 'shots/square-credentials.jpg', url: 'developer.squareup.com/apps', caption: 'Your app in the Square Developer site: the Sandbox/Production switch (1), Credentials (2), your access token (3), and Webhooks for later (4). Shown here in Production; Sandbox looks the same.', marks: [{ x: 52.5, y: 14.5, w: 24, h: 8, n: 1 }, { x: 1.5, y: 33, w: 20.5, h: 9.5, n: 2 }, { x: 31, y: 79, w: 67.5, h: 13, n: 3 }, { x: 1.5, y: 52.5, w: 20.5, h: 6.5, n: 4 }] },
        { t: 'steps', items: [
          { do: 'At the top, make sure the switch says **Sandbox**.', why: 'Sandbox is Square\'s fake-money mode.' },
          { do: 'Click **Credentials**. Next to **Sandbox Access token**, click **Show**, then copy it.' },
          { do: 'Add it with the prompt below (one paste into the hidden terminal prompt).' },
          { do: 'Click **Locations** in the left menu and copy the **Location ID**.', why: 'Not a secret. You can paste it straight into the chat for Claude.' },
        ] },
        { t: 'prompt', label: 'Add your Square access token', text: addKey('SQUARE_ACCESS_TOKEN', 'Square') },
        { t: 'h', text: 'Part 3: let Claude build the Buy button' },
        { t: 'prompt', label: 'Build Square checkout', text: `Add Square payments using Square's Checkout API (a Square-hosted payment page). We are in Sandbox.
- Product: [WHAT THEY ARE BUYING] for [PRICE]. My Square location ID is [LOCATION ID].
- The access token is SQUARE_ACCESS_TOKEN in .env.local. Only use it on the server.
- Create the payment link on the server with the price from my own records, never from the browser. Put the order ID in the payment note so I can match it later.
- Add a webhook route at /api/webhooks/square that verifies Square's signature (SQUARE_WEBHOOK_SIGNATURE_KEY) before marking anything paid, and handles the same event twice safely.
- Deploy it, then tell me the exact webhook address to give Square.` + SAFE },
        { t: 'h', text: 'Part 4: connect the webhook' },
        { t: 'steps', items: [
          { do: 'In your Square developer app, click **Webhooks → Subscriptions → Add subscription**.' },
          { do: 'Paste the webhook address Claude gave you, and tick **payment.created** and **payment.updated** (plus **refund.updated** if you handle refunds). Save.' },
          { do: 'On the subscription, find **Signature key**, click **Show**, and copy it.' },
          { do: 'Add it with the prompt below, then ask Claude to redeploy.' },
        ] },
        { t: 'prompt', label: 'Add your Square signature key', text: addKey('SQUARE_WEBHOOK_SIGNATURE_KEY', 'Square') },
        { t: 'h', text: 'Part 5: test it with a fake card' },
        { t: 'steps', items: [
          { do: 'Open your app and click **Buy**.' },
          { do: 'On Square\'s page, use the Sandbox card **4111 1111 1111 1111**, CVV **111**, any future date and ZIP.', why: 'Sandbox cards never charge real money.' },
          { do: 'In your app, the order should say paid. Not marked paid? Say to Claude: "The Square test payment went through but my order is not paid. Check the webhook and fix it."' },
        ] },
        { t: 'h', text: 'Part 6: go live (real money)' },
        { t: 'steps', items: [
          { do: 'Flip the switch at the top of your developer app to **Production**.' },
          { do: 'Repeat Part 2 and Part 4 with the **Production** access token, location ID and a new production webhook.', why: 'Production keys are separate. The same Add a key prompt replaces the Sandbox ones.' },
          { do: 'Make one small real purchase yourself, then refund it in the Square Dashboard.' },
        ] },
        { t: 'tip', tone: 'info', text: 'Square also has an official connector for Claude (Settings → Connectors). With it, Claude can look up sales and create payment links for you, always showing a preview and waiting for your OK first.' },
        { t: 'h', text: 'Starting your own business?' },
        { t: 'p', text: 'If what you build turns into a real business, or you build apps for local businesses, the payment rate matters. A fraction of a percent on every sale adds up to real money every month.' },
        { t: 'partner', eyebrow: 'Authorized Square Reseller · Course partner', title: 'Get a better rate on Square', text: 'Ray, who made this course, is an Authorized Square Reseller through **Deposyt**. Sign up through the partner page to get set up with Square at a better rate, with a real person helping you choose the right setup.',
          perks: [['2.6% or lower', 'in person on Square, per the partner page'], ['$0 monthly fee', 'no contract'], ['0% option', 'through a cash discount or service charge program']],
          ctas: [{ label: 'See the Square partner offer', url: 'https://deposyt.partners/ray-ally' }],
          note: 'Disclosure: this is a partner link and the course creator may earn a commission. Rates and terms are set by Deposyt and Square and can change; check the page for current details. You never need to use this link to take the course.' },
        { t: 'deeper', title: 'Fees, surcharges and the fine print', blocks: [
          { t: 'p', text: '**Processing fees** are the cut a payment company takes from each sale, usually a percentage plus a few cents. Online and in-person rates often differ.' },
          { t: 'p', text: '**Cash discount** and **surcharge** programs pass the card fee on to the customer. Rules vary by state and card brand (some states restrict surcharges, and they usually cannot apply to debit cards), so make sure your setup is compliant where you sell.' },
          { t: 'p', text: 'Square signs webhooks with HMAC-SHA256 over your exact webhook URL plus the raw request body, in the `x-square-hmacsha256-signature` header. Verify with a constant-time comparison before trusting any event.' },
        ] },
        { t: 'check', q: 'A food truck owner wants to take orders at the window and online. Which fits best?', options: [
          'Stripe only',
          'Square, because one account handles in-person and online',
          'Neither, cash only',
        ], answer: 1, explain: 'Square was built for in-person businesses and also does online checkout, so one system covers both.' },
        { t: 'recap', items: [
          'No code needed for a simple button: Square Payment links.',
          'For apps: Sandbox token and signature key go in the hidden terminal prompt.',
          'Test with 4111 1111 1111 1111; go live by repeating with Production keys.',
        ] },
      ],
    },
    {
      id: 'subscriptions',
      title: 'Charge monthly: subscriptions',
      minutes: 14,
      figure: 'subscription',
      body: [
        { t: 'why', text: 'A one-time sale pays you once. A subscription pays you every month, which is how most apps become a real business. The good news: the setup is almost the same as a one-time payment, plus one rule that keeps it honest. This course\'s own donation window works exactly this way.' },
        { t: 'h', text: 'The one rule' },
        { t: 'p', text: 'Your app never decides someone has paid. **Only a signed webhook** from Stripe or Square changes a person\'s plan in your database. Your app just reads that plan every time it opens.' },
        { t: 'analogy', text: 'It is like a gym membership. The front desk does not take your word that you paid; they scan your card and the system says "active" or "expired". The bank updates the system, not you.' },
        { t: 'h', text: 'How the pieces fit (look at the picture above)' },
        { t: 'steps', items: [
          { do: '**Accounts first.** Each customer signs up, so you know who is paying.', why: 'You already built sign-up with email codes. A subscription attaches to that account.' },
          { do: '**Your server makes the checkout.** When they click Upgrade, your server asks Stripe (or Square) for a checkout page for your plan, tagged with their account ID.', why: 'The price comes from your server, never the browser, so nobody can change it.' },
          { do: '**They pay on Stripe\'s page.** Card details never touch your app.' },
          { do: '**The webhook updates the plan.** Stripe sends a signed message when they subscribe, renew, fail a payment or cancel. Your server checks the signature, then saves `plan = active` or `plan = canceled` in Neon.' },
          { do: '**Your app checks on launch.** Every time it opens, it asks your server "what plan is this person on?" and unlocks features to match.', why: 'That is the exact check this course does to decide whether to show the donation window.' },
        ] },
        { t: 'h', text: 'Which tool for subscriptions?' },
        { t: 'table', head: ['', 'Stripe Billing', 'Square Subscriptions'], rows: [
          ['Best for', 'Online apps and software', 'Businesses that already use Square in person'],
          ['Customer portal', 'Built in: customers update cards and cancel themselves', 'Customers manage it through Square links and emails'],
          ['Free trials, coupons, yearly plans', 'Yes', 'Yes, with fewer options'],
          ['What to listen for', 'customer.subscription.created / updated / deleted, invoice.payment_failed', 'subscription.created / updated, invoice.payment_made'],
        ] },
        { t: 'p', text: 'Pick the prompt that matches the payment company you set up.' },
        { t: 'prompt', label: 'Add a monthly plan (Stripe)', text: `Add a monthly subscription to my app with Stripe Billing.
- Plan: [PLAN NAME] at [PRICE] per month. Create the product and price in Stripe test mode, and keep the price ID in my server code or settings, never in the browser.
- Add an Upgrade button that creates a Stripe Checkout Session in subscription mode on the server, tagged with the signed-in user's ID (client_reference_id).
- Add a webhook route that verifies the Stripe signature (STRIPE_WEBHOOK_SECRET), handles customer.subscription.created, updated and deleted plus invoice.payment_failed, and saves the user's plan and current period end in the database. Handle the same event twice safely.
- Add a /api/me field "plan" that the app reads on launch to unlock paid features. Never trust a plan sent from the browser.
- Add a "Manage billing" button that opens the Stripe customer portal so people can cancel or update their card themselves.
Use my existing STRIPE_SECRET_KEY. If any new key is needed, help me add it with a hidden terminal prompt.` + SAFE },
        { t: 'prompt', label: 'Add a monthly plan (Square)', text: `Add a monthly subscription to my app with Square Subscriptions.
- Plan: [PLAN NAME] at [PRICE] per month. Create the subscription plan in my Square Sandbox for me.
- Use SQUARE_ACCESS_TOKEN and my location ID [LOCATION ID] on the server only.
- Add an Upgrade button that sends the signed-in user to a Square checkout for that plan, tagged with their user ID.
- Add a webhook route that verifies Square's signature (SQUARE_WEBHOOK_SIGNATURE_KEY), handles subscription.created, subscription.updated and invoice.payment_made, and saves the user's plan in the database. Handle the same event twice safely.
- Add a /api/me field "plan" that the app reads on launch. Never trust a plan sent from the browser.
If any new key is needed, help me add it with a hidden terminal prompt.` + SAFE },
        { t: 'tip', tone: 'warn', text: 'Always give people an easy way to cancel. In many places it is the law that canceling must be as easy as signing up, and it keeps you out of payment disputes.' },
        { t: 'deeper', title: 'Failed payments, grace periods and proration', blocks: [
          { t: 'p', text: '**Failed payments** happen (expired cards). Stripe retries automatically ("Smart Retries") and emails the customer. Keep access during a short grace period (for example, until the retries finish) instead of locking people out instantly.' },
          { t: 'p', text: 'Store `current_period_end` from the webhook. If a webhook is ever missed, the app can still lock access after that date, and a nightly job can re-sync from Stripe.' },
          { t: 'p', text: '**Proration** means charging the difference when someone upgrades mid-month. Stripe handles it if you change the subscription\'s price through its API rather than canceling and re-subscribing.' },
        ] },
        { t: 'check', q: 'What should change a customer\'s plan to "active" in your database?', options: [
          'The customer landing on your "thanks for subscribing" page',
          'A signed webhook from Stripe or Square, after your server verifies it',
          'A button in your app that says "I paid"',
        ], answer: 1, explain: 'Pages and buttons can be faked. Only a verified message from the payment company is proof.' },
        { t: 'recap', items: [
          'Subscriptions = accounts + hosted checkout + signed webhook + a plan check on launch.',
          'Only the webhook changes the plan; the app just reads it.',
          'Make canceling easy, and plan for failed payments.',
        ] },
      ],
    },
  ],
};
