import { Game } from "./types"

export const game7: Game = {
  slug: "claude-for-work",
  week: 7,
  free: false,
  price: 4.99,
  title: "Claude for Work — AI That Knows Your Business",
  emoji: "🏢",
  accentColor: "#818cf8",
  duration: "8 min",
  description:
    "Discover Claude Projects, custom instructions, and team workflows that make Claude feel less like a chatbot and more like a colleague who actually knows your company.",
  tagline: "The difference between a generic AI and your AI.",
  characterName:  "Priya",
  characterRole:  "33-year-old operations manager",
  characterBlurb: "A business ops pro who makes Claude feel less like a chatbot and more like a colleague",
  characterImage: "/images/priya.png",
  maestroImage:   "/images/maestro-priya.png",
  maestroLine:    "The last time she was just managing the chaos...",
  maestroSubline: "Priya runs the show. Now the AI runs with her.",
  audioTrack:     "/audio/priya-desk-light-drift.mp3",
  intro: {
    sceneImage: "/images/scene-priya.png",
    sceneColor: "#080608",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "GLASS CONFERENCE ROOM · THURSDAY · 6:55 PM" },
      { type: "narration", text: "Every system she had built held the company together — and only she knew exactly how fragile the whole thing was." },
      { type: "dialogue",  speaker: "CEO", text: "I watched our competitor's ops team demo their AI workflow today. Six people doing what we have sixteen doing. Priya, I need to understand why we're not there." },
      { type: "final",     text: "Efficiency is not the enemy of craft. It is the space craft needs to grow." },
    ],
  },
  aiModel:  "claude" as const,
  felipeOutroVideo:   "/videos/felipe-game7.mp4",
  nextGame: {
    slug:         "chatgpt-mastery",
    character:    "Alex",
    teaserLine:   "Priya built the system. Now Alex is going to show you a completely different AI ecosystem — ChatGPT. Custom GPTs, Canvas, Code Interpreter. Most people only ever see the tip of this iceberg.",
    previewImage: "/images/alex.png",
  },
  scenes: [

    // ── LEARN 1: Claude Projects — Persistent Context for Teams ──────────────
    {
      id: "w7-learn-1",
      type: "learn",
      location: "GLASS CONFERENCE ROOM · THURSDAY · 6:45 PM",
      concept: {
        title: "CLAUDE PROJECTS — PERSISTENT CONTEXT FOR TEAMS",
        body: "Standard Claude conversations have no memory. Every session starts blank. For individuals, this is manageable. For teams, it means every person gets different outputs based on what they remembered to paste in that day. Claude Projects solve this by creating a shared workspace where context — your tone, your constraints, your company knowledge — persists automatically for everyone.",
      },
      scenarioText: "Priya pulled up Dev's client brief and Tom's side by side — same tool, same task, completely different quality. The gap wasn't skill; Dev had a system and Tom didn't. Claude Projects are the system.",
      learnHighlight: "Claude Projects make institutional knowledge automatic. Set the context once. Every conversation, every teammate, every week benefits from it.",
      xpAward: 25,
    },

    // ── Scene 1 ── The Consistency Problem ───────────────────────────────────
    {
      id: "w7-s1",
      type: "scenario",
      character: "Priya, Head of Operations, 33",
      location: "OPEN OFFICE · THURSDAY · 10:12 AM",
      dialogue: [
        {
          speaker: "Dev",
          avatar: "npc",
          npcKey: "tyler",
          text: "Here's the client brief I wrote using Claude. Took me about ten minutes.",
        },
        {
          speaker: "Priya",
          avatar: "jake",
          text: "Wait — Tom also used Claude for the Harlow brief this morning. Let me pull both up.",
        },
        {
          speaker: "Priya",
          avatar: "jake",
          text: "Dev, yours sounds like us. Tom's reads like a generic template from 2019. Same tool, same task, completely different output.",
        },
        {
          speaker: "Dev",
          avatar: "npc",
          npcKey: "tyler",
          text: "I gave Claude our brand guide, three past briefs, and explained who Harlow's audience is. Tom probably just typed 'write a client brief.'",
        },
        {
          speaker: "Priya",
          avatar: "jake",
          text: "So our output quality depends entirely on who remembered to add context that day.",
        },
        {
          speaker: "Dev",
          avatar: "npc",
          npcKey: "tyler",
          text: "Every single session. Claude starts fresh every time. It has no memory of what we told it last week.",
        },
      ],
      concept: {
        title: "The Consistency Problem",
        body: "Without shared context, every Claude session starts from zero. One teammate pastes in the brand guide. Another forgets. One explains the audience. Another doesn't. The result: wildly inconsistent output quality — not because Claude is unreliable, but because the context it receives is.\n\nClaude Projects solve this. A Project is a persistent workspace where you can:\n• Write custom instructions Claude follows in every conversation\n• Upload documents (brand guides, product specs, past work) Claude can always reference\n• Share the project with your whole team so everyone works from the same foundation\n\nEvery conversation inside a Project carries that shared context automatically — so your team stops getting different-quality outputs based on who remembered to paste what.",
      },
      question:
        "Why do two teammates get wildly different Claude outputs for the same task?",
      choices: [
        {
          label: "A",
          text: "One has a paid Claude plan and the other uses the free tier",
          correct: false,
          feedback:
            "Plan tier affects context length and feature access — not whether Claude writes on-brand or off-brand. The quality gap here comes from context, not subscription level.",
        },
        {
          label: "B",
          text: "Claude randomly varies its quality to prevent over-reliance",
          correct: false,
          feedback:
            "Claude doesn't introduce deliberate variance. It generates the best response it can based on what it receives. Inconsistent input is the only reason for inconsistent output.",
        },
        {
          label: "C",
          text: "One teammate provided context about the company, audience, and past work — the other didn't",
          correct: true,
          feedback:
            "Exactly. Claude is as good as the context it receives. One teammate gave Claude what it needed to reason well; the other let it guess. Same tool, completely different setup.",
        },
        {
          label: "D",
          text: "Claude performs better for experienced users because it learns their style over time",
          correct: false,
          feedback:
            "Standard Claude Chat has no memory between sessions — it doesn't learn individual users' styles. Every new chat starts blank. Claude Projects are specifically designed to fix this.",
        },
      ],
      xpAward: 100,
    },

    // ── LEARN 2: Custom Instructions That Make Claude Sound Like Your Company ──
    {
      id: "w7-learn-2",
      type: "learn",
      location: "PRIYA'S DESK · THURSDAY · 1:55 PM",
      concept: {
        title: "CUSTOM INSTRUCTIONS THAT SOUND LIKE YOUR COMPANY",
        body: "Custom instructions are the most underused feature in Claude for teams. They're a persistent prompt that runs before every conversation — telling Claude who you are, how you write, what you never say, and who your audience is. Done right, they're the difference between AI that sounds generic and AI that sounds like a 10-year team member.",
      },
      scenarioText: "Priya read Claude's first test email twice — it sounded so on-brand she had to confirm she hadn't written it herself. She'd spent forty-five minutes writing custom instructions like an onboarding doc, and that's exactly what they were.",
      learnHighlight: "Custom instructions are an onboarding document for Claude. Write them like you're briefing a brilliant new hire who knows nothing about your company yet.",
      xpAward: 25,
    },

    // ── Scene 2 ── What Claude Projects Actually Do ───────────────────────────
    {
      id: "w7-s2",
      type: "quiz",
      scenarioText:
        "Priya reads about Claude Projects. A Project is a named workspace — separate from regular chats — where you can write custom instructions that persist across every conversation, upload documents Claude can reference at any time, and invite teammates so everyone shares the same context. When anyone on the team opens a conversation inside the Project, Claude already knows your company, tone, policies, and any files you've uploaded. The blank-slate problem disappears.",
      question:
        "What does adding a document to a Claude Project actually do?",
      choices: [
        {
          label: "A",
          text: "It trains Claude on your data permanently, improving its answers for everyone globally",
          correct: false,
          feedback:
            "Uploading to a Project does not retrain Claude's underlying model. It makes the document available as context within that Project's conversations — scoped to your team, not the whole world.",
        },
        {
          label: "B",
          text: "It makes the document's content available as context in every conversation inside that Project, so Claude can reference it without being re-pasted each time",
          correct: true,
          feedback:
            "That's it exactly. The document becomes persistent context. Anyone on your team who opens a conversation in that Project automatically has Claude working with that document — no copy-pasting needed.",
        },
        {
          label: "C",
          text: "It converts the document into a summary Claude memorizes and discards the original",
          correct: false,
          feedback:
            "Claude retains access to the actual document content, not just a summary. It can reference specific sections, quote passages, and reason over the details you uploaded.",
        },
        {
          label: "D",
          text: "It lets Claude edit and update the document automatically as the project evolves",
          correct: false,
          feedback:
            "Uploaded documents are read-only reference material for Claude — it can't modify them. The value is in giving Claude accurate, current information to reason from.",
        },
      ],
      xpAward: 100,
    },

    // ── LEARN 3: Privacy and Work AI ─────────────────────────────────────────
    {
      id: "w7-learn-3",
      type: "learn",
      location: "GLASS CONFERENCE ROOM · THURSDAY · 4:30 PM",
      concept: {
        title: "PRIVACY AND WORK AI — WHAT ACTUALLY GOES TO ANTHROPIC",
        body: "The question every team asks before adopting AI: 'Is our data safe?' It's the right question. And the answer for Claude for Work is different from the consumer app. Understanding the boundary between what's private and what's not is essential before any sensitive business information goes into any AI tool.",
      },
      scenarioText: "The CEO stopped Priya mid-presentation: 'If someone pastes a client contract into Claude, does Anthropic train on it?' She had the answer ready. Claude for Work is a contractual commitment — business conversations do not train the model; the free tier plays by different rules.",
      learnHighlight: "Know your plan's privacy terms before you paste anything sensitive. Claude for Work has contractual data protections. The free tier has different rules.",
      xpAward: 25,
    },

    // ── Scene 3 ── Building the Project ──────────────────────────────────────
    {
      id: "w7-s3",
      type: "scenario",
      character: "Priya",
      location: "PRIYA'S DESK · THURSDAY · 2:30 PM",
      dialogue: [
        {
          speaker: "Priya",
          avatar: "jake",
          text: "I've created a Project called 'Client Comms.' Now I need to write the custom instructions.",
        },
        {
          speaker: "Dev",
          avatar: "npc",
          npcKey: "tyler",
          text: "Think of it as writing an onboarding doc for a new colleague who's very smart but knows nothing about us yet.",
        },
        {
          speaker: "Priya",
          avatar: "jake",
          text: "Okay. 'Write in a professional but warm tone. Never make pricing commitments or promises about timelines. Always recommend checking with the sales team before confirming any deliverable scope.'",
        },
        {
          speaker: "Priya",
          avatar: "jake",
          text: "I'm also uploading the brand voice guide — 22 pages of tone, vocabulary, and what we never say to clients.",
        },
        {
          speaker: "Dev",
          avatar: "npc",
          npcKey: "tyler",
          text: "Now every conversation in this project starts with Claude already knowing all of that. Nobody has to remember to paste it.",
        },
        {
          speaker: "Priya",
          avatar: "jake",
          text: "We've been carrying that 22-page document in our heads. Now Claude carries it for us.",
        },
      ],
      concept: {
        title: "Custom Instructions Are Institutional Memory",
        body: "Every company has knowledge that lives in people's heads: the tone that sounds like us, the commitments we never make, the phrases we avoid, the audience we always write for. When someone leaves, that knowledge walks out the door.\n\nCustom instructions in a Claude Project make institutional knowledge explicit and permanent. Claude follows them in every conversation — so a new hire using the Client Comms project writes like a seasoned team member from day one.\n\nWhat to include in custom instructions:\n• Tone and voice rules (professional but warm, never corporate-speak)\n• What Claude should never do (no pricing promises, no passive voice)\n• Audience context (who reads this, what they care about)\n• Output format defaults (always end with action items, keep to one page)\n• Company-specific terminology and brand language",
      },
      question:
        "What should you include in a Claude Project's custom instructions?",
      choices: [
        {
          label: "A",
          text: "A detailed history of the company so Claude understands the full backstory",
          correct: false,
          feedback:
            "Company history is rarely useful in custom instructions. Focus on what shapes Claude's output: tone, constraints, audience, format, and what to avoid. History can go in an uploaded document if it's genuinely relevant.",
        },
        {
          label: "B",
          text: "Tone rules, output constraints, audience context, and things Claude should never do or say",
          correct: true,
          feedback:
            "Exactly. These four categories directly shape every output: how it sounds, what it can't promise, who it's written for, and what it should avoid. That's the institutional knowledge that makes Claude useful at the team level.",
        },
        {
          label: "C",
          text: "Your personal preferences so Claude writes the way you individually like",
          correct: false,
          feedback:
            "Personal preferences belong in individual conversations, not Project instructions. Project instructions should reflect team-wide standards — so every teammate gets the same on-brand output, not just you.",
        },
        {
          label: "D",
          text: "Technical specifications about how Claude's AI model was trained",
          correct: false,
          feedback:
            "Claude already knows how it works. Custom instructions are for teaching Claude about your company, not about itself. Write instructions about your team's needs, not about AI architecture.",
        },
      ],
      xpAward: 100,
    },

    // ── Scene 4 ── Real Workflow: Onboarding ──────────────────────────────────
    {
      id: "w7-s4",
      type: "quiz",
      scenarioText:
        "Priya's company is growing fast — they hired four people in one month. The people ops lead spends two hours per new hire answering the same 30 questions: vacation policy, expense process, how to book a conference room, where to find templates. She uploads the employee handbook, the FAQ doc, and the culture guide to a Claude Project called 'New Hire Support.' Now new hires ask their questions there — and get accurate, specific answers grounded in actual company policy — at any hour, without waiting for a reply.",
      question:
        "Which situation benefits MOST from a Claude Project vs. a regular chat?",
      choices: [
        {
          label: "A",
          text: "Writing a one-time creative piece where you want Claude to be freely imaginative",
          correct: false,
          feedback:
            "One-off creative tasks don't need persistent context or team sharing — a regular chat works fine. Projects shine when the same context needs to be applied consistently across many conversations or team members.",
        },
        {
          label: "B",
          text: "A task your whole team does repeatedly that always requires the same company-specific context, policies, or tone",
          correct: true,
          feedback:
            "This is exactly where Projects create leverage. The shared context is set once, uploaded once — and every conversation, every teammate, every week benefits from it automatically. The ROI compounds with every use.",
        },
        {
          label: "C",
          text: "A personal brainstorming session where you're exploring ideas with no defined outcome",
          correct: false,
          feedback:
            "Open-ended personal brainstorming doesn't need persistent instructions or shared access. A regular conversation is more flexible for exploration. Projects are for recurring, structured work.",
        },
        {
          label: "D",
          text: "Asking Claude a single factual question you won't need to revisit",
          correct: false,
          feedback:
            "A one-question lookup doesn't need a Project — that's what regular chat is for. Projects are worth setting up when the same context needs to power dozens or hundreds of future conversations.",
        },
      ],
      xpAward: 150,
    },

    // ── Scene 5b ── LIVE AI Moment ────────────────────────────────────────────
    {
      id: "w7-s5b",
      type: "prompt",
      character: "Priya",
      location: "CONFERENCE ROOM · FRIDAY · 9:00 AM",
      promptChallenge: {
        context:
          "Priya is creating a Claude Project for the company's weekly board report. The report goes to the board of directors — it must be data-focused, written in present tense, never use passive voice, stay under two pages, and always end with exactly three specific action items. Currently, four different team members take turns writing it each week, and it takes each person about three hours. Every version sounds different and the board has complained about inconsistency.",
        goal:
          "Write the custom instructions Priya should put in the Claude Project so any team member can generate a consistent, board-ready report — without needing to remember any of the formatting rules themselves.",
        placeholder:
          "Write the custom instructions for Priya's Claude Project...",
      },
      xpAward: 150,
    },

    // ── Scene 6 ── Boss: Conductor Test ──────────────────────────────────────
    {
      id: "w7-s6",
      type: "boss",
      scenarioText:
        "CONDUCTOR TEST — You've seen how Claude Projects solve the consistency problem, what custom instructions can hold, and how teams use Projects for everything from client comms to new hire onboarding. One question stands between you and the revelation.",
      question:
        "Priya uploads a 40-page company handbook to a Claude Project. What can team members now do that they couldn't before?",
      choices: [
        {
          label: "A",
          text: "Ask any question about company policy and get answers grounded in the actual handbook content — without reading it themselves",
          correct: true,
          feedback:
            "This is the real unlock. The handbook's value was always locked behind the effort of reading it. Now any team member can get specific, accurate answers in seconds — and Claude cites the content it's drawing from. The knowledge becomes instantly accessible to everyone.",
        },
        {
          label: "B",
          text: "Have Claude automatically update the handbook whenever company policies change",
          correct: false,
          feedback:
            "Uploaded documents are read-only reference material — Claude can't edit them. If the handbook changes, you'd upload the updated version. The value is in making existing content searchable and conversational, not in auto-editing.",
        },
        {
          label: "C",
          text: "Prevent Claude from discussing any topic not covered in the handbook",
          correct: false,
          feedback:
            "Uploading a document doesn't restrict Claude to only discussing that document. Claude can still answer other questions. The handbook adds grounded context — it doesn't build a wall around Claude's capabilities.",
        },
        {
          label: "D",
          text: "Get answers faster than before, since Claude no longer has to think",
          correct: false,
          feedback:
            "Response speed comes from infrastructure, not uploaded documents. Claude still reasons over the handbook content — the upload doesn't skip its thinking. The benefit is accuracy and accessibility, not raw speed.",
        },
      ],
      xpAward: 250,
    },

    // ── Scene 7 ── Revelation ─────────────────────────────────────────────────
    {
      id: "w7-s7",
      type: "revelation",
      revealText:
        "Priya's team stopped getting generic AI output the week she set up the project.\n\nNot because Claude got smarter.\n\nBecause the team finally gave Claude what it needed to stop guessing.\n\nThe custom instructions hold the institutional memory. The uploaded documents hold the company knowledge. The Project holds it all together — so every teammate, every week, works from the same foundation.\n\nThe most powerful thing you can give an AI isn't a better question.\n\nIt's the context that makes every question better.",
      xpAward: 200,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w7-compare",
      type: "ai-compare",
      character: "Priya",
      location: "OFFICE · TEAM MEETING ROOM",
      xpAward: 75,
      aiCompare: {
        models: ["claude", "chatgpt", "copilot"],
        headline: "Claude Projects vs ChatGPT Teams vs Copilot — Team AI Showdown",
        context: "Priya evaluated all three team AI tools before choosing Claude Projects. Here's the honest comparison she presented to her leadership team.",
        rows: [
          {
            dimension: "Shared Context Across Team",
            winner: "Claude",
            claude:  "Claude Projects: shared custom instructions + knowledge base per project",
            chatgpt: "ChatGPT Teams: team workspace but per-user context",
            copilot: "Microsoft Graph: shared org context via M365 data",
            note: "Claude Projects lets every team member start from identical institutional context — the biggest consistency win.",
          },
          {
            dimension: "Document Upload & Analysis",
            winner: "Claude",
            claude:  "Upload PDFs, docs, data — project-level persistent access",
            chatgpt: "File upload per conversation; not persistent across team sessions",
            copilot: "SharePoint/OneDrive integration — deep M365 document access",
            note: "Priya's team uploads SOPs, client briefs, and policy docs once. Claude accesses them every time.",
          },
          {
            dimension: "Microsoft 365 Native Integration",
            winner: "Copilot",
            claude:  "No native M365 integration",
            chatgpt: "Limited M365 integration",
            copilot: "Native in Word, Excel, Teams, Outlook — zero friction for M365 shops",
            note: "If your org is 100% Microsoft, Copilot already knows your calendar, emails, and files.",
          },
          {
            dimension: "Custom AI Personas for Teams",
            winner: "ChatGPT",
            claude:  "Custom instructions per Project",
            chatgpt: "Custom GPTs: fully branded AI personas shareable across team",
            copilot: "Copilot Studio: build custom agents (separate product)",
            note: "ChatGPT lets Priya build 'CompanyName Ops Assistant' as a Custom GPT the whole team uses.",
          },
          {
            dimension: "Privacy & Data Security",
            winner: "Claude",
            claude:  "Team tier: data not used for training by default",
            chatgpt: "Teams tier: data not used for training",
            copilot: "Enterprise: Microsoft compliance and data sovereignty",
            note: "All three have enterprise privacy tiers. Copilot has the deepest enterprise compliance stack.",
          },
        ],
        verdict: "Claude Projects wins on consistent context and document analysis. Copilot wins for pure M365-native teams. ChatGPT wins for custom AI persona flexibility. Best teams often use two.",
        question: "Priya's team needs every AI interaction to start from the same foundation of company SOPs and client context — without anyone re-explaining it each session. Which tool solves this best?",
        choices: [
          {
            label: "A",
            text: "Claude Projects — shared custom instructions and persistent document access at the project level",
            correct: true,
            feedback: "Exactly. Claude Projects was built for this exact use case — one set of custom instructions, one shared knowledge base, every team member starts from the same foundation. No re-explaining. No context drift. Consistent output every session.",
          },
          {
            label: "B",
            text: "Microsoft Copilot — it already knows the company's files through Microsoft Graph",
            correct: false,
            feedback: "Copilot's Microsoft Graph access is powerful — but it's reactive (it knows what's in M365) rather than proactive (it doesn't automatically apply specific company SOPs as instructions). Claude Projects lets Priya define exactly what the AI must always know and always follow.",
            wrongFeedback: "Copilot's Microsoft Graph access is powerful — but it's reactive (it knows what's in M365) rather than proactive (it doesn't automatically apply specific company SOPs as instructions). Claude Projects lets Priya define exactly what the AI must always know and always follow.",
          },
          {
            label: "C",
            text: "ChatGPT Teams — widest adoption and best ecosystem",
            correct: false,
            feedback: "ChatGPT Teams is excellent, and Custom GPTs solve some of this. But at the project context level — where every session starts from shared documents and instructions without manual setup — Claude Projects has a more direct solution for Priya's exact problem.",
            wrongFeedback: "ChatGPT Teams is excellent, and Custom GPTs solve some of this. But at the project context level — where every session starts from shared documents and instructions without manual setup — Claude Projects has a more direct solution for Priya's exact problem.",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w7-handoff",
      type: "handoff",
      character: "Priya",
      location: "OFFICE · END OF DAY",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Priya",
          avatar: "protagonist" as const,
          text: "You've seen what happens when you build a brain for your team. That's Claude's world — deep context, professional consistency, team workflows.",
        },
        {
          speaker: "Priya",
          avatar: "protagonist" as const,
          text: "But I want you to see something completely different now. There's a whole ecosystem on the other side of the fence. ChatGPT isn't just a chat window — it's a platform.",
        },
        {
          speaker: "Priya",
          avatar: "protagonist" as const,
          text: "Alex is a content creator who went deep into it. Custom GPTs, Canvas editor, Code Interpreter, vision — the features most people scroll past because they look complicated.",
        },
        {
          speaker: "Priya",
          avatar: "protagonist" as const,
          text: "She mapped out exactly what each feature does and when to use it. Honest review — strengths AND where it falls short. The kind of thing nobody writes on the internet because everyone's either a fanboy or a hater.",
        },
        {
          speaker: "Priya",
          avatar: "protagonist" as const,
          text: "Ready to see the other side of the AI world?",
        },
      ],
    },

  ],
}
