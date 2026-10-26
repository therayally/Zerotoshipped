// Track 2: the features people actually ask for. Real data, file uploads, scanning with a phone, and AI that knows your documents (RAG).
import { SAFE, addKey } from '../safe';

export default {
  id: 'smart-features',
  title: 'Smart features: data, uploads, scanning and RAG',
  lessons: [
    {
      id: 'official-apis',
      title: 'Use official APIs and SDKs (so you never get blocked)',
      minutes: 12,
      body: [
        { t: 'why', text: [
          'Sooner or later your app needs data from a big company: places from Google Maps, videos from YouTube, products from Shopify. AI will happily write a "scraper" that copies their web pages. It works for a day, then you get blocked, your app breaks, and you may be breaking their terms.',
          'Big companies offer an **official API** (a front door built for apps) and usually an **SDK** (a ready-made code library for that door). Using them is the difference between a toy and a business.',
        ] },
        { t: 'analogy', text: 'Scraping is climbing in through a restaurant\'s kitchen window to read the menu. It might work, but security will throw you out, and the menu moves. The official API is the front counter: you ask politely, they hand you the menu in a clean format, every time.' },
        { t: 'snap', src: 'shots/google-places-api.jpg', url: 'developers.google.com/maps · Places API', caption: 'Google\'s official Places API: the legal, stable way to get business names, hours and reviews. Never scrape Google Maps.' },
        { t: 'table', head: ['Instead of scraping…', 'Use the official…'], rows: [
          ['Google Maps pages', 'Google Places API'],
          ['YouTube pages', 'YouTube Data API'],
          ['Reddit pages', 'Reddit API (has rules for commercial use)'],
          ['A store\'s product pages', 'Shopify / Square / Stripe APIs (with the owner\'s permission)'],
          ['Weather websites', 'National Weather Service API (free, US) or OpenWeather'],
          ['Stock or crypto sites', 'A licensed market data API'],
        ] },
        { t: 'h', text: 'API vs SDK in one sentence' },
        { t: 'p', text: 'The **API** is the list of things you can ask for. The **SDK** is that company\'s own code that asks for you, handling logins, retries and errors. If an official SDK exists for your language (like `stripe` or `@googlemaps/google-maps-services-js`), use it instead of writing raw requests.' },
        { t: 'steps', items: [
          { do: 'Search "[COMPANY] API docs" and open the **developers.** site.', why: 'Official docs live on the company\'s own domain. Avoid random "unofficial API" packages.' },
          { do: 'Create a project and get an **API key** in their developer console.', why: 'The key tells them who is asking, so they can give you a fair quota.' },
          { do: 'Save the key with the hidden terminal prompt (below).', why: 'Keys never go in chat or in code.' },
          { do: 'Set a **budget alert** or usage cap in their console.', why: 'Many APIs are free up to a limit, then charge per request. A bug in a loop can run up a bill.' },
          { do: 'Cache results in your database.', why: 'Asking once and saving the answer is faster, cheaper and stays under rate limits.' },
        ] },
        { t: 'prompt', label: 'Save my API key', text: addKey('GOOGLE_MAPS_API_KEY', 'Google Maps Platform') },
        { t: 'prompt', label: 'Use the official API the right way', text: `I need [WHAT DATA, e.g. "coffee shops near the user with ratings and hours"] for my app.
1. Find the official API (and official SDK for my language) for this. Show me the docs link. Do not write a scraper, and do not use unofficial packages.
2. Tell me the free limit, the price after that, and the rate limits.
3. Call it only from my server (never the browser), using the key in .env.local.
4. Cache results in my database for [24 hours] so we do not repeat requests.
5. Handle errors and rate limits politely (wait and retry, then show a friendly message).${SAFE}` },
        { t: 'tip', tone: 'warn', text: 'Restrict your API keys in the provider\'s console: limit them to your domain or server and to only the APIs you use. A leaked, unrestricted Google key can cost thousands.' },
        { t: 'check', q: 'Your app needs restaurant hours from Google Maps. What should you do?', options: [
          'Scrape Google Maps pages every hour',
          'Use the official Google Places API with a restricted key, and cache the results',
          'Copy them by hand into the code',
        ], answer: 1, explain: 'Official API, restricted key, cached results: stable, legal and cheap.' },
        { t: 'recap', items: [
          'Scrapers break and can break terms of service; official APIs are built for apps.',
          'Use the company\'s own SDK when one exists.',
          'Restrict keys, set budget alerts, call from the server, cache results.',
        ] },
      ],
    },
    {
      id: 'open-data',
      title: 'Open datasets: free data instead of scraping',
      minutes: 10,
      body: [
        { t: 'why', text: 'Many app ideas need a big pile of data: every food product, every park, every zip code. Before anyone writes a scraper, check if someone already published that data for free, cleanly, with permission to use it. Very often they have.' },
        { t: 'analogy', text: 'An open dataset is the public library. Why secretly photocopy pages from a bookstore when the library will lend you the whole book for free, legally?' },
        { t: 'h', text: 'Where open data lives' },
        { t: 'snap', src: 'shots/kaggle-datasets.jpg', url: 'kaggle.com/datasets', caption: 'Kaggle Datasets: hundreds of thousands of free datasets, from sports stats to house prices.' },
        { t: 'snap', src: 'shots/hf-datasets.jpg', url: 'huggingface.co/datasets', caption: 'Hugging Face Datasets: the biggest home for AI-ready data (text, images, audio).' },
        { t: 'snap', src: 'shots/data-gov.jpg', url: 'catalog.data.gov', caption: 'Data.gov: free US government data. Most countries and many cities have their own portal.' },
        { t: 'table', head: ['Source', 'Good for', 'Example'], rows: [
          ['**Kaggle**', 'Any topic, CSV files', 'Recipes, car prices, sports stats'],
          ['**Hugging Face Datasets**', 'AI training and testing data', 'Product reviews, questions and answers'],
          ['**Data.gov** and city portals', 'Government data', 'Restaurant inspections, parks, transit'],
          ['**Open Food Facts**', 'Food products by barcode', '3+ million products with ingredients'],
          ['**OpenStreetMap**', 'Maps and places', 'Every bus stop or bike lane in a city'],
          ['**Wikidata**', 'Facts about almost anything', 'Every country\'s capital and population'],
        ] },
        { t: 'h', text: 'Always check the license' },
        { t: 'p', text: 'Open does not always mean "do anything." Look for the license on the dataset page:' },
        { t: 'table', head: ['License', 'In plain words'], rows: [
          ['**CC0 / Public domain**', 'Use it for anything, no credit needed'],
          ['**CC BY**', 'Use it for anything, but credit the source in your app'],
          ['**ODbL** (Open Food Facts, OpenStreetMap)', 'Use it, credit it, and if you share an improved copy of the database, share it under the same license'],
          ['**CC BY-NC**', 'Non-commercial only. Not OK for a paid app'],
          ['No license shown', 'Assume you may not use it. Ask the owner'],
        ] },
        { t: 'prompt', label: 'Find open data for my idea', text: `My app needs data about [WHAT, e.g. "every dog park in the US with hours"].
Search for open datasets or official free APIs that have this (Kaggle, Hugging Face, Data.gov, city portals, OpenStreetMap, Wikidata).
For the 3 best, give me: link, what is in it, how fresh it is, size, and the license in plain words (can I use it in a paid app? do I need to credit it?).
Recommend one. Do not suggest scraping.` },
        { t: 'prompt', label: 'Load a dataset into my database', text: `I downloaded [DATASET NAME] to data/[FILE].csv. Its license is [LICENSE].
1. Look at the file and show me the columns and 5 sample rows.
2. Design a clean table for it in my Neon database (only the columns my app needs).
3. Write an import script that cleans obvious problems (blank rows, duplicates, bad dates) and reports how many rows it loaded and skipped.
4. Add the required credit line to my app's About or footer page.
Do not commit the raw data file if it is over 50 MB; add it to .gitignore instead.` },
        { t: 'check', q: 'A dataset is licensed CC BY-NC. Can you use it in your paid app?', options: [
          'Yes, it is open data',
          'No, NC means non-commercial only',
          'Yes, if you rename the columns',
        ], answer: 1, explain: 'NC = non-commercial. Find a CC0, CC BY or ODbL source instead, or ask the owner for permission.' },
        { t: 'recap', items: [
          'Check Kaggle, Hugging Face, Data.gov, Open Food Facts and OpenStreetMap before building a scraper.',
          'Read the license: CC0 and CC BY are easy; NC is not for paid apps.',
          'Import into your own database and credit the source.',
        ] },
      ],
    },
    {
      id: 'file-uploads',
      title: 'Let users upload photos and files safely',
      minutes: 12,
      body: [
        { t: 'why', text: 'Profile photos, receipts, PDFs, voice notes: almost every app ends up needing uploads. Done wrong, uploads are slow, expensive and one of the most common ways private files leak. Done right, it is a short, standard recipe.' },
        { t: 'analogy', text: 'File storage is a coat check. You hand over your coat (the file), the coat check keeps it in the back, and you get a small ticket (the file\'s address). Your database keeps the tickets, not the coats. And only the person with the right ticket gets the coat back.' },
        { t: 'snap', src: 'shots/vercel-blob.jpg', url: 'vercel.com/docs/vercel-blob', caption: 'Vercel Blob: file storage built into your Vercel account. Cloudflare R2 is a cheaper alternative for very large files.' },
        { t: 'h', text: 'The safe upload recipe' },
        { t: 'steps', items: [
          { do: 'Files go to **file storage** (Vercel Blob or Cloudflare R2), never into the database.', why: 'Databases are slow and expensive for big files.' },
          { do: 'The database saves only a small record: file path, type, size, and **who owns it**.', why: 'So lists stay fast and you always know whose file it is.' },
          { do: 'Check **type and size** on the server: for example, only JPG/PNG/PDF, max 10 MB.', why: 'Stops someone uploading a 5 GB video or a disguised program.' },
          { do: 'Keep files **private** and hand out **short-lived links** only to the owner.', why: 'A public file with a guessable address is a public file.' },
          { do: 'Give each file a **random name** in the user\'s folder (users/123/8f3a…jpg).', why: 'Never trust or reuse the name the user\'s computer gave it.' },
          { do: 'Shrink big photos before saving.', why: 'Phone photos are 5 MB; your app needs 200 KB. Faster and cheaper for everyone.' },
        ] },
        { t: 'prompt', label: 'Add safe file uploads', text: `Add [profile photo / receipt / document] uploads to my app using Vercel Blob.
- Allowed types: [JPG, PNG, PDF]. Max size: [10 MB]. Check both on the server, not just in the browser.
- Store files privately in a folder per user with random file names.
- Save only path, type, size, owner and upload date in a "files" table in Neon.
- Only the owner (and admins) can view or delete a file, through short-lived signed links.
- Resize images to max 1600px wide before storing.
- Show a progress bar, a friendly error for wrong type or size, and work on phones (including taking a photo with the camera).
Help me connect Vercel Blob to the project first, and if a token is needed, collect it only through a hidden terminal prompt.${SAFE}` },
        { t: 'tip', tone: 'safe', text: 'On phones, an upload input with `accept="image/*"` lets people pick a photo or take one with the camera. No app store needed.' },
        { t: 'check', q: 'Where should an uploaded receipt photo be stored?', options: [
          'In the database as text',
          'In private file storage, with a small record (path, owner) in the database',
          'In the public folder of the website',
        ], answer: 1, explain: 'Private storage for the file, a small record in the database, and signed links for viewing.' },
        { t: 'recap', items: [
          'Files in file storage; small records in the database.',
          'Check type and size on the server; random names; private by default.',
          'Short-lived signed links, only for the owner.',
        ] },
      ],
    },
    {
      id: 'phone-scanning',
      title: 'Scanning apps: barcodes, receipts and documents with a phone',
      minutes: 13,
      body: [
        { t: 'why', text: 'Some of the most useful small-business apps are just "point your phone at it": scan a barcode to count inventory, snap a receipt to log an expense, photograph a form to fill it in. You can build these as a normal website that works on any phone, no app store required.' },
        { t: 'analogy', text: 'Your phone camera becomes a hand scanner at a supermarket checkout. The website is the cash register: it hears the "beep" (the code or text the camera read) and looks up what it is.' },
        { t: 'h', text: 'Three kinds of scanning' },
        { t: 'table', head: ['What you scan', 'How it works', 'Tools'], rows: [
          ['**Barcodes and QR codes**', 'The camera reads the code; your app looks up the number', 'Browser BarcodeDetector, ZXing library, Google ML Kit (in native apps)'],
          ['**Receipts, labels, forms**', 'Take a photo; an AI vision model reads the text and returns clean data', 'Claude (vision), with a strict JSON format'],
          ['**Product lookups**', 'Turn a barcode number into a name, ingredients or price', 'Open Food Facts API, your own products table'],
        ] },
        { t: 'snap', src: 'shots/mlkit-barcode.jpg', url: 'developers.google.com/ml-kit · Barcode scanning', caption: 'Google ML Kit: free, on-device barcode scanning for native Android and iOS apps.' },
        { t: 'snap', src: 'shots/openfoodfacts.jpg', url: 'world.openfoodfacts.org', caption: 'Open Food Facts: a free, open database of food products you can look up by barcode.' },
        { t: 'h', text: 'Build a barcode scanner (website, works on phones)' },
        { t: 'prompt', label: 'Build a phone barcode scanner', text: `Add a barcode scanner page to my app for [USE, e.g. "counting inventory in my store"].
- It opens the phone's back camera in the browser (ask permission politely, explain why).
- Use the browser's BarcodeDetector where available, with the ZXing library as a fallback for iPhone and older phones.
- Beep and vibrate on a successful scan, then show the product.
- Look the code up in my products table first; if not found, [look it up in the Open Food Facts API / let me add it].
- Big buttons, works one-handed, and works on HTTPS (camera needs it).
Test it on my phone using the Vercel preview link.${SAFE}` },
        { t: 'h', text: 'Read receipts and documents with AI' },
        { t: 'p', text: 'Claude can look at a photo and pull out the parts you need. The trick is to ask for an exact format (JSON) and to let the user check the result before saving.' },
        { t: 'prompt', label: 'Scan receipts into expenses', text: `Add receipt scanning to my app:
1. The user takes or uploads a photo (use my safe file upload setup).
2. My server sends the photo to Claude and asks for JSON only: { "store", "date", "total", "tax", "items": [{ "name", "price" }] }.
3. Show the result in an editable form so the user can fix mistakes before saving. Never save without their OK.
4. If the photo is blurry or not a receipt, say so kindly and ask for a new photo.
5. Use my Anthropic API key from .env.local (if I do not have one, help me add it through a hidden terminal prompt).
Add 5 sample receipt photos to evals/ and a test that checks the totals are read correctly.${SAFE}` },
        { t: 'tip', tone: 'warn', text: 'Receipts, IDs and forms contain personal data. Store photos privately, delete them when no longer needed, and never send ID documents to AI unless your privacy policy says so.' },
        { t: 'deeper', title: 'Website or real app?', blocks: [
          { t: 'p', text: 'A website (PWA) can use the camera, vibrate, and be added to the home screen. That is enough for most scanning apps. Go native with **Expo** (see the mobile lesson) when you need very fast continuous scanning, offline use in a warehouse, or Bluetooth scanners.' },
          { t: 'p', text: 'The browser BarcodeDetector API is built into Chrome on Android. iPhone Safari support is limited, which is why a fallback library like ZXing matters.' },
        ] },
        { t: 'check', q: 'After AI reads a receipt, what should happen before saving?', options: [
          'Save it straight away, AI is always right',
          'Show the user an editable form so they can confirm or fix it',
          'Email it to the admin',
        ], answer: 1, explain: 'AI is usually right, not always. A quick human check keeps the data trustworthy.' },
        { t: 'recap', items: [
          'Barcodes: camera in the browser plus a lookup (your table or Open Food Facts).',
          'Receipts and forms: photo to Claude, strict JSON back, user confirms.',
          'A website works on phones; go native with Expo only when you need to.',
        ] },
      ],
    },
    {
      id: 'rag',
      title: 'RAG: make AI answer from YOUR documents',
      minutes: 14,
      body: [
        { t: 'why', text: [
          'Ask a normal chatbot about your gym\'s cancellation policy and it will confidently make something up. It has never seen your documents. **RAG** fixes that: before the AI answers, your app finds the right pages from your own documents and hands them over with the question.',
          'It is how "chat with our help center", "ask the employee handbook" and "search my notes" products work.',
        ] },
        { t: 'analogy', text: 'RAG is an open-book exam. The AI is a smart student, but it has not studied your company. RAG lets it flip to the right page of your binder before answering, and cite the page.' },
        { t: 'p', text: '**RAG** stands for **Retrieval-Augmented Generation**: *retrieve* the right pieces of your documents, *augment* the question with them, then *generate* the answer.' },
        { t: 'h', text: 'How it works, in four steps' },
        { t: 'steps', items: [
          { do: '**Chop** your documents into small pieces (a few paragraphs each).', why: 'The AI only needs the relevant paragraph, not the whole 200-page manual.' },
          { do: '**Embed** each piece: turn it into a list of numbers that captures its meaning (an embedding).', why: 'Pieces about similar things get similar numbers, so "cancel my plan" finds "ending your membership" even with different words.' },
          { do: '**Store** the pieces and numbers in your database. Postgres does this with the **pgvector** extension, which Neon supports.', why: 'No new service needed: your existing database becomes a search engine.' },
          { do: 'When a question comes in, **find** the 5 closest pieces and send them to Claude with the question, asking it to answer only from them and cite them.', why: 'Grounded, checkable answers instead of guesses.' },
        ] },
        { t: 'snap', src: 'shots/pgvector.jpg', url: 'github.com/pgvector/pgvector', caption: 'pgvector: the free, open-source Postgres extension that stores embeddings and finds the closest matches. Neon supports it.' },
        { t: 'tip', tone: 'info', text: 'Claude answers questions, but you need a separate **embedding model** to turn text into numbers. Anthropic recommends Voyage AI; OpenAI and open-source models (run with Ollama) work too. It is a second API key, added the usual hidden-terminal way.' },
        { t: 'prompt', label: 'Add "ask my documents" (RAG)', text: `Add a "Ask our docs" feature to my app using RAG.
- Documents: [WHERE, e.g. "the PDFs and Markdown files in docs/"].
- Turn on pgvector in my Neon database. Store chunks (about 500 words, with a little overlap), their source file and page, and their embeddings.
- Use [Voyage AI] for embeddings. Help me add the key through a hidden terminal prompt only.
- Write an ingest script I can re-run when documents change (it skips unchanged files).
- When someone asks a question: find the 5 most similar chunks, send them to Claude with the question, and tell Claude to answer ONLY from them, cite the sources, and say "I don't know" if the answer is not there.
- Show the answer with clickable source links.
- Only show each user documents they are allowed to see.${SAFE}` },
        { t: 'prompt', label: 'Test my RAG answers', text: `Write 15 test questions for my "Ask our docs" feature in evals/rag.json, with the expected answer and the source document for each. Include 3 questions whose answers are NOT in the docs (the right response is "I don't know").
Run them and show a table: correct answer, correct source, and whether it made anything up. Suggest fixes for anything that fails (chunk size, more results, better instructions).` },
        { t: 'deeper', title: 'When you do not need RAG', blocks: [
          { t: 'p', text: 'If all your documents fit in Claude\'s context (a few hundred pages), you can simply include them in the prompt, with **prompt caching** so you do not pay full price each time. RAG matters when you have too much text, it changes often, or different users may see different documents.' },
          { t: 'p', text: 'Good RAG mixes meaning search (embeddings) with plain keyword search, so exact names and codes are found too. This is called **hybrid search**, and Postgres can do both.' },
        ] },
        { t: 'check', q: 'What does RAG add to a normal chatbot?', options: [
          'A nicer chat bubble',
          'It finds relevant pieces of your own documents and gives them to the AI with the question',
          'It makes the AI model smarter by retraining it',
        ], answer: 1, explain: 'RAG does not retrain anything. It hands the AI the right pages at question time, like an open-book exam.' },
        { t: 'recap', items: [
          'RAG = find the right pieces of your documents, then answer from them.',
          'Neon Postgres + pgvector stores and searches embeddings; no extra database.',
          'Tell Claude to answer only from the sources, cite them, and say "I don\'t know".',
        ] },
      ],
    },
  ],
};
