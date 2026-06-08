"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene, OrderItem } from "@/lib/games/types"
import { useSoundEngine } from "./SoundEngine"

/**
 * Ordering Scene — tap to build a sequence in the correct order.
 * No drag-and-drop: mobile-safe tap interface.
 *
 * - Tap an available item → appends it to the sequence
 * - Tap a sequence item → removes it back to available
 * - When sequence length === total items: auto-checks order
 * - Correct: cyan glow + "Perfect sequence" + Continue
 * - Wrong: shake + amber highlights on wrong positions + "Not quite — try again"
 *
 * Data: scene.orderItems: { id, text, correctPosition }[]
 */

const ORDER_KF_ID = "ordering-scene-kf"
function ensureOrderKeyframes() {
  if (typeof document === "undefined") return
  if (document.getElementById(ORDER_KF_ID)) return
  const s = document.createElement("style")
  s.id = ORDER_KF_ID
  s.textContent = `
    @keyframes order-item-in {
      from { opacity: 0; transform: translateY(10px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes order-shake {
      0%   { transform: translateX(0); }
      15%  { transform: translateX(-7px); }
      30%  { transform: translateX(7px); }
      45%  { transform: translateX(-5px); }
      60%  { transform: translateX(5px); }
      75%  { transform: translateX(-3px); }
      90%  { transform: translateX(3px); }
      100% { transform: translateX(0); }
    }
    @keyframes order-success-glow {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,212,240,0); }
      50%     { box-shadow: 0 0 22px 4px rgba(0,212,240,0.28); }
    }
    @keyframes order-badge-pop {
      0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
      60%  { transform: scale(1.2) rotate(4deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes order-result-in {
      from { opacity: 0; transform: translateY(14px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `
  document.head.appendChild(s)
}

/* Fisher-Yates shuffle (returns new array) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Props = {
  scene: Scene
  onComplete: (xpEarned: number) => void
  accentColor?: string
}

type CheckResult = "correct" | "wrong" | null

export default function OrderingScene({ scene, onComplete, accentColor = "#00d4f0" }: Props) {
  useEffect(() => { ensureOrderKeyframes() }, [])
  const sound = useSoundEngine()

  const items: OrderItem[] = scene.orderItems ?? []

  /* Shuffled available pool — computed once on mount */
  const initialPool = useMemo(() => shuffle(items), [items.length])

  /* available: items not yet placed; sequence: items placed in order */
  const [available, setAvailable] = useState<OrderItem[]>(initialPool)
  const [sequence,  setSequence]  = useState<OrderItem[]>([])

  /* result state */
  const [checkResult,  setCheckResult]  = useState<CheckResult>(null)
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set())
  const [shakeKey,     setShakeKey]     = useState(0)
  const [attempts,     setAttempts]     = useState(0)

  /* Reset pool when scene changes */
  useEffect(() => {
    setAvailable(shuffle(items))
    setSequence([])
    setCheckResult(null)
    setWrongIndices(new Set())
    setAttempts(0)
  }, [scene.id, items])

  /* Check the sequence whenever it fills up */
  useEffect(() => {
    if (sequence.length !== items.length || items.length === 0) return

    // Determine which positions are wrong
    const wrong = new Set<number>()
    sequence.forEach((item, idx) => {
      if (item.correctPosition !== idx + 1) wrong.add(idx)
    })

    if (wrong.size === 0) {
      setCheckResult("correct")
      sound.playCorrect()
    } else {
      setCheckResult("wrong")
      setWrongIndices(wrong)
      setShakeKey(k => k + 1)
      setAttempts(a => a + 1)
      sound.playWrong()
    }
  }, [sequence.length, items.length, sound])

  /* Tap available item → add to sequence */
  const addToSequence = useCallback((item: OrderItem) => {
    if (checkResult !== null) return
    sound.playClick()
    setAvailable(prev => prev.filter(i => i.id !== item.id))
    setSequence(prev => [...prev, item])
  }, [checkResult, sound])

  /* Tap sequence item → remove back to available */
  const removeFromSequence = useCallback((item: OrderItem, idx: number) => {
    if (checkResult === "correct") return
    sound.playClick()
    setSequence(prev => prev.filter((_, i) => i !== idx))
    setAvailable(prev => [...prev, item])
    // Reset wrong state when player starts editing after a wrong check
    if (checkResult === "wrong") {
      setCheckResult(null)
      setWrongIndices(new Set())
    }
  }, [checkResult, sound])

  /* Reset after wrong attempt */
  const resetAll = useCallback(() => {
    sound.playClick()
    setAvailable(shuffle(items))
    setSequence([])
    setCheckResult(null)
    setWrongIndices(new Set())
  }, [items, sound])

  /* Reveal correct order and allow continuation */
  const revealAndContinue = useCallback(() => {
    sound.playClick()
    const sorted = [...items].sort((a, b) => a.correctPosition - b.correctPosition)
    setSequence(sorted)
    setAvailable([])
    setCheckResult("correct")
    setWrongIndices(new Set())
  }, [items, sound])

  if (!items.length) {
    return (
      <div style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", padding: "2rem" }}>
        No order items configured for this scene.
      </div>
    )
  }

  const accentRgb = accentColor === "#00d4f0" ? "0,212,240"
    : accentColor === "#e040fb" ? "224,64,251"
    : "0,212,240"

  const isCorrect = checkResult === "correct"
  const isWrong   = checkResult === "wrong"

  return (
    <div style={{ paddingBottom: "1.5rem" }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "1rem" }}>📋</span>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.8rem",
            letterSpacing: "0.25em", textTransform: "uppercase", color: accentColor,
          }}>
            Put it in order
          </span>
        </div>

        {scene.question && (
          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700,
            fontSize: "clamp(1.2rem, 2.5vw, 1.4rem)", color: "#fff",
            lineHeight: 1.35, marginBottom: "0.3rem", letterSpacing: "-0.01em",
          }}>
            {scene.question}
          </h2>
        )}

        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
          color: "rgba(240,238,255,0.38)", margin: 0, letterSpacing: "0.04em",
        }}>
          Tap an item to add it · tap a placed item to remove it
        </p>
      </div>

      {/* ── Your Sequence (2x2 Grid) ────────────────────────────────── */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(240,238,255,0.35)", marginBottom: "0.4rem",
        }}>
          Your Sequence
        </div>

        {/* Sequence slots in a 2x2 grid */}
        <div
          key={shakeKey}
          style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem",
            animation: isWrong ? `order-shake 0.55s ease both` : undefined,
          }}
        >
          {sequence.map((item, idx) => {
            const isWrongPos = wrongIndices.has(idx)
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28, delay: idx * 0.04 }}
                onClick={() => removeFromSequence(item, idx)}
                style={{
                  width: "100%", textAlign: "left", cursor: isCorrect ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  height: "72px",
                  background: isCorrect
                    ? `rgba(${accentRgb},0.1)`
                    : isWrongPos
                    ? "rgba(255,179,71,0.08)"
                    : "rgba(255,255,255,0.05)",
                  border: isCorrect
                    ? `1.5px solid rgba(${accentRgb},0.55)`
                    : isWrongPos
                    ? "1.5px solid rgba(255,179,71,0.55)"
                    : "1.5px solid rgba(255,255,255,0.14)",
                  borderRadius: "12px",
                  padding: "0.5rem 0.75rem",
                  boxShadow: isCorrect
                    ? `0 0 0 0 rgba(${accentRgb},0)`
                    : "none",
                  animation: isCorrect ? "order-success-glow 2.8s ease-in-out infinite" : undefined,
                  transition: "background 0.25s ease, border-color 0.25s ease",
                }}
              >
                {/* Position badge */}
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem",
                  background: isCorrect
                    ? `rgba(${accentRgb},0.2)`
                    : isWrongPos
                    ? "rgba(255,179,71,0.18)"
                    : "rgba(255,255,255,0.08)",
                  color: isCorrect
                    ? accentColor
                    : isWrongPos
                    ? "#ffb347"
                    : "rgba(240,238,255,0.5)",
                  border: isCorrect
                    ? `1px solid rgba(${accentRgb},0.4)`
                    : isWrongPos
                    ? "1px solid rgba(255,179,71,0.4)"
                    : "1px solid rgba(255,255,255,0.12)",
                }}>
                  {idx + 1}
                </div>

                {/* Item text */}
                <span style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "0.92rem",
                  color: isCorrect
                    ? accentColor
                    : isWrongPos
                    ? "#ffb347"
                    : "rgba(240,238,255,0.9)",
                  lineHeight: 1.3,
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {item.text}
                </span>

                {/* Status icon */}
                {isCorrect && (
                  <span style={{
                    fontSize: "0.95rem", flexShrink: 0,
                    animation: "order-badge-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
                  }}>✓</span>
                )}
                {isWrongPos && (
                  <span style={{ fontSize: "0.85rem", flexShrink: 0, opacity: 0.8 }}>✕</span>
                )}
              </motion.button>
            )
          })}

          {/* Empty placeholder slots */}
          {sequence.length < items.length && Array.from({ length: items.length - sequence.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                background: "rgba(255,255,255,0.02)",
                border: "1.5px dashed rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "0.5rem 0.75rem",
                height: "72px",
                opacity: 0.55,
                animation: `order-item-in 0.3s ${(sequence.length + i) * 0.06}s ease both`,
              }}
            >
              <div style={{
                width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(240,238,255,0.2)",
                border: "1px dashed rgba(255,255,255,0.12)",
              }}>
                {sequence.length + i + 1}
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.95rem",
                color: "rgba(240,238,255,0.2)", letterSpacing: "0.06em",
              }}>
                —
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Available Items (2x2 Grid) ──────────────────────────────── */}
      <AnimatePresence>
        {available.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(240,238,255,0.35)", marginBottom: "0.4rem",
            }}>
              Available
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
              <AnimatePresence>
                {available.map((item) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addToSequence(item)}
                    style={{
                      width: "100%", textAlign: "left", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      height: "72px",
                      background: "rgba(255,255,255,0.04)",
                      border: `1.5px solid rgba(${accentRgb},0.22)`,
                      borderRadius: "12px",
                      padding: "0.5rem 0.75rem",
                      transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `rgba(${accentRgb},0.08)`
                      e.currentTarget.style.borderColor = `rgba(${accentRgb},0.5)`
                      e.currentTarget.style.boxShadow = `0 0 16px rgba(${accentRgb},0.15)`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)"
                      e.currentTarget.style.borderColor = `rgba(${accentRgb},0.22)`
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `rgba(${accentRgb},0.1)`,
                      border: `1px solid rgba(${accentRgb},0.25)`,
                    }}>
                      <span style={{
                        fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
                        color: accentColor, opacity: 0.7,
                      }}>+</span>
                    </div>

                    <span style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontSize: "0.92rem",
                      color: "rgba(240,238,255,0.88)",
                      lineHeight: 1.3,
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {item.text}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result Panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {checkResult !== null && (
          <motion.div
            key={checkResult}
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 26, delay: isCorrect ? 0.3 : 0.15 }}
            style={{
              marginTop: "1.25rem",
              background: isCorrect
                ? `rgba(${accentRgb},0.08)`
                : "rgba(255,179,71,0.06)",
              border: isCorrect
                ? `1px solid rgba(${accentRgb},0.35)`
                : "1px solid rgba(255,179,71,0.35)",
              borderRadius: "14px",
              padding: "0.85rem 1.25rem",
              textAlign: "center",
            }}
          >
            {isCorrect ? (
              <>
                <div style={{
                  fontSize: "1.4rem", marginBottom: "0.3rem",
                  animation: "order-badge-pop 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
                }}>
                  ✦
                </div>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontWeight: 600, fontSize: "1.25rem", color: "#fff",
                  marginBottom: "0.2rem",
                }}>
                  Perfect sequence.
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.85rem",
                  color: "rgba(240,238,255,0.55)", marginBottom: "0.75rem", letterSpacing: "0.03em",
                }}>
                  Every step in its right place.
                </p>

                {scene.xpAward > 0 && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    background: `rgba(${accentRgb},0.1)`,
                    border: `1px solid rgba(${accentRgb},0.25)`,
                    borderRadius: "100px", padding: "0.2rem 0.75rem",
                    marginBottom: "0.75rem",
                  }}>
                    <div style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: accentColor, boxShadow: `0 0 6px ${accentColor}`,
                    }} />
                    <span style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 800,
                      fontSize: "0.75rem", color: accentColor,
                    }}>
                      +{scene.xpAward} XP
                    </span>
                  </div>
                )}

                <div style={{ display: "block" }}>
                  <button
                    onClick={() => { sound.playClick(); onComplete(scene.xpAward) }}
                    style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem",
                      color: "#08060f",
                      background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
                      padding: "0.65rem 2rem", borderRadius: "100px",
                      border: "none", cursor: "pointer",
                      boxShadow: `0 0 24px rgba(${accentRgb},0.35)`,
                      transition: "filter 0.15s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                    onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = "" }}
                  >
                    Continue →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontWeight: 600, fontSize: "1.25rem", color: "#ffb347",
                  marginBottom: "0.2rem",
                }}>
                  Not quite — try again.
                </div>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.85rem",
                  color: "rgba(240,238,255,0.5)", marginBottom: "0.75rem", letterSpacing: "0.03em",
                }}>
                  Amber steps are out of order. Tap to rearrange.
                </p>
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={resetAll}
                    style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.82rem",
                      color: "#ffb347",
                      background: "rgba(255,179,71,0.1)",
                      border: "1.5px solid rgba(255,179,71,0.4)",
                      padding: "0.5rem 1.5rem", borderRadius: "100px",
                      cursor: "pointer",
                      transition: "background 0.18s ease, filter 0.15s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,179,71,0.18)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,179,71,0.1)" }}
                  >
                    Reset &amp; retry
                  </button>

                  {attempts >= 1 && (
                    <button
                      onClick={revealAndContinue}
                      style={{
                        fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.82rem",
                        color: "#fff",
                        background: "linear-gradient(90deg, #ffb347, #ff9800)",
                        border: "none",
                        padding: "0.5rem 1.5rem", borderRadius: "100px",
                        cursor: "pointer",
                        boxShadow: "0 0 16px rgba(255,152,0,0.25)",
                        transition: "filter 0.15s ease, transform 0.15s ease",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.12)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                      onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = "" }}
                    >
                      Reveal &amp; Continue →
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
