"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getSession } from "@/lib/supabase-browser"
import { useSoundEngine } from "./SoundEngine"

// ── Types ──────────────────────────────────────────────────────────────────────

type DueCard = {
  id: string
  game_slug: string
  game_week: number
  concept_title: string
  concept_body: string
  due: string
  reps: number
  state: number
}

// Rating labels shown to the player (maps to FSRS ratings 1-4)
type PlayerRating = 1 | 2 | 3 | 4

const RATING_LABELS: Record<PlayerRating, { label: string; emoji: string; color: string; fsrsRating: number }> = {
  1: { label: "Forgot",  emoji: "✗",  color: "#ff4757", fsrsRating: 1 }, // Again
  2: { label: "Hard",    emoji: "≈",  color: "#ff9800", fsrsRating: 2 }, // Hard
  3: { label: "Got It",  emoji: "✓",  color: "#00d4f0", fsrsRating: 3 }, // Good
  4: { label: "Easy",    emoji: "★",  color: "#00e676", fsrsRating: 4 }, // Easy
}

// XP reward config
const BASE_XP = 100
const MAX_CARDS = 8

// ── Keyframes injection ────────────────────────────────────────────────────────

function ensureKf() {
  if (typeof document === "undefined") return
  const id = "daily-challenge-kf"
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = `
    @keyframes dc-fade-in {
      from { opacity:0; transform:translateY(24px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes dc-card-enter {
      0%   { opacity:0; transform:translateX(48px) scale(0.95); }
      100% { opacity:1; transform:translateX(0) scale(1); }
    }
    @keyframes dc-card-exit {
      0%   { opacity:1; transform:translateX(0) scale(1); }
      100% { opacity:0; transform:translateX(-64px) scale(0.93); }
    }
    @keyframes dc-reveal {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes dc-xp-pop {
      0%   { transform:scale(0.5); opacity:0; }
      60%  { transform:scale(1.18); opacity:1; }
      100% { transform:scale(1); opacity:1; }
    }
    @keyframes dc-progress-glow {
      0%,100% { box-shadow:0 0 4px rgba(0,212,240,0.35); }
      50%      { box-shadow:0 0 12px rgba(0,212,240,0.75); }
    }
    @keyframes dc-header-shimmer {
      0%   { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
    @keyframes dc-pulse {
      0%,100% { opacity:0.7; }
      50%     { opacity:1; }
    }
    @keyframes dc-btn-hover {
      from { transform:scale(1); }
      to   { transform:scale(1.04); }
    }
  `
  document.head.appendChild(s)
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: "0.78rem", color: "rgba(255,255,255,0.5)",
        marginBottom: "0.4rem",
      }}>
        <span>Progress</span>
        <span>{current} / {total}</span>
      </div>
      <div style={{
        height: "6px", borderRadius: "99px",
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: "99px",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #00d4f0, #e040fb)",
          transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          animation: "dc-progress-glow 2s ease infinite",
        }} />
      </div>
    </div>
  )
}

function RatingButton({
  rating,
  onClick,
  disabled,
}: {
  rating: PlayerRating
  onClick: () => void
  disabled: boolean
}) {
  const cfg = RATING_LABELS[rating]
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: "0.75rem 0.5rem",
        border: `1.5px solid ${disabled ? "rgba(255,255,255,0.07)" : cfg.color + "55"}`,
        borderRadius: "10px",
        background: disabled
          ? "rgba(255,255,255,0.03)"
          : hovered
          ? `${cfg.color}22`
          : "rgba(255,255,255,0.04)",
        color: disabled ? "rgba(255,255,255,0.2)" : cfg.color,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        transition: "background 0.15s, border-color 0.15s, transform 0.12s",
        transform: hovered && !disabled ? "scale(1.04)" : "scale(1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.2rem",
      }}
    >
      <span style={{ fontSize: "1.1rem" }}>{cfg.emoji}</span>
      <span>{cfg.label}</span>
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

type Phase = "loading" | "empty" | "session" | "complete" | "error"

export default function DailyChallenge({
  onComplete,
  streak = 0,
}: {
  onComplete?: (xpEarned: number) => void
  streak?: number
}) {
  const sound = useSoundEngine()
  const [phase, setPhase] = useState<Phase>("loading")
  const [cards, setCards] = useState<DueCard[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [cardAnimClass, setCardAnimClass] = useState<"enter" | "exit" | "idle">("enter")
  const [error, setError] = useState<string | null>(null)
  const tokenRef = useRef<string | null>(null)

  // Inject keyframes on mount
  useEffect(() => { ensureKf() }, [])

  // Start ambient cinematic music
  useEffect(() => {
    sound.startAmbient("cinematic")
    return () => { sound.stopAmbient() }
  }, [sound])

  // Fetch due cards on mount
  useEffect(() => {
    async function load() {
      try {
        const session = await getSession()
        if (!session) {
          setPhase("empty")
          return
        }
        tokenRef.current = session.access_token

        const res = await fetch("/api/review", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json() as { cards: DueCard[]; total_due: number }

        const limited = (data.cards ?? []).slice(0, MAX_CARDS)
        if (limited.length === 0) {
          setPhase("empty")
        } else {
          setCards(limited)
          setPhase("session")
          setCardAnimClass("enter")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load review cards")
        setPhase("error")
      }
    }
    load()
  }, [])

  const currentCard = cards[cardIndex] ?? null

  const handleReveal = useCallback(() => {
    setRevealed(true)
    sound.playTransition()
  }, [sound])

  const handleRate = useCallback(async (rating: PlayerRating) => {
    if (!currentCard || submitting || !tokenRef.current) return
    setSubmitting(true)

    // Animate card out
    setCardAnimClass("exit")

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenRef.current}`,
        },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating: RATING_LABELS[rating].fsrsRating,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      // Sound feedback
      if (rating >= 3) {
        sound.playCorrect()
      } else {
        sound.playWrong()
      }

      // Accumulate XP: pass ratings earn XP proportional to rating
      if (rating >= 3) {
        const cardXp = rating === 4 ? 15 : 10
        setXpEarned(prev => prev + cardXp)
      }

      // Advance to next card after animation
      setTimeout(() => {
        const next = cardIndex + 1
        if (next >= cards.length) {
          // Session complete — calculate final XP with streak multiplier
          const streakMultiplier = 1 + Math.min(streak * 0.1, 1.0) // up to 2x at 10-day streak
          const finalXp = Math.round((BASE_XP + xpEarned + (rating >= 3 ? (rating === 4 ? 15 : 10) : 0)) * streakMultiplier)
          setXpEarned(finalXp)
          setPhase("complete")
          sound.playFireworks()
          onComplete?.(finalXp)
        } else {
          setCardIndex(next)
          setRevealed(false)
          setCardAnimClass("enter")
        }
        setSubmitting(false)
      }, 320)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rating")
      setPhase("error")
      setSubmitting(false)
    }
  }, [currentCard, submitting, cardIndex, cards.length, streak, xpEarned, sound, onComplete])

  // ── Render: loading ──────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div style={containerStyle}>
        <CinematicHeader />
        <div style={{ textAlign: "center", padding: "3rem 0", color: "rgba(255,255,255,0.4)", animation: "dc-pulse 1.5s ease infinite" }}>
          The Maestro is reviewing your records...
        </div>
      </div>
    )
  }

  // ── Render: empty ────────────────────────────────────────────────────────────
  if (phase === "empty") {
    return (
      <div style={containerStyle}>
        <CinematicHeader />
        <div style={{
          textAlign: "center", padding: "2.5rem 1rem",
          animation: "dc-fade-in 0.5s ease both",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎼</div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "360px", margin: "0 auto" }}>
            No reviews due today. The orchestra rests. Come back tomorrow — the Maestro will have new challenges waiting.
          </p>
          <div style={{
            marginTop: "1.5rem",
            fontSize: "0.78rem", color: "rgba(255,255,255,0.3)",
            fontStyle: "italic",
          }}>
            Complete more games to earn review cards.
          </div>
        </div>
      </div>
    )
  }

  // ── Render: error ────────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div style={containerStyle}>
        <CinematicHeader />
        <div style={{ textAlign: "center", padding: "2rem", color: "#ff4757" }}>
          <p style={{ marginBottom: "0.5rem" }}>Something went wrong.</p>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{error}</p>
        </div>
      </div>
    )
  }

  // ── Render: complete ─────────────────────────────────────────────────────────
  if (phase === "complete") {
    const multiplier = 1 + Math.min(streak * 0.1, 1.0)
    const hasStreak = streak > 0

    return (
      <div style={containerStyle}>
        <CinematicHeader />
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "2rem 1rem", textAlign: "center",
          animation: "dc-fade-in 0.6s ease both",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem", animation: "dc-xp-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            🏆
          </div>
          <h2 style={{
            fontSize: "1.3rem", fontWeight: 800,
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#fff", marginBottom: "0.35rem",
          }}>
            Session Complete
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "1.8rem" }}>
            {cards.length} concept{cards.length !== 1 ? "s" : ""} reviewed
          </p>

          {/* XP earned */}
          <div style={{
            padding: "1.2rem 2.5rem",
            borderRadius: "16px",
            border: "1.5px solid rgba(0,212,240,0.3)",
            background: "rgba(0,212,240,0.05)",
            marginBottom: "1.2rem",
            animation: "dc-xp-pop 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
          }}>
            <div style={{
              fontSize: "2.8rem", fontWeight: 900,
              background: "linear-gradient(90deg, #00d4f0, #e040fb 60%, #ffb700)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}>
              +{xpEarned} XP
            </div>
            {hasStreak && (
              <div style={{ fontSize: "0.75rem", color: "#ff9800", marginTop: "0.3rem" }}>
                🔥 {streak}-day streak · {multiplier.toFixed(1)}× multiplier
              </div>
            )}
          </div>

          <p style={{
            color: "rgba(255,255,255,0.35)", fontSize: "0.78rem",
            fontStyle: "italic", lineHeight: 1.6, maxWidth: "320px",
          }}>
            "The musician who practices daily does not merely maintain — they compound."
          </p>
        </div>
      </div>
    )
  }

  // ── Render: session ──────────────────────────────────────────────────────────
  if (!currentCard) return null

  return (
    <div style={containerStyle}>
      <CinematicHeader />

      <ProgressBar current={cardIndex} total={cards.length} />

      {/* Card */}
      <div
        key={currentCard.id}
        style={{
          borderRadius: "16px",
          border: "1.5px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
          padding: "1.5rem",
          marginBottom: "1.25rem",
          animation: cardAnimClass === "enter"
            ? "dc-card-enter 0.38s cubic-bezier(0.34,1.2,0.64,1) both"
            : cardAnimClass === "exit"
            ? "dc-card-exit 0.28s ease both"
            : "none",
        }}
      >
        {/* Game badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.2rem 0.7rem", borderRadius: "99px",
          background: "rgba(0,212,240,0.1)", border: "1px solid rgba(0,212,240,0.2)",
          fontSize: "0.7rem", color: "#00d4f0", letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: "1rem",
        }}>
          <span>🎵</span>
          <span>{currentCard.concept_title}</span>
        </div>

        {/* Question — concept body is the "question" */}
        <p style={{
          fontSize: "1.05rem", lineHeight: 1.7,
          color: "rgba(255,255,255,0.9)",
          fontWeight: 500,
          marginBottom: revealed ? "1.25rem" : 0,
        }}>
          {currentCard.concept_body}
        </p>

        {/* Answer reveal */}
        {revealed && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1rem",
            animation: "dc-reveal 0.35s ease both",
          }}>
            <div style={{
              fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)", marginBottom: "0.5rem",
            }}>
              Key insight
            </div>
            <p style={{
              fontSize: "0.92rem", lineHeight: 1.65,
              color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
            }}>
              {currentCard.concept_title}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {!revealed ? (
        <button
          onClick={handleReveal}
          style={{
            width: "100%",
            padding: "0.9rem",
            borderRadius: "12px",
            border: "1.5px solid rgba(0,212,240,0.35)",
            background: "rgba(0,212,240,0.08)",
            color: "#00d4f0",
            fontSize: "0.92rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.15s, transform 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,240,0.15)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,212,240,0.08)")}
        >
          Reveal Answer
        </button>
      ) : (
        <div>
          <div style={{
            fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: "0.75rem",
          }}>
            How well did you remember this?
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {([1, 2, 3, 4] as PlayerRating[]).map(r => (
              <RatingButton
                key={r}
                rating={r}
                onClick={() => handleRate(r)}
                disabled={submitting}
              />
            ))}
          </div>
        </div>
      )}

      {/* Card counter */}
      <div style={{
        textAlign: "center", marginTop: "1.2rem",
        fontSize: "0.72rem", color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.06em",
      }}>
        Card {cardIndex + 1} of {cards.length}
        {currentCard.reps > 0 && (
          <span style={{ marginLeft: "0.8rem", color: "rgba(0,212,240,0.4)" }}>
            · reviewed {currentCard.reps}× before
          </span>
        )}
      </div>
    </div>
  )
}

// ── Cinematic Header ───────────────────────────────────────────────────────────

function CinematicHeader() {
  return (
    <div style={{
      textAlign: "center",
      paddingBottom: "1.75rem",
      marginBottom: "0.25rem",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      animation: "dc-fade-in 0.55s ease both",
    }}>
      {/* Conductor baton icon */}
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, rgba(0,212,240,0.35), rgba(224,64,251,0.18))",
        border: "1.5px solid rgba(0,212,240,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem",
        margin: "0 auto 0.9rem",
        boxShadow: "0 0 20px rgba(0,212,240,0.18)",
      }}>
        🎼
      </div>

      <div style={{
        fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.22em",
        color: "rgba(255,255,255,0.3)", marginBottom: "0.45rem",
      }}>
        Daily Maestro Challenge
      </div>

      <h1 style={{
        fontSize: "1.35rem", fontWeight: 900,
        letterSpacing: "0.04em",
        background: "linear-gradient(90deg, #fff 0%, #00d4f0 40%, #e040fb 70%, #ffb700 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "dc-header-shimmer 4s linear infinite",
        margin: 0,
      }}>
        The Maestro Summons You
      </h1>

      <p style={{
        fontSize: "0.8rem", color: "rgba(255,255,255,0.35)",
        marginTop: "0.5rem", fontStyle: "italic", lineHeight: 1.5,
      }}>
        Concepts you&apos;ve learned are fading. The orchestra waits.
      </p>
    </div>
  )
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "1.75rem 1.5rem",
  background: "linear-gradient(160deg, rgba(10,10,18,0.98) 0%, rgba(20,12,30,0.98) 100%)",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,240,0.04)",
  fontFamily: "'Inter', system-ui, sans-serif",
  color: "#fff",
}
