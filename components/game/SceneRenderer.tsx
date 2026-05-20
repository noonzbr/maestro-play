"use client"

import { useEffect, useState } from "react"
import { Scene, Choice } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"

type Props = {
  scene: Scene
  answered: boolean
  selectedLabel: string | null
  onAnswer: (choice: Choice) => void
  onNext: () => void
  streakCount?: number
}

function useTypewriter(text: string, speed = 18, active = true) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) { setDisplayed(text); setDone(true); return }
    setDisplayed("")
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, active])

  return { displayed, done }
}

function RevelationScene({ scene, onNext }: { scene: Scene; onNext: () => void }) {
  const text = scene.revealText || ""
  const { displayed, done } = useTypewriter(text, 22)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (done) setTimeout(() => setShowButton(true), 600)
  }, [done])

  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem", position: "relative" }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.08) 40%, transparent 70%)",
        pointerEvents: "none",
        animation: "revelation-glow 4s ease-in-out infinite",
      }} />

      {/* Musical note */}
      <div style={{
        fontSize: "3.5rem",
        marginBottom: "2rem",
        filter: "drop-shadow(0 0 20px rgba(0,212,240,0.6))",
        animation: "float 6s ease-in-out infinite",
        display: "inline-block",
      }}>
        ♪
      </div>

      {/* Typewriter quote */}
      <blockquote style={{
        fontFamily: "Cormorant Garamond, serif",
        fontStyle: "italic",
        fontWeight: 300,
        fontSize: "clamp(1.4rem, 4vw, 2rem)",
        color: "#fff",
        lineHeight: 1.5,
        maxWidth: "560px",
        margin: "0 auto 2.5rem",
        position: "relative",
        zIndex: 1,
        minHeight: "6rem",
      }}>
        &ldquo;{displayed}{!done && <span style={{ animation: "pulse-glow 0.7s ease-in-out infinite", color: "var(--cyan)" }}>|</span>}&rdquo;
      </blockquote>

      {/* XP award */}
      {done && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(0,212,240,0.08)",
          border: "1px solid rgba(0,212,240,0.2)",
          borderRadius: "100px",
          padding: "0.5rem 1.25rem",
          marginBottom: "2.5rem",
          animation: "scene-fade-in 0.5s ease both",
        }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem", color: "var(--cyan)" }}>
            +{scene.xpAward} XP
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)" }}>
            revelation bonus
          </span>
        </div>
      )}

      {/* CTA */}
      {showButton && (
        <div style={{ animation: "scene-fade-in 0.5s ease both" }}>
          <button
            onClick={onNext}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#08060f",
              background: "linear-gradient(90deg,#00d4f0,#e040fb)",
              padding: "0.9rem 2.5rem",
              borderRadius: "100px",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.3)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

export default function SceneRenderer({ scene, answered, selectedLabel, onAnswer, onNext, streakCount = 0 }: Props) {
  if (scene.type === "revelation") {
    return <RevelationScene scene={scene} onNext={onNext} />
  }

  const isBoss = scene.type === "boss"

  return (
    <div>
      {/* Character / location cinematic header */}
      {(scene.character || scene.location) && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {scene.character && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              background: isBoss ? "rgba(224,64,251,0.08)" : "rgba(0,212,240,0.07)",
              border: `1px solid ${isBoss ? "rgba(224,64,251,0.22)" : "rgba(0,212,240,0.2)"}`,
              borderRadius: "100px",
              padding: "0.28rem 0.75rem",
            }}>
              <span style={{ fontSize: "0.8rem" }}>{isBoss ? "⚡" : "🎸"}</span>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: isBoss ? "var(--pink)" : "var(--cyan)",
              }}>
                {scene.character}
              </span>
            </div>
          )}
          {scene.location && (
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.66rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              fontWeight: 500,
            }}>
              {scene.location}
            </span>
          )}
        </div>
      )}

      {/* Scenario card */}
      {(scene.scenarioText || scene.npcLine) && (
        <div style={{
          background: isBoss ? "rgba(224,64,251,0.04)" : "rgba(0,212,240,0.04)",
          border: `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
          borderLeft: `3px solid ${isBoss ? "var(--pink)" : "var(--cyan)"}`,
          borderRadius: "0 12px 12px 0",
          padding: "1.25rem 1.5rem",
          marginBottom: "2rem",
        }}>
          {scene.npcLine && (
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: isBoss ? "var(--pink)" : "var(--cyan)", marginBottom: scene.scenarioText ? "0.75rem" : 0, lineHeight: 1.5 }}>
              &ldquo;{scene.npcLine}&rdquo;
            </p>
          )}
          {scene.scenarioText && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.925rem", color: "rgba(240,238,255,0.85)", lineHeight: 1.75 }}>
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
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          color: "#fff",
          lineHeight: 1.45,
          marginBottom: "1.5rem",
          letterSpacing: "-0.01em",
        }}>
          {scene.question}
        </h2>
      )}

      {/* Choices */}
      {scene.choices && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.5rem" }}>
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

      {/* Streak bonus callout */}
      {answered && streakCount >= 2 && scene.choices?.find(c => c.label === selectedLabel)?.correct && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(224,64,251,0.08)",
          border: "1px solid rgba(224,64,251,0.2)",
          borderRadius: "10px",
          padding: "0.65rem 1rem",
          marginBottom: "1rem",
          animation: "scene-fade-in 0.4s ease both",
        }}>
          <span style={{ fontSize: "1rem" }}>🔥</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.825rem", color: "var(--pink)" }}>
            {streakCount} in a row! Streak bonus active.
          </span>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.25rem", animation: "scene-fade-in 0.4s ease both" }}>
          <button
            onClick={onNext}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#08060f",
              background: "linear-gradient(90deg,#00d4f0,#e040fb)",
              padding: "0.8rem 2.25rem",
              borderRadius: "100px",
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(0,212,240,0.3)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
          >
            Next Scene →
          </button>
        </div>
      )}
    </div>
  )
}
