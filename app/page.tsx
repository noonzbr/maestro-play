"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"
import FloatingNotes from "@/components/game/FloatingNotes"
import { playVoiceBlip } from "@/components/game/NovelScene"

/* ── Custom Handcrafted SVG Icons for Landing Page ── */
const SVGXpBolt = ({ size = 20, color = "#ffd740" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={`url(#bolt-grad-${color.replace('#','')})`} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id={`bolt-grad-${color.replace('#','')}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.4"/>
        <stop offset="100%" stopColor={color} stopOpacity="1"/>
      </linearGradient>
    </defs>
  </svg>
)

const SVGFlame = ({ size = 20, color = "#ff6d00" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" fill={`url(#flame-grad-${color.replace('#','')})`} stroke={color} strokeWidth="1.5"/>
    <path d="M15 11a3 3 0 11-6 0c0-1.657 1-3 3-5 2 2 3 3.343 3 5z" fill="#fff" fillOpacity="0.5"/>
    <defs>
      <linearGradient id={`flame-grad-${color.replace('#','')}`} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffd740" />
        <stop offset="100%" stopColor={color} />
      </linearGradient>
    </defs>
  </svg>
)

const SVGStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffd740" stroke="#ffd740" strokeWidth="1" style={{ display: "inline-block" }}>
    <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
  </svg>
)

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0,
      background: "radial-gradient(ellipse at 50% 50%, rgba(123,47,190,0.18) 0%, transparent 65%)",
      borderRadius: "18px",
    }} aria-hidden="true" />
  ),
})

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.08 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

async function startCheckout(slug: string) {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else console.error("Checkout error:", data)
  } catch (e) {
    console.error("Checkout fetch failed:", e)
  }
}

// Sound blips for simulator
const playSynthTone = (freq: number, duration: number, type: OscillatorType = "sine", vol = 0.1) => {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(vol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

const playMockClick = () => playSynthTone(600, 0.1, "triangle", 0.04)
const playMockHover = () => playSynthTone(880, 0.04, "sine", 0.01)
const playMockSuccess = () => {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    const t = ctx.currentTime
    const tone = (f: number, start: number, dur: number, v: number) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.frequency.setValueAtTime(f, start)
      g.gain.setValueAtTime(v, start)
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
      osc.connect(g); g.connect(ctx.destination)
      osc.start(start); osc.stop(start + dur)
    }
    tone(261.63, t, 0.4, 0.08)
    tone(329.63, t + 0.08, 0.4, 0.08)
    tone(392.0, t + 0.16, 0.4, 0.08)
    tone(523.25, t + 0.24, 0.5, 0.12)
  } catch {}
}
const playMockWrong = () => {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    const t = ctx.currentTime
    const tone = (f: number, start: number, dur: number, v: number, type: OscillatorType) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(f, start)
      g.gain.setValueAtTime(v, start)
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
      osc.connect(g); g.connect(ctx.destination)
      osc.start(start); osc.stop(start + dur)
    }
    tone(246.94, t, 0.35, 0.06, "sawtooth")
    tone(349.23, t, 0.35, 0.06, "sawtooth")
  } catch {}
}

const playSonicPromptingFeedback = (
  specific: number,
  exclude: number,
  format: number,
  why: number,
  overall: number
) => {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const t = ctx.currentTime

    const playNote = (options: {
      freq: number
      type?: OscillatorType
      start: number
      duration: number
      volume: number
      detune?: number
      filterFreq?: number
    }) => {
      const { freq, type = "sine", start, duration, volume, detune = 0, filterFreq } = options
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, start)
      if (detune) {
        osc.detune.setValueAtTime(detune, start)
      }

      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.linearRampToValueAtTime(volume, start + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

      if (filterFreq) {
        const filter = ctx.createBiquadFilter()
        filter.type = "lowpass"
        filter.frequency.setValueAtTime(filterFreq, start)
        osc.connect(filter)
        filter.connect(gain)
      } else {
        osc.connect(gain)
      }

      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + duration)
    }

    const playNoise = (start: number, duration: number, volume: number) => {
      const bufferSize = ctx.sampleRate * duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noiseNode = ctx.createBufferSource()
      noiseNode.buffer = buffer
      const gain = ctx.createGain()
      
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.linearRampToValueAtTime(volume, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.setValueAtTime(1000, start)
      
      noiseNode.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noiseNode.start(start)
      noiseNode.stop(start + duration)
    }

    const bassVol = 0.12
    if (specific >= 70) {
      playNote({ freq: 130.81, type: "sine", start: t, duration: 0.8, volume: bassVol })
      playNote({ freq: 261.63, type: "sine", start: t, duration: 0.8, volume: bassVol * 0.3 })
    } else {
      playNote({ freq: 98.0, type: "sawtooth", start: t, duration: 0.6, volume: bassVol * 0.8, filterFreq: 300 })
    }

    const chimeVol = 0.08
    if (exclude >= 70) {
      playNote({ freq: 392.00, type: "sine", start: t + 0.3, duration: 0.6, volume: chimeVol })
      playNote({ freq: 587.33, type: "sine", start: t + 0.35, duration: 0.5, volume: chimeVol * 0.5 })
    } else {
      playNote({ freq: 370.00, type: "triangle", start: t + 0.3, duration: 0.5, volume: chimeVol })
      const noiseVol = Math.max(0.01, 0.06 * (1 - exclude / 100))
      playNoise(t + 0.3, 0.5, noiseVol)
    }

    const arpeggioVol = 0.08
    if (format >= 70) {
      playNote({ freq: 523.25, type: "sine", start: t + 0.6, duration: 0.4, volume: arpeggioVol })
      playNote({ freq: 659.25, type: "sine", start: t + 0.7, duration: 0.4, volume: arpeggioVol })
      playNote({ freq: 783.99, type: "sine", start: t + 0.8, duration: 0.5, volume: arpeggioVol })
    } else {
      playNote({ freq: 554.37, type: "sawtooth", start: t + 0.6, duration: 0.4, volume: arpeggioVol * 0.6, filterFreq: 1200 })
    }

    const padVol = 0.07
    if (why >= 70) {
      playNote({ freq: 261.63, type: "triangle", start: t + 0.9, duration: 1.2, volume: padVol })
      playNote({ freq: 329.63, type: "sine", start: t + 1.0, duration: 1.2, volume: padVol })
      playNote({ freq: 392.00, type: "sine", start: t + 1.1, duration: 1.2, volume: padVol })
    } else {
      playNote({ freq: 220.00, type: "sawtooth", start: t + 0.9, duration: 0.8, volume: padVol * 0.5, filterFreq: 400 })
      playNote({ freq: 277.18, type: "triangle", start: t + 1.0, duration: 0.8, volume: padVol * 0.5, filterFreq: 400 })
    }

    if (overall >= 75) {
      const fanfareT = t + 1.3
      playNote({ freq: 523.25, type: "sine", start: fanfareT, duration: 0.8, volume: 0.1 })
      playNote({ freq: 659.25, type: "sine", start: fanfareT + 0.1, duration: 0.8, volume: 0.1 })
      playNote({ freq: 783.99, type: "sine", start: fanfareT + 0.2, duration: 0.8, volume: 0.1 })
      playNote({ freq: 1046.50, type: "sine", start: fanfareT + 0.35, duration: 1.0, volume: 0.12 })
    } else {
      const failureT = t + 1.3
      playNote({ freq: 261.63, type: "sawtooth", start: failureT, duration: 0.8, volume: 0.08, filterFreq: 600 })
      playNote({ freq: 277.18, type: "sawtooth", start: failureT, duration: 0.8, volume: 0.08, filterFreq: 600 })
      playNote({ freq: 369.99, type: "sawtooth", start: failureT, duration: 0.8, volume: 0.08, filterFreq: 600 })
    }
  } catch (err) {
    console.error("Sonic prompting audio error:", err)
  }
}

const AudioWaveformVisualizer = ({ active, harmonic }: { active: boolean; harmonic: boolean }) => {
  const barCount = 18
  return (
    <div style={{ display: "flex", gap: "3px", height: "45px", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.5rem", border: "1px solid rgba(255,255,255,0.04)" }}>
      {Array.from({ length: barCount }).map((_, i) => {
        const delay = i * 0.06
        const color = harmonic 
          ? `hsla(${180 + (i * 8)}, 100%, 65%, 0.8)`
          : `hsla(${330 + (i * 2)}, 90%, 60%, 0.8)`
        return (
          <motion.div
            key={i}
            animate={active ? {
              height: ["20%", "95%", "20%"],
              backgroundColor: color,
            } : {
              height: "20%",
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: harmonic ? 0.8 + (i % 3) * 0.2 : 0.4 + (i % 2) * 0.15,
              delay: delay,
              ease: "easeInOut"
            }}
            style={{
              width: "4px",
              borderRadius: "2px",
              height: "20%",
            }}
          />
        )
      })}
    </div>
  )
}


type MockCharacter = "jake" | "zoe" | "carlos" | "vega"
type CharacterScenario = {
  characterName: string
  avatar: string
  bg: string
  color: string
  dialogueInit: string
  optionA: string
  optionB: string
  dialogueA: string
  dialogueB: string
  speakerA: string
  speakerB: string
  avatarA: string
  avatarB: string
  colorA: string
  colorB: string
  xpA: number
  hpA: number
  xpB: number
  hpB: number
}

const CHARACTER_SCENARIOS: Record<MockCharacter, CharacterScenario> = {
  jake: {
    characterName: "Jake",
    avatar: "/images/guitarplayer1.png",
    bg: "/images/bg-bedroom.png",
    color: "var(--cyan)",
    dialogueInit: "Look, Tyler. Making music with AI isn't about letting the machine do everything. It's about being the Conductor. You shape the key, tempo, and soul. Watch this...",
    optionA: "🎸 Conductor Prompt: Define strict key, tempo, & rules",
    optionB: "🤖 Shortcut Prompt: Ask AI 'write me a hit pop song' instantly",
    dialogueA: "Incredible, Jake! That is the Conductor's Mindset. By specifying constraints and rules, you kept the melody authentic. +100 XP!",
    dialogueB: "Ugh, it came back in 8 seconds but sounds so cliché. 'Chasing dreams under neon lights'... Señora Vega is definitely going to fail us.",
    speakerA: "SEÑORA VEGA",
    speakerB: "TYLER",
    avatarA: "/images/senoravega.png",
    avatarB: "/images/tyler.png",
    colorA: "var(--purple)",
    colorB: "var(--pink)",
    xpA: 1300, hpA: 5,
    xpB: 1200, hpB: 4,
  },
  zoe: {
    characterName: "Zoe",
    avatar: "/images/zoe.png",
    bg: "/images/bg-practiceroom.png",
    color: "var(--purple)",
    dialogueInit: "Our tour bookings are a mess! I need to write an email automation script to send to venue managers. Should I tell Claude the exact email parameters or just ask for a script?",
    optionA: "🥁 Conductor Prompt: Configure tour dates, variables, & exclusions",
    optionB: "🤖 Shortcut Prompt: Ask Claude 'write email script' instantly",
    dialogueA: "Awesome! Claude generated a clean JSON automation that matches our exact calendar block. It worked perfectly! +100 XP!",
    dialogueB: "Oh no! The script had hardcoded placeholder variables. It sent out three duplicates to the same venue. The manager is furious!",
    speakerA: "ZOE",
    speakerB: "ZOE",
    avatarA: "/images/zoe.png",
    avatarB: "/images/zoe.png",
    colorA: "var(--purple)",
    colorB: "var(--purple)",
    xpA: 1300, hpA: 5,
    xpB: 1200, hpB: 4,
  },
  carlos: {
    characterName: "Carlos",
    avatar: "/images/carlos.png",
    bg: "/images/bg-bandpractice.png",
    color: "#ffd740",
    dialogueInit: "I want to blend classic jazz chord progressions with modern hip-hop synths. I'll test ChatGPT against Gemini to see who has the best voicing.",
    optionA: "🎹 Conductor Prompt: Compare chord structures with music theory rules",
    optionB: "🤖 Shortcut Prompt: Ask both models for 'a cool jazz progression'",
    dialogueA: "Nice! ChatGPT gave clean extensions, while Gemini caught the rootless voicings. Let's blend them! +100 XP!",
    dialogueB: "Meh, they both just gave me the standard ii-V-I progression. It sounds so generic, no soul in it...",
    speakerA: "CARLOS",
    speakerB: "CARLOS",
    avatarA: "/images/carlos.png",
    avatarB: "/images/carlos.png",
    colorA: "#ffd740",
    colorB: "#ffd740",
    xpA: 1300, hpA: 5,
    xpB: 1200, hpB: 4,
  },
  vega: {
    characterName: "Sra. Vega",
    avatar: "/images/senoravega.png",
    bg: "/images/bg-musicclass.png",
    color: "var(--pink)",
    dialogueInit: "Welcome to the Conductor's Exam. To pass, you must demonstrate prompt discipline. If you want a report, how do you specify the constraints?",
    optionA: "📝 Codex Prompt: Define exact scope, format, and forbidden words",
    optionB: "🤖 Shortcut Prompt: Ask for 'a detailed report' and edit later",
    dialogueA: "Excellent! A true conductor establishes strict boundaries. You have passed the final exam! +200 XP!",
    dialogueB: "Unacceptable. You are letting the AI write sloppy prose. That is a fail on this round.",
    speakerA: "SEÑORA VEGA",
    speakerB: "SEÑORA VEGA",
    avatarA: "/images/senoravega.png",
    avatarB: "/images/senoravega.png",
    colorA: "var(--pink)",
    colorB: "var(--pink)",
    xpA: 1400, hpA: 5,
    xpB: 1200, hpB: 3,
  }
}

export default function HomePage() {
  useReveal()
  const [checkingOut, setCheckingOut] = useState<string | null>(null)
  const [hasProgress, setHasProgress] = useState(false)

  // Tab systems: Vn vs Dashboard
  const [activeTab, setActiveTab] = useState<"vn" | "dashboard" | "sandbox">("vn")

  // Interactive Simulator Mockup state
  const [activeChar, setActiveChar] = useState<MockCharacter>("jake")
  const [vnState, setVnState] = useState<"init" | "choiceA" | "choiceB">("init")
  const [vnText, setVnText] = useState("")
  const [targetText, setTargetText] = useState("")
  const [vnSpeaker, setVnSpeaker] = useState("")
  const [vnSpeakerColor, setVnSpeakerColor] = useState("var(--cyan)")
  const [vnSpeakerImage, setVnSpeakerImage] = useState("")
  const [vnXp, setVnXp] = useState(1200)
  const [vnHp, setVnHp] = useState(5)

  // Sandbox testing
  const [sandboxPrompt, setSandboxPrompt] = useState("")
  const [gradingState, setGradingState] = useState<"idle" | "grading" | "graded">("idle")
  const [sandboxScores, setSandboxScores] = useState({ specific: 0, exclude: 0, format: 0, why: 0 })
  const [conductorScore, setConductorScore] = useState(0)
  const [sonicPromptingEnabled, setSonicPromptingEnabled] = useState(true)
  const [isAudioVisualActive, setIsAudioVisualActive] = useState(false)
  const [isAudioHarmonic, setIsAudioHarmonic] = useState(true)

  // Roadmap active phase tab
  const [activePhase, setActivePhase] = useState<number>(3)

  // Sync simulator values when character tab changes
  useEffect(() => {
    const sc = CHARACTER_SCENARIOS[activeChar]
    setVnState("init")
    setVnText("")
    setTargetText(sc.dialogueInit)
    setVnSpeaker(sc.characterName.toUpperCase())
    setVnSpeakerColor(sc.color)
    setVnSpeakerImage(sc.avatar)
    setVnXp(1200)
    setVnHp(5)
  }, [activeChar])

  // Typewriter effect simulator
  useEffect(() => {
    if (!targetText) {
      setVnText("")
      return
    }
    let isCancelled = false
    let currentText = ""
    let index = 0
    setVnText("")

    const interval = setInterval(() => {
      if (isCancelled) {
        clearInterval(interval)
        return
      }
      if (index >= targetText.length) {
        clearInterval(interval)
        return
      }
      const nextChar = targetText[index]
      currentText += nextChar
      setVnText(currentText)

      if (nextChar && nextChar.trim() !== "") {
        playVoiceBlip(vnSpeaker || activeChar, nextChar)
      }
      index++
    }, 20)

    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [targetText, vnSpeaker, activeChar])

  useEffect(() => {
    try {
      const totalXp = parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0
      const game1Xp = parseInt(localStorage.getItem("maestro_game_1_xp") ?? "0") || 0
      const game1v2Xp = parseInt(localStorage.getItem("maestro_game_13_xp") ?? "0") || 0
      if (totalXp > 0 || game1Xp > 0 || game1v2Xp > 0) {
        setHasProgress(true)
      }
    } catch {}
  }, [])

  const handlePurchase = useCallback(async (slug: string) => {
    setCheckingOut(slug)
    await startCheckout(slug)
    setCheckingOut(null)
  }, [])

  const handleMockChoice = (choice: "choiceA" | "choiceB") => {
    const sc = CHARACTER_SCENARIOS[activeChar]
    if (choice === "choiceA") {
      setVnState("choiceA")
      setVnSpeaker(sc.speakerA)
      setVnSpeakerColor(sc.colorA)
      setVnSpeakerImage(sc.avatarA)
      setVnText("")
      setTargetText(sc.dialogueA)
      setVnXp(sc.xpA)
      setVnHp(sc.hpA)
      playMockSuccess()
    } else {
      setVnState("choiceB")
      setVnSpeaker(sc.speakerB)
      setVnSpeakerColor(sc.colorB)
      setVnSpeakerImage(sc.avatarB)
      setVnText("")
      setTargetText(sc.dialogueB)
      setVnXp(sc.xpB)
      setVnHp(sc.hpB)
      playMockWrong()
    }
  }

  const handleResetMock = () => {
    playMockClick()
    const sc = CHARACTER_SCENARIOS[activeChar]
    setVnState("init")
    setVnText("")
    setTargetText(sc.dialogueInit)
    setVnSpeaker(sc.characterName.toUpperCase())
    setVnSpeakerColor(sc.color)
    setVnSpeakerImage(sc.avatar)
    setVnXp(1200)
    setVnHp(5)
    setGradingState("idle")
    setIsAudioVisualActive(false)
  }

  const handleCharTabChange = (char: MockCharacter) => {
    playMockClick()
    setActiveChar(char)
  }

  // Grader Sandbox simulation
  const handleSandboxGrade = () => {
    if (!sandboxPrompt.trim()) return
    playMockClick()
    setGradingState("grading")
    setIsAudioVisualActive(true)
    setIsAudioHarmonic(true)
    
    setTimeout(() => {
      const lower = sandboxPrompt.toLowerCase()
      // Rule-based score calculation
      let specific = 15 + (lower.length > 50 ? 15 : 0) + (lower.includes("genre") || lower.includes("style") ? 15 : 0)
      let exclude = 20 + (lower.includes("not") || lower.includes("no") || lower.includes("avoid") ? 20 : 0)
      let format = 15 + (lower.includes("structure") || lower.includes("rhyme") || lower.includes("format") ? 25 : 0)
      let why = 10 + (lower.includes("story") || lower.includes("context") || lower.includes("meaning") ? 25 : 0)
      
      specific = Math.min(100, specific)
      exclude = Math.min(100, exclude)
      format = Math.min(100, format)
      why = Math.min(100, why)

      const overall = Math.round((specific + exclude + format + why) / 4)
      setSandboxScores({ specific, exclude, format, why })
      setConductorScore(overall)
      setGradingState("graded")
      
      const pass = overall >= 75
      setIsAudioHarmonic(pass)
      
      if (sonicPromptingEnabled) {
        setIsAudioVisualActive(true)
        playSonicPromptingFeedback(specific, exclude, format, why, overall)
        setTimeout(() => {
          setIsAudioVisualActive(false)
        }, 2800)
      } else {
        setIsAudioVisualActive(false)
        if (pass) {
          playMockSuccess()
        } else {
          playMockWrong()
        }
      }
    }, 1200)
  }

  return (
    <>
      <Nav />
      <main id="main-content" style={{ background: "var(--bg-primary)", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════════════════════════════════
            HERO SECTION — Premium Dark Mode, Dynamic Gradients, Interactive Showcase
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#06040a" }}>

          {/* Glowing Ambient Mesh Orbs */}
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div className="hero-orb-purple" style={{ opacity: 0.22 }} />
            <div className="hero-orb-cyan" style={{ opacity: 0.16 }} />
            <div className="hero-orb-pink" style={{ opacity: 0.12 }} />
          </div>

          <HeroScene />
          <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none", overflow: "hidden" }}>
            <FloatingNotes mood="normal" />
          </div>

          {/* Dark Veil */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(6,4,10,0.95) 0%, rgba(8,6,14,0.8) 50%, rgba(6,4,10,0.93) 100%)", pointerEvents: "none", zIndex: 6 }} />

          <div className="hero-grid-2col" style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "7.5rem 2rem 5rem", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "3.5rem", alignItems: "center" }}>
            
            {/* LEFT — Product Pitch */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem", marginBottom: "1.75rem" }}>
                <div style={{ width: "24px", height: "2px", background: "var(--cyan)", borderRadius: "2px" }} />
                <span className="label-caps" style={{ color: "var(--cyan)", letterSpacing: "0.18em", fontSize: "0.75rem", fontWeight: 700 }}>
                  A Cinematic Visual Novel RPG for Professionals
                </span>
              </div>

              <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4.4rem)", color: "#fff", lineHeight: 0.98, letterSpacing: "-0.04em", marginBottom: "0.6rem" }}>
                Stop Staring at<br />a Blank Box.
              </h1>

              <h2
                style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.6rem)", background: "linear-gradient(90deg, #00d4f0 0%, #a855f7 50%, #e040fb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.2, marginBottom: "1.75rem" }}
              >
                Tired of getting generic, robotic cliches and hallucinated fluff from AI? It&apos;s time to conduct.
              </h2>

              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.02rem", color: "rgba(240,238,255,0.8)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "520px" }}>
                By default, LLMs print average, uninspired answers. When you ask them to write code, design campaigns, or draft contracts, they fall back on template responses. Step into a playable cinematic visual novel where you face real crises and master the precise constraints, negative exclusions, and model boundaries needed to force Claude, ChatGPT, and Gemini to output exceptional work.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {hasProgress ? (
                    <Link href="/worldmap"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "1.1rem 2.5rem", borderRadius: "100px", textDecoration: "none", boxShadow: "0 0 32px rgba(0,212,240,0.35), 0 4px 20px rgba(0,0,0,0.4)" }}>
                      Resume Story Map →
                    </Link>
                  ) : (
                    <Link href="/games/welcome-to-ai-v2"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "1.1rem 2.5rem", borderRadius: "100px", textDecoration: "none", boxShadow: "0 0 32px rgba(0,212,240,0.35), 0 4px 20px rgba(0,0,0,0.4)" }}>
                      Play Chapter 1 — Free →
                    </Link>
                  )}
                </motion.div>
                <Link href="#store" style={{ display: "inline-flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "1.1rem 2.25rem", borderRadius: "100px", textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}>
                  View Pricing Plans
                </Link>
              </div>
            </div>

            {/* RIGHT — Interactive Showcase Panel */}
            <div className="hero-right-col" style={{ position: "relative", display: "flex", flexDirection: "column", justifySelf: "center", width: "100%", maxWidth: "540px" }}>
              
              {/* Tab selector */}
              <div style={{
                display: "flex", background: "rgba(10, 8, 20, 0.9)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px 14px 0 0", padding: "0.35rem", gap: "0.25rem", width: "fit-content",
                borderBottom: "none", zIndex: 12, position: "relative", top: "1px"
              }}>
                {[
                  { id: "vn", label: "💬 VN Demo" },
                  { id: "sandbox", label: "💻 Grader Sandbox" },
                  { id: "dashboard", label: "📊 FSRS Mastery" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { playMockClick(); setActiveTab(t.id as any) }}
                    style={{
                      background: activeTab === t.id ? "rgba(255,255,255,0.08)" : "transparent",
                      border: "none", borderRadius: "9px", padding: "0.4rem 0.9rem",
                      color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.5)",
                      fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 700,
                      cursor: "pointer", transition: "all 0.2s ease"
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Glass container */}
              <motion.div 
                layout
                style={{
                  borderRadius: "0 24px 24px 24px",
                  padding: "4px",
                  background: `linear-gradient(135deg, rgba(0,212,240,0.18) 0%, rgba(123,47,190,0.18) 50%, rgba(224,64,251,0.2) 100%)`,
                  boxShadow: "0 25px 60px rgba(0,0,0,0.65)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden"
                }}
              >
                {/* 1. VISUAL NOVEL MOCKUP */}
                {activeTab === "vn" && (
                  <div style={{ borderRadius: "20px", overflow: "hidden", position: "relative", height: "420px", background: "#05040a" }}>
                    
                    {/* Character selector inside VN tab */}
                    <div style={{ position: "absolute", top: "45px", left: "12px", zIndex: 20, display: "flex", gap: "0.22rem", background: "rgba(0,0,0,0.4)", padding: "0.22rem", borderRadius: "8px" }}>
                      {(["jake", "zoe", "carlos", "vega"] as MockCharacter[]).map(tab => (
                        <button
                          key={tab}
                          onClick={() => handleCharTabChange(tab)}
                          style={{
                            background: activeChar === tab ? CHARACTER_SCENARIOS[tab].color : "transparent",
                            color: activeChar === tab ? "#000" : "#fff",
                            border: "none", borderRadius: "5px", padding: "0.2rem 0.55rem",
                            fontSize: "0.6rem", fontWeight: 800, cursor: "pointer", textTransform: "uppercase"
                          }}
                        >
                          {CHARACTER_SCENARIOS[tab].characterName}
                        </button>
                      ))}
                    </div>

                    {/* HUD Top Bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "36px",
                      background: "rgba(6, 4, 12, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)",
                      zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0 1rem", fontFamily: "Inter, sans-serif", fontSize: "0.68rem", fontWeight: 700,
                      letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: vnSpeakerColor }}>
                        <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: vnSpeakerColor, boxShadow: `0 0 10px ${vnSpeakerColor}` }}></span>
                        <span>RPG INTERACTIVE SIMULATOR</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
                        <span style={{ color: "#ffd740" }}><SVGXpBolt size={12} color="#ffd740" /> {vnXp} XP</span>
                        <span style={{ color: "#ff4b6e" }}>{Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} style={{ opacity: i < vnHp ? 1 : 0.28, marginRight: "1px" }}>💚</span>
                        ))}</span>
                      </div>
                    </div>

                    {/* Scene Background */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${CHARACTER_SCENARIOS[activeChar].bg})`, backgroundSize: "cover", backgroundPosition: "center center", zIndex: 1 }} />

                    {/* Character Sprite */}
                    <AnimatePresence mode="wait">
                      {vnSpeakerImage && (
                        <motion.img
                          key={vnSpeakerImage}
                          src={vnSpeakerImage}
                          alt={vnSpeaker}
                          initial={{ opacity: 0, x: -15, scale: 0.97 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 15, scale: 0.97 }}
                          style={{
                            position: "absolute", bottom: "112px", left: "6%",
                            height: "64%", width: "38%", objectFit: "contain",
                            objectPosition: "bottom center", zIndex: 5,
                            filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.5))"
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Choice Boxes */}
                    {vnState === "init" && (
                      <div style={{
                        position: "absolute", top: "24%", right: "6%", left: "46%",
                        zIndex: 12, display: "flex", flexDirection: "column", gap: "0.5rem"
                      }}>
                        <button
                          onClick={() => handleMockChoice("choiceA")}
                          style={{
                            background: "rgba(6, 4, 14, 0.93)", border: `1.5px solid ${vnSpeakerColor}77`,
                            borderRadius: "10px", padding: "0.55rem 0.75rem", color: "#fff",
                            fontFamily: "Inter, sans-serif", fontSize: "0.7rem", fontWeight: 700,
                            textAlign: "left", cursor: "pointer", transition: "all 0.2s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = vnSpeakerColor}
                          onMouseLeave={e => e.currentTarget.style.borderColor = `${vnSpeakerColor}77`}
                        >
                          <span style={{ color: vnSpeakerColor, display: "block", fontSize: "0.55rem", marginBottom: "0.15rem", fontWeight: 800 }}>OPTION A (CONDUCTOR)</span>
                          {CHARACTER_SCENARIOS[activeChar].optionA}
                        </button>
                        <button
                          onClick={() => handleMockChoice("choiceB")}
                          style={{
                            background: "rgba(6, 4, 14, 0.93)", border: "1.5px solid rgba(255,255,255,0.18)",
                            borderRadius: "10px", padding: "0.55rem 0.75rem", color: "#fff",
                            fontFamily: "Inter, sans-serif", fontSize: "0.7rem", fontWeight: 700,
                            textAlign: "left", cursor: "pointer", transition: "all 0.2s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--pink)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
                        >
                          <span style={{ color: "var(--pink)", display: "block", fontSize: "0.55rem", marginBottom: "0.15rem", fontWeight: 800 }}>OPTION B (SHORTCUT)</span>
                          {CHARACTER_SCENARIOS[activeChar].optionB}
                        </button>
                      </div>
                    )}

                    {vnState !== "init" && (
                      <button
                        onClick={handleResetMock}
                        style={{
                          position: "absolute", top: "45px", right: "12px", zIndex: 12,
                          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: "100px", padding: "0.25rem 0.75rem", color: "#fff",
                          fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 700, cursor: "pointer"
                        }}
                      >
                        ✕ Retry Scenario
                      </button>
                    )}

                    {/* Dialogue Box */}
                    <div style={{
                      position: "absolute", bottom: "10px", left: "10px", right: "10px", height: "104px",
                      background: "rgba(6, 4, 14, 0.94)", border: `1.2px solid ${vnSpeakerColor}66`,
                      borderRadius: "12px", padding: "0.6rem 0.85rem", zIndex: 10,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
                    }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", fontWeight: 900, color: vnSpeakerColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>
                        {vnSpeaker}
                      </div>
                      <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(240,238,255,0.92)", lineHeight: 1.4, margin: 0 }}>
                        &ldquo;{vnText}&rdquo;
                      </p>
                    </div>

                  </div>
                )}

                {/* 2. GRADER SANDBOX */}
                {activeTab === "sandbox" && (
                  <div style={{ borderRadius: "20px", padding: "1.5rem", height: "420px", background: "#0c0a15", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Maestro Grader Module</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <button 
                            onClick={() => { playMockClick(); setSonicPromptingEnabled(!sonicPromptingEnabled); }}
                            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${sonicPromptingEnabled ? "var(--cyan)" : "rgba(255,255,255,0.15)"}`, borderRadius: "6px", padding: "0.18rem 0.4rem", color: sonicPromptingEnabled ? "#fff" : "rgba(255,255,255,0.4)", fontSize: "0.58rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", transition: "all 0.2s" }}
                          >
                            <span>{sonicPromptingEnabled ? "🔊 SYNTH ON" : "🔇 MUTED"}</span>
                          </button>
                          {gradingState === "graded" && (
                            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.75rem", color: conductorScore >= 75 ? "#00e676" : "#ff5252" }}>
                              {conductorScore >= 75 ? "PASS ⚡" : "REJECT ✕"}
                            </span>
                          )}
                        </div>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: "0.8rem" }}>
                        Draft a prompt for Claude to write song lyrics. Combine SPECIFICITY (grunge genre, theme) and CONSTRAINTS (what to avoid, structure):
                      </p>
                      
                      {gradingState === "idle" && (
                        <textarea
                          placeholder="e.g. Write a 90s grunge song about moving away. No clichés. Rhyme ABCB. Include verse-chorus structure..."
                          value={sandboxPrompt}
                          onChange={(e) => {
                            setSandboxPrompt(e.target.value)
                            if (sonicPromptingEnabled) {
                              const charCode = e.target.value.charCodeAt(e.target.value.length - 1) || 65
                              const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]
                              const freq = pentatonic[charCode % pentatonic.length]
                              playSynthTone(freq, 0.08, "sine", 0.012)
                            }
                          }}
                          style={{
                            width: "100%", height: "130px", background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                            padding: "0.6rem 0.8rem", color: "#fff", fontFamily: "monospace",
                            fontSize: "0.8rem", resize: "none", outline: "none"
                          }}
                        />
                      )}

                      {gradingState === "grading" && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "130px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "1rem" }}>
                          <AudioWaveformVisualizer active={isAudioVisualActive} harmonic={isAudioHarmonic} />
                          <span style={{ marginTop: "1rem", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--cyan)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Orchestrating constraints...
                          </span>
                        </div>
                      )}

                      {gradingState === "graded" && (
                        /* Graded Results Visual Grid */
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", background: "rgba(0,0,0,0.3)", padding: "0.8rem", borderRadius: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.2rem" }}>
                            <div style={{ textAlign: "center", flex: 1 }}>
                              <span style={{ display: "block", fontSize: "1.7rem", fontWeight: 900, color: conductorScore >= 75 ? "#00e676" : "#ff5252", lineHeight: 1.1 }}>{conductorScore}%</span>
                              <span style={{ fontSize: "0.55rem", color: "var(--muted)", textTransform: "uppercase" }}>Conductor Score</span>
                            </div>
                            <div style={{ flex: 2.2, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                              <div style={{ fontSize: "0.72rem", color: "rgba(240,238,255,0.85)", lineHeight: 1.4 }}>
                                {conductorScore >= 75 
                                  ? "Incredible constraint configuration! Your prompt forces the model to bypass default clichés. You've earned a mock Certificate!"
                                  : "Your prompt is too short/generic. Add 'not' rules (constraints) and structural parameters (rhyme) to score higher."}
                              </div>
                              <AudioWaveformVisualizer active={isAudioVisualActive} harmonic={isAudioHarmonic} />
                            </div>
                          </div>
                          {[
                            { name: "The What (Specificity)", score: sandboxScores.specific, color: "var(--cyan)" },
                            { name: "The What Not (Constraints)", score: sandboxScores.exclude, color: "var(--purple)" },
                            { name: "The How (Formatting)", score: sandboxScores.format, color: "var(--pink)" },
                            { name: "The Why (Context)", score: sandboxScores.why, color: "#ffd740" }
                          ].map(bar => (
                            <div key={bar.name} style={{ fontSize: "0.65rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.6)", marginBottom: "0.15rem" }}>
                                <span>{bar.name}</span>
                                <span>{bar.score}%</span>
                              </div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${bar.score}%`, background: bar.color, transition: "width 0.8s" }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {gradingState === "idle" && (
                        <button
                          onClick={handleSandboxGrade}
                          disabled={!sandboxPrompt.trim()}
                          style={{
                            width: "100%", background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                            border: "none", borderRadius: "10px", padding: "0.65rem",
                            fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 800,
                            color: "#08060f", cursor: "pointer", opacity: sandboxPrompt.trim() ? 1 : 0.5
                          }}
                        >
                          Grade My Prompt
                        </button>
                      )}
                      {gradingState === "grading" && (
                        <button style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "0.65rem", color: "#fff", cursor: "wait", fontSize: "0.78rem", fontWeight: 800 }}>
                          Synthesizing constraints...
                        </button>
                      )}
                      {gradingState === "graded" && (
                        <>
                          <button onClick={handleResetMock} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "0.65rem", color: "#fff", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}>
                            Try Again
                          </button>
                          {conductorScore >= 75 && (
                            <Link href="/games/welcome-to-ai-v2" style={{ flex: 1.5, background: "linear-gradient(90deg,#00d4f0,#e040fb)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", color: "#08060f", fontSize: "0.75rem", fontWeight: 800, textDecoration: "none" }}>
                              Claim Conductor Pass →
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. FSRS DASHBOARD PREVIEW */}
                {activeTab === "dashboard" && (
                  <div style={{ borderRadius: "20px", padding: "1.4rem", height: "420px", background: "#07050e", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem", color: "var(--cyan)", letterSpacing: "0.2em", textTransform: "uppercase" }}>FSRS Cognitive Model (Active Profile)</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", color: "#00e676", background: "rgba(0,230,118,0.12)", padding: "0.15rem 0.5rem", borderRadius: "100px" }}>STABILITY SYNCED</span>
                      </div>
                      
                      {/* Dashboard mock layout */}
                      <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1.2rem" }}>
                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(0,212,240,0.12)", border: "1.5px solid var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>👨‍✈️</div>
                        <div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.8rem", color: "#fff", lineHeight: 1.1 }}>Conductor Apprentice</div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.63rem", color: "rgba(255,255,255,0.4)", marginTop: "0.15rem" }}>Rank: level 2 · 1,350 XP · 3/3 Hearts</div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
                        {[
                          { title: "Prompt Specificity", mastery: "88%", state: "Mastered 🎼" },
                          { title: "Negative Exclusions", mastery: "74%", state: "Review Summons 🔔" },
                          { title: "Model Orchestration", mastery: "92%", state: "Mastered ⚡" },
                          { title: "Stakes Configuration", mastery: "60%", state: "Stability Decay ⚠️" }
                        ].map((m, idx) => (
                          <div key={m.title} style={{ padding: "0.6rem 0.8rem", background: "rgba(0,0,0,0.3)", borderRadius: "10px", borderLeft: `2.5px solid ${idx % 2 === 0 ? "var(--cyan)" : idx === 3 ? "var(--pink)" : "#ffd740"}` }}>
                            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.15rem" }}>{m.title}</div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                              <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>{m.mastery}</span>
                              <span style={{ fontSize: "0.55rem", color: idx === 3 ? "var(--pink)" : "rgba(255,255,255,0.4)" }}>{m.state}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>FSRS schedules daily reviews to lock in learning.</span>
                      <Link href="/worldmap" style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--cyan)", textDecoration: "none" }}>Open Dashboard →</Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

          </div>

          {/* Bottom indicator */}
          <div aria-hidden="true" style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", animation: "pulse-glow 2.5s ease-in-out infinite" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,238,255,0.4)" }}>Scroll to Explore</span>
            <div style={{ width: "1px", height: "30px", background: "linear-gradient(180deg, rgba(0,212,240,0.5), transparent)" }} />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            TICKER MARQUEE
        ══════════════════════════════════════════════════════════════════════ */}
        <div aria-hidden="true" style={{ background: "#0c0816", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "0.85rem 0", overflow: "hidden" }}>
          <div style={{ display: "flex", width: "max-content" }} className="animate-ticker">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", whiteSpace: "nowrap" }}>
                {["Prompt Engineering","AI Orchestration","Socratic Companion","No Code Required","The What","The What Not","The How","The Why","Spaced Repetition","FSRS Mastery","Stripe checkout","14 visual novel levels"].map((item, i) => (
                  <span key={i} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,238,255,0.45)", padding: "0 2rem" }}>
                    {item} <span style={{ color: "var(--cyan)", margin: "0 0.5rem" }}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            PRODUCT PREVIEW SHOWCASE — generated high-quality images embed
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "rgba(8,6,15,0.2)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4.5rem", alignItems: "center" }}>
              <div className="reveal">
                <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>The Death of the Cliché</div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                  If You Let the AI Guess, It Will Guess Wrong.
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.8)", lineHeight: 1.8, marginBottom: "1rem" }}>
                  Most prompt guides teach you to copy-paste. We show you what happens when your prompts fail in production. When the model generates generic boilerplates, your studio crew faces actual, immediate narrative consequences.
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>
                  Through interactive branching storylines and prompt evaluations, you'll learn the psychology of LLMs: how they react to structural parameters, when they slip back into robotic jargon, and how to build iron-clad negative constraints that force original, high-fidelity outputs.
                </p>
              </div>

              <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
                <div style={{
                  position: "relative", width: "100%", maxWidth: "440px",
                  borderRadius: "20px", background: "linear-gradient(135deg, var(--cyan) 0%, var(--purple) 100%)",
                  padding: "2px", boxShadow: "0 20px 50px rgba(0,212,240,0.18)"
                }}>
                  <div style={{ borderRadius: "18px", overflow: "hidden", background: "#05040a" }}>
                    <img
                      src="/images/maestro_play_mockup.png"
                      alt="Maestro Play Visual Novel Gameplay"
                      style={{ width: "100%", display: "block", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            CODA COMPANION — visual illustrations
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "rgba(8,6,15,0.45)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4.5rem", alignItems: "center" }}>
              <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
                <div style={{
                  position: "relative", width: "100%", maxWidth: "420px",
                  borderRadius: "20px", background: "linear-gradient(135deg, var(--pink) 0%, var(--purple) 100%)",
                  padding: "2px", boxShadow: "0 20px 50px rgba(224,64,251,0.18)"
                }}>
                  <div style={{ borderRadius: "18px", overflow: "hidden", background: "#05040a" }}>
                    <img
                      src="/images/maestro_orchestra_desk.png"
                      alt="AI Orchestration desk illustration"
                      style={{ width: "100%", display: "block", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>

              <div className="reveal">
                <div className="label-caps" style={{ color: "var(--pink)", marginBottom: "0.75rem" }}>Socratic AI Companion</div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1.25rem" }}>
                  Bridge the Alignment Gap
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.8)", lineHeight: 1.8, marginBottom: "1rem" }}>
                  Ever tell ChatGPT &ldquo;don&apos;t use jargon&rdquo; or &ldquo;be concise&rdquo; only for it to completely ignore you? That is a model alignment failure. Writing longer prompts doesn&apos;t fix it—structural boundaries do.
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>
                  Coda, your Socratic AI companion, evaluates your prompts in real-time. Instead of giving you answers, she flags exactly where the model is likely to break your constraints, helpfully highlighting weak boundaries, fuzzy definitions, or missing context. You learn the precise mechanics of prompt instruction that LLMs are physically wired to obey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            MEET THE CAST (Dossier profiles)
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "rgba(8,6,15,0.2)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="label-caps" style={{ color: "var(--purple)", marginBottom: "0.75rem" }}>Character Files</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
                Meet the Conductors
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", maxWidth: "540px", margin: "1rem auto 0", lineHeight: 1.7 }}>
                You aren't reading dry theory. You are playing through their lives, resolving their crises, and mastering their tracks under Felipe Maestro's orchestration.
              </p>
            </div>

            <div className="meet-cast-grid">
              {[
                {
                  name: "Felipe Maestro", role: "Campaign Director", track: "All Tracks",
                  img: "/images/maestroplayer1.png", color: "var(--cyan)",
                  bg: "/images/bg-bandpractice.png",
                  blurb: "The orchestrator connecting all tracks. He monitors your prompt accuracy and challenges you to pass exams.",
                  skill: "Multi-model orchestration, prompt constraints, global evaluations."
                },
                {
                  name: "Jake", role: "17-year-old guitarist", track: "Track A: Prompting Basics",
                  img: "/images/guitarplayer1.png", color: "var(--cyan)",
                  bg: "/images/bg-bedroom.png",
                  blurb: "Perfecting his signature riff while the music world shifts. He learns to conduct AI like a backing band.",
                  skill: "Prompt formatting, output boundaries, the 4-step framework."
                },
                {
                  name: "Zoe", role: "21-year-old drummer", track: "Track B: Claude Ecosystem",
                  img: "/images/zoe.png", color: "var(--purple)",
                  bg: "/images/bg-practiceroom.png",
                  blurb: "Needs to manage booking contracts for her tour. She discovers Claude's structural logic is just like keeping tempo.",
                  skill: "Claude Projects, Artifacts, structured templates, code-free automation."
                },
                {
                  name: "Carlos", role: "Bedroom hip-hop producer", track: "Track C: Prompt Battles",
                  img: "/images/carlos.png", color: "#ffd740",
                  bg: "/images/bg-bandpractice.png",
                  blurb: "Obsessed with creating the perfect mashup. He plays ChatGPT against Gemini in real-time battles.",
                  skill: "Model comparisons, temperature adjusting, creative iteration."
                },
                {
                  name: "Señora Vega", role: "Classical teacher & Mentor", track: "Boss Encounter",
                  img: "/images/senoravega.png", color: "var(--pink)",
                  bg: "/images/bg-musicclass.png",
                  blurb: "Demands strict discipline and authenticity. She rejects generic boilerplate AI outputs instantly.",
                  skill: "Advanced constraints, anti-pattern checks, final exam boss master."
                }
              ].map((c) => (
                <div 
                  key={c.name} className="reveal"
                  style={{
                    background: "rgba(12,8,22,0.85)", border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column",
                    transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)"
                    e.currentTarget.style.borderColor = `${c.color}66`
                    e.currentTarget.style.boxShadow = `0 12px 30px ${c.color}18`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div style={{ 
                    height: "180px", 
                    overflow: "hidden", 
                    position: "relative", 
                    backgroundImage: `url(${c.bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "rgba(12, 8, 22, 0.42)" }} />
                    <img 
                      src={c.img} alt={c.name} 
                      style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center", position: "relative", zIndex: 2 }} 
                    />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(12,8,22,1), transparent)", zIndex: 3 }} />
                  </div>
                  <div style={{ padding: "0.9rem 1.1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", fontWeight: 800, color: c.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>{c.track}</span>
                    <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.05rem", color: "#fff", margin: "0.25rem 0 0.5rem" }}>{c.name}</h3>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>{c.role}</div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.76rem", color: "rgba(240,238,255,0.7)", lineHeight: 1.5, margin: "0 0 1rem" }}>{c.blurb}</p>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.65rem", marginTop: "auto" }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>KEY SKILL:</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#fff", lineHeight: 1.4 }}>{c.skill}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            WORLDMAP PATHWAYS (Linear progression timeline)
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "#05040a", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>The Campaign Map</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
                Explore the Westbrook Districts
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", maxWidth: "520px", margin: "1rem auto 0", lineHeight: 1.7 }}>
                Map your linear narrative journey across five distinct game tracks. Move district by district.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
              <div aria-hidden="true" style={{ position: "absolute", top: "2rem", bottom: "2rem", left: "2.25rem", width: "2px", background: "linear-gradient(180deg, var(--cyan) 0%, var(--purple) 40%, var(--pink) 80%, transparent)", opacity: 0.28 }} />

              {[
                { zone: "District 01", name: "Westbrook Heights (Jake's Bedroom)", desc: "AI Fundamentals. Understand what prompting actually is. Discover the Conductor's core methodology.", emoji: "🎸", color: "var(--cyan)" },
                { zone: "District 02-04", name: "The Music District (Rehearsal Room & Concert Hall)", desc: "Deepening your directive skills. Put prompts into actions. Handle crisis scenarios with real consequences.", emoji: "🥁", color: "var(--cyan)" },
                { zone: "District 05-07", name: "Downtown (Coffee Shop & Tech Office)", desc: "The Claude Ecosystem. Build structured templates, code-free automations, and manage large-scale data sets.", emoji: "💻", color: "var(--purple)" },
                { zone: "District 08-12", name: "Campus & Tech Quarter (Home Office & Computer Lab)", desc: "Multi-Model Mastery. Orchestrate ChatGPT, Gemini, and Microsoft Copilot in comparative prompt battles.", emoji: "⚡", color: "#ffd740" },
                { zone: "District 13-14", name: "The Prompt Lab & Creative Hub (Vera's Studio)", desc: "The Final Exams. Face Señora Vega in a 5-round prompt engineering showdown. Transform into a master Conductor.", emoji: "🎓", color: "var(--pink)" },
              ].map((node, idx) => (
                <div 
                  key={node.zone} className="reveal"
                  style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative", zIndex: 2 }}
                >
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "50%", background: "#0c0816",
                    border: `2px solid ${node.color}`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.2rem", boxShadow: `0 0 20px ${node.color}33`, flexShrink: 0
                  }}>
                    {node.emoji}
                  </div>
                  
                  <div style={{
                    flex: 1, background: "rgba(12,8,22,0.5)", border: "1px solid rgba(255,255,255,0.03)",
                    padding: "1.25rem 1.75rem", borderRadius: "16px"
                  }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", fontWeight: 800, color: node.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>{node.zone}</span>
                      {idx === 0 && <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", fontWeight: 800, color: "#00e676", background: "rgba(0,230,118,0.12)", padding: "0.15rem 0.45rem", borderRadius: "100px", letterSpacing: "0.05em" }}>START QUEST</span>}
                    </div>
                    <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#fff", margin: "0 0 0.5rem" }}>{node.name}</h3>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{node.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal" style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <Link 
                href="/worldmap" 
                style={{ display: "inline-flex", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.85rem 2.5rem", borderRadius: "100px", textDecoration: "none" }}
              >
                Launch Campaign Map →
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            THE CODEX — FOUR PILLARS
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "rgba(8,6,15,0.4)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
              <div className="label-caps" style={{ color: "var(--purple)", marginBottom: "0.75rem" }}>The Codex</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
                The Conductor&apos;s Codex
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", maxWidth: "500px", margin: "1rem auto 0", lineHeight: 1.7 }}>
                The core four-part framework built into every game. Master these to shape any AI model.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
              {[
                { num: "01", title: "The What", desc: "Define the exact output you need. Be specific about the deliverable type, scope, and objective. The melody.", color: "var(--cyan)" },
                { num: "02", title: "The What Not", desc: "Specify constraints, exclusions, and anti-patterns. Boundaries are as powerful as instructions. The silence.", color: "var(--purple)" },
                { num: "03", title: "The How", desc: "Specify format, tone, length, structure, and audience. Shape the vessel before filling it. The tempo.", color: "var(--pink)" },
                { num: "04", title: "The Why", desc: "Give AI the purpose and stakes. Context unlocks relevance. Relevance unlocks quality. The soul.", color: "#ffd740" },
              ].map((p) => (
                <div 
                  key={p.num} className="reveal"
                  style={{
                    background: "rgba(12,8,22,0.8)", border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "20px", padding: "2rem 1.75rem", transition: "transform 0.3s, border-color 0.3s",
                    display: "flex", flexDirection: "column"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.borderColor = `${p.color}55`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 700, fontSize: "3rem", color: `${p.color}22`, lineHeight: 1, marginBottom: "0.75rem" }}>{p.num}</div>
                  <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: p.color, marginBottom: "0.75rem", letterSpacing: "0.02em" }}>{p.title}</h3>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(240,238,255,0.68)", lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            ROADMAP (GSAP Timeline)
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "#08060f", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            
            <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>Future Updates</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3.2rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
                Conductor&apos;s Roadmap
              </h2>
            </div>

            {/* Roadmap Tabs */}
            <div className="reveal" style={{
              display: "flex", flexWrap: "wrap", background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "0.35rem",
              gap: "0.25rem", justifyContent: "center", marginBottom: "2.5rem"
            }}>
              {[
                { phase: 1, label: "Phase 1: Foundation" },
                { phase: 2, label: "Phase 2: Learning Loop" },
                { phase: 3, label: "Phase 3: Engagement" },
                { phase: 4, label: "Phase 4: Polish" },
                { phase: 5, label: "Phase 5: Content" },
                { phase: 6, label: "Phase 6: Simulation" }
              ].map(p => (
                <button
                  key={p.phase}
                  onClick={() => { playMockClick(); setActivePhase(p.phase) }}
                  style={{
                    background: activePhase === p.phase ? "linear-gradient(90deg, #00d4f0, #e040fb)" : "transparent",
                    border: "none", borderRadius: "100px", padding: "0.5rem 1.25rem",
                    color: activePhase === p.phase ? "#08060f" : "rgba(255,255,255,0.5)",
                    fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.28s ease"
                  }}
                >
                  {p.label.split(":")[0]}
                </button>
              ))}
            </div>

            {/* Active Card */}
            <div className="reveal" style={{
              background: "rgba(12,8,22,0.6)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "24px",
              padding: "2rem 2.5rem"
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.22 }}
                >
                  {activePhase === 1 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1rem" }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", margin: 0 }}>Phase 1: The Foundation</h3>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "#00e676", background: "rgba(0,230,118,0.12)", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>COMPLETED</span>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                        We laid the bedrock for user profiles, Stripe payment gates, and streak persistence.
                      </p>
                    </div>
                  )}

                  {activePhase === 2 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1rem" }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", margin: 0 }}>Phase 2: The Learning Engine</h3>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "#00e676", background: "rgba(0,230,118,0.12)", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>COMPLETED</span>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                        We focused on the socratic dialogue loops, mastery checks, and spaced repetition concept storage.
                      </p>
                    </div>
                  )}

                  {activePhase === 3 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1rem" }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", margin: 0 }}>Phase 3: The Engagement Loop</h3>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "#ffd740", background: "rgba(255,215,64,0.12)", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>IN PROGRESS</span>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                        Daily habit loops and physical/digital evidence of AI mastery.
                      </p>
                    </div>
                  )}

                  {activePhase === 4 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1rem" }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", margin: 0 }}>Phase 4: Animation &amp; Polish</h3>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "#ffd740", background: "rgba(255,215,64,0.12)", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>IN PROGRESS</span>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                        Bringing high-fidelity, visual, and percussive game feel to every screen interaction.
                      </p>
                    </div>
                  )}

                  {activePhase === 5 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1rem" }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", margin: 0 }}>Phase 5: Content Expansion</h3>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>PLANNED</span>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                        Broadening the campaign districts to feature more tracks and complex AI workflows.
                      </p>
                    </div>
                  )}

                  {activePhase === 6 && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "baseline", marginBottom: "1rem" }}>
                        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#fff", margin: 0 }}>Phase 6: The Sims-Style Simulation</h3>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 800, color: "var(--pink)", background: "rgba(224,64,251,0.12)", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>THE MASTERPIECE</span>
                      </div>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                        A complete professional life simulator where AI skills are learned by living inside a career.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            THE SHOP (Pricing Plans)
        ══════════════════════════════════════════════════════════════════════ */}
        <span id="store"></span>
        <section style={{ padding: "6rem 2rem", background: "#05040a", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "1060px", margin: "0 auto" }}>

            <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="label-caps" style={{ color: "#ffd740", marginBottom: "0.75rem" }}>Pricing plans</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3.2rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
                Conductor&apos;s Store
              </h2>
            </div>

            {/* Pack tiers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "stretch", maxWidth: "960px", margin: "0 auto" }}>
              
              {/* Free Tier */}
              <div className="reveal glass-card" style={{ borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", background: "rgba(12,8,22,0.4)" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>Free Apprentice</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "2.6rem", color: "#fff", letterSpacing: "-0.03em" }}>$0.00</span>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>Diagnose your prompting weaknesses and try basics.</p>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
                  {["Access to Game Chapter 1","3 starter lives","Basic prompt sandbox","Play directly in browser"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <span aria-hidden="true" style={{ color: "#ffd740", fontSize: "0.75rem" }}>✦</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(240,238,255,0.78)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/games/welcome-to-ai-v2" style={{ display: "block", width: "100%", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.7rem", borderRadius: "100px", textDecoration: "none" }}>
                  Play Now
                </Link>
              </div>

              {/* Starter Pack */}
              <div className="reveal glass-card" style={{ borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", background: "rgba(12,8,22,0.5)" }}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>Starter Pack</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "2.6rem", color: "#fff", letterSpacing: "-0.03em" }}>$2.99</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)" }}>one-time</span>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>Break the habit of passive, generic prompting.</p>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
                  {["5 extra lives (replenish instantly)","3 Hint Tokens for tests","2 Double XP boosts (lasts 24h)","1 Second Chance safety net"].map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                      <span aria-hidden="true" style={{ color: "#00d4f0", fontSize: "0.75rem" }}>✦</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(240,238,255,0.78)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handlePurchase("starter-pack")}
                  disabled={checkingOut === "starter-pack"}
                  style={{ display: "block", width: "100%", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(240,238,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.7rem", borderRadius: "100px", cursor: checkingOut === "starter-pack" ? "wait" : "pointer", transition: "background 0.2s", opacity: checkingOut && checkingOut !== "starter-pack" ? 0.5 : 1 }}
                  onMouseEnter={e => { if (!checkingOut) e.currentTarget.style.background="rgba(255,255,255,0.1)" }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)" }}>
                  {checkingOut === "starter-pack" ? "Opening checkout…" : "Get Starter Pack →"}
                </button>
              </div>

              {/* Maestro Bundle */}
              <div className="reveal" style={{ borderRadius: "20px", padding: "2px", background: "linear-gradient(135deg, #00d4f0, #7b2fbe, #e040fb)", display: "flex", flexDirection: "column" }}>
                <div style={{ borderRadius: "18px", padding: "2rem", background: "rgba(12,8,22,0.98)", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(90deg,#00d4f0,#e040fb)", borderRadius: "100px", padding: "0.2rem 0.75rem", marginBottom: "1rem", alignSelf: "flex-start" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#08060f" }}>Best Value</span>
                  </div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#00d4f0", marginBottom: "0.6rem" }}>Maestro Bundle</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", marginBottom: "0.4rem" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "2.6rem", color: "#fff", letterSpacing: "-0.03em" }}>$6.99</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)" }}>one-time</span>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>Gain absolute control over LLM outputs.</p>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem" }}>
                    {["15 extra lives (replenish instantly)","8 Hint Tokens for prompt tests","5 Double XP boosts (lasts 24h)","3 Streak Shields & 2 Second Chances","1 Streak Restore & 1 Jackpot multiplier","All 14 Visual Novel tracks unlocked"].map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                        <span style={{ color: "#00d4f0", fontSize: "0.75rem" }}>✦</span>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(240,238,255,0.86)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePurchase("maestro-bundle")}
                    disabled={checkingOut === "maestro-bundle"}
                    style={{ display: "block", width: "100%", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.7rem", borderRadius: "100px", cursor: checkingOut === "maestro-bundle" ? "wait" : "pointer", border: "none", opacity: checkingOut && checkingOut !== "maestro-bundle" ? 0.5 : 1 }}>
                    {checkingOut === "maestro-bundle" ? "Opening checkout…" : "Get Maestro Bundle →"}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            PLAYER LOGS (Testimonials)
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "0.75rem" }}>Conductor Logs</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
              Feedback from the Field
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {[
              { quote: "Before MaestroPlay I was copying AI outputs and hoping for the best. Now I direct it like a professional backing band.", name: "Sarah K.",  role: "Marketing Conductor",    letter: "S", color: "#e040fb" },
              { quote: "I went from nodding in AI meetings to actually writing the prompt templates. One week of playing did it.",                 name: "Marcus T.", role: "Operations Lead",         letter: "M", color: "#00d4f0" },
              { quote: "The most useful thing I've done for my career this year. And I actually looked forward to it every evening.", name: "Priya M.",  role: "HR Conductor",    letter: "P", color: "#ffd740" },
            ].map((t, i) => (
              <div key={i} className="glass-card reveal" style={{ borderRadius: "20px", padding: "2.25rem", background: "rgba(12,8,22,0.4)" }}>
                <div role="img" aria-label="5 out of 5 stars" style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem" }}>
                  {[...Array(5)].map((_, j) => <SVGStar key={j} />)}
                </div>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.15rem", color: "rgba(240,238,255,0.92)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `${t.color}18`, border: `1px solid ${t.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: t.color, flexShrink: 0 }}>{t.letter}</div>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#fff" }}>{t.name}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "rgba(240,238,255,0.60)", letterSpacing: "0.04em" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            ABOUT THE DIRECTOR (Felipe Maestro)
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "6rem 2rem", background: "rgba(8,6,15,0.2)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
            
            <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "260px" }}>
                <div style={{ borderRadius: "24px", background: "linear-gradient(135deg, #00d4f0, #7b2fbe, #e040fb)", padding: "2px", boxShadow: "0 0 60px rgba(0,212,240,0.12)" }}>
                  <div style={{ borderRadius: "22px", overflow: "hidden", background: "var(--bg-secondary)", height: "320px" }}>
                    <img src="/images/maestroplayer1.png" alt="Felipe Maestro" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="label-caps reveal" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>Director &amp; Founder</div>
              <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", marginBottom: "1.25rem", lineHeight: 1.05 }}>Felipe Maestro</h2>
              <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.82)", lineHeight: 1.9, marginBottom: "1rem" }}>
                Felipe built Maestro Play on a simple belief: <strong style={{ color: "#fff" }}>the best way to learn is to play through it.</strong> Not watch a lecture. Not read a textbook. Make hard choices, see what breaks, and fix it.
              </p>
              <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.92rem", color: "rgba(240,238,255,0.65)", lineHeight: 1.85, marginBottom: "2rem" }}>
                His Maestro Method prompting system powers every choice and dialogue challenge. What he teaches in corporate bootcamps is now interactive, gamified, and waiting for you.
              </p>
              <a className="reveal" href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(240,238,255,0.85)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.65rem 1.5rem", borderRadius: "100px", textDecoration: "none", transition: "background 0.2s" }}>
                Visit Maestro Academy ↗
              </a>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            VISION QUOTE
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", display: "flex", alignItems: "center", overflow: "hidden", margin: "2rem 0" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d0b14 0%, #1a0d2e 40%, #0d0b14 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(123,47,190,0.16) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
            <div className="label-caps reveal" style={{ color: "var(--purple)", marginBottom: "1.5rem" }}>The Vision</div>
            <blockquote className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.3, marginBottom: "1.5rem" }}>
              &ldquo;The most powerful professionals of this decade won&apos;t be the ones who know how to code. They&apos;ll be the ones who know how to conduct.&rdquo;
            </blockquote>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted)" }}>
              Felipe Maestro · Maestro Academy
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            CLOSING CTA
        ══════════════════════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "7rem 2rem" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.1) 30%, transparent 65%)", pointerEvents: "none", animation: "pulse-glow 4s ease-in-out infinite" }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 10, maxWidth: "700px" }}>
            <div className="label-caps reveal" style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>The orchestra is ready.</div>
            <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "#fff", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              Are you?
            </h2>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Start your first visual novel session free. No signup. No credit card.
            </p>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(240,238,255,0.60)", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              Join the developers, designers, and creatives closing the AI gap — one choice at a time.
            </p>
            <div className="reveal" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {hasProgress ? (
                <Link href="/games/welcome-to-ai-v2" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none", boxShadow: "0 0 40px rgba(0,212,240,0.25)" }}>
                  Resume Campaign Track →
                </Link>
              ) : (
                <Link href="/games/welcome-to-ai-v2" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none", boxShadow: "0 0 40px rgba(0,212,240,0.25)" }}>
                  Play Campaign Free →
                </Link>
              )}
              <Link href="/worldmap" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "1rem", color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none" }}>
                View Campaign Map
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
