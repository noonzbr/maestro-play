"use client"

// PostProcessing disabled — EffectComposer reads renderer.alpha before the
// WebGL context is fully initialised, causing a runtime crash on mount.
// Visual richness is handled by the CSS animated orbs in globals.css instead.
export default function PostProcessing() {
  return null
}
