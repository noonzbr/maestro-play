"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene } from "@/lib/games/types"

/* ── Background image map — keyed by location keyword ──────────────────── */
function getBackgroundImage(location: string): string {
  const loc = location.toUpperCase()
  if (loc.includes("PRACTICE ROOM")) return "/images/bg-practiceroom.png"
  if (loc.includes("BAND PRACTICE")) return "/images/bg-bandpractice.png"
  if (loc.includes("SCHOOL HALLWAY") || loc.includes("HALLWAY")) return "/images/bg-hallway.png"
  if (loc.includes("MUSIC CLASS") || loc.includes("CLASSROOM")) return "/images/bg-musicclass.png"
  if (loc.includes("BEDROOM")) return "/images/bg-bedroom.png"
  return ""   // fallback — plain dark bg
}

/* ── NPC portrait map ──────────────────────────────────────────────────── */
const NPC_IMAGES: Record<string, string> = {
  senora_vega: "/images/senoravega.png?v=2",
  tyler:       "/images/tyler.png?v=2",
  ai:          "",
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
}

/* ── Typewriter hook ────────────────────────────────────────────────────── */
function useTypewriter(text: string, speed: number) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed("")
    setDone(false)
    if (!text) { setDone(true); return }
    let i = 0
    const t = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(t); setDone(true) }
    }, speed)
    return () => clearInterval(t)
  }, [text, speed])
  return { displayed, done }
}

type Props = {
  scene:              Scene
  onComplete:         () => void
  protagonistVideo?:  string
  protagonistImage?:  string
}

export default function VisualNovelScene({ scene, onComplete, protagonistImage }: Props) {
  const [lineIndex, setLineIndex] = useState(0)
  const [skip,      setSkip]      = useState(false)
  const [flashKey,  setFlashKey]  = useState(0)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const advanceRef                = useRef<() => void>(() => {})

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
  const isJake = line.avatar === "jake"

  /* Flash on every new line */
  useEffect(() => { setFlashKey(k => k + 1) }, [lineIndex])

  const { displayed, done } = useTypewriter(skip ? "" : line.text, 20)
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
  const sceneNpcKey = lines.find(l => l.avatar !== "jake")?.npcKey ?? "default"
  const npc         = NPC_CONFIGS[sceneNpcKey] ?? NPC_CONFIGS.default
  const npcImage    = NPC_IMAGES[sceneNpcKey] ?? ""

  function cfg(avatar: string) {
    if (avatar === "jake") return { color: JAKE_COLOR, bg: "rgba(0,212,240,0.13)", init: JAKE_INIT, right: true }
    return                        { color: npc.color,  bg: npc.color.replace("0.9", "0.13"), init: npc.initial, right: false }
  }

  const activeCfg    = cfg(line.avatar)
  const speakerColor = activeCfg.color
  const npcActive    = !isJake
  const bgImage      = scene.location ? getBackgroundImage(scene.location) : ""

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

      {/* ── Scene environment background ─────────────────────────────────── */}
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
      ) : scene.location ? (
        /* Fallback: plain dark gradient for unrecognised locations */
        <div style={{
          position:   "absolute",
          inset:      0,
          zIndex:     0,
          background: "linear-gradient(180deg, #0d0b1e 0%, #080614 100%)",
        }} />
      ) : null}

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
            fontSize:       "0.8rem",
            letterSpacing:  "0.28em",
            textTransform:  "uppercase",
            color:          "rgba(240,238,255,0.55)",
            fontWeight:     700,
            background:     "rgba(6,4,14,0.65)",
            backdropFilter: "blur(12px)",
            borderRadius:   "100px",
            padding:        "0.32rem 1.1rem",
            border:         "1px solid rgba(255,255,255,0.09)",
          }}>
            {scene.location}
          </div>
        </div>
      )}

      {/* ── Character stage ───────────────────────────────────────────────── */}
      {/* Positioned below the top bar, above the chat panel */}
      <div style={{
        position:      "absolute",
        left:          0,
        right:         0,
        top:           "4.8rem",
        bottom:        "38%",
        zIndex:        5,
        pointerEvents: "none",
        overflow:      "hidden",
      }}>

        {/* ── NPC (left side) ── */}
        {npcImage ? (
          <div style={{
            position:   "absolute",
            bottom:     0,
            left:       "-2%",
            width:      "50%",
            height:     "100%",
            transition: "opacity 0.55s ease, filter 0.55s ease",
            opacity:    npcActive ? 1 : 0.22,
            filter:     npcActive ? "none" : "grayscale(0.5) brightness(0.7)",
          }}>
            {/* Glow halo behind NPC when speaking */}
            <div style={{
              position:   "absolute",
              bottom:     "8%",
              left:       "15%",
              width:      "70%",
              height:     "65%",
              background: `radial-gradient(ellipse at center, ${npc.color.replace("0.9", "0.28")} 0%, transparent 72%)`,
              animation:  npcActive ? "dlg-speaker-glow 2.2s ease-in-out infinite" : "none",
              opacity:    npcActive ? 1 : 0,
              transition: "opacity 0.55s ease",
              zIndex:     0,
            }} />
            <img
              src={npcImage}
              alt=""
              draggable={false}
              style={{
                position:        "absolute",
                bottom:          0,
                left:            0,
                width:           "100%",
                height:          "100%",
                objectFit:       "contain",
                objectPosition:  "bottom left",
                maskImage:       charMask,
                WebkitMaskImage: charMask,
                zIndex:          1,
              } as React.CSSProperties}
            />
          </div>
        ) : (
          /* Fallback large avatar orb for AI/no-image NPCs */
          <div style={{
            position:      "absolute",
            bottom:        "18%",
            left:          "8%",
            width:         "72px",
            height:        "72px",
            borderRadius:  "50%",
            background:    npc.color.replace("0.9", "0.12"),
            border:        `2px solid ${npc.color.replace("0.9", "0.45")}`,
            display:       "flex",
            alignItems:    "center",
            justifyContent:"center",
            fontFamily:    "Inter, sans-serif",
            fontWeight:    800,
            fontSize:      "1.1rem",
            color:         npc.color,
            opacity:       npcActive ? 1 : 0.25,
            transition:    "opacity 0.5s ease, box-shadow 0.5s ease",
            boxShadow:     npcActive ? `0 0 40px ${npc.color.replace("0.9", "0.35")}` : "none",
          }}>
            {npc.initial}
          </div>
        )}

        {/* ── Jake (right side) ── */}
        {protagonistImage && (
          <div style={{
            position:   "absolute",
            bottom:     0,
            right:      "-2%",
            width:      "50%",
            height:     "100%",
            transition: "opacity 0.55s ease, filter 0.55s ease",
            opacity:    isJake ? 1 : 0.22,
            filter:     isJake ? "none" : "grayscale(0.5) brightness(0.7)",
          }}>
            {/* Glow halo behind Jake when speaking */}
            <div style={{
              position:   "absolute",
              bottom:     "8%",
              right:      "15%",
              width:      "70%",
              height:     "65%",
              background: `radial-gradient(ellipse at center, ${JAKE_COLOR.replace("0.9", "0.28")} 0%, transparent 72%)`,
              animation:  isJake ? "dlg-speaker-glow 2.2s ease-in-out infinite" : "none",
              opacity:    isJake ? 1 : 0,
              transition: "opacity 0.55s ease",
              zIndex:     0,
            }} />
            <img
              src={protagonistImage}
              alt="Jake"
              draggable={false}
              style={{
                position:        "absolute",
                bottom:          0,
                right:           0,
                width:           "100%",
                height:          "100%",
                objectFit:       "contain",
                objectPosition:  "bottom right",
                maskImage:       charMask,
                WebkitMaskImage: charMask,
                zIndex:          1,
              }}
            />
          </div>
        )}

        {/* ── Stage light beams when speaking (subtle atmosphere) ─────────── */}
        {/* Left beam (NPC side) */}
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
        {/* Right beam (Jake side) */}
        <div style={{
          position:   "absolute",
          top:        0,
          right:      "20%",
          width:      "2px",
          height:     "45%",
          background: `linear-gradient(to bottom, ${JAKE_COLOR.replace("0.9", "0.5")}, transparent)`,
          opacity:    isJake ? 0.6 : 0,
          transition: "opacity 0.7s ease",
          animation:  isJake ? "dlg-light-sweep 3s ease-in-out infinite" : "none",
          filter:     "blur(3px)",
        }} />

      </div>

      {/* ── Chat panel — bottom 38% ───────────────────────────────────────── */}
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

          {/* ── Previous lines (dimmed, receding) ─────────────────────── */}
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
                {/* Mini avatar */}
                <div style={{
                  width:"24px", height:"24px", borderRadius:"50%", flexShrink:0,
                  background: c.color.replace("0.9", "0.15"),
                  border:     `1px solid ${c.color.replace("0.9", "0.3")}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.65rem", fontWeight:800, color:c.color,
                  fontFamily:"Inter,sans-serif",
                }}>
                  {c.init}
                </div>
                {/* Bubble */}
                <div style={{
                  background:   c.bg,
                  border:       `1px solid ${c.color.replace("0.9", "0.18")}`,
                  borderRadius: c.right ? "9px 2px 9px 9px" : "2px 9px 9px 9px",
                  padding:      "0.38rem 0.75rem",
                  maxWidth:     "75%",
                }}>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontStyle:  "italic",
                    fontSize:   "clamp(0.95rem, 2vw, 1.05rem)",
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

          {/* ── Active line — springs in ───────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={lineIndex}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
              style={{
                display:       "flex",
                flexDirection: activeCfg.right ? "row-reverse" : "row",
                alignItems:    "flex-end",
                gap:           "0.42rem",
              }}
            >
              {/* Avatar badge */}
              <div style={{
                width:"36px", height:"36px", borderRadius:"50%", flexShrink:0,
                background:  speakerColor.replace("0.9", "0.18"),
                border:      `1.5px solid ${speakerColor.replace("0.9", "0.55")}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.8rem", fontWeight:800, color:speakerColor,
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
                  fontSize:      "0.75rem",
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
                  fontSize:   "clamp(1.15rem, 2.6vw, 1.35rem)",
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
          <motion.span
            animate={{ opacity: textDone ? 1 : 0 }}
            transition={{ duration: 0.28 }}
            style={{
              fontFamily:    "Inter, sans-serif",
              fontSize:      "0.85rem",
              color:         "rgba(255,255,255,0.32)",
              letterSpacing: "0.08em",
            }}
          >
            tap to continue →
          </motion.span>
        </div>
      </div>

    </div>
  )
}
