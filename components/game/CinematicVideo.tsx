"use client"

import { useState } from "react"

/**
 * CinematicVideo
 * ─────────────────────────────────────────────────────────────────
 * Drop-in replacement for <img> or <video> in cinematic scenes.
 *
 * Tries to play a video clip first. If the file is missing (404)
 * or the browser can't play it, falls back silently to `poster`
 * (a static image URL). If there's no poster either, renders nothing.
 *
 * Naming convention for PixVerse-generated assets:
 *   Character loops : /videos/char-jake.mp4
 *                     /videos/char-senora_vega.mp4
 *                     /videos/char-tyler.mp4
 *   Per-game intro  : /videos/g01-intro.mp4  …  /videos/g12-intro.mp4
 *   Per-game reveal : /videos/g01-reveal.mp4 …  /videos/g12-reveal.mp4
 *   Per-game end    : /videos/g01-end.mp4    …  /videos/g12-end.mp4
 */

export interface CinematicVideoProps {
  /** Path to the video file, e.g. "/videos/char-jake.mp4" */
  src: string
  /** Fallback static image shown while loading or on error */
  poster?: string
  /** Loop the clip (default: true — for character idles) */
  loop?: boolean
  /** Muted — required by browsers for autoplay (default: true) */
  muted?: boolean
  /** Start playing immediately (default: true) */
  autoPlay?: boolean
  /** Called when a non-looping clip finishes playing */
  onEnded?: () => void
  style?: React.CSSProperties
  objectFit?: "cover" | "contain" | "fill"
  draggable?: boolean
  alt?: string
}

export default function CinematicVideo({
  src,
  poster,
  loop    = true,
  muted   = true,
  autoPlay = true,
  onEnded,
  style   = {},
  objectFit = "contain",
  draggable = false,
  alt     = "",
}: CinematicVideoProps) {
  const [failed, setFailed] = useState(false)

  /* ── Fallback: static image (or nothing) ─────────────────────────────── */
  if (failed) {
    if (poster) {
      return (
        <img
          src={poster}
          alt={alt}
          draggable={draggable}
          style={{ ...style, objectFit: objectFit as React.CSSProperties["objectFit"] }}
        />
      )
    }
    return null
  }

  /* ── Video (primary) ─────────────────────────────────────────────────── */
  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      onEnded={onEnded}
      onError={() => setFailed(true)}
      draggable={false}
      style={{
        ...style,
        objectFit: objectFit as React.CSSProperties["objectFit"],
      }}
    />
  )
}
