"use client"

import React from "react"

// Maps to the 3×3 neon icon sprite sheet at /images/icons.png
// Row 0: guitar | baton | musicNotes
// Row 1: tuningFork | gramophone | harp
// Row 2: metronome | headphones | volume
export type IconName =
  | "guitar"
  | "baton"
  | "musicNotes"
  | "tuningFork"
  | "gramophone"
  | "harp"
  | "metronome"
  | "headphones"
  | "volume"

const POS: Record<IconName, { row: number; col: number }> = {
  guitar:     { row: 0, col: 0 },
  baton:      { row: 0, col: 1 },
  musicNotes: { row: 0, col: 2 },
  tuningFork: { row: 1, col: 0 },
  gramophone: { row: 1, col: 1 },
  harp:       { row: 1, col: 2 },
  metronome:  { row: 2, col: 0 },
  headphones: { row: 2, col: 1 },
  volume:     { row: 2, col: 2 },
}

type Props = {
  name: IconName
  size?: number
  style?: React.CSSProperties
}

export default function GameIcon({ name, size = 64, style }: Props) {
  const { row, col } = POS[name]
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundImage: "url('/images/icons.png')",
        backgroundSize: "300% 300%",
        backgroundPosition: `${col * 50}% ${row * 50}%`,
        backgroundRepeat: "no-repeat",
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
