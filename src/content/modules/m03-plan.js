export default {
  id: 'plan',
  title: 'Plan like a pro',
  lessons: [
    {
      id: 'scrum',
      title: 'Sprints and Scrum',
      minutes: 10,
      figure: 'sprint',
      body: [
        { t: 'why', text: [
          'The number one reason vibe-coded apps fail is not bad code. It is building too much at once, with no plan, until nobody (including the AI) knows what is finished and what is half-broken.',
          'Sprints fix that. They are how real software teams have worked for twenty years, and they work even better with an AI, because the AI is fast enough to build a lot of the wrong thing very quickly.',
        ] },
        { t: 'p', text: '**Scrum** is a simple way to organize work. Instead of trying to build the whole app in one go, you build it in short rounds called **sprints**, usually one week each. At the end of every sprint, you have something that works and that you can show someone.' },
        { t: 'analogy', text: 'Building an app without sprints is like trying to cook a whole Thanksgiving dinner at once, with every burner on and no list. Sprints are cooking one dish at a time, tasting it, then starting the next. Slower-feeling, but you actually end up with dinner.' },
        { t: 'h', text: 'The four pieces' },
        { t: 'steps', items: [
          { do: '**Backlog:** one list of everything you want the app to do someday.', why: 'Getting ideas out of your head and onto a list stops you from trying to build them all right now.' },
          { do: '**Sprint planning:** pick just a few items from the top of the list for this week.', why: 'Small batches mean small problems. You always know what you are working on.' },
          { do: '**Review:** at the end of the week, use what you built. Show a friend.', why: 'Seeing it working is how you find out what you actually need next.' },
          { do: '**Retro (retrospective):** ask "what went well, what was hard, what will I change?"', why: 'This is how you get better at building, not just better at this one app.' },
        ] },
        { t: 'h', text: 'User stories: how to write backlog items' },
        { t: 'p', text: 'Each backlog item is written as a **user story**: a short sentence from the point of view of the person using your app.' },
        { t: 'table', head: ['Weak backlog item', 'User story'], rows: [
          ['Login page', 'As a **customer**, I want to **sign in with my email**, so that **my orders are saved**.'],
          ['Admin stuff', 'As the **owner**, I want to **see today\'s orders on one screen**, so that **I can prep the kitchen**.'],
        ] },
        { t: 'p', text: 'The "so that" part is the magic. It tells you (and the AI) **why** the feature exists, which leads to much better decisions about how to build it.' },
        { t: 'prompt', label: 'Make your backlog and sprints', text: `I want to build: [DESCRIBE YOUR APP IN 2-3 SENTENCES. WHO IS IT FOR? WHAT PROBLEM DOES IT SOLVE?]

Do not write any code yet. Make two files:
1. BACKLOG.md: user stories written like "As a [user], I want [thing], so that [reason]." Mark each one Must, Should, or Could.
2. SPRINTS.md: split the Must stories into 1-week sprints. Sprint 1 should give me something I can click on. Put security work (login, permissions, input checks) inside each sprint, not at the end.

Then ask me 3 questions about anything unclear.` },
        { t: 'p', text: 'See "security inside each sprint, not at the end"? Adding security later means going back through every screen you already built. Adding it as you go costs almost nothing.' },
        { t: 'deeper', title: 'A "definition of done" you can steal', blocks: [
          { t: 'p', text: 'Pro teams agree on what "done" means before they start, so nothing is "basically done" for three weeks. Here is a good one for AI-built apps:' },
          { t: 'steps', items: [
            'It works on the live preview link, not just on your computer.',
            'Inputs are checked on the server, and every data access checks the user is allowed.',
            'No secrets in the changes, and the dependency scan shows no high or critical problems.',
            'At least one automated test covers the main path.',
            'It is saved to GitHub with a clear message, and the backlog item is closed.',
          ] },
        ] },
        { t: 'check', q: 'What is the "so that" part of a user story for?', options: [
          'It makes the story longer',
          'It explains why the feature exists, which leads to better decisions',
          'It is required by GitHub',
        ], answer: 1, explain: 'Knowing the reason helps you and the AI pick the right way to build it, and spot when a feature is not really needed.' },
        { t: 'recap', items: [
          'Build in one-week sprints, each ending with something that works.',
          'Keep a backlog of user stories: As a… I want… so that…',
          'Put security work inside every sprint.',
        ] },
      ],
    },
    {
      id: 'architecture',
      title: 'System architecture',
      minutes: 10,
      figure: 'stack',
      body: [
        { t: 'why', text: 'Architecture sounds intimidating, but it just means "the map of your app." Without a map, the AI will make up the structure as it goes, a little differently each time, and after a few weeks the app becomes a maze nobody understands.' },
        { t: 'p', text: 'Look at the picture above again. That is an architecture diagram. It answers three questions: **what are the parts**, **how do they talk to each other**, and **where does each kind of information live**.' },
        { t: 'h', text: 'The most important line on the map' },
        { t: 'p', text: 'Every web app has two sides:' },
        { t: 'table', head: ['Side', 'Where it runs', 'Who can see it'], rows: [
          ['Front end (the browser)', 'On the visitor\'s phone or computer', '**Everyone.** Anyone can open the code in their browser and read it.'],
          ['Back end (the server)', 'On Vercel\'s computers', 'Only you. Visitors only see what the server chooses to send them.'],
        ] },
        { t: 'p', text: 'This line is the single most important idea in app security. **Secrets, passwords, prices and "is this person allowed?" checks must live on the server side.** Anything on the browser side can be read and changed by anyone who knows how to press F12.' },
        { t: 'analogy', text: 'The front end is the restaurant\'s dining room: customers can see and touch everything. The back end is the kitchen and the office. Customers can order, but they never get to walk into the office and open the safe.' },
        { t: 'prompt', label: 'Draw your app\'s map', text: `Read BACKLOG.md. Then create ARCHITECTURE.md with:
1. A simple diagram (use a Mermaid code block) showing: the browser, the Next.js app on Vercel, the Neon Postgres database, Stripe, and any other service.
2. A list of the database tables with their columns.
3. Which pages anyone can see, and which need login.
4. Where each secret key lives (it must be server-only).
Explain it to me in 5 simple sentences after.` },
        { t: 'p', text: 'Keep ARCHITECTURE.md in your project and tell Claude to update it whenever you change how something works. It becomes the "big picture" that every future session reads, so the AI stays consistent.' },
        { t: 'deeper', title: 'The three layers, and the decisions to write down', blocks: [
          { t: 'steps', items: [
            '**Presentation:** what users see. In Next.js these are React components; most run on the server, and only the interactive ones ship to the browser.',
            '**Application:** your server code (route handlers and server actions on Vercel). This is the **trust boundary**: everything arriving from the browser is untrusted until it is checked here.',
            '**Data:** Neon Postgres, reached through a query builder like Drizzle that keeps queries safe.',
          ] },
          { t: 'p', text: 'Decisions worth recording: where untrusted data enters and how it is validated (a schema library like Zod), the difference between **authentication** (who you are) and **authorization** (what you may do), which columns hold personal data, and what happens if Stripe or the database is down.' },
        ] },
        { t: 'check', q: 'Where must the check "is this user allowed to see this order?" happen?', options: [
          'In the browser, so it is faster',
          'On the server, because anything in the browser can be changed by the user',
          'It does not matter',
        ], answer: 1, explain: 'The browser belongs to the visitor. Only the server can be trusted to enforce rules.' },
        { t: 'recap', items: [
          'Architecture is the map: parts, connections and where data lives.',
          'Browser side is public; server side is private. Secrets and checks go on the server.',
          'Keep ARCHITECTURE.md updated so every session stays consistent.',
        ] },
      ],
    },
  ],
};
