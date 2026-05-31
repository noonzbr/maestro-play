import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createEmptyCard } from "ts-fsrs"
import { cardToRow } from "@/lib/fsrs"

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

/**
 * POST /api/review/create
 * Body: { gameSlug: string, gameWeek: number, concepts: { title: string, body: string }[] }
 * Header: Authorization: Bearer <supabase_access_token>
 *
 * Creates FSRS review cards for all concepts in a completed game.
 * Skips cards that already exist (upsert with ignoreDuplicates) so progress is never reset.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify the user's JWT via Supabase
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.slice(7)

    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = user.id

    const body = await req.json()
    const { gameSlug, gameWeek, concepts } = body as {
      gameSlug: string
      gameWeek: number
      concepts: { title: string; body: string }[]
    }

    if (!gameSlug || typeof gameWeek !== "number" || !Array.isArray(concepts) || concepts.length === 0) {
      return NextResponse.json(
        { error: "Missing fields: gameSlug, gameWeek, concepts[]" },
        { status: 400 }
      )
    }

    const admin = getAdminClient()

    // Build rows for each concept using a fresh FSRS card
    const rows = concepts.map((concept) => {
      const emptyCard = createEmptyCard()
      const row = cardToRow(emptyCard, {
        game_slug: gameSlug,
        game_week: gameWeek,
        concept_title: concept.title,
        concept_body: concept.body,
      })
      return { ...row, user_id: userId }
    })

    // Upsert — if the card already exists (user_id + game_slug + concept_title),
    // do nothing so existing FSRS progress is preserved.
    const { data, error } = await admin
      .from("review_cards")
      .upsert(rows, {
        onConflict: "user_id,game_slug,concept_title",
        ignoreDuplicates: true,
      })
      .select("id")

    if (error) throw error

    return NextResponse.json({ created: data?.length ?? 0 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("review/create error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
