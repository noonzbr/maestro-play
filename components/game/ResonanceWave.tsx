"use client"

import { useEffect, useRef } from "react"

type Props = {
  resonance?: number // 0 to 100
  accentColor?: string
}

export default function ResonanceWave({ resonance = 40, accentColor = "#00d4f0" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let phase = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.parentElement?.clientWidth ? canvas.parentElement.clientWidth * dpr : 300 * dpr
      canvas.height = 60 * dpr
      canvas.style.width = "100%"
      canvas.style.height = "60px"
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      const midY = h / 2

      // Draw horizontal center line (faded reference string)
      ctx.beginPath()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"
      ctx.lineWidth = 1
      ctx.moveTo(0, midY)
      ctx.lineTo(w, midY)
      ctx.stroke()

      // Normalize resonance to gauge controls
      const targetAmp = (resonance / 100) * (midY - 5)
      const targetFreq = 0.01 + (resonance / 100) * 0.02
      const targetSpeed = 0.05 + (resonance / 100) * 0.06
      const waveCount = resonance > 70 ? 3 : resonance > 35 ? 2 : 1

      phase += targetSpeed

      // Draw multiple layers of colored waveforms
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        
        // Compute colors: layer 1 = accentColor, layer 2 = purple, layer 3 = mixed pink/cyan
        let strokeColor = "rgba(0, 212, 240, 0.22)"
        if (i === 0) {
          strokeColor = hexToRgba(accentColor, 0.5)
        } else if (i === 1) {
          strokeColor = "rgba(224, 64, 251, 0.45)"
        } else {
          strokeColor = "rgba(255, 64, 129, 0.35)"
        }

        ctx.strokeStyle = strokeColor
        ctx.lineWidth = i === 0 ? 2 : 1.2
        ctx.lineJoin = "round"

        // Wave phase offsets for complexity
        const offsetPhase = phase + i * Math.PI / 4
        const localFreq = targetFreq * (1 + i * 0.3)

        for (let x = 0; x < w; x++) {
          // Fade wave at left and right edges so it doesn't clip abruptly
          const edgeFade = Math.sin((x / w) * Math.PI)
          
          // Combine primary sine wave with some small harmonic distortion
          const y = midY + Math.sin(x * localFreq + offsetPhase) * targetAmp * edgeFade 
                    + Math.cos(x * (localFreq * 2.3) - offsetPhase * 0.7) * (targetAmp * 0.15) * edgeFade

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [resonance, accentColor])

  // Helper to convert hex colors to RGBA
  function hexToRgba(hex: string, opacity: number): string {
    const clean = hex.replace("#", "")
    let r = 0, g = 0, b = 0
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16)
      g = parseInt(clean[1] + clean[1], 16)
      b = parseInt(clean[2] + clean[2], 16)
    } else if (clean.length === 6) {
      r = parseInt(clean.substring(0, 2), 16)
      g = parseInt(clean.substring(2, 4), 16)
      b = parseInt(clean.substring(4, 6), 16)
    } else {
      return `rgba(0, 212, 240, ${opacity})`
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  return (
    <div style={{
      width: "100%",
      background: "rgba(0,0,0,0.22)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.06)",
      padding: "0.4rem 0.6rem",
      boxShadow: "inset 0 0 12px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden"
    }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <span style={{
        position: "absolute",
        bottom: "0.22rem",
        right: "0.6rem",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.5rem",
        fontWeight: 700,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: resonance > 70 ? "var(--cyan)" : resonance > 35 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"
      }}>
        {resonance > 70 ? "Resonant Conductor Wave" : resonance > 35 ? "Average Signal" : "Weak/Flat Signal"}
      </span>
    </div>
  )
}
