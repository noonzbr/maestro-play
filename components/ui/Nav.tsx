"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { signOut } from "@/lib/supabase-browser"

export default function Nav() {
  const pathname = usePathname()
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
      <Link href="/" suppressHydrationWarning style={{ textDecorationLine: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V5l12-2v13" stroke="url(#logo-grad-nav)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6" cy="18" r="3" fill="url(#logo-grad-nav)"/>
          <circle cx="18" cy="16" r="3" fill="url(#logo-grad-nav)"/>
          <defs>
            <linearGradient id="logo-grad-nav" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00d4f0"/>
              <stop offset="100%" stopColor="#e040fb"/>
            </linearGradient>
          </defs>
        </svg>
        <span style={{
          fontFamily:    "Inter, sans-serif",
          fontWeight:    800,
          fontSize:      "1.1rem",
          color:         "#fff",
          letterSpacing: "-0.02em",
        }}>
          Maestro<span style={{
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
          suppressHydrationWarning
          aria-current={pathname?.startsWith("/games") ? "page" : undefined}
          style={{
            fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500,
            color: pathname?.startsWith("/games") ? "#fff" : "rgba(240,238,255,0.82)",
            textDecorationLine:"none", flexShrink:0, transition:"color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = pathname?.startsWith("/games") ? "#fff" : "rgba(240,238,255,0.82)")}
        >
          Story Map
        </Link>
        <Link
          href="/dashboard"
          suppressHydrationWarning
          aria-current={pathname === "/dashboard" ? "page" : undefined}
          style={{
            fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500,
            color: pathname === "/dashboard" ? "#fff" : "rgba(240,238,255,0.82)",
            textDecorationLine:"none", flexShrink:0, transition:"color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = pathname === "/dashboard" ? "#fff" : "rgba(240,238,255,0.82)")}
        >
          Dashboard
        </Link>
        <a
          href="https://aimaestro.academy"
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          style={{ fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500, color:"rgba(240,238,255,0.82)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.82)")}
        >
          Academy
        </a>

        {/* Auth */}
        {!authLoading && (
          user ? (
            <div ref={menuRef} style={{ position:"relative" }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                aria-label={userMenuOpen ? "Close account menu" : "Open account menu"}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
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
                  <Link href="/dashboard" suppressHydrationWarning onClick={() => setUserMenuOpen(false)} style={{ display:"block", textDecorationLine:"none", fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:"0.82rem", color:"rgba(240,238,255,0.8)", padding:"0.55rem 0.85rem", borderRadius:"10px", transition:"background 0.15s" }}
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
            <button
              onClick={() => openAuthModal("signin")}
              style={{
                fontFamily:"Inter, sans-serif", fontSize:"0.8rem", fontWeight:700,
                color:"#08060f",
                background:"linear-gradient(90deg,#00d4f0,#e040fb)",
                padding:"0.45rem 1.2rem", borderRadius:"100px",
                border:"none",
                cursor:"pointer", letterSpacing:"0.02em",
                flexShrink: 0,
                transition:"opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity="0.9"; e.currentTarget.style.transform="translateY(-1px)" }}
              onMouseLeave={e => { e.currentTarget.style.opacity="1";   e.currentTarget.style.transform="translateY(0)" }}
            >
              Sign in
            </button>
          )
        )}
      </div>
    </nav>
  )
}
