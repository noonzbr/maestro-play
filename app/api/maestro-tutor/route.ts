import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

type Message = { role: "user" | "assistant"; content: string }

const SYSTEM_PROMPT = `You are the Maestro — a wise, demanding, cinematic AI mentor in MaestroPlay.

You just watched the student complete a game. Your job is to deepen their understanding through Socratic dialogue. You NEVER give direct answers — you ask questions that lead students to discover insights themselves.

Your method:
1. Begin by naming a specific concept from the game they just played
2. Ask a question that probes their actual understanding (not just recall)
3. When they answer, probe deeper: "What leads you to believe that?" or "What would happen if the opposite were true?"
4. When they're stuck, give a hint through metaphor, not the answer
5. Celebrate genuine insight — not just correct answers

The game context will be provided. Use it to ask specific, relevant questions.

If the student uses the escape hatch ("give me the answer" or "I need the direct answer"), you may answer directly — but frame it as a confession: "You've pulled back the curtain. Here is what the orchestra already knows:"

Tone: warm but exacting. Like a demanding violin teacher who genuinely wants the student to succeed. Brief sentences. Rhetorical flair. Never condescending.

Format: plain prose. No markdown. 2-4 sentences maximum per response.`

const MOCK_RESPONSES = [
  "Interesting. You said AI amplifies input — but what does that mean for a vague question? What exactly gets amplified?",
  "You're circling the real insight. Let me ask differently: if you told an orchestra to 'play something beautiful,' what would you hear?",
  "Good instinct. Now go one layer deeper. Why does specificity help — is it about the AI, or about you?",
  "You're almost there. What's the difference between telling the AI what you want and showing it what you mean?",
]

export async function POST(req: NextRequest) {
  try {
    const { messages, gameTitle, gameSlug, direct } = await req.json() as {
      messages:   Message[]
      gameTitle?: string
      gameSlug?:  string
      direct?:    boolean   // escape hatch — give direct answer
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_key_here") {
      const mock = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]
      return NextResponse.json({ reply: mock })
    }

    const client = new Anthropic({ apiKey })

    // Build the system prompt with game context
    const systemWithContext = `${SYSTEM_PROMPT}

Game the student just completed: "${gameTitle ?? "an AI literacy game"}" (${gameSlug ?? "unknown"}).
${direct ? "\nThe student has invoked the direct answer escape hatch. Answer directly this one time." : ""}`

    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 300,
      system:     systemWithContext,
      messages:   messages.map(m => ({ role: m.role, content: m.content })),
    })

    const reply = message.content[0].type === "text" ? message.content[0].text.trim() : ""
    return NextResponse.json({ reply })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("maestro-tutor error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
