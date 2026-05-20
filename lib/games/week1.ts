import { Game } from "./types"

export const week1: Game = {
  slug: "welcome-to-ai",
  week: 1,
  free: true,
  title: "Welcome to the Exciting World of AI",
  emoji: "🎵",
  duration: "6 min",
  description: "Discover why most people get poor results from AI — and what the 10x users do differently.",
  tagline: "The era of AI is here. Which seat are you in?",
  scenes: [
    {
      id: "w1-s1",
      type: "scenario",
      scenarioText:
        "It's 2026. Your colleague automated her weekly report in 4 minutes. You spent 3 hours. Same company. Same data. Same AI tool. She's been promoted twice this year. You're still copying and pasting.",
      question: "What is the biggest reason most people get poor results from AI?",
      choices: [
        {
          label: "A",
          text: "AI isn't smart enough yet for real professional work",
          correct: false,
          feedback:
            "Not quite. AI models like Claude and GPT-4 are extraordinarily capable. The bottleneck is almost never the model — it's the instructions it receives.",
        },
        {
          label: "B",
          text: "They don't pay for the Pro subscription",
          correct: false,
          feedback:
            "Tempting, but wrong. Free tiers are powerful. Paid subscriptions give you more capacity — but the same bad inputs produce the same bad outputs at any price.",
        },
        {
          label: "C",
          text: "They describe what they want without structure or context",
          correct: true,
          feedback:
            "Exactly. AI is a prediction engine — it generates the most likely response to your input. Vague input → generic output. Structured, contextual input → precise, useful output. This is the entire game.",
        },
        {
          label: "D",
          text: "AI only works well for developers and technical people",
          correct: false,
          feedback:
            "The opposite is true. The best AI users are often writers, marketers, HR professionals, and executives — people who know how to communicate clearly and direct a process.",
        },
      ],
      xpAward: 100,
    },
    {
      id: "w1-s2",
      type: "quiz",
      scenarioText:
        "AI is reshaping professional landscapes faster than any technology since the internet. But most people interact with it like a fancier Google search.",
      question: "Which of these AI capabilities is already real and widely available in 2026?",
      choices: [
        {
          label: "A",
          text: "Writing, editing, and summarizing entire documents in seconds",
          correct: true,
          feedback:
            "Real, available today, and used by millions. Claude, ChatGPT, and Gemini can process thousands of words and produce professional-quality output in under 10 seconds.",
        },
        {
          label: "B",
          text: "Fully autonomous AI that runs a company without human oversight",
          correct: false,
          feedback:
            "Not yet — and likely not for a while. AI is a powerful collaborator, not a replacement. The Maestro model: humans conduct, AI plays the instruments.",
        },
        {
          label: "C",
          text: "AI that reads your mind and knows what you want without any input",
          correct: false,
          feedback:
            "No such thing. AI responds to what you give it. More signal in = better signal out. This is why learning to communicate with AI is the skill of the decade.",
        },
        {
          label: "D",
          text: "AI that replaces all creative work completely",
          correct: false,
          feedback:
            "AI augments creativity — it doesn't replace human judgment, taste, or vision. The professionals thriving now use AI as an instrument, not a substitute.",
        },
      ],
      xpAward: 150,
    },
    {
      id: "w1-s3",
      type: "scenario",
      scenarioText:
        "Maria is an HR Manager at a 500-person company. Zero coding experience. She used to spend 4 hours every Monday building analytics reports. Now she does it in 11 minutes — and the reports are better. Her VP asked her to train the entire team.",
      question: "What most likely changed for Maria?",
      choices: [
        {
          label: "A",
          text: "She hired a data analyst to help her",
          correct: false,
          feedback:
            "No extra headcount needed. The transformation was personal — she learned to direct AI with precision, not rely on someone else to do it.",
        },
        {
          label: "B",
          text: "She learned to give AI structured, context-rich instructions",
          correct: true,
          feedback:
            "Yes. Maria didn't learn to code. She learned to communicate. She tells AI the WHAT (objective), WHAT NOT (constraints), HOW (format and tone), and WHY (purpose). That's the Maestro Method.",
        },
        {
          label: "C",
          text: "She switched to a more expensive AI tool",
          correct: false,
          feedback:
            "Tool choice is a minor variable. Instruction quality is the major variable. Maria would get similar results with any frontier AI model using the same method.",
        },
        {
          label: "D",
          text: "Her company bought an enterprise AI platform",
          correct: false,
          feedback:
            "Enterprise tools help at scale, but the skill comes first. Maria's breakthrough happened with a standard Claude subscription and a new mental model.",
        },
      ],
      xpAward: 150,
    },
    {
      id: "w1-s4",
      type: "revelation",
      revealText:
        "You don't need to code. You need to conduct. An orchestra conductor doesn't play every instrument — they direct the ensemble with clarity and vision. That's exactly what the best AI users do. They conduct. Week 2 awaits: Discover how AI actually works under the hood.",
      xpAward: 200,
    },
  ],
}
