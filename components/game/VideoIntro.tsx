"use client"

import { useEffect, useState, useRef } from "react"
import GameIcon from "./GameIcon"

type Phase = "logo" | "video"

type Props = {
  onComplete: () => void
  startMusic: () => void
}

export default function VideoIntro({ onComplete, startMusic }: Props) {
  const [phase, setPhase] = useState<Phase>("logo")
  const [logoVisible, setLogoVisible] = useState(false)
  const musicStarted = useRef(false)

  useEffect(() => {
    const id = "vi-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes vi-fade-in  { from { opacity:0; } to { opacity:1; } }
      @keyframes vi-rise     { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
      @keyframes vi-expand   { from { opacity:0; letter-spacing:0.9em; } to { opacity:1; letter-spacing:0.38em; } }
      @keyframes vi-glow     {
        0%,100% { text-shadow:0 0 40px rgba(0,212,240,0.2), 0 0 80px rgba(123,47,190,0.1); }
        50%     { text-shadow:0 0 70px rgba(0,212,240,0.6), 0 0 130px rgba(123,47,190,0.4); }
      }
      @keyframes vi-line-in  { from { opacity:0; transform:scaleX(0); } to { opacity:1; transform:scaleX(1); } }
      @keyframes vi-btn-in   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    `
    document.head.appendChild(s)
    setTimeout(() => setLogoVisible(true), 80)
  }, [])

  function handleContinue() {
    // This click IS the user gesture — unlock audio here
    if (!musicStarted.current) {
      musicStarted.current = true
      startMusic()
    }
    setPhase("video")
  }

  function handleBeginGame() {
    onComplete()
  }

  // ── LOGO PHASE ─────────────────────────────────────────────────────────────
  if (phase === "logo") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "radial-gradient(ellipse at 50% 45%, rgba(0,212,240,0.05) 0%, rgba(123,47,190,0.07) 40%, #000 72%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: logoVisible ? 1 : 0, transition: "opacity 0.5s ease",
      }}>

        {/* Baton */}
        <div style={{
          marginBottom: "1.5rem",
          animation: "vi-rise 0.65s 0.2s ease both",
          filter: "drop-shadow(0 0 18px rgba(0,212,240,0.55))",
        }}>
          <GameIcon name="baton" size={54} />
        </div>

        {/* Divider */}
        <div style={{
          width: "52px", height: "2px",
          background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
          marginBottom: "1.3rem", transformOrigin: "center",
          animation: "vi-line-in 0.5s 0.45s ease both",
        }} />

        {/* MAESTRO */}
        <div style={{
          fontFamily: "Cormorant Garamond, serif", fontWeight: 700,
          fontSize: "clamp(3.8rem, 11vw, 6.5rem)",
          color: "#fff", letterSpacing: "0.1em", lineHeight: 1,
          animation: "vi-rise 0.75s 0.55s cubic-bezier(0.16,1,0.3,1) both, vi-glow 4s 1.4s ease-in-out infinite",
        }}>
          MAESTRO
        </div>

        {/* PLAY */}
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 900,
          fontSize: "clamp(1.1rem, 3.2vw, 1.85rem)",
          color: "var(--cyan)", letterSpacing: "0.38em",
          marginTop: "0.3rem",
          animation: "vi-expand 0.8s 0.85s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          PLAY
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
          fontSize: "clamp(0.82rem, 1.7vw, 1rem)",
          color: "rgba(240,238,255,0.38)", marginTop: "1.5rem",
          animation: "vi-fade-in 0.7s 1.4s ease both",
        }}>
          Every maestro was once just a kid with a guitar.
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          style={{
            marginTop: "2.8rem",
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem",
            color: "#08060f",
            background: "linear-gradient(90deg, #00d4f0, #e040fb)",
            padding: "0.85rem 2.8rem", borderRadius: "100px", border: "none",
            cursor: "pointer",
            animation: "vi-btn-in 0.6s 1.8s ease both",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 0 0 rgba(0,212,240,0)",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.35)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
        >
          Continue →
        </button>
      </div>
    )
  }

  // ── VIDEO PHASE ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: "#000",
      display: "flex", flexDirection: "column",
    }}>
      {/* Video — contain so full figure is visible */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <video
          src="/video/JakeRocking.mp4"
          autoPlay
          loop
          playsInline
          style={{
            width: "100%", height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
        {/* Subtle vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }} />
      </div>

      {/* Bottom bar with Begin Game button */}
      <div style={{
        padding: "1.25rem 2rem",
        background: "rgba(8,6,15,0.88)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,212,240,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <GameIcon name="baton" size={24} />
          <span style={{
            fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
            fontSize: "1rem", color: "rgba(240,238,255,0.5)",
          }}>
            Jake's story begins now.
          </span>
        </div>

        <button
          onClick={handleBeginGame}
          style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem",
            color: "#08060f",
            background: "linear-gradient(90deg, #00d4f0, #e040fb)",
            padding: "0.75rem 2.2rem", borderRadius: "100px", border: "none",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(0,212,240,0.35)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}
        >
          Begin Game →
        </button>
      </div>
    </div>
  )
}
