"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene, Choice } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"
import { useSoundEngine } from "./SoundEngine"

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
    @keyframes ba-slider-oscillate {
      0%, 100% { left: 0%; }
      50%      { left: 100%; }
    }
    @keyframes ba-choices-reveal {
      0%   { opacity: 0; transform: translateX(-28px) scale(0.96); }
      55%  { opacity: 1; transform: translateX(4px)  scale(1.01); }
      78%  { transform: translateX(-2px) scale(0.995); }
      100% { opacity: 1; transform: translateX(0)    scale(1); }
    }
  `
  document.head.appendChild(s)
}

/* ─── Component ──────────────────────────────────────────── */
type Props = {
  scene:            Scene
  onComplete:       (xpEarned: number) => void
  maestroImage?:    string
  characterImage?:  string
  characterName?:   string
  accentColor?:     string
  onPlayCorrect?:   () => void
  onPlayWrong?:     () => void
  onPlayFireworks?: () => void
}

export default function BossArena({
  scene, onComplete,
  maestroImage, characterImage, characterName, accentColor = "#e040fb",
  onPlayCorrect, onPlayWrong, onPlayFireworks,
}: Props) {
  useEffect(() => { ensureKf() }, [])
  const sound = useSoundEngine()

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

  const indicatorRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Rhythm Mini-game States
  const [tempoActive,    setTempoActive]    = useState(true)
  const [sliderPos,      setSliderPos]      = useState(0)
  const [tempoRating,    setTempoRating]    = useState<"perfect" | "good" | "off" | null>(null)
  const [choicesVisible, setChoicesVisible] = useState(false)

  // Auto-reveal choices after 1.4s — Strike button opens them early
  const choicesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    setChoicesVisible(false)
    if (choicesTimerRef.current) clearTimeout(choicesTimerRef.current)
    choicesTimerRef.current = setTimeout(() => setChoicesVisible(true), 1400)
    return () => { if (choicesTimerRef.current) clearTimeout(choicesTimerRef.current) }
  }, [round])

  const currentQ = questions[round]
  const selectedChoice = currentQ?.choices?.find(c => c.label === selectedLabel)

  // Real-time mastery adjustment based on cumulative boss questions answered so far
  const netCorrect = score - (round - score) // correct minus incorrect
  const perfectHalfWidth = Math.max(2.5, Math.min(22, 7 + netCorrect * 4.5))
  const goodHalfWidth    = Math.max(10, Math.min(42, 25 + netCorrect * 5.5))

  /* ── Strike tempo beat action ────────────────────────────── */
  const strikeTempo = useCallback(() => {
    if (!tempoActive) return
    
    // Read the current position of the indicator from DOM to get sub-pixel accuracy
    let currentPct = 50
    if (indicatorRef.current && trackRef.current) {
      const indRect = indicatorRef.current.getBoundingClientRect()
      const trackRect = trackRef.current.getBoundingClientRect()
      const indCenter = indRect.left + indRect.width / 2
      const trackLeft = trackRect.left
      const trackWidth = trackRect.width
      if (trackWidth > 0) {
        currentPct = Math.max(0, Math.min(100, ((indCenter - trackLeft) / trackWidth) * 100))
      }
    }
    
    const pos = Math.round(currentPct)
    setSliderPos(pos)
    setTempoActive(false)
    setChoicesVisible(true) // striking opens choices immediately
    if (choicesTimerRef.current) clearTimeout(choicesTimerRef.current)
    
    // Harmony zone checks
    const diff = Math.abs(pos - 50)
    if (diff <= perfectHalfWidth) {
      setTempoRating("perfect")
      sound.playStreak()
    } else if (diff <= goodHalfWidth) {
      setTempoRating("good")
      sound.playClick()
    } else {
      setTempoRating("off")
      sound.playWrong()
    }
  }, [tempoActive, sound, perfectHalfWidth, goodHalfWidth])

  /* ── Answer handler ──────────────────────────────────────── */
  const handleAnswer = useCallback((choice: Choice) => {
    if (answered) return
    setAnswered(true)
    setSelectedLabel(choice.label)
    const correct = choice.correct ?? false
    setIsCorrect(correct)
    setFeedbackText(!correct && choice.wrongFeedback ? choice.wrongFeedback : (choice.feedback ?? ""))
    
    if (correct) {
      onPlayCorrect?.()
      // Perfect tempo yields double power gain (+2), others yield standard (+1)
      const powerGain = tempoRating === "perfect" ? 2 : 1
      setPower(p => Math.min(total, p + powerGain))
      setScore(s => s + 1)
    } else {
      onPlayWrong?.()
      // Perfect tempo shields from power/health drop
      if (tempoRating === "perfect") {
        setFeedbackText(prev => `[Focus Shield Active] Perfect tempo shielded you from losing power! ` + prev)
      } else {
        setPower(p => Math.max(0, p - 1))
      }
      setShakeKey(k => k + 1)
    }
  }, [answered, total, onPlayCorrect, onPlayWrong, tempoRating])

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
    
    // Reset rhythm states for next round
    setTempoActive(true)
    setTempoRating(null)
    setSliderPos(0)
    setChoicesVisible(false)
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
    
    // Reset rhythm states
    setTempoActive(true)
    setTempoRating(null)
    setSliderPos(0)
    setChoicesVisible(false)
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
        alignItems: "center", justifyContent: "flex-start",
        padding: "1.5rem 1.5rem",
        overflowY: "auto",
        animation: "ba-done-in 0.6s cubic-bezier(0.34,1.1,0.64,1) both",
      }}>
        {/* Top spacer to assist vertical centering on tall viewports */}
        <div style={{ flexGrow: 1, minHeight: "0.5rem" }} />

        {/* Result label */}
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem",
          letterSpacing: "0.38em", textTransform: "uppercase",
          color: won ? "rgba(224,64,251,0.85)" : "rgba(255,100,100,0.6)",
          marginBottom: "0.4rem",
        }}>
          {won ? "Conductor Awakened" : attempt > 1 ? `Attempt ${attempt} — Keep Fighting` : "Keep Practicing"}
        </div>

        {/* Maestro — locked to final power */}
        <div style={{
          width: "clamp(100px, 16vh, 150px)", height: "clamp(115px, 18.5vh, 175px)", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "0.6rem",
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
              fontSize: "4.5rem", lineHeight: 1, userSelect: "none",
              filter: `grayscale(${powerGrayscale(power, total)}) brightness(${powerBrightness(power, total)})`,
            }}>🎼</div>
          )}
        </div>

        {/* Power orbs — final state */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.6rem" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: "16px", height: "16px", borderRadius: "50%",
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
          fontSize: "1.2rem", color: "#fff", marginBottom: "0.3rem", textAlign: "center",
        }}>
          {score} of {total} answered correctly
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.82rem",
          color: "rgba(240,238,255,0.45)", marginBottom: "1rem",
          textAlign: "center", maxWidth: "360px", lineHeight: 1.55,
        }}>
          {won
            ? "The Maestro is fully awakened. Your expertise becomes the orchestra's language."
            : attempt === 1
            ? "The Maestro needs more practice. But every great conductor started from zero."
            : "Every maestro has faced this moment. The question is — do you rise?"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: "center", width: "100%", maxWidth: "320px" }}>
          <button
            onClick={handleFinish}
            style={{
              width: "100%",
              fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem",
              color: "#08060f",
              background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
              padding: "0.65rem 2rem", borderRadius: "100px", border: "none", cursor: "pointer",
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
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem",
                color: "rgba(240,238,255,0.65)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "0.58rem 1.8rem", borderRadius: "100px", cursor: "pointer",
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

        {/* Bottom spacer to assist vertical centering on tall viewports */}
        <div style={{ flexGrow: 1.5, minHeight: "1rem" }} />
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
      paddingTop: "3.2rem", // clear fixed top bar
    }}>

      {/* ── Jake's stage — the protagonist watches their own awakening ── */}
      {characterImage && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed", right: "1%", top: "3rem", bottom: 0,
            width: "clamp(300px, 36vw, 540px)", zIndex: 2, pointerEvents: "none",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
        >
          {/* floor glow tinted by answer state */}
          <div style={{
            position: "absolute", inset: 0,
            background: answered
              ? (isCorrect
                  ? "radial-gradient(ellipse at 50% 80%, rgba(88,204,2,0.16) 0%, transparent 65%)"
                  : "radial-gradient(ellipse at 50% 80%, rgba(255,75,75,0.13) 0%, transparent 65%)")
              : "radial-gradient(ellipse at 50% 80%, rgba(224,64,251,0.16) 0%, transparent 65%)",
            transition: "background 0.5s ease",
          }} />
          <img
            key={`boss-char-${round}-${answered}`}
            src={characterImage}
            alt=""
            draggable={false}
            style={{
              width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center",
              maskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to top, black 0%, black 94%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to top, black 0%, black 94%, transparent 100%)",
              maskComposite: "intersect", WebkitMaskComposite: "source-in",
              opacity: answered ? 1 : 0.72,
              filter: answered
                ? (isCorrect
                    ? "drop-shadow(0 0 26px rgba(88,204,2,0.65)) brightness(1.1) saturate(1.2)"
                    : "drop-shadow(0 0 20px rgba(255,75,75,0.5)) brightness(0.85) saturate(0.7)")
                : "drop-shadow(0 0 18px rgba(224,64,251,0.5)) brightness(1.0)",
              animation: answered
                ? (isCorrect
                    ? "char-react-correct 0.7s cubic-bezier(0.34,1.56,0.64,1) both"
                    : "char-react-wrong 0.55s ease-in-out both")
                : "char-breathe 4s ease-in-out infinite",
              transformOrigin: "bottom center",
              transition: "opacity 0.4s ease, filter 0.4s ease",
            }}
          />
          {characterName && (
            <div style={{
              position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
              background: "rgba(8,6,15,0.88)",
              border: answered
                ? `1px solid ${isCorrect ? "rgba(88,204,2,0.5)" : "rgba(255,75,75,0.5)"}`
                : "1px solid rgba(224,64,251,0.5)",
              borderRadius: "100px", padding: "0.25rem 0.85rem",
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: answered ? (isCorrect ? "#7dff6b" : "#ff8080") : "var(--pink)",
              whiteSpace: "nowrap", boxShadow: "0 0 16px rgba(0,0,0,0.4)",
            }}>
              {characterName}{answered ? (isCorrect ? " ✓" : " …") : ""}
            </div>
          )}
        </div>
      )}

      <div style={characterImage
        ? {
            maxWidth: "none",
            marginLeft: "max(1.5rem, 5vw)",
            marginRight: "clamp(260px, 30vw, 460px)",
            padding: "0.5rem 1.5rem 4rem",
          }
        : {
            maxWidth: "680px",
            margin: "0 auto",
            padding: "0.5rem 1.5rem 4rem",
          }
      }>

        {/* ── Header row ── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "0.35rem",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(224,64,251,0.1)", border: "1px solid rgba(224,64,251,0.25)",
            borderRadius: "100px", padding: "0.2rem 0.7rem 0.2rem 0.45rem",
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
          justifyContent: "center", marginBottom: "0.25rem",
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
          textAlign: "center", marginBottom: "0.3rem",
          fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
          fontSize: "0.88rem", color: "rgba(224,64,251,0.7)",
          animation: "ba-label-in 0.35s ease both",
        }}>
          {powerLabel(power, total)}
        </div>

        {/* ── Maestro visual ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.4rem" }}>
          {/* Outer scale spring */}
          <motion.div
            animate={{ scale: tScale }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            style={{ width: "clamp(75px, 11vh, 105px)", height: "clamp(85px, 12.5vh, 120px)", display: "flex", alignItems: "center", justifyContent: "center" }}
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
                  className="boss-char-arrive"
                  style={{
                    width: "100%", height: "100%", objectFit: "contain",
                    filter: `grayscale(${powerGrayscale(power,total)}) brightness(${powerBrightness(power,total)})`,
                    transition: "filter 0.6s ease",
                  }}
                />
              ) : (
                <div
                  className="boss-char-arrive"
                  style={{
                    fontSize: "3.2rem", lineHeight: 1, userSelect: "none",
                    filter: `grayscale(${powerGrayscale(power,total)}) brightness(${powerBrightness(power,total)})`,
                    transition: "filter 0.6s ease",
                  }}
                >
                  🎼
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Tempo Sync Interface (Rhythm Mini-game) ── */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "0.55rem 0.8rem",
          marginBottom: "0.6rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.45rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "0.75rem", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "rgba(240,238,255,0.4)", letterSpacing: "0.08em" }}>
            <span>TEMPO SYNCHRONIZER</span>
            <span>{tempoRating ? "LOCKED" : "OSCILLATING..."}</span>
          </div>

          {/* Oscillating Bar */}
          <div 
            ref={trackRef}
            style={{
              position: "relative",
              width: "100%",
              height: "12px",
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {/* Good Zone (Fainter green background) */}
            <div style={{
              position: "absolute",
              left: `${50 - goodHalfWidth}%`,
              width: `${goodHalfWidth * 2}%`,
              height: "100%",
              background: "rgba(88,204,2,0.06)",
              borderLeft: "1px dashed rgba(88,204,2,0.18)",
              borderRight: "1px dashed rgba(88,204,2,0.18)",
              transition: "left 0.4s ease, width 0.4s ease",
            }} />

            {/* Harmony Zone (Sweet Spot / Perfect) in center */}
            <div style={{
              position: "absolute",
              left: `${50 - perfectHalfWidth}%`,
              width: `${perfectHalfWidth * 2}%`,
              height: "100%",
              background: "linear-gradient(90deg, rgba(88,204,2,0.15) 0%, rgba(88,204,2,0.4) 50%, rgba(88,204,2,0.15) 100%)",
              borderLeft: "1.5px dashed rgba(88,204,2,0.45)",
              borderRight: "1.5px dashed rgba(88,204,2,0.45)",
              transition: "left 0.4s ease, width 0.4s ease",
            }} />
            
            {/* Moving Indicator */}
            <div 
              ref={indicatorRef}
              style={{
                position: "absolute",
                left: tempoActive ? undefined : `${sliderPos}%`,
                top: 0,
                width: "12px",
                height: "12px",
                transform: "translateX(-50%)",
                background: tempoRating === "perfect" ? "#7dff6b" : tempoRating === "good" ? "var(--cyan)" : tempoRating === "off" ? "#ff4b4b" : "#fff",
                borderRadius: "50%",
                boxShadow: tempoRating === "perfect" ? "0 0 14px #7dff6b" : tempoRating === "good" ? "0 0 10px var(--cyan)" : "0 0 8px rgba(255,255,255,0.5)",
                animation: tempoActive ? "ba-slider-oscillate 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite" : "none",
              }} 
            />
          </div>

          {/* Strike button / Rating feedback */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", minHeight: "30px", alignItems: "center" }}>
            {tempoActive ? (
              <button
                onClick={strikeTempo}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  color: "#08060f",
                  background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
                  padding: "0.35rem 1.6rem",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 0 20px ${accentColor}44`,
                  letterSpacing: "0.05em",
                }}
              >
                {characterName === "Zoe" ? "HIT THE BEAT 🥁" : "STRIKE BATON 🪄"}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {tempoRating === "perfect" && (
                  <span style={{ color: "#7dff6b", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.05em" }}>
                    ⚡ PERFECT HARMONY! (+2× Power / Shield Active)
                  </span>
                )}
                {tempoRating === "good" && (
                  <span style={{ color: "var(--cyan)", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.05em" }}>
                    ♪ ON THE BEAT! (+1× Power)
                  </span>
                )}
                {tempoRating === "off" && (
                  <span style={{ color: "rgba(255,75,75,0.7)", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.05em" }}>
                    ✗ OFF TEMPO! (No Shield / Normal Power)
                  </span>
                )}
              </div>
            )}
          </div>
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
                padding: "0.35rem 0.75rem",
                marginBottom: "0.4rem",
                maxHeight: "65px",
                overflowY: "auto",
              }}>
                <p style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: "0.88rem", color: "var(--pink)", margin: 0, lineHeight: 1.45,
                }}>
                  &ldquo;{currentQ.npcLine}&rdquo;
                </p>
              </div>
            )}

            {/* Question label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.18rem",
            }}>
              <span style={{ fontSize: "0.9rem" }}>🎼</span>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem",
                letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--pink)",
              }}>Final Challenge</span>
            </div>

            <h2 style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700,
              fontSize: "clamp(0.82rem,1.9vw,0.92rem)",
              color: "#fff", lineHeight: 1.38, marginBottom: "0.35rem",
            }}>
              {currentQ?.question}
            </h2>

            {/* Choices - slide in cinematically; auto-reveal after 1.4s or instantly on Strike */}
            {choicesVisible ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem" }}>
                {currentQ?.choices.map((choice, i) => (
                  <div
                    key={choice.label}
                    style={{
                      animation: `ba-choices-reveal 0.44s cubic-bezier(0.34,1.3,0.64,1) ${i * 70}ms both`,
                    }}
                  >
                    <ChoiceButton
                      choice={choice}
                      index={i}
                      answered={answered}
                      selectedLabel={selectedLabel}
                      onSelect={handleAnswer}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "1.2rem",
                border: "1.5px dashed rgba(255,255,255,0.06)",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.82rem",
                color: "rgba(240,238,255,0.28)",
                background: "rgba(255,255,255,0.01)",
                letterSpacing: "0.04em",
              }}>
                ♩ the maestro is reading…
              </div>
            )}
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
            padding: "0.6rem 1.5rem 0.75rem",
            zIndex: 100,
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            {/* Dr. Cole's "Failure as Narrative" story beat */}
            {!isCorrect && selectedChoice?.wrongStoryText && (
              <div style={{
                fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                fontSize: "0.95rem", color: "rgba(255,180,180,0.72)",
                lineHeight: 1.45, marginBottom: "0.5rem",
                paddingBottom: "0.4rem", borderBottom: "1px solid rgba(255,75,75,0.15)"
              }}>
                {selectedChoice.wrongStoryText}
              </div>
            )}
            {/* Result row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: feedbackText ? "0.3rem" : "0.5rem" }}>
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
                fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
                color: "rgba(240,238,255,0.75)", lineHeight: 1.45, margin: "0 0 0.5rem",
              }}>
                {feedbackText}
              </p>
            )}

            <button
              onClick={handleNext}
              style={{
                width: "100%",
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.9rem",
                color: "#fff",
                background: isCorrect
                  ? "linear-gradient(90deg,#58cc02,#33a500)"
                  : "linear-gradient(90deg,#ff4b4b,#c62828)",
                padding: "0.5rem", borderRadius: "10px", border: "none", cursor: "pointer",
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
