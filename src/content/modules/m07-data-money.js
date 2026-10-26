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
      title: 'Take payments with Stripe',
      minutes: 14,
      figure: 'fit-stripe',
      body: [
        { t: 'why', text: [
          'Taking money is where mistakes get expensive. The good news: you never have to touch a card number. Stripe handles the card part on its own secure page, and your app just finds out when someone has paid.',
          'Done right, this keeps you out of the heaviest card-security rules and makes it nearly impossible to accidentally leak a customer\'s card.',
        ] },
        { t: 'h', text: 'Step 1: make your Stripe account' },
        { t: 'steps', items: [
          { do: 'Go to **stripe.com**, sign up, and turn on two-factor login.' },
          { do: 'Stay in **Test mode** (the switch at the top of the dashboard).', why: 'Test mode uses fake money, so you can try everything without real charges.' },
          { do: 'Open **Developers → API keys**. You will see two keys.' },
          { do: 'Copy the **secret** key (sk_test_...) and save it with the **Add a key** prompt below, as STRIPE_SECRET_KEY.', why: 'Same ten-second routine as every key in this course: one paste into the hidden terminal prompt.' },
        ] },
        { t: 'prompt', label: 'Add your Stripe key', text: addKey('STRIPE_SECRET_KEY', 'Stripe') },
        { t: 'snap', src: 'shots/stripe.jpg', url: 'dashboard.stripe.com/register', caption: 'Stripe sign-up' },
        { t: 'table', head: ['Key starts with', 'What it is', 'Where it goes'], rows: [
          ['pk_test_', 'Publishable key: safe to show', 'OK in your app'],
          ['sk_test_', '**Secret** key: can move money', 'Only through the hidden terminal prompt (it lands in .env.local and Vercel)'],
        ] },
        { t: 'h', text: 'How a payment actually works' },
        { t: 'steps', items: [
          { do: 'A customer clicks **Buy**. Your server looks up the price from **its own** records.', why: 'Never trust a price sent from the browser. Anyone can change it to $0.01.' },
          { do: 'Your server asks Stripe to create a **Checkout** page for that price.' },
          { do: 'The customer is sent to Stripe\'s page and types their card there, not on your site.', why: 'Card numbers never touch your app, so they can never leak from it.' },
          { do: 'Stripe sends your server a **webhook**: a signed message saying "this person paid."', why: 'This is the only reliable proof of payment.' },
          { do: 'Your server checks the signature on that message, then marks the order paid.' },
        ] },
        { t: 'analogy', text: 'A webhook is like the bank calling the shop to say "the payment cleared." The "Thank you" page your customer sees is just them telling you they paid. You trust the bank\'s call, not the customer\'s word.' },
        { t: 'tip', tone: 'warn', text: 'Your "success" page is **not** proof of payment. Anyone can type /success into their browser. Only a webhook with a valid Stripe signature counts.' },
        { t: 'h', text: 'Step 2: build it' },
        { t: 'prompt', label: 'Add a Buy button', text: `Add Stripe payments using Stripe Checkout (the Stripe-hosted payment page).
- Price: [PRICE] for [WHAT THEY ARE BUYING].
- The Stripe secret key is STRIPE_SECRET_KEY in .env.local. Only use it on the server.
- Create the Checkout Session on the server. Never trust a price sent from the browser.
- Add a webhook route that verifies the Stripe signature (STRIPE_WEBHOOK_SECRET) and only then marks the order paid in the database.
- Handle the same webhook arriving twice without double-fulfilling.
- Add success and cancel pages.
Tell me how to test it with the Stripe CLI.` + SAFE },
        { t: 'p', text: 'To test, use Stripe\'s fake card: **4242 4242 4242 4242**, any future date, any three digits. It always "succeeds" in test mode.' },
        { t: 'deeper', title: 'PCI, idempotency and going live', blocks: [
          { t: 'p', text: 'Stripe Checkout keeps you in the lightest card-security category (PCI DSS "SAQ A") because card data goes straight from the customer to Stripe. Building your own card form pulls you into much heavier compliance work.' },
          { t: 'p', text: '**Idempotency** means handling the same event twice has the same result as handling it once. Stripe may retry webhooks, so record each event ID and skip ones you have already processed.' },
          { t: 'p', text: 'Test locally with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. To go live, put the live keys **only** in Vercel\'s Production settings and register your live webhook address in the Stripe dashboard.' },
          { t: 'links', items: [{ label: 'Stripe Checkout docs', url: 'https://docs.stripe.com/payments/checkout' }] },
        ] },
        { t: 'check', q: 'What proves a customer actually paid?', options: [
          'They reached the /success page',
          'A webhook from Stripe with a valid signature',
          'They clicked the Buy button',
        ], answer: 1, explain: 'Anyone can visit a page. Only Stripe\'s signed webhook is real proof.' },
        { t: 'recap', items: [
          'Customers type cards on Stripe\'s page, never yours.',
          'Prices come from your server; secret keys stay on the server.',
          'Only a signature-checked webhook marks an order paid.',
        ] },
      ],
    },
    {
      id: 'square',
      title: 'Square: payments for real-world businesses',
      minutes: 13,
      body: [
        { t: 'why', text: 'Stripe is perfect for apps that sell online. But if you build for a coffee shop, a barber, a food truck or your own side business, they probably need to take cards **in person** too: tap to pay, a card reader, a register. That is where Square shines, and it has a developer side that works a lot like Stripe.' },
        { t: 'h', text: 'Stripe or Square?' },
        { t: 'table', head: ['', 'Stripe', 'Square'], rows: [
          ['Best for', 'Online apps, subscriptions, software', 'Shops, restaurants, services, anything in person'],
          ['In person', 'Possible, but mostly online', 'Built for it: readers, registers, tap to pay on a phone'],
          ['Extras', 'Billing, tax tools, developer tools', 'Point of sale, inventory, staff, appointments, invoices'],
          ['No-code option', 'Payment Links', 'Payment Links and a free online store'],
          ['Developer tools', 'Excellent', 'Very good: Checkout API, Web Payments SDK, webhooks'],
        ] },
        { t: 'p', text: 'Many real businesses use **both**: Square at the counter and on their own website, Stripe for an online membership. Your job as the builder is to pick what fits how they actually sell.' },
        { t: 'h', text: 'How Square payments work in your app' },
        { t: 'p', text: 'It is the same safe pattern you learned with Stripe: the customer pays on **Square\'s** checkout page, and Square sends your server a signed **webhook** saying "this was paid." Your app never touches a card number.' },
        { t: 'steps', items: [
          { do: 'Make a free developer account at **developer.squareup.com** and create an application.', why: 'This gives you a **Sandbox** (fake money for testing) and your access tokens.' },
          { do: 'Start in **Sandbox**. Use Square\'s test card numbers until everything works.' },
          { do: 'Save the access token with the **Add a key** prompt as SQUARE_ACCESS_TOKEN. Never in code or chat.', why: 'A Square production token can see and refund real sales.' },
          { do: 'Add a webhook subscription for payment events, then save its **Signature key** the same way, as SQUARE_WEBHOOK_SIGNATURE_KEY.' },
        ] },
        { t: 'prompt', label: 'Add your Square token', text: addKey('SQUARE_ACCESS_TOKEN', 'Square') },
        { t: 'prompt', label: 'Add Square checkout', text: `Add Square payments to my app using Square's Checkout API (a Square-hosted payment page).
- The access token is SQUARE_ACCESS_TOKEN and the location is SQUARE_LOCATION_ID, server-side only. Start in Sandbox.
- Create the checkout link on the server with the price from my own records, never from the browser.
- Put my order ID in the payment's reference so I can match it later.
- Add a webhook route that verifies Square's signature (SQUARE_WEBHOOK_SIGNATURE_KEY) before marking anything paid, and handles the same event twice safely.
Explain how to test it with Square's sandbox test cards.` },
        { t: 'tip', tone: 'info', text: 'Square also has an official connector for Claude. Turn it on in Settings → Connectors, and Claude can look up sales, create payment links or check inventory for you, always showing you a preview and waiting for your OK before changing anything.' },
        { t: 'h', text: 'Starting your own business?' },
        { t: 'p', text: 'If what you build turns into a real business, or you build apps for local businesses, the payment rate matters. A fraction of a percent on every sale adds up to real money every month.' },
        { t: 'partner', eyebrow: 'Authorized Square Reseller · Course partner', title: 'Get a better rate on Square', text: 'Ray, who made this course, is an Authorized Square Reseller through **Deposyt**. Sign up through the partner page to get set up with Square at a better rate, with a real person helping you choose the right setup.',
          perks: [['2.6% or lower', 'in person on Square, per the partner page'], ['$0 monthly fee', 'no contract'], ['0% option', 'through a cash discount or service charge program']],
          ctas: [{ label: 'See the Square partner offer', url: 'https://deposyt.partners/ray-ally' }],
          note: 'Disclosure: this is a partner link and the course creator may earn a commission. Rates and terms are set by Deposyt and Square and can change; check the page for current details. You never need to use this link to take the course.' },
        { t: 'deeper', title: 'Fees, surcharges and the fine print', blocks: [
          { t: 'p', text: '**Processing fees** are the cut a payment company takes from each card sale, usually a percentage plus a few cents. Online and in-person rates often differ.' },
          { t: 'p', text: '**Cash discount** and **surcharge** programs pass the card fee on to the customer. They can bring your cost close to zero, but the rules vary by state and card brand: some states restrict surcharges, and they usually do not apply to debit cards. Make sure the setup you choose is compliant where you sell.' },
          { t: 'p', text: 'Square webhooks are signed with HMAC-SHA256 over your exact webhook URL plus the raw request body, sent in the `x-square-hmacsha256-signature` header. Verify with a constant-time comparison before trusting any event.' },
        ] },
        { t: 'check', q: 'A food truck owner asks you for an app to take orders at the window and online. Which payment system fits best?', options: [
          'Stripe only',
          'Square, because it handles in-person and online together',
          'Neither, cash only',
        ], answer: 1, explain: 'Square was built for in-person businesses and also does online checkout, so one system covers both.' },
        { t: 'recap', items: [
          'Stripe for online-first apps; Square for real-world businesses.',
          'Same safe pattern: hosted checkout plus a signed webhook.',
          'Start in Sandbox; save every token with the hidden terminal prompt.',
        ] },
      ],
    },
  ],
};
