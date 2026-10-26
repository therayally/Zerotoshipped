export default {
  id: 'grown-up',
  title: 'Grown-up stuff',
  lessons: [
    {
      id: 'soc2',
      title: 'SOC 2 readiness',
      minutes: 10,
      body: [
        { t: 'why', text: 'If you ever want bigger companies as customers, someone in their purchasing team will ask: "Do you have a SOC 2 report?" You do not need one to start. But the habits behind it are just good engineering, and building them now makes getting one later far easier and cheaper.' },
        { t: 'tip', tone: 'warn', text: 'This lesson does **not** make your app SOC 2 compliant, and nothing in this course can. Only a licensed CPA firm can perform a SOC 2 audit and issue a report. What follows helps you get ready.' },
        { t: 'p', text: '**SOC 2** is a report written by an independent auditor that says: "We checked how this company protects its customers\' data, and here is what we found." Big companies ask for it because they cannot inspect every small vendor themselves.' },
        { t: 'analogy', text: 'SOC 2 is like a restaurant health inspection. The inspector does not cook your food. They check your kitchen habits: is the fridge cold, are hands washed, is food labeled. A good kitchen passes because of its daily habits, not because it cleaned up the morning of the visit.' },
        { t: 'h', text: 'The two types' },
        { t: 'table', head: ['', 'Type I', 'Type II'], rows: [
          ['Question', 'Are your controls designed well, today?', 'Did they actually work, every day, for months?'],
          ['Time', 'A snapshot', 'Usually 3 to 12 months of evidence'],
          ['Effort', 'Lower', 'Higher'],
        ] },
        { t: 'h', text: 'What auditors look at' },
        { t: 'p', text: 'SOC 2 is built around five "Trust Services Criteria." **Security** is required; the others are optional depending on your product:' },
        { t: 'steps', items: [
          { do: '**Security** (required): is the system protected against unauthorized access?' },
          { do: '**Availability**: is it up when customers need it?' },
          { do: '**Processing integrity**: does it do what it says, correctly?' },
          { do: '**Confidentiality**: is sensitive business information protected?' },
          { do: '**Privacy**: is personal information handled the way you promised?' },
        ] },
        { t: 'prompt', label: 'SOC 2 readiness check', text: `Review this project and how it is deployed (GitHub, Vercel, Neon, Stripe) against the SOC 2 Trust Services Criteria for Security.
This is a readiness check only, not an audit.
Make SOC2-READINESS.md with:
1. What we already do (with proof: file names, settings).
2. What is missing, sorted by importance.
3. Simple next steps for each gap: things like access reviews, backups, logging, change management, and an incident response plan.
Add a note at the top that this is not a SOC 2 report or certification.` },
        { t: 'deeper', title: 'What this stack already gives you', blocks: [
          { t: 'steps', items: [
            '**Change management:** pull requests, reviews and Vercel deploy history are an audit trail of every change.',
            '**Access control:** two-factor login on GitHub, Vercel, Neon, Stripe and Cloudflare; least-privilege roles.',
            '**Availability:** Neon point-in-time restore and Vercel instant rollback.',
            '**Vulnerability management:** Dependabot, CodeQL and a documented review rhythm.',
          ] },
          { t: 'p', text: 'Compliance platforms (Vanta, Drata, Secureframe and others) collect evidence from these services automatically. They are worth it when a real customer asks for a report, not before.' },
        ] },
        { t: 'check', q: 'Who can issue a SOC 2 report?', options: [
          'Claude, after a readiness check',
          'A licensed CPA firm',
          'You, by writing SECURITY.md',
        ], answer: 1, explain: 'Only an independent CPA firm can audit and issue SOC 2. Your job is to build habits that pass.' },
        { t: 'recap', items: [
          'SOC 2 is an independent auditor\'s report on how you protect data.',
          'Type I checks design; Type II checks months of actual practice.',
          'Good habits now make the audit later easy. This course does not certify anything.',
        ] },
      ],
    },
    {
      id: 'run-like-a-pro',
      title: 'Run your app like a real company',
      minutes: 12,
      body: [
        { t: 'why', text: 'Here is the secret of one-person companies that run big AI-built apps without losing their minds: the AI forgets everything between sessions, so **the project files have to remember for it**. A few simple documents and habits turn a pile of code into something you can keep growing for years.' },
        { t: 'h', text: 'The files every serious project keeps' },
        { t: 'table', head: ['File', 'What goes in it', 'Why it matters'], rows: [
          ['CLAUDE.md', 'Rules the AI must follow; how to run and test the app', 'Every session starts with your standards, automatically'],
          ['ARCHITECTURE.md', 'How the parts fit together', 'Stops the AI from inventing a new structure each time'],
          ['SECURITY.md', 'How you keep data safe, with file references', 'Evidence for customers and auditors'],
          ['CHANGELOG.md', 'What changed in each version, in plain words', '"What broke and when?" always has an answer'],
          ['HANDOFF.md', 'Where you left off and the exact next step', 'Tomorrow-you (or the AI) picks up in seconds'],
          ['USER-GUIDE.md', 'How customers use the app', 'Fewer support messages'],
          ['INCIDENT-PLAYBOOK.md', 'What to do on a bad day', 'Calm, practiced steps instead of panic'],
        ] },
        { t: 'analogy', text: 'Working with an AI is like working with a brilliant contractor who has amnesia every morning. The fix is not a better contractor. It is a really good notebook left on the workbench every night.' },
        { t: 'h', text: 'Habits that keep it healthy' },
        { t: 'steps', items: [
          { do: '**Version numbers on every release** (1.4.0) with a changelog entry.', why: 'When something breaks, you can see exactly which release did it.' },
          { do: '**A test for every bug you fix.**', why: 'AI edits break old things often. A test makes sure the same bug can never quietly come back.' },
          { do: '**Demo data**: a fake business with fake customers.', why: 'You can show the app, take screenshots and test without ever touching real customer data.' },
          { do: '**Database changes run automatically on deploy**, and never delete things in the same release.', why: 'Adding is safe; deleting while old code is still running breaks things.' },
          { do: '**End every session with a handoff note.**' },
        ] },
        { t: 'prompt', label: 'End-of-session handoff', text: `We are stopping for today. Update HANDOFF.md with:
- What we finished (with file names)
- What is half done, and the exact next step
- Anything broken or risky I should know
- Commands to run to pick up again
Then add a short entry to CHANGELOG.md, bump the version if we shipped something, and commit.` },
        { t: 'deeper', title: 'Patterns from production AI-built apps', blocks: [
          { t: 'steps', items: [
            '**Docs as context:** CLAUDE.md points to ARCHITECTURE.md, SECURITY.md and feature docs, so every session starts from the real design.',
            '**Additive migrations** (`IF NOT EXISTS`, add columns, never drop in the same release) applied on every build, so a deploy cannot leave the database half-changed.',
            '**Seeded demo tenant:** realistic fake data generated at build time for demos, screenshots and tests.',
            '**Tenant scoping in one place:** decide which customer a request belongs to once, in middleware, and run all data access inside that scope.',
            '**Local companions:** a small desktop app or relay that does private or heavy work on the owner\'s machine and only talks outward to the cloud.',
            '**A built-in test runner** with a test per fixed bug.',
          ] },
        ] },
        { t: 'check', q: 'Why are project documents especially important when building with AI?', options: [
          'Because AI charges less when there are documents',
          'Because the AI forgets between sessions; the files are its memory',
          'Because GitHub requires them',
        ], answer: 1, explain: 'The repository is the only memory the AI has. Good docs make every session start smart.' },
        { t: 'recap', items: [
          'Docs are the AI\'s long-term memory: CLAUDE.md, ARCHITECTURE.md, HANDOFF.md and friends.',
          'Version releases, test fixed bugs, use demo data.',
          'End every session with a handoff note and a commit.',
        ] },
      ],
    },
    {
      id: 'launch',
      title: 'Launch checklist',
      minutes: 9,
      body: [
        { t: 'why', text: 'You built a real app. Before you tell the world (and your TikTok followers), spend thirty minutes making sure the first impression is a good one, and that nothing embarrassing or dangerous slipped through.' },
        { t: 'prompt', label: 'Final launch check', text: `Do a launch check on this app and give me a checklist with Pass or Fix for each:
- The OWASP check in SECURITY-REVIEW.md has no open High problems.
- npm audit has no High or Critical issues.
- No secrets in the code or git history.
- Stripe is using live keys only in Vercel Production, and the live webhook is set up.
- The site has a Privacy Policy and Terms page.
- Error pages are friendly (try a page that does not exist).
- It works on a phone.
- The database has backups turned on.
Then tell me the 3 most important things to watch in the first week.` },
        { t: 'h', text: 'Things to do yourself' },
        { t: 'steps', items: [
          { do: 'Buy something from your own app with a real card, then refund yourself.', why: 'The only way to be sure the whole money path works.' },
          { do: 'Sign up as a brand-new user on your phone.', why: 'You will spot confusing steps instantly.' },
          { do: 'Ask one friend to try it while you watch silently.', why: 'Where they hesitate is where your users will give up.' },
        ] },
        { t: 'tip', tone: 'safe', text: 'Ship it. Then keep doing sprints. Apps are never "finished"; they get better one week at a time.' },
        { t: 'deeper', title: 'Production readiness, the full list', blocks: [
          { t: 'steps', items: [
            '**Security headers:** Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy.',
            '**Rate limiting** on login, sign-up, checkout and any AI-powered endpoint.',
            '**Monitoring:** error tracking, uptime checks, and alerts when payment webhooks fail.',
            '**Tested backups:** restore one to a Neon branch so you know it works.',
            '**Legal:** a privacy policy that matches what you really collect, terms, and cookie consent if you serve the EU.',
            '**Speed:** run Lighthouse on mobile and fix the slowest thing first.',
          ] },
        ] },
        { t: 'check', q: 'What is the most reliable way to know your payment flow works before launch?', options: [
          'Trust the test mode results',
          'Buy something with a real card and refund yourself',
          'Ask Claude if it works',
        ], answer: 1, explain: 'Test mode is great for building, but one real purchase proves the live keys, webhook and fulfillment all work together.' },
        { t: 'recap', items: [
          'Run the launch-check prompt and fix anything marked Fix.',
          'Real purchase + refund, fresh sign-up on a phone, one friend test.',
          'Launch, then keep improving sprint by sprint.',
        ] },
      ],
    },
  ],
};
