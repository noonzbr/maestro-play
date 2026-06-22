"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Nav from "@/components/ui/Nav"
import { allGames } from "@/lib/games"
import { Game } from "@/lib/games/types"
import { useAuth } from "@/context/AuthContext"
import { supabaseBrowser } from "@/lib/supabase-browser"
import AnimatedFlame from "@/components/ui/AnimatedFlame"

/* ─── localStorage helpers ──────────────────────────────────────────────── */
function lsGet(key: string, fallback = 0): number {
  if (typeof window === "undefined") return fallback
  try { return parseInt(localStorage.getItem(key) ?? String(fallback)) || fallback } catch { return fallback }
}
function lsStr(key: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
function lsJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function lsSet(key: string, val: string) {
  try { localStorage.setItem(key, val) } catch {}
}
function getGameXp(week: number): number { return lsGet(`maestro_game_${week}_xp`) }

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const unsigned = (hash >>> 0).toString(36);
  return "mp" + unsigned.padStart(8, "0");
}

/* ─── Level system ──────────────────────────────────────────────────────── */
const LEVELS = [
  { label: "Apprentice",    minXp: 0,    maxXp: 499,  color: "#00d4f0", icon: "🎵" },
  { label: "Associate",     minXp: 500,  maxXp: 1499, color: "#e040fb", icon: "🎼" },
  { label: "Conductor",     minXp: 1500, maxXp: 2999, color: "#ffb700", icon: "🎹" },
  { label: "Grand Maestro", minXp: 3000, maxXp: 99999,color: "#ff6b35", icon: "🏆" },
]
function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--)
    if (xp >= LEVELS[i].minXp) return LEVELS[i]
  return LEVELS[0]
}
function getNextLevel(xp: number) {
  return LEVELS.find(l => xp < l.minXp) ?? null
}

/* ─── Tracks ────────────────────────────────────────────────────────────── */
const TRACKS = [
  { number: "01", name: "AI Fundamentals", color: "#00d4f0", weeks: [1, 2, 3, 4],   icon: "🎵" },
  { number: "02", name: "Claude & Prompts", color: "#e040fb", weeks: [5, 6, 7, 8],   icon: "🎼" },
  { number: "03", name: "The AI Toolkit",   color: "#00e676", weeks: [9, 10],          icon: "🛠️" },
  { number: "04", name: "Microsoft AI",     color: "#4488ff", weeks: [11, 12],         icon: "💼" },
]

/* ─── Power-ups config ──────────────────────────────────────────────────── */
type PowerupKey = "doubleXp" | "hint" | "shield" | "maestroMode"
interface PowerupState { doubleXp: boolean; hint: boolean; shield: boolean; maestroMode: boolean }
interface PowerupActive { doubleXp: number | null; shield: number | null } // timestamp when activated (for timed ones)

const POWERUPS: Array<{
  key: PowerupKey; emoji: string; name: string; desc: string
  unlock: string; unlockCheck: (streak: number, xp: number, completedTracks: number) => boolean
  timed: boolean; duration?: number // ms
}> = [
  {
    key: "doubleXp", emoji: "⚡", name: "Double XP",
    desc: "Earn 2× XP for 30 minutes",
    unlock: "Unlock at 7-day streak",
    unlockCheck: (streak) => streak >= 7,
    timed: true, duration: 30 * 60 * 1000,
  },
  {
    key: "hint", emoji: "🔍", name: "Hint Token",
    desc: "Eliminate one wrong choice",
    unlock: "Complete any full track",
    unlockCheck: (_s, _xp, completedTracks) => completedTracks >= 1,
    timed: false,
  },
  {
    key: "shield", emoji: "🛡️", name: "Streak Shield",
    desc: "Protect your streak for 1 day",
    unlock: "Unlock at 14-day streak",
    unlockCheck: (streak) => streak >= 14,
    timed: true, duration: 24 * 60 * 60 * 1000,
  },
  {
    key: "maestroMode", emoji: "🎼", name: "Maestro Mode",
    desc: "Reveal AI reasoning on any question",
    unlock: "Unlock at Grand Maestro (3000 XP)",
    unlockCheck: (_s, xp) => xp >= 3000,
    timed: false,
  },
]

/* ─── Animated counter ──────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === 0) { setVal(0); return }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p    = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

/* ─── SVG Progress Ring ─────────────────────────────────────────────────── */
function ProgressRing({ r = 28, pct, color }: { r?: number; pct: number; color: string }) {
  const circ = 2 * Math.PI * r
  return (
    <svg width={r * 2 + 8} height={r * 2 + 8} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={r + 4} cy={r + 4} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
      <circle cx={r + 4} cy={r + 4} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct / 100)}
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
    </svg>
  )
}

/* ─── Lives display ─────────────────────────────────────────────────────── */
function LivesDisplay({ lives, maxLives = 3 }: { lives: number; maxLives?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem" }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#ff4b4b", opacity: 0.8, marginBottom: "0.2rem" }}>
        Lives
      </div>
      <div style={{ display: "flex", gap: "0.4rem" }}>
        {Array.from({ length: maxLives }).map((_, i) => (
          <div key={i} style={{
            fontSize: "1.5rem",
            filter: i < lives
              ? "drop-shadow(0 0 8px rgba(255,75,75,0.7))"
              : "grayscale(1) brightness(0.35)",
            transition: "filter 0.4s ease",
            animation: i < lives ? `heart-pulse ${1.8 + i * 0.3}s ease-in-out infinite` : "none",
          }}>
            ❤️
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "rgba(240,238,255,0.35)" }}>
        {lives === maxLives ? "Full" : `${lives}/${maxLives} · refills daily`}
      </div>
    </div>
  )
}

/* ─── Power-up card ─────────────────────────────────────────────────────── */
function PowerupCard({
  pu, unlocked, active, activeUntil, onActivate,
}: {
  pu: typeof POWERUPS[0]
  unlocked: boolean
  active: boolean
  activeUntil: number | null
  onActivate: (key: PowerupKey) => void
}) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    if (!active || !activeUntil || !pu.timed) return
    const tick = () => {
      const ms   = activeUntil - Date.now()
      if (ms <= 0) { setTimeLeft("Expired"); return }
      const m    = Math.floor(ms / 60000)
      const s    = Math.floor((ms % 60000) / 1000)
      setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [active, activeUntil, pu.timed])

  const color = active ? "#00d4f0" : unlocked ? "#e040fb" : "rgba(255,255,255,0.18)"

  return (
    <div style={{
      background:    active ? "rgba(0,212,240,0.07)" : unlocked ? "rgba(224,64,251,0.05)" : "rgba(255,255,255,0.015)",
      border:        `1px solid ${active ? "rgba(0,212,240,0.35)" : unlocked ? "rgba(224,64,251,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius:  "16px",
      padding:       "1rem 1.1rem",
      display:       "flex",
      flexDirection: "column",
      gap:           "0.5rem",
      minWidth:      "160px",
      flex:          "1 1 160px",
      maxWidth:      "220px",
      position:      "relative",
      overflow:      "hidden",
      transition:    "border-color 0.2s",
      boxShadow:     active ? "0 0 24px rgba(0,212,240,0.12)" : "none",
    }}>
      {/* Active shimmer */}
      {active && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(0,212,240,0.04), transparent)",
          animation: "pu-shimmer 2s ease-in-out infinite",
          pointerEvents: "none",
        }} />
      )}

      {/* Emoji */}
      <div style={{
        fontSize: "1.8rem",
        filter: unlocked
          ? active ? "drop-shadow(0 0 10px rgba(0,212,240,0.7))" : "drop-shadow(0 0 6px rgba(224,64,251,0.5))"
          : "grayscale(1) blur(1px) brightness(0.3)",
        transition: "filter 0.3s",
      }}>
        {pu.emoji}
      </div>

      {/* Name + desc */}
      <div>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", color: unlocked ? "#fff" : "rgba(240,238,255,0.28)", marginBottom: "0.18rem" }}>
          {pu.name}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "rgba(240,238,255,0.4)", lineHeight: 1.4 }}>
          {unlocked ? pu.desc : pu.unlock}
        </div>
      </div>

      {/* Status / button */}
      {unlocked ? (
        active ? (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            background: "rgba(0,212,240,0.12)", border: "1px solid rgba(0,212,240,0.3)",
            borderRadius: "100px", padding: "0.25rem 0.65rem", alignSelf: "flex-start",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00d4f0", animation: "pu-dot-pulse 1s ease-in-out infinite" }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", color: "#00d4f0", letterSpacing: "0.08em" }}>
              {pu.timed ? `Active · ${timeLeft}` : "Active"}
            </span>
          </div>
        ) : (
          <button
            onClick={() => onActivate(pu.key)}
            style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem",
              color: "#08060f",
              background: `linear-gradient(90deg, ${color}, #e040fb)`,
              padding: "0.38rem 0.85rem", borderRadius: "100px",
              border: "none", cursor: "pointer", alignSelf: "flex-start",
              letterSpacing: "0.04em", transition: "transform 0.15s, filter 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.15)"; e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = "" }}
          >
            Activate
          </button>
        )
      ) : (
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
          color: "rgba(240,238,255,0.2)", fontStyle: "italic",
        }}>
          🔒 Locked
        </div>
      )}
    </div>
  )
}

/* ─── Game card ─────────────────────────────────────────────────────────── */
function GameCard({ game, xpEarned, isBonus, hasPremium }: { game: Game; xpEarned: number; isBonus?: boolean; hasPremium?: boolean }) {
  const completed = xpEarned > 0
  const isLocked  = !game.free && !completed && !hasPremium
  const accent    = game.accentColor ?? "#00d4f0"

  return (
    <Link href={isLocked ? `/checkout/${game.slug}` : `/games/${game.slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background:    completed ? `${accent}10` : "rgba(10,7,20,0.9)",
          border:        `1px solid ${completed ? accent + "50" : isLocked ? "rgba(255,255,255,0.05)" : accent + "1a"}`,
          borderRadius:  "18px",
          padding:       "0.85rem",
          position:      "relative",
          overflow:      "hidden",
          backdropFilter:"blur(16px)",
          transition:    "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
          cursor:        "pointer",
          boxShadow:     completed ? `0 0 20px ${accent}15` : "none",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)"
          e.currentTarget.style.borderColor = accent + "70"
          e.currentTarget.style.boxShadow = `0 8px 32px ${accent}20`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = ""
          e.currentTarget.style.borderColor = completed ? accent + "50" : isLocked ? "rgba(255,255,255,0.05)" : accent + "1a"
          e.currentTarget.style.boxShadow = completed ? `0 0 20px ${accent}15` : "none"
        }}
      >
        {/* Bonus badge */}
        {isBonus && (
          <div style={{
            position: "absolute", top: "0.5rem", right: "0.5rem",
            fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.42rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: accent, background: `${accent}18`,
            border: `1px solid ${accent}40`, borderRadius: "100px",
            padding: "0.12rem 0.4rem",
          }}>
            BONUS
          </div>
        )}

        {/* Character image */}
        <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: "12px", overflow: "hidden", marginBottom: "0.6rem", position: "relative", background: `${accent}12` }}>
          {game.characterImage ? (
            <img
              src={game.characterImage}
              alt={game.characterName ?? ""}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
                filter: isLocked ? "brightness(0.35) grayscale(0.5)" : "brightness(0.92)",
                display: "block",
                transition: "filter 0.2s",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
              {game.emoji}
            </div>
          )}

          {/* Status overlay */}
          {completed && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `${accent}18`,
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 900, fontSize: "1rem", color: "#000",
                boxShadow: `0 0 16px ${accent}60`,
              }}>
                ✓
              </div>
            </div>
          )}
          {isLocked && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(8,6,15,0.6)",
            }}>
              <span style={{ fontSize: "1.4rem" }}>🔒</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: isLocked ? "rgba(240,238,255,0.28)" : "#fff", lineHeight: 1.3, marginBottom: "0.22rem" }}>
          {game.characterName ?? game.title.split("—")[0].trim()}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "var(--muted)", marginBottom: "0.18rem" }}>
          {game.characterRole ?? game.title}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem" }}>
          {completed
            ? <span style={{ color: accent, fontWeight: 700 }}>+{xpEarned.toLocaleString()} XP ✓</span>
            : isLocked
            ? <span style={{ color: "rgba(224,64,251,0.6)" }}>Pro · ${game.price?.toFixed(2) ?? "4.99"}</span>
            : <span style={{ color: "rgba(240,238,255,0.4)" }}>Free · {game.duration}</span>}
        </div>
      </div>
    </Link>
  )
}

interface NpcEvent {
  id: string
  npc: string
  avatar: string
  action: string
  timestamp: string
}

const NPCS = [
  { name: "Jake", avatar: "/images/guitarplayer1.png", color: "#00d4f0", specialties: [
    "optimized a guitar tab parsing system in Copilot Studio",
    "prompt-designed a raw guitar solo progression inspired by Arctic Monkeys",
    "configured a local VS Code helper to organize his chord sheets"
  ]},
  { name: "Zoe", avatar: "/images/zoe.png", color: "#e040fb", specialties: [
    "synchronized her drum pad midi inputs using a prompt temperature of 0.3",
    "programmed a structural drum loop script with Python code interpreter",
    "drafted an AI prompt template to auto-slice electronic synth samples"
  ]},
  { name: "Sam", avatar: "/images/sam.png", color: "#4488ff", specialties: [
    "debugged a nested AWS VPC peering Terraform configuration with Gemini CLI",
    "optimized multi-stage Docker build caching for a deployment pipeline",
    "scripted a prompt to audit active security groups on Kubernetes pods"
  ]},
  { name: "Carlos", avatar: "/images/carlos.png", color: "#00e676", specialties: [
    "designed a custom system prompt to protect a client's support bot from injections",
    "mapped enterprise prompt variables to customer billing API endpoints",
    "optimized a batch classification pipeline using low-temperature models"
  ]},
  { name: "Jordan", avatar: "/images/jordan.png", color: "#ffb700", specialties: [
    "built a structured Claude Project workspace to plan a Q3 consulting roadmap",
    "created a custom Claude Artifact to parse vendor invoices from PDF dumps",
    "drafted a prompt to synthesize action items from customer meeting transcripts"
  ]},
  { name: "Kai", avatar: "/images/kai.png", color: "#ff6b35", specialties: [
    "simulated canvas physics for a new platformer game engine using Python",
    "debugged a recursive sorting algorithm with AI-guided debugger loops",
    "refactored a Pygame screen-refresh loop to hit a clean 60 FPS"
  ]},
  { name: "Priya", avatar: "/images/priya.png", color: "#00e676", specialties: [
    "synthesized user feedback data from CSV tables to draft the weekly report",
    "prompt-analyzed startup cohort retention curves in Python code interpreter",
    "created an Excel cleaning script to deduplicate customer email registries"
  ]},
  { name: "Alex", avatar: "/images/alex.png", color: "#ff3d00", specialties: [
    "drafted a detailed PRD for the collaborative sound sharing feature",
    "structured competitor feature logs using the What/What-Not prompt framework",
    "categorized the JIRA roadmap backlog using an automated taxonomy prompt"
  ]},
  { name: "Luna", avatar: "/images/luna.png", color: "#e040fb", specialties: [
    "synthesized common friction patterns from 15 remote user interview transcripts",
    "prompted a comprehensive target user persona card for the mobile player base",
    "drafted a user feedback survey concerning AI assistant onboarding flow"
  ]},
  { name: "Aria", avatar: "/images/aria.png", color: "#00d4f0", specialties: [
    "generated a classical violin sheet music structure in MusicXML format",
    "analyzed minor key resolution patterns of Bach's cello suites",
    "drafted prompt constraints to write dialogue lines for the visual novel"
  ]}
]

/* ─── Main Dashboard ────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth()

  const [mounted,  setMounted]  = useState(false)
  const [totalXp,  setTotalXp]  = useState(0)
  const [streak,   setStreak]   = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [gameXps,  setGameXps]  = useState<Record<number, number>>({})
  const [lastPlay, setLastPlay] = useState("")
  const [syncing,  setSyncing]  = useState(false)
  const [dueCount, setDueCount] = useState(0)
  const [fsrsMastery, setFsrsMastery] = useState(0)  // 0-100 FSRS retention mastery score
  const [hasPremium, setHasPremium] = useState(false)

  // Autonomous NPC World
  const [npcEvents, setNpcEvents] = useState<NpcEvent[]>([])
  const [showAwayBanner, setShowAwayBanner] = useState(false)
  const [newEventsCount, setNewEventsCount] = useState(0)
  const [unreadChatterCount, setUnreadChatterCount] = useState(0)

  // Lives
  const [lives,    setLives]    = useState(3)
  const MAX_LIVES = 3

  /* Power-ups */
  const [puActive,      setPuActive]      = useState<PowerupActive>({ doubleXp: null, shield: null })
  const [shieldActive,  setShieldActive]  = useState(false)   // explicit boolean, avoids inline Date.now() in JSX

  // Shield countdown display (ticks every second when shield is active)
  const [shieldTimeLeft, setShieldTimeLeft] = useState("")
  useEffect(() => {
    if (!puActive.shield || puActive.shield <= Date.now()) { setShieldTimeLeft(""); return }
    const tick = () => {
      const ms = puActive.shield! - Date.now()
      if (ms <= 0) { setShieldTimeLeft(""); return }
      const h = Math.floor(ms / 3_600_000)
      const m = Math.floor((ms % 3_600_000) / 60_000)
      setShieldTimeLeft(h > 0 ? `${h}h ${m}m left` : `${m}m left`)
    }
    tick()
    const iv = setInterval(tick, 60_000)
    return () => clearInterval(iv)
  }, [puActive.shield])

  /* ── Inject keyframes ── */
  useEffect(() => {
    const id = "dashboard-kf-v2"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id    = id
    s.textContent = `
      @keyframes dash-up {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes shimmer-slide {
        0%   { transform:translateX(-100%) skewX(-14deg); opacity:0; }
        12%  { opacity:0.4; }
        100% { transform:translateX(320%) skewX(-14deg); opacity:0; }
      }
      @keyframes flame-flicker {
        0%,100% { transform:scaleY(1) rotate(-2deg); }
        25%     { transform:scaleY(1.1) rotate(2deg); }
        75%     { transform:scaleY(0.94) rotate(-1deg); }
      }
      @keyframes heart-pulse {
        0%,100% { transform:scale(1); }
        50%     { transform:scale(1.1); }
      }
      @keyframes pu-shimmer {
        0%   { transform:translateX(-100%); }
        100% { transform:translateX(300%); }
      }
      @keyframes pu-dot-pulse {
        0%,100% { opacity:0.5; transform:scale(1); }
        50%     { opacity:1; transform:scale(1.35); }
      }
      @keyframes badge-in {
        from { opacity:0; transform:scale(0.7); }
        to   { opacity:1; transform:scale(1); }
      }
      @keyframes ring-glow {
        0%,100% { filter:drop-shadow(0 0 4px rgba(0,212,240,0.3)); }
        50%     { filter:drop-shadow(0 0 12px rgba(0,212,240,0.7)); }
      }
      @keyframes maestro-summons-pulse {
        0%,100% { box-shadow: 0 0 0 0 rgba(0,212,240,0), 0 0 40px rgba(0,212,240,0.08); }
        50%     { box-shadow: 0 0 0 8px rgba(0,212,240,0.06), 0 0 60px rgba(0,212,240,0.18); }
      }
      @keyframes summons-orb-spin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes summons-orb-pulse {
        0%,100% { opacity:0.55; transform:scale(0.94); }
        50%     { opacity:1;    transform:scale(1.06); }
      }
      @keyframes summons-text-in {
        from { opacity:0; transform:translateY(6px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes summons-cta-pulse {
        0%,100% { box-shadow: 0 0 20px rgba(0,212,240,0.25); }
        50%     { box-shadow: 0 0 40px rgba(0,212,240,0.55), 0 0 80px rgba(224,64,251,0.2); }
      }
      @keyframes npc-pulse-green {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(1.3); opacity: 1; }
      }
      @keyframes activity-item-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(s)
  }, [])

  /* ── Load data from localStorage ── */
  useEffect(() => {
    setMounted(true)

    const xp     = lsGet("maestro_total_xp")
    const str    = lsGet("maestro_daily_streak")
    const best   = lsGet("maestro_best_streak")
    const lp     = lsStr("maestro_last_play_date")
    const lv     = lsGet("maestro_lives", 3)
    const lvDate = lsStr("maestro_lives_refill_date")

    setTotalXp(xp)
    setStreak(str)
    setBestStreak(Math.max(best, str))
    setLastPlay(lp)

    // Update best streak if current is higher
    if (str > best) lsSet("maestro_best_streak", String(str))

    // Lives — refill 1 per day up to max
    const today = new Date().toDateString()
    let curLives = Math.min(lv, MAX_LIVES)
    if (lvDate !== today && curLives < MAX_LIVES) {
      curLives = Math.min(curLives + 1, MAX_LIVES)
      lsSet("maestro_lives", String(curLives))
      lsSet("maestro_lives_refill_date", today)
    }
    setLives(curLives)

    // Game XPs (weeks 1-16)
    const xps: Record<number, number> = {}
    for (let w = 1; w <= 16; w++) xps[w] = getGameXp(w)
    setGameXps(xps)

    // FSRS Local due count + mastery score
    try {
      const localCardsJson = localStorage.getItem("maestro_review_cards") || "[]"
      const localCards: any[] = JSON.parse(localCardsJson)
      const now = new Date()
      const dueCards = localCards.filter(c => new Date(c.due) <= now)
      setDueCount(dueCards.length)
      // Mastery = average stability across ALL reviewed cards, capped at 100
      // stability in FSRS represents days until forgetting — higher = more retained
      const reviewedCards = localCards.filter(c => c.reps > 0)
      if (reviewedCards.length > 0) {
        const avgStab = reviewedCards.reduce((sum: number, c: any) => sum + (c.stability ?? 0), 0) / reviewedCards.length
        // Normalize: stability of ~30 days = 100% mastery (diminishing returns past that)
        setFsrsMastery(Math.min(100, Math.round((avgStab / 30) * 100)))
      }
    } catch {}

    // Power-up unlock states (computed, not stored — derived from stats)
    // Active states stored in localStorage
    const puAct: PowerupActive = lsJson("maestro_pu_active", { doubleXp: null, shield: null })
    // Clean up expired timed power-ups
    const now = Date.now()
    if (puAct.doubleXp && puAct.doubleXp < now) puAct.doubleXp = null
    if (puAct.shield   && puAct.shield   < now) puAct.shield   = null
    setPuActive(puAct)
    setShieldActive(!!(puAct.shield && puAct.shield > now))

    // NPC World Simulation
    try {
      const lastSeenStr = localStorage.getItem("maestro_last_seen")
      const nowMs = Date.now()
      localStorage.setItem("maestro_last_seen", String(nowMs))

      const existingEventsJson = localStorage.getItem("maestro_npc_events") || "[]"
      let existingEvents: NpcEvent[] = JSON.parse(existingEventsJson)

      const generateEvents = (count: number, startTime: number, endTime: number): NpcEvent[] => {
        const list: NpcEvent[] = []
        const usedNpcNames = new Set<string>()
        for (let i = 0; i < count; i++) {
          const availableNpcs = NPCS.filter(n => !usedNpcNames.has(n.name))
          const npcInfo = availableNpcs.length > 0
            ? availableNpcs[Math.floor(Math.random() * availableNpcs.length)]
            : NPCS[Math.floor(Math.random() * NPCS.length)]
          usedNpcNames.add(npcInfo.name)
          const action = npcInfo.specialties[Math.floor(Math.random() * npcInfo.specialties.length)]
          const ts = Math.round(startTime + Math.random() * (endTime - startTime))
          list.push({
            id: Math.random().toString(36).substring(2, 9),
            npc: npcInfo.name,
            avatar: npcInfo.avatar,
            action,
            timestamp: String(ts)
          })
        }
        return list.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
      }

      if (!lastSeenStr) {
        // First visit or cleared cache: generate initial dummy history
        const generated = generateEvents(4, nowMs - 4 * 3600 * 1000, nowMs)
        existingEvents = generated
        localStorage.setItem("maestro_npc_events", JSON.stringify(generated))
        setNpcEvents(generated)
      } else {
        const lastSeen = parseInt(lastSeenStr)
        const elapsed = nowMs - lastSeen
        // Only run simulation if more than 5 minutes elapsed
        if (elapsed > 5 * 60 * 1000) {
          const hoursElapsed = elapsed / (3600 * 1000)
          const count = Math.min(6, Math.max(1, Math.round(hoursElapsed * 1.5) || 1))
          const generated = generateEvents(count, lastSeen, nowMs)
          const combined = [...generated, ...existingEvents].slice(0, 15)
          localStorage.setItem("maestro_npc_events", JSON.stringify(combined))
          setNpcEvents(combined)
          setNewEventsCount(count)
          setShowAwayBanner(true)
        } else {
          setNpcEvents(existingEvents.slice(0, 15))
        }
      }
      
      // Calculate unread radio chatter transmissions
      try {
        const CHATTER_VOICE_NOTES = [
          { id: "jake-1", unlockedAt: 1 },
          { id: "felipe-1", unlockedAt: 2 },
          { id: "vega-1", unlockedAt: 4 },
          { id: "zoe-1", unlockedAt: 7 },
          { id: "maya-1", unlockedAt: 13 },
        ]
        const readList = JSON.parse(localStorage.getItem("maestro_read_transmissions") ?? "[]")
        const unlocked = CHATTER_VOICE_NOTES.filter(t => {
          const week = t.unlockedAt
          return week === 1 || (parseInt(localStorage.getItem(`maestro_game_${week}_xp`) ?? "0") || 0) > 0
        })
        const unread = unlocked.filter(t => !readList.includes(t.id))
        setUnreadChatterCount(unread.length)
      } catch {}
    } catch (e) {
      console.warn("Failed to simulate NPC events", e)
    }
  }, [])

  /* ── Sync from Supabase ── */
  useEffect(() => {
    if (!user) return
    setSyncing(true)
    supabaseBrowser().auth.getSession().then(({ data }) => {
      const token = data.session?.access_token
      if (!token) { setSyncing(false); return }
      fetch("/api/progress", { headers: { "Authorization": `Bearer ${token}` } })
        .then(r => r.json())
        .then(serverData => {
          if (!serverData.xp) return
          const serverXp     = serverData.xp.total_xp ?? 0
          const serverStreak = serverData.streak?.current_streak ?? 0
          const localXp      = lsGet("maestro_total_xp")
          const mergedXp     = Math.max(serverXp, localXp)
          const mergedStreak = Math.max(serverStreak, lsGet("maestro_daily_streak"))

          setTotalXp(mergedXp)
          setStreak(mergedStreak)
          if (mergedXp > localXp) lsSet("maestro_total_xp", String(mergedXp))

          if (Array.isArray(serverData.progress)) {
            setGameXps(prev => {
              const merged = { ...prev }
              for (const row of serverData.progress) {
                const w = row.game_week as number
                merged[w] = Math.max(merged[w] ?? 0, row.xp_earned ?? 0)
              }
              return merged
            })
          }
          setSyncing(false)
        })
        .catch(() => setSyncing(false))

      // Fetch FSRS due count (non-blocking)
      fetch("/api/review", { headers: { "Authorization": `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (typeof data.total_due === "number") setDueCount(data.total_due) })
        .catch(() => {})

      // Check for active premium license
      supabaseBrowser()
        .from("purchases")
        .select("id")
        .eq("user_id", user.id)
        .in("game_slug", ["maestro-bundle", "conductor-edition"])
        .maybeSingle()
        .then(({ data }) => {
          const premium = !!data
          setHasPremium(premium)

          // Auto-verify if license_key is present in URL search params
          if (typeof window !== "undefined" && !premium) {
            const params = new URLSearchParams(window.location.search)
            const queryKey = params.get("license_key")
            if (queryKey) {
              fetch("/api/gumroad/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ licenseKey: queryKey.trim(), userId: user.id }),
              })
              .then(res => {
                if (res.ok) setHasPremium(true)
              })
              .catch(() => {})
            }
          }
        })
    }).catch(() => setSyncing(false))
  }, [user])

  /* ── Derive stats ── */
  const level          = getLevel(totalXp)
  const nextLevel      = getNextLevel(totalXp)
  const levelPct       = nextLevel
    ? Math.round(((totalXp - level.minXp) / (nextLevel.minXp - level.minXp)) * 100)
    : 100

  const mainGames      = allGames.filter(g => g.week >= 1 && g.week <= 12)
  const bonusGames     = allGames.filter(g => g.week > 12)
  const completedWeeks = Object.entries(gameXps).filter(([, xp]) => xp > 0).map(([w]) => Number(w))
  const completedCount = completedWeeks.length
  // AI Fluency Score — reformed to measure actual mastery, not just engagement
  // Formula: 40% game breadth + 20% XP depth + 40% FSRS retention mastery
  // This means a player who completed 5 games and drilled them deeply scores
  // higher than a player who rushed all 14 and forgot everything.
  const fluency = Math.min(100, Math.round(
    (completedCount / allGames.length) * 40   // breadth: games completed
    + Math.min(20, Math.round(totalXp / 150))  // depth: XP effort (capped at 20pts)
    + fsrsMastery * 0.40                       // retention: FSRS avg stability score
  ))

  const completedTracks = TRACKS.filter(t => t.weeks.every(w => (gameXps[w] ?? 0) > 0)).length

  // Recompute unlock states whenever stats change
  const unlocked: PowerupState = {
    doubleXp:   streak >= 7,
    hint:       completedTracks >= 1,
    shield:     streak >= 14,
    maestroMode:totalXp >= 3000,
  }

  const today     = new Date().toDateString()
  const playedToday = lastPlay === today

  /* ── Animated values ── */
  const cXp      = useCountUp(mounted ? totalXp : 0)
  const cStreak  = useCountUp(mounted ? streak  : 0, 600)
  const cFluency = useCountUp(mounted ? fluency : 0, 1100)

  /* ── Power-up activation ── */
  const activatePowerup = useCallback((key: PowerupKey) => {
    const pu = POWERUPS.find(p => p.key === key)
    if (!pu || !unlocked[key]) return
    if (pu.timed && pu.duration) {
      const until = Date.now() + pu.duration
      const next  = { ...puActive, [key]: until }
      setPuActive(next)
      if (key === "shield") setShieldActive(true)
      lsSet("maestro_pu_active", JSON.stringify(next))
    }
    // Hint and MaestroMode are stateless (handled in-game)
  }, [unlocked, puActive])

  function formatRelativeTime(tsStr: string): string {
    const ts = parseInt(tsStr)
    const diffMs = Date.now() - ts
    const mins = Math.max(1, Math.floor(diffMs / 60000))
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  /* ─── render ─────────────────────────────────────────────────────────── */
  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "5rem 1.5rem 5rem", position: "relative" }}>

        {/* Ambient radial glows (behind everything) */}
        <div style={{ position: "fixed", top: "25%", left: "30%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(0,212,240,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", top: "50%", right: "15%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(224,64,251,0.04) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ══ HERO BANNER ═════════════════════════════════════════════════ */}
          <div style={{
            position:     "relative",
            borderRadius: "24px",
            overflow:     "hidden",
            marginBottom: "2rem",
            minHeight:    "260px",
            border:       "1px solid rgba(0,212,240,0.18)",
            boxShadow:    "0 0 60px rgba(0,212,240,0.06), 0 0 120px rgba(123,47,190,0.06)",
            animation:    "dash-up 0.45s ease both",
          }}>
            {/* ── Hero image ── */}
            <img
              src="/images/dashboardpix.png"
              alt="MaestroPlay"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
              style={{
                position:        "absolute",
                inset:           0,
                width:           "100%",
                height:          "100%",
                objectFit:       "cover",
                objectPosition:  "center center",
                opacity:         0.7,
              }}
            />

            {/* ── Left-to-right gradient so text stays crisp ── */}
            <div style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(100deg, rgba(8,6,15,0.97) 0%, rgba(8,6,15,0.85) 30%, rgba(8,6,15,0.5) 58%, rgba(8,6,15,0.1) 100%)",
            }} />
            {/* ── Bottom fade into page ── */}
            <div style={{
              position:   "absolute",
              bottom:     0,
              left:       0,
              right:      0,
              height:     "80px",
              background: "linear-gradient(to top, var(--bg-primary), transparent)",
            }} />
            {/* ── Top vignette ── */}
            <div style={{
              position:   "absolute",
              top:        0,
              left:       0,
              right:      0,
              height:     "60px",
              background: "linear-gradient(to bottom, rgba(8,6,15,0.6), transparent)",
            }} />

            {/* ── Cyan glow on baton (purely decorative) ── */}
            <div style={{
              position:   "absolute",
              top:        "30%",
              right:      "28%",
              width:      "320px",
              height:     "320px",
              borderRadius:"50%",
              background: "radial-gradient(circle, rgba(0,212,240,0.08) 0%, transparent 65%)",
              pointerEvents:"none",
            }} />

            {/* ── Text content ── */}
            <div style={{ position: "relative", zIndex: 2, padding: "2.5rem 2.5rem 2.8rem" }}>
              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "rgba(0,212,240,0.08)", border: "1px solid rgba(0,212,240,0.22)",
                  borderRadius: "100px", padding: "0.2rem 0.75rem",
                }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#00d4f0", boxShadow: "0 0 6px #00d4f0" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#00d4f0" }}>
                    Conductor&apos;s Dashboard
                  </span>
                </div>
                {syncing && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(0,212,240,0.5)", animation: "pu-dot-pulse 1s ease-in-out infinite" }}>↻ syncing</div>}
                {user && !syncing && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(88,204,2,0.7)" }}>✓ synced</div>}
              </div>

              {/* Main title */}
              <h1 style={{
                fontFamily:    "Cormorant Garamond, serif",
                fontWeight:    700,
                fontSize:      "clamp(2rem, 5vw, 3.4rem)",
                color:         "#fff",
                lineHeight:    1.08,
                marginBottom:  "0.5rem",
                textShadow:    "0 2px 32px rgba(0,212,240,0.18)",
              }}>
                {user
                  ? `Welcome back${user.email ? `, ${user.email.split("@")[0]}` : ""}.`
                  : "The Conductor's Dashboard"}
              </h1>

              {/* Subtitle */}
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle:  "italic",
                fontSize:   "1.05rem",
                color:      "rgba(240,238,255,0.55)",
                margin:     "0 0 1.25rem",
              }}>
                {level.icon} {level.label} · {completedCount} of {allGames.length} games complete · {totalXp.toLocaleString()} XP total
              </p>

              {/* Quick stat chips */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  background: `${level.color}14`, border: `1px solid ${level.color}33`,
                  borderRadius: "100px", padding: "0.28rem 0.9rem",
                }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.75rem", color: level.color }}>
                    {cXp.toLocaleString()} XP
                  </span>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  background: mounted && shieldActive ? "rgba(255,152,0,0.12)" : "rgba(255,152,0,0.08)",
                  border: mounted && shieldActive ? "1px solid rgba(255,152,0,0.4)" : "1px solid rgba(255,152,0,0.22)",
                  borderRadius: "100px", padding: "0.28rem 0.9rem",
                }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#ff9800" }}>
                    {streak > 0
                      ? `${streak}🔥 day streak${mounted && shieldActive ? " 🛡️" : ""}`
                      : "Start a streak 🔥"}
                  </span>
                </div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  background: "rgba(255,75,75,0.08)", border: "1px solid rgba(255,75,75,0.2)",
                  borderRadius: "100px", padding: "0.28rem 0.9rem",
                }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#ff6b6b" }}>
                    {lives}/3 ❤️
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ PREMIUM UNLOCK BANNER ═══════════════════════════════════════ */}
          {mounted && !hasPremium && (
            <div style={{
              background: "linear-gradient(90deg, rgba(0,212,240,0.08) 0%, rgba(224,64,251,0.08) 100%)",
              border: "1.5px solid rgba(0,212,240,0.3)",
              borderRadius: "20px",
              padding: "1.25rem 1.75rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.2rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              animation: "dash-up 0.45s 0.02s ease both"
            }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>⚡</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#fff", letterSpacing: "-0.01em" }}>
                    Unlock the Conductor&apos;s Edition
                  </span>
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.76rem", color: "rgba(240,238,255,0.65)", lineHeight: 1.5, margin: 0 }}>
                  Get complete access to all 14 visual novel chapters, unlimited lives, the FSRS dashboard, and advanced Socratic guides.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <Link
                  href="/#store"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    color: "#08060f",
                    background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                    padding: "0.55rem 1.25rem",
                    borderRadius: "100px",
                    textDecoration: "none",
                    boxShadow: "0 0 16px rgba(0,212,240,0.3)",
                    transition: "transform 0.15s",
                    display: "inline-block"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  Buy Edition
                </Link>
                <Link
                  href="/settings"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    color: "#fff",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "0.55rem 1.25rem",
                    borderRadius: "100px",
                    textDecoration: "none",
                    transition: "background 0.2s",
                    display: "inline-block"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                >
                  Enter Key 🗝️
                </Link>
              </div>
            </div>
          )}

          {/* ══ TOP ROW: XP + LIVES + STREAK ════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem", marginBottom: "1.25rem", alignItems: "stretch" }}>

            {/* XP / Level card — wide */}
            <div style={{
              background: "rgba(10,7,20,0.92)", border: `1px solid ${level.color}40`,
              borderRadius: "20px", padding: "1.5rem 1.75rem",
              backdropFilter: "blur(20px)", animation: "dash-up 0.45s 0.05s ease both",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: level.color, opacity: 0.8 }}>
                  Conductor Level
                </div>
                {nextLevel && (
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "rgba(240,238,255,0.35)" }}>
                    {(nextLevel.minXp - totalXp).toLocaleString()} XP to {nextLevel.label}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "2rem", color: "#fff", lineHeight: 1 }}>
                  {level.label}
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: level.color }}>
                  {cXp.toLocaleString()} XP
                </span>
              </div>
              {/* XP bar */}
              <div style={{ height: "8px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", overflow: "hidden", marginBottom: "0.4rem" }}>
                <div style={{
                  height: "100%", width: `${mounted ? levelPct : 0}%`,
                  background: `linear-gradient(90deg, ${level.color}, ${nextLevel?.color ?? level.color})`,
                  borderRadius: "4px", transition: "width 1.3s cubic-bezier(0.16,1,0.3,1)", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)", animation: "shimmer-slide 2.8s 0.9s ease-in-out infinite" }} />
                </div>
              </div>
              {/* Level pips */}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {LEVELS.map((lv, i) => {
                  const active = totalXp >= lv.minXp
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "0.3rem",
                      opacity: active ? 1 : 0.25,
                      transition: "opacity 0.3s",
                    }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: lv.color, boxShadow: active ? `0 0 6px ${lv.color}` : "none" }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: active ? lv.color : "rgba(240,238,255,0.35)", fontWeight: 600 }}>
                        {lv.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lives card */}
            <div style={{
              background: "rgba(10,7,20,0.92)", border: "1px solid rgba(255,75,75,0.2)",
              borderRadius: "20px", padding: "1.5rem 1.75rem",
              backdropFilter: "blur(20px)", animation: "dash-up 0.45s 0.1s ease both",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              minWidth: "140px",
            }}>
              <LivesDisplay lives={mounted ? lives : 3} />
            </div>

            {/* Streak card */}
            <div style={{
              background: "rgba(10,7,20,0.92)", border: "1px solid rgba(255,152,0,0.25)",
              borderRadius: "20px", padding: "1.5rem 1.75rem",
              backdropFilter: "blur(20px)", animation: "dash-up 0.45s 0.15s ease both",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.35rem",
              minWidth: "140px",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#ff9800", opacity: 0.8 }}>
                Streak
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <AnimatedFlame size={36} />
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "2.4rem", color: "#fff", lineHeight: 1 }}>
                  {cStreak}
                </span>
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(240,238,255,0.35)", textAlign: "center" }}>
                {playedToday ? "✓ Today's game played" : streak > 0 ? "⚠ Play today!" : "Start your streak"}
              </div>
              {bestStreak > 0 && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "rgba(255,152,0,0.5)" }}>
                  Best: {bestStreak} 🔥
                </div>
              )}
              {/* Streak Shield indicator */}
              {mounted && shieldActive && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  background: "rgba(0,212,240,0.08)", border: "1px solid rgba(0,212,240,0.25)",
                  borderRadius: "100px", padding: "0.2rem 0.6rem",
                  marginTop: "0.1rem",
                }}>
                  <span style={{ fontSize: "0.75rem" }}>🛡️</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", color: "#00d4f0", letterSpacing: "0.08em" }}>
                    Protected{shieldTimeLeft ? ` · ${shieldTimeLeft}` : ""}
                  </span>
                </div>
              )}
              {user && (
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/email/streak-warning", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user.id, streakDays: streak })
                      });
                      const data = await res.json();
                      if (data.sent) {
                        alert("Preservation test email triggered! Check your inbox.");
                      } else {
                        alert("Rate-limit active: " + (data.reason || "already sent today"));
                      }
                    } catch (e) {
                      alert("Error triggering email: " + e);
                    }
                  }}
                  style={{
                    background: "rgba(255,152,0,0.08)", border: "1px solid rgba(255,152,0,0.3)",
                    borderRadius: "100px", padding: "0.25rem 0.6rem",
                    color: "#ff9800", fontFamily: "Inter, sans-serif", fontSize: "0.55rem",
                    fontWeight: 700, cursor: "pointer", marginTop: "0.4rem", transition: "background 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,152,0,0.18)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,152,0,0.08)"}
                >
                  🔔 Test Streak Alert
                </button>
              )}
            </div>

          </div>

          {/* ══ AI FLUENCY + DAILY CHALLENGE ══════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>


            {/* Fluency score */}
            <div style={{
              background: "rgba(10,7,20,0.92)", border: "1px solid rgba(224,64,251,0.22)",
              borderRadius: "20px", padding: "1.5rem 1.75rem",
              backdropFilter: "blur(20px)", animation: "dash-up 0.45s 0.2s ease both",
            }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#e040fb", opacity: 0.8, marginBottom: "0.6rem" }}>
                AI Fluency Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.85rem" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "3rem", color: "#fff", lineHeight: 1 }}>
                  {cFluency}
                </span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.1rem", color: "rgba(240,238,255,0.3)", fontWeight: 700 }}>/100</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden", marginBottom: "0.5rem" }}>
                <div style={{
                  height: "100%", width: `${mounted ? fluency : 0}%`,
                  background: "linear-gradient(90deg, #e040fb, #ff6b35)",
                  borderRadius: "3px", transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
              {/* Score breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "var(--muted)" }}>
                  <span>📚 Breadth ({completedCount}/{allGames.length} games)</span>
                  <span>{Math.round((completedCount / allGames.length) * 40)}/40</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "var(--muted)" }}>
                  <span>⚡ Depth (XP effort)</span>
                  <span>{Math.min(20, Math.round(totalXp / 150))}/20</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: fsrsMastery > 0 ? "rgba(0,212,240,0.7)" : "var(--muted)" }}>
                  <span>🧠 Retention (FSRS mastery)</span>
                  <span>{Math.round(fsrsMastery * 0.40)}/40</span>
                </div>
              </div>
            </div>

            {/* Daily Challenge — Maestro Summons Banner when reviews due, quiet card when not */}
            {dueCount > 0 ? (
              <Link href="/review" style={{ textDecoration: "none" }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(0,12,20,0.97) 0%, rgba(10,4,22,0.97) 100%)",
                  border: "1px solid rgba(0,212,240,0.35)",
                  borderRadius: "20px", padding: "1.5rem 1.75rem",
                  backdropFilter: "blur(20px)", animation: "dash-up 0.45s 0.25s ease both, maestro-summons-pulse 3s ease-in-out infinite",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  cursor: "pointer", position: "relative", overflow: "hidden",
                }}>
                  {/* Animated cyan radial glow */}
                  <div style={{
                    position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
                    width: "200%", height: "160%",
                    background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,240,0.1) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }} />

                  {/* Top row: label + urgency badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", position: "relative" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#00d4f0", opacity: 0.9 }}>
                      Daily Maestro Challenge
                    </div>
                    <div style={{
                      fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "0.65rem",
                      color: "#08060f", background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                      borderRadius: "100px", padding: "0.18rem 0.6rem",
                      letterSpacing: "0.04em", animation: "badge-in 0.4s 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                    }}>
                      {dueCount} due
                    </div>
                  </div>

                  {/* Orb + summons text */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem", position: "relative" }}>
                    {/* Animated Maestro orb */}
                    <div style={{
                      width: "52px", height: "52px", flexShrink: 0, borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 32%, rgba(0,212,240,0.65) 0%, rgba(224,64,251,0.35) 55%, rgba(8,6,15,0.9) 100%)",
                      border: "1.5px solid rgba(0,212,240,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.55rem",
                      animation: "summons-orb-pulse 2.2s ease-in-out infinite",
                      boxShadow: "0 0 24px rgba(0,212,240,0.3), inset 0 0 12px rgba(0,212,240,0.1)",
                    }}>🎼</div>
                    <div>
                      <div style={{
                        fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                        fontSize: "1.08rem", color: "rgba(240,238,255,0.92)", lineHeight: 1.35,
                        marginBottom: "0.3rem",
                        animation: "summons-text-in 0.5s 0.3s ease both",
                      }}>
                        The Maestro summons you.
                      </div>
                      <div style={{
                        fontFamily: "Inter, sans-serif", fontSize: "0.68rem",
                        color: "rgba(0,212,240,0.65)", lineHeight: 1.4,
                        animation: "summons-text-in 0.5s 0.5s ease both",
                      }}>
                        {dueCount} concept{dueCount !== 1 ? "s" : ""} are fading from memory. The orchestra waits.
                      </div>
                    </div>
                  </div>

                  {/* Streak indicator (if any) */}
                  {streak > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem", position: "relative" }}>
                      <span style={{ fontSize: "0.9rem", animation: "flame-flicker 1.8s ease-in-out infinite" }}>🔥</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#ff9800", fontWeight: 700 }}>
                        {streak}-day streak — keep it alive
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem",
                    color: "#08060f",
                    background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                    padding: "0.65rem 1.5rem", borderRadius: "100px",
                    letterSpacing: "0.02em",
                    animation: "summons-cta-pulse 2.5s ease-in-out infinite",
                    alignSelf: "flex-start",
                    position: "relative",
                  }}>
                    🧠 Begin Review Session →
                  </div>
                </div>
              </Link>
            ) : (
              <div style={{
                background: "rgba(10,7,20,0.92)",
                border: "1px solid rgba(0,212,240,0.18)",
                borderRadius: "20px", padding: "1.5rem 1.75rem",
                backdropFilter: "blur(20px)", animation: "dash-up 0.45s 0.25s ease both",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--cyan)", opacity: 0.8, marginBottom: "0.6rem" }}>
                    Daily Practice
                  </div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.05rem", color: "rgba(240,238,255,0.7)", lineHeight: 1.5, marginBottom: "1rem" }}>
                    &ldquo;The Maestro summons you to the practice room.&rdquo;
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <Link href="/games" style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "0.45rem",
                      fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem",
                      color: dueCount > 0 ? "var(--cyan)" : "#08060f",
                      background: dueCount > 0 ? "rgba(0,212,240,0.08)" : (playedToday ? "rgba(88,204,2,0.85)" : "linear-gradient(90deg, #00d4f0, #e040fb)"),
                      border: dueCount > 0 ? "1px solid rgba(0,212,240,0.3)" : "none",
                      padding: "0.6rem 1.4rem", borderRadius: "100px",
                      cursor: "pointer", letterSpacing: "0.02em",
                    }}>
                      {playedToday ? "✓ Played today — play more →" : "Begin today's game →"}
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ══ AUTONOMOUS NPC WORLD WIDGET ════════════════════════════════ */}
          <div style={{
            background: "rgba(10,7,20,0.92)",
            border: "1px solid rgba(0,212,240,0.18)",
            borderLeft: "4px solid #00d4f0",
            borderRadius: "20px",
            padding: "1.5rem 1.75rem",
            backdropFilter: "blur(20px)",
            marginBottom: "1.25rem",
            animation: "dash-up 0.45s 0.28s ease both",
          }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.25rem" }}>🤖</span>
                <h2 style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  color: "#fff",
                  margin: 0,
                }}>
                  While you were away...
                </h2>
                {unreadChatterCount > 0 && (
                  <Link href="/games?tab=chatter" style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.28rem",
                      background: "rgba(224, 64, 251, 0.15)",
                      border: "1px solid rgba(224, 64, 251, 0.45)",
                      borderRadius: "100px",
                      padding: "0.18rem 0.6rem",
                      cursor: "pointer",
                      animation: "badge-in 0.4s ease both, ring-glow 2s infinite",
                    }}>
                      <span style={{ fontSize: "0.75rem" }}>📻</span>
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 800,
                        fontSize: "0.58rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--pink)",
                      }}>
                        {unreadChatterCount} Unread Radio Log{unreadChatterCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
              
              {/* Blinking green live simulation status */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#00e676",
                  boxShadow: "0 0 8px #00e676",
                  animation: "npc-pulse-green 1.5s ease-in-out infinite",
                }} />
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(0, 230, 118, 0.75)",
                }}>
                  Autonomous NPC Simulation
                </span>
              </div>
            </div>

            {/* Away notifications banner */}
            {showAwayBanner && newEventsCount > 0 && (
              <div style={{
                background: "rgba(0, 212, 240, 0.06)",
                border: "1px solid rgba(0, 212, 240, 0.2)",
                borderRadius: "12px",
                padding: "0.6rem 0.95rem",
                marginBottom: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                animation: "activity-item-in 0.4s ease both",
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.78rem",
                  color: "#00d4f0",
                }}>
                  ✨ {newEventsCount} new activity log{newEventsCount !== 1 ? "s" : ""} generated since your last visit.
                </span>
                <button
                  onClick={() => setShowAwayBanner(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(240, 238, 255, 0.4)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    padding: "2px",
                  }}
                  title="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Event list */}
            {npcEvents.length === 0 ? (
              <div style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(240,238,255,0.45)",
                textAlign: "center",
                padding: "1.5rem 0",
              }}>
                The campus is quiet. Recording studios are prepped...
              </div>
            ) : (
              <div style={{
                maxHeight: "185px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.55rem",
                paddingRight: "6px",
              }} className="scrollbar-thin">
                {npcEvents.map((evt, idx) => {
                  const npcColor = NPCS.find(n => n.name === evt.npc)?.color ?? "var(--cyan)"
                  return (
                    <div
                      key={evt.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.5rem 0.75rem",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                        borderRadius: "12px",
                        animation: `activity-item-in 0.4s ${idx * 0.04}s ease both`,
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)"
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)"
                      }}
                    >
                      {/* Avatar with specialty ring */}
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: `1.5px solid ${npcColor}`,
                        boxShadow: `0 0 8px ${npcColor}22`,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}>
                        <img
                          src={evt.avatar}
                          alt={evt.npc}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                        />
                      </div>

                      {/* Log text */}
                      <div style={{ flex: 1, minWidth: 0, fontFamily: "Inter, sans-serif", fontSize: "0.78rem", lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 800, color: npcColor, marginRight: "0.35rem" }}>
                          {evt.npc}
                        </span>
                        <span style={{ color: "rgba(240, 238, 255, 0.82)" }}>
                          {evt.action}
                        </span>
                      </div>

                      {/* Relative time */}
                      <div style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.68rem",
                        color: "rgba(240, 238, 255, 0.3)",
                        whiteSpace: "nowrap",
                      }}>
                        {formatRelativeTime(evt.timestamp)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ══ POWER-UPS ═══════════════════════════════════════════════════ */}
          <div style={{ marginBottom: "1.75rem", animation: "dash-up 0.45s 0.3s ease both" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              Power-ups
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {POWERUPS.map(pu => (
                <PowerupCard
                  key={pu.key}
                  pu={pu}
                  unlocked={mounted ? unlocked[pu.key] : false}
                  active={!!(pu.timed
                    ? pu.key === "shield"
                      ? (mounted && shieldActive)
                      : puActive[pu.key as keyof PowerupActive] && (puActive[pu.key as keyof PowerupActive]! > Date.now())
                    : false)}
                  activeUntil={pu.timed ? puActive[pu.key as keyof PowerupActive] : null}
                  onActivate={activatePowerup}
                />
              ))}
            </div>
          </div>

          {/* ══ TRACK PROGRESS ══════════════════════════════════════════════ */}
          <div style={{ marginBottom: "1.75rem", animation: "dash-up 0.45s 0.35s ease both" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              Track Progress
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {TRACKS.map(track => {
                const done  = track.weeks.filter(w => (gameXps[w] ?? 0) > 0).length
                const total = track.weeks.length
                const pct   = Math.round((done / total) * 100)
                const full  = done === total
                return (
                  <div key={track.number} style={{
                    background: "rgba(10,7,20,0.9)", border: `1px solid ${track.color}28`,
                    borderRadius: "18px", padding: "1.1rem 1.4rem",
                    display: "flex", alignItems: "center", gap: "1rem",
                    backdropFilter: "blur(12px)",
                    boxShadow: full ? `0 0 20px ${track.color}18` : "none",
                    transition: "box-shadow 0.3s",
                  }}>
                    <div style={{ position: "relative", flexShrink: 0, animation: full ? "ring-glow 2.5s ease-in-out infinite" : "none" }}>
                      <ProgressRing pct={mounted ? pct : 0} color={track.color} r={24} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                        {full ? "✓" : track.icon}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: track.color, marginBottom: "0.2rem" }}>
                        Track {track.number}
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#fff", marginBottom: "0.18rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {track.name}
                      </div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "var(--muted)" }}>
                        {done}/{total} games · {pct}%
                        {full && <span style={{ color: track.color, marginLeft: "0.4rem", animation: "badge-in 0.4s ease both" }}>Complete ✓</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ══ MAIN GAMES GRID ═════════════════════════════════════════════ */}
          <div style={{ marginBottom: "1.75rem", animation: "dash-up 0.45s 0.4s ease both" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              All Games
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: "0.75rem" }}>
              {mainGames.map(game => (
                <GameCard key={game.slug} game={game} xpEarned={gameXps[game.week] ?? 0} hasPremium={hasPremium} />
              ))}
            </div>
          </div>

          {/* ══ BONUS GAMES (week 13+) ═══════════════════════════════════════ */}
          {bonusGames.length > 0 && (
            <div style={{ marginBottom: "2.5rem", animation: "dash-up 0.45s 0.45s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>
                  Special Games
                </div>
                <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(240,238,255,0.25)", fontStyle: "italic" }}>
                  Remastered editions &amp; deep dives
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))", gap: "0.75rem" }}>
                {bonusGames.map(game => (
                  <GameCard key={game.slug} game={game} xpEarned={gameXps[game.week] ?? 0} isBonus hasPremium={hasPremium} />
                ))}
              </div>
            </div>
          )}

          {/* ══ CERTIFICATE GALLERY ══════════════════════════════════════════ */}
          <div style={{ marginBottom: "2.5rem", animation: "dash-up 0.45s 0.48s ease both" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
              Conductor Certificates
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {allGames.map(game => {
                const completed = (gameXps[game.week] ?? 0) > 0;
                const pName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Player";
                const vHash = simpleHash(`${game.slug}::${pName.trim().slice(0, 80)}::maestroplay2025`);
                const certLink = `/certificate/${game.slug}?name=${encodeURIComponent(pName)}&v=${vHash}`;

                return (
                  <div key={game.slug} style={{
                    background: completed ? "rgba(10,7,20,0.95)" : "rgba(255,255,255,0.01)",
                    border: completed ? "1px solid rgba(0,212,240,0.28)" : "1px dashed rgba(255,255,255,0.08)",
                    borderRadius: "18px", padding: "1.25rem 1.4rem",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    minHeight: "160px", opacity: completed ? 1 : 0.45,
                    boxShadow: completed ? "0 0 20px rgba(0,212,240,0.06)" : "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={e => {
                    if (completed) {
                      e.currentTarget.style.borderColor = "var(--cyan)";
                      e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.12)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (completed) {
                      e.currentTarget.style.borderColor = "rgba(0,212,240,0.28)";
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,240,0.06)";
                    }
                  }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", fontWeight: 800, color: completed ? "var(--cyan)" : "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {completed ? "🏆 Verified Cert" : "🔒 Locked"}
                        </span>
                        {completed && <span style={{ fontSize: "1.1rem" }}>🎓</span>}
                      </div>
                      <h4 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#fff", margin: "0 0 0.25rem" }}>
                        {game.title.split(":")[0]}
                      </h4>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "var(--muted)", margin: 0 }}>
                        {game.characterName} ({game.characterRole})
                      </p>
                    </div>
                    
                    <div style={{ marginTop: "1rem" }}>
                      {completed ? (
                        <Link href={certLink} target="_blank" style={{ textDecoration: "none", display: "block" }}>
                          <div style={{
                            textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem",
                            color: "#08060f", background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                            padding: "0.45rem 1rem", borderRadius: "100px", cursor: "pointer"
                          }}>
                            View Certificate ↗
                          </div>
                        </Link>
                      ) : (
                        <div style={{
                          textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)",
                          padding: "0.45rem 1rem", borderRadius: "100px"
                        }}>
                          Play to Unlock
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══ FOOTER CTA ══════════════════════════════════════════════════ */}
          <div style={{ textAlign: "center", animation: "dash-up 0.45s 0.5s ease both" }}>
            {completedCount < allGames.length ? (
              <Link href="/games" style={{ textDecoration: "none" }}>
                <button style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem",
                  color: "#08060f",
                  background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                  padding: "0.9rem 2.5rem", borderRadius: "100px", border: "none",
                  cursor: "pointer", boxShadow: "0 0 32px rgba(0,212,240,0.22)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 48px rgba(0,212,240,0.4)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.22)" }}
                >
                  {completedCount === 0 ? "Begin your first game →" : `Continue — ${allGames.length - completedCount} game${allGames.length - completedCount !== 1 ? "s" : ""} left →`}
                </button>
              </Link>
            ) : (
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.5rem", color: "#ffb700", marginBottom: "0.5rem" }}>
                  🏆 All {allGames.length} games complete. The symphony is yours.
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "var(--muted)" }}>
                  The Maestro Simulation and new tracks are coming. You&apos;re ready.
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  )
}
