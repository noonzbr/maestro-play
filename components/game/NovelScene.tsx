"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene } from "@/lib/games/types"

/* ── Audio Synthesis Dialogue Voice (Celeste/Animal Crossing style) ────── */
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
function resolveNpcKey(keyOrSpeaker: string | undefined): string {
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
  const [lineIndex, setLineIndex] = useState(0)
  const [skip,      setSkip]      = useState(false)
  const [flashKey,  setFlashKey]  = useState(0)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const advanceRef                = useRef<() => void>(() => {})

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

  const advance = useCallback(() => {
    if (!textDone) { setSkip(true) }
    else {
      setSkip(false)
      if (isLast) onComplete()
      else setLineIndex(i => i + 1)
    }
  }, [textDone, isLast, onComplete])

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
  const activeEmotion = getLineEmotion(line.text)
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
          <div style={{
            position:           "absolute",
            inset:              0,
            zIndex:             0,
            backgroundImage:    `url(${bgImage})`,
            backgroundSize:     "cover",
            backgroundPosition: "center center",
          }} />
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

      {/* ── Speaker flash — radial light burst on new line ───────────────── */}
      <div
        key={flashKey}
        style={{
          position:      "absolute",
          inset:         0,
          zIndex:        2,
          pointerEvents: "none",
          background:    `radial-gradient(ellipse at ${isJake ? "72%" : "28%"} 45%, ${speakerColor.replace("0.9", "0.2")} 0%, transparent 55%)`,
          animation:     "dlg-flash-left 0.65s ease-out both",
        }}
      />

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
        bottom:        isMobile ? "38%" : "18%",
        zIndex:        5,
        pointerEvents: "none",
        overflow:      "hidden",
      }}>

        {/* ── NPC (left side) ── */}
        {npcImage ? (
          <motion.div
            animate={{
              opacity: npcActive ? 1 : (isMobile ? 0.08 : 0.25),
              scale: npcActive 
                ? (npcEmotion === "excited" ? 1.04 : npcEmotion === "thinking" ? 1.01 : 1.02) 
                : 0.96,
              y: npcActive 
                ? (npcEmotion === "excited" ? [0, -12, -4, 0] : npcEmotion === "thinking" ? [0, -4, 0] : 0) 
                : 15,
              x: npcActive 
                ? (npcEmotion === "tense" ? [-5, 5, -3, 3, -1.5, 1.5, 0] : 0) 
                : 0,
              filter: npcActive ? "none" : "grayscale(0.4) brightness(0.65)",
            }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              x: { type: "tween", duration: 0.45, ease: "easeInOut" },
              y: { type: "tween", duration: 0.55, ease: "easeOut" },
            }}
            style={{
              position:   "absolute",
              bottom:     0,
              left:       isMobile ? "1%" : "3%",
              width:      isMobile ? "46%" : "clamp(260px, 32vw, 540px)",
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
              background: `radial-gradient(ellipse at center, ${getTranslucentBg(npc.color, 0.28)} 0%, transparent 72%)`,
              animation:  npcActive ? "dlg-speaker-glow 2.2s ease-in-out infinite" : "none",
              opacity:    npcActive ? 1 : 0,
              transition: "opacity 0.55s ease",
              zIndex:     0,
            }} />
            {/* Character image — breathes when inactive, talks when active */}
            <img
              src={npcImage}
              alt=""
              draggable={false}
              className={npcActive ? "char-talk" : "char-breathe"}
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
          </motion.div>
        ) : (
          /* Fallback — large glowing AI orb when no portrait image */
          <motion.div
            className={npcActive ? "char-talk" : "char-breathe"}
            animate={{
              opacity: npcActive ? 1 : (isMobile ? 0.08 : 0.25),
              scale: npcActive 
                ? (npcEmotion === "excited" ? 1.04 : npcEmotion === "thinking" ? 1.01 : 1.02) 
                : 0.96,
              y: npcActive 
                ? (npcEmotion === "excited" ? [0, -12, -4, 0] : npcEmotion === "thinking" ? [0, -4, 0] : 0) 
                : 15,
              x: npcActive 
                ? (npcEmotion === "tense" ? [-5, 5, -3, 3, -1.5, 1.5, 0] : 0) 
                : 0,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              x: { type: "tween", duration: 0.45, ease: "easeInOut" },
              y: { type: "tween", duration: 0.55, ease: "easeOut" },
            }}
            style={{
              position:      "absolute",
              bottom:        "15%",
              left:          isMobile ? "3%" : "5%",
              width:         isMobile ? "40vw" : "clamp(160px, 18vw, 280px)",
              height:         isMobile ? "40vw" : "clamp(160px, 18vw, 280px)",
              zIndex:        npcActive ? 10 : 2,
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
        )}

        {/* ── Protagonist (right side) ── */}
        {protagonistImage && (
          <motion.div
            animate={{
              opacity: isJake ? 1 : (isMobile ? 0.08 : 0.25),
              scale: isJake 
                ? (protEmotion === "excited" ? 1.04 : protEmotion === "thinking" ? 1.01 : 1.02) 
                : 0.96,
              y: isJake 
                ? (protEmotion === "excited" ? [0, -12, -4, 0] : protEmotion === "thinking" ? [0, -4, 0] : 0) 
                : 15,
              x: isJake 
                ? (protEmotion === "tense" ? [-5, 5, -3, 3, -1.5, 1.5, 0] : 0) 
                : 0,
              filter: isJake ? "none" : "grayscale(0.4) brightness(0.65)",
            }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              x: { type: "tween", duration: 0.45, ease: "easeInOut" },
              y: { type: "tween", duration: 0.55, ease: "easeOut" },
            }}
            style={{
              position:   "absolute",
              bottom:     0,
              right:      isMobile ? "1%" : "3%",
              width:      isMobile ? "46%" : "clamp(260px, 32vw, 540px)",
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
              background: `radial-gradient(ellipse at center, ${getTranslucentBg(protColor, 0.28)} 0%, transparent 72%)`,
              animation:  isJake ? "dlg-speaker-glow 2.2s ease-in-out infinite" : "none",
              opacity:    isJake ? 1 : 0,
              transition: "opacity 0.55s ease",
              zIndex:     0,
            }} />
            {/* Character image — breathes when inactive, talks when active */}
            <img
              src={protagonistImage}
              alt={protName}
              draggable={false}
              className={isJake ? "char-talk" : "char-breathe"}
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

      {/* ── Chat panel — bottom 40% ───────────────────────────────────────── */}
      <div style={{
        position:       "absolute",
        bottom:         0,
        left:           0,
        right:          0,
        height:         "40%",
        zIndex:         10,
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

          {/* ── Active line — springs in ───────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={lineIndex}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              transition={{ type: "spring", stiffness: 520, damping: 28, mass: 0.8 }}
              style={{
                display:       "flex",
                flexDirection: activeCfg.right ? "row-reverse" : "row",
                alignItems:    "flex-end",
                gap:           "0.42rem",
              }}
            >
              {/* Avatar badge */}
              <div style={{
                width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                background:  speakerColor.replace("0.9", "0.18"),
                border:      `1.5px solid ${speakerColor.replace("0.9", "0.55")}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.48rem", fontWeight:800, color:speakerColor,
                fontFamily:"Inter, sans-serif",
                boxShadow: `0 0 14px ${speakerColor.replace("0.9", "0.3")}`,
              }}>
                {activeCfg.init}
              </div>

              {/* Bubble */}
              <div style={{
                background:   activeCfg.bg,
                border:       `1.5px solid ${speakerColor.replace("0.9", "0.4")}`,
                borderRadius: activeCfg.right ? "14px 3px 14px 14px" : "3px 14px 14px 14px",
                padding:      "0.58rem 0.9rem",
                maxWidth:     "78%",
                boxShadow:    `0 0 24px ${speakerColor.replace("0.9", "0.14")}`,
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
            </motion.div>
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* ── Bottom bar: pips + hint ───────────────────────────────────── */}
        <div style={{
          padding:        "0.42rem 1.2rem 1.1rem",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          borderTop:      `1px solid ${speakerColor.replace("0.9", "0.11")}`,
          position:       "relative",
        }}>
          <div style={{ position: "absolute", left: "1.2rem", display: "flex", gap: "4px", alignItems: "center" }}>
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
          {/* Tap-to-continue — clear pulsing pill so it's never missed */}
          <motion.div
            animate={textDone
              ? { opacity: [0.75, 1, 0.75], scale: [1, 1.03, 1] }
              : { opacity: 0, scale: 1 }}
            transition={textDone
              ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.28 }}
            style={{
              display:        "flex",
              alignItems:     "center",
              gap:            "0.4rem",
              fontFamily:     "Inter, sans-serif",
              fontSize:       "0.74rem",
              fontWeight:     700,
              letterSpacing:  "0.06em",
              color:          speakerColor,
              background:     getTranslucentBg(speakerColor, 0.12),
              border:         `1px solid ${getTranslucentBg(speakerColor, 0.45)}`,
              borderRadius:   "100px",
              padding:        "0.4rem 0.95rem",
              boxShadow:      `0 0 18px ${getTranslucentBg(speakerColor, 0.25)}`,
              pointerEvents:  "none",
              whiteSpace:     "nowrap",
            }}
          >
            Tap anywhere to continue
            <span style={{ fontSize: "0.95rem" }}>→</span>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
