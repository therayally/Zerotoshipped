export default {
  id: 'github-pro',
  title: 'GitHub like a pro',
  advanced: true,
  lessons: [
    {
      id: 'git-basics',
      title: 'Commits, branches and pull requests',
      minutes: 12,
      figure: 'branches',
      body: [
        { t: 'why', text: 'You have been saying "commit and push" since your first app. This lesson shows what actually happens, so you can try risky ideas without ever breaking the live app, and work with other people (or several AI sessions) on one project without chaos.' },
        { t: 'p', text: 'Look at the picture above. The blue line is **main**: the version of your app that is live. The green line is a **branch**: a safe copy where you try something new. When it works, you **merge** it back into main.' },
        { t: 'table', head: ['Word', 'Plain English', 'Video game version'], rows: [
          ['Commit', 'A save point with a short note about what changed', 'Saving your game'],
          ['Push', 'Upload your save points to GitHub', 'Syncing your save to the cloud'],
          ['Branch', 'A separate line of work that does not touch main', 'A second save slot for a risky run'],
          ['Pull request (PR)', 'A request to merge a branch into main, with a page to review the changes', 'Showing your run to a friend before it counts'],
          ['Merge', 'Bring a branch\'s changes into main', 'Making that run your official save'],
        ] },
        { t: 'h', text: 'The safe way to add a feature' },
        { t: 'steps', items: [
          { do: 'Ask Claude to start a branch for the feature.', why: 'Main keeps working the whole time, even if the experiment goes badly.' },
          { do: 'Build and commit as usual. Each push to the branch gets its own **Vercel preview link**.', why: 'You can test the change on a real phone, on the real internet, before anyone else sees it.' },
          { do: 'When it works, ask Claude to open a pull request, then read the summary of what changed.' },
          { do: 'Merge it. Vercel deploys main, and your feature is live.' },
        ] },
        { t: 'prompt', label: 'Build a feature on a branch', text: `Start a new branch called [feature-name] for this change: [WHAT YOU WANT].
Commit as you go with clear messages and push the branch.
When it works, give me the Vercel preview link to test, then open a pull request with a plain-English summary of what changed and anything I should check.
Do not merge until I say so.` },
        { t: 'tip', tone: 'info', text: 'Prefer buttons? **GitHub Desktop** (desktop.github.com) is a free app that shows your commits, branches and changes visually. It is a great way to see what Claude has been doing.' },
        { t: 'deeper', title: 'What Git is actually storing', blocks: [
          { t: 'p', text: 'Each commit is a snapshot of every file, identified by a unique hash (like `a1b2c3d`). A branch is just a movable label pointing at one commit. Merging creates a commit with two parents, joining the lines.' },
          { t: 'p', text: 'A **merge conflict** happens when both lines changed the same lines of the same file. Git cannot guess which is right, so it asks. Claude is very good at resolving these: ask it to explain both sides before choosing.' },
          { t: 'p', text: 'Turn on **branch protection** for main (repo → Settings → Branches) so nothing reaches main without a pull request. That one setting prevents most "oops, I broke production" moments.' },
        ] },
        { t: 'check', q: 'Why build a new feature on a branch instead of main?', options: [
          'Branches are faster',
          'Main stays working and live while you experiment, and you get a preview link to test first',
          'GitHub charges less for branches',
        ], answer: 1, explain: 'A branch is a safe sandbox. Main only changes when you merge something that works.' },
        { t: 'recap', items: [
          'Commit = save point; push = upload; branch = safe copy; merge = make it official.',
          'Every branch gets a Vercel preview link to test on the real internet.',
          'Protect main so changes only arrive through pull requests.',
        ] },
      ],
    },
    {
      id: 'undo-anything',
      title: 'Undo anything: the time machine',
      minutes: 9,
      body: [
        { t: 'why', text: 'The scariest moment in vibe coding is when the AI changes twenty files and the app stops working. With Git, that is never a disaster. Every commit is a point you can go back to, in seconds, without losing the history.' },
        { t: 'h', text: 'Three ways to go back' },
        { t: 'table', head: ['Situation', 'What to ask Claude', 'What it does'], rows: [
          ['Claude\'s last changes broke things, nothing saved yet', '"Throw away the changes since my last commit."', 'Restores files to the last save point'],
          ['A commit is already pushed and the live app broke', '"Revert the last commit and push."', 'Adds a new commit that undoes it, keeping history honest'],
          ['You want to see how things were last Tuesday', '"Show me what the app looked like at the commit from Tuesday, without changing main."', 'Opens the old version on a temporary branch'],
        ] },
        { t: 'tip', tone: 'safe', text: 'The fastest fix for a broken live site is not in Git at all: in Vercel, open **Deployments**, find the last good one, and click **Promote to Production** (instant rollback). Then fix the code calmly.' },
        { t: 'prompt', label: 'Get me back to working', text: `Something broke. Show me the last 5 commits with a one-line plain-English summary of each.
Tell me which one was probably the last working version and why.
Then wait for me to choose before undoing anything. Never use force-push or delete history.` },
        { t: 'deeper', title: 'Revert vs. reset, and why "force push" is dangerous', blocks: [
          { t: 'p', text: '`git revert` adds a new commit that undoes an old one. History stays intact, which is safe on shared branches. `git reset --hard` moves the branch back and throws commits away, which is fine on your own unpushed work but destructive on anything shared.' },
          { t: 'p', text: '`git push --force` overwrites GitHub\'s copy with yours. If anyone else (or another AI session) pushed in the meantime, their work disappears. Protected branches block it on main.' },
        ] },
        { t: 'check', q: 'Your live site broke after a push. What is the fastest way to get it working again?', options: [
          'Delete the repo and start over',
          'Promote the last good deployment in Vercel, then revert the bad commit',
          'Wait for it to fix itself',
        ], answer: 1, explain: 'Rollback first so customers are fine, then undo the bad change with a revert.' },
        { t: 'recap', items: [
          'Every commit is a point you can return to.',
          'Revert for pushed work; restore for unsaved changes.',
          'Vercel rollback fixes the live site instantly while you investigate.',
        ] },
      ],
    },
    {
      id: 'github-automation',
      title: 'Let GitHub check your work (Actions)',
      minutes: 11,
      body: [
        { t: 'why', text: 'Professional teams never rely on remembering to run checks. GitHub can run them automatically on every pull request: does it build, do the tests pass, did a secret sneak in. It is like having a strict, free reviewer who never gets tired.' },
        { t: 'p', text: '**GitHub Actions** runs small jobs on GitHub\'s computers whenever something happens in your repo, like a push or a new pull request. The instructions live in a file in your repo, under `.github/workflows/`.' },
        { t: 'h', text: 'Three checks worth turning on' },
        { t: 'steps', items: [
          { do: '**Build check:** make sure the app still builds before anything merges.', why: 'Catches the "works on my computer" problem.' },
          { do: '**Dependabot:** repo → Settings → Code security → turn on alerts and security updates.', why: 'GitHub opens pull requests for you when a package your app uses has a known hole.' },
          { do: '**Secret scanning with push protection:** same settings page.', why: 'Blocks a push that contains a known kind of API key, before it ever reaches GitHub.' },
        ] },
        { t: 'prompt', label: 'Add a build check', text: `Add a GitHub Actions workflow that runs on every pull request to main.
It should install dependencies, run the type check and the build, and run tests if there are any.
Keep it simple, pin the action versions, and give it read-only permissions.
Then turn on branch protection so pull requests cannot merge unless this check passes, and tell me where to see the results.` },
        { t: 'deeper', title: 'Keeping workflows safe', blocks: [
          { t: 'steps', items: [
            'Give workflows the least permissions (`permissions: contents: read`) unless they truly need more.',
            'Store secrets in repo → Settings → Secrets and variables → Actions, never in the workflow file.',
            'Be careful with workflows that run on pull requests from forks: they can run code written by strangers.',
            'Pin third-party actions to a version (or commit hash), so an update you did not review cannot change what runs.',
          ] },
        ] },
        { t: 'check', q: 'What does GitHub secret scanning with push protection do?', options: [
          'It makes your repo private',
          'It blocks a push that contains a known type of API key',
          'It encrypts your code',
        ], answer: 1, explain: 'It stops the leak before it happens, which is far easier than rotating keys afterwards.' },
        { t: 'recap', items: [
          'Actions run checks automatically on every pull request.',
          'Turn on Dependabot and secret scanning in Code security.',
          'Least permissions, secrets in Settings, pinned versions.',
        ] },
      ],
    },
    {
      id: 'learn-from-real-apps',
      title: 'Reverse-engineer real apps (legally)',
      minutes: 14,
      body: [
        { t: 'why', text: 'The fastest way to get good is to study how experienced builders did it. Thousands of real, professional apps are open source on GitHub, built with the exact tools from this course. You can read every line, run them on your computer, and borrow the patterns, as long as you respect the license.' },
        { t: 'p', text: '**Reverse engineering** here means taking a working app apart to understand how it works. With open-source code that is easy and completely allowed: the authors published it so people could learn from it.' },
        { t: 'h', text: 'Repos that use this course\'s stack' },
        { t: 'table', head: ['Repo', 'What it is', 'Learn this from it', 'License'], rows: [
          ['nextjs/saas-starter', 'A starter for paid apps, from the Next.js team', 'Sign-in, Postgres with Drizzle, Stripe subscriptions, dashboard layout', 'MIT'],
          ['vercel/chatbot', 'Vercel\'s full AI chatbot', 'Streaming AI replies, saving chat history in Postgres, file uploads', 'Apache-2.0'],
          ['resend/react-email', 'The email templates kit from Resend', 'Building good-looking emails as React components', 'MIT'],
          ['ixartz/SaaS-Boilerplate', 'A complete SaaS starter', 'Teams and roles, multi-language, testing setup, Drizzle migrations', 'MIT'],
          ['calcom/cal.diy', 'The open-source version of Cal.com scheduling', 'How a big, real product organizes a huge codebase', 'MIT'],
          ['documenso/documenso', 'An open-source DocuSign alternative', 'Document signing, email flows, a serious production app', 'AGPL-3.0'],
        ] },
        { t: 'p', text: 'Find more by searching GitHub for **topic:nextjs topic:drizzle** or **topic:stripe**, sorted by stars. Prefer repos that were updated recently and have thousands of stars.' },
        { t: 'h', text: 'How to take one apart with Claude' },
        { t: 'steps', items: [
          { do: 'Make a new folder called **study** in the Claude app\'s Code tab, separate from your own app.', why: 'Keeps strangers\' code away from your project and its secrets.' },
          { do: 'Paste the "Give me the tour" prompt below with the repo address.' },
          { do: 'Ask follow-up questions about one feature at a time: "How does sign-in work? Walk me through it file by file."' },
          { do: 'When you find a pattern you like, ask Claude to rebuild it **in your own app, in your own words**, rather than pasting their files.' },
        ] },
        { t: 'prompt', label: 'Give me the tour', text: `Clone https://github.com/[OWNER]/[REPO] into this folder. Read it, but do not run any scripts yet.
1. Tell me what the app does and draw its architecture as a simple diagram (front end, server, database, email, payments).
2. List the main tools it uses and what each one is for, in plain English.
3. Show me the 5 most important files and what each one does.
4. Tell me its license and what that allows me to do.
5. Point out anything risky before I run it: install scripts, unusual network calls, or secrets it expects.` },
        { t: 'prompt', label: 'Borrow a pattern the right way', text: `In the study repo, find how [FEATURE, e.g. "Stripe subscriptions"] works and explain it step by step.
Then implement the same idea in my own app in [MY APP FOLDER], written fresh to fit my code.
If any part is copied closely, tell me which file it came from and keep the original license notice with it.` },
        { t: 'h', text: 'Licenses in one minute' },
        { t: 'table', head: ['License', 'What it means for you'], rows: [
          ['MIT, Apache-2.0', 'Use, change and sell it. Keep their copyright notice. Apache also includes a patent promise.'],
          ['AGPL-3.0', 'If you run a changed version as a website or service, you must publish your full source code too. Great to learn from; think hard before building a business on it.'],
          ['No license file', 'All rights reserved. You may read it, but not copy or reuse it.'],
          ['"Enterprise" folders (often ee/)', 'Usually paid or restricted, even inside an open repo. Read before using.'],
        ] },
        { t: 'tip', tone: 'warn', text: '"Reverse engineering" never means breaking into someone\'s live app, copying a closed-source product, or bypassing a login or paywall. Study what is published openly, follow the license, and build your own thing.' },
        { t: 'deeper', title: 'Running a stranger\'s code safely', blocks: [
          { t: 'steps', items: [
            'Read `package.json` scripts first: a "postinstall" script runs automatically when you install.',
            'Never put your real API keys into someone else\'s project. Use test keys or the example values from `.env.example`.',
            'For anything unfamiliar, run it in a container (Docker) or a cloud sandbox so it cannot touch your files.',
            'Check the repo\'s recent commits and issues: an abandoned repo can carry old security holes.',
          ] },
          { t: 'p', text: 'A great exercise: pick one feature from a big repo, find the pull request that added it (search the repo\'s closed pull requests), and read the discussion. You see not just the final code but why the team built it that way.' },
        ] },
        { t: 'check', q: 'You find a great feature in an AGPL-licensed repo and want to use it in your paid web app. What should you know?', options: [
          'AGPL is the same as MIT',
          'If you run changed AGPL code as a service, you must publish your own source code too',
          'You can never look at AGPL code',
        ], answer: 1, explain: 'Learning from it is fine. Shipping it inside your app has strings attached, so rebuild the idea yourself or pick an MIT-licensed example.' },
        { t: 'recap', items: [
          'Open-source repos with this stack are free textbooks.',
          'Study in a separate folder; let Claude give you the tour and spot risks.',
          'Rebuild patterns in your own words and respect the license.',
        ] },
      ],
    },
  ],
};
