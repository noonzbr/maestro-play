"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import Link from "next/link"
import { Game, Scene, Choice } from "@/lib/games/types"
import SceneRenderer from "./SceneRenderer"
import EndScreen from "./EndScreen"
import XPCounter from "./XPCounter"
import FloatingNotes from "./FloatingNotes"
import CinematicIntro from "./CinematicIntro"
import GameIcon from "./GameIcon"
import NovelScene from "./NovelScene"
import PromptChallenge from "./PromptChallenge"
import VideoIntro from "./VideoIntro"
import SceneEnvironment from "./SceneEnvironment"
import BossArena from "./BossArena"
import { useSoundEngine, SoundMood } from "./SoundEngine"
import AchievementToast, { AchievementId } from "./AchievementToast"
import XPBurstLottie from "./XPBurstLottie"
import TutorBot from "./TutorBot"
import { playVoiceBlip, resolveNpcKey } from "./NovelScene"
import StoryMap from "./StoryMap"
import { useAuth } from "@/context/AuthContext"
import { supabaseBrowser } from "@/lib/supabase-browser"

type Props = { game: Game }
type GameState = "brand-video" | "video" | "story" | "intro" | "koda-intro" | "playing" | "answered" | "felipe-transition" | "felipe" | "complete" | "out-of-lives"

/** Find a scene's array index by its id field (returns -1 if not found) */
function findSceneIndexById(scenes: { id: string }[], id: string): number {
  return scenes.findIndex(s => s.id === id)
}

/* ── Background image map — mirrors NovelScene ──────────────────────────── */
function getSceneBgImage(location: string): string {
  const loc = location.toUpperCase()
  if (loc.includes("PRACTICE ROOM") || loc.includes("PRACTICE")) return "/images/bg-practiceroom.png"
  if (loc.includes("BAND PRACTICE") || loc.includes("BACKSTAGE") || loc.includes("STAGE") || loc.includes("REHEARSAL") || loc.includes("PERFORMANCE") || loc.includes("CONCERT"))  return "/images/bg-bandpractice.png"
  if (loc.includes("SCHOOL HALLWAY") || loc.includes("HALLWAY")) return "/images/bg-hallway.png"
  if (loc.includes("MUSIC CLASS") || loc.includes("CLASSROOM") || loc.includes("LIBRARY") || loc.includes("RESEARCH") || loc.includes("CLASS"))  return "/images/bg-musicclass.png"
  if (loc.includes("JAKE'S ROOM") || loc.includes("JAKE") || loc.includes("BEDROOM") || loc.includes("HOME") || loc.includes("GREEN ROOM"))       return "/images/bg-bedroom.png"
  if (loc.includes("COFFEE SHOP") || loc.includes("CAF") || loc.includes("LOBBY") || loc.includes("OFFICE") || loc.includes("BOARDROOM") || loc.includes("CORPORATE") || loc.includes("CONFERENCE") || loc.includes("DESK") || loc.includes("THREAD") || loc.includes("REPLIES") || loc.includes("MEDIA"))        return "/images/bg-lobby.png"
  if (loc.includes("MUSIC ROOM") || loc.includes("MUSIC CLUB") || loc.includes("DESIGN STUDIO") || loc.includes("STUDIO") || loc.includes("CREATIVE")) return "/images/bg-musicclass.png"
  if (loc.includes("COMPUTER LAB") || loc.includes("LAB") || loc.includes("SERVER ROOM") || loc.includes("TECH")) return "/images/bg-practiceroom.png"
  if (loc.includes("BRIDGE") || loc.includes("ORION") || loc.includes("SPACESHIP") || loc.includes("SPACE")) return "/images/bg-bridge.png"
  return "/images/bg-lobby.png"   // default fallback background to avoid plain dark gradient
}

/* XPBurst replaced by XPBurstLottie import above */

function CorrectBurst() {
  const dots = Array.from({ length: 18 }, (_, i) => i)
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 150 }}>
      {dots.map(i => {
        const angle = (i / dots.length) * 360
        const dist  = 80 + Math.random() * 120
        const color = i % 3 === 0 ? "#00d4f0" : i % 3 === 1 ? "#e040fb" : "#00ff80"
        const size  = 4 + Math.random() * 6
        return (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: `${size}px`, height: `${size}px`,
            borderRadius: "50%",
            background: color,
            animation: `particle-fly-${i % 4} 1s ease-out forwards`,
            transform: `rotate(${angle}deg) translateY(-${dist}px)`,
            opacity: 0,
            animationDelay: `${i * 0.02}s`,
          }} />
        )
      })}
    </div>
  )
}

/* ─── Felipe "Conductor's Strike" transition ──────────────────────────────── */
function FelipeTransition({ onComplete, accent = "#00d4f0" }: { onComplete: () => void; accent?: string }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1450)
    return () => clearTimeout(t)
  }, [onComplete])

  const rings = [0, 200, 400]

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      animation: "felipe-overlay-in 0.18s ease forwards",
    }}>
      {/* Radial boom flash */}
      <div style={{
        position: "absolute",
        width: "220vmax", height: "220vmax",
        borderRadius: "50%",
        background: `radial-gradient(circle, #fff 0%, ${accent} 18%, #e040fb 40%, #7b2fbe 60%, transparent 72%)`,
        animation: "felipe-boom 0.95s cubic-bezier(0.16,1,0.3,1) forwards",
        pointerEvents: "none",
      }} />

      {/* Expanding shockwave rings */}
      {rings.map((delay, i) => (
        <div key={i} style={{
          position: "absolute",
          width: "55vmin", height: "55vmin",
          borderRadius: "50%",
          border: `${3 - i}px solid ${i === 0 ? "#fff" : accent}`,
          opacity: 0,
          animation: `felipe-ring 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards`,
          pointerEvents: "none",
        }} />
      ))}

      {/* ♪ symbol — blooms and dissolves */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(5rem, 18vw, 12rem)",
        fontWeight: 700,
        color: "#fff",
        lineHeight: 1,
        textShadow: `0 0 80px #fff, 0 0 140px ${accent}, 0 0 220px #e040fb`,
        animation: "felipe-note-pop 1.45s cubic-bezier(0.16,1,0.3,1) forwards",
        pointerEvents: "none",
        userSelect: "none",
      }}>
        ♪
      </div>

      {/* Ambient glow orb underneath */}
      <div style={{
        position: "absolute",
        width: "60vmin", height: "60vmin",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)`,
        animation: "felipe-glow-pulse 0.7s ease-in-out infinite",
        pointerEvents: "none",
      }} />
    </div>
  )
}

export default function GameEngine({ game: initialGame }: Props) {
  const getCleanImgSrc = (src: string | undefined): string | undefined => {
    if (!src) return src
    if (src.startsWith("/images/") && !src.includes("?")) {
      return `${src}?v=2`
    }
    return src
  }

  const game = {
    ...initialGame,
    characterImage: getCleanImgSrc(initialGame.characterImage),
    maestroImage: getCleanImgSrc(initialGame.maestroImage),
    nextGame: initialGame.nextGame ? {
      ...initialGame.nextGame,
      previewImage: getCleanImgSrc(initialGame.nextGame.previewImage)
    } : undefined
  }
  const [sceneIndex,   setSceneIndex]   = useState(0)
  const [state,        setState]        = useState<GameState>("brand-video")
  const [selectedLabel,setSelectedLabel]= useState<string | null>(null)
  const [totalXp,      setTotalXp]      = useState(0)
  const [lastXp,       setLastXp]       = useState(0)
  const [streak,       setStreak]       = useState(0)
  const [streakCount,  setStreakCount]  = useState(0)
  const [lives,        setLives]        = useState(3)
  const [showBurst,    setShowBurst]    = useState(false)
  const [showXpBurst,  setShowXpBurst]  = useState(false)
  const [showMap,      setShowMap]      = useState(false)
  const [burstKey,     setBurstKey]     = useState(0)
  const [dialogueDone,   setDialogueDone]   = useState(false)
  const [completedDialogueSceneIndex, setCompletedDialogueSceneIndex] = useState<number | null>(null)
  const [achievement,    setAchievement]    = useState<{ id: AchievementId; ts: number } | undefined>()
  const [isMuted,        setIsMuted]        = useState(false)
  // undefined = idle/not needed, null = loading, "" = error/empty, string = AI text
  const [aiElaboration,  setAiElaboration]  = useState<string | null | undefined>(undefined)
  const [codaReviewStep, setCodaReviewStep] = useState(false)
  const [mounted,        setMounted]        = useState(false)
  const [playerName,     setPlayerName]     = useState("")
  /** Briefly true after a wrong answer — signals TutorBot to nudge */
  const [playerStuck,    setPlayerStuck]    = useState(false)
  /** Scene ID to jump to after the current "answered" state resolves (branching) */
  const [pendingLeadsTo, setPendingLeadsTo] = useState<string | null>(null)
  /** History of choices the player made — passed to EndScreen for "Your Path" */
  const [choiceHistory, setChoiceHistory] = useState<{question:string, chosen:string, correct:boolean}[]>([])
  /** Last answer result — drives character reaction animation */
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  /** Key to re-trigger character reaction animation on each answer */
  const [reactionKey,    setReactionKey]    = useState(0)
  
  const [shouldShake, setShouldShake] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [portraitSrc, setPortraitSrc] = useState(game.characterImage)
  const [charTalking, setCharTalking] = useState(false)
  const [showBossArena, setShowBossArena] = useState(false)
  const engineRootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!game.characterImage) return
    const getEmotionUrl = (src: string, emo: string) => {
      if (emo === "neutral" || !src) return src
      const urlParts = src.split('?')
      const path = urlParts[0]
      const query = urlParts[1] ? `?${urlParts[1]}` : ''
      if (path.toLowerCase().endsWith('.png')) {
        const mainPath = path.substring(0, path.length - 4)
        return `${mainPath}_${emo}.png${query}`
      }
      return src
    }

    let activeEmotion: "neutral" | "excited" | "tense" = "neutral"
    if (state === "answered") {
      if (lastAnswerCorrect === true) {
        activeEmotion = "excited"
      } else if (lastAnswerCorrect === false) {
        activeEmotion = "tense"
      }
    }
    setPortraitSrc(getEmotionUrl(game.characterImage, activeEmotion))
  }, [game.characterImage, state, lastAnswerCorrect])

  const abortRef = useRef<AbortController | null>(null)
  const introCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [kodaBeatIndex,  setKodaBeatIndex]  = useState(0)
  const [showBriefing,   setShowBriefing]   = useState(false)
  const [kodaTypedText,  setKodaTypedText]  = useState("")
  const [kodaTypingDone, setKodaTypingDone] = useState(false)
  const [fastText,       setFastText]       = useState(false)
  const [kodaAutoProgress, setKodaAutoProgress] = useState(0)

  const KODA_INTRO_BEATS = (() => {
    if (game.week === 1 || game.week === 13) {
      return [
        {
          speaker: "Coda & Felipe",
          text: "Welcome, Conductor! I'm Coda, your AI guide, and this is Felipe. Tap my icon for Socratic clues if you get stuck. Let's begin!"
        }
      ]
    }

    const characterName = game.characterName ?? "the team"
    const topic = game.title

    return [
      {
        speaker: "Coda & Felipe",
        text: `Welcome back! We are ready to help solve the AI bottleneck: "${topic}". Let's begin!`
      }
    ]
  })()


  useEffect(() => {
    if (state !== "koda-intro") return
    const text = KODA_INTRO_BEATS[kodaBeatIndex]?.text ?? ""
    if (!text) return
    if (fastText) {
      setKodaTypedText(text)
      setKodaTypingDone(true)
      return
    }
    setKodaTypedText("")
    setKodaTypingDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      const char = text[i - 1]
      setKodaTypedText(text.slice(0, i))
      
      const speakerName = KODA_INTRO_BEATS[kodaBeatIndex]?.speaker ?? "Coda"
      playVoiceBlip(speakerName, char)

      if (i >= text.length) {
        clearInterval(timer)
        setKodaTypingDone(true)
      }
    }, 22)
    return () => clearInterval(timer)
  }, [kodaBeatIndex, state, fastText])

  // Web Audio Synth for Coda Intro Scene
  useEffect(() => {
    if (state !== "koda-intro") return

    let localAudioCtx: AudioContext | null = null
    let humGainNode: GainNode | null = null
    let osc1: OscillatorNode | null = null
    let osc2: OscillatorNode | null = null
    let filter: BiquadFilterNode | null = null

    try {
      localAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const playStartupChime = () => {
        if (!localAudioCtx) return
        const now = localAudioCtx.currentTime
        
        // Fast pitch sweep (retro futuristic)
        const sweepOsc = localAudioCtx.createOscillator()
        const sweepGain = localAudioCtx.createGain()
        sweepOsc.type = "sawtooth"
        sweepOsc.frequency.setValueAtTime(100, now)
        sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.35)
        
        sweepGain.gain.setValueAtTime(0.005, now)
        sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
        
        const lowpass = localAudioCtx.createBiquadFilter()
        lowpass.type = "lowpass"
        lowpass.frequency.setValueAtTime(800, now)
        
        sweepOsc.connect(lowpass)
        lowpass.connect(sweepGain)
        sweepGain.connect(localAudioCtx.destination)
        sweepOsc.start(now)
        sweepOsc.stop(now + 0.4)
        
        // High connection chimes (double beep)
        setTimeout(() => {
          if (!localAudioCtx) return
          const chimeTime = localAudioCtx.currentTime
          const oscA = localAudioCtx.createOscillator()
          const oscB = localAudioCtx.createOscillator()
          const gainNode = localAudioCtx.createGain()
          
          oscA.type = "sine"
          oscB.type = "sine"
          oscA.frequency.setValueAtTime(880, chimeTime) // A5
          oscB.frequency.setValueAtTime(1320, chimeTime + 0.08) // E6
          
          gainNode.gain.setValueAtTime(0.012, chimeTime)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 0.45)
          
          oscA.connect(gainNode)
          oscB.connect(gainNode)
          gainNode.connect(localAudioCtx.destination)
          
          oscA.start(chimeTime)
          oscB.start(chimeTime + 0.08)
          oscA.stop(chimeTime + 0.5)
          oscB.stop(chimeTime + 0.5)
        }, 120)
      }

      playStartupChime()

      // cinematic room-tone hum
      const t = localAudioCtx.currentTime
      humGainNode = localAudioCtx.createGain()
      humGainNode.gain.setValueAtTime(0.0, t)
      humGainNode.gain.linearRampToValueAtTime(0.006, t + 1.5) // extremely subtle
      
      osc1 = localAudioCtx.createOscillator()
      osc2 = localAudioCtx.createOscillator()
      filter = localAudioCtx.createBiquadFilter()
      
      osc1.type = "triangle"
      osc1.frequency.setValueAtTime(65.4, t) // C2
      
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(98.0, t) // G2
      
      filter.type = "lowpass"
      filter.frequency.setValueAtTime(180, t)
      
      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(humGainNode)
      humGainNode.connect(localAudioCtx.destination)
      
      osc1.start(t)
      osc2.start(t)

    } catch (e) {
      console.warn("Failed to initialize Web Audio chimes", e)
    }

    return () => {
      try {
        if (localAudioCtx && humGainNode && osc1 && osc2) {
          const now = localAudioCtx.currentTime
          humGainNode.gain.cancelScheduledValues(now)
          humGainNode.gain.setValueAtTime(humGainNode.gain.value, now)
          humGainNode.gain.linearRampToValueAtTime(0.0, now + 0.4)
          
          setTimeout(() => {
            try {
              osc1?.stop()
              osc2?.stop()
              localAudioCtx?.close()
            } catch (err) {}
          }, 450)
        }
      } catch (err) {}
    }
  }, [state])

  // Canvas Nodes Web Background Effect
  useEffect(() => {
    if (state !== "koda-intro" || !introCanvasRef.current) return
    const canvas = introCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    };
    window.addEventListener("resize", handleResize)

    const particleCount = 45
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      r: number
      color: string
    }> = []

    for (let i = 0; i < particleCount; i++) {
      const colors = ["rgba(0, 212, 240, 0.35)", "rgba(224, 64, 251, 0.3)", "rgba(255, 255, 255, 0.12)"]
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(0, 212, 240, ${0.1 * (1 - dist / 130)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [state])

  useEffect(() => {
    setMounted(true)
    try {
      const savedLives = parseInt(localStorage.getItem("maestro_lives") ?? "3")
      setLives(savedLives > 0 ? savedLives : 3)
      if (savedLives <= 0) {
        localStorage.setItem("maestro_lives", "3")
      }
    } catch {
      setLives(3)
    }
  }, [])

  // ── "World Remembers You" — Dr. Cole's return greeting ─────────────────────
  // If player hasn't visited in 2+ days, character acknowledges the absence.
  // Stored per-game slug so each game tracks independently.
  const [welcomeBack, setWelcomeBack] = useState<string | null>(null)
  useEffect(() => {
    try {
      const key       = `maestro_last_played_${game.slug}`
      const lastMs    = parseInt(localStorage.getItem(key) ?? "0")
      const now       = Date.now()
      const daysSince = (now - lastMs) / (1000 * 60 * 60 * 24)
      localStorage.setItem(key, String(now))
      if (lastMs > 0 && daysSince >= 2) {
        const days = Math.floor(daysSince)
        const charName = game.characterName ?? "your character"
        const messages = [
          `${charName} has been waiting ${days} day${days > 1 ? "s" : ""}. The orchestra never stopped.`,
          `It's been ${days} day${days > 1 ? "s" : ""}. ${charName} kept practicing. Ready to catch up?`,
          `${days} day${days > 1 ? "s" : ""} away. ${charName} was starting to wonder.`,
        ]
        setWelcomeBack(messages[Math.floor(Math.random() * messages.length)])
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mastery gate — quiz accuracy tracking
  const [quizTotal,         setQuizTotal]         = useState(0)
  const [quizCorrect,       setQuizCorrect]        = useState(0)
  const [masteryGateVisible,setMasteryGateVisible] = useState(false)

  const sound       = useSoundEngine()
  const { user }    = useAuth()

  useEffect(() => {
    sound.updateGameState?.(streakCount, lives)
  }, [streakCount, lives, sound])

  const handleNextKodaBeat = useCallback(() => {
    sound.playClick()
    setFastText(false)
    if (kodaBeatIndex + 1 < KODA_INTRO_BEATS.length) {
      setKodaBeatIndex(i => i + 1)
    } else {
      sound.playTransition()
      setState("playing")
    }
  }, [kodaBeatIndex, KODA_INTRO_BEATS.length, sound])

  // Auto-advance koda-intro when typing is done
  useEffect(() => {
    if (state !== "koda-intro" || !kodaTypingDone) {
      setKodaAutoProgress(0)
      return
    }
    const text = KODA_INTRO_BEATS[kodaBeatIndex]?.text ?? ""
    const words = text.split(/\s+/).length
    const ms = Math.max(3000, words * 250) // ~240 words per minute, min 3s

    let start: number | null = null
    let rafId: number
    let timerId: NodeJS.Timeout

    const tick = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const pct = Math.min(100, (elapsed / ms) * 100)
      setKodaAutoProgress(pct)
      if (elapsed < ms) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)

    timerId = setTimeout(() => {
      handleNextKodaBeat()
    }, ms)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timerId)
      setKodaAutoProgress(0)
    }
  }, [state, kodaTypingDone, kodaBeatIndex, handleNextKodaBeat, KODA_INTRO_BEATS])

  /* ── Boss entrance GSAP overlay ─────────────────────────────────────── */
  const bossOverlayRef = useRef<HTMLDivElement | null>(null)
  const prevSceneType  = useRef<string>("")

  const currentScene = game.scenes[sceneIndex]
  const isDialogueDoneForCurrentScene = !currentScene?.dialogue?.length || 
    (dialogueDone && completedDialogueSceneIndex === sceneIndex)
  const totalScenes  = game.scenes.length
  const maxXp        = game.scenes.reduce((sum, s) => sum + s.xpAward, 0)

  const currentMood: SoundMood =
    currentScene?.type === "boss"       ? "boss" :
    currentScene?.type === "revelation" ? "revelation" : "normal"

  /* ── one-time keyframe injection ─────────────────────────────────────── */
  useEffect(() => {
    const id = "maestro-keyframes"
    if (document.getElementById(id)) return
    const style = document.createElement("style")
    style.id    = id
    style.textContent = `
      @keyframes dlg-cursor {
        0%,100% { opacity: 0; }
        50%     { opacity: 1; }
      }
      @keyframes xp-burst {
        0%   { opacity:0; transform:translateY(0) scale(0.5); }
        20%  { opacity:1; transform:translateY(-8px) scale(1.2); }
        80%  { opacity:1; transform:translateY(-32px) scale(1); }
        100% { opacity:0; transform:translateY(-56px) scale(0.8); }
      }
      @keyframes particle-fly-0 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-160px) scale(0); }
      }
      @keyframes particle-fly-1 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-140px) translateX(40px) scale(0); }
      }
      @keyframes particle-fly-2 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-180px) translateX(-30px) scale(0); }
      }
      @keyframes particle-fly-3 {
        0%   { opacity:1; transform:rotate(var(--r,0deg)) translateY(0); }
        100% { opacity:0; transform:rotate(var(--r,0deg)) translateY(-120px) translateX(60px) scale(0); }
      }
      @keyframes streak-pop {
        0%   { transform:scale(1); }
        50%  { transform:scale(1.4); }
        100% { transform:scale(1); }
      }
      @keyframes revelation-glow {
        0%,100% { opacity:0.35; }
        50%     { opacity:0.65; }
      }
      @keyframes float {
        0%,100% { opacity:0.7; transform:scale(1); }
        50%     { opacity:1;   transform:scale(1.08); }
      }
      @keyframes pulse-glow {
        0%,100% { opacity:0.4; }
        50%     { opacity:1; }
      }
      @keyframes maestro-pulse {
        0%,100% { filter:drop-shadow(0 0 12px rgba(0,212,240,0.4)); }
        50%     { filter:drop-shadow(0 0 28px rgba(0,212,240,0.9)); }
      }
      @keyframes maestro-gate-in {
        from { opacity:0; transform:scale(0.96); }
        to   { opacity:1; transform:scale(1); }
      }
      @keyframes heart-shatter {
        0% { transform: scale(1); filter: none; }
        50% { transform: scale(1.4) rotate(15deg); filter: drop-shadow(0 0 10px red); }
        100% { transform: scale(0.85) rotate(-10deg); filter: grayscale(1) opacity(0.25); }
      }
      .heart-shattered {
        animation: heart-shatter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        display: inline-block;
      }
      .heart-active {
        display: inline-block;
        transition: transform 0.2s ease;
      }
      .heart-active:hover {
        transform: scale(1.2);
      }
      @keyframes screen-shake {
        0%,100% { transform: translateX(0); }
        15%     { transform: translateX(-8px) translateY(3px); }
        30%     { transform: translateX(8px)  translateY(-3px); }
        45%     { transform: translateX(-5px) translateY(2px); }
        60%     { transform: translateX(5px)  translateY(-1px); }
        75%     { transform: translateX(-2px) translateY(1px); }
      }
      @keyframes correct-flash {
        0%   { opacity: 0; }
        20%  { opacity: 0.22; }
        100% { opacity: 0; }
      }
      @keyframes wrong-flash {
        0%   { opacity: 0; }
        25%  { opacity: 0.28; }
        100% { opacity: 0; }
      }
      @keyframes wm-next-pulse {
        0%,100% { box-shadow: 0 0 18px var(--nc, rgba(0,212,240,0.3)); }
        50%     { box-shadow: 0 0 36px var(--nc, rgba(0,212,240,0.6)); }
      }
    `
    document.head.appendChild(style)
  }, [])


  /* ── audio hooks ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (game.audioTrack) sound.setNormalTrack(game.audioTrack)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== "playing") return
    if (currentScene?.type === "revelation") {
      sound.startAmbient("revelation", 60)
      sound.playRevelation()
    } else if (currentScene?.type === "boss") {
      sound.setMood("boss")
      // ── Boss achievement (first boss ever) ──
      if (prevSceneType.current !== "boss") {
        if (!localStorage.getItem("maestro_ach_first_boss")) {
          setTimeout(() => setAchievement({ id: "first_boss", ts: Date.now() }), 1000)
        }
      }
      // ── Boss entrance cinematic via GSAP ──
      if (prevSceneType.current !== "boss" && bossOverlayRef.current) {
        const el = bossOverlayRef.current
        const shakeTarget = engineRootRef.current
        const tl = gsap.timeline()
        if (shakeTarget) {
          // Pre-entrance stage shake: translateX(±3px) alternating, 5 cycles, 400ms
          tl.to(shakeTarget, { x: -3, duration: 0.04, yoyo: true, repeat: 9, ease: "rough" })
            .to(shakeTarget, { x: 0, duration: 0.04 })
        }
        tl.set(el, { opacity: 0, display: "block" })
          .to(el, { opacity: 1, duration: 0.18, ease: "power2.in" })
          .to(el, { opacity: 0, duration: 0.55, ease: "power3.out", delay: 0.12 })
          .set(el, { display: "none" })
      }
    } else {
      sound.setMood("normal")
    }
    prevSceneType.current = currentScene?.type ?? ""
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, state])

  useEffect(() => {
    if (state === "playing" && currentScene?.type === "boss") {
      if (prevSceneType.current !== "boss") {
        setShowBossArena(false)
        const t = setTimeout(() => setShowBossArena(true), 400)
        return () => clearTimeout(t)
      } else {
        setShowBossArena(true)
      }
    } else {
      setShowBossArena(false)
    }
  }, [sceneIndex, state, currentScene])

  useEffect(() => {
    if (state === "complete") sound.fadeVolumeTo(0.02, 2500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  useEffect(() => {
    if (currentScene && (!currentScene.dialogue || currentScene.dialogue.length === 0)) {
      setDialogueDone(true)
    } else {
      setDialogueDone(false)
    }
  }, [sceneIndex, currentScene])

  /* ── persist XP + completion to localStorage on game complete ─────────── */
  useEffect(() => {
    if (state !== "complete") return
    try {
      // Accumulate total XP across all games
      const prev = parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0
      const newTotal = prev + totalXp
      localStorage.setItem("maestro_total_xp", String(newTotal))

      // Mark this game as completed with XP earned
      const completedKey = `maestro_game_${game.week}_xp`
      const alreadyEarned = parseInt(localStorage.getItem(completedKey) ?? "0") || 0
      if (totalXp > alreadyEarned) {
        localStorage.setItem(completedKey, String(totalXp))
      }

      // ── Streak logic (with Streak Shield power-up support) ───────────────
      const prevStreak = parseInt(localStorage.getItem("maestro_daily_streak") ?? "0") || 0
      const today      = new Date().toDateString()
      const yesterday  = new Date(Date.now() - 86_400_000).toDateString()
      const lastPlay   = localStorage.getItem("maestro_last_play_date")

      // Check if Streak Shield power-up is active
      let shieldActive = false
      try {
        const puRaw = localStorage.getItem("maestro_pu_active")
        if (puRaw) {
          const pu = JSON.parse(puRaw)
          shieldActive = typeof pu.shield === "number" && Date.now() < pu.shield
        }
      } catch {}

      if (lastPlay !== today) {
        let newStreak: number
        if (!lastPlay || lastPlay === yesterday) {
          // Played yesterday (or first ever) — increment streak
          newStreak = prevStreak + 1
        } else if (shieldActive) {
          // Shield absorbs the broken streak — preserve current count
          newStreak = prevStreak
        } else {
          // Missed a day — streak resets to 1
          newStreak = 1
        }
        localStorage.setItem("maestro_daily_streak", String(newStreak))
        localStorage.setItem("maestro_last_play_date", today)
        // Update best streak if this is a new record
        const bestStreak = parseInt(localStorage.getItem("maestro_best_streak") ?? "0") || 0
        if (newStreak > bestStreak) {
          localStorage.setItem("maestro_best_streak", String(newStreak))
        }
      }

      // Dispatch storage event so Nav updates immediately
      window.dispatchEvent(new StorageEvent("storage", { key: "maestro_total_xp" }))

      // ── FSRS: create spaced-repetition review cards in localStorage ──
      try {
        const concepts = game.scenes
          .filter(s => s.concept?.title && s.concept?.body)
          .map(s => ({ title: s.concept!.title, body: s.concept!.body }))
        if (concepts.length > 0) {
          const localCardsJson = localStorage.getItem("maestro_review_cards") || "[]"
          const localCards: any[] = JSON.parse(localCardsJson)
          let updated = false
          concepts.forEach(c => {
            const exists = localCards.some(lc => lc.game_slug === game.slug && lc.concept_title === c.title)
            if (!exists) {
              localCards.push({
                id: Math.random().toString(36).substring(2, 9),
                game_slug: game.slug,
                game_week: game.week,
                concept_title: c.title,
                concept_body: c.body,
                due: new Date().toISOString(),
                stability: 0,
                difficulty: 0,
                elapsed_days: 0,
                scheduled_days: 0,
                reps: 0,
                lapses: 0,
                learning_steps: 0,
                state: 0,
                last_review: null,
                created_at: new Date().toISOString()
              })
              updated = true
            }
          })
          if (updated) {
            localStorage.setItem("maestro_review_cards", JSON.stringify(localCards))
          }
        }
      } catch (e) {
        console.warn("Failed to save local review cards:", e)
      }

      // ── Persist to Supabase if user is logged in (async, non-blocking) ──
      if (user) {
        supabaseBrowser().auth.getSession().then(({ data }) => {
          const token = data.session?.access_token
          if (!token) return
          fetch("/api/progress", {
            method:  "POST",
            headers: {
              "Content-Type":  "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              gameSlug: game.slug,
              gameWeek: game.week,
              xpEarned: totalXp,
            }),
          }).catch(e => console.warn("Progress sync error:", e))

          // ── FSRS: create spaced-repetition review cards for this game's concepts ──
          const concepts = game.scenes
            .filter(s => s.concept?.title && s.concept?.body)
            .map(s => ({ title: s.concept!.title, body: s.concept!.body }))
          if (concepts.length > 0) {
            fetch("/api/review/create", {
              method:  "POST",
              headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                gameSlug: game.slug,
                gameWeek: game.week,
                concepts,
              }),
            }).catch(e => console.warn("Review card creation error:", e))
          }
        }).catch(() => {})
      }

      // ── Achievements ──
      // First game ever
      if (!localStorage.getItem("maestro_ach_first_game")) {
        setTimeout(() => setAchievement({ id: "first_game", ts: Date.now() }), 1200)
      }
      // Level up — check if crossing a conductor threshold
      const levelThresholds: Array<{ xp: number; id: AchievementId }> = [
        { xp: 500,  id: "level_assoc"   },
        { xp: 1500, id: "level_cond"    },
        { xp: 3000, id: "level_maestro" },
      ]
      for (const { xp, id } of levelThresholds) {
        if (prev < xp && newTotal >= xp) {
          setTimeout(() => setAchievement({ id, ts: Date.now() }), 2000)
          break
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  /* ── handlers ────────────────────────────────────────────────────────── */
  const handleAnswer = useCallback((choice: Choice) => {
    if (state !== "playing") return

    // ── Decision scenes: skip feedback panel, navigate immediately ────────────
    if (currentScene.skipFeedback) {
      setSelectedLabel(choice.label)
      sound.playClick()
      const target = choice.leadsTo
      setTimeout(() => {
        if (target) {
          const targetIndex = findSceneIndexById(game.scenes, target)
          if (targetIndex !== -1) {
            sound.playTransition()
            setSceneIndex(targetIndex)
            setSelectedLabel(null)
            setState("playing")
            return
          }
        }
        if (sceneIndex + 1 < totalScenes) {
          sound.playTransition()
          setSceneIndex(i => i + 1)
          setSelectedLabel(null)
          setState("playing")
        } else {
          // Inline completeGame — avoids temporal dead-zone issue with const ordering
          if (game.felipeOutroVideo) setState("felipe-transition")
          else setState("complete")
        }
      }, 320)
      return
    }

    setSelectedLabel(choice.label)
    setChoiceHistory(prev => [...prev, {
      question: currentScene.question ?? "",
      chosen: choice.text.slice(0, 60),
      correct: !!choice.correct,
    }])
    setState("answered")
    // Fire character reaction animation
    setLastAnswerCorrect(choice.correct ?? false)
    setReactionKey(k => k + 1)
    // Store branching target — handleNext will jump here instead of +1
    if (choice.leadsTo) setPendingLeadsTo(choice.leadsTo)

    const xpEarned = choice.correct ? currentScene.xpAward : Math.floor(currentScene.xpAward * 0.1)
    setLastXp(xpEarned)
    setTotalXp(prev => prev + xpEarned)

    // Track mastery accuracy (non-boss scenes only — boss is the gate, not the test)
    if (currentScene.type !== "boss") {
      setQuizTotal(t => t + 1)
      if (choice.correct) setQuizCorrect(c => c + 1)
    }

    if (choice.correct) {
      sound.playCorrect()
      setTimeout(() => sound.playXP(), 380)
      const newStreak = streakCount + 1
      setStreakCount(newStreak)
      setStreak(prev => Math.max(prev, newStreak))
      if (newStreak >= 2) setTimeout(() => sound.playStreak(), 620)
      setShowBurst(true)
      setTimeout(() => setShowBurst(false), 1200)
      // Streak achievements
      if (newStreak === 3) setAchievement({ id: "streak_3", ts: Date.now() })
      if (newStreak === 5) setAchievement({ id: "streak_5", ts: Date.now() })
      setAiElaboration(undefined)
    } else {
      sound.playWrong()
      setStreakCount(0)
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 500)
      // Nudge the tutor bot — player may need help
      setPlayerStuck(true)
      setTimeout(() => setPlayerStuck(false), 100)

      // ── Deduct a life for wrong answers ──────────────────────────────────
      try {
        const currentLives = parseInt(localStorage.getItem("maestro_lives") ?? "3") || 3
        if (currentLives > 0) {
          const newLives = currentLives - 1
          localStorage.setItem("maestro_lives", String(newLives))
          setLives(newLives)
          // Notify dashboard / nav in real time
          window.dispatchEvent(new StorageEvent("storage", { key: "maestro_lives" }))
        }
      } catch {}

      // Trigger Claude API elaboration if scene has a question with choices
      if (currentScene.question && currentScene.choices) {
        const correctChoice = currentScene.choices.find(c => c.correct)
        if (correctChoice) {
          abortRef.current?.abort()
          abortRef.current = new AbortController()
          setAiElaboration(null) // loading
          fetch("/api/maestro-feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abortRef.current.signal,
            body: JSON.stringify({
              question: currentScene.question,
              wrongChoiceText: choice.text,
              correctChoiceText: correctChoice.text,
              concept: currentScene.concept?.title,
              scenarioText: currentScene.scenarioText,
            }),
          })
            .then(r => r.json())
            .then(data => setAiElaboration(data.elaboration ?? ""))
            .catch(err => { if (err.name !== "AbortError") setAiElaboration("") })
        }
      }
    }

    setShowXpBurst(true)
    setBurstKey(k => k + 1)
    setTimeout(() => setShowXpBurst(false), 1500)
  }, [state, currentScene, streakCount, sound, sceneIndex, totalScenes, game.scenes, game.felipeOutroVideo])

  /* ── Routes through Felipe transition + outro, or straight to EndScreen ───── */
  const completeGame = useCallback(() => {
    if (game.felipeOutroVideo) setState("felipe-transition")
    else setState("complete")
  }, [game.felipeOutroVideo])

  const advanceScene = useCallback(() => {
    // Award XP for passive scenes and completed puzzles (revelation, learn, handoff, match, order, construct)
    if (
      currentScene.type === "revelation" ||
      currentScene.type === "learn" ||
      currentScene.type === "handoff" ||
      currentScene.type === "match" ||
      currentScene.type === "order" ||
      currentScene.type === "construct"
    ) {
      if (currentScene.xpAward > 0) {
        setTotalXp(prev => prev + currentScene.xpAward)
        setLastXp(currentScene.xpAward)
        setShowXpBurst(true)
        setBurstKey(k => k + 1)
        setTimeout(() => setShowXpBurst(false), 1500)
      }
    }

    // ── nextLeadsTo: scene-level routing override (works on any scene type) ──
    if (currentScene.nextLeadsTo) {
      const targetIndex = findSceneIndexById(game.scenes, currentScene.nextLeadsTo)
      if (targetIndex !== -1) {
        sound.playTransition()
        setSceneIndex(targetIndex)
        setSelectedLabel(null)
        setState("playing")
        return
      }
    }

    // ── Branching: jump to specific scene by ID if leadsTo was set ───────────
    if (pendingLeadsTo) {
      const targetIndex = findSceneIndexById(game.scenes, pendingLeadsTo)
      setPendingLeadsTo(null)
      if (targetIndex !== -1) {
        const targetScene = game.scenes[targetIndex]
        if (targetScene.type === "consequence") {
          // Skip consequence scene and jump straight to felipe scene
          const nextIndex = targetIndex + 1
          if (nextIndex < game.scenes.length) {
            sound.playTransition()
            setSceneIndex(nextIndex)
            setSelectedLabel(null)
            setState("playing")
            return
          }
        }
        sound.playTransition()
        setSceneIndex(targetIndex)
        setSelectedLabel(null)
        setState("playing")
        return
      }
    }

    if (sceneIndex + 1 >= totalScenes) { completeGame(); return }

    // ── Mastery gate: check accuracy before boss scene ──
    const nextScene = game.scenes[sceneIndex + 1]
    if (nextScene?.type === "boss" && quizTotal > 0) {
      const accuracy = quizCorrect / quizTotal
      if (accuracy < 0.8) {
        setMasteryGateVisible(true)
        return
      }
    }

    sound.playTransition()
    setSceneIndex(i => i + 1)
    setSelectedLabel(null)
    setState("playing")
  }, [sceneIndex, totalScenes, currentScene, sound, game.scenes, quizTotal, quizCorrect, pendingLeadsTo, completeGame])

  const handleNext = useCallback(() => {
    sound.playClick()
    // Cancel any in-flight elaboration fetch and reset state
    abortRef.current?.abort()
    abortRef.current = null
    setAiElaboration(undefined)

    // Check if player ran out of lives
    if (lives <= 0) {
      setState("out-of-lives")
      return
    }

    advanceScene()
  }, [lives, advanceScene, sound])

  const handleBossComplete = useCallback((xpEarned: number) => {
    sound.playClick()
    setTotalXp(prev => prev + xpEarned)
    setLastXp(xpEarned)
    setShowXpBurst(true)
    setBurstKey(k => k + 1)
    setTimeout(() => setShowXpBurst(false), 1500)
    if (sceneIndex + 1 >= totalScenes) { completeGame(); return }
    sound.playTransition()
    setSceneIndex(i => i + 1)
    setSelectedLabel(null)
    setState("playing")
  }, [sceneIndex, totalScenes, sound, completeGame])

  const handleStart = () => {
    sound.playClick()
    sound.startAmbient("normal")
    // Save player name for certificate (persists across games)
    try {
      if (playerName.trim()) {
        localStorage.setItem("maestro_player_name", playerName.trim())
      }
    } catch {}
    setKodaBeatIndex(0)
    setState("koda-intro")
  }

  /** Continue from a felipe card — jump to the rejoinsAt scene ID */
  const handleFelipeContinue = useCallback(() => {
    sound.playClick()
    const rejoinsAt = currentScene?.felipeCard?.rejoinsAt
    if (rejoinsAt) {
      const targetIndex = findSceneIndexById(game.scenes, rejoinsAt)
      if (targetIndex !== -1) {
        sound.playTransition()
        setSceneIndex(targetIndex)
        setSelectedLabel(null)
        setState("playing")
        return
      }
    }
    // Fallback: sequential advance
    if (sceneIndex + 1 < game.scenes.length) {
      sound.playTransition()
      setSceneIndex(i => i + 1)
      setSelectedLabel(null)
      setState("playing")
    } else {
      completeGame()
    }
  }, [currentScene, game.scenes, sceneIndex, sound, completeGame])

  /** Track-select navigation — save track choice and navigate to first game */
  const handleTrackSelect = useCallback((nextGameSlug: string, trackId: string) => {
    sound.playClick()
    try { localStorage.setItem("maestro_track_selected", trackId) } catch {}
    sound.playTransition()
    window.location.href = `/games/${nextGameSlug}`
  }, [sound])

  /* ── Consequence scenes auto-advance after 5s ────────────────────────── */
  useEffect(() => {
    if (state !== "playing" || currentScene?.type !== "consequence") return
    const timer = setTimeout(() => {
      // Advance to next in sequence (should be the corresponding felipe scene)
      if (sceneIndex + 1 < game.scenes.length) {
        sound.playTransition()
        setSceneIndex(i => i + 1)
        setState("playing")
      }
    }, 5000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, sceneIndex])

  /* ── early-exit states ───────────────────────────────────────────────── */

  /* Hydration guard — return a black screen until client is mounted so SSR
     and client agree on the initial render (avoids video src mismatch). */
  if (!mounted) {
    return <div style={{ position: "fixed", inset: 0, background: "#000" }} />
  }

  /* 1 — MaestroPlay brand opener — always plays first, muted, no game-specific branding */
  if (state === "brand-video") {
    return (
      <VideoIntro
        src="/videos/MaestroPlayVideo.mp4"
        onComplete={() => {
          if (game.introVideo) setState("video")           // → game-specific intro next
          else {
            sound.setGameVolume(0.5)
            // Skip story beats if the game has none — go straight to intro card
            if (game.intro?.beats?.length) setState("story")
            else setState("intro")
          }
        }}
        startMusic={() => {
          // Only start ambient music here if no game-specific video follows.
          // If there IS a game-specific video, music starts after that video ends instead,
          // so Jake's voice + Sparks of Vienna don't clash with the ambient track.
          if (!game.introVideo) sound.startAmbient("cinematic", 52)
        }}
        gameTitle={game.title}
        gameEmoji={game.emoji}
        accentColor={game.accentColor}
        hasAudio={false}
      />
    )
  }

  /* 2 — Game-specific intro video (e.g. jake-confession.mp4) — plays second */
  if (state === "video") {
    return (
      <VideoIntro
        src={game.introVideo!}
        onComplete={() => {
          sound.setGameVolume(0.5)
          // Video told the story — always skip beats and go straight to intro card
          setState("intro")
        }}
        startMusic={() => sound.startAmbient("cinematic", 52)}
        gameTitle={game.title}
        gameEmoji={game.emoji}
        accentColor={game.accentColor}
        hasAudio={true}
        hearLabel={game.characterName ?? "Jake"}
      />
    )
  }
  if (state === "story") {
    return (
      <CinematicIntro
        onComplete={() => setState("intro")}
        startMusic={() => sound.startAmbient("cinematic")}
        intro={game.intro}
        fastText={fastText}
      />
    )
  }
  /* Conductor's Strike transition — 1.45s boom before Felipe video */
  if (state === "felipe-transition") {
    return (
      <FelipeTransition
        accent={game.accentColor ?? "#00d4f0"}
        onComplete={() => setState("felipe")}
      />
    )
  }

  /* Felipe Maestro closing video — plays fullscreen before EndScreen */
  if (state === "felipe" && game.felipeOutroVideo) {
    return (
      <VideoIntro
        src={game.felipeOutroVideo}
        onComplete={() => setState("complete")}
        startMusic={() => {}}
        gameTitle={game.title}
        gameEmoji={game.emoji}
        accentColor={game.accentColor}
        hasAudio={true}
        hearLabel="the Maestro"
      />
    )
  }

  if (state === "out-of-lives") {
    const conceptTitle = currentScene?.concept?.title || "AI Prompt Construction"
    const conceptBody = currentScene?.concept?.body || "AI responses depend entirely on the context and specificity you provide. Give it clear instructions, boundaries, and a persona to act from."

    const handleRefillXp = () => {
      sound.playClick()
      setTotalXp(prev => Math.max(0, prev - 50))
      setLives(3)
      try {
        localStorage.setItem("maestro_lives", "3")
        window.dispatchEvent(new StorageEvent("storage", { key: "maestro_lives" }))
      } catch {}
      advanceScene()
    }

    const handleCodaResolve = () => {
      sound.playClick()
      setLives(3)
      try {
        localStorage.setItem("maestro_lives", "3")
        window.dispatchEvent(new StorageEvent("storage", { key: "maestro_lives" }))
      } catch {}
      setCodaReviewStep(false)
      advanceScene()
    }

    const handleRestartChapter = () => {
      sound.playClick()
      setSceneIndex(0)
      setLives(3)
      try {
        localStorage.setItem("maestro_lives", "3")
        window.dispatchEvent(new StorageEvent("storage", { key: "maestro_lives" }))
      } catch {}
      setStreakCount(0)
      setState("playing")
    }

    return (
      <div style={{
        height: "100dvh",
        background: "#08060f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Shimmering grid background */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          opacity: 0.35,
          pointerEvents: "none",
        }} />
        
        {/* Glow ambient spots */}
        <div style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          top: "10%",
          left: "30%",
          background: codaReviewStep ? "radial-gradient(circle, rgba(0, 212, 240, 0.08) 0%, transparent 70%)" : "radial-gradient(circle, rgba(255, 75, 75, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }} />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes heart-broken-shake {
            0%, 100% { transform: scale(1) rotate(0deg); }
            15% { transform: scale(1.08) rotate(-6deg); }
            30% { transform: scale(0.96) rotate(4deg); }
            45% { transform: scale(1.04) rotate(-3deg); }
            60% { transform: scale(0.98) rotate(2deg); }
            75% { transform: scale(1.02) rotate(-1deg); }
          }
        `}} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "rgba(13, 10, 25, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: codaReviewStep ? "1px solid rgba(0, 212, 240, 0.22)" : "1px solid rgba(255, 75, 75, 0.22)",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            boxShadow: codaReviewStep ? "0 0 50px rgba(0, 212, 240, 0.08), 0 20px 50px rgba(0,0,0,0.5)" : "0 0 50px rgba(255, 75, 75, 0.08), 0 20px 50px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.8rem",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {!codaReviewStep ? (
            <>
              {/* Broken Heart Section */}
              <div style={{ position: "relative" }}>
                <span style={{
                  fontSize: "5.5rem",
                  display: "inline-block",
                  filter: "drop-shadow(0 0 24px rgba(255, 75, 75, 0.5))",
                  animation: "heart-broken-shake 1.8s ease-in-out infinite",
                  lineHeight: 1,
                  userSelect: "none"
                }}>
                  💔
                </span>
              </div>

              {/* Title and Message */}
              <div>
                <h1 style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: "1.75rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #ff4b4b, #e040fb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: "0 0 0.6rem 0",
                }}>
                  HEARTS EMPTY
                </h1>
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.92rem",
                  color: "rgba(240, 238, 255, 0.82)",
                  lineHeight: 1.55,
                  margin: 0,
                }}>
                  You&apos;ve run out of lives on this chapter. Every maestro makes mistakes — the key is how you choose to recover.
                </p>
              </div>

              {/* Recovery Action Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", width: "100%" }}>
                {/* 1. Spend 50 XP (if possible) */}
                <button
                  onClick={handleRefillXp}
                  disabled={totalXp < 50}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    borderRadius: "14px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: totalXp >= 50 ? "#08060f" : "rgba(255,255,255,0.25)",
                    background: totalXp >= 50 
                      ? "linear-gradient(90deg, #ff4b4b, #ff7b00)"
                      : "rgba(255,255,255,0.04)",
                    border: totalXp >= 50 ? "none" : "1px solid rgba(255,255,255,0.06)",
                    cursor: totalXp >= 50 ? "pointer" : "not-allowed",
                    boxShadow: totalXp >= 50 ? "0 4px 20px rgba(255,75,75,0.25)" : "none",
                    transition: "transform 0.15s, filter 0.15s",
                  }}
                  onMouseEnter={e => { if (totalXp >= 50) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.08)" } }}
                  onMouseLeave={e => { if (totalXp >= 50) { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = "" } }}
                >
                  Spend 50 XP to Refill Hearts
                </button>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.74rem",
                  color: "rgba(240,238,255,0.4)",
                  marginTop: "-0.4rem"
                }}>
                  You currently have {totalXp} XP {totalXp < 50 && "(Need 50 XP)"}
                </span>

                {/* 2. Review with Coda */}
                <button
                  onClick={() => { sound.playClick(); setCodaReviewStep(true); }}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    borderRadius: "14px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#fff",
                    background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 24px rgba(0,212,240,0.25)",
                    transition: "transform 0.15s, filter 0.15s",
                    marginTop: "0.4rem"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.08)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = "" }}
                >
                  Review Lesson with Coda (Free Refill)
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem 0" }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(240,238,255,0.25)" }}>or</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* 3. Restart Chapter */}
                <button
                  onClick={handleRestartChapter}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "12px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    color: "rgba(240,238,255,0.7)",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    transition: "transform 0.15s, background 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)" }}
                >
                  Restart Chapter
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Coda Lesson View */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", alignSelf: "flex-start", textAlign: "left" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "rgba(0,0,0,0.4)",
                  border: "1.5px solid var(--cyan)",
                  boxShadow: "0 0 12px rgba(0, 212, 240, 0.4)",
                  flexShrink: 0
                }}>
                  <img
                    src="/images/ai-tutor.png"
                    alt="Coda"
                    style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "screen", transform: "scale(1.1)" }}
                  />
                </div>
                <div>
                  <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--cyan)", margin: 0 }}>
                    Tutor Lesson with Coda
                  </h2>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "rgba(240,238,255,0.3)" }}>
                    Closing the learning gap
                  </span>
                </div>
              </div>

              {/* Chat-style lesson content bubble */}
              <div style={{
                width: "100%",
                padding: "1.2rem",
                borderRadius: "16px 16px 16px 4px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                textAlign: "left",
                fontFamily: "Inter, sans-serif",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
              }}>
                <p style={{ margin: 0, fontSize: "0.86rem", color: "rgba(240,238,255,0.9)", lineHeight: 1.55 }}>
                  Mistakes are just feedback in training! Here is the core concept you need to remember for this topic:
                </p>
                <div style={{
                  padding: "0.85rem 1rem",
                  background: "rgba(0, 212, 240, 0.05)",
                  borderLeft: "3px solid var(--cyan)",
                  borderRadius: "0 10px 10px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem"
                }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cyan)" }}>
                    {conceptTitle}
                  </span>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(240,238,255,0.8)", lineHeight: 1.45 }}>
                    {conceptBody}
                  </p>
                </div>
              </div>

              {/* Confirm lesson button */}
              <button
                onClick={handleCodaResolve}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "14px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  color: "#08060f",
                  background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(0,212,240,0.35)",
                  transition: "transform 0.15s, filter 0.15s",
                  marginTop: "0.5rem"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.08)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.filter = "" }}
              >
                I Understand — Continue →
              </button>
            </>
          )}
        </motion.div>
      </div>
    )
  }

  if (state === "complete") {
    return <EndScreen game={game} totalXp={totalXp} streak={streak} choiceHistory={choiceHistory} />
  }

  if (state === "koda-intro") {
    const activeBeat = KODA_INTRO_BEATS[kodaBeatIndex]
    const nextBeat = handleNextKodaBeat

    // Dynamic speaker style settings
    const isFelipe = activeBeat.speaker === "Felipe"
    const isSystem = activeBeat.speaker === "SYSTEM"
    const isBoth = activeBeat.speaker === "Coda & Felipe"
    
    const borderColor = isSystem 
      ? "rgba(255, 255, 255, 0.2)" 
      : isBoth
        ? "rgba(0, 212, 240, 0.45)"
        : isFelipe 
          ? "rgba(224, 64, 251, 0.45)" 
          : "rgba(0, 212, 240, 0.45)"

    const tagColor = isSystem 
      ? "rgba(255, 255, 255, 0.45)" 
      : isBoth
        ? "rgba(0, 212, 240, 0.9)"
        : isFelipe 
          ? "#e040fb" 
          : "var(--cyan)"

    const glowColor = isSystem 
      ? "rgba(255, 255, 255, 0.05)" 
      : isBoth
        ? "rgba(0, 212, 240, 0.25)"
        : isFelipe 
          ? "rgba(224, 64, 251, 0.25)" 
          : "rgba(0, 212, 240, 0.25)"

    const btnGradient = isSystem
      ? "linear-gradient(90deg, #6b7280, #374151)"
      : isFelipe
        ? "linear-gradient(90deg, #e040fb, #ff6d00)"
        : "linear-gradient(90deg, #00d4f0, #e040fb)"

    const btnShadow = isSystem
      ? "rgba(107, 114, 128, 0.15)"
      : isFelipe
        ? "rgba(224, 64, 251, 0.35)"
        : "rgba(0, 212, 240, 0.35)"

    const portraitBorder = isSystem
      ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)"
      : isFelipe
        ? "linear-gradient(135deg, rgba(224,64,251,0.4) 0%, rgba(255,109,0,0.4) 100%)"
        : "linear-gradient(135deg, rgba(0,212,240,0.4) 0%, rgba(224,64,251,0.4) 100%)"

    return (
      <div
        onClick={() => {
          if (!kodaTypingDone) {
            setFastText(true)
          } else {
            handleNextKodaBeat()
          }
        }}
        style={{
          height: "100dvh",
          background: "#08060f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
          overflow: "hidden"
        }}
      >
        {/* Dynamic global styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes intro-scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          @keyframes intro-hologram-flicker {
            0%, 100% { opacity: 0.96; filter: drop-shadow(0 0 16px rgba(0, 212, 240, 0.35)); }
            50%      { opacity: 1.0; filter: drop-shadow(0 0 32px rgba(0, 212, 240, 0.65)); }
          }

          @keyframes voice-bar-pulse {
            0%, 100% { height: 3px; }
            50% { height: 18px; }
          }
          @keyframes dialog-glow {
            0%, 100% { box-shadow: 0 0 24px rgba(0, 212, 240, 0.06); }
            50% { box-shadow: 0 0 42px rgba(0, 212, 240, 0.16); }
          }
        `}} />

        {/* Dynamic Nodes Web Canvas */}
        <canvas 
          ref={introCanvasRef} 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            zIndex: 1, 
            pointerEvents: "none", 
            opacity: 0.45 
          }} 
        />

        {/* CRT Scanline Overlay */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04))",
          backgroundSize: "100% 4px, 6px 100%",
          zIndex: 5,
          pointerEvents: "none",
          opacity: 0.08,
        }} />

        {/* Ambient background glows */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,212,240,0.08) 0%, transparent 65%)", pointerEvents: "none", zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(224,64,251,0.06) 0%, transparent 65%)", pointerEvents: "none", zIndex: 2 }} />
        
        {/* Floating notes */}
        <FloatingNotes mood="revelation" />

        {/* Dynamic Portrait Display */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
          {isBoth ? (
            <div style={{
              display: "flex",
              position: "relative",
              width: "250px",
              height: "150px",
              justifyContent: "center",
              alignItems: "center",
            }}>
              {/* Coda Portrait (Left, slightly back) */}
              <div style={{
                position: "absolute",
                left: "15px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(0,212,240,0.4) 0%, rgba(224,64,251,0.4) 100%)",
                padding: "3px",
                boxShadow: `0 0 30px rgba(0, 212, 240, 0.25)`,
                animation: "maestro-pulse 4s ease-in-out infinite",
                zIndex: 11,
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#0c0816",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}>
                  <img
                    src="/images/ai-tutor.png?v=2"
                    alt="Coda"
                    className="char-breathe"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      mixBlendMode: "screen",
                      transform: "scale(1.15)",
                      objectPosition: "center",
                      animation: "intro-hologram-flicker 5s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>

              {/* Felipe Portrait (Right, overlapping slightly in front) */}
              <div style={{
                position: "absolute",
                right: "15px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(224,64,251,0.4) 0%, rgba(255,109,0,0.4) 100%)",
                padding: "3px",
                boxShadow: `0 0 35px rgba(224, 64, 251, 0.3)`,
                animation: "maestro-pulse 4s ease-in-out infinite 1s",
                zIndex: 12,
              }}>
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#0c0816",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}>
                  <img
                    src="/images/maestroplayer1.png?v=2"
                    alt="Felipe"
                    className="char-breathe"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      mixBlendMode: "normal",
                      transform: "scale(1.0)",
                      objectPosition: "center",
                      animation: "intro-hologram-flicker 5s ease-in-out infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: portraitBorder,
              padding: "3px",
              boxShadow: `0 0 50px ${glowColor}`,
              animation: "maestro-pulse 4s ease-in-out infinite",
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background: "#0c0816",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
                <img
                  src={
                    isSystem
                      ? "/images/ai-character.png?v=2"
                      : isFelipe
                        ? "/images/maestroplayer1.png?v=2"
                        : "/images/ai-tutor.png?v=2"
                  }
                  alt={activeBeat.speaker}
                  className="char-breathe"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    mixBlendMode: isSystem || isFelipe ? "normal" : "screen",
                    transform: isSystem ? "scale(1)" : (isFelipe ? "scale(1.0)" : "scale(1.15)"),
                    objectPosition: "center",
                    animation: isSystem ? "none" : "intro-hologram-flicker 5s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          )}
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: tagColor,
            textShadow: isSystem ? "none" : `0 0 10px ${glowColor}`
          }}>
            {isSystem 
              ? "Socratic Network" 
              : isBoth
                ? "Coda & Felipe · The Guides"
                : isFelipe 
                  ? "Felipe · The Maestro" 
                  : "Coda Companion"}
          </div>
        </div>

        {/* Dialogue Box */}
        <div style={{
          position: "absolute",
          bottom: "4rem",
          left: "2rem",
          right: "2rem",
          maxWidth: "700px",
          width: "calc(100% - 4rem)",
          margin: "0 auto",
          background: "rgba(6, 4, 14, 0.95)",
          border: `1.5px solid ${borderColor}`,
          borderRadius: "20px",
          padding: "1.5rem 2rem",
          boxShadow: `0 0 32px ${glowColor}`,
          animation: "dialog-glow 4s ease-in-out infinite",
          zIndex: 10,
          cursor: kodaTypingDone ? "pointer" : "default",
          boxSizing: "border-box"
        }}
        onClick={() => { if (kodaTypingDone) nextBeat() }}
        >
          {/* Speaker Tag & Visualizer row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem"
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.62rem",
              fontWeight: 900,
              letterSpacing: "0.15em",
              color: tagColor,
              textTransform: "uppercase",
            }}>
              {activeBeat.speaker}
            </div>

            {/* Vocal wave visualizer */}
            {!kodaTypingDone && !isSystem && (
              <div style={{ display: "flex", alignItems: "center", gap: "2.5px", height: "18px" }}>
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "2.5px",
                      background: tagColor,
                      borderRadius: "100px",
                      animation: "voice-bar-pulse 0.35s ease-in-out infinite alternate",
                      animationDelay: `${idx * 0.06}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Dialogue Text */}
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "rgba(240,238,255,0.95)",
            lineHeight: 1.6,
            margin: 0,
            minHeight: "4.5rem"
          }}>
            {kodaTypedText}
            {!kodaTypingDone && (
              <span style={{
                display: "inline-block",
                width: "6px",
                height: "14px",
                background: tagColor,
                marginLeft: "3px",
                animation: "dlg-cursor 0.75s infinite"
              }} />
            )}
          </p>

          {/* Auto-advance progress bar — thin glowing line sweeping across */}
          {kodaTypingDone && (
            <div style={{ width: "100%", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden", marginTop: "0.75rem" }}>
              <div style={{
                height:     "100%",
                width:      `${kodaAutoProgress}%`,
                background: btnGradient,
                borderRadius: "2px",
                boxShadow:  `0 0 6px ${tagColor}`,
                transition: kodaAutoProgress === 0 ? "none" : "width 0.05s linear",
              }} />
            </div>
          )}

          {/* Continue button inside dialogue box */}
          {kodaTypingDone && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                onClick={(e) => { e.stopPropagation(); nextBeat() }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  color: "#08060f",
                  background: btnGradient,
                  border: "none",
                  borderRadius: "100px",
                  padding: "0.5rem 1.75rem",
                  cursor: "pointer",
                  boxShadow: `0 0 16px ${btnShadow}`,
                  letterSpacing: "0.02em",
                  transition: "transform 0.15s, box-shadow 0.15s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.04)"
                  e.currentTarget.style.boxShadow = `0 0 24px ${btnShadow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = `0 0 16px ${btnShadow}`
                }}
              >
                {kodaBeatIndex + 1 < KODA_INTRO_BEATS.length ? "Continue" : "Begin Game →"}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSelectScene = (sceneId: string) => {
    const idx = game.scenes.findIndex(s => s.id === sceneId)
    if (idx !== -1) {
      setSceneIndex(idx)
      setState("playing")
      setDialogueDone(false)
      setCompletedDialogueSceneIndex(null)
      setShowMap(false)
    }
  }

  const progressPct = (sceneIndex / totalScenes) * 100
  const isBoss      = currentScene?.type === "boss"
  const sceneBgImage = currentScene?.location ? getSceneBgImage(currentScene.location) : ""

  /* ── Framer Motion variants ──────────────────────────────────────────── */
  const regularVariants = {
    initial: { opacity: 0, x: 38 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -22 },
  }
  const bossVariants = {
    initial: { opacity: 0, scale: 0.93, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1,    filter: "blur(0px)" },
    exit:    { opacity: 0, scale: 0.97, filter: "blur(4px)" },
  }
  const regularTransition = {
    x:       { type: "spring" as const, stiffness: 420, damping: 38 },
    opacity: { duration: 0.18 },
  }
  const bossTransition = {
    scale:   { type: "spring" as const, stiffness: 300, damping: 26 },
    opacity: { duration: 0.28 },
    filter:  { duration: 0.32 },
  }

  return (
    <div ref={engineRootRef} style={{ height: "100dvh", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>

      <FloatingNotes mood={currentMood} />
      <AchievementToast trigger={achievement} />
      <StoryMap
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        currentSceneId={currentScene?.id}
        accentColor={game.accentColor}
        onSelectScene={handleSelectScene}
      />

      {/* ── AI Tutor Bot — hidden during intros, endings, and boss (has own UI) ── */}
      {(state === "playing" || state === "answered") &&
        currentScene?.type !== "boss" &&
        currentScene?.type !== "track-select" &&
        currentScene?.type !== "consequence" &&
        currentScene?.type !== "felipe" && (
        <TutorBot
          scene={currentScene}
          game={game}
          accentColor={game.accentColor}
          playerStuck={playerStuck}
        />
      )}

      {/* ── Boss entrance flash overlay (GSAP controlled) ──── */}
      <div
        ref={bossOverlayRef}
        style={{
          display:        "none",
          position:       "fixed",
          inset:          0,
          background:     "radial-gradient(ellipse at 50% 40%, rgba(224,64,251,0.55) 0%, rgba(123,47,190,0.85) 40%, rgba(8,6,15,0.95) 100%)",
          zIndex:         200,
          pointerEvents:  "none",
        }}
      />

      {/* ── Mastery Gate overlay ──── */}
      {masteryGateVisible && (
        <div style={{
          position:      "fixed", inset: 0, zIndex: 300,
          background:    "rgba(8,6,15,0.94)",
          backdropFilter:"blur(24px)",
          display:       "flex", alignItems: "center", justifyContent: "center",
          padding:       "2rem",
          animation:     "maestro-gate-in 0.5s cubic-bezier(0.34,1.1,0.64,1) both",
        }}>
          <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
            {/* Conductor icon */}
            <div style={{
              width:"72px", height:"72px", borderRadius:"50%", margin:"0 auto 1.5rem",
              background:"linear-gradient(135deg, rgba(224,64,251,0.15) 0%, rgba(123,47,190,0.15) 100%)",
              border:"1.5px solid rgba(224,64,251,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"2rem",
              boxShadow:"0 0 40px rgba(224,64,251,0.2)",
            }}>
              🎼
            </div>

            {/* Title */}
            <div style={{
              fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.55rem",
              letterSpacing:"0.32em", textTransform:"uppercase",
              color:"rgba(224,64,251,0.6)", marginBottom:"0.65rem",
            }}>
              The Maestro Intervenes
            </div>
            <h2 style={{
              fontFamily:"Cormorant Garamond, serif", fontWeight:700,
              fontSize:"clamp(1.6rem, 4vw, 2.2rem)", color:"#fff",
              lineHeight:1.15, marginBottom:"1rem",
            }}>
              The conductor's door is closed.
            </h2>

            {/* Accuracy display */}
            <div style={{
              display:"inline-flex", alignItems:"baseline", gap:"0.4rem",
              background:"rgba(224,64,251,0.07)", border:"1px solid rgba(224,64,251,0.2)",
              borderRadius:"16px", padding:"1rem 2rem", marginBottom:"1.25rem",
            }}>
              <span style={{
                fontFamily:"Inter, sans-serif", fontWeight:900,
                fontSize:"3rem", color:"var(--pink)", lineHeight:1,
              }}>
                {Math.round((quizCorrect / quizTotal) * 100)}%
              </span>
              <span style={{
                fontFamily:"Inter, sans-serif", fontSize:"0.8rem",
                color:"rgba(240,238,255,0.5)",
              }}>
                accuracy
              </span>
            </div>

            <p style={{
              fontFamily:"Cormorant Garamond, serif", fontStyle:"italic",
              fontSize:"1.05rem", color:"rgba(240,238,255,0.55)",
              lineHeight:1.65, marginBottom:"2rem",
            }}>
              "{quizCorrect} of {quizTotal} questions answered correctly. The conductor test demands 80% — the maestro expects precision before the stage."
            </p>

            {/* Buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", maxWidth:"360px", margin:"0 auto" }}>
              <button
                onClick={() => {
                  // Proceed to boss anyway — the brave path
                  setMasteryGateVisible(false)
                  sound.playTransition()
                  setSceneIndex(i => i + 1)
                  setSelectedLabel(null)
                  setLastXp(0)
                  setState("playing")
                }}
                style={{
                  fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.95rem",
                  color:"#fff",
                  background:"linear-gradient(90deg, #e040fb, #7b2fbe)",
                  padding:"0.9rem 2rem", borderRadius:"100px", border:"none",
                  cursor:"pointer", letterSpacing:"0.02em",
                  boxShadow:"0 0 32px rgba(224,64,251,0.3)",
                  transition:"transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 48px rgba(224,64,251,0.45)" }}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 32px rgba(224,64,251,0.3)" }}
              >
                Challenge the conductor anyway →
              </button>

              <button
                onClick={() => {
                  // Go back — let them keep reviewing where they are
                  setMasteryGateVisible(false)
                }}
                style={{
                  fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:"0.875rem",
                  color:"rgba(240,238,255,0.45)",
                  background:"transparent", border:"1px solid rgba(255,255,255,0.1)",
                  padding:"0.8rem 2rem", borderRadius:"100px",
                  cursor:"pointer", letterSpacing:"0.02em",
                  transition:"color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color="rgba(240,238,255,0.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.22)" }}
                onMouseLeave={e => { e.currentTarget.style.color="rgba(240,238,255,0.45)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)" }}
              >
                ← Review the material
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: isBoss
          ? "radial-gradient(ellipse at 50% 30%, rgba(224,64,251,0.06) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(123,47,190,0.07) 0%, transparent 50%)"
          : currentScene?.type === "revelation"
          ? "radial-gradient(ellipse at 50% 40%, rgba(0,212,240,0.07) 0%, transparent 55%), radial-gradient(ellipse at 50% 60%, rgba(123,47,190,0.08) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(0,212,240,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(123,47,190,0.06) 0%, transparent 50%)",
        transition: "background 1.2s ease",
        animation: shouldShake ? "screen-shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97)" : "none",
      }} />

      {/* Correct answer flash — green */}
      {showBurst && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 150, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, rgba(0, 230, 118, 0.18) 0%, transparent 65%)",
          animation: "correct-flash 0.7s ease-out forwards",
        }} />
      )}

      {/* Wrong answer flash — red */}
      {shouldShake && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 150, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 50%, rgba(255, 50, 50, 0.22) 0%, transparent 65%)",
          animation: "wrong-flash 0.6s ease-out forwards",
        }} />
      )}

      {showBurst    && <CorrectBurst />}
      {showXpBurst && lastXp > 0 && <XPBurstLottie xp={lastXp} accent={game.accentColor ?? "#ffd740"} key={String(burstKey)} />}


      {/* Duolingo-style unified Header */}
      {state !== "intro" && state !== "felipe" && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          background: "rgba(8, 6, 15, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "2px solid rgba(255, 255, 255, 0.08)",
          zIndex: 100,
        }}>
          {/* Left: Exit button */}
          <Link href="/games" style={{
            color: "rgba(240, 238, 255, 0.6)",
            fontSize: "1.5rem",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "color 0.2s, transform 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.15)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(240, 238, 255, 0.6)"; e.currentTarget.style.transform = "scale(1)" }}
          title="Exit game"
          >
            ✕
          </Link>

          {/* Center: Thick, rounded, glossy progress bar */}
          <div style={{
            flex: 1,
            height: "16px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}>
            <div style={{
              height: "100%",
              width: `${progressPct}%`,
              background: isBoss
                ? "linear-gradient(180deg, #ff6beb 0%, #e040fb 50%, #7b2fbe 100%)"
                : "linear-gradient(180deg, #5ce1e6 0%, #00d4f0 50%, #00b4cc 100%)",
              borderRadius: "999px",
              transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute",
                top: "1px",
                left: "4px",
                right: "4px",
                height: "4px",
                background: "rgba(255, 255, 255, 0.45)",
                borderRadius: "999px",
                pointerEvents: "none",
              }} />
            </div>
          </div>

          {/* Right: Stats row (Streak 🔥, XP counter ⚡, Lives/Hearts ❤️, Sound toggle 🔊) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}>
            {/* Map toggle */}
            <button
              onClick={() => { sound.playClick(); setShowMap(true) }}
              title="View Chapter Map"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.2rem",
                fontSize: "1.25rem",
                lineHeight: 1,
                color: "rgba(240,238,255,0.6)",
                transition: "color 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "" }}
            >
              🗺️
            </button>

            {/* Fast Text toggle */}
            <button
              onClick={() => setFastText(prev => !prev)}
              title={fastText ? "Standard Text Speed" : "Fast Text Mode (Skip animations)"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.2rem",
                fontSize: "1.2rem",
                lineHeight: 1,
                color: fastText ? "#ffd700" : "rgba(240,238,255,0.6)",
                transition: "color 0.2s, transform 0.15s, text-shadow 0.2s",
                textShadow: fastText ? "0 0 8px rgba(255, 215, 0, 0.6)" : "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "" }}
            >
              ⚡
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => { const m = sound.toggleMute(); setIsMuted(m) }}
              title={isMuted ? "Unmute music" : "Mute music"}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.2rem",
                fontSize: "1.2rem",
                lineHeight: 1,
                color: isMuted ? "rgba(240,238,255,0.28)" : "rgba(240,238,255,0.6)",
                transition: "color 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.15)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "" }}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>

            {/* Streak */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "rgba(255, 150, 0, 0.1)",
              border: "1px solid rgba(255, 150, 0, 0.25)",
              borderRadius: "12px",
              padding: "0.3rem 0.6rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "0.85rem",
              color: "#ff9600",
              animation: streakCount >= 2 ? "streak-pop 0.3s ease" : "none",
            }}>
              <span>{streak}</span>
              <span>🔥</span>
            </div>

            {/* XP Counter */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "rgba(255, 215, 0, 0.1)",
              border: "1px solid rgba(255, 215, 0, 0.25)",
              borderRadius: "12px",
              padding: "0.3rem 0.6rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "0.85rem",
              color: "#ffd700",
              minWidth: "60px",
              justifyContent: "center",
            }}>
              <span>{totalXp}</span>
              <span>⚡</span>
            </div>

            {/* Lives / Hearts */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(255, 75, 75, 0.1)",
              border: "1px solid rgba(255, 75, 75, 0.25)",
              borderRadius: "12px",
              padding: "0.3rem 0.6rem",
            }}>
              {Array.from({ length: 3 }).map((_, idx) => {
                const heartNum = idx + 1;
                const isLost = lives < heartNum;
                return (
                  <span
                    key={idx}
                    className={isLost ? "heart-shattered" : "heart-active"}
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: 1,
                      cursor: "default",
                      userSelect: "none",
                      filter: isLost ? "grayscale(1) opacity(0.25)" : "none",
                    }}
                  >
                    ❤️
                  </span>
                );
              })}
            </div>

            {/* Developer testing button: drains 1 heart per click, goes to out-of-lives at 0 */}
            {typeof window !== "undefined" && window.location.search.includes("dev=true") && (
              <button
                id="dev-drain-heart"
                onClick={() => {
                  sound.playClick()
                  const newLives = Math.max(0, lives - 1);
                  setLives(newLives);
                  try {
                    localStorage.setItem("maestro_lives", String(newLives));
                    window.dispatchEvent(new StorageEvent("storage", { key: "maestro_lives" }));
                  } catch {}
                  if (newLives === 0) {
                    setState("out-of-lives");
                  }
                }}
                style={{
                  background: "rgba(224, 64, 251, 0.15)",
                  border: "1px solid rgba(224, 64, 251, 0.3)",
                  borderRadius: "12px",
                  color: "#e040fb",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.3rem 0.65rem",
                  cursor: "pointer",
                  transition: "transform 0.1s, background 0.1s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.background = "rgba(224, 64, 251, 0.25)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.background = "rgba(224, 64, 251, 0.15)" }}
                title="Dev Tool: Drain 1 Heart. Trigger Out-of-Lives when 0."
              >
                🔧 DRAIN
              </button>
            )}
          </div>
        </div>
      )}

      {/* ——— INTRO SCREEN ——— */}
      <AnimatePresence>
        {state === "intro" && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.28 } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "fixed", inset: 0, zIndex: 10, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}
          >
            {/* Character art as cinematic backdrop */}
            {game.characterImage && (
              <>
                {/* Scene background image (bedroom, etc) */}
                {game.intro?.sceneImage && (
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${game.intro.sceneImage})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    filter: "blur(0px) brightness(0.35)",
                  }} />
                )}
                {/* Full blurred atmospheric fill from character */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${game.characterImage})`,
                  backgroundSize: "cover", backgroundPosition: "center top",
                  filter: "blur(50px) saturate(1.4) brightness(0.25)",
                  transform: "scale(1.15)",
                  mixBlendMode: "screen",
                }} />
                {/* Sharp character art — centered, shows full figure */}
                <div style={{
                  position: "absolute", bottom: 0, left: "50%",
                  transform: "translateX(-50%)",
                  height: isMobile ? "58vh" : "82vh", maxWidth: "420px", width: "100%",
                  maskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 8%, black 30%, black 72%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.6) 8%, black 30%, black 72%, transparent 100%)",
                }}>
                  {game.protagonistVideo ? (
                    <video
                      src={game.protagonistVideo}
                      autoPlay loop muted playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
                    />
                  ) : (
                    <img src={game.characterImage} alt={game.characterName ?? ""} draggable={false}
                      className="char-breathe"
                      style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center", display: "block", animation: "maestro-pulse 4s ease-in-out infinite, char-breathe 4s ease-in-out infinite", transformOrigin: "bottom center" }} />
                  )}
                </div>
              </>
            )}

            {/* Dark gradient at bottom for text legibility */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,6,15,0.98) 0%, rgba(8,6,15,0.75) 28%, rgba(8,6,15,0.2) 55%, transparent 75%)", pointerEvents: "none" }} />
            {/* Dark vignette at top for nav area */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,6,15,0.7) 0%, transparent 25%)", pointerEvents: "none" }} />
            {/* Accent color tint */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 80%, ${game.accentColor ?? "rgba(0,212,240,0.1)"} 0%, transparent 55%)`, pointerEvents: "none", opacity: 0.4 }} />

            {/* Content panel — bottom anchored */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 28 }}
              style={{ position: "relative", zIndex: 5, maxWidth: "540px", width: "100%", padding: "0 2rem 3rem", textAlign: "center" }}
            >
              {/* Character chip */}
              {game.characterName && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 380, damping: 28 }}
                  style={{ marginBottom: "0.6rem" }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", background: `${game.accentColor ?? "rgba(0,212,240,0.08)"}18`, border: `1px solid ${game.accentColor ?? "rgba(0,212,240,0.3)"}55`, borderRadius: "100px", padding: "0.22rem 0.85rem" }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: game.accentColor ?? "var(--cyan)", boxShadow: `0 0 6px ${game.accentColor ?? "var(--cyan)"}` }} />
                    <span style={{ fontFamily: "Inter,sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: game.accentColor ?? "var(--cyan)" }}>
                      {game.characterName}{game.characterRole ? ` · ${game.characterRole}` : ""}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Game label */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "0.6rem", fontSize: "0.58rem" }}>
                  Game {game.week} · {game.duration}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, type: "spring", stiffness: 320, damping: 26 }}
                style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(1.8rem, 6vw, 2.8rem)", color: "#fff", lineHeight: 1.08, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}
              >
                {game.title}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.52 }}
                style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1rem", color: "rgba(240,238,255,0.55)", marginBottom: welcomeBack ? "0.75rem" : "1.5rem", lineHeight: 1.55 }}
              >
                &ldquo;{game.tagline}&rdquo;
              </motion.p>

              {/* ── "World Remembers You" — return greeting ───────────────── */}
              {welcomeBack && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 380, damping: 28 }}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    background: `${game.accentColor ?? "rgba(0,212,240,0.08)"}1a`,
                    border: `1px solid ${game.accentColor ?? "rgba(0,212,240,0.25)"}55`,
                    borderRadius: "100px", padding: "0.38rem 1rem",
                  }}>
                    <span style={{ fontSize: "0.9rem" }}>👋</span>
                    <span style={{
                      fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                      fontSize: "0.88rem", color: "rgba(240,238,255,0.72)", lineHeight: 1.4,
                    }}>
                      {welcomeBack}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Scene pips — staggered entrance */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                style={{ display: "flex", gap: "0.4rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}
              >
                {game.scenes.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: 0.62 + i * 0.04, type: "spring", stiffness: 480, damping: 30 }}
                    style={{ width: "22px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.18)", transformOrigin: "left", boxShadow: "none" }}
                  />
                ))}
              </motion.div>

              {/* Conductor Onboarding Briefing */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.63, type: "spring", stiffness: 350, damping: 28 }}
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: `1.5px solid ${showBriefing ? (game.accentColor ?? "rgba(0, 212, 240, 0.25)") : "rgba(255, 255, 255, 0.08)"}`,
                  borderRadius: "16px",
                  padding: showBriefing ? "1rem 1.25rem" : "0.55rem 1rem",
                  marginBottom: "1rem",
                  textAlign: "left",
                  boxShadow: showBriefing ? `0 4px 24px ${game.accentColor ?? "rgba(0, 212, 240, 0.05)"}` : "none",
                  transition: "padding 0.2s, border-color 0.2s, background 0.2s",
                }}
              >
                <button
                  onClick={() => setShowBriefing(!showBriefing)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    outline: "none",
                  }}
                >
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    color: game.accentColor ?? "var(--cyan)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}>
                    <span>🎮</span>
                    <span>Conductor Briefing &amp; Rules</span>
                  </div>
                  <span style={{ fontSize: "0.65rem", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "rgba(255, 255, 255, 0.45)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {showBriefing ? "▲ Close" : "▼ Read rules"}
                  </span>
                </button>

                {showBriefing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    style={{ overflow: "hidden", marginTop: "0.75rem" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", gap: "0.55rem", fontSize: "0.75rem", color: "rgba(240,238,255,0.82)", lineHeight: 1.35 }}>
                        <span style={{ color: game.accentColor ?? "var(--cyan)", fontWeight: "bold" }}>✦</span>
                        <span><strong>Branching Story:</strong> Choices shape the plot. Wrong steps cost ❤️.</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.55rem", fontSize: "0.75rem", color: "rgba(240,238,255,0.82)", lineHeight: 1.35 }}>
                        <span style={{ color: game.accentColor ?? "var(--cyan)", fontWeight: "bold" }}>✦</span>
                        <span><strong>AI Prompting:</strong> Design prompts using structured variables.</span>
                      </div>
                      <div style={{ display: "flex", gap: "0.55rem", fontSize: "0.75rem", color: "rgba(240,238,255,0.82)", lineHeight: 1.35 }}>
                        <span style={{ color: game.accentColor ?? "var(--cyan)", fontWeight: "bold" }}>✦</span>
                        <span><strong>Conductor Test:</strong> Maintain 80%+ accuracy to reach the Boss.</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Name input — for certificate */}
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, type: "spring", stiffness: 380, damping: 28 }}
                style={{ marginBottom: "1rem" }}
              >
                <input
                  type="text"
                  placeholder="Your name (for your certificate)"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  maxLength={60}
                  style={{
                    width: "100%",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.88rem",
                    color: "#fff",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${playerName.trim() ? (game.accentColor ?? "rgba(0,212,240,0.5)") : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "12px",
                    padding: "0.7rem 1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    textAlign: "center",
                    letterSpacing: "0.01em",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = game.accentColor ?? "rgba(0,212,240,0.6)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = playerName.trim() ? (game.accentColor ?? "rgba(0,212,240,0.5)") : "rgba(255,255,255,0.12)" }}
                />
              </motion.div>

              {/* Begin button */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, type: "spring", stiffness: 380, damping: 28 }}>
                <button
                  onClick={handleStart}
                  style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem",
                    color: "#08060f",
                    background: `linear-gradient(90deg, ${game.accentColor ?? "#00d4f0"}, #e040fb)`,
                    padding: "1rem 3.5rem", borderRadius: "100px", border: "none", cursor: "pointer",
                    boxShadow: `0 0 40px ${game.accentColor ?? "rgba(0,212,240,0.3)"}44`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 0 56px ${game.accentColor ?? "rgba(0,212,240,0.4)"}66` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 0 40px ${game.accentColor ?? "rgba(0,212,240,0.3)"}44` }}
                >
                  Begin Game →
                </button>
              </motion.div>

              {/* Meta */}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                style={{ fontFamily: "Inter,sans-serif", fontSize: "0.7rem", color: "var(--muted)", marginTop: "1rem" }}>
                {game.scenes.length} scenes · {game.free ? "Free" : `$${game.price?.toFixed(2)}`} · Up to {maxXp} XP
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ——— DIALOGUE OVERLAY ——— */}
      {state === "playing" && currentScene?.dialogue?.length && !isDialogueDoneForCurrentScene && currentScene.type !== "prompt" && currentScene.type !== "consequence" && currentScene.type !== "felipe" && currentScene.type !== "track-select" && (
        <NovelScene
          scene={currentScene}
          onComplete={() => { setDialogueDone(true); setCompletedDialogueSceneIndex(sceneIndex); }}
          protagonistVideo={game.protagonistVideo}
          protagonistImage={game.characterImage}
          protagonistName={game.characterName}
          accentColor={game.accentColor}
          fastText={fastText}
        />
      )}

      {/* ——— HANDOFF: "What's Next" card — shown after dialogue completes ——— */}
      {state === "playing" && currentScene?.type === "handoff" && isDialogueDoneForCurrentScene && (
        <div style={{
          position:       "fixed",
          inset:          0,
          zIndex:         30,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "2rem",
          background:     "rgba(8,6,15,0.88)",
          backdropFilter: "blur(20px)",
        }}>
          {/* Background gradient */}
          <div style={{
            position:   "absolute",
            inset:      0,
            background: "radial-gradient(ellipse at 50% 40%, rgba(0,212,240,0.06) 0%, transparent 55%)",
            pointerEvents:"none",
          }} />

          <div style={{
            position:   "relative",
            maxWidth:   "480px",
            width:      "100%",
            textAlign:  "center",
            zIndex:     1,
          }}>
            {/* Animated ♪ */}
            <div style={{
              fontSize:     "2rem",
              marginBottom: "1rem",
              filter:       "drop-shadow(0 0 16px rgba(0,212,240,0.6))",
              display:      "inline-block",
              animation:    "float 4s ease-in-out infinite",
            }}>
              ♪
            </div>

            {/* Next character preview */}
            {game.nextGame && (
              <>
                <div style={{
                  display:      "inline-flex",
                  alignItems:   "center",
                  gap:          "0.45rem",
                  background:   "rgba(0,212,240,0.07)",
                  border:       "1px solid rgba(0,212,240,0.22)",
                  borderRadius: "100px",
                  padding:      "0.22rem 0.85rem",
                  marginBottom: "0.75rem",
                }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)" }} />
                  <span style={{
                    fontFamily:    "Inter, sans-serif",
                    fontWeight:    700,
                    fontSize:      "0.62rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         "var(--cyan)",
                  }}>
                    Next up: {game.nextGame.character}
                  </span>
                </div>

                {game.nextGame.previewImage && (
                  <div style={{
                    width:        "90px",
                    height:       "90px",
                    borderRadius: "50%",
                    margin:       "0 auto 1rem",
                    overflow:     "hidden",
                    border:       "2px solid rgba(0,212,240,0.3)",
                    boxShadow:    "0 0 24px rgba(0,212,240,0.15)",
                  }}>
                    <img
                      src={game.nextGame.previewImage}
                      alt={game.nextGame.character}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                    />
                  </div>
                )}
              </>
            )}

            <h2 style={{
              fontFamily:   "Cormorant Garamond, serif",
              fontWeight:   700,
              fontSize:     "clamp(1.5rem, 4vw, 2rem)",
              color:        "#fff",
              lineHeight:   1.15,
              marginBottom: "0.75rem",
              letterSpacing:"-0.01em",
            }}>
              {game.nextGame ? `Meet ${game.nextGame.character} →` : "Journey continues →"}
            </h2>

            <p style={{
              fontFamily:   "Cormorant Garamond, serif",
              fontStyle:    "italic",
              fontSize:     "1rem",
              color:        "rgba(240,238,255,0.6)",
              lineHeight:   1.65,
              marginBottom: "2rem",
            }}>
              &ldquo;{game.nextGame?.teaserLine ?? "The next chapter is waiting."}&rdquo;
            </p>

            {/* XP earned this session */}
            <div style={{
              display:      "inline-flex",
              alignItems:   "center",
              gap:          "0.4rem",
              background:   "rgba(0,212,240,0.08)",
              border:       "1px solid rgba(0,212,240,0.22)",
              borderRadius: "100px",
              padding:      "0.28rem 0.9rem",
              marginBottom: "1.5rem",
            }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "var(--cyan)" }}>
                +{totalXp} XP earned
              </span>
            </div>

            <div>
              <button
                onClick={handleNext}
                style={{
                  fontFamily:   "Inter, sans-serif",
                  fontWeight:   800,
                  fontSize:     "1rem",
                  color:        "#08060f",
                  background:   "linear-gradient(90deg, #00d4f0, #e040fb)",
                  padding:      "1rem 3rem",
                  borderRadius: "100px",
                  border:       "none",
                  cursor:       "pointer",
                  boxShadow:    "0 0 40px rgba(0,212,240,0.3)",
                  transition:   "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 56px rgba(0,212,240,0.45)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 40px rgba(0,212,240,0.3)" }}
              >
                Complete Game →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ——— BOSS ARENA (5-punch battle — replaces SceneRenderer for boss scenes) ——— */}
      {state === "playing" && currentScene?.type === "boss" && (isDialogueDoneForCurrentScene || !currentScene?.dialogue?.length) && showBossArena && (
        <BossArena
          scene={currentScene}
          onComplete={handleBossComplete}
          maestroImage={game.maestroImage}
          characterImage={game.characterImage}
          characterName={game.characterName}
          accentColor={game.accentColor}
          onPlayCorrect={sound.playCorrect}
          onPlayWrong={sound.playWrong}
          onPlayFireworks={sound.playFireworks}
        />
      )}

      {/* ——— PROMPT CHALLENGE ——— */}
      {state === "playing" && currentScene?.type === "prompt" && (
        <PromptChallenge
          scene={currentScene}
          fastText={fastText}
          onComplete={(xp) => {
            setTotalXp(prev => prev + xp)
            setShowXpBurst(true)
            setBurstKey(k => k + 1)
            setTimeout(() => setShowXpBurst(false), 1500)
            sound.playFireworks()
            if (currentScene.nextLeadsTo) {
              const targetIndex = findSceneIndexById(game.scenes, currentScene.nextLeadsTo)
              if (targetIndex !== -1) {
                sound.playTransition()
                setSceneIndex(targetIndex)
                setSelectedLabel(null)
                setLastXp(0)
                setState("playing")
                return
              }
            }
            if (sceneIndex + 1 >= totalScenes) {
              completeGame()
            } else {
              sound.playTransition()
              setSceneIndex(i => i + 1)
              setSelectedLabel(null)
              setLastXp(0)
              setState("playing")
            }
          }}
        />
      )}

      {/* ——— CONSEQUENCE SCENE (wrong-answer story branch) ——— */}
      {state === "playing" && currentScene?.type === "consequence" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "radial-gradient(ellipse at 50% 40%, rgba(224,64,251,0.07) 0%, rgba(8,6,15,0.97) 55%), #08060f",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "3rem 2rem",
          animation: "vi-fade-in 0.5s ease both",
        }}>
          {/* Consequence label */}
          <div style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem",
            letterSpacing: "0.32em", textTransform: "uppercase",
            color: "rgba(224,64,251,0.5)", marginBottom: "2rem",
          }}>
            What happened next
          </div>

          {/* Story text */}
          <div style={{ maxWidth: "560px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2.8vw, 1.6rem)", color: "rgba(240,238,255,0.85)",
              lineHeight: 1.7, marginBottom: "2.5rem",
            }}>
              {currentScene.consequenceText}
            </p>
          </div>

          {/* Auto-advance hint */}
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: "0.65rem",
            color: "rgba(240,238,255,0.25)", letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            Continuing in a moment…
          </div>
        </div>
      )}

      {/* ——— FELIPE CARD (reframe + insight after consequence) ——— */}
      {state === "playing" && currentScene?.type === "felipe" && currentScene.felipeCard && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "radial-gradient(ellipse at 40% 50%, rgba(0,212,240,0.05) 0%, rgba(8,6,15,0.97) 50%), #08060f",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2rem",
          animation: "vi-fade-in 0.5s ease both",
        }}>
          <div style={{ maxWidth: "680px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>

            {/* Felipe portrait + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                border: "1.5px solid rgba(0,212,240,0.35)",
                overflow: "hidden", flexShrink: 0,
                boxShadow: "0 0 24px rgba(0,212,240,0.2)",
              }}>
                <img
                  src="/images/maestroplayer1.png?v=2"
                  alt="Felipe"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.6rem",
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "var(--cyan)", marginBottom: "0.15rem",
                }}>Felipe · The Maestro</div>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
                  color: "rgba(240,238,255,0.35)", letterSpacing: "0.04em",
                }}>Director of Consequences</div>
              </div>
            </div>

            {/* Quote */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,212,240,0.14)",
              borderRadius: "20px",
              padding: "2rem 2.5rem",
              position: "relative",
            }}>
              {/* Quote mark */}
              <div style={{
                position: "absolute", top: "-0.6rem", left: "2.5rem",
                fontFamily: "Cormorant Garamond, serif", fontSize: "3rem",
                color: "rgba(0,212,240,0.25)", lineHeight: 1,
              }}>"</div>
              <p style={{
                fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                color: "rgba(240,238,255,0.88)",
                lineHeight: 1.7, textAlign: "center", margin: 0,
              }}>
                {currentScene.felipeCard.quote}
              </p>
            </div>

            {/* Continue button */}
            <button
              onClick={handleFelipeContinue}
              style={{
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem",
                color: "#08060f",
                background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                padding: "0.9rem 2.5rem", borderRadius: "100px", border: "none",
                cursor: "pointer", letterSpacing: "0.01em",
                boxShadow: "0 0 32px rgba(0,212,240,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 48px rgba(0,212,240,0.45)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 32px rgba(0,212,240,0.3)" }}
            >
              Continue →
            </button>

          </div>
        </div>
      )}

      {/* ——— TRACK SELECTION (hub game final scene) ——— */}
      {state === "playing" && currentScene?.type === "track-select" && currentScene.trackOptions && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50, overflowY: "auto",
          background: "radial-gradient(ellipse at 50% 30%, rgba(0,212,240,0.05) 0%, rgba(8,6,15,0.98) 55%), #08060f",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
          padding: "5rem 2rem 3rem",
          animation: "vi-fade-in 0.6s ease both",
        }}>
          <div style={{ maxWidth: "860px", width: "100%" }}>

            {/* Felipe portrait + monologue */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                border: "1.5px solid rgba(0,212,240,0.35)", overflow: "hidden", flexShrink: 0,
                boxShadow: "0 0 20px rgba(0,212,240,0.2)",
              }}>
                <img src="/images/maestroplayer1.png?v=2" alt="Felipe"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:"0.6rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"var(--cyan)", marginBottom:"0.1rem" }}>Felipe · The Maestro</div>
                <div style={{ fontFamily:"Inter,sans-serif", fontSize:"0.7rem", color:"rgba(240,238,255,0.3)" }}>Director of Consequences</div>
              </div>
            </div>

            {currentScene.felipeMonologue && (
              <p style={{
                fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)", color: "rgba(240,238,255,0.72)",
                lineHeight: 1.75, marginBottom: "2.5rem",
                borderLeft: "2px solid rgba(0,212,240,0.25)", paddingLeft: "1.25rem",
              }}>
                {currentScene.felipeMonologue}
              </p>
            )}

            {/* Section label */}
            <div style={{
              fontFamily: "Inter,sans-serif", fontWeight:700, fontSize:"0.58rem",
              letterSpacing:"0.32em", textTransform:"uppercase",
              color:"rgba(240,238,255,0.3)", marginBottom:"1.25rem", textAlign:"center",
            }}>
              Choose Your Path
            </div>

            {/* Track cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {currentScene.trackOptions.map((track) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track.nextGameSlug, track.id)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "1.5rem 1.25rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s, background 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(0,212,240,0.4)"
                    e.currentTarget.style.background = "rgba(0,212,240,0.05)"
                    e.currentTarget.style.transform = "translateY(-3px)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                    e.currentTarget.style.transform = ""
                  }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{track.emoji}</div>
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.72rem",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: "var(--cyan)", marginBottom: "0.4rem",
                  }}>
                    Track {track.id}
                  </div>
                  <div style={{
                    fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.05rem",
                    color: "#fff", lineHeight: 1.2, marginBottom: "0.65rem",
                  }}>
                    {track.label}
                  </div>
                  <p style={{
                    fontFamily: "Inter, sans-serif", fontSize: "0.78rem",
                    color: "rgba(240,238,255,0.45)", lineHeight: 1.55, margin: 0,
                  }}>
                    {track.teaser}
                  </p>
                  <div style={{
                    marginTop: "1rem",
                    fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                    fontSize: "0.82rem", color: "rgba(0,212,240,0.55)",
                    lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "0.75rem",
                  }}>
                    "{track.felipeAside}"
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ——— SCENE BACKGROUND (behind quiz/scenario content) ——— */}
      {(state === "playing" || state === "answered") && currentScene?.type !== "prompt" && currentScene?.type !== "handoff" && currentScene?.type !== "consequence" && currentScene?.type !== "felipe" && currentScene?.type !== "track-select" && (!currentScene?.dialogue?.length || isDialogueDoneForCurrentScene) && sceneBgImage && (
        <>
          {/* Real anime-style background image */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
            backgroundImage:    `url(${sceneBgImage})`,
            backgroundSize:     "cover",
            backgroundPosition: "center center",
          }} />
          {/* Dark overlay so text stays readable */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
            background: currentScene?.type === "revelation"
              ? "rgba(6,4,14,0.82)"
              : "rgba(6,4,14,0.72)",
          }} />
        </>
      )}
      {/* SceneEnvironment kept for prompt-type scenes that opt in explicitly */}

      {/* ——— GAME CONTENT (not used for boss, prompt, handoff, consequence, felipe, track-select) ——— */}
      {state !== "intro" && currentScene?.type !== "prompt" && currentScene?.type !== "boss" && currentScene?.type !== "handoff" && currentScene?.type !== "consequence" && currentScene?.type !== "felipe" && currentScene?.type !== "track-select" && (
        <div style={{ height: "100dvh", overflow: "auto", position: "relative", zIndex: 10 }}>
          <AnimatePresence mode="wait">
            {/* When a side-character is standing on the right (quiz/scenario decision
                moments), shift the reading column LEFT so text + Jake form two columns
                instead of overlapping. Centered for boss/revelation/learn/scroll scenes. */}
            <motion.div
              key={sceneIndex}
              variants={isBoss ? bossVariants : regularVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={isBoss ? bossTransition : regularTransition}
              style={(game.characterImage && !currentScene?.dialogue?.length && !isMobile)
                ? {
                    // Two-column: text fills the LEFT, stretching right until just
                    // before Jake's column. marginRight reserves Jake's space so the
                    // boxes expand all the way toward him without overlapping his body.
                    maxWidth: "none",
                    marginLeft: "max(1.5rem, 5vw)",
                    marginRight: "clamp(280px, 33vw, 500px)",
                    padding: "clamp(1.5rem, 5vh, 4.5rem) 1.5rem clamp(1rem, 4vh, 4rem)",
                  }
                : {
                    maxWidth: "680px",
                    margin: "0 auto",
                    padding: "clamp(1.5rem, 5vh, 4.5rem) 1.5rem clamp(1rem, 4vh, 4rem)",
                  }}
            >
              {/* Scene label row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                {isBoss ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(224,64,251,0.1)", border: "1px solid rgba(224,64,251,0.25)", borderRadius: "100px", padding: "0.3rem 0.9rem 0.3rem 0.5rem" }}>
                    <GameIcon name="baton" size={22} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--pink)" }}>Conductor Test</span>
                  </div>
                ) : currentScene.type === "revelation" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "rgba(0,212,240,0.08)", border: "1px solid rgba(0,212,240,0.2)", borderRadius: "100px", padding: "0.3rem 0.9rem 0.3rem 0.5rem" }}>
                    <GameIcon name="musicNotes" size={22} />
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--cyan)" }}>Revelation</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {game.scenes.map((_, i) => (
                          <div key={i} style={{ height: "4px", width: i === sceneIndex ? "20px" : "8px", borderRadius: "2px", background: i < sceneIndex ? "rgba(0,212,240,0.6)" : i === sceneIndex ? "var(--cyan)" : "rgba(255,255,255,0.12)", transition: "all 0.4s ease" }} />
                        ))}
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                        Scene {sceneIndex + 1}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <SceneRenderer
                scene={currentScene}
                answered={state === "answered"}
                selectedLabel={selectedLabel}
                onAnswer={handleAnswer}
                onNext={handleNext}
                streakCount={streakCount}
                playFireworks={sound.playFireworks}
                aiElaboration={aiElaboration}
                dialogueDone={isDialogueDoneForCurrentScene}
                characterImage={game.characterImage}
                characterName={game.characterName}
                accentColor={game.accentColor}
                lastAnswerCorrect={lastAnswerCorrect}
                fastText={fastText}
                gameScenes={game.scenes}
                onTalkingStateChange={setCharTalking}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ── CHARACTER STAGE — persistent right-column presence across ALL scene types ──
           Hoisted here (from SceneRenderer) so the character stays embodied on quiz,
           scenario, learn, revelation, ai-compare AND predict scenes — not just quizzes.
           Excluded: dialogue (NovelScene has its own cast), boss (BossArena cinematic),
           prompt, consequence, felipe, track-select (full-screen special layouts). */}
      {game.characterImage &&
       (state === "playing" || state === "answered") &&
       !currentScene?.dialogue?.length &&
       currentScene?.type !== "boss" &&
       currentScene?.type !== "prompt" &&
       currentScene?.type !== "handoff" &&
       currentScene?.type !== "consequence" &&
       currentScene?.type !== "felipe" &&
       currentScene?.type !== "track-select" &&
       !isMobile && (
        <div
          aria-hidden="true"
          style={{
            position:      "fixed",
            right:         "1%",
            top:           "5.5rem",
            bottom:        0,
            width:         "clamp(320px, 40vw, 600px)",
            zIndex:        2,
            pointerEvents: "none",
            display:       "flex",
            alignItems:    "flex-end",
            justifyContent:"center",
          }}
        >
          {/* Ambient floor glow — shifts colour with answer state */}
          <div style={{
            position:   "absolute",
            inset:      0,
            background: state === "answered"
              ? (lastAnswerCorrect
                  ? "radial-gradient(ellipse at 50% 80%, rgba(88,204,2,0.18) 0%, transparent 65%)"
                  : "radial-gradient(ellipse at 50% 80%, rgba(255,75,75,0.14) 0%, transparent 65%)")
              : `radial-gradient(ellipse at 50% 80%, ${game.accentColor ?? "rgba(0,212,240,0.12)"}22 0%, transparent 65%)`,
            transition: "background 0.5s ease",
          }} />

          {/* Aspect-ratio matched container to align mouth coordinates exactly */}
          <div style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1/1",
            zIndex: 1,
          }}>
            {/* Character image — breathes when idle, talks when typing, reacts on answer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "bottom center",
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={portraitSrc}
                  src={portraitSrc}
                  alt=""
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: state === "answered" ? 1 : 0.78 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12, ease: "linear" }}
                  onError={() => {
                    if (portraitSrc !== game.characterImage) {
                      setPortraitSrc(game.characterImage)
                    }
                  }}
                  className={state === "answered"
                    ? (lastAnswerCorrect ? "char-react-correct" : "char-react-wrong")
                    : charTalking
                    ? "char-talk"
                    : "char-breathe"}
                  style={{
                    position:        "absolute",
                    bottom:          0,
                    left:            0,
                    width:           "100%",
                    height:          "100%",
                    objectFit:       "contain",
                    objectPosition:  "bottom center",
                    maskImage:       "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to top, black 0%, black 94%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%), linear-gradient(to top, black 0%, black 94%, transparent 100%)",
                    maskComposite:   "intersect",
                    WebkitMaskComposite: "source-in",
                    zIndex:          1,
                    filter:          state === "answered"
                      ? (lastAnswerCorrect
                          ? "drop-shadow(0 0 28px rgba(88,204,2,0.7)) brightness(1.1) saturate(1.2)"
                          : "drop-shadow(0 0 20px rgba(255,75,75,0.5)) brightness(0.85) saturate(0.7)")
                      : `drop-shadow(0 0 16px ${game.accentColor ?? "rgba(0,212,240,0.45)"}) brightness(1.0)`,
                    transformOrigin: "bottom center",
                    transition:      "filter 0.4s ease",
                  }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Character name chip — always visible so the character feels named & present */}
          {game.characterName && (
            <div style={{
              position:       "absolute",
              bottom:         "1rem",
              left:           "50%",
              transform:      "translateX(-50%)",
              background:     "rgba(8,6,15,0.88)",
              border:         state === "answered"
                ? `1px solid ${lastAnswerCorrect ? "rgba(88,204,2,0.5)" : "rgba(255,75,75,0.5)"}`
                : `1px solid ${(game.accentColor ?? "rgba(0,212,240,0.4)")}66`,
              borderRadius:   "100px",
              padding:        "0.25rem 0.85rem",
              fontFamily:     "Inter, sans-serif",
              fontWeight:     700,
              fontSize:       "0.62rem",
              letterSpacing:  "0.2em",
              textTransform:  "uppercase",
              color:          state === "answered"
                ? (lastAnswerCorrect ? "#7dff6b" : "#ff8080")
                : (game.accentColor ?? "var(--cyan)"),
              whiteSpace:     "nowrap",
              boxShadow:      "0 0 16px rgba(0,0,0,0.4)",
            }}>
              {game.characterName}{state === "answered" ? (lastAnswerCorrect ? " ✓" : " …") : ""}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
