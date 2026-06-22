"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { allGames } from "@/lib/games"
import { motion, AnimatePresence } from "framer-motion"

const findGameByWeek = (week: number) => {
  if (week === 1) return allGames.find(g => g.slug === "welcome-to-ai-v2")
  return allGames.find(g => g.week === week)
}


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
  [15, 16]
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
    games: [1],
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
    @keyframes wm-wave-bar {
      0%, 100% { height: 4px; }
      50%      { height: 28px; }
    }
  `
  document.head.appendChild(s)
}

interface VoiceNote {
  id: string
  sender: string
  avatar: string
  color: string
  subject: string
  content: string
  unlockedAt: number
  duration: string
  freq: number
}

const VOICE_NOTES: VoiceNote[] = [
  {
    id: "jake-1",
    sender: "Jake",
    avatar: "/images/guitarplayer1.png",
    color: "rgba(0, 212, 240, 0.9)",
    subject: "Transcription Prompts",
    content: "Hey! Coda told me to check out this prompt pattern for copying guitar tabs. I tried it and it actually transcribed my baseline correctly! It's like having a tech copilot who actually understands syncopation. I'm heading to rehearsal, catch you there.",
    unlockedAt: 1,
    duration: "0:42",
    freq: 440
  },
  {
    id: "felipe-1",
    sender: "Felipe",
    avatar: "/images/carlos.png",
    color: "rgba(224, 64, 251, 0.9)",
    subject: "Prompting Like a Conductor",
    content: "The orchestra has been tuning their instruments while you were away. Specifying constraints in the prompts is like setting the metronome — if you don't do it, everyone plays at their own tempo. Keep practicing in the daily challenge.",
    unlockedAt: 2,
    duration: "0:56",
    freq: 520
  },
  {
    id: "vega-1",
    sender: "Senora Vega",
    avatar: "/images/senoravega.png",
    color: "rgba(255, 23, 68, 0.9)",
    subject: "Socratic Reasoning",
    content: "I'm grading the theory sheets. Some students are still treating AI like a search engine instead of a reasoning tutor. I reminded them that if they ask for direct answers, they won't pass the performance check. Focus on Socratic questions!",
    unlockedAt: 4,
    duration: "1:15",
    freq: 330
  },
  {
    id: "zoe-1",
    sender: "Zoe",
    avatar: "/images/zoe.png",
    color: "rgba(0, 230, 118, 0.9)",
    subject: "Context Windows & Overflows",
    content: "Just patched the server room pipeline. We had a token overflow issue because Jordan sent a massive contextual text blob without segmenting it. Keep your context windows tight, people!",
    unlockedAt: 7,
    duration: "0:38",
    freq: 660
  },
  {
    id: "maya-1",
    sender: "Maya",
    avatar: "/images/maya.png",
    color: "rgba(255, 145, 0, 0.9)",
    subject: "Few-Shot Priming Prep",
    content: "I'm setting up the prompt challenge rooms. We've got 6 new prompt templates loaded in the lab. If you haven't mastered Few-Shot priming yet, you're going to struggle with the next set of diagnostics. Practicing now is key.",
    unlockedAt: 13,
    duration: "1:02",
    freq: 580
  }
]

type Star = { x: number; y: number; r: number; dur: number; delay: number }

export default function WorldMapPage() {
  useEffect(() => { ensureWorldMapKf() }, [])

  // Page layout state
  const [viewMode, setViewMode] = useState<"path" | "map">("path")
  const [activeTab, setActiveTab] = useState<"learn" | "leaderboard" | "quests" | "chatter" | "shop">("learn")
  const [activeNodePopup, setActiveNodePopup] = useState<number | null>(null)
  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState<number | null>(null)

  const [activeTransmission, setActiveTransmission] = useState<VoiceNote | null>(null)
  const [newTransmissionsCount, setNewTransmissionsCount] = useState(0)
  const [typedLogText, setTypedLogText] = useState("")
  const [isPlayingLog, setIsPlayingLog] = useState(false)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get("tab")
      if (tab === "chatter" || tab === "learn" || tab === "leaderboard" || tab === "quests" || tab === "shop") {
        setActiveTab(tab)
      }
    }
    
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

      // Offline updates / voice notes trigger
      const lastVisit = localStorage.getItem("maestro_last_map_visit")
      const now = Date.now()
      localStorage.setItem("maestro_last_map_visit", now.toString())
      
      const readList = JSON.parse(localStorage.getItem("maestro_read_transmissions") ?? "[]")
      const unlocked = VOICE_NOTES.filter(t => {
        const week = t.unlockedAt
        return week === 1 || (parseInt(localStorage.getItem(`maestro_game_${week}_xp`) ?? "0") || 0) > 0
      })
      const unread = unlocked.filter(t => !readList.includes(t.id))
      setNewTransmissionsCount(unread.length)

      if (unread.length > 0 && lastVisit) {
        const elapsed = (now - parseInt(lastVisit)) / 1000
        // Trigger transmission popup if returned after 15 seconds
        if (elapsed > 15) {
          const target = unread[0]
          setActiveTransmission(target)
          
          // Mark as read
          const nextReadList = [...readList, target.id]
          localStorage.setItem("maestro_read_transmissions", JSON.stringify(nextReadList))
          setNewTransmissionsCount(VOICE_NOTES.filter(t => {
            const week = t.unlockedAt
            return week === 1 || (parseInt(localStorage.getItem(`maestro_game_${week}_xp`) ?? "0") || 0) > 0
          }).filter(t => !nextReadList.includes(t.id)).length)
        }
      }
    } catch {}
  }, [])

  const completedWeeks = new Set(Object.keys(gameXp).map(Number))
  if (completedWeeks.has(13)) {
    completedWeeks.add(1)
  }
  if (completedWeeks.has(1)) {
    completedWeeks.add(13)
  }
  const completedCount = completedWeeks.size

  // Unlocked path calculations
  const unlockedWeeks = new Set<number>()
  unlockedWeeks.add(1)
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
    continueSlug = "welcome-to-ai-v2"
  } else if (unlockedWeeks.has(16) && !completedWeeks.has(16)) {
    continueSlug = "antigravity-cli"
  } else if (unlockedWeeks.has(15) && !completedWeeks.has(15)) {
    continueSlug = "web-design"
  } else if (unlockedWeeks.has(14) && !completedWeeks.has(14)) {
    continueSlug = "prompt-lab"
  } else {
    const activeUncompleted = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find(w => unlockedWeeks.has(w) && !completedWeeks.has(w))
    if (activeUncompleted !== undefined) {
      continueSlug = findGameByWeek(activeUncompleted)?.slug ?? ""
    }
  }

  const hoveredGame = hovered ? findGameByWeek(hovered) : null
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
      flexDirection: isMobile ? "column" : "row",
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
      {!isMobile && (
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
            { id: "chatter", label: "Radio Chatter", icon: "📻", badge: newTransmissionsCount > 0 },
            { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { id: "quests", label: "Daily Quests", icon: "🎯" },
            { id: "shop", label: "Power Shop", icon: "💎" },
          ].map(item => {
            const active = activeTab === item.id && viewMode === "path"
            const showBadge = (item as any).badge
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
                  justifyContent: "space-between",
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
                  transition: "all 0.2s",
                  width: "100%",
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
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {showBadge && (
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#ff1744", boxShadow: "0 0 8px #ff1744"
                  }} />
                )}
              </button>
            )
          })}

          <Link href="/daily-challenge" style={{ textDecoration: "none" }} onClick={sfxClick}>
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
      )}

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
          padding: isMobile ? "0.6rem 0.8rem" : "1.2rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(5, 3, 13, 0.65)",
          backdropFilter: "blur(20px)",
          borderBottom: "1.5px solid rgba(255, 255, 255, 0.08)",
          zIndex: 40,
        }}>
          {/* Title Header */}
          {!isMobile && (
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.01em" }}>
                Westbrook Learning Path
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(240, 238, 255, 0.4)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 700, marginTop: "0.15rem" }}>
                Unit Progress
              </div>
            </div>
          )}

          {/* Duolingo Stats Pills */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "flex-end",
            width: isMobile ? "100%" : "auto",
            gap: isMobile ? "0.6rem" : "1.8rem"
          }}>

            {/* Streak */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <span style={{ fontSize: isMobile ? "1.15rem" : "1.45rem", filter: streak > 0 ? "none" : "grayscale(1) opacity(0.4)" }}>🔥</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: isMobile ? "0.85rem" : "0.95rem", color: "#ff9100", lineHeight: 1 }}>{streak}</div>
                {!isMobile && <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Streak</div>}
              </div>
            </div>

            {/* Lives */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <span style={{ fontSize: isMobile ? "1.15rem" : "1.45rem" }}>❤️</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: isMobile ? "0.85rem" : "0.95rem", color: "#ff1744", lineHeight: 1 }}>{lives}/3</div>
                {!isMobile && <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Hearts</div>}
              </div>
            </div>

            {/* Gems */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <span style={{ fontSize: isMobile ? "1.15rem" : "1.45rem" }}>💎</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: isMobile ? "0.85rem" : "0.95rem", color: "#00d4f0", lineHeight: 1 }}>{gems}</div>
                {!isMobile && <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Gems</div>}
              </div>
            </div>

            {/* XP */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <span style={{ fontSize: isMobile ? "1.15rem" : "1.45rem" }}>⚡</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: isMobile ? "0.85rem" : "0.95rem", color: "#e040fb", lineHeight: 1 }}>{totalXp}</div>
                {!isMobile && <div style={{ fontSize: "0.5rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase" }}>Total XP</div>}
              </div>
            </div>

            {/* Continue CTA */}
            {continueSlug && (
              <Link
                href={`/games/${continueSlug}`}
                style={{ textDecoration: "none" }}
                onClick={sfxClick}
              >
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: isMobile ? "0.62rem" : "0.78rem",
                  color: "#08060f",
                  background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                  padding: isMobile ? "0.35rem 0.65rem" : "0.55rem 1.4rem",
                  borderRadius: "100px",
                  letterSpacing: "0.01em",
                  boxShadow: "0 0 12px rgba(0, 212, 240, 0.2)",
                  transition: "transform 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {isMobile ? "Play" : (!completedWeeks.has(1) ? "Begin →" : "Continue →")}
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* ── Viewport Contents ────────────────────────────────────────────── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 10,
          padding: isMobile ? "1rem 1rem calc(1.5rem + 64px + env(safe-area-inset-bottom, 0px))" : "2rem"
        }}>

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
                    <motion.div 
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      style={{
                        background: `linear-gradient(135deg, ${unit.color}15, rgba(12, 10, 20, 0.95))`,
                        border: `1.5px solid ${unit.color}35`,
                        borderLeft: `5px solid ${unit.color}`,
                        borderRadius: "22px",
                        padding: isMobile ? "1rem 1.2rem" : "1.4rem 1.8rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
                      }}
                    >
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
                    </motion.div>

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
                        const game = findGameByWeek(weekNum)
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

                            {/* Circular Node Button — direct navigation when unlocked */}
                            {!locked ? (
                              <Link href={`/games/${game.slug}`} style={{ textDecoration: "none" }} onClick={() => sfxSuccessChime()}>
                                <button
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
                                    ["--nc" as string]: `${unit.color}44`,
                                    animation: isNext ? "wm-next-pulse 2.2s infinite" : "none",
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)" }}
                                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                                >
                                  {done ? "👑" : game.emoji}
                                </button>
                              </Link>
                            ) : (
                              <button
                                onClick={() => sfxLocked()}
                                style={{
                                  width: "58px",
                                  height: "58px",
                                  borderRadius: "50%",
                                  background: "rgba(255, 255, 255, 0.03)",
                                  border: "2px solid rgba(255,255,255,0.06)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1.7rem",
                                  cursor: "not-allowed",
                                  outline: "none",
                                  filter: "grayscale(1) brightness(0.4)",
                                  transition: "all 0.25s",
                                }}
                              >
                                🔒
                              </button>
                            )}


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
                             <AnimatePresence>
                               {activeNodePopup === weekNum && (
                                 <motion.div
                                   initial={{ opacity: 0, scale: 0.9, y: -10, x: "-50%" }}
                                   animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                                   exit={{ opacity: 0, scale: 0.9, y: -10, x: "-50%" }}
                                   transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                   style={{
                                     position: "absolute",
                                     top: "110%",
                                     left: "50%",
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
                                   }}
                                 >
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
                                 </motion.div>
                               )}
                             </AnimatePresence>

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
                  { rank: 5, name: "Jake (Guitarist)", xp: 390, avatar: "/images/guitarplayer1.png" },
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
                    <motion.div
                      key={student.name}
                      whileHover={{ x: 3 }}
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
                    </motion.div>
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
                  <motion.div
                    key={quest.key}
                    whileHover={{ y: -2 }}
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
                  </motion.div>
                )
              })}

            </div>
          )}

          {/* ── VIEW MODE: Radio Chatter Panel ── */}
          {viewMode === "path" && activeTab === "chatter" && (
            <div style={{
              maxWidth: "520px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "2.8rem" }}>📻</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0.5rem 0 0.2rem", color: "#fff" }}>
                  Radio Chatter Feed
                </h2>
                <p style={{ fontSize: "0.75rem", color: "rgba(240, 238, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                  Incoming transmissions from the Westbrook team
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {VOICE_NOTES.filter(note => {
                  const week = note.unlockedAt
                  return week === 1 || (parseInt(localStorage.getItem(`maestro_game_${week}_xp`) ?? "0") || 0) > 0
                }).map(note => {
                  const readList = JSON.parse(localStorage.getItem("maestro_read_transmissions") ?? "[]")
                  const isUnread = !readList.includes(note.id)
                  
                  return (
                    <motion.div
                      key={note.id}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        sfxClick()
                        setActiveTransmission(note)
                        
                        // Mark as read
                        if (isUnread) {
                          const nextReadList = [...readList, note.id]
                          localStorage.setItem("maestro_read_transmissions", JSON.stringify(nextReadList))
                          setNewTransmissionsCount(VOICE_NOTES.filter(t => {
                            const week = t.unlockedAt
                            return week === 1 || (parseInt(localStorage.getItem(`maestro_game_${week}_xp`) ?? "0") || 0) > 0
                          }).filter(t => !nextReadList.includes(t.id)).length)
                        }
                      }}
                      style={{
                        background: "rgba(10, 8, 22, 0.65)",
                        border: isUnread ? `1.5px solid ${note.color}` : "1.5px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "20px",
                        padding: "1.2rem 1.4rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        boxShadow: isUnread ? `0 0 20px ${note.color}15` : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      {/* NPC Avatar representation */}
                      <div style={{
                        width: "56px", height: "56px", borderRadius: "50%",
                        border: `1.5px solid ${note.color}`,
                        background: `url(${note.avatar}) bottom center / cover no-repeat`,
                        flexShrink: 0
                      }} />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#fff" }}>{note.sender}</span>
                          <span style={{ fontSize: "0.7rem", color: note.color, fontWeight: 700, textTransform: "uppercase" }}>
                            {note.subject}
                          </span>
                          {isUnread && (
                            <span style={{
                              fontSize: "0.58rem", fontWeight: 900, color: "#ff1744",
                              background: "rgba(255, 23, 68, 0.15)", padding: "0.1rem 0.4rem", borderRadius: "6px"
                            }}>
                              NEW
                            </span>
                          )}
                        </div>
                        <p style={{
                          fontSize: "0.78rem", color: "rgba(240, 238, 255, 0.65)",
                          margin: "0.25rem 0 0", lineHeight: 1.4,
                          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
                        }}>
                          {note.content}
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
                        <span style={{ fontSize: "1.1rem" }}>🔊</span>
                        <span style={{ fontSize: "0.6rem", color: "rgba(240, 238, 255, 0.4)", fontWeight: 700 }}>
                          {note.duration}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
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
                  <motion.div
                    key={item.key}
                    whileHover={{ y: -2 }}
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
                  </motion.div>
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

      {isMobile && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "64px",
          background: "rgba(10, 8, 22, 0.96)",
          borderTop: "1.5px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 40,
          boxSizing: "border-box",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          {[
            { id: "learn", label: "Learn", icon: "🟢" },
            { id: "chatter", label: "Radio", icon: "📻", badge: newTransmissionsCount > 0 },
            { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
            { id: "quests", label: "Quests", icon: "🎯" },
            { id: "shop", label: "Shop", icon: "💎" },
          ].map(item => {
            const active = activeTab === item.id && viewMode === "path"
            const showBadge = (item as any).badge
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
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.2rem",
                  background: "transparent",
                  border: "none",
                  color: active ? "var(--cyan)" : "rgba(240, 238, 255, 0.6)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: active ? 800 : 500,
                  fontSize: "0.65rem",
                  cursor: "pointer",
                  flex: 1,
                  height: "100%",
                  position: "relative"
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                <span>{item.label}</span>
                {showBadge && (
                  <div style={{
                    position: "absolute", top: "4px", right: "24%",
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#ff1744", boxShadow: "0 0 6px #ff1744"
                  }} />
                )}
              </button>
            )
          })}
          <Link href="/daily-challenge" style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.2rem", flex: 1, height: "100%" }} onClick={sfxClick}>
            <span style={{ fontSize: "1.2rem" }}>🧠</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.65rem", color: "rgba(240, 238, 255, 0.6)" }}>Practice</span>
          </Link>
        </div>
      )}

      {/* ── Guidebook Detail Modal Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {activeGuidebookUnit !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
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
          </motion.div>
        </motion.div>
      )}
      {/* ── Active Transmission Playback Modal Overlay ─────────────────────── */}
      <AnimatePresence>
        {activeTransmission !== null && (
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
              // Clear any running interval
              const interval = (activeTransmission as any)._interval
              if (interval) clearInterval(interval)
              setActiveTransmission(null)
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
                border: `1.5px solid ${activeTransmission.color}35`,
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: `0 20px 48px rgba(0, 0, 0, 0.7), 0 0 30px ${activeTransmission.color}15`,
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
                <span>📻 RADIO CHATTER CH. {activeTransmission.freq} kHz</span>
                <span style={{ color: isPlayingLog ? "#00d4f0" : "inherit" }}>
                  {isPlayingLog ? "● LIVE INCOMING" : "■ CONNECTION STANDBY"}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  const interval = (activeTransmission as any)._interval
                  if (interval) clearInterval(interval)
                  setActiveTransmission(null)
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
                  border: `3px solid ${activeTransmission.color}`,
                  background: `url(${activeTransmission.avatar}) bottom center / cover no-repeat`,
                  boxShadow: `0 0 24px ${activeTransmission.color}25`
                }}
                className={isPlayingLog ? "char-talk" : "char-breathe"}
                />
                
                {isPlayingLog && (
                  <div style={{
                    position: "absolute", bottom: "-3px", right: "-3px",
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "#08060f", border: `1.5px solid ${activeTransmission.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", animation: "side-nav-pulse 1.2s infinite"
                  }}>
                    🔊
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", margin: "0.8rem 0 0.15rem" }}>
                {activeTransmission.sender}
              </h3>
              <div style={{
                fontSize: "0.68rem", fontWeight: 700, color: activeTransmission.color,
                textTransform: "uppercase", letterSpacing: "0.10em", marginBottom: "1.5rem"
              }}>
                {activeTransmission.subject}
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
                
                {isPlayingLog && typedLogText.length < activeTransmission.content.length && (
                  <span style={{
                    display: "inline-block", width: "8px", height: "14px",
                    background: activeTransmission.color, marginLeft: "3px",
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
                        background: activeTransmission.color,
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
                    const interval = (activeTransmission as any)._interval
                    if (interval) clearInterval(interval)
                    setIsPlayingLog(false)
                    setTypedLogText("")
                    return
                  }
                  
                  // Play tuning chimes
                  playSynthBeep(activeTransmission.freq, "sawtooth", 0.02, 0.15)
                  setTimeout(() => playSynthBeep(activeTransmission.freq * 1.5, "sine", 0.02, 0.3), 150)
                  
                  setIsPlayingLog(true)
                  setTypedLogText("")
                  
                  // Start typing text interval
                  let idx = 0
                  const text = activeTransmission.content
                  const interval = setInterval(() => {
                    idx++
                    setTypedLogText(text.slice(0, idx))
                    if (idx >= text.length) {
                      clearInterval(interval)
                      // Play end click
                      playSynthBeep(220, "triangle", 0.03, 0.1)
                    }
                  }, 25)
                  
                  ;(activeTransmission as any)._interval = interval
                }}
                style={{
                  width: "100%",
                  background: isPlayingLog ? "rgba(255, 255, 255, 0.05)" : activeTransmission.color,
                  color: isPlayingLog ? "rgba(255, 255, 255, 0.7)" : "#08060f",
                  border: isPlayingLog ? `1px solid ${activeTransmission.color}44` : "none",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  boxShadow: isPlayingLog ? "none" : `0 0 20px ${activeTransmission.color}25`,
                  transition: "all 0.12s"
                }}
              >
                {isPlayingLog ? "⏹ Stop Transmission" : "▶ Play Audio Log"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>

    </div>
  )
}
