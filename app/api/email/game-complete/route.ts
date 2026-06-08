import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendGameComplete } from "@/lib/email"
import { getGame } from "@/lib/games"

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/email/game-complete
 * Body: { userId: string, gameSlug: string, xpEarned: number }
 *
 * Looks up the user's email from Supabase auth.
 * Resolves the completed game's title and the next game's title from
 * the game registry (lib/games/index.ts) using game.nextGame metadata.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, gameSlug, xpEarned } = await req.json()

    if (!userId || !gameSlug || typeof xpEarned !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: userId, gameSlug, xpEarned" },
        { status: 400 }
      )
    }

    // ── 1. Resolve game titles from the game registry ─────────────────────
    const completedGame = getGame(gameSlug)
    if (!completedGame) {
      return NextResponse.json(
        { error: `Unknown gameSlug: ${gameSlug}` },
        { status: 400 }
      )
    }

    // nextGame is an object with a slug field on the game metadata
    const nextGameSlug: string | undefined = completedGame.nextGame?.slug
    const nextGame = nextGameSlug ? getGame(nextGameSlug) : undefined
    const nextGameTitle = nextGame?.title ?? "Your Next Challenge"

    // ── 2. Look up user email from Supabase Auth ───────────────────────────
    const admin = getAdminClient()
    const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "User not found or has no email" },
        { status: 404 }
      )
    }

    // ── 3. Send email ──────────────────────────────────────────────────────
    await sendGameComplete(user.email, completedGame.title, xpEarned, nextGameTitle)

    return NextResponse.json({
      ok: true,
      sent: true,
      to: user.email,
      gameName: completedGame.title,
      nextGameTitle,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("[game-complete email] error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
