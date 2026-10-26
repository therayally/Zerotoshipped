export default {
  id: 'secure',
  title: 'Lock it down',
  lessons: [
    {
      id: 'secrets',
      title: 'Secrets and .env files',
      minutes: 9,
      figure: 'keys',
      body: [
        { t: 'why', text: 'Leaked secret keys are the fastest way to lose money with an app. Bots scan GitHub around the clock looking for them, and people have woken up to thousands of dollars of charges from a key they posted for five minutes. This lesson makes sure that never happens to you.' },
        { t: 'p', text: 'A **secret** (or **API key**) is a long password that lets your app use a service: your database, Stripe, Resend. Anyone who has it can act **as your app**: read your customers\' data, issue refunds, send email in your name.' },
        { t: 'analogy', text: 'A secret key is the key to your shop. You would never tape it to the front door. Putting a key in your front-end code, or saving it to a public GitHub repo, is exactly that.' },
        { t: 'h', text: 'Secrets live in exactly two places' },
        { t: 'steps', items: [
          { do: 'The **.env.local** file on your computer.', why: 'It is listed in `.gitignore`, which tells Git to never save it.' },
          { do: 'The **Environment Variables** page in Vercel.', why: 'Encrypted, and only your server code can read it.' },
          { do: 'And you put them there one way: the **Add a key** prompt (a hidden terminal prompt).', why: 'One paste, never on screen, never in a chat. See "Your secret keys: the terminal way".' },
        ] },
        { t: 'p', text: 'Look at the picture above: the left side (server) is safe; the right side (browser) is public. A secret on the right side is a published secret.' },
        { t: 'prompt', label: 'Secret check-up', text: `Do a secret check-up on this project:
1. Confirm .env, .env.local and any .env.* files are in .gitignore.
2. Search all code and the full git history for anything that looks like a key, password, token, or database link.
3. Check no secret is used in a "use client" file or has a NEXT_PUBLIC_ prefix.
4. List what you find by file and line. Do not print the secret values.
If anything leaked, tell me which keys I must replace at the provider, step by step.` },
        { t: 'tip', tone: 'warn', text: 'If a secret ever reaches GitHub, deleting the file does not fix it: it is still in the history, and may already be copied. **Make a new key at the provider and delete the old one.** That is called rotating, and it is the only real fix.' },
        { t: 'deeper', title: 'Least privilege, separation and rotation', blocks: [
          { t: 'steps', items: [
            '**Least privilege:** give each key only the permissions it needs. Stripe lets you create restricted keys; Resend lets you make sending-only keys.',
            '**Separation:** different keys for testing and for live. A leaked test key costs nothing.',
            '**Rotation:** assume a key will leak someday and make replacing it routine.',
            '**Two nets:** a pre-commit scanner (like gitleaks) on your computer, plus GitHub push protection in the cloud.',
          ] },
          { t: 'p', text: 'Git history lives on in clones, forks and caches. Rewriting history is cleanup; rotation is the fix.' },
        ] },
        { t: 'check', q: 'You accidentally pushed your Stripe secret key to GitHub. What is the real fix?', options: [
          'Delete the file and push again',
          'Make the repo private',
          'Create a new key in Stripe and delete the old one',
        ], answer: 2, explain: 'The old key may already be copied. Rotating it makes the leaked copy useless.' },
        { t: 'recap', items: [
          'A secret key lets anyone act as your app.',
          'Secrets live only in .env.local and Vercel, added through the hidden terminal prompt.',
          'If one leaks, rotate it. Deleting is not enough.',
        ] },
      ],
    },
    {
      id: 'owasp',
      title: 'The OWASP Top 10 check',
      minutes: 13,
      body: [
        { t: 'why', text: 'Hackers are not usually geniuses inventing new tricks. They try the same ten or so mistakes on every app, because those mistakes are everywhere. If you check for those ten, you are safer than the vast majority of apps on the internet, including plenty built by big companies.' },
        { t: 'p', text: '**OWASP** (the Open Worldwide Application Security Project) is a nonprofit of security experts. Every few years they publish the **Top 10**: the most common and dangerous ways web apps get hacked, based on real data. Here is the 2025 list in plain English:' },
        { t: 'table', head: ['#', 'Risk', 'What it looks like in a real app'], rows: [
          ['A01', 'Broken access control', 'Changing /orders/123 to /orders/124 shows someone else\'s order'],
          ['A02', 'Security misconfiguration', 'Debug mode left on, detailed error messages shown to visitors'],
          ['A03', 'Software supply chain failures', 'Using a package that is abandoned, fake, or hacked'],
          ['A04', 'Cryptographic failures', 'Passwords stored as plain text, homemade "encryption"'],
          ['A05', 'Injection', 'User input becomes part of a database command or web page code'],
          ['A06', 'Insecure design', 'No limit on login attempts; the price comes from the browser'],
          ['A07', 'Authentication failures', 'Weak sign-in, sessions that never expire, homemade login code'],
          ['A08', 'Software or data integrity failures', 'Trusting a webhook without checking its signature'],
          ['A09', 'Logging and alerting failures', 'Nobody notices an attack because nothing was recorded'],
          ['A10', 'Mishandling of exceptional conditions', 'An error during a permission check accidentally lets the user in'],
        ] },
        { t: 'p', text: 'Notice how many of these you have already protected against: owner checks on every query (A01), secrets on the server (A04), parameterized queries (A05), prices from the server (A06), Stripe webhook signatures (A08). Your house rules have been doing security work all along.' },
        { t: 'h', text: 'Run the check every sprint' },
        { t: 'prompt', label: 'Run the safety check', text: `Act as a careful security reviewer. Check this whole project against the OWASP Top 10 (2025):
A01 Broken Access Control
A02 Security Misconfiguration
A03 Software Supply Chain Failures
A04 Cryptographic Failures
A05 Injection
A06 Insecure Design
A07 Authentication Failures
A08 Software or Data Integrity Failures
A09 Security Logging and Alerting Failures
A10 Mishandling of Exceptional Conditions

For each one: say Pass, Problem, or Not applicable, and point to the exact file and line.
Then make SECURITY-REVIEW.md with a table of problems sorted by how dangerous they are.
Do not fix anything yet. Wait for me to say which ones to fix.` },
        { t: 'p', text: 'Why "do not fix anything yet"? Because a review that also edits code is hard to check. You want a clear list first, then you fix one item at a time and confirm each fix works.' },
        { t: 'tip', tone: 'info', text: 'After the review, say: "Fix the most dangerous problem. Show me how to check it is really fixed." Then the next one. Small steps, even here.' },
        { t: 'deeper', title: 'The limits of an AI security review', blocks: [
          { t: 'p', text: 'The 2025 edition added **Software Supply Chain Failures** and **Mishandling of Exceptional Conditions**, and folded server-side request forgery into access control.' },
          { t: 'p', text: 'An AI review is a strong first pass, not a guarantee. Pair it with automated scanners (the next two lessons), and before you handle sensitive data at scale, a human penetration test. When you outgrow the Top 10, the **OWASP ASVS** is a much more detailed checklist.' },
          { t: 'links', items: [{ label: 'OWASP Top 10', url: 'https://owasp.org/Top10/' }, { label: 'OWASP ASVS', url: 'https://owasp.org/www-project-application-security-verification-standard/' }] },
        ] },
        { t: 'check', q: 'Your app reads the price from a hidden field in the checkout form. Which OWASP risk is that?', options: [
          'A06 Insecure design: the browser should never decide the price',
          'A09 Logging failures',
          'It is fine, hidden fields are hidden',
        ], answer: 0, explain: '"Hidden" fields are visible and editable to anyone with browser tools. The server must look up the price itself.' },
        { t: 'recap', items: [
          'The OWASP Top 10 lists the mistakes attackers try first.',
          'Your house rules already cover many of them.',
          'Run the review every sprint; fix one problem at a time.',
        ] },
      ],
    },
    {
      id: 'cves',
      title: 'Scan for known holes (CVEs)',
      minutes: 9,
      body: [
        { t: 'why', text: 'Your app is built on hundreds of small code packages written by other people. When a security hole is found in one of them, it gets published publicly, which means attackers learn about it at the same moment you do. Keeping packages updated is how you close the door before they walk through it.' },
        { t: 'p', text: 'Each publicly known hole gets an ID like **CVE-2025-12345** (CVE stands for Common Vulnerabilities and Exposures), plus a severity score from 0 to 10. You do not need to read them all. You need a tool that checks for you.' },
        { t: 'h', text: 'Check right now' },
        { t: 'p', text: 'Paste this into Claude. It runs a tool called `npm audit`, which compares every package your app uses against a public list of known holes, then fixes what it safely can:' },
        { t: 'prompt', label: 'Fix the holes', text: `Run npm audit. For each High or Critical problem:
1. Explain in one simple sentence what could go wrong.
2. Fix it by updating the package if there is a safe update.
3. If an update could break things, tell me before doing it.
Then run the app and the build again to make sure nothing broke. Commit with a clear message.` },
        { t: 'h', text: 'Let GitHub watch for you' },
        { t: 'steps', items: [
          { do: 'On GitHub, open your repo → **Settings → Code security**.' },
          { do: 'Turn on **Dependabot alerts** and **Dependabot security updates**.', why: 'GitHub will email you when a new hole is found, and even open a ready-made fix for you to approve.' },
        ] },
        { t: 'tip', tone: 'warn', text: 'AI sometimes invents package names that do not exist. Attackers register those made-up names with malware inside, waiting for someone to install them. Before installing any new package, ask Claude: "Does this package really exist, is it maintained, and how many weekly downloads does it have?"' },
        { t: 'deeper', title: 'The layers of automated scanning', blocks: [
          { t: 'table', head: ['Type', 'Finds', 'Free tools'], rows: [
            ['SCA (your packages)', 'Known-vulnerable packages', 'npm audit, Dependabot'],
            ['SAST (your code)', 'Risky patterns in your source', 'GitHub CodeQL, Semgrep'],
            ['Secret scanning', 'Keys saved by mistake', 'GitHub push protection, gitleaks'],
            ['DAST (your live app)', 'Problems visible from outside', 'OWASP ZAP'],
          ] },
          { t: 'p', text: 'The fake-package trick is nicknamed "slopsquatting." Check the package page, its repository, its maintainers and its download count before trusting it.' },
        ] },
        { t: 'check', q: 'Claude suggests installing a package you have never heard of. What should you check first?', options: [
          'That it has a nice logo',
          'That it really exists, is maintained, and has real downloads',
          'Nothing, Claude knows best',
        ], answer: 1, explain: 'AI can invent package names, and attackers register those names with malware. A ten-second check prevents it.' },
        { t: 'recap', items: [
          'Known holes in packages get CVE IDs and are public.',
          'Run `npm audit` and turn on Dependabot.',
          'Verify any new package is real before installing.',
        ] },
      ],
    },
    {
      id: 'security-tools',
      title: 'Free security scanners',
      minutes: 11,
      body: [
        { t: 'why', text: 'You are one person. Big companies have whole security teams. The trick is to let free tools be your security team: they check every change automatically, never get tired, and catch the mistakes you would never spot by eye.' },
        { t: 'h', text: 'Start with the one built into Claude Code' },
        { t: 'p', text: 'In the Claude app\'s Code tab, type this into the message box (it is a Claude command, not a terminal command):' },
        { t: 'prompt', label: 'Type into Claude', text: '/security-review' },
        { t: 'p', text: 'This reads your recent changes and looks for common holes: injection, cross-site scripting, broken logins, unsafe data handling. Then just say "Fix the most serious one first."' },
        { t: 'h', text: 'Free tools that run automatically' },
        { t: 'table', head: ['Tool', 'What it checks', 'Think of it as'], rows: [
          ['Claude Code Security Review (GitHub Action)', 'Every change you send to GitHub', 'A security reviewer on every pull request'],
          ['gitleaks', 'Secret keys saved by mistake', 'A metal detector for passwords'],
          ['Semgrep', 'Risky code patterns', 'A spell checker for security bugs'],
          ['Trivy', 'Old packages with known holes', 'A recall checker for your parts'],
          ['OWASP ZAP', 'Your live website, from the outside', 'A friendly burglar testing your locks'],
          ['Strix and Shannon', 'AI "ethical hackers" that try to break in and show proof', 'A practice heist with a report'],
        ] },
        { t: 'prompt', label: 'Set up automatic scans', text: `Set up free automatic security checks for this repo with GitHub Actions:
1. anthropics/claude-code-security-review on every pull request.
2. gitleaks to block committed secrets.
3. Semgrep with its default rules.
4. npm audit (fail on high or critical).
Explain each one in one sentence, and tell me which secrets I need to add in GitHub settings (by name only).` },
        { t: 'tip', tone: 'warn', text: 'Only scan and attack apps **you own** or have written permission to test. Running these tools against someone else\'s website without permission is illegal, even if you mean well.' },
        { t: 'deeper', title: 'Using AI pentesters responsibly', blocks: [
          { t: 'steps', items: [
            'Point them at a **staging** copy you own, never at production with real customer data.',
            'Results vary run to run. Treat findings as leads to confirm, not a certificate.',
            'They use paid AI calls, so set a spending limit before long runs.',
            'Check licenses: Shannon\'s open edition is AGPL-3.0; Strix is Apache-2.0.',
            'Use the official repositories; copies with the same name exist.',
          ] },
          { t: 'links', items: [
            { label: 'Claude Code security review', url: 'https://github.com/anthropics/claude-code-security-review' },
            { label: 'Strix', url: 'https://github.com/usestrix/strix' },
            { label: 'Shannon', url: 'https://github.com/KeygraphHQ/shannon' },
            { label: 'OWASP ZAP', url: 'https://www.zaproxy.org' },
          ] },
        ] },
        { t: 'check', q: 'Where should you point an AI pentesting tool like Strix?', options: [
          'At any website you are curious about',
          'At a staging copy of your own app',
          'At your live app with real customers',
        ], answer: 1, explain: 'Your own app, on a test copy. Other people\'s sites are off limits, and live data is too risky.' },
        { t: 'recap', items: [
          'Run /security-review often; it is built in.',
          'Automate gitleaks, Semgrep, npm audit and Claude\'s review on GitHub.',
          'AI pentesters only on staging copies of apps you own.',
        ] },
      ],
    },
    {
      id: 'security-standards',
      title: 'Security standards for a business app',
      minutes: 14,
      body: [
        { t: 'why', text: 'The moment a business pays you to build something, you are responsible for their customers\' data too. This lesson is the checklist real business apps follow: the same controls a security questionnaire or an auditor will ask about. Meet these, and you can say yes with a straight face.' },
        { t: 'h', text: 'The business security checklist' },
        { t: 'steps', items: [
          { do: '**Passwords are hashed**, never stored as plain text. Or skip passwords entirely and use email codes.', why: 'Hashing turns a password into scrambled text that cannot be turned back. If the database leaks, the passwords do not.' },
          { do: '**Too many wrong tries locks the account** for a while.', why: 'Stops people from guessing passwords by trying thousands.' },
          { do: '**Sessions are signed**, so nobody can fake being logged in.', why: 'A signed session is like a ticket with a hologram. Change one letter and it no longer counts.' },
          { do: '**Every page checks who you are AND what you are allowed to do.**', why: 'Being logged in is not the same as being allowed. A staff member should not see the owner\'s payroll.' },
          { do: '**Each business only ever sees its own data.**', why: 'If you serve many businesses, one leak between them ends your company.' },
          { do: '**Limits on how fast anyone can hit sign-in and forms.**', why: 'Slows attackers and spammers to a crawl.' },
          { do: '**Uploads are private** and served through short-lived links.' },
          { do: '**An activity log** records sign-ins, permission changes, exports and deletions.', why: 'When something goes wrong, the log tells you what happened.' },
          { do: '**Backups happen daily**, and you have tested restoring one.', why: 'A backup you have never restored is a hope, not a backup.' },
          { do: '**A written plan for bad days.**', why: 'Panicking and improvising during a breach makes everything worse.' },
        ] },
        { t: 'prompt', label: 'Write my security file', text: `Check this app against a business security baseline and write SECURITY.md.
For each item say Done, Partly, or Missing, and point to the file that does it:
1. Password hashing (bcrypt or argon2) or passwordless email codes
2. Account lockout after repeated failures
3. Signed, httpOnly, secure session cookies with expiry
4. Authorization on every route, and tenant isolation on every query
5. Rate limits on sign-in, sign-up, codes and public forms (stored in the database, not memory)
6. The real client IP taken from the platform's own header, not one the user can fake
7. Input validation on the server for every endpoint
8. Security headers (CSP, HSTS, X-Content-Type-Options, frame protection)
9. Webhooks verified by signature
10. Private file storage with signed, short-lived links
11. Audit log for logins, role changes, exports, deletions and admin actions
12. Backups and a tested restore
13. Secrets only in environment variables, rotated if ever exposed
Do not change code yet. Then list the top 5 fixes in order.` },
        { t: 'prompt', label: 'Write my bad-day plan', text: `Write INCIDENT-PLAYBOOK.md for this app in simple words:
- How to tell something is wrong (alerts, errors, odd sign-ins)
- First 15 minutes: who does what, how to lock things down (rotate keys, disable accounts, take the site offline)
- How to find out what happened (logs, audit log)
- How and when to tell affected customers
- How to write down what we learned
Use the real service names this app uses (Vercel, Neon, Stripe, Resend, Cloudflare).` },
        { t: 'deeper', title: 'Lessons real apps learned the hard way', blocks: [
          { t: 'steps', items: [
            '**In-memory rate limits do nothing on serverless.** Each copy of your server has its own memory and resets often. Store counters in the database.',
            '**The first IP in `X-Forwarded-For` is whatever the user typed.** Use the hop your hosting platform adds, or attackers rotate fake IPs to dodge your limits.',
            '**Signed beats encoded.** A base64 cookie is readable and editable; a signed one fails the check if touched.',
            '**Fail closed.** If a permission check crashes, deny. Never fall through to "allowed."',
            '**Refuse to start without secrets.** No built-in fallback session secret in production.',
            '**Support access is opt-in and logged.** "View as customer" needs the customer\'s permission and leaves an audit entry.',
          ] },
          { t: 'p', text: 'These controls map to OWASP ASVS Levels 1–2 and to what SOC 2 auditors ask about. Writing them down in SECURITY.md, with file references, turns "we think it is secure" into evidence.' },
        ] },
        { t: 'check', q: 'Your app is logged in as a staff member. Should they automatically see the owner\'s payroll page?', options: [
          'Yes, they are logged in',
          'No: being logged in is not the same as being allowed. Check their role.',
          'Only on weekdays',
        ], answer: 1, explain: 'Authentication is who you are. Authorization is what you may do. Business apps need both on every page.' },
        { t: 'recap', items: [
          'Ten controls cover what businesses and auditors ask about.',
          'Logged in ≠ allowed: check roles and business boundaries everywhere.',
          'Write SECURITY.md and an incident playbook before you need them.',
        ] },
      ],
    },
  ],
};
