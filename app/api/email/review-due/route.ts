import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendReviewDue } from "@/lib/email"

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * POST /api/email/review-due
 * Body: { userId: string, conceptCount: number }
 *
 * Looks up the user's email from Supabase auth.
 * Rate-limits to one email per user per 3 calendar days via the
 * email_rate_limits table (columns: user_id, email_type, sent_date).
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, conceptCount } = await req.json()

    if (!userId || typeof conceptCount !== "number" || conceptCount <= 0) {
      return NextResponse.json(
        { error: "Missing required fields: userId, conceptCount" },
        { status: 400 }
      )
    }

    const admin = getAdminClient()
    const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const emailType = "review-due"

    // ── 1. Check if user is unsubscribed ──────────────────────────────────
    // In a fully scaled app, this checks user_preferences/settings.
    // For now, we query Supabase user metadata or local preferences if available.
    const { data: { user }, error: userError } = await admin.auth.admin.getUserById(userId)

    if (userError || !user?.email) {
      return NextResponse.json(
        { error: "User not found or has no email" },
        { status: 404 }
      )
    }

    const isUnsubscribed = user.user_metadata?.unsubscribed === true
    if (isUnsubscribed) {
      return NextResponse.json({ ok: true, skipped: true, reason: "user unsubscribed" })
    }

    // ── 2. Rate-limit check — one per 3 days per user ──────────────────────
    let alreadySentRecent = false
    try {
      // Find any send in the last 3 days
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0]

      const { data: recentSends } = await admin
        .from("email_rate_limits")
        .select("sent_date")
        .eq("user_id", userId)
        .eq("email_type", emailType)
        .gte("sent_date", threeDaysAgoStr)

      alreadySentRecent = !!(recentSends && recentSends.length > 0)
    } catch {
      console.warn("[review-due] email_rate_limits table check failed — skipping rate-limit check")
    }

    if (alreadySentRecent) {
      return NextResponse.json({ ok: true, skipped: true, reason: "already sent recently (last 3 days)" })
    }

    // ── 3. Send email ──────────────────────────────────────────────────────
    await sendReviewDue(user.email, conceptCount)

    // ── 4. Record send in rate-limit table ────────────────────────────────
    try {
      await admin.from("email_rate_limits").upsert(
        { user_id: userId, email_type: emailType, sent_date: today },
        { onConflict: "user_id,email_type,sent_date" }
      )
    } catch {
      console.warn("[review-due] Could not record to email_rate_limits — table may not exist")
    }

    return NextResponse.json({ ok: true, sent: true, to: user.email })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("[review-due] error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
