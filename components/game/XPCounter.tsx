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
  const prevXp = useRef(xp)

  useEffect(() => {
    if (xp !== prevXp.current) {
      const diff = xp - prevXp.current
      if (diff > 0) {
        setShowBurst(true)
        setTimeout(() => setShowBurst(false), 1500)
      }
      const start = prevXp.current
      const end = xp
      const duration = 800
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayXp(Math.round(start + (end - start) * eased))
        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
      prevXp.current = xp
    }
  }, [xp])

  const pct = Math.min((displayXp / maxXp) * 100, 100)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--cyan)" }}>
            XP
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff" }}>
            {displayXp}
          </span>
        </div>
        <div className="xp-bar" style={{ width: "100%" }}>
          <div className="xp-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {showBurst && newXp && (
        <div style={{
          position: "absolute",
          right: "-1rem",
          top: "-1.5rem",
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize: "0.9rem",
          color: "var(--cyan)",
          animation: "fade-rise 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
          pointerEvents: "none",
        }}>
          +{newXp}
        </div>
      )}
    </div>
  )
}
