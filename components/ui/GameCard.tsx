"use client"

import Link from "next/link"
import { Game } from "@/lib/games/types"

type Props = {
  game: Game
  purchased?: boolean
}

export default function GameCard({ game, purchased }: Props) {
  const isLocked = !game.free && !purchased

  return (
    <div
      className="glass-card gradient-border"
      style={{
        borderRadius: "16px",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        cursor: "pointer",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Week badge */}
      <div style={{
        position: "absolute",
        top: "1.5rem",
        right: "1.5rem",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: "0.65rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "var(--muted)",
      }}>
        Week {game.week}
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          background: "rgba(8,6,15,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(2px)",
          zIndex: 2,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🔒</div>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "var(--pink)",
            }}>
              ${game.price?.toFixed(2)} to unlock
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{game.emoji}</div>

      <div className="label-caps" style={{ marginBottom: "0.75rem" }}>
        {game.free ? "Free" : `$${game.price?.toFixed(2)}`} · {game.duration}
      </div>

      <h3 style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "1.1rem",
        color: "#fff",
        marginBottom: "0.6rem",
        lineHeight: 1.3,
      }}>
        {game.title}
      </h3>

      <p style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "0.85rem",
        color: "var(--muted)",
        lineHeight: 1.6,
        marginBottom: "1.5rem",
      }}>
        {game.description}
      </p>

      {isLocked ? (
        <Link href={`/checkout/${game.slug}`} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "0.8rem",
          color: "#08060f",
          background: "linear-gradient(90deg,#e040fb,#7b2fbe)",
          padding: "0.5rem 1.2rem",
          borderRadius: "100px",
          textDecoration: "none",
        }}>
          Unlock →
        </Link>
      ) : (
        <Link href={`/games/${game.slug}`} style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "0.8rem",
          color: "#08060f",
          background: "linear-gradient(90deg,#00d4f0,#7b2fbe)",
          padding: "0.5rem 1.2rem",
          borderRadius: "100px",
          textDecoration: "none",
        }}>
          Play →
        </Link>
      )}
    </div>
  )
}
