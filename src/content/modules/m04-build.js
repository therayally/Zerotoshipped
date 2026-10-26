import { SAFE } from '../safe';

export default {
  id: 'build',
  title: 'Build your app',
  lessons: [
    {
      id: 'first-app',
      title: 'Your first app',
      minutes: 14,
      body: [
        { t: 'why', text: 'This is the moment it gets real. By the end of this lesson, an app you asked for will be running on your computer, saved to GitHub, and ready to grow. Everything after this is adding pieces to something that already works.' },
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
