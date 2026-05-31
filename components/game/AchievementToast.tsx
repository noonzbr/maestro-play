"use client"

import { useEffect, useState, useRef } from "react"

/* ── Achievement catalogue ──────────────────────────────────────────────── */
export const ACHIEVEMENTS = {
  first_game:    { icon: "🎵", title: "First Note",      subtitle: "You played your first game — the journey begins.", color: "#00d4f0" },
  streak_3:      { icon: "🔥", title: "On Fire",          subtitle: "3 correct answers in a row. Keep conducting.",       color: "#ff9800" },
  streak_5:      { icon: "⚡", title: "Unstoppable",      subtitle: "5 in a row. The orchestra is yours.",                color: "#ffeb3b" },
  level_assoc:   { icon: "⭐", title: "Associate",        subtitle: "Reached 500 XP — levelled up!",                    color: "#e040fb" },
  level_cond:    { icon: "🎼", title: "Conductor",        subtitle: "Reached 1500 XP — the title is earned.",            color: "#ffb700" },
  level_maestro: { icon: "👑", title: "Grand Maestro",    subtitle: "3000 XP — you conduct the symphony.",               color: "#ff6b35" },
  first_boss:    { icon: "🏆", title: "Conductor Test",   subtitle: "Survived your first boss challenge.",                color: "#e040fb" },
} as const

export type AchievementId = keyof typeof ACHIEVEMENTS

/* ── Toast component ────────────────────────────────────────────────────── */
type Props = { trigger?: { id: AchievementId; ts?: number } }

export default function AchievementToast({ trigger }: Props) {
  const [queue,   setQueue]   = useState<Array<{ id: AchievementId; key: number }>>([])
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState<AchievementId | null>(null)
  const keyRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Inject keyframes once */
  useEffect(() => {
    const id = "achievement-toast-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes ach-in {
        0%   { opacity:0; transform:translateX(110%) scale(0.85); }
        60%  { transform:translateX(-6%) scale(1.03); }
        100% { opacity:1; transform:translateX(0) scale(1); }
      }
      @keyframes ach-out {
        0%   { opacity:1; transform:translateX(0); }
        100% { opacity:0; transform:translateX(110%); }
      }
      @keyframes ach-icon-pop {
        0%   { transform:scale(0.5) rotate(-20deg); }
        55%  { transform:scale(1.25) rotate(6deg); }
        100% { transform:scale(1) rotate(0deg); }
      }
      @keyframes ach-shimmer {
        0%   { transform:translateX(-100%) skewX(-12deg); opacity:0; }
        15%  { opacity:0.55; }
        100% { transform:translateX(400%) skewX(-12deg); opacity:0; }
      }
    `
    document.head.appendChild(s)
  }, [])

  /* Enqueue new achievement */
  useEffect(() => {
    if (!trigger?.id) return
    const id = trigger.id
    const alreadyShown = (() => {
      try { return !!localStorage.getItem(`maestro_ach_${id}`) } catch { return false }
    })()
    if (alreadyShown) return
    try { localStorage.setItem(`maestro_ach_${id}`, "1") } catch {}
    keyRef.current += 1
    setQueue(q => [...q, { id, key: keyRef.current }])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.id, trigger?.ts])

  /* Process queue — show one at a time */
  useEffect(() => {
    if (visible || queue.length === 0) return
    const [next, ...rest] = queue
    setQueue(rest)
    setCurrent(next.id)
    setVisible(true)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setCurrent(null), 500)
    }, 2200)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [queue, visible])

  if (!current) return null
  const ach = ACHIEVEMENTS[current]

  return (
    <div
      onClick={() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setVisible(false)
        setTimeout(() => setCurrent(null), 400)
      }}
      style={{
        position:       "fixed",
        bottom:         "5.5rem",
        right:          "1.25rem",
        zIndex:         350,
        minWidth:       "260px",
        maxWidth:       "300px",
        background:     "rgba(6,4,14,0.97)",
        border:         `1px solid ${ach.color}55`,
        borderLeft:     `3px solid ${ach.color}`,
        borderRadius:   "14px",
        padding:        "0.9rem 1.1rem",
        backdropFilter: "blur(24px)",
        boxShadow:      `0 0 48px ${ach.color}18, 0 12px 40px rgba(0,0,0,0.6)`,
        cursor:         "pointer",
        overflow:       "hidden",
        animation:      visible
          ? "ach-in 0.55s cubic-bezier(0.34,1.4,0.64,1) both"
          : "ach-out 0.42s cubic-bezier(0.55,0,1,0.45) both",
      }}
    >
      {/* Shimmer sweep */}
      <div style={{
        position:     "absolute",
        inset:        0,
        background:   `linear-gradient(90deg,transparent,${ach.color}20,transparent)`,
        animation:    "ach-shimmer 1s 0.3s ease forwards",
        pointerEvents:"none",
      }} />

      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", position:"relative" }}>
        {/* Icon */}
        <div style={{
          width:         "44px",
          height:        "44px",
          borderRadius:  "50%",
          background:    `${ach.color}18`,
          border:        `1.5px solid ${ach.color}55`,
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          fontSize:      "1.3rem",
          flexShrink:    0,
          boxShadow:     `0 0 20px ${ach.color}30`,
          animation:     "ach-icon-pop 0.6s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          {ach.icon}
        </div>

        {/* Text */}
        <div>
          <div style={{
            fontFamily:    "Inter,sans-serif",
            fontWeight:    700,
            fontSize:      "0.55rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         `${ach.color}`,
            opacity:       0.75,
            marginBottom:  "0.18rem",
          }}>
            Achievement Unlocked
          </div>
          <div style={{
            fontFamily: "Inter,sans-serif",
            fontWeight: 800,
            fontSize:   "0.92rem",
            color:      "#fff",
            lineHeight: 1.2,
            marginBottom:"0.2rem",
          }}>
            {ach.title}
          </div>
          <div style={{
            fontFamily: "Inter,sans-serif",
            fontSize:   "0.72rem",
            color:      "rgba(240,238,255,0.5)",
            lineHeight: 1.4,
          }}>
            {ach.subtitle}
          </div>
        </div>
      </div>
    </div>
  )
}
