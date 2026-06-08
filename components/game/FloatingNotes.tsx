"use client"

import { useEffect } from "react"
import { SoundMood } from "./SoundEngine"

// Pre-computed — deterministic positions, no random on every render
const NOTES = [
  { sym: "♩", x: 4,  delay: 0,   dur: 9,  size: 0.9, dir: "right",    color: "cyan"  },
  { sym: "♪", x: 13, delay: 2.2, dur: 7.5, size: 1.1, dir: "left",    color: "white" },
  { sym: "♫", x: 23, delay: 0.8, dur: 8.5, size: 0.75,dir: "right",   color: "pink"  },
  { sym: "𝄞", x: 32, delay: 3.6, dur: 11,  size: 1.4, dir: "straight", color: "cyan"  },
  { sym: "♬", x: 41, delay: 1.3, dur: 7,   size: 0.85,dir: "left",    color: "pink"  },
  { sym: "♭", x: 52, delay: 4.4, dur: 9.5, size: 0.8, dir: "right",   color: "white" },
  { sym: "♮", x: 62, delay: 0.5, dur: 8.5, size: 1.0, dir: "straight", color: "cyan"  },
  { sym: "♩", x: 72, delay: 2.9, dur: 7.5, size: 0.7, dir: "left",    color: "pink"  },
  { sym: "♪", x: 81, delay: 5.2, dur: 10,  size: 1.2, dir: "right",   color: "white" },
  { sym: "♫", x: 89, delay: 1.7, dur: 8,   size: 0.9, dir: "left",    color: "cyan"  },
  { sym: "♬", x: 17, delay: 6.1, dur: 9,   size: 0.8, dir: "straight", color: "pink"  },
  { sym: "𝄞", x: 47, delay: 3.3, dur: 12,  size: 1.3, dir: "right",   color: "white" },
  { sym: "♭", x: 66, delay: 7.6, dur: 8,   size: 0.75,dir: "left",    color: "cyan"  },
  { sym: "♮", x: 94, delay: 2.5, dur: 10,  size: 1.0, dir: "right",   color: "pink"  },
] as const

const COLOR = {
  cyan:  "rgba(0,212,240,0.22)",
  pink:  "rgba(224,64,251,0.18)",
  white: "rgba(255,255,255,0.14)",
}

export default function FloatingNotes({ mood = "normal" }: { mood?: SoundMood }) {
  useEffect(() => {
    const id = "floating-notes-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes fn-right {
        0%   { opacity:0; transform:translateY(0) translateX(0) rotate(0deg); }
        12%  { opacity:1; }
        88%  { opacity:0.45; }
        100% { opacity:0; transform:translateY(-96vh) translateX(28px) rotate(18deg); }
      }
      @keyframes fn-left {
        0%   { opacity:0; transform:translateY(0) translateX(0) rotate(0deg); }
        12%  { opacity:1; }
        88%  { opacity:0.45; }
        100% { opacity:0; transform:translateY(-96vh) translateX(-28px) rotate(-14deg); }
      }
      @keyframes fn-straight {
        0%   { opacity:0; transform:translateY(0) scale(0.85); }
        12%  { opacity:1; }
        88%  { opacity:0.45; }
        100% { opacity:0; transform:translateY(-96vh) scale(1.1); }
      }
    `
    document.head.appendChild(s)
  }, [])

  // No moving elements during revelation — reduces motion/vertigo
  if (mood === "revelation") return null

  const speedMult = mood === "boss" ? 0.72 : 1
  const glow = false

  return (
    // aria-hidden: purely decorative — screen readers must not read musical symbols
    // No willChange inline style: browser compositor handles animated elements
    // automatically; promoting all 14 at once was blowing the GPU layer budget.
    <div
      aria-hidden="true"
      role="presentation"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5, overflow: "hidden" }}
    >
      {NOTES.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "-2rem",
            left: `${n.x}%`,
            fontSize: `${n.size}rem`,
            color: COLOR[n.color],
            animation: `fn-${n.dir} ${n.dur * speedMult}s ${n.delay}s ease-in-out infinite`,
            filter: glow ? `drop-shadow(0 0 5px ${COLOR[n.color]})` : "none",
            // willChange removed — was promoting all 14 elements simultaneously.
            // CSS animations that use transform/opacity are already composited by
            // the browser. Explicit willChange only helps when set just before the
            // animation starts, not statically on every element.
          }}
        >
          {n.sym}
        </div>
      ))}
    </div>
  )
}
