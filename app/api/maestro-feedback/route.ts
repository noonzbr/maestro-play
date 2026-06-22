import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const MOCK_ELABORATIONS = [
  "Tool choice is secondary. **Prompt Specificity** is the real lever; detailing constraints prevents the AI from generating **statistical averages**.",
  "Vague inputs force the AI to guess, returning **average patterns**. Precise details narrow predictions to your **intended goal**.",
  "AI doesn't judge quality—it completes patterns. Starting with a **strong pattern** guarantees the AI finishes with a **precise result**.",
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

Write a single-sentence Socratic elaboration (strictly under 25 words) that teaches the correct concept deeply and memorably.

Question: "${question}"
Student chose (wrong): "${wrongChoiceText}"
Correct answer was: "${correctChoiceText}"${concept ? `\nAI concept being taught: ${concept}` : ""}${scenarioText ? `\nStory context: ${scenarioText}` : ""}

Rules:
- MUST be strictly under 25 words
- Highlight key terminology using double asterisks (e.g. "**Prompt Specificity**")
- Keep it extremely concise for a quick chat bubble
- Use second person ("you"), warm mentor tone
- Do NOT begin with "The correct answer is..." or "Actually..." or "Great question"
- Be specific — reference the actual question content, not generic AI advice`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 100,
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
