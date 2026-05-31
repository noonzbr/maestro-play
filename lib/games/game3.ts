import { Game } from "./types"

export const game3: Game = {
  slug: "ai-for-professionals",
  week: 3,
  free: false,
  price: 4.99,
  title: "AI for Professionals",
  emoji: "⚡",
  icon: "baton" as const,
  duration: "12 min",
  description: "Apply AI to your actual work. Master prioritization, email, and the Maestro Method prompt framework.",
  tagline: "Your inbox. Your meetings. Your backlog. Conducted.",
  characterName:  "Carlos",
  characterRole:  "38-year-old jazz saxophonist",
  characterBlurb: "A seasoned pro who applies AI to real professional work — from emails to strategy",
  characterImage: "/images/carlos.png",
  maestroImage:   "/images/maestro-carlos.png",
  maestroLine:    "The last time he was just a saxophonist...",
  maestroSubline: "Carlos plays every note with intention. Now you will too.",
  audioTrack:     "/audio/carlos-bar-one-spark.mp3",
  intro: {
    sceneImage: "/images/scene-carlos.png",
    sceneColor: "#080a06",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "BACKSTAGE · SATURDAY · 7:48 PM" },
      { type: "narration", text: "Thirty-eight years of muscle memory, and still the horn felt like a conversation he was only half-finished having." },
      { type: "dialogue",  speaker: "Diego", text: "I'm booking my next run using AI-generated jazz sessions. Same vibe, zero overhead. Honestly, Carlos — the clubs aren't asking who played the notes anymore." },
      { type: "final",     text: "The music never dies. But the musicians who don't adapt might." },
    ],
  },
  aiModel:  "claude" as const,
  felipeOutroVideo:   "/videos/felipe-game3.mp4",
  nextGame: {
    slug:         "the-conductor-test",
    character:    "Aria",
    teaserLine:   "The Maestro Method is your foundation. But knowing the method and MASTERING it are different things. Aria is a violinist who's about to put everything to the test — and it's not pretty at first.",
    previewImage: "/images/aria.png",
  },
  scenes: [

    // ── LEARN 1: The Triage Principle ─────────────────────────────────────────
    {
      id: "w3-learn-1",
      type: "learn",
      character: "Carlos, Jazz Saxophonist, 38",
      location: "MONDAY MORNING · 8:47 AM",
      concept: {
        title: "THE TRIAGE PRINCIPLE",
        body: "Most people open AI and ask it to DO things immediately. The professionals who get real value do something different first — they ask AI to help them SEE clearly. Before execution comes prioritization.",
      },
      scenarioText: "Carlos started at email number one, reading each one; his colleague pasted all 47 subject lines into Claude and had a ranked shortlist in eight seconds. AI's first job isn't to do the work — it's to show you which work actually matters.",
      learnHighlight: "AI's first job isn't to do the work. It's to help you see which work actually matters.",
      xpAward: 25,
    },

    // ── SCENE 1: Triage quiz ──────────────────────────────────────────────────
    {
      id: "w3-s1",
      type: "scenario",
      character: "Carlos, Jazz Saxophonist, 38",
      location: "BACKSTAGE · BEFORE THE GIG",
      scenarioText:
        "It's Monday morning. Your inbox has 47 unread emails. You have 3 hours before a board presentation. You have access to Claude. The emails include: a crisis from a key client, 12 meeting requests, status updates from 5 teams, a vendor contract for review, and a VP asking for a summary of last quarter.",
      question: "What do you tackle first with AI?",
      choices: [
        {
          label: "A",
          text: "Ask Claude to draft replies to all 47 emails automatically",
          correct: false,
          feedback:
            "Quantity over quality is a trap. Auto-drafting 47 emails without context would produce generic, possibly damaging responses — especially on a client crisis. AI amplifies your judgment; it doesn't replace it.",
        },
        {
          label: "B",
          text: "Use Claude to triage — identify the 3 items that need your human attention now",
          correct: true,
          feedback:
            "Exactly. Triage first, then execute. Paste the subject lines and senders into Claude with context: 'I have a board presentation in 3 hours. Which of these need my personal attention before then?' Then act on the shortlist.",
        },
        {
          label: "C",
          text: "Delete all the meeting requests since meetings waste time",
          correct: false,
          feedback:
            "Not an AI problem — a prioritization problem. And some of those meeting requests may be from the board. Claude can help you decide which to accept, decline, or delegate.",
        },
        {
          label: "D",
          text: "Ask Claude to write your board presentation from scratch first",
          correct: false,
          feedback:
            "The presentation matters, but the client crisis may need a response before you start. Triage reveals the sequence. Sequence determines outcomes.",
        },
      ],
      xpAward: 150,
    },

    // ── LEARN 2: The Maestro Method ───────────────────────────────────────────
    {
      id: "w3-learn-2",
      type: "learn",
      location: "GREEN ROOM · 9:15 AM",
      concept: {
        title: "THE MAESTRO METHOD",
        body: "The single biggest reason people get mediocre AI output is vague prompts. 'Help me write an email' gives you a template. 'Write a professional apology to our 3-year enterprise client — accountable, under 200 words, no legal admissions' gives you something ready to send.",
      },
      scenarioText: "Carlos's colleague handed him a prompt so specific it read like a legal brief — and Claude's reply was ready to send in two minutes. The Maestro Method is four pillars: WHAT you need, WHAT NOT to include, HOW to say it, and WHY it matters.",
      learnHighlight: "A prompt is a blueprint. Vague blueprints build vague buildings.",
      xpAward: 25,
    },

    // ── SCENE 2: Prompt comparison ────────────────────────────────────────────
    {
      id: "w3-s2",
      type: "scenario",
      scenarioText:
        "You need to email a major client after a service outage. Two prompt options are in front of you. Prompt A: 'Write an apology email to a client.' Prompt B: 'Write a professional apology email to DataSync Corp (enterprise SaaS client, 3-year relationship, $200k ARR). Our platform was down for 4 hours yesterday. Tone: accountable, calm, forward-focused. Include: what happened, what we fixed, what prevents recurrence. No legal admissions. Under 200 words.'",
      question: "Which prompt gets you closer to ready-to-send?",
      choices: [
        {
          label: "A",
          text: "Prompt A — shorter prompts produce cleaner outputs",
          correct: false,
          feedback:
            "Prompt A will produce a generic, forgettable apology that could be from any company to any client. You'll spend 20 minutes editing it into shape. Brevity in prompting is a false economy.",
        },
        {
          label: "B",
          text: "Prompt B — structured context produces specific, actionable output",
          correct: true,
          feedback:
            "Prompt B is the Maestro Method in action: WHAT (professional apology), WHO (DataSync, enterprise, 3-year), WHAT NOT (no legal admissions), HOW (accountable, calm, under 200 words), WHY (client relationship preservation). The output will be 80% ready to send.",
        },
        {
          label: "C",
          text: "Neither — you should always write client emails yourself",
          correct: false,
          feedback:
            "AI doesn't replace your voice — it amplifies it. With Prompt B, Claude drafts in your direction. You review, adjust tone, and sign. Professionals who write everything from scratch are leaving 3 hours on the table every day.",
        },
        {
          label: "D",
          text: "Prompt A is better for a first draft since Prompt B constrains creativity",
          correct: false,
          feedback:
            "Constraints are the point. You don't want a creative apology email. You want an accurate, professional, relationship-preserving one. Constraints focus AI on the result you actually need.",
        },
      ],
      xpAward: 150,
    },

    // ── LEARN 3: Which tasks to automate ─────────────────────────────────────
    {
      id: "w3-learn-3",
      type: "learn",
      location: "BACKSTAGE · 10:30 AM",
      concept: {
        title: "WHAT AI DOES BEST",
        body: "Not every task is AI-ready. The ones that are share three traits: they're high-volume (you do them frequently), structured (they follow a consistent pattern), and currently all-human (they don't require real-time external data or physical action).",
      },
      scenarioText: "Carlos counted the hours he'd spent this week writing first drafts of things he'd immediately edit — and stopped at four. Those repetitive, structured tasks are your AI workflows waiting to happen; the strategic decisions still need you.",
      learnHighlight: "Start with the tasks that eat your hours, not the ones that define your judgment.",
      xpAward: 25,
    },

    // ── SCENE 3: Task automation ──────────────────────────────────────────────
    {
      id: "w3-s3",
      type: "scenario",
      scenarioText:
        "You're building your first AI-assisted workflow. You need to find 3 opportunities in your own role where structured AI prompts could save 2+ hours per week.",
      question: "Which category of tasks should you automate with AI first?",
      choices: [
        {
          label: "A",
          text: "High-stakes strategic decisions that define your company direction",
          correct: false,
          feedback:
            "AI informs decisions — it doesn't make them. Start with execution tasks, not strategic judgment calls. Use the hours AI saves you to think more deeply about the decisions that matter.",
        },
        {
          label: "B",
          text: "Repetitive writing, summarizing, and formatting tasks",
          correct: true,
          feedback:
            "Perfect entry point. Weekly reports. Meeting summaries. Email drafts. Status updates. Proposal templates. These tasks are high-volume, structured, and currently all-human. AI handles them in minutes with the right prompt.",
        },
        {
          label: "C",
          text: "Tasks involving sensitive employee or personal data",
          correct: false,
          feedback:
            "Start with low-risk, high-volume tasks. Sensitive data tasks require governance, legal review, and privacy architecture before AI touches them. Don't start there.",
        },
        {
          label: "D",
          text: "Tasks that only take 5 minutes anyway",
          correct: false,
          feedback:
            "5-minute tasks that happen 20 times a day are worth automating — but start with the highest-time-cost items first. The weekly report that takes 3 hours beats the quick Slack reply.",
        },
      ],
      xpAward: 150,
    },

    // ── LEARN 4: Full prompt anatomy ──────────────────────────────────────────
    {
      id: "w3-learn-4",
      type: "learn",
      location: "STAGE · SOUND CHECK",
      concept: {
        title: "THE FULL PROMPT",
        body: "Great prompts aren't long — they're complete. The difference between a prompt that generates work you edit for 30 minutes and one that generates work you send in 5 minutes is whether you gave AI everything it needed to match your context.",
      },
      scenarioText: "Carlos read the example prompt out loud backstage and realized it was basically a legal contract with an AI. That's the point: when all four pillars are present, the first draft is presentable without major editing.",
      learnHighlight: "Four pillars. Every prompt. No exceptions.",
      xpAward: 25,
    },

    // ── SCENE 4: Full prompt quiz ─────────────────────────────────────────────
    {
      id: "w3-s4",
      type: "scenario",
      scenarioText:
        "Build a complete Maestro Method prompt. You need to ask AI to analyze employee engagement survey results and recommend 3 actions for your leadership team.",
      question: "Which prompt structure uses all four Maestro pillars (What, What Not, How, Why)?",
      choices: [
        {
          label: "A",
          text: "'Analyze this survey and give me recommendations.'",
          correct: false,
          feedback:
            "Missing: What Not (avoid generic best practices), How (format, audience level), Why (purpose and stakes). This prompt will produce a textbook answer that doesn't reflect your company, team, or situation.",
        },
        {
          label: "B",
          text: "'You are an HR analytics expert. Analyze these engagement survey results [data]. Identify the top 3 actionable themes. Do NOT recommend generic fixes like more 1:1s. Format as an executive brief: headline, finding, recommendation, owner. This goes to our leadership team next week.'",
          correct: true,
          feedback:
            "All four pillars present. What: top 3 actionable themes. What Not: no generic fixes. How: executive brief format with specific structure. Why: leadership team, next week. This prompt produces something you can present with minimal editing.",
        },
        {
          label: "C",
          text: "'Please help me with my employee survey results if you have time.'",
          correct: false,
          feedback:
            "Politeness is fine, but the ask is completely undefined. AI doesn't know if you want analysis, a summary, a presentation, or talking points. Be direct and specific.",
        },
        {
          label: "D",
          text: "'What are best practices for employee engagement according to recent research?'",
          correct: false,
          feedback:
            "This is a search query, not a Maestro prompt. You asked for generic research, not analysis of your specific data. Your actual survey results don't even appear in this prompt.",
        },
      ],
      xpAward: 200,
    },

    // ── SCENE 5: Vague feedback trap ──────────────────────────────────────────
    {
      id: "w3-s5",
      type: "scenario",
      location: "BOARDROOM · 2:15 PM",
      scenarioText:
        "Carlos pastes a 12-page strategic document into Claude and types: 'Review this document.' Claude returns three paragraphs of generic praise with a few minor suggestions. Carlos spent 45 minutes writing the document and needed real critique. The AI gave him encouragement.",
      question: "What should Carlos have specified to get genuinely useful feedback?",
      choices: [
        {
          label: "A",
          text: "He should use a different AI — Claude isn't good at document review",
          correct: false,
          feedback:
            "Claude is excellent at document review. The problem is the prompt. 'Review this' gives AI no direction. It defaults to being helpful-but-vague because it doesn't know your standards or what you actually need.",
        },
        {
          label: "B",
          text: "Specify audience, type of feedback, and what he's NOT looking for",
          correct: true,
          feedback:
            "Exactly. 'Review this document for a board of 6 non-technical executives. I need critique on: logical flow, missing evidence, and unsupported claims. Do NOT comment on grammar or formatting — only substance. Be direct. If something is weak, say so clearly.' That prompt gets you actionable critique, not polite summaries.",
        },
        {
          label: "C",
          text: "Ask Claude to 'be more critical this time'",
          correct: false,
          feedback:
            "Telling Claude to 'be more critical' without specifying what you need critique on still produces vague output — just with a more assertive tone. Define the specific dimension you want challenged.",
        },
        {
          label: "D",
          text: "Break the document into smaller pieces and review one section at a time",
          correct: false,
          feedback:
            "Chunking can help with very long documents, but it doesn't solve the core problem: 'Review this section' is as vague as 'Review this document.' The issue is the absence of criteria, not document length.",
        },
      ],
      xpAward: 175,
    },

    // ── SCENE 6: AI verification ──────────────────────────────────────────────
    {
      id: "w3-s6",
      type: "scenario",
      location: "BEFORE THE PRESENTATION",
      scenarioText:
        "Carlos's board presentation includes an AI-generated competitive analysis. One slide states: 'Competitor revenue grew 34% YoY in 2024, reaching $2.3B.' The AI generated this confidently. Carlos presents it to the board. Two days later, the actual figure — which was publicly available — was 11%, reaching $890M. The board is not impressed.",
      question: "What should Carlos have done differently?",
      choices: [
        {
          label: "A",
          text: "Never use AI for research — it always makes up facts",
          correct: false,
          feedback:
            "AI is genuinely useful for structuring research, generating hypotheses, and synthesizing information you provide. The problem isn't AI research generally — it's using AI-generated statistics without verification. Numbers, dates, names, and revenue figures always need a primary source.",
        },
        {
          label: "B",
          text: "Verify all specific facts, statistics, and numbers against primary sources before presenting",
          correct: true,
          feedback:
            "This is the golden rule of AI-assisted research. AI can draft the framework, suggest what to look for, and synthesize your verified findings. But any specific figure in a high-stakes document needs a primary source. A simple rule: if it has a number, find where that number actually came from.",
        },
        {
          label: "C",
          text: "Ask Claude to 'double-check' its own facts before presenting",
          correct: false,
          feedback:
            "AI cannot verify its own outputs against real-world data at the time of generation. Asking it to 'double-check' doesn't trigger a database lookup — it just re-generates text that may confirm the original error. Verification is always a human step.",
        },
        {
          label: "D",
          text: "Add a disclaimer slide saying all data is AI-generated",
          correct: false,
          feedback:
            "A disclaimer doesn't fix wrong data — it just preemptively apologizes for it. The board still made decisions based on false information. The only real solution is verification before presentation.",
        },
      ],
      xpAward: 175,
    },

    // ── REVELATION ───────────────────────────────────────────────────────────
    {
      id: "w3-revelation",
      type: "revelation",
      revealText: "The musician who learns to conduct commands the whole orchestra. Carlos didn't just learn to use AI — he learned to direct it with the same precision he brings to every note.",
      xpAward: 100,
    },

    // ═══ AI COMPARE ══════════════════════════════════════════════════════════
    {
      id: "w3-compare",
      type: "ai-compare",
      character: "Carlos",
      location: "HOME OFFICE · EVENING",
      xpAward: 75,
      aiCompare: {
        models: ["claude", "chatgpt"],
        headline: "Claude vs ChatGPT — Which AI Actually Works for Professional Output?",
        context: "Carlos ran the Maestro Method through both tools. Same prompt structure. Different results. Here's what he found after six months of professional use.",
        rows: [
          {
            dimension: "Following Complex Instructions",
            winner: "Claude",
            claude:  "Holds 6–8 simultaneous constraints without dropping any",
            chatgpt: "Strong at 3–4 constraints; may simplify under complexity",
            note: "The Maestro Method often has multiple rules at once. Claude rarely drops one.",
          },
          {
            dimension: "Professional Tone Calibration",
            winner: "Claude",
            claude:  "Adapts register precisely — executive brief vs. team memo vs. client email",
            chatgpt: "Good calibration; occasionally over-formal or over-casual",
            note: "Carlos writes for C-suite clients. Tone errors cost credibility.",
          },
          {
            dimension: "Fact-Checking & Source Reliability",
            winner: "ChatGPT",
            claude:  "Acknowledges uncertainty; recommends verification",
            chatgpt: "Can browse live sources; cites more frequently",
            note: "Neither AI is a primary source. But ChatGPT's browse makes verification faster.",
          },
          {
            dimension: "Speed for High-Volume Tasks",
            winner: "ChatGPT",
            claude:  "Slightly slower on complex multi-step requests",
            chatgpt: "Faster responses; better for rapid-fire drafting sessions",
            note: "When Carlos needs 15 email variants in 10 minutes — speed matters.",
          },
          {
            dimension: "Refusing to Hallucinate Statistics",
            winner: "Claude",
            claude:  "More likely to say 'I don't have reliable data on this'",
            chatgpt: "Occasionally confident with unverifiable numbers",
            note: "Fake statistics in a client brief end careers. Honesty about uncertainty is a feature.",
          },
        ],
        verdict: "For professional documents that carry your name — Claude's precision and honesty about limitations make it the safer default. Use ChatGPT when speed and live research matter more.",
        question: "Carlos is writing a 2-page strategy memo for a CEO. It needs executive tone, 4 specific constraints, and ZERO made-up statistics. Which tool should he reach for?",
        choices: [
          {
            label: "A",
            text: "Claude — better at holding complex constraints and acknowledging what it doesn't know",
            correct: true,
            feedback: "Exactly. An exec memo with your name on it needs two things Claude does particularly well: holding all constraints simultaneously and refusing to confidently hallucinate data. This is exactly the professional use case Claude was built for.",
          },
          {
            label: "B",
            text: "ChatGPT — faster and can browse for current data",
            correct: false,
            feedback: "Speed helps in drafting sprints, not in precision documents. And browsing only matters if you need live data — a strategy memo usually draws on what you already know. The bottleneck here is precision and reliability, not speed.",
            wrongFeedback: "Speed helps in drafting sprints, not in precision documents. And browsing only matters if you need live data — a strategy memo usually draws on what you already know. The bottleneck here is precision and reliability, not speed.",
          },
          {
            label: "C",
            text: "Either — they're equivalent for business writing",
            correct: false,
            feedback: "Run the same 6-constraint professional prompt through both. Claude typically holds more rules simultaneously and is more likely to say 'I'm not certain about this statistic.' For a document that represents you professionally, those differences matter.",
            wrongFeedback: "Run the same 6-constraint professional prompt through both. Claude typically holds more rules simultaneously and is more likely to say 'I'm not certain about this statistic.' For a document that represents you professionally, those differences matter.",
          },
        ],
      },
    },

    // ═══ HANDOFF ═════════════════════════════════════════════════════════════
    {
      id: "w3-handoff",
      type: "handoff",
      character: "Carlos",
      location: "HOME OFFICE · WRAPPING UP",
      xpAward: 0,
      dialogue: [
        {
          speaker: "Carlos",
          avatar: "protagonist" as const,
          text: "You've got the method now. What, What Not, How, Why. That's your baton. Every time you pick up an AI tool, you conduct with those four pillars.",
        },
        {
          speaker: "Carlos",
          avatar: "protagonist" as const,
          text: "But I want to be honest with you — knowing the method and being good at it are very different things. It took me three months before my prompts stopped feeling awkward.",
        },
        {
          speaker: "Carlos",
          avatar: "protagonist" as const,
          text: "There's a young violinist — Aria. She learned this same method and then did something smart: she tested it until it broke. And when it broke, she rebuilt it stronger.",
        },
        {
          speaker: "Carlos",
          avatar: "protagonist" as const,
          text: "She calls it the Conductor Test. A full exam on every pillar. I'm told it's... humbling. Even for people who think they've got it figured out.",
        },
        {
          speaker: "Carlos",
          avatar: "protagonist" as const,
          text: "Ready to find out if you're actually a conductor — or just someone who read the manual?",
        },
      ],
    },

  ],
}
