/**
 * MaestroPlay Email — Resend API (fetch-based, no package dependency)
 *
 * Uses https://api.resend.com/emails directly.
 * If RESEND_API_KEY is not set, all functions log a warning and return gracefully.
 *
 * From address: onboarding@resend.dev (works without domain verification for testing)
 * Switch to your verified domain address in production.
 */

const RESEND_API = "https://api.resend.com/emails"
const FROM_ADDRESS = process.env.RESEND_FROM ?? "MaestroPlay <onboarding@resend.dev>"

function getApiKey(): string | null {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn(
      "[MaestroPlay Email] RESEND_API_KEY is not set. Email sending is disabled. " +
      "Add RESEND_API_KEY to .env.local to enable emails."
    )
    return null
  }
  return key
}

async function sendEmail(opts: {
  to: string
  subject: string
  text: string
  html: string
}): Promise<void> {
  const apiKey = getApiKey()
  if (!apiKey) return

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "(no body)")
    console.error(`[MaestroPlay Email] Resend API error ${res.status}: ${body}`)
    // Do not throw — graceful degradation; email failure must never break the app
  }
}

// ─── Streak Warning ───────────────────────────────────────────────────────────

export async function sendStreakWarning(
  to: string,
  streakDays: number,
  playerName: string
): Promise<void> {
  const subject = `⚡ Your ${streakDays}-day streak ends in 4 hours`

  const text = [
    `Hey ${playerName},`,
    "",
    `Your ${streakDays}-day learning streak is about to break.`,
    "",
    "You have roughly 4 hours to complete a game and keep it alive.",
    "",
    "The Maestro is watching.",
    "",
    "Play now: https://maestroplay.com/dashboard",
    "",
    "— The MaestroPlay Orchestra",
    "",
    "To stop receiving these emails, visit your account settings.",
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="background:#0a0a0f;color:#e8e0ff;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <tr>
      <td>
        <p style="font-size:28px;margin:0 0 8px;letter-spacing:-0.5px;">&#9889; Streak Alert</p>
        <p style="font-size:15px;color:#a89fd0;margin:0 0 32px;">MaestroPlay</p>

        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
          Hey <strong>${playerName}</strong>,
        </p>
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
          Your <strong style="color:#c084fc;">${streakDays}-day streak</strong> is about to break.
          You have roughly <strong>4 hours</strong> to complete a game and keep it alive.
        </p>
        <p style="font-size:15px;color:#a89fd0;margin:0 0 32px;font-style:italic;">
          The Maestro is watching.
        </p>

        <a href="https://maestroplay.com/dashboard"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;
                  text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;
                  font-weight:600;letter-spacing:0.3px;">
          Keep My Streak &#9889;
        </a>

        <p style="font-size:13px;color:#6b7280;margin:40px 0 0;">
          — The MaestroPlay Orchestra<br />
          <a href="https://maestroplay.com/settings" style="color:#6b7280;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  await sendEmail({ to, subject, text, html })
}

// ─── Game Complete ────────────────────────────────────────────────────────────

export async function sendGameComplete(
  to: string,
  gameName: string,
  xpEarned: number,
  nextGameTitle: string
): Promise<void> {
  const subject = `🎼 You just unlocked ${nextGameTitle}`

  const text = [
    `You completed "${gameName}" and earned ${xpEarned} XP.`,
    "",
    `Your next game is ready: ${nextGameTitle}`,
    "",
    "The orchestra moves forward. Will you?",
    "",
    "Continue: https://maestroplay.com/dashboard",
    "",
    "— The MaestroPlay Orchestra",
    "",
    "To stop receiving these emails, visit your account settings.",
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="background:#0a0a0f;color:#e8e0ff;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <tr>
      <td>
        <p style="font-size:28px;margin:0 0 8px;letter-spacing:-0.5px;">&#127932; Game Complete</p>
        <p style="font-size:15px;color:#a89fd0;margin:0 0 32px;">MaestroPlay</p>

        <p style="font-size:16px;line-height:1.6;margin:0 0 8px;">
          You completed <strong style="color:#c084fc;">"${gameName}"</strong>
        </p>
        <p style="font-size:32px;font-weight:700;color:#fbbf24;margin:0 0 24px;">
          +${xpEarned} XP
        </p>

        <p style="font-size:16px;line-height:1.6;margin:0 0 8px;color:#a89fd0;">
          Your next game is ready:
        </p>
        <p style="font-size:20px;font-weight:700;color:#e8e0ff;margin:0 0 32px;">
          ${nextGameTitle}
        </p>

        <p style="font-size:15px;color:#a89fd0;margin:0 0 24px;font-style:italic;">
          The orchestra moves forward. Will you?
        </p>

        <a href="https://maestroplay.com/dashboard"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;
                  text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;
                  font-weight:600;letter-spacing:0.3px;">
          Play ${nextGameTitle} &#127932;
        </a>

        <p style="font-size:13px;color:#6b7280;margin:40px 0 0;">
          — The MaestroPlay Orchestra<br />
          <a href="https://maestroplay.com/settings" style="color:#6b7280;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  await sendEmail({ to, subject, text, html })
}

// ─── Review Due ───────────────────────────────────────────────────────────────

export async function sendReviewDue(
  to: string,
  conceptCount: number
): Promise<void> {
  const subject = `The Maestro is calling — ${conceptCount} concept${conceptCount === 1 ? "" : "s"} ready for review`

  const text = [
    `${conceptCount} concept${conceptCount === 1 ? "" : "s"} ${conceptCount === 1 ? "is" : "are"} ready for review.`,
    "",
    "Spaced repetition works — but only if you show up.",
    "Your session will take about 5 minutes.",
    "",
    "The Maestro has summoned you to the practice room.",
    "",
    "Review now: https://maestroplay.com/review",
    "",
    "— The MaestroPlay Orchestra",
    "",
    "To stop receiving these emails, visit your account settings.",
  ].join("\n")

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="background:#0a0a0f;color:#e8e0ff;font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <tr>
      <td>
        <p style="font-size:28px;margin:0 0 8px;letter-spacing:-0.5px;">&#127932; Review Time</p>
        <p style="font-size:15px;color:#a89fd0;margin:0 0 32px;">MaestroPlay</p>

        <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
          <strong style="color:#c084fc;">${conceptCount} concept${conceptCount === 1 ? "" : "s"}</strong>
          ${conceptCount === 1 ? "is" : "are"} ready for review.
        </p>
        <p style="font-size:15px;line-height:1.6;color:#a89fd0;margin:0 0 16px;">
          Spaced repetition works — but only if you show up.<br />
          Your session will take about 5 minutes.
        </p>
        <p style="font-size:15px;color:#e8e0ff;margin:0 0 32px;font-style:italic;">
          The Maestro has summoned you to the practice room.
        </p>

        <a href="https://maestroplay.com/review"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;
                  text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;
                  font-weight:600;letter-spacing:0.3px;">
          Start Review &#127932;
        </a>

        <p style="font-size:13px;color:#6b7280;margin:40px 0 0;">
          — The MaestroPlay Orchestra<br />
          <a href="https://maestroplay.com/settings" style="color:#6b7280;">Unsubscribe</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

  await sendEmail({ to, subject, text, html })
}
