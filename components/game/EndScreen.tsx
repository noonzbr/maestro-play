"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Game } from "@/lib/games/types"
import { allGames } from "@/lib/games"
import GameIcon from "./GameIcon"
import MaestroTutor from "./MaestroTutor"
import CinematicVideo from "./CinematicVideo"

// ── Certificate helpers ────────────────────────────────────────────────────
async function fetchCertificate(gameSlug: string, playerName: string): Promise<{ certificateUrl: string; shareText: string } | null> {
  try {
    const res = await fetch(`/api/certificate?game=${encodeURIComponent(gameSlug)}&name=${encodeURIComponent(playerName)}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function playSynthBeep(freq: number, type: OscillatorType = "sine", vol = 0.03, dur = 0.1) {
  if (typeof window === "undefined") return
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(vol, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur)
    
    osc.start()
    osc.stop(audioCtx.currentTime + dur)
  } catch {}
}

const JAKE_NOTE = {
  id: "jake-1",
  sender: "Jake",
  avatar: "/images/guitarplayer1.png",
  color: "rgba(0, 212, 240, 0.9)",
  subject: "Transcription Prompts",
  content: "Hey! Coda told me to check out this prompt pattern for copying guitar tabs. I tried it and it actually transcribed my baseline correctly! It's like having a tech copilot who actually understands syncopation. I'm heading to rehearsal, catch you there.",
  unlockedAt: 1,
  duration: "0:42",
  freq: 440
}

type Props = {
  game: Game
  totalXp: number
  streak: number
  choiceHistory?: {question:string, chosen:string, correct:boolean}[]
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
        @keyframes wm-star-twinkle {
          0%, 100% { opacity: 0.35; }
          50%     { opacity: 0.95; }
        }
        @keyframes side-nav-pulse {
          0%, 100% { opacity: 0.8; }
          50%      { opacity: 1; transform: scale(1.03); }
        }
        @keyframes wm-wave-bar {
          0%, 100% { height: 4px; }
          50%      { height: 28px; }
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

/* ── Level thresholds (mirrors dashboard) ─────────────────────────────────── */
const LEVEL_UP_THRESHOLDS = [
  { minXp: 500,  label: "Associate Conductor", color: "#e040fb", icon: "🎼" },
  { minXp: 1500, label: "Conductor",            color: "#ffb700", icon: "🎹" },
  { minXp: 3000, label: "Grand Maestro",         color: "#ff6b35", icon: "🏆" },
]

// ── Your Path: compact collapsible section showing top 3 player choices ──────
function YourPath({
  choices,
  accent = "var(--cyan)",
}: {
  choices: {question:string, chosen:string, correct:boolean}[]
  accent?: string
}) {
  const [open, setOpen] = useState(false)
  const top3 = choices.slice(0, 3)

  return (
    <div style={{
      borderRadius: "14px", marginBottom: "1.25rem",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.09)",
      overflow: "hidden",
      animation: "scene-fade-in 0.6s 0.15s ease both",
    }}>
      {/* Collapsible header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.6rem 1rem",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: "0.8rem" }}>🗺️</span>
        <span style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem",
          letterSpacing: "0.26em", textTransform: "uppercase",
          color: "rgba(240,238,255,0.5)", flex: 1,
        }}>
          Your path through this game
        </span>
        <span style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
          color: "rgba(240,238,255,0.3)", transition: "transform 0.2s",
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          ↓
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{
              padding: "0 1rem 0.85rem",
              display: "flex", flexDirection: "column", gap: "0.5rem",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {top3.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "0.55rem",
              }}>
                {/* Correct/wrong dot */}
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                  marginTop: "0.28rem",
                  background: item.correct ? "rgba(0,212,240,0.85)" : "rgba(255,180,0,0.85)",
                  boxShadow: item.correct
                    ? "0 0 6px rgba(0,212,240,0.5)"
                    : "0 0 6px rgba(255,180,0,0.4)",
                }} />
                <span style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: "0.83rem", color: "rgba(240,238,255,0.62)",
                  lineHeight: 1.5,
                }}>
                  you chose:{" "}
                  <span style={{ color: "rgba(240,238,255,0.88)", fontStyle: "normal" }}>
                    {item.chosen.length > 45 ? item.chosen.slice(0, 45) + "…" : item.chosen}
                  </span>
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Transfer Bridge: fallback prompt generator ────────────────────────────────
// Used when a game doesn't define mondayPrompt — produces a sensible template
// based on the Maestro Method (WHAT / WHAT NOT / HOW / WHY)
function generateFallbackPrompt(title: string, characterName?: string): string {
  return `You are a [ROLE — e.g. senior developer, marketing manager, analyst].

I need you to [WHAT — describe the specific task from "${title}"].

Do NOT [WHAT NOT — e.g. use jargon, include headers, exceed 200 words].

Format it as [HOW — e.g. a 3-bullet summary, a professional email, a table].

Context: [WHY — e.g. this is for a board presentation, a new hire, a client who almost churned].`
}

// ── Main EndScreen ────────────────────────────────────────────────────────────
export default function EndScreen({ game, totalXp, streak, choiceHistory }: Props) {
  const hasMaestro = !!game.maestroImage
  /**
   * If the game has a PixVerse end video, show it FIRST (full-screen,
   * non-looping). When it ends or the user taps, move on to the
   * transformation / stats reveal phase.
   */
  const [showEndVideo,  setShowEndVideo]  = useState(!!game.endVideo)
  const endVideoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showTransform, setShowTransform] = useState(hasMaestro)
  const [showTutor,     setShowTutor]     = useState(false)
  const [showRadioChatter, setShowRadioChatter] = useState(false)
  const [isPlayingLog, setIsPlayingLog] = useState(false)
  const [typedLogText, setTypedLogText] = useState("")
  const chatterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Automatically trigger Radio Chatter popup after first game completes
  useEffect(() => {
    if (!showEndVideo && !showTransform && (game.week === 1 || game.week === 13)) {
      setShowRadioChatter(true)
    }
  }, [showEndVideo, showTransform, game.week])

  // Level-up detection — did this session push the player past a threshold?
  const [levelUpInfo, setLevelUpInfo] = useState<typeof LEVEL_UP_THRESHOLDS[0] | null>(null)
  useEffect(() => {
    try {
      const stored  = parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0
      const prevXp  = Math.max(0, stored - totalXp)
      for (const lvl of LEVEL_UP_THRESHOLDS) {
        if (prevXp < lvl.minXp && stored >= lvl.minXp) {
          setLevelUpInfo(lvl)
          break
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Certificate state ─────────────────────────────────────────────────────
  const [certLoading, setCertLoading] = useState(false)

  async function handleGetCertificate() {
    setCertLoading(true)
    // Get player name from localStorage if set, otherwise prompt briefly
    const storedName = (typeof window !== "undefined" && localStorage.getItem("maestro_player_name")) || ""
    const playerName = storedName || "MaestroPlay Graduate"
    const result = await fetchCertificate(game.slug, playerName)
    setCertLoading(false)
    if (result?.certificateUrl) {
      window.open(result.certificateUrl, "_blank", "noopener,noreferrer")
    }
  }

  // Build LinkedIn URL with certificate if available (computed lazily)
  const [certLinkedInUrl, setCertLinkedInUrl] = useState<string | null>(null)

  useEffect(() => {
    // Pre-fetch certificate URL for the LinkedIn button when component mounts
    const storedName = (typeof window !== "undefined" && localStorage.getItem("maestro_player_name")) || ""
    const playerName = storedName || "MaestroPlay Graduate"
    fetchCertificate(game.slug, playerName).then(result => {
      if (result?.certificateUrl && result?.shareText) {
        const certPageUrl = `https://play.aimaestro.academy${result.certificateUrl}`
        const liUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(certPageUrl)}&title=${encodeURIComponent("Certificate of AI Fluency | MaestroPlay")}&summary=${encodeURIComponent(result.shareText)}&source=play.aimaestro.academy`
        setCertLinkedInUrl(liUrl)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.slug])

  // ── Dr. Park's Transfer Bridge — "Monday Morning Prompt" ──────────────────
  // Closes the gap between game-context learning and real-work application.
  const [promptCopied, setPromptCopied] = useState(false)

  // Fallback Monday Prompt if game doesn't provide one — generated from game context
  const mondayPrompt = game.mondayPrompt ?? generateFallbackPrompt(game.title, game.characterName)

  function copyPrompt() {
    navigator.clipboard.writeText(mondayPrompt).catch(() => {})
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2500)
  }

  useEffect(() => {
    if (!showEndVideo || !game.endVideo) return
    // Safety auto-advance after 10 s
    endVideoTimerRef.current = setTimeout(() => setShowEndVideo(false), 10000)
    return () => { if (endVideoTimerRef.current) clearTimeout(endVideoTimerRef.current) }
  }, [showEndVideo, game.endVideo])

  function advanceFromEndVideo() {
    if (endVideoTimerRef.current) clearTimeout(endVideoTimerRef.current)
    setShowEndVideo(false)
  }

  /* ── PixVerse end cinematic (if provided) ──────────────────────────────── */
  if (showEndVideo && game.endVideo) {
    return (
      <div
        onClick={advanceFromEndVideo}
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     200,
          background: "#000",
          cursor:     "pointer",
        }}
      >
        <CinematicVideo
          src={game.endVideo}
          loop={false}
          onEnded={advanceFromEndVideo}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          objectFit="cover"
        />
        <div style={{
          position:       "absolute",
          bottom:         "1.5rem",
          right:          "1.5rem",
          fontFamily:     "Inter, sans-serif",
          fontSize:       "0.65rem",
          color:          "rgba(255,255,255,0.35)",
          letterSpacing:  "0.18em",
          textTransform:  "uppercase",
        }}>
          tap to continue
        </div>
      </div>
    )
  }
  const nextGame = allGames.find((g) => g.week === game.week + 1)
  const isFinalGame = !nextGame
  const accent = game.accentColor ?? "var(--cyan)"

  const shareText = isFinalGame
    ? `I just earned Maestro Conductor status on @MaestroPlay! 🎼 ${allGames.length} games. No code required. ${totalXp} XP earned. Try it free: play.aimaestro.academy`
    : game.week === 1
    ? `Jake's story just began mine. 🎸→🎼 Completed "${game.title}" on @MaestroPlay — ${totalXp} XP earned. The Maestro has arrived. Try it free: play.aimaestro.academy`
    : `Just completed "${game.title}" on @MaestroPlay! 🎵 ${totalXp} XP earned. Learning AI without coding. Try it free: play.aimaestro.academy`

  // linkedInUrl is the fallback before certLinkedInUrl is fetched
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent("https://play.aimaestro.academy")}&title=${encodeURIComponent("MaestroPlay — AI Literacy Game")}&summary=${encodeURIComponent(shareText)}&source=play.aimaestro.academy`

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

        {/* Level-up banner — appears when a level threshold was crossed */}
        {levelUpInfo && (
          <div style={{
            borderRadius: "14px", padding: "0.85rem 1.5rem", marginBottom: "0.75rem",
            background: `${levelUpInfo.color}10`,
            border: `1px solid ${levelUpInfo.color}45`,
            display: "flex", alignItems: "center", gap: "0.65rem",
            animation: "scene-fade-in 0.6s ease both",
          }}>
            <span style={{ fontSize: "1.4rem" }}>{levelUpInfo.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.55rem",
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: levelUpInfo.color, marginBottom: "0.08rem",
              }}>
                Level Up!
              </div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>
                {levelUpInfo.label} Unlocked
              </div>
            </div>
          </div>
        )}

        {/* XP / Streak */}
        <motion.div 
          className="glass-card" 
          whileHover={{ y: -2 }}
          style={{
            borderRadius: "14px", padding: "1rem 1.5rem", marginBottom: "1.25rem",
            display: "flex", justifyContent: "center", gap: "2.5rem",
          }}
        >
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
        </motion.div>

        {/* ── Your Path — echo the choices the player actually made ────── */}
        {choiceHistory && choiceHistory.filter(c => c.question.length > 0).length >= 2 && (
          <YourPath choices={choiceHistory.filter(c => c.question.length > 0)} accent={accent} />
        )}

        {/* ── Monday Morning Prompt — Dr. Park's Transfer Bridge ────────── */}
        {/* "Near transfer requires an explicit bridge between the learning   */}
        {/*  context and the application context." — Perkins & Salomon, 1988  */}
        {/* ── Monday Morning Prompt — Dr. Park's Transfer Bridge ────────── */}
        {/* "Near transfer requires an explicit bridge between the learning   */}
        {/*  context and the application context." — Perkins & Salomon, 1988  */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          whileHover={{ y: -3 }}
          style={{
            borderRadius: "16px", marginBottom: "1.25rem",
            background: "rgba(0,212,240,0.04)",
            border: "1px solid rgba(0,212,240,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "0.65rem 1rem",
            borderBottom: "1px solid rgba(0,212,240,0.12)",
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(0,212,240,0.06)",
          }}>
            <span style={{ fontSize: "1rem" }}>☀️</span>
            <span style={{
              fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem",
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "rgba(0,212,240,0.85)",
            }}>
              Your Monday Morning Prompt
            </span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "Inter, sans-serif", fontSize: "0.62rem",
              color: "rgba(240,238,255,0.38)", fontWeight: 500,
            }}>
              Copy → use at work tomorrow
            </span>
          </div>

          {/* Prompt template */}
          <div style={{ padding: "0.75rem 1rem 0.5rem", position: "relative" }}>
            <pre style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
              fontSize: "0.88rem", color: "rgba(240,238,255,0.82)",
              lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {mondayPrompt}
            </pre>
          </div>

          {/* Copy button */}
          <div style={{ padding: "0.4rem 1rem 0.75rem" }}>
            <button
              onClick={copyPrompt}
              style={{
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem",
                color: promptCopied ? "#58cc02" : "rgba(0,212,240,0.9)",
                background: promptCopied ? "rgba(88,204,2,0.1)" : "rgba(0,212,240,0.08)",
                border: `1px solid ${promptCopied ? "rgba(88,204,2,0.4)" : "rgba(0,212,240,0.3)"}`,
                borderRadius: "100px", padding: "0.38rem 1rem",
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
            >
              {promptCopied ? "✓ Copied to clipboard!" : "📋 Copy prompt template"}
            </button>
          </div>
        </motion.div>

        {/* Share + Next */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <motion.a 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
              href={certLinkedInUrl ?? linkedInUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.825rem",
                color: "#fff", background: "#0A66C2",
                padding: "0.8rem 0.5rem", borderRadius: "100px", textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Share on LinkedIn
            </motion.a>
            <motion.button
              whileHover={certLoading ? {} : { scale: 1.03 }} 
              whileTap={certLoading ? {} : { scale: 0.97 }}
              onClick={handleGetCertificate}
              disabled={certLoading}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.825rem",
                color: certLoading ? "rgba(255,255,255,0.5)" : "#fff",
                background: certLoading ? "rgba(10,102,194,0.5)" : "#0A66C2",
                padding: "0.8rem 0.5rem", borderRadius: "100px",
                border: "none", cursor: certLoading ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {certLoading ? "⏳ Generating…" : "🎓 Get Certificate →"}
            </motion.button>
          </div>

          {/* Explore Jake's World */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/worldmap"
              style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.9rem",
                color:"rgba(240,238,255,0.7)",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.1)",
                padding:"0.8rem 2rem", borderRadius:"100px", textDecoration:"none",
                transition:"background 0.2s, border-color 0.2s, color 0.2s",
                width: "100%", boxSizing: "border-box"
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(255,255,255,0.2)" }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="rgba(240,238,255,0.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)" }}
            >
              🗺️ Explore Jake's World →
            </Link>
          </motion.div>

          {/* Chat with the Maestro */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => setShowTutor(true)}
              style={{
                width: "100%", fontFamily: "Inter, sans-serif", fontWeight: 700,
                fontSize: "0.9rem", color: accent,
                background: `${accent}12`,
                border: `1px solid ${accent}44`,
                padding: "0.8rem 2rem", borderRadius: "100px", cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent}22`; e.currentTarget.style.borderColor = `${accent}88` }}
              onMouseLeave={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.borderColor = `${accent}44` }}
            >
              🎼 Chat with the Maestro →
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {nextGame ? (
              <Link href={`/games/${nextGame.slug}`} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem",
                color: "#08060f",
                background: `linear-gradient(90deg, ${accent}, #e040fb)`,
                padding: "0.95rem 2rem", borderRadius: "100px", textDecoration: "none",
                boxShadow: `0 0 32px ${accent}44`,
                letterSpacing: "0.01em",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                width: "100%", boxSizing: "border-box"
              }}
              >
                <span style={{ fontSize: "1.1rem" }}>{nextGame.emoji ?? "🎵"}</span>
                {nextGame.free ? `Play Game ${nextGame.week} — Free →` : `Play Game ${nextGame.week} →`}
              </Link>
            ) : (
              <Link href="/games" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem",
                color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)",
                padding: "0.9rem 2rem", borderRadius: "100px", textDecoration: "none",
                width: "100%", boxSizing: "border-box"
              }}>
                View All Games →
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Maestro Tutor — Socratic post-game dialogue */}
      {showTutor && (
        <MaestroTutor
          game={game}
          onClose={() => setShowTutor(false)}
        />
      )}

      {/* Radio Chatter Modal — automatically triggered after the first game completes */}
      <AnimatePresence>
        {showRadioChatter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(5, 3, 13, 0.8)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem"
            }}
            onClick={() => {
              if (chatterIntervalRef.current) clearInterval(chatterIntervalRef.current)
              setShowRadioChatter(false)
              setIsPlayingLog(false)
              setTypedLogText("")
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={{
                maxWidth: "460px",
                width: "100%",
                background: "rgba(10, 8, 20, 0.98)",
                border: `1.5px solid ${JAKE_NOTE.color}35`,
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: `0 20px 48px rgba(0, 0, 0, 0.7), 0 0 30px ${JAKE_NOTE.color}15`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Retro Header */}
              <div style={{
                position: "absolute", top: "1rem", left: "1.5rem", right: "1.5rem",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.15em",
                color: "rgba(240, 238, 255, 0.35)", borderBottom: "1px solid rgba(255,255,255,0.06)",
                paddingBottom: "0.4rem"
              }}>
                <span>📻 RADIO CHATTER CH. {JAKE_NOTE.freq} kHz</span>
                <span style={{ color: isPlayingLog ? "#00d4f0" : "inherit" }}>
                  {isPlayingLog ? "● LIVE INCOMING" : "■ CONNECTION STANDBY"}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  if (chatterIntervalRef.current) clearInterval(chatterIntervalRef.current)
                  setShowRadioChatter(false)
                  setIsPlayingLog(false)
                  setTypedLogText("")
                }}
                style={{
                  position: "absolute", top: "2rem", right: "1.5rem",
                  background: "none", border: "none", color: "rgba(255, 255, 255, 0.4)",
                  fontSize: "1rem", cursor: "pointer", fontWeight: 800, zIndex: 10
                }}
              >
                ✕
              </button>

              {/* Character art representation */}
              <div style={{ marginTop: "1.5rem", position: "relative" }}>
                <div style={{
                  width: "110px", height: "110px", borderRadius: "50%",
                  border: `3px solid ${JAKE_NOTE.color}`,
                  background: `url(${JAKE_NOTE.avatar}) bottom center / cover no-repeat`,
                  boxShadow: `0 0 24px ${JAKE_NOTE.color}25`
                }}
                className={isPlayingLog ? "char-talk" : "char-breathe"}
                />
                
                {isPlayingLog && (
                  <div style={{
                    position: "absolute", bottom: "-3px", right: "-3px",
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "#08060f", border: `1.5px solid ${JAKE_NOTE.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", animation: "side-nav-pulse 1.2s infinite"
                  }}>
                    🔊
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", margin: "0.8rem 0 0.15rem" }}>
                {JAKE_NOTE.sender}
              </h3>
              <div style={{
                fontSize: "0.68rem", fontWeight: 700, color: JAKE_NOTE.color,
                textTransform: "uppercase", letterSpacing: "0.10em", marginBottom: "1.5rem"
              }}>
                {JAKE_NOTE.subject}
              </div>

              {/* Monospace monolog screen */}
              <div style={{
                width: "100%", minHeight: "140px", background: "#060408",
                border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: "16px",
                padding: "1rem 1.2rem", textAlign: "left", boxSizing: "border-box",
                marginBottom: "1.6rem", position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.5,
                  color: "rgba(240, 238, 255, 0.8)", whiteSpace: "pre-wrap"
                }}>
                  {isPlayingLog ? typedLogText : `[Click Play to establish link...]`}
                </div>
                
                {isPlayingLog && typedLogText.length < JAKE_NOTE.content.length && (
                  <span style={{
                    display: "inline-block", width: "8px", height: "14px",
                    background: JAKE_NOTE.color, marginLeft: "3px",
                    animation: "wm-star-twinkle 0.8s infinite"
                  }} />
                )}
              </div>

              {/* Voice Waveform visualizer */}
              {isPlayingLog && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "3px", height: "30px", marginBottom: "1.5rem"
                }}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "3px",
                        background: JAKE_NOTE.color,
                        borderRadius: "2px",
                        animation: `wm-wave-bar ${0.4 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Audio controls */}
              <button
                onClick={() => {
                  if (isPlayingLog) {
                    if (chatterIntervalRef.current) clearInterval(chatterIntervalRef.current)
                    setIsPlayingLog(false)
                    setTypedLogText("")
                    return
                  }
                  
                  // Play tuning chimes
                  playSynthBeep(JAKE_NOTE.freq, "sawtooth", 0.02, 0.15)
                  setTimeout(() => playSynthBeep(JAKE_NOTE.freq * 1.5, "sine", 0.02, 0.3), 150)
                  
                  setIsPlayingLog(true)
                  setTypedLogText("")
                  
                  // Start typing text interval
                  let idx = 0
                  const text = JAKE_NOTE.content
                  chatterIntervalRef.current = setInterval(() => {
                    idx++
                    setTypedLogText(text.slice(0, idx))
                    if (idx >= text.length) {
                      if (chatterIntervalRef.current) clearInterval(chatterIntervalRef.current)
                      // Play end click
                      playSynthBeep(220, "triangle", 0.03, 0.1)
                    }
                  }, 25)
                }}
                style={{
                  width: "100%",
                  background: isPlayingLog ? "rgba(255, 255, 255, 0.05)" : JAKE_NOTE.color,
                  color: isPlayingLog ? "rgba(255, 255, 255, 0.7)" : "#08060f",
                  border: isPlayingLog ? `1px solid ${JAKE_NOTE.color}44` : "none",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  boxShadow: isPlayingLog ? "none" : `0 0 20px ${JAKE_NOTE.color}25`,
                  transition: "all 0.12s"
                }}
              >
                {isPlayingLog ? "⏹ Stop Transmission" : "▶ Play Audio Log"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
