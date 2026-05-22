import { Game } from "./types"

export const game5: Game = {
  slug: "claude-chat-unlocked",
  week: 5,
  free: true,
  title: "Unlock Claude Chat — Your AI Co-Pilot",
  emoji: "💬",
  icon: "volume" as const,
  duration: "9 min",
  description:
    "Discover what Claude Chat can really do — writing, coding, strategy, research — and why most people only ever see 10% of its power.",
  tagline: "It's not a chatbot. It's not a search engine. It's something entirely new.",
  characterName:  "Jordan",
  characterRole:  "28-year-old freelance consultant",
  characterBlurb: "A stretched-thin freelancer who learns Claude does the work of five people",
  characterImage: "/images/jordan.png",
  maestroImage:   "/images/maestro-jordan.png",
  maestroLine:    "The last time they were just a freelancer...",
  maestroSubline: "Jordan's thinking just found its conductor.",
  audioTrack:     "/audio/jordan-blue-cup-variations.mp3",
  intro: {
    sceneImage: "/images/scene-jordan.png",
    sceneColor: "#080608",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "COFFEE SHOP · MONDAY · 11:14 PM" },
      { type: "narration", text: "Three open proposals, one overdue invoice, and a creative brief they'd been staring at long enough to memorise every word." },
      { type: "dialogue",  speaker: "Client", text: "We actually went with a different agency. They turned around a full strategy deck overnight — said AI did most of the heavy lifting. We need that speed now, Jordan." },
      { type: "final",     text: "The solo artist and the orchestra are not enemies. They were always waiting to meet." },
    ],
  },
  scenes: [

    // ── LEARN 1: Claude vs. ChatGPT — Actually Different Tools ───────────────
    {
      id: "w5-learn-1",
      type: "learn",
      location: "COFFEE SHOP · MONDAY · 9:40 AM",
      concept: {
        title: "CLAUDE VS. CHATGPT — ACTUALLY DIFFERENT",
        body: "Claude and ChatGPT are both large language models, but they have genuinely different personalities, strengths, and design philosophies. Knowing the difference stops you from using the wrong tool for the job — or expecting the same experience from both.",
      },
      scenarioText: "Jordan had tried ChatGPT first — most people do. It was fast, broad, great for quick lookups and short tasks. It felt like a very capable assistant who could do almost anything adequately. Then Sam made Jordan open Claude for a complex strategy problem. The shift was immediate. Claude felt slower to respond but more careful — like it was actually thinking rather than completing. It pushed back on one of Jordan's assumptions. It asked a clarifying question. It gave a longer, more structured answer with real trade-offs instead of the polished-but-shallow bullet list Jordan was used to. The research backs this up: ChatGPT is the jack-of-all-trades — image generation, voice, browser search, broad reach. Claude is the depth specialist — nuanced writing, long-document analysis, complex reasoning, and a willingness to disagree that most AI tools sand off. Professionals who use both route tasks differently: quick lookups and image generation go to ChatGPT. Deep analysis, long-form writing, strategic thinking, and anything where you need to actually trust the reasoning — Claude.",
      learnHighlight: "ChatGPT is broad. Claude is deep. The best professionals use both — and know which task to route where.",
      xpAward: 25,
    },

    // ── Scene 1 ── Meet Jordan ────────────────────────────────────────────────
    {
      id: "w5-s1",
      type: "scenario",
      character: "Jordan, Freelance Consultant, 28",
      location: "COFFEE SHOP · MONDAY · 9:47 AM",
      dialogue: [
        {
          speaker: "Sam",
          avatar: "npc",
          npcKey: "tyler",
          text: "How's the freelance life treating you?",
        },
        {
          speaker: "Jordan",
          avatar: "jake",
          text:
            "I'm doing the jobs of five people. Proposals, client work, social media, research, admin… I'm always behind.",
        },
        {
          speaker: "Sam",
          avatar: "npc",
          npcKey: "tyler",
          text: "Have you actually used Claude? Like, properly?",
        },
        {
          speaker: "Jordan",
          avatar: "jake",
          text: "I tried it once. Asked it to write a paragraph. Felt like cheating.",
        },
        {
          speaker: "Sam",
          avatar: "npc",
          npcKey: "tyler",
          text: "You're using a race car to drive to the mailbox.",
        },
      ],
      concept: {
        title: "The Iceberg Problem",
        body: "Most people use Claude for one thing: drafting text. That's the visible 10%. Below the surface: strategy, code, research, analysis, planning, brainstorming, debugging, summarization — a full team's worth of capabilities in one conversation window.",
      },
      question: "What's the most common reason people underuse Claude Chat?",
      choices: [
        {
          label: "A",
          text: "The free plan isn't powerful enough for real work",
          correct: false,
          feedback:
            "Plan tier affects features like longer context or file uploads — not Claude's fundamental reasoning ability. The free tier is genuinely powerful.",
        },
        {
          label: "B",
          text: "They discover one thing it does and never go deeper",
          correct: true,
          feedback:
            "Exactly. Most people find one use case — usually writing — and stop there. The real leverage comes from applying it across every part of your workflow.",
        },
        {
          label: "C",
          text: "It's too technical for people without an AI background",
          correct: false,
          feedback:
            "Claude is designed to be conversational. You don't need any technical background — you just need to know how to ask clearly.",
        },
        {
          label: "D",
          text: "You need to be a programmer to use it effectively",
          correct: false,
          feedback:
            "One of Claude's biggest strengths is helping non-programmers do things that used to require a developer. No coding knowledge required.",
        },
      ],
      xpAward: 100,
    },

    // ── LEARN 2: Projects and Custom Instructions ─────────────────────────────
    {
      id: "w5-learn-2",
      type: "learn",
      location: "COFFEE SHOP · MONDAY · 10:15 AM",
      concept: {
        title: "PROJECTS — STOP STARTING OVER EVERY SESSION",
        body: "Every standard Claude conversation starts completely blank. No memory of what you told it last week. No knowledge of your company, your clients, your voice, or your preferences. Claude Projects fix this by giving you a persistent workspace where your context never disappears.",
      },
      scenarioText: "Jordan was doing something Sam immediately spotted as a massive time sink: every single morning, Jordan would open a new Claude conversation and type a block of context — 'I'm a freelance brand strategist, my clients are mid-size B2B companies, I write in a direct but warm tone, I never use corporate buzzwords, I always end with one clear call to action.' Every morning. Same block. Copy-paste from a notes file. It was taking four minutes each session, sometimes more. Sam showed Jordan Claude Projects. You create a named Project, write your custom instructions once — who you are, how you write, what you never say, what your clients care about — and that context persists forever inside every conversation in that Project. Jordan set one up in ten minutes. Six months of repeated context, gone. The blank-slate problem, solved. Custom instructions are how professionals make Claude feel less like a generic AI and more like a collaborator who actually knows their world.",
      learnHighlight: "Stop re-explaining yourself every session. Custom instructions in a Project make Claude remember who you are from conversation one.",
      xpAward: 25,
    },

    // ── Scene 2 ── What IS Claude Chat? ───────────────────────────────────────
    {
      id: "w5-s2",
      type: "quiz",
      scenarioText:
        "Three people describe Claude Chat differently. The marketing manager calls it 'a better Google.' The developer calls it 'a coding assistant.' The writer calls it 'fancy autocomplete.' They're all partially right — and all missing the bigger picture.",
      question: "Which description most accurately captures what Claude Chat actually is?",
      choices: [
        {
          label: "A",
          text: "A search engine that summarizes web results in real time",
          correct: false,
          feedback:
            "Claude doesn't browse the internet by default — it generates responses from training data. It creates, it doesn't retrieve. That's a fundamental difference.",
        },
        {
          label: "B",
          text: "A large language model that reasons, writes, codes, and analyzes within a multi-turn conversation",
          correct: true,
          feedback:
            "This captures it. The key words: 'reasons' (not just responds), 'multi-turn' (it holds context across a conversation). It's a reasoning engine wrapped in a chat interface.",
        },
        {
          label: "C",
          text: "A pre-programmed FAQ bot with a large database of fixed answers",
          correct: false,
          feedback:
            "The opposite. Claude generates novel responses every time — it doesn't retrieve from a fixed list. Each answer is constructed from patterns learned during training.",
        },
        {
          label: "D",
          text: "A tool primarily designed for content writers and copywriters",
          correct: false,
          feedback:
            "Writing is one use case out of dozens. Claude is used by engineers, analysts, researchers, lawyers, educators, founders, and students — across almost every professional domain.",
        },
      ],
      xpAward: 100,
    },

    // ── LEARN 3: How to Get Claude to Actually Push Back ─────────────────────
    {
      id: "w5-learn-3",
      type: "learn",
      location: "HOME OFFICE · TUESDAY · 1:45 PM",
      concept: {
        title: "HOW TO GET CLAUDE TO DISAGREE WITH YOU",
        body: "Most people treat AI like a yes-machine — and Claude obliges. But one of Claude's most valuable capabilities, used by almost no one, is getting it to genuinely disagree with you, pressure-test your assumptions, and tell you what you're missing. You have to ask for it explicitly.",
      },
      scenarioText: "Jordan had been using Claude as a glorified drafting assistant for two weeks when Sam asked a question that reframed everything: 'Have you ever asked Claude to disagree with you?' Jordan had not. The idea hadn't occurred. Sam showed a conversation where they'd written: 'Here is my plan for raising my rates. Please argue against it as hard as you can. Find every weak assumption, every risk I'm underestimating, every objection a client would have. Don't soften it.' The response was genuinely uncomfortable to read. It found three assumptions Jordan would never have questioned. It named the exact objection two clients had already made. It reframed the whole strategy in a way that actually made the plan stronger. This is the aha moment almost every power user describes: the shift from using Claude as a yes-machine to using it as a thinking partner that will actually push back. But you have to give it explicit permission — 'disagree with me,' 'argue against this,' 'play devil's advocate,' 'tell me what I'm missing.' Without that instruction, Claude defaults to being helpful and agreeable. With it, Claude becomes the most useful colleague you have.",
      learnHighlight: "Claude defaults to agreeable. Tell it explicitly to push back — 'argue against this,' 'what am I missing' — and it becomes a completely different tool.",
      xpAward: 25,
    },

    // ── Scene 3 ── The Writing Power ──────────────────────────────────────────
    {
      id: "w5-s3",
      type: "scenario",
      character: "Jordan",
      location: "COFFEE SHOP → LAPTOP SCREEN · MONDAY · 10:23 AM",
      dialogue: [
        {
          speaker: "Jordan",
          avatar: "jake",
          text:
            "I've been staring at this cold email for 40 minutes. I know exactly what I want to say. I just can't say it.",
        },
        {
          speaker: "Sam",
          avatar: "npc",
          npcKey: "tyler",
          text: "Tell Claude: who this is for, what you need them to do, and why they should care.",
        },
        {
          speaker: "Jordan",
          avatar: "jake",
          text: "[types a context-rich prompt] [polished email appears in 4 seconds]",
        },
        {
          speaker: "Jordan",
          avatar: "jake",
          text: "…Okay. That's not cheating. That's just being efficient.",
        },
      ],
      concept: {
        title: "From Blank Page to Done",
        body: "Claude writes cold emails, proposals, reports, LinkedIn posts, cover letters, job descriptions, client updates, scripts, social captions, meeting agendas — anything that starts with a blank page.\n\nReal examples players have shipped:\n• \"Cold email to a dream client\" → sent, got a reply\n• \"LinkedIn post about a project win\" → 3x normal engagement\n• \"Job description for a freelance designer\" → 40 applications in a week\n• \"Client proposal for a $15k project\" → won the contract\n\nThe secret: give Claude context. Who is the reader? What action do you need? What tone fits? The more you share, the better it writes.",
      },
      question: "What makes the difference between a mediocre Claude-written email and a great one?",
      choices: [
        {
          label: "A",
          text: "Using longer, more formal language in your prompt",
          correct: false,
          feedback:
            "Formality doesn't help. Clarity and context do. A casual but specific prompt beats a formal but vague one every time.",
        },
        {
          label: "B",
          text: "Telling Claude who the reader is, what you need them to do, and the right tone",
          correct: true,
          feedback:
            "This is the formula. Reader identity + desired action + tone = Claude has everything it needs to write something that actually works.",
        },
        {
          label: "C",
          text: "Always writing a first draft yourself before asking Claude to improve it",
          correct: false,
          feedback:
            "Sometimes useful, but not required. Claude can start from zero when you give it context. Don't make extra work for yourself.",
        },
        {
          label: "D",
          text: "Asking Claude to 'make it really professional'",
          correct: false,
          feedback:
            "Vague instruction, vague output. 'Professional' means different things in different industries and contexts. Describe the reader and goal instead.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 4 ── The Thinking Partner ───────────────────────────────────────
    {
      id: "w5-s4",
      type: "scenario",
      character: "Jordan",
      location: "HOME OFFICE · TUESDAY · 2:15 PM",
      dialogue: [
        {
          speaker: "Jordan",
          avatar: "jake",
          text:
            "I need to decide: charge per project or go retainer-based. I've been going back and forth for three weeks.",
        },
        {
          speaker: "Jordan",
          avatar: "jake",
          text:
            "[prompt]: I'm a freelance brand strategist. Some clients need 5–10h of ongoing work per month. Others need one 30-hour project. Help me think through retainer vs. project pricing for my situation — pros, cons, and what questions I should be asking myself.",
        },
        {
          speaker: "AI",
          avatar: "npc",
          npcKey: "ai",
          text:
            "Let me reason through both sides… [two paragraphs of structured trade-off analysis follow, ending with three clarifying questions]",
        },
        {
          speaker: "Jordan",
          avatar: "jake",
          text:
            "It's like talking to a consultant who's never in a hurry and never charges by the hour.",
        },
      ],
      concept: {
        title: "The Thinking Partner",
        body: "Claude doesn't just answer questions — it reasons through problems with you. Most powerful uses:\n\n• Argue both sides of a decision before you commit\n• Pressure-test your plan against obvious objections\n• Identify blind spots in your strategy\n• Generate 10 options you haven't thought of\n• Play devil's advocate on your assumptions\n• Ask the clarifying questions you forgot to ask yourself\n\nTreat Claude like a smart colleague who has infinite patience and zero ego. It's most powerful when you think out loud with it, not just ask it for answers.",
      },
      question: "Which prompt gets the BEST strategic thinking from Claude?",
      choices: [
        {
          label: "A",
          text: "\"What's the best pricing strategy?\"",
          correct: false,
          feedback:
            "No context = no useful answer. 'Best' depends on your industry, client type, revenue goals, and risk tolerance. Claude needs the situation to reason about it.",
        },
        {
          label: "B",
          text: "\"I'm a freelance brand strategist. Some clients need 8h/month ongoing, others 30h projects. I want to scale to $15k/month. Help me think through retainer vs. project pricing trade-offs.\"",
          correct: true,
          feedback:
            "This works because it gives Claude your context, your goal, and invites reasoning — not just an answer. Claude can now think with you, not just at you.",
        },
        {
          label: "C",
          text: "\"Which pricing model do most consultants use?\"",
          correct: false,
          feedback:
            "That's a search question — what the average consultant does. What you actually need is strategic reasoning about YOUR situation. Ask for thinking, not statistics.",
        },
        {
          label: "D",
          text: "\"Tell me what to do about pricing.\"",
          correct: false,
          feedback:
            "Claude can make a decision, but it'll be low-quality without context. You'd end up with generic advice. The goal is to think alongside Claude, not outsource the thinking entirely.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 5 ── Code, Data, Documents ──────────────────────────────────────
    {
      id: "w5-s5",
      type: "quiz",
      scenarioText:
        "Priya runs a solo e-commerce store. She has 200 product descriptions that are too short and missing SEO keywords. She's never written a line of code. She described her problem to Claude, asked it to write a Python script, then asked Claude to explain each line so she could run it safely. By the end of the afternoon, every product description was updated. She wrote zero code.",
      question: "Beyond writing, which set of tasks can Claude genuinely help a non-technical person accomplish?",
      choices: [
        {
          label: "A",
          text: "Only writing tasks — real technical work still requires a developer",
          correct: false,
          feedback:
            "Code generation is one of Claude's strongest capabilities. It can write, explain, debug, and translate code — making technical tasks accessible to non-programmers.",
        },
        {
          label: "B",
          text: "Write and explain code, analyze spreadsheet data, summarize long documents, debug technical problems, and extract structured data from messy text",
          correct: true,
          feedback:
            "This is the non-obvious power set. Each of these used to require a specialist. Claude makes them accessible to anyone willing to describe the problem clearly.",
        },
        {
          label: "C",
          text: "Design logos, edit photos, and create video content",
          correct: false,
          feedback:
            "Claude Chat works with text and code — not image generation or video editing. Other tools handle visual creation. Claude's strength is language and reasoning.",
        },
        {
          label: "D",
          text: "Only simple, low-stakes tasks — anything complex still needs an expert",
          correct: false,
          feedback:
            "Claude handles genuinely complex work: multi-step data analysis, debugging production bugs, summarizing 100-page documents, drafting legal templates. Complexity isn't the barrier — clarity is.",
        },
      ],
      xpAward: 150,
    },

    // ── Scene 5b ── LIVE AI Moment ────────────────────────────────────────────
    {
      id: "w5-s5b",
      type: "prompt",
      character: "Jordan",
      location: "HOME OFFICE · WEDNESDAY · 4:48 PM",
      promptChallenge: {
        context:
          "Jordan just received a tense email from a client. The client says the brand direction feels 'off' and they're 'reconsidering the engagement.' Jordan has done excellent work — the real issue is a misalignment in expectations that started in the kickoff call, which was the client's fault, not Jordan's. Jordan needs to respond: acknowledge the client's concerns, professionally defend the creative direction, and keep the relationship intact without being defensive or losing ground.",
        goal:
          "Write a prompt that gets Claude to draft a response email that's empathetic, firm, and saves the client relationship — without Jordan caving or sounding defensive.",
        placeholder:
          "Tell Claude about Jordan's situation and what the email needs to accomplish...",
      },
      xpAward: 150,
    },

    // ── Scene 6 ── Boss: Conductor Test ───────────────────────────────────────
    {
      id: "w5-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — You've seen Claude Chat in action across writing, strategy, code, and live prompting. One question stands between you and the revelation.",
      question:
        "A colleague says: 'I tried Claude. It just gives generic answers. It's not that useful.' What's the most likely explanation?",
      choices: [
        {
          label: "A",
          text: "Claude is designed for advanced users and requires technical expertise",
          correct: false,
          feedback:
            "Claude is built to be conversational. No technical skill required. The interface is a chat window — anyone can use it.",
        },
        {
          label: "B",
          text: "Their prompts don't include enough context, specificity, or goal for Claude to reason well",
          correct: true,
          feedback:
            "This is almost always the answer. Generic input → generic output. Claude matches the quality of what you give it. A vague question gets a vague answer. A rich, context-loaded prompt gets a thoughtful, specific response.",
        },
        {
          label: "C",
          text: "They're on an outdated version of Claude with less capability",
          correct: false,
          feedback:
            "Version differences exist but don't explain generic responses. The dominant driver of output quality is always input quality — not which model version you're on.",
        },
        {
          label: "D",
          text: "Claude simply isn't capable of high-quality outputs in professional contexts",
          correct: false,
          feedback:
            "Professional contexts are where Claude performs best. Complex, nuanced, high-stakes work benefits most from Claude's reasoning ability. Shallow use gets shallow results.",
        },
      ],
      xpAward: 250,
    },

    // ── Scene 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w5-s7",
      type: "revelation",
      revealText:
        "You used to hand someone a to-do list and wait.\n\nNow you hand an AI a problem and think alongside it.\n\nJordan shipped a proposal, fixed a pricing strategy, handled a difficult client, and learned a new skill — all in one week. Not because Jordan got smarter.\n\nBecause Jordan stopped treating the most powerful thinking tool of this generation like a fancy spell-checker.\n\nYou now know what Claude Chat actually is.\n\nUse it like you mean it.",
      xpAward: 200,
    },
  ],
}
