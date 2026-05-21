"use client"

import { useState, useEffect } from "react"
import { Choice } from "@/lib/games/types"

type Props = {
  choice: Choice
  index: number
  answered: boolean
  selectedLabel: string | null
  onSelect: (choice: Choice) => void
  dimmed?: boolean
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

export default function ChoiceButton({ choice, index, answered, selectedLabel, onSelect, dimmed }: Props) {
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
    if (isCorrect)               return "#58cc02"
    if (isSelected && !isCorrect) return "#ff4b4b"
    return "rgba(255,255,255,0.06)"
  }
  const bgColor = () => {
    if (!showResult) return isSelected ? "rgba(0,212,240,0.11)" : "rgba(255,255,255,0.03)"
    if (isCorrect)               return "rgba(88,204,2,0.13)"
    if (isSelected && !isCorrect) return "rgba(255,75,75,0.11)"
    return "rgba(255,255,255,0.02)"
  }
  const labels = ["A", "B", "C", "D"]

  /* ── animation ── */
  const getAnim = () => {
    if (!mounted)                           return "none"
    if (showResult && isSelected && !isCorrect) return "choice-shake 0.45s cubic-bezier(.36,.07,.19,.97) both"
    if (showResult && isCorrect)            return "choice-correct-pop 0.42s cubic-bezier(0.34,1.56,0.64,1) both"
    return `choice-enter 0.42s cubic-bezier(0.34,1.3,0.64,1) ${index * 72}ms both`
  }

  function handleClick() {
    if (answered) return
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
        padding: "0.62rem 1rem",
        borderRadius: "12px",
        border: `2px solid ${borderColor()}`,
        background: bgColor(),
        cursor: answered ? "default" : "pointer",
        display: "flex",
        gap: "0.9rem",
        alignItems: "center",
        opacity: showResult && !isCorrect && !isSelected ? 0.38 : dimmed ? 0.45 : 1,
        transform: pressed ? "scale(0.962) translateY(2px)" : "scale(1)",
        transition: pressed
          ? "transform 0.08s ease"
          : "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, opacity 0.25s ease",
        boxShadow: showResult && isCorrect
          ? "0 0 0 3px rgba(88,204,2,0.25), 0 4px 20px rgba(88,204,2,0.12)"
          : showResult && isSelected && !isCorrect
          ? "0 0 0 3px rgba(255,75,75,0.25)"
          : "0 2px 10px rgba(0,0,0,0.28)",
        animation: getAnim(),
      }}
      onMouseEnter={e => {
        if (!answered) {
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
      {/* Circle badge */}
      <div style={{
        minWidth: "30px",
        height: "30px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        fontWeight: 800,
        fontSize: showResult && (isCorrect || (isSelected && !isCorrect)) ? "1rem" : "0.78rem",
        flexShrink: 0,
        border: `2px solid ${
          showResult && isCorrect        ? "#58cc02" :
          showResult && isSelected       ? "#ff4b4b" :
          isSelected                     ? "rgba(0,212,240,0.45)" :
                                           "rgba(255,255,255,0.1)"
        }`,
        background: showResult && isCorrect        ? "#58cc02" :
                    showResult && isSelected        ? "#ff4b4b" :
                    isSelected                      ? "rgba(0,212,240,0.18)" :
                                                      "rgba(255,255,255,0.06)",
        color: showResult && (isCorrect || (isSelected && !isCorrect)) ? "#fff" :
               isSelected                           ? "var(--cyan)" :
                                                      "rgba(240,238,255,0.55)",
        transition: "all 0.22s ease",
      }}>
        {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : labels[index]}
      </div>

      {/* Text */}
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: "0.925rem",
        color: showResult && isCorrect        ? "#7dff6b" :
               showResult && isSelected       ? "#ff8080" :
                                                "#f0eeff",
        lineHeight: 1.45,
        flex: 1,
      }}>
        {choice.text}
      </span>

      {/* Arrow hint (unanswered) */}
      {!answered && (
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.85rem", flexShrink: 0 }}>›</span>
      )}
    </button>
  )
}
