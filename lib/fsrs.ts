// FSRS wrapper — converts game concept scenes into schedulable flashcards
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type FSRSParameters } from "ts-fsrs"

export { Rating }
export type { Card }

export const fsrsParams: FSRSParameters = generatorParameters({ enable_fuzz: true })
export const f = fsrs(fsrsParams)

export type ReviewCard = {
  id?: string
  user_id?: string
  game_slug: string
  game_week: number
  concept_title: string
  concept_body: string
  // FSRS fields
  due: string          // ISO date
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  learning_steps: number
  state: number        // 0=New, 1=Learning, 2=Review, 3=Relearning
  last_review: string | null
}

/** Turn a raw FSRS Card into the DB row shape */
export function cardToRow(card: Card, base: Pick<ReviewCard, "game_slug"|"game_week"|"concept_title"|"concept_body">): Omit<ReviewCard,"id"|"user_id"> {
  return {
    ...base,
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    learning_steps: card.learning_steps,
    state: card.state,
    last_review: card.last_review ? card.last_review.toISOString() : null,
  }
}

/** Turn a DB row back into a FSRS Card */
export function rowToCard(row: ReviewCard): Card {
  return {
    due: new Date(row.due),
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsed_days,
    scheduled_days: row.scheduled_days,
    reps: row.reps,
    lapses: row.lapses,
    learning_steps: row.learning_steps,
    state: row.state as Card["state"],
    last_review: row.last_review ? new Date(row.last_review) : undefined,
  }
}
