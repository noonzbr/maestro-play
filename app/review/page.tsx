"use client"

import { useEffect, useState, useCallback } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { Rating, type ReviewCard } from "@/lib/fsrs"

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionState =
  | { phase: "loading" }
  | { phase: "empty" }
  | { phase: "front"; card: ReviewCard; index: number; total: number }
  | { phase: "back";  card: ReviewCard; index: number; total: number }
  | { phase: "rating"; card: ReviewCard; index: number; total: number }
  | { phase: "done"; reviewed: number }
  | { phase: "error"; message: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getBearerToken(): Promise<string | null> {
  try {
    const { data } = await supabaseBrowser().auth.getSession()
    return data.session?.access_token ?? null
  } catch {
    return null
  }
}

// ─── Rating Button Config ─────────────────────────────────────────────────────

const RATINGS = [
  { label: "Again",  emoji: "🔴", value: Rating.Again, color: "#ef4444", bg: "rgba(239,68,68,0.15)"  },
  { label: "Hard",   emoji: "🟡", value: Rating.Hard,  color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  { label: "Good",   emoji: "🟢", value: Rating.Good,  color: "#22c55e", bg: "rgba(34,197,94,0.15)"  },
  { label: "Easy",   emoji: "⚡", value: Rating.Easy,  color: "#22d3ee", bg: "rgba(34,211,238,0.15)" },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewPage() {
  const [state, setState] = useState<SessionState>({ phase: "loading" })
  const [cards, setCards] = useState<ReviewCard[]>([])
  const [reviewedCount, setReviewedCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load due cards on mount
  useEffect(() => {
    async function loadCards() {
      const token = await getBearerToken()
      if (!token) {
        setState({ phase: "error", message: "You must be signed in to review cards." })
        return
      }

      try {
        const res = await fetch("/api/review", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? "Failed to load review cards")
        }
        const { cards: fetchedCards } = await res.json() as { cards: ReviewCard[]; total_due: number }

        if (!fetchedCards || fetchedCards.length === 0) {
          setState({ phase: "empty" })
          return
        }

        setCards(fetchedCards)
        setState({ phase: "front", card: fetchedCards[0], index: 0, total: fetchedCards.length })
      } catch (err) {
        setState({ phase: "error", message: err instanceof Error ? err.message : "Unknown error" })
      }
    }
    loadCards()
  }, [])

  // Reveal back of card
  const handleReveal = useCallback(() => {
    setState(prev => {
      if (prev.phase !== "front") return prev
      return { phase: "back", card: prev.card, index: prev.index, total: prev.total }
    })
  }, [])

  // Handle rating submission
  const handleRate = useCallback(async (ratingValue: number) => {
    if (isSubmitting) return
    setState(prev => {
      if (prev.phase !== "back" && prev.phase !== "rating") return prev
      return { ...prev, phase: "rating" }
    })

    setIsSubmitting(true)
    const token = await getBearerToken()
    const currentState = state

    if (currentState.phase !== "back" && currentState.phase !== "rating") {
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardId: currentState.card.id, rating: ratingValue }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to submit rating")
      }

      const nextCount = reviewedCount + 1
      setReviewedCount(nextCount)

      const nextIndex = currentState.index + 1
      if (nextIndex >= currentState.total) {
        setState({ phase: "done", reviewed: nextCount })
      } else {
        setState({
          phase: "front",
          card: cards[nextIndex],
          index: nextIndex,
          total: currentState.total,
        })
      }
    } catch (err) {
      setState({ phase: "error", message: err instanceof Error ? err.message : "Unknown error" })
    } finally {
      setIsSubmitting(false)
    }
  }, [state, isSubmitting, reviewedCount, cards])

  // Progress percentage
  const progress = (() => {
    if (state.phase === "front" || state.phase === "back" || state.phase === "rating") {
      return Math.round((state.index / state.total) * 100)
    }
    if (state.phase === "done") return 100
    return 0
  })()

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08060f",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 1rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top bar: back link + progress bar */}
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          paddingTop: "1.5rem",
          zIndex: 1,
        }}
      >
        <a
          href="/dashboard"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "0.875rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            marginBottom: "1.25rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#22d3ee")}
          onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
        >
          ← Back to Dashboard
        </a>

        {/* Progress bar */}
        {(state.phase === "front" || state.phase === "back" || state.phase === "rating" || state.phase === "done") && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#94a3b8", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Daily Maestro Challenge
              </span>
              {(state.phase === "front" || state.phase === "back" || state.phase === "rating") && (
                <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                  {state.index + 1} / {state.total}
                </span>
              )}
              {state.phase === "done" && (
                <span style={{ color: "#22d3ee", fontSize: "0.75rem" }}>Complete</span>
              )}
            </div>
            <div
              style={{
                width: "100%",
                height: "4px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #22d3ee, #e879f9)",
                  borderRadius: "999px",
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          marginTop: "2.5rem",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* LOADING */}
        {state.phase === "loading" && (
          <div style={{ color: "#94a3b8", fontSize: "1rem", marginTop: "6rem", textAlign: "center" }}>
            <div style={{ marginBottom: "1rem", fontSize: "2rem" }}>🎼</div>
            The Maestro is preparing your practice room…
          </div>
        )}

        {/* ERROR */}
        {state.phase === "error" && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              color: "#fca5a5",
              marginTop: "4rem",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
            <p style={{ margin: 0 }}>{state.message}</p>
            <a
              href="/dashboard"
              style={{
                display: "inline-block",
                marginTop: "1.5rem",
                color: "#22d3ee",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              ← Back to Dashboard
            </a>
          </div>
        )}

        {/* EMPTY STATE */}
        {state.phase === "empty" && (
          <div
            style={{
              textAlign: "center",
              marginTop: "6rem",
              padding: "3rem 2rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2rem",
                color: "#f8fafc",
                fontWeight: 600,
                margin: "0 0 0.75rem",
              }}
            >
              You&apos;re all caught up!
            </h2>
            <p style={{ color: "#94a3b8", margin: "0 0 2rem", fontSize: "1rem" }}>
              No cards due right now. Check back tomorrow for your next practice session.
            </p>
            <a
              href="/dashboard"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #22d3ee22, #e879f922)",
                border: "1px solid rgba(34,211,238,0.3)",
                borderRadius: "12px",
                color: "#22d3ee",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              ← Back to Dashboard
            </a>
          </div>
        )}

        {/* FLASHCARD — FRONT */}
        {state.phase === "front" && (
          <>
            <GamePill gameSlug={state.card.game_slug} gameWeek={state.card.game_week} />
            <div
              onClick={handleReveal}
              style={{
                width: "100%",
                minHeight: "320px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: "24px",
                backdropFilter: "blur(16px)",
                padding: "3rem 2.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(34,211,238,0.4)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(34,211,238,0.2)"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#94a3b8",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                Concept
              </div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  fontWeight: 700,
                  color: "#f8fafc",
                  margin: 0,
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                {state.card.concept_title}
              </h1>
              <div
                style={{
                  marginTop: "2.5rem",
                  color: "#64748b",
                  fontSize: "0.8rem",
                  letterSpacing: "0.06em",
                }}
              >
                Tap to reveal
              </div>
            </div>
          </>
        )}

        {/* FLASHCARD — BACK + RATING */}
        {(state.phase === "back" || state.phase === "rating") && (
          <>
            <GamePill gameSlug={state.card.game_slug} gameWeek={state.card.game_week} />

            {/* Card body */}
            <div
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(232,121,249,0.25)",
                borderRadius: "24px",
                backdropFilter: "blur(16px)",
                padding: "2.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#94a3b8",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Concept
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  fontWeight: 600,
                  color: "#e879f9",
                  margin: "0 0 1.5rem",
                  lineHeight: 1.2,
                }}
              >
                {state.card.concept_title}
              </h2>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                  marginBottom: "1.5rem",
                }}
              />
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#94a3b8",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Explanation
              </div>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {state.card.concept_body}
              </p>
            </div>

            {/* Rating prompt */}
            <div
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              How well did you know this?
            </div>

            {/* Rating buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.75rem",
                width: "100%",
              }}
            >
              {RATINGS.map(r => (
                <button
                  key={r.label}
                  onClick={() => handleRate(r.value)}
                  disabled={isSubmitting || state.phase === "rating"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.875rem 0.5rem",
                    background: r.bg,
                    border: `1px solid ${r.color}44`,
                    borderRadius: "14px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.5 : 1,
                    transition: "all 0.15s",
                    color: r.color,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                  onMouseEnter={e => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = `${r.color}28`
                      e.currentTarget.style.borderColor = `${r.color}88`
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = r.bg
                    e.currentTarget.style.borderColor = `${r.color}44`
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* DONE — Celebration screen */}
        {state.phase === "done" && (
          <div
            style={{
              textAlign: "center",
              marginTop: "4rem",
              padding: "3.5rem 2rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(34,211,238,0.2)",
              borderRadius: "24px",
              backdropFilter: "blur(16px)",
              width: "100%",
            }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>🏆</div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#f8fafc",
                margin: "0 0 0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Practice Complete
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1rem",
                margin: "0 0 2rem",
              }}
            >
              <span
                style={{
                  color: "#22d3ee",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              >
                {state.reviewed}
              </span>{" "}
              {state.reviewed === 1 ? "card" : "cards"} reviewed · The Maestro is impressed.
            </p>
            <a
              href="/dashboard"
              style={{
                display: "inline-block",
                padding: "0.875rem 2.5rem",
                background: "linear-gradient(135deg, #22d3ee, #e879f9)",
                borderRadius: "14px",
                color: "#08060f",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Back to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-component: Game context pill ─────────────────────────────────────────

function GamePill({ gameSlug, gameWeek }: { gameSlug: string; gameWeek: number }) {
  const label = gameSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.35rem 0.875rem",
        background: "rgba(232,121,249,0.1)",
        border: "1px solid rgba(232,121,249,0.25)",
        borderRadius: "999px",
        fontSize: "0.75rem",
        color: "#e879f9",
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      <span>Week {gameWeek}</span>
      <span style={{ color: "rgba(232,121,249,0.4)" }}>·</span>
      <span>{label}</span>
    </div>
  )
}
