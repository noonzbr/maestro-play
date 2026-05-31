import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { f, rowToCard, cardToRow, type ReviewCard } from "@/lib/fsrs"
import { Rating } from "ts-fsrs"

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

async function verifyUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null
  const token = authHeader.slice(7)

  const userClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
  const { data: { user }, error } = await userClient.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * GET /api/review
 * Header: Authorization: Bearer <supabase_access_token>
 *
 * Returns up to 20 review cards that are due for the authenticated user.
 * Response: { cards: ReviewCard[], total_due: number }
 */
export async function GET(req: NextRequest) {
  try {
    const user = await verifyUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = getAdminClient()
    const now = new Date().toISOString()

    // Fetch total due count
    const { count: total_due } = await admin
      .from("review_cards")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .lte("due", now)

    // Fetch up to 20 due cards
    const { data, error } = await admin
      .from("review_cards")
      .select("*")
      .eq("user_id", user.id)
      .lte("due", now)
      .order("due", { ascending: true })
      .limit(20)

    if (error) throw error

    return NextResponse.json({
      cards: (data ?? []) as ReviewCard[],
      total_due: total_due ?? 0,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("review GET error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/**
 * POST /api/review
 * Header: Authorization: Bearer <supabase_access_token>
 * Body: { cardId: string, rating: number }  (rating: 1=Again, 2=Hard, 3=Good, 4=Easy)
 *
 * Loads the card, runs the FSRS scheduler, persists the updated card.
 * Response: { nextDue: string, interval: number }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await verifyUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cardId, rating } = await req.json() as { cardId: string; rating: number }

    if (!cardId || typeof rating !== "number") {
      return NextResponse.json(
        { error: "Missing fields: cardId, rating" },
        { status: 400 }
      )
    }

    // Validate rating is one of the FSRS Rating enum values (1-4)
    if (![Rating.Again, Rating.Hard, Rating.Good, Rating.Easy].includes(rating)) {
      return NextResponse.json(
        { error: "rating must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy)" },
        { status: 400 }
      )
    }

    const admin = getAdminClient()

    // Load the card — verify it belongs to the authenticated user
    const { data: row, error: fetchError } = await admin
      .from("review_cards")
      .select("*")
      .eq("id", cardId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!row) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const card = rowToCard(row as ReviewCard)
    const now = new Date()

    // Run FSRS scheduler
    const scheduling = f.repeat(card, now)
    // scheduling is keyed by numeric string — cast through unknown to avoid IPreview mismatch
    const result = (scheduling as unknown as Record<number, { card: typeof card }>)[rating]
    const nextCard = result.card

    // Persist updated card
    const updatedRow = cardToRow(nextCard, {
      game_slug: row.game_slug,
      game_week: row.game_week,
      concept_title: row.concept_title,
      concept_body: row.concept_body,
    })

    const { error: updateError } = await admin
      .from("review_cards")
      .update(updatedRow)
      .eq("id", cardId)

    if (updateError) throw updateError

    return NextResponse.json({
      nextDue: nextCard.due.toISOString(),
      interval: nextCard.scheduled_days,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("review POST error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
