"use client"

import { useEffect, useState } from "react"

export default function PlayerName() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("maestro_player_name")
      setName(stored && stored.trim() ? stored.trim() : null)
    } catch {
      setName(null)
    }
  }, [])

  // While hydrating, render nothing so there's no flash
  if (name === null) return null

  return (
    <div style={{
      fontFamily:    "Cormorant Garamond, serif",
      fontStyle:     "italic",
      fontSize:      "clamp(1.1rem, 2.8vw, 1.5rem)",
      color:         "rgba(240,238,255,0.72)",
      marginBottom:  "0.35rem",
      letterSpacing: "0.01em",
    }}>
      awarded to
    </div>
  )
}

export function PlayerNameValue() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("maestro_player_name")
      setName(stored && stored.trim() ? stored.trim() : null)
    } catch {
      setName(null)
    }
  }, [])

  if (name === null) return null

  return (
    <div style={{
      fontFamily:    "Cormorant Garamond, serif",
      fontWeight:    700,
      fontSize:      "clamp(1.6rem, 4vw, 2.4rem)",
      color:         "#fff",
      marginBottom:  "1.75rem",
      letterSpacing: "-0.01em",
    }}>
      {name}
    </div>
  )
}
