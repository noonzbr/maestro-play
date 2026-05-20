"use client"

import { useState, useEffect, useCallback } from "react"
import GameIcon from "./GameIcon"

type Props = {
  onComplete: () => void
  startMusic: () => void
}

const PANELS = [
  {
    icon: "guitar" as const,
    label: "THE GUITARIST",
    lines: [
      "Meet Marco.",
      "17 years old.",
      "Guitar for three hours,\nevery single day.",
    ],
  },
  {
    icon: "gramophone" as const,
    label: null,
    lines: [
      "His bandmates just released a full EP.",
      "Made entirely with AI.",
      "In one weekend.",
      "Marco was still tabbing the same riff.",
      "For three weeks.",
    ],
  },
  {
    icon: "baton" as const,
    label: "THE DISCOVERY",
    lines: [
      "What if AI doesn't replace musicians —",
      "it needs them?",
      "What if the best AI users",
      "are the ones who already speak music?",
    ],
  },
  {
    icon: "musicNotes" as const,
    label: "THIS IS MARCO'S STORY.",
    lines: [
      "A guitarist who became a conductor.",
      "An AI orchestra waiting for its maestro.",
    ],
    isFinal: true,
  },
] as const

export default function StoryIntro({ onComplete, startMusic }: Props) {
  const [panel, setPanel] = useState(0)
  const [visibleLines, setVisibleLines] = useState(0)
  const [started, setStarted] = useState(false)
  const [exiting, setExiting] = useState(false)

  // Inject keyframes once
  useEffect(() => {
    const id = "story-intro-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes si-line-in {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes si-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes si-char-glow {
        0%,100% { filter: drop-shadow(0 0 12px rgba(0,212,240,0.3)); }
        50%     { filter: drop-shadow(0 0 32px rgba(0,212,240,0.7)); }
      }
      @keyframes si-exit {
        from { opacity: 1; transform: scale(1); }
        to   { opacity: 0; transform: scale(1.04); }
      }
      @keyframes si-icon-spin {
        from { transform: scale(0.6) rotate(-20deg); opacity: 0; }
        to   { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      @keyframes spotlight-pulse {
        0%,100% { opacity: 0.55; }
        50%     { opacity: 0.75; }
      }
    `
    document.head.appendChild(s)
  }, [])

  // Auto-reveal lines one by one
  useEffect(() => {
    setVisibleLines(0)
    const current = PANELS[panel]
    let i = 0
    const reveal = () => {
      i++
      setVisibleLines(i)
      if (i < current.lines.length) {
        const delay = current.lines[i - 1].length > 30 ? 900 : 700
        setTimeout(reveal, delay)
      }
    }
    const t = setTimeout(reveal, 400)
    return () => clearTimeout(t)
  }, [panel])

  const advance = useCallback(() => {
    if (!started) {
      setStarted(true)
      startMusic()
    }
    const allRevealed = visibleLines >= PANELS[panel].lines.length
    if (!allRevealed) {
      // Skip to full reveal instantly
      setVisibleLines(PANELS[panel].lines.length)
      return
    }
    if (panel < PANELS.length - 1) {
      setPanel(p => p + 1)
    }
  }, [panel, visibleLines, started, startMusic])

  const handleBegin = useCallback(() => {
    if (!started) startMusic()
    setExiting(true)
    setTimeout(onComplete, 600)
  }, [started, startMusic, onComplete])

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["Space", "ArrowRight", "Enter"].includes(e.code)) advance()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [advance])

  const current = PANELS[panel]
  const allRevealed = visibleLines >= current.lines.length

  return (
    <div
      onClick={!current.isFinal ? advance : undefined}
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
        cursor: current.isFinal ? "default" : "pointer",
        animation: exiting ? "si-exit 0.6s ease forwards" : "si-fade-in 0.5s ease both",
        userSelect: "none",
      }}
    >
      {/* Ambient dark gradient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,240,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(123,47,190,0.08) 0%, transparent 50%)",
      }} />

      {/* Spotlight from above */}
      <div style={{
        position: "absolute",
        top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "480px",
        height: "70vh",
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,240,0.12) 0%, rgba(123,47,190,0.06) 40%, transparent 70%)",
        pointerEvents: "none",
        animation: "spotlight-pulse 4s ease-in-out infinite",
      }} />

      {/* Character image */}
      <div style={{
        position: "absolute",
        bottom: "200px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "220px",
        animation: "si-char-glow 4s ease-in-out infinite, si-fade-in 1s ease both",
        zIndex: 5,
      }}>
        {/* Fade-out masks on all edges so the image blends seamlessly */}
        <div style={{ position: "relative" }}>
          <img
            src="/images/guitarplayer1.png"
            alt="Marco"
            style={{ width: "100%", display: "block" }}
          />
          {/* bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)", pointerEvents: "none" }} />
          {/* left */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "22%", background: "linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)", pointerEvents: "none" }} />
          {/* right */}
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "22%", background: "linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)", pointerEvents: "none" }} />
          {/* top */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to bottom, var(--bg-primary) 0%, transparent 100%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Story card — bottom panel */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "500px",
        padding: "0 1.5rem 2rem",
        animation: "si-fade-in 0.6s ease both",
      }}>
        <div style={{
          background: "rgba(8,6,15,0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,212,240,0.15)",
          borderRadius: "20px",
          padding: "1.5rem 1.75rem",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}>
          {/* Icon + label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <GameIcon name={current.icon} size={40} style={{ animation: "si-icon-spin 0.5s cubic-bezier(0.16,1,0.3,1) both" }} />
            {current.label && (
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--cyan)",
              }}>
                {current.label}
              </span>
            )}
          </div>

          {/* Story lines */}
          <div style={{ minHeight: "6rem", marginBottom: "1.25rem" }}>
            {current.lines.slice(0, visibleLines).map((line, i) => (
              <p key={`${panel}-${i}`} style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1rem, 4vw, 1.25rem)",
                color: i === 0 ? "#fff" : "rgba(240,238,255,0.75)",
                lineHeight: 1.5,
                margin: "0 0 0.35rem",
                animation: "si-line-in 0.45s cubic-bezier(0.16,1,0.3,1) both",
                whiteSpace: "pre-line",
              }}>
                {line}
              </p>
            ))}
          </div>

          {/* Final panel: all 9 icons + begin button */}
          {current.isFinal && allRevealed ? (
            <>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                animation: "si-fade-in 0.6s 0.3s ease both",
              }}>
                {(["guitar","baton","musicNotes","tuningFork","gramophone","harp","metronome","headphones","volume"] as const).map(icon => (
                  <GameIcon key={icon} name={icon} size={38} />
                ))}
              </div>
              <button
                onClick={handleBegin}
                style={{
                  width: "100%",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#08060f",
                  background: "linear-gradient(90deg,#00d4f0,#e040fb)",
                  padding: "0.9rem",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  animation: "si-fade-in 0.6s 0.5s ease both",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.35)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
              >
                Begin Marco&apos;s Journey →
              </button>
            </>
          ) : !current.isFinal ? (
            /* Tap-to-continue footer */
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              {/* Panel dots */}
              <div style={{ display: "flex", gap: "6px" }}>
                {PANELS.map((_, i) => (
                  <div key={i} style={{
                    width: i === panel ? "18px" : "6px",
                    height: "4px",
                    borderRadius: "2px",
                    background: i === panel ? "var(--cyan)" : i < panel ? "rgba(0,212,240,0.4)" : "rgba(255,255,255,0.15)",
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: allRevealed ? "rgba(0,212,240,0.7)" : "rgba(255,255,255,0.3)",
                transition: "color 0.4s ease",
              }}>
                {allRevealed ? "tap to continue →" : "..."}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
