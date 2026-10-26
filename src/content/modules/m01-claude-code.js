export default {
  id: 'ai-coder',
  title: 'Get Claude Code',
  lessons: [
    {
      id: 'pick-a-tool',
      title: 'Claude Code (and when to use Codex)',
      minutes: 8,
      body: [
        { t: 'why', text: 'Your AI coding tool is the most important tool in this whole course. It is the "crew" that builds your app. Picking one and learning it well beats jumping between five tools you only half understand.' },
        { t: 'p', text: '**Claude Code** is an AI made by Anthropic that builds software for you. The key difference from a normal chatbot: it does not just *tell* you what code to write. It works directly inside your project folder. It can create files, edit them, run your app, read the error messages, and fix its own mistakes, all while you watch and approve.' },
        { t: 'analogy', text: 'A chatbot is like texting a friend who is good at cooking and asking for a recipe. Claude Code is like that friend actually coming over, opening your fridge, and cooking the meal in your kitchen while you watch and say "a little less salt."' },
        { t: 'h', text: 'Where you can use it' },
        { t: 'table', head: ['Where', 'What it looks like', 'Good for'], rows: [
          ['Claude desktop app (Code tab)', 'Buttons, a file view and a chat', '**This course uses it.** No terminal needed.'],
          ['Terminal', 'A text window where you type commands', 'Optional, if you like the keyboard'],
          ['VS Code (a code editor)', 'Code on one side, Claude on the other', 'Watching the code change as it works'],
        ] },
        { t: 'p', text: 'Claude Code needs a paid Claude plan. **Pro** is enough to start. If you end up building every day, **Max** gives you a lot more room before you hit your limit. Prices change, so check claude.com/pricing for the current numbers.' },
        { t: 'h', text: 'What about Codex?' },
        { t: 'p', text: '**Codex** is OpenAI\'s coding AI (the company that makes ChatGPT). It is good too, and you should know when it makes sense:' },
        { t: 'table', head: ['Use', 'When'], rows: [
          ['Claude Code', 'You are building your app step by step and want one main tool you steer closely. This course is built around it.'],
          ['Codex', 'You already pay for ChatGPT, or you want jobs running in the cloud while you do something else.'],
          ['Both', 'One builds, the other reviews. Different AIs make different mistakes, so a second opinion catches more bugs.'],
        ] },
        { t: 'prompt', label: 'Second opinion (paste into Codex)', text: `Review the latest changes in this project like a careful senior engineer. Do not change anything.
List: bugs, security problems, and anything that will be hard to maintain.
Sort by how serious they are, and point to the file and line for each.` },
        { t: 'tip', tone: 'info', text: 'Using both? Put your project rules in a file called **AGENTS.md** (Codex reads it). Then make your **CLAUDE.md** file contain just `@AGENTS.md`. Now both AIs follow the same rules and you only maintain one file.' },
        { t: 'deeper', title: 'The Claude Code features you will actually use', blocks: [
          { t: 'table', head: ['Feature', 'What it gives you'], rows: [
            ['CLAUDE.md', 'A file of project rules that is loaded every session, so you never repeat yourself'],
            ['Plan mode', 'Claude researches and writes a plan, but cannot edit anything until you approve it'],
            ['Permissions', 'You approve each file edit and command, or pre-approve the safe ones'],
            ['Subagents', 'Helpers that do big searches without filling up the main conversation'],
            ['MCP', 'Plugs Claude into services like Vercel, Neon and GitHub'],
            ['Hooks', 'Your own scripts that run automatically, like "format the code after every edit"'],
            ['/security-review', 'A built-in security check of your recent changes'],
          ] },
          { t: 'p', text: '`/model` switches between Claude models. Use the strongest one for planning, security and tricky bugs, and a faster one for small edits. Later you will even connect a free model that runs on your own computer.' },
        ] },
        { t: 'check', q: 'What makes Claude Code different from a regular AI chat?', options: [
          'It is free',
          'It works inside your project: it edits files, runs your app and fixes its own errors',
          'It only works on Macs',
        ], answer: 1, explain: 'Claude Code is an "agent": it takes actions in your project and checks the results, instead of just giving you text to copy.' },
        { t: 'recap', items: [
          'Claude Code builds inside your project: writes, runs and fixes code.',
          'You need a Claude Pro plan (or Max if you build every day).',
          'Codex is a good second opinion. Share rules between them with AGENTS.md.',
        ] },
      ],
    },
    {
      id: 'install-claude-code',
      title: 'Install Claude Code (no terminal needed)',
      minutes: 8,
      body: [
        { t: 'why', text: 'This is the only install in the whole course, and you will not type a single command. Claude Code lives inside the free Claude desktop app. Once it is installed, Claude does the technical typing for you for the rest of the course.' },
        { t: 'h', text: 'Step 1: download the Claude app' },
        { t: 'steps', items: [
          { do: 'Go to **claude.com/download** and click the download for your computer (Mac or Windows).', why: 'Only download it from Anthropic\'s own site. Copies on other sites can contain malware.' },
          { do: '**Mac:** open the file you downloaded and drag Claude into your **Applications** folder. **Windows:** open the installer and click through it.' },
          { do: 'Open Claude and sign in with your Claude account.', why: 'Claude Code needs a paid plan (Pro or higher). You can upgrade right inside the app.' },
        ] },
        { t: 'h', text: 'Step 2: open the Code tab' },
        { t: 'steps', items: [
          { do: 'At the top of the Claude app, click **Code**.', why: 'This is Claude Code: the same AI, but working inside a folder on your computer so it can build things.' },
          { do: 'Make a new folder for your project (for example **my-app** in your Documents) and choose it when Claude asks.', why: 'Claude can only touch the folder you give it. Keep each project in its own folder.' },
          { do: 'When Claude asks whether you trust the folder, say **yes**.' },
        ] },
        { t: 'p', text: 'That is it. You now type what you want in plain English, and Claude writes the code, runs it, and fixes errors. Whenever a step needs a command, Claude runs it and asks for your OK first: you just read what it wants to do and click **Allow**.' },
        { t: 'tip', tone: 'safe', text: 'Read before you click Allow. If Claude wants to delete files, touch something outside your project, or use a password, stop and ask it to explain first.' },
        { t: 'deeper', title: 'Prefer the terminal? Install the command-line version', blocks: [
          { t: 'p', text: 'Claude Code also runs in the Terminal, which some people like for speed. Open Terminal (Mac: Cmd + Space, type Terminal) or PowerShell (Windows), paste the line for your computer, then type `claude` in your project folder.' },
          { t: 'cmd', label: 'Mac', text: 'curl -fsSL https://claude.ai/install.sh | bash' },
          { t: 'cmd', label: 'Windows PowerShell', text: 'irm https://claude.ai/install.ps1 | iex' },
          { t: 'p', text: '`curl ... | bash` downloads a script and runs it immediately, which is only safe because the address is Anthropic\'s own. On Windows, Claude Code uses Git for Windows under the hood (`winget install --id Git.Git -e`).' },
          { t: 'snap', src: 'shots/claudecode.jpg', url: 'docs.anthropic.com · Claude Code setup', caption: 'The official setup page, if a command ever changes.' },
        ] },
        { t: 'check', q: 'Do you need to type terminal commands to follow this course?', options: [
          'Yes, every lesson',
          'No: in the Claude app, Claude runs the commands and you approve them',
          'Only on Windows',
        ], answer: 1, explain: 'The Claude desktop app\'s Code tab does the typing. Your job is to describe what you want and read before you click Allow.' },
        { t: 'recap', items: [
          'Download the Claude app from claude.com/download and sign in.',
          'Use the Code tab and give Claude one project folder.',
          'Claude runs commands for you; read, then click Allow.',
        ] },
      ],
    },
    {
      id: 'talk-like-a-pro',
      title: 'Talk to it like a pro',
      minutes: 9,
      body: [
        { t: 'why', text: 'Two people can use the exact same AI and get wildly different results. The difference is almost always how they talk to it. This lesson gives you the one prompt every project should start with, and the habits that make Claude feel ten times smarter.' },
        { t: 'h', text: 'Give your project house rules' },
        { t: 'p', text: 'Claude Code reads a file called **CLAUDE.md** at the start of every session. Whatever you put in it, Claude treats as standing orders. That means you can write your safety rules **once** and every future request follows them, even months from now when you have forgotten.' },
        { t: 'analogy', text: 'CLAUDE.md is like the employee handbook you give a new hire on day one. You do not want to re-explain "we never share customer passwords" every morning. You write it down once, and they follow it.' },
        { t: 'prompt', label: 'Set your house rules (do this first in every project)', text: `Create a file called CLAUDE.md in this project. Put these rules in it, written simply:

1. Explain what you are about to do before you do it, in plain words.
2. Work in small steps. After each step, tell me how to check it works.
3. Never put secret keys in front-end code. Secrets go in .env.local, and .env.local must be listed in .gitignore.
4. Check all user input on the server.
5. Check the user is allowed before reading or changing their data.
6. Use parameterized queries for the database.
7. Never show raw errors to users.
8. Do not add new packages without telling me why.
9. After each working step, commit to git with a clear message.` },
        { t: 'p', text: 'Read that list again. Every rule there prevents a real, common disaster. You will learn what each one means as the course goes on. For now, just know they are working for you in the background.' },
        { t: 'h', text: 'The anatomy of a great request' },
        { t: 'table', head: ['Part', 'Weak', 'Strong'], rows: [
          ['Goal', '"Make a contact form"', '"Make a contact form so customers can ask about catering"'],
          ['Details', '(none)', '"Fields: name, email, message. Email me each submission."'],
          ['Limits', '(none)', '"Max 5 submissions per hour per visitor. No new packages."'],
          ['Done looks like', '(none)', '"Show me it working, and tell me how to test it myself."'],
        ] },
        { t: 'h', text: 'Three moves that change everything' },
        { t: 'steps', items: [
          { do: 'Turn on **plan mode** before big changes (the mode menu next to the message box, or Shift + Tab).', why: 'Claude writes a plan and waits for your OK before touching anything. Fixing a bad plan takes seconds; undoing bad code takes hours.' },
          { do: 'Type **/clear** when you start a new task.', why: 'Claude remembers everything in the current conversation. Old, unrelated chatter makes it slower and more confused. A fresh start keeps it sharp.' },
          { do: 'When you do not understand something, say "Explain this like I am 10, then continue."', why: 'You are allowed to ask. Understanding what it built is how you catch mistakes.' },
        ] },
        { t: 'deeper', title: 'Why context is everything', blocks: [
          { t: 'p', text: 'The model only "knows" what is in its **context window**: your messages, files it has opened, command output. Long, wandering sessions fill that window with stale material, and quality drops. `/clear` resets it, `/compact` summarizes it, and `/context` shows how full it is.' },
          { t: 'p', text: 'Plan mode lets Claude read and research but not edit. You review the plan, push back, then approve. It is code review **before** the code exists, which is when it is cheapest.' },
          { t: 'p', text: 'In an existing project, `/init` makes Claude draft a CLAUDE.md from what it finds. Add your security rules on top of that.' },
        ] },
        { t: 'check', q: 'Why put your rules in CLAUDE.md instead of typing them in each message?', options: [
          'Claude reads CLAUDE.md every session, so the rules always apply without you repeating them',
          'Messages have a word limit',
          'It makes Claude Code cheaper',
        ], answer: 0, explain: 'Write it once, follow it forever. That is how good habits survive long projects.' },
        { t: 'recap', items: [
          'CLAUDE.md holds your project\'s standing orders, including safety rules.',
          'Great requests have a goal, details, limits and a clear "done".',
          'Plan mode first for big changes; /clear between tasks.',
        ] },
      ],
    },
  ],
};
