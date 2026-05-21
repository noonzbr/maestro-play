"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type Beat = {
  type: "location" | "narration" | "dialogue" | "final"
  speaker?: string
  text: string
}

const BEATS: Beat[] = [
  { type: "location",  text: "BEDROOM · TUESDAY · 11:47 PM" },
  { type: "narration", text: "Three hours a day. Every single day. Jake lived inside the notes." },
  { type: "dialogue",  speaker: "Tyler", text: "I made an entire EP this weekend with AI. While you were tabbing that one riff. For the third week." },
  { type: "final",     text: "The world changed while he was perfecting the riff. But perfection has its own kind of power." },
]

const FLOAT_NOTES = ["♪", "♫", "♩", "♬", "♪", "♩"]

function useTypewriter(text: string, speed: number) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed("")
    setDone(false)
    if (!text) { setDone(true); return }
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setDone(true) }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return { displayed, done }
}

type Props = {
  onComplete: () => void
  startMusic: () => void
}

export default function CinematicIntro({ onComplete, startMusic }: Props) {
  const [beatIndex, setBeatIndex] = useState(0)
  const [skip, setSkip] = useState(false)
  const [started, setStarted] = useState(false)
  const [exiting, setExiting] = useState(false)
  const advanceRef = useRef<() => void>(() => {})

  useEffect(() => {
    const id = "cinematic-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes cin-fade-in   { from { opacity:0; } to { opacity:1; } }
      @keyframes cin-exit      { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(1.04); } }
      @keyframes cin-ken-burns { from { transform:scale(1); } to { transform:scale(1.09); } }
      @keyframes cin-cursor    { 0%,49%{opacity:1;} 50%,100%{opacity:0;} }
      @keyframes cin-pulse     { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
      @keyframes note-rise-0   { 0%{transform:translateY(0) rotate(-12deg) scale(1);opacity:0;} 8%{opacity:1;} 100%{transform:translateY(-200px) rotate(18deg) scale(0.4);opacity:0;} }
      @keyframes note-rise-1   { 0%{transform:translateY(0) rotate(6deg) scale(0.85);opacity:0;} 12%{opacity:1;} 100%{transform:translateY(-240px) rotate(-20deg) scale(0.35);opacity:0;} }
      @keyframes note-rise-2   { 0%{transform:translateY(0) rotate(-4deg) scale(1.1);opacity:0;} 10%{opacity:1;} 100%{transform:translateY(-170px) rotate(28deg) scale(0.5);opacity:0;} }
    `
    document.head.appendChild(s)
  }, [])

  const beat = BEATS[beatIndex]
  const isLast = beatIndex >= BEATS.length - 1
  const speed = beat.type === "location" ? 0 : 30

  const { displayed, done } = useTypewriter(skip ? "" : beat.text, speed)
  const visibleText = skip ? beat.text : displayed
  const textDone = skip || done

  const advance = useCallback(() => {
    // Start music on first tap — no-op if VideoIntro already started it
    if (!started) { setStarted(true); startMusic() }
    if (!textDone) { setSkip(true); return }
    if (isLast) { setExiting(true); setTimeout(onComplete, 700); return }
    setSkip(false)
    setBeatIndex(i => i + 1)
  }, [started, textDone, isLast, onComplete, startMusic])

  useEffect(() => { advanceRef.current = advance }, [advance])
  useEffect(() => { setSkip(false) }, [beatIndex])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["Space", "Enter", "ArrowRight"].includes(e.code)) {
        e.preventDefault()
        advanceRef.current()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const isDialogue = beat.type === "dialogue"

  return (
    <div
      onClick={advance}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
        zIndex: 100,
        animation: exiting ? "cin-exit 0.7s ease forwards" : "cin-fade-in 1.4s ease both",
      }}
    >
      {/* Background — full scene, height-filled, centered */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050810",
      }}>
        <img
          src="/images/jakebedroom.png"
          alt=""
          draggable={false}
          style={{
            height: "100%",
            width: "auto",
            display: "block",
            animation: "cin-ken-burns 30s ease-in-out forwards",
          }}
        />
      </div>

      {/* Left + right edge fades — blends into dark bg */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, #050810 0%, transparent 20%, transparent 80%, #050810 100%)",
        pointerEvents: "none",
      }} />

      {/* Bottom fade for dialogue readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, transparent 45%, rgba(5,8,16,0.65) 70%, rgba(5,8,16,0.97) 100%)",
        pointerEvents: "none",
      }} />

      {/* Floating golden notes rising from laptop glow area */}
      {FLOAT_NOTES.map((note, i) => (
        <div key={i} style={{
          position: "absolute",
          bottom: "38%",
          left: `${54 + (i % 4) * 5}%`,
          fontSize: `${1.1 + (i % 3) * 0.35}rem`,
          color: "#f5c518",
          pointerEvents: "none",
          filter: "drop-shadow(0 0 10px rgba(245,197,24,0.9))",
          animation: `note-rise-${i % 3} ${3.2 + i * 0.65}s ease-in-out ${i * 1.1}s infinite`,
          zIndex: 5,
        }}>
          {note}
        </div>
      ))}

      {/* Dialogue / narrative panel */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0 2rem 2.5rem",
        zIndex: 10,
        animation: "cin-fade-in 0.8s 0.8s ease both",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Location stamp */}
          {beat.type === "location" && (
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.62rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(0,212,240,0.75)",
              margin: "0 0 0.5rem",
              textShadow: "0 0 20px rgba(0,212,240,0.4)",
            }}>
              {visibleText}
            </p>
          )}

          {/* Speaker chip for dialogue */}
          {isDialogue && beat.speaker && (
            <div style={{
              display: "inline-block",
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(80,160,255,0.95)",
              background: "rgba(80,160,255,0.08)",
              borderTop: "1px solid rgba(80,160,255,0.25)",
              borderRight: "1px solid rgba(80,160,255,0.25)",
              borderBottom: "1px solid rgba(80,160,255,0.25)",
              borderLeft: "1px solid rgba(80,160,255,0.25)",
              borderRadius: "100px",
              padding: "0.18rem 0.7rem",
              marginBottom: "0.55rem",
            }}>
              {beat.speaker}
            </div>
          )}

          {/* Main text */}
          {beat.type !== "location" && (
            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 3.5vw, 1.45rem)",
              color: isDialogue ? "rgba(255,255,255,0.97)" : "rgba(230,228,255,0.88)",
              lineHeight: 1.55,
              margin: "0 0 1.1rem",
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            }}>
              {isDialogue ? `"${visibleText}"` : visibleText}
              {!textDone && (
                <span style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1em",
                  background: "var(--cyan)",
                  marginLeft: "2px",
                  verticalAlign: "middle",
                  animation: "cin-cursor 0.9s step-end infinite",
                }} />
              )}
            </p>
          )}

          {/* Progress dots + hint */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              {BEATS.map((_, i) => (
                <div key={i} style={{
                  height: "3px",
                  width: i === beatIndex ? "18px" : "5px",
                  borderRadius: "2px",
                  background: i < beatIndex ? "rgba(0,212,240,0.45)" : i === beatIndex ? "var(--cyan)" : "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
            {textDone && (
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.62rem",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.1em",
                animation: "cin-pulse 1.8s ease-in-out infinite",
              }}>
                {isLast ? "begin →" : "tap to continue →"}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
