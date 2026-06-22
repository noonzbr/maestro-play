"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene } from "@/lib/games/types"

/* ── Voice Synthesis (Web Speech API) ──────────────────────────────────── */
let ttsEnabled = true  // user can toggle off

function speakLine(text: string, speakerName: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  if (!ttsEnabled) return
  window.speechSynthesis.cancel()
  const clean = text.replace(/\*\*/g, "").replace(/[\u{1F000}-\u{1FFFF}]/gu, "").trim()
  if (!clean) return
  const utt = new SpeechSynthesisUtterance(clean)
  const name = speakerName.toUpperCase()
  // Distinct voice character per speaker
  if (name.includes("VEGA") || name.includes("DIANA") || name.includes("PRIYA") || name.includes("LUNA")) {
    utt.pitch = 1.2; utt.rate = 0.92; utt.volume = 0.85
  } else if (name.includes("JAKE") || name.includes("PROTAGONIST")) {
    utt.pitch = 1.0; utt.rate = 1.0; utt.volume = 0.9
  } else if (name.includes("FELIPE") || name.includes("MAESTRO") || name.includes("TYLER") || name.includes("MARCUS")) {
    utt.pitch = 0.75; utt.rate = 0.88; utt.volume = 0.9
  } else if (name.includes("CARLOS") || name.includes("DIEGO")) {
    utt.pitch = 0.85; utt.rate = 0.9; utt.volume = 0.9
  } else if (name.includes("AI") || name.includes("CLAUDE") || name.includes("CODA")) {
    utt.pitch = 1.4; utt.rate = 1.08; utt.volume = 0.8
  } else if (name.includes("ZOE") || name.includes("ARIA") || name.includes("MAYA")) {
    utt.pitch = 1.3; utt.rate = 0.98; utt.volume = 0.85
  } else {
    utt.pitch = 1.0; utt.rate = 0.95; utt.volume = 0.85
  }
  // Try to pick a matching voice from the system
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    const enVoices = voices.filter(v => v.lang.startsWith("en"))
    if (enVoices.length > 0) {
      const femaleVoices = enVoices.filter(v => /female|zira|victoria|samantha|karen|moira|tessa|fiona/i.test(v.name))
      const maleVoices   = enVoices.filter(v => /male|daniel|alex|david|mark|james|arthur/i.test(v.name))
      const isFemale = name.includes("VEGA") || name.includes("ZOE") || name.includes("ARIA") || name.includes("PRIYA") || name.includes("LUNA") || name.includes("MAYA") || name.includes("DIANA")
      const pool = isFemale ? (femaleVoices.length ? femaleVoices : enVoices) : (maleVoices.length ? maleVoices : enVoices)
      utt.voice = pool[0]
    }
  }
  if (onStart) utt.onstart = onStart
  if (onEnd)   utt.onend   = onEnd
  window.speechSynthesis.speak(utt)
}

export function stopSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel()
}

let audioCtx: AudioContext | null = null

export function playVoiceBlip(speaker: string, char: string) {
  if (!char || [" ", ".", ",", "!", "?", "-", "\n", '"', "'", "“", "”"].includes(char)) return

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume()
    }

    const t = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    const name = speaker.toUpperCase()
    let freq = 260
    let type: OscillatorType = "sine"
    let vol = 0.03
    let dur = 0.045

    if (name.includes("JAKE") || name.includes("CARLOS") || name.includes("ARIA") || name.includes("ZOE") || name.includes("PROTAGONIST") || name.includes("KODA") || name.includes("CODA")) {
      // Protagonists & Companions
      if (name.includes("JAKE")) {
        freq = 210
        type = "triangle"
      } else if (name.includes("CARLOS")) {
        freq = 155 // warm jazz baritone register
        type = "triangle"
      } else if (name.includes("ZOE")) {
        freq = 285 // energetic tempo register
        type = "sine"
      } else if (name.includes("ARIA") || name.includes("KODA") || name.includes("CODA")) {
        freq = 315 // clean violin register
        type = "sine"
      } else {
        freq = 220
        type = "triangle"
      }
      vol = 0.028
      dur = 0.038
    } else if (name.includes("FELIPE") || name.includes("MAESTRO")) {
      // Felipe Conductor baritone cello tone
      freq = 145
      type = "triangle"
      vol = 0.03
      dur = 0.055
    } else if (name.includes("TYLER") || name.includes("MARCUS") || name.includes("DIEGO")) {
      // Male NPCs
      freq = name.includes("DIEGO") ? 135 : 175
      type = "triangle"
      vol = 0.025
      dur = 0.045
    } else if (name.includes("VEGA") || name.includes("DIANA") || name.includes("LENA") || name.includes("PRIYA")) {
      // Female NPCs
      freq = name.includes("VEGA") ? 335 : 305
      type = "sine"
      vol = 0.03
      dur = 0.04
    } else if (name.includes("AI") || name.includes("CLAUDE") || name.includes("CHATGPT") || name.includes("GEMINI")) {
      // Robotic AI Synth
      freq = 780
      type = "sawtooth"
      vol = 0.006 // sawtooth is naturally very bright
      dur = 0.022
    } else {
      // Narrator / Default
      freq = 230
      type = "sine"
      vol = 0.028
      dur = 0.04
    }

    // Organic micro-pitch jitter (speech frequency variance)
    const jitter = (Math.random() - 0.5) * 12
    osc.frequency.setValueAtTime(freq + jitter, t)

    // Envelope
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(vol, t + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

    osc.start(t)
    osc.stop(t + dur + 0.01)
  } catch (e) {
    // blocked or not supported
  }
}

/* ── Dialogue text sentiment/emotion parser ────────────────────────────── */
function getLineEmotion(text: string): "neutral" | "excited" | "thinking" | "tense" {
  const clean = text.toLowerCase()
  if (clean.includes("!") || clean.includes("awesome") || clean.includes("brilliant") || clean.includes("incredible") || clean.includes("perfect") || clean.includes("exactly") || clean.includes("yes")) {
    return "excited"
  }
  if (clean.includes("?") || clean.includes("...") || clean.includes("how") || clean.includes("why") || clean.includes("maybe") || clean.includes("wonder") || clean.includes("think") || clean.includes("guess")) {
    return "thinking"
  }
  if (clean.includes("unethical") || clean.includes("ruined") || clean.includes("crisis") || clean.includes("disaster") || clean.includes("toxic") || clean.includes("angry") || clean.includes("cost") || clean.includes("replaced") || clean.includes("wrong") || clean.includes("fail") || clean.includes("error") || clean.includes("boilerplate") || clean.includes("boilerplate apology")) {
    return "tense"
  }
  return "neutral"
}

/* ── Background image map — keyed by location keyword ──────────────────── */
function getBackgroundImage(location: string): string {
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

/* ── NPC portrait map ──────────────────────────────────────────────────── */
const NPC_IMAGES: Record<string, string> = {
  senora_vega: "/images/senoravega.png?v=2",
  tyler:       "/images/tyler.png?v=2",
  ai:          "/images/ai-character.png?v=2",
  jake:        "/images/guitarplayer1.png?v=2",
  zoe:         "/images/zoe.png?v=2",
  carlos:      "/images/carlos.png?v=2",
  aria:        "/images/aria.png?v=2",
  jordan:      "/images/jordan.png?v=2",
  kai:         "/images/kai.png?v=2",
  priya:       "/images/priya.png?v=2",
  alex:        "/images/alex.png?v=2",
  luna:        "/images/luna.png?v=2",
  sam:         "/images/sam.png?v=2",
  vera:        "/images/vera.png?v=2",
  maya:        "/images/maya.png?v=2",
  nova:        "/images/nova.png?v=2",
  default:     "",
}

/* ── Mouth positions for each character ─────────────────────────────────── */
// Coordinates are % of the 1:1 aspect-ratio container placed at bottom-left/right
// top% = distance from TOP of that square container (portrait fills bottom portion)
// The character faces typically occupy the upper 55% of the square
const MOUTH_POSITIONS: Record<string, { top: string; left: string }> = {
  jake:        { top: "24.8%", left: "48.0%" }, // restored anime guitarplayer1.png
  tyler:       { top: "24.3%", left: "53.0%" }, // tyler.png
  senora_vega: { top: "34.8%", left: "50.2%" }, // senoravega.png
  zoe:         { top: "33.3%", left: "51.6%" },
  carlos:      { top: "42.2%", left: "50.3%" },
  aria:        { top: "21%",   left: "50%" },
  jordan:      { top: "21%",   left: "50%" },
  kai:         { top: "25.7%", left: "29.0%" },
  priya:       { top: "26.5%", left: "24.7%" },
  alex:        { top: "22.1%", left: "27.5%" },
  luna:        { top: "20%",   left: "50%" },
  sam:         { top: "20%",   left: "50%" },
  vera:        { top: "24.9%", left: "48.7%" },
  maya:        { top: "27.1%", left: "49.9%" },
  nova:        { top: "30.3%", left: "44.8%" },
  felipe:      { top: "19.7%", left: "53.5%" },
  ai:          { top: "22%",   left: "50%" },
  default:     { top: "22%",   left: "50%" },
}


/* Helper component to dynamically load emotion-specific character art with a fallback to the base image */
type CharacterImageProps = {
  baseSrc: string
  emotion: "neutral" | "excited" | "thinking" | "tense"
  alt: string
  className?: string
  style?: React.CSSProperties
}

function CharacterImage({ baseSrc, emotion, alt, className, style }: CharacterImageProps) {
  const [currentSrc, setCurrentSrc] = useState(baseSrc)
  const [lastBaseSrc, setLastBaseSrc] = useState(baseSrc)
  const [lastEmotion, setLastEmotion] = useState(emotion)

  const getEmotionUrl = useCallback((src: string, emo: string) => {
    if (emo === "neutral" || !src) return src
    const urlParts = src.split('?')
    const path = urlParts[0]
    const query = urlParts[1] ? `?${urlParts[1]}` : ''
    if (path.toLowerCase().endsWith('.png')) {
      const mainPath = path.substring(0, path.length - 4)
      return `${mainPath}_${emo}.png${query}`
    }
    return src
  }, [])

  if (baseSrc !== lastBaseSrc || emotion !== lastEmotion) {
    setLastBaseSrc(baseSrc)
    setLastEmotion(emotion)
    setCurrentSrc(getEmotionUrl(baseSrc, emotion))
  }

  const handleError = () => {
    const expectedEmotionUrl = getEmotionUrl(baseSrc, emotion)
    if (currentSrc === expectedEmotionUrl && currentSrc !== baseSrc) {
      setCurrentSrc(baseSrc)
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "linear" }}
          src={currentSrc}
          alt={alt}
          draggable={false}
          className={className}
          style={{
            ...style,
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          onError={handleError}
        />
      </AnimatePresence>
    </div>
  )
}


/* ── NPC color + initials ──────────────────────────────────────────────── */
type NpcCfg = { color: string; initial: string }

const JAKE_COLOR  = "rgba(0,212,240,0.9)"
const JAKE_INIT   = "J"

const NPC_CONFIGS: Record<string, NpcCfg> = {
  default:     { color: "rgba(224,64,251,0.9)", initial: "AI" },
  senora_vega: { color: "rgba(255,180,80,0.9)", initial: "SV" },
  tyler:       { color: "rgba(80,160,255,0.9)", initial: "TY" },
  ai:          { color: "rgba(0,212,240,0.9)",  initial: "AI" },
  jake:        { color: "rgba(0,212,240,0.9)",  initial: "JK" },
  zoe:         { color: "rgba(224,64,251,0.9)", initial: "ZO" },
  carlos:      { color: "rgba(255,100,100,0.9)",initial: "CA" },
  aria:        { color: "rgba(100,255,100,0.9)",initial: "AR" },
  jordan:      { color: "rgba(255,200,50,0.9)", initial: "JO" },
  kai:         { color: "rgba(50,255,200,0.9)", initial: "KA" },
  priya:       { color: "rgba(200,50,255,0.9)", initial: "PR" },
  alex:        { color: "rgba(255,50,150,0.9)", initial: "AL" },
  luna:        { color: "rgba(50,150,255,0.9)", initial: "LU" },
  sam:         { color: "rgba(150,255,50,0.9)", initial: "SA" },
  vera:        { color: "rgba(0,212,240,0.9)",  initial: "VE" },
  maya:        { color: "rgba(255,150,50,0.9)", initial: "MA" },
  nova:        { color: "rgba(0,212,240,0.9)",  initial: "NV" },
}

/* Helper to resolve npc keys robustly across all 14 visual novel game characters */
export function resolveNpcKey(keyOrSpeaker: string | undefined): string {
  if (!keyOrSpeaker) return "default"
  const clean = keyOrSpeaker.toLowerCase().replace(/[^a-z0-9]/g, "")
  if (clean.includes("vega")) return "senora_vega"
  if (clean.includes("tyler")) return "tyler"
  if (clean.includes("jake")) return "jake"
  if (clean.includes("zoe")) return "zoe"
  if (clean.includes("carlos")) return "carlos"
  if (clean.includes("aria")) return "aria"
  if (clean.includes("jordan")) return "jordan"
  if (clean.includes("kai")) return "kai"
  if (clean.includes("priya")) return "priya"
  if (clean.includes("alex")) return "alex"
  if (clean.includes("luna")) return "luna"
  if (clean.includes("sam")) return "sam"
  if (clean.includes("vera")) return "vera"
  if (clean.includes("maya")) return "maya"
  if (clean.includes("nova")) return "nova"
  if (clean.includes("ai") || clean.includes("claude") || clean.includes("chatgpt") || clean.includes("gemini")) return "ai"
  return "default"
}

/* ── Typewriter hook ────────────────────────────────────────────────────── */
function useTypewriter(text: string, speed: number, speakerName: string, active = true) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  
  const speakerRef = useRef(speakerName)
  useEffect(() => {
    speakerRef.current = speakerName
  }, [speakerName])

  useEffect(() => {
    if (!active) {
      setDisplayed(text)
      setDone(true)
      return
    }
    setDisplayed("")
    setDone(false)
    if (!text) { setDone(true); return }
    let i = 0
    const t = setInterval(() => {
      i++
      const char = text[i - 1]
      setDisplayed(text.slice(0, i))
      playVoiceBlip(speakerRef.current, char)
      if (i >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
  }, [text, speed, active])
  return { displayed, done }
}

type Props = {
  scene:              Scene
  onComplete:         () => void
  protagonistVideo?:  string
  protagonistImage?:  string
  protagonistName?:   string
  accentColor?:       string
  fastText?:          boolean
}

export default function NovelScene({ scene, onComplete, protagonistImage, protagonistName, accentColor, fastText = false }: Props) {
  const [lineIndex,    setLineIndex]    = useState(0)
  const [skip,         setSkip]         = useState(false)
  const [flashKey,     setFlashKey]     = useState(0)
  const [autoProgress, setAutoProgress] = useState(0)   // 0-100 fill %
  const bottomRef    = useRef<HTMLDivElement>(null)
  const advanceRef   = useRef<() => void>(() => {})
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoRafRef   = useRef<number | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  /* ── Keyframes injected once ─────────────────────────────────────────── */
  useEffect(() => {
    const id = "dlg-chat-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id    = id
    s.textContent = `
      @keyframes dlg-cursor {
        0%,100% { opacity:1; }
        50%     { opacity:0; }
      }
      @keyframes dlg-speaker-glow {
        0%,100% { opacity:0.45; transform:scale(0.96); }
        50%     { opacity:0.78; transform:scale(1.04); }
      }
      @keyframes dlg-flash-left {
        0%   { opacity:0; }
        15%  { opacity:1; }
        100% { opacity:0; }
      }
      @keyframes dlg-flash-right {
        0%   { opacity:0; }
        15%  { opacity:1; }
        100% { opacity:0; }
      }
      @keyframes dlg-light-sweep {
        0%   { opacity:0; transform:translateY(10px); }
        30%  { opacity:0.6; }
        100% { opacity:0; transform:translateY(-20px); }
      }
      /* Bubble land — slides in from speaker direction, springs to rest */
      @keyframes dlg-bubble-land-left {
        0%   { opacity:0; transform:translateX(-22px) scale(0.88); }
        48%  { opacity:1; transform:translateX(5px)  scale(1.04, 0.97); }
        68%  { transform:translateX(-2px) scale(0.99, 1.01); }
        84%  { transform:translateX(1px)  scale(1.005, 0.998); }
        100% { opacity:1; transform:translateX(0)    scale(1); }
      }
      @keyframes dlg-bubble-land-right {
        0%   { opacity:0; transform:translateX(22px)  scale(0.88); }
        48%  { opacity:1; transform:translateX(-5px) scale(1.04, 0.97); }
        68%  { transform:translateX(2px)  scale(0.99, 1.01); }
        84%  { transform:translateX(-1px) scale(1.005, 0.998); }
        100% { opacity:1; transform:translateX(0)    scale(1); }
      }
    `
    document.head.appendChild(s)
  }, [])

  const lines  = scene.dialogue!
  const line   = lines[lineIndex]
  const isLast = lineIndex >= lines.length - 1
  const isJake = line.avatar === "jake" || line.avatar === "protagonist"

  /* Flash on every new line */
  useEffect(() => { setFlashKey(k => k + 1) }, [lineIndex])

  const { displayed, done } = useTypewriter(skip ? "" : line.text, 22, line.speaker, !fastText)
  const visibleText = skip ? line.text : displayed
  const textDone    = skip || done

  /* Speak the current line using Web Speech API */
  useEffect(() => {
    if (fastText) return  // skip voice in fast/review mode
    const currentLine = lines[lineIndex]
    if (!currentLine?.text) return
    // Small delay so the first character appears before speech starts
    const timer = setTimeout(() => {
      speakLine(currentLine.text, currentLine.speaker ?? "")
    }, 120)
    return () => {
      clearTimeout(timer)
      stopSpeech()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex])

  /* ── Reading-speed auto-advance ─────────────────────────────────────── */
  // After the typewriter finishes, wait <readingMs> then auto-advance.
  // Short punchy lines: ~900ms. Long reflective lines: up to 4200ms.
  // Click/tap still skips immediately.
  function calcAutoMs(text: string): number {
    const words = text.trim().split(/\s+/).length
    return Math.min(4200, Math.max(900, words * 270))
  }

  function cancelAuto() {
    if (autoTimerRef.current)  { clearTimeout(autoTimerRef.current);  autoTimerRef.current  = null }
    if (autoRafRef.current)    { cancelAnimationFrame(autoRafRef.current); autoRafRef.current = null }
    setAutoProgress(0)
  }

  const advance = useCallback(() => {
    cancelAuto()
    stopSpeech()
    if (!textDone) { setSkip(true) }
    else {
      setAutoProgress(0)
      setSkip(false)
      if (isLast) onComplete()
      else setLineIndex(i => i + 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDone, isLast, onComplete])

  /* Kick off auto-advance once text is fully shown */
  useEffect(() => {
    if (!textDone) { cancelAuto(); return }
    const ms = calcAutoMs(line.text)
    const start = performance.now()

    function tick() {
      const elapsed = performance.now() - start
      const pct = Math.min(100, (elapsed / ms) * 100)
      setAutoProgress(pct)
      if (pct < 100) {
        autoRafRef.current = requestAnimationFrame(tick)
      }
    }
    autoRafRef.current = requestAnimationFrame(tick)
    autoTimerRef.current = setTimeout(() => {
      advanceRef.current()
    }, ms)
    return cancelAuto
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDone, lineIndex])

  useEffect(() => { advanceRef.current = advance }, [advance])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (["Space", "Enter", "ArrowRight"].includes(e.code)) {
        e.preventDefault()
        advanceRef.current()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [])

  useEffect(() => { setSkip(false) }, [lineIndex])

  /* Scroll to newest bubble */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lineIndex])

  /* NPC setup */
  // Find the active NPC speaker at or before the current line.
  // If the current line is spoken by an NPC, use that NPC.
  // Otherwise, use the most recent NPC speaker.
  // If no NPC has spoken yet, look forward to find the first NPC speaker.
  const activeNpcLine = lines
    .slice(0, lineIndex + 1)
    .reverse()
    .find(l => l.avatar !== "jake" && l.avatar !== "protagonist")
    ?? lines.find(l => l.avatar !== "jake" && l.avatar !== "protagonist")

  const sceneNpcKey = resolveNpcKey(activeNpcLine?.npcKey || activeNpcLine?.speaker)
  const npcSpeakerName = activeNpcLine?.speaker ?? ""
  const npc            = NPC_CONFIGS[sceneNpcKey] ?? NPC_CONFIGS.default
  const npcImage       = NPC_IMAGES[sceneNpcKey] ?? ""

  // For the orb fallback: if npcKey is "default" (no portrait), compute initials
  // from the actual speaker name (e.g. "Mia" → "MI") rather than showing "AI"
  const npcInitial = (sceneNpcKey === "default" && npcSpeakerName)
    ? npcSpeakerName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : npc.initial

  // Helper to convert any color (hex, rgb, rgba) to translucent bg color
  function getTranslucentBg(colorStr: string | undefined, opacity: number = 0.13): string {
    if (!colorStr) return `rgba(0, 212, 240, ${opacity})`
    const str = colorStr.trim()
    if (str.startsWith("rgba")) {
      return str.replace(/,[\s\d.]+\)$/, `, ${opacity})`)
    }
    if (str.startsWith("rgb")) {
      return str.replace("rgb", "rgba").replace(")", `, ${opacity})`)
    }
    if (str.startsWith("#")) {
      const hex = str.replace("#", "")
      let r = 0, g = 0, b = 0
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16)
        g = parseInt(hex[1] + hex[1], 16)
        b = parseInt(hex[2] + hex[2], 16)
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16)
        g = parseInt(hex.substring(2, 4), 16)
        b = parseInt(hex.substring(4, 6), 16)
      }
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }
    return str
  }

  const protName = protagonistName ?? "Jake"
  const protColor = accentColor ?? JAKE_COLOR
  const protInit = protName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  function cfg(avatar: string) {
    if (avatar === "jake" || avatar === "protagonist") {
      return { 
        color: protColor, 
        bg: getTranslucentBg(protColor, 0.13), 
        init: protInit, 
        right: true 
      }
    }
    return { 
      color: npc.color,  
      bg: getTranslucentBg(npc.color, 0.13), 
      init: npcInitial, 
      right: false 
    }
  }

  const activeCfg    = cfg(line.avatar)
  const speakerColor = activeCfg.color
  const npcActive    = !isJake
  const bgImage      = scene.location ? getBackgroundImage(scene.location) : ""

  // Parse the emotional state of the active dialogue line
  const activeEmotion = line.emotion || getLineEmotion(line.text)
  const npcEmotion    = npcActive ? activeEmotion : "neutral"
  const protEmotion   = isJake ? activeEmotion : "neutral"

  /* Character mask — visible bottom, fades at the very top */
  const charMask = "linear-gradient(to top, black 0%, black 72%, transparent 100%)"

  return (
    <div
      onClick={advance}
      style={{
        position:      "fixed",
        inset:         0,
        display:       "flex",
        flexDirection: "column",
        cursor:        "pointer",
        zIndex:        20,
        userSelect:    "none",
        overflow:      "hidden",
        background:    "var(--bg-primary)",
      }}
    >

      {/* ── Real background image ────────────────────────────────────────── */}
      {bgImage ? (
        <>
          <motion.img
            src={bgImage}
            alt=""
            draggable={false}
            animate={{
              scale: [1.02, 1.12, 1.05, 1.1, 1.02],
              x: [0, -15, 10, -5, 0],
              y: [0, 8, -6, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
          {/* Darken overlay — keeps characters readable */}
          <div style={{
            position:   "absolute",
            inset:      0,
            zIndex:     1,
            background: "linear-gradient(180deg, rgba(8,6,15,0.42) 0%, rgba(6,4,14,0.48) 45%, rgba(6,4,14,0.92) 100%)",
          }} />
        </>
      ) : (
        /* Fallback: plain dark gradient */
        <div style={{
          position:   "absolute",
          inset:      0,
          zIndex:     0,
          background: "linear-gradient(180deg, #0d0b1e 0%, #080614 100%)",
        }} />
      )}

      {/* Speaker flash disabled for screen comfort */}

      {/* ── Location pill ────────────────────────────────────────────────── */}
      {scene.location && (
        <div style={{
          position:       "relative",
          zIndex:         15,
          padding:        "4.4rem 1.5rem 0",
          display:        "flex",
          justifyContent: "center",
          pointerEvents:  "none",
        }}>
          <div style={{
            fontFamily:     "Inter, sans-serif",
            fontSize:       "0.58rem",
            letterSpacing:  "0.28em",
            textTransform:  "uppercase",
            color:          "rgba(240,238,255,0.55)",
            fontWeight:     700,
            background:     "rgba(6,4,14,0.65)",
            backdropFilter: "blur(12px)",
            borderRadius:   "100px",
            padding:        "0.22rem 0.9rem",
            border:         "1px solid rgba(255,255,255,0.09)",
          }}>
            {scene.location}
          </div>
        </div>
      )}

      {/* ── Character stage ───────────────────────────────────────────────── */}
      <div style={{
        position:      "absolute",
        left:          0,
        right:         0,
        top:           "4.8rem",
        bottom:        isMobile ? "42%" : "18%",
        zIndex:        5,
        pointerEvents: "none",
        overflow:      "hidden",
      }}>

        {/* ── NPC (left side) ── */}
        {npcImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 60, rotate: 0 }}
            animate={{
              opacity: npcActive ? 1 : (isMobile ? 0 : 0.25),
              scale: npcActive 
                ? (npcEmotion === "excited" ? 1.05 : npcEmotion === "thinking" ? 1.01 : 1.02) 
                : 0.96,
              y: npcActive 
                ? (npcEmotion === "excited" ? [0, -4, 0] : npcEmotion === "thinking" ? [0, -3, 0] : 0) 
                : 15,
              x: npcActive 
                ? (npcEmotion === "tense" ? [-6, 6, -4, 4, -2, 2, -1, 1, 0] : 0) 
                : 0,
              rotate: npcActive && npcEmotion === "thinking" ? [0, -1.5, 1.5, 0] : 0,
              filter: npcActive 
                ? (npcEmotion === "tense" 
                    ? "drop-shadow(0 0 25px rgba(180, 0, 255, 0.6)) drop-shadow(0 0 12px rgba(220, 20, 60, 0.6))" 
                    : "none") 
                : "grayscale(0.4) brightness(0.65)",
            }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 18,
              x: { type: "tween", duration: 0.4, ease: "easeInOut" },
              y: npcActive && npcEmotion === "excited" 
                ? { type: "tween", ease: "easeInOut", duration: 0.5 }
                : { type: "tween", duration: 0.55, ease: "easeOut" },
              rotate: npcActive && npcEmotion === "thinking" 
                ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
                : { duration: 0.3 }
            }}
            style={{
              position:   "absolute",
              bottom:     0,
              left:       isMobile ? "10%" : "3%",
              width:      isMobile ? "80%" : "clamp(260px, 32vw, 540px)",
              height:     "100%",
              zIndex:     npcActive ? 10 : 2,
            }}
          >
            {/* Glow halo behind NPC when speaking */}
            <div style={{
              position:   "absolute",
              bottom:     "8%",
              left:       "10%",
              width:      "80%",
              height:     "65%",
              background: npcActive
                ? (npcEmotion === "excited"
                    ? "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.4) 0%, transparent 72%)"
                    : npcEmotion === "tense"
                    ? "radial-gradient(ellipse at center, rgba(220, 20, 60, 0.4) 0%, transparent 72%)"
                    : `radial-gradient(ellipse at center, ${getTranslucentBg(npc.color, 0.28)} 0%, transparent 72%)`)
                : "transparent",
              animation:  npcActive ? "dlg-speaker-glow 2.2s ease-in-out infinite" : "none",
              opacity:    npcActive ? 1 : 0,
              transition: "opacity 0.55s ease, background 0.55s ease",
              zIndex:     0,
            }} />
            {/* Aspect-ratio matched container to align mouth coordinates exactly */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              aspectRatio: "1/1",
              zIndex: 1,
            }}>
              {/* Character image — breathes when inactive, talks when active and typing */}
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "bottom center",
                }}
              >
                <CharacterImage
                  baseSrc={npcImage}
                  emotion={npcEmotion}
                  alt=""
                  className={npcEmotion === "excited"
                    ? "char-react-correct"
                    : npcEmotion === "tense"
                    ? "char-react-wrong"
                    : (npcActive && !textDone ? "char-talk" : "char-breathe")}
                  style={{
                    position:        "absolute",
                    bottom:          0,
                    left:            0,
                    width:           "100%",
                    height:          "100%",
                    objectFit:       "contain",
                    objectPosition:  "bottom center",
                    maskImage:       charMask,
                    WebkitMaskImage: charMask,
                    zIndex:          1,
                    transformOrigin: "bottom center",
                  } as React.CSSProperties}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <div
            className={npcEmotion === "excited"
              ? "char-react-correct"
              : npcEmotion === "tense"
              ? "char-react-wrong"
              : (npcActive && !textDone ? "char-talk" : "char-breathe")}
            style={{
              position:      "absolute",
              bottom:        "15%",
              left:          isMobile ? "10%" : "5%",
              width:         isMobile ? "80vw" : "clamp(160px, 18vw, 280px)",
              height:         isMobile ? "80vw" : "clamp(160px, 18vw, 280px)",
              zIndex:        npcActive ? 10 : 2,
              transformOrigin: "bottom center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 60 }}
              animate={{
                opacity: npcActive ? 1 : (isMobile ? 0 : 0.25),
                scale: npcActive 
                  ? (npcEmotion === "excited" ? 1.05 : npcEmotion === "thinking" ? 1.01 : 1.02) 
                  : 0.96,
                y: npcActive 
                  ? (npcEmotion === "excited" ? [0, -4, 0] : npcEmotion === "thinking" ? [0, -3, 0] : 0) 
                  : 15,
                x: npcActive 
                  ? (npcEmotion === "tense" ? [-6, 6, -4, 4, -2, 2, -1, 1, 0] : 0) 
                  : 0,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 18,
                x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                y: npcActive && npcEmotion === "excited" 
                  ? { type: "tween", ease: "easeInOut", duration: 0.5 }
                  : { type: "tween", duration: 0.55, ease: "easeOut" }
              }}
              style={{
                position: "absolute",
                inset: 0,
              }}>
              {/* Outer ambient pulse */}
              <div style={{
                position:      "absolute",
                inset:         "-30%",
                borderRadius:  "50%",
                background:    `radial-gradient(ellipse at center, ${getTranslucentBg(npc.color, 0.18)} 0%, transparent 70%)`,
                animation:     npcActive ? "dlg-speaker-glow 2.4s ease-in-out infinite" : "none",
              }} />
              {/* Inner orb body */}
              <div style={{
                position:      "absolute",
                inset:         0,
                borderRadius:  "50%",
                background:    `radial-gradient(circle at 38% 35%, ${getTranslucentBg(npc.color, 0.55)} 0%, ${getTranslucentBg(npc.color, 0.18)} 40%, transparent 72%)`,
                border:        `1.5px solid ${getTranslucentBg(npc.color, 0.45)}`,
                boxShadow:     npcActive
                  ? `0 0 60px ${getTranslucentBg(npc.color, 0.5)}, inset 0 0 30px ${getTranslucentBg(npc.color, 0.2)}`
                  : "none",
                transition:    "box-shadow 0.5s ease",
                backdropFilter:"blur(2px)",
              }} />
              {/* Highlight specular */}
              <div style={{
                position:    "absolute",
                top:         "14%",
                left:        "20%",
                width:       "40%",
                height:      "28%",
                borderRadius:"50%",
                background:  `radial-gradient(ellipse at center, ${getTranslucentBg(npc.color, 0.7)} 0%, transparent 100%)`,
                filter:      "blur(6px)",
              }} />
              {/* Initials label */}
              <div style={{
                position:       "absolute",
                inset:          0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontFamily:     "Inter, sans-serif",
                fontWeight:     900,
                fontSize:       "clamp(1.4rem, 3.5vw, 2.2rem)",
                color:          npc.color,
                textShadow:     `0 0 20px ${npc.color}`,
                letterSpacing:  "0.05em",
              }}>
                {npcInitial}
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Protagonist (right side) ── */}
        {protagonistImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 60, rotate: 0 }}
            animate={{
              opacity: isJake ? 1 : (isMobile ? 0 : 0.25),
              scale: isJake 
                ? (protEmotion === "excited" ? 1.05 : protEmotion === "thinking" ? 1.01 : 1.02) 
                : 0.96,
              y: isJake 
                ? (protEmotion === "excited" ? [0, -4, 0] : protEmotion === "thinking" ? [0, -3, 0] : 0) 
                : 15,
              x: isJake 
                ? (protEmotion === "tense" ? [-6, 6, -4, 4, -2, 2, -1, 1, 0] : 0) 
                : 0,
              rotate: isJake && protEmotion === "thinking" ? [0, 1.5, -1.5, 0] : 0,
              filter: isJake 
                ? (protEmotion === "tense" 
                    ? "drop-shadow(0 0 25px rgba(0, 212, 240, 0.6)) drop-shadow(0 0 12px rgba(180, 0, 255, 0.6))" 
                    : "none") 
                : "grayscale(0.4) brightness(0.65)",
            }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 18,
              x: { type: "tween", duration: 0.4, ease: "easeInOut" },
              y: isJake && protEmotion === "excited" 
                ? { type: "tween", ease: "easeInOut", duration: 0.5 }
                : { type: "tween", duration: 0.55, ease: "easeOut" },
              rotate: isJake && protEmotion === "thinking" 
                ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
                : { duration: 0.3 }
            }}
            style={{
              position:   "absolute",
              bottom:     0,
              right:      isMobile ? "10%" : "3%",
              width:      isMobile ? "80%" : "clamp(260px, 32vw, 540px)",
              height:     "100%",
              zIndex:     isJake ? 10 : 2,
            }}
          >
            {/* Glow halo behind Protagonist when speaking */}
            <div style={{
              position:   "absolute",
              bottom:     "8%",
              right:      "10%",
              width:      "80%",
              height:     "65%",
              background: isJake
                ? (protEmotion === "excited"
                    ? "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.4) 0%, transparent 72%)"
                    : protEmotion === "tense"
                    ? "radial-gradient(ellipse at center, rgba(220, 20, 60, 0.4) 0%, transparent 72%)"
                    : `radial-gradient(ellipse at center, ${getTranslucentBg(protColor, 0.28)} 0%, transparent 72%)`)
                : "transparent",
              animation:  isJake ? "dlg-speaker-glow 2.2s ease-in-out infinite" : "none",
              opacity:    isJake ? 1 : 0,
              transition: "opacity 0.55s ease, background 0.55s ease",
              zIndex:     0,
            }} />
            {/* Aspect-ratio matched container to align mouth coordinates exactly */}
            <div style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              aspectRatio: "1/1",
              zIndex: 1,
            }}>
              {/* Character image — breathes when inactive, talks when active and typing */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "bottom center",
                }}
              >
                <CharacterImage
                  baseSrc={protagonistImage}
                  emotion={protEmotion}
                  alt={protName}
                  className={protEmotion === "excited"
                    ? "char-react-correct"
                    : protEmotion === "tense"
                    ? "char-react-wrong"
                    : (isJake && !textDone ? "char-talk" : "char-breathe")}
                  style={{
                    position:        "absolute",
                    bottom:          0,
                    right:           0,
                    width:           "100%",
                    height:          "100%",
                    objectFit:       "contain",
                    objectPosition:  "bottom center",
                    maskImage:       charMask,
                    WebkitMaskImage: charMask,
                    zIndex:          1,
                    transformOrigin: "bottom center",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Stage light beams (atmosphere) ──────────────────────────────── */}
        <div style={{
          position:   "absolute",
          top:        0,
          left:       "20%",
          width:      "2px",
          height:     "45%",
          background: `linear-gradient(to bottom, ${npc.color.replace("0.9", "0.5")}, transparent)`,
          opacity:    npcActive ? 0.6 : 0,
          transition: "opacity 0.7s ease",
          animation:  npcActive ? "dlg-light-sweep 3s ease-in-out infinite" : "none",
          filter:     "blur(3px)",
        }} />
        <div style={{
          position:   "absolute",
          top:        0,
          right:      "20%",
          width:      "2px",
          height:     "45%",
          background: `linear-gradient(to bottom, ${getTranslucentBg(protColor, 0.5)}, transparent)`,
          opacity:    isJake ? 0.6 : 0,
          transition: "opacity 0.7s ease",
          animation:  isJake ? "dlg-light-sweep 3s ease-in-out infinite" : "none",
          filter:     "blur(3px)",
        }} />

      </div>

      {/* ── Chat panel — bottom 40-45% ───────────────────────────────────────── */}
      <div style={{
        position:       "absolute",
        bottom:         0,
        left:           0,
        right:          0,
        height:         isMobile ? "45%" : "40%",
        zIndex:         20,
        display:        "flex",
        flexDirection:  "column",
        background:     "linear-gradient(180deg, rgba(6,4,14,0) 0%, rgba(6,4,14,0.88) 14%, rgba(6,4,14,0.97) 100%)",
      }}>

        {/* Scrollable bubbles area */}
        <div style={{
          flex:          1,
          overflowY:     "auto",
          display:       "flex",
          flexDirection: "column",
          padding:       "0.5rem 1.1rem 0.3rem",
          gap:           "0.42rem",
          scrollbarWidth:"none",
        }}>
          <div style={{ flex: 1 }} />

          {/* ── Previous lines (dimmed) ───────────────────────────────────── */}
          {lines.slice(0, lineIndex).map((l, i) => {
            const c   = cfg(l.avatar)
            const age = lineIndex - i - 1
            const dim = Math.max(0.18, 0.5 - age * 0.12)
            return (
              <div key={i} style={{
                display:       "flex",
                flexDirection: c.right ? "row-reverse" : "row",
                alignItems:    "flex-end",
                gap:           "0.38rem",
                opacity:       dim,
              }}>
                <div style={{
                  width:"18px", height:"18px", borderRadius:"50%", flexShrink:0,
                  background: c.color.replace("0.9", "0.15"),
                  border:     `1px solid ${c.color.replace("0.9", "0.3")}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.36rem", fontWeight:800, color:c.color,
                  fontFamily:"Inter,sans-serif",
                }}>
                  {c.init}
                </div>
                <div style={{
                  background:   c.bg,
                  border:       `1px solid ${c.color.replace("0.9", "0.18")}`,
                  borderRadius: c.right ? "9px 2px 9px 9px" : "2px 9px 9px 9px",
                  padding:      "0.28rem 0.6rem",
                  maxWidth:     "75%",
                }}>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontStyle:  "italic",
                    fontSize:   "clamp(0.76rem, 2vw, 0.86rem)",
                    color:      "rgba(240,238,255,0.75)",
                    lineHeight: 1.42,
                    margin:     0,
                  }}>
                    {l.text}
                  </p>
                </div>
              </div>
            )
          })}

          {/* ── Active line — springs in from speaker direction ────────────── */}
          <AnimatePresence mode="wait">
            <div
              key={lineIndex}
              style={{
                display:       "flex",
                flexDirection: activeCfg.right ? "row-reverse" : "row",
                alignItems:    "flex-end",
                gap:           "0.42rem",
              }}
            >
              {/* Avatar badge — pops in slightly before the bubble */}
              <div style={{
                width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                background:  speakerColor.replace("0.9", "0.18"),
                border:      `1.5px solid ${speakerColor.replace("0.9", "0.55")}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.48rem", fontWeight:800, color:speakerColor,
                fontFamily:"Inter, sans-serif",
                boxShadow: `0 0 14px ${speakerColor.replace("0.9", "0.3")}`,
                animation: "dlg-bubble-land-" + (activeCfg.right ? "right" : "left") + " 0.38s cubic-bezier(0.34,1.3,0.64,1) both",
              }}>
                {activeCfg.init}
              </div>

              {/* Bubble — directional spring land from speaker's side */}
              <div style={{
                background:   activeCfg.bg,
                border:       `1.5px solid ${speakerColor.replace("0.9", "0.4")}`,
                borderRadius: activeCfg.right ? "14px 3px 14px 14px" : "3px 14px 14px 14px",
                padding:      "0.58rem 0.9rem",
                maxWidth:     isMobile ? "92%" : "78%",
                boxShadow:    `0 0 24px ${speakerColor.replace("0.9", "0.14")}`,
                animation: "dlg-bubble-land-" + (activeCfg.right ? "right" : "left") + " 0.42s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                <div style={{
                  fontFamily:    "Inter, sans-serif",
                  fontSize:      "0.44rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         speakerColor,
                  fontWeight:    700,
                  marginBottom:  "0.22rem",
                  opacity:       0.85,
                }}>
                  {line.speaker}
                </div>
                <p style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle:  "italic",
                  fontSize:   "clamp(0.92rem, 2.6vw, 1.08rem)",
                  color:      "rgba(240,238,255,0.96)",
                  lineHeight: 1.55,
                  margin:     0,
                }}>
                  {visibleText}
                  {!textDone && (
                    <span style={{
                      animation:  "dlg-cursor 0.65s ease-in-out infinite",
                      color:      speakerColor,
                      marginLeft: "2px",
                    }}>|</span>
                  )}
                </p>
              </div>
            </div>
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── Bottom bar: pips + auto-advance progress bar ─────────────── */}
        <div style={{
          padding:        "0.32rem 1.2rem 0.85rem",
          display:        "flex",
          flexDirection:  "column",
          gap:            "0.4rem",
          borderTop:      `1px solid ${speakerColor.replace("0.9", "0.11")}`,
          position:       "relative",
        }}>

          {/* Auto-advance progress bar — thin glowing line sweeping across */}
          <div style={{ width: "100%", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height:     "100%",
              width:      `${autoProgress}%`,
              background: `linear-gradient(90deg, ${speakerColor}, ${speakerColor.replace("0.9","0.5")})`,
              borderRadius: "2px",
              boxShadow:  `0 0 6px ${speakerColor}`,
              transition: autoProgress === 0 ? "none" : "width 0.05s linear",
            }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Progress pips */}
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              {lines.map((_, i) => (
                <div key={i} style={{
                  height:      "3px",
                  width:       i === lineIndex ? "16px" : "5px",
                  borderRadius:"2px",
                  background:  i < lineIndex
                    ? speakerColor.replace("0.9", "0.38")
                    : i === lineIndex
                    ? speakerColor
                    : "rgba(255,255,255,0.11)",
                  transition:  "all 0.3s ease",
                }} />
              ))}
            </div>

            {/* Right side: tap hint + Skip All button */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Tap-to-advance hint */}
              <div style={{
                fontFamily:   "Inter, sans-serif",
                fontSize:     "0.58rem",
                fontWeight:   600,
                letterSpacing:"0.08em",
                color:        speakerColor,
                opacity:      textDone ? 0.45 : 0,
                pointerEvents:"none",
                whiteSpace:   "nowrap",
                transition:   "opacity 0.3s",
              }}>
                tap to advance →
              </div>

              {/* Skip All button — always visible, completes dialogue instantly */}
              <button
                onClick={e => { e.stopPropagation(); onComplete() }}
                style={{
                  fontFamily:    "Inter, sans-serif",
                  fontSize:      "0.58rem",
                  fontWeight:    700,
                  letterSpacing: "0.08em",
                  color:         "rgba(240,238,255,0.42)",
                  background:    "rgba(255,255,255,0.05)",
                  border:        "1px solid rgba(255,255,255,0.1)",
                  borderRadius:  "8px",
                  padding:       "0.22rem 0.65rem",
                  cursor:        "pointer",
                  whiteSpace:    "nowrap",
                  transition:    "color 0.2s, background 0.2s",
                  flexShrink:    0,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,238,255,0.8)"; e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,238,255,0.42)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
              >
                Skip All ⚡
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

