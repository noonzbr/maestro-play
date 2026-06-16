import { Game } from "./types"

/**
 * GAME 2 — "Signal vs. Noise"
 * Character: Zoe Chen, 19-year-old session drummer
 * Core concept: What is AI — and what is NOT?
 * Busts 5 myths: sentience, accuracy, neutrality, creativity, replacement
 *
 * BRANCHING MAP:
 *   [0]  w2-intro-learn    → learn scene (no choices, Continue)
 *   [1]  w2-branch-1       → skipFeedback, 4 paths
 *   [2]  w2-myth-1         → PATH A quiz
 *   [3]  w2-myth-2         → PATH A, nextLeadsTo: w2-crucible
 *   [4]  w2-middle-1       → PATH B/C quiz
 *   [5]  w2-middle-2       → PATH B/C, nextLeadsTo: w2-crucible
 *   [6]  w2-conductor-1    → PATH D quiz
 *   [7]  w2-conductor-2    → PATH D, nextLeadsTo: w2-boss
 *   [8]  w2-crucible       → skipFeedback: A→ending-2, B→w2-recovery
 *   [9]  w2-recovery       → sequential → w2-boss
 *   [10] w2-boss           → sequential → w2-ending-1
 *   [11] w2-ending-1       → THE CONDUCTOR, nextLeadsTo: w2-ai-compare
 *   [12] w2-ending-2       → THE WAKE-UP, nextLeadsTo: w2-ai-compare
 *   [13] w2-ai-compare     → nextLeadsTo: w2-handoff
 *   [14] w2-handoff        → end
 *
 * Jake's EP threads through the narrative — referenced in intro and Ending 1 —
 * connecting Game 2 to Game 1's story without naming Jake until the final reveal.
 */

export const game2: Game = {
  slug:           "how-ai-works",
  week:           2,
  free:           true,
  title:          "Signal vs. Noise",
  emoji:          "🥁",
  icon:           "metronome" as const,
  accentColor:    "#f59e0b",
  duration:       "10 min",
  description:    "A viral post. A music exec. Five AI myths that could end Zoe's career — or launch it into something she never saw coming.",
  tagline:        "AI isn't what they told you. That gap is your advantage.",
  characterName:  "Zoe",
  characterRole:  "19-year-old session drummer",
  characterBlurb: "She replaced every myth about AI with something far more useful: clarity.",
  characterImage: "/images/zoe.png",
  maestroImage:   "/images/maestro-zoe.png",
  maestroLine:    "The last time she was just a drummer...",
  maestroSubline: "Zoe didn't survive the AI era. She became the one who explains it.",
  audioTrack:     "/audio/zoe-glass-circuit.mp3",
  felipeOutroVideo: "/videos/felipe-game2.mp4",     // ✅ already exists
  aiModel:        "general" as const,

  nextGame: {
    slug:         "ai-for-professionals",
    character:    "Carlos",
    teaserLine:   "You now know what AI is — and what it isn't. But knowing the theory and deploying it in a real professional career are completely different problems. Carlos figured out a framework that actually works — and it almost cost him everything to find it.",
    previewImage: "/images/carlos.png",
  },

  mondayPrompt: "You are my research assistant. I need you to fact-check this claim: [CLAIM]. Do NOT simply confirm it. Search for contradictions, caveats, and sources that challenge it. Present: 1) Evidence supporting it, 2) Evidence against it, 3) Your confidence rating (1-10). If you are uncertain about any source, say so explicitly.",

  intro: {
    sceneImage: "/images/scene-zoe.png",
    sceneColor: "#0a0608",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "RECORDING STUDIO · TUESDAY · 2:14 PM" },
      { type: "narration", text: "She'd played 3,000 sessions. She'd never once been replaced by a machine. Until Marcus called." },
      { type: "dialogue",  speaker: "Marcus", text: "Hey Zoe. Label absolutely loved the track. They think the drum track is incredible. 'Very human,' they said. 'Very real.'" },
      { type: "dialogue",  speaker: "Zoe", text: "Great. When do we track the rest of the album?" },
      { type: "dialogue",  speaker: "Marcus", text: "Well, that's the thing... we don't need to. I used a plugin. Cost me $8 a month. They couldn't tell the difference." },
      { type: "location",  text: "ZOE'S DRUM STOOL · MOMENTS LATER" },
      { type: "narration", text: "Zoe sat in silence. She had two choices. She could panic. Or she could figure out what she was actually up against." },
      { type: "dialogue",  speaker: "Zoe", text: "Everyone is afraid of the wrong version of AI. They're afraid of a machine that thinks, feels, and wants things. But that AI doesn't exist." },
      { type: "dialogue",  speaker: "Zoe", text: "What exists is a prediction machine. It calculates what note or beat is most likely to come next based on patterns. It's not creative. It's statistical." },
      { type: "dialogue",  speaker: "Zoe", text: "So the question isn't 'will AI replace me?' The question is: 'Do I understand the patterns well enough to direct them?'" },
      { type: "final",     text: "The beat goes on. But the people who understand what AI actually is aren't afraid of the machine—they're the ones holding the sticks." },
    ],
  },

  scenes: [

    // ─────────────────────────────────────────────────────────────────────────
    // [0] LEARN — What AI Actually IS (foundation before the choice)
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:       "w2-intro-learn",
      type:     "learn",
      location: "RECORDING STUDIO · HALLWAY · 3:00 PM",
      xpAward:  30,
      concept: {
        title: "FIVE THINGS AI IS NOT",
        body:  "AI is not conscious (no feelings/awareness) and not always accurate (hallucinates likely text). It is not neutral (reflects bias) and does not create (only executes direction). Crucially, AI never replaces human judgment — it only amplifies it.",
      },
      scenarioText:   "Marcus replaced his live drummer with an $8/month AI plugin. Stunned, Zoe searches her phone. She needs to understand what AI actually IS to survive this shift.",
      learnHighlight: "Understanding what AI isn't is the first step to directing it with clarity.",
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [1] MATCH — Zoe Chen's DM from TechBeat247 (Mitigating text overload with Matching game)
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:           "w2-branch-1",
      type:         "match",
      location:     "SOCIAL MEDIA · 11:52 PM",
      character:    "Zoe, Session Drummer, 19",
      scenarioText: "Music blogger TechBeat247 DMs Zoe: 'Our 50,000 followers want one honest summary: What IS AI? Let's bust the popular myths.' Zoe designs an interactive Matching challenge to clarify the hype.",
      question:     "Match each popular AI Myth to its underlying Reality:",
      matchPairs: [
        { left: "Myth: AI Thinks Like a Human",  right: "Reality: It completes statistical patterns of training data" },
        { left: "Myth: AI is Conscious/Aware",   right: "Reality: It has no feelings, intent, or self-awareness" },
        { left: "Myth: AI is Objective/Neutral", right: "Reality: It systematizes and amplifies training data biases" },
        { left: "Myth: AI Replaces Human Taste",  right: "Reality: It only executes direction; human judgment defines quality" }
      ],
      xpAward:      35,
      nextLeadsTo:  "w2-mechanism-order",
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [2] ORDER — Engineering Process (Interactive sequence ordering)
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:           "w2-mechanism-order",
      type:         "order",
      location:     "RECORDING STUDIO · THE GIG",
      character:    "Zoe, Session Drummer, 19",
      scenarioText: "The post goes viral! Diana Voss (VP at Meridian Records) notices Zoe's clarity and invites her to present to the A&R team. Before the meeting, Diana's lead engineer tests Zoe: 'Order the steps of how a prediction machine generates output.'",
      question:     "Arrange these steps in the correct sequence to show how AI calculates its output:",
      orderItems: [
        { id: "1", text: "Read the user's prompt and active context window", correctPosition: 1 },
        { id: "2", text: "Scan training data to match statistical patterns", correctPosition: 2 },
        { id: "3", text: "Calculate the most likely next note or word token", correctPosition: 3 },
        { id: "4", text: "Output the prediction and repeat the generation loop", correctPosition: 4 }
      ],
      xpAward:      40,
      nextLeadsTo:  "w2-crucible",
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [8] THE CRUCIBLE — Decision under pressure (skipFeedback)
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:           "w2-crucible",
      type:         "scenario",
      skipFeedback: true,
      location:     "MERIDIAN RECORDS · CONFERENCE ROOM · THURSDAY",
      xpAward:      0,
      character:    "Zoe, Session Drummer, 19",
      scenarioText: "Diana grills her: 'One producer uses AI for speed/cost. Another refuses it. Artistically, they're equal. Why should I keep paying the non-AI producer?'",
      question:     "What does Zoe say to Diana Voss?",
      choices: [
        {
          label:   "A",
          text:    "Because there's something in human-made music that AI can't replicate — call it soul, presence, intentionality. Your audience feels it even if they can't name it.",
          leadsTo: "w2-ending-2",
        },
        {
          label:   "B",
          text:    "The question isn't human vs. AI. It's the quality of judgment the human brings to the AI. Give both producers the same tools. The one with better musical judgment will produce better output. You're not comparing human to AI — you're comparing two different quality directors.",
          leadsTo: "w2-recovery",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [9] RECOVERY — One more chance before the boss
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:        "w2-recovery",
      type:      "scenario",
      character: "Zoe, Session Drummer, 19",
      location:  "MERIDIAN RECORDS · CONFERENCE ROOM",
      xpAward:   25,
      scenarioText: "Diana summarizes: 'So, equip the producer who has better judgment with AI tools, and their output will surpass the speed-focused producer.' Zoe: 'Yes. The tool is neutral; judgment isn't.' Diana nods. 'Then what is your recommendation?'",
      question:  "What actionable recommendation does Zoe give Diana?",
      choices: [
        {
          label:    "A",
          text:     "Fire both and hire someone who already uses AI well — you need a clean slate",
          correct:  false,
          feedback: "This discards proven musical judgment to chase an efficiency metric. Musical judgment takes years to build. AI skills can be taught in weeks. Always invest in the scarce resource.",
        },
        {
          label:    "B",
          text:     "Train your non-AI producer in AI tools. Then evaluate your AI-only producer on the quality of creative direction — not output speed.",
          correct:  true,
          feedback: "Right. You can teach AI tools in a week. You cannot teach a decade of musical judgment in a week. Invest in the scarce resource. The bottleneck in AI-assisted creative work is almost never the tool — it's the quality of the human directing it.",
        },
        {
          label:    "C",
          text:     "Keep the AI producer — efficiency wins in today's market and will increasingly determine commercial success",
          correct:  false,
          feedback: "Efficiency with poor judgment produces poor output faster. The market rewards great output. Diana's real problem isn't cost or speed — it's having producers with the right combination of judgment AND efficiency. Speed without direction is just noise amplified at scale.",
        },
        {
          label:    "D",
          text:     "It depends on the genre — some genres require human touch, others are naturally more AI-compatible",
          correct:  false,
          feedback: "Genre is a surface variable. The underlying truth is constant across creative domains: human judgment determines the quality of AI-directed output. Redirecting Diana's question toward genre avoids the framework she came here to understand.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [10] BOSS — Diana Voss's Real Test (5 rounds, AI myth-busting)
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:        "w2-boss",
      type:      "boss",
      location:  "MERIDIAN RECORDS · THE REAL TEST",
      xpAward:   0,
      character: "Diana Voss, VP Artist Development, Meridian Records",
      npcLine:   "Let's test your framework. Five real situations my team faced this month. Get them right to prove you understand this tech.",
      scenarioText: "Diana pulls out her notebook. 'Every time AI confused my A&R team, I wrote it down. Let's see if your clarity holds under pressure.'",
      bossQuestions: [

        // Round 1 — Accuracy / Hallucination
        {
          question: "Your A&R manager told the team: 'ChatGPT confirmed this artist is the most-streamed Brazilian act of 2024.' Your team nearly booked them for a headlining slot based on this. What is the critical problem?",
          npcLine:  "This one actually cost us money last quarter.",
          choices: [
            {
              label:    "A",
              text:     "ChatGPT's training data is outdated — it doesn't have access to real-time streaming numbers",
              correct:  false,
              feedback: "Training cutoffs are a real issue — but secondary here. The fundamental problem: AI language models generate plausible-sounding text, not verified facts. Even with current data access, an LLM would state this with equal confidence whether it was querying a real database or simply producing what sounds like a credible analysis.",
            },
            {
              label:    "B",
              text:     "AI language models generate confident-sounding text — they don't verify specific claims against a live database. 'Most-streamed' is a precise factual claim that requires real data.",
              correct:  true,
              feedback: "Exactly. ChatGPT doesn't query Spotify. It generates text that sounds like what follows from your prompt. 'Most-streamed Brazilian artist' is exactly what a credible music AI analyst would say — so it generated it. Every specific factual claim from an AI requires external verification. No exceptions, regardless of how confident the AI sounds.",
            },
            {
              label:    "C",
              text:     "Your team should use a specialized music data AI instead of a general AI like ChatGPT",
              correct:  false,
              feedback: "Specialized tools that query actual databases are different — but the lesson applies everywhere: understand what class of tool you're using and what it can and cannot do. Generic LLMs do not verify claims against real-world data sources. Know the boundary.",
            },
            {
              label:    "D",
              text:     "AI is generally unreliable and shouldn't inform major business decisions at all",
              correct:  false,
              feedback: "Overcorrection. AI is highly reliable for synthesis, pattern analysis, ideation, editing, and research. It's specifically unreliable for precise factual claims requiring external verification. The capability boundary matters — don't erase a useful tool because you misunderstood where it ends.",
            },
          ],
        },

        // Round 2 — Neutrality / Bias
        {
          question: "Your label's A&R algorithm recommends 'rock artists' predominantly from one demographic. The engineer says: 'AI is objective — it just found what performs.' What do you tell him?",
          npcLine:  "This came up in our DEI audit last month. The engineer genuinely believed he was correct.",
          choices: [
            {
              label:    "A",
              text:     "The AI is correct — it found objective patterns in actual performance data that reflect industry reality",
              correct:  false,
              feedback: "Performance data isn't neutral — it reflects who historically got promoted, who received radio play, who had label support, who got mainstream marketing. An AI that learns from this data learns structural advantage, not objective musical quality or listener preference.",
            },
            {
              label:    "B",
              text:     "AI reflects its training data — if the data contains historical bias, the AI amplifies and presents that bias as objective fact",
              correct:  true,
              feedback: "Right. 'Objective' means 'without subjective judgment.' But training data contains the accumulated decisions of humans with subjective judgment, historical bias, and structural inequality. AI that learns from that data doesn't transcend the bias — it systematizes and legitimizes it. That's more dangerous than explicit human bias.",
            },
            {
              label:    "C",
              text:     "There's a technical bug in the algorithm — someone needs to find and fix it in the code",
              correct:  false,
              feedback: "There may be no bug at all. The algorithm might be doing exactly what it was designed to do — and the training data is the source of the problem. Framing it as a technical error locates the fix in the wrong place and leads to the wrong solution.",
            },
            {
              label:    "D",
              text:     "This is purely a legal and HR compliance issue — route it through those departments",
              correct:  false,
              feedback: "It may become a legal matter — but addressing it requires understanding AI first. Routing it entirely to compliance avoids the question of why the AI does this and how to fix it at the source. Legal and technical understanding need to work together here.",
            },
          ],
        },

        // Round 3 — Creativity Myth
        {
          question: "A producer tells you: 'Suno AI generated this entire track — there is zero human creativity in it.' Your artist is deciding whether to release it. What's accurate?",
          npcLine:  "This is the one my team gets wrong every single time. Every time.",
          choices: [
            {
              label:    "A",
              text:     "The producer is right — AI-generated music contains no human creativity by definition",
              correct:  false,
              feedback: "The producer made hundreds of creative decisions: the prompt, the genre descriptors, the emotional tone, the iteration choices, the decision to stop at this version, the selection from multiple outputs. Every single one required creative judgment. AI executed. Humans originated. 'AI made this' erases the human work.",
            },
            {
              label:    "B",
              text:     "Human creativity lives in every decision the human made while directing the AI — the prompt, the vision, the curation, the selection",
              correct:  true,
              feedback: "Right. 'The AI made this' is never the complete story. 'I directed AI to make this using my creative judgment' is what actually happened. This matters for understanding the craft, improving future work, and increasingly for legal attribution. The direction IS the creativity.",
            },
            {
              label:    "C",
              text:     "It's genuinely ambiguous — AI creativity is still legally and philosophically undefined",
              correct:  false,
              feedback: "The legal dimension is real but separate from the descriptive question. Whether human creativity was present doesn't wait for a legal definition — it's observable. Humans made choices. Choices are creativity. The law will catch up; the underlying reality is already clear.",
            },
            {
              label:    "D",
              text:     "The track should be labeled as AI-generated for transparency — that settles the question",
              correct:  false,
              feedback: "Transparency is a good practice — but a separate question from creative attribution. You can be fully transparent about AI use AND accurate about the human creative contribution. These aren't either/or. Transparency doesn't resolve the attribution question.",
            },
          ],
        },

        // Round 4 — Vague Prompt / Specificity
        {
          question: "Your artist used Claude to write their album liner notes. They're polished. The artist is proud. But you read them and they sound like every AI-assisted artist's liner notes you've seen this year. What happened — and how do you fix it?",
          npcLine:  "I see this mistake constantly. It's subtle until you know what to look for.",
          choices: [
            {
              label:    "A",
              text:     "Claude isn't well-suited for capturing individual artistic voice — they should try a different AI model",
              correct:  false,
              feedback: "Claude is capable of extraordinary voice capture — when given specific material to anchor to. The model isn't the problem. The prompt is. 'Write in my voice' without examples gives Claude nothing specific about this artist. It defaults to the voice of every artist who has asked that question before.",
            },
            {
              label:    "B",
              text:     "Vague prompts activate generic patterns — 'write in my voice' without examples, transcripts, or references gives AI nothing specific to work from",
              correct:  true,
              feedback: "Exactly. AI predicts what follows from your input. 'Write in my voice' is a prompt thousands of artists have submitted. Claude generates what statistically follows from that prompt across all of them — which is the average of 'authentic-sounding artist statement.' Feed it specific examples and it produces specific, distinctive output.",
            },
            {
              label:    "C",
              text:     "AI fundamentally cannot capture individual artistic voice — this is an inherent technological limitation",
              correct:  false,
              feedback: "Artists who gave Claude dozens of examples of their own writing, emails, interview transcripts, and creative notes have gotten outputs indistinguishable from their own voice. The limitation isn't technological; it's the specificity of context provided. Feed the machine what makes you specific.",
            },
            {
              label:    "D",
              text:     "The liner notes are probably fine — all liner notes sound similar anyway and audiences don't read them carefully",
              correct:  false,
              feedback: "The opportunity isn't 'are these acceptable.' It's: AI could help this artist produce liner notes that are genuinely, distinctively them — capturing the specific voice that makes them stand out in a flooded market. Accepting generic when specific is achievable is leaving real value on the table.",
            },
          ],
        },

        // Round 5 — Replacement Myth (the big one)
        {
          question: "A new artist on your roster says: 'AI is going to replace me.' A veteran artist says: 'AI can never replace me — I have soul.' Which gives them a more useful framework for the next decade?",
          npcLine:  "This is the question I wish someone had answered honestly for me five years ago.",
          choices: [
            {
              label:    "A",
              text:     "The veteran is right — authentic human artistry, lived experience, and soul cannot be replicated by any AI system",
              correct:  false,
              feedback: "The veteran's confidence might be warranted — but 'I have soul' is not a strategy. It's a belief. What makes a human artist irreplaceable isn't just their essence — it's their specific ability to direct AI toward outputs only they would create. Soul without a framework for directing AI is a posture, not a position.",
            },
            {
              label:    "B",
              text:     "The new artist is right to be concerned — AI capabilities are advancing faster than most realize",
              correct:  false,
              feedback: "Fear without direction isn't useful to anyone. The new artist's concern is understandable but not actionable. What they need is a framework for where human value lives in an AI-augmented world — not validation of the anxiety.",
            },
            {
              label:    "C",
              text:     "Neither — the most useful frame is: AI amplifies whoever directs it. The question isn't 'will AI replace me' but 'how do I become the best possible director of AI in my craft'",
              correct:  true,
              feedback: "Right. AI doesn't replace humans — it amplifies the humans directing it. Artists who understand AI well enough to direct it toward their specific creative vision will outperform both: the afraid artist who refuses it, and the naive artist who uses it as a substitute for creative direction. Direction is the skill that matters now.",
            },
            {
              label:    "D",
              text:     "This is too philosophical — artists should focus on craft and not get distracted by AI questions",
              correct:  false,
              feedback: "Ignoring AI doesn't protect artists from it. In 2026, the craft question and the AI question are the same question. How you use AI IS part of craft now. Artists who understand this are making better work faster. Artists who ignore it are making the same work slower.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [11] ENDING 1 — THE CONDUCTOR
    // Path: Any route through boss victory
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:          "w2-ending-1",
      type:        "revelation",
      location:    "MERIDIAN RECORDS · DIANA'S OFFICE",
      xpAward:     100,
      nextLeadsTo: "w2-ai-compare",
      revealText:  "Diana Voss slides a contract across the table: 'AI Music Education Consultant.'\n\n'Why me?' Zoe asks.\n\n'Every consultant either says AI is magic or says it's a threat,' Diana answers. 'You showed my team what it actually is: a pattern-completing mirror. And then you showed them how that changes their actual jobs.'\n\nZoe signs.\n\nShe realizes now why her friend's AI-directed EP felt so human. The AI simply reflected the human's five years of musical taste and precise creative direction. The AI is a mirror; human direction is the signal. All the hype and fear is just noise.",
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [12] ENDING 2 — THE WAKE-UP
    // Path: Crucible choice A (soul answer) → direct to this ending
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:          "w2-ending-2",
      type:        "revelation",
      location:    "MERIDIAN RECORDS · LOBBY",
      xpAward:     100,
      nextLeadsTo: "w2-ai-compare",
      revealText:  "Diana Voss sighs. 'Betting on \"soul\" over strategy isn't a plan. The artists who do that are watching AI-directed competitors outperform them. Not because AI has soul, but because the human directors have better musical judgment and scale.'\n\nShe leans in. 'It's not magic. It's taste, curation, and knowing when to stop. When you can name it, you can protect it. But calling it magic leaves you defenseless.'\n\nZoe leaves without a contract, but with something better: she finally knows the difference between feeling right and being right, and how to close the gap.",
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [13] AI COMPARE — The Right Tool for the Right Job
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:          "w2-ai-compare",
      type:        "ai-compare",
      location:    "MERIDIAN RECORDS · PRESENTATION ROOM",
      xpAward:     10,
      nextLeadsTo: "w2-ai-compare-quiz",
      character:   "Zoe, Session Drummer, 19",
      scenarioText: "Zoe concludes her presentation: 'The Right Tool for the Right Job.' Different AI tools are trained for different tasks and fail in different ways. Choosing the right one is key.",
      aiCompare: {
        models:   ["claude", "chatgpt", "gemini", "copilot"],
        headline: "AI Tools in Music & Creative Work — What Each Actually Does",
        context:  "Every AI tool is a prediction machine — but each was trained on different data, optimized for different tasks, and has different capability limits. For creative professionals, choosing the right tool for the right task is a real skill.",
        rows: [
          {
            dimension: "Long-form creative writing & voice",
            winner:    "Claude",
            claude:    "Maintains consistent voice across thousands of words; nuanced and context-aware",
            chatgpt:   "Strong but can lose consistency in very long pieces",
            gemini:    "Good for summaries; weaker on sustained creative narrative",
            copilot:   "Optimized for professional docs — not creative voice",
            note:      "For artist bios, liner notes, press kits, and long-form creative text, Claude's extended context and training make it the most consistent.",
          },
          {
            dimension: "Music lyrics & songwriting",
            winner:    "ChatGPT",
            claude:    "Excellent with detailed context and examples; strong rhythm instinct",
            chatgpt:   "Versatile; strong natural rhyme and rhythm; widely trained on lyric formats",
            gemini:    "Competent but generic without highly specific prompting",
            copilot:   "Not optimized for creative or artistic writing tasks",
            note:      "Both Claude and ChatGPT perform well. The quality of your prompt matters far more than the tool — give either one specific examples of your voice.",
          },
          {
            dimension: "Factual research & live data",
            winner:    "Gemini",
            claude:    "Strong synthesis; verify specific claims independently",
            chatgpt:   "Hallucinates confidently on specific facts — always verify",
            gemini:    "Google Search integration provides real-time, verifiable information",
            copilot:   "Bing integration helps with recency and current events",
            note:      "No AI replaces primary source verification for specific factual claims — but Gemini's live search integration makes it the most reliable for current data.",
          },
          {
            dimension: "Professional emails & business writing",
            winner:    "Copilot",
            claude:    "Excellent professional tone; works in any context",
            chatgpt:   "Strong; widely used in business; natural professional register",
            gemini:    "Good with Google Workspace integration (Docs, Gmail)",
            copilot:   "Built for Microsoft 365 — native in Outlook, Word, Teams; eliminates friction",
            note:      "If your team lives in Microsoft 365, Copilot's native integration is a real workflow advantage. Otherwise Claude and ChatGPT perform similarly.",
          },
          {
            dimension: "Acknowledging its own limitations",
            winner:    "Claude",
            claude:    "Most consistently transparent about uncertainty; says 'I'm not sure' when appropriate",
            chatgpt:   "Sometimes overconfident; less likely to flag uncertain claims",
            gemini:    "Reasonably calibrated; improving",
            copilot:   "Optimized for helpfulness; sometimes at the expense of accuracy",
            note:      "When you need an AI to tell you what it doesn't know — before you make a business decision based on it — Claude is most likely to say so.",
          },
        ],
        verdict:  "The tool matters less than you think. Your prompt, your context, and the quality of your creative direction matter far more. Learn the strengths of each — then focus most of your energy on becoming a better director. The bottleneck is almost never the AI.",
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [13b] AI COMPARE QUIZ — The Right Tool Quiz
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:           "w2-ai-compare-quiz",
      type:         "quiz",
      character:    "Zoe, Session Drummer, 19",
      location:     "MERIDIAN RECORDS · PRESENTATION ROOM",
      xpAward:      20,
      nextLeadsTo:  "w2-handoff",
      scenarioText: "An A&R manager asks: 'Which AI should our team use for evaluating new artists?' What's the most accurate guidance?",
      choices: [
        {
          label:    "A",
          text:     "Claude — it's the most nuanced and understands creative work better than the alternatives",
          correct:  false,
          feedback: "Claude excels at creative synthesis — but 'evaluating new artists' involves specific factual research (streaming numbers, tour history) that requires live data. No single AI is the complete answer for complex professional workflows. Match tool to task.",
        },
        {
          label:    "B",
          text:     "ChatGPT — it's the most widely tested and has the largest music industry user base",
          correct:  false,
          feedback: "Wide adoption doesn't solve the tool-task mismatch. ChatGPT excels at generation and synthesis — less so for specific factual claims about real artists. A widely-used tool used incorrectly still produces incorrect output.",
        },
        {
          label:    "C",
          text:     "Use the right tool for each part of the task — Gemini for factual research, Claude or ChatGPT for synthesis and writing, and verify specific claims with primary sources regardless of which AI you use",
          correct:  true,
          feedback: "Right. 'Which AI should we use?' is almost always the wrong question. 'What are we trying to accomplish at this step?' is the right question. Different tools, different tasks, different parts of the workflow — and human verification of specific factual claims is non-negotiable no matter which AI you use.",
        },
        {
          label:    "D",
          text:     "None — AI doesn't understand music and shouldn't be part of A&R decision-making",
          correct:  false,
          feedback: "Overcorrection. AI can synthesize press coverage, surface competitive context, identify genre trends, draft research briefs, and generate outreach — all genuinely valuable in A&R. The limitation is specific factual claims and genuine musical taste. Know the boundary; don't erase the tool.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // [14] HANDOFF — Zoe → Carlos (Game 3)
    // ─────────────────────────────────────────────────────────────────────────
    {
      id:       "w2-handoff",
      type:     "handoff",
      location: "RECORDING STUDIO · THE NEXT WEEK",
      xpAward:  0,
      dialogue: [
        {
          speaker: "Zoe",
          avatar:  "protagonist" as const,
          text:    "I came into this thinking the question was: 'Can AI replace me?' I'm leaving with a completely different question.",
        },
        {
          speaker: "Zoe",
          avatar:  "protagonist" as const,
          text:    "The question is: 'What is the quality of the human directing the AI?' That's the only variable that matters at the level of excellence. And that variable — that's me. That's entirely on me.",
        },
        {
          speaker: "Zoe",
          avatar:  "protagonist" as const,
          text:    "But here's what I'm still figuring out. Knowing what AI is — and actually deploying it inside a real professional career, with real stakes and real clients — those are two completely different problems. Has anyone actually cracked that?",
        },
        {
          speaker: "Carlos",
          avatar:  "npc" as const,
          text:    "Someone has. But it took two years, three failed projects, one jazz gig that almost broke me, and a boardroom moment I nearly didn't survive. Come find me at Nexus Group.",
        },
      ],
    },

  ],
}
