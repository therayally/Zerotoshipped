import { SAFE } from '../safe';

export default {
  id: 'build',
  title: 'Build your app',
  lessons: [
    {
      id: 'practice-run',
      title: 'Practice run: build a test app',
      minutes: 15,
      body: [
        { t: 'why', text: 'Before you build the app you actually care about, do one practice lap on something that does not matter. You will go through the whole loop (ask, check, fix, save) with nothing at stake. If it breaks, good: breaking things here is the point.' },
        { t: 'p', text: 'Your test app is a **Decision Spinner**. You type a few choices (like "tacos, pizza, sushi"), press Spin, and it picks one for you. It is small, but it has everything a real app has: a page, buttons, data that gets saved, and something that can go wrong.' },
        { t: 'h', text: 'Step 1: give it its own folder' },
        { t: 'steps', items: [
          { do: 'In the Claude app\'s **Code** tab, start a new session and choose **New folder**. Name it **practice-app**.', why: 'Keeping practice separate means you can delete it later without touching anything important.' },
          { do: 'Paste your **house rules** prompt first, like you always will.' },
        ] },
        { t: 'h', text: 'Step 2: ask for the app' },
        { t: 'prompt', label: 'Build the Decision Spinner', text: `Build a small practice web app called Decision Spinner in this folder.
- One page. A box where I type choices, one per line, and a big Spin button.
- When I press Spin, it picks one choice at random and shows it big in the middle.
- Save my choices in the browser so they are still there after I refresh.
- Keep it simple: plain HTML, CSS and JavaScript, no sign-in, no database.
Then open it for me or tell me exactly how to open it.` + SAFE },
        { t: 'h', text: 'Step 3: change something' },
        { t: 'p', text: 'Ask for one change at a time and look at the result after each one. Try these:' },
        { t: 'steps', items: [
          { do: '"Make the Spin button blue and a bit bigger."' },
          { do: '"Show the last 5 results under the button."' },
          { do: '"Add a Clear button that empties the list, and ask me to confirm first."' },
        ] },
        { t: 'h', text: 'Step 4: break it on purpose' },
        { t: 'p', text: 'Delete every choice and press Spin. Does it crash, show "undefined", or do nothing? Whatever happens, describe it to Claude in plain words:' },
        { t: 'prompt', label: 'Fix a bug like a pro', text: `When the list is empty and I press Spin, this happens: [WHAT YOU SAW].
I expected it to show a friendly message like "Add a few choices first."
Find the cause, explain it in one sentence, then fix it.` },
        { t: 'p', text: 'This is the most important skill in the course: say **what you did**, **what you saw**, and **what you expected**. That is how real developers report bugs, and it gets you a fix on the first try much more often.' },
        { t: 'h', text: 'Step 5: save your work' },
        { t: 'prompt', label: 'Save it', text: 'Commit this with a clear message, make a private GitHub repo called practice-app, and push it.' },
        { t: 'h', text: 'You pass when...' },
        { t: 'steps', items: [
          'The Spinner opens and picks a random choice.',
          'Your choices are still there after you refresh the page.',
          'An empty list shows a friendly message instead of breaking.',
          'The code is saved in a private GitHub repo.',
        ] },
        { t: 'tip', tone: 'safe', text: 'Stuck for more than ten minutes? Say: "Undo your last change and try a simpler way." Going backwards is a normal, smart move, not a failure.' },
        { t: 'deeper', title: 'Why "saved in the browser" is not a database', blocks: [
          { t: 'p', text: 'Your Spinner uses **localStorage**, a small storage box inside your browser. It is perfect for practice, but it only lives on that one browser on that one computer. Open the app on your phone and your list is gone.' },
          { t: 'p', text: 'Anyone can also open the browser\'s developer tools and read or edit localStorage, so it must never hold passwords, payment details or anything private. Real apps keep that data in a server database like Neon, which you hook up in "Data and money".' },
        ] },
        { t: 'check', q: 'Your app shows "undefined" when you press Spin. What is the best message to send Claude?', options: [
          '"It\'s broken, fix it."',
          '"When the list is empty and I press Spin, it shows undefined. I expected a friendly message."',
          '"Rewrite the whole app."',
        ], answer: 1, explain: 'What you did, what you saw, what you expected. Clear bug reports get clean fixes.' },
        { t: 'recap', items: [
          'Practice on a throwaway app before your real one.',
          'Ask for one change at a time and check each result.',
          'Report bugs as: what I did, what I saw, what I expected.',
        ] },
      ],
    },
    {
      id: 'first-app',
      title: 'Your first app',
      minutes: 14,
      body: [
        { t: 'why', text: 'Practice lap done. This is the moment it gets real. By the end of this lesson, an app you asked for will be running on your computer, saved to GitHub, and ready to grow. Everything after this is adding pieces to something that already works.' },
        { t: 'h', text: 'What we are building with' },
        { t: 'p', text: 'We will use **Next.js**, the most popular way to build web apps with React (the code library behind Facebook, Netflix and many others). We pick it for three reasons: it handles both the page people see and the private server code in one project, it is made by the same company as Vercel so deploying is effortless, and AI tools have seen a huge amount of it, so they write it well.' },
        { t: 'p', text: 'We will also use **TypeScript**, which is regular JavaScript with labels on everything ("this is a number", "this is an email"). Those labels let the computer catch mistakes before your app even runs. That is extremely helpful when an AI is writing most of the code.' },
        { t: 'h', text: 'Step 1: make a home for your project' },
        { t: 'p', text: 'Every project lives in its own folder, so Claude only ever touches that one project.' },
        { t: 'steps', items: [
          { do: 'Open the Claude app and click the **Code** tab.' },
          { do: 'Start a new session and choose **New folder**. Name it **my-app** (in Documents is fine).', why: 'Claude can read and change only the folder you pick, never the rest of your computer.' },
        ] },
        { t: 'h', text: 'Step 2: set the house rules' },
        { t: 'p', text: 'Paste the **house rules** prompt from the "Talk to it like a pro" lesson. Do this before anything else, every time you start a project. It takes ten seconds and protects you for the life of the app.' },
        { t: 'h', text: 'Step 3: build the starter app' },
        { t: 'prompt', label: 'Build the starter app', text: `Set up a new Next.js app in this folder using the App Router, TypeScript, and Tailwind CSS.
Make a simple home page that says the name of my app: [APP NAME].
Then start the dev server and tell me the web address to open.
Then make a GitHub repo for it (private), push the code, and tell me the link.` + SAFE },
        { t: 'p', text: 'Claude will ask permission for a few steps (installing packages, creating files). Read what it says it is about to do, then approve. When it finishes, it will give you an address, usually **localhost:3000**. Open it in your browser:' },
        { t: 'mock', name: 'localhost' },
        { t: 'p', text: '**localhost** means "this computer." Nobody else on the internet can see this page yet. It is your private workshop. You will make it public in the "Go live" module.' },
        { t: 'tip', tone: 'safe', text: 'Every time something works, say: "Commit and push this with a clear message." That one sentence is your undo button and your backup, in one.' },
        { t: 'h', text: 'Step 4: make a change' },
        { t: 'p', text: 'Try asking for something small, like "Add a section under the title that explains what my app does, in two sentences." Watch the page in your browser: it updates on its own as Claude saves files. That instant loop (ask, see, adjust) is how you will build everything from here.' },
        { t: 'deeper', title: 'Server components, client components, and the secret-key trap', blocks: [
          { t: 'p', text: 'Terminal users can do the folder step by hand: `mkdir my-app`, `cd my-app`, then `claude`.' },
          { t: 'p', text: 'In Next.js, components are **server components** by default: they run only on the server, so they can safely read the database and secret keys. A file that starts with `"use client"` is sent to the browser, so anything in it is public.' },
          { t: 'p', text: 'Environment variables follow the same split. `DATABASE_URL` and `STRIPE_SECRET_KEY` stay on the server. Anything starting with `NEXT_PUBLIC_` is copied into the browser code at build time, where anyone can read it.' },
          { t: 'tip', tone: 'warn', text: 'A very common AI mistake: it hits an "undefined" error and "fixes" it by renaming a secret to `NEXT_PUBLIC_...`. That publishes your secret. If you ever see that prefix on a key, stop and ask why.' },
          { t: 'p', text: 'Adding `import "server-only"` at the top of sensitive files makes the build fail if they are ever pulled into browser code, turning a silent leak into a loud error.' },
        ] },
        { t: 'check', q: 'You open localhost:3000 and see your app. Who else can see it right now?', options: [
          'Anyone with the link',
          'Nobody. localhost means only this computer.',
          'Anyone on GitHub',
        ], answer: 1, explain: 'localhost is your private workshop. It goes public only when you deploy.' },
        { t: 'recap', items: [
          'Next.js + TypeScript: front end and server in one project, with mistake-catching labels.',
          'Each project gets its own folder, chosen in the Claude app.',
          'localhost is private. Commit and push every time something works.',
        ] },
      ],
    },
  ],
};
