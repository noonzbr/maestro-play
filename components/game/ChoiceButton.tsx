"use client"

import { useState } from "react"
import { Choice } from "@/lib/games/types"

type Props = {
  choice: Choice
  index: number
  answered: boolean
  selectedLabel: string | null
  onSelect: (choice: Choice) => void
}

export default function ChoiceButton({ choice, index, answered, selectedLabel, onSelect }: Props) {
  const isSelected = selectedLabel === choice.label
  const isCorrect = choice.correct
  const showResult = answered

  const getBorderColor = () => {
    if (!showResult) return "rgba(255,255,255,0.1)"
    if (isCorrect) return "rgba(0,255,128,0.6)"
    if (isSelected && !isCorrect) return "rgba(255,80,80,0.6)"
    return "rgba(255,255,255,0.05)"
  }

  const getBg = () => {
    if (!showResult) return isSelected ? "rgba(0,212,240,0.08)" : "rgba(255,255,255,0.03)"
    if (isCorrect) return "rgba(0,255,128,0.06)"
    if (isSelected && !isCorrect) return "rgba(255,80,80,0.06)"
    return "rgba(255,255,255,0.02)"
  }

  const getGlow = () => {
    if (!showResult) return "none"
    if (isCorrect) return "0 0 20px rgba(0,255,128,0.2)"
    if (isSelected && !isCorrect) return "0 0 20px rgba(255,80,80,0.2)"
    return "none"
  }

  const labels = ["A", "B", "C", "D"]

  return (
    <button
      onClick={() => !answered && onSelect(choice)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "1.2rem 1.5rem",
        borderRadius: "12px",
        border: `1px solid ${getBorderColor()}`,
        background: getBg(),
        boxShadow: getGlow(),
        cursor: answered ? "default" : "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
      onMouseEnter={e => {
        if (!answered) {
          e.currentTarget.style.borderColor = "rgba(0,212,240,0.4)"
          e.currentTarget.style.background = "rgba(0,212,240,0.06)"
        }
      }}
      onMouseLeave={e => {
        if (!answered) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
          e.currentTarget.style.background = isSelected ? "rgba(0,212,240,0.08)" : "rgba(255,255,255,0.03)"
        }
      }}
    >
      {/* Label badge */}
      <div style={{
        minWidth: "28px",
        height: "28px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "0.75rem",
        background: showResult && isCorrect ? "rgba(0,255,128,0.2)" : showResult && isSelected ? "rgba(255,80,80,0.2)" : "rgba(255,255,255,0.08)",
        color: showResult && isCorrect ? "#00ff80" : showResult && isSelected ? "#ff5050" : "rgba(240,238,255,0.6)",
        flexShrink: 0,
        marginTop: "1px",
      }}>
        {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : labels[index]}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontSize: "0.925rem",
          color: showResult && isCorrect ? "#00ff80" : showResult && isSelected && !isCorrect ? "#ff8080" : "#fff",
          lineHeight: 1.5,
          marginBottom: showResult && (isCorrect || isSelected) ? "0.75rem" : 0,
        }}>
          {choice.text}
        </p>

        {/* Feedback */}
        {showResult && (isCorrect || isSelected) && (
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.825rem",
            color: "rgba(240,238,255,0.65)",
            lineHeight: 1.6,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "0.75rem",
          }}>
            {choice.feedback}
          </p>
        )}
      </div>
    </button>
  )
}
