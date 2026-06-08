import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendStreakWarning } from "@/lib/email"

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/email/streak-warning
 * Body: { userId: string, streakDays: number }
 *
 * Looks up the user's email from Supabase auth.
 * Rate-limits to one email per user per calendar day via the
 * email_rate_limits table (columns: user_id, email_type, sent_date).
 *
 * If that table does not exist yet, the email is sent anyway and a warning
 * is logged — the table is non-blocking so it won't break the endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, streakDays } = await req.json()

    if (!userId || typeof streakDays !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: userId, streakDays" },
        { status: 400 }
      )
    }

    const admin = getAdminClient()
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const emailType = "streak-warning"

    // ── 1. Rate-limit check — one per day per user ─────────────────────────
    let alreadySent = false
    try {
      const { data: limitRow } = await admin
        .from("email_rate_limits")
        .select("id")
        .eq("user_id", userId)
        .eq("email_type", emailType)
        .eq("sent_date", today)
        .maybeSingle()
      alreadySent = !!limitRow
    } catch {
      console.warn("[streak-warning] email_rate_limits table not found — skipping rate-limit check")
    }

    if (alreadySent) {
      return NextResponse.json({ ok: true, skipped: true, reason: "already sent today" })
    }

    // ── 2. Look up user email from Supabase Auth ───────────────────────────
    const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "User not found or has no email" },
        { status: 404 }
      )
    }

    const playerName = user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email.split("@")[0]

    // ── 3. Send email ──────────────────────────────────────────────────────
    await sendStreakWarning(user.email, streakDays, playerName)

    // ── 4. Record send in rate-limit table ────────────────────────────────
    try {
      await admin.from("email_rate_limits").upsert(
        { user_id: userId, email_type: emailType, sent_date: today },
        { onConflict: "user_id,email_type,sent_date" }
      )
    } catch {
      console.warn("[streak-warning] Could not record to email_rate_limits — table may not exist")
    }

    return NextResponse.json({ ok: true, sent: true, to: user.email })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("[streak-warning] error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
