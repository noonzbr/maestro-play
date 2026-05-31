import { Game } from "./types"

export const game2: Game = {
  slug: "how-ai-works",
  week: 2,
  free: true,
  title: "Discover How AI Works",
  emoji: "🧠",
  icon: "headphones" as const,
  duration: "7 min",
  description: "Understand what's actually happening inside AI — why your inputs produce the outputs they do.",
  tagline: "Same tool. Wildly different results. Here's why.",
  characterName:  "Zoe",
  characterRole:  "19-year-old drummer",
  characterBlurb: "A rhythm-driven drummer uncovering how AI actually thinks — and why it's not magic",
  characterImage: "/images/zoe.png",
  maestroImage:   "/images/maestro-zoe.png",
  maestroLine:    "The last time she was just a drummer...",
  maestroSubline: "Zoe's rhythm just found its conductor. Keep the beat.",
  audioTrack:     "/audio/zoe-glass-circuit.mp3",
  intro: {
    sceneImage: "/images/scene-zoe.png",
    sceneColor: "#0a0608",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "REHEARSAL STUDIO · FRIDAY · 9:22 PM" },
      { type: "narration", text: "She kept time for everyone else — and somehow never had any left for herself." },
      { type: "dialogue",  speaker: "Marcus", text: "My producer used AI to map the entire album arrangement in one afternoon. Said he doesn't need a session drummer anymore. Just samples and stems." },
      { type: "final",     text: "The beat goes on — but the question is who's keeping it now." },
    ],
  },
  aiModel:  "general" as const,
  nextGame: {
    slug:         "ai-for-professionals",
    character:    "Carlos",
    teaserLine:   "Knowing HOW the AI works is step one. Now someone needs to actually put it to work. Carlos is a jazz saxophonist who figured out how to use AI in a real professional career — and the framework he built changes everything.",
    previewImage: "/images/carlos.png",
  },
  scenes: [

    // ── LEARN 1: How AI Actually Predicts Text ────────────────────────────────
    {
      id: "w2-learn-1",
      type: "learn",
      location: "REHEARSAL STUDIO · BEFORE PRACTICE",
      concept: {
        title: "HOW AI ACTUALLY PREDICTS TEXT",
        body: "Large language models don't 'know' things the way you know them. They predict. Given everything you've written so far, what's the most statistically likely next word? Then the next? And the next? That's it. No understanding. No consciousness. Just extraordinarily sophisticated pattern completion — at scale.",
      },
      scenarioText: "Zoe heard a drummer start a groove and her whole body knew exactly where beat two would land — before it arrived. AI predicts the same way: not thinking, just completing patterns at a scale she can barely imagine. Your input is the groove; everything the AI generates follows from it.",
      learnHighlight: "AI doesn't know the answer — it predicts the most likely next word, then the next, then the next.",
      xpAward: 25,
    },

    {
      id: "w2-s1",
      type: "scenario",
      character: "Zoe, Drummer, 19",
      location: "REHEARSAL STUDIO · AFTER PRACTICE",
      scenarioText:
        "You and your colleague both use ChatGPT Plus. She produces crisp, client-ready strategy memos. You get 600 words of fluffy generic text that doesn't reflect your company, your tone, or your actual ask. Same subscription. Same model. What's different?",
      question: "Why does AI produce such different results for different people using the same tool?",
      choices: [
        {
          label: "A",
          text: "Some people have a special premium account tier",
          correct: false,
          feedback:
            "Account tier affects speed and volume — not output quality for the same inputs. The model is the same. What changes the output is what you put in.",
        },
        {
          label: "B",
          text: "AI predicts the most likely next words from your input — better inputs train better predictions",
          correct: true,
          feedback:
            "Exactly right. AI language models are trained to predict the most statistically likely continuation of your text. Rich, structured, context-loaded inputs activate richer, more specific responses. Thin inputs activate thin, generic completions.",
        },
        {
          label: "C",
          text: "The AI randomly picks different quality levels each time",
          correct: false,
          feedback:
            "Not random — probabilistic but guided. There's variance in outputs (controlled by 'temperature'), but the dominant driver is always input quality. Garbage in, garbage out applies here more than anywhere.",
        },
        {
          label: "D",
          text: "AI performs better for people who speak more formally",
          correct: false,
          feedback:
            "Formality has nothing to do with it. Clarity and context do. A casual but structured prompt outperforms a formal but vague one every time.",
        },
      ],
      xpAward: 100,
    },

    // ── LEARN 2: Why AI Makes Stuff Up ────────────────────────────────────────
    {
      id: "w2-learn-2",
      type: "learn",
      location: "REHEARSAL STUDIO · TAKING A BREAK",
      concept: {
        title: "WHY AI MAKES STUFF UP — HALLUCINATION EXPLAINED",
        body: "AI doesn't have a fact-checker. It predicts the most likely continuation of your prompt — and sometimes the most statistically likely-sounding sentence happens to be factually wrong. The model doesn't know it's wrong. It has no way to know. This is called hallucination, and every AI model does it.",
      },
      scenarioText: "Marcus's producer emailed a venue for the tour — and got no reply, because it had closed two years ago. The AI listed it with the same crisp confidence as the real ones, and nobody checked. That's hallucination: the pattern sounds right, the fact is wrong.",
      learnHighlight: "AI is always confident. Confidence is not accuracy. Verify any fact that matters before you act on it.",
      xpAward: 25,
    },

    {
      id: "w2-s2",
      type: "quiz",
      scenarioText:
        "Machine learning is how AI gets its capabilities. It learns patterns from data — billions of examples — rather than being programmed with explicit rules.",
      question: "Which of these is the clearest example of machine learning in action?",
      choices: [
        {
          label: "A",
          text: "A calculator that adds numbers using a fixed formula",
          correct: false,
          feedback:
            "That's rule-based programming — explicit logic, no learning. Machine learning is about finding patterns in data, not executing predetermined formulas.",
        },
        {
          label: "B",
          text: "An email filter that learned to flag spam by seeing millions of spam examples",
          correct: true,
          feedback:
            "Perfect. That email filter wasn't programmed with spam rules — it found patterns across millions of examples and built its own model of 'what spam looks like.' That's machine learning.",
        },
        {
          label: "C",
          text: "A website that shows you the same homepage every time",
          correct: false,
          feedback:
            "Static content. No learning, no adaptation. Machine learning systems improve and personalize based on new data — the opposite of a fixed webpage.",
        },
        {
          label: "D",
          text: "A GPS that follows pre-programmed turn-by-turn directions",
          correct: false,
          feedback:
            "Pre-programmed rules, not machine learning. A GPS that uses ML would learn from real-time traffic patterns and user behavior to improve its routes over time.",
        },
      ],
      xpAward: 150,
    },

    // ── LEARN 3: Context Windows and Temperature ───────────────────────────────
    {
      id: "w2-learn-3",
      type: "learn",
      location: "REHEARSAL STUDIO · PACKING UP",
      concept: {
        title: "CONTEXT WINDOWS AND TEMPERATURE",
        body: "Two concepts beginners hear constantly and rarely understand: context window (how much AI can 'see' at once) and temperature (how creative vs. predictable its outputs are). You don't need to set these as a normal user — but understanding them tells you a lot about why AI behaves the way it does.",
      },
      scenarioText: "Zoe imagined a drummer who could only hear the last four bars — everything before, gone. That's Claude's context window: when a chat runs long, the earliest messages fall out of frame and AI literally can't see them. Temperature is the other dial: low makes it precise, high makes it creative.",
      learnHighlight: "Context window = AI's working memory. Temperature = its creativity dial. Both explain why AI behaves the way it does.",
      xpAward: 25,
    },

    {
      id: "w2-s3",
      type: "quiz",
      scenarioText:
        "You type a question into Google. You get a list of links to pages that might have the answer. You type the same question into Claude. You get a direct, composed response. Same question. Completely different experience.",
      question: "What makes generative AI fundamentally different from a search engine?",
      choices: [
        {
          label: "A",
          text: "Search engines are faster",
          correct: false,
          feedback:
            "Speed is comparable. The difference is architectural — search retrieves existing pages, generative AI creates new text. Neither is inherently faster.",
        },
        {
          label: "B",
          text: "Generative AI creates new content by synthesizing patterns; search retrieves existing content",
          correct: true,
          feedback:
            "This is the key insight. Search finds a page someone already wrote. Generative AI synthesizes a response that may never have existed before — drawing on patterns learned from vast training data to create something new for your specific context.",
        },
        {
          label: "C",
          text: "Generative AI is always more accurate than search engines",
          correct: false,
          feedback:
            "Not always. AI can 'hallucinate' — generate plausible-sounding but incorrect information. Search links you to source documents you can verify. Each has strengths. Knowing when to use which is part of AI literacy.",
        },
        {
          label: "D",
          text: "Search engines use AI, generative AI doesn't",
          correct: false,
          feedback:
            "The reverse. Modern search engines increasingly use AI. Generative AI (like Claude, GPT-4, Gemini) is built entirely on AI — specifically large language models trained on massive text datasets.",
        },
      ],
      xpAward: 150,
    },
    {
      id: "w2-s4",
      type: "boss",
      scenarioText: "CONDUCTOR TEST — Three rapid-fire questions. Streak bonus: +50 XP for 3 in a row.",
      question: "An AI model generates text by doing which of the following?",
      choices: [
        {
          label: "A",
          text: "Searching the internet in real time for the best answer",
          correct: false,
          feedback: "Most base LLMs have no internet access — they work from training data. Some tools add search on top.",
        },
        {
          label: "B",
          text: "Predicting the most statistically likely next token given the input context",
          correct: true,
          feedback:
            "Correct. Under the hood, every LLM is doing sophisticated next-token prediction at scale. Your prompt is the context window. The model fills it forward.",
        },
        {
          label: "C",
          text: "Looking up answers in a built-in encyclopedia",
          correct: false,
          feedback: "Not a lookup system — a generative system. It creates rather than retrieves.",
        },
        {
          label: "D",
          text: "Randomly selecting words from its vocabulary",
          correct: false,
          feedback:
            "Weighted probability, not randomness. Temperature controls creativity, but the outputs are always statistically grounded in training patterns.",
        },
      ],
      xpAward: 250,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w2-compare",
      type: "ai-compare",
      character: "Zoe",
      location: "MUSIC STUDIO · LAPTOP OPEN",
      xpAward: 75,
      aiCompare: {
        models: ["claude", "chatgpt", "gemini", "copilot"],
        headline: "Four AI Tools — What Each One Is Actually Built For",
        context: "Now that you understand how AI works under the hood, it's time to understand why they're not all the same — even though they all use transformers and next-token prediction.",
        rows: [
          {
            dimension: "Creative & Long-Form Writing",
            winner: "Claude",
            claude:  "Nuanced, emotionally aware, resists cliché",
            chatgpt: "Clear and competent, slightly generic",
            gemini:  "Good; strong on structure",
            copilot: "Functional; M365-optimized writing",
            note: "Same architecture — different training emphasis. Claude was tuned to care about quality and nuance.",
          },
          {
            dimension: "Live Web Research",
            winner: "ChatGPT",
            claude:  "Limited real-time access",
            chatgpt: "Browses the web by default in GPT-4o",
            gemini:  "Deep Google Search integration",
            copilot: "Bing-powered live search",
            note: "If you need current events, stock prices, or live data — don't use Claude without a plugin.",
          },
          {
            dimension: "Google Workspace Integration",
            winner: "Gemini",
            claude:  "No native Workspace integration",
            chatgpt: "No native Workspace integration",
            gemini:  "Native in Gmail, Docs, Drive, Sheets",
            copilot: "M365 only",
            note: "If your team lives in Google, Gemini is already inside your tools.",
          },
          {
            dimension: "Microsoft 365 Integration",
            winner: "Copilot",
            claude:  "No native M365 integration",
            chatgpt: "Limited M365 integration",
            gemini:  "No native M365 integration",
            copilot: "Native in Word, Excel, Teams, Outlook",
            note: "If your org runs on Microsoft, Copilot is already in your tools waiting to be activated.",
          },
        ],
        verdict: "Same underlying technology. Different training, different integrations, different strengths. The best AI user knows which instrument to pick up for which song.",
        question: "Zoe needs to analyze patterns across 50 research papers she already has in Google Drive. Which AI tool is most naturally suited for this?",
        choices: [
          {
            label: "A",
            text: "Claude — best at nuanced comprehension",
            correct: false,
            feedback: "Claude is excellent at nuanced analysis — but it doesn't integrate natively with Google Drive. Zoe would need to copy/paste 50 papers manually. That's the wrong tool for this workflow.",
            wrongFeedback: "Claude is excellent at nuanced analysis — but it doesn't integrate natively with Google Drive. Zoe would need to copy/paste 50 papers manually. That's the wrong tool for this workflow.",
          },
          {
            label: "B",
            text: "Gemini — native Google Drive integration makes it the natural choice",
            correct: true,
            feedback: "Exactly. Gemini lives inside Google Workspace. It can access files in Drive directly, analyze multiple documents in one session, and synthesize patterns across all 50 papers without a single copy-paste. Same AI capability — but the integration removes all the friction.",
          },
          {
            label: "C",
            text: "ChatGPT — most powerful model overall",
            correct: false,
            feedback: "GPT-4o is powerful, but power without integration creates friction. Uploading 50 papers one by one, losing context across sessions — the workflow collapses. Integration beats raw capability here.",
            wrongFeedback: "GPT-4o is powerful, but power without integration creates friction. Uploading 50 papers one by one, losing context across sessions — the workflow collapses. Integration beats raw capability here.",
          },
          {
            label: "D",
            text: "Copilot — widest enterprise reach",
            correct: false,
            feedback: "Copilot is built for Microsoft 365. Google Drive is not in its native ecosystem. This is a Google workflow — use the Google-native AI.",
            wrongFeedback: "Copilot is built for Microsoft 365. Google Drive is not in its native ecosystem. This is a Google workflow — use the Google-native AI.",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w2-handoff",
      type: "handoff",
      character: "Zoe",
      location: "MUSIC STUDIO · LATE NIGHT",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Zoe",
          avatar: "protagonist" as const,
          text: "Okay. You now know what's actually happening inside these things. Next-token prediction. Statistical pattern matching. Context windows. That's the engine.",
        },
        {
          speaker: "Zoe",
          avatar: "protagonist" as const,
          text: "But an engine sitting in a garage does nothing. You need someone who knows how to drive it. And I mean — actually drive it. Not just tap the gas and hope.",
        },
        {
          speaker: "Zoe",
          avatar: "protagonist" as const,
          text: "There's this saxophonist, Carlos. He's been using AI in his consulting work for months now. Built a whole framework for it. Calls it the Maestro Method.",
        },
        {
          speaker: "Zoe",
          avatar: "protagonist" as const,
          text: "He showed me once. I watched him go from a blank page to a full client brief in about 20 minutes. Not because the AI is magic — because he knows exactly what to feed it.",
        },
        {
          speaker: "Zoe",
          avatar: "protagonist" as const,
          text: "Go learn his method. What I just gave you is the why. He'll show you the how.",
        },
      ],
    },

  ],
}
