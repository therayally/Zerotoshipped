export default {
  id: 'ui',
  title: 'Beautiful UI',
  lessons: [
    {
      id: 'look-good',
      title: 'Fonts and UI kits',
      minutes: 10,
      body: [
        { t: 'why', text: 'People decide whether to trust your app in about one second, before they read a single word. Good fonts and well-made buttons are not decoration. They are what makes a stranger believe your app is real and safe to put their card into.' },
        { t: 'p', text: '**UI** stands for **user interface**: everything a person sees and touches. The good news is you do not have to design buttons from scratch. Free, professional building blocks already exist, and Claude Code knows how to use them.' },
        { t: 'h', text: 'Fonts: where to get them, and the license trap' },
        { t: 'links', items: [
          { label: 'Google Fonts', url: 'https://fonts.google.com', note: 'Free for anything, including business. Start here.' },
          { label: 'Fontshare', url: 'https://www.fontshare.com', note: 'Free, stylish, OK for business use.' },
          { label: '1001 Free Fonts', url: 'https://www.1001freefonts.com', note: 'Huge variety, but many are personal use only.' },
        ] },
        { t: 'p', text: 'That last note matters. "Free to download" does not always mean "free to use in a product you sell." Many fonts on big collection sites are **personal use only**. If you use one in a paid app or an ad, the designer can legally ask you to pay or stop. Google Fonts and Fontshare are safe for business; on other sites, open the license file before you use a font.' },
        { t: 'tip', tone: 'info', text: 'Rule of thumb: use one font family for everything, plus a code font if you show code. Two families max. More than that looks messy, not creative.' },
        { t: 'h', text: 'UI kits: ready-made buttons, menus and cards' },
        { t: 'links', items: [
          { label: 'shadcn/ui', url: 'https://ui.shadcn.com', note: 'Clean and modern. The default choice for Next.js.' },
          { label: 'Material UI', url: 'https://mui.com', note: 'Google-style components. This app is built with it.' },
          { label: 'Flowbite', url: 'https://flowbite.com', note: 'Tailwind pieces you copy in.' },
          { label: 'Lucide', url: 'https://lucide.dev', note: 'Free, simple icons.' },
        ] },
        { t: 'p', text: 'Pick **one** kit and stick to it. Mixing kits is the fastest way to get buttons that are slightly different sizes and a page that feels "off" without anyone being able to say why.' },
        { t: 'h', text: 'Show, don\'t tell: screenshots' },
        { t: 'p', text: 'Describing a design in words is hard. Showing a picture is easy, and Claude can see pictures.' },
        { t: 'steps', items: [
          { do: '**Mac:** press Cmd + Shift + 4, then drag a box around what you like.', why: 'The picture saves to your desktop.' },
          { do: '**Windows:** press Windows + Shift + S, then drag a box.' },
          { do: 'Drag the picture into the Claude Code window, or press **Ctrl + V** to paste it.', why: 'On a Mac, pasting images into Claude Code uses Ctrl + V, not Cmd + V.' },
        ] },
        { t: 'prompt', label: 'Copy a style you like', text: `I attached a screenshot of a design I like. Make my home page feel like it: similar spacing, colors, and layout. Do not copy logos, text, or images from it.
Use the [FONT NAME] font from Google Fonts, loaded with next/font.
Use shadcn/ui for buttons and cards.
Make it look good on phones and laptops, and add a light and dark mode.` },
        { t: 'deeper', title: 'Why next/font, and how component libraries differ', blocks: [
          { t: 'p', text: '`next/font` downloads Google Fonts when your app is built and serves them from your own site. Visitors\' browsers never contact Google (better privacy), the font never "pops in" late (no layout jump), and only the letters you use are included.' },
          { t: 'p', text: 'shadcn/ui copies component code **into your project**, so you own and can edit it. Material UI is an installed package with a theming system. Flowbite and daisyUI are collections of Tailwind class names. All are fine; the point is consistency.' },
        ] },
        { t: 'check', q: 'You found a great font on a free font site for your paid app. What should you do first?', options: [
          'Use it, it says free',
          'Check its license: many free fonts are personal use only',
          'Rename the font so nobody knows',
        ], answer: 1, explain: '"Free to download" is not "free for business." Google Fonts and Fontshare are safe; elsewhere, read the license.' },
        { t: 'recap', items: [
          'One font family (two max), from a source that allows business use.',
          'Pick one UI kit and stick with it.',
          'Show Claude screenshots of designs you like instead of describing them.',
        ] },
      ],
    },
    {
      id: 'ui-rules',
      title: 'The 7 rules of beautiful UI',
      minutes: 12,
      figure: 'spacing',
      body: [
        { t: 'why', text: 'Beautiful apps are not made by artistic geniuses. They follow a small set of rules, very strictly. Ugly apps break them, usually without knowing. Learn these seven and you will be able to see exactly why a page looks "cheap," and tell Claude how to fix it.' },
        { t: 'h', text: 'Rule 1: only use a few spacing sizes' },
        { t: 'p', text: 'Every gap on the page (between a title and a paragraph, inside a button, between cards) should be one of a few sizes: **4, 8, 12, 16, 24, 32, 48 or 64 pixels**. Never 13. Never 27. The picture above shows why: repeated gaps create rhythm, and rhythm feels calm and professional.' },
        { t: 'h', text: 'Rule 2: one font, maybe two' },
        { t: 'p', text: 'One font for everything, maybe a second for big headings, and a code font only if you show code. Personality comes from size and weight (bold vs regular), not from a pile of fonts.' },
        { t: 'h', text: 'Rule 3: about five text sizes' },
        { t: 'p', text: 'Small, normal, large, larger, huge. Each step should be noticeably bigger than the last (about 1.2 to 1.25 times). That makes it instantly clear what is a heading and what is a detail.' },
        { t: 'h', text: 'Rule 4: calm colors plus one bright one' },
        { t: 'p', text: 'Most of the page should be neutral: white, grays, near-black. Then **one** accent color for the things you want people to click. When color is rare, it means something. When everything is colorful, nothing stands out.' },
        { t: 'h', text: 'Rule 5: line everything up' },
        { t: 'p', text: 'Every edge should line up with some other edge. Text starts at the same left line. Cards in a row share the same top. Your eye notices these invisible lines even when you do not.' },
        { t: 'h', text: 'Rule 6: same size buttons, same corners' },
        { t: 'p', text: 'All buttons in a row are the same height. Every card and button uses the same corner roundness. Mismatched button heights in one row is the single most common "this looks amateur" signal.' },
        { t: 'h', text: 'Rule 7: dark mode is designed, not flipped' },
        { t: 'p', text: 'Dark mode is not "make the background black." It needs its own slightly-gray backgrounds, softer colors, and readable text. Both modes should look planned.' },
        { t: 'analogy', text: 'Design rules are like the rules of a sport. A pro and a beginner can both kick a ball, but the pro follows the rules so precisely that it looks effortless. These seven rules are what make an app look effortless.' },
        { t: 'h', text: 'Make Claude follow the rules: a design system' },
        { t: 'p', text: 'A **design system** writes these rules down as code: named spacing sizes, named colors, named text sizes. Then every page has to use those names. Claude can no longer make up a random 13-pixel gap, because 13 is not on the list.' },
        { t: 'prompt', label: 'Make your design system', text: `Create a design system for my app before we build more pages:
1. A tokens file with: a spacing scale (4, 8, 12, 16, 24, 32, 48, 64), 5 font sizes, 2 font weights, border radius values, and colors as named tokens (background, surface, border, text, muted text, one accent, success, warning, danger).
2. A light theme and a dark theme using the same token names.
3. Buttons, inputs and cards that only use these tokens. All buttons the same height (40 or 44 px).
4. A page at /styleguide that shows every token and component so I can check them.
Never use a color or spacing number that is not a token. If you need a new one, ask me first.` },
        { t: 'deeper', title: 'The design reasoning behind each rule', blocks: [
          { t: 'table', head: ['Rule', 'Why it works'], rows: [
            ['4/8 px spacing scale', 'Repeated intervals read as rhythm; one-off gaps read as mistakes'],
            ['Modular type scale', 'A fixed ratio between sizes creates clear hierarchy without guesswork'],
            ['Neutrals + one accent (60/30/10)', 'Color only carries meaning when it is rare'],
            ['Alignment grid', 'Shared edges create invisible lines that group content'],
            ['Uniform control heights', 'Mismatched heights are the most visible sign of carelessness'],
            ['Themed dark mode', 'Pure black kills depth; slightly lighter surfaces show layers'],
          ] },
          { t: 'p', text: 'For dark mode: use very dark gray (around #0F1113), raise surfaces by making them a little lighter instead of adding heavy shadows, soften the accent a bit, and keep body text contrast at least 4.5 to 1.' },
          { t: 'p', text: 'Ask Claude to enforce tokens automatically ("flag any hex color or px value outside the tokens"). Rules a computer checks survive months of AI edits; rules in your head do not.' },
        ] },
        { t: 'check', q: 'Your page has buttons that are 38, 42 and 44 pixels tall in the same row. Which rule is broken?', options: [
          'Rule 4: colors',
          'Rule 6: same size buttons',
          'Rule 2: fonts',
        ], answer: 1, explain: 'Mismatched heights in one row is the most common "looks amateur" signal. A design system with one button height fixes it everywhere at once.' },
        { t: 'recap', items: [
          'Few spacing sizes, one or two fonts, about five text sizes.',
          'Neutral colors plus one accent; line everything up.',
          'Same button heights and corners; dark mode designed on purpose.',
          'A design system makes Claude follow the rules every time.',
        ] },
      ],
    },
    {
      id: 'ui-references',
      title: 'Steal like an artist',
      minutes: 9,
      body: [
        { t: 'why', text: 'Professional designers almost never start from a blank page. They collect examples they love, figure out **why** those examples work, and mix those ideas into something new. You can do exactly the same, and with Claude, it takes minutes instead of days.' },
        { t: 'h', text: 'Where to find great designs' },
        { t: 'links', items: [
          { label: 'Dribbble', url: 'https://dribbble.com', note: 'Beautiful concept designs. Great for mood and color.' },
          { label: 'Mobbin', url: 'https://mobbin.com', note: 'Screens from real, shipped apps. Great for layout.' },
          { label: 'Godly', url: 'https://godly.website', note: 'Stunning websites.' },
          { label: 'Land-book', url: 'https://land-book.com', note: 'Landing page ideas.' },
        ] },
        { t: 'p', text: 'A tip: Dribbble shows what is *possible*; Mobbin shows what *real apps actually ship*. Use Dribbble for the feeling you want, Mobbin for how to lay out real screens.' },
        { t: 'h', text: 'The screenshot loop' },
        { t: 'steps', items: [
          { do: 'Save 3 to 5 screenshots you love into a folder called **inspiration** in your project.', why: 'More than one example stops you from copying a single design.' },
          { do: 'Ask Claude what they have in common.', why: 'Naming the qualities ("big headings, lots of white space, one purple accent") is what turns taste into instructions.' },
          { do: 'Ask Claude to rebuild your page using those qualities and your design system.' },
          { do: 'Screenshot your page, show it to Claude, and ask what still looks off.', why: 'This is the step most people skip, and it is where good becomes great.' },
          { do: 'Repeat until it feels right.' },
        ] },
        { t: 'prompt', label: 'Match the vibe, not the copy', text: `Look at the images in the inspiration folder.
1. List what they have in common: spacing, corner roundness, colors, fonts, shadows, layout.
2. Rebuild my [PAGE NAME] page using those ideas, but only with my design tokens.
3. Do not copy any logo, text, photo or exact layout. Make it ours.
4. Then take a screenshot of the page at 1440 px and 375 px wide and tell me 3 things that still look off.` },
        { t: 'tip', tone: 'warn', text: 'Inspiration is fine. Copying someone\'s exact design, logo, photos or text is not, and can get you a legal letter. Mix ideas from several places and make it yours.' },
        { t: 'deeper', title: 'Making the loop precise', blocks: [
          { t: 'steps', items: [
            '**Name qualities, not sites.** "8 px grid, 16 px card corners, soft borders, one saturated accent" transfers; "make it like Stripe" does not.',
            '**Critique with numbers.** Ask for spacing measurements, contrast ratios and alignment problems, not "is it pretty?"',
            '**Check phone and laptop every time.** Most layout bugs only show up at phone width.',
          ] },
          { t: 'p', text: 'Copyright protects specific creative work (artwork, text, photos, logos, a very distinctive look), not general layout ideas. Build from patterns, not from someone else\'s files.' },
        ] },
        { t: 'check', q: 'Why collect several inspiration screenshots instead of one?', options: [
          'Claude needs at least five pictures to work',
          'Mixing several sources helps you find the shared qualities and avoid copying one design',
          'One picture is too small',
        ], answer: 1, explain: 'Patterns that repeat across good designs are the real lesson, and mixing them makes the result yours.' },
        { t: 'recap', items: [
          'Collect examples from Dribbble (mood) and Mobbin (real layouts).',
          'Name what they have in common, then build with your design system.',
          'Screenshot, critique, repeat. Inspire, never copy.',
        ] },
      ],
    },
    {
      id: 'ui-polish',
      title: 'The polish pass',
      minutes: 10,
      body: [
        { t: 'why', text: 'AI-built apps usually look great in the screenshot and fall apart the moment you actually use them: a button that does nothing visible when clicked, a blank screen while loading, an error that just says "Error." The polish pass is what separates a demo from a product.' },
        { t: 'h', text: 'Every interactive thing has several "looks"' },
        { t: 'table', head: ['State', 'What it means', 'If you forget it'], rows: [
          ['Hover', 'The mouse is over it', 'Nothing feels clickable'],
          ['Focus', 'Chosen with the keyboard (Tab key)', 'Keyboard users get lost; it fails accessibility'],
          ['Disabled', 'Cannot be used right now', 'People click and nothing happens'],
          ['Loading', 'Working on it', 'People click again and again, causing double orders'],
          ['Empty', 'Nothing here yet', 'A blank screen that looks broken'],
          ['Error', 'Something went wrong', 'Confused users who leave'],
        ] },
        { t: 'p', text: 'Look at the "if you forget it" column. Every one of those is a real way you lose users, or worse, charge someone twice.' },
        { t: 'h', text: 'The small things that add up' },
        { t: 'steps', items: [
          { do: 'Keep animations short: about a quarter of a second.', why: 'Long or bouncy animations feel slow after the first time.' },
          { do: 'Make buttons at least 44 pixels tall on phones.', why: 'That is roughly the size of a fingertip. Smaller buttons cause mis-taps.' },
          { do: 'Make sure text is easy to read in both light and dark mode.', why: 'Light gray text on white looks elegant and is unreadable for many people.' },
          { do: 'Check everything on your actual phone.', why: 'Most of your TikTok audience will open your app on a phone first.' },
        ] },
        { t: 'prompt', label: 'Run a UI audit', text: `Do a UI polish audit of my app. Check every page at 1440 px and 375 px wide, in light and dark mode.
Make a list of problems sorted by how bad they look:
- buttons or inputs in the same row with different heights
- anything not lined up
- spacing that is not on my spacing scale
- missing hover, focus, disabled, loading, empty or error states
- text with low contrast (below 4.5 to 1)
- tap targets smaller than 44 px
- anything that scrolls sideways on a phone
Fix the top 5, then show me before and after screenshots.` },
        { t: 'deeper', title: 'Motion and accessibility, properly', blocks: [
          { t: 'steps', items: [
            '150 to 250 ms for most transitions; ease-out when things appear, ease-in when they leave.',
            'Animate only opacity and position (cheap for the graphics chip); avoid animating sizes and layout.',
            'Respect `prefers-reduced-motion`: some people get motion sickness from animation.',
            'WCAG AA contrast: 4.5:1 for normal text, 3:1 for large text and important borders.',
            'Everything reachable with the Tab key, with a visible focus ring, in a sensible order.',
            'Labels on every input, alt text on meaningful images, real buttons for actions.',
            'Loading placeholders shaped like the real content stop the page from jumping.',
          ] },
          { t: 'p', text: 'Chrome has a free tool called **Lighthouse** (right-click → Inspect → Lighthouse) that scores accessibility and speed. Aim for 90+ on both.' },
        ] },
        { t: 'check', q: 'A "Pay" button has no loading state. What is the real risk?', options: [
          'It looks slightly less pretty',
          'People click again while it is working, and may get charged twice',
          'Nothing, payments are instant',
        ], answer: 1, explain: 'Missing states are not just cosmetic. A disabled, loading "Pay" button prevents double charges.' },
        { t: 'recap', items: [
          'Every button needs hover, focus, disabled and loading looks; every list needs empty and error states.',
          'Short animations, 44 px tap targets, readable contrast.',
          'Run the UI audit prompt and always check on a real phone.',
        ] },
      ],
    },
  ],
};
