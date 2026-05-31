"use client"

/**
 * AnimatedFlame — drop-in replacement for the 🔥 emoji.
 * SVG-based with CSS keyframe flicker, inner glow, and rising spark particles.
 * Zero external dependencies.
 */
import { useEffect } from "react"

const STYLE_ID = "animated-flame-kf"

const KEYFRAMES = `
@keyframes flame-body {
  0%,100% { d: path("M50 110 C28 105 12 85 15 62 C17 48 26 38 32 28 C36 20 36 10 34 4 C42 14 44 26 40 36 C46 28 50 18 48 6 C58 18 60 32 54 44 C62 34 66 22 64 10 C72 24 72 40 64 54 C70 46 76 38 76 28 C82 42 80 58 70 70 C76 64 80 56 80 48 C86 60 84 78 74 90 C80 86 84 78 82 68 C88 80 86 96 76 106 C70 112 60 116 50 110 Z"); }
  25%  { d: path("M50 110 C26 108 10 88 14 64 C16 50 25 38 30 26 C33 18 33 8 30 2 C40 12 43 26 38 38 C45 28 50 16 47 4 C58 16 61 32 55 46 C63 36 68 24 65 10 C74 24 73 42 64 56 C71 46 78 36 77 26 C84 40 81 57 71 70 C77 62 81 54 80 44 C88 56 85 76 74 90 C81 84 84 74 82 64 C89 78 86 96 76 108 C70 114 60 116 50 110 Z"); }
  50%  { d: path("M50 110 C30 106 14 86 16 62 C18 48 28 38 34 28 C38 20 38 10 36 4 C44 14 46 28 42 38 C48 30 52 20 50 8 C60 20 62 34 56 46 C64 36 68 24 66 12 C74 26 74 42 66 56 C72 48 78 40 78 30 C84 44 82 60 72 72 C78 66 82 58 82 48 C88 62 86 80 76 108 C70 114 60 116 50 110 Z"); }
  75%  { d: path("M50 110 C27 104 11 84 14 60 C16 46 25 36 31 26 C35 18 35 8 32 2 C41 13 44 27 39 37 C46 27 51 17 48 5 C59 17 61 31 55 43 C63 33 67 21 64 9 C73 23 72 40 63 54 C70 44 77 35 76 25 C83 39 80 56 70 68 C76 60 80 52 79 42 C87 54 84 74 73 88 C80 82 83 72 81 62 C88 76 85 94 75 106 C69 113 59 116 50 110 Z"); }
}
@keyframes flame-inner {
  0%,100% { opacity: 0.75; transform: scaleX(0.92) translateY(4px); }
  50%      { opacity: 1;    transform: scaleX(1.05) translateY(-2px); }
}
@keyframes spark-rise-0 {
  0%   { transform: translate(0px, 0px) scale(1);   opacity: 0.9; }
  100% { transform: translate(-8px,-38px) scale(0); opacity: 0; }
}
@keyframes spark-rise-1 {
  0%   { transform: translate(0px, 0px) scale(1);   opacity: 0.8; }
  100% { transform: translate(10px,-44px) scale(0); opacity: 0; }
}
@keyframes spark-rise-2 {
  0%   { transform: translate(0px, 0px) scale(1);   opacity: 0.7; }
  100% { transform: translate(-4px,-30px) scale(0); opacity: 0; }
}
`

type Spark = { x: number; y: number; delay: string; dur: string; anim: string }
const SPARKS: Spark[] = [
  { x: 44, y: 22, delay: "0s",    dur: "1.1s", anim: "spark-rise-0" },
  { x: 58, y: 30, delay: "0.35s", dur: "0.9s", anim: "spark-rise-1" },
  { x: 50, y: 14, delay: "0.6s",  dur: "1.2s", anim: "spark-rise-2" },
]

export default function AnimatedFlame({ size = 36 }: { size?: number }) {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const s = document.createElement("style")
    s.id = STYLE_ID
    s.textContent = KEYFRAMES
    document.head.appendChild(s)
  }, [])

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 100 125"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", overflow: "visible" }}
      aria-label="flame"
    >
      <defs>
        <radialGradient id="flame-grad-outer" cx="50%" cy="75%" r="55%">
          <stop offset="0%"   stopColor="#fff8e1" stopOpacity="0.9" />
          <stop offset="20%"  stopColor="#ffe57f" stopOpacity="0.95" />
          <stop offset="55%"  stopColor="#ff6d00" stopOpacity="0.9" />
          <stop offset="80%"  stopColor="#e040fb" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7b2fbe" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="flame-grad-inner" cx="50%" cy="80%" r="40%">
          <stop offset="0%"  stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffe082" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6d00" stopOpacity="0" />
        </radialGradient>
        <filter id="flame-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer glow blob */}
      <ellipse cx="50" cy="102" rx="28" ry="10" fill="rgba(255,109,0,0.22)" />

      {/* Main flame body — animated path */}
      <path
        fill="url(#flame-grad-outer)"
        filter="url(#flame-glow)"
        style={{ animation: "flame-body 2.6s ease-in-out infinite" }}
        d="M50 110 C28 105 12 85 15 62 C17 48 26 38 32 28 C36 20 36 10 34 4 C42 14 44 26 40 36 C46 28 50 18 48 6 C58 18 60 32 54 44 C62 34 66 22 64 10 C72 24 72 40 64 54 C70 46 76 38 76 28 C82 42 80 58 70 70 C76 64 80 56 80 48 C86 60 84 78 74 90 C80 86 84 78 82 68 C88 80 86 96 76 106 C70 112 60 116 50 110 Z"
      />

      {/* Inner hot core */}
      <ellipse
        cx="50" cy="76" rx="14" ry="22"
        fill="url(#flame-grad-inner)"
        style={{ animation: "flame-inner 1.8s ease-in-out infinite" }}
      />

      {/* Spark particles */}
      {SPARKS.map((sp, i) => (
        <circle
          key={i}
          cx={sp.x} cy={sp.y} r="2.2"
          fill="#ffe57f"
          style={{
            animation: `${sp.anim} ${sp.dur} ${sp.delay} ease-out infinite`,
            filter: "drop-shadow(0 0 3px #ff6d00)",
          }}
        />
      ))}
    </svg>
  )
}
