"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Game } from "@/lib/games/types"

type Props = {
  game: Game
  purchased?: boolean
}

// Unique neon accent per game — makes every card feel distinct
const NEON_ACCENTS: Record<string, string> = {
  "welcome-to-ai":        "#ff6b35",
  "how-ai-works":         "#a78bfa",
  "ai-for-professionals": "#00d4f0",
  "the-conductor-test":   "#f472b6",
  "claude-chat-unlocked": "#34d399",
  "claude-code-unlocked": "#10b981",
  "claude-for-work":      "#818cf8",
  "chatgpt-mastery":      "#4ade80",
  "gemini-unlocked":      "#60a5fa",
  "gemini-cli-unlocked":  "#fbbf24",
  "microsoft-copilot":    "#38bdf8",
  "copilot-studio":       "#c084fc",
  "welcome-to-ai-v2":    "#00d4f0",
  "prompt-lab":           "#e879f9",
}

// Per-image crop so the character's face is always in frame
const IMAGE_CROP: Record<string, string> = {
  "/images/guitarplayer1.png": "center 5%",
  "/images/zoe.png":           "center top",
  "/images/carlos.png":        "center 20%",
  "/images/aria.png":          "center 10%",
  "/images/jordan.png":        "center top",
  "/images/kai.png":           "center 8%",
  "/images/priya.png":         "center 8%",
  "/images/alex.png":          "center top",
  "/images/luna.png":          "center 8%",
  "/images/sam.png":           "center 8%",
  "/images/maya.png":          "center 10%",
}

// Strip "N-year-old" prefix, uppercase the role label
function cleanRole(role: string): string {
  return role.replace(/^\d+-year-old\s+/i, "").toUpperCase()
}

export default function GameCard({ game, purchased }: Props) {
  const isLocked = !game.free && !purchased
  const href   = isLocked ? `/checkout/${game.slug}` : `/games/${game.slug}`
  const accent = NEON_ACCENTS[game.slug] ?? game.accentColor ?? "#00d4f0"
  const crop   = IMAGE_CROP[game.characterImage ?? ""] ?? "center 8%"
  const initial = (game.characterName ?? game.title)[0].toUpperCase()
  const [imgError, setImgError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  // Catch errors that fired before React hydration attached the onError handler
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
      setImgError(true)
    }
  }, [])

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        style={{
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "rgba(12, 8, 22, 0.92)",
          border: `1.5px solid ${accent}55`,
          boxShadow: `0 0 24px ${accent}1a, 0 0 80px ${accent}0a, inset 0 0 40px ${accent}07`,
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.transform = "translateY(-8px) scale(1.02)"
          el.style.boxShadow = `0 0 40px ${accent}55, 0 0 100px ${accent}1a, 0 24px 60px rgba(0,0,0,0.55), inset 0 0 50px ${accent}10`
          el.style.borderColor = `${accent}cc`
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.transform = "translateY(0) scale(1)"
          el.style.boxShadow = `0 0 24px ${accent}1a, 0 0 80px ${accent}0a, inset 0 0 40px ${accent}07`
          el.style.borderColor = `${accent}55`
        }}
      >
        {/* Top neon accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${accent} 40%, ${accent} 60%, transparent 100%)`,
          zIndex: 3,
        }} />

        {/* ── Character Photo ───────────────────────────────── */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "265px",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {game.characterImage && !imgError ? (
            <img
              ref={imgRef}
              src={game.characterImage}
              alt={game.characterName ?? game.title}
              onError={() => setImgError(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: crop,
                display: "block",
                filter: "brightness(0.9) contrast(1.05) saturate(1.1)",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
              fontSize: "4rem", fontWeight: 700, color: accent,
              fontFamily: "Inter, sans-serif",
            }}>
              {initial}
            </div>
          )}

          {/* Vignette overlay: subtle dark at top, strong at bottom for text legibility */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to bottom,
              rgba(8,6,15,0.18) 0%,
              rgba(8,6,15,0.1)  35%,
              rgba(8,6,15,0.55) 70%,
              rgba(8,6,15,0.98) 100%)`,
          }} />

          {/* Corner accent glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(ellipse at top left, ${accent}15 0%, transparent 60%)`,
            pointerEvents: "none",
          }} />

          {/* Character identity */}
          {game.characterName && (
            <div style={{
              position: "absolute", bottom: "0.875rem", left: "1rem", zIndex: 2,
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "#fff",
                lineHeight: 1.15,
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              }}>
                {game.characterName}
              </div>
              {game.characterRole && (
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: accent,
                  marginTop: "0.2rem",
                  textTransform: "uppercase",
                  textShadow: `0 0 10px ${accent}99`,
                }}>
                  {cleanRole(game.characterRole)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Card Content ─────────────────────────────────── */}
        <div style={{
          padding: "1rem 1.25rem 1.35rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Duration pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: "0.45rem",
          }}>
            ◆ {game.duration}
          </div>

          <h3 style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.97rem",
            color: "#fff",
            lineHeight: 1.3,
            marginBottom: "0.45rem",
          }}>
            {game.title}
          </h3>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.8rem",
            color: "rgba(200,195,230,0.7)",
            lineHeight: 1.65,
            flex: 1,
            marginBottom: "1.1rem",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          } as React.CSSProperties}>
            {game.description}
          </p>

          {/* Play button — always rendered */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "0.8rem",
            color: isLocked ? "#fff" : "#08060f",
            background: isLocked
              ? "linear-gradient(90deg, #e040fb, #7b2fbe)"
              : `linear-gradient(105deg, ${accent}, ${accent}cc)`,
            padding: "0.5rem 1.25rem",
            borderRadius: "100px",
            alignSelf: "flex-start",
            boxShadow: `0 0 16px ${accent}44, 0 4px 16px rgba(0,0,0,0.3)`,
            letterSpacing: "0.02em",
          }}>
            {isLocked ? "Unlock →" : "Play →"}
          </div>
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "20px",
            background: "rgba(8,6,15,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(2px)", zIndex: 4,
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700,
              fontSize: "0.875rem", color: "var(--pink)", textAlign: "center",
            }}>
              ${game.price?.toFixed(2)} to unlock
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
