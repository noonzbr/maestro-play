-- MaestroPlay initial schema
-- Run in Supabase SQL Editor: supabase.com → SQL editor → paste + run

-- ── User XP & Conductor Level ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_xp (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp    INTEGER     NOT NULL DEFAULT 0,
  level       TEXT        NOT NULL DEFAULT 'Apprentice', -- Apprentice/Associate/Conductor/Grand Maestro
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own XP"    ON user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own XP"  ON user_xp FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own XP"  ON user_xp FOR UPDATE USING (auth.uid() = user_id);

-- ── Individual game completions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_slug    TEXT        NOT NULL,
  game_week    INTEGER     NOT NULL,
  xp_earned    INTEGER     NOT NULL DEFAULT 0,
  completed    BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, game_slug)
);
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own progress"   ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- ── Daily streaks ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_streaks (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak  INTEGER NOT NULL DEFAULT 0,
  longest_streak  INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  UNIQUE(user_id)
);
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own streaks"   ON user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own streaks" ON user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- ── Purchases (already exists but ensure columns) ───────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT        NOT NULL UNIQUE,
  game_slug         TEXT        NOT NULL,
  amount            INTEGER     NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);
-- Service role inserts purchases (via webhook) — no user policy needed for insert

-- ── Mastery cards (for future FSRS spaced repetition) ──────────────────────
CREATE TABLE IF NOT EXISTS user_mastery (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  concept_id     TEXT        NOT NULL, -- e.g. "hallucination", "context-window"
  mastery_score  REAL        NOT NULL DEFAULT 0.0,
  ease_factor    REAL        NOT NULL DEFAULT 2.5,    -- FSRS stability
  interval_days  INTEGER     NOT NULL DEFAULT 1,      -- days until next review
  due_date       DATE        NOT NULL DEFAULT CURRENT_DATE,
  last_reviewed  TIMESTAMPTZ,
  UNIQUE(user_id, concept_id)
);
ALTER TABLE user_mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own mastery"   ON user_mastery FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own mastery" ON user_mastery FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mastery" ON user_mastery FOR UPDATE USING (auth.uid() = user_id);
