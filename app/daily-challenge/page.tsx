"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"
import DailyChallenge from "@/components/game/DailyChallenge"
import FloatingNotes from "@/components/game/FloatingNotes"

export default function DailyChallengePage() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    try {
      const savedStreak = parseInt(localStorage.getItem("maestro_streak") ?? "0") || 0
      setStreak(savedStreak)
    } catch {}
  }, [])

  return (
    <>
      <Nav />
      <main style={{ 
        position: "relative",
        minHeight: "100vh", 
        background: "#06040a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6.5rem 1.5rem 4rem",
        overflow: "hidden"
      }}>
        {/* Ambient background particles */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
          <FloatingNotes mood="normal" />
        </div>
        
        {/* Glow orbs */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <div className="hero-orb-purple" style={{ opacity: 0.15, top: "10%", left: "10%" }} />
          <div className="hero-orb-cyan" style={{ opacity: 0.15, bottom: "10%", right: "10%" }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "520px" }}>
          {/* Back button */}
          <div style={{ marginBottom: "1.2rem", paddingLeft: "0.2rem" }}>
            <Link href="/worldmap" style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.4rem", 
              fontFamily: "Inter, sans-serif", 
              fontSize: "0.78rem", 
              fontWeight: 700, 
              color: "rgba(255,255,255,0.4)", 
              textDecoration: "none", 
              transition: "color 0.2s" 
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >
              ← Back to World Map
            </Link>
          </div>

          <DailyChallenge 
            streak={streak}
            onComplete={(xp) => {
              try {
                const cur = parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0
                localStorage.setItem("maestro_total_xp", (cur + xp).toString())
              } catch {}
            }} 
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
