"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene, Choice } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"

/* ─── helpers ────────────────────────────────────────────── */
function powerScale(p: number, total: number) {
  // 0.28 at power 0 → 1.0 at power = total
  return 0.28 + (p / total) * 0.72
}
function powerGrayscale(p: number, total: number) {
  return Math.max(0, 0.85 - (p / total) * 0.85)
}
function powerBrightness(p: number, total: number) {
  return 0.45 + (p / total) * 0.75
}

const POWER_LABELS = [
  "The Maestro struggles in the dark…",
  "A spark ignites.",
  "Power is building.",
  "The Maestro rises!",
  "Almost fully awakened!",
  "⚡ MAESTRO UNLEASHED ⚡",
] as const

function powerLabel(p: number, total: number): string {
  const idx = Math.round((p / total) * (POWER_LABELS.length - 1))
  return POWER_LABELS[Math.min(idx, POWER_LABELS.length - 1)]
}

function powerGlow(p: number, total: number): string {
  const t = p / total
  if (t <= 0)   return "0 0 20px rgba(80,60,120,0.15)"
  if (t <= 0.2) return "0 0 30px rgba(123,47,190,0.35)"
  if (t <= 0.4) return "0 0 45px rgba(123,47,190,0.55)"
  if (t <= 0.6) return "0 0 60px rgba(160,60,220,0.72)"
  if (t <= 0.8) return "0 0 80px rgba(200,64,251,0.88)"
  return "0 0 100px rgba(224,64,251,1.0), 0 0 40px rgba(255,180,255,0.55)"
}

/* ─── keyframes ──────────────────────────────────────────── */
const KF_ID = "boss-arena-kf"
function ensureKf() {
  if (typeof document === "undefined") return
  if (document.getElementById(KF_ID)) return
  const s = document.createElement("style")
  s.id = KF_ID
  s.textContent = `
    @keyframes ba-orb-pop {
      0%   { transform:scale(1); }
      45%  { transform:scale(1.55); }
      100% { transform:scale(1); }
    }
    @keyframes ba-done-in {
      from { opacity:0; transform:scale(0.93); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes ba-winner-pulse {
      0%,100% { filter:drop-shadow(0 0 40px rgba(224,64,251,0.8)); }
      50%     { filter:drop-shadow(0 0 80px rgba(224,64,251,1.0)); }
    }
    @keyframes ba-label-in {
      from { opacity:0; transform:translateY(5px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes ba-feedback-in {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `
  document.head.appendChild(s)
}

/* ─── Component ──────────────────────────────────────────── */
type Props = {
  scene:            Scene
  onComplete:       (xpEarned: number) => void
  maestroImage?:    string
  accentColor?:     string
  onPlayCorrect?:   () => void
  onPlayWrong?:     () => void
  onPlayFireworks?: () => void
}

export default function BossArena({
  scene, onComplete,
  maestroImage, accentColor = "#e040fb",
  onPlayCorrect, onPlayWrong, onPlayFireworks,
}: Props) {
  useEffect(() => { ensureKf() }, [])

  // Normalise: prefer bossQuestions array, fall back to single question
  const questions = scene.bossQuestions
    ?? (scene.question && scene.choices
        ? [{ question: scene.question, npcLine: scene.npcLine, choices: scene.choices }]
        : [])
  const total = questions.length

  const [round,         setRound]         = useState(0)
  const [power,         setPower]         = useState(0)
  const [score,         setScore]         = useState(0)
  const [answered,      setAnswered]      = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [isCorrect,     setIsCorrect]     = useState<boolean | null>(null)
  const [feedbackText,  setFeedbackText]  = useState("")
  const [phase,         setPhase]         = useState<"battle" | "done">("battle")
  const [shakeKey,      setShakeKey]      = useState(0)  // trigger shake animation
  const [attempt,       setAttempt]       = useState(1)  // re-challenge counter

  const currentQ = questions[round]

  /* ── Answer handler ──────────────────────────────────────── */
  const handleAnswer = useCallback((choice: Choice) => {
    if (answered) return
    setAnswered(true)
    setSelectedLabel(choice.label)
    const correct = choice.correct
    setIsCorrect(correct)
    setFeedbackText(!correct && choice.wrongFeedback ? choice.wrongFeedback : choice.feedback)
    if (correct) {
      onPlayCorrect?.()
      setPower(p => Math.min(total, p + 1))
      setScore(s => s + 1)
    } else {
      onPlayWrong?.()
      setPower(p => Math.max(0, p - 1))
      setShakeKey(k => k + 1)
    }
  }, [answered, total, onPlayCorrect, onPlayWrong])

  /* ── Next round / finish ─────────────────────────────────── */
  const handleNext = useCallback(() => {
    if (round + 1 >= total) {
      if (score >= Math.ceil(total / 2)) onPlayFireworks?.()
      setPhase("done")
      return
    }
    setRound(r => r + 1)
    setAnswered(false)
    setSelectedLabel(null)
    setIsCorrect(null)
    setFeedbackText("")
  }, [round, total, score, onPlayFireworks])

  const handleFinish = useCallback(() => {
    const xpPerCorrect = Math.ceil(scene.xpAward / Math.max(1, total))
    onComplete(score * xpPerCorrect)
  }, [score, scene.xpAward, total, onComplete])

  /* ── Re-challenge: reset battle state for another attempt ─── */
  const handleReset = useCallback(() => {
    setRound(0)
    setPower(0)
    setScore(0)
    setAnswered(false)
    setSelectedLabel(null)
    setIsCorrect(null)
    setFeedbackText("")
    setShakeKey(0)
    setAttempt(a => a + 1)
    setPhase("battle")
  }, [])

  const won = score >= Math.ceil(total / 2)
  const tScale = powerScale(power, total)
  const tGlow  = powerGlow(power, total)

  /* ══════════════════════════════════════════════════════════
     DONE SCREEN
  ══════════════════════════════════════════════════════════ */
  if (phase === "done") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 20,
        background: "radial-gradient(ellipse at 50% 25%, rgba(40,10,60,0.98) 0%, rgba(8,6,15,0.99) 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "2rem",
        animation: "ba-done-in 0.6s cubic-bezier(0.34,1.1,0.64,1) both",
      }}>

        {/* Result label */}
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem",
          letterSpacing: "0.38em", textTransform: "uppercase",
          color: won ? "rgba(224,64,251,0.85)" : "rgba(255,100,100,0.6)",
          marginBottom: "0.65rem",
        }}>
          {won ? "Conductor Awakened" : attempt > 1 ? `Attempt ${attempt} — Keep Fighting` : "Keep Practicing"}
        </div>

        {/* Maestro — locked to final power */}
        <div style={{
          width: "220px", height: "260px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "1.5rem",
          filter: `drop-shadow(${tGlow})`,
          animation: won ? "ba-winner-pulse 2.5s ease-in-out infinite" : "none",
        }}>
          {maestroImage ? (
            <img src={maestroImage} alt="Maestro" draggable={false}
              style={{
                width: "100%", height: "100%", objectFit: "contain",
                filter: `grayscale(${powerGrayscale(power, total)}) brightness(${powerBrightness(power, total)})`,
                transition: "filter 0.6s ease",
              }}
            />
          ) : (
            <div style={{
              fontSize: "8rem", lineHeight: 1, userSelect: "none",
              filter: `grayscale(${powerGrayscale(power, total)}) brightness(${powerBrightness(power, total)})`,
            }}>🎼</div>
          )}
        </div>

        {/* Power orbs — final state */}
        <div style={{ display: "flex", gap: "0.55rem", marginBottom: "1.25rem" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: "18px", height: "18px", borderRadius: "50%",
              background: i < power
                ? "linear-gradient(135deg,#e040fb,#7b2fbe)"
                : "rgba(255,255,255,0.08)",
              border: `1.5px solid ${i < power ? "rgba(224,64,251,0.6)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: i < power ? "0 0 12px rgba(224,64,251,0.8)" : "none",
            }} />
          ))}
        </div>

        {/* Score text */}
        <div style={{
          fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
          fontSize: "1.45rem", color: "#fff", marginBottom: "0.5rem", textAlign: "center",
        }}>
          {score} of {total} answered correctly
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.85rem",
          color: "rgba(240,238,255,0.45)", marginBottom: "2rem",
          textAlign: "center", maxWidth: "360px", lineHeight: 1.65,
        }}>
          {won
            ? "The Maestro is fully awakened. Your expertise becomes the orchestra's language."
            : attempt === 1
            ? "The Maestro needs more practice. But every great conductor started from zero."
            : "Every maestro has faced this moment. The question is — do you rise?"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", width: "100%", maxWidth: "320px" }}>
          <button
            onClick={handleFinish}
            style={{
              width: "100%",
              fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem",
              color: "#08060f",
              background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
              padding: "1rem 3rem", borderRadius: "100px", border: "none", cursor: "pointer",
              boxShadow: `0 0 40px ${accentColor}44`,
              letterSpacing: "0.01em",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 0 60px ${accentColor}66` }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 0 40px ${accentColor}44` }}
          >
            Continue the Journey →
          </button>

          {/* Re-challenge button — only when player lost */}
          {!won && (
            <button
              onClick={handleReset}
              style={{
                width: "100%",
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem",
                color: "rgba(240,238,255,0.65)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "0.85rem 2rem", borderRadius: "100px", cursor: "pointer",
                letterSpacing: "0.01em",
                transition: "color 0.2s, border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#fff"
                e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(240,238,255,0.65)"
                e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"
              }}
            >
              ↩ Challenge Again — A different path
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════
     BATTLE SCREEN
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 20,
      background: `radial-gradient(ellipse at 50% 20%,
        rgba(${power > (total * 0.6) ? "60,15,80" : "30,10,50"},${0.45 + (power/total)*0.12}) 0%,
        rgba(8,6,15,0.97) 65%)`,
      overflowY: "auto",
      paddingTop: "4rem", // clear fixed top bar
    }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "1rem 1.5rem 7rem" }}>

        {/* ── Header row ── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "0.85rem",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(224,64,251,0.1)", border: "1px solid rgba(224,64,251,0.25)",
            borderRadius: "100px", padding: "0.28rem 0.85rem 0.28rem 0.55rem",
          }}>
            <span style={{ fontSize: "1rem" }}>🎼</span>
            <span style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.68rem",
              letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--pink)",
            }}>Conductor Battle</span>
          </div>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.75rem",
            color: "rgba(240,238,255,0.4)",
          }}>
            Round {round + 1} of {total}
          </span>
        </div>

        {/* ── Power orbs ── */}
        <div style={{
          display: "flex", gap: "0.5rem",
          justifyContent: "center", marginBottom: "0.4rem",
        }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: "16px", height: "16px", borderRadius: "50%",
              background: i < power
                ? "linear-gradient(135deg,#e040fb,#7b2fbe)"
                : "rgba(255,255,255,0.07)",
              border: `1.5px solid ${i < power ? "rgba(224,64,251,0.55)" : "rgba(255,255,255,0.1)"}`,
              boxShadow: i < power ? "0 0 10px rgba(224,64,251,0.75)" : "none",
              transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
              animation: i === power - 1 ? "ba-orb-pop 0.55s cubic-bezier(0.34,1.56,0.64,1)" : "none",
            }} />
          ))}
        </div>

        {/* ── Power label ── */}
        <div key={power} style={{
          textAlign: "center", marginBottom: "0.65rem",
          fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
          fontSize: "0.92rem", color: "rgba(224,64,251,0.7)",
          animation: "ba-label-in 0.35s ease both",
        }}>
          {powerLabel(power, total)}
        </div>

        {/* ── Maestro visual ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          {/* Outer scale spring */}
          <motion.div
            animate={{ scale: tScale }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            style={{ width: "200px", height: "230px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* Inner shake */}
            <motion.div
              key={`shake-${shakeKey}`}
              animate={shakeKey > 0 ? { x: [-12, 12, -9, 9, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.48, ease: "easeOut" }}
              style={{
                width: "100%", height: "100%",
                filter: `drop-shadow(${tGlow})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "filter 0.55s ease",
              }}
            >
              {maestroImage ? (
                <img src={maestroImage} alt="Maestro" draggable={false}
                  style={{
                    width: "100%", height: "100%", objectFit: "contain",
                    filter: `grayscale(${powerGrayscale(power,total)}) brightness(${powerBrightness(power,total)})`,
                    transition: "filter 0.6s ease",
                  }}
                />
              ) : (
                <div style={{
                  fontSize: "6rem", lineHeight: 1, userSelect: "none",
                  filter: `grayscale(${powerGrayscale(power,total)}) brightness(${powerBrightness(power,total)})`,
                  transition: "filter 0.6s ease",
                }}>
                  🎼
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Question + Choices (animated per round) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          >
            {/* NPC line */}
            {currentQ?.npcLine && (
              <div style={{
                background: "rgba(224,64,251,0.05)",
                border: "1px solid rgba(224,64,251,0.18)",
                borderLeft: "3px solid var(--pink)",
                borderRadius: "0 10px 10px 0",
                padding: "0.6rem 1rem",
                marginBottom: "0.75rem",
              }}>
                <p style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: "1.05rem", color: "var(--pink)", margin: 0, lineHeight: 1.5,
                }}>
                  &ldquo;{currentQ.npcLine}&rdquo;
                </p>
              </div>
            )}

            {/* Question label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.32rem",
            }}>
              <span style={{ fontSize: "0.9rem" }}>🎼</span>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem",
                letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--pink)",
              }}>Final Challenge</span>
            </div>

            <h2 style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700,
              fontSize: "clamp(0.9rem,2.3vw,1.05rem)",
              color: "#fff", lineHeight: 1.42, marginBottom: "0.75rem",
            }}>
              {currentQ?.question}
            </h2>

            {/* Choices */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {currentQ?.choices.map((choice, i) => (
                <motion.div
                  key={choice.label}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30, delay: 0.07 + i * 0.06 }}
                >
                  <ChoiceButton
                    choice={choice}
                    index={i}
                    answered={answered}
                    selectedLabel={selectedLabel}
                    onSelect={handleAnswer}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Feedback bottom panel ── */}
      {answered && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: isCorrect
              ? "linear-gradient(180deg,rgba(8,28,8,0.98) 0%,rgba(6,20,6,0.99) 100%)"
              : "linear-gradient(180deg,rgba(30,8,8,0.98) 0%,rgba(22,6,6,0.99) 100%)",
            borderTop: `3px solid ${isCorrect ? "#58cc02" : "#ff4b4b"}`,
            backdropFilter: "blur(24px)",
            padding: "0.9rem 1.5rem 1.1rem",
            zIndex: 100,
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            {/* Result row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: feedbackText ? "0.5rem" : "0.85rem" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                background: isCorrect
                  ? "linear-gradient(135deg,#58cc02,#33a500)"
                  : "linear-gradient(135deg,#ff4b4b,#c62828)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: "#fff", fontWeight: 900,
              }}>
                {isCorrect ? "✓" : "✗"}
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem",
                color: isCorrect ? "#58cc02" : "#ff4b4b",
              }}>
                {isCorrect
                  ? (power >= total ? "The Maestro is fully awakened!" : "Correct — The Maestro grows stronger!")
                  : (power <= 0  ? "Wrong — The Maestro struggles..." : "Wrong — The Maestro weakens...")}
              </span>
            </div>

            {feedbackText && (
              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.875rem",
                color: "rgba(240,238,255,0.75)", lineHeight: 1.65, margin: "0 0 0.85rem",
              }}>
                {feedbackText}
              </p>
            )}

            <button
              onClick={handleNext}
              style={{
                width: "100%",
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem",
                color: "#fff",
                background: isCorrect
                  ? "linear-gradient(90deg,#58cc02,#33a500)"
                  : "linear-gradient(90deg,#ff4b4b,#c62828)",
                padding: "0.7rem", borderRadius: "12px", border: "none", cursor: "pointer",
                letterSpacing: "0.04em", textTransform: "uppercase",
                transition: "filter 0.15s ease, transform 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.filter="brightness(1.12)"; e.currentTarget.style.transform="translateY(-1px)" }}
              onMouseLeave={e => { e.currentTarget.style.filter=""; e.currentTarget.style.transform="" }}
            >
              {round + 1 < total ? `Round ${round + 2} →` : "See the result →"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
