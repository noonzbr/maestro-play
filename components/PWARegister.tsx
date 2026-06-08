"use client"

import { useEffect, useState } from "react"

// Tiny install-prompt banner — shown once, dismissed forever via localStorage
export function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<Event | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("pwa-dismissed")) return

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const install = async () => {
    if (!prompt) return
    ;(prompt as any).prompt()
    const { outcome } = await (prompt as any).userChoice
    if (outcome === "accepted") localStorage.setItem("pwa-dismissed", "1")
    setVisible(false)
  }

  const dismiss = () => {
    localStorage.setItem("pwa-dismissed", "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: "fixed",
      bottom: "1.25rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      background: "rgba(8,6,15,0.95)",
      border: "1px solid rgba(0,212,240,0.3)",
      borderRadius: "100px",
      padding: "0.6rem 1rem 0.6rem 0.75rem",
      backdropFilter: "blur(16px)",
      boxShadow: "0 0 32px rgba(0,212,240,0.15)",
      animation: "scene-fade-in 0.4s ease both",
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: "1.2rem" }}>🎼</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.85)", fontWeight: 500 }}>
        Add MaestroPlay to your home screen
      </span>
      <button
        onClick={install}
        style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem",
          color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)",
          border: "none", borderRadius: "100px", padding: "0.35rem 0.85rem",
          cursor: "pointer",
        }}
      >
        Install
      </button>
      <button
        onClick={dismiss}
        style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
          color: "var(--muted)", background: "none", border: "none",
          cursor: "pointer", padding: "0.25rem",
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}

// Service worker registration (silent, no UI)
// Skipped in development: Turbopack chunks change on every restart and
// a caching SW causes stale-chunk errors ("module factory not available").
export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service worker registered:", reg.scope)
        })
        .catch((err) => {
          console.warn("[PWA] Service worker registration failed:", err)
        })
    }
  }, [])

  return null
}
