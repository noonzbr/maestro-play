-- MaestroPlay: Email rate-limiting and tracking
-- Run in Supabase SQL Editor: supabase.com → SQL editor → paste + run
-- This avoids sending duplicate alerts or spamming users.

CREATE TABLE IF NOT EXISTS email_rate_limits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type  TEXT        NOT NULL, -- e.g. "streak-warning", "review-due", "game-complete"
  sent_date   DATE        NOT NULL, -- YYYY-MM-DD
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, email_type, sent_date)
);

ALTER TABLE email_rate_limits ENABLE ROW LEVEL SECURITY;

-- Select policy: users can see their own logs
CREATE POLICY "Users can view own email limits"
  ON email_rate_limits FOR SELECT
  USING (auth.uid() = user_id);

-- Insert/Upsert policy: allow service role to manage rate limit entries.
-- Supabase service role bypasses RLS by default. If testing locally or via API:
CREATE POLICY "Users can insert own email limits"
  ON email_rate_limits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS email_rate_limits_user_type_date
  ON email_rate_limits (user_id, email_type, sent_date);
