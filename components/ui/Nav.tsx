"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { signOut } from "@/lib/supabase-browser"

export default function Nav() {
  const { user, loading: authLoading, openAuthModal } = useAuth()
  const [scrolled,     setScrolled]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         100,
        padding:        "0 2rem",
        height:         "64px",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottom:   scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        background:     scrolled ? "rgba(8,6,15,0.85)" : "transparent",
        transition:     "all 0.4s ease",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily:    "Inter, sans-serif",
          fontWeight:    800,
          fontSize:      "1.1rem",
          color:         "#fff",
          letterSpacing: "-0.02em",
        }}>
          ♪ Maestro<span style={{
            background:          "linear-gradient(90deg,#00d4f0,#e040fb)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor: "transparent",
            backgroundClip:      "text",
          }}>Play</span>
        </span>
      </Link>

      {/* Right nav */}
      <div suppressHydrationWarning style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        <Link
          href="/games"
          style={{ fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500, color:"rgba(240,238,255,0.7)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.7)")}
        >
          Games
        </Link>
        <Link
          href="/dashboard"
          style={{ fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500, color:"rgba(240,238,255,0.7)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.7)")}
        >
          Dashboard
        </Link>
        <a
          href="https://aimaestro.academy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500, color:"rgba(240,238,255,0.7)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.7)")}
        >
          Academy
        </a>

        {/* Auth */}
        {!authLoading && (
          user ? (
            <div ref={menuRef} style={{ position:"relative" }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                style={{
                  width:"34px", height:"34px", borderRadius:"50%",
                  background:"linear-gradient(135deg, #00d4f0, #e040fb)",
                  border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.78rem",
                  color:"#08060f",
                  boxShadow:"0 0 16px rgba(0,212,240,0.3)",
                }}
              >
                {(user.email?.[0] ?? "U").toUpperCase()}
              </button>
              {userMenuOpen && (
                <div style={{
                  position:"absolute", right:0, top:"calc(100% + 0.5rem)",
                  background:"rgba(10,7,20,0.98)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:"14px", padding:"0.35rem",
                  boxShadow:"0 16px 48px rgba(0,0,0,0.5)",
                  minWidth:"180px", zIndex:200,
                }}>
                  <div style={{ fontFamily:"Inter, sans-serif", fontSize:"0.72rem", color:"rgba(240,238,255,0.4)", padding:"0.5rem 0.85rem 0.3rem", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:"0.3rem" }}>
                    {user.email}
                  </div>
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} style={{ display:"block", textDecoration:"none", fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:"0.82rem", color:"rgba(240,238,255,0.8)", padding:"0.55rem 0.85rem", borderRadius:"10px", transition:"background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background="rgba(255,255,255,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background="")}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => { setUserMenuOpen(false); try { await signOut() } catch {} }}
                    style={{ width:"100%", textAlign:"left", background:"none", border:"none", cursor:"pointer", fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:"0.82rem", color:"rgba(240,238,255,0.5)", padding:"0.55rem 0.85rem", borderRadius:"10px", transition:"background 0.15s, color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,80,80,0.08)"; e.currentTarget.style.color="#ff8080" }}
                    onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.color="rgba(240,238,255,0.5)" }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("signin")}
                style={{
                  fontFamily:"Inter, sans-serif", fontSize:"0.82rem", fontWeight:600,
                  color:"rgba(240,238,255,0.65)", background:"none", border:"none",
                  cursor:"pointer", transition:"color 0.2s", padding:0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")}
                onMouseLeave={e => (e.currentTarget.style.color="rgba(240,238,255,0.65)")}
              >
                Sign in
              </button>
              <Link
                href="/games/welcome-to-ai"
                style={{
                  fontFamily:"Inter, sans-serif", fontSize:"0.8rem", fontWeight:700,
                  color:"#08060f",
                  background:"linear-gradient(90deg,#00d4f0,#e040fb)",
                  padding:"0.45rem 1.2rem", borderRadius:"100px",
                  textDecoration:"none", letterSpacing:"0.02em",
                  transition:"opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-1px)" }}
                onMouseLeave={e => { e.currentTarget.style.opacity="1";   e.currentTarget.style.transform="translateY(0)" }}
              >
                Play Free
              </Link>
            </>
          )
        )}
      </div>
    </nav>
  )
}
