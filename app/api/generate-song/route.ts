import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

// ── Mock result shown when no Suno API key is configured ──────────────────────
const BASE_MOCK: SongResult = {
  id: "mock",
  status: "complete",
  isMock: true,
  title: "Driving Away in the Rain",
  sunoPrompt:
    "Fingerstyle acoustic guitar, Am key, 68 BPM, melancholic rain sounds, city night reflections, post-breakup numbness, cinematic indie, slow build, reverb",
  audioUrl: null,
  imageUrl: null,
}

type SongResult = {
  id: string
  status: "pending" | "complete" | "error"
  isMock: boolean
  title: string | null
  sunoPrompt: string | null
  audioUrl: string | null
  imageUrl: string | null
}

// ── Claude: craft an optimal Suno prompt from the player's text ───────────────
async function craftSunoPrompt(playerPrompt: string, apiKey: string): Promise<string> {
  const client = new Anthropic({ apiKey })
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 120,
    messages: [
      {
        role: "user",
        content: `You are a music producer for Suno AI. A player wrote this prompt for Jake, a 17-year-old guitarist:
"${playerPrompt}"

Jake's song should capture: driving away from someone's house for the last time — city lights blurring through rain, numb, not crying yet.

Write a Suno music generation prompt. Max 25 words. Output ONLY the prompt, no explanation, no quotes.
Format: [genre], [key] key, [BPM] BPM, [mood], [instruments], [sonic details]`,
      },
    ],
  })
  const raw = msg.content[0].type === "text" ? msg.content[0].text.trim() : ""
  return raw || BASE_MOCK.sunoPrompt!
}

// ── POST /api/generate-song — start generation ────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { playerPrompt } = await req.json()
    if (!playerPrompt) {
      return NextResponse.json({ error: "Missing playerPrompt" }, { status: 400 })
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    const sunoKey = process.env.SUNO_API_KEY
    const sunoBase = process.env.SUNO_API_URL ?? "https://api.suno.ai"

    // Build the Suno prompt (Claude-enhanced when possible)
    let sunoPrompt = BASE_MOCK.sunoPrompt!
    if (anthropicKey && anthropicKey !== "your_key_here" && anthropicKey.trim() !== "") {
      try {
        sunoPrompt = await craftSunoPrompt(playerPrompt, anthropicKey)
      } catch {
        // fall back to default
      }
    }

    // No Suno key → return mock with (possibly Claude-crafted) prompt
    if (!sunoKey || sunoKey === "your_suno_api_key_here" || sunoKey.trim() === "") {
      return NextResponse.json({ ...BASE_MOCK, sunoPrompt })
    }

    // Call Suno API — official endpoint https://api.suno.ai/api/generate/v2/
    const genRes = await fetch(`${sunoBase}/api/generate/v2/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sunoKey}`,
      },
      body: JSON.stringify({
        gpt_description_prompt: sunoPrompt,
        make_instrumental: true,
        mv: "chirp-v4",
      }),
    })

    if (!genRes.ok) {
      const errBody = await genRes.text()
      throw new Error(`Suno API ${genRes.status}: ${errBody.slice(0, 200)}`)
    }

    const genData = await genRes.json()
    // Official API returns { clips: [{ id, ... }] }
    const songId: string | undefined = genData?.clips?.[0]?.id ?? genData?.data?.[0]?.id
    if (!songId) throw new Error("Suno returned no song ID")

    return NextResponse.json({
      id: songId,
      status: "pending",
      sunoPrompt,
      isMock: false,
      title: null,
      audioUrl: null,
      imageUrl: null,
    } satisfies SongResult)
  } catch (err) {
    console.error("generate-song POST:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// ── GET /api/generate-song?id=xxx — poll for completion ──────────────────────
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")

    if (!id || id === "mock") {
      return NextResponse.json(BASE_MOCK)
    }

    const sunoKey = process.env.SUNO_API_KEY
    if (!sunoKey || sunoKey === "your_suno_api_key_here" || sunoKey.trim() === "") {
      return NextResponse.json(BASE_MOCK)
    }

    const sunoBase = process.env.SUNO_API_URL ?? "https://api.suno.ai"
    // Official poll endpoint: GET /api/feed/?ids=<id>
    const pollRes = await fetch(`${sunoBase}/api/feed/?ids=${id}`, {
      headers: { "Authorization": `Bearer ${sunoKey}` },
    })

    if (!pollRes.ok) {
      throw new Error(`Suno poll ${pollRes.status}`)
    }

    const pollData = await pollRes.json()
    // Official API returns an array directly: [{ id, status, audio_url, ... }]
    const song = Array.isArray(pollData) ? pollData[0] : (pollData?.data?.[0] ?? pollData?.clips?.[0])
    if (!song) throw new Error("Empty poll response")

    const rawStatus: string = song.status ?? ""
    const status: "pending" | "complete" | "error" =
      rawStatus === "complete"
        ? "complete"
        : rawStatus === "error" || rawStatus === "failed"
        ? "error"
        : "pending"

    return NextResponse.json({
      id: song.id,
      status,
      isMock: false,
      title: song.title ?? null,
      sunoPrompt: null,
      audioUrl: song.audio_url ?? null,
      imageUrl: song.image_url ?? null,
    } satisfies SongResult)
  } catch (err) {
    console.error("generate-song GET:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}
