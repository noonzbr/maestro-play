"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene, Choice, AICompareRow } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"

/* ── Model brand config ─────────────────────────────────────────────────── */
const MODEL_CONFIG = {
  claude:  { label: "Claude",   color: "#00d4f0", emoji: "✦", bg: "rgba(0,212,240,0.07)",  border: "rgba(0,212,240,0.22)"  },
  chatgpt: { label: "ChatGPT",  color: "#10a37f", emoji: "⬡", bg: "rgba(16,163,127,0.07)", border: "rgba(16,163,127,0.22)" },
  gemini:  { label: "Gemini",   color: "#4285f4", emoji: "◈", bg: "rgba(66,133,244,0.07)",  border: "rgba(66,133,244,0.22)"  },
  copilot: { label: "Copilot",  color: "#8c6ee1", emoji: "◇", bg: "rgba(140,110,225,0.07)", border: "rgba(140,110,225,0.22)" },
} as const

/* ── Keyframes ──────────────────────────────────────────────────────────── */
const KF_ID = "ai-compare-kf"
function ensureKf() {
  if (typeof document === "undefined") return
  if (document.getElementById(KF_ID)) return
  const s = document.createElement("style")
  s.id = KF_ID
  s.textContent = `
    @keyframes ac-fade-up {
      from { opacity:0; transform:translateY(10px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes ac-winner-glow {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,212,240,0); }
      50%     { box-shadow: 0 0 12px 2px rgba(0,212,240,0.18); }
    }
    @keyframes ac-row-in {
      from { opacity:0; transform:translateX(-8px); }
      to   { opacity:1; transform:translateX(0); }
    }
  `
  document.head.appendChild(s)
}

/* ── Model chip ─────────────────────────────────────────────────────────── */
function ModelChip({ model, isWinner }: { model: keyof typeof MODEL_CONFIG; isWinner?: boolean }) {
  const cfg = MODEL_CONFIG[model]
  return (
    <div style={{
      display:      "inline-flex",
      alignItems:   "center",
      gap:          "0.3rem",
      background:   isWinner ? cfg.bg : "rgba(255,255,255,0.02)",
      border:       `1px solid ${isWinner ? cfg.border : "rgba(255,255,255,0.07)"}`,
      borderRadius: "100px",
      padding:      "0.18rem 0.55rem",
      transition:   "all 0.2s ease",
    }}>
      <span style={{ fontSize: "0.85rem", color: isWinner ? cfg.color : "rgba(240,238,255,0.35)" }}>
        {cfg.emoji}
      </span>
      <span style={{
        fontFamily:    "Inter, sans-serif",
        fontWeight:    isWinner ? 700 : 500,
        fontSize:      "0.8rem",
        letterSpacing: "0.08em",
        color:         isWinner ? cfg.color : "rgba(240,238,255,0.35)",
      }}>
        {cfg.label}
      </span>
      {isWinner && (
        <span style={{
          fontFamily:  "Inter, sans-serif",
          fontWeight:  800,
          fontSize:    "0.68rem",
          letterSpacing:"0.18em",
          textTransform:"uppercase",
          color:        cfg.color,
          opacity:      0.7,
        }}>
          WINS
        </span>
      )}
    </div>
  )
}

/* ── Comparison row ─────────────────────────────────────────────────────── */
function CompareRow({
  row,
  models,
  index,
}: {
  row:    AICompareRow
  models: Array<keyof typeof MODEL_CONFIG>
  index:  number
}) {
  const [expanded, setExpanded] = useState(false)
  const winnerCfg = MODEL_CONFIG[row.winner.toLowerCase() as keyof typeof MODEL_CONFIG]

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      style={{
        borderRadius:  "12px",
        background:    expanded ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
        border:        expanded ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
        padding:       "0.65rem 0.8rem",
        animation:     `ac-row-in 0.35s ${index * 0.07}s ease both`,
        position:      "relative",
        overflow:      "hidden",
        cursor:        "pointer",
        transition:    "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={e => {
        if (!expanded) {
          e.currentTarget.style.background = "rgba(255,255,255,0.025)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"
        }
      }}
      onMouseLeave={e => {
        if (!expanded) {
          e.currentTarget.style.background = "rgba(255,255,255,0.015)"
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"
        }
      }}
    >
      {/* Winner accent bar */}
      {winnerCfg && (
        <div style={{
          position:    "absolute",
          left:        0,
          top:         0,
          bottom:      0,
          width:       "3px",
          background:  winnerCfg.color,
          borderRadius:"12px 0 0 12px",
          opacity:     0.7,
        }} />
      )}

      <div style={{ paddingLeft: "0.5rem" }}>
        {/* Dimension header row */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          marginBottom:   expanded ? "0.6rem" : 0,
          gap:            "0.5rem",
          flexWrap:       "wrap",
          pointerEvents:  "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.3)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}>
              ▼
            </span>
            <span style={{
              fontFamily:    "Inter, sans-serif",
              fontWeight:    700,
              fontSize:      "0.95rem",
              color:         "rgba(240,238,255,0.88)",
              letterSpacing: "-0.01em",
            }}>
              {row.dimension}
            </span>
          </div>
          {winnerCfg && (
            <ModelChip model={row.winner.toLowerCase() as keyof typeof MODEL_CONFIG} isWinner />
          )}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              {/* Per-model descriptors */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.38rem", marginBottom: row.note ? "0.6rem" : 0, paddingLeft: "1.1rem" }}>
                {models.map(m => {
                  const desc = row[m]
                  if (!desc || desc === "N/A") return null
                  const cfg = MODEL_CONFIG[m]
                  const isWinner = m === row.winner.toLowerCase()
                  return (
                    <div key={m} style={{
                      display:    "flex",
                      alignItems: "flex-start",
                      gap:        "0.4rem",
                    }}>
                      <span style={{
                        fontFamily:    "Inter, sans-serif",
                        fontWeight:    700,
                        fontSize:      "0.75rem",
                        letterSpacing: "0.15em",
                        color:         isWinner ? cfg.color : "rgba(240,238,255,0.28)",
                        flexShrink:    0,
                        paddingTop:    "2px",
                        minWidth:      "60px",
                      }}>
                        {cfg.label}
                      </span>
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize:   "0.95rem",
                        color:      isWinner ? "rgba(240,238,255,0.92)" : "rgba(240,238,255,0.42)",
                        lineHeight: 1.45,
                        fontWeight: isWinner ? 500 : 400,
                      }}>
                        {desc}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Teaching note */}
              {row.note && (
                <div style={{
                  display:      "flex",
                  alignItems:   "flex-start",
                  gap:          "0.35rem",
                  paddingTop:   "0.5rem",
                  borderTop:    "1px solid rgba(255,255,255,0.05)",
                  paddingLeft:  "1.1rem",
                }}>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,210,80,0.6)", flexShrink: 0, paddingTop: "1px" }}>→</span>
                  <p style={{
                    fontFamily:  "Inter, sans-serif",
                    fontSize:    "0.9rem",
                    color:       "rgba(240,238,255,0.5)",
                    lineHeight:  1.5,
                    margin:      0,
                    fontStyle:   "italic",
                  }}>
                    {row.note}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── Feedback panel (inline — reused from SceneRenderer's pattern) ───────── */
function AICompareFeedback({
  correct, feedbackText, onNext, streakCount
}: {
  correct: boolean; feedbackText: string; onNext: () => void; streakCount: number
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), correct ? 0 : 400)
    return () => clearTimeout(t)
  }, [correct])

  const color = correct ? "#58cc02" : "#ff4b4b"
  const bg    = correct ? "rgba(8,28,8,0.98)" : "rgba(30,8,8,0.98)"

  return (
    <div style={{
      position:      "fixed",
      bottom:        0, left: 0, right: 0,
      background:    bg,
      borderTop:     `3px solid ${color}`,
      backdropFilter:"blur(24px)",
      padding:       "0.85rem 1.5rem 1.1rem",
      zIndex:        90,
      animation:     "ac-fade-up 0.38s cubic-bezier(0.34,1.15,0.64,1) both",
    }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          marginBottom: feedbackText ? "0.5rem" : 0,
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
            background: correct ? "linear-gradient(135deg,#58cc02,#33a500)" : "linear-gradient(135deg,#ff4b4b,#c62828)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "1rem", color: "#fff",
          }}>
            {correct ? "✓" : "✗"}
          </div>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem",
            color,
            letterSpacing: "-0.01em",
          }}>
            {correct
              ? (streakCount >= 3 ? `${streakCount} in a row! 🔥` : "Right!")
              : "Not quite — here's why"}
          </span>
        </div>
        {feedbackText && (
          <p style={{
            fontFamily: "Inter, sans-serif", fontSize: "1.15rem",
            color: "rgba(240,238,255,0.75)", lineHeight: 1.65,
            margin: "0 0 0.85rem",
          }}>
            {feedbackText}
          </p>
        )}
        <button
          onClick={ready ? onNext : undefined}
          style={{
            width: "100%", fontFamily: "Inter, sans-serif", fontWeight: 800,
            fontSize: "0.95rem", color: "#fff",
            background: ready
              ? correct ? "linear-gradient(90deg,#58cc02,#33a500)" : "linear-gradient(90deg,#ff4b4b,#c62828)"
              : "rgba(255,255,255,0.08)",
            padding: "0.7rem", borderRadius: "12px", border: "none",
            cursor: ready ? "pointer" : "default",
            opacity: ready ? 1 : 0.55,
            transition: "all 0.2s ease",
          }}
        >
          {ready ? "Continue →" : "Read the explanation…"}
        </button>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */
type Props = {
  scene:         Scene
  answered:      boolean
  selectedLabel: string | null
  onAnswer:      (choice: Choice) => void
  onNext:        () => void
  streakCount?:  number
  aiElaboration?:string | null
}

export default function AICompareScene({
  scene, answered, selectedLabel, onAnswer, onNext, streakCount = 0,
}: Props) {
  useEffect(() => { ensureKf() }, [])

  const data = scene.aiCompare
  if (!data) return null

  const models = data.models
  const spring = { type: "spring" as const, stiffness: 380, damping: 30 }

  const selectedChoice = answered && selectedLabel
    ? (data.choices || scene.choices)?.find(c => c.label === selectedLabel)
    : null
  const correct      = selectedChoice?.correct ?? false
  const feedbackText: string = selectedChoice
    ? (!selectedChoice.correct && selectedChoice.wrongFeedback)
      ? selectedChoice.wrongFeedback
      : (selectedChoice.feedback ?? "")
    : ""

  return (
    <div style={{ paddingBottom: "5rem" }}>

      {/* ── Model icons header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0 }}
        style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}
      >
        {models.map(m => (
          <ModelChip key={m} model={m} />
        ))}
        <span style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--muted)", fontWeight: 500,
        }}>
          {scene.location || "COMPARISON"}
        </span>
      </motion.div>

      {/* ── Headline ──────────────────────────────────────────────────── */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 700,
          fontSize:   "clamp(1.35rem, 3.2vw, 1.65rem)",
          color:      "#fff",
          lineHeight: 1.2,
          marginBottom: "0.5rem",
          letterSpacing: "-0.01em",
        }}
      >
        {data.headline}
      </motion.h2>

      {/* ── Context ───────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily:  "Inter, sans-serif",
          fontSize:    "1.15rem",
          color:       "rgba(240,238,255,0.65)",
          lineHeight:  1.65,
          marginBottom:"0.85rem",
        }}
      >
        {data.context}
      </motion.p>

      {/* ── Comparison rows ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{ display: "flex", flexDirection: "column", gap: "0.38rem", marginBottom: "0.85rem" }}
      >
        {data.rows.map((row, i) => (
          <CompareRow key={row.dimension} row={row} models={models} index={i} />
        ))}
      </motion.div>

      {/* ── Verdict ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.3 + data.rows.length * 0.06 }}
        style={{
          background:   "linear-gradient(135deg, rgba(0,212,240,0.04) 0%, rgba(224,64,251,0.04) 100%)",
          border:       "1px solid rgba(0,212,240,0.15)",
          borderRadius: "12px",
          padding:      "0.7rem 0.9rem",
          marginBottom: "1rem",
          display:      "flex",
          gap:          "0.5rem",
          alignItems:   "flex-start",
        }}
      >
        <span style={{ fontSize: "1.1rem", flexShrink: 0, paddingTop: "1px" }}>🎼</span>
        <p style={{
          fontFamily:  "Inter, sans-serif",
          fontSize:    "1.1rem",
          color:       "rgba(240,238,255,0.72)",
          lineHeight:  1.6,
          margin:      0,
          fontStyle:   "italic",
        }}>
          {data.verdict}
        </p>
      </motion.div>

      {/* ── Quiz divider ──────────────────────────────────────────────── */}
      {data.question && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.38 + data.rows.length * 0.06 }}
        >
          <div style={{
            display:    "flex",
            alignItems: "center",
            gap:        "0.5rem",
            marginBottom:"0.38rem",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)",
            }} />
            <span style={{
              fontFamily:    "Inter, sans-serif", fontWeight: 800, fontSize: "0.8rem",
              letterSpacing: "0.25em", textTransform: "uppercase",
              color:         "rgba(0,212,240,0.6)",
            }}>
              Apply It
            </span>
          </div>
          <h3 style={{
            fontFamily:   "Inter, sans-serif",
            fontWeight:   700,
            fontSize:     "clamp(1.2rem, 2.6vw, 1.45rem)",
            color:        "#fff",
            lineHeight:   1.4,
            marginBottom: "0.5rem",
            letterSpacing:"-0.01em",
          }}>
            {data.question}
          </h3>
        </motion.div>
      )}

      {/* ── Choices ───────────────────────────────────────────────────── */}
      {data.choices && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.44 + data.rows.length * 0.06 }}
          style={{ display: "flex", flexDirection: "column", gap: "0.38rem" }}
        >
          {data.choices.map((choice, i) => (
            <motion.div
              key={choice.label}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.46 + data.rows.length * 0.06 + i * 0.06 }}
            >
              <ChoiceButton
                choice={choice}
                index={i}
                answered={answered}
                selectedLabel={selectedLabel}
                onSelect={onAnswer}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Continue button if there are no choices (meaning this is a pure comparison slide) ── */}
      {!data.choices && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 + data.rows.length * 0.06 }}
          style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}
        >
          <button
            onClick={onNext}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#08060f",
              background: "linear-gradient(90deg,#00d4f0,#e040fb)",
              padding: "0.75rem 2.25rem",
              borderRadius: "100px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(0,212,240,0.25)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 32px rgba(0,212,240,0.45)" }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 20px rgba(0,212,240,0.25)" }}
          >
            Continue →
          </button>
        </motion.div>
      )}

      {/* ── Feedback ──────────────────────────────────────────────────── */}
      {answered && selectedChoice && (
        <AICompareFeedback
          correct={correct}
          feedbackText={feedbackText}
          onNext={onNext}
          streakCount={streakCount}
        />
      )}
    </div>
  )
}
