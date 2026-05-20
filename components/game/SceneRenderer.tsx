"use client"

import { Scene, Choice } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"

type Props = {
  scene: Scene
  answered: boolean
  selectedLabel: string | null
  onAnswer: (choice: Choice) => void
  onNext: () => void
}

export default function SceneRenderer({ scene, answered, selectedLabel, onAnswer, onNext }: Props) {
  const correctChoice = scene.choices?.find((c) => c.correct)

  if (scene.type === "revelation") {
    return (
      <div style={{ textAlign: "center", padding: "0 1rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "2rem" }}>✨</div>
        <blockquote style={{
          fontFamily: "Cormorant Garamond, serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          color: "#fff",
          lineHeight: 1.4,
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem",
        }}>
          &ldquo;{scene.revealText}&rdquo;
        </blockquote>
        <div style={{ color: "var(--cyan)", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "2.5rem" }}>
          +{scene.xpAward} XP
        </div>
        <button
          onClick={onNext}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#08060f",
            background: "linear-gradient(90deg,#00d4f0,#e040fb)",
            padding: "0.85rem 2.5rem",
            borderRadius: "100px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Scenario / NPC text */}
      {(scene.scenarioText || scene.npcLine) && (
        <div
          className="glass-card"
          style={{
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            borderLeft: "3px solid var(--cyan)",
          }}
        >
          {scene.npcLine && (
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "var(--cyan)", marginBottom: scene.scenarioText ? "0.75rem" : 0 }}>
              &ldquo;{scene.npcLine}&rdquo;
            </p>
          )}
          {scene.scenarioText && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.85)", lineHeight: 1.7 }}>
              {scene.scenarioText}
            </p>
          )}
        </div>
      )}

      {/* Question */}
      {scene.question && (
        <h2 style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "#fff",
          lineHeight: 1.4,
          marginBottom: "1.5rem",
        }}>
          {scene.question}
        </h2>
      )}

      {/* Choices */}
      {scene.choices && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
          {scene.choices.map((choice, i) => (
            <ChoiceButton
              key={choice.label}
              choice={choice}
              index={i}
              answered={answered}
              selectedLabel={selectedLabel}
              onSelect={onAnswer}
            />
          ))}
        </div>
      )}

      {/* Next button (after answer) */}
      {answered && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button
            onClick={onNext}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#08060f",
              background: "linear-gradient(90deg,#00d4f0,#e040fb)",
              padding: "0.75rem 2rem",
              borderRadius: "100px",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Next Scene →
          </button>
        </div>
      )}
    </div>
  )
}
