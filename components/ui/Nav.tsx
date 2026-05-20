"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        background: scrolled ? "rgba(8,6,15,0.8)" : "transparent",
        transition: "all 0.4s ease",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.02em" }}>
          ♪ Maestro<span style={{ background: "linear-gradient(90deg,#00d4f0,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Play</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link href="/games" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "rgba(240,238,255,0.7)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.7)")}>
          Games
        </Link>
        <a href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "rgba(240,238,255,0.7)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.7)")}>
          Academy
        </a>
        <Link href="/games/welcome-to-ai" style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "#08060f",
          background: "linear-gradient(90deg,#00d4f0,#e040fb)",
          padding: "0.45rem 1.2rem",
          borderRadius: "100px",
          textDecoration: "none",
          letterSpacing: "0.02em",
          transition: "opacity 0.2s, transform 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)" }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)" }}>
          Play Free
        </Link>
      </div>
    </nav>
  )
}
