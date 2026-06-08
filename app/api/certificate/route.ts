import { NextRequest, NextResponse } from "next/server"
import { getGame } from "@/lib/games"

// Simple deterministic hash — not cryptographic, just unique enough for certificates
function simpleHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit int
  }
  // Make it positive and convert to base-36 for a compact alphanumeric string
  const unsigned = (hash >>> 0).toString(36)
  // Pad to 8 chars and add a prefix for readability
  return "mp" + unsigned.padStart(8, "0")
}

// Map game skill/tagline to a mastery phrase
function getMasteryPhrase(gameTitle: string, gameDescription: string): string {
  const desc = (gameDescription ?? "").toLowerCase()
  const title = (gameTitle ?? "").toLowerCase()

  if (title.includes("maestro method") || desc.includes("maestro method")) {
    return "the Maestro Method — crafting prompts with purpose, precision, and professional clarity"
  }
  if (desc.includes("hallucination") || title.includes("hallucination")) {
    return "identifying AI hallucinations and building reliable workflows with critical discernment"
  }
  if (desc.includes("prompt") || title.includes("prompt")) {
    return "advanced prompt engineering — writing instructions that AI actually follows"
  }
  if (desc.includes("chatgpt") || desc.includes("gpt")) {
    return "ChatGPT mastery — leveraging GPT-4o, custom GPTs, and multimodal AI for real-world tasks"
  }
  if (desc.includes("conductor") || title.includes("conductor")) {
    return "AI orchestration — directing multiple AI tools in concert to amplify professional output"
  }
  if (desc.includes("image") || desc.includes("creative") || desc.includes("midjourney")) {
    return "AI-augmented creativity — directing generative AI to produce professional-grade visual output"
  }
  if (desc.includes("agent") || desc.includes("automat")) {
    return "AI automation — building agentic workflows that multiply professional capacity"
  }
  if (desc.includes("data") || desc.includes("analys")) {
    return "AI-powered data analysis — extracting signal from noise with machine-assisted insight"
  }
  // Generic fallback based on the game title
  return `AI fluency through "${gameTitle}" — applying intelligent tools with the confidence of a conductor`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const gameSlug = searchParams.get("game")
  const playerName = searchParams.get("name")

  if (!gameSlug || !playerName) {
    return NextResponse.json(
      { error: "Missing required params: game and name" },
      { status: 400 }
    )
  }

  const game = getGame(gameSlug)
  if (!game) {
    return NextResponse.json(
      { error: `Game not found: ${gameSlug}` },
      { status: 404 }
    )
  }

  const sanitizedName = playerName.trim().slice(0, 80)
  const hashInput = `${gameSlug}::${sanitizedName}::maestroplay2025`
  const verificationHash = simpleHash(hashInput)

  const mastery = getMasteryPhrase(game.title, game.description)

  const shareText = `I just earned a Certificate of AI Fluency from @MaestroPlay! 🎼\n\nCompleted "${game.title}" and demonstrated mastery of ${mastery}.\n\nFree AI literacy games: maestroplay.app`

  // Use the existing /certificate/[slug] page — pass player name as query param
  // The [slug] page already renders a beautiful certificate with the game data
  const fullCertificateUrl = `/certificate/${gameSlug}?name=${encodeURIComponent(sanitizedName)}&v=${verificationHash}`

  return NextResponse.json({
    certificateUrl: fullCertificateUrl,
    shareText,
    verificationHash,
    gameTitle: game.title,
    mastery,
  })
}
