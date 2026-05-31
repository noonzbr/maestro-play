"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { signOut } from "@/lib/supabase-browser"

/* ─── localStorage keys ─────────────────────────────────────────────────── */
const XP_KEY     = "maestro_total_xp"
const STREAK_KEY = "maestro_daily_streak"
const LEVEL_KEY  = "maestro_level"

/* ─── Conductor levels ──────────────────────────────────────────────────── */
const LEVELS = [
  { label: "Apprentice",    minXp: 0    },
  { label: "Associate",     minXp: 500  },
  { label: "Conductor",     minXp: 1500 },
  { label: "Grand Maestro", minXp: 3000 },
]

function getLevelLabel(xp: number): string {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i].label
  }
  return "Apprentice"
}

function getNextLevelXp(xp: number): number {
  for (const lv of LEVELS) {
    if (xp < lv.minXp) return lv.minXp
  }
  return LEVELS[LEVELS.length - 1].minXp
}

/* ─── XP pill shown in nav ──────────────────────────────────────────────── */
function XPPill({ xp, streak, shieldActive }: { xp: number; streak: number; shieldActive?: boolean }) {
  const nextLv  = getNextLevelXp(xp)
  const prevLv  = LEVELS.slice().reverse().find(l => xp >= l.minXp)?.minXp ?? 0
  const pct     = nextLv > prevLv ? Math.min(100, ((xp - prevLv) / (nextLv - prevLv)) * 100) : 100
  const [pop, setPop] = useState(false)

  useEffect(() => {
    setPop(true)
    const t = setTimeout(() => setPop(false), 600)
    return () => clearTimeout(t)
  }, [xp])

  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      gap:            "0.6rem",
      background:     "rgba(0,212,240,0.06)",
      border:         "1px solid rgba(0,212,240,0.18)",
      borderRadius:   "100px",
      padding:        "0.3rem 0.75rem 0.3rem 0.55rem",
      backdropFilter: "blur(10px)",
      transition:     "border-color 0.3s ease",
    }}>
      {/* XP count */}
      <span style={{
        fontFamily:  "Inter, sans-serif",
        fontWeight:  800,
        fontSize:    "0.78rem",
        color:       "#00d4f0",
        letterSpacing: "-0.01em",
        transform:   pop ? "scale(1.18)" : "scale(1)",
        transition:  "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        display:     "inline-block",
      }}>
        ⚡{xp.toLocaleString()} XP
      </span>

      {/* Mini progress bar */}
      <div style={{
        width:      "42px",
        height:     "4px",
        background: "rgba(255,255,255,0.1)",
        borderRadius:"2px",
        overflow:   "hidden",
      }}>
        <div style={{
          height:     "100%",
          width:      `${pct}%`,
          background: "linear-gradient(90deg,#00d4f0,#e040fb)",
          borderRadius:"2px",
          transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>

      {/* Streak */}
      {streak > 0 && (
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 800,
          fontSize:   "0.78rem",
          color:      "#e040fb",
        }}>
          {streak}🔥
        </span>
      )}

      {/* Shield active indicator */}
      {shieldActive && (
        <span
          title="Streak Shield active — one missed day protected"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize:   "0.72rem",
            color:      "#00d4f0",
            opacity:    0.85,
          }}
        >
          🛡️
        </span>
      )}
    </div>
  )
}

/* ─── Main Nav ──────────────────────────────────────────────────────────── */
export default function Nav() {
  const { user, loading: authLoading, openAuthModal } = useAuth()
  const [scrolled,     setScrolled]     = useState(false)
  const [xp,           setXp]           = useState(0)
  const [streak,       setStreak]       = useState(0)
  const [hasData,      setHasData]      = useState(false)
  const [shieldActive, setShieldActive] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close menu on outside click
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

  // Read from localStorage
  useEffect(() => {
    const readProgress = () => {
      try {
        const storedXp     = parseInt(localStorage.getItem(XP_KEY)     ?? "0") || 0
        const storedStreak = parseInt(localStorage.getItem(STREAK_KEY) ?? "0") || 0
        setXp(storedXp)
        setStreak(storedStreak)
        setHasData(storedXp > 0 || storedStreak > 0)
        // Check streak shield power-up
        const puRaw = localStorage.getItem("maestro_pu_active")
        if (puRaw) {
          const pu = JSON.parse(puRaw)
          setShieldActive(typeof pu.shield === "number" && Date.now() < pu.shield)
        } else {
          setShieldActive(false)
        }
      } catch {}
    }
    readProgress()
    // Re-read on focus (user returns from a game tab)
    window.addEventListener("focus", readProgress)
    // Also listen for storage events from other tabs
    window.addEventListener("storage", readProgress)
    return () => {
      window.removeEventListener("focus", readProgress)
      window.removeEventListener("storage", readProgress)
    }
  }, [])

  return (
    <nav
      suppressHydrationWarning
      style={{
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        zIndex:         100,
        padding:        "0 2rem",
        height:         "64px",
        display:        "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems:     "center",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottom:   scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        background:     scrolled ? "rgba(8,6,15,0.85)" : "transparent",
        transition:     "all 0.4s ease",
      }}
    >
      {/* Left — Logo */}
      <Link href="/" style={{ textDecoration: "none", justifySelf: "start" }}>
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

      {/* Center — XP pill (only if player has started) */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        {hasData && <XPPill xp={xp} streak={streak} shieldActive={shieldActive} />}
      </div>

      {/* Right nav links — keep lean so center pill has room */}
      <div suppressHydrationWarning style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifySelf: "end" }}>
        <Link
          href="/games"
          style={{ fontFamily:"Inter, sans-serif", fontSize:"0.875rem", fontWeight:500, color:"rgba(240,238,255,0.7)", textDecoration:"none", transition:"color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,238,255,0.7)")}
        >
          Games
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
        {/* Auth button / user menu */}
        {!authLoading && (
          user ? (
            /* Logged in — user avatar + dropdown */
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
            /* Not logged in — sign in + play free */
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
