// Track 2: getting the most out of Claude Code: rules files, long conversations, skills, hooks and helper agents.
export default {
  id: 'claude-pro',
  title: 'Claude Code power user',
  lessons: [
    {
      id: 'claude-md',
      title: 'Rules Claude never forgets (CLAUDE.md)',
      minutes: 11,
      body: [
        { t: 'why', text: 'Every new Claude conversation starts with a blank memory. Pasting your house rules every time works, but pros do it once: a file called **CLAUDE.md** in your project that Claude reads automatically at the start of every session. Write it once, and every session follows it.' },
        { t: 'analogy', text: 'CLAUDE.md is the employee handbook for your AI. A new hire reads it on day one and knows how things are done here, without you repeating it every morning.' },
        { t: 'h', text: 'Make yours in one step' },
        { t: 'steps', items: [
          { do: 'Open your project in the Claude app\'s Code tab and type **/init**.', why: 'Claude reads your project and writes a starting CLAUDE.md: how to run it, how it is organized, the conventions it found.' },
          { do: 'Read what it wrote, then add your house rules (security, tone, "read SPEC.md first").' },
          { do: 'Commit it to GitHub.', why: 'Now every session, on any computer, starts with the same rules.' },
        ] },
        { t: 'prompt', label: 'Upgrade my CLAUDE.md', text: `Read CLAUDE.md, SPEC.md and ARCHITECTURE.md (if they exist). Improve CLAUDE.md so it has:
- One line on what this app is and who it is for.
- How to run, test and deploy it.
- My security rules: secrets only in .env.local and Vercel, never in code or chat; check users are allowed before reading or changing data; parameterized queries only.
- "Read SPEC.md before starting a feature" and "Follow DESIGN.md for all UI" (if those files exist).
- "Commit after each working change with a clear message."
Keep it under 100 lines. Short, specific rules work better than long essays.` },
        { t: 'h', text: 'Where rules can live' },
        { t: 'table', head: ['File', 'Who it applies to', 'Use it for'], rows: [
          ['`CLAUDE.md` (project folder)', 'Everyone working on this project', 'How to run it, project rules. Commit it.'],
          ['`CLAUDE.local.md` (project folder)', 'Just you, just this project', 'Your personal notes and test logins. Keep it out of GitHub.'],
          ['`~/.claude/CLAUDE.md` (your home folder)', 'Just you, every project', 'Your personal style: "explain things simply", "ask before deleting".'],
        ] },
        { t: 'tip', tone: 'info', text: 'CLAUDE.md can point to other files with @, like "See @SPEC.md for the plan." Claude loads them along with it.' },
        { t: 'deeper', title: 'Why short rules beat long ones', blocks: [
          { t: 'p', text: 'CLAUDE.md is loaded into every request, so every line costs a little of your usage and attention. Aim for under about 200 lines. Specific rules ("use the Button component in src/ui") work far better than vague ones ("write clean code").' },
          { t: 'p', text: 'Rules are guidance, not a lock. Claude follows them very consistently, but to **guarantee** something never happens (like editing your .env file), use a hook, covered later in this module.' },
          { t: 'p', text: 'Claude Code also keeps its own "auto memory" of things you correct it on. You can see and edit memory with the /memory command.' },
        ] },
        { t: 'check', q: 'Where should "always explain things in plain English" go if you want it in every project?', options: [
          'The project CLAUDE.md',
          '~/.claude/CLAUDE.md in your home folder',
          'A code comment',
        ], answer: 1, explain: 'Your home-folder CLAUDE.md applies to every project you open.' },
        { t: 'recap', items: [
          '/init writes a starting CLAUDE.md; add your rules and commit it.',
          'Project file for shared rules, local file for personal notes, home file for every project.',
          'Short and specific beats long and vague.',
        ] },
      ],
    },
    {
      id: 'long-conversations',
      title: 'Keep long conversations sharp',
      minutes: 12,
      body: [
        { t: 'why', text: [
          'Ever notice Claude gets slower, forgets an early instruction, or uses up your plan faster as a session goes on? That is the conversation getting long. Every message re-sends the whole history.',
          'Pros manage this on purpose. Four habits keep Claude sharp and your usage low: clear, compact, rewind, and hand side-jobs to helper agents.',
        ] },
        { t: 'analogy', text: 'Claude\'s memory of a conversation is like a whiteboard. It holds a lot, but once it is full of old notes, new work gets cramped. Clearing wipes it; compacting erases the details but keeps a neat summary in the corner.' },
        { t: 'h', text: 'The four habits' },
        { t: 'table', head: ['Type this', 'What it does', 'Use it when'], rows: [
          ['**/clear**', 'Starts fresh with an empty conversation (your files are untouched)', 'You switch to an unrelated task. It is free and the best habit of all.'],
          ['**/compact**', 'Summarizes the conversation so far and continues from the summary', 'You are mid-task and the conversation is long. Add what to keep: "/compact keep the database decisions and open bugs"'],
          ['**/rewind** (or Esc twice)', 'Goes back to an earlier point, undoing the conversation and code after it', 'Claude went down the wrong path'],
          ['**/context**', 'Shows what is filling up the conversation', 'You are curious why it feels slow'],
        ] },
        { t: 'p', text: 'Claude Code also compacts automatically when a conversation gets very long. Compacting yourself, at a good moment and with instructions on what to keep, gives better results than waiting for the automatic one.' },
        { t: 'h', text: 'Hand side-jobs to helper agents' },
        { t: 'p', text: 'Some jobs make a big mess of text: searching the whole project, reading long logs, running all the tests. Ask Claude to do them with a **subagent** (a helper agent). The helper does the messy work in its own separate conversation and hands back only a short summary, so your main conversation stays clean.' },
        { t: 'prompt', label: 'Use a helper agent', text: `Use a subagent to [run all the tests / find every place we handle payments / read the error logs] and report back only a short summary: what you found and what you recommend.
Do not paste the full output into our conversation.` },
        { t: 'h', text: 'Plan first, then build' },
        { t: 'p', text: 'For anything bigger than a small change, switch to **plan mode** first (the mode menu next to the message box, or Shift + Tab). Claude explores and proposes a plan without changing files; you approve it, then it builds. Fixing a plan costs far less than fixing finished code.' },
        { t: 'h', text: 'A good daily rhythm' },
        { t: 'steps', items: [
          { do: 'One task per conversation. Done? Commit, then **/clear**.' },
          { do: 'Long task? **/compact** with what to keep, at a natural break.' },
          { do: 'Big feature? **Plan mode** first.' },
          { do: 'Messy research or test runs? A **helper agent**.' },
          { do: 'Wrong turn? **/rewind** instead of arguing with it.' },
        ] },
        { t: 'deeper', title: 'Why long conversations cost more', blocks: [
          { t: 'p', text: 'Claude Code sends the full conversation with every request. Prompt caching makes re-reading cheaper, but a session that has been open all day still re-reads all of it for a one-line question. /clear costs nothing; /compact itself reads the whole conversation once to summarize it.' },
          { t: 'p', text: 'You can tell Claude what to keep when it compacts by adding a "Compact instructions" section to CLAUDE.md, for example: "When compacting, keep test results and code changes."' },
          { t: 'p', text: 'Run /usage to see what is using your plan, including which subagents and tools.' },
        ] },
        { t: 'check', q: 'You finished a feature and want to start an unrelated one. What is the best move?', options: [
          'Keep going in the same conversation',
          'Commit, then /clear and start fresh',
          '/compact and continue',
        ], answer: 1, explain: 'Unrelated work does not need the old history. /clear is free and keeps Claude sharp.' },
        { t: 'recap', items: [
          '/clear between tasks, /compact during long ones, /rewind to undo a wrong turn.',
          'Helper agents do messy work and return a short summary.',
          'Plan mode first for anything big.',
        ] },
      ],
    },
    {
      id: 'skills',
      title: 'Your own commands and skills',
      minutes: 10,
      body: [
        { t: 'why', text: 'You will notice you keep asking for the same things: "review my changes for security", "write the release notes", "check this page on a phone." A **skill** turns any of those into your own command, like /security-check, that works the same way every time.' },
        { t: 'h', text: 'What a skill is' },
        { t: 'p', text: 'A skill is a small instruction file named **SKILL.md** inside a folder. You can run it by typing its name with a slash, and Claude can also use it on its own when your request matches its description.' },
        { t: 'analogy', text: 'A skill is a recipe card. Instead of explaining how to make your famous lasagna every time, you write it down once, and anyone in the kitchen can follow the card exactly.' },
        { t: 'table', head: ['Where it lives', 'Who can use it'], rows: [
          ['`.claude/skills/NAME/SKILL.md` in your project', 'Everyone on the project (commit it)'],
          ['`~/.claude/skills/NAME/SKILL.md` in your home folder', 'Just you, in every project'],
        ] },
        { t: 'prompt', label: 'Make me a skill', text: `Create a project skill called "ship-check" in .claude/skills/ship-check/SKILL.md.
When I run /ship-check it should:
1. Run the build and the tests.
2. Check for secrets in the code and that .env files are git-ignored.
3. Review my uncommitted changes for security problems.
4. Give me a short go / no-go list.
Give it a clear description so you can also use it on your own when I say I am about to deploy. Then commit it.` },
        { t: 'h', text: 'Good first skills to make' },
        { t: 'steps', items: [
          { do: '**/ship-check**: everything you check before deploying (above).' },
          { do: '**/explain-changes**: summarize what changed today in plain English, for a client or teammate.' },
          { do: '**/mobile-check**: open the app at phone size and list anything broken or cramped.' },
          { do: '**/new-feature**: read SPEC.md, plan the feature, wait for approval, then build on a branch.' },
        ] },
        { t: 'deeper', title: 'Skills vs CLAUDE.md vs commands', blocks: [
          { t: 'p', text: 'CLAUDE.md loads into every request. A skill loads only when it is used, so long checklists and reference material belong in skills, not CLAUDE.md.' },
          { t: 'p', text: 'Older "custom commands" in `.claude/commands/NAME.md` still work and behave the same as skills. New work should use skills, which can also hold extra files (examples, scripts) in their folder.' },
          { t: 'p', text: 'A SKILL.md starts with a short header (frontmatter) such as `description:`, which tells Claude when to use it. You can stop Claude from using a skill on its own with `disable-model-invocation: true`.' },
        ] },
        { t: 'check', q: 'You have a long checklist you only need when deploying. Where should it go?', options: [
          'CLAUDE.md, so it is always loaded',
          'A skill, so it loads only when you deploy',
          'A sticky note',
        ], answer: 1, explain: 'Skills load on demand, keeping every other conversation lighter.' },
        { t: 'recap', items: [
          'A skill is a reusable command: .claude/skills/NAME/SKILL.md.',
          'Ask Claude to write and commit it for you.',
          'Long, occasional instructions belong in skills, not CLAUDE.md.',
        ] },
      ],
    },
    {
      id: 'hooks',
      title: 'Hooks: things that always happen',
      minutes: 11,
      body: [
        { t: 'why', text: 'Rules and skills are things Claude chooses to follow. **Hooks** are different: they are small automatic actions that run every single time something happens, no matter what. They are how pros guarantee things like "never touch the .env file" or "format every file after an edit."' },
        { t: 'analogy', text: 'CLAUDE.md is a sign on the wall that says "please wipe your feet." A hook is a doormat bolted to the floor: you cannot get in without crossing it.' },
        { t: 'h', text: 'When hooks can run' },
        { t: 'table', head: ['Moment (event)', 'Example use'], rows: [
          ['**PreToolUse**: before Claude runs a tool', 'Block edits to .env files or the production database'],
          ['**PostToolUse**: after a tool runs', 'Auto-format every file Claude edits'],
          ['**Notification**: Claude is waiting for you', 'Pop up a desktop notification so you can walk away'],
          ['**Stop**: Claude finishes a reply', 'Run the tests and report failures'],
          ['**SessionStart**: a session begins', 'Remind Claude of today\'s sprint goal'],
        ] },
        { t: 'h', text: 'Add your first two hooks' },
        { t: 'prompt', label: 'Protect my secrets with a hook', text: `Add a Claude Code hook to this project's .claude/settings.json:
- A PreToolUse hook that blocks any edit or write to .env, .env.local or any file with "secret" in the name, and explains why.
Test that it works by trying to edit .env.local (it should be blocked). Then commit it.` },
        { t: 'prompt', label: 'Ping me when Claude needs me', text: `Add a Notification hook to my personal Claude Code settings (~/.claude/settings.json) that shows a desktop notification on this computer when Claude is waiting for my input.
Use the right command for my operating system and test it.` },
        { t: 'p', text: 'Type **/hooks** in Claude Code to see every hook that is active.' },
        { t: 'tip', tone: 'warn', text: 'Hooks run real commands on your computer automatically. Only add hooks you understand, and never copy hooks from strangers without asking Claude to explain them first.' },
        { t: 'deeper', title: 'How hooks are set up', blocks: [
          { t: 'p', text: 'Hooks live in a settings file: `~/.claude/settings.json` (just you), `.claude/settings.json` (the project, committed) or `.claude/settings.local.json` (the project, just you). Each hook names an event, an optional **matcher** (which tool it applies to, like Edit or Bash), and a command to run.' },
          { t: 'p', text: 'A PreToolUse hook can block an action by exiting with a special code, and its message is shown to Claude so it understands why. There are many more events (such as PreCompact and SubagentStop) in the hooks reference.' },
          { t: 'links', items: [{ label: 'Claude Code hooks guide', url: 'https://code.claude.com/docs/en/hooks-guide' }] },
        ] },
        { t: 'check', q: 'You must guarantee Claude never edits .env.local. What do you use?', options: [
          'A line in CLAUDE.md',
          'A PreToolUse hook that blocks it',
          'Asking nicely each time',
        ], answer: 1, explain: 'Rules guide; hooks enforce. A hook runs every time, no exceptions.' },
        { t: 'recap', items: [
          'Hooks are automatic actions that always run at set moments.',
          'Block risky edits before they happen (PreToolUse); format or test after (PostToolUse, Stop).',
          'Only add hooks you understand; check them with /hooks.',
        ] },
      ],
    },
    {
      id: 'helper-agents',
      title: 'Helper agents and parallel work',
      minutes: 11,
      body: [
        { t: 'why', text: 'One Claude is a great developer. A small team of Claudes, each with one job, is a development team: one reviews security, one writes tests, one checks the design, while you stay in charge. This is how solo builders ship like a company.' },
        { t: 'analogy', text: 'Think of a restaurant kitchen. The head chef (your main Claude) runs the line, while the prep cook, the dishwasher and the pastry chef each do one job. Nobody tries to do everything, and the head chef only hears "done" or "we have a problem."' },
        { t: 'h', text: 'Make your own helper agents' },
        { t: 'p', text: 'A custom **subagent** is a saved helper with its own instructions, tools and even its own (cheaper) model. Claude hands it work automatically when the job matches, or when you ask.' },
        { t: 'prompt', label: 'Create a security reviewer', text: `Create a project subagent in .claude/agents/security-reviewer.md.
It reviews code changes for security problems (secrets in code, missing permission checks, unsafe database queries, unchecked user input).
Make it read-only (it can read and search files, but not edit). Use a fast, low-cost model.
It should report problems as a short list with file names and how to fix each one.
Then use it to review my latest changes.` },
        { t: 'h', text: 'Good helpers to have' },
        { t: 'table', head: ['Helper', 'Job', 'Why separate'], rows: [
          ['security-reviewer', 'Checks every change for holes', 'Fresh eyes; read-only so it cannot break anything'],
          ['test-writer', 'Writes and runs tests for new features', 'Test output is long and messy'],
          ['design-checker', 'Compares pages against DESIGN.md', 'Keeps the look consistent'],
          ['researcher', 'Reads docs and summarizes', 'Keeps long docs out of your main conversation'],
        ] },
        { t: 'h', text: 'Work on several things at once' },
        { t: 'steps', items: [
          { do: 'In the Claude app\'s Code tab, start a **separate session** for each independent task (for example, "fix the login bug" and "write the FAQ page").' },
          { do: 'Let each session work on its **own copy** of the project (the app can use a separate worktree for each), so they never trip over each other.', why: 'A worktree is a second working copy of your repo on its own branch.' },
          { do: 'Review each one\'s changes and merge them one at a time with a pull request.' },
        ] },
        { t: 'tip', tone: 'warn', text: 'More agents means more usage. Start with one helper; add more only when a job really repeats.' },
        { t: 'deeper', title: 'How subagents are defined', blocks: [
          { t: 'p', text: 'A subagent is a Markdown file in `.claude/agents/` (project) or `~/.claude/agents/` (you), with a short header: `name`, `description` (when to use it), optional `tools` (what it may use) and `model` (such as haiku for cheap jobs). The text below the header is its instructions.' },
          { t: 'p', text: 'A subagent can work in its own temporary copy of the repo by adding `isolation: worktree` to its header, which is useful when it edits files while you keep working.' },
        ] },
        { t: 'check', q: 'Why make the security reviewer read-only?', options: [
          'It is faster',
          'A reviewer should report problems, not change code without you seeing it',
          'Read-only agents are free',
        ], answer: 1, explain: 'Least privilege applies to agents too: give each one only the power its job needs.' },
        { t: 'recap', items: [
          'Custom subagents are saved helpers with one job each.',
          'Read-only reviewers, cheap models for simple jobs.',
          'Parallel sessions on separate worktrees, merged one at a time.',
        ] },
      ],
    },
  ],
};
