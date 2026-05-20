import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const SYSTEM_PROMPT = `You are the voice of Maestro Academy. Confident, warm, punchy, slightly theatrical. You believe AI literacy is the great equalizer. Short declarative sentences. Use conductor/orchestra metaphors naturally. Never use jargon without explanation. End posts with a hook or question. Never exceed 280 characters per post including spaces.`

function parseSection(text: string, prefix: string): string[] {
  const results: string[] = []
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`${escaped} \\d+:\\s*([\\s\\S]*?)(?=${escaped} \\d+:|$)`, "gi")
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    const content = match[1].trim()
    if (content) results.push(content)
  }
  return results
}

export async function POST(req: NextRequest) {
  try {
    const { concept, type } = await req.json()

    if (!concept) return NextResponse.json({ error: "Missing concept" }, { status: 400 })

    const isThread = type === "thread"

    const userPrompt = isThread
      ? `Write a 5-tweet educational thread about: "${concept}". Format each tweet as: Tweet 1: ... Tweet 2: ... etc. Each tweet under 280 chars. Max 2 hashtags total. Use the Maestro conductor metaphor at least once. Start with a strong hook.`
      : `Write exactly 3 X/Twitter posts about "${concept}". Mix: one insight, one myth-bust, one question. Each under 280 chars. Max 2 hashtags per post. Label them: POST 1: ... POST 2: ... POST 3: ...`

    const client = getClient()
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""

    if (isThread) {
      let tweets = parseSection(text, "Tweet")
      if (!tweets.length) {
        tweets = text.split("\n\n").map((t: string) => t.trim()).filter(Boolean)
      }
      return NextResponse.json({ type: "thread", tweets })
    } else {
      const posts = parseSection(text, "POST")
      return NextResponse.json({ type: "posts", posts })
    }
  } catch (err) {
    console.error("Generate posts error:", err)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
