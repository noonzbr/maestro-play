# Email Re-engagement Setup

MaestroPlay uses [Resend](https://resend.com) to send transactional emails.
The integration is **fetch-based** — no npm package required.

---

## 1. Get a free Resend account

1. Go to [resend.com](https://resend.com) and sign up.
2. In the Resend dashboard, go to **API Keys** and click **Create API Key**.
3. Copy the key — it starts with `re_`.

Resend's free tier allows **100 emails per day** with no credit card required.

---

## 2. Add the key to .env.local

```env
RESEND_API_KEY=re_your_key_here
```

If `RESEND_API_KEY` is not set, all email functions log a warning and return
silently — the app continues to work normally.

---

## 3. Sending domain

**For local development / testing:**
Use the default From address `onboarding@resend.dev`. Resend allows this
on all accounts without domain verification.

**For production:**
1. In the Resend dashboard go to **Domains** and add your domain.
2. Add the DNS records Resend provides (SPF, DKIM, DMARC).
3. Set the optional env var to your verified address:

```env
RESEND_FROM=MaestroPlay <hello@yourdomain.com>
```

---

## 4. Rate-limit table (optional but recommended)

The streak-warning endpoint checks a `email_rate_limits` table in Supabase
to prevent sending duplicate emails on the same day. Create it with:

```sql
create table if not exists email_rate_limits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  email_type text not null,
  sent_date  date not null,
  created_at timestamptz not null default now(),
  unique (user_id, email_type, sent_date)
);

create index on email_rate_limits (user_id, email_type, sent_date);
```

If this table does not exist, the streak-warning endpoint still works —
it just skips the duplicate-send check and logs a warning.

---

## 5. Available email endpoints

| Endpoint | Trigger | Email sent |
|---|---|---|
| `POST /api/email/streak-warning` | `{ userId, streakDays }` | "Your N-day streak ends in 4 hours" |
| `POST /api/email/game-complete` | `{ userId, gameSlug, xpEarned }` | "You just unlocked [next game]" |

Call these from server-side code (cron jobs, Supabase edge functions, or
your `/api/progress` route after a game completion).

---

## 6. Email functions (lib/email.ts)

```ts
sendStreakWarning(to, streakDays, playerName)
sendGameComplete(to, gameName, xpEarned, nextGameTitle)
sendReviewDue(to, conceptCount)
```

`sendReviewDue` is available for use once the FSRS review system (Phase 2)
is wired up. Call it from a daily cron or Supabase scheduled function when
a user has concepts due.
