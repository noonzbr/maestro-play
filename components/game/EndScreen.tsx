"use client"

import Link from "next/link"
import { Game } from "@/lib/games/types"
import { allGames } from "@/lib/games"

type Props = {
  game: Game
  totalXp: number
  streak: number
}

export default function EndScreen({ game, totalXp, streak }: Props) {
  const nextGame = allGames.find((g) => g.week === game.week + 1)
  const isFinalGame = game.week === 4

  const shareText = isFinalGame
    ? `I just earned Maestro Conductor status on @MaestroPlay! 🎵 AI literacy in 4 weeks. No code required. ${totalXp} XP earned. Try it free: maestroplay.app`
    : `Just completed "${game.title}" on @MaestroPlay! 🎵 ${totalXp} XP earned. Learning AI without coding. Try it free: maestroplay.app`

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      {/* Radial glow */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(0,212,240,0.08) 0%, rgba(123,47,190,0.06) 50%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center", position: "relative" }}>
        {isFinalGame ? (
          <>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎓</div>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>
              Conductor Certified
            </div>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}>
              You are now a<br />
              <em style={{ background: "linear-gradient(90deg,#00d4f0,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Maestro Conductor
              </em>
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              You&apos;ve mastered the Maestro Method. The What, the What Not, the How, the Why — yours forever.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🎵</div>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>
              Scene Complete
            </div>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}>
              {game.title}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", marginBottom: "2.5rem" }}>
              Week {game.week} complete. Keep conducting.
            </p>
          </>
        )}

        {/* XP display */}
        <div className="glass-card" style={{
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "3rem",
        }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--cyan)" }}>{totalXp}</div>
            <div className="label-caps" style={{ marginTop: "0.25rem" }}>XP Earned</div>
          </div>
          {streak > 0 && (
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--pink)" }}>{streak}🔥</div>
              <div className="label-caps" style={{ marginTop: "0.25rem" }}>Streak</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#08060f",
            background: "linear-gradient(90deg,#00d4f0,#e040fb)",
            padding: "0.85rem 2rem",
            borderRadius: "100px",
            textDecoration: "none",
          }}>
            Share on X/Twitter ↗
          </a>

          {nextGame ? (
            <Link href={`/games/${nextGame.slug}`} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "rgba(240,238,255,0.7)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "0.75rem 2rem",
              borderRadius: "100px",
              textDecoration: "none",
            }}>
              {nextGame.free ? "Play Week " + nextGame.week + " Free →" : `Unlock Week ${nextGame.week} — $${nextGame.price?.toFixed(2)} →`}
            </Link>
          ) : (
            <Link href="/games" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "rgba(240,238,255,0.7)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "0.75rem 2rem",
              borderRadius: "100px",
              textDecoration: "none",
            }}>
              View All Games
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
