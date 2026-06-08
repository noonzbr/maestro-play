"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { allGames } from "@/lib/games"

/* ─── Web Audio Synthesizer Sound Effects ─────────────────────────────────── */
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
  } catch (e) {}
}

const sfxClick = () => playSynthBeep(580, "sine", 0.02, 0.08)
const sfxLocked = () => playSynthBeep(160, "triangle", 0.05, 0.18)
const sfxSuccessChime = () => {
  playSynthBeep(523.25, "sine", 0.03, 0.15) // C5
  setTimeout(() => playSynthBeep(659.25, "sine", 0.03, 0.15), 70) // E5
  setTimeout(() => playSynthBeep(783.99, "sine", 0.04, 0.3), 140) // G5
}
const sfxPurchase = () => {
  playSynthBeep(880, "sine", 0.025, 0.1)
  setTimeout(() => playSynthBeep(1320, "sine", 0.035, 0.25), 90)
}

/* ─── Map node positions for 2D Constellation Map (% of viewport) ────────── */
const NODES = [
  { week: 1, x: 12, y: 50, hub: "Jake's Bedroom", district: "Westbrook Heights", emoji: "🎸", label: "1", isOptional: false },
  { week: 2, x: 28, y: 22, hub: "Rehearsal Studio", district: "Music District", emoji: "🥁", label: "A1", isOptional: false },
  { week: 3, x: 46, y: 22, hub: "Concert Backstage", district: "Riverside Venue", emoji: "💼", label: "A2", isOptional: false },
  { week: 4, x: 64, y: 22, hub: "Concert Hall", district: "Riverside Venue", emoji: "🎭", label: "A3", isOptional: false },
  { week: 5, x: 28, y: 40, hub: "The Coffee Shop", district: "Downtown", emoji: "☕", label: "B1", isOptional: false },
  { week: 6, x: 46, y: 40, hub: "Startup Office", district: "Tech Quarter", emoji: "💻", label: "B2", isOptional: false },
  { week: 7, x: 64, y: 40, hub: "Boardroom", district: "Business District", emoji: "🏢", label: "B3", isOptional: false },
  { week: 8, x: 28, y: 58, hub: "Home Office", district: "Westbrook Heights", emoji: "🏠", label: "C1", isOptional: false },
  { week: 9, x: 46, y: 58, hub: "University Library", district: "Campus", emoji: "📚", label: "C2", isOptional: false },
  { week: 10, x: 64, y: 58, hub: "Tech Company HQ", district: "Tech Quarter", emoji: "⚡", label: "C3", isOptional: false },
  { week: 11, x: 33, y: 78, hub: "School Library", district: "Westbrook High", emoji: "🏫", label: "D1", isOptional: false },
  { week: 12, x: 58, y: 78, hub: "Computer Lab", district: "Westbrook High", emoji: "🖥️", label: "D2", isOptional: false },
  { week: 13, x: 12, y: 24, hub: "Alternate Bedroom", district: "Westbrook Heights", emoji: "🎸", label: "v2", isOptional: true },
  { week: 14, x: 82, y: 50, hub: "The Prompt Lab", district: "Research Wing", emoji: "🔬", label: "13", isOptional: false },
  { week: 15, x: 94, y: 50, hub: "Vera's Studio", district: "Creative Hub", emoji: "🎨", label: "14", isOptional: false },
  { week: 16, x: 95, y: 75, hub: "Orion Bridge", district: "Orion Station", emoji: "🚀", label: "15", isOptional: false }
]

const PATHS = [
  [1, 2], [1, 5], [1, 8], [1, 11],
  [2, 3], [3, 4],
  [5, 6], [6, 7],
  [8, 9], [9, 10],
  [11, 12],
  [4, 14], [7, 14], [10, 14], [12, 14],
  [14, 15],
  [15, 16],
  [1, 13]
]

/* ─── Duolingo Unit Definitions ───────────────────────────────────────────── */
interface Unit {
  id: number
  title: string
  subtitle: string
  color: string
  bg: string
  games: number[] // week numbers
  guidebook: string
}

const UNITS: Unit[] = [
  {
    id: 1,
    title: "Unit 1: The Conductor's Awakening",
    subtitle: "Unlock the Socratic companion and learn the Conductor Principle",
    color: "#00d4f0",
    bg: "rgba(0, 212, 240, 0.08)",
    games: [1, 13],
    guidebook: "THE CONDUCTOR PRINCIPLE: AI is a prediction engine that mirrors the specificity and intention of its conductor. Vague prompts output average noise. Detailed contexts inject human value. You are directing the orchestra, not writing the code."
  },
  {
    id: 2,
    title: "Unit 2: AI Fundamentals (Track A)",
    subtitle: "Discover how Neural Nets learn and master professional prompting",
    color: "#00e676",
    bg: "rgba(0, 230, 118, 0.08)",
    games: [2, 3, 4],
    guidebook: "AI CORE UNDERSTANDING: Neural networks match token patterns across historical datasets. Hallucination occurs when training window limits force the model to fill blanks with high-probability predictions. Always anchor prompts with explicit reference sources."
  },
  {
    id: 3,
    title: "Unit 3: Claude Ecosystem (Track B)",
    subtitle: "Run terminal-based agents, write file diffs, and define operational projects",
    color: "#ff9100",
    bg: "rgba(255, 145, 0, 0.08)",
    games: [5, 6, 7],
    guidebook: "CLAUDE DEEP SYSTEM: Claude excels at semantic reasoning and structured outputs. System prompts establish behavioral limits. Projects anchor custom workspace instructions, and Claude Code operates as a terminal agent performing directory reads."
  },
  {
    id: 4,
    title: "Unit 4: ChatGPT & Gemini (Track C)",
    subtitle: "Compare GPT canvas interfaces with Gemini's massive context processing",
    color: "#e040fb",
    bg: "rgba(224, 64, 251, 0.08)",
    games: [8, 9, 10],
    guidebook: "MODEL COMPARISONS: ChatGPT Canvas creates inline project edit workspaces. Gemini features a massive 2-million token context window, allowing you to load complete libraries or hours of audio files. Use ChatGPT for structured output and Gemini for deep analysis."
  },
  {
    id: 5,
    title: "Unit 5: Microsoft Copilot (Track D)",
    subtitle: "Automate Office M365 and configure custom no-code studio bots",
    color: "#4488ff",
    bg: "rgba(68, 136, 255, 0.08)",
    games: [11, 12],
    guidebook: "ENTERPRISE AUTOMATION: Copilot operates inside M365 tools (Teams, Word, Excel). Copilot Studio extends this by configuring custom API nodes, triggers, and knowledge-based documents, creating autonomous agents tailored to company operations."
  },
  {
    id: 6,
    title: "Unit 6: Convergence & The Prompt Lab",
    subtitle: "Conquer Maya's prompt engineering exams, Vera's design audit, and Commander Nova's space diagnostics",
    color: "#ff1744",
    bg: "rgba(255, 23, 68, 0.08)",
    games: [14, 15, 16],
    guidebook: "PROMPT MASTERY: Implement advanced techniques: Few-Shot prompting (providing examples), Chain of Thought (forcing step-by-step reasoning), and Role-Play (defining specialized constraints). Verify your design accessibility grids carefully."
  }
]

/* ─── Twinkle keyframes style injector ─────────────────────────────────────── */
function ensureWorldMapKf() {
  if (typeof document === "undefined") return
  const id = "worldmap-kf-new"
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = `
    @keyframes wm-star-twinkle {
      0%, 100% { opacity: 0.35; }
      50%     { opacity: 0.95; }
    }
    @keyframes wm-next-pulse {
      0%, 100% { box-shadow: 0 0 10px var(--nc, rgba(0,212,240,0.35)); transform: scale(1); }
      50%     { box-shadow: 0 0 28px var(--nc, rgba(0,212,240,0.7)); transform: scale(1.08); }
    }
    @keyframes duo-start-bounce {
      0%, 100% { transform: translateY(0px) translateX(-50%); }
      50%      { transform: translateY(-6px) translateX(-50%); }
    }
    @keyframes duo-line-draw {
      stroke-dashoffset: 0;
    }
    @keyframes side-nav-pulse {
      0%, 100% { opacity: 0.8; }
      50%      { opacity: 1; transform: scale(1.03); }
    }
  `
  document.head.appendChild(s)
}

type Star = { x: number; y: number; r: number; dur: number; delay: number }

export default function WorldMapPage() {
  useEffect(() => { ensureWorldMapKf() }, [])

  // Page layout state
  const [viewMode, setViewMode] = useState<"path" | "map">("path")
  const [activeTab, setActiveTab] = useState<"learn" | "leaderboard" | "quests" | "shop">("learn")
  const [activeNodePopup, setActiveNodePopup] = useState<number | null>(null)
  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState<number | null>(null)

  // Game/User progress state
  const [stars, setStars] = useState<Star[]>([])
  const [gameXp, setGameXp] = useState<Record<number, number>>({})
  const [totalXp, setTotalXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(3)
  const [gems, setGems] = useState(120)
  const [shieldActive, setShieldActive] = useState(false)
  const [doubleXpActive, setDoubleXpActive] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Quest states
  const [questProgress, setQuestProgress] = useState({
    quest1: { current: 50, target: 120, claimed: false }, // earn 120 XP
    quest2: { current: 1, target: 3, claimed: false },    // chat with Coda 3 times
    quest3: { current: 0, target: 1, claimed: false }     // 100% accuracy completion
  })

  // Load localStorage variables
  useEffect(() => {
    setStars(Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.5 + 0.5,
      dur: 2.5 + Math.random() * 3,
      delay: Math.random() * 3,
    })))
    setMounted(true)
    
    try {
      const xps: Record<number, number> = {}
      for (let i = 1; i <= 16; i++) {
        const v = parseInt(localStorage.getItem(`maestro_game_${i}_xp`) ?? "0") || 0
        if (v > 0) xps[i] = v
      }
      setGameXp(xps)
      
      const txp = parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0
      setTotalXp(txp)
      
      // Sync daily quest XP progress
      setQuestProgress(q => ({
        ...q,
        quest1: { ...q.quest1, current: Math.min(txp % 300, 120) }
      }))

      setStreak(parseInt(localStorage.getItem("maestro_daily_streak") ?? "0") || 0)
      setLives(parseInt(localStorage.getItem("maestro_lives") ?? "3") || 3)
      
      // Load virtual coins/gems
      const savedGems = localStorage.getItem("maestro_gems")
      if (savedGems) {
        setGems(parseInt(savedGems))
      } else {
        localStorage.setItem("maestro_gems", "120")
      }

      // Power-up indicators
      setShieldActive(localStorage.getItem("maestro_shield_active") === "true")
      setDoubleXpActive(localStorage.getItem("maestro_double_xp_active") === "true")
    } catch {}
  }, [])

  const completedWeeks = new Set(Object.keys(gameXp).map(Number))
  const completedCount = completedWeeks.size

  // Unlocked path calculations
  const unlockedWeeks = new Set<number>()
  unlockedWeeks.add(1)
  unlockedWeeks.add(13) // optional v2 is always unlocked
  if (completedWeeks.has(1)) {
    unlockedWeeks.add(2)
    unlockedWeeks.add(5)
    unlockedWeeks.add(8)
    unlockedWeeks.add(11)
  }
  if (completedWeeks.has(2)) unlockedWeeks.add(3)
  if (completedWeeks.has(3)) unlockedWeeks.add(4)
  if (completedWeeks.has(5)) unlockedWeeks.add(6)
  if (completedWeeks.has(6)) unlockedWeeks.add(7)
  if (completedWeeks.has(8)) unlockedWeeks.add(9)
  if (completedWeeks.has(9)) unlockedWeeks.add(10)
  if (completedWeeks.has(11)) unlockedWeeks.add(12)
  
  if (
    completedWeeks.has(4) ||
    completedWeeks.has(7) ||
    completedWeeks.has(10) ||
    completedWeeks.has(12)
  ) {
    unlockedWeeks.add(14)
  }
  if (completedWeeks.has(14)) {
    unlockedWeeks.add(15)
  }
  if (completedWeeks.has(15)) {
    unlockedWeeks.add(16)
  }

  // Continue button slug
  let continueSlug = ""
  if (!completedWeeks.has(1)) {
    continueSlug = "welcome-to-ai"
  } else if (unlockedWeeks.has(16) && !completedWeeks.has(16)) {
    continueSlug = "antigravity-cli"
  } else if (unlockedWeeks.has(15) && !completedWeeks.has(15)) {
    continueSlug = "web-design"
  } else if (unlockedWeeks.has(14) && !completedWeeks.has(14)) {
    continueSlug = "prompt-lab"
  } else {
    const activeUncompleted = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find(w => unlockedWeeks.has(w) && !completedWeeks.has(w))
    if (activeUncompleted !== undefined) {
      continueSlug = allGames.find(g => g.week === activeUncompleted)?.slug ?? ""
    }
  }

  const hoveredGame = hovered ? allGames.find(g => g.week === hovered) : null
  const hoveredNode = hovered ? NODES.find(n => n.week === hovered) : null

  // Purchase handler
  const handleBuy = (cost: number, key: string, name: string) => {
    if (gems < cost) {
      sfxLocked()
      alert("Not enough Gems! Complete more Daily Quests.")
      return
    }
    sfxPurchase()
    const nextGems = gems - cost
    setGems(nextGems)
    localStorage.setItem("maestro_gems", String(nextGems))
    
    if (key === "lives") {
      setLives(3)
      localStorage.setItem("maestro_lives", "3")
    } else if (key === "shield") {
      setShieldActive(true)
      localStorage.setItem("maestro_shield_active", "true")
    } else if (key === "doubleXp") {
      setDoubleXpActive(true)
      localStorage.setItem("maestro_double_xp_active", "true")
    }
    alert(`Successfully bought ${name}!`)
  }

  // Claim quest reward
  const handleClaim = (questKey: "quest1" | "quest2" | "quest3", reward: number) => {
    sfxSuccessChime()
    const nextGems = gems + reward
    setGems(nextGems)
    localStorage.setItem("maestro_gems", String(nextGems))
    setQuestProgress(q => ({
      ...q,
      [questKey]: { ...q[questKey], claimed: true }
    }))
  }

  if (!mounted) return null

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#05030d",
      color: "#f0eeff",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      overflow: "hidden"
    }}>

      {/* ── Twinkling Stars Background ──────────────────────────────────────── */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        {stars.map((s, i) => (
          <circle key={i}
            cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
            fill="#ffffff"
            style={{ animation: `wm-star-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }}
          />
        ))}
      </svg>

      {/* ── Left Sidebar Navigation (Duolingo Style) ────────────────────────── */}
      <div style={{
        width: "240px",
        background: "rgba(10, 8, 22, 0.72)",
        borderRight: "1.5px solid rgba(255, 255, 255, 0.08)",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        zIndex: 30,
        backdropFilter: "blur(20px)",
        boxSizing: "border-box",
        height: "100vh"
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ textDecoration: "none" }} onClick={sfxClick}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontSize: "1.8rem", textShadow: "0 0 16px var(--cyan)" }}>🎼</span>
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", letterSpacing: "0.02em" }}>
                MaestroPlay
              </div>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--cyan)", fontWeight: 800 }}>
                AI Career Engine
              </div>
            </div>
          </div>
        </Link>

        {/* Menu Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", flex: 1 }}>
          {[
            { id: "learn", label: "Learn Path", icon: "🟢" },
            { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { id: "quests", label: "Daily Quests", icon: "🎯" },
            { id: "shop", label: "Power Shop", icon: "💎" },
          ].map(item => {
            const active = activeTab === item.id && viewMode === "path"
            return (
              <button
                key={item.id}
                onClick={() => {
                  sfxClick()
                  setViewMode("path")
                  setActiveTab(item.id as any)
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.9rem 1.2rem",
                  borderRadius: "16px",
                  border: active ? "1.5px solid var(--cyan)" : "1.5px solid transparent",
                  background: active ? "rgba(0, 212, 240, 0.06)" : "transparent",
                  color: active ? "#fff" : "rgba(240, 238, 255, 0.72)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"
                    e.currentTarget.style.color = "#fff"
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = "rgba(240, 238, 255, 0.72)"
                  }
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}

          <Link href="/review" style={{ textDecoration: "none" }} onClick={sfxClick}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.9rem 1.2rem",
                borderRadius: "16px",
                border: "1.5px solid transparent",
                color: "rgba(240, 238, 255, 0.72)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "0.86rem",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"
                e.currentTarget.style.color = "#fff"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "rgba(240, 238, 255, 0.72)"
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🧠</span>
              <span>Practice Room</span>
            </div>
          </Link>
        </div>

        {/* User Stats Card in Sidebar footer */}
        <div style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "16px",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.45)", fontWeight: 700 }}>
            <span>Virtual Gems</span>
            <span style={{ color: "#00d4f0" }}>{gems} 💎</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.45)", fontWeight: 700 }}>
            <span>Streak Shield</span>
            <span style={{ color: shieldActive ? "#e040fb" : "rgba(255,255,255,0.2)" }}>
              {shieldActive ? "🛡️ Active" : "None"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.45)", fontWeight: 700 }}>
            <span>Double XP</span>
            <span style={{ color: doubleXpActive ? "#ff9100" : "rgba(255,255,255,0.2)" }}>
              {doubleXpActive ? "⚡ Active" : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main View Panel ────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        zIndex: 10
      }}>

        {/* ── Top stats bar ────────────────────────────────────────────────── */}
        <div style={{
          padding: "1.2rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(5, 3, 13, 0.65)",
          backdropFilter: "blur(20px)",
          borderBottom: "1.5px solid rgba(255, 255, 255, 0.08)",
          zIndex: 40,
        }}>
          {/* Title Header */}
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.01em" }}>
              {viewMode === "map" ? "Westbrook City Map" : "Westbrook Learning Path"}
            </div>
            <div style={{ fontSize: "0.68rem", color: "rgba(240, 238, 255, 0.4)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 700, marginTop: "0.15rem" }}>
              {viewMode === "map" ? "2D Constellation Grid" : `Unit ${activeTab.toUpperCase()} Progress`}
            </div>
          </div>

          {/* Duolingo Stats Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
            {/* View Mode Toggle */}
            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "100px",
              padding: "2px",
              display: "flex",
              gap: "2px"
            }}>
              <button
                onClick={() => { sfxClick(); setViewMode("path") }}
                style={{
                  background: viewMode === "path" ? "linear-gradient(90deg, #00d4f0, #e040fb)" : "transparent",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.45rem 1rem",
                  color: viewMode === "path" ? "#08060f" : "#f0eeff",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                🟢 Path View
              </button>
              <button
                onClick={() => { sfxClick(); setViewMode("map") }}
                style={{
                  background: viewMode === "map" ? "linear-gradient(90deg, #00d4f0, #e040fb)" : "transparent",
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.45rem 1rem",
                  color: viewMode === "map" ? "#08060f" : "#f0eeff",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                🗺️ 2D Map
              </button>
            </div>

            <div style={{ width: "1.5px", height: "24px", background: "rgba(255, 255, 255, 0.15)" }} />

            {/* Streak */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.45rem", filter: streak > 0 ? "none" : "grayscale(1) opacity(0.4)" }}>🔥</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#ff9100" }}>{streak}</div>
                <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Streak</div>
              </div>
            </div>

            {/* Lives */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.45rem" }}>❤️</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#ff1744" }}>{lives}/3</div>
                <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Hearts</div>
              </div>
            </div>

            {/* Gems */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.45rem" }}>💎</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#00d4f0" }}>{gems}</div>
                <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Gems</div>
              </div>
            </div>

            {/* XP */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.45rem" }}>⚡</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#e040fb" }}>{totalXp}</div>
                <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Total XP</div>
              </div>
            </div>

            {/* Continue CTA */}
            <Link
              href={continueSlug ? `/games/${continueSlug}` : "/games"}
              style={{ textDecoration: "none" }}
              onClick={sfxClick}
            >
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "0.78rem",
                color: "#08060f",
                background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                padding: "0.55rem 1.4rem",
                borderRadius: "100px",
                letterSpacing: "0.01em",
                boxShadow: "0 0 20px rgba(0, 212, 240, 0.3)",
                transition: "transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {!completedWeeks.has(1) 
                  ? "Begin →" 
                  : completedWeeks.has(16) 
                  ? "Mastered ✓" 
                  : "Continue →"}
              </div>
            </Link>
          </div>
        </div>

        {/* ── Viewport Contents ────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 10, padding: "2rem" }}>
          
          {/* ── VIEW MODE: 2D Constellation Map ── */}
          {viewMode === "map" && (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              
              {/* Halos */}
              {[
                { x: 12, y: 50, color: "rgba(0,212,240,0.08)",  r: 180 },
                { x: 46, y: 22, color: "rgba(255,180,80,0.06)", r: 200 },
                { x: 46, y: 40, color: "rgba(224,64,251,0.06)", r: 180 },
                { x: 46, y: 58, color: "rgba(16,185,129,0.07)", r: 180 },
                { x: 46, y: 78, color: "rgba(0,120,212,0.07)",  r: 160 },
                { x: 88, y: 50, color: "rgba(224,64,251,0.08)", r: 200 },
              ].map((g, i) => (
                <div key={i} style={{
                  position:     "absolute",
                  left:         `${g.x}%`,
                  top:          `${g.y}%`,
                  transform:    "translate(-50%,-50%)",
                  width:        `${g.r}px`,
                  height:       `${g.r}px`,
                  borderRadius: "50%",
                  background:   `radial-gradient(circle, ${g.color} 0%, transparent 70%)`,
                  pointerEvents:"none",
                  zIndex:       1,
                }} />
              ))}

              {/* Constellation SVGs */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2, pointerEvents: "none" }}
              >
                {PATHS.map(([fromW, toW], i) => {
                  const from = NODES.find(n => n.week === fromW)!
                  const to   = NODES.find(n => n.week === toW)!
                  const destGame = allGames.find(g => g.week === toW) || allGames.find(g => g.week === fromW)
                  const done  = completedWeeks.has(fromW) && completedWeeks.has(toW)
                  const active = completedWeeks.has(fromW) && unlockedWeeks.has(toW) && !completedWeeks.has(toW)
                  const accent = destGame?.accentColor ?? "#00d4f0"

                  const mx = (from.x + to.x) / 2 + (i % 2 === 0 ? 1 : -1)
                  const my = (from.y + to.y) / 2 + (i % 3 === 0 ? -1 : 1)

                  return (
                    <g key={i}>
                      <path
                        d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="0.35"
                        strokeLinecap="round"
                        strokeDasharray={fromW === 1 && toW === 13 ? "1.5,1.5" : "none"}
                      />
                      {(done || active) && (
                        <path
                          d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                          fill="none"
                          stroke={done ? accent : `${accent}88`}
                          strokeWidth={done ? "0.45" : "0.3"}
                          strokeLinecap="round"
                          strokeDasharray={fromW === 1 && toW === 13 ? "1.5,1.5" : undefined}
                          strokeDashoffset="0"
                          opacity={done ? 0.75 : 0.45}
                          style={{ filter: `drop-shadow(0 0 2px ${accent})` }}
                        />
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Node Placement */}
              <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
                {NODES.map(node => {
                  const game = allGames.find(g => g.week === node.week)
                  if (!game) return null
                  const done = completedWeeks.has(node.week)
                  const unlocked = unlockedWeeks.has(node.week)
                  const isNext = unlocked && !done
                  const locked = !unlocked
                  const accent = game.accentColor ?? "#00d4f0"
                  const isHovered = hovered === node.week

                  return (
                    <div
                      key={node.week}
                      onMouseEnter={() => setHovered(node.week)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        position: "absolute",
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: "translate(-50%,-50%)",
                        cursor: locked ? "default" : "pointer",
                        zIndex: isHovered ? 20 : 10,
                      }}
                    >
                      {/* Interactive Circle */}
                      <Link href={locked ? "#" : `/games/${game.slug}`} onClick={locked ? sfxLocked : sfxClick} style={{ textDecoration: "none" }}>
                        <div style={{
                          width: isNext ? "44px" : "36px",
                          height: isNext ? "44px" : "36px",
                          borderRadius: "50%",
                          background: done
                            ? `linear-gradient(135deg, ${accent}cc, ${accent}66)`
                            : isNext
                            ? `linear-gradient(135deg, ${accent}44, ${accent}22)`
                            : "rgba(255,255,255,0.04)",
                          border: done
                            ? `2px solid ${accent}`
                            : isNext
                            ? `2px solid ${accent}88`
                            : "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          transition: "all 0.3s ease",
                          transform: isHovered ? "scale(1.18)" : "scale(1)",
                          ["--nc" as string]: `${accent}44`,
                          animation: isNext
                            ? "wm-next-pulse 2.4s ease-in-out infinite"
                            : done
                            ? "wm-node-pulse 4s ease-in-out infinite"
                            : "none",
                          filter: locked ? "grayscale(1) brightness(0.5)" : "none",
                          boxShadow: done
                            ? `0 0 14px ${accent}44`
                            : isNext
                            ? `0 0 20px ${accent}55`
                            : "none",
                        }}>
                          {done ? "✓" : locked ? "🔒" : node.emoji}
                        </div>
                      </Link>

                      {/* Small badge */}
                      <div style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-8px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: done ? accent : "rgba(255,255,255,0.08)",
                        border: `1px solid ${done ? accent : "rgba(255,255,255,0.15)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.55rem",
                        fontWeight: 800,
                        color: done ? "#08060f" : "rgba(255,255,255,0.5)",
                      }}>
                        {node.label}
                      </div>

                      {/* Label hub */}
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        marginTop: "6px",
                        whiteSpace: "nowrap",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.52rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: done ? "rgba(240,238,255,0.8)" : isNext ? "rgba(240,238,255,0.6)" : "rgba(240,238,255,0.25)",
                        textTransform: "uppercase",
                      }}>
                        {node.hub}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Hover popup */}
              {hovered && hoveredGame && hoveredNode && (
                <div style={{
                  position: "absolute",
                  bottom: "3rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 50,
                  background: "rgba(8,6,20,0.95)",
                  border: `1.5px solid ${hoveredGame.accentColor ?? "#00d4f0"}44`,
                  borderTop: `3px solid ${hoveredGame.accentColor ?? "#00d4f0"}`,
                  borderRadius: "20px",
                  padding: "1.2rem 1.8rem",
                  width: "320px",
                  backdropFilter: "blur(20px)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
                    <div style={{ fontSize: "1.8rem" }}>{hoveredNode.emoji}</div>
                    <div>
                      <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", fontWeight: 700 }}>
                        Game {hoveredGame.week} · {hoveredNode.district}
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>
                        {hoveredGame.title}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "rgba(240, 238, 255, 0.5)", lineHeight: 1.5, marginBottom: "0.6rem" }}>
                    Help <span style={{ color: hoveredGame.accentColor ?? "#00d4f0", fontWeight: 700 }}>{hoveredGame.characterName}</span> solve the AI bottleneck in Westbrook Heights.
                  </div>
                  {completedWeeks.has(hoveredGame.week) ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.8rem" }}>🟢</span>
                      <span style={{ fontSize: "0.7rem", color: "#58cc02", fontWeight: 800 }}>Completed</span>
                    </div>
                  ) : unlockedWeeks.has(hoveredGame.week) ? (
                    <div style={{ fontSize: "0.7rem", color: hoveredGame.accentColor ?? "#00d4f0", fontWeight: 800 }}>
                      ▶ Ready to play
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", fontWeight: 800 }}>
                      🔒 Complete previous chapters to unlock
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── VIEW MODE: Duolingo Path View ── */}
          {viewMode === "path" && activeTab === "learn" && (
            <div style={{
              maxWidth: "520px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "2.5rem",
              paddingBottom: "8rem"
            }}>
              
              {/* Iterate Units */}
              {UNITS.map((unit) => {
                return (
                  <div key={unit.id} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    
                    {/* Unit Banner Card */}
                    <div style={{
                      background: `linear-gradient(135deg, ${unit.color}15, rgba(12, 10, 20, 0.95))`,
                      border: `1.5px solid ${unit.color}35`,
                      borderLeft: `5px solid ${unit.color}`,
                      borderRadius: "22px",
                      padding: "1.4rem 1.8rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
                    }}>
                      <div style={{ flex: 1, paddingRight: "1rem" }}>
                        <div style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 900,
                          fontSize: "0.75rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: unit.color,
                          marginBottom: "0.3rem"
                        }}>
                          {unit.title}
                        </div>
                        <p style={{
                          fontFamily: "Cormorant Garamond, serif",
                          fontSize: "1.08rem",
                          fontStyle: "italic",
                          color: "rgba(240, 238, 255, 0.82)",
                          margin: 0,
                          lineHeight: 1.4
                        }}>
                          {unit.subtitle}
                        </p>
                      </div>
                      <button
                        onClick={() => { sfxClick(); setActiveGuidebookUnit(unit.id) }}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${unit.color}44`,
                          borderRadius: "100px",
                          color: "#fff",
                          padding: "0.55rem 1.1rem",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                      >
                        📖 Guidebook
                      </button>
                    </div>

                    {/* Vertical Snake Node Path */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2.8rem",
                      position: "relative",
                      padding: "1rem 0"
                    }}>
                      
                      {unit.games.map((weekNum, idx) => {
                        const game = allGames.find(g => g.week === weekNum)
                        if (!game) return null

                        const done = completedWeeks.has(weekNum)
                        const unlocked = unlockedWeeks.has(weekNum)
                        const isNext = unlocked && !done
                        const locked = !unlocked

                        // Calculate snake horizontal shift
                        const shift = idx % 3 === 0 
                          ? -42 
                          : idx % 3 === 1 
                            ? 0 
                            : 42

                        return (
                          <div
                            key={weekNum}
                            style={{
                              transform: `translateX(${shift}px)`,
                              position: "relative",
                            }}
                          >
                            
                            {/* Floating "START! ⚡" Balloon above the next active node */}
                            {isNext && (
                              <div style={{
                                position: "absolute",
                                bottom: "100%",
                                left: "50%",
                                transform: "translateX(-50%) translateY(-10px)",
                                background: unit.color,
                                color: "#08060f",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 900,
                                fontSize: "0.62rem",
                                padding: "0.3rem 0.65rem",
                                borderRadius: "8px",
                                whiteSpace: "nowrap",
                                boxShadow: `0 0 16px ${unit.color}55`,
                                animation: "duo-start-bounce 1.5s ease-in-out infinite",
                                zIndex: 12
                              }}>
                                START! ⚡
                                <div style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  width: 0,
                                  height: 0,
                                  borderLeft: "5px solid transparent",
                                  borderRight: "5px solid transparent",
                                  borderTop: `5px solid ${unit.color}`
                                }} />
                              </div>
                            )}

                            {/* Circular Node Button */}
                            <button
                              onClick={() => {
                                if (locked) {
                                  sfxLocked()
                                } else {
                                  sfxClick()
                                  setActiveNodePopup(weekNum)
                                }
                              }}
                              style={{
                                width: isNext ? "66px" : "58px",
                                height: isNext ? "66px" : "58px",
                                borderRadius: "50%",
                                background: done
                                  ? "linear-gradient(135deg, #ffd700, #ff8f00)" 
                                  : isNext
                                  ? `linear-gradient(135deg, ${unit.color}22, ${unit.color}11)`
                                  : "rgba(255, 255, 255, 0.03)",
                                border: done
                                  ? "3.5px solid #ffcc00"
                                  : isNext
                                  ? `3.5px solid ${unit.color}`
                                  : "2px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.7rem",
                                cursor: "pointer",
                                boxShadow: done
                                  ? "0 4px 18px rgba(255, 143, 0, 0.4), 0 0 24px rgba(255,215,0,0.18)"
                                  : isNext
                                  ? `0 0 24px ${unit.color}55`
                                  : "none",
                                outline: "none",
                                transition: "all 0.25s",
                                filter: locked ? "grayscale(1) brightness(0.4)" : "none",
                                ["--nc" as string]: `${unit.color}44`,
                                animation: isNext ? "wm-next-pulse 2.2s infinite" : "none",
                              }}
                              onMouseEnter={e => {
                                if (!locked) e.currentTarget.style.transform = "scale(1.08)"
                              }}
                              onMouseLeave={e => {
                                if (!locked) e.currentTarget.style.transform = "scale(1)"
                              }}
                            >
                              {done ? "👑" : locked ? "🔒" : game.emoji}
                            </button>

                            {/* Mini Name underneath circular node */}
                            <div style={{
                              position: "absolute",
                              top: "100%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              marginTop: "6px",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.55rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              color: done ? "#ffcc00" : isNext ? "#fff" : "rgba(255,255,255,0.22)",
                              whiteSpace: "nowrap"
                            }}>
                              {game.characterName ?? `Game ${weekNum}`}
                            </div>

                            {/* Node Popup Drawer */}
                            {activeNodePopup === weekNum && (
                              <div style={{
                                position: "absolute",
                                top: "110%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 100,
                                background: "rgba(10, 8, 22, 0.98)",
                                border: `1.5px solid ${unit.color}44`,
                                borderTop: `4px solid ${unit.color}`,
                                borderRadius: "20px",
                                padding: "1.2rem 1.5rem",
                                width: "270px",
                                boxShadow: "0 10px 32px rgba(0,0,0,0.6)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.8rem",
                              }}>
                                <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setActiveNodePopup(null) }}
                                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem" }}
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                  {game.characterImage && (
                                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", overflow: "hidden", border: `1px solid ${unit.color}33` }}>
                                      <img src={game.characterImage} alt={game.characterName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                  )}
                                  <div>
                                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                                      Game {weekNum} · {game.characterRole ?? "Bot"}
                                    </div>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff" }}>
                                      {game.title}
                                    </div>
                                  </div>
                                </div>
                                <p style={{ fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.6)", margin: 0, lineHeight: 1.45 }}>
                                  {game.slug === "antigravity-cli"
                                    ? "Direct autonomous coding agents with Commander Nova on Orion Station."
                                    : game.accentColor === "#00d4f0" 
                                    ? "Help Jake conduct his band's EP with Socratic AI."
                                    : `Master AI skills alongside ${game.characterName || "the team"} in this track.`}
                                </p>
                                <Link
                                  href={`/games/${game.slug}`}
                                  style={{ textDecoration: "none" }}
                                  onClick={sfxSuccessChime}
                                >
                                  <button style={{
                                    width: "100%",
                                    background: unit.color,
                                    color: "#08060f",
                                    border: "none",
                                    borderRadius: "12px",
                                    padding: "0.65rem",
                                    fontWeight: 900,
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                    boxShadow: `0 0 16px ${unit.color}33`,
                                  }}>
                                    {done ? "REVIEW (+50 XP)" : "START (+100 XP)"}
                                  </button>
                                </Link>
                              </div>
                            )}

                          </div>
                        )
                      })}

                    </div>

                  </div>
                )
              })}

            </div>
          )}

          {/* ── VIEW MODE: Leaderboard Panel ── */}
          {viewMode === "path" && activeTab === "leaderboard" && (
            <div style={{
              maxWidth: "560px",
              margin: "0 auto",
              background: "rgba(10, 8, 22, 0.65)",
              border: "1.5px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <span style={{ fontSize: "2.8rem" }}>🏆</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0.5rem 0 0.2rem", color: "#fff" }}>
                  Conductor League
                </h2>
                <p style={{ fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                  Top 3 students promote to Grand Maestro League
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { rank: 1, name: "Zoe (Drummer)", xp: 680, avatar: "/images/zoe.png" },
                  { rank: 2, name: "You (Conductor)", xp: totalXp, avatar: "/images/ai-tutor.png", isPlayer: true },
                  { rank: 3, name: "Carlos (Pro)", xp: 480, avatar: "/images/carlos.png" },
                  { rank: 4, name: "Kai (Coder)", xp: 420, avatar: "/images/kai.png" },
                  { rank: 5, name: "Jake (Guitarist)", xp: 390, avatar: "/images/tyler.png" },
                  { rank: 6, name: "Aria (Violinist)", xp: 340, avatar: "/images/aria.png" },
                  { rank: 7, name: "Priya (Ops)", xp: 260, avatar: "/images/priya.png" },
                  { rank: 8, name: "Jordan (Consultant)", xp: 190, avatar: "/images/jordan.png" },
                  { rank: 9, name: "Sam (SysAdmin)", xp: 120, avatar: "/images/sam.png" },
                  { rank: 10, name: "Luna (Artist)", xp: 90, avatar: "/images/luna.png" }
                ].sort((a,b) => b.xp - a.xp).map((student, idx) => {
                  const rank = idx + 1
                  const isPlayer = student.isPlayer
                  const promoZone = rank <= 3
                  
                  return (
                    <div
                      key={student.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.85rem 1.25rem",
                        borderRadius: "16px",
                        background: isPlayer ? "rgba(0, 212, 240, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isPlayer 
                          ? "1.5px solid var(--cyan)" 
                          : promoZone 
                            ? "1px solid rgba(255, 215, 0, 0.15)" 
                            : "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          width: "20px",
                          textAlign: "center",
                          color: rank === 1 ? "#ffd700" : rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : "rgba(240,238,255,0.4)"
                        }}>
                          {rank}
                        </span>

                        <div style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: `1.5px solid ${promoZone ? "#ffd70055" : "rgba(255,255,255,0.1)"}`,
                          background: "#0c0a14"
                        }}>
                          <img src={student.avatar} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} onError={e => e.currentTarget.src = "/images/ai-character.png"} />
                        </div>

                        <span style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: isPlayer ? 800 : 600,
                          fontSize: "0.88rem",
                          color: isPlayer ? "#fff" : "rgba(240, 238, 255, 0.82)"
                        }}>
                          {student.name}
                        </span>
                      </div>

                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        color: promoZone ? "#ffd700" : "rgba(240,238,255,0.6)"
                      }}>
                        ⚡ {student.xp} XP
                      </span>
                    </div>
                  )
                })}
              </div>

              <div style={{
                marginTop: "1.5rem",
                textAlign: "center",
                fontSize: "0.7rem",
                color: "rgba(255,215,0,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                borderTop: "1.5px dashed rgba(255,215,0,0.25)",
                paddingTop: "1rem"
              }}>
                ▲ Promotion Zone (Top 3 qualify) ▲
              </div>
            </div>
          )}

          {/* ── VIEW MODE: Daily Quests Panel ── */}
          {viewMode === "path" && activeTab === "quests" && (
            <div style={{
              maxWidth: "520px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2.8rem" }}>🎯</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0.5rem 0 0.2rem", color: "#fff" }}>
                  Daily Quests
                </h2>
                <p style={{ fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                  Complete objectives to earn virtual Gems!
                </p>
              </div>

              {/* Quest Items */}
              {[
                {
                  key: "quest1",
                  title: "Master Conductor",
                  desc: "Earn 120 XP in daily scenario challenges",
                  reward: 25,
                  prog: questProgress.quest1,
                  icon: "⚡"
                },
                {
                  key: "quest2",
                  title: "Socratic Dialogues",
                  desc: "Chat with Coda 3 times to review lessons",
                  reward: 20,
                  prog: questProgress.quest2,
                  icon: "💬"
                },
                {
                  key: "quest3",
                  title: "Unbroken Rhythm",
                  desc: "Complete 1 visual novel game with 100% quiz accuracy",
                  reward: 40,
                  prog: questProgress.quest3,
                  icon: "🎼"
                }
              ].map(quest => {
                const done = quest.prog.current >= quest.prog.target
                const pct = Math.min(100, (quest.prog.current / quest.prog.target) * 100)
                
                return (
                  <div
                    key={quest.key}
                    style={{
                      background: "rgba(10, 8, 22, 0.65)",
                      border: done ? "1.5px solid rgba(88,204,2,0.3)" : "1.5px solid rgba(255,255,255,0.06)",
                      borderRadius: "20px",
                      padding: "1.4rem 1.6rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>{quest.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: done ? "#58cc02" : "#fff" }}>
                          {quest.title}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "rgba(240, 238, 255, 0.5)", marginBottom: "0.8rem", lineHeight: 1.4 }}>
                        {quest.desc}
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: done ? "#58cc02" : "var(--cyan)",
                            borderRadius: "3px"
                          }} />
                        </div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(240,238,255,0.4)", minWidth: "40px" }}>
                          {quest.prog.current}/{quest.prog.target}
                        </span>
                      </div>
                    </div>

                    <div>
                      {quest.prog.claimed ? (
                        <span style={{ fontSize: "0.72rem", color: "rgba(240,238,255,0.3)", fontWeight: 700 }}>
                          Claimed ✓
                        </span>
                      ) : done ? (
                        <button
                          onClick={() => handleClaim(quest.key as any, quest.reward)}
                          style={{
                            background: "linear-gradient(90deg, #58cc02, #46a302)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            padding: "0.6rem 1.1rem",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 900,
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            boxShadow: "0 0 16px rgba(88,204,2,0.3)",
                            transition: "transform 0.15s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                          CLAIM {quest.reward}💎
                        </button>
                      ) : (
                        <div style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "10px",
                          color: "rgba(240, 238, 255, 0.4)",
                          padding: "0.6rem 0.95rem",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textAlign: "center"
                        }}>
                          {quest.reward} Gems
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

            </div>
          )}

          {/* ── VIEW MODE: Power Shop Panel ── */}
          {viewMode === "path" && activeTab === "shop" && (
            <div style={{
              maxWidth: "520px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2.8rem" }}>💎</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0.5rem 0 0.2rem", color: "#fff" }}>
                  Virtual Power Shop
                </h2>
                <p style={{ fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                  Spend Gems to activate campaign boosters!
                </p>
              </div>

              {[
                {
                  key: "lives",
                  name: "Heart Refill",
                  desc: "Instantly refill your hearts to 3/3 to keep learning without waiting.",
                  cost: 80,
                  icon: "❤️",
                  activeState: lives >= 3
                },
                {
                  key: "shield",
                  name: "Streak Shield (Freeze)",
                  desc: "Absorbs one inactive day. Streak is protected if you miss practice.",
                  cost: 100,
                  icon: "🛡️",
                  activeState: shieldActive
                },
                {
                  key: "doubleXp",
                  name: "Double XP Potion",
                  desc: "Earn 2x XP multiplier in prompt challenges and boss battles for 24h.",
                  cost: 150,
                  icon: "⚡",
                  activeState: doubleXpActive
                }
              ].map(item => {
                return (
                  <div
                    key={item.key}
                    style={{
                      background: "rgba(10, 8, 22, 0.65)",
                      border: "1.5px solid rgba(255,255,255,0.06)",
                      borderRadius: "20px",
                      padding: "1.4rem 1.6rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: "0.98rem", color: "#fff" }}>
                          {item.name}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.5)", margin: 0, lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </div>

                    <div>
                      {item.activeState && item.key !== "lives" ? (
                        <div style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "10px",
                          color: "rgba(240,238,255,0.3)",
                          padding: "0.6rem 0.95rem",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          whiteSpace: "nowrap"
                        }}>
                          Active 
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuy(item.cost, item.key, item.name)}
                          style={{
                            background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#08060f",
                            padding: "0.6rem 1.15rem",
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 900,
                            fontSize: "0.76rem",
                            cursor: "pointer",
                            boxShadow: "0 0 16px rgba(0,212,240,0.2)",
                            transition: "transform 0.15s",
                            whiteSpace: "nowrap"
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                        >
                          BUY {item.cost}💎
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              <div style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                paddingTop: "1.5rem",
                marginTop: "1rem"
              }}>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                  textAlign: "center"
                }}>
                  Premium Gem Bundles
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Link href="/checkout/starter-pack" style={{ textDecoration: "none", flex: 1 }} onClick={sfxClick}>
                    <div style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "16px",
                      padding: "1rem",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "border-color 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0, 212, 240, 0.35)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"}
                    >
                      <div style={{ fontSize: "1.5rem" }}>📦</div>
                      <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#fff", marginTop: "0.3rem" }}>Starter Pack</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--cyan)", margin: "0.2rem 0" }}>50 Gems + Refills</div>
                      <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "#fff" }}>$2.99</div>
                    </div>
                  </Link>

                  <Link href="/checkout/maestro-bundle" style={{ textDecoration: "none", flex: 1 }} onClick={sfxClick}>
                    <div style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "16px",
                      padding: "1rem",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "border-color 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(224, 64, 251, 0.35)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"}
                    >
                      <div style={{ fontSize: "1.5rem" }}>👑</div>
                      <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "#fff", marginTop: "0.3rem" }}>Maestro Bundle</div>
                      <div style={{ fontSize: "0.65rem", color: "#e040fb", margin: "0.2rem 0" }}>200 Gems + Boosters</div>
                      <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "#fff" }}>$6.99</div>
                    </div>
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ── Guidebook Detail Modal Overlay ─────────────────────────────────── */}
      {activeGuidebookUnit !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(5, 3, 13, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => setActiveGuidebookUnit(null)}
        >
          <div
            style={{
              maxWidth: "520px",
              width: "100%",
              background: "rgba(12, 10, 20, 0.98)",
              border: `1.5px solid ${UNITS.find(u => u.id === activeGuidebookUnit)?.color}44`,
              borderTop: `5px solid ${UNITS.find(u => u.id === activeGuidebookUnit)?.color}`,
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 20px 48px rgba(0,0,0,0.65)",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "0.8rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.4rem" }}>📖</span>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: "0.78rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: UNITS.find(u => u.id === activeGuidebookUnit)?.color
                }}>
                  Track Guidebook
                </span>
              </div>
              <button
                onClick={() => setActiveGuidebookUnit(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>

            <h3 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "1.32rem",
              color: "#fff",
              margin: "0 0 0.8rem"
            }}>
              {UNITS.find(u => u.id === activeGuidebookUnit)?.subtitle}
            </h3>
            
            <p style={{
              fontSize: "0.86rem",
              lineHeight: 1.6,
              color: "rgba(240, 238, 255, 0.72)",
              marginBottom: "1.8rem",
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "1.2rem",
              borderRadius: "16px",
              fontStyle: "italic"
            }}>
              {UNITS.find(u => u.id === activeGuidebookUnit)?.guidebook}
            </p>

            <button
              onClick={() => setActiveGuidebookUnit(null)}
              style={{
                width: "100%",
                background: UNITS.find(u => u.id === activeGuidebookUnit)?.color,
                color: "#08060f",
                border: "none",
                borderRadius: "12px",
                padding: "0.75rem",
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "0.82rem",
                cursor: "pointer",
                boxShadow: `0 0 16px ${UNITS.find(u => u.id === activeGuidebookUnit)?.color}25`
              }}
            >
              Got it, back to training
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
