export default {
  id: 'save-money',
  title: 'Power tools on a budget',
  advanced: true,
  lessons: [
    {
      id: 'token-plans',
      title: 'Stop burning tokens',
      minutes: 10,
      body: [
        { t: 'why', text: 'Sooner or later you will hit "you have reached your limit" in the middle of a great session, or open a surprise bill for an AI key. Both come from the same thing: not understanding how AI usage is counted. Once you see it, you can make your plan last two or three times longer.' },
        { t: 'p', text: 'AI is measured in **tokens**. A token is a chunk of text, roughly three-quarters of a word. Everything you send to the AI and everything it sends back is counted in tokens.' },
        { t: 'h', text: 'The hidden cost: the AI re-reads the whole conversation' },
        { t: 'p', text: 'Here is the part that surprises everyone. Every time you send a new message, the AI reads the **entire conversation so far** again: every message, every file it opened, every error it saw. So message 50 in a long session costs far more than message 1, even if you only typed "ok, next."' },
        { t: 'analogy', text: 'Imagine a friend with no memory who helps you, but before answering each question they reread every text you have ever sent them. Short, fresh conversations keep them fast. A three-hour chat means they are rereading a novel before every reply.' },
        { t: 'h', text: 'Two ways to pay' },
        { t: 'table', head: ['Way to pay', 'How it works', 'Best for'], rows: [
          ['Claude Pro or Max plan', 'Flat monthly price. A usage limit that resets every few hours.', 'Building with Claude Code. No surprise bills.'],
          ['API key (pay per token)', 'You pay for every token. No limit.', 'Apps you build for customers, like a chatbot.'],
        ] },
        { t: 'tip', tone: 'safe', text: 'Build with your Claude plan. Only use an API key inside apps you make for other people, and always set a monthly spending limit on it in the Anthropic Console.' },
        { t: 'h', text: 'Make your limit last longer' },
        { t: 'steps', items: [
          { do: 'Type **/clear** when you start a new task.', why: 'Stops the AI rereading everything from the last task.' },
          { do: 'Keep rules in **CLAUDE.md** instead of retyping them.' },
          { do: 'Paste the last 30 lines of an error, not 3,000.', why: 'The useful part of an error is almost always at the end.' },
          { do: 'Use **plan mode** before big changes.', why: 'A plan is a few hundred tokens. Undoing a wrong approach can be tens of thousands.' },
          { do: 'Use **/model** to switch: the strongest model for hard problems, a faster one for small edits.' },
          { do: 'Type **/context** to see how full the conversation is. Nearly full? **/compact** or **/clear**.' },
        ] },
        { t: 'deeper', title: 'How the cost really adds up', blocks: [
          { t: 'p', text: 'Cost per request = (input tokens × input price) + (output tokens × output price). In an agent loop, every turn re-sends the conversation, so long sessions grow cost quickly. **Prompt caching** discounts repeated beginnings of a conversation, but the biggest lever is still keeping context small and focused.' },
          { t: 'steps', items: [
            '**Subagents** do big searches in their own context and return only the answer.',
            '**Model routing:** strongest model for architecture, security and gnarly bugs; faster model for routine edits; a local model (next lesson) for private or bulk work.',
            '**Spend limits and alerts** on every API key, set before you need them.',
          ] },
        ] },
        { t: 'check', q: 'Why does message 50 in a long session cost more than message 1?', options: [
          'Later messages are taxed',
          'The AI rereads the whole conversation every time, which keeps growing',
          'It does not; every message costs the same',
        ], answer: 1, explain: 'Every turn includes everything before it. Fresh sessions with /clear keep costs and confusion down.' },
        { t: 'recap', items: [
          'Tokens are chunks of text; both directions count.',
          'Each message re-sends the whole conversation, so keep sessions focused.',
          'Plans for building, API keys (with limits) for customer-facing apps.',
        ] },
      ],
    },
    {
      id: 'local-ai',
      title: 'Free AI on your own computer (Qwen)',
      minutes: 12,
      body: [
        { t: 'why', text: 'What if some of your AI work cost nothing, worked without internet, and never sent a single word to anyone else\'s servers? That is local AI. It is not as smart as Claude, but for private documents, bulk jobs and simple tasks, it is a superpower.' },
        { t: 'p', text: '**Local AI** means the AI model runs on your own computer instead of in a company\'s data center. You download the model once, like downloading a big game, and then it is yours. No bill, no limit, and your data never leaves your machine.' },
        { t: 'p', text: 'We use **Qwen**, a free, open AI model family from Alibaba that is especially good at code and chat. To run it, we use **Ollama**, a free app that makes running local models as easy as one command.' },
        { t: 'h', text: 'Step 1: install Ollama' },
        { t: 'snap', src: 'shots/ollama.jpg', url: 'ollama.com/download', caption: 'Download Ollama for your computer' },
        { t: 'steps', items: [
          { do: 'Go to **ollama.com**, download it, and open it once.', why: 'It runs quietly in the background, ready to serve models.' },
          { do: 'Open Terminal and run the command below.', why: 'The first time, it downloads the model (a few gigabytes), then opens a chat.' },
        ] },
        { t: 'cmd', label: 'Chat with Qwen', text: 'ollama run qwen3' },
        { t: 'h', text: 'Which Qwen fits your computer' },
        { t: 'p', text: 'Bigger models are smarter but need more memory (RAM). Pick the biggest one your computer can comfortably run:' },
        { t: 'table', head: ['Your computer\'s memory', 'Try this model', 'What to expect'], rows: [
          ['8 GB', 'qwen3:4b', 'Quick, good for summaries and simple questions'],
          ['16 GB', 'qwen3:8b', 'Solid all-rounder'],
          ['32 GB or more', 'qwen3-coder', 'Best for code; noticeably smarter'],
        ] },
        { t: 'h', text: 'Step 2: use Qwen inside Claude Code' },
        { t: 'p', text: 'Here is the cool part: Claude Code can use Qwen as its brain. That is great for private projects, or when your Claude plan limit runs out mid-session. The exact setup changes as Ollama updates, so let Claude look up the current instructions:' },
        { t: 'prompt', label: 'Hook Claude Code to Qwen', text: `Help me run Claude Code with a local Qwen model through Ollama.
1. Check my Ollama version and update it if needed.
2. Look up Ollama's current official instructions for using it with Claude Code, and follow them.
3. Pick the biggest Qwen model my computer can run well (check my RAM), and give it a large enough context window for Claude Code.
4. Give me two short commands: one to start Claude Code with Qwen, one with normal Claude.` },
        { t: 'tip', tone: 'info', text: 'A local model on a laptop is slower and less clever than Claude. Use it for simple, private or high-volume jobs. Keep Claude for building and hard problems.' },
        { t: 'deeper', title: 'How local models fit in, and the gotchas', blocks: [
          { t: 'p', text: 'Ollama and LM Studio download **quantized** models (compressed to about 4 to 8 bits per number) so they fit in normal computer memory with only a small loss in quality. Most Qwen models use the Apache-2.0 license, which allows commercial use.' },
          { t: 'p', text: 'Recent Ollama versions speak the same language (API) as Claude, so Claude Code can connect by pointing `ANTHROPIC_BASE_URL` at your local Ollama. Claude Code needs a big context window, so the model\'s `num_ctx` must be raised (64K or more); Ollama\'s default is much smaller.' },
          { t: 'steps', items: [
            'Private data: client documents and invoices you cannot send to a cloud service.',
            'Bulk work: sorting, tagging or summarizing thousands of items for free.',
            'Your final project\'s relay: a local model drafting replies on a business owner\'s own computer.',
          ] },
          { t: 'tip', tone: 'warn', text: 'Some Ollama model tags actually run in the cloud. If privacy is why you went local, check the model page says it runs on your machine.' },
        ] },
        { t: 'check', q: 'What is the main advantage of running Qwen locally?', options: [
          'It is smarter than Claude',
          'It is free to use and your data never leaves your computer',
          'It needs no memory',
        ], answer: 1, explain: 'Local means no per-token bill and full privacy. The trade-off is speed and smarts.' },
        { t: 'recap', items: [
          'Local AI runs on your computer: free, private, offline.',
          'Ollama runs Qwen with one command; pick a size that fits your RAM.',
          'Claude Code can use Qwen for private work or when your plan runs out.',
        ] },
      ],
    },
    {
      id: 'cheaper-creative',
      title: 'Open-source art and video tools',
      minutes: 10,
      body: [
        { t: 'why', text: 'Your app, your TikToks and your ads all need images and video. Paid creative apps are convenient, but you are often paying a markup on the exact same AI models you could reach directly, or even run for free. These open-source tools give you professional results without the monthly bill.' },
        { t: 'p', text: '**Open source** means the program\'s code is public and free to use. Many are as good as paid apps, built by communities and small teams.' },
        { t: 'table', head: ['Tool', 'What it is', 'Cost'], rows: [
          ['ArtCraft', 'A free creative suite for AI images and video, with 3D scenes and character posing. Connect your own AI accounts.', 'Free app; you pay the AI services you connect'],
          ['Open Generative AI', 'One studio for hundreds of image, video and lip-sync AI models', 'Free app; generation is paid per picture through its AI service'],
          ['ComfyUI', 'Build your own AI art machine by connecting blocks', 'Free forever if your computer is strong enough'],
          ['Krita + AI Diffusion', 'A free painting app with an AI helper', 'Free'],
          ['Upscayl', 'Makes small pictures big and sharp', 'Free'],
          ['GIMP / Inkscape / Blender', 'Photo editing, logos and 3D', 'Free'],
        ] },
        { t: 'links', items: [
          { label: 'ArtCraft', url: 'https://github.com/storytold/artcraft', note: 'Open-source Adobe-style suite' },
          { label: 'Open Generative AI', url: 'https://github.com/Anil-matcha/Open-Generative-AI', note: 'Image, video and lip-sync studio' },
          { label: 'ComfyUI', url: 'https://www.comfy.org', note: 'Node-based AI image and video' },
          { label: 'Upscayl', url: 'https://github.com/upscayl/upscayl', note: 'Free image upscaler' },
        ] },
        { t: 'h', text: 'Why these can be so much cheaper' },
        { t: 'p', text: 'Most AI video apps you see advertised are a nice front end on top of the same handful of AI models (Kling, Veo, Seedance and others). You pay for the convenience of their interface. Open tools let you use the same models and pay the model maker directly, or skip them entirely and run open models on your own computer.' },
        { t: 'tip', tone: 'warn', text: '"Free app" does not always mean free pictures: some tools still send work to a paid AI service. And always check you are allowed to use the results for business. Some models and free plans forbid commercial use.' },
        { t: 'prompt', label: 'Pick the right tool for your job', text: `I want to make [WHAT: e.g. 20 product videos a month, 9:16, 5 seconds each] for [WHO].
My computer: [Mac/PC, how much RAM, graphics card if you know].
Compare ArtCraft, Open Generative AI, ComfyUI, and paying per use (fal.ai, Replicate) for this job.
Make a table: cost per month, quality, how hard to set up, can I use it for business. Recommend one and give me setup steps.` },
        { t: 'deeper', title: 'Where each tool runs, and licensing', blocks: [
          { t: 'table', head: ['Tool', 'Runs where', 'License / cost'], rows: [
            ['ArtCraft (storytold/artcraft)', 'Desktop app (Rust), local; calls your own provider keys', 'Open source; you pay the providers you connect'],
            ['Open Generative AI (Anil-matcha)', 'Web, desktop or self-hosted interface', 'MIT interface; generation goes through Muapi, which needs a key'],
            ['ComfyUI', 'Fully local (a strong NVIDIA graphics card or a high-memory Apple Silicon Mac)', 'GPL-3.0; free apart from hardware and power'],
            ['fal.ai / Replicate', 'Cloud API', 'Pay per output; great inside your own apps'],
          ] },
          { t: 'p', text: 'Licensing is per **model**, not just per tool. Some open image and video models restrict commercial use or require credit; providers also have rules on likeness and content. Check both before selling output or using it in ads.' },
        ] },
        { t: 'check', q: 'An AI art app is free to download. Does that mean every image you make is free to use in ads?', options: [
          'Yes, free app means free images',
          'Not necessarily: generation may be paid, and the model or plan may forbid business use',
          'Only on weekends',
        ], answer: 1, explain: 'Check two things: who pays for the generation, and what the license allows.' },
        { t: 'recap', items: [
          'Open-source tools reach the same AI models with less markup, or run free locally.',
          'ArtCraft and Open Generative AI for AI media; ComfyUI for fully local.',
          'Always check generation costs and commercial-use licenses.',
        ] },
      ],
    },
  ],
};
