"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene } from "@/lib/games/types"
import SceneEnvironment from "./SceneEnvironment"

/* ── NPC config — colours + initials only (no full-body portraits needed) ── */
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
  /** kept for API compat — not rendered in chat format */
  protagonistVideo?:  string
  protagonistImage?:  string
}

export default function DialogueScene({ scene, onComplete }: Props) {
  const [lineIndex, setLineIndex] = useState(0)
  const [skip,      setSkip]      = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const advanceRef                = useRef<() => void>(() => {})

  /* inject keyframes once */
  useEffect(() => {
    const id = "dlg-chat-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id    = id
    s.textContent = `
      @keyframes dlg-bubble-in {
        from { opacity:0; transform:translateY(10px) scale(0.97); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes dlg-cursor {
        0%,100% { opacity:1; }
        50%     { opacity:0; }
      }
    `
    document.head.appendChild(s)
  }, [])

  const lines = scene.dialogue!
  const line  = lines[lineIndex]
  const isLast = lineIndex >= lines.length - 1

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
      if (["Space","Enter","ArrowRight"].includes(e.code)) { e.preventDefault(); advanceRef.current() }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [])

  useEffect(() => { setSkip(false) }, [lineIndex])

  /* scroll to newest bubble */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lineIndex])

  /* derive NPC key from first non-jake line */
  const sceneNpcKey = lines.find(l => l.avatar !== "jake")?.npcKey ?? "default"
  const npc         = NPC_CONFIGS[sceneNpcKey] ?? NPC_CONFIGS.default

  function cfg(avatar: string) {
    if (avatar === "jake") return { color: JAKE_COLOR,  bg: "rgba(0,212,240,0.1)",  init: JAKE_INIT,   right: true }
    return                        { color: npc.color,   bg: npc.color.replace("0.9","0.1"), init: npc.initial, right: false }
  }

  const activeCfg   = cfg(line.avatar)
  const speakerColor = activeCfg.color

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
      {/* ── Cinematic environment background ─────────────────────────────── */}
      {scene.location && (
        <>
          <div style={{ position:"absolute", inset:0, zIndex:0, opacity:0.28 }}>
            <SceneEnvironment location={scene.location} opacity={1} showCalendar={false} />
          </div>
          <div style={{
            position:   "absolute",
            inset:      0,
            zIndex:     1,
            background: "linear-gradient(180deg,rgba(8,6,15,0.75) 0%,rgba(6,4,14,0.93) 100%)",
          }} />
        </>
      )}

      {/* ── Location pill ────────────────────────────────────────────────── */}
      {scene.location && (
        <div style={{
          position:       "relative",
          zIndex:         2,
          padding:        "4.2rem 1.5rem 0",
          display:        "flex",
          justifyContent: "center",
          pointerEvents:  "none",
        }}>
          <div style={{
            fontFamily:     "Inter, sans-serif",
            fontSize:       "0.6rem",
            letterSpacing:  "0.28em",
            textTransform:  "uppercase",
            color:          "rgba(240,238,255,0.45)",
            fontWeight:     700,
            background:     "rgba(8,6,15,0.55)",
            backdropFilter: "blur(8px)",
            borderRadius:   "100px",
            padding:        "0.22rem 0.85rem",
            border:         "1px solid rgba(255,255,255,0.07)",
          }}>
            {scene.location}
          </div>
        </div>
      )}

      {/* ── Chat thread ──────────────────────────────────────────────────── */}
      <div
        style={{
          flex:          1,
          overflowY:     "auto",
          display:       "flex",
          flexDirection: "column",
          padding:       "0.75rem 1.1rem 0.5rem",
          gap:           "0.6rem",
          position:      "relative",
          zIndex:        2,
          scrollbarWidth:"none",
        }}
      >
        {/* spacer — keeps messages bottom-anchored when few exist */}
        <div style={{ flex: 1 }} />

        {/* ── Previous lines (fully typed, dimmed) ─────────────────────── */}
        {lines.slice(0, lineIndex).map((l, i) => {
          const c   = cfg(l.avatar)
          const dim = Math.max(0.28, 0.55 - (lineIndex - i - 1) * 0.08) // fade as they recede
          return (
            <div key={i} style={{
              display:       "flex",
              flexDirection: c.right ? "row-reverse" : "row",
              alignItems:    "flex-end",
              gap:           "0.45rem",
              opacity:       dim,
            }}>
              {/* avatar */}
              <div style={{
                width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                background: c.color.replace("0.9","0.15"),
                border:     `1px solid ${c.color.replace("0.9","0.3")}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"0.48rem", fontWeight:800, color:c.color,
                fontFamily:"Inter,sans-serif", letterSpacing:"0.04em",
              }}>
                {c.init}
              </div>
              {/* bubble */}
              <div style={{
                background:   c.bg,
                border:       `1px solid ${c.color.replace("0.9","0.2")}`,
                borderRadius: c.right ? "13px 3px 13px 13px" : "3px 13px 13px 13px",
                padding:      "0.45rem 0.8rem",
                maxWidth:     "78%",
              }}>
                <div style={{
                  fontFamily:    "Inter,sans-serif",
                  fontSize:      "0.45rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         c.color,
                  fontWeight:    700,
                  marginBottom:  "0.2rem",
                  opacity:       0.75,
                }}>
                  {l.speaker}
                </div>
                <p style={{
                  fontFamily: "Cormorant Garamond,serif",
                  fontStyle:  "italic",
                  fontSize:   "clamp(0.88rem,2.5vw,1rem)",
                  color:      "rgba(240,238,255,0.8)",
                  lineHeight: 1.5,
                  margin:     0,
                }}>
                  {l.text}
                </p>
              </div>
            </div>
          )
        })}

        {/* ── Active line (typewriter + spring entrance) ─────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lineIndex}
            initial={{ opacity:0, y:14, scale:0.96 }}
            animate={{ opacity:1, y:0,  scale:1    }}
            transition={{ type:"spring", stiffness:420, damping:32 }}
            style={{
              display:       "flex",
              flexDirection: activeCfg.right ? "row-reverse" : "row",
              alignItems:    "flex-end",
              gap:           "0.5rem",
            }}
          >
            {/* avatar */}
            <div style={{
              width:"38px", height:"38px", borderRadius:"50%", flexShrink:0,
              background:  speakerColor.replace("0.9","0.15"),
              border:      `1.5px solid ${speakerColor.replace("0.9","0.5")}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"0.62rem", fontWeight:800, color:speakerColor,
              fontFamily:"Inter,sans-serif", letterSpacing:"0.04em",
              boxShadow: `0 0 18px ${speakerColor.replace("0.9","0.22")}`,
            }}>
              {activeCfg.init}
            </div>
            {/* bubble */}
            <div style={{
              background:  speakerColor.replace("0.9","0.09"),
              border:      `1.5px solid ${speakerColor.replace("0.9","0.32")}`,
              borderRadius: activeCfg.right ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              padding:     "0.75rem 1.05rem",
              maxWidth:    "82%",
              boxShadow:   `0 0 28px ${speakerColor.replace("0.9","0.1")}`,
            }}>
              <div style={{
                fontFamily:    "Inter,sans-serif",
                fontSize:      "0.5rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         speakerColor,
                fontWeight:    700,
                marginBottom:  "0.28rem",
              }}>
                {line.speaker}
              </div>
              <p style={{
                fontFamily: "Cormorant Garamond,serif",
                fontStyle:  "italic",
                fontSize:   "clamp(1rem,2.8vw,1.22rem)",
                color:      "rgba(240,238,255,0.95)",
                lineHeight: 1.58,
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

      {/* ── Bottom bar — progress pips + tap hint ────────────────────────── */}
      <div style={{
        position:      "relative",
        zIndex:        2,
        padding:       "0.65rem 1.4rem 1.2rem",
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
        background:    "rgba(6,4,14,0.72)",
        backdropFilter:"blur(20px)",
        borderTop:     `1px solid ${speakerColor.replace("0.9","0.14")}`,
      }}>
        <div style={{ position: "absolute", left: "1.4rem", display:"flex", gap:"4px", alignItems:"center" }}>
          {lines.map((_, i) => (
            <div key={i} style={{
              height:      "4px",
              width:       i === lineIndex ? "18px" : "5px",
              borderRadius:"2px",
              background:  i < lineIndex
                ? speakerColor.replace("0.9","0.35")
                : i === lineIndex
                ? speakerColor
                : "rgba(255,255,255,0.12)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
        <motion.span
          animate={{ opacity: textDone ? 1 : 0 }}
          transition={{ duration:0.3 }}
          style={{
            fontFamily:    "Inter,sans-serif",
            fontSize:      "0.65rem",
            color:         "rgba(255,255,255,0.35)",
            letterSpacing: "0.08em",
          }}
        >
          tap to continue →
        </motion.span>
      </div>
    </div>
  )
}
