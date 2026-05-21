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

// ── Character → Maestro cinematic transformation (works for any game with images)
function MaestroTransformation({
  characterImage,
  maestroImage,
  maestroLine,
  accentColor = "var(--cyan)",
  onComplete,
}: {
  characterImage: string
  maestroImage: string
  maestroLine?: string
  accentColor?: string
  onComplete: () => void
}) {
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
      {/* Expanding rings */}
      {phase >= 1 && (
        <>
          <div style={{ position: "absolute", top: "50%", left: "50%", width: "200px", height: "200px", borderRadius: "50%", border: "2px solid rgba(0,212,240,0.4)", transform: "translate(-50%,-50%)", animation: "ring-expand 2s ease-out forwards" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(224,64,251,0.3)", transform: "translate(-50%,-50%)", animation: "ring-expand 2s 0.3s ease-out forwards" }} />
        </>
      )}

      <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>

        {/* Phase 0 — character before */}
        {phase === 0 && (
          <div style={{ textAlign: "center", animation: "scene-fade-in 0.7s ease both" }}>
            <div style={{ width: "180px", margin: "0 auto 1.25rem" }}>
              <img src={characterImage} alt="Character" style={{ width: "100%", display: "block", animation: "maestro-pulse 2.5s ease-in-out infinite" }} />
            </div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.35rem", color: "rgba(240,238,255,0.5)" }}>
              {maestroLine ?? "The last time they were just a musician..."}
            </p>
          </div>
        )}

        {/* Phase 1 — crossfade to maestro */}
        {phase === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: "200px", margin: "0 auto 1.25rem", height: "280px" }}>
              <img src={characterImage} alt="Before" style={{ position: "absolute", inset: 0, width: "100%", animation: "guitar-fade 0.8s ease forwards" }} />
              <img src={maestroImage} alt="The Maestro" style={{ position: "absolute", inset: 0, width: "100%", objectFit: "cover", objectPosition: "top", animation: "baton-arrive 1s 0.3s cubic-bezier(0.16,1,0.3,1) both" }} />
            </div>
            <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.5rem", color: accentColor, animation: "scene-fade-in 0.6s 0.5s ease both" }}>
              The Maestro has arrived.
            </p>
          </div>
        )}

        {/* Phase 2 — maestro revealed */}
        {phase >= 2 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: "200px", margin: "0 auto 1.25rem" }}>
              <img src={maestroImage} alt="The Maestro" style={{ width: "100%", display: "block", animation: "maestro-pulse 3s ease-in-out infinite" }} />
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

// ── Main EndScreen ────────────────────────────────────────────────────────────
export default function EndScreen({ game, totalXp, streak }: Props) {
  const hasMaestro = !!game.maestroImage
  const [showTransform, setShowTransform] = useState(hasMaestro)
  const nextGame = allGames.find((g) => g.week === game.week + 1)
  const isFinalGame = !nextGame
  const accent = game.accentColor ?? "var(--cyan)"

  const shareText = isFinalGame
    ? `I just earned Maestro Conductor status on @MaestroPlay! 🎼 ${allGames.length} games. No code required. ${totalXp} XP earned. Try it free: maestroplay.app`
    : game.week === 1
    ? `Jake's story just began mine. 🎸→🎼 Completed "${game.title}" on @MaestroPlay — ${totalXp} XP earned. The Maestro has arrived. Try it free: maestroplay.app`
    : `Just completed "${game.title}" on @MaestroPlay! 🎵 ${totalXp} XP earned. Learning AI without coding. Try it free: maestroplay.app`

  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent("https://maestroplay.app")}&title=${encodeURIComponent("MaestroPlay — AI Literacy Game")}&summary=${encodeURIComponent(shareText)}&source=maestroplay.app`

  // ── Cinematic transformation for any game with character images ───────────
  if (showTransform && game.characterImage && game.maestroImage) {
    return (
      <MaestroTransformation
        characterImage={game.characterImage}
        maestroImage={game.maestroImage}
        maestroLine={game.maestroLine}
        accentColor={accent}
        onComplete={() => setShowTransform(false)}
      />
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow — uses game accent colour */}
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "600px", height: "600px",
        background: hasMaestro
          ? `radial-gradient(circle, ${accent}18 0%, ${accent}0e 45%, transparent 70%)`
          : "radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.05) 50%, transparent 70%)",
        pointerEvents: "none",
        animation: "revelation-glow 5s ease-in-out infinite",
      }} />

      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", position: "relative", animation: "scene-fade-in 0.7s ease both" }}>

        {/* ── Maestro ending — any game with character images ── */}
        {hasMaestro ? (
          <>
            <img
              src={game.maestroImage}
              alt="The Maestro"
              style={{ height: "clamp(140px, 28vh, 210px)", objectFit: "contain", display: "block", margin: "0 auto 0.75rem", animation: "maestro-pulse 3s ease-in-out infinite" }}
            />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: `${accent}14`, border: `1px solid ${accent}40`,
              borderRadius: "100px", padding: "0.3rem 0.7rem", marginBottom: "0.75rem",
            }}>
              <GameIcon name={game.icon ?? "musicNotes"} size={18} />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: accent }}>Conductor Awakened</span>
              <GameIcon name="baton" size={18} />
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: "#fff", lineHeight: 1.1, marginBottom: "0.5rem" }}>
              You were always<br />
              <em style={{ background: `linear-gradient(90deg,${accent},#e040fb)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                a conductor.
              </em>
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              {game.maestroSubline ?? "The orchestra awaits."}
            </p>
          </>

        ) : isFinalGame ? (
          <>
            <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}><GameIcon name="baton" size={60} /></div>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>Conductor Certified</div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
              You are now a<br />
              <em style={{ background: "linear-gradient(90deg,#00d4f0,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Maestro Conductor
              </em>
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              You&apos;ve mastered the Maestro Method. The What, the What Not, the How, the Why — yours forever.
            </p>
          </>

        ) : (
          <>
            <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
              <span style={{ fontSize: "3rem" }}>{game.emoji}</span>
            </div>
            <div className="label-caps" style={{ color: accent, marginBottom: "0.75rem" }}>Scene Complete</div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
              {game.title}
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
              Game {game.week} complete. Keep conducting.
            </p>
          </>
        )}

        {/* XP / Streak */}
        <div className="glass-card" style={{
          borderRadius: "14px", padding: "1rem 1.5rem", marginBottom: "1.25rem",
          display: "flex", justifyContent: "center", gap: "2.5rem",
        }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.7rem", color: accent }}>{totalXp}</div>
            <div className="label-caps" style={{ marginTop: "0.2rem" }}>XP Earned</div>
          </div>
          {streak > 0 && (
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.7rem", color: "var(--pink)" }}>{streak}🔥</div>
              <div className="label-caps" style={{ marginTop: "0.2rem" }}>Streak</div>
            </div>
          )}
        </div>

        {/* Share + Next */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.825rem",
              color: "#08060f", background: `linear-gradient(90deg,${accent},#e040fb)`,
              padding: "0.8rem 0.5rem", borderRadius: "100px", textDecoration: "none",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.848L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share ↗
            </a>
            <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.825rem",
              color: "#fff", background: "#0A66C2",
              padding: "0.8rem 0.5rem", borderRadius: "100px", textDecoration: "none",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn ↗
            </a>
          </div>

          {nextGame ? (
            <Link href={`/games/${nextGame.slug}`} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem",
              color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "0.7rem 2rem", borderRadius: "100px", textDecoration: "none",
            }}>
              {nextGame.free ? `Play Game ${nextGame.week} Free →` : `Unlock Game ${nextGame.week} — $${nextGame.price?.toFixed(2)} →`}
            </Link>
          ) : (
            <Link href="/games" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem",
              color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "0.7rem 2rem", borderRadius: "100px", textDecoration: "none",
            }}>
              View All Games
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
