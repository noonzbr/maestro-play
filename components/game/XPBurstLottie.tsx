"use client"

/**
 * XPBurstLottie — cinematic XP award animation.
 * Replaces the plain "+X XP" text burst with:
 *   • Radial shockwave ring
 *   • 24 coloured particle dots flying outward
 *   • Animated +XP number that counts up
 *   • Gold coin-like glow
 *
 * Zero external dependencies — pure CSS keyframes + React.
 */
import { useEffect, useState } from "react"

const STYLE_ID = "xp-burst-lottie-kf"

const KEYFRAMES = `
@keyframes xpbl-ring {
  0%   { transform: scale(0.1); opacity: 0.9; }
  60%  { opacity: 0.6; }
  100% { transform: scale(2.6); opacity: 0; }
}
@keyframes xpbl-ring2 {
  0%   { transform: scale(0.1); opacity: 0.7; }
  60%  { opacity: 0.4; }
  100% { transform: scale(3.2); opacity: 0; }
}
@keyframes xpbl-label {
  0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.4); }
  18%  { opacity: 1; transform: translate(-50%,-50%) scale(1.2); }
  35%  { transform: translate(-50%,-50%) scale(0.97); }
  65%  { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%,-50%) scale(0.8) translateY(-28px); }
}
@keyframes xpbl-wrapper {
  0%   { opacity: 0; }
  5%   { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
`

/* 24 particles at evenly-spaced angles */
function buildParticleKeyframe(angle: number, dist: number, id: string): string {
  const rad   = (angle * Math.PI) / 180
  const tx    = Math.cos(rad) * dist
  const ty    = Math.sin(rad) * dist
  return `
@keyframes xpbl-p-${id} {
  0%   { transform: translate(-50%,-50%) translate(0px,0px) scale(1);   opacity: 1; }
  55%  { opacity: 0.8; }
  100% { transform: translate(-50%,-50%) translate(${tx}px,${ty}px) scale(0); opacity: 0; }
}
`
}

const N = 24
const particles = Array.from({ length: N }, (_, i) => ({
  angle:  (i / N) * 360,
  dist:   70 + (i % 3) * 22,
  color:  i % 3 === 0 ? "#ffd740" : i % 3 === 1 ? "#00d4f0" : "#e040fb",
  size:   i % 4 === 0 ? 6 : i % 4 === 1 ? 5 : i % 4 === 2 ? 4 : 3,
  delay:  `${(i % 6) * 0.025}s`,
  dur:    `${0.7 + (i % 4) * 0.06}s`,
  id:     String(i),
})
)

/* Animated counter hook */
function useCount(target: number, duration = 650) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

export default function XPBurstLottie({ xp, accent = "#ffd740" }: { xp: number; accent?: string }) {
  const count = useCount(xp)

  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const allKf = KEYFRAMES + particles.map(p => buildParticleKeyframe(p.angle, p.dist, p.id)).join("")
    const s = document.createElement("style")
    s.id = STYLE_ID
    s.textContent = allKf
    document.head.appendChild(s)
  }, [])

  /* Auto-dismiss after 1.6s — parent controls unmount */

  return (
    <div
      aria-live="polite"
      aria-label={`+${xp} XP earned`}
      style={{
        position:      "fixed",
        top:           "50%",
        left:          "50%",
        width:         "1px",
        height:        "1px",
        zIndex:        500,
        pointerEvents: "none",
        animation:     "xpbl-wrapper 1.65s ease forwards",
      }}
    >
      {/* Shockwave rings */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "80px", height: "80px",
        borderRadius: "50%",
        border: `3px solid ${accent}`,
        transform: "translate(-50%,-50%)",
        animation: "xpbl-ring 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s forwards",
        opacity: 0,
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "80px", height: "80px",
        borderRadius: "50%",
        border: "2px solid rgba(224,64,251,0.7)",
        transform: "translate(-50%,-50%)",
        animation: "xpbl-ring2 1s cubic-bezier(0.16,1,0.3,1) 0.12s forwards",
        opacity: 0,
      }} />

      {/* Particle cloud */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position:     "absolute",
            top:          0,
            left:         0,
            width:        `${p.size}px`,
            height:       `${p.size}px`,
            borderRadius: "50%",
            background:   p.color,
            boxShadow:    `0 0 ${p.size * 2}px ${p.color}`,
            animation:    `xpbl-p-${p.id} ${p.dur} ${p.delay} ease-out forwards`,
          }}
        />
      ))}

      {/* XP label */}
      <div style={{
        position:   "absolute",
        top:        0,
        left:       0,
        transform:  "translate(-50%,-50%)",
        fontFamily: "Inter, sans-serif",
        fontWeight: 900,
        fontSize:   "clamp(1.6rem, 5vw, 2.4rem)",
        color:      "#fff",
        textShadow: `0 0 20px ${accent}, 0 0 40px ${accent}88, 0 0 70px rgba(224,64,251,0.4)`,
        whiteSpace: "nowrap",
        letterSpacing: "-0.01em",
        animation:  "xpbl-label 1.65s cubic-bezier(0.16,1,0.3,1) forwards",
        userSelect: "none",
      }}>
        +{count} XP
      </div>
    </div>
  )
}
