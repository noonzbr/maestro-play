"use client"

import { useState, useEffect } from "react"
import { Choice } from "@/lib/games/types"
import { useSoundEngine } from "./SoundEngine"

type Props = {
  choice: Choice
  index: number
  answered: boolean
  selectedLabel: string | null
  onSelect: (choice: Choice) => void
  dimmed?: boolean
  /** Branching mode: no right/wrong verdict — the chosen option is "your path",
   *  highlighted neutrally; the consequence below is where the learning lives. */
  branching?: boolean
}

// Inject keyframes once
let kfInjected = false
function ensureKeyframes() {
  if (kfInjected || typeof document === "undefined") return
  kfInjected = true
  const id = "choice-btn-kf"
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = `
    @keyframes choice-enter {
      from { opacity:0; transform:translateY(10px) scale(0.96); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes choice-shake {
      0%,100% { transform:translateX(0); }
      18%     { transform:translateX(-10px); }
      36%     { transform:translateX(10px); }
      54%     { transform:translateX(-6px); }
      72%     { transform:translateX(6px); }
      90%     { transform:translateX(-2px); }
    }
    @keyframes choice-correct-pop {
      0%   { transform:scale(1); }
      35%  { transform:scale(1.055); }
      65%  { transform:scale(0.98); }
      100% { transform:scale(1); }
    }
  `
  document.head.appendChild(s)
}

export default function ChoiceButton({ choice, index, answered, selectedLabel, onSelect, dimmed, branching }: Props) {
  const sound = useSoundEngine()
  const isSelected = selectedLabel === choice.label
  const isCorrect  = choice.correct
  const showResult = answered
  const [pressed, setPressed]   = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    ensureKeyframes()
    const t = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(t)
  }, [])

  /* ── colours ── */
  const borderColor = () => {
    if (!showResult) return isSelected ? "rgba(0,212,240,0.6)" : "rgba(255,255,255,0.1)"
    // Branching: the path you took glows in the brand accent; others recede. No verdict.
    if (branching)   return isSelected ? "rgba(0,212,240,0.7)" : "rgba(255,255,255,0.06)"
    if (isCorrect)               return "#58cc02"
    if (isSelected && !isCorrect) return "#ff4b4b"
    return "rgba(255,255,255,0.06)"
  }
  const bgColor = () => {
    if (!showResult) return isSelected ? "rgba(0,212,240,0.11)" : "rgba(255,255,255,0.03)"
    if (branching)   return isSelected ? "rgba(0,212,240,0.13)" : "rgba(255,255,255,0.02)"
    if (isCorrect)               return "rgba(88,204,2,0.13)"
    if (isSelected && !isCorrect) return "rgba(255,75,75,0.11)"
    return "rgba(255,255,255,0.02)"
  }
  /* ── animation ── */
  const getAnim = () => {
    if (!mounted)                           return "none"
    if (branching && showResult && isSelected) return "choice-correct-pop 0.42s cubic-bezier(0.34,1.56,0.64,1) both"
    if (branching)                          return `choice-enter 0.42s cubic-bezier(0.34,1.3,0.64,1) ${index * 72}ms both`
    if (showResult && isSelected && !isCorrect) return "choice-shake 0.45s cubic-bezier(.36,.07,.19,.97) both"
    if (showResult && isCorrect)            return "choice-correct-pop 0.42s cubic-bezier(0.34,1.56,0.64,1) both"
    return `choice-enter 0.42s cubic-bezier(0.34,1.3,0.64,1) ${index * 72}ms both`
  }

  function handleClick() {
    if (answered) return
    sound.playClick()
    setPressed(true)
    setTimeout(() => setPressed(false), 220)
    onSelect(choice)
  }

  return (
    <button
      onClick={handleClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.55rem 1rem",
        borderRadius: "12px",
        border: `2px solid ${borderColor()}`,
        background: bgColor(),
        cursor: answered ? "default" : "pointer",
        display: "flex",
        gap: "0.7rem",
        alignItems: "center",
        opacity: branching
          ? (showResult && !isSelected ? 0.4 : 1)
          : (showResult && !isCorrect && !isSelected ? 0.38 : dimmed ? 0.45 : 1),
        transform: pressed ? "scale(0.962) translateY(2px)" : "scale(1)",
        transition: pressed
          ? "transform 0.08s ease"
          : "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, opacity 0.25s ease",
        boxShadow: branching
          ? (showResult && isSelected ? "0 0 0 3px rgba(0,212,240,0.22), 0 4px 20px rgba(0,212,240,0.12)" : "0 2px 10px rgba(0,0,0,0.28)")
          : showResult && isCorrect
          ? "0 0 0 3px rgba(88,204,2,0.25), 0 4px 20px rgba(88,204,2,0.12)"
          : showResult && isSelected && !isCorrect
          ? "0 0 0 3px rgba(255,75,75,0.25)"
          : "0 2px 10px rgba(0,0,0,0.28)",
        animation: getAnim(),
      }}
      onMouseEnter={e => {
        if (!answered) {
          sound.playHover()
          e.currentTarget.style.transform    = "scale(1.016) translateY(-1px)"
          e.currentTarget.style.borderColor  = "rgba(0,212,240,0.48)"
          e.currentTarget.style.background   = "rgba(0,212,240,0.07)"
          e.currentTarget.style.boxShadow    = "0 6px 20px rgba(0,212,240,0.1)"
        }
      }}
      onMouseLeave={e => {
        if (!answered) {
          e.currentTarget.style.transform   = "scale(1)"
          e.currentTarget.style.borderColor = isSelected ? "rgba(0,212,240,0.6)" : "rgba(255,255,255,0.1)"
          e.currentTarget.style.background  = isSelected ? "rgba(0,212,240,0.11)" : "rgba(255,255,255,0.03)"
          e.currentTarget.style.boxShadow   = "0 2px 10px rgba(0,0,0,0.28)"
        }
      }}
    >
      {/* Left accent bar */}
      <div style={{
        width:        "3px",
        alignSelf:    "stretch",
        borderRadius: "2px",
        flexShrink:   0,
        background: branching
          ? (isSelected ? "rgba(0,212,240,0.65)" : "rgba(255,255,255,0.09)")
          : showResult && isCorrect              ? "#58cc02" :
            showResult && isSelected && !isCorrect ? "#ff4b4b" :
            isSelected                            ? "rgba(0,212,240,0.55)" :
                                                   "rgba(255,255,255,0.09)",
        transition: "background 0.22s ease",
      }} />

      {/* Decision text — short choices (≤50 chars) read upright; long ones keep italic */}
      <span style={{
        fontFamily: "Cormorant Garamond, serif",
        fontStyle:  choice.text.length > 50 ? "italic" : "normal",
        fontWeight: choice.text.length > 50 ? 600 : 700,
        fontSize:   choice.text.length > 80 ? "0.88rem" : "0.96rem",
        color: branching
          ? (isSelected ? "#fff" : "rgba(240,238,255,0.92)")
          : showResult && isCorrect              ? "#7dff6b" :
            showResult && isSelected && !isCorrect ? "#ff8080" :
                                                     "rgba(240,238,255,0.92)",
        lineHeight: 1.55,
        flex: 1,
      }}>
        {choice.text}
      </span>

      {/* Trailing indicator — branching shows a neutral "your path" arrow, never ✓/✗ */}
      {branching ? (
        <div style={{
          flexShrink: 0,
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: showResult && isSelected ? "rgba(0,212,240,0.9)" : "rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", gap: "0.3rem",
          transition: "color 0.22s ease",
        }}>
          {showResult && isSelected ? "Your path →" : answered ? "" : "›"}
        </div>
      ) : (
        <div style={{
          width:      "24px",
          height:     "24px",
          borderRadius:"50%",
          display:    "flex",
          alignItems: "center",
          justifyContent:"center",
          flexShrink: 0,
          background: showResult && isCorrect              ? "#58cc02" :
                      showResult && isSelected && !isCorrect ? "#ff4b4b" :
                                                             "transparent",
          color: showResult && (isCorrect || (isSelected && !isCorrect)) ? "#fff" :
                 "rgba(255,255,255,0.2)",
          fontSize:   showResult && (isCorrect || (isSelected && !isCorrect)) ? "0.8rem" : "0.85rem",
          fontWeight: 800,
          transition: "all 0.22s ease",
        }}>
          {showResult && isCorrect              ? "✓" :
           showResult && isSelected && !isCorrect ? "✗" :
           answered                              ? "" : "›"}
        </div>
      )}
    </button>
  )
}
