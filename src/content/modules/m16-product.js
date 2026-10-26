// Track 2: product thinking (the "what and why" before the "how"). The Scrum lesson is added to this module in course.js.
export default {
  id: 'product',
  title: 'Product thinking and Scrum',
  lessons: [
    {
      id: 'find-the-problem',
      title: 'Find a problem worth solving',
      minutes: 12,
      body: [
        { t: 'why', text: [
          'You can now build almost anything. That is exactly why most AI-built apps fail: they are built fast and nobody needs them. Product managers at Google and Shopify spend more time on this step than on building.',
          'This lesson gives you the simple version of what they do: find a real problem, prove people have it, and only then build.',
        ] },
        { t: 'h', text: 'Start with a person, not an idea' },
        { t: 'analogy', text: 'Building without talking to customers is like a chef cooking a 10-course meal without asking if anyone is hungry, or allergic to anything. Ask first, then cook.' },
        { t: 'p', text: 'Bad start: "an AI app for restaurants." Good start: "Maria runs a taco truck and loses about an hour every night counting inventory on paper." A specific person with a specific pain is something you can build for, test with, and charge.' },
        { t: 'table', head: ['Weak idea', 'Strong problem'], rows: [
          ['An app for gyms', 'Small gym owners forget to follow up with people who skipped 2 weeks, and lose them'],
          ['AI for real estate', 'Agents spend 30 minutes writing each listing description from their notes'],
          ['A social app for students', 'Study groups cannot agree on a time, so they never meet'],
        ] },
        { t: 'h', text: 'Talk to 5 people (the right way)' },
        { t: 'steps', items: [
          { do: 'Find 5 people who have the problem. Friends of friends, local businesses, people in comments on TikTok.', why: 'Five honest conversations beat a thousand guesses.' },
          { do: 'Ask about the **past**, not the future: "Tell me about the last time this happened. What did you do?"', why: 'People are bad at predicting what they would buy, and good at describing what they already do.' },
          { do: 'Never pitch your idea in the first conversation.', why: 'The moment you pitch, people get polite and stop telling the truth.' },
          { do: 'Listen for money and time: "We pay someone to…", "I stay late to…"', why: 'Problems that already cost money or hours are problems people will pay to fix.' },
        ] },
        { t: 'prompt', label: 'Prepare my interviews', text: `I want to build something for [WHO, e.g. "taco truck owners"] who struggle with [PROBLEM].
1. Write 8 interview questions about their past behavior, not my idea (no "would you use…" questions).
2. Write a short, friendly message I can send to ask for a 15-minute chat.
3. Make a simple note template for each interview: what they do today, what it costs them (time/money), exact quotes.` },
        { t: 'prompt', label: 'Make sense of my interviews', text: `Here are my notes from [NUMBER] interviews: [PASTE NOTES, with names removed].
Find the problems that came up more than once, rank them by how much time or money they cost, and quote the exact words people used.
Tell me honestly if the evidence is weak.` },
        { t: 'tip', tone: 'safe', text: 'Remove names, phone numbers and anything private from your notes before pasting them into any AI tool. Use "Owner A" and "Owner B" instead.' },
        { t: 'deeper', title: 'Jobs to be done, and the Mom Test', blocks: [
          { t: 'p', text: '**Jobs to be done** means describing what the customer is trying to get done, not your feature: "help me know what to reorder before Friday" rather than "inventory dashboard." Features change; the job stays the same.' },
          { t: 'p', text: 'Rob Fitzpatrick\'s book *The Mom Test* is the classic guide to these conversations: talk about their life, ask about specifics in the past, and talk less than they do.' },
        ] },
        { t: 'check', q: 'Which interview question gets the most honest answer?', options: [
          '"Would you use an app that does this?"',
          '"Tell me about the last time this happened. What did you do?"',
          '"How much would you pay for my idea?"',
        ], answer: 1, explain: 'Questions about real past events get facts. Questions about the future get polite guesses.' },
        { t: 'recap', items: [
          'Start with a specific person and a specific pain.',
          'Talk to 5 people about what they already do; do not pitch.',
          'Problems that already cost time or money are the ones worth solving.',
        ] },
      ],
    },
    {
      id: 'write-the-spec',
      title: 'Write a one-page spec with Claude',
      minutes: 11,
      body: [
        { t: 'why', text: 'A spec (specification) is a one-page plan of what you are building and why. It is the single best way to get better results from Claude: an AI that knows the goal, the user and the limits builds the right thing on the first try instead of the third.' },
        { t: 'analogy', text: 'A spec is the blueprint for a house. Builders can lay bricks fast, but without a blueprint you might get a beautiful kitchen with no door. Claude is a very fast builder; the spec is what keeps it building the right house.' },
        { t: 'h', text: 'The one-page spec' },
        { t: 'table', head: ['Section', 'What goes in it'], rows: [
          ['Problem', 'Who has it and what it costs them, in their words'],
          ['Goal', 'What will be true when this works, as a number if possible ("count inventory in 10 minutes, not 60")'],
          ['Users', 'Who uses it, on what device, how tech-savvy'],
          ['Must have (MVP)', 'The smallest set of features that solves the problem'],
          ['Not now', 'Good ideas you are deliberately leaving for later'],
          ['Risks', 'What could go wrong: data, money, privacy, time'],
        ] },
        { t: 'p', text: '**MVP** means minimum viable product: the smallest thing a real customer would actually use. Not a demo, not the dream version.' },
        { t: 'prompt', label: 'Write my spec', text: `Interview me to write a one-page product spec. Ask me one question at a time.
Sections: Problem, Goal (with a number), Users, Must have (MVP), Not now, Risks.
Push back if my "Must have" list is too long for a first version: suggest what to move to "Not now".
When we are done, save it as SPEC.md in this project and keep it updated as we build.` },
        { t: 'tip', tone: 'info', text: 'Put "Read SPEC.md before starting any feature" in your CLAUDE.md rules file. Claude will then check every task against the plan (the Claude Code power-user module shows how).' },
        { t: 'h', text: 'Turn the spec into user stories' },
        { t: 'p', text: 'A **user story** is one small feature written from the user\'s side: "As a truck owner, I want to scan a shelf with my phone, so that I do not count by hand." Each story becomes one task Claude can build and you can test.' },
        { t: 'prompt', label: 'Spec to user stories', text: `Read SPEC.md. Turn the "Must have" section into user stories ("As a…, I want…, so that…").
Give each one 2-3 acceptance criteria I can check myself when it is done.
Then create them as GitHub Issues in this repo with the label "mvp".` },
        { t: 'check', q: 'What belongs in the "Not now" section?', options: [
          'Bugs',
          'Good ideas you are deliberately leaving out of the first version',
          'Features you already built',
        ], answer: 1, explain: 'Writing them down lets you say no today without losing the idea.' },
        { t: 'recap', items: [
          'A one-page spec: problem, goal, users, MVP, not now, risks.',
          'Claude builds better when it can read the plan (SPEC.md).',
          'User stories with acceptance criteria become your task list.',
        ] },
      ],
    },
    {
      id: 'prioritize',
      title: 'Decide what to build first',
      minutes: 9,
      body: [
        { t: 'why', text: 'You will always have more ideas than time. Prioritizing is the skill of saying "not yet" to good ideas so the important ones actually ship. It is most of a product manager\'s job.' },
        { t: 'analogy', text: 'Prioritizing is packing a carry-on bag. Everything you own might be useful, but only so much fits. You pack what you truly need for this trip, and the rest waits at home for the next one.' },
        { t: 'h', text: 'Two simple methods' },
        { t: 'table', head: ['Method', 'How it works', 'Use it when'], rows: [
          ['**MoSCoW**', 'Sort every idea into Must, Should, Could, Won\'t (this time)', 'Planning your first version'],
          ['**RICE**', 'Score = Reach × Impact × Confidence ÷ Effort', 'Choosing between many features later'],
        ] },
        { t: 'p', text: 'RICE in plain words: how many people it helps, how much it helps them, how sure you are, divided by how long it takes. High score goes first.' },
        { t: 'prompt', label: 'Prioritize my list', text: `Here is my feature list: [PASTE LIST or "read the GitHub Issues"].
1. Sort it with MoSCoW for my first release.
2. For the Should and Could items, score each with RICE in a table, explaining your guesses.
3. Recommend the next 3 things to build and why. Be blunt about anything that is a distraction.` },
        { t: 'tip', tone: 'warn', text: 'The most dangerous feature is the one only you want. If no customer asked for it, it goes in "Could" at best.' },
        { t: 'check', q: 'A feature helps every user a lot but takes a month. Another helps half your users a little and takes an hour. What does RICE tell you?', options: [
          'Always do the big one',
          'Score both; the quick one may win because effort divides the score',
          'Skip both',
        ], answer: 1, explain: 'Effort is in the denominator. Quick wins often come first, then the big bet.' },
        { t: 'recap', items: [
          'MoSCoW for the first version; RICE for choosing later.',
          'Let Claude score the list, but you make the call.',
          'If no customer asked for it, it waits.',
        ] },
      ],
    },
  ],
};
