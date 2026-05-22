"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

type Props = {
  onComplete: () => void
  startMusic: () => void
  gameTitle: string
  gameEmoji: string
  accentColor?: string
}

export default function VideoIntro({
  onComplete,
  startMusic,
  gameTitle,
  gameEmoji,
  accentColor = "var(--cyan)",
}: Props) {
  const musicStarted = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  // Inject keyframes for the fallback splash (only once per page)
  useEffect(() => {
    const id = "vi-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes vi-fade-in  { from { opacity:0; } to { opacity:1; } }
      @keyframes vi-rise     { from { opacity:0; transform:translateY(24px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
      @keyframes vi-expand   { from { opacity:0; letter-spacing:0.9em; } to { opacity:1; letter-spacing:0.38em; } }
      @keyframes vi-glow     {
        0%,100% { filter:drop-shadow(0 0 18px ${accentColor}44); }
        50%     { filter:drop-shadow(0 0 40px ${accentColor}99); }
      }
      @keyframes vi-line-in  { from { opacity:0; transform:scaleX(0); } to { opacity:1; transform:scaleX(1); } }
      @keyframes vi-btn-in   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      @keyframes vi-pulse-ring {
        0%   { transform: scale(0.95); opacity: 0.6; }
        50%  { transform: scale(1.08); opacity: 0.15; }
        100% { transform: scale(0.95); opacity: 0.6; }
      }
      @keyframes vi-sound-pop {
        0%   { opacity:0; transform:translateY(6px); }
        100% { opacity:1; transform:translateY(0); }
      }
    `
    document.head.appendChild(s)
  }, [])

  function triggerMusic() {
    if (!musicStarted.current) {
      musicStarted.current = true
      startMusic()
      setSoundOn(true)
    }
  }

  function handleSkip() {
    triggerMusic()
    onComplete()
  }

  function handleVideoEnded() {
    triggerMusic()
    onComplete()
  }

  function handleVideoCanPlay() {
    setVideoReady(true)
  }

  function handleVideoError() {
    setVideoFailed(true)
  }

  // ── VIDEO MODE ────────────────────────────────────────────────────────────
  if (!videoFailed) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "#000",
          cursor: "pointer",
          animation: "vi-fade-in 0.3s ease both",
        }}
        onClick={handleSkip}
      >
        {/* The video */}
        <video
          ref={videoRef}
          src="/videos/MaestroPlayVideo.mp4"
          autoPlay
          muted
          playsInline
          onCanPlay={handleVideoCanPlay}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Sound-on confirmation */}
        {soundOn && (
          <div style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            animation: "vi-sound-pop 0.4s ease both",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}>
            🔊 Music on
          </div>
        )}

        {/* MaestroPlay logo watermark */}
        <div style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          opacity: 0.65,
        }}>
          <Image src="/icons/icon.svg" alt="MaestroPlay" width={28} height={28} />
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "#fff",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            MaestroPlay
          </span>
        </div>

        {/* Skip hint */}
        <div style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          animation: "vi-fade-in 0.5s 1.5s ease both",
          opacity: 0,
        }}>
          Click anywhere to skip
        </div>

        {/* Game badge — bottom left */}
        <div style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          animation: "vi-fade-in 0.5s 1.5s ease both",
          opacity: 0,
        }}>
          <span style={{ fontSize: "1.1rem" }}>{gameEmoji}</span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "0.68rem",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
          }}>
            {gameTitle}
          </span>
        </div>
      </div>
    )
  }

  // ── FALLBACK SPLASH (when video file isn't available yet) ─────────────────
  return (
    <div
      onClick={handleSkip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: `radial-gradient(ellipse at 50% 40%, ${accentColor}0a 0%, rgba(123,47,190,0.08) 45%, #000 72%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "vi-fade-in 0.5s ease both",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Pulse rings */}
      <div style={{
        position: "absolute",
        width: "220px", height: "220px",
        borderRadius: "50%",
        border: `1px solid ${accentColor}33`,
        animation: "vi-pulse-ring 3s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: "300px", height: "300px",
        borderRadius: "50%",
        border: `1px solid ${accentColor}18`,
        animation: "vi-pulse-ring 3s ease-in-out infinite 0.6s",
      }} />

      {/* Logo */}
      <div style={{
        marginBottom: "1.25rem",
        animation: "vi-rise 0.7s 0.1s ease both, vi-glow 3s 1s ease-in-out infinite",
        zIndex: 1,
      }}>
        <Image src="/icons/icon.svg" alt="MaestroPlay" width={72} height={72} />
      </div>

      {/* MAESTRO */}
      <div style={{
        fontFamily: "Cormorant Garamond, serif",
        fontWeight: 700,
        fontSize: "clamp(3.5rem, 10vw, 6rem)",
        color: "#fff",
        letterSpacing: "0.08em",
        lineHeight: 1,
        animation: "vi-rise 0.8s 0.25s cubic-bezier(0.16,1,0.3,1) both",
        zIndex: 1,
      }}>
        MAESTRO
      </div>

      {/* PLAY */}
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 900,
        fontSize: "clamp(1rem, 3vw, 1.7rem)",
        color: accentColor,
        letterSpacing: "0.38em",
        marginTop: "0.2rem",
        animation: "vi-expand 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both",
        zIndex: 1,
      }}>
        PLAY
      </div>

      {/* Divider */}
      <div style={{
        width: "60px", height: "1px",
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        margin: "1.5rem 0",
        transformOrigin: "center",
        animation: "vi-line-in 0.5s 0.75s ease both",
        zIndex: 1,
      }} />

      {/* Game title */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        animation: "vi-fade-in 0.6s 0.9s ease both",
        zIndex: 1,
      }}>
        <span style={{ fontSize: "1.6rem" }}>{gameEmoji}</span>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "clamp(0.85rem, 2vw, 1rem)",
          color: "rgba(240,238,255,0.65)",
          letterSpacing: "0.05em",
        }}>
          {gameTitle}
        </span>
      </div>

      {/* Begin button */}
      <button
        onClick={e => { e.stopPropagation(); handleSkip() }}
        style={{
          marginTop: "2.5rem",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "#08060f",
          background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
          padding: "0.85rem 2.8rem",
          borderRadius: "100px",
          border: "none",
          cursor: "pointer",
          animation: "vi-btn-in 0.6s 1.2s ease both",
          transition: "transform 0.2s, box-shadow 0.2s",
          zIndex: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)"
          e.currentTarget.style.boxShadow = `0 0 32px ${accentColor}55`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = ""
          e.currentTarget.style.boxShadow = ""
        }}
      >
        Begin Game →
      </button>

      <div style={{
        position: "absolute",
        bottom: "1.5rem",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.72rem",
        color: "rgba(240,238,255,0.25)",
        animation: "vi-fade-in 0.5s 2s ease both",
      }}>
        Click anywhere to start
      </div>
    </div>
  )
}
