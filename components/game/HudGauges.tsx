"use client"

import { motion } from "framer-motion"
import GameIcon from "./GameIcon"

type Props = {
  clarity?: number
  persona?: number
  cliche?: number
  accentColor?: string
}

export default function HudGauges({ clarity = 30, persona = 20, cliche = 70, accentColor = "#00d4f0" }: Props) {
  const gauges = [
    {
      label: "Clarity / Precision",
      val: clarity,
      icon: "tuningFork" as const,
      color: "var(--cyan)",
      desc: "Instruction detail"
    },
    {
      label: "Persona / Context",
      val: persona,
      icon: "guitar" as const,
      color: "#e040fb",
      desc: "Identity & background"
    },
    {
      label: "Cliché Risk",
      val: cliche,
      icon: "gramophone" as const,
      color: cliche > 60 ? "#ff4b4b" : "#ffb347",
      desc: "Average statistical output",
      inverse: true // High cliché is bad, low cliché is good
    }
  ]

  return (
    <div style={{
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "0.85rem",
      background: "rgba(255, 255, 255, 0.02)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: "18px",
      padding: "0.85rem 1rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
    }}>
      {gauges.map((g, idx) => {
        const percentage = Math.min(100, Math.max(0, g.val))
        return (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.28rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "0.35rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: `rgba(${g.color === "var(--cyan)" ? "0,212,240" : g.color === "#e040fb" ? "224,64,251" : "255,75,75"}, 0.1)`,
                color: g.color
              }}>
                <GameIcon name={g.icon} size={13} />
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(240, 238, 255, 0.65)"
              }}>
                {g.label}
              </span>
            </div>

            {/* Gauge bar track */}
            <div style={{
              width: "100%",
              height: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "100px",
              overflow: "hidden",
              position: "relative"
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
                style={{
                  height: "100%",
                  borderRadius: "100px",
                  background: g.color,
                  boxShadow: `0 0 10px ${g.color}55`
                }}
              />
            </div>

            {/* Value indicator & description */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.58rem", fontFamily: "Inter, sans-serif" }}>
              <span style={{ color: "rgba(240, 238, 255, 0.35)" }}>{g.desc}</span>
              <span style={{ fontWeight: 700, color: g.color }}>
                {percentage}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
