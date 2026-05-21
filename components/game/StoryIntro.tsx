"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import GameIcon from "./GameIcon"

type Props = {
  onComplete: () => void
  startMusic: () => void
}

type Panel = {
  icon: "guitar" | "gramophone" | "baton" | "musicNotes"
  label: string | null
  lines: string[]
  isFinal?: boolean
}

const PANELS: Panel[] = [
  {
    icon: "guitar",
    label: "THE GUITARIST",
    lines: [
      "Meet Jake.",
      "17 years old.",
      "Guitar for three hours,\nevery single day.",
    ],
  },
  {
    icon: "gramophone",
    label: null,
    lines: [
      "His bandmates just released a full EP.",
      "Made entirely with AI.",
      "In one weekend.",
      "Jake was still tabbing the same riff.",
      "For three weeks.",
    ],
  },
  {
    icon: "baton",
    label: "THE DISCOVERY",
    lines: [
      "What if AI doesn't replace musicians —",
      "it needs them?",
      "What if the best AI users",
      "are the ones who already speak music?",
    ],
  },
  {
    icon: "musicNotes",
    label: "THIS IS JAKE'S STORY.",
    lines: [
      "A guitarist who became a conductor.",
      "An AI orchestra waiting for its maestro.",
    ],
    isFinal: true,
  },
]

export default function StoryIntro({ onComplete, startMusic }: Props) {
  const [panel, setPanel] = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)
  const [exiting, setExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = PANELS[panel]
  const fullText = current.lines.join("\n")

  useEffect(() => {
    const id = "story-intro-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
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
      @keyframes cursor-blink {
        0%,49% { opacity: 1; }
        50%,100% { opacity: 0; }
      }
    `
    document.head.appendChild(s)
  }, [])

  // Start typewriter when panel changes
  useEffect(() => {
    setDisplayed(0)
    setDone(false)
    if (timerRef.current) clearInterval(timerRef.current)
    if (initRef.current) clearTimeout(initRef.current)

    initRef.current = setTimeout(() => {
      let i = 0
      timerRef.current = setInterval(() => {
        i++
        setDisplayed(i)
        if (i >= fullText.length) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          setDone(true)
        }
      }, 38)
    }, 350)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (initRef.current) clearTimeout(initRef.current)
    }
  }, [panel]) // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(() => {
    if (!started) {
      setStarted(true)
      startMusic()
    }
    if (!done) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
      if (initRef.current) { clearTimeout(initRef.current); initRef.current = null }
      setDisplayed(fullText.length)
      setDone(true)
      return
    }
    if (current.isFinal) return
    if (panel < PANELS.length - 1) setPanel(p => p + 1)
  }, [panel, done, started, startMusic, fullText, current])

  const handleBegin = useCallback(() => {
    if (!started) startMusic()
    setExiting(true)
    setTimeout(onComplete, 600)
  }, [started, startMusic, onComplete])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["Space", "ArrowRight", "Enter"].includes(e.code)) advance()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [advance])

  const typedText = fullText.slice(0, displayed)
  const typedLines = typedText.split("\n")

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
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,240,0.06) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(123,47,190,0.08) 0%, transparent 50%)",
      }} />

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

      <div style={{
        position: "absolute",
        bottom: "200px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "220px",
        animation: "si-char-glow 4s ease-in-out infinite, si-fade-in 1s ease both",
        zIndex: 5,
      }}>
        <img src="/images/guitarplayer1.png" alt="Jake" style={{ width: "100%", display: "block" }} />
      </div>

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
          borderTop: "1px solid rgba(0,212,240,0.15)",
          borderRight: "1px solid rgba(0,212,240,0.15)",
          borderBottom: "1px solid rgba(0,212,240,0.15)",
          borderLeft: "1px solid rgba(0,212,240,0.15)",
          borderRadius: "20px",
          padding: "1.5rem 1.75rem",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}>
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

          <div style={{ minHeight: "6rem", marginBottom: "1.25rem" }}>
            {typedLines.map((line, i) => {
              const isCurrentLine = i === typedLines.length - 1
              return (
                <p key={`${panel}-${i}`} style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(1rem, 4vw, 1.25rem)",
                  color: i === 0 ? "#fff" : "rgba(240,238,255,0.75)",
                  lineHeight: 1.5,
                  margin: "0 0 0.35rem",
                  whiteSpace: "pre-line",
                }}>
                  {line}
                  {isCurrentLine && !done && (
                    <span style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1em",
                      background: "var(--cyan)",
                      marginLeft: "2px",
                      verticalAlign: "middle",
                      animation: "cursor-blink 0.9s step-end infinite",
                    }} />
                  )}
                </p>
              )
            })}
          </div>

          {current.isFinal && done ? (
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
                animation: "si-fade-in 0.6s 0.3s ease both",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.35)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
            >
              Begin Jake&apos;s Journey →
            </button>
          ) : !current.isFinal ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
                color: done ? "rgba(0,212,240,0.7)" : "rgba(255,255,255,0.25)",
                transition: "color 0.4s ease",
              }}>
                {done ? "tap to continue →" : "..."}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
