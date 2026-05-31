import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const LEVEL_THRESHOLDS = [
  { label: "Grand Maestro", minXp: 3000 },
  { label: "Conductor",     minXp: 1500 },
  { label: "Associate",     minXp: 500  },
  { label: "Apprentice",    minXp: 0    },
]

function computeLevel(xp: number): string {
  return LEVEL_THRESHOLDS.find(l => xp >= l.minXp)?.label ?? "Apprentice"
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key)
}

/**
 * POST /api/progress
 * Body: { gameSlug: string, gameWeek: number, xpEarned: number }
 * Header: Authorization: Bearer <supabase_access_token>
 *
 * Records game completion + updates XP + streak for the authenticated user.
 * Called by GameEngine when a game is completed.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify the user's JWT via Supabase
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const token = authHeader.slice(7)

    // Use client with user's JWT to verify identity
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

    const { gameSlug, gameWeek, xpEarned } = await req.json()
    if (!gameSlug || typeof gameWeek !== "number" || typeof xpEarned !== "number") {
      return NextResponse.json({ error: "Missing fields: gameSlug, gameWeek, xpEarned" }, { status: 400 })
    }

    const admin = getAdminClient()
    const now   = new Date()
    const today = now.toISOString().split("T")[0] // YYYY-MM-DD

    // ── 1. Upsert game completion ──────────────────────────────────────────
    const { error: progressError } = await admin
      .from("user_progress")
      .upsert({
        user_id:      userId,
        game_slug:    gameSlug,
        game_week:    gameWeek,
        xp_earned:    xpEarned,
        completed:    true,
        completed_at: now.toISOString(),
      }, { onConflict: "user_id,game_slug" })
    if (progressError) throw progressError

    // ── 2. Upsert total XP — take the max (no regression) ─────────────────
    const { data: existingXp } = await admin
      .from("user_xp")
      .select("total_xp")
      .eq("user_id", userId)
      .maybeSingle()

    const prevTotal  = existingXp?.total_xp ?? 0

    // Sum all game XPs from user_progress for accurate total
    const { data: allProgress } = await admin
      .from("user_progress")
      .select("xp_earned")
      .eq("user_id", userId)

    const newTotal = allProgress?.reduce((sum, r) => sum + (r.xp_earned ?? 0), 0) ?? xpEarned
    const finalTotal = Math.max(prevTotal, newTotal)

    await admin.from("user_xp").upsert({
      user_id:    userId,
      total_xp:   finalTotal,
      level:      computeLevel(finalTotal),
      updated_at: now.toISOString(),
    }, { onConflict: "user_id" })

    // ── 3. Update streak ───────────────────────────────────────────────────
    const { data: streakRow } = await admin
      .from("user_streaks")
      .select("current_streak, longest_streak, last_active_date")
      .eq("user_id", userId)
      .maybeSingle()

    const last          = streakRow?.last_active_date
    const current       = streakRow?.current_streak ?? 0
    const longest       = streakRow?.longest_streak ?? 0
    const isNewDay      = last !== today
    const isConsecutive = last
      ? (new Date(today).getTime() - new Date(last).getTime()) <= 86_400_000 * 1.5
      : true

    const newCurrent = isNewDay && isConsecutive ? current + 1 : isNewDay ? 1 : current
    const newLongest = Math.max(longest, newCurrent)

    await admin.from("user_streaks").upsert({
      user_id:          userId,
      current_streak:   newCurrent,
      longest_streak:   newLongest,
      last_active_date: today,
    }, { onConflict: "user_id" })

    return NextResponse.json({
      ok:          true,
      totalXp:     finalTotal,
      level:       computeLevel(finalTotal),
      streak:      newCurrent,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("progress error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/**
 * GET /api/progress
 * Returns the authenticated user's full progress summary.
 */
export async function GET(req: NextRequest) {
  try {
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

    const admin  = getAdminClient()
    const userId = user.id

    const [xpRow, progressRows, streakRow] = await Promise.all([
      admin.from("user_xp").select("*").eq("user_id", userId).maybeSingle(),
      admin.from("user_progress").select("*").eq("user_id", userId),
      admin.from("user_streaks").select("*").eq("user_id", userId).maybeSingle(),
    ])

    return NextResponse.json({
      xp:       xpRow.data ?? { total_xp: 0, level: "Apprentice" },
      progress: progressRows.data ?? [],
      streak:   streakRow.data ?? { current_streak: 0, longest_streak: 0 },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
