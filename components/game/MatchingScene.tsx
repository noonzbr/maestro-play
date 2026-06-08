"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene } from "@/lib/games/types"
import { useSoundEngine } from "./SoundEngine"

/**
 * Matching Scene — drag/tap to connect concepts to their definitions.
 * No "correct/wrong" labels. Mismatches animate back; correct matches lock with a spark.
 *
 * Data format (in scene.matchPairs):
 *   [{ left: "Claude Projects", right: "Persistent memory across conversations" }, ...]
 *
 * The component shuffles the right-column independently so they never align by default.
 */

type MatchPair = { left: string; right: string }

type Props = {
  scene: Scene
  onComplete: (xpEarned: number) => void
  accentColor?: string
}

export default function MatchingScene({ scene, onComplete, accentColor = "#00d4f0" }: Props) {
  const pairs: MatchPair[] = scene.matchPairs ?? []
  const sound = useSoundEngine()

  // Shuffle right column once on mount
  const [rightOrder, setRightOrder] = useState<number[]>([])
  const [selected,   setSelected]   = useState<number | null>(null)   // left index selected
  const [matched,    setMatched]     = useState<Set<number>>(new Set()) // left indices matched
  const [wrongKey,   setWrongKey]    = useState(0)  // trigger shake on wrong
  const [wrongPair,  setWrongPair]   = useState<number | null>(null)

  useEffect(() => {
    const indices = pairs.map((_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    setRightOrder(indices)
  }, [pairs.length])

  const handleLeft = useCallback((i: number) => {
    if (matched.has(i)) return
    sound.playClick()
    setSelected(prev => prev === i ? null : i)
  }, [matched, sound])

  const handleRight = useCallback((rightIdx: number) => {
    const leftIdx = rightOrder[rightIdx]
    if (matched.has(leftIdx)) return
    if (selected === null) return

    if (selected === leftIdx) {
      // Correct match
      sound.playCorrect()
      const nextMatched = new Set(matched)
      nextMatched.add(leftIdx)
      setMatched(nextMatched)
      setSelected(null)

      // Check if all matched
      if (nextMatched.size === pairs.length) {
        setTimeout(() => {
          onComplete(scene.xpAward)
        }, 400)
      }
    } else {
      // Wrong — shake and deselect
      sound.playWrong()
      setWrongPair(rightIdx)
      setWrongKey(k => k + 1)
      setTimeout(() => { setWrongPair(null); setSelected(null) }, 600)
    }
  }, [selected, rightOrder, matched, pairs.length, onComplete, scene.xpAward, sound])

  if (!pairs.length) {
    return (
      <div style={{ color: "var(--muted)", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", padding: "2rem" }}>
        No matching pairs configured for this scene.
      </div>
    )
  }

  const progress = matched.size / pairs.length
  const accentRgb = accentColor === "#00d4f0" ? "0,212,240" : "224,64,251"

  return (
    <div style={{ paddingBottom: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem",
        }}>
          <span style={{ fontSize: "1.2rem" }}>🔗</span>
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.8rem",
            letterSpacing: "0.25em", textTransform: "uppercase", color: accentColor,
          }}>
            Make the connections
          </span>
        </div>
        {scene.question && (
          <h2 style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700,
            fontSize: "clamp(1.25rem, 3vw, 1.55rem)", color: "#fff", lineHeight: 1.4,
            marginBottom: "0.5rem",
          }}>
            {scene.question}
          </h2>
        )}
        {/* Progress bar */}
        <div style={{
          height: "3px", background: "rgba(255,255,255,0.1)",
          borderRadius: "2px", overflow: "hidden", marginTop: "0.75rem",
        }}>
          <motion.div
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{ height: "100%", background: `linear-gradient(90deg, ${accentColor}, #e040fb)`, borderRadius: "2px" }}
          />
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(240,238,255,0.38)",
          margin: "0.3rem 0 0", letterSpacing: "0.05em",
        }}>
          {matched.size} of {pairs.length} matched
        </p>
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>

        {/* LEFT — concepts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(240,238,255,0.35)", marginBottom: "0.15rem",
          }}>
            Concept
          </div>
          {pairs.map((pair, i) => {
            const isMatched = matched.has(i)
            const isActive  = selected === i
            return (
              <motion.button
                key={i}
                onClick={() => handleLeft(i)}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                style={{
                  width: "100%", textAlign: "left", cursor: isMatched ? "default" : "pointer",
                  height: "90px",
                  background: isMatched
                    ? `rgba(${accentRgb},0.12)`
                    : isActive
                    ? `rgba(${accentRgb},0.15)`
                    : "rgba(255,255,255,0.04)",
                  border: isMatched
                    ? `1.5px solid rgba(${accentRgb},0.55)`
                    : isActive
                    ? `1.5px solid rgba(${accentRgb},0.7)`
                    : "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "0.5rem 0.85rem",
                  fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.92rem",
                  color: isMatched ? accentColor : isActive ? "#fff" : "rgba(240,238,255,0.85)",
                  lineHeight: 1.35,
                  transition: "all 0.22s ease",
                  boxShadow: isActive ? `0 0 20px rgba(${accentRgb},0.25)` : "none",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem",
                }}
              >
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{pair.left}</span>
                {isMatched && <span style={{ fontSize: "1rem", flexShrink: 0 }}>✓</span>}
                {isActive  && <span style={{ fontSize: "0.8rem", flexShrink: 0, opacity: 0.7 }}>→</span>}
              </motion.button>
            )
          })}
        </div>

        {/* RIGHT — definitions (shuffled) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(240,238,255,0.35)", marginBottom: "0.15rem",
          }}>
            What it does
          </div>
          {rightOrder.map((leftIdx, displayIdx) => {
            const pair = pairs[leftIdx]
            const isMatched  = matched.has(leftIdx)
            const isWrong    = wrongPair === displayIdx
            const canConnect = selected !== null && !isMatched

            return (
              <motion.button
                key={displayIdx}
                onClick={() => handleRight(displayIdx)}
                animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : { x: 0 }}
                transition={isWrong ? { duration: 0.4, ease: "easeOut" } : undefined}
                whileTap={canConnect && !isWrong ? { scale: 0.97 } : {}}
                style={{
                  width: "100%", textAlign: "left",
                  cursor: isMatched ? "default" : canConnect ? "pointer" : "default",
                  height: "90px",
                  background: isMatched
                    ? `rgba(${accentRgb},0.12)`
                    : isWrong
                    ? "rgba(255,75,75,0.1)"
                    : canConnect
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.03)",
                  border: isMatched
                    ? `1.5px solid rgba(${accentRgb},0.55)`
                    : isWrong
                    ? "1.5px solid rgba(255,75,75,0.45)"
                    : canConnect
                    ? "1.5px dashed rgba(255,255,255,0.3)"
                    : "1.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "0.5rem 0.85rem",
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontWeight: 500, fontSize: "1.02rem",
                  color: isMatched ? accentColor : isWrong ? "#ff8080" : "rgba(240,238,255,0.78)",
                  lineHeight: 1.35,
                  transition: "all 0.22s ease",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem",
                }}
              >
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{pair.right}</span>
                {isMatched && <span style={{ fontSize: "1rem", flexShrink: 0 }}>✓</span>}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* All matched — celebration */}
      <AnimatePresence>
        {matched.size === pairs.length && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.2 }}
            style={{
              marginTop: "1.5rem", textAlign: "center",
              background: `rgba(${accentRgb},0.08)`,
              border: `1px solid rgba(${accentRgb},0.35)`,
              borderRadius: "14px", padding: "1rem 1.5rem",
            }}
          >
            <div style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
              fontSize: "1.38rem", color: "#fff", marginBottom: "0.5rem",
            }}>
              Every connection made. The pattern is yours.
            </div>
            <button
              onClick={() => { sound.playClick(); onComplete(scene.xpAward) }}
              style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.9rem",
                color: "#08060f", background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
                padding: "0.65rem 2rem", borderRadius: "100px", border: "none", cursor: "pointer",
                boxShadow: `0 0 24px rgba(${accentRgb},0.35)`,
              }}
            >
              Continue →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
