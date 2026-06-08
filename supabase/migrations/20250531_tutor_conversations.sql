-- MaestroPlay: AI Tutor conversation history
-- Run in Supabase SQL Editor: supabase.com → SQL editor → paste + run
-- This enables per-user, per-game Maestro Tutor conversation persistence.

CREATE TABLE IF NOT EXISTS tutor_conversations (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_slug    TEXT        NOT NULL,
  messages     JSONB       NOT NULL DEFAULT '[]',  -- array of {role, content} objects
  direct_left  INT         NOT NULL DEFAULT 3,     -- remaining "give me the answer" uses
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, game_slug)
);

ALTER TABLE tutor_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tutor conversations"
  ON tutor_conversations FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast lookup by user + game
CREATE INDEX IF NOT EXISTS tutor_conversations_user_game
  ON tutor_conversations (user_id, game_slug);
