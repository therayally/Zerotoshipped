import { SAFE } from '../safe';

export default {
  id: 'capstone',
  title: 'Final project: a real customer',
  advanced: true,
  lessons: [
    {
      id: 'capstone-plan',
      title: 'Find a customer and plan it',
      minutes: 12,
      body: [
        { t: 'why', text: 'Everything you have learned comes together here. You are going to build a real tool for a real local business: a **website chat** that answers customers and hands tricky questions to the owner, plus a **phone receptionist** that answers calls. When you finish, you will have something most "AI agencies" charge thousands for, and a case study to land your next customer.' },
        { t: 'h', text: 'Find your first customer' },
        { t: 'steps', items: [
          { do: 'Pick a local business you already know: a restaurant, salon, gym, repair shop.', why: 'A warm introduction beats a cold pitch every time.' },
          { do: 'Ask the owner: "What questions do customers ask you twenty times a day?"', why: 'Those questions become your chatbot\'s knowledge.' },
          { do: 'Ask: "How many calls do you miss in a week?"', why: 'Missed calls are missed money. That number sells the receptionist.' },
          { do: 'Offer a free or cheap test version.', why: 'Your first customer is about learning and a testimonial, not profit.' },
        ] },
        { t: 'h', text: 'Plan it like a pro' },
        { t: 'prompt', label: 'Plan the project', text: `I am building an AI chat and phone receptionist for a [TYPE OF BUSINESS] called [NAME].
Their top customer questions are: [LIST].
They miss about [NUMBER] calls a week.
Do not code yet. Create:
1. BACKLOG.md with user stories for the owner, their staff, and their customers.
2. ARCHITECTURE.md: website chat widget, a message queue in Postgres, a relay that runs on the owner's computer, a voice receptionist, and an admin page for the owner.
3. SPRINTS.md: 3 one-week sprints. Sprint 1 must be something the owner can try.
4. A simple one-page proposal I can show the owner: what it does, what it costs them each month, and what they need to give me.
Security goes inside every sprint.` },
        { t: 'tip', tone: 'warn', text: 'The business owns its own accounts: domain, Stripe, phone number, email. You get **invited as a helper**. Never put their bills on your card or keep their passwords in your notes. When the project ends, they can remove you and keep everything.' },
        { t: 'deeper', title: 'Treat it like real client work', blocks: [
          { t: 'p', text: 'Most first client projects fail on scope, not code. Write down what is **out** of scope as clearly as what is in. (For real contracts, talk to a lawyer; this is not legal advice.)' },
          { t: 'steps', items: [
            'Deliverables, each with a simple acceptance test.',
            'Who owns the code, data and accounts (usually the client).',
            'Monthly running costs and who pays them: hosting, AI usage, phone minutes, email.',
            'Support: how fast you respond, and what counts as a fix versus a new feature.',
            'Data: what customer information is stored, and for how long.',
          ] },
          { t: 'p', text: 'Small-business AI tools are usually priced as a setup fee plus a monthly fee that covers running costs, monitoring and small changes.' },
        ] },
        { t: 'check', q: 'Whose name should the business\'s domain, Stripe and phone accounts be in?', options: [
          'Yours, so you can manage them',
          'The business\'s, with you invited as a helper',
          'It does not matter',
        ], answer: 1, explain: 'They own their business. You get access they can take away, which protects both of you.' },
        { t: 'recap', items: [
          'Start with a business you know and the questions they hear all day.',
          'Plan with a backlog, architecture, sprints and a one-page proposal.',
          'The client owns every account; you are an invited helper.',
        ] },
      ],
    },
    {
      id: 'chat-relay',
      title: 'Build a website chat with a relay',
      minutes: 18,
      figure: 'relay',
      body: [
        { t: 'why', text: 'This is the clever part of the project, and it is how professional AI tools connect cloud apps to private computers. The website never holds the business\'s AI keys or private files. Instead, a small helper program on the **owner\'s own computer** (the relay) picks up questions, answers them, and sends the answers back.' },
        { t: 'h', text: 'How a message travels' },
        { t: 'steps', items: [
          { do: 'A customer types a question in the chat on the website.' },
          { do: 'The website saves it in a waiting list in the database (the **queue**).' },
          { do: 'The relay on the owner\'s computer checks the queue every few seconds.', why: 'It reaches **out** to the website. Nothing on the internet ever reaches **in** to the owner\'s computer.' },
          { do: 'Easy question? The AI answers it from the business\'s facts.' },
          { do: 'Hard question, upset customer, or anything about money? The owner gets a text and answers personally.' },
          { do: 'The answer goes back into the queue, and the website chat shows it.' },
        ] },
        { t: 'analogy', text: 'It is like a restaurant\'s order ticket rail. Waiters (the website) clip orders onto the rail. The cook (the relay) grabs tickets, makes the food, and puts the plates out. The cook never has to leave the kitchen, and customers never walk into it.' },
        { t: 'tip', tone: 'safe', text: 'Why a relay? Private data can stay on the owner\'s machine, the AI can even be a free local Qwen model, and the owner\'s computer is never exposed to the internet.' },
        { t: 'h', text: 'Sprint 1: the website side' },
        { t: 'prompt', label: 'Build the website side', text: `Build the website side of a chat relay in my Next.js app:
1. A chat bubble component customers can open on any page. Clean, matches my design tokens, works on phones.
2. Tables: conversations and messages (who, text, status: waiting, answered, needs_owner).
3. POST /api/chat: saves the customer message as "waiting". Rate limit 20 messages per hour per visitor.
4. GET /api/chat/[id]: the widget checks for new answers every 3 seconds.
5. Relay endpoints, protected by a relay API key stored hashed in the database:
   - GET /api/relay/inbox: returns waiting messages and marks them "claimed" so they are not answered twice
   - POST /api/relay/reply: saves an answer, or marks it needs_owner
6. Log every relay call.` + SAFE },
        { t: 'p', text: '"Claimed" matters: if two copies of the relay ever run, marking a message as claimed stops both from answering the same customer.' },
        { t: 'h', text: 'Sprint 2: the relay on the owner\'s computer' },
        { t: 'prompt', label: 'Build the relay', text: `Write relay.mjs, a small Node.js program that runs on the business owner's computer:
1. Every 5 seconds, GET /api/relay/inbox with the relay API key (read from an environment variable, never in the code).
2. For each message, answer using ONLY the facts in knowledge.md. Use the Claude API, or a local Qwen model through Ollama if USE_LOCAL=1.
3. If the answer is not in knowledge.md, or the customer is upset, or asks about money or a complaint: mark it needs_owner and send the owner a Telegram message.
4. POST the reply back.
5. Install it as a background service that starts when the computer turns on (launchd on Mac, Task Scheduler on Windows), with logs in a file.
6. If the internet drops, wait and try again. Never crash.` },
        { t: 'deeper', title: 'Design details that make a relay reliable', blocks: [
          { t: 'steps', items: [
            '**Atomic claiming:** move messages from `waiting` to `claimed` in one database statement (`UPDATE ... WHERE status = \'waiting\' RETURNING`), with a timeout so a crashed relay\'s work is retried.',
            '**Relay keys:** long, random, stored hashed, scoped to one business, and revocable from the owner\'s admin page.',
            '**Grounding:** answer only from the knowledge file; escalation rules live in code, not the prompt.',
            '**Prompt injection:** customer text is untrusted. The relay\'s AI has no tools that change data; only the server applies replies.',
            '**Latency:** checking every 3 to 5 seconds feels live for chat. Real-time connections are an upgrade, not a requirement.',
            '**Heartbeat:** alert if the relay has not checked in for 5 minutes (the owner\'s computer is probably off).',
          ] },
        ] },
        { t: 'check', q: 'Why does the relay reach out to the website instead of the website reaching in to the owner\'s computer?', options: [
          'It is faster',
          'So the owner\'s computer is never exposed to the internet',
          'Websites cannot send messages',
        ], answer: 1, explain: 'Outbound-only means no open doors on the owner\'s machine. It is the safest way to connect a cloud app to a private computer.' },
        { t: 'recap', items: [
          'Website saves questions to a queue; the relay pulls, answers and pushes back.',
          'Hard questions go to the owner\'s phone.',
          'Claim messages, hash relay keys, and alert if the relay goes quiet.',
        ] },
      ],
    },
    {
      id: 'voice-receptionist',
      title: 'Add the voice receptionist',
      minutes: 14,
      body: [
        { t: 'why', text: 'Small businesses miss calls constantly: during the lunch rush, after hours, while helping someone in person. Each missed call is a missed booking. An AI receptionist answers every call, handles the common questions with the same facts as your chat, and books appointments, then texts the owner a summary.' },
        { t: 'snap', src: 'shots/elevenlabs.jpg', url: 'elevenlabs.io', caption: 'ElevenLabs: realistic AI voices and voice agents, the voice for your receptionist.' },
        { t: 'p', text: 'You do not build the phone technology yourself. A **voice AI service** gives you a phone number and handles listening and speaking. Your job is to give it the business\'s knowledge and connect it to your app so it can check times and book.' },
        { t: 'table', head: ['Service', 'Good for'], rows: [
          ['Vapi', 'Lots of control, works with many AI models'],
          ['Retell AI', 'Simple setup, good for businesses'],
          ['ElevenLabs Agents', 'Very natural voices'],
        ] },
        { t: 'h', text: 'How a call works' },
        { t: 'steps', items: [
          { do: 'A customer calls the number. The voice service answers and turns their speech into text.' },
          { do: 'The AI decides what to say, using the business\'s facts.' },
          { do: 'If it needs to check times or book, it calls **your app** through a webhook.', why: 'Your app stays the boss of the real schedule, so the AI cannot double-book.' },
          { do: 'It speaks the answer back in a natural voice.' },
          { do: 'After the call, your app saves a summary and texts the owner.' },
        ] },
        { t: 'prompt', label: 'Build the receptionist', text: `Add an AI phone receptionist for [BUSINESS] using [Vapi / Retell / ElevenLabs].
1. Write the receptionist's instructions: greeting (say it is an AI and the call may be recorded), the questions it answers from knowledge.md, when it takes a message, and when it transfers to a human.
2. Build webhook endpoints it can call: check_availability and book_appointment. Verify the provider's signature on every request. Treat every value as untrusted.
3. After each call, save a short summary and the caller's phone number to the database, and send the owner a Telegram message for messages and bookings.
4. Never save card numbers or health details.
5. If my app is down, the receptionist should take a message instead of failing.` + SAFE },
        { t: 'tip', tone: 'warn', text: 'Always tell callers they are talking to an AI and that the call may be recorded. Recording laws differ by state and country, and some places require everyone on the call to agree.' },
        { t: 'deeper', title: 'Voice pipelines and the compliance basics', blocks: [
          { t: 'p', text: 'A voice agent is a real-time pipeline: telephony (a phone number and a bridge to the phone network), speech-to-text, the AI with tools, and text-to-speech, tuned for speed with turn-taking and interruption handling. Platforms package that pipeline; newer speech-to-speech models collapse it into one step.' },
          { t: 'steps', items: [
            'Keep business rules (hours, who can be booked) in your code and database, not in the voice prompt.',
            'Share one knowledge source between chat and voice so answers never disagree.',
            'Send call summaries to the same owner inbox as chat escalations.',
            'Always provide a human handoff and a voicemail fallback.',
          ] },
          { t: 'p', text: 'Outbound AI calls fall under robocall rules (in the US the FCC treats AI-generated voices as "artificial" under the TCPA). Health or payment details on calls bring HIPAA or PCI into scope. Get advice before handling those.' },
        ] },
        { t: 'check', q: 'Why should the receptionist check availability through your app instead of the AI deciding?', options: [
          'It sounds more professional',
          'Your app holds the real schedule, so nothing gets double-booked',
          'The AI cannot count',
        ], answer: 1, explain: 'The AI talks; your app decides. Real rules live in code and data.' },
        { t: 'recap', items: [
          'Voice services handle the phone; you provide knowledge and webhooks.',
          'Your app owns the schedule and verifies every webhook.',
          'Tell callers it is AI and may be recorded; offer a human handoff.',
        ] },
      ],
    },
    {
      id: 'capstone-handover',
      title: 'Launch it and hand it over',
      minutes: 10,
      body: [
        { t: 'why', text: 'A project is not finished when the code works. It is finished when the owner can use it without calling you, you find out about problems before they do, and you have a story to win the next client. This last lesson makes sure all three happen.' },
        { t: 'h', text: 'Before launch' },
        { t: 'steps', items: [
          { do: 'Run **/security-review** and your OWASP prompt. Fix anything serious.' },
          { do: 'Run the UI polish audit.', why: 'It is their brand now. It has to look right on their customers\' phones.' },
          { do: 'Test twenty real questions with the owner watching.', why: 'They will instantly spot wrong answers you would never notice.' },
          { do: 'Give the owner an admin page: see chats, answer escalations, edit the business facts, and **pause the AI** with one button.', why: 'A kill switch builds trust. They are in control.' },
          { do: 'Set up alerts so **you** know when something breaks before they do.' },
        ] },
        { t: 'prompt', label: 'Handover pack', text: `Prepare the handover for [BUSINESS]:
1. OWNER-GUIDE.md in very simple words: how to read chats, answer escalations, edit knowledge.md, pause the AI, and who to call.
2. A checklist of every account the business owns (domain, hosting, database, Stripe, phone number, email) and confirm I am only an invited helper on each.
3. Monthly cost estimate for their usage.
4. A launch-day checklist and a 1-week check-in list.
Run /security-review one more time and summarize anything still open.` },
        { t: 'h', text: 'After launch' },
        { t: 'p', text: 'Check in after one week. Look at the questions the bot could not answer and add them to the knowledge file. Then, with the owner\'s permission, write a short case study: the problem, what you built, and the results (calls answered, hours saved). It is the single best way to land your next customer.' },
        { t: 'tip', tone: 'safe', text: 'You did it. You went from zero to shipping a real product for a real business. That is the whole game. Now do it again, a little better each time.' },
        { t: 'deeper', title: 'Production readiness for client work', blocks: [
          { t: 'steps', items: [
            '**Kill switch:** the owner can pause AI replies instantly; messages wait for a human.',
            '**Monitoring:** relay heartbeat, webhook failures, error rate and AI spend, each with an alert.',
            '**Data retention:** delete old transcripts on the schedule you agreed with the client.',
            '**Access:** the client owns every account; you hold invitations they can remove.',
            '**Runbook:** how to restart the relay, rotate keys, restore the database and roll back a deploy.',
          ] },
        ] },
        { t: 'check', q: 'Why give the owner a one-button "pause the AI" switch?', options: [
          'It is required by law',
          'It keeps them in control and lets humans take over instantly if something goes wrong',
          'It saves money',
        ], answer: 1, explain: 'People trust systems they can stop. A kill switch turns a scary AI into a tool they control.' },
        { t: 'recap', items: [
          'Security review, polish audit and a real test with the owner.',
          'Owner guide, account checklist, kill switch and alerts.',
          'Check in after a week, then turn it into a case study.',
        ] },
      ],
    },
  ],
};
