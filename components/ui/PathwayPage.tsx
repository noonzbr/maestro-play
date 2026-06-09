"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Game } from "@/lib/games/types"
import FloatingNotes from "@/components/game/FloatingNotes"

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getGameXp(week: number): number {
  if (typeof window === "undefined") return 0
  try { return parseInt(localStorage.getItem(`maestro_game_${week}_xp`) ?? "0") || 0 } catch { return 0 }
}

function getTotalXp(): number {
  if (typeof window === "undefined") return 0
  try { return parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0 } catch { return 0 }
}

function getStreak(): number {
  if (typeof window === "undefined") return 0
  try { return parseInt(localStorage.getItem("maestro_daily_streak") ?? "0") || 0 } catch { return 0 }
}

// ─── Conductor levels ─────────────────────────────────────────────────────────

const CONDUCTOR_LEVELS = [
  { label: "Apprentice",    minXp: 0,    color: "#00d4f0" },
  { label: "Associate",     minXp: 500,  color: "#e040fb" },
  { label: "Conductor",     minXp: 1500, color: "#ffb700" },
  { label: "Grand Maestro", minXp: 3000, color: "#ff6b35" },
]

function getCurrentLevel(xp: number) {
  for (let i = CONDUCTOR_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= CONDUCTOR_LEVELS[i].minXp) return CONDUCTOR_LEVELS[i]
  }
  return CONDUCTOR_LEVELS[0]
}

function getNextLevel(xp: number) {
  return CONDUCTOR_LEVELS.find(l => xp < l.minXp) ?? null
}

// ─── Problem hooks ────────────────────────────────────────────────────────────

const HOOKS: Record<number, string> = {
  1:  "While Jake perfected one riff for weeks, his rival dropped an AI-assisted EP. Same talent. One method makes the difference.",
  2:  "Zoe spends three hours on AI sessions that should take twenty minutes. She understands music — not how the model actually thinks.",
  3:  "47 unread emails. Board meeting in 3 hours. Carlos is drowning while his AI-fluent colleagues run circles around him.",
  4:  "Aria trained 20 years to master the violin. AI now composes symphonies in minutes. She must find what the machine can never replicate.",
  5:  "Jordan asked Claude for strategic help and got generic blog-post advice. She didn't know how to unlock what it's actually capable of.",
  6:  "Kai writes clean code. His colleague ships the same features 4× faster using Claude Code. Same salary. Radically different trajectory.",
  7:  "Priya handles 12 workflows manually that AI could run in twenty minutes — if she knew how to build the pipeline.",
  8:  "Alex uses ChatGPT like a search engine and gets search engine results. The version of him who treats it as a thought partner books 40% more clients.",
  9:  "Luna's ear is better than any algorithm. But algorithms are booking gigs and scoring films. Instinct plus AI beats instinct alone.",
  10: "Sam built complex systems by hand for 15 years. AI prototypes them in hours now. The builder who becomes the architect is the one who survives.",
  11: "Copilot appeared in Jake's Office 365 toolbar. His manager now expects an AI productivity report. He has 48 hours to figure out what it actually does.",
  12: "Jake wants to build AI tools without writing code. Copilot Studio promises no-code agents. The gap between promise and reality is exactly where this game lives.",
  13: "Jake hits the wall again. Before you learn the principles, you must experience the impasse. The Conductor Principle, remastered.",
  14: "Maya teaches the craft of prompting — the one skill that makes EVERY AI tool in your toolkit 10x more powerful.",
  15: "Vera Chen knows design isn't about taste — it's about decisions you can defend. Align typographies, grids, and accessibility with the help of AI.",
  16: "A solar flare scrambled the navigation computer. Help Commander Nova repair Orion station using the Antigravity CLI and specialized subagents.",
}

// ─── Track definitions ────────────────────────────────────────────────────────

const TRACKS = [
  {
    number: "00",
    name: "Hub Proximity",
    color: "#00d4f0",
    bg: "rgba(0,212,240,0.06)",
    weeks: [1, 13],
    tagline: "Enter the orchestra. Awaken the Conductor within.",
    cert: "Hub Apprentice",
    icon: "🎬",
  },
  {
    number: "01",
    name: "Track A - AI Fundamentals",
    color: "#00e676",
    bg: "rgba(0,230,118,0.06)",
    weeks: [2, 3, 4],
    tagline: "Before you can conduct, you have to hear the music.",
    cert: "AI Foundations",
    icon: "🎵",
  },
  {
    number: "02",
    name: "Track B - Claude Ecosystem",
    color: "#ff9100",
    bg: "rgba(255,145,0,0.06)",
    weeks: [5, 6, 7],
    tagline: "Stop describing. Start conducting.",
    cert: "Claude Expert",
    icon: "🎼",
  },
  {
    number: "03",
    name: "Track C - ChatGPT + Gemini",
    color: "#e040fb",
    bg: "rgba(224,64,251,0.06)",
    weeks: [8, 9, 10],
    tagline: "Every instrument matters. Know which one to pick.",
    cert: "AI Explorer",
    icon: "🛠️",
  },
  {
    number: "04",
    name: "Track D - Microsoft Copilot",
    color: "#4488ff",
    bg: "rgba(68,136,255,0.06)",
    weeks: [11, 12],
    tagline: "The AI is already in your tools. Start using it.",
    cert: "Microsoft AI",
    icon: "💼",
  },
  {
    number: "05",
    name: "Convergence - Prompt Lab & Design",
    color: "#ff1744",
    bg: "rgba(255,23,68,0.06)",
    weeks: [14, 15, 16],
    tagline: "Unite the tools. Forge the masterpiece.",
    cert: "Grand Maestro",
    icon: "👑",
  },
]

// ─── Global progress header ───────────────────────────────────────────────────

function ProgressHeader({ games }: { games: Game[] }) {
  const [totalXp,  setTotalXp]  = useState(0)
  const [streak,   setStreak]   = useState(0)
  const [completed, setCompleted] = useState(0)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    setMounted(true)
    const refresh = () => {
      setTotalXp(getTotalXp())
      setStreak(getStreak())
      setCompleted(games.filter(g => getGameXp(g.week) > 0).length)
    }
    refresh()
    window.addEventListener("storage", refresh)
    window.addEventListener("focus",   refresh)
    return () => {
      window.removeEventListener("storage", refresh)
      window.removeEventListener("focus",   refresh)
    }
  }, [games])

  if (!mounted || totalXp === 0) return null

  const level    = getCurrentLevel(totalXp)
  const nextLv   = getNextLevel(totalXp)
  const prevMinXp = level.minXp
  const nextMinXp = nextLv?.minXp ?? prevMinXp
  const pct = nextLv
    ? Math.min(100, ((totalXp - prevMinXp) / (nextMinXp - prevMinXp)) * 100)
    : 100

  return (
    <div style={{
      maxWidth:      "860px",
      margin:        "0 auto 3rem",
      padding:       "1.5rem 2rem",
      background:    "rgba(255,255,255,0.025)",
      border:        "1px solid rgba(255,255,255,0.07)",
      borderRadius:  "20px",
      display:       "flex",
      alignItems:    "center",
      gap:           "2rem",
      flexWrap:      "wrap",
    }}>
      {/* Level badge */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0 }}>
        <div style={{
          width:         "52px",
          height:        "52px",
          borderRadius:  "50%",
          background:    `${level.color}18`,
          border:        `2px solid ${level.color}55`,
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          boxShadow:     `0 0 20px ${level.color}22`,
        }}>
          <span style={{ fontSize:"1.4rem" }}>🎼</span>
        </div>
        <div>
          <div style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:"1rem", color:"#fff" }}>
            {level.label}
          </div>
          <div style={{ fontFamily:"Inter,sans-serif", fontSize:"0.65rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:"0.1rem" }}>
            Conductor Level
          </div>
        </div>
      </div>

      {/* XP + progress bar */}
      <div style={{ flex:1, minWidth:"160px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"0.4rem" }}>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:"1.1rem", color:level.color }}>
            ⚡ {totalXp.toLocaleString()} XP
          </span>
          {nextLv && (
            <span style={{ fontFamily:"Inter,sans-serif", fontSize:"0.65rem", color:"rgba(240,238,255,0.35)" }}>
              {nextLv.minXp - totalXp} to {nextLv.label}
            </span>
          )}
        </div>
        <div style={{ height:"8px", background:"rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>
          <div style={{
            height:     "100%",
            width:      `${pct}%`,
            background: `linear-gradient(90deg,${level.color},#e040fb)`,
            borderRadius:"4px",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:"1.5rem", flexShrink:0 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"1.6rem", color:"#fff", lineHeight:1 }}>
            {completed}
          </div>
          <div style={{ fontFamily:"Inter,sans-serif", fontSize:"0.6rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
            Games Done
          </div>
        </div>
        {streak > 0 && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"1.6rem", color:"#e040fb", lineHeight:1 }}>
              {streak}🔥
            </div>
            <div style={{ fontFamily:"Inter,sans-serif", fontSize:"0.6rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
              Day Streak
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── GameCard — Duolingo style ────────────────────────────────────────────────

function GameCard({
  game, hook, color, earnedXp, isNext, isLocked,
}: {
  game: Game
  hook: string
  color: string
  earnedXp: number
  isNext: boolean
  isLocked: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const isCompleted = earnedXp > 0

  return (
    <Link
      href={isLocked ? "#" : `/games/${game.slug}`}
      style={{ textDecoration:"none", flexShrink:0, scrollSnapAlign:"start", display:"block" }}
      onClick={isLocked ? e => e.preventDefault() : undefined}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width:        "272px",
          height:       "436px",
          borderRadius: "18px",
          overflow:     "hidden",
          position:     "relative",
          background:   "#0c0a14",
          border:       isCompleted
            ? `1px solid ${color}55`
            : isNext
            ? `2px solid ${color}88`
            : hovered
            ? `1px solid ${color}44`
            : "1px solid rgba(255,255,255,0.07)",
          boxShadow:    isNext
            ? `0 0 0 3px ${color}18, 0 16px 48px rgba(0,0,0,0.4), 0 0 32px ${color}15`
            : isCompleted
            ? `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${color}20`
            : hovered
            ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${color}22`
            : "0 4px 24px rgba(0,0,0,0.3)",
          transition:   "all 0.3s ease",
          transform:    hovered && !isLocked ? "translateY(-6px)" : "translateY(0)",
          cursor:       isLocked ? "not-allowed" : "pointer",
          display:      "flex",
          flexDirection:"column",
          opacity:      isLocked ? 0.4 : 1,
        }}
      >
        {/* ── Character photo area ────────────────────────────────── */}
        <div style={{ height:"58%", position:"relative", flexShrink:0, background:"#0c0a14" }}>
          {game.characterImage ? (
            <img
              src={game.characterImage}
              alt={game.characterName || game.title}
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }}
            />
          ) : (
            <div style={{
              width:"100%", height:"100%",
              background:`linear-gradient(160deg,${color}14,#0c0a14)`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <span style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"4rem", color:`${color}44` }}>
                {game.characterName?.[0] ?? "?"}
              </span>
            </div>
          )}

          {/* Gradient fade */}
          <div style={{
            position:"absolute", inset:0,
            background:"linear-gradient(to bottom,transparent 25%,rgba(12,10,20,0.35) 60%,rgba(12,10,20,0.97) 100%)",
            pointerEvents:"none",
          }} />

          {/* Completed overlay */}
          {isCompleted && (
            <div style={{
              position:      "absolute",
              inset:         0,
              background:    `${color}08`,
              display:       "flex",
              alignItems:    "flex-start",
              justifyContent:"flex-end",
              padding:       "0.65rem",
              pointerEvents: "none",
            }}>
              <div style={{
                width:         "28px",
                height:        "28px",
                borderRadius:  "50%",
                background:    `linear-gradient(135deg,${color},${color}cc)`,
                display:       "flex",
                alignItems:    "center",
                justifyContent:"center",
                boxShadow:     `0 0 16px ${color}55`,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13L9 17L19 7" stroke="#08060f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* "Next" pulse ring */}
          {isNext && !isCompleted && (
            <div style={{
              position:      "absolute",
              top:           "0.65rem",
              right:         "0.65rem",
              width:         "28px",
              height:        "28px",
              borderRadius:  "50%",
              border:        `2px solid ${color}`,
              animation:     "pulse-ring 2s ease-in-out infinite",
              pointerEvents: "none",
            }} />
          )}

          {/* Locked overlay */}
          {isLocked && (
            <div style={{
              position:      "absolute",
              inset:         0,
              background:    "rgba(8,6,15,0.6)",
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
              pointerEvents: "none",
            }}>
              <div style={{ fontSize:"2rem", filter:"grayscale(1) opacity(0.5)" }}>🔒</div>
            </div>
          )}

          {/* Game number badge */}
          <div style={{
            position:     "absolute",
            top:          "0.65rem",
            left:         "0.65rem",
            background:   `${color}18`,
            border:       `1px solid ${color}44`,
            borderRadius: "100px",
            padding:      "0.18rem 0.55rem",
          }}>
            <span style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.58rem", letterSpacing:"0.22em", textTransform:"uppercase", color }}>
              Chapter {game.week}
            </span>
          </div>

          {/* XP earned badge */}
          {isCompleted && (
            <div style={{
              position:     "absolute",
              bottom:       "3.5rem",
              left:         "0.65rem",
              background:   "rgba(8,6,15,0.85)",
              border:       `1px solid ${color}44`,
              borderRadius: "100px",
              padding:      "0.2rem 0.55rem",
              backdropFilter:"blur(8px)",
            }}>
              <span style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:"0.62rem", color, letterSpacing:"0.05em" }}>
                ⚡ {earnedXp} XP earned
              </span>
            </div>
          )}

          {/* Character name */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 0.9rem 0.7rem" }}>
            <p style={{ fontFamily:"Inter,sans-serif", fontWeight:900, fontSize:"1.2rem", color:"#fff", margin:0, letterSpacing:"-0.02em", lineHeight:1.1 }}>
              {game.characterName || game.title}
            </p>
            {game.characterRole && (
              <p style={{ fontFamily:"Inter,sans-serif", fontSize:"0.65rem", color:"rgba(240,238,255,0.45)", margin:"0.15rem 0 0", letterSpacing:"0.06em" }}>
                {game.characterRole}
              </p>
            )}
          </div>
        </div>

        {/* ── Content area ──────────────────────────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0.65rem 0.9rem 0.85rem" }}>
          <p style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#fff", margin:"0 0 0.45rem", lineHeight:1.3, letterSpacing:"-0.01em" }}>
            {game.title}
          </p>

          <p style={{ fontFamily:"Cormorant Garamond,serif", fontStyle:"italic", fontSize:"0.83rem", color:"rgba(240,238,255,0.5)", lineHeight:1.65, flex:1, margin:"0 0 0.65rem" }}>
            {hook || game.description}
          </p>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"Inter,sans-serif", fontWeight:500, fontSize:"0.65rem", color:"rgba(240,238,255,0.3)", letterSpacing:"0.06em" }}>
              {game.duration}
            </span>
            <div style={{
              fontFamily:  "Inter,sans-serif",
              fontWeight:  800,
              fontSize:    "0.75rem",
              color:       "#08060f",
              background:  isCompleted
                ? `${color}cc`
                : hovered
                ? color
                : `${color}cc`,
              padding:     "0.35rem 0.9rem",
              borderRadius:"100px",
              transition:  "background 0.2s ease",
              letterSpacing:"0.04em",
            }}>
              {isCompleted ? "Replay →" : isNext ? "Play Now →" : "Play →"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Track progress bar ───────────────────────────────────────────────────────

function TrackProgress({ track, gamesInTrack, completedCount, color }: {
  track: typeof TRACKS[0]
  gamesInTrack: number
  completedCount: number
  color: string
}) {
  const pct = gamesInTrack > 0 ? (completedCount / gamesInTrack) * 100 : 0

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
      <div style={{ flex:1, height:"5px", background:"rgba(255,255,255,0.07)", borderRadius:"3px", overflow:"hidden" }}>
        <div style={{
          height:     "100%",
          width:      `${pct}%`,
          background: `linear-gradient(90deg,${color},${color}bb)`,
          borderRadius:"3px",
          transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
          boxShadow:  pct > 0 ? `0 0 8px ${color}44` : "none",
        }} />
      </div>
      <span style={{ fontFamily:"Inter,sans-serif", fontSize:"0.65rem", fontWeight:700, color, flexShrink:0 }}>
        {completedCount}/{gamesInTrack}
      </span>
    </div>
  )
}

// ─── Cert node ────────────────────────────────────────────────────────────────

function CertNode({ track, unlocked }: { track: typeof TRACKS[0]; unlocked: boolean }) {
  return (
    <div style={{
      width:         "140px",
      height:        "436px",
      flexShrink:    0,
      scrollSnapAlign:"start",
      display:       "flex",
      flexDirection: "column",
      alignItems:    "center",
      justifyContent:"center",
      gap:           "0.65rem",
      padding:       "0 1rem",
      opacity:       unlocked ? 1 : 0.35,
    }}>
      <div style={{ width:"1px", height:"60px", background:`linear-gradient(180deg,transparent,${track.color}55)` }} />
      <div style={{
        width:         "60px",
        height:        "60px",
        borderRadius:  "50%",
        background:    unlocked ? `${track.color}20` : "rgba(255,255,255,0.04)",
        border:        `1.5px solid ${unlocked ? track.color + "66" : "rgba(255,255,255,0.12)"}`,
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
        boxShadow:     unlocked ? `0 0 28px ${track.color}28` : "none",
        animation:     unlocked ? "pulse-glow 3s ease-in-out infinite" : "none",
      }}>
        {unlocked ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke={track.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={`${track.color}30`} />
          </svg>
        ) : (
          <span style={{ fontSize:"1.2rem", filter:"grayscale(1) opacity(0.4)" }}>🏆</span>
        )}
      </div>
      <div style={{ textAlign:"center" }}>
        <p style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.58rem", letterSpacing:"0.22em", textTransform:"uppercase", color: unlocked ? track.color : "rgba(240,238,255,0.25)", margin:"0 0 0.2rem" }}>
          {track.cert}
        </p>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"0.55rem", color:"rgba(240,238,255,0.25)", margin:0, letterSpacing:"0.05em" }}>
          {unlocked ? "Certificate Earned" : "Complete all games"}
        </p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { games: Game[] }

export default function PathwayPage({ games }: Props) {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([])
  const [progress, setProgress] = useState<Record<number, number>>({})
  const [mounted,  setMounted]  = useState(false)

  const scroll = (idx: number, dir: number) => {
    const el = scrollRefs.current[idx]
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  // Load progress from localStorage
  useEffect(() => {
    setMounted(true)
    const load = () => {
      const p: Record<number, number> = {}
      games.forEach(g => { p[g.week] = getGameXp(g.week) })
      setProgress(p)
    }
    load()
    window.addEventListener("storage", load)
    window.addEventListener("focus",   load)
    return () => {
      window.removeEventListener("storage", load)
      window.removeEventListener("focus",   load)
    }
  }, [games])

  // Inject keyframes
  useEffect(() => {
    const id = "pathway-keyframes"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes pulse-ring {
        0%,100% { transform:scale(1);   opacity:0.8; }
        50%      { transform:scale(1.3); opacity:0.3; }
      }
      @keyframes shimmer-slide {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(400%); }
      }
      @keyframes float-badge {
        0%,100% { transform:translateY(0); }
        50%      { transform:translateY(-4px); }
      }
    `
    document.head.appendChild(s)
  }, [])

  // Determine first incomplete game across all tracks (the "next" game)
  const firstIncompleteWeek = games.find(g => !progress[g.week] || progress[g.week] === 0)?.week ?? -1

  const isGameLocked = (game: Game, gi: number, trackGames: Game[]) => {
    if (!mounted) return true

    // 1. Game 1 is always unlocked
    if (game.week === 1) return false

    // 2. All other games require Game 1 to be completed
    const game1Completed = (progress[1] ?? 0) > 0
    if (!game1Completed) return true

    // 3. For Convergence track start (Week 14)
    if (game.week === 14) {
      const trackACompleted = (progress[4] ?? 0) > 0
      const trackBCompleted = (progress[7] ?? 0) > 0
      const trackCCompleted = (progress[10] ?? 0) > 0
      const trackDCompleted = (progress[12] ?? 0) > 0
      return !(trackACompleted || trackBCompleted || trackCCompleted || trackDCompleted)
    }

    // 4. Sequential check within the track
    const firstIncompleteIdx = trackGames.findIndex(g => (progress[g.week] ?? 0) === 0)
    if (firstIncompleteIdx !== -1 && gi > firstIncompleteIdx) {
      return true
    }

    return false
  }

  return (
    <div style={{ background:"var(--bg-primary)", minHeight:"100vh", overflowX:"hidden", position:"relative" }}>
      {/* Ambient floating musical notes — same system used in game scenes */}
      <FloatingNotes mood="normal" />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ padding:"7rem 2rem 4rem", textAlign:"center", maxWidth:"860px", margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{
          fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.6rem",
          letterSpacing:"0.38em", textTransform:"uppercase",
          color:"rgba(0,212,240,0.65)", marginBottom:"1.75rem",
        }}>
          The Curriculum
        </div>

        <h1 style={{
          fontFamily:"Cormorant Garamond,serif", fontWeight:700,
          fontSize:"clamp(2.8rem,7vw,5rem)", color:"#fff",
          lineHeight:1.05, letterSpacing:"-0.02em", marginBottom:"1.5rem",
        }}>
          Everyone&apos;s using AI.
          <br />
          <em style={{ color:"rgba(240,238,255,0.55)" }}>Almost nobody&apos;s using it right.</em>
        </h1>

        <div style={{
          maxWidth:"640px", margin:"0 auto 2rem",
          background:"rgba(255,255,255,0.025)",
          border:"1px solid rgba(255,255,255,0.07)",
          borderRadius:"16px", padding:"1.5rem 2rem",
          textAlign:"left",
        }}>
          <p style={{ fontFamily:"Inter,sans-serif", fontSize:"0.95rem", color:"rgba(240,238,255,0.55)", lineHeight:1.85, margin:"0 0 1rem" }}>
            Jake&apos;s rival released an AI-assisted EP while Jake spent three weeks on a single riff.
            Carlos&apos;s colleague cleared her inbox in 20 minutes while Carlos drowned in 47 emails.
            Priya&apos;s replacement will manage 200 workflows where Priya manages 12.
          </p>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontStyle:"italic", fontSize:"1.1rem", color:"#fff", lineHeight:1.6, margin:0 }}>
            The tool is the same. The method is everything.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:"1.5rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"2.5rem" }}>
          {[
            { stat:"12", label:"Characters. 12 real situations." },
            { stat:"6",  label:"Tracks. One complete method." },
            { stat:"0",  label:"Code required. Ever." },
          ].map(({ stat, label }) => (
            <div key={stat} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"2.5rem", color:"var(--cyan)", lineHeight:1 }}>{stat}</div>
              <div style={{ fontFamily:"Inter,sans-serif", fontSize:"0.72rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.05em", marginTop:"0.2rem" }}>{label}</div>
            </div>
          ))}
        </div>

        <Link
          href="/games/welcome-to-ai"
          style={{
            display:"inline-block",
            fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.95rem",
            color:"#08060f", background:"linear-gradient(90deg,#00d4f0,#e040fb)",
            padding:"0.9rem 2.5rem", borderRadius:"100px", textDecoration:"none",
            boxShadow:"0 0 32px rgba(0,212,240,0.2)",
          }}
        >
          Start the First Game Free →
        </Link>
      </section>

      {/* ── PLAYER PROGRESS (only shows after first game) ───────────────── */}
      <div style={{ padding:"0 2rem" }}>
        <ProgressHeader games={games} />
      </div>

      {/* ── TRACKS ──────────────────────────────────────────────────────── */}
      {TRACKS.map((track, ti) => {
        const trackGames     = games.filter(g => track.weeks.includes(g.week))
        if (trackGames.length === 0) return null

        const completedCount = mounted ? trackGames.filter(g => (progress[g.week] ?? 0) > 0).length : 0
        const allDone        = completedCount === trackGames.length

        return (
          <section
            key={track.number}
            style={{ padding:"3rem 0 4rem", borderTop:"1px solid rgba(255,255,255,0.05)" }}
          >
            {/* Track header */}
            <div style={{ padding:"0 2rem", maxWidth:"1400px", margin:"0 auto 1.5rem" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:"1.25rem", flexWrap:"wrap" }}>
                {/* Big number */}
                <span style={{
                  fontFamily:"Cormorant Garamond,serif", fontWeight:700,
                  fontSize:"3.5rem", color:`${track.color}14`, lineHeight:1,
                  userSelect:"none", flexShrink:0,
                }}>
                  {track.number}
                </span>

                {/* Title + tagline + progress */}
                <div style={{ flex:1, minWidth:"180px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.25rem", flexWrap:"wrap" }}>
                    <span style={{ fontSize:"1.1rem" }}>{track.icon}</span>
                    <h2 style={{
                      fontFamily:"Inter,sans-serif", fontWeight:800,
                      fontSize:"clamp(1.1rem,2.5vw,1.4rem)", color:"#fff",
                      margin:0, letterSpacing:"-0.02em",
                    }}>
                      {track.name}
                    </h2>
                    {allDone && (
                      <div style={{
                        background:`${track.color}18`,
                        border:`1px solid ${track.color}44`,
                        borderRadius:"100px",
                        padding:"0.15rem 0.6rem",
                        display:"flex", alignItems:"center", gap:"0.3rem",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13L9 17L19 7" stroke={track.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.55rem", letterSpacing:"0.15em", textTransform:"uppercase", color:track.color }}>
                          Complete
                        </span>
                      </div>
                    )}
                  </div>

                  <p style={{
                    fontFamily:"Cormorant Garamond,serif", fontStyle:"italic",
                    fontSize:"1rem", color:`${track.color}99`,
                    margin:"0 0 0.65rem",
                  }}>
                    {track.tagline}
                  </p>

                  {mounted && completedCount > 0 && (
                    <TrackProgress
                      track={track}
                      gamesInTrack={trackGames.length}
                      completedCount={completedCount}
                      color={track.color}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Carousel */}
            <div style={{ position:"relative" }}>
              {/* Left arrow */}
              <button
                onClick={() => scroll(ti, -1)}
                aria-label="Scroll left"
                style={{
                  position:"absolute", left:"0.5rem", top:"50%",
                  transform:"translateY(-50%)", zIndex:20,
                  width:"36px", height:"36px", borderRadius:"50%",
                  background:"rgba(12,10,20,0.9)", border:"1px solid rgba(255,255,255,0.12)",
                  backdropFilter:"blur(10px)",
                  color:"rgba(240,238,255,0.7)", cursor:"pointer",
                  fontFamily:"Inter,sans-serif", fontSize:"1rem",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = track.color; e.currentTarget.style.color = track.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}
              >
                ←
              </button>

              {/* Scrollable row */}
              <div
                ref={el => { scrollRefs.current[ti] = el }}
                style={{
                  display:"flex",
                  gap:"1rem",
                  overflowX:"auto",
                  scrollSnapType:"x mandatory",
                  scrollbarWidth:"none",
                  WebkitOverflowScrolling:"touch",
                  padding:"0.75rem 3rem",
                  maskImage:"linear-gradient(to right,transparent 0%,black 4%,black 96%,transparent 100%)",
                  WebkitMaskImage:"linear-gradient(to right,transparent 0%,black 4%,black 96%,transparent 100%)",
                } as React.CSSProperties}
              >
                {trackGames.map((game, gi) => {
                  const earnedXp   = mounted ? (progress[game.week] ?? 0) : 0
                  const isNext     = mounted && game.week === firstIncompleteWeek
                  const isLocked   = isGameLocked(game, gi, trackGames)

                  return (
                    <GameCard
                      key={game.slug}
                      game={game}
                      hook={HOOKS[game.week] || game.description}
                      color={track.color}
                      earnedXp={earnedXp}
                      isNext={isNext}
                      isLocked={isLocked}
                    />
                  )
                })}
                <CertNode track={track} unlocked={allDone} />
              </div>

              {/* Right arrow */}
              <button
                onClick={() => scroll(ti, 1)}
                aria-label="Scroll right"
                style={{
                  position:"absolute", right:"0.5rem", top:"50%",
                  transform:"translateY(-50%)", zIndex:20,
                  width:"36px", height:"36px", borderRadius:"50%",
                  background:"rgba(12,10,20,0.9)", border:"1px solid rgba(255,255,255,0.12)",
                  backdropFilter:"blur(10px)",
                  color:"rgba(240,238,255,0.7)", cursor:"pointer",
                  fontFamily:"Inter,sans-serif", fontSize:"1rem",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = track.color; e.currentTarget.style.color = track.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}
              >
                →
              </button>
            </div>
          </section>
        )
      })}

      {/* ── CLOSING CTA ─────────────────────────────────────────────────── */}
      <section style={{
        textAlign:"center", padding:"5rem 2rem",
        borderTop:"1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontFamily:"Cormorant Garamond,serif", fontStyle:"italic", fontWeight:300, fontSize:"clamp(1.8rem,5vw,3rem)", color:"#fff", lineHeight:1.2, marginBottom:"0.75rem" }}>
          The orchestra is ready.
        </div>
        <p style={{ fontFamily:"Inter,sans-serif", fontSize:"0.9rem", color:"rgba(240,238,255,0.4)", marginBottom:"2rem" }}>
          Chapter 1 is free. No signup. Start in thirty seconds.
        </p>
        <Link
          href="/games/welcome-to-ai"
          style={{
            fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"0.95rem",
            color:"#08060f", background:"linear-gradient(90deg,#00d4f0,#e040fb)",
            padding:"0.9rem 2.5rem", borderRadius:"100px", textDecoration:"none",
          }}
        >
          Play Chapter 1 Free →
        </Link>
      </section>
    </div>
  )
}
