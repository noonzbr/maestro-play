"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  xp: number
  maxXp: number
  newXp?: number
}

export default function XPCounter({ xp, maxXp, newXp }: Props) {
  const [displayXp, setDisplayXp] = useState(xp)
  const [showBurst, setShowBurst] = useState(false)
  const [glowing,   setGlowing]   = useState(false)
  const prevXp = useRef(xp)

  // Inject keyframes once
  useEffect(() => {
    const id = "xp-counter-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes xp-num-pop {
        0%   { transform:scale(1);    color:var(--cyan); }
        30%  { transform:scale(1.32); color:#fff; filter:drop-shadow(0 0 8px #00d4f0); }
        60%  { transform:scale(1.15); }
        100% { transform:scale(1);    color:var(--cyan); filter:none; }
      }
      @keyframes xp-shimmer {
        0%   { transform:translateX(-100%) skewX(-15deg); opacity:0; }
        20%  { opacity:1; }
        100% { transform:translateX(500%) skewX(-15deg); opacity:0; }
      }
      @keyframes fade-rise {
        0%   { opacity:0; transform:translateY(0)   scale(0.8); }
        15%  { opacity:1; transform:translateY(-4px) scale(1.1); }
        80%  { opacity:1; transform:translateY(-18px) scale(1); }
        100% { opacity:0; transform:translateY(-28px) scale(0.9); }
      }
    `
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (xp === prevXp.current) return

    const diff = xp - prevXp.current
    if (diff > 0) {
      setShowBurst(true)
      setGlowing(true)
      setTimeout(() => setShowBurst(false), 1500)
      setTimeout(() => setGlowing(false),   900)
    }

    const start    = prevXp.current
    const end      = xp
    const duration = Math.min(1200, 400 + Math.abs(diff) * 1.5)
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Cubic ease-out for satisfying deceleration
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplayXp(Math.round(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
    prevXp.current = xp
  }, [xp])

  const pct = Math.min((displayXp / maxXp) * 100, 100)

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"1rem", position:"relative" }}>
      <div style={{ flex:1 }}>

        {/* Label + count */}
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.4rem", alignItems:"center" }}>
          <span style={{ fontFamily:"Inter,sans-serif", fontWeight:600, fontSize:"0.7rem", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--cyan)" }}>
            XP
          </span>
          <span
            style={{
              fontFamily:  "Inter,sans-serif",
              fontWeight:  700,
              fontSize:    "0.8rem",
              color:       "var(--cyan)",
              display:     "inline-block",
              animation:   glowing ? "xp-num-pop 0.6s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
            }}
          >
            {displayXp}
          </span>
        </div>

        {/* Bar */}
        <div
          className="xp-bar"
          style={{ width:"100%", position:"relative", overflow:"hidden" }}
        >
          <div className="xp-fill" style={{ width:`${pct}%`, transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />

          {/* Shimmer on XP gain */}
          {glowing && (
            <div style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)",
              animation:  "xp-shimmer 0.7s ease forwards",
              pointerEvents:"none",
            }} />
          )}
        </div>
      </div>

      {/* Floating +XP label */}
      {showBurst && newXp && (
        <div style={{
          position:   "absolute",
          right:      "-0.5rem",
          top:        "-1.8rem",
          fontFamily: "Inter,sans-serif",
          fontWeight: 900,
          fontSize:   "0.95rem",
          color:      "#00d4f0",
          animation:  "fade-rise 1.4s cubic-bezier(0.16,1,0.3,1) forwards",
          pointerEvents:"none",
          whiteSpace: "nowrap",
          textShadow: "0 0 12px rgba(0,212,240,0.8)",
        }}>
          +{newXp} XP
        </div>
      )}
    </div>
  )
}
