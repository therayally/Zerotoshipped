export default {
  id: 'save-money',
  title: 'Optimize: tokens, local AI and quantizing',
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
        { t: 'p', text: 'We use **Qwen**, a free, open AI model family from Alibaba that is especially good at code and chat. To run it, we use **Ollama**, a free app with a simple chat window.' },
        { t: 'h', text: 'Step 1: install Ollama' },
        { t: 'snap', src: 'shots/ollama.jpg', url: 'ollama.com/download', caption: 'Download Ollama for your computer' },
        { t: 'steps', items: [
          { do: 'Go to **ollama.com/download**, download it, and open it.', why: 'It installs like any other app and runs quietly in the background.' },
          { do: 'In the Ollama window, pick a **Qwen** model from the model menu (see the table below) and type a message.', why: 'The first time, it downloads the model (a few gigabytes). After that it works offline.' },
        ] },
        { t: 'tip', tone: 'info', text: 'Prefer more buttons? **LM Studio** does the same thing with a friendlier window. It has its own bonus lesson next.' },
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
          { t: 'p', text: 'Terminal users can start a model with `ollama run qwen3`.' },
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
      id: 'lm-studio',
      title: 'Bonus: LM Studio, local AI with buttons',
      minutes: 12,
      body: [
        { t: 'why', text: 'Ollama is great, but LM Studio is the friendliest way to explore local AI: you can browse thousands of free models, see which ones fit your computer before downloading, chat with them, and even plug them into apps you build. No terminal at all.' },
        { t: 'p', text: '**LM Studio** is a free desktop app for Mac, Windows and Linux. Think of it as a music player, but for AI models: a library to browse, a download button, and a chat window.' },
        { t: 'h', text: 'Step 1: install it' },
        { t: 'steps', items: [
          { do: 'Go to **lmstudio.ai** and download it for your computer.', why: 'Only download it from the official site, like every app in this course.' },
          { do: 'Open it and skip any sign-up prompts; you do not need an account.' },
        ] },
        { t: 'h', text: 'Step 2: find a model that fits' },
        { t: 'steps', items: [
          { do: 'Click the **Discover** tab (the magnifying glass) and search for **Qwen**.' },
          { do: 'Pick a result from a well-known uploader, like **Qwen**, **lmstudio-community** or **unsloth**.', why: 'Anyone can upload a model. Sticking to known names is like only installing apps from the official store.' },
          { do: 'Look at the download options on the right. LM Studio marks which ones **fit your computer**. Choose one that fits, ideally one ending in **Q4_K_M**.', why: 'Q4_K_M is the sweet spot: small enough to run fast, smart enough to be useful. The next lesson explains these codes.' },
          { do: 'On a Mac with Apple Silicon (M1 or newer), prefer versions marked **MLX** if offered.', why: 'MLX is Apple\'s own engine for its chips, so these usually run faster.' },
          { do: 'Click **Download**, then go to the **Chat** tab, pick the model at the top, and say hello.' },
        ] },
        { t: 'h', text: 'Step 3: use it in your own apps' },
        { t: 'p', text: 'LM Studio can pretend to be an AI company\'s server, right on your computer. Turn it on in the **Developer** tab (Start server). Your apps can then talk to `http://localhost:1234` exactly as if it were OpenAI, for free and fully private.' },
        { t: 'prompt', label: 'Use LM Studio in my app', text: `LM Studio is running a local server on http://localhost:1234 with an OpenAI-compatible API.
Add a setting to my app so that, during development, AI requests go to LM Studio instead of a paid API.
Keep the paid API for production. Use an environment variable to switch between them, and never hard-code keys.` },
        { t: 'tip', tone: 'warn', text: 'Keep the LM Studio server set to your computer only (the default). Turning on "serve on local network" lets other devices on your Wi-Fi use it too, which you rarely want.' },
        { t: 'deeper', title: 'Settings that matter', blocks: [
          { t: 'table', head: ['Setting', 'What it does', 'Tip'], rows: [
            ['Context length', 'How much text the model can "see" at once', 'Bigger needs more memory. 8K to 32K is plenty for chat.'],
            ['GPU offload', 'How much of the model runs on your graphics chip', 'Max it out if the model fits; it is much faster.'],
            ['Temperature', 'How creative vs. predictable answers are', 'Low (0.2) for code and facts, higher (0.8) for writing.'],
            ['System prompt', 'Standing instructions for every chat', 'Put your "house rules" here, just like with Claude.'],
          ] },
          { t: 'p', text: 'LM Studio also has a command-line tool (`lms`) for scripting downloads and starting the server, if you ever want to automate it.' },
        ] },
        { t: 'check', q: 'You find two copies of the same model. One is from "Qwen", one from an account with no other uploads. Which should you pick?', options: [
          'The unknown one, it might be better',
          'The one from Qwen or another well-known uploader',
          'It does not matter, models are all the same',
        ], answer: 1, explain: 'Anyone can upload files. Trusted uploaders are your app store.' },
        { t: 'recap', items: [
          'LM Studio: browse, download and chat with free models, no terminal.',
          'Pick versions that fit your computer; Q4_K_M is the sweet spot.',
          'Its local server lets your apps use AI for free during development.',
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
