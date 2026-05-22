import { Game } from "./types"

export const game4: Game = {
  slug: "the-conductor-test",
  week: 4,
  free: true,
  title: "The Conductor Test",
  emoji: "🏆",
  icon: "musicNotes" as const,
  duration: "10 min",
  description: "The final test. Diagnose broken AI interactions, build perfect prompts, earn your Conductor status.",
  tagline: "This is where everything comes together.",
  characterName:  "Aria",
  characterRole:  "26-year-old violinist",
  characterBlurb: "A classically trained musician who masters the art of AI prompts — and earns her conductor title",
  characterImage: "/images/aria.png",
  maestroImage:   "/images/maestro-aria.png",
  maestroLine:    "The last time she was just a violinist...",
  maestroSubline: "Aria leads the section. The stage is yours.",
  audioTrack:     "/audio/aria-midnight-brass-run.mp3",
  intro: {
    sceneImage: "/images/scene-aria.png",
    sceneColor: "#06080a",
    noteOrigin: { bottom: "42%", left: "48%" },
    beats: [
      { type: "location",  text: "CONCERT HALL · SUNDAY · 10:31 PM" },
      { type: "narration", text: "She had played that concerto a hundred times, and each time she believed — truly believed — it was unrepeatable." },
      { type: "dialogue",  speaker: "Lena", text: "A conservatory in Vienna just premiered a symphony composed entirely by AI. Critics didn't notice until the programme notes. Aria, the bar just moved." },
      { type: "final",     text: "Mastery is not the destination. It is the only map that matters." },
    ],
  },
  scenes: [
    {
      id: "w4-s1",
      type: "scenario",
      character: "Aria, Violinist, 26",
      location: "CONCERT HALL · ONE HOUR TO CURTAIN",
      scenarioText:
        "A marketing manager asked AI: 'Write something about our product launch.' The output was two paragraphs of generic tech-company language about 'innovative solutions' and 'industry-leading performance.' She was frustrated and gave up on AI entirely. Let's diagnose what went wrong.",
      question: "Which Maestro pillars were missing from her prompt?",
      choices: [
        {
          label: "A",
          text: "All four — What, What Not, How, and Why were absent",
          correct: true,
          feedback:
            "Precisely. What: 'something' — no defined output type (email? social post? press release?). What Not: no constraints on tone, jargon, or generic phrases. How: no format, length, or audience specified. Why: no context on the product, launch date, or stakes. The AI had nothing to work with except the word 'product launch.'",
        },
        {
          label: "B",
          text: "Only the How — she just needed to specify format",
          correct: false,
          feedback:
            "Format alone wouldn't fix this. Without knowing WHAT type of content, WHO it's for, WHAT to avoid, and WHY it matters, even a beautifully formatted output would still be generic and useless.",
        },
        {
          label: "C",
          text: "Nothing was missing — AI just isn't good at marketing",
          correct: false,
          feedback:
            "AI is exceptional at marketing — some of the most compelling copy being written today is AI-assisted. The issue was always the prompt, not the model. With a structured Maestro prompt, that same AI would produce something publishable.",
        },
        {
          label: "D",
          text: "Only the What — she needed to specify what to write",
          correct: false,
          feedback:
            "Specifying the output type (email vs. post vs. press release) would help, but that's one pillar of four. Without constraints, format specs, and purpose, the output would still be generic.",
        },
      ],
      xpAward: 200,
    },
    {
      id: "w4-s2",
      type: "scenario",
      scenarioText:
        "Build a complete Maestro prompt from scratch. Scenario: You're a Head of People at a 200-person tech startup. You need to communicate a return-to-office policy (3 days/week, effective in 6 weeks) to the entire company. This is sensitive — remote workers are anxious, and Glassdoor reviews will follow.",
      question: "Which prompt will produce a communication-ready, policy-appropriate email?",
      choices: [
        {
          label: "A",
          text: "'Write an email about our return to office policy.'",
          correct: false,
          feedback:
            "This is Game 1 territory. No audience, no stakes, no constraints, no format. You'll get a template you'll spend an hour editing into something usable.",
        },
        {
          label: "B",
          text: "'Write a company-wide email announcing a 3-days-per-week RTO policy effective [date] at a 200-person tech startup. Audience: full company including anxious remote workers. Tone: empathetic, transparent, firm but human. Do NOT use corporate jargon or phrases like 'exciting opportunity' or 'we hear you.' Include: rationale, exact policy terms, FAQ link placeholder, and a personal note from leadership. Under 350 words. This will shape our Glassdoor narrative for the next quarter.'",
          correct: true,
          feedback:
            "Maestro Method complete. What: company-wide RTO announcement email. What Not: no corporate jargon, no hollow phrases. How: empathetic tone, specific components, under 350 words. Why: Glassdoor narrative, anxious remote workers. This prompt produces something you can present to your CEO tomorrow.",
        },
        {
          label: "C",
          text: "'Help me communicate a difficult policy change to employees in a sensitive way.'",
          correct: false,
          feedback:
            "Better than Option A, but still missing the key specifics. No policy details, no tone constraints, no format, no stakes. AI needs the actual context to do real work for you.",
        },
        {
          label: "D",
          text: "'What are best practices for return to office communications from HR experts?'",
          correct: false,
          feedback:
            "Again a search query, not a Maestro prompt. You'd get a generic article about RTO best practices, not a draft email. Know when you want research vs. when you want execution.",
        },
      ],
      xpAward: 200,
    },
    {
      id: "w4-s3",
      type: "boss",
      scenarioText:
        "CONDUCTOR CERTIFICATION EXAM — 5 questions spanning all 4 weeks. Pass to earn your Conductor status and certificate.",
      question:
        "A colleague says: 'I tried AI for a week and it wasn't helpful. The outputs were always generic.' What is the most likely root cause?",
      choices: [
        {
          label: "A",
          text: "They were using a low-quality AI model",
          correct: false,
          feedback:
            "Model quality is rarely the issue at this point. Frontier models (Claude, GPT-4o, Gemini 1.5) are all extremely capable. The bottleneck is almost always input quality.",
        },
        {
          label: "B",
          text: "Their inputs lacked structure, context, and constraints",
          correct: true,
          feedback:
            "Every time. Generic outputs are a symptom of generic inputs. Structured, contextual, constrained prompts — the Maestro Method — produce specific, useful, often remarkable outputs.",
        },
        {
          label: "C",
          text: "AI isn't ready for professional use yet",
          correct: false,
          feedback:
            "AI is being used in law firms, hospitals, investment banks, and Fortune 500 companies right now. The question isn't whether AI is ready — it's whether the user has learned the method.",
        },
        {
          label: "D",
          text: "They should have paid for a pro subscription",
          correct: false,
          feedback:
            "We've been over this. Subscription tier is noise. Prompt quality is signal.",
        },
      ],
      xpAward: 300,
    },
    {
      id: "w4-s4",
      type: "revelation",
      revealText:
        "You are now a Maestro Conductor. You understand how AI works, why inputs determine outputs, and how to direct AI with the precision of a conductor leading an orchestra. The What, the What Not, the How, the Why. This is your baton. The orchestra is ready. Go conduct something magnificent.",
      xpAward: 500,
    },
  ],
}
