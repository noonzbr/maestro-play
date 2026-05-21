import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const MOCK_RESPONSE = {
  aiResponse:
    "Here's a fingerstyle piece in Am at 68 BPM — opening with a suspended chord that lingers before resolving into a melancholic descent. The mood captures something unfinished, like a sentence cut short.",
  scores: { clarity: 3, context: 3, goal: 3 },
  feedback: "Add emotional specificity — what exact feeling or moment is this about?",
  xp: 60,
}

export async function POST(req: NextRequest) {
  try {
    const { userPrompt, context, goal } = await req.json()

    if (!userPrompt || !context || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Return mock when no API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_key_here") {
      return NextResponse.json(MOCK_RESPONSE)
    }

    const client = new Anthropic({ apiKey })

    const systemPrompt = `You are the AI inside MaestroPlay, an AI literacy game. A player is helping Jake, a 17-year-old guitarist, write his first real AI prompt.

Challenge context: ${context}
What Jake wants: ${goal}

The player wrote this prompt for Jake: "${userPrompt}"

Respond ONLY with valid JSON, no markdown, no explanation:
{
  "aiResponse": "How you (the AI assistant) would actually respond to Jake's prompt — 2-3 sentences, natural and helpful, as if you're really the AI Jake is talking to",
  "scores": { "clarity": <1-5>, "context": <1-5>, "goal": <1-5> },
  "feedback": "One coaching sentence (max 18 words) about what would improve this prompt",
  "xp": <20-100 integer based on overall quality>
}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [{ role: "user", content: systemPrompt }],
    })

    const raw = message.content[0].type === "text" ? message.content[0].text : ""

    // Strip accidental markdown code fences
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("ai-prompt error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
