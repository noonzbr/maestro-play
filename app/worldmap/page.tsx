"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { allGames } from "@/lib/games"

/* ─── Map node positions (% of viewport) ───────────────────────────────── */
const NODES = [
  { week:  1, x: 11, y: 75, hub: "Jake's Bedroom",      district: "Westbrook Heights",   emoji: "🛏️" },
  { week:  2, x: 27, y: 58, hub: "Rehearsal Studio",    district: "Music District",       emoji: "🥁" },
  { week:  3, x: 20, y: 38, hub: "Concert Backstage",   district: "Riverside Venue",      emoji: "🎭" },
  { week:  4, x: 38, y: 22, hub: "Concert Hall",        district: "Riverside Venue",      emoji: "🏛️" },
  { week:  5, x: 52, y: 48, hub: "The Coffee Shop",     district: "Downtown",             emoji: "☕" },
  { week:  6, x: 64, y: 30, hub: "Startup Office",      district: "Tech Quarter",         emoji: "💻" },
  { week:  7, x: 78, y: 22, hub: "Boardroom",           district: "Business District",    emoji: "🏢" },
  { week:  8, x: 70, y: 58, hub: "Home Office",         district: "Westbrook Heights",    emoji: "🏠" },
  { week:  9, x: 50, y: 70, hub: "University Library",  district: "Campus",               emoji: "📚" },
  { week: 10, x: 72, y: 72, hub: "Tech Company HQ",     district: "Tech Quarter",         emoji: "⚡" },
  { week: 11, x: 86, y: 50, hub: "School Library",      district: "Westbrook High",       emoji: "🏫" },
  { week: 12, x: 90, y: 30, hub: "Computer Lab",        district: "Westbrook High",       emoji: "🖥️" },
]

/* ─── Path segments (week → week connections) ───────────────────────────── */
const PATHS = [
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]
]

/* ─── Keyframes injected once ────────────────────────────────────────────── */
function ensureKf() {
  if (typeof document === "undefined") return
  const id = "worldmap-kf"
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = `
    @keyframes wm-star-twinkle {
      0%,100% { opacity: 0.3; }
      50%     { opacity: 1; }
    }
    @keyframes wm-node-pulse {
      0%,100% { box-shadow: 0 0 0 0 var(--nc, rgba(0,212,240,0)); }
      50%     { box-shadow: 0 0 0 8px var(--nc, rgba(0,212,240,0.12)); }
    }
    @keyframes wm-next-pulse {
      0%,100% { box-shadow: 0 0 12px 2px var(--nc, rgba(0,212,240,0.4)); transform:scale(1); }
      50%     { box-shadow: 0 0 28px 6px var(--nc, rgba(0,212,240,0.6)); transform:scale(1.08); }
    }
    @keyframes wm-path-draw {
      from { stroke-dashoffset: 400; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes wm-float-in {
      from { opacity:0; transform:translateY(24px) scale(0.95); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes wm-card-in {
      from { opacity:0; transform:scale(0.92) translateY(8px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @keyframes wm-jake-walk {
      0%,100% { transform: translateY(0px); }
      50%     { transform: translateY(-4px); }
    }
    @keyframes wm-glow-ambient {
      0%,100% { opacity:0.35; }
      50%     { opacity:0.6; }
    }
  `
  document.head.appendChild(s)
}

/* ─── Stars (generated client-side only to avoid SSR hydration mismatch) ── */
type Star = { x: number; y: number; r: number; dur: number; delay: number }

export default function WorldMapPage() {
  useEffect(() => { ensureKf() }, [])

  const [stars, setStars]       = useState<Star[]>([])
  const [gameXp, setGameXp]     = useState<Record<number, number>>({})
  const [totalXp, setTotalXp]   = useState(0)
  const [streak, setStreak]     = useState(0)
  const [hovered, setHovered]   = useState<number | null>(null)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    // Generate stars client-side only — avoids SSR/client Math.random() mismatch
    setStars(Array.from({ length: 60 }, () => ({
      x:     Math.random() * 100,
      y:     Math.random() * 100,
      r:     Math.random() * 1.5 + 0.5,
      dur:   2 + Math.random() * 3,
      delay: Math.random() * 3,
    })))
    setMounted(true)
    try {
      const xps: Record<number, number> = {}
      for (let i = 1; i <= 12; i++) {
        const v = parseInt(localStorage.getItem(`maestro_game_${i}_xp`) ?? "0") || 0
        if (v > 0) xps[i] = v
      }
      setGameXp(xps)
      setTotalXp(parseInt(localStorage.getItem("maestro_total_xp") ?? "0") || 0)
      setStreak(parseInt(localStorage.getItem("maestro_daily_streak") ?? "0") || 0)
    } catch {}
  }, [])

  const completedWeeks = new Set(Object.keys(gameXp).map(Number))
  const nextWeek = Array.from({ length: 12 }, (_, i) => i + 1).find(w => !completedWeeks.has(w)) ?? 1
  const completedCount = completedWeeks.size

  const hoveredGame = hovered ? allGames.find(g => g.week === hovered) : null
  const hoveredNode = hovered ? NODES.find(n => n.week === hovered) : null

  return (
    <div style={{
      position:   "fixed",
      inset:      0,
      background: "#05030d",
      overflow:   "hidden",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* ── Stars (client-only) ───────────────────────────────────────────── */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}>
        {stars.map((s, i) => (
          <circle key={i}
            cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
            fill="rgba(255,255,255,0.75)"
            style={{ animation:`wm-star-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }}
          />
        ))}
      </svg>

      {/* ── District glow halos ──────────────────────────────────────────── */}
      {[
        { x:14, y:72, color:"rgba(0,212,240,0.08)",  r:180 },
        { x:30, y:50, color:"rgba(224,64,251,0.06)", r:160 },
        { x:55, y:48, color:"rgba(255,180,80,0.06)", r:200 },
        { x:72, y:42, color:"rgba(16,185,129,0.07)", r:180 },
        { x:88, y:40, color:"rgba(0,120,212,0.07)",  r:160 },
        { x:60, y:70, color:"rgba(138,116,248,0.06)",r:150 },
      ].map((g, i) => (
        <div key={i} style={{
          position:     "absolute",
          left:         `${g.x}%`,
          top:          `${g.y}%`,
          transform:    "translate(-50%,-50%)",
          width:        `${g.r}px`,
          height:       `${g.r}px`,
          borderRadius: "50%",
          background:   `radial-gradient(circle, ${g.color} 0%, transparent 70%)`,
          pointerEvents:"none",
          animation:    "wm-glow-ambient 4s ease-in-out infinite",
          animationDelay: `${i * 0.7}s`,
          zIndex:       1,
        }} />
      ))}

      {/* ── SVG: paths + grid lines ──────────────────────────────────────── */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:2, pointerEvents:"none" }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <path d="M0,0 L4,2 L0,4 Z" fill="rgba(0,212,240,0.4)" />
          </marker>
        </defs>

        {/* Subtle city grid */}
        {[20,40,60,80].map(x => (
          <line key={`vg-${x}`} x1={x} y1="0" x2={x} y2="100"
            stroke="rgba(255,255,255,0.025)" strokeWidth="0.15" />
        ))}
        {[25,50,75].map(y => (
          <line key={`hg-${y}`} x1="0" y1={y} x2="100" y2={y}
            stroke="rgba(255,255,255,0.025)" strokeWidth="0.15" />
        ))}

        {/* Journey paths */}
        {PATHS.map(([fromW, toW], i) => {
          const from = NODES.find(n => n.week === fromW)!
          const to   = NODES.find(n => n.week === toW)!
          const game  = allGames.find(g => g.week === fromW)!
          const done  = completedWeeks.has(fromW) && completedWeeks.has(toW)
          const active = completedWeeks.has(fromW) && toW === nextWeek
          const accent = game.accentColor ?? "#00d4f0"

          // Cubic bezier control point — offset midpoint
          const mx = (from.x + to.x) / 2 + (i % 2 === 0 ? 4 : -4)
          const my = (from.y + to.y) / 2 + (i % 3 === 0 ? -5 : 3)

          return (
            <g key={i}>
              {/* Dark trail */}
              <path
                d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.35"
                strokeLinecap="round"
              />
              {/* Lit path — shown when completed or active */}
              {(done || active) && (
                <path
                  d={`M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`}
                  fill="none"
                  stroke={done ? accent : `${accent}88`}
                  strokeWidth={done ? "0.45" : "0.3"}
                  strokeLinecap="round"
                  strokeDasharray="400"
                  strokeDashoffset="0"
                  opacity={done ? 0.7 : 0.5}
                  style={{ filter:`drop-shadow(0 0 2px ${accent})` }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* ── Game nodes ──────────────────────────────────────────────────── */}
      <div style={{ position:"absolute", inset:0, zIndex:3 }}>
        {NODES.map(node => {
          const game    = allGames.find(g => g.week === node.week)!
          const done    = completedWeeks.has(node.week)
          const isNext  = node.week === nextWeek
          const locked  = !done && !isNext && node.week > nextWeek
          const accent  = game.accentColor ?? "#00d4f0"
          const isHovered = hovered === node.week

          return (
            <div
              key={node.week}
              onMouseEnter={() => setHovered(node.week)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position:  "absolute",
                left:      `${node.x}%`,
                top:       `${node.y}%`,
                transform: "translate(-50%,-50%)",
                cursor:    locked ? "default" : "pointer",
                zIndex:    isHovered ? 20 : 10,
              }}
            >
              {/* Node circle */}
              <div style={{
                width:        isNext ? "44px" : "36px",
                height:       isNext ? "44px" : "36px",
                borderRadius: "50%",
                background:   done
                  ? `linear-gradient(135deg, ${accent}cc, ${accent}66)`
                  : isNext
                  ? `linear-gradient(135deg, ${accent}44, ${accent}22)`
                  : "rgba(255,255,255,0.04)",
                border:       done
                  ? `2px solid ${accent}`
                  : isNext
                  ? `2px solid ${accent}88`
                  : "1px solid rgba(255,255,255,0.1)",
                display:      "flex",
                alignItems:   "center",
                justifyContent:"center",
                fontSize:     "1.1rem",
                transition:   "all 0.3s ease",
                transform:    isHovered ? "scale(1.18)" : "scale(1)",
                ["--nc" as string]: `${accent}44`,
                animation:    isNext
                  ? "wm-next-pulse 2.4s ease-in-out infinite"
                  : done
                  ? "wm-node-pulse 4s ease-in-out infinite"
                  : "none",
                filter:       locked ? "grayscale(1) brightness(0.5)" : "none",
                boxShadow:    done
                  ? `0 0 14px ${accent}44`
                  : isNext
                  ? `0 0 20px ${accent}55`
                  : "none",
              }}>
                {done ? "✓" : locked ? "🔒" : node.emoji}
              </div>

              {/* Week badge */}
              <div style={{
                position:   "absolute",
                top:        "-10px",
                right:      "-8px",
                width:      "18px",
                height:     "18px",
                borderRadius:"50%",
                background: done ? accent : "rgba(255,255,255,0.08)",
                border:     `1px solid ${done ? accent : "rgba(255,255,255,0.15)"}`,
                display:    "flex",
                alignItems: "center",
                justifyContent:"center",
                fontSize:   "0.55rem",
                fontWeight: 800,
                color:      done ? "#08060f" : "rgba(255,255,255,0.5)",
              }}>
                {node.week}
              </div>

              {/* Mini label below node */}
              <div style={{
                position:   "absolute",
                top:        "100%",
                left:       "50%",
                transform:  "translateX(-50%)",
                marginTop:  "6px",
                whiteSpace: "nowrap",
                fontFamily: "Inter, sans-serif",
                fontSize:   "0.52rem",
                fontWeight: 700,
                letterSpacing:"0.08em",
                color:      done ? "rgba(240,238,255,0.8)" : isNext ? "rgba(240,238,255,0.6)" : "rgba(240,238,255,0.25)",
                textTransform:"uppercase",
                textShadow: done ? `0 0 8px ${accent}` : "none",
              }}>
                {node.hub}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Hover card ──────────────────────────────────────────────────── */}
      {hovered && hoveredGame && hoveredNode && (
        <div style={{
          position:     "fixed",
          bottom:       "100px",
          left:         "50%",
          transform:    "translateX(-50%)",
          zIndex:       50,
          background:   "rgba(8,6,20,0.97)",
          border:       `1px solid ${hoveredGame.accentColor ?? "#00d4f0"}44`,
          borderTop:    `2px solid ${hoveredGame.accentColor ?? "#00d4f0"}`,
          borderRadius: "20px",
          padding:      "1.1rem 1.5rem",
          minWidth:     "300px",
          maxWidth:     "380px",
          backdropFilter:"blur(24px)",
          boxShadow:    `0 4px 40px ${hoveredGame.accentColor ?? "#00d4f0"}18`,
          animation:    "wm-card-in 0.22s cubic-bezier(0.34,1.2,0.64,1) both",
          pointerEvents:"none",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.7rem", marginBottom:"0.6rem" }}>
            <div style={{
              width:"38px", height:"38px", borderRadius:"50%",
              background:`linear-gradient(135deg, ${hoveredGame.accentColor ?? "#00d4f0"}33, ${hoveredGame.accentColor ?? "#00d4f0"}11)`,
              border:`1px solid ${hoveredGame.accentColor ?? "#00d4f0"}44`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.15rem",
            }}>
              {hoveredNode.emoji}
            </div>
            <div>
              <div style={{ fontSize:"0.58rem", letterSpacing:"0.2em", color:"rgba(240,238,255,0.4)", textTransform:"uppercase", fontWeight:600, marginBottom:"0.15rem" }}>
                Game {hoveredGame.week} · {hoveredNode.district}
              </div>
              <div style={{ fontSize:"0.9rem", fontWeight:800, color:"#fff", lineHeight:1.2 }}>
                {hoveredGame.title}
              </div>
            </div>
          </div>
          <div style={{ fontSize:"0.78rem", color:"rgba(240,238,255,0.55)", lineHeight:1.6, marginBottom:"0.75rem" }}>
            {hoveredGame.characterName && (
              <span style={{ color: hoveredGame.accentColor ?? "#00d4f0", fontWeight:700 }}>
                {hoveredGame.characterName}
              </span>
            )}{hoveredGame.characterRole ? ` · ${hoveredGame.characterRole}` : ""}
          </div>
          {completedWeeks.has(hoveredGame.week) ? (
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#58cc02" }} />
              <span style={{ fontSize:"0.72rem", color:"#58cc02", fontWeight:700 }}>
                Completed · {gameXp[hoveredGame.week]} XP earned
              </span>
            </div>
          ) : hoveredGame.week === nextWeek ? (
            <div style={{ fontSize:"0.72rem", color: hoveredGame.accentColor ?? "#00d4f0", fontWeight:700 }}>
              ▶ Next chapter awaits
            </div>
          ) : (
            <div style={{ fontSize:"0.72rem", color:"rgba(240,238,255,0.3)" }}>
              {hoveredGame.free ? "Free" : `$${hoveredGame.price?.toFixed(2)}`} · Locked
            </div>
          )}
        </div>
      )}

      {/* ── Top stats bar ────────────────────────────────────────────────── */}
      <div style={{
        position:     "fixed",
        top:          0,
        left:         0,
        right:        0,
        padding:      "1rem 1.5rem",
        display:      "flex",
        alignItems:   "center",
        justifyContent:"space-between",
        background:   "rgba(5,3,13,0.85)",
        backdropFilter:"blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        zIndex:       40,
      }}>
        <Link href="/games" style={{ textDecoration:"none" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <span style={{ fontSize:"1.3rem" }}>🗺️</span>
            <div>
              <div style={{ fontFamily:"Cormorant Garamond, serif", fontWeight:700, fontSize:"1rem", color:"#fff" }}>
                Jake's World
              </div>
              <div style={{ fontSize:"0.58rem", letterSpacing:"0.14em", color:"rgba(240,238,255,0.35)", textTransform:"uppercase" }}>
                Westbrook · Story Map
              </div>
            </div>
          </div>
        </Link>

        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:800, fontSize:"1.1rem", color:"#00d4f0", lineHeight:1 }}>{completedCount}</div>
            <div style={{ fontSize:"0.55rem", color:"rgba(240,238,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase" }}>chapters</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontWeight:800, fontSize:"1.1rem", color:"#e040fb", lineHeight:1 }}>{totalXp}</div>
            <div style={{ fontSize:"0.55rem", color:"rgba(240,238,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase" }}>total xp</div>
          </div>
          {streak > 0 && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:800, fontSize:"1.1rem", color:"#ff9800", lineHeight:1 }}>{streak}🔥</div>
              <div style={{ fontSize:"0.55rem", color:"rgba(240,238,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase" }}>streak</div>
            </div>
          )}
          <Link
            href={nextWeek <= 12 ? `/games/${allGames.find(g => g.week === nextWeek)?.slug ?? ""}` : "/games"}
            style={{ textDecoration:"none" }}
          >
            <div style={{
              fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.82rem",
              color:"#08060f",
              background:"linear-gradient(90deg,#00d4f0,#e040fb)",
              padding:"0.55rem 1.25rem", borderRadius:"100px",
              letterSpacing:"0.01em",
              boxShadow:"0 0 20px rgba(0,212,240,0.3)",
              transition:"transform 0.15s, box-shadow 0.15s",
            }}>
              {completedCount === 0 ? "Begin →" : completedCount === 12 ? "Completed ✓" : `Continue →`}
            </div>
          </Link>
        </div>
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div style={{
        position:     "fixed",
        bottom:       "1.5rem",
        left:         "1.5rem",
        zIndex:       40,
        display:      "flex",
        flexDirection:"column",
        gap:          "0.5rem",
      }}>
        {[
          { color:"#58cc02", label:"Completed" },
          { color:"#00d4f0", label:"Next chapter", pulse:true },
          { color:"rgba(255,255,255,0.15)", label:"Locked" },
        ].map((l, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
            <div style={{
              width:"10px", height:"10px", borderRadius:"50%",
              background:l.color,
              boxShadow: l.pulse ? `0 0 8px ${l.color}` : "none",
            }} />
            <span style={{ fontSize:"0.62rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.08em" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── District labels (background context) ────────────────────────── */}
      {[
        { x:12, y:88, label:"Westbrook Heights" },
        { x:24, y:30, label:"Riverside Venue" },
        { x:52, y:20, label:"Downtown" },
        { x:72, y:14, label:"Business District" },
        { x:52, y:83, label:"Campus" },
        { x:75, y:83, label:"Tech Quarter" },
        { x:88, y:65, label:"Westbrook High" },
      ].map((d, i) => (
        <div key={i} style={{
          position:     "absolute",
          left:         `${d.x}%`,
          top:          `${d.y}%`,
          transform:    "translateX(-50%)",
          fontFamily:   "Cormorant Garamond, serif",
          fontStyle:    "italic",
          fontSize:     "0.7rem",
          color:        "rgba(255,255,255,0.08)",
          letterSpacing:"0.12em",
          textTransform:"uppercase",
          pointerEvents:"none",
          whiteSpace:   "nowrap",
          zIndex:       2,
        }}>
          {d.label}
        </div>
      ))}

      {/* Click targets for nodes */}
      <div style={{ position:"absolute", inset:0, zIndex:15 }}>
        {NODES.map(node => {
          const game   = allGames.find(g => g.week === node.week)!
          const done   = completedWeeks.has(node.week)
          const isNext = node.week === nextWeek
          const locked = !done && !isNext && node.week > nextWeek
          if (locked) return null
          return (
            <Link
              key={node.week}
              href={`/games/${game.slug}`}
              style={{
                position:     "absolute",
                left:         `${node.x}%`,
                top:          `${node.y}%`,
                transform:    "translate(-50%,-50%)",
                width:        "60px",
                height:       "60px",
                display:      "block",
                borderRadius: "50%",
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
