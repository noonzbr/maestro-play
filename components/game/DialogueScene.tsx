"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Scene } from "@/lib/games/types"
import GameIcon from "./GameIcon"
import { IconName } from "./GameIcon"

type NpcConfig = {
  icon: IconName
  color: string
  bg: string
}

const NPC_CONFIGS: Record<string, NpcConfig> = {
  default:     { icon: "headphones", color: "rgba(224,64,251,0.9)", bg: "rgba(224,64,251,0.06)" },
  senora_vega: { icon: "harp",       color: "rgba(255,180,80,0.9)", bg: "rgba(255,180,80,0.06)" },
  marcus:      { icon: "headphones", color: "rgba(80,160,255,0.9)", bg: "rgba(80,160,255,0.06)" },
  ai:          { icon: "musicNotes", color: "rgba(0,212,240,0.9)",  bg: "rgba(0,212,240,0.06)"  },
}

function useTypewriter(text: string, speed: number) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    if (!text) { setDone(true); return }
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setDone(true) }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return { displayed, done }
}

type Props = {
  scene: Scene
  onComplete: () => void
}

export default function DialogueScene({ scene, onComplete }: Props) {
  const [lineIndex, setLineIndex] = useState(0)
  const [skip, setSkip] = useState(false)

  const lines = scene.dialogue!
  const line = lines[lineIndex]
  const isLast = lineIndex >= lines.length - 1

  const { displayed, done } = useTypewriter(skip ? "" : line.text, 18)
  const visibleText = skip ? line.text : displayed
  const textDone = skip || done

  const advanceRef = useRef<() => void>(() => {})

  const advance = useCallback(() => {
    if (!textDone) {
      setSkip(true)
    } else {
      setSkip(false)
      if (isLast) {
        onComplete()
      } else {
        setLineIndex(i => i + 1)
      }
    }
  }, [textDone, isLast, onComplete])

  useEffect(() => { advanceRef.current = advance }, [advance])

  // Keyboard support — stable handler via ref
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

  const isJake = line.avatar === "jake"
  const npcKey = line.npcKey || "default"
  const npc = NPC_CONFIGS[npcKey] || NPC_CONFIGS.default
  const jakeActive = isJake
  const npcActive = !isJake

  const speakerColor = isJake ? "var(--cyan)" : npc.color
  const speakerBorder = isJake ? "rgba(0,212,240,0.25)" : npc.color.replace("0.9", "0.25")
  const speakerBg = isJake ? "rgba(0,212,240,0.07)" : npc.color.replace("0.9", "0.07")
  const boxBorder = isJake ? "rgba(0,212,240,0.35)" : npc.color

  return (
    <div
      onClick={advance}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        zIndex: 20,
        userSelect: "none",
      }}
    >
      {/* Stage — characters */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        paddingTop: "60px",  // clear top bar
        paddingBottom: "185px", // clear dialogue box
        position: "relative",
      }}>

        {/* Location label */}
        {scene.location && (
          <div style={{
            position: "absolute",
            top: "68px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(240,238,255,0.25)",
            fontWeight: 600,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}>
            {scene.location}
          </div>
        )}

        {/* Jake — left */}
        <div style={{
          flex: "0 0 46%",
          paddingLeft: "clamp(0.5rem, 3vw, 2rem)",
          opacity: jakeActive ? 1 : 0.3,
          transform: jakeActive ? "translateY(0) scale(1)" : "translateY(14px) scale(0.93)",
          filter: jakeActive ? "drop-shadow(0 0 28px rgba(0,212,240,0.3))" : "none",
          transition: "all 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <img
            src="/images/guitarplayer1.png"
            alt="Jake"
            draggable={false}
            style={{ width: "100%", maxHeight: "52vh", objectFit: "contain", display: "block" }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* NPC — right */}
        <div style={{
          flex: "0 0 36%",
          maxWidth: "260px",
          paddingRight: "clamp(0.5rem, 3vw, 2rem)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          opacity: npcActive ? 1 : 0.3,
          transform: npcActive ? "translateY(0) scale(1)" : "translateY(14px) scale(0.93)",
          filter: npcActive ? `drop-shadow(0 0 24px ${npc.color.replace("0.9", "0.3")})` : "none",
          transition: "all 0.42s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{
            width: "clamp(120px, 18vw, 170px)",
            background: npc.bg,
            borderTop: `2px solid ${npc.color}`,
            borderLeft: `2px solid ${npc.color}`,
            borderRight: `2px solid ${npc.color}`,
            borderBottom: "none",
            borderRadius: "18px 18px 0 0",
            padding: "1.75rem 1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
          }}>
            <div style={{
              filter: npcActive ? `drop-shadow(0 0 16px ${npc.color})` : "none",
              transition: "filter 0.42s ease",
            }}>
              <GameIcon name={npc.icon} size={72} />
            </div>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: npc.color,
              textAlign: "center",
            }}>
              {line.speaker}
            </span>
          </div>
        </div>
      </div>

      {/* Dialogue box */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(8,6,15,0.94)",
        backdropFilter: "blur(28px)",
        borderTop: `2px solid ${boxBorder}`,
        padding: "1.2rem 2rem 1.6rem",
        zIndex: 30,
        minHeight: "170px",
      }}>
        <div style={{ maxWidth: "740px", margin: "0 auto" }}>
          {/* Speaker chip */}
          <div style={{
            display: "inline-block",
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: speakerColor,
            background: speakerBg,
            border: `1px solid ${speakerBorder}`,
            borderRadius: "100px",
            padding: "0.2rem 0.75rem",
            marginBottom: "0.6rem",
          }}>
            {line.speaker}
          </div>

          {/* Dialogue text */}
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "clamp(1.05rem, 2.8vw, 1.3rem)",
            color: "rgba(240,238,255,0.95)",
            lineHeight: 1.55,
            margin: "0 0 0.8rem",
            minHeight: "2.8rem",
          }}>
            {visibleText}
            {!textDone && (
              <span style={{ animation: "pulse-glow 0.7s ease-in-out infinite", color: "var(--cyan)", marginLeft: "2px" }}>|</span>
            )}
          </p>

          {/* Footer: progress + hint */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {lines.map((_, i) => (
                <div key={i} style={{
                  height: "4px",
                  width: i === lineIndex ? "16px" : "5px",
                  borderRadius: "2px",
                  background: i < lineIndex ? "rgba(0,212,240,0.4)" : i === lineIndex ? "var(--cyan)" : "rgba(255,255,255,0.12)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.68rem",
              color: textDone ? "rgba(255,255,255,0.4)" : "transparent",
              letterSpacing: "0.08em",
              animation: textDone ? "pulse-glow 1.8s ease-in-out infinite" : "none",
            }}>
              tap to continue →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
