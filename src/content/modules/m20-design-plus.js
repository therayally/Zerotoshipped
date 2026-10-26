// Extra Beautiful UI lessons: a gallery of great interfaces, planning in Figma, AI mockups, and a DESIGN.md that keeps Claude on-style.
export const designPlus = [
  {
    id: 'ui-gallery',
    title: 'A gallery of beautiful UI (and why it works)',
    minutes: 10,
    body: [
      { t: 'why', text: 'You cannot ask for "beautiful" if you have never looked closely at it. Spend ten minutes with these real, shipped products and you will start to see the same handful of tricks everywhere. Then you can ask Claude for exactly those tricks by name.' },
      { t: 'analogy', text: 'Learning design by looking is like learning to cook by tasting at great restaurants. You do not need to be a chef to notice "this is salty, this is fresh." Once you can name what you taste, you can ask for it.' },
      { t: 'h', text: 'Linear: calm, dark and precise' },
      { t: 'snap', src: 'shots/ui-linear.jpg', url: 'linear.app', caption: 'Linear: one accent color, lots of empty space, and text that steps down in clear sizes.' },
      { t: 'p', text: 'Notice: almost everything is gray, white or black. There is only one brand color, used sparingly. Headlines are big, everything else is small and quiet. Generous empty space makes it feel expensive.' },
      { t: 'h', text: 'Stripe: one big idea per screen' },
      { t: 'snap', src: 'shots/ui-stripe-home.jpg', url: 'stripe.com', caption: 'Stripe: one bold gradient, one clear headline, one main button.' },
      { t: 'p', text: 'Notice: the eye knows exactly where to go. One headline, one sentence, one bright button. The colorful art is on one side so the words stay easy to read.' },
      { t: 'h', text: 'Vercel: black and white, nothing extra' },
      { t: 'snap', src: 'shots/ui-vercel-home.jpg', url: 'vercel.com', caption: 'Vercel: pure black and white, a single shape, and logos of customers for trust.' },
      { t: 'p', text: 'Notice: no color at all, and it still looks premium. A row of well-known customer logos does the convincing.' },
      { t: 'h', text: 'shadcn/ui blocks: a real app dashboard' },
      { t: 'snap', src: 'shots/ui-shadcn.jpg', url: 'ui.shadcn.com/blocks', caption: 'shadcn/ui blocks: free, ready-made dashboards, sign-in pages and sidebars you can paste into your app.' },
      { t: 'p', text: 'Notice: cards with the same rounded corners, numbers in big text with a small label underneath, and a sidebar with icons. You can tell Claude "use the shadcn dashboard-01 block" and get this layout in minutes.' },
      { t: 'h', text: 'Where to find more' },
      { t: 'snap', src: 'shots/ui-mobbin.jpg', url: 'mobbin.com', caption: 'Mobbin: hundreds of thousands of screenshots from real apps. Search "onboarding" or "checkout" to see how the best apps do it.' },
      { t: 'snap', src: 'shots/ui-dribbble.jpg', url: 'dribbble.com', caption: 'Dribbble: designers\' concept work. Great for mood and color, but some designs are too fancy to build.' },
      { t: 'table', head: ['The trick', 'What to ask Claude for'], rows: [
        ['Lots of empty space', '"Double the padding and spacing; let it breathe"'],
        ['One accent color', '"Only use [COLOR] for the main button and links; everything else gray"'],
        ['Clear text sizes', '"Use 5 text sizes only: big headline, section title, body, small, tiny label"'],
        ['Same corners everywhere', '"Every card, button and input uses 8px rounded corners"'],
        ['Trust signals', '"Add a row of customer logos or a short testimonial under the hero"'],
      ] },
      { t: 'prompt', label: 'Make my app feel like a pro product', text: `Look at my home page and my main app screen.
Rewrite them using these tricks from great products like Linear, Stripe and Vercel:
- One accent color only, used for the main button and links. Everything else in calm grays.
- Double the white space between sections.
- Exactly 5 text sizes, with one big clear headline per screen.
- One main button per screen; everything else is a quieter secondary button.
- Same rounded corners on every card, button and input.
Show me before and after screenshots at phone (375px) and laptop (1440px) width.` },
      { t: 'check', q: 'What do Linear, Stripe and Vercel have in common?', options: [
        'Lots of different bright colors',
        'Few colors, lots of space, one clear thing to look at per screen',
        'Tiny text so more fits',
      ], answer: 1, explain: 'Restraint looks expensive. Every extra color, size and button competes for attention.' },
      { t: 'recap', items: [
        'Great UI is mostly restraint: few colors, few sizes, lots of space.',
        'Use Mobbin for real app screens and Dribbble for mood.',
        'Name the trick when you ask Claude ("one accent color", "double the spacing").',
      ] },
    ],
  },
  {
    id: 'figma-plan',
    title: 'Plan your screens in Figma (free)',
    minutes: 12,
    body: [
      { t: 'why', text: 'Changing a box in a drawing takes two seconds. Changing it after Claude has written the code takes a conversation, and can break things. Sketching your main screens first means Claude builds the right thing the first time.' },
      { t: 'analogy', text: 'Figma is the architect\'s floor plan. You would never tell builders "make a nice house" and hope. You give them a drawing, and they build to it.' },
      { t: 'snap', src: 'shots/figma-home.jpg', url: 'figma.com/design', caption: 'Figma: the design tool most product teams use. The free plan is plenty for one app.' },
      { t: 'h', text: 'Your first Figma file, step by step' },
      { t: 'steps', items: [
        { do: 'Go to **figma.com**, sign up free, and click **New design file**.', why: 'It runs in your browser. There is also a desktop app if you prefer.' },
        { do: 'Press **F** (frame tool) and pick **iPhone 16** from the right panel. Make a second frame called **Desktop** (1440 wide).', why: 'A frame is one screen. Designing phone first forces you to keep only what matters.' },
        { do: 'Draw boxes for each part: header, headline, main button, list, footer. Use gray boxes and real words, no colors yet.', why: 'This is a **wireframe**: the skeleton. Get the layout right before making it pretty.' },
        { do: 'Open **Community**, search **UI kit**, and duplicate a free kit (iOS, Material or shadcn).', why: 'Real buttons and inputs you can drag in, so your screens look like real apps.' },
        { do: 'When happy, select a frame, right-click **Copy/Paste as → Copy as PNG**, and paste it into Claude Code.', why: 'Claude can see images and will build to match.' },
      ] },
      { t: 'snap', src: 'shots/figma-community.jpg', url: 'figma.com/community/ui-kits', caption: 'Figma Community: thousands of free UI kits. Duplicate one and drag real components into your screens.' },
      { t: 'tip', tone: 'info', text: 'Only design your 3 to 5 most important screens. Settings pages and error pages can follow the same style without a drawing.' },
      { t: 'prompt', label: 'Build my Figma screens', text: `I pasted screenshots of my Figma frames: [NAME EACH ONE, e.g. "home (phone)", "home (desktop)", "dashboard (phone)"].
Build these screens to match the layout, spacing and order exactly. Use my DESIGN.md colors and fonts (create DESIGN.md from these screenshots if it does not exist).
Where my drawing is unclear, ask me instead of guessing.
When done, show me screenshots of your version next to mine at the same widths.` },
      { t: 'prompt', label: 'Turn my idea into a wireframe list', text: `I am building [MY APP] for [WHO]. Before I draw anything in Figma, list the 5 most important screens.
For each screen, list what goes on it from top to bottom (header, headline, main button, etc.) and the ONE thing the user should do there.
Keep it short enough that I can sketch each screen in 5 minutes.` },
      { t: 'deeper', title: 'Connect Figma straight to Claude (MCP)', blocks: [
        { t: 'p', text: 'Figma has an official **MCP server** that lets Claude Code read your frames directly (sizes, colors, text and components) instead of guessing from a picture. Check Figma\'s current docs for which plans include it.' },
        { t: 'p', text: 'Turn on **Auto layout** (Shift + A) for your frames. It makes Figma behave like real web layout (rows and columns with gaps), so what Claude builds matches more closely.' },
        { t: 'p', text: 'Name your colors and text styles in Figma (Primary, Surface, Heading 1). Use the same names in DESIGN.md so you and Claude speak the same language.' },
      ] },
      { t: 'check', q: 'Why sketch your screens before asking Claude to build them?', options: [
        'Figma makes the code for you',
        'Changing a drawing takes seconds; changing built code takes much longer and can break things',
        'Claude cannot build without Figma',
      ], answer: 1, explain: 'Cheap changes first, expensive changes later. That is the whole point of a plan.' },
      { t: 'recap', items: [
        'Wireframe your 3 to 5 key screens in Figma, phone first.',
        'Use a free Community UI kit so screens look real.',
        'Paste frames into Claude and ask it to match them exactly.',
      ] },
    ],
  },
  {
    id: 'ai-mockups',
    title: 'Imagine your UI with AI art first',
    minutes: 10,
    body: [
      { t: 'why', text: 'Not a designer? You can still have a picture of exactly what you want. AI image tools can draw a realistic mockup of your app in seconds. That picture becomes the target Claude has to hit, instead of Claude inventing a look on its own.' },
      { t: 'analogy', text: 'It is like bringing a photo to the barber. "Something modern" gets you a surprise. A photo gets you that haircut.' },
      { t: 'h', text: 'Tools that can draw UI' },
      { t: 'table', head: ['Tool', 'Good for', 'Cost'], rows: [
        ['**ChatGPT** (image generation)', 'Realistic app screenshots from a description', 'Free tier, more on paid'],
        ['**Google Gemini** (image generation)', 'Mockups and editing an existing screenshot', 'Free tier'],
        ['**Midjourney**', 'Mood, style and color ideas', 'Paid'],
        ['**v0** by Vercel / **Google Stitch**', 'Real, clickable UI from a prompt', 'Free tiers'],
        ['**Figma** AI features', 'First drafts inside your design file', 'Depends on plan'],
      ] },
      { t: 'steps', items: [
        { do: 'Describe the screen in plain words: who it is for, what is on it, the mood, and the colors.', why: 'The more specific, the more useful the picture.' },
        { do: 'Ask for **3 different versions**, then pick one and ask for small changes.', why: 'Choosing is easier than imagining.' },
        { do: 'Save the winner into your project as `design/mockup-home.png`.', why: 'A file in the project is a reference Claude can look at in every future session.' },
        { do: 'Tell Claude to build to it, and point DESIGN.md at it.', why: 'Now the look is written down, not just in your head.' },
      ] },
      { t: 'prompt', label: 'Image prompt: a mockup of my app', text: `Create a realistic, high-quality UI screenshot of a mobile app screen (iPhone, portrait) for [MY APP], which helps [WHO] to [DO WHAT].
The screen is the [HOME / DASHBOARD / CHECKOUT] screen and shows: [LIST WHAT IS ON IT, top to bottom].
Style: clean, modern, lots of white space, rounded cards, one accent color ([COLOR]), font similar to Inter. Light mode.
Make all text readable and realistic (no gibberish). Show 3 different versions side by side.` },
      { t: 'prompt', label: 'Build to my mockup', text: `I saved my chosen mockup at design/mockup-home.png (and others in the design/ folder).
1. Study it and write down its colors, fonts, spacing, corner radius and components in DESIGN.md.
2. Build the screen to match it as closely as possible with my UI kit. Do not copy any logos or brand names in the picture.
3. Show me a screenshot of yours next to the mockup and list any differences you could not match.` },
      { t: 'tip', tone: 'warn', text: 'AI images sometimes include fake brand logos or text that looks like a real company\'s. Never ship those. Use the mockup for layout and mood only.' },
      { t: 'check', q: 'Why save the mockup inside your project folder?', options: [
        'So it shows up on the website',
        'So Claude can look at the same target in every future session',
        'Figma needs it',
      ], answer: 1, explain: 'A reference image in the project (and named in DESIGN.md) keeps every future change on-style.' },
      { t: 'recap', items: [
        'Use AI image tools to draw what you want before building.',
        'Ask for 3 versions, pick one, refine it.',
        'Save it in design/ and have Claude build to it.',
      ] },
    ],
  },
  {
    id: 'design-md',
    title: 'DESIGN.md: rules that keep Claude on-style',
    minutes: 11,
    body: [
      { t: 'why', text: 'Claude does not remember last week\'s conversation. Without written rules, every new page drifts a little: a slightly different blue, a new button shape, a random font. A **DESIGN.md** file committed to your project is the rulebook Claude reads every time, so page 20 matches page 1.' },
      { t: 'analogy', text: 'DESIGN.md is a brand style guide, like the one every big company gives its designers and print shops. Coca-Cola red is always the exact same red, because it is written down, not remembered.' },
      { t: 'h', text: 'What goes in DESIGN.md' },
      { t: 'table', head: ['Section', 'Example'], rows: [
        ['Colors (with names)', 'Primary #4F6BFF, Surface #FFFFFF, Text #111827, Muted #6B7280'],
        ['Fonts and text sizes', 'Inter; 32 / 24 / 16 / 14 / 12 px'],
        ['Spacing scale', 'Only 4, 8, 12, 16, 24, 32, 48 px'],
        ['Corners and shadows', 'Radius 8px everywhere; one soft shadow for cards'],
        ['Components', 'Use shadcn/ui Button, Card, Input. Never custom buttons.'],
        ['References', 'design/mockup-home.png, design/figma-dashboard.png'],
        ['Never do', 'No gradients on text, no more than one accent color, no emoji as icons'],
      ] },
      { t: 'h', text: 'Make Claude actually follow it' },
      { t: 'steps', items: [
        { do: 'Create DESIGN.md with the prompt below and **commit it**.', why: 'Committed means it is saved in git history and every future session and teammate sees it.' },
        { do: 'Add one line to CLAUDE.md: "Read DESIGN.md before any UI change and follow it exactly."', why: 'CLAUDE.md is read automatically at the start of every session, so this links the two.' },
        { do: 'Put colors and sizes in **one theme file** in the code too (Tailwind config or theme.ts).', why: 'Then a color change happens in one place, not in 40 files.' },
        { do: 'After big UI changes, ask for a **design check** against DESIGN.md.', why: 'Catches drift before it spreads.' },
      ] },
      { t: 'prompt', label: 'Create my DESIGN.md', text: `Create DESIGN.md for this project and commit it.
Base it on [my screenshots in design/ / my Figma frames / the current app]. Include:
- Named colors (with hex codes) for light AND dark mode
- Font, and exactly 5 text sizes
- Spacing scale (only these values allowed)
- Corner radius and shadow rules
- Which UI kit components to use for buttons, cards, inputs, dialogs
- Reference images (paths) and a short "Never do" list
Then put the same values in one theme file in the code, and add to CLAUDE.md: "Read DESIGN.md before any UI change and follow it exactly. If something is not covered, ask me."` },
      { t: 'prompt', label: 'Check my app against DESIGN.md', text: `Do a design check. Compare every page against DESIGN.md at 375px and 1440px, light and dark mode.
List every place that breaks a rule (wrong color, odd spacing, off-scale text size, different button style), with the file and line.
Fix them all using the theme file, not one-off values, then show me before and after screenshots.` },
      { t: 'deeper', title: 'Design tokens, the pro version', blocks: [
        { t: 'p', text: 'Pros call these named values **design tokens**: `color.primary`, `space.4`, `radius.md`. The same tokens live in Figma, in DESIGN.md and in code, so designers and developers (and Claude) all mean the same thing.' },
        { t: 'p', text: 'You can enforce some rules automatically: a lint rule that bans raw hex colors in components, or a Claude Code **hook** that reminds Claude to check DESIGN.md whenever it edits a UI file (see the Claude Code power-user module).' },
      ] },
      { t: 'check', q: 'Claude keeps making buttons slightly different on new pages. What is the best fix?', options: [
        'Remind it in every message',
        'Write the rules in a committed DESIGN.md, link it from CLAUDE.md, and keep values in one theme file',
        'Start a new project',
      ], answer: 1, explain: 'Written, committed rules plus one theme file stop drift for good.' },
      { t: 'recap', items: [
        'DESIGN.md is your app\'s style guide: colors, fonts, sizes, spacing, components, references.',
        'Commit it and point CLAUDE.md at it so every session follows it.',
        'Keep the same values in one theme file in the code.',
      ] },
    ],
  },
];
