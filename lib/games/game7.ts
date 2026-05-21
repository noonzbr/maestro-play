import { Game } from "./types"

export const game7: Game = {
  slug: "claude-for-work",
  week: 7,
  free: true,
  title: "Claude for Work — AI That Knows Your Business",
  emoji: "🏢",
  accentColor: "#818cf8",
  duration: "8 min",
  description:
    "Discover Claude Projects, custom instructions, and team workflows that make Claude feel less like a chatbot and more like a colleague who actually knows your company.",
  tagline: "The difference between a generic AI and your AI.",
  scenes: [
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
  ],
}
