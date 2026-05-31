import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const MOCK_ELABORATIONS = [
  "That choice makes intuitive sense — most people assume the tool is the bottleneck. But specificity is the real lever. The more precisely you describe what you need, the less room the AI has to guess, and guessing is where generic output comes from.",
  "It's a natural assumption, but it misses the key dynamic: AI doesn't evaluate quality — it predicts likely output. Give it a vague signal, it produces the statistical average. Give it a precise signal, it narrows toward exactly what you described.",
  "Think about it from the AI's perspective: it has no goal of its own, no taste, no preference. It's completing a pattern. The quality of the pattern you start determines the quality of the pattern it finishes.",
]

export async function POST(req: NextRequest) {
  try {
    const { question, wrongChoiceText, correctChoiceText, concept, scenarioText } = await req.json()

    if (!question || !wrongChoiceText || !correctChoiceText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_key_here") {
      // Return a contextually relevant mock
      const mock = MOCK_ELABORATIONS[Math.floor(Math.random() * MOCK_ELABORATIONS.length)]
      return NextResponse.json({ elaboration: mock })
    }

    const client = new Anthropic({ apiKey })

    const prompt = `You are the Maestro — a wise, cinematic AI mentor inside MaestroPlay, an AI literacy learning game. A student just answered an AI quiz question incorrectly.

Write a 2–3 sentence elaboration (under 60 words) that teaches the correct concept deeply and memorably.

Question: "${question}"
Student chose (wrong): "${wrongChoiceText}"
Correct answer was: "${correctChoiceText}"${concept ? `\nAI concept being taught: ${concept}` : ""}${scenarioText ? `\nStory context: ${scenarioText}` : ""}

Rules:
- Start with why the wrong choice is understandable, but don't say "that's understandable"
- Second or third sentence: the real insight that makes the correct answer right
- Use second person ("you"), warm mentor tone
- Plain prose only — no bullet points, no markdown
- Do NOT begin with "The correct answer is..." or "Actually..." or "Great question"
- Be specific — reference the actual question content, not generic AI advice`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    })

    const elaboration = message.content[0].type === "text"
      ? message.content[0].text.trim()
      : ""

    return NextResponse.json({ elaboration })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("maestro-feedback error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
