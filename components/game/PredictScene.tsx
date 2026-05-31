"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene, Choice } from "@/lib/games/types"

/* ── keyframes ─────────────────────────────────────────────── */
const KF_ID = "predict-scene-kf"
function ensureKf() {
  if (typeof document === "undefined") return
  if (document.getElementById(KF_ID)) return
  const s = document.createElement("style")
  s.id = KF_ID
  s.textContent = `
    @keyframes ps-bubble-in {
      from { opacity:0; transform:translateY(12px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes ps-feedback-up {
      from { transform:translateY(100%); opacity:0.6; }
      to   { transform:translateY(0);   opacity:1; }
    }
    @keyframes ps-correct-glow {
      0%,100% { box-shadow:0 0 0 2px rgba(88,204,2,0.4); }
      50%     { box-shadow:0 0 0 4px rgba(88,204,2,0.8), 0 0 20px rgba(88,204,2,0.3); }
    }
    @keyframes ps-typing {
      0%,100% { opacity:1; }
      50%     { opacity:0; }
    }
  `
  document.head.appendChild(s)
}

type Props = {
  scene:           Scene
  answered:        boolean
  selectedLabel:   string | null
  onAnswer:        (choice: Choice) => void
  onNext:          () => void
  streakCount?:    number
  aiElaboration?:  string | null
}

export default function PredictScene({
  scene, answered, selectedLabel, onAnswer, onNext, streakCount = 0, aiElaboration
}: Props) {
  useEffect(() => { ensureKf() }, [])
  const [hovered, setHovered] = useState<string | null>(null)
  const [btnReady, setBtnReady] = useState(false)

  /* ── Prompt typewriter ─────────────────────────────────────────────────── */
  const [promptDisplayed, setPromptDisplayed] = useState("")
  const [promptDone,      setPromptDone]      = useState(false)
  const [choicesUnlocked, setChoicesUnlocked] = useState(false)

  useEffect(() => {
    // Reset on new scene
    setPromptDisplayed("")
    setPromptDone(false)
    setChoicesUnlocked(false)
    const prompt = scene.predictPrompt ?? ""
    if (!prompt) { setPromptDone(true); setChoicesUnlocked(true); return }
    let i = 0
    // Brief entrance delay before typing starts
    const startDelay = setTimeout(() => {
      const t = setInterval(() => {
        i++
        setPromptDisplayed(prompt.slice(0, i))
        if (i >= prompt.length) {
          clearInterval(t)
          setPromptDone(true)
          // Short pause after typing finishes, then unlock choices
          setTimeout(() => setChoicesUnlocked(true), 400)
        }
      }, 22)
      return () => clearInterval(t)
    }, 600)
    return () => clearTimeout(startDelay)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id])

  const selectedChoice = answered && selectedLabel
    ? scene.choices?.find(c => c.label === selectedLabel)
    : null
  const correct      = selectedChoice?.correct ?? false
  const feedbackText = selectedChoice
    ? (!selectedChoice.correct && selectedChoice.wrongFeedback)
      ? selectedChoice.wrongFeedback
      : selectedChoice.feedback
    : ""

  useEffect(() => {
    if (!answered) return
    const t = setTimeout(() => setBtnReady(true), correct ? 0 : 600)
    return () => clearTimeout(t)
  }, [answered, correct])

  return (
    <div style={{ paddingBottom: answered ? "9rem" : "1rem" }}>

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        style={{ marginBottom: "1rem" }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "rgba(0,212,240,0.08)", border: "1px solid rgba(0,212,240,0.22)",
          borderRadius: "100px", padding: "0.28rem 0.9rem",
        }}>
          <span style={{ fontSize: "0.9rem" }}>🔮</span>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem",
            letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--cyan)",
          }}>Predict the Output</span>
        </div>
      </motion.div>

      {/* ── Jake's prompt bubble (right-aligned user message) ── */}
      {scene.predictPrompt && (
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.08 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: "0.5rem" }}
        >
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: "0.62rem", fontWeight: 600,
            color: "rgba(240,238,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: "0.3rem",
          }}>
            Jake typed
          </div>
          <div style={{
            background: "linear-gradient(135deg, rgba(0,212,240,0.12) 0%, rgba(0,180,220,0.08) 100%)",
            border: "1px solid rgba(0,212,240,0.22)",
            borderRadius: "18px 18px 4px 18px",
            padding: "0.55rem 0.9rem",
            maxWidth: "88%",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: "0.78rem",
            fontWeight: 400,
            color: "rgba(240,238,255,0.9)",
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {promptDisplayed}
            {!promptDone && (
              <span style={{ animation: "ps-typing 0.6s ease-in-out infinite", color: "var(--cyan)", marginLeft: "1px" }}>▌</span>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Question ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
        style={{ marginBottom: "0.9rem" }}
      >
        <p style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700,
          fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
          color: "rgba(240,238,255,0.65)", lineHeight: 1.45, margin: 0,
        }}>
          {scene.question ?? "Which response did he actually get?"}
        </p>
      </motion.div>

      {/* ── AI Output options (left-aligned chat bubbles) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {scene.choices?.map((choice, i) => {
          const isSelected = selectedLabel === choice.label
          const isCorrect  = choice.correct
          const showResult = answered

          let borderColor = "rgba(255,255,255,0.09)"
          let bgColor     = "rgba(255,255,255,0.04)"
          let opacity     = 1

          if (showResult) {
            if (isCorrect) {
              borderColor = "rgba(88,204,2,0.55)"
              bgColor     = "rgba(88,204,2,0.07)"
            } else if (isSelected) {
              borderColor = "rgba(255,75,75,0.55)"
              bgColor     = "rgba(255,75,75,0.07)"
            } else {
              opacity = 0.35
            }
          } else if (hovered === choice.label) {
            borderColor = "rgba(0,212,240,0.35)"
            bgColor     = "rgba(0,212,240,0.06)"
          }

          return (
            <motion.div
              key={choice.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 30, delay: 0.22 + i * 0.09 }}
            >
              <button
                disabled={answered || !choicesUnlocked}
                onClick={() => !answered && choicesUnlocked && onAnswer(choice)}
                onMouseEnter={() => !answered && choicesUnlocked && setHovered(choice.label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: "100%", textAlign: "left", background: "none",
                  border: "none", padding: 0,
                  cursor: answered || !choicesUnlocked ? "default" : "pointer",
                  opacity: !choicesUnlocked ? opacity * 0.4 : opacity,
                  transition: "opacity 0.5s ease",
                  animation: showResult && isCorrect ? "ps-correct-glow 2s ease-in-out infinite" : "none",
                }}
              >
                <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                  {/* AI avatar dot */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: showResult && isCorrect
                      ? "linear-gradient(135deg,#58cc02,#33a500)"
                      : showResult && isSelected
                      ? "linear-gradient(135deg,#ff4b4b,#c62828)"
                      : "linear-gradient(135deg,rgba(123,47,190,0.6),rgba(0,212,240,0.4))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 900, color: "#fff",
                    marginTop: "2px",
                    transition: "background 0.3s ease",
                  }}>
                    {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : "AI"}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    flex: 1,
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: "4px 18px 18px 18px",
                    padding: "0.75rem 1rem",
                    transition: "background 0.25s ease, border-color 0.25s ease",
                  }}>
                    {/* Option label */}
                    <div style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem",
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: showResult && isCorrect
                        ? "rgba(88,204,2,0.8)"
                        : showResult && isSelected
                        ? "rgba(255,75,75,0.7)"
                        : "rgba(240,238,255,0.3)",
                      marginBottom: "0.4rem",
                      transition: "color 0.3s ease",
                    }}>
                      Option {choice.label}
                    </div>

                    {/* Output text — formatted like real AI response */}
                    <p style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: "0.74rem", color: "rgba(240,238,255,0.85)",
                      lineHeight: 1.55, margin: 0,
                      whiteSpace: "pre-line",
                    }}>
                      {choice.text}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* ── Feedback panel ── */}
      {answered && selectedChoice && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: correct
            ? "linear-gradient(180deg,rgba(8,28,8,0.98) 0%,rgba(6,20,6,0.99) 100%)"
            : "linear-gradient(180deg,rgba(30,8,8,0.98) 0%,rgba(22,6,6,0.99) 100%)",
          borderTop: `3px solid ${correct ? "#58cc02" : "#ff4b4b"}`,
          backdropFilter: "blur(24px)",
          padding: "0.9rem 1.5rem 1.1rem",
          zIndex: 90,
          animation: "ps-feedback-up 0.4s cubic-bezier(0.34,1.1,0.64,1) both",
        }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: feedbackText ? "0.5rem" : "0.85rem" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                background: correct
                  ? "linear-gradient(135deg,#58cc02,#33a500)"
                  : "linear-gradient(135deg,#ff4b4b,#c62828)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: "#fff", fontWeight: 900,
              }}>
                {correct ? "✓" : "✗"}
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem",
                color: correct ? "#58cc02" : "#ff4b4b",
              }}>
                {correct ? "That's exactly what he got." : "Not quite — here's what actually happened."}
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

            {/* ── Breakdown: annotated giveaways (shown on correct reveal) ── */}
            {correct && selectedChoice?.breakdown && selectedChoice.breakdown.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(88,204,2,0.15)",
                borderRadius: "10px",
                padding: "0.65rem 0.9rem",
                marginBottom: "0.85rem",
              }}>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem",
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "rgba(88,204,2,0.65)", marginBottom: "0.55rem",
                }}>
                  The Giveaways — what makes it generic
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                  {selectedChoice.breakdown.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, marginTop: "2px" }}>
                        <span style={{
                          fontFamily: "'Courier New', monospace", fontSize: "0.68rem",
                          color: "rgba(255,200,80,0.9)",
                          background: "rgba(255,200,80,0.08)",
                          border: "1px solid rgba(255,200,80,0.2)",
                          borderRadius: "4px", padding: "0.08rem 0.38rem",
                          whiteSpace: "nowrap",
                        }}>
                          "{item.phrase}"
                        </span>
                      </div>
                      <p style={{
                        fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
                        color: "rgba(240,238,255,0.58)", lineHeight: 1.5, margin: 0,
                      }}>
                        {item.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI elaboration slot */}
            {aiElaboration && (
              <p style={{
                fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                fontSize: "1rem", color: "rgba(255,210,210,0.82)", lineHeight: 1.7, margin: "0 0 0.85rem",
              }}>
                {aiElaboration}
              </p>
            )}

            <button
              onClick={btnReady ? onNext : undefined}
              style={{
                width: "100%", fontFamily: "Inter, sans-serif", fontWeight: 800,
                fontSize: "0.95rem", color: "#fff",
                background: btnReady
                  ? correct
                    ? "linear-gradient(90deg,#58cc02,#33a500)"
                    : "linear-gradient(90deg,#ff4b4b,#c62828)"
                  : correct ? "rgba(88,204,2,0.3)" : "rgba(255,75,75,0.28)",
                padding: "0.7rem", borderRadius: "12px", border: "none",
                cursor: btnReady ? "pointer" : "default",
                opacity: btnReady ? 1 : 0.55,
                letterSpacing: "0.04em", textTransform: "uppercase",
                transition: "opacity 0.35s ease, background 0.35s ease, filter 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => { if (!btnReady) return; e.currentTarget.style.filter="brightness(1.12)"; e.currentTarget.style.transform="translateY(-1px)" }}
              onMouseLeave={e => { e.currentTarget.style.filter=""; e.currentTarget.style.transform="" }}
            >
              {btnReady ? "Continue →" : "Read the explanation…"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
