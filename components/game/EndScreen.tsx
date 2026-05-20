"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Game } from "@/lib/games/types"
import { allGames } from "@/lib/games"
import GameIcon from "./GameIcon"

type Props = {
  game: Game
  totalXp: number
  streak: number
}

// Week 1 only: 3-phase cinematic transformation sequence
function MaestroTransformation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const id = "maestro-endscreen-kf"
    if (!document.getElementById(id)) {
      const s = document.createElement("style")
      s.id = id
      s.textContent = `
        @keyframes guitar-fade {
          0%   { opacity:1; transform:scale(1) rotate(0deg); filter:drop-shadow(0 0 8px rgba(0,212,240,0.3)); }
          100% { opacity:0; transform:scale(0.4) rotate(-40deg); filter:drop-shadow(0 0 0px rgba(0,212,240,0)); }
        }
        @keyframes baton-arrive {
          0%   { opacity:0; transform:scale(0.3) rotate(30deg); filter:drop-shadow(0 0 0px rgba(0,212,240,0)); }
          60%  { transform:scale(1.25) rotate(-5deg); filter:drop-shadow(0 0 40px rgba(0,212,240,1)); }
          100% { opacity:1; transform:scale(1) rotate(0deg); filter:drop-shadow(0 0 24px rgba(0,212,240,0.7)); }
        }
        @keyframes maestro-title-in {
          0%   { opacity:0; transform:translateY(24px) scale(0.95); letter-spacing:0.4em; }
          100% { opacity:1; transform:translateY(0) scale(1); letter-spacing:0.05em; }
        }
        @keyframes ring-expand {
          0%   { transform:scale(0); opacity:0.8; }
          100% { transform:scale(3); opacity:0; }
        }
        @keyframes text-glow-pulse {
          0%,100% { text-shadow:0 0 20px rgba(0,212,240,0.4); }
          50%     { text-shadow:0 0 60px rgba(0,212,240,0.9), 0 0 120px rgba(224,64,251,0.4); }
        }
      `
      document.head.appendChild(s)
    }

    const t1 = setTimeout(() => setPhase(1), 900)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => onComplete(), 3600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Radial pulse rings */}
      {phase >= 1 && (
        <>
          <div style={{ position: "absolute", top: "50%", left: "50%", width: "200px", height: "200px", borderRadius: "50%", border: "2px solid rgba(0,212,240,0.4)", transform: "translate(-50%,-50%)", animation: "ring-expand 2s ease-out forwards" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(224,64,251,0.3)", transform: "translate(-50%,-50%)", animation: "ring-expand 2s 0.3s ease-out forwards" }} />
        </>
      )}

      <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
        {/* Phase 0: The Guitarist — last time he was just Jake */}
        {phase === 0 && (
          <div style={{ textAlign: "center", animation: "scene-fade-in 0.7s ease both" }}>
            <div style={{ width: "180px", margin: "0 auto 1.25rem" }}>
              <img src="/images/guitarplayer1.png" alt="Jake" style={{ width: "100%", display: "block", animation: "maestro-pulse 2.5s ease-in-out infinite" }} />
            </div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.35rem", color: "rgba(240,238,255,0.5)" }}>
              The last time he was just a guitarist...
            </p>
          </div>
        )}

        {/* Phase 1: The transformation crossfade */}
        {phase === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: "200px", margin: "0 auto 1.25rem", height: "280px" }}>
              <img
                src="/images/guitarplayer1.png"
                alt="Jake"
                style={{ position: "absolute", inset: 0, width: "100%", animation: "guitar-fade 0.8s ease forwards" }}
              />
              <img
                src="/images/maestroplayer1.png"
                alt="The Maestro"
                style={{ position: "absolute", inset: 0, width: "100%", objectFit: "cover", objectPosition: "top", animation: "baton-arrive 1s 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
              />
            </div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.5rem", color: "var(--cyan)", animation: "scene-fade-in 0.6s 0.5s ease both" }}>
              The Maestro has arrived.
            </p>
          </div>
        )}

        {/* Phase 2: Full title */}
        {phase >= 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "200px", margin: "0 auto 1.25rem" }}>
              <img src="/images/maestroplayer1.png" alt="The Maestro" style={{ width: "100%", display: "block", animation: "maestro-pulse 3s ease-in-out infinite" }} />
            </div>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              color: "#fff",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              animation: "maestro-title-in 0.8s cubic-bezier(0.16,1,0.3,1) both, text-glow-pulse 3s 0.8s ease-in-out infinite",
            }}>
              The Maestro<br />Has Arrived
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EndScreen({ game, totalXp, streak }: Props) {
  const [showTransform, setShowTransform] = useState(game.week === 1)
  const nextGame = allGames.find((g) => g.week === game.week + 1)
  const isFinalGame = game.week === 4

  const shareText = isFinalGame
    ? `I just earned Maestro Conductor status on @MaestroPlay! 🎼 AI literacy in 4 weeks. No code required. ${totalXp} XP earned. Try it free: maestroplay.app`
    : game.week === 1
    ? `Jake's story just began mine. 🎸→🎼 Completed "${game.title}" on @MaestroPlay — ${totalXp} XP earned. The Maestro has arrived. Try it free: maestroplay.app`
    : `Just completed "${game.title}" on @MaestroPlay! 🎵 ${totalXp} XP earned. Learning AI without coding. Try it free: maestroplay.app`

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`

  if (showTransform) {
    return <MaestroTransformation onComplete={() => setShowTransform(false)} />
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "700px",
        height: "700px",
        background: game.week === 1
          ? "radial-gradient(circle, rgba(0,212,240,0.09) 0%, rgba(123,47,190,0.07) 45%, transparent 70%)"
          : "radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.05) 50%, transparent 70%)",
        pointerEvents: "none",
        animation: "revelation-glow 5s ease-in-out infinite",
      }} />

      <div style={{ maxWidth: "560px", width: "100%", textAlign: "center", position: "relative", animation: "scene-fade-in 0.7s ease both" }}>

        {/* Week 1 special ending */}
        {game.week === 1 ? (
          <>
            <div style={{ width: "180px", margin: "0 auto 1rem" }}>
              <img src="/images/maestroplayer1.png" alt="The Maestro" style={{ width: "100%", display: "block", animation: "maestro-pulse 3s ease-in-out infinite" }} />
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(0,212,240,0.08)",
              border: "1px solid rgba(0,212,240,0.25)",
              borderRadius: "100px",
              padding: "0.35rem 0.75rem",
              marginBottom: "1.25rem",
            }}>
              <GameIcon name="guitar" size={22} />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--cyan)" }}>Conductor Awakened</span>
              <GameIcon name="baton" size={22} />
            </div>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}>
              You were always<br />
              <em style={{ background: "linear-gradient(90deg,#00d4f0,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                a conductor.
              </em>
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Jake&apos;s story is just beginning. The orchestra awaits.
            </p>
          </>
        ) : isFinalGame ? (
          <>
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}><GameIcon name="baton" size={72} /></div>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>Conductor Certified</div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2.5rem, 6vw, 3.5rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
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
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}><GameIcon name="musicNotes" size={72} /></div>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>Scene Complete</div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
              {game.title}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", marginBottom: "2.5rem" }}>
              Week {game.week} complete. Keep conducting.
            </p>
          </>
        )}

        {/* XP / Streak stats */}
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

        {/* CTAs */}
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
              {nextGame.free ? `Play Week ${nextGame.week} Free →` : `Unlock Week ${nextGame.week} — $${nextGame.price?.toFixed(2)} →`}
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
