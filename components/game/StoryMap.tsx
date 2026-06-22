"use client"

import { motion } from "framer-motion"
import GameIcon from "./GameIcon"

type Props = {
  isOpen: boolean
  onClose: () => void
  currentSceneId?: string
  accentColor?: string
  onSelectScene?: (sceneId: string) => void
}

export default function StoryMap({ isOpen, onClose, currentSceneId = "", accentColor = "#00d4f0", onSelectScene }: Props) {
  if (!isOpen) return null

  // Define the node structure of Jake's Story (Game 1)
  const nodes = [
    { id: "w1-branch-1", label: "Bedroom Choice", x: 10, y: 180, desc: "Branching point" },
    
    // Path A (Shortcut)
    { id: "w1-lazy-1", label: "Shortcut Prompt", x: 160, y: 50, desc: "Path A" },
    { id: "w1-lazy-2", label: "Vega's Verdict", x: 310, y: 50, desc: "Vega hears it" },

    // Path B/C (Half Measure)
    { id: "w1-middle-1", label: "Indie Description", x: 160, y: 150, desc: "Path B/C" },
    { id: "w1-middle-2", label: "Vega's Question", x: 310, y: 150, desc: "Self vs Genre" },

    // Path D (Conductor)
    { id: "w1-conductor-1", label: "Conductor Entry", x: 160, y: 280, desc: "Path D (Best)" },
    { id: "w1-conductor-2", label: "Vega's Approval", x: 310, y: 280, desc: "Resonance found" },

    // Vega Moment (Convergence point)
    { id: "w1-vega-moment", label: "Hallway Stand", x: 460, y: 100, desc: "The Mirror" },
    { id: "w1-recovery", label: "Prompt Rewrite", x: 580, y: 100, desc: "Recovery" },

    // Core games
    { id: "w1-match-terms", label: "Orchestra Match", x: 620, y: 230, desc: "Terminology" },
    { id: "w1-order-prompt", label: "Prompt Staff", x: 730, y: 230, desc: "Composition" },
    { id: "w1-boss", label: "Boss: AI Battle", x: 840, y: 230, desc: "Conductor Exam" },

    // Endings
    { id: "w1-ending-1", label: "Ending 1", x: 960, y: 160, desc: "Conductor Masterpiece" },
    { id: "w1-ending-2", label: "Ending 2", x: 960, y: 280, desc: "Wake-up Call" },
  ]

  // Connections between nodes
  const connections = [
    // Branching
    { from: "w1-branch-1", to: "w1-lazy-1" },
    { from: "w1-branch-1", to: "w1-middle-1" },
    { from: "w1-branch-1", to: "w1-conductor-1" },

    // Path flows
    { from: "w1-lazy-1", to: "w1-lazy-2" },
    { from: "w1-middle-1", to: "w1-middle-2" },
    { from: "w1-conductor-1", to: "w1-conductor-2" },

    // Convergences
    { from: "w1-lazy-2", to: "w1-vega-moment" },
    { from: "w1-middle-2", to: "w1-vega-moment" },
    { from: "w1-conductor-2", to: "w1-match-terms" },

    // Vega Moment branches
    { from: "w1-vega-moment", to: "w1-ending-2" },
    { from: "w1-vega-moment", to: "w1-recovery" },
    { from: "w1-recovery", to: "w1-match-terms" },

    // Exercises & Boss
    { from: "w1-match-terms", to: "w1-order-prompt" },
    { from: "w1-order-prompt", to: "w1-boss" },
    
    // Final Endings
    { from: "w1-boss", to: "w1-ending-1" },
  ]

  // Helper to map V2 scene IDs to V1 node IDs
  const mapSceneId = (sceneId: string): string => {
    if (!sceneId) return ""
    if (sceneId.startsWith("w1v2-")) {
      switch (sceneId) {
        case "w1v2-s0": return "w1-branch-1"
        case "w1v2-s1": return "w1-lazy-1"
        case "w1v2-s2": return "w1-lazy-2"
        case "w1v2-s3": return "w1-conductor-1"
        case "w1v2-s4": return "w1-conductor-2"
        case "w1v2-s5":
        case "w1v2-s5b": return "w1-vega-moment"
        case "w1v2-s6": return "w1-recovery"
        case "w1v2-s7":
        case "w1v2-s8": return "w1-match-terms"
        case "w1v2-s9":
        case "w1v2-s10": return "w1-order-prompt"
        case "w1v2-s11":
        case "w1v2-s12":
        case "w1v2-s13":
        case "w1v2-s14":
        case "w1v2-s15": return "w1-boss"
        case "w1v2-s16": return "w1-ending-1"
        default: return "w1-branch-1"
      }
    }
    return sceneId
  }

  const mappedActiveId = mapSceneId(currentSceneId)
  const isV2 = currentSceneId.startsWith("w1v2-")

  const isActive = (id: string) => mappedActiveId === id

  // Map matching to get nodes that have been completed (we can approximate based on index)
  const isCompleted = (id: string) => {
    const activeIdx = nodes.findIndex(n => n.id === mappedActiveId)
    const nodeIdx = nodes.findIndex(n => n.id === id)
    if (activeIdx === -1 || nodeIdx === -1) return false
    return nodeIdx < activeIdx
  }

  // Two-way mapping for node clicks to jump scenes
  const mapNodeIdToSceneId = (nodeId: string): string => {
    if (isV2) {
      switch (nodeId) {
        case "w1-branch-1": return "w1v2-s0"
        case "w1-lazy-1": return "w1v2-s1"
        case "w1-lazy-2": return "w1v2-s2"
        case "w1-middle-1": return "w1v2-s3"
        case "w1-middle-2": return "w1v2-s4"
        case "w1-conductor-1": return "w1v2-s3"
        case "w1-conductor-2": return "w1v2-s4"
        case "w1-vega-moment": return "w1v2-s5"
        case "w1-recovery": return "w1v2-s6"
        case "w1-match-terms": return "w1v2-s7"
        case "w1-order-prompt": return "w1v2-s9"
        case "w1-boss": return "w1v2-s11"
        case "w1-ending-1": return "w1v2-s16"
        case "w1-ending-2": return "w1v2-s16"
        default: return "w1v2-s0"
      }
    }
    return nodeId
  }

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(8, 6, 15, 0.94)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      {/* Background radial highlight */}
      <div style={{
        position: "absolute",
        width: "50vw",
        height: "50vw",
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1080px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 900,
              fontSize: "1.45rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: `linear-gradient(90deg, ${accentColor}, #e040fb)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0
            }}>
              Story Campaign Map
            </h1>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "rgba(240, 238, 255, 0.45)", margin: "0.22rem 0 0 0" }}>
              Jake Martinez · Game 1: Welcome to the Exciting World of AI
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              color: "#fff",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >
            ✕
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.68rem", fontFamily: "Inter, sans-serif", color: "rgba(240,238,255,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: accentColor }} />
            <span>Active Position</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.65)" }} />
            <span>Completed Nodes</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.12)", border: "1px dashed rgba(255,255,255,0.3)" }} />
            <span>Unexplored Path</span>
          </div>
        </div>

        {/* Map scroll container */}
        <div style={{
          width: "100%",
          height: "380px",
          background: "rgba(0, 0, 0, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "20px",
          overflow: "auto",
          position: "relative",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)"
        }}>
          <div style={{ width: "1060px", height: "360px", position: "relative" }}>
            
            {/* Connection SVG lines */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
              {connections.map((c, idx) => {
                const fromNode = nodes.find(n => n.id === c.from)
                const toNode = nodes.find(n => n.id === c.to)
                if (!fromNode || !toNode) return null

                // Determine connection line colors
                const completed = isCompleted(c.to) || (isCompleted(c.from) && isActive(c.to))
                const active = isActive(c.to)
                
                let strokeColor = "rgba(255, 255, 255, 0.07)"
                let strokeDash = "4, 4"
                let width = 1.5

                if (completed) {
                  strokeColor = "rgba(255, 255, 255, 0.35)"
                  strokeDash = "none"
                  width = 2
                }
                if (active) {
                  strokeColor = accentColor
                  strokeDash = "none"
                  width = 2.5
                }

                // Smooth cubic bezier curves for connections
                const startX = fromNode.x + 65
                const startY = fromNode.y + 24
                const endX = toNode.x
                const endY = toNode.y + 24
                const controlX = startX + (endX - startX) / 2

                return (
                  <path
                    key={idx}
                    d={`M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={width}
                    strokeDasharray={strokeDash}
                  />
                )
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const active = isActive(node.id)
              const completed = isCompleted(node.id)
              const isSelectable = active || completed
              
              const border = active 
                ? `1.5px solid ${accentColor}`
                : completed
                  ? "1.5px solid rgba(255,255,255,0.42)"
                  : "1px dashed rgba(255,255,255,0.18)"

              const bg = active
                ? `rgba(0, 212, 240, 0.12)`
                : completed
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(255,255,255,0.01)"

              const textColor = active
                ? "#fff"
                : completed
                  ? "rgba(240,238,255,0.85)"
                  : "rgba(240,238,255,0.22)"

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    if (isSelectable && onSelectScene) {
                      onSelectScene(mapNodeIdToSceneId(node.id))
                    }
                  }}
                  onMouseEnter={e => {
                    if (isSelectable) e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = ""
                  }}
                  style={{
                    position: "absolute",
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: "130px",
                    height: "48px",
                    background: bg,
                    border: border,
                    borderRadius: "10px",
                    padding: "0.38rem 0.6rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    zIndex: 10,
                    boxShadow: active ? `0 0 16px ${accentColor}33` : "none",
                    transition: "transform 0.2s",
                    cursor: isSelectable ? "pointer" : "default"
                  }}
                >
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    color: textColor,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {node.label}
                  </div>
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.52rem",
                    color: active ? accentColor : completed ? "rgba(240,238,255,0.4)" : "rgba(240,238,255,0.12)",
                    marginTop: "0.1rem"
                  }}>
                    {node.desc}
                  </div>
                </div>
              )
            })}

          </div>
        </div>

        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(240,238,255,0.3)", textAlign: "center", margin: 0 }}>
          Your choices shape the musical timeline. Experiment with different branches to discover all endings!
        </p>

      </div>
    </div>
  )
}
