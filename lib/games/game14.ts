import { Game } from "./types"

/**
 * Game 14 — "Pixel Perfect" (Vera's Web Design Masterclass)
 *
 * Vera Chen, Senior Frontend Developer, gets a commission to build Jake's
 * official portfolio site. Three AI-generated mockups are waiting. Her job:
 * decide which one is RIGHT — and make it better.
 *
 * The game teaches web design as DECISION-MAKING, not aesthetics.
 * AI tools generate options. Humans defend the choices.
 *
 * Character: Vera Chen, 29-year-old Senior Frontend Dev & Design Systems Architect
 * Boss: Professor Reid — legendary UX director, her former professor
 *
 * Teaching arc:
 *  0. INTRO          — The "AI vs. designer" myth, Vera's stance
 *  1. BRANCH 1       — Client brief arrives. Strategy vs. taste?
 *  2. TASTE LESSON   — Wrong path: what "feeling" without strategy costs you
 *  3. TYPOGRAPHY     — Type scale, body text rules, readability vs. legibility
 *  4. HIERARCHY      — Visual weight, focal points, one clear next action
 *  5. COLOR          — 60-30-10, contrast ratios, WCAG AA compliance
 *  6. THE 8PT GRID   — Spacing system, breathing room, why consistency matters
 *  7. CRUCIBLE       — Jake asks for everything. What do you do?
 *  8. BLOAT LESSON   — Wrong path: feature bloat + Core Web Vitals crash
 *  9. RESPONSIVE     — Mobile-first, touch targets, fluid typography
 * 10. ACCESSIBILITY  — WCAG 2.1, labels vs. placeholders, keyboard nav
 * 11. MYTH           — "AI can design for you" — the real relationship
 * 12. BOSS           — Professor Reid: 5 design-decision showdowns
 * 13. REVELATION     — Great design is decisions you can defend
 * 14. AI COMPARE     — Figma AI vs v0.dev vs Framer AI vs GitHub Copilot
 * 15. HANDOFF        — Vera passes the baton to the next track
 */

export const game14: Game = {
  slug:          "web-design",
  week:          15,
  free:          true,
  title:         "Pixel Perfect",
  emoji:         "🎨",
  icon:          "metronome" as const,
  duration:      "18 min",
  accentColor:   "#06b6d4",
  audioTrack:    "/audio/concrete-riot.mp3",

  characterName:   "Vera",
  characterRole:   "29-year-old Senior Frontend Developer",
  characterBlurb:  "She's built beautiful things. Now AI builds them faster. Her superpower: knowing when the AI is wrong.",
  characterImage:  "/images/vera.png",
  maestroImage:    "/images/maestro-vera.png",
  maestroLine:     "The last time she accepted 'make it pop' as a brief…",
  maestroSubline:  "Vera's sites don't just look good. They convert, load fast, and pass WCAG. That's the PhD.",

  description:  "Jake needs a portfolio site. Three AI mockups are waiting. Vera's job: decide what's actually good — and why. Typography, hierarchy, color, accessibility, performance. Design is not about taste. It's about decisions you can defend.",
  tagline:      "The AI generates options. The expert makes the call.",

  felipeOutroVideo: "/videos/felipe-game14.mp4",

  aiModel: "general" as const,
  mondayPrompt: "Review [URL or paste HTML/CSS]. Check against these 5 laws: 1) Typography: is body text ≥16px? Max 2 font families? 2) Contrast: does text pass 4.5:1 ratio? Check #[BG_COLOR] + #[TEXT_COLOR] at https://webaim.org/resources/contrastchecker/ 3) Hierarchy: is there exactly ONE primary CTA? 4) Spacing: does spacing follow an 8pt grid? 5) Accessibility: do interactive elements have focus states? Report each law as PASS/FAIL with the specific violation if failed.",

  nextGame: {
    slug:        "ai-for-professionals",
    character:   "Carlos",
    teaserLine:  "You've learned to design with AI. Carlos is about to use it to transform an entire enterprise. Different scale — same principle: AI amplifies the decisions of the person holding it.",
    previewImage: "/images/carlos.png",
  },

  scenes: [

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 0 — INTRO: Vera's stance on AI design tools
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-intro",
      type:      "learn",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   30,
      concept: {
        title: "The Myth That Almost Ended My Career",
        body:  "When AI design tools launched, I panicked. Figma AI could generate a hero section in 4 seconds. v0.dev could produce a React component from a sentence. My 8 years felt suddenly irrelevant.\n\nThen a client showed me an AI-generated site and said: 'I don't know why it feels wrong. Can you fix it?'\n\nThat was the day I understood. AI generates options at machine speed. But it has no idea whether those options are good. It doesn't know your user's reading level. It doesn't know that 2.8:1 contrast fails WCAG AA. It doesn't know that 11 navigation items violates Hick's Law.\n\nI fixed the site. 47% conversion increase.\n\nAI didn't replace my judgment. It just made bad judgment faster.",
      },
      learnHighlight: "AI generates options. Humans make decisions. Only one of those requires a brain.",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 1 — BRANCH 1: The brief arrives. How do you start?
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:           "wd-branch-1",
      type:         "quiz",
      skipFeedback: true,
      character:    "Vera",
      location:     "Design Studio",
      xpAward:      0,
      npcLine:      "Marcus Webb (Jake's manager) has just dropped three AI-generated mockups in your inbox. Subject line: 'Which one feels right?' — Your first move?",
      question:     "Three mockups are on your screen. How do you approach this decision?",
      choices: [
        {
          label:   "A — Go with feeling",
          text:    "\"I'll pick the one that looks most premium and modern. Design is intuitive — I'll know the right one when I see it.\"",
          correct: false,
          feedback: "Vera learned this lesson the hard way — a 'premium' site with a 23% bounce rate increase because it buried the one thing users actually came to find. Feeling is an input, not an answer.",
          leadsTo: "wd-taste-lesson",
          wrongFeedback: "**Aesthetic Intuition** is an input, not an answer — without knowing user goals, 'premium' is just a feeling that can quietly destroy conversion.",
          wrongStoryText: "Vera picks the sleek one. It looks stunning. Three weeks later, Marcus forwards the bounce rate data. Her stomach drops reading it.",
        },
        {
          label:   "B — Start with user goals",
          text:    "\"Before I evaluate any mockup, I need to know: Who visits this site? What do they need to DO on it? What does Jake want them to do?\"",
          correct: true,
          leadsTo: "wd-typography",
        },
        {
          label:   "C — Ask the client",
          text:    "\"I'll call Marcus and ask which one HE likes best. He knows Jake's brand better than I do.\"",
          correct: false,
          feedback: "Marcus knows Jake's brand — but he doesn't know what his audience needs to DO on the site. Client preference is one signal; user goals are the north star. If those conflict, user goals win.",
          leadsTo: "wd-taste-lesson",
          wrongFeedback: "Client preference is one signal, but **User Goals** are the north star — when they conflict, what users need to DO always wins.",
          wrongStoryText: "Marcus loves the choice. The site launches beautifully. Then the support inbox fills with users who can't find what they came for.",
        },
        {
          label:   "D — Check competitors",
          text:    "\"I'll look at 10 successful musician portfolio sites first. Let market validation guide the choice.\"",
          correct: true,
          leadsTo: "wd-typography",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 2 — TASTE LESSON (wrong-path detour)
    // Plays only if player chose "feeling" or "ask client"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:          "wd-taste-lesson",
      type:        "learn",
      character:   "Vera",
      location:    "Design Studio",
      xpAward:     15,
      nextLeadsTo: "wd-typography",
      concept: {
        title: "Taste Is Not a Strategy",
        body:  "I made this mistake in Year 2. Client asked which design looked better. I picked the one I liked. We shipped it.\n\nSix weeks later: bounce rate up 23%. Average session time down. The page that 'felt premium' was also confusing — users couldn't find the tour dates, which was the #1 reason they visited.\n\nFeeling and preference are inputs, not answers. When a client asks 'which one feels right?' the correct response is: 'Right for whom? Right for what goal?'\n\nDesign decisions need to be defensible. 'I liked it' is not a defense. 'Jake's core audience is 18-25, predominantly mobile, looking for tour dates and merch — and this layout surfaces both above the fold' is a defense.",
      },
      learnHighlight: "\"Feels right\" is where good designs go to die. Start with: what does the user need to DO here?",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 3 — TYPOGRAPHY: The rules you can't negotiate
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-typography",
      type:      "quiz",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   35,
      npcLine:   "Marcus just sent feedback: 'Can we make the body text smaller to fit more content above the fold? Maybe 11 or 12px?'",
      question:  "Your current body text is 16px, 1.6 line-height. Marcus wants to reduce it to save space. What's the correct response — and why?",
      choices: [
        {
          label:   "A — Agree, 12px is fine",
          text:    "\"12px still renders on modern screens. Users can zoom if needed.\"",
          correct: false,
          feedback: "12px body text fails the WCAG 2.1 minimum for readability and creates barriers for users with low vision. 'They can zoom' is not an accessible design philosophy — it transfers the burden to the user.",
          wrongStoryText: "Vera shakes her head. '12px body text is a disaster for anyone reading on mobile in daylight.'",
          wrongFeedback: "The WCAG guidance on text size exists for a reason: 12px body text is unreadable for a significant portion of your audience, especially on mobile in direct sunlight. Never make users zoom to read your content.",
        },
        {
          label:   "B — Hold at 16px minimum",
          text:    "\"16px is the browser default for a reason: it's the minimum comfortable reading size. Going below creates real barriers for users over 40 and mobile users.\"",
          correct: true,
          feedback: "Correct. 16px is not arbitrary — it maps to the default comfortable reading size in all major browsers. Reducing it to 'fit more content' trades readability for information density, which almost always hurts the user.",
          breakdown: [
            { phrase: "browser default for a reason", note: "16px = 1em = the calibrated comfortable reading size across platforms" },
            { phrase: "minimum comfortable reading size", note: "WCAG 2.1 SC 1.4.4: text must be resizable to 200% without loss of content" },
            { phrase: "users over 40", note: "Presbyopia (age-related near-vision changes) affects ~50% of adults — your audience is real people with real eyes" },
          ],
        },
        {
          label:   "C — Compromise at 14px",
          text:    "\"14px is a reasonable middle ground — still readable, and gives Marcus the denser layout he wants.\"",
          correct: false,
          feedback: "Compromise is not always the right answer in design. 14px for body text is still below the recommended minimum, especially for mobile viewing. The user's need (readability) should outweigh the client's aesthetic preference (density).",
          wrongFeedback: "Meeting in the middle on accessibility is not a compromise — it's just a different failure. 14px still creates real readability issues for a significant portion of users.",
          wrongStoryText: "Vera sends the 14px counter-proposal feeling diplomatic. Her phone buzzes — a friend over 50 opened the demo link and immediately pinched to zoom.",
        },
        {
          label:   "D — Use 14px for desktop, 16px for mobile",
          text:    "\"Responsive adjustment: 14px works fine on a desktop monitor from 24 inches. 16px protects mobile users.\"",
          correct: false,
          feedback: "Closer, but still not right. 16px should be the minimum on ALL screen sizes. On mobile, many designers actually use 17-18px to account for viewing distance and smaller displays. The correct approach is 16px minimum everywhere, scaled up for mobile with clamp().",
          wrongFeedback: "Body text at 14px on desktop still creates issues — especially in lower-contrast environments. The 16px minimum applies everywhere. Mobile-first means you design for the most constrained context first.",
          wrongStoryText: "Vera nods, but Reid taps the mobile preview. The 14px text blurs. 'Comfortable on a monitor,' he says, 'means nothing on a bus.'",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 4 — VISUAL HIERARCHY: One clear focal point per section
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-hierarchy",
      type:      "quiz",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   35,
      npcLine:   "The AI generated a homepage with four equal-weight sections: Bio, Music, Tour, Merch. Each has the same heading size, same font weight, same amount of content. It looks 'balanced.'",
      question:  "Professor Reid glances at the mockup and says: 'Vera, what does this page want me to DO first?' — How do you fix the hierarchy problem?",
      choices: [
        {
          label:   "A — Add more color variety",
          text:    "\"Use a different background color for each section — that will differentiate them visually.\"",
          correct: false,
          feedback: "Color can support hierarchy but doesn't create it. Four equally prominent sections with different backgrounds are still four equally prominent sections — the user still doesn't know what to look at first.",
          wrongStoryText: "Vera crosses her arms. 'Color variety doesn't solve hierarchy. If everything is loud, nothing is heard.'",
          wrongFeedback: "Background colors change the aesthetic, not the priority. Hierarchy requires size, weight, contrast, and whitespace working together — not just color switching.",
        },
        {
          label:   "B — Reduce sections to two",
          text:    "\"Cut it to two sections max. Less is more.\"",
          correct: false,
          feedback: "Reducing sections addresses the quantity problem but not the hierarchy problem. A page with two equally-weighted sections is still unclear about what the user should do first. The fix is establishing priority, not just removing content.",
          wrongFeedback: "Fewer sections doesn't solve hierarchy — it just reduces the confusion. You still need to tell the user: 'THIS is the most important thing on this page.'",
          wrongStoryText: "Vera deletes two sections. The page shrinks. Reid tilts his head. 'Now it's a shorter mystery. What does Jake *want* them to do?'",
        },
        {
          label:   "C — Establish a clear primary CTA",
          text:    "\"Ask Marcus: 'What's the ONE thing we want visitors to do?' — then make that the focal point. Everything else is supporting evidence.\"",
          correct: true,
          feedback: "Exactly right. Visual hierarchy starts with a question, not a tool: 'What is the most important action on this page?' For Jake's site, if the answer is 'buy merch' or 'check tour dates,' that element gets maximum visual weight — size, contrast, whitespace — and everything else defers to it.",
          breakdown: [
            { phrase: "ONE thing we want visitors to do", note: "Hick's Law: every additional option increases decision time. One clear primary action beats four equal options." },
            { phrase: "focal point", note: "Every section needs one dominant element — and the page needs one dominant section. Hierarchy is fractal." },
            { phrase: "supporting evidence", note: "Bio, Music, and other sections are reasons to trust Jake — not destinations. They support the conversion, not compete with it." },
          ],
        },
        {
          label:   "D — Make the hero section bigger",
          text:    "\"Increase the hero to full-viewport height — that creates natural priority through real estate.\"",
          correct: false,
          feedback: "Making the hero bigger is a tactic, not a strategy. A massive hero section with no clear CTA is just a big version of the same problem. The question is: what should the hero communicate, and what should the visitor do next?",
          wrongFeedback: "Size is one element of hierarchy, but it only works when combined with a clear message and CTA. A big, empty hero section just delays the confusion rather than solving it.",
          wrongStoryText: "Vera stretches the hero to full screen. Reid stares at it. 'Beautiful emptiness,' he says quietly. 'What happens after they admire it?'",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 5 — COLOR: WCAG contrast + the 60-30-10 rule
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-color",
      type:      "quiz",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   35,
      npcLine:   "Jake's brand palette: deep navy (#1A1A2E) as base, electric gold (#F4C430) as accent. The AI auto-generated CTA buttons using gold text on a white background (#FFFFFF). You check the contrast ratio: it's 1.8:1.",
      question:  "The gold-on-white CTA button has a 1.8:1 contrast ratio. What does this mean, and what do you do?",
      choices: [
        {
          label:   "A — It's fine, gold is visible",
          text:    "\"Gold is a strong, attention-grabbing color. Users will see it. The low ratio just reflects the nature of yellow hues.\"",
          correct: false,
          feedback: "Visible ≠ accessible. WCAG 2.1 SC 1.4.3 requires a minimum 4.5:1 contrast ratio for normal text. 1.8:1 fails catastrophically — this button is essentially invisible to people with low vision, in bright sunlight, or on OLED screens.",
          wrongStoryText: "Vera winces. 'Contrast ratio is a math problem, not an opinion. Yellow on white is invisible.'",
          wrongFeedback: "The argument 'I can see it' is not an accessibility argument. The WCAG standard exists precisely because what seems visible to some people is invisible to others. 1.8:1 fails Level A, the minimum accessibility standard.",
        },
        {
          label:   "B — Switch to dark text on the gold button",
          text:    "\"Put navy (#1A1A2E) text on the gold (#F4C430) background instead — that combination will hit 4.5:1+.\"",
          correct: true,
          feedback: "Yes. Navy (#1A1A2E) on gold (#F4C430) achieves ~7.2:1 contrast — well above the WCAG AA minimum of 4.5:1, and approaching AAA (7:1). This uses the existing brand palette while fixing the accessibility failure. The button now works for ALL users.",
          breakdown: [
            { phrase: "4.5:1", note: "WCAG 2.1 SC 1.4.3 minimum for normal text — applies to all text in UI elements including buttons" },
            { phrase: "Navy on gold", note: "Dark neutrals on saturated/light midtones almost always hit AA — trust the math, not the eye" },
            { phrase: "ALL users", note: "Accessibility isn't charity — it improves usability for everyone, including sighted users on bright phone screens outdoors" },
          ],
        },
        {
          label:   "C — Use white text on a dark navy button",
          text:    "\"Drop the gold button entirely. Use #FFFFFF text on #1A1A2E navy — that's ~15:1 contrast, definitely passes.\"",
          correct: false,
          feedback: "The contrast is correct (~15:1, well above WCAG AAA), but this throws away the gold accent entirely. The better solution preserves the brand palette while fixing the contrast — navy text on gold button. Don't abandon the brand to solve an accessibility problem; find a solution within the constraints.",
          wrongFeedback: "Good instinct on the contrast math — 15:1 definitely passes. But there's a solution that keeps Jake's gold accent AND passes WCAG AA. Design constraints aren't always either/or.",
          wrongStoryText: "Vera swaps to navy on white. The button passes. Marcus frowns at the screen. 'Where did the gold go? That's Jake's whole identity.'",
        },
        {
          label:   "D — The ratio rule only applies to large text",
          text:    "\"Large text (18px+ or 14px bold) only needs 3:1. If the button label is large enough, 1.8:1 might be sufficient.\"",
          correct: false,
          feedback: "The large-text threshold (3:1) applies at 18pt (24px) normal weight or 14pt (approximately 18.67px) bold. Standard CTA button text at 16px-17px doesn't qualify as 'large text' and requires 4.5:1. And even at 24px, 1.8:1 still fails the 3:1 requirement for large text.",
          wrongFeedback: "Even if large text only needs 3:1, 1.8:1 fails that too. And most button text doesn't qualify as 'large text' under WCAG. The fix is the same either way: increase the contrast.",
          wrongStoryText: "Vera cites the large-text rule confidently. Reid pulls up the spec. '16px, normal weight. That's not large text, Vera. That's a fail.'",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 6 — THE 8PT GRID: Spacing that makes sense
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-grid",
      type:      "learn",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   20,
      concept: {
        title: "Why Your Eye Detects 14px Padding Before Your Brain Does",
        body:  "The AI generated a hero section with 14px padding. Then 22px padding on the next section. Then 19px on the card component. Nothing is wrong, exactly. But something feels off.\n\nThat feeling is your visual system detecting inconsistency. The brain doesn't consciously register '14px vs 22px.' It just perceives: not aligned. Amateur. Unsettled.\n\nThe 8pt grid system fixes this. Every spacing value is a multiple of 8: 8, 16, 24, 32, 48, 64, 96. Pick any two values from this scale and they relate mathematically. The page feels ordered because it IS ordered.\n\nOn the web, I use CSS custom properties:\n```\n--space-1: 8px;  --space-2: 16px;  --space-3: 24px;\n--space-4: 32px; --space-6: 48px;  --space-8: 64px;\n```\n\nEvery padding, margin, gap, and offset uses these values. Nothing else.\n\nWhen I handed Jake's mockup to an AI tool and asked it to critique the spacing, it said: 'Spacing values are inconsistent. 14px, 22px, and 19px do not follow a mathematical scale.'\n\nThe AI was right. I fixed it in 8 minutes. The site went from 'something feels off' to 'clean and professional.'\n\nAI caught the inconsistency. I designed the system. That's how this works.",
      },
      learnHighlight: "Every spacing value is a multiple of 8. Your user's eye won't know why — but it will feel the difference.",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 7 — CRUCIBLE: Jake wants everything on the page
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:           "wd-crucible",
      type:         "quiz",
      skipFeedback: true,
      character:    "Vera",
      location:     "Design Studio",
      xpAward:      0,
      npcLine:      "Jake joins the video call. He's excited. 'Vera, I love it. Can we add a YouTube section? And a blog? And an email signup form? Oh and a Spotify playlist, my dog's Instagram, a press kit download, AND a testimonials carousel?'",
      question:     "Jake is asking for 7 additional features on a site that already has clear hierarchy. Your response?",
      choices: [
        {
          label:   "A — Add it all",
          text:    "\"The client is always right. I'll add everything he asked for and make it work somehow.\"",
          correct: false,
          feedback: "Vera said yes once. LCP hit 9.2 seconds, bounce rate went to 78%, and the client paid for a redesign eight weeks later. 'The client is always right' is not a design philosophy — it's an abdication.",
          wrongStoryText: "Vera's shoulders drop. 'Saying yes to every client request is the easiest path to a bloated, unusable site.'",
          leadsTo: "wd-bloat-lesson",
          wrongFeedback: "Saying yes to everything isn't service — it's an abdication of **design judgment** that will cost the client far more later.",
        },
        {
          label:   "B — Defend the focus",
          text:    "\"Jake, every element we add dilutes the power of every other element. Let's decide: what's the ONE thing a first-time visitor should do? Build from there.\"",
          correct: true,
          leadsTo: "wd-responsive",
        },
        {
          label:   "C — Let the AI decide",
          text:    "\"I'll run this through Figma AI and let it suggest which features fit the design system best.\"",
          correct: false,
          feedback: "Figma AI can generate all seven components flawlessly — beautiful, production-ready code. It cannot tell you whether adding them serves Jake's users or destroys his conversion rate. That judgment requires a brain, not a prompt.",
          leadsTo: "wd-bloat-lesson",
          wrongFeedback: "AI tools execute **design decisions** flawlessly — but only *you* can judge whether those decisions serve the user's actual goals.",
          wrongStoryText: "Figma AI builds all seven components perfectly. Vera presents them. Jake's bounce rate spikes. The AI never warned her. It never could.",
        },
        {
          label:   "D — Prioritize the top 2",
          text:    "\"Let's add email signup (grows his audience) and tour dates (direct conversion) — the rest becomes Phase 2.\"",
          correct: true,
          leadsTo: "wd-responsive",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 8 — BLOAT LESSON (wrong-path detour)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:          "wd-bloat-lesson",
      type:        "learn",
      character:   "Vera",
      location:    "Design Studio",
      xpAward:     15,
      nextLeadsTo: "wd-responsive",
      concept: {
        title: "What Happened When I Said Yes to Everything",
        body:  "I shipped a site like that once. The client was happy on launch day.\n\nSix weeks later:\n- LCP: 9.2 seconds (good is under 2.5s)\n- Mobile bounce rate: 78%\n- Zero merch sales from the site\n\nThe Lighthouse audit was brutal. Every YouTube embed added 400KB of JavaScript. The Spotify player added 3 external requests. The Instagram feed refreshed on every load. The testimonials carousel blocked the main thread.\n\nHick's Law: every additional option increases the time to make a decision. We didn't give users fewer choices — we gave them more. And they chose none.\n\nThe client paid for a redesign 8 weeks after launch.\n\nThe hard lesson: 'yes' to everything is not a service to the client. It's an abdication of responsibility. You are the expert. Your job is to protect the user experience — even from the person paying you.\n\nv0.dev had generated all those components flawlessly. Beautiful, production-ready code. The problem wasn't the AI. The problem was the decision to use it all.",
      },
      learnHighlight: "Adding every feature the client wants is not design. It's decoration. Design is deciding what NOT to include.",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 9 — RESPONSIVE: Mobile-first is not mobile-only
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-responsive",
      type:      "quiz",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   35,
      npcLine:   "You run a Lighthouse audit. LCP is 6.8 seconds. 67% of Jake's audience is on mobile. The AI-generated layout uses a horizontal card scroll on mobile — identical to the desktop layout but scaled down.",
      question:  "LCP of 6.8s and a shrunk desktop layout on mobile. What's the highest-impact fix?",
      choices: [
        {
          label:   "A — Optimize the hero image",
          text:    "\"The hero image is a 2.4MB PNG. Convert to WebP, add width/height attributes, and preload it. That alone can cut LCP by 40-60%.\"",
          correct: true,
          feedback: "The hero image is almost always the Largest Contentful Paint element. Converting a 2.4MB PNG to WebP typically saves 40-60%, preloading it ensures it's in the browser's queue immediately, and width/height attributes prevent Cumulative Layout Shift. This is the correct first fix.",
          breakdown: [
            { phrase: "2.4MB PNG", note: "An unoptimized PNG is the most common LCP killer. WebP equivalent is typically 800KB-1.2MB for the same quality." },
            { phrase: "preload it", note: "`<link rel='preload' as='image'>` in the `<head>` — the browser starts fetching before it renders the `<img>` tag" },
            { phrase: "width/height attributes", note: "Without these, the browser can't reserve space — causing CLS (layout shift) as the image loads, another Core Web Vital" },
          ],
        },
        {
          label:   "B — Enable browser caching",
          text:    "\"Set Cache-Control headers for all static assets. Returning visitors will load the site instantly.\"",
          correct: false,
          feedback: "Caching helps returning visitors, not first-time visitors — and Lighthouse tests first-visit performance. For a 6.8s LCP, the bottleneck is image loading, not caching. Fix the image first.",
          wrongStoryText: "Vera rubs her temples. 'Caching doesn't compress a 2MB image. It only helps the first load.'",
          wrongFeedback: "Caching is a great optimization, but it doesn't help the first visit. The LCP problem is about how fast the hero image loads — that requires image optimization, not cache headers.",
        },
        {
          label:   "C — Rebuild with a CSS-only layout",
          text:    "\"Remove all JavaScript from the initial render path — pure HTML/CSS will load instantly.\"",
          correct: false,
          feedback: "Reducing JavaScript is valuable, but if the hero image is 2.4MB, the page will still be slow regardless of JavaScript weight. Find the actual bottleneck before rebuilding everything.",
          wrongStoryText: "Vera sighs. 'Removing JavaScript is great, but it won't download a huge PNG any faster.'",
          wrongFeedback: "JS optimization is a valid long-term goal, but it won't fix a 2.4MB PNG hero image. Diagnose the bottleneck first — in this case, it's the image, not the framework.",
        },
        {
          label:   "D — Switch to a CDN",
          text:    "\"Host images on a CDN with global edge caching. Geographic latency is the real problem.\"",
          correct: false,
          feedback: "CDNs help with geographic latency and caching, but they don't compress a 2.4MB PNG. A 2.4MB image on a CDN is still 2.4MB. The fix is image optimization — then optionally a CDN for distribution.",
          wrongStoryText: "Vera crosses her arms. 'A CDN is fast, but it still has to deliver 2.4 megabytes. Compress the image first.'",
          wrongFeedback: "A CDN serves the file faster from a nearby server, but it still has to serve the full 2.4MB. You need to make the file smaller before you optimize delivery.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 10 — ACCESSIBILITY: Labels are not optional
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-accessibility",
      type:      "quiz",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   35,
      npcLine:   "Professor Reid drops into the review call unexpectedly. She's looking at the email signup form. 'Vera — the input fields use placeholder text as labels. They disappear when you start typing. What's wrong with this?'",
      question:  "The form uses placeholders as labels — e.g., placeholder='Your email'. No visible `<label>` elements. What's the accessibility problem?",
      choices: [
        {
          label:   "A — Nothing — placeholders work fine",
          text:    "\"Placeholders are visible until typing begins. Most users will understand the field before they click.\"",
          correct: false,
          feedback: "WCAG 2.1 SC 1.3.1 (Info and Relationships) and SC 3.3.2 (Labels or Instructions) both require that form inputs have programmatic labels. Placeholder text disappears when the user types, creating a memory burden — especially for users with cognitive disabilities or anyone who needs to review what they've entered.",
          wrongStoryText: "Vera sighs. 'Placeholders as labels is the #1 cause of contact form abandonment.'",
          wrongFeedback: "Placeholders as labels is one of the most common web accessibility failures. They disappear on input, aren't announced consistently by screen readers, fail in low-vision scenarios, and violate WCAG SC 3.3.2. Always use `<label>` elements.",
        },
        {
          label:   "B — Placeholders fail for screen readers and cognitive accessibility",
          text:    "\"Screen readers don't reliably read placeholder text as field labels. And once you start typing, the label disappears — creating memory load. Fix: always use visible `<label>` elements.\"",
          correct: true,
          feedback: "Exactly right. WCAG SC 3.3.2 requires Labels or Instructions for all user inputs. The accessible pattern: visible `<label>` above the field + optional placeholder for example input. Never replace the label with a placeholder.",
          breakdown: [
            { phrase: "Screen readers don't reliably", note: "Behavior varies across screen reader + browser combinations — don't design for best-case, design for the actual landscape" },
            { phrase: "label disappears", note: "The disappearing label creates cognitive load: 'What was I filling in?' — this disproportionately affects users with cognitive disabilities, memory impairments, and anxiety" },
            { phrase: "visible `<label>` elements", note: "Not just for accessibility — labels improve usability for ALL users. A/B tests consistently show form completion rates improve with visible labels" },
          ],
        },
        {
          label:   "C — Add aria-label attributes to fix it",
          text:    "\"Add `aria-label='Email address'` to each input — screen readers will announce the label even though it's not visible.\"",
          correct: false,
          feedback: "aria-label fixes the screen reader problem, but NOT the visual/cognitive accessibility problem — the label is still invisible to sighted users with cognitive disabilities. The correct fix is a visible `<label>` element, which also handles the aria association automatically via `<label for>` or wrapping.",
          wrongStoryText: "Vera winces. 'ARIA labels help screen readers, but sighted users still need to see what they are typing.'",
          wrongFeedback: "ARIA is the last resort, not the first fix. The HTML spec has a native solution: `<label>`. Use it. Visible labels fix the screen reader AND the cognitive problem in one move.",
        },
        {
          label:   "D — Only the first field needs a label",
          text:    "\"Users understand form patterns after the first field. Add a label to the email field only.\"",
          correct: false,
          feedback: "Every input needs its own label. Users don't maintain a mental model of 'what comes next' — they look at the field they're filling in. WCAG SC 3.3.2 explicitly requires labels for ALL user inputs, not just the first.",
          wrongStoryText: "Vera shakes her head. 'A user shouldn't have to guess what field they are filling out. Label all of them.'",
          wrongFeedback: "Cognitive load doesn't work by accumulation — users don't remember the pattern from the first field. Each field needs its own visible label, period.",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 11 — THE MYTH: AI can design for you
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-myth",
      type:      "learn",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   20,
      concept: {
        title: "The Design Tool That Changed My Mind",
        body:  "I spent three months trying to get Figma AI to just GIVE me the right answer.\n\nI'd type: 'Create a hero section for a musician named Jake.' It gave me 12 variations. Some were beautiful. Some were generic. One had yellow text on a white background.\n\nI kept thinking: why can't the AI just KNOW which one is right?\n\nThen I realized — it can't know, because 'right' requires context the AI doesn't have:\n- Who is Jake's audience?\n- What action should they take?\n- What does 'professional but authentic' mean for THIS specific artist?\n- Does it need to rank in Google? Load fast on 3G in India?\n\nThe AI generates OPTIONS. The decision requires JUDGMENT. And judgment requires knowing things the brief doesn't say.\n\nFigma AI can produce 12 layouts in 4 seconds. v0.dev can write the React code before I've had my coffee. Framer AI can deploy a complete site in 8 minutes.\n\nBut not one of them can tell you if it's GOOD. That's still you.\n\nYour job as a designer didn't disappear. It upgraded. You used to spend 40% of your time on execution. Now you spend 80% on decisions.",
      },
      learnHighlight: "AI generates options at machine speed. The decision still requires a brain. Your brain.",
    },
    {
      id: "wd-prompt",
      type: "prompt",
      location: "Design Studio",
      promptChallenge: {
        context:
          "Vera wants Claude to perform a WCAG AA accessibility audit on a CSS code snippet she will paste. She needs Claude to: check if the body text font size is at least 16px, verify if the contrast ratio between background and text colors passes the 4.5:1 ratio, and flag if any interactive elements lack clear hover/focus states.",
        goal:
          "Write the prompt Vera should send to Claude to perform this specific WCAG AA contrast and size audit on her CSS snippet.",
        placeholder: "Write Vera's audit prompt..."
      },
      nextLeadsTo: "w14-near-transfer",
      xpAward: 100,
    },
    {
      id:       "w14-near-transfer",
      type:     "learn",
      location: "Design Studio",
      xpAward:  0,
      concept: {
        title: "Same Guidelines. Different Stage.",
        body:  "Leo, a product designer at an educational tech startup, had to redesign the student dashboard. It was cluttered, had poor text contrast, and lacked keyboard navigation support. Instead of adding decorative elements, Leo applied the same web design systems principles: he implemented an 8pt spacing grid, scaled body typography to 16px, and audited the colors to ensure a WCAG AA contrast ratio of 4.5:1. He also added aria-labels and keyboard focus indicators. The redesign led to a 35% increase in assignments completed. Same design systems guidelines. Completely different student dashboard.",
      },
      learnHighlight: "Visual excellence in design isn't about cosmetic decorations or trends. It's about building a robust, accessible, and consistent system that users can navigate without friction.",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 12 — BOSS: Professor Reid, 5 design-decision showdowns
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-boss",
      type:      "boss",
      character: "Professor Reid",
      location:  "Office / Boardroom",
      xpAward:   0,
      npcLine:   "Professor Reid. UX director. 24 years in the industry. Your former design school professor. She's reviewing every decision you made on Jake's site.",
      bossQuestions: [
        {
          question: "You've set the hero headline in Impact font, uppercase, 80px. Your AI tool flagged no errors. Professor Reid: 'What's wrong with this choice — technically and experientially?'",
          npcLine:  "\"Impact. Uppercase. 80 pixels. And you approved this.\"",
          choices: [
            {
              label:   "A — Nothing, it's bold and striking",
              text:    "\"Impact is designed for headlines — bold, attention-grabbing. It does what a hero headline should do.\"",
              correct: false,
              feedback: "Impact is a display font with very poor spacing and readability at web sizes. All-caps at 80px creates tracking issues (letterspacing too tight in Impact) and fails WCAG's lowercase readability patterns. For web, a modern variable font with intentional display weight is always superior.",
              wrongStoryText: "Professor Reid sighs, clicking her pen. 'Bold isn't the same as legible, Vera. You know this.'",
          wrongFeedback: "Impact's **tight tracking** and poor **web hinting** make it a problematic display choice — attention-grabbing doesn't equal screen-readable.",
            },
            {
              label:   "B — It fails tracking and web rendering",
              text:    "\"Impact wasn't designed for screens. Its tight tracking at 80px creates readability issues. All-caps reduces reading speed by ~10-15%. Better: a modern display variable font with controlled tracking.\"",
              correct: true,
              feedback: "Correct. Impact was designed for newspaper headlines — heavy ink, large format. On screen at 80px, the tight tracking makes it difficult to parse. All-caps reduces readability (we recognize word shapes, not individual letters). Use a modern display typeface with intentional letterspacing control.",
            },
            {
              label:   "C — The font is fine but 80px is too large",
              text:    "\"The size is the issue — 80px is too large for most viewports and will wrap on mobile.\"",
              correct: false,
              feedback: "Size is one issue, but Impact's inherent design problems (tight tracking, poor web hinting, no optical sizing) are the primary concern. Even at 48px, Impact is a poor web font choice.",
              wrongStoryText: "Professor Reid taps the screen. 'The font is absolutely not fine. It was designed for newsprint, not LCD panels.'",
          wrongFeedback: "Size matters, but Impact's core problems — **tight tracking**, no **optical sizing** — make it a poor web font at *any* scale.",
            },
            {
              label:   "D — All-caps is the problem, not the font",
              text:    "\"Remove all-caps — the rest is fine.\"",
              correct: false,
              feedback: "Removing all-caps improves readability, but Impact's tight tracking and lack of optical sizing still make it a problematic web font choice. Both issues need to be addressed.",
              wrongStoryText: "Professor Reid shakes her head. 'Fixing the case doesn't fix the underlying tracking disaster.'",
          wrongFeedback: "All-caps hurts **readability**, but Impact's **poor web hinting** and tight **letter-spacing** remain problems that need addressing too.",
            },
          ],
        },
        {
          question: "The site has a primary CTA ('Buy Merch'), a secondary CTA ('Check Tour Dates'), and a tertiary CTA ('Stream Music') — all within 200px of each other. Professor Reid: 'What cognitive law is this violating?'",
          npcLine:  "\"Three equally visible buttons. Right next to each other. Vera — what does the research say?\"",
          choices: [
            {
              label:   "A — Fitts's Law",
              text:    "\"Fitts's Law says targets should be large and close. Three large, close buttons actually helps usability.\"",
              correct: false,
              feedback: "Fitts's Law addresses the physical ease of clicking a target — it's about size and distance. The problem here is the number of choices and their equal visual weight, which is Hick's Law territory.",
              wrongStoryText: "Professor Reid frowns. 'Fitts's Law is about physical targets, not cognitive overload. Try again.'",
          wrongFeedback: "**Fitts's Law** is about click accuracy — **Hick's Law** explains why equal-weight choices trigger decision paralysis, not physical effort.",
            },
            {
              label:   "B — Hick's Law",
              text:    "\"Hick's Law: decision time increases logarithmically with the number of choices. Three equally-weighted CTAs create paralysis — the user makes no decision. Fix: make one CTA dominant, demote the others visually.\"",
              correct: true,
              feedback: "Exactly. Hick's Law (1952) states that the time to make a decision increases by log₂(n+1) per option. Three equal-weight CTAs are not three times slower than one — they're significantly slower. The fix: one primary CTA at maximum visual weight, secondary and tertiary CTAs as text links or outlined buttons.",
            },
            {
              label:   "C — Miller's Law",
              text:    "\"Miller's Law: 7±2 items in working memory. Three items is well within the limit.\"",
              correct: false,
              feedback: "Miller's Law applies to working memory capacity, not decision-making speed. Three items is within the memory limit, but Hick's Law still applies to the decision burden of three equal-weight options.",
              wrongStoryText: "Professor Reid checks her notebook. 'Miller's Law is about short-term memory capacity. Our issue here is decision paralysis.'",
          wrongFeedback: "**Miller's Law** governs memory capacity, not choice speed — **Hick's Law** shows even three equal options logarithmically slow your decision time.",
            },
            {
              label:   "D — The Aesthetic-Usability Effect",
              text:    "\"Users perceive attractive designs as more usable. Beautiful buttons will overcome decision fatigue.\"",
              correct: false,
              feedback: "The Aesthetic-Usability Effect (Kurosu & Kashimura, 1995) shows beautiful designs are perceived as more usable — but it doesn't override Hick's Law. Users still experience decision paralysis with equal-weight options, regardless of how beautiful they are.",
              wrongStoryText: "Professor Reid scoffs. 'A beautiful interface that nobody can navigate is just art. We are building software.'",
          wrongFeedback: "The **Aesthetic-Usability Effect** shapes perception, not decision speed — **Hick's Law** paralysis persists regardless of how beautiful the buttons are.",
            },
          ],
        },
        {
          question: "Jake's brand uses #F4C430 (bright gold) as the primary accent. An AI tool suggested using gold as the BACKGROUND color for the entire navigation bar with white (#FFFFFF) text. Contrast ratio: 1.19:1. Professor Reid: 'What's your ruling?'",
          npcLine:  "\"Gold navbar. White text. The AI designed it. You approved it. Tell me the number.\"",
          choices: [
            {
              label:   "A — It's fine — gold is an accent color",
              wrongStoryText: "Professor Reid crosses her arms. 'Consistent illegibility is not a design system. It's a lawsuit.'",
              text:    "\"The gold is used throughout the brand. Consistency in the nav is appropriate.\"",
              correct: false,
              feedback: "1.19:1 contrast is nearly invisible. Regardless of brand consistency, this combination fails every accessibility standard including WCAG Level A. A 'no contrast' white-on-gold combination makes the nav unusable for a large portion of users.",
          wrongFeedback: "**Brand consistency** never overrides **WCAG 1.4.3** — a 1.19:1 contrast ratio is a compliance failure, not a design preference.",
            },
            {
              label:   "B — Fails WCAG at every level",
              text:    "\"1.19:1 fails WCAG Level A (1.4.3 requires 4.5:1 normal text, 3:1 large text). This is not a judgment call — it's a compliance failure. Navy text on gold achieves 7.2:1 and uses the brand palette.\"",
              correct: true,
              feedback: "Correct. 1.19:1 is essentially zero contrast. WCAG 2.1 Level A is the minimum, non-negotiable baseline — not aspirational. Navy (#1A1A2E) on gold (#F4C430) hits ~7.2:1, meeting AAA for normal text while remaining on-brand.",
            },
            {
              label:   "C — Needs a dark overlay to help",
              text:    "\"Add a semi-transparent black overlay on the gold — that will bring the contrast up on white text.\"",
              correct: false,
              feedback: "An overlay on the gold background would work technically but muddies the brand color and creates an artificial solution to a solvable problem. The cleaner fix: navy text on gold — same brand palette, dramatically better contrast.",
          wrongFeedback: "An overlay doesn't change the **contrast ratio formula** — navy text on gold achieves **7.2:1** cleanly, without muddying your brand color.",
          wrongStoryText: "Vera reaches for the opacity slider. Reid stops her. 'You're painting over a crack,' he says. 'The wall still needs fixing.'",
            },
            {
              label:   "D — Use a different font weight",
              text:    "\"Bold white text on gold will be more readable than regular weight.\"",
              correct: false,
              feedback: "Font weight affects legibility slightly, but it doesn't change contrast ratio. 1.19:1 in bold is still 1.19:1. Contrast is a mathematical property of the colors, not the font.",
              wrongStoryText: "Professor Reid taps her fingers. 'Mathematical contrast does not care about font weight. Bold zero is still zero.'",
          wrongFeedback: "**Font weight** cannot alter a **contrast ratio** — 1.19:1 bold is still 1.19:1, because contrast is purely a mathematical color relationship.",
            },
          ],
        },
        {
          question: "The site's contact form asks for: name, email, phone, company, message, project type (dropdown), budget range (dropdown), and 'How did you hear about us?' (8-option radio). Professor Reid: 'Before I even check contrast — what's the UX problem?'",
          npcLine:  "\"Count the fields. Count the required ones. Now count the users who will finish this form.\"",
          choices: [
            {
              label:   "A — Too many required fields",
              text:    "\"The form has too many required fields. Each additional required field reduces completion rates significantly — studies show 27% drops per optional-but-forced field.\"",
              correct: true,
              feedback: "Correct. Research (Imaginary Landscape, Hubspot) consistently shows form completion rates drop with each additional field. For a contact form, the minimum viable set is: Name + Email + Message (3 fields). Everything else is optional at best, friction at worst. 8 fields + 2 dropdowns + radio buttons will see completion rates under 20%.",
            },
            {
              label:   "B — The dropdown is the problem",
              wrongStoryText: "Professor Reid raises an eyebrow. 'The dropdown is annoying, but it's a drop in the ocean of friction you've created here.'",
              text:    "\"Dropdowns are cognitively expensive — replace them with inline options.\"",
              correct: false,
              feedback: "Dropdown accessibility is a real issue, but it's not the primary UX problem here. The volume of fields — 8+ inputs — is the main barrier. Reducing to 3 fields fixes more than any individual field type change.",
          wrongFeedback: "Dropdown **cognitive cost** is real, but **form field volume** is the primary barrier — 8+ fields kill completion before input type ever matters.",
            },
            {
              label:   "C — The radio buttons need labels",
              wrongStoryText: "Professor Reid shakes her head. 'Labeling doesn't save a user from filling out ten fields just to say hello.'",
              text:    "\"The 8-option radio group needs a clear label and accessible grouping with `<fieldset>` and `<legend>`.\"",
              correct: false,
              feedback: "Labeling the radio group is an accessibility fix, but it doesn't address the core UX problem: this form is asking for too much information. Even perfectly labeled, 8 radio options for 'How did you hear about us?' adds cognitive load that reduces completion.",
          wrongFeedback: "**Semantic HTML** improves accessibility, but **form length** is the conversion killer — even perfect markup can't save an eight-field contact form.",
            },
            {
              label:   "D — The budget range is inappropriate",
              wrongStoryText: "Professor Reid sighs. 'Focus on the total footprint, Vera. The entire form is bloated.'",
              text:    "\"Asking for budget upfront feels invasive — remove that field specifically.\"",
              correct: false,
              feedback: "Budget fields are sometimes inappropriate, but the root problem is the total field count. Removing one field while keeping 7+ others still leaves an over-engineered contact form. The principle: start with 3 fields, add only what you can prove is necessary.",
          wrongFeedback: "Removing one field leaves seven — **progressive disclosure** and a **3-field baseline** fix completion rates; surgical single-field cuts rarely do.",
            },
          ],
        },
        {
          question: "The site is launched. 67% of traffic is mobile. You check analytics: mobile users spend an average of 8 seconds on the page and leave. Desktop users average 2:40. Professor Reid: 'What's the first hypothesis?'",
          npcLine:  "\"67% of your audience. 8 seconds. 160 seconds for desktop. One word, Vera: why?\"",
          choices: [
            {
              label:   "A — Mobile users have shorter attention spans",
              wrongStoryText: "Professor Reid looks stern. 'Blaming the user's attention span is the easiest way to hide a bad mobile experience.'",
              text:    "\"Mobile behavior is inherently different — shorter sessions are normal on mobile.\"",
              correct: false,
              feedback: "This is a dangerous rationalization. Research shows mobile users have equivalent intent and attention to desktop users — the difference is the experience. 8s vs 160s is a design problem, not a behavior pattern.",
          wrongFeedback: "Accepting short **mobile sessions** as normal masks a **mobile-first design** failure — 8s vs 160s is a broken layout, not user behavior.",
            },
            {
              label:   "B — Mobile layout was not designed independently",
              text:    "\"The mobile view was likely shrunk from the desktop layout. Mobile-first design requires a completely different information architecture — different hierarchy, larger touch targets (min 44×44px), single-column flow, critical content above the fold at 375px.\"",
              correct: true,
              feedback: "Correct. 'Responsive' is not 'the same layout, smaller.' Mobile requires: single-column flow, larger type (17-18px vs 16px), touch targets ≥ 44px, critical action (CTA) within the first viewport at 375px, and reconsidered information hierarchy. A shrunk desktop is not a mobile design.",
            },
            {
              label:   "C — The mobile page loads too slowly",
              wrongStoryText: "Professor Reid checks the metrics. 'Slight latency doesn't explain a 95% drop in engagement. Look at the layout.'",
              text:    "\"Mobile connections are slower — if LCP is 6.8s on fast WiFi, it could be 15s on 4G. Users leave before the page loads.\"",
              correct: false,
              feedback: "Performance IS a contributing factor (and should have been fixed earlier), but 8s average session time with 2:40 on desktop suggests users ARE loading the page — they're leaving because the experience doesn't serve them, not because it failed to load.",
          wrongFeedback: "**Session Duration** data reveals users *are* loading the page — an 8s average means the **UX**, not load time, is failing them.",
            },
            {
              label:   "D — The font is too small on mobile",
              wrongStoryText: "Professor Reid shakes her head. 'Squinting is one thing, leaving immediately is another. The hierarchy is broken.'",
              text:    "\"Mobile renders text smaller — users can't read and leave.\"",
              correct: false,
              feedback: "Typography is one factor, but the 8s vs 160s gap points to a more fundamental layout problem. Users are landing on a mobile experience that wasn't designed for them. The fix requires a genuine mobile-first redesign, not just a font size increase.",
          wrongFeedback: "Font size is a symptom — the real diagnosis is broken **Information Architecture**; **Mobile-First Design** demands a full layout restructure, not a text fix.",
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 13 — REVELATION: Great design = defensible decisions
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:          "wd-ending",
      type:        "revelation",
      character:   "Vera",
      location:    "Design Studio",
      xpAward:     100,
      nextLeadsTo: "wd-ai-compare",
      revealText:  "Jake's site went live on a Tuesday.\n\nBy Friday: 47% increase in mobile conversion. Merch store traffic up 3.2×. Tour ticket clicks up 58%.\n\nProfessor Reid sent one email. Two sentences:\n\n'Good decisions. The AI didn't make them — you did.'\n\nShe was right. I had used Figma AI, v0.dev, and GitHub Copilot throughout the project. They'd generated layouts, written component code, and suggested color combinations.\n\nBut every decision had a reason attached:\n- 16px body text, not 12px, because Jake's audience includes fans on old phones in bright sunlight.\n- Navy text on gold, not white, because 1.19:1 contrast is invisible.\n- Visible labels on every form field, not placeholders, because users with cognitive disabilities deserve the same experience.\n- Three items in the nav, not eleven, because Hick's Law doesn't care how enthusiastic the client is.\n\nThe AI made options. I made choices.\n\nThat's the PhD.",
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 14 — AI COMPARE: Which tool for which job?
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:          "wd-ai-compare",
      type:        "ai-compare",
      character:   "Vera",
      location:    "Design Studio",
      xpAward:     30,
      nextLeadsTo: "wd-handoff",
      aiCompare: {
        models:   ["claude", "chatgpt", "gemini", "copilot"],
        headline: "Figma AI vs v0.dev vs Framer AI vs GitHub Copilot — Same Input, Different Jobs",
        context:  "Every AI design tool is optimized for a different part of the design process. Using them interchangeably is like using a hammer as a screwdriver — technically possible, reliably bad.",
        rows: [
          {
            dimension: "Visual Design Generation",
            winner:    "Framer AI",
            claude:    "Figma AI: Strong component variants, weak full layouts",
            chatgpt:   "v0.dev: React code, not visual design — different tool",
            gemini:    "Framer AI: Full page generation, real CMS, real interactions",
            copilot:   "Copilot: CSS generation only — no visual output",
            note:      "Framer AI wins for 'I need a full website fast.' Figma AI wins for 'I need component exploration within an existing system.'",
          },
          {
            dimension: "Production Code Quality",
            winner:    "v0.dev",
            claude:    "Figma AI: Outputs design specs, not production code",
            chatgpt:   "v0.dev: Production-ready React, Tailwind, shadcn/ui — developer-grade",
            gemini:    "Framer AI: Framer-specific code, limited export",
            copilot:   "Copilot: Strong CSS/JS completion, context-aware in editor",
            note:      "v0.dev generates code you'd actually ship. Copilot generates code you'd use in the IDE. Different moments in the workflow.",
          },
          {
            dimension: "Accessibility Defaults",
            winner:    "claude",
            claude:    "Claude API: Ask it to audit for WCAG — specific, actionable, cited",
            chatgpt:   "v0.dev: Uses shadcn/ui which has good a11y defaults, but not audited",
            gemini:    "Framer AI: Does not automatically audit for WCAG",
            copilot:   "Copilot: Will write inaccessible code if that's what you prompt",
            note:      "No AI design tool automatically ensures WCAG compliance. The human must check. Claude can be prompted to audit; others generate first, check never.",
          },
          {
            dimension: "Speed to First Prototype",
            winner:    "Framer AI",
            claude:    "Figma AI: Fast for component exploration (30 seconds), slower for full pages",
            chatgpt:   "v0.dev: 2-3 minutes for a full page component",
            gemini:    "Framer AI: 60-90 seconds for a deployable full page",
            copilot:   "Copilot: No prototype — only code in your editor",
            note:      "For stakeholder demos or early client review: Framer AI. For actual development: v0.dev or Copilot.",
          },
          {
            dimension: "Design System Integration",
            winner:    "claude",
            claude:    "Figma AI: Natively understands Figma component libraries and tokens",
            chatgpt:   "v0.dev: Works with shadcn/ui as a design system, customizable",
            gemini:    "Framer AI: Self-contained system — hard to integrate with external design systems",
            copilot:   "Copilot: Understands your project's existing patterns via context window",
            note:      "If you have an existing design system: Figma AI (visual) or Copilot (code). Starting fresh: v0.dev with shadcn/ui is the fastest path to consistency.",
          },
        ],
        verdict:  "There's no single AI design tool. There's a workflow: explore with Figma AI, generate with v0.dev, prototype with Framer AI, implement with Copilot, audit with Claude. The designer who knows which tool to use when — and checks every output against user needs — is the designer AI cannot replace.",
        question: "A client needs a live, deployable landing page in 4 hours. No existing design system. Which AI tool gives you the best starting point?",
        choices: [
          {
            label:   "A — Figma AI",
            text:    "Use Figma AI to design the components, then hand off to developers.",
            correct: false,
            feedback: "Figma AI is great for design exploration, but it generates design specs — not deployable code. In 4 hours, you need something you can ship, not something you then need to build.",
          wrongFeedback: "**Figma AI** produces **design specs**, not deployable code — you still need a developer bridge, which kills your 4-hour **deployment window**.",
          wrongStoryText: "Vera exports the Figma frames. Beautiful. Unshippable. The clock reads 3:47. The client is calling.",
          },
          {
            label:   "B — v0.dev",
            text:    "Use v0.dev to generate production-ready React/Tailwind components from a text description.",
            correct: false,
            feedback: "v0.dev is excellent, but for a full deployable landing page in 4 hours, Framer AI is faster — it generates, hosts, and deploys in a single workflow. v0.dev is better when you need the code in your own repo.",
          wrongFeedback: "**v0.dev** excels at component generation but lacks **integrated deployment** — **Framer AI** ships a live URL in one workflow, saving critical time.",
          wrongStoryText: "Vera's React components look perfect. Then she remembers: there's no host, no domain, no CMS. The clock does not care.",
          },
          {
            label:   "C — Framer AI",
            text:    "Use Framer AI — it generates a full site, connects a CMS if needed, and deploys live in under 90 seconds.",
            correct: true,
            feedback: "Correct. For 'deployable in 4 hours' with no existing design system: Framer AI wins. Full page generation + real interactions + one-click deployment. The constraint is: you're in the Framer ecosystem. For a quick client demo or MVP landing page, that's often acceptable.",
          },
          {
            label:   "D — GitHub Copilot",
            text:    "Use Copilot to write the CSS and layout code quickly in VS Code.",
            correct: false,
            feedback: "Copilot accelerates coding within your editor, but it doesn't generate a full site or handle deployment. 4 hours with Copilot is a fast developer workflow, not a generated prototype workflow.",
          wrongFeedback: "**GitHub Copilot** accelerates writing code, but offers zero **automated deployment** — you'd spend all 4 hours building, not shipping.",
          wrongStoryText: "Vera types fast. Copilot helps faster. Two hours in, she has half a layout and no way to deploy it. The client waits.",
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SCENE 15 — HANDOFF: Vera → Carlos
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id:        "wd-handoff",
      type:      "handoff",
      character: "Vera",
      location:  "Design Studio",
      xpAward:   0,
      dialogue: [
        {
          speaker: "Vera",
          avatar:  "protagonist",
          text:    "Jake's site is live. Mobile conversions up 47%. I'm getting coffee.",
        },
        {
          speaker: "Vera",
          avatar:  "protagonist",
          text:    "But I'm sending you to someone whose problems are… bigger than a portfolio site.",
        },
        {
          speaker: "Vera",
          avatar:  "protagonist",
          text:    "Carlos works enterprise. 12,000 employees. Legacy systems. A board that still thinks AI is a buzzword.\n\nWhat you learned here — hierarchy, decision-making, defending your choices — translates exactly. The scale just changes.",
        },
        {
          speaker: "Vera",
          avatar:  "protagonist",
          text:    "Good luck. You're going to need the contrast ratios.",
        },
      ],
    },

  ],
}
