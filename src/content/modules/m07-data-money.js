import { SAFE } from '../safe';

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
        ] },
        { t: 'snap', src: 'shots/stripe.jpg', url: 'dashboard.stripe.com/register', caption: 'Stripe sign-up' },
        { t: 'table', head: ['Key starts with', 'What it is', 'Where it goes'], rows: [
          ['pk_test_', 'Publishable key: safe to show', 'OK in your app'],
          ['sk_test_', '**Secret** key: can move money', 'Only in Vercel settings and .env.local'],
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
  ],
};
