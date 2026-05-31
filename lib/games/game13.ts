import { Game } from "./types"

/**
 * Game 13 — "The Prompt Lab" (Maya's Prompt Engineering Masterclass)
 *
 * The meta-game. Every other game used AI tools — this one teaches
 * the CRAFT of talking to them. Scenario-based: "if you write THIS,
 * you get THAT. If you write THAT, it's better."
 *
 * Character: Maya, 31-year-old UX designer & prompt engineer
 * Teaching arc:
 *  1. COLD OPEN — Maya's "before" prompt vs "after" prompt. Shocking difference.
 *  2. THE ANATOMY — the 5 layers of a great prompt
 *  3. SCENARIO: Context is King — same request, different context = different output
 *  4. SCENARIO: The Constraint Flip — what NOT to do is as powerful as what to do
 *  5. SCENARIO: Role & Persona — giving the AI a perspective
 *  6. SCENARIO: Chain of Thought — making the AI show its work
 *  7. PREDICT THE OUTPUT — player guesses which prompt produces better output
 *  8. PROMPTING PATTERNS — the 6 patterns that unlock 80% of use cases
 *  9. LIVE CHALLENGE — player writes a prompt, AI scores it
 * 10. BOSS — 5 prompt optimization challenges
 * 11. AI COMPARE — which AI responds best to which prompting style
 * 12. REVELATION
 * 13. HANDOFF — Maya teases what's coming (Prompt Lab → Game 1 full circle)
 */

export const game13: Game = {
  slug:            "prompt-lab",
  week:            14,
  free:            true,
  title:           "The Prompt Lab",
  emoji:           "🔬",
  icon:            "tuningFork" as const,
  duration:        "16 min",
  description:     "The meta-game. Maya teaches the craft of prompting — the one skill that makes EVERY AI tool in your toolkit 10x more powerful. Scenario-based: write this, get that.",
  tagline:         "What if you could say exactly what you mean — and have an AI hear exactly that?",
  characterName:   "Maya",
  characterRole:   "31-year-old UX designer & prompt engineer",
  characterBlurb:  "She spent a year getting mediocre AI output. Then she learned ONE thing that changed everything.",
  characterImage:  "/images/maya.png",
  maestroImage:    "/images/maestro-maya.png",
  maestroLine:     "The last time she typed 'make it better'…",
  maestroSubline:  "Maya's prompts are now the benchmark her whole studio uses.",
  accentColor:     "#e040fb",
  audioTrack:      "/audio/concrete-riot.mp3",
  aiModel:         "general" as const,
  nextGame: {
    slug:        "welcome-to-ai-v2",
    character:   "Jake",
    teaserLine:  "You've learned the meta-skill. Now go back and see how it makes Jake's story — where it all began — feel completely different. The conductor principle hits different when you know HOW to hold the baton.",
    previewImage:"/images/guitarplayer1.png",
  },
  scenes: [

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 0 — PREDICT THE OUTPUT (cold open)
    // Two prompts, same goal. Player guesses which gets the better output.
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s0",
      type: "predict",
      character: "Maya, 31",
      location: "DESIGN STUDIO · DUAL MONITORS",
      predictPrompt: "Make this email more professional.",
      question: "Maya typed the same request two ways. Prompt A: 'Make this email more professional.' Prompt B: 'Rewrite this email for a VP of Engineering at a Series B startup — direct, no fluff, under 120 words, preserving the technical ask.' Which output actually helped her?",
      choices: [
        {
          label: "A",
          text: "[PROMPT A OUTPUT] Dear Sir/Madam, I hope this message finds you well. I am writing to professionally inquire about the status of our previously discussed technical collaboration opportunity…",
          correct: false,
          feedback: "Prompt A produced the AI's idea of 'professional' — formal, verbose, and completely generic. It didn't know the audience, the length constraint, the tone, or what to preserve. 'More professional' is a vague aesthetic instruction, not a prompt.",
          wrongFeedback: "Prompt A gave a generic 'professional' template. Without context, constraints, or audience — the AI averaged its training data. That's never what you actually wanted.",
        },
        {
          label: "B",
          text: "[PROMPT B OUTPUT] Hi [Name], Quick update on the API integration scope we discussed — I've scoped it to 3 endpoints, 2-week timeline, and need confirmation on auth method by Friday. Happy to jump on a 20-min call if that's easier. Maya",
          correct: true,
          feedback: "Prompt B gave the AI a specific audience (VP of Engineering), format constraint (under 120 words), tone instruction (direct, no fluff), and what to preserve (the technical ask). Five pieces of context turned a generic rewrite into something Maya could actually send.",
          breakdown: [
            { phrase: "VP of Engineering at a Series B startup", note: "Audience context tells the AI exactly how formal, how technical, and how brief to be." },
            { phrase: "direct, no fluff", note: "Tone instruction collapses the entire 'professional' spectrum into a specific register." },
            { phrase: "under 120 words", note: "Hard constraint produces a hard result. 'Concise' means nothing; 120 words means 120 words." },
            { phrase: "preserving the technical ask", note: "What to keep is just as important as what to change." },
          ],
        },
        {
          label: "C",
          text: "[PROMPT A OUTPUT V2] I trust this email finds you in good health and high spirits. Pursuant to our prior discussions regarding the collaborative initiative…",
          correct: false,
          feedback: "That's the same generic output with slightly different wording. Prompt A keeps producing the average of every 'professional email' in training data — because that's all it was asked for.",
          wrongFeedback: "Still generic. Still what 'professional' means to the average of all training data. The prompt didn't give the AI anything to work with.",
        },
      ],
      xpAward: 50,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 1 — LEARN: The 5 Layers of a Great Prompt
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s1",
      type: "learn",
      character: "Maya",
      location: "DESIGN STUDIO · WHITEBOARD",
      concept: {
        title: "The Prompt Stack",
        body:  "Maya calls it The Prompt Stack — five layers that, when combined, collapse infinite possible outputs down to exactly what you need. Most people use one. Power users use all five.",
      },
      learnHighlight: "A great prompt doesn't just say what you want. It says who you are, what you need, how you want it, what to avoid, and why it matters — in the right order.",
      scenarioText: "Layer 1: ROLE — who the AI should be ('You are a senior UX researcher…')\nLayer 2: CONTEXT — what situation you're in ('We're A/B testing a checkout flow…')\nLayer 3: TASK — what to do ('Write 5 microcopy variants for the submit button…')\nLayer 4: CONSTRAINTS — what to avoid and how ('Under 4 words each. No 'Submit'. No passive voice.')\nLayer 5: PURPOSE — why it matters ('These go to a design review with the CPO tomorrow.')",
      xpAward: 40,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 2 — SCENARIO: Context is King
    // Same request, three different contexts → completely different outputs
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s2",
      type: "scenario",
      character: "Maya",
      location: "DESIGN STUDIO · MORNING",
      dialogue: [
        { speaker: "Maya",    avatar: "protagonist" as const, text: "I want to show you something. I'm going to ask for 'a headline for our product launch' three times. Same words. Different context." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Without context: 'Introducing the future of work.' Generic. Could be any B2B SaaS product ever made." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "With audience context: 'Finally, a tool your team will actually use.' Suddenly it knows there's been resistance to adoption. That's a different product truth." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "With audience + tone + purpose: 'Built by designers, for designers — because we got tired of explaining what good UX feels like.' That's specific. That's true. That's a brand." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Same request. Three completely different outputs. The difference was context — not a better AI." },
      ],
      question: "Maya's client wants a product headline. Which prompt gives the AI enough context to produce something actually useful?",
      choices: [
        {
          label: "A",
          text: "Write a compelling headline for our product launch.",
          correct: false,
          feedback: "This gives the AI nothing but the task. No audience, no product truth, no tone, no what-makes-it-different. The AI will average its training data for 'product headlines' — which produces the same generic output every B2B SaaS ever gets.",
          wrongFeedback: "No audience, no truth, no tone. The AI produces the average of everything called a 'product headline' in its training. That's never your specific headline.",
        },
        {
          label: "B",
          text: "Write a headline for a UX design tool targeting teams at 50-200 person companies who've tried other tools and felt limited. Tone: confident, insider, slightly irreverent. One line, under 12 words.",
          correct: true,
          feedback: "Five pieces of context: audience (50-200 person UX teams), situation (tried other tools, felt limited), tone (confident, insider, irreverent), format (one line, under 12 words). That's enough for the AI to write the specific truth of this specific product.",
        },
        {
          label: "C",
          text: "Be creative and write something exciting for our product launch that really stands out.",
          correct: false,
          feedback: "'Creative' and 'exciting' and 'stands out' are what every marketer asks for and what every AI averages across. They're not constraints — they're wishes. The AI can't make something stand out without knowing what everything else sounds like.",
          wrongFeedback: "'Creative', 'exciting', 'stands out' — the AI hears these words thousands of times per day. They collapse to the average of what those words meant in training. Not your specific thing.",
        },
      ],
      xpAward: 60,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 3 — SCENARIO: The Constraint Flip
    // What NOT to do is as powerful as what to do
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s3",
      type: "scenario",
      character: "Maya",
      location: "CLIENT CALL · LAPTOP OPEN",
      scenarioText: "Maya's client keeps getting AI copy that sounds 'like an AI wrote it.' She asks to see their prompts. They're all positive — what to write, what tone, what format. Nothing about what NOT to do. She adds three constraint lines: 'No corporate jargon. No passive voice. No sentences that start with 'At [Company], we believe'.' The next output from the same AI? Their creative director asks who wrote it.",
      npcLine:  "I just told it what I didn't want. That was the missing piece.",
      question: "A prompt says: 'Write 3 product descriptions in a warm, human tone.' The outputs still sound generic. What's the most effective single addition?",
      choices: [
        {
          label: "A",
          text: "Add: 'Be more creative and human-sounding'",
          correct: false,
          feedback: "'More human' and 'more creative' are the instructions the AI already tried to follow. They're not new information — they're the same request said more urgently. The AI will produce the average of 'human-sounding product descriptions,' which is the same output with different words.",
          wrongFeedback: "'More human' gives the AI nothing to differentiate itself from. It's still averaging the same training examples.",
        },
        {
          label: "B",
          text: "Add: 'No marketing jargon (no 'seamless', 'intuitive', 'powerful'). No sentences longer than 20 words. No passive voice. No claims without specifics.'",
          correct: true,
          feedback: "Constraint exclusions eliminate the patterns the AI defaults to when it has no direction. 'No seamless, no intuitive, no powerful' specifically cuts the three most overused words in product copy — forcing the AI to find what actually describes THIS product. Negative constraints are underrated prompting superpowers.",
        },
        {
          label: "C",
          text: "Add: 'Make it sound like Apple's copywriting style'",
          correct: false,
          feedback: "Style references help, but 'Apple style' is itself an average — the AI has millions of examples of 'write like Apple' outputs. It still defaults to familiar patterns. Specific exclusions cut those patterns more precisely than style references.",
          wrongFeedback: "Style references average the style. Specific exclusions cut specific bad patterns. Both help — but the exclusions are more surgical for fixing 'sounds generic' problems.",
        },
      ],
      xpAward: 60,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 4 — SCENARIO: Role & Persona
    // Giving the AI a perspective changes what it prioritizes
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s4",
      type: "scenario",
      character: "Maya",
      location: "DESIGN STUDIO · AFTERNOON",
      dialogue: [
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Role prompting isn't about pretending. It's about telling the AI which filter to think through." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Ask for feedback on a design without a role: you get balanced, diplomatic, non-committal feedback. Useful but toothless." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Add: 'You are a skeptical VC who has seen 500 pitch decks this year and your default is no.' Now the feedback has an actual perspective. It argues. It pushes back. It's useful." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Or: 'You are a 65-year-old first-time smartphone user who finds apps confusing.' Now you're seeing your interface from outside your own expertise bubble." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "The role tells the AI WHOSE TRUTH to tell. Without it, it tells the average truth. Average truths miss specific problems." },
      ],
      question: "Maya needs harsh, actionable feedback on her SaaS onboarding flow. Which role instruction produces the most useful critique?",
      choices: [
        {
          label: "A",
          text: "You are an expert UX designer reviewing this onboarding flow.",
          correct: false,
          feedback: "'Expert UX designer' is too comfortable — it knows what onboarding is supposed to look like, defaults to balanced critique, and won't miss things a non-expert would miss. You're asking an expert to think like an expert. That's circular.",
          wrongFeedback: "'Expert UX designer' sees what a UX designer sees — which is already your perspective. You need a different perspective to find your blind spots.",
        },
        {
          label: "B",
          text: "You are a first-time user who is technically competent but has never seen this product before, has 5 minutes before a meeting, and will abandon if anything is confusing.",
          correct: true,
          feedback: "Three constraints that change everything: first-time user (no expertise halo), time pressure (5 minutes to a meeting — real abandonment risk), and low tolerance for confusion. This role has an actual perspective with actual stakes. That's what generates useful, specific critique instead of polished generalizations.",
        },
        {
          label: "C",
          text: "You are a helpful assistant reviewing this onboarding flow for improvements.",
          correct: false,
          feedback: "'Helpful assistant' is the AI's default mode — it doesn't add any perspective or stakes. You've just restated 'be helpful' in different words. The output will be the average of 'onboarding feedback' with no point of view.",
          wrongFeedback: "'Helpful assistant' is just the AI's default identity. No new perspective, no stakes, no point of view. Same output as no role instruction at all.",
        },
      ],
      xpAward: 60,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 5 — SCENARIO: Chain of Thought
    // Making the AI show its work improves accuracy and usefulness
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s5",
      type: "quiz",
      character: "Maya",
      location: "DESIGN STUDIO · LATE AFTERNOON",
      npcLine: "Don't ask the AI for an answer. Ask it to think out loud first. The thinking IS the product.",
      scenarioText: "Maya was reviewing a pricing strategy for a client. She asked the AI: 'Should we use a freemium model?' It said yes with 3 bullet points. Useful. Then she tried: 'Think through the arguments FOR freemium in our context, then the strongest arguments AGAINST, then identify what decision this hinges on — THEN give a recommendation.' The output was four times longer and exposed a distribution problem she'd completely missed.",
      question: "Which prompting pattern makes the AI most useful for complex decisions?",
      choices: [
        {
          label: "A",
          text: "Ask for the answer directly, then ask follow-up questions if needed",
          correct: false,
          feedback: "Direct questions produce direct answers — but the reasoning that led there is hidden. If the AI skipped over a critical assumption, you can't see it to challenge it. Follow-up questions help, but you're navigating blind.",
          wrongFeedback: "Direct questions hide the reasoning. If the AI made a bad assumption along the way, you won't see it — and can't catch it.",
        },
        {
          label: "B",
          text: "Ask the AI to reason through the problem step by step, making its assumptions explicit, before giving a final answer",
          correct: true,
          feedback: "Chain-of-thought prompting forces the AI to expose its reasoning. That's where you find the wrong assumptions, the missing variables, the constraints the AI didn't know you had. The recommendation is only as good as the reasoning — make the reasoning visible.",
        },
        {
          label: "C",
          text: "Ask for a structured table comparing all options",
          correct: false,
          feedback: "Tables are useful for comparison but hide the reasoning that selected the options and dimensions. A table of the wrong things is still the wrong analysis. Make the AI reason first, then structure.",
          wrongFeedback: "Tables show comparisons, not reasoning. The AI can build a beautiful table on wrong assumptions without you ever seeing where it went sideways.",
        },
      ],
      xpAward: 60,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 6 — LEARN: The 6 Prompt Patterns
    // The prompt engineering toolkit in one scene
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s6",
      type: "learn",
      character: "Maya",
      location: "DESIGN STUDIO · END OF DAY",
      concept: {
        title: "The 6 Prompt Patterns",
        body:  "Maya teaches her entire studio six reusable patterns that cover 80% of AI use cases. Learn these and you'll never stare at a blank prompt box again.",
      },
      learnHighlight: "Patterns don't limit creativity — they give you a place to start. The best improvisation happens from a strong foundation.",
      scenarioText: "Pattern 1 — ROLE + TASK: 'You are [expert]. Do [specific task].'\nPattern 2 — CONTEXT + GOAL: 'Given [situation], help me [outcome].'\nPattern 3 — EXCLUSION LIST: 'Do X. Avoid: [list].'\nPattern 4 — CHAIN OF THOUGHT: 'Think through [problem] step by step before answering.'\nPattern 5 — SHOW THE TEMPLATE: 'Here's an example of what I want: [example]. Now do it for [my thing].'\nPattern 6 — ITERATE OUT LOUD: 'Here's my first draft: [draft]. What's the weakest part and how would you fix it?'",
      xpAward: 40,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 7 — PREDICT THE OUTPUT (advanced)
    // Player applies the patterns to guess which prompt wins
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s7",
      type: "predict",
      character: "Maya",
      location: "DESIGN STUDIO · NEXT MORNING",
      predictPrompt: "You are a skeptical angel investor who has passed on 200 deals this quarter. Your default is no. Review this pitch deck summary and tell me the 3 strongest objections you'd raise in the first 5 minutes — and what would have to be true to overcome each one.",
      question: "Maya is testing a pitch deck with that role prompt. What kind of output should she expect?",
      choices: [
        {
          label: "A",
          text: "Three specific objections with the exact frame the AI used to evaluate them, plus the conditions that would flip each objection — all in the voice of someone whose default is to pass.",
          correct: true,
          feedback: "That's exactly what the prompt earns. The role (skeptical investor, 200 passes, default no) gives the AI a specific perspective and pressure. 'Tell me the 3 strongest objections' is a specific task. 'What would have to be true to overcome each' adds structure and forces reasoning. Four elements working together.",
          breakdown: [
            { phrase: "skeptical angel investor who has passed on 200 deals", note: "Not just 'investor' — specific perspective, specific volume, specific bias. The AI knows exactly whose truth to tell." },
            { phrase: "Your default is no", note: "Establishes the pressure. This AI isn't going to be diplomatic. It has a mandate." },
            { phrase: "3 strongest objections", note: "Specific count forces prioritization. Without it, you get a list of 8 minor concerns that all seem equal." },
            { phrase: "what would have to be true to overcome each one", note: "Turns objections into actionable tasks. Now the feedback is fixable, not just discouraging." },
          ],
        },
        {
          label: "B",
          text: "Balanced feedback listing 3 pros and 3 cons of the pitch deck, presented in neutral investor language.",
          correct: false,
          feedback: "Balanced and neutral is what you get WITHOUT a role. The role instruction explicitly makes the AI skeptical with a default-no bias. If it gives balanced feedback, it ignored the role — or the role wasn't specific enough. This prompt is specific enough.",
          wrongFeedback: "Balanced feedback is the default mode without role instructions. This prompt explicitly broke that default with 'skeptical', '200 passes', and 'default is no'.",
        },
        {
          label: "C",
          text: "A generic summary of what makes a good pitch deck, using this one as an example.",
          correct: false,
          feedback: "Generic advice is what you get from a generic prompt. This prompt is the opposite of generic — specific role, specific count, specific structure. The output should be sharply specific to THIS pitch, through THIS perspective.",
          wrongFeedback: "Generic advice comes from generic prompts. A role prompt this specific should produce output this specific to the document at hand.",
        },
      ],
      xpAward: 75,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 8 — PROMPT CHALLENGE (player writes their own)
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s8",
      type: "prompt",
      character: "Maya",
      location: "DESIGN STUDIO · CHALLENGE STATION",
      npcLine: "Real prompting skill means writing prompts you can teach. Show me what you've learned.",
      promptChallenge: {
        context: "You need feedback on a landing page headline you've written. The AI should push back like someone who's tested hundreds of headlines, not just compliment you.",
        goal:    "Write a prompt that uses at least 3 of the 6 patterns to get genuinely useful critique — not validation. Include role, constraints, and what you want the AI to focus on.",
        placeholder: "You are a conversion copywriter who has A/B tested over 500 headlines...",
      },
      xpAward: 100,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 9 — QUIZ: Common Prompting Mistakes
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s9",
      type: "quiz",
      character: "Maya",
      location: "DESIGN STUDIO · REVIEW SESSION",
      npcLine: "The fastest way to improve is to recognize what you're already doing wrong.",
      question: "Maya reviews 50 prompts submitted by her studio team. What's the single most common structural problem she finds?",
      choices: [
        {
          label: "A",
          text: "Prompts are too long and confuse the AI with too much information",
          correct: false,
          feedback: "Length rarely hurts — information does. A 300-word prompt with 5 specific, relevant constraints consistently outperforms a 20-word prompt with no context. The mistake isn't length; it's irrelevance.",
          wrongFeedback: "Long prompts with relevant context outperform short prompts consistently. The issue is never length — it's specificity and relevance.",
        },
        {
          label: "B",
          text: "Prompts describe what to produce without describing the situation, audience, or constraints that define what good output looks like",
          correct: true,
          feedback: "This is the structural gap in 90% of weak prompts. They say WHAT but not WHO FOR, WHAT NOT, HOW TO JUDGE, or WHY IT MATTERS. The AI has no frame to evaluate its own output. It produces the average of everything that matches the task description — which is always worse than what you had in mind.",
        },
        {
          label: "C",
          text: "Prompts don't use magic keywords like 'act as' or 'pretend you are'",
          correct: false,
          feedback: "There are no magic keywords. 'Act as' and 'pretend you are' are just ways to introduce a role — which matters — but the role itself is what works, not the specific phrasing. Keyword optimization is a myth; structural context is what drives output quality.",
          wrongFeedback: "No magic keywords exist. The role and context matter — 'you are' and 'act as' both work equally. It's the specificity of what follows, not the trigger phrase.",
        },
        {
          label: "D",
          text: "Prompts are written in the wrong language or format",
          correct: false,
          feedback: "Language and format have minimal impact on output quality compared to the five layers of context. An impeccably formatted prompt with no context still produces a generic answer. Structure of information > structure of sentences.",
          wrongFeedback: "Format matters very little. The information content of a prompt — context, role, constraints, purpose — is what determines output quality. Format is aesthetic.",
        },
      ],
      xpAward: 75,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 10 — BOSS (5-punch battle)
    // Identify the better prompt in each pair
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s10",
      type: "boss",
      character: "Maya",
      location: "DESIGN STUDIO · LATE NIGHT",
      dialogue: [
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Alright. Final test. I'm going to show you prompt pairs — same goal, different prompts. Your job is to identify what makes the winning prompt win." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "This isn't about memorizing rules. It's about seeing the structure. Once you can see it, you can't unsee it." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Every prompt you'll ever write is a choice between giving the AI enough to work with — or asking it to average its way to an answer." },
        { speaker: "Maya",    avatar: "protagonist" as const, text: "Let's find out if you can tell the difference now." },
      ],
      bossQuestions: [
        {
          npcLine: "Same goal. Different precision. Which prompt actually works?",
          question: "GOAL: Get feedback on a business plan. Which prompt produces genuinely useful critique?\n\nPrompt A: 'Give me feedback on my business plan.'\nPrompt B: 'You are a CFO who has reviewed 80 business plans this year and your concern is unit economics and burn rate. Identify the 3 biggest financial risks in this plan and what data I'd need to address each one.'",
          choices: [
            { label: "A", text: "Prompt A — simpler prompts get cleaner outputs", correct: false, feedback: "Simpler prompts get MORE averaged outputs. Prompt A tells the AI nothing about perspective, priority, or what 'good feedback' means here. It will produce balanced, diplomatic, non-committal commentary on everything. Useful for nothing specific.", wrongFeedback: "Simple prompts collapse to averages. Prompt A has no perspective, no priority, no definition of what 'good' means. It produces diplomatic non-answers." },
            { label: "B", text: "Prompt B — role + specific lens + specific output structure", correct: true, feedback: "Prompt B layers: CFO role (specific expertise), 80 plans this year (experience context), concern with unit economics and burn (specific lens), 3 biggest risks (count and priority), what data addresses each (actionable structure). Five working parts. Prompt A has zero." },
            { label: "C", text: "Either — the quality of the business plan determines the quality of feedback", correct: false, feedback: "The quality of the plan determines what there is to find. The prompt determines whether the AI finds it. A weak prompt on a great plan produces generic compliments. A strong prompt on a weak plan produces specific, useful problems to fix.", wrongFeedback: "The plan determines the raw material. The prompt determines what the AI does with it." },
          ],
        },
        {
          question: "GOAL: Write a cold email to a potential client. What's the structural difference between these prompts?\n\nPrompt A: 'Write a cold email to a potential client for my design agency.'\nPrompt B: 'Write a cold email to a Head of Product at a 100-person SaaS company. We've done 3 redesigns for companies at their growth stage. The email should reference a specific pain point (design debt slowing shipping) without being presumptuous. Under 150 words. No subject line. Call to action: 15-minute call.'",
          choices: [
            { label: "A", text: "Prompt B is longer, which makes it more detailed", correct: false, feedback: "Length is a symptom of specificity, not the cause. Prompt B isn't better because it's longer — it's longer because it contains more specific information. A long prompt full of vague requirements is still a vague prompt.", wrongFeedback: "Length = specificity is correlation, not causation. A long vague prompt is still a vague prompt." },
            { label: "B", text: "Prompt B defines audience, credibility signal, tone constraints, format, and call to action — every variable the writer would need to make a decision", correct: true, feedback: "That's the complete picture. Prompt A hands the AI a blank canvas labeled 'cold email.' Prompt B hands it a specific audience at a specific growth stage with a specific pain point, specific tone guidance, specific format, and specific goal. The AI can't make a good decision with Prompt A's information because there's no information to decide with." },
            { label: "C", text: "Prompt A gives the AI creative freedom which produces more original results", correct: false, feedback: "'Creative freedom' without context produces the average of all cold emails the AI has ever learned. That average is what lands in spam folders. Specificity creates distinctiveness — not freedom from it.", wrongFeedback: "Unconstrained prompts produce averaged outputs. Average cold emails get deleted. Specificity is what creates distinctiveness." },
          ],
        },
        {
          question: "GOAL: Improve a presentation structure. Which prompt produces the most actionable output?\n\nPrompt A: 'Help me improve the structure of my presentation.'\nPrompt B: 'I have a 12-slide deck for a 20-minute investor update. The audience has 3 board members and 2 observers who joined last quarter. They care about CAC, LTV, and path to profitability. My current structure: [list]. Identify where I lose momentum and what the weakest transition is — and suggest one alternative structure.'",
          choices: [
            { label: "A", text: "Prompt A — open-ended prompts give the AI more room to be helpful", correct: false, feedback: "Open-ended prompts give the AI more room to be generic. Without knowing the audience, the stakes, the current structure, or what 'better' means — the AI produces general presentation advice that applies to every presentation and therefore to none.", wrongFeedback: "Open-ended = room to average. Without context, the AI gives advice that applies to every presentation and therefore to yours specifically not at all." },
            { label: "B", text: "Prompt B — audience, stakes, current structure, and specific diagnostic task", correct: true, feedback: "Four working layers: audience context (board members with specific concerns), stakes (investor update), current structure (so the AI has something to analyze), and a specific diagnostic task (where momentum is lost, what the weakest transition is, one alternative). Prompt A has none of this. The AI can't improve a structure it hasn't seen." },
            { label: "C", text: "Both are equivalent — the AI will ask clarifying questions if it needs more", correct: false, feedback: "Modern AI models often proceed rather than ask. And when they do ask, you lose a full iteration. The right time to give context is before the first output — not in a follow-up round after you've already received something unhelpful.", wrongFeedback: "AIs often proceed without asking. And waiting for them to ask costs you an iteration. Front-load the context." },
          ],
        },
        {
          question: "Maya needs the AI to review a 2,000-word technical spec for clarity. Which approach produces the most useful output?",
          choices: [
            { label: "A", text: "Submit the spec with: 'Review this for clarity.'", correct: false, feedback: "Clarity is subjective without an audience. Clarity for a senior engineer is not clarity for a product manager. The AI will average what 'clear' means across all its training — which means you get academic-style clarity feedback that doesn't map to your actual reader.", wrongFeedback: "Clarity for whom? Without an audience, the AI defines 'clear' as the average of all technical writing feedback it's seen. That's not your reader." },
            { label: "B", text: "Submit the spec with: 'You are a PM at a Series B startup who hasn't shipped a product with this specific tech stack before. Flag every section where you'd need to ask an engineer for clarification. Rate each flag: is this a wording problem or a conceptual gap in the spec itself?'", correct: true, feedback: "That prompt does three powerful things: gives the AI a specific reader with a specific knowledge gap, defines the task concretely (flag sections that need clarification), and adds a diagnostic layer (wording vs. conceptual gap). The output becomes a prioritized action list for improving the spec — not general feedback." },
            { label: "C", text: "Submit the spec with: 'Is this clear? Rate it 1-10 for clarity and explain your rating.'", correct: false, feedback: "A rating without an audience is meaningless. 7/10 clear to whom? The number gives false precision to an undefined evaluation. You want specific problems and specific audiences — not a score.", wrongFeedback: "Ratings feel concrete but hide vagueness. 7/10 to whom? For what purpose? A number without context is decoration on an undefined evaluation." },
          ],
        },
        {
          npcLine: "The conductor doesn't ask the orchestra to 'play well.' They say exactly what they need.",
          question: "The principle unifying ALL great prompts is:",
          choices: [
            { label: "A", text: "Length — the longer the prompt, the better the output", correct: false, feedback: "Length is a symptom of specificity, not the cause. A short, specific prompt consistently beats a long, vague one. The best prompt for a narrow task can be 10 words.", wrongFeedback: "Longer ≠ better. Shorter + specific consistently beats longer + vague." },
            { label: "B", text: "Magic words and phrases that unlock AI capabilities", correct: false, feedback: "There are no magic words. Any claim that specific phrases unlock hidden AI capabilities is a myth from early prompt hacking. Modern AI models respond to information content and structure — not linguistic triggers.", wrongFeedback: "No magic words. Never were. It's information and structure all the way down." },
            { label: "C", text: "Specificity — collapsing the AI's infinite possible outputs down to the specific output you actually need", correct: true, feedback: "Every technique — roles, context, constraints, chain-of-thought, exclusions, examples — is just a different way to add specificity. The AI doesn't have a bad output or a good output. It has an output shaped by the specificity (or lack of it) in your prompt. The conductor doesn't ask the orchestra to 'play well.' They say: 'This passage. Piano. Elegy. Slow accelerando to the bridge.' That's the whole game." },
            { label: "D", text: "Formal structure — using official prompt templates and frameworks", correct: false, feedback: "Frameworks and templates are useful scaffolding — but a prompt using a formal structure with vague information still produces vague output. The structure matters less than the information it holds. Use frameworks to remind yourself of what to include, not as magic formulas.", wrongFeedback: "Formal structure is scaffolding, not magic. Information + specificity > template conformance." },
          ],
        },
      ],
      xpAward: 150,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 11 — AI COMPARE: Prompting Styles by AI Model
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s11",
      type: "ai-compare",
      character: "Maya",
      location: "DESIGN STUDIO · RESEARCH MODE",
      xpAward: 75,
      aiCompare: {
        models: ["claude", "chatgpt", "gemini", "copilot"],
        headline: "Which AI Responds Best to Which Prompting Style?",
        context: "Maya tested the same prompting patterns across all four major tools for 3 months. Not just what each AI produces — but how each AI RESPONDS to different prompting techniques.",
        rows: [
          {
            dimension: "Complex Multi-Constraint Prompts",
            winner: "Claude",
            claude:  "Holds 6-8 simultaneous rules consistently — ideal for the full Prompt Stack",
            chatgpt: "Strong up to 4-5 constraints; may simplify complex rule sets",
            gemini:  "Good constraint following; performs best with structured format requests",
            copilot: "Optimized for M365 tasks; constraint-following in business writing contexts",
            note: "Maya's most complex prompts have 6+ rules. Claude was the most reliable across all of them.",
          },
          {
            dimension: "Role Prompting & Persona",
            winner: "Claude",
            claude:  "Commits fully to roles; maintains perspective consistently throughout long sessions",
            chatgpt: "Good role adoption; may break character in long complex conversations",
            gemini:  "Solid persona work; particularly good for research-role prompts",
            copilot: "Role prompting works; most effective for professional/business personas",
            note: "The 'skeptical VC' prompt works better in Claude because it stays in character longer.",
          },
          {
            dimension: "Chain-of-Thought Reasoning",
            winner: "Claude",
            claude:  "Excellent step-by-step reasoning; explicitly flags assumptions and uncertainty",
            chatgpt: "Strong chain-of-thought; sometimes rushes to conclusion in longer chains",
            gemini:  "Good reasoning; shines on research-backed chains with source citation",
            copilot: "Functional reasoning; best suited to structured business analysis",
            note: "Maya found Claude most useful for complex decision analysis using chain-of-thought.",
          },
          {
            dimension: "Example-Based Prompts (Show the Template)",
            winner: "ChatGPT",
            claude:  "Good pattern matching from examples; consistent",
            chatgpt: "Excellent pattern matching; GPT-4o is particularly strong at style mimicry",
            gemini:  "Good example matching; strong for structured format replication",
            copilot: "Best for M365 document templates and business format replication",
            note: "When Maya provides an example and says 'do this for my thing' — ChatGPT's style matching is exceptional.",
          },
          {
            dimension: "Iterative Improvement ('What's the Weakest Part?')",
            winner: "Claude",
            claude:  "Gives honest, specific critique; flags the actual weakness rather than minor edits",
            chatgpt: "Good critique; sometimes more diplomatic than useful",
            gemini:  "Strong critique when given a research basis to reference",
            copilot: "Useful critique for business documents; stays close to M365 conventions",
            note: "Maya's iterative prompts need someone to argue with her. Claude argues back most usefully.",
          },
        ],
        verdict: "For complex prompt engineering across all 6 patterns — Claude is the most reliable engine. ChatGPT wins on style mimicry. Gemini on research-grounded reasoning. Copilot for M365-native work. Match the tool to the pattern.",
        question: "Maya is using Pattern 4 (Chain of Thought) to analyze a complex product strategy decision with 7 dependencies. Which AI will most reliably walk through all 7 step by step without losing the thread?",
        choices: [
          {
            label: "A",
            text: "Claude — handles complex multi-step reasoning while holding all 7 dependencies simultaneously",
            correct: true,
            feedback: "Correct. Claude's architecture for holding complex multi-step context — combined with its tendency to explicitly flag assumptions and uncertainty — makes it the most reliable for a 7-dependency chain-of-thought analysis. It won't shortcut to a conclusion when the chain gets complicated.",
          },
          {
            label: "B",
            text: "ChatGPT — it has the most advanced reasoning model",
            correct: false,
            feedback: "ChatGPT's reasoning is excellent — but in head-to-head tests on long, complex chains with many dependencies, it sometimes rushes to a conclusion before fully walking through all the steps. For a 7-dependency analysis where missing one dependency breaks the reasoning, Claude's systematic approach is more reliable.",
            wrongFeedback: "Advanced ≠ complete. ChatGPT sometimes shortcuts long chains. For a 7-dependency analysis, systematic completion matters more than raw capability.",
          },
          {
            label: "C",
            text: "Gemini — largest context window handles the most complexity",
            correct: false,
            feedback: "Gemini's large context window is an advantage for reading large documents — but chain-of-thought quality is about reasoning depth, not context length. For a 7-dependency strategy analysis, the reasoning architecture matters more than how much text it can hold.",
            wrongFeedback: "Context window size handles text volume, not reasoning depth. Chain-of-thought is about systematic reasoning, not memory.",
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 12 — REVELATION
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s12",
      type: "revelation",
      revealText:
        "Maya didn't become a better AI user. She became a better thinker.\n\nBecause every prompt is a question: can I be specific about what I need?\n\nMost people can't. Not because they lack intelligence — because they've never been forced to. The AI just makes the vagueness visible.\n\nWhen you can't write a good prompt, you don't actually know what you want. The blank prompt box is a mirror.\n\nMaya still gets bad AI outputs sometimes. But now she knows exactly why, and exactly what to change.\n\nShe writes one prompt. Gets the thing. Moves on.\n\nYou now know what she knows.\n\nThe next time you open any AI tool — Claude, ChatGPT, Gemini, Copilot — you're not asking it to guess.\n\nYou're conducting.",
      xpAward: 200,
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SCENE 13 — HANDOFF: Maya → Jake (full circle back to Game 1)
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: "pl-s13",
      type: "handoff",
      character: "Maya",
      location: "DESIGN STUDIO · DOOR OPEN",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Maya",
          avatar: "protagonist" as const,
          text: "You know what I love about this job? Every person I teach the prompt stack to — they go back and replay something they already know. And it hits completely differently.",
        },
        {
          speaker: "Maya",
          avatar: "protagonist" as const,
          text: "There's a guitarist — Jake — who started all of this. Before any of us. He typed 'write me a song' and got elevator music. Remember that?",
        },
        {
          speaker: "Maya",
          avatar: "protagonist" as const,
          text: "Go back and look at that moment with what you know now. 'Write me a song' — how many layers of the Prompt Stack is that? Zero. Not one.",
        },
        {
          speaker: "Maya",
          avatar: "protagonist" as const,
          text: "And then look at what he figured out by the end — 'A fingerstyle piece in Am. 68 BPM. The grief of watching someone you love choose to leave. The chord that reaches but never resolves.' That's five layers of the stack. He got there by instinct.",
        },
        {
          speaker: "Maya",
          avatar: "protagonist" as const,
          text: "Now you have the vocabulary for what he discovered. The conductor metaphor. The prompt stack. Same truth — two different languages for it. Go back to where it started. You'll understand something you couldn't before.",
        },
      ],
    },

  ],
}
