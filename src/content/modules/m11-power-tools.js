import { addKey } from '../safe';

export default {
  id: 'save-money',
  title: 'Optimize and local AI',
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
        { t: 'prompt', label: 'Help me spend fewer tokens', text: `Help me use fewer tokens in this project:
1. Look at CLAUDE.md and make it short and clear; move long background notes into separate files you read only when needed.
2. Tell me when to use /clear, /compact and plan mode, in plain words.
3. Suggest which model to use for small jobs versus big ones.
4. Give me a 5-line checklist I can follow every day.` },
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
      minutes: 18,
      figure: 'vram',
      body: [
        { t: 'why', text: [
          'What if some of your AI work cost nothing, worked without internet, and never sent a single word to anyone else\'s servers? That is local AI. It is not as smart as Claude, but for private documents, bulk jobs and simple tasks, it is a superpower.',
          'There is one catch nobody tells beginners: whether local AI feels fast or painfully slow depends almost entirely on **one number** in your computer. This lesson shows you how to find it and pick a model that fits.',
        ] },
        { t: 'p', text: '**Local AI** means the AI model runs on your own computer instead of in a company\'s data center. You download the model once, like a big game, and then it is yours: no bill, no limit, and your data stays on your machine. We use **Qwen**, a free, open model family from Alibaba that is especially good at code and chat. The newest version is **Qwen 3.5**.' },
        { t: 'h', text: 'The one number that matters: VRAM' },
        { t: 'p', text: 'Your computer has two kinds of memory. **RAM** is the normal memory your apps use. **VRAM** is the memory on your **GPU** (graphics card), the chip built for doing millions of math operations at once. AI models are giant piles of math, so they run on the GPU, and the whole model has to fit in VRAM to be fast.' },
        { t: 'analogy', text: 'VRAM is the desk you work at; RAM is a filing cabinet across the room. If the whole project fits on your desk, you fly. If it does not, you keep walking to the cabinet and back for every page. Same model, 5 to 20 times slower.' },
        { t: 'p', text: 'Look at the picture above. When a model is too big for your VRAM, the leftover part runs from normal RAM on the slower CPU, and every word it writes has to wait for that slow part. That is why a model that "runs" can still feel unusable.' },
        { t: 'h', text: 'Step 1: find your GPU and VRAM' },
        { t: 'table', head: ['Your computer', 'Where to look', 'What to read'], rows: [
          ['**Windows** with NVIDIA or AMD', 'Press Ctrl + Shift + Esc → **Performance** → **GPU**', '**Dedicated GPU memory** (for example 8.0 GB). That is your VRAM.'],
          ['**Mac** with Apple chip (M1 or newer)', ' menu → **About This Mac**', '**Memory** (for example 16 GB). Apple chips share it between CPU and GPU, so the GPU can use roughly two thirds to three quarters of it.'],
          ['Older Mac with Intel chip', ' menu → About This Mac', 'Local AI will be slow. Stick to tiny models, or use Claude.'],
          ['Windows laptop with only Intel graphics', 'Task Manager → GPU shows "Shared" memory only', 'No real VRAM. Tiny models only, and expect it to be slow.'],
        ] },
        { t: 'prompt', label: 'Check my computer for local AI', text: `Check this computer for running local AI models. Do not install anything yet.
Tell me in plain English: my GPU name, how much VRAM it has (or unified memory on a Mac, and how much of it the GPU can use), my RAM, and free disk space.
Then recommend the biggest Qwen 3.5 model (from ollama.com/library/qwen3.5) I can run fully on the GPU, and roughly how fast it will feel.` },
        { t: 'h', text: 'Step 2: pick a model that fits' },
        { t: 'p', text: 'Sizes are for the common 4-bit version (Q4_K_M, explained in the quantizing lesson). Leave about 1 to 2 GB of VRAM free for the conversation itself.' },
        { t: 'table', head: ['Your VRAM', 'Try this (download size)', 'What it is good for'], rows: [
          ['No GPU / under 4 GB', 'qwen3.5:2b (about 2.7 GB) or qwen3.5:0.8b', 'Summaries, short answers, tagging. Slow on CPU.'],
          ['6 GB', 'qwen3.5:4b (about 3.3 GB)', 'Everyday chat and writing; can also read images.'],
          ['8 GB', 'qwen3.5:9b (about 6.6 GB)', 'The sweet spot: good chat, writing and simple code. Keep conversations short.'],
          ['12 to 16 GB', 'qwen3.5:9b with long documents, or qwen3:14b (about 9.3 GB)', 'Long files, longer chats, better code.'],
          ['24 GB (RTX 3090, 4090, 5090)', 'qwen3.5:27b (about 17 GB)', 'Strong coding help. Real competition for paid models on simple tasks.'],
          ['Mac with 32 GB+', 'qwen3.5:27b, or the -mlx versions (like qwen3.5:9b-mlx)', 'Same as above; the -mlx versions are tuned for Apple chips.'],
        ] },
        { t: 'tip', tone: 'info', text: 'Qwen 3.5 is the newest family (it can also read images and use tools). Some models are "mixture of experts" (MoE), like qwen3:30b: they only use a small part of themselves for each word, so they run faster than their size suggests, but still need memory to hold the whole model.' },
        { t: 'snap', src: 'shots/ollama-qwen35.jpg', url: 'ollama.com/library/qwen3.5', caption: 'Ollama\'s Qwen 3.5 page lists every size with its download size, so you can match it to your VRAM.' },
        { t: 'h', text: 'How fast is fast enough?' },
        { t: 'table', head: ['Speed (tokens per second)', 'How it feels'], rows: [
          ['Under 5', 'Painful. Like watching someone type with one finger. The model probably does not fit in VRAM.'],
          ['10 to 20', 'About reading speed. Fine for chat.'],
          ['30+', 'Snappy. Good for coding help and bulk jobs.'],
        ] },
        { t: 'p', text: 'A **token** is a chunk of a word (roughly 3 to 4 letters). Ollama shows the speed if you type `/set verbose` in its chat; LM Studio shows it under every answer.' },
        { t: 'h', text: 'Step 3: install Ollama and chat' },
        { t: 'snap', src: 'shots/ollama-download.jpg', url: 'ollama.com/download', caption: 'The official Ollama download page. Pick your system (1), then use Download manually (2) to get the normal app installer.', marks: [{ x: 31, y: 38, w: 17, h: 4, n: 1 }, { x: 37.5, y: 51.5, w: 11, h: 4.5, n: 2 }] },
        { t: 'steps', items: [
          { do: 'Go to **ollama.com/download**, download it, and open it.', why: 'It installs like any other app and runs quietly in the background.' },
          { do: 'In the Ollama window, pick the Qwen model from the table that fits **your** VRAM, and type a message.', why: 'The first time, it downloads the model (a few gigabytes). After that it works offline.' },
          { do: 'Plug laptops in and set power mode to **Best performance**.', why: 'On battery, many laptops slow the GPU down a lot.' },
        ] },
        { t: 'tip', tone: 'info', text: 'Prefer more buttons? **LM Studio** does the same thing with a friendlier window, and it tells you which downloads fit your GPU. It has its own lesson next.' },
        { t: 'h', text: 'Step 4: use Qwen inside Claude Code' },
        { t: 'p', text: 'Claude Code can use a local Qwen as its brain: great for private projects, or when your Claude plan limit runs out mid-session. Ollama made this one command: **ollama launch claude**. Coding needs a big model and a long memory (Ollama recommends a 64K+ context), so this works best with 16 GB+ of VRAM.' },
        { t: 'prompt', label: 'Hook Claude Code to Qwen', text: `Help me run Claude Code with a local Qwen model through Ollama.
1. Check my GPU and VRAM, and update Ollama to the latest version.
2. Pick the biggest tool-capable Qwen 3.5 model that fits fully in my VRAM with a 64K context, and download it.
3. Start it the official way: ollama launch claude --model [that model]. Check Ollama's docs (docs.ollama.com/integrations/claude-code) if anything changed.
4. Tell me the one command to start Claude Code with Qwen, and remind me that plain "claude" still uses normal Claude.` },
        { t: 'deeper', title: 'GPU brands, memory math and the context trap', blocks: [
          { t: 'table', head: ['GPU', 'How well local AI works'], rows: [
            ['NVIDIA (RTX)', 'Best supported everywhere (CUDA). The easy choice.'],
            ['Apple M-series', 'Very good. Uses Metal and Apple\'s MLX; big unified memory lets Macs run large models.'],
            ['AMD Radeon', 'Works in Ollama and LM Studio (ROCm or Vulkan); a bit more fiddly on Windows.'],
            ['Intel Arc', 'Works in some apps through Vulkan; less tested.'],
          ] },
          { t: 'p', text: '**Memory math:** billions of parameters × bits per number ÷ 8 ≈ gigabytes. An 8B model at 4 bits ≈ 8 × 4 ÷ 8 = 4 GB, plus overhead.' },
          { t: 'p', text: '**The context trap:** the model also keeps a working memory of the conversation (the "KV cache") in VRAM. A long context window (say 32K tokens) can add several gigabytes. If a model fits but slows down as the chat grows, the context is spilling out of VRAM; shorten it or pick a smaller model.' },
          { t: 'p', text: 'Ollama\'s `ollama ps` shows how much of a loaded model is on the GPU ("100% GPU" is what you want). Terminal users can start a model with `ollama run qwen3.5:9b`.' },
          { t: 'p', text: 'Most Qwen models use the Apache-2.0 license, which allows commercial use. Always check the model card before using one in a business.' },
        ] },
        { t: 'check', q: 'Your laptop has 8 GB of VRAM. Which model will feel fast?', options: [
          'qwen3.5:27b, because bigger is smarter',
          'qwen3.5:9b (about 6.6 GB), because it fits fully in VRAM',
          'Any model, VRAM does not matter',
        ], answer: 1, explain: 'A model that fits fully in VRAM runs on the GPU. A 27B model (about 17 GB) would spill into RAM and crawl.' },
        { t: 'recap', items: [
          'Local AI speed depends on VRAM: the whole model should fit on the GPU.',
          'Check yours (Task Manager → GPU, or About This Mac), then pick a model from the table.',
          '10 to 20 tokens per second is reading speed; under 5 means it does not fit.',
        ] },
      ],
    },
    {
      id: 'lm-studio',
      title: 'Bonus: LM Studio, local AI with buttons',
      minutes: 16,
      body: [
        { t: 'why', text: 'LM Studio is the friendliest way to run local AI: browse thousands of free models, see which ones fit your GPU **before** downloading, chat with them, chat with your own documents, give them tools like web search, and plug them into apps you build. No terminal needed.' },
        { t: 'p', text: '**LM Studio** is a free desktop app for Mac, Windows and Linux. Think of it as a music player for AI models: a library to browse, a download button, and a chat window.' },
        { t: 'h', text: 'Step 1: install it' },
        { t: 'snap', src: 'shots/lmstudio-download.jpg', url: 'lmstudio.ai/download', caption: 'Pick your system and chip (1), then Download LM Studio (2). Bionic, above it on the real page, is a separate agent app.', marks: [{ x: 16.5, y: 56, w: 57, h: 9, n: 1 }, { x: 16.5, y: 68.5, w: 26.5, h: 8, n: 2 }] },
        { t: 'steps', items: [
          { do: 'Go to **lmstudio.ai/download** and download the regular **LM Studio** app (not Bionic, their separate agent app).', why: 'Only download it from the official site, like every app in this course.' },
          { do: 'Open it. You do not need an account. If it asks to pick a first model, you can skip and use Step 2.' },
        ] },
        { t: 'h', text: 'Step 2: find a model that fits your GPU' },
        { t: 'steps', items: [
          { do: 'Click the **Discover** tab (the magnifying glass) and search for **Qwen3.5**.' },
          { do: 'Pick a result from a well-known uploader, like **Qwen**, **lmstudio-community** or **unsloth**.', why: 'Anyone can upload a model. Known names are like the official app store.' },
          { do: 'On the right, look at the download options. LM Studio labels each one: **Full GPU offload possible** (fast, fits in VRAM), **Partial GPU offload** (some runs on slow RAM), or **Likely too large**.', why: 'This label is the VRAM lesson done for you. Pick one that says full GPU offload.' },
          { do: 'Prefer the **Q4_K_M** version if it fits; Q5 or Q6 if you have room to spare.' },
          { do: 'On a Mac with an Apple chip, pick the **MLX** version when offered.', why: 'MLX is Apple\'s own engine for its chips, usually faster than GGUF on a Mac.' },
          { do: 'Click **Download**, then open the **Chat** tab, choose the model at the top, and say hello.' },
        ] },
        { t: 'h', text: 'Step 3: the 4 settings that matter' },
        { t: 'p', text: 'When you load a model, click the settings (gear) next to it. These four decide whether it is fast and useful:' },
        { t: 'table', head: ['Setting', 'What it does', 'What to choose'], rows: [
          ['**GPU offload**', 'How much of the model goes on the GPU', 'Slide it all the way to max. If it will not load, pick a smaller model rather than lowering this.'],
          ['**Context length**', 'How much of the conversation it remembers', '8K for chat, 16K to 32K for long documents. Bigger uses more VRAM.'],
          ['**System prompt**', 'Standing instructions for every chat', 'Your house rules, like with Claude: who it is helping and how to answer.'],
          ['**Temperature**', 'Predictable vs creative', 'About 0.2 for facts and code, 0.7 to 0.8 for writing.'],
        ] },
        { t: 'p', text: 'Watch the speed under each answer (tokens per second). Under 5 means the model is too big for your GPU; go one size down.' },
        { t: 'h', text: 'Step 4: chat with your own files' },
        { t: 'steps', items: [
          { do: 'In a chat, drag in a PDF, Word or text file (or click the paperclip).' },
          { do: 'Ask questions about it: "Summarize this contract" or "What does section 4 say about refunds?"', why: 'LM Studio finds the relevant parts and gives them to the model. The file never leaves your computer.' },
        ] },
        { t: 'tip', tone: 'safe', text: 'This is where local AI shines: client files, medical letters, financial statements. Things you should never paste into an online chatbot can be read by a local model with zero data leaving your machine.' },
        { t: 'h', text: 'Step 5: use it in your own apps' },
        { t: 'p', text: 'LM Studio can act like an AI company\'s server, right on your computer. Open the **Developer** tab and click **Start server**. Your apps can now talk to `http://localhost:1234/v1` exactly as if it were OpenAI: free and private.' },
        { t: 'prompt', label: 'Use LM Studio in my app', text: `LM Studio is running a local server at http://localhost:1234/v1 with an OpenAI-compatible API.
Add a setting to my app so that, during development, AI requests go to LM Studio instead of a paid API.
Keep the paid API for production. Use an environment variable to switch between them, and never hard-code keys.` },
        { t: 'tip', tone: 'warn', text: 'Leave **Serve on local network** off unless you truly need it. When it is on, anyone on your Wi-Fi can use your model and see what is sent to it.' },
        { t: 'deeper', title: 'Tools (MCP), the lms command and presets', blocks: [
          { t: 'p', text: 'Since version 0.3.17, LM Studio can use **MCP** tools, the same plug-in standard as Claude\'s connectors. In the right sidebar open **Program → Install → Edit mcp.json**, or click an "Add to LM Studio" button on a tool\'s page. The next lesson uses this to give your local AI web search.' },
          { t: 'p', text: 'Tools only work with models trained for "tool use" (Qwen 3.5 is). LM Studio asks you to approve each tool call; read what it is about to do before clicking allow.' },
          { t: 'p', text: '**Presets** save a system prompt plus settings under a name, like "Code helper" or "Contract reader", so you can switch in one click.' },
          { t: 'p', text: 'The `lms` command line tool can download models, load them and start the server from scripts, if you ever want to automate it.' },
        ] },
        { t: 'check', q: 'LM Studio says "Partial GPU offload" next to a download. What will happen?', options: [
          'It will run at full speed',
          'Part of it will run from slower RAM, so answers will be noticeably slower',
          'It will not run at all',
        ], answer: 1, explain: 'Partial offload means the model does not fit in VRAM. Pick a smaller version that says Full GPU offload possible.' },
        { t: 'recap', items: [
          'Pick downloads labeled "Full GPU offload possible"; Q4_K_M is the sweet spot.',
          'Max out GPU offload, keep context reasonable, set a system prompt.',
          'Chat with private files locally; its server makes your apps use AI for free.',
        ] },
      ],
    },
    {
      id: 'local-privacy',
      title: 'Bonus: keep local AI private, and let it search the web',
      minutes: 14,
      body: [
        { t: 'why', text: [
          'People run AI locally for one big reason: privacy. But "local" is not automatically private. Some features quietly use the internet. This lesson shows exactly what stays on your machine and what does not.',
          'Then we fix local AI\'s biggest weakness: it only knows what it learned during training, so it cannot look things up. You will give it web search, and know exactly what that costs you in privacy.',
        ] },
        { t: 'h', text: 'What stays on your computer, and what does not' },
        { t: 'table', head: ['Thing', 'Stays local?', 'Notes'], rows: [
          ['Your chats and the answers', '**Yes**', 'With Ollama or LM Studio, the model runs on your machine. LM Studio\'s privacy policy says your chats and documents are not sent anywhere.'],
          ['Files you chat with', '**Yes**', 'Read and searched on your computer.'],
          ['Searching for and downloading models', 'No', 'Goes to Hugging Face or Ollama\'s library. They see which model you downloaded, not your chats.'],
          ['App update checks', 'No', 'Normal app behavior; no chat content.'],
          ['**Web search** for the AI', '**No**', 'Your search words go to the search provider. Anything you put in a search can leave your machine.'],
          ['Tools / MCP servers you add', 'Depends', 'A tool can read files or use the internet. Only add tools you trust.'],
          ['Ollama "cloud" models', '**No**', 'Model names ending in -cloud run on Ollama\'s servers, not yours.'],
          ['LM Studio "Serve on local network"', 'Shared on your Wi-Fi', 'Anyone on the network can use it. Keep it off.'],
        ] },
        { t: 'h', text: 'Your privacy checklist' },
        { t: 'steps', items: [
          { do: '**Prove it is offline:** turn off Wi-Fi and ask the model a question. If it still answers, your chats are truly local.', why: 'The easiest test there is. Turn Wi-Fi back on afterwards.' },
          { do: 'Use a model that runs on your machine (no "-cloud" in the name).' },
          { do: 'Keep network serving off.' },
          { do: 'Keep web search **off** for private work (contracts, health, money). Turn it on only for general questions.' },
          { do: 'Ollama is open source, so anyone can check what it does. LM Studio is free but closed source, so you are trusting its privacy policy.', why: 'Both are widely used; for very sensitive work, the open-source option is easier to verify.' },
        ] },
        { t: 'h', text: 'Give your local AI web search' },
        { t: 'p', text: 'Three ways, from easiest to most powerful. All of them work best with a model trained for tool use, like **Qwen 3.5** at 9B or bigger.' },
        { t: 'h', text: 'Option 1 (easiest): Page Assist + Ollama' },
        { t: 'snap', src: 'shots/page-assist.jpg', url: 'addons.mozilla.org · Page Assist', caption: 'Page Assist, a free and open-source browser extension for local AI. On Chrome, find it in the Chrome Web Store.' },
        { t: 'steps', items: [
          { do: 'Make sure Ollama is running with a Qwen 3.5 model downloaded.' },
          { do: 'Install **Page Assist** from the Chrome Web Store or Firefox Add-ons. It is free and open source.', why: 'It gives your local model a chat window in your browser, with a web search switch.' },
          { do: 'Open Page Assist, choose **Ollama** and your Qwen model in its settings.' },
          { do: 'Turn on the **internet search** switch in the chat and ask something current, like "What changed in the latest Next.js release?"' },
        ] },
        { t: 'h', text: 'Option 2: LM Studio + a search tool (MCP)' },
        { t: 'steps', items: [
          { do: 'In LM Studio, open the right sidebar → **Program** → **Install** → **Edit mcp.json**.' },
          { do: 'Let Claude add a trustworthy web search tool with the prompt below.', why: 'Some search tools need a free API key; Claude will open the hidden terminal prompt for it, like every key in this course.' },
          { do: 'Back in a chat with Qwen 3.5, ask a current question. LM Studio asks to approve each search; read it and click allow.' },
        ] },
        { t: 'prompt', label: 'Add web search to LM Studio', text: `Help me add a web search tool to LM Studio using MCP.
1. Recommend a well-maintained, widely used web search MCP server and tell me who makes it and what data it sends where.
2. Add it to LM Studio's mcp.json for me (LM Studio: Program → Install → Edit mcp.json).
3. If it needs an API key, open a hidden terminal prompt so I can paste it there, never in this chat.
4. Tell me how to test it, and how to turn it off when I want a fully private chat.` },
        { t: 'h', text: 'Option 3: Ollama\'s web search (for your own apps)' },
        { t: 'p', text: 'Ollama has a web search service your code can call, so a local model can search while it answers. It needs a free Ollama account and an API key (OLLAMA_API_KEY). Your **searches go to Ollama\'s servers**, even though the model runs on your machine.' },
        { t: 'prompt', label: 'Add Ollama web search to my app', text: addKey('OLLAMA_API_KEY', 'Ollama') + `

Then add web search to my app's local AI using Ollama's web search and web fetch tools with a tool-capable Qwen 3.5 model.
Only search when the question needs current information, show the sources in the answer, and add a setting to turn search off for private chats.` },
        { t: 'deeper', title: 'How tool use and search actually work', blocks: [
          { t: 'p', text: 'The model does not browse by itself. When it decides it needs information, it outputs a structured "tool call" (like `web_search({ query: "..." })`). The app runs the search, pastes the results back into the conversation, and the model writes its answer using them. That is the same loop as the agents module.' },
          { t: 'p', text: 'Small models (under about 9B) often call tools badly: wrong format, or searching when they do not need to. If search acts strangely, move up a model size before blaming the tool.' },
          { t: 'p', text: 'Search results can contain **prompt injection**: a web page that says "ignore your instructions." Keep tools that can change things (files, email, payments) off in the same chat where you search the web.' },
          { t: 'p', text: 'For a fully self-hosted setup, **Open WebUI** with a private **SearXNG** search engine keeps even the search engine on your own machine. Ask Claude to set it up with Docker if you want to go that far.' },
        ] },
        { t: 'check', q: 'You turn on web search in your local AI and ask about a private contract. What leaves your computer?', options: [
          'Nothing, it is local AI',
          'Whatever words the AI puts into the web search',
          'Only the model name',
        ], answer: 1, explain: 'The model runs locally, but the search query goes to the search provider. Keep search off for private work.' },
        { t: 'recap', items: [
          'Chats and files stay local; downloads, cloud models and web searches do not.',
          'Prove it: turn off Wi-Fi and the model should still answer.',
          'Easiest web search: Page Assist + Ollama. More power: an MCP search tool in LM Studio.',
        ] },
      ],
    },
    {
      id: 'hugging-face',
      title: 'Bonus: Hugging Face, the app store for AI',
      minutes: 11,
      body: [
        { t: 'why', text: 'Almost every free AI model in the world lives on one website: Hugging Face. LM Studio and Ollama quietly download from it. Knowing how to read it lets you find the right model for any job, and spot the ones to avoid.' },
        { t: 'p', text: '**Hugging Face** (huggingface.co) is like GitHub, but for AI. Companies and researchers upload models, datasets and demos there. Browsing and downloading is free.' },
        { t: 'h', text: 'How to read a model page' },
        { t: 'snap', src: 'shots/hf-qwen3-gguf.jpg', url: 'huggingface.co/Qwen/Qwen3-8B-GGUF', caption: 'A real model page: Files and versions (1), each download size by quality level (2), and the Use this model button (3).', marks: [{ x: 14.5, y: 23.5, w: 14, h: 4, n: 1 }, { x: 60, y: 59, w: 38, h: 18, n: 2 }, { x: 84.5, y: 23.5, w: 12, h: 4, n: 3 }] },
        { t: 'table', head: ['Look at', 'What it tells you', 'Good sign'], rows: [
          ['Who uploaded it', 'The company or person behind it', 'A known organization (Qwen, Meta, Google, Mistral)'],
          ['Downloads and likes', 'How many people use it', 'Thousands or more'],
          ['License', 'What you are allowed to do with it', 'Apache-2.0 or MIT for business use'],
          ['Model card', 'The README: what it is for and its limits', 'Clear, detailed, honest about weaknesses'],
          ['Files', 'The actual model files', '.safetensors or .gguf'],
        ] },
        { t: 'h', text: 'Words you will see' },
        { t: 'table', head: ['Word', 'Meaning'], rows: [
          ['8B, 32B, 70B', 'Billions of parameters (the model\'s "brain cells"). Bigger is smarter but heavier.'],
          ['Instruct / Chat', 'Trained to follow instructions. This is the one you want for chatting.'],
          ['Base', 'Raw model that just continues text. Mostly for researchers.'],
          ['GGUF', 'A single-file format for running models on normal computers (LM Studio, Ollama).'],
          ['MLX', 'A format tuned for Apple Silicon Macs.'],
          ['Quantized / Q4, Q8', 'Compressed to fit in less memory. Next lesson.'],
        ] },
        { t: 'h', text: 'Try models without installing anything' },
        { t: 'p', text: 'Many models have a **Space**: a free demo page you can use in your browser. Search the Spaces tab for a model name to test it before you download gigabytes.' },
        { t: 'tip', tone: 'warn', text: 'Avoid model files ending in **.bin**, **.pt** or **.pkl** from unknown uploaders. Those older formats can hide code that runs on your computer. **.safetensors** and **.gguf** only hold numbers, which is why they are the safe choice.' },
        { t: 'deeper', title: 'Accounts, tokens and licenses', blocks: [
          { t: 'p', text: 'Some models (like Meta\'s Llama) are **gated**: you accept their license on the website before downloading. For that you need a free account and an access token.' },
          { t: 'steps', items: [
            'Make tokens under Settings → Access Tokens, and choose **Read** only unless you are uploading.',
            'Same rule as every key: one paste into a hidden terminal prompt, never into a chat. `hf auth login` asks for it that way and stores it for you.',
            'Read the license before using a model in a business. "Open" does not always mean "free for commercial use."',
          ] },
        ] },
        { t: 'check', q: 'Which model file is the safest to download from an unknown uploader?', options: [
          'model.pkl',
          'model.bin',
          'model.safetensors or model.gguf',
        ], answer: 2, explain: 'safetensors and GGUF hold only numbers, so they cannot hide code that runs on your machine.' },
        { t: 'prompt', label: 'Find me a model on Hugging Face', text: `I want to [TASK, e.g. "run a small chat model on my laptop" or "turn speech into text"]. My computer is [MAC/PC, how much RAM, graphics card if any].
Search Hugging Face for 3 good open models for this. For each, give me: what it is good at, its size, its license (can I use it in a paid app?), and whether it will run on my computer.
Then show me the easiest way to try the best one (LM Studio or Ollama), step by step.` },
        { t: 'recap', items: [
          'Hugging Face is where free models live; LM Studio downloads from it.',
          'Check the uploader, downloads, license and model card.',
          'Prefer .safetensors and .gguf; read-only tokens, never in chat.',
        ] },
      ],
    },
    {
      id: 'quantize',
      title: 'Bonus: shrink a model yourself (quantizing)',
      minutes: 14,
      body: [
        { t: 'why', text: 'Big AI models are huge: an 8-billion-parameter model is about 16 GB in its original form. Quantizing shrinks it to around 5 GB so it runs on a normal laptop, with surprisingly little loss in smarts. Doing it yourself means you can run models nobody has shrunk yet, and you will understand what all those Q4 and Q8 labels mean.' },
        { t: 'analogy', text: 'Quantizing is like saving a photo as a smaller JPEG. The original stores every pixel perfectly. The JPEG rounds tiny details you would barely notice, and the file becomes a fraction of the size. Push it too far and it gets blurry.' },
        { t: 'p', text: 'Every model is billions of numbers. Normally each number uses 16 bits. Quantizing rounds them to fewer bits (8, 5, 4 or even 2), so the whole model takes far less memory.' },
        { t: 'h', text: 'What the labels mean' },
        { t: 'table', head: ['Label', 'Size of an 8B model', 'Quality', 'Use it when'], rows: [
          ['F16 (original)', 'about 16 GB', 'Perfect', 'You are making other versions from it'],
          ['Q8_0', 'about 8.5 GB', 'Practically perfect', 'You have plenty of memory'],
          ['Q6_K', 'about 6.6 GB', 'Excellent', 'A safe, high-quality choice'],
          ['Q5_K_M', 'about 5.7 GB', 'Very good', 'A little more quality than Q4'],
          ['**Q4_K_M**', 'about 4.9 GB', 'Good', '**The default sweet spot**'],
          ['Q3_K_M', 'about 4 GB', 'Noticeably worse', 'Your computer is tight on memory'],
          ['Q2_K', 'about 3.2 GB', 'Rough', 'Experiments only'],
        ] },
        { t: 'p', text: 'Quick memory math: **billions of parameters × bits ÷ 8 = gigabytes**, plus about 1 to 2 GB extra while it runs. So an 8B model at 4 bits needs roughly 8 × 4 ÷ 8 = 4 GB, plus extra.' },
        { t: 'h', text: 'The easiest way: no install at all' },
        { t: 'snap', src: 'shots/gguf-my-repo.jpg', url: 'huggingface.co/spaces/ggml-org/gguf-my-repo', caption: 'GGUF-my-repo: sign in (1), type the model (2), pick Q4_K_M (3), press Submit (4).', marks: [{ x: 5.5, y: 12.5, w: 90, h: 5, n: 1 }, { x: 6, y: 32.5, w: 44, h: 6.5, n: 2 }, { x: 7.5, y: 49, w: 41.5, h: 5, n: 3 }, { x: 28, y: 83, w: 22.5, h: 5, n: 4 }] },
        { t: 'steps', items: [
          { do: 'On Hugging Face, search Spaces for **GGUF-my-repo** (by ggml-org).' },
          { do: 'Sign in, paste the name of the model you want to shrink (for example a Qwen model), and pick **Q4_K_M**.' },
          { do: 'Click Submit. It makes the GGUF file and saves it to your own Hugging Face account.', why: 'The heavy work happens on their computers, not yours.' },
          { do: 'In LM Studio, search for your Hugging Face username and download your new model.' },
        ] },
        { t: 'h', text: 'The do-it-yourself way: let Claude run it' },
        { t: 'prompt', label: 'Quantize a model on my computer', text: `Help me quantize [MODEL NAME FROM HUGGING FACE] to GGUF Q4_K_M on this computer.
1. Check my free disk space and memory first, and tell me if this is realistic (the original download can be 2 to 3 times the final size).
2. Use the official llama.cpp tools: convert the model to a 16-bit GGUF, then quantize it to Q4_K_M.
3. Only download from the model's official Hugging Face page. If it is gated, tell me how to log in myself; never ask me to paste a token here.
4. When done, tell me where the file is and how to load it in LM Studio.
5. Delete the large temporary files afterwards, but ask me first.` },
        { t: 'tip', tone: 'info', text: 'On an Apple Silicon Mac, ask Claude to use **MLX** instead (`mlx_lm.convert` with the -q option). It is simpler and the result runs fast in LM Studio.' },
        { t: 'deeper', title: 'Under the hood: K-quants, importance matrices and testing quality', blocks: [
          { t: 'p', text: 'The **K** in Q4_K_M means "k-quants": numbers are grouped into small blocks, and each block gets its own scale, so rounding errors stay small. The **M** (medium) and **S** (small) say how many of the most sensitive layers keep extra precision.' },
          { t: 'p', text: 'An **importance matrix** (imatrix) is a short calibration run on sample text that tells the quantizer which numbers matter most. It noticeably improves very small quants like Q3 and Q2.' },
          { t: 'p', text: 'To measure quality, compare **perplexity** (how surprised the model is by real text; lower is better) between the original and your quant with `llama-perplexity`, then try your own real prompts side by side.' },
          { t: 'p', text: 'The commands, for reference: `python convert_hf_to_gguf.py <model-folder> --outtype f16`, then `llama-quantize model-f16.gguf model-Q4_K_M.gguf Q4_K_M`.' },
          { t: 'p', text: 'Quantizing is not training. To teach a model new skills you **fine-tune** it (tools like Unsloth make this approachable), then quantize the result to run it locally.' },
        ] },
        { t: 'check', q: 'You have a 16 GB laptop and want a good 8B model. Which version is the best starting point?', options: [
          'F16, because it is the original',
          'Q4_K_M',
          'Q2_K, because smaller is always better',
        ], answer: 1, explain: 'Q4_K_M is about 5 GB with good quality, leaving plenty of room for your other apps. F16 would not fit comfortably, and Q2 loses too much.' },
        { t: 'recap', items: [
          'Quantizing rounds a model\'s numbers so it fits in less memory.',
          'Q4_K_M is the sweet spot; Q8 is near-perfect; Q2 is rough.',
          'GGUF-my-repo does it online for free; llama.cpp or MLX do it on your computer.',
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
