import { Game } from "./types"

export const game3: Game = {
  slug: "ai-for-professionals",
  week: 3,
  free: false,
  price: 4.99,
  title: "AI for Professionals",
  emoji: "⚡",
  icon: "baton" as const,
  duration: "8 min",
  description: "Apply AI to your actual work. Master prioritization, email, and the Maestro Method prompt framework.",
  tagline: "Your inbox. Your meetings. Your backlog. Conducted.",
  scenes: [
    {
      id: "w3-s1",
      type: "scenario",
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
    {
      id: "w3-s2",
      type: "scenario",
      scenarioText:
        "You need to email a major client after a service outage. You have two prompt options. Which produces a better result?",
      question:
        "Prompt A: 'Write an apology email to a client.' — Prompt B: 'Write a professional apology email to DataSync Corp (enterprise SaaS client, 3-year relationship, $200k ARR). Our platform was down for 4 hours yesterday. Tone: accountable, calm, forward-focused. Include: what happened, what we fixed, what prevents recurrence. No legal admissions. Under 200 words.' Which prompt gets you closer to ready-to-send?",
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
    {
      id: "w3-s3",
      type: "scenario",
      scenarioText:
        "You're building your first AI-assisted workflow. You need to find 3 opportunities in your own role where structured AI prompts could save 2+ hours per week.",
      question: "Which of these is the best category of tasks to automate with AI first?",
      choices: [
        {
          label: "A",
          text: "High-stakes decisions that define your strategy",
          correct: false,
          feedback:
            "AI informs decisions — it doesn't make them. Start with execution tasks, not strategic judgment calls. Use the hours AI saves you to think more deeply about the decisions.",
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
          text: "Tasks that require sensitive employee or personal data",
          correct: false,
          feedback:
            "Start with low-risk, high-volume tasks. Sensitive data tasks require governance, legal review, and privacy architecture before AI touches them. Don't start there.",
        },
        {
          label: "D",
          text: "Tasks that only take 5 minutes anyway",
          correct: false,
          feedback:
            "5-minute tasks that happen 20 times a day are worth automating. But start with the highest-time-cost items — the weekly report that takes 3 hours, not the quick Slack reply.",
        },
      ],
      xpAward: 150,
    },
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
          text: "'You are an HR analytics expert. Analyze these engagement survey results [data]. Identify the top 3 actionable themes. Do NOT recommend generic fixes like more 1:1s — I need specific, data-backed actions. Format as an executive brief: headline, finding, recommendation, owner. This goes to our leadership team next week.'",
          correct: true,
          feedback:
            "All four pillars present. What: top 3 actionable themes. What Not: no generic fixes. How: executive brief format with specific structure. Why: leadership team, next week. This prompt produces something you can present with minimal editing.",
        },
        {
          label: "C",
          text: "'Please help me with my employee survey results if you have time.'",
          correct: false,
          feedback:
            "Politeness is fine but 'if you have time' adds nothing. And the ask is completely undefined — AI doesn't know if you want analysis, a summary, a presentation, or talking points. Be direct and specific.",
        },
        {
          label: "D",
          text: "'What are best practices for employee engagement according to recent research?'",
          correct: false,
          feedback:
            "This is a search query, not a Maestro prompt. You asked for generic research, not analysis of your specific data. You won't even mention your actual survey results.",
        },
      ],
      xpAward: 200,
    },
  ],
}
