// FSRS wrapper — converts game concept scenes into schedulable flashcards
import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type FSRSParameters } from "ts-fsrs"

export { Rating }
export type { Card }

// ── SM-2-style API ────────────────────────────────────────────────────────────
// A simplified flashcard type used by DailyChallenge and the SM-2 scheduler.
// quality: 0-2 = fail (Again), 3 = ok (Hard/Good), 4 = easy (Good), 5 = perfect (Easy)
//
// Named SM2Card to avoid collision with the FSRS-5 ReviewCard used by the API routes.

export type SM2Card = {
  id: string
  gameSlug: string
  concept: string
  question: string
  answer: string
  easeFactor: number   // SM-2: starts at 2.5, range [1.3, ∞)
  interval: number     // days until next review
  dueDate: string      // ISO date string
  repetitions: number  // number of successful reviews
}

/**
 * SM-2 scheduler.
 * quality 0-2 = fail → reset to day 1
 * quality 3-5 = pass → advance interval
 */
export function scheduleReview(card: SM2Card, quality: 0 | 1 | 2 | 3 | 4 | 5): SM2Card {
  const MIN_EF = 1.3
  let { easeFactor, interval, repetitions } = card

  if (quality < 3) {
    // Failed — reset
    repetitions = 0
    interval = 1
  } else {
    // Passed — advance
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetitions += 1
    // Update ease factor (SM-2 formula)
    easeFactor = Math.max(
      MIN_EF,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )
  }

  const due = new Date()
  due.setDate(due.getDate() + interval)
  due.setHours(0, 0, 0, 0)

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    dueDate: due.toISOString(),
  }
}

/** Returns true if the card is due today or overdue. */
export function isDue(card: SM2Card): boolean {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return new Date(card.dueDate) <= now
}

/** Filters an array of SM2Cards to only those that are due. */
export function getDueCards(cards: SM2Card[]): SM2Card[] {
  return cards.filter(isDue)
}

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
