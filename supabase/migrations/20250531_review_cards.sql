-- FSRS review cards table
-- Run this in Supabase SQL editor: https://supabase.com/dashboard → SQL Editor

create table if not exists review_cards (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  game_slug       text not null,
  game_week       int  not null,
  concept_title   text not null,
  concept_body    text not null,

  -- FSRS algorithm state
  due             timestamptz not null default now(),
  stability       float8 not null default 0,
  difficulty      float8 not null default 0,
  elapsed_days    float8 not null default 0,
  scheduled_days  float8 not null default 0,
  reps            int    not null default 0,
  lapses          int    not null default 0,
  learning_steps  int    not null default 0,
  state           int    not null default 0,  -- 0=New 1=Learning 2=Review 3=Relearning
  last_review     timestamptz,

  created_at      timestamptz not null default now()
);

-- Unique constraint: one card per user/game/concept (upsert ignores duplicates)
alter table review_cards
  drop constraint if exists review_cards_user_game_concept_key;

alter table review_cards
  add constraint review_cards_user_game_concept_key
  unique (user_id, game_slug, concept_title);

-- Row-level security: users only see their own cards
alter table review_cards enable row level security;

drop policy if exists "Users manage own review cards" on review_cards;

create policy "Users manage own review cards"
  on review_cards
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fetching due cards quickly
create index if not exists review_cards_user_due_idx
  on review_cards (user_id, due asc);
