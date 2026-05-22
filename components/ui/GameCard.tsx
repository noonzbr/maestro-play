"use client"

import Link from "next/link"
import { Game } from "@/lib/games/types"

type Props = {
  game: Game
  purchased?: boolean
}

export default function GameCard({ game, purchased }: Props) {
  const isLocked = !game.free && !purchased
  const href = isLocked ? `/checkout/${game.slug}` : `/games/${game.slug}`
  const accent = game.accentColor ?? "var(--cyan)"
  const initial = (game.characterName ?? game.title)[0].toUpperCase()

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        className="glass-card gradient-border"
        style={{
          borderRadius: "16px",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          cursor: "pointer",
          height: "100%",
          borderColor: `${accent}33`,
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {/* Accent glow strip */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}00)`,
          opacity: 0.7,
          zIndex: 3,
        }} />

        {/* ── Character Photo ─────────────────────────────────── */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "260px",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {game.characterImage ? (
            <img
              src={game.characterImage}
              alt={game.characterName ?? game.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                display: "block",
              }}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
              fontSize: "4rem",
              fontWeight: 700,
              color: accent,
              fontFamily: "Inter, sans-serif",
            }}>
              {initial}
            </div>
          )}

          {/* Photo gradient overlay — fades into card bg */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(8,6,15,0.05) 0%, rgba(8,6,15,0.5) 65%, rgba(8,6,15,0.97) 100%)",
          }} />

          {/* Character name + role — bottom of photo */}
          {game.characterName && (
            <div style={{
              position: "absolute",
              bottom: "0.75rem",
              left: "0.875rem",
              zIndex: 2,
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#fff",
                lineHeight: 1.2,
              }}>
                {game.characterName}
              </div>
              {game.characterRole && (
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.68rem",
                  color: accent,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  marginTop: "0.15rem",
                  textTransform: "uppercase",
                }}>
                  {game.characterRole}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Card Content ────────────────────────────────────── */}
        <div style={{
          padding: "1.1rem 1.4rem 1.4rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Duration */}
          <div className="label-caps" style={{
            marginBottom: "0.4rem",
            color: accent,
            opacity: 0.7,
            fontSize: "0.62rem",
          }}>
            {game.duration}
          </div>

          <h3 style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#fff",
            marginBottom: "0.45rem",
            lineHeight: 1.3,
          }}>
            {game.title}
          </h3>

          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.82rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: "1.1rem",
            flex: 1,
          }}>
            {game.description}
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "#08060f",
            background: isLocked
              ? "linear-gradient(90deg,#e040fb,#7b2fbe)"
              : `linear-gradient(90deg,${accent},${accent}bb)`,
            padding: "0.45rem 1.1rem",
            borderRadius: "100px",
            alignSelf: "flex-start",
          }}>
            {isLocked ? "Unlock →" : "Play →"}
          </div>
        </div>

        {/* ── Lock Overlay ─────────────────────────────────────── */}
        {isLocked && (
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            background: "rgba(8,6,15,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
            zIndex: 4,
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "var(--pink)",
              textAlign: "center",
            }}>
              ${game.price?.toFixed(2)} to unlock
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
