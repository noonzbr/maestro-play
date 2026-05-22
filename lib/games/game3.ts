import { Game } from "./types"

export const game3: Game = {
  slug: "ai-for-professionals",
  week: 3,
  free: true,
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
      scenarioText: "Carlos has 47 unread emails and 3 hours before a board presentation. His instinct is to start drafting responses. But here's what his AI-fluent colleague does instead: she pastes all 47 subject lines into Claude with one prompt — 'I have a board presentation in 3 hours. Which 5 of these need my personal attention before then?' Claude returns a ranked shortlist in 8 seconds. She acts on the shortlist. Carlos is still reading email number 12.",
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
      scenarioText: "The Maestro Method has four parts, and every great prompt uses all of them. WHAT: the exact deliverable (apology email, not just 'email'). WHAT NOT: explicit constraints ('no legal admissions', 'don't mention the outage duration'). HOW: format, tone, length, audience ('under 200 words, accountable tone, enterprise client'). WHY: context and stakes ('we have a 3-year relationship worth $200k ARR — this response matters'). The more of these you give, the closer the first draft is to ready-to-send.",
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
      scenarioText: "Think about your week. How many hours go into: drafting similar emails with slight variations, summarizing meeting notes into action items, formatting reports that always follow the same template, researching background context before a meeting, writing first drafts of proposals you'll edit anyway? These are your AI workflows waiting to happen. The trap most people fall into is trying to automate strategic decisions first — 'should we enter this market?' — when AI is actually better at the execution layer: 'draft the market analysis memo I can then judge.'",
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
      scenarioText: "Here's an example of a full Maestro Method prompt in the wild: 'You are an HR analytics expert. Analyze these engagement survey results [data]. Identify the top 3 actionable themes. Do NOT recommend generic fixes like more 1:1s — I need specific, data-backed actions. Format as an executive brief: headline, finding, recommendation, owner. This goes to our leadership team next week.' That prompt has all four pillars: WHAT (top 3 actionable themes), WHAT NOT (no generic fixes), HOW (executive brief format), WHY (leadership team, next week). The output is presentable without major editing.",
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

  ],
}
