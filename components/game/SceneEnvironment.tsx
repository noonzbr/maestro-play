"use client"

import { useMemo, useEffect, useRef } from "react"

/* ─── types ─────────────────────────────────────────────────────────────── */
type EnvType   = "bedroom" | "hallway" | "classroom" | "band" | "practice"
               | "coffee" | "homeoffice" | "office" | "stage" | "library"
               | "computerlab" | "rehearsal" | "generic"
type TimeOfDay = "morning" | "afternoon" | "evening" | "night" | "latenight"

/* ─── parse location string ─────────────────────────────────────────────── */
function parseLocation(location: string): { env: EnvType; day: string; time: string; tod: TimeOfDay } {
  const parts = location.split("·").map(p => p.trim())
  const place = (parts[0] || "").toUpperCase()
  const day   = parts[1]?.trim() || ""
  const time  = parts[2]?.trim() || ""

  let env: EnvType = "generic"

  // Most-specific checks first to avoid substring collisions
  if (place.includes("COMPUTER LAB"))
    env = "computerlab"
  else if (place.includes("BAND"))
    env = "band"
  else if (place.includes("PRACTICE ROOM"))
    env = "practice"
  else if (place.includes("REHEARSAL STUDIO") || (place.includes("MUSIC ROOM") && !place.includes("MUSIC CLASS")))
    env = "rehearsal"
  else if (place.includes("STAGE") || place.includes("BACKSTAGE") || place.includes("CONCERT HALL") || place.includes("GREEN ROOM"))
    env = "stage"
  else if (place.includes("COFFEE SHOP") || place.includes("CAMPUS CAFÉ") || place.includes("CAMPUS CAFE"))
    env = "coffee"
  else if (place.includes("HOME OFFICE"))
    env = "homeoffice"
  else if (place.includes("BOARDROOM") || place.includes("CONFERENCE ROOM") || place.includes("OPEN OFFICE")
        || place.includes("STARTUP OFFICE") || place.includes("TECH COMPANY") || place.includes("PRIYA'S DESK"))
    env = "office"
  else if (place.includes("SCHOOL LIBRARY") || place.includes("UNIVERSITY LIBRARY") || place.includes("LIBRARY"))
    env = "library"
  else if (place.includes("HALLWAY") || place.includes("SCHOOL HALLWAY"))
    env = "hallway"
  else if (place.includes("MUSIC CLASS") || place.includes("CLASSROOM"))
    env = "classroom"
  else if (place.includes("BEDROOM") || place.includes("JAKE'S ROOM") || place.includes("ROOM"))
    env = "bedroom"

  let tod: TimeOfDay = "night"
  if (time) {
    const hour  = parseInt(time.split(":")[0]) || 0
    const isAM  = time.toUpperCase().includes("AM")
    const isPM  = time.toUpperCase().includes("PM")
    if (isAM && hour <= 5)                   tod = "latenight"
    else if (isAM)                            tod = "morning"
    else if (isPM && hour === 12)             tod = "afternoon"
    else if (isPM && hour >= 1 && hour <= 5) tod = "afternoon"
    else if (isPM && hour >= 6)              tod = "evening"
  }

  return { env, day, time, tod }
}

/* ─── day-of-week index helper ─────────────────────────────────────────── */
const DAY_SHORT: Record<string, number> = {
  MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6, SUN:7,
  MONDAY:1, TUESDAY:2, WEDNESDAY:3, THURSDAY:4, FRIDAY:5, SATURDAY:6, SUNDAY:7,
}
function dayIndex(day: string): number {
  return DAY_SHORT[day.trim().toUpperCase()] ?? 0
}

/* ─── CalendarWidget ─────────────────────────────────────────────────────── */
export function CalendarWidget({ day, small }: { day: string; small?: boolean }) {
  const idx    = dayIndex(day)
  const LABELS = ["M", "T", "W", "T", "F", "S", "S"]
  const NUMS   = [27,  28,  29,  30,   1,   2,   3 ]   // fake week

  const s = small ? 0.72 : 1

  return (
    <div style={{
      display:       "inline-block",
      background:    "rgba(240,238,255,0.93)",
      borderRadius:  `${6*s}px`,
      boxShadow:     "0 4px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.3)",
      overflow:      "hidden",
      width:         `${110*s}px`,
      flexShrink:    0,
      userSelect:    "none",
    }}>
      {/* Calendar header band */}
      <div style={{
        background:    "linear-gradient(90deg, #e040fb, #7b2fbe)",
        padding:       `${4*s}px ${8*s}px`,
        display:       "flex",
        alignItems:    "center",
        justifyContent:"space-between",
      }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:`${9*s}px`, color:"#fff", letterSpacing:"0.08em" }}>
          MAY 2026
        </span>
        <span style={{ fontFamily:"Inter,sans-serif", fontWeight:600, fontSize:`${8*s}px`, color:"rgba(255,255,255,0.75)" }}>
          ◆
        </span>
      </div>
      {/* Day labels */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px", padding:`${5*s}px ${5*s}px ${2*s}px` }}>
        {LABELS.map((l, i) => (
          <div key={i} style={{
            textAlign:"center",
            fontFamily:"Inter,sans-serif",
            fontWeight:800,
            fontSize:`${7.5*s}px`,
            color: i+1 === idx ? "#7b2fbe" : "#999",
          }}>{l}</div>
        ))}
      </div>
      {/* Dates */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:`${2*s}px`, padding:`${1*s}px ${5*s}px ${6*s}px` }}>
        {NUMS.map((n, i) => {
          const active = i+1 === idx
          return (
            <div key={i} style={{
              textAlign:"center",
              fontFamily:"Inter,sans-serif",
              fontWeight: active ? 900 : 600,
              fontSize:`${9*s}px`,
              color: active ? "#fff" : "#444",
              background: active ? "linear-gradient(135deg,#e040fb,#7b2fbe)" : "transparent",
              borderRadius:"50%",
              width:`${16*s}px`,
              height:`${16*s}px`,
              lineHeight:`${16*s}px`,
              margin:"auto",
              boxShadow: active ? `0 2px 8px rgba(224,64,251,0.5)` : "none",
            }}>{n}</div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── TimeChip ─────────────────────────────────────────────────────────── */
function TimeChip({ time }: { time: string }) {
  return (
    <div style={{
      display:       "inline-flex",
      alignItems:    "center",
      gap:           "5px",
      background:    "rgba(8,6,15,0.7)",
      border:        "1px solid rgba(0,212,240,0.22)",
      borderRadius:  "8px",
      padding:       "4px 9px",
      backdropFilter:"blur(8px)",
    }}>
      <span style={{ fontSize:"9px", color:"rgba(0,212,240,0.7)" }}>🕐</span>
      <span style={{ fontFamily:"Inter,sans-serif", fontWeight:700, fontSize:"10px", color:"rgba(0,212,240,0.9)", letterSpacing:"0.08em" }}>
        {time}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENVIRONMENT COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/* ─── 1. BEDROOM ─────────────────────────────────────────────────────────── */
function BedroomEnv({ tod }: { tod: TimeOfDay }) {
  const isVeryLate = tod === "latenight"
  const skyColor   = isVeryLate ? "#02010a" : "#050318"
  const bgBase     = isVeryLate ? "#050309" : "#08060f"
  const lampAlpha  = isVeryLate ? 0.5 : 0.35
  const laptopAlpha= isVeryLate ? 0.4 : 0.3

  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="lamp-glow" cx="78%" cy="78%" r="35%">
          <stop offset="0%"   stopColor={`rgba(255,180,60,${lampAlpha})`} />
          <stop offset="40%"  stopColor={`rgba(255,140,40,${lampAlpha * 0.5})`} />
          <stop offset="100%" stopColor="rgba(255,120,0,0)" />
        </radialGradient>
        <radialGradient id="laptop-glow" cx="72%" cy="82%" r="18%">
          <stop offset="0%"   stopColor={`rgba(100,180,255,${laptopAlpha})`} />
          <stop offset="100%" stopColor="rgba(80,160,255,0)" />
        </radialGradient>
        <linearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={skyColor} />
          <stop offset="100%" stopColor="#0a0620" />
        </linearGradient>
        <linearGradient id="wall-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f0c1e" />
          <stop offset="100%" stopColor="#0b0918" />
        </linearGradient>
        <linearGradient id="floor-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#131028" />
          <stop offset="100%" stopColor="#0e0c1f" />
        </linearGradient>
        <radialGradient id="poster-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(123,47,190,0.18)" />
          <stop offset="100%" stopColor="rgba(123,47,190,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="800" height="430" fill="url(#wall-grad)" />
      <rect x="0" y="430" width="800" height="170" fill="url(#floor-grad)" />
      <line x1="0" y1="430" x2="800" y2="430" stroke="rgba(100,80,160,0.18)" strokeWidth="1.5" />

      {/* Window */}
      <rect x="590" y="40" width="160" height="210" rx="4" fill="#0a0818" stroke="rgba(100,80,160,0.35)" strokeWidth="2" />
      <rect x="593" y="43" width="154" height="204" rx="2" fill="url(#night-sky)" />
      <line x1="670" y1="43" x2="670" y2="247" stroke="rgba(100,80,160,0.35)" strokeWidth="2" />
      <line x1="593" y1="145" x2="747" y2="145" stroke="rgba(100,80,160,0.35)" strokeWidth="2" />
      {[[612,68],[695,82],[640,110],[720,60],[660,130],[700,100],[620,155],[685,168]].map(([sx,sy],i)=>(
        <circle key={i} cx={sx} cy={sy} r={i%3===0?1.5:0.9} fill="rgba(255,255,255,0.85)"
          style={{ animation:`env-twinkle ${2.2+i*0.55}s ${i*0.38}s ease-in-out infinite` }} />
      ))}
      <path d="M710,75 A20,20 0 1,1 710,115 A14,14 0 1,0 710,75 Z" fill="rgba(200,190,255,0.5)" />
      <rect x="582" y="247" width="176" height="8" rx="2" fill="rgba(60,50,90,0.6)" />
      <ellipse cx="680" cy="450" rx="80" ry="25" fill="rgba(50,40,100,0.12)" />

      {/* Guitar silhouette */}
      <g transform="translate(85, 220) rotate(-8)">
        <ellipse cx="0"  cy="100" rx="34" ry="42" fill="rgba(60,30,10,0.55)" />
        <ellipse cx="0"  cy="158" rx="38" ry="48" fill="rgba(60,30,10,0.55)" />
        <rect x="-22" y="125" width="44" height="50" fill="rgba(60,30,10,0.55)" />
        <rect x="-7" y="-80" width="14" height="185" rx="3" fill="rgba(50,25,8,0.65)" />
        <rect x="-12" y="-115" width="24" height="40" rx="4" fill="rgba(50,25,8,0.65)" />
        {[-4,-2,0,2,4,6].map((sx,i)=>(
          <line key={i} x1={sx} y1="200" x2={sx-sx*0.1} y2="-90"
            stroke={`rgba(180,160,120,${0.15 + i*0.02})`} strokeWidth="0.8" />
        ))}
        <circle cx="0" cy="100" r="12" fill="rgba(20,10,5,0.8)" />
      </g>

      {/* Desk */}
      <rect x="490" y="400" width="310" height="18" rx="2" fill="rgba(45,30,65,0.85)" />
      <rect x="500" y="418" width="10" height="55" rx="2" fill="rgba(35,22,52,0.7)" />
      <rect x="785" y="418" width="10" height="55" rx="2" fill="rgba(35,22,52,0.7)" />

      {/* Laptop */}
      <g transform="translate(580, 330) rotate(-5)">
        <rect x="0" y="0" width="100" height="68" rx="4" fill="rgba(8,6,20,0.9)" stroke="rgba(80,160,255,0.3)" strokeWidth="1" />
        <rect x="3" y="3" width="94" height="62" rx="3" fill="rgba(100,160,220,0.08)" />
        {[15,25,35,45].map((y,i)=>(
          <rect key={i} x="10" y={y} width={30+i*8} height="3" rx="1" fill="rgba(255,255,255,0.07)" />
        ))}
        <rect x="-8" y="68" width="116" height="6" rx="2" fill="rgba(30,22,50,0.95)" />
      </g>

      {/* Lamp */}
      <rect x="700" y="355" width="8" height="50" rx="2" fill="rgba(80,60,100,0.7)" />
      <rect x="685" y="400" width="38" height="5" rx="2" fill="rgba(70,50,90,0.7)" />
      <path d="M680,355 L730,355 L720,320 L690,320 Z" fill="rgba(200,160,80,0.35)" stroke="rgba(200,160,80,0.4)" strokeWidth="1" />
      <rect x="0" y="0" width="800" height="600" fill="url(#lamp-glow)"
        style={{ animation:"env-lamp-hum 4.5s ease-in-out infinite" }} />
      <rect x="0" y="0" width="800" height="600" fill="url(#laptop-glow)" />

      {/* Poster */}
      <rect x="330" y="55" width="100" height="135" rx="3" fill="rgba(123,47,190,0.15)" stroke="rgba(123,47,190,0.3)" strokeWidth="1" />
      <rect x="330" y="55" width="100" height="135" rx="3" fill="url(#poster-glow)" />
      <path d="M345,90 Q365,70 385,90 Q405,110 420,90" stroke="rgba(224,64,251,0.4)" strokeWidth="1.5" fill="none" />
      <path d="M345,110 Q365,90 385,110 Q405,130 420,110" stroke="rgba(0,212,240,0.3)" strokeWidth="1" fill="none" />
      <circle cx="380" cy="130" r="10" fill="rgba(224,64,251,0.2)" />
      <circle cx="380" cy="130" r="6"  fill="rgba(224,64,251,0.3)" />
      <circle cx="380" cy="58" r="3" fill="rgba(255,100,100,0.7)" />

      {/* Bookshelf */}
      <rect x="0" y="270" width="62" height="120" rx="0" fill="rgba(30,22,50,0.6)" />
      {[
        {x:4,  w:10, h:80, c:"rgba(224,64,251,0.5)"},
        {x:16, w:8,  h:95, c:"rgba(0,212,240,0.4)"},
        {x:26, w:12, h:70, c:"rgba(255,180,80,0.4)"},
        {x:40, w:9,  h:85, c:"rgba(80,160,255,0.4)"},
        {x:51, w:8,  h:75, c:"rgba(224,64,251,0.3)"},
      ].map((b,i)=>(
        <rect key={i} x={b.x} y={350-b.h} width={b.w} height={b.h} rx="1" fill={b.c} />
      ))}
      <rect x="0" y="350" width="62" height="4" rx="1" fill="rgba(50,35,80,0.8)" />

      <radialGradient id="vignette-r" cx="50%" cy="50%" r="75%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(4,3,12,0.65)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#vignette-r)" />
    </svg>
  )
}

/* ─── 2. HALLWAY ─────────────────────────────────────────────────────────── */
function HallwayEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hall-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a0f20" />
          <stop offset="100%" stopColor="#080c18" />
        </linearGradient>
        <linearGradient id="locker-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a2035" />
          <stop offset="100%" stopColor="#151a2e" />
        </linearGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#hall-bg)" />
      <rect x="0" y="480" width="800" height="120" fill="#0c1120" />
      <line x1="0" y1="480" x2="800" y2="480" stroke="rgba(80,100,180,0.2)" strokeWidth="1.5" />

      {/* Ceiling lights */}
      {[120, 320, 520, 720].map((lx, i) => (
        <g key={i}>
          <rect x={lx-50} y="18" width="100" height="8" rx="3" fill="rgba(200,220,255,0.5)" />
          <rect x={lx-40} y="20" width="80"  height="4" rx="2" fill="rgba(255,255,255,0.9)" />
          <path d={`M${lx-60},26 L${lx+60},26 L${lx+100},480 L${lx-100},480 Z`} fill="rgba(200,220,255,0.03)" />
        </g>
      ))}

      {/* Left lockers */}
      {[0, 56, 112, 168].map((lx, i) => (
        <g key={i}>
          <rect x={lx} y="80" width="54" height="400" rx="1" fill="url(#locker-grad)" stroke="rgba(80,100,180,0.2)" strokeWidth="1" />
          {[140,170,200,230,260].map((ly,j) => (
            <rect key={j} x={lx+8} y={ly} width="38" height="2" rx="1" fill="rgba(0,0,0,0.3)" />
          ))}
          <rect x={lx+22} y={300} width="10" height="18" rx="3" fill="rgba(100,120,180,0.6)" />
          <circle cx={lx+27} cy={350} r="7" fill="rgba(80,100,160,0.5)" />
        </g>
      ))}

      {/* Right lockers */}
      {[578, 634, 690, 746].map((lx, i) => (
        <g key={i}>
          <rect x={lx} y="80" width="54" height="400" rx="1" fill="url(#locker-grad)" stroke="rgba(80,100,180,0.2)" strokeWidth="1" />
          {[140,170,200,230,260].map((ly,j) => (
            <rect key={j} x={lx+8} y={ly} width="38" height="2" rx="1" fill="rgba(0,0,0,0.3)" />
          ))}
          <rect x={lx+22} y={300} width="10" height="18" rx="3" fill="rgba(100,120,180,0.6)" />
          <circle cx={lx+27} cy={350} r="7" fill="rgba(80,100,160,0.5)" />
        </g>
      ))}

      {/* Floor tiles */}
      {[0,80,160,240,320,400,480,560,640,720].map((tx,i) => (
        <line key={i} x1={tx} y1="480" x2={tx} y2="600" stroke="rgba(80,100,180,0.1)" strokeWidth="1" />
      ))}
      {[500, 540, 580].map((ty,i) => (
        <line key={i} x1="220" y1={ty} x2="580" y2={ty} stroke="rgba(80,100,180,0.1)" strokeWidth="1" />
      ))}

      {/* Vanishing point */}
      <radialGradient id="hall-end-light" cx="50%" cy="60%" r="30%">
        <stop offset="0%"   stopColor="rgba(160,180,255,0.15)" />
        <stop offset="100%" stopColor="rgba(100,140,255,0)" />
      </radialGradient>
      <rect x="280" y="150" width="240" height="400" fill="url(#hall-end-light)" />

      {/* Bulletin board */}
      <rect x="230" y="90" width="140" height="90" rx="3" fill="rgba(180,130,80,0.25)" stroke="rgba(180,130,80,0.4)" strokeWidth="1.5" />
      <rect x="237" y="97"  width="55" height="35" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="298" y="97"  width="65" height="35" rx="2" fill="rgba(255,255,255,0.10)" transform="rotate(2,298,97)" />
      <rect x="237" y="138" width="80" height="35" rx="2" fill="rgba(255,255,255,0.09)" transform="rotate(-1,237,138)" />
      <circle cx="244" cy="98"  r="3" fill="rgba(255,80,80,0.8)" />
      <circle cx="362" cy="98"  r="3" fill="rgba(80,160,255,0.8)" />
      <circle cx="244" cy="138" r="3" fill="rgba(255,180,80,0.8)" />
    </svg>
  )
}

/* ─── 3. CLASSROOM ───────────────────────────────────────────────────────── */
function ClassroomEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="class-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0b0a1c" />
          <stop offset="100%" stopColor="#0d0c1e" />
        </linearGradient>
        <radialGradient id="window-light" cx="85%" cy="35%" r="30%">
          <stop offset="0%"   stopColor="rgba(255,200,120,0.18)" />
          <stop offset="100%" stopColor="rgba(255,180,80,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="800" height="600" fill="url(#class-bg)" />
      <rect x="0" y="450" width="800" height="150" fill="#0c0b1a" />
      <line x1="0" y1="450" x2="800" y2="450" stroke="rgba(100,80,160,0.2)" strokeWidth="1.5" />

      {/* Chalkboard */}
      <rect x="30" y="60" width="400" height="240" rx="4" fill="rgba(30,60,40,0.8)" stroke="rgba(60,90,60,0.5)" strokeWidth="2" />
      <rect x="38" y="68" width="384" height="224" rx="2" fill="rgba(25,52,35,0.9)" />
      <text x="52" y="120" fontFamily="serif" fontSize="22" fill="rgba(240,240,220,0.5)" fontStyle="italic">
        Context = Better Output
      </text>
      <path d="M52,140 L330,140" stroke="rgba(240,240,220,0.15)" strokeWidth="1" />
      <text x="52" y="170" fontFamily="sans-serif" fontSize="14" fill="rgba(240,240,220,0.3)">
        Prompt + Context = Precision
      </text>
      {[210,220,230,240,250].map((y,i)=>(
        <line key={i} x1="60" y1={y} x2="400" y2={y} stroke="rgba(240,240,220,0.12)" strokeWidth="1" />
      ))}
      <rect x="30" y="300" width="400" height="10" rx="2" fill="rgba(50,50,30,0.7)" />
      <rect x="50" y="302" width="20" height="6" rx="2" fill="rgba(240,235,220,0.5)" />

      {/* Music stand */}
      <g transform="translate(480, 380)">
        <rect x="-4" y="-160" width="8" height="160" rx="2" fill="rgba(80,70,100,0.7)" />
        <path d="M-45,-160 L45,-160 L40,-120 L-40,-120 Z" fill="rgba(100,85,130,0.6)" stroke="rgba(120,100,150,0.4)" strokeWidth="1" />
        <path d="M-4,0 L-40,25 M-4,0 L4,0 L40,25" stroke="rgba(80,70,100,0.6)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="-36" y="-155" width="72" height="32" rx="1" fill="rgba(240,238,230,0.12)" />
        {[0,8,16].map((dy,i)=>(
          <line key={i} x1="-28" y1={-150+dy} x2="28" y2={-150+dy} stroke="rgba(240,238,230,0.15)" strokeWidth="0.8" />
        ))}
      </g>

      {/* Desks */}
      {[[180,420],[280,420],[380,420],[180,470],[280,470],[380,470]].map(([dx,dy],i)=>(
        <rect key={i} x={dx-40} y={dy} width="70" height="5" rx="1" fill="rgba(40,30,65,0.6)" />
      ))}

      {/* Window */}
      <rect x="650" y="80" width="130" height="200" rx="4" fill="rgba(255,190,100,0.08)" stroke="rgba(120,100,60,0.4)" strokeWidth="2" />
      <rect x="653" y="83" width="124" height="194" rx="2" fill="rgba(255,200,120,0.06)" />
      <line x1="715" y1="83" x2="715" y2="277" stroke="rgba(120,100,60,0.3)" strokeWidth="1.5" />
      <line x1="653" y1="183" x2="777" y2="183" stroke="rgba(120,100,60,0.3)" strokeWidth="1.5" />
      <rect x="640" y="277" width="152" height="10" rx="2" fill="rgba(60,50,80,0.7)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#window-light)" />
    </svg>
  )
}

/* ─── 4. BAND STAGE ──────────────────────────────────────────────────────── */
function BandEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="stage-light-1" cx="25%" cy="0%" r="40%">
          <stop offset="0%"   stopColor="rgba(255,200,80,0.18)" />
          <stop offset="100%" stopColor="rgba(255,150,0,0)" />
        </radialGradient>
        <radialGradient id="stage-light-2" cx="50%" cy="0%" r="35%">
          <stop offset="0%"   stopColor="rgba(200,100,255,0.15)" />
          <stop offset="100%" stopColor="rgba(150,50,255,0)" />
        </radialGradient>
        <radialGradient id="stage-light-3" cx="75%" cy="0%" r="40%">
          <stop offset="0%"   stopColor="rgba(80,180,255,0.18)" />
          <stop offset="100%" stopColor="rgba(0,140,255,0)" />
        </radialGradient>
        <linearGradient id="band-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a0610" />
          <stop offset="100%" stopColor="#100812" />
        </linearGradient>
        <linearGradient id="stage-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a1218" />
          <stop offset="100%" stopColor="#140e16" />
        </linearGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#band-bg)" />
      <rect x="0" y="400" width="800" height="200" fill="url(#stage-floor)" />
      <line x1="0" y1="400" x2="800" y2="400" stroke="rgba(180,100,255,0.2)" strokeWidth="2" />

      {/* Stage light fixtures */}
      {[[200,30],[400,30],[600,30],[130,50],[500,50],[680,50]].map(([fx,fy],i)=>(
        <g key={i}>
          <rect x={fx-16} y={fy-15} width="32" height="20" rx="4" fill="rgba(30,20,40,0.9)" />
          <circle cx={fx} cy={fy+8} r="7" fill={i%3===0?"rgba(255,200,80,0.8)":i%3===1?"rgba(200,80,255,0.8)":"rgba(80,180,255,0.8)"} />
        </g>
      ))}

      {/* Beams — pulsing */}
      <path d="M200,38 L80,400 L320,400 Z"  fill="rgba(255,200,80,0.04)"
        style={{ animation:"env-beam-pulse 3.1s 0s ease-in-out infinite" }} />
      <path d="M400,38 L260,400 L540,400 Z" fill="rgba(200,80,255,0.04)"
        style={{ animation:"env-beam-pulse 3.1s 1s ease-in-out infinite" }} />
      <path d="M600,38 L480,400 L720,400 Z" fill="rgba(80,180,255,0.04)"
        style={{ animation:"env-beam-pulse 3.1s 2s ease-in-out infinite" }} />

      <rect x="0" y="0" width="800" height="600" fill="url(#stage-light-1)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-light-2)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-light-3)" />

      {/* Left amp stack */}
      <rect x="20"  y="340" width="100" height="60" rx="3" fill="rgba(20,15,25,0.9)" stroke="rgba(80,60,100,0.4)" strokeWidth="1.5" />
      <rect x="20"  y="395" width="100" height="60" rx="3" fill="rgba(25,18,32,0.9)" stroke="rgba(80,60,100,0.4)" strokeWidth="1.5" />
      <circle cx="70" cy="368"  r="18" fill="rgba(10,8,15,0.95)" stroke="rgba(80,60,100,0.3)" strokeWidth="1" />
      <circle cx="70" cy="368"  r="12" fill="rgba(15,10,20,0.9)" />
      <circle cx="70" cy="424"  r="22" fill="rgba(10,8,15,0.95)" stroke="rgba(80,60,100,0.3)" strokeWidth="1" />
      <circle cx="70" cy="424"  r="15" fill="rgba(15,10,20,0.9)" />
      {[30,45,60,75,90].map((x,i)=>(
        <circle key={i} cx={x} cy={352} r="3.5" fill="rgba(60,50,80,0.8)" />
      ))}

      {/* Right amp stack */}
      <rect x="680" y="340" width="100" height="60" rx="3" fill="rgba(20,15,25,0.9)" stroke="rgba(80,60,100,0.4)" strokeWidth="1.5" />
      <rect x="680" y="395" width="100" height="60" rx="3" fill="rgba(25,18,32,0.9)" stroke="rgba(80,60,100,0.4)" strokeWidth="1.5" />
      <circle cx="730" cy="368"  r="18" fill="rgba(10,8,15,0.95)" />
      <circle cx="730" cy="368"  r="12" fill="rgba(15,10,20,0.9)" />
      <circle cx="730" cy="424"  r="22" fill="rgba(10,8,15,0.95)" />
      <circle cx="730" cy="424"  r="15" fill="rgba(15,10,20,0.9)" />

      {/* Floor monitors */}
      <path d="M180,400 L280,400 L260,430 L160,430 Z" fill="rgba(20,15,28,0.85)" stroke="rgba(80,60,100,0.3)" strokeWidth="1" />
      <path d="M520,400 L620,400 L640,430 L540,430 Z" fill="rgba(20,15,28,0.85)" stroke="rgba(80,60,100,0.3)" strokeWidth="1" />

      {/* Drum kit hint */}
      <ellipse cx="400" cy="395" rx="60" ry="15" fill="rgba(30,20,40,0.6)" />
      <ellipse cx="350" cy="340" rx="30" ry="6" fill="rgba(60,50,80,0.4)" />
      <ellipse cx="460" cy="320" rx="25" ry="5" fill="rgba(60,50,80,0.4)" />
    </svg>
  )
}

/* ─── 5. PRACTICE ROOM (boss) ────────────────────────────────────────────── */
function PracticeEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="spotlight" cx="50%" cy="10%" r="45%">
          <stop offset="0%"   stopColor="rgba(200,180,255,0.22)" />
          <stop offset="40%"  stopColor="rgba(140,100,255,0.08)" />
          <stop offset="100%" stopColor="rgba(80,40,200,0)" />
        </radialGradient>
        <linearGradient id="practice-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#060408" />
          <stop offset="100%" stopColor="#040306" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="600" fill="url(#practice-bg)" />

      {/* Soundproofing panels */}
      {Array.from({length:12}, (_,col) =>
        Array.from({length:8}, (_,row) => (
          <rect key={`${col}-${row}`}
            x={col*68} y={row*55}
            width="64" height="50"
            rx="6"
            fill={`rgba(20,14,30,${0.3 + (col+row)%2*0.08})`}
            stroke="rgba(40,28,60,0.5)"
            strokeWidth="1"
          />
        ))
      )}

      <rect x="0" y="0" width="800" height="600" fill="url(#spotlight)" />
      <path d="M350,0 L450,0 L560,450 L240,450 Z" fill="rgba(180,160,255,0.03)" />

      <rect x="0" y="450" width="800" height="150" fill="rgba(5,3,10,0.9)" />
      <line x1="0" y1="450" x2="800" y2="450" stroke="rgba(100,60,200,0.15)" strokeWidth="1" />

      {/* Music stand */}
      <g transform="translate(400, 420)">
        <rect x="-5" y="-180" width="10" height="180" rx="2" fill="rgba(60,50,90,0.8)" />
        <path d="M-50,-180 L50,-180 L44,-135 L-44,-135 Z" fill="rgba(80,65,115,0.7)" stroke="rgba(100,80,140,0.5)" strokeWidth="1" />
        <path d="M-5,0 L-50,30 M-5,0 L5,0 L50,30" stroke="rgba(60,50,90,0.7)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <rect x="-40" y="-175" width="80" height="36" rx="2" fill="rgba(240,235,255,0.1)" />
        {[0,9,18].map((dy,i)=>(
          <line key={i} x1="-32" y1={-170+dy} x2="32" y2={-170+dy} stroke="rgba(240,235,255,0.15)" strokeWidth="1" />
        ))}
      </g>

      {/* Clock — 2:14 AM */}
      <g transform="translate(680, 100)">
        <circle cx="0" cy="0" r="38" fill="rgba(12,8,22,0.9)" stroke="rgba(60,50,90,0.5)" strokeWidth="2" />
        <circle cx="0" cy="0" r="33" fill="rgba(8,5,15,0.8)" stroke="rgba(50,40,80,0.3)" strokeWidth="1" />
        {Array.from({length:12},(_,i)=>{
          const ang = (i/12)*Math.PI*2 - Math.PI/2
          const r1=28, r2=30
          return <line key={i} x1={Math.cos(ang)*r1} y1={Math.sin(ang)*r1} x2={Math.cos(ang)*r2} y2={Math.sin(ang)*r2} stroke="rgba(100,80,150,0.5)" strokeWidth="1.5" />
        })}
        <line x1="0" y1="0" x2="15" y2="-12" stroke="rgba(200,180,255,0.8)" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="0" x2="-3"  y2="-22" stroke="rgba(200,180,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="0" r="3" fill="rgba(200,180,255,0.9)" />
        <text x="-8" y="16" fontFamily="Inter" fontSize="7" fill="rgba(200,180,255,0.5)" fontWeight="700">2:14 AM</text>
      </g>

      <radialGradient id="practice-vignette" cx="50%" cy="50%" r="60%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(2,1,6,0.82)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#practice-vignette)" />
    </svg>
  )
}

/* ─── 6. COFFEE SHOP ─────────────────────────────────────────────────────── */
function CoffeeShopEnv({ tod }: { tod: TimeOfDay }) {
  const isMorning  = tod === "morning"
  const warmLight  = isMorning ? 0.22 : 0.14
  const skyTint    = isMorning ? "#1a1a2e" : "#0d0f1a"

  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cafe-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#150f0a" />
          <stop offset="100%" stopColor="#1a1208" />
        </linearGradient>
        <linearGradient id="cafe-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1c1408" />
          <stop offset="100%" stopColor="#140e04" />
        </linearGradient>
        <radialGradient id="pendant-1" cx="25%" cy="15%" r="20%">
          <stop offset="0%"   stopColor={`rgba(255,200,100,${warmLight})`} />
          <stop offset="100%" stopColor="rgba(255,160,60,0)" />
        </radialGradient>
        <radialGradient id="pendant-2" cx="55%" cy="15%" r="20%">
          <stop offset="0%"   stopColor={`rgba(255,200,100,${warmLight})`} />
          <stop offset="100%" stopColor="rgba(255,160,60,0)" />
        </radialGradient>
        <radialGradient id="pendant-3" cx="80%" cy="15%" r="18%">
          <stop offset="0%"   stopColor={`rgba(255,200,100,${warmLight * 0.7})`} />
          <stop offset="100%" stopColor="rgba(255,160,60,0)" />
        </radialGradient>
        <linearGradient id="window-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={skyTint} />
          <stop offset="100%" stopColor="#0a0c18" />
        </linearGradient>
      </defs>

      {/* Wall + floor */}
      <rect x="0" y="0"   width="800" height="600" fill="url(#cafe-wall)" />
      <rect x="0" y="440" width="800" height="160" fill="url(#cafe-floor)" />
      <line x1="0" y1="440" x2="800" y2="440" stroke="rgba(100,70,30,0.25)" strokeWidth="2" />

      {/* Brick wall texture */}
      {Array.from({length:9},(_,row) =>
        Array.from({length:14},(_,col) => {
          const offset = row%2===0 ? 0 : 32
          return <rect key={`${row}-${col}`}
            x={col*60+offset-5} y={row*38}
            width="56" height="34"
            rx="2"
            fill="none"
            stroke={`rgba(80,50,25,${0.12+(row+col)%2*0.05})`}
            strokeWidth="1"
          />
        })
      )}

      {/* Large windows — left side */}
      <rect x="40"  y="80" width="200" height="300" rx="6" fill="rgba(10,12,22,0.5)" stroke="rgba(80,55,30,0.5)" strokeWidth="2.5" />
      <rect x="43"  y="83" width="194" height="294" rx="4" fill="url(#window-sky)" />
      {/* Window mullions */}
      <line x1="140" y1="83" x2="140" y2="377" stroke="rgba(80,55,30,0.5)" strokeWidth="2" />
      <line x1="43"  y1="230" x2="237" y2="230" stroke="rgba(80,55,30,0.5)" strokeWidth="2" />
      {/* Street scene silhouette */}
      <rect x="50"  y="310" width="30"  height="60" rx="2" fill="rgba(5,5,10,0.6)" />
      <rect x="90"  y="290" width="45"  height="80" rx="2" fill="rgba(5,5,10,0.6)" />
      <rect x="148" y="300" width="35"  height="70" rx="2" fill="rgba(5,5,10,0.6)" />
      <rect x="192" y="320" width="28"  height="50" rx="2" fill="rgba(5,5,10,0.6)" />
      {/* Street lamp */}
      <rect x="170" y="260" width="4" height="80" fill="rgba(80,70,60,0.4)" />
      <circle cx="172" cy="258" r="8" fill="rgba(255,220,150,0.25)" />
      {/* Window sill */}
      <rect x="32"  y="375" width="216" height="10" rx="3" fill="rgba(80,55,30,0.7)" />

      {/* Pendant lights */}
      <line x1="200" y1="0" x2="200" y2="55" stroke="rgba(60,40,20,0.6)" strokeWidth="2" />
      <ellipse cx="200" cy="65" rx="16" ry="24" fill="rgba(40,28,15,0.9)" stroke="rgba(80,55,30,0.5)" strokeWidth="1" />
      <ellipse cx="200" cy="58" rx="8"  ry="5"  fill="rgba(255,210,120,0.7)" />

      <line x1="460" y1="0" x2="460" y2="45" stroke="rgba(60,40,20,0.6)" strokeWidth="2" />
      <ellipse cx="460" cy="55" rx="16" ry="24" fill="rgba(40,28,15,0.9)" stroke="rgba(80,55,30,0.5)" strokeWidth="1" />
      <ellipse cx="460" cy="48" rx="8"  ry="5"  fill="rgba(255,210,120,0.7)" />

      <line x1="660" y1="0" x2="660" y2="50" stroke="rgba(60,40,20,0.6)" strokeWidth="2" />
      <ellipse cx="660" cy="60" rx="14" ry="20" fill="rgba(40,28,15,0.9)" stroke="rgba(80,55,30,0.5)" strokeWidth="1" />
      <ellipse cx="660" cy="54" rx="7"  ry="4"  fill="rgba(255,210,120,0.7)" />

      {/* Warm pendant glow overlays */}
      <rect x="0" y="0" width="800" height="600" fill="url(#pendant-1)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#pendant-2)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#pendant-3)" />

      {/* Chalkboard menu */}
      <rect x="560" y="60" width="200" height="280" rx="4" fill="rgba(20,30,20,0.85)" stroke="rgba(50,70,40,0.5)" strokeWidth="2" />
      <rect x="568" y="68" width="184" height="264" rx="2" fill="rgba(15,25,15,0.9)" />
      <text x="582" y="110" fontFamily="serif" fontSize="16" fill="rgba(240,235,220,0.55)" fontStyle="italic">Today&apos;s Menu</text>
      <path d="M575,118 L742,118" stroke="rgba(240,235,220,0.2)" strokeWidth="1" />
      {["Flat White", "Cortado", "Cold Brew", "Pour Over"].map((item,i)=>(
        <text key={i} x="582" y={140+i*32} fontFamily="sans-serif" fontSize="12" fill="rgba(240,235,220,0.35)">
          {item}
        </text>
      ))}
      {/* Chalk dots decoration */}
      {[620,680,720].map((cx,i)=>(
        <circle key={i} cx={cx} cy="300" r="2.5" fill="rgba(240,235,220,0.25)" />
      ))}

      {/* Table surfaces */}
      {[[160,460,200,14],[380,450,180,12],[580,455,160,12]].map(([tx,ty,tw,th],i)=>(
        <rect key={i} x={tx} y={ty} width={tw} height={th} rx="4" fill="rgba(50,32,12,0.8)" stroke="rgba(80,55,30,0.3)" strokeWidth="1" />
      ))}

      {/* Coffee cups */}
      <g transform="translate(230,448)">
        <ellipse cx="0" cy="0" rx="14" ry="5" fill="rgba(30,18,8,0.9)" />
        <rect x="-10" y="-18" width="20" height="18" rx="3" fill="rgba(30,18,8,0.9)" stroke="rgba(60,40,20,0.5)" strokeWidth="1" />
        <ellipse cx="0" cy="-18" rx="10" ry="4" fill="rgba(60,35,15,0.6)" />
        {/* Steam — animated rising */}
        <path d="M-4,-22 Q-2,-30 -5,-36" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"
          style={{ animation:"env-steam 2.4s 0s ease-out infinite" }} />
        <path d="M0,-22 Q2,-32 -1,-38"   stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"
          style={{ animation:"env-steam 2.4s 0.7s ease-out infinite" }} />
        <path d="M4,-22 Q5,-30 3,-36"    stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"
          style={{ animation:"env-steam 2.4s 1.3s ease-out infinite" }} />
      </g>

      {/* Laptop on table */}
      <g transform="translate(400, 435)">
        <rect x="-45" y="-35" width="90" height="55" rx="4" fill="rgba(8,6,14,0.9)" stroke="rgba(60,40,140,0.3)" strokeWidth="1" />
        <rect x="-40" y="-30" width="80" height="44" rx="2" fill="rgba(80,100,180,0.07)" />
        <rect x="-50" y="20"  width="100" height="5" rx="2" fill="rgba(25,18,40,0.9)" />
      </g>

      {/* Floor wood grain */}
      {[460,480,500,520,540,560,580].map((ty,i)=>(
        <line key={i} x1="0" y1={ty} x2="800" y2={ty} stroke="rgba(80,55,25,0.08)" strokeWidth="1" />
      ))}

      {/* Vignette */}
      <radialGradient id="cafe-vignette" cx="50%" cy="50%" r="75%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(6,4,2,0.7)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#cafe-vignette)" />
    </svg>
  )
}

/* ─── 7. HOME OFFICE ─────────────────────────────────────────────────────── */
function HomeOfficeEnv({ tod }: { tod: TimeOfDay }) {
  const isDay = tod === "morning" || tod === "afternoon"

  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="home-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0e0c1e" />
          <stop offset="100%" stopColor="#0c0a1a" />
        </linearGradient>
        <linearGradient id="home-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#131025" />
          <stop offset="100%" stopColor="#0f0d1e" />
        </linearGradient>
        <radialGradient id="monitor-glow" cx="55%" cy="45%" r="25%">
          <stop offset="0%"   stopColor="rgba(80,140,255,0.18)" />
          <stop offset="100%" stopColor="rgba(60,100,255,0)" />
        </radialGradient>
        <radialGradient id="window-day" cx="15%" cy="30%" r="22%">
          <stop offset="0%"   stopColor={isDay ? "rgba(255,220,160,0.16)" : "rgba(80,100,160,0.08)"} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#home-wall)" />
      <rect x="0" y="440" width="800" height="160" fill="url(#home-floor)" />
      <line x1="0" y1="440" x2="800" y2="440" stroke="rgba(80,65,130,0.18)" strokeWidth="1.5" />

      {/* Window — left */}
      <rect x="40" y="60" width="180" height="240" rx="6" fill="rgba(8,8,18,0.6)" stroke="rgba(80,70,120,0.4)" strokeWidth="2" />
      {isDay ? (
        <>
          <rect x="43" y="63" width="174" height="234" rx="4" fill="rgba(160,180,220,0.12)" />
          {/* Daylight */}
          <rect x="43" y="63" width="174" height="234" rx="4" fill="rgba(200,220,255,0.06)" />
          {/* Tree silhouette */}
          <path d="M100,260 L90,200 Q90,150 130,140 Q170,130 170,180 L165,260 Z" fill="rgba(5,10,5,0.5)" />
          <circle cx="130" cy="130" r="40" fill="rgba(5,15,5,0.45)" />
        </>
      ) : (
        <>
          <rect x="43" y="63" width="174" height="234" rx="4" fill="rgba(5,8,20,0.8)" />
          {[[68,90],[120,75],[175,95],[80,160],[150,140]].map(([sx,sy],i)=>(
            <circle key={i} cx={sx} cy={sy} r={i%2===0?1.5:0.8} fill="rgba(255,255,255,0.8)" />
          ))}
          <path d="M185,90 A22,22 0 1,1 185,134 A15,15 0 1,0 185,90Z" fill="rgba(200,195,255,0.4)" />
        </>
      )}
      {/* Window frame cross */}
      <line x1="130" y1="63" x2="130" y2="297" stroke="rgba(80,70,120,0.4)" strokeWidth="2" />
      <line x1="43"  y1="180" x2="217" y2="180" stroke="rgba(80,70,120,0.4)" strokeWidth="2" />
      <rect x="32"   y="297" width="198" height="10" rx="3" fill="rgba(50,40,80,0.7)" />
      {/* Day light glow */}
      <rect x="0" y="0" width="800" height="600" fill="url(#window-day)" />

      {/* Desk — large L-shaped */}
      <rect x="240" y="420" width="560" height="20" rx="3" fill="rgba(40,28,60,0.9)" stroke="rgba(60,45,90,0.4)" strokeWidth="1" />
      {/* Desk legs */}
      <rect x="250" y="440" width="12" height="80" rx="2" fill="rgba(30,20,48,0.8)" />
      <rect x="785" y="440" width="12" height="80" rx="2" fill="rgba(30,20,48,0.8)" />

      {/* Monitor */}
      <g transform="translate(450,350)">
        <rect x="-110" y="-170" width="220" height="145" rx="6" fill="rgba(6,5,14,0.95)" stroke="rgba(60,90,200,0.3)" strokeWidth="1.5" />
        <rect x="-104" y="-164" width="208" height="133" rx="4" fill="rgba(70,110,200,0.09)" />
        {/* Screen content — code-like lines */}
        {[0,15,30,45,60,75].map((dy,i)=>(
          <rect key={i} x={-95} y={-155+dy} width={50+i*20-(i>3?30:0)} height="8" rx="2" fill={i%4===0?"rgba(0,212,240,0.15)":i%4===1?"rgba(224,64,251,0.12)":"rgba(255,255,255,0.07)"} />
        ))}
        {/* Monitor stand */}
        <rect x="-8"  y="-24" width="16" height="30" rx="2" fill="rgba(30,22,48,0.9)" />
        <rect x="-30" y="6"   width="60" height="8"  rx="3" fill="rgba(25,18,40,0.95)" />
        {/* Monitor glow */}
        <rect x="0" y="0" width="800" height="600" fill="url(#monitor-glow)" style={{display:"none"}} />
      </g>
      <rect x="0" y="0" width="800" height="600" fill="url(#monitor-glow)" />

      {/* Keyboard */}
      <rect x="360" y="408" width="180" height="12" rx="3" fill="rgba(20,15,35,0.85)" stroke="rgba(50,40,75,0.4)" strokeWidth="1" />
      {/* Mouse */}
      <rect x="558" y="406" width="32" height="16" rx="8" fill="rgba(20,15,35,0.85)" stroke="rgba(50,40,75,0.4)" strokeWidth="1" />

      {/* Second monitor (side) */}
      <g transform="translate(680,355)">
        <rect x="-80" y="-160" width="160" height="110" rx="5" fill="rgba(6,5,14,0.9)" stroke="rgba(60,80,180,0.25)" strokeWidth="1" />
        <rect x="-74" y="-154" width="148" height="98"  rx="3" fill="rgba(60,90,180,0.07)" />
        {[0,14,28,42].map((dy,i)=>(
          <rect key={i} x={-65} y={-146+dy} width={60+i*15} height="7" rx="2" fill="rgba(255,255,255,0.06)" />
        ))}
        <rect x="-6"  y="-48" width="12" height="22" rx="2" fill="rgba(30,22,48,0.9)" />
        <rect x="-22" y="-26" width="44" height="7"  rx="3" fill="rgba(25,18,40,0.95)" />
      </g>

      {/* Bookshelf — right wall */}
      <rect x="680" y="80" width="120" height="300" rx="2" fill="rgba(28,20,44,0.7)" />
      {/* Shelf boards */}
      {[160, 230, 300].map((sy,i)=>(
        <rect key={i} x="680" y={sy} width="120" height="6" rx="1" fill="rgba(40,30,60,0.8)" />
      ))}
      {/* Books */}
      {[
        {x:686,w:12,h:70,c:"rgba(224,64,251,0.5)",shelf:0},
        {x:700,w:9, h:55,c:"rgba(0,212,240,0.4)", shelf:0},
        {x:711,w:14,h:65,c:"rgba(255,180,80,0.45)",shelf:0},
        {x:727,w:10,h:60,c:"rgba(80,200,120,0.4)", shelf:0},
        {x:739,w:11,h:68,c:"rgba(224,64,251,0.35)",shelf:0},
        {x:686,w:11,h:60,c:"rgba(0,212,240,0.45)", shelf:1},
        {x:699,w:13,h:52,c:"rgba(255,100,150,0.4)",shelf:1},
        {x:714,w:9, h:65,c:"rgba(80,160,255,0.4)", shelf:1},
        {x:686,w:12,h:58,c:"rgba(255,200,80,0.4)", shelf:2},
        {x:700,w:10,h:50,c:"rgba(0,212,240,0.35)", shelf:2},
      ].map((b,i)=>{
        const shelfY = [160, 230, 300][b.shelf]
        return <rect key={i} x={b.x} y={shelfY-b.h} width={b.w} height={b.h} rx="1" fill={b.c} />
      })}

      {/* Plant — desk corner */}
      <g transform="translate(800, 415)">
        <rect x="-30" y="-18" width="30" height="18" rx="3" fill="rgba(30,50,30,0.8)" stroke="rgba(40,70,40,0.5)" strokeWidth="1" />
        <path d="M-15,-18 Q-30,-50 -50,-60 Q-20,-45 -15,-18 Z" fill="rgba(20,80,30,0.5)" />
        <path d="M-15,-18 Q-5,-55 20,-65 Q5,-40 -15,-18 Z" fill="rgba(20,80,30,0.45)" />
        <path d="M-15,-18 Q-20,-45 -40,-40 Q-18,-30 -15,-18 Z" fill="rgba(20,80,30,0.4)" />
      </g>

      {/* Coffee mug on desk */}
      <g transform="translate(320,415)">
        <ellipse cx="0" cy="0" rx="14" ry="5" fill="rgba(25,16,8,0.9)" />
        <rect x="-10" y="-20" width="20" height="20" rx="3" fill="rgba(25,16,8,0.9)" stroke="rgba(60,40,20,0.5)" strokeWidth="1" />
        <path d="M10,-14 Q20,-14 20,-8 Q20,-2 10,-2" stroke="rgba(60,40,20,0.6)" strokeWidth="2" fill="none" />
      </g>

      {/* Vignette */}
      <radialGradient id="home-vignette" cx="50%" cy="50%" r="75%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(5,4,12,0.65)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#home-vignette)" />
    </svg>
  )
}

/* ─── 8. OFFICE / BOARDROOM / CONFERENCE ROOM ───────────────────────────── */
function OfficeEnv({ tod }: { tod: TimeOfDay }) {
  const isEvening = tod === "evening" || tod === "night"

  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="office-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#080c18" />
          <stop offset="100%" stopColor="#0a0e1c" />
        </linearGradient>
        <linearGradient id="office-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0e1020" />
          <stop offset="100%" stopColor="#0c0e1c" />
        </linearGradient>
        <radialGradient id="ceiling-light-1" cx="25%" cy="0%" r="30%">
          <stop offset="0%"   stopColor="rgba(200,220,255,0.18)" />
          <stop offset="100%" stopColor="rgba(180,200,255,0)" />
        </radialGradient>
        <radialGradient id="ceiling-light-2" cx="75%" cy="0%" r="30%">
          <stop offset="0%"   stopColor="rgba(200,220,255,0.18)" />
          <stop offset="100%" stopColor="rgba(180,200,255,0)" />
        </radialGradient>
        <linearGradient id="city-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={isEvening ? "#02050e" : "#060d1a"} />
          <stop offset="100%" stopColor="#0a0c18" />
        </linearGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#office-wall)" />
      <rect x="0" y="450" width="800" height="150" fill="url(#office-floor)" />
      <line x1="0" y1="450" x2="800" y2="450" stroke="rgba(60,80,160,0.15)" strokeWidth="2" />

      {/* Floor-to-ceiling glass windows — panoramic city view */}
      <rect x="0"   y="0"   width="260" height="450" fill="rgba(5,8,18,0.4)" stroke="rgba(60,80,140,0.2)" strokeWidth="1" />
      <rect x="268" y="0"   width="264" height="450" fill="rgba(5,8,18,0.4)" stroke="rgba(60,80,140,0.2)" strokeWidth="1" />
      <rect x="540" y="0"   width="260" height="450" fill="rgba(5,8,18,0.4)" stroke="rgba(60,80,140,0.2)" strokeWidth="1" />

      {/* Sky */}
      {[0,268,540].map((wx,i)=>(
        <rect key={i} x={wx+2} y="2" width={i===1?260:256} height="446" fill="url(#city-sky)" />
      ))}

      {/* City skyline silhouette */}
      {[
        [10,350,30,100],[50,320,25,130],[82,340,35,110],[125,300,40,150],[170,330,30,120],
        [210,310,25,140],[290,280,45,170],[345,320,30,130],[390,295,35,155],[430,315,28,135],
        [560,290,40,160],[610,320,32,130],[650,300,38,150],[695,335,28,115],[730,305,35,145],
        [770,320,25,130],
      ].map(([bx,by,bw,bh],i)=>(
        <rect key={i} x={bx} y={by} width={bw} height={bh} rx="1" fill={`rgba(5,8,20,${0.5+i%3*0.12})`} />
      ))}

      {/* Building lights in skyline */}
      {isEvening && [
        [22,370,4,4],[65,340,4,4],[100,360,4,4],[140,330,4,4],[305,310,4,4],[360,340,4,4],
        [575,310,4,4],[625,340,4,4],[665,320,4,4],[710,355,4,4],
      ].map(([lx,ly,lw,lh],i)=>(
        <rect key={i} x={lx} y={ly} width={lw} height={lh} fill="rgba(255,220,100,0.6)"
          style={{ animation:`env-city-blink ${2.5+i*0.4}s ${i*0.22}s ease-in-out infinite` }} />
      ))}

      {/* Ceiling light panels */}
      {[160, 480].map((lx,i)=>(
        <g key={i}>
          <rect x={lx-80} y="8"  width="160" height="12" rx="3" fill="rgba(180,200,255,0.4)" />
          <rect x={lx-72} y="10" width="144" height="8"  rx="2" fill="rgba(255,255,255,0.85)" />
        </g>
      ))}
      <rect x="0" y="0" width="800" height="600" fill="url(#ceiling-light-1)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#ceiling-light-2)" />

      {/* Conference table */}
      <ellipse cx="400" cy="500" rx="300" ry="60" fill="rgba(20,16,36,0.9)" stroke="rgba(60,80,150,0.3)" strokeWidth="1.5" />
      {/* Table surface sheen */}
      <ellipse cx="400" cy="490" rx="280" ry="40" fill="rgba(40,50,100,0.12)" />
      {/* Table reflection strip */}
      <ellipse cx="400" cy="492" rx="150" ry="15" fill="rgba(180,200,255,0.05)" />

      {/* Chairs around table */}
      {[150,250,350,450,550,650].map((cx,i)=>(
        <ellipse key={i} cx={cx} cy={i%2===0?470:530} rx="28" ry="12" fill="rgba(15,12,28,0.8)" stroke="rgba(50,65,120,0.3)" strokeWidth="1" />
      ))}

      {/* Laptops on table */}
      {[220,400,580].map((lx,i)=>(
        <g key={i} transform={`translate(${lx},470)`}>
          <rect x="-35" y="-28" width="70" height="45" rx="4" fill="rgba(6,5,15,0.9)" stroke="rgba(50,80,180,0.25)" strokeWidth="1" />
          <rect x="-30" y="-23" width="60" height="35" rx="2" fill={`rgba(${i===1?'80,120,200':'60,90,160'},0.08)`} />
          <rect x="-40" y="17"  width="80" height="4"  rx="2" fill="rgba(20,16,35,0.9)" />
        </g>
      ))}

      {/* Whiteboard — back wall */}
      <rect x="580" y="80" width="200" height="130" rx="4" fill="rgba(240,240,255,0.06)" stroke="rgba(80,100,180,0.3)" strokeWidth="1.5" />
      {[110,125,140,155].map((y,i)=>(
        <line key={i} x1="598" y1={y} x2={640+i*12} y2={y} stroke="rgba(240,240,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      {/* Marker box */}
      <rect x="580" y="206" width="200" height="8" rx="2" fill="rgba(50,60,100,0.5)" />

      {/* Floor tiles */}
      {[460,480,500,520,540].map((ty,i)=>(
        <line key={i} x1="0" y1={ty} x2="800" y2={ty} stroke="rgba(60,80,160,0.06)" strokeWidth="1" />
      ))}
      {[0,100,200,300,400,500,600,700,800].map((tx,i)=>(
        <line key={i} x1={tx} y1="450" x2={tx} y2="600" stroke="rgba(60,80,160,0.06)" strokeWidth="1" />
      ))}

      {/* Vignette */}
      <radialGradient id="office-vignette" cx="50%" cy="50%" r="75%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(3,5,14,0.7)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#office-vignette)" />
    </svg>
  )
}

/* ─── 9. CONCERT STAGE / BACKSTAGE ──────────────────────────────────────── */
function StageEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="stage-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#040208" />
          <stop offset="100%" stopColor="#06040c" />
        </linearGradient>
        <radialGradient id="stage-spot-c" cx="50%" cy="5%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,240,200,0.25)" />
          <stop offset="40%"  stopColor="rgba(255,220,150,0.08)" />
          <stop offset="100%" stopColor="rgba(255,200,100,0)" />
        </radialGradient>
        <radialGradient id="stage-spot-l" cx="20%" cy="5%" r="35%">
          <stop offset="0%"   stopColor="rgba(200,100,255,0.2)" />
          <stop offset="100%" stopColor="rgba(150,50,255,0)" />
        </radialGradient>
        <radialGradient id="stage-spot-r" cx="80%" cy="5%" r="35%">
          <stop offset="0%"   stopColor="rgba(80,200,255,0.18)" />
          <stop offset="100%" stopColor="rgba(0,150,255,0)" />
        </radialGradient>
        <linearGradient id="curtain-l" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%"   stopColor="rgba(60,10,10,0.9)" />
          <stop offset="100%" stopColor="rgba(40,5,5,0.97)" />
        </linearGradient>
        <linearGradient id="curtain-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(60,10,10,0.9)" />
          <stop offset="100%" stopColor="rgba(40,5,5,0.97)" />
        </linearGradient>
        <linearGradient id="stage-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e1408" />
          <stop offset="100%" stopColor="#170f05" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="600" fill="url(#stage-bg)" />

      {/* Backstage ceiling rigging */}
      {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map((x,i)=>(
        <line key={i} x1={x} y1="0" x2={x} y2={30+i%3*10} stroke="rgba(30,20,50,0.4)" strokeWidth="1" />
      ))}
      {/* Truss bar */}
      <rect x="0" y="28" width="800" height="8" rx="2" fill="rgba(20,15,35,0.8)" />

      {/* Stage lighting rigs */}
      {[[160,36],[280,36],[400,36],[520,36],[640,36]].map(([fx,fy],i)=>(
        <g key={i}>
          <rect x={fx-12} y={fy} width="24" height="16" rx="3" fill="rgba(20,14,30,0.95)" />
          <circle cx={fx} cy={fy+20} r="8"
            fill={i%5===0?"rgba(255,220,100,0.85)":i%5===1?"rgba(200,80,255,0.85)":i%5===2?"rgba(80,200,255,0.85)":i%5===3?"rgba(255,80,80,0.85)":"rgba(80,255,160,0.85)"}
            style={{ animation:`env-light-col ${3+i*0.6}s ${i*0.5}s ease-in-out infinite` }} />
          {/* Beam */}
          <path d={`M${fx-40},${fy+28} L${fx+40},${fy+28} L${fx+80},500 L${fx-80},500 Z`}
            fill={`rgba(${i%5===0?'255,220,100':i%5===1?'200,80,255':i%5===2?'80,200,255':i%5===3?'255,80,80':'80,255,160'},0.03)`}
            style={{ animation:`env-beam-pulse ${3+i*0.6}s ${i*0.5}s ease-in-out infinite` }} />
        </g>
      ))}

      {/* Spotlight overlays */}
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-spot-c)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-spot-l)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-spot-r)" />

      {/* Left curtain */}
      <path d="M0,0 Q80,80 60,200 Q40,350 80,500 L0,500 Z" fill="url(#curtain-l)" />
      {/* Curtain folds */}
      {[40,55,70].map((cx,i)=>(
        <path key={i} d={`M${cx-10},0 Q${cx+10},100 ${cx-8},250 Q${cx+8},380 ${cx-5},500`}
          stroke="rgba(20,3,3,0.4)" strokeWidth="2" fill="none" />
      ))}

      {/* Right curtain */}
      <path d="M800,0 Q720,80 740,200 Q760,350 720,500 L800,500 Z" fill="url(#curtain-r)" />
      {[730,745,760].map((cx,i)=>(
        <path key={i} d={`M${cx+10},0 Q${cx-10},100 ${cx+8},250 Q${cx-8},380 ${cx+5},500`}
          stroke="rgba(20,3,3,0.4)" strokeWidth="2" fill="none" />
      ))}

      {/* Stage floor */}
      <rect x="60" y="400" width="680" height="200" fill="url(#stage-wood)" />
      <line x1="60" y1="400" x2="740" y2="400" stroke="rgba(255,200,100,0.12)" strokeWidth="2" />
      {/* Stage planks */}
      {[420,440,460,480,500,520,540,560,580].map((ty,i)=>(
        <line key={i} x1="60" y1={ty} x2="740" y2={ty} stroke="rgba(80,55,25,0.15)" strokeWidth="1" />
      ))}

      {/* Audience seats — dark silhouette rows */}
      {[520,555,590].map((sy,row)=>(
        Array.from({length:24},(_,col)=>(
          <rect key={col} x={col*32+8} y={sy} width="26" height="30" rx="4" fill="rgba(8,6,15,0.7)" />
        ))
      ))}

      {/* Microphone stand — center stage */}
      <g transform="translate(400, 400)">
        <rect x="-4" y="-120" width="8" height="120" rx="2" fill="rgba(40,32,55,0.8)" />
        <path d="M-4,0 L-30,20 M4,0 L30,20" stroke="rgba(40,32,55,0.7)" strokeWidth="4" strokeLinecap="round" fill="none" />
        <rect x="-10" y="-130" width="20" height="28" rx="10" fill="rgba(30,24,44,0.9)" stroke="rgba(80,60,120,0.4)" strokeWidth="1" />
        {/* Mic head dot pattern */}
        {[-4,-2,0,2,4].map((dx,i)=>(
          <circle key={i} cx={dx} cy={-115} r="1.2" fill="rgba(100,80,140,0.5)" />
        ))}
      </g>

      {/* Haze/smoke on stage floor */}
      <radialGradient id="stage-haze" cx="50%" cy="100%" r="60%">
        <stop offset="0%"   stopColor="rgba(180,160,255,0.08)" />
        <stop offset="100%" stopColor="rgba(100,80,200,0)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-haze)" />

      {/* Vignette */}
      <radialGradient id="stage-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(2,1,5,0.8)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#stage-vignette)" />
    </svg>
  )
}

/* ─── 10. LIBRARY ────────────────────────────────────────────────────────── */
function LibraryEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lib-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#100e1c" />
          <stop offset="100%" stopColor="#0e0c1a" />
        </linearGradient>
        <linearGradient id="lib-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#141020" />
          <stop offset="100%" stopColor="#100e1c" />
        </linearGradient>
        <radialGradient id="desk-lamp-lib" cx="60%" cy="70%" r="30%">
          <stop offset="0%"   stopColor="rgba(255,200,100,0.16)" />
          <stop offset="100%" stopColor="rgba(255,180,60,0)" />
        </radialGradient>
        <linearGradient id="shelf-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#1a1230" />
          <stop offset="100%" stopColor="#150e28" />
        </linearGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#lib-wall)" />
      <rect x="0" y="450" width="800" height="150" fill="url(#lib-floor)" />
      <line x1="0" y1="450" x2="800" y2="450" stroke="rgba(80,65,120,0.15)" strokeWidth="1.5" />

      {/* Back wall bookshelf — floor to ceiling */}
      <rect x="0" y="0" width="800" height="450" fill="rgba(14,10,24,0.3)" />

      {/* Tall bookshelf units */}
      {[0, 200, 400, 600].map((sx,shelf)=>(
        <g key={shelf}>
          {/* Shelf frame */}
          <rect x={sx} y="10" width="196" height="440" rx="2" fill="url(#shelf-wood)" stroke="rgba(50,35,80,0.4)" strokeWidth="1" />
          {/* Shelf boards */}
          {[90, 170, 250, 330, 410].map((sy,board)=>(
            <rect key={board} x={sx} y={sy} width="196" height="6" rx="1" fill="rgba(30,22,50,0.9)" />
          ))}
          {/* Books on each shelf */}
          {[90, 170, 250, 330, 410].map((sy,board)=>{
            const books = [
              {w:14,h:68,c:`rgba(${224+shelf*5},${64+board*8},${251-board*10},0.55)`},
              {w:11,h:58,c:`rgba(${0+board*20},${212-board*15},${240-shelf*20},0.5)`},
              {w:16,h:72,c:`rgba(${255-board*10},${180-shelf*15},${80+board*5},0.48)`},
              {w:12,h:65,c:`rgba(${80+board*20},${160+shelf*10},${255-board*15},0.5)`},
              {w:10,h:60,c:`rgba(${224-shelf*10},${64+shelf*15},${251-board*20},0.45)`},
              {w:13,h:70,c:`rgba(${0+shelf*20},${200-board*10},${120+board*15},0.5)`},
              {w:9, h:55,c:`rgba(${255-board*20},${100+shelf*10},${150-board*5},0.45)`},
              {w:15,h:68,c:`rgba(${80+shelf*15},${255-board*20},${200-shelf*15},0.5)`},
              {w:11,h:62,c:`rgba(${200-shelf*10},${80+board*15},${255-board*10},0.48)`},
              {w:12,h:58,c:`rgba(${255-board*15},${200+shelf*5},${80+board*10},0.45)`},
            ]
            let xPos = sx + 5
            return books.map((b,bi)=>{
              const el = <rect key={bi} x={xPos} y={sy-b.h} width={b.w} height={b.h} rx="1" fill={b.c} />
              xPos += b.w + 2
              if (xPos > sx + 186) return null
              return el
            })
          })}
        </g>
      ))}

      {/* Ceiling lights (warm library lamps) */}
      {[150, 400, 650].map((lx,i)=>(
        <g key={i}>
          <rect x={lx-40} y="0" width="80" height="10" rx="3" fill="rgba(200,180,100,0.3)" />
          <rect x={lx-32} y="2" width="64" height="6"  rx="2" fill="rgba(255,230,150,0.7)" />
          {/* Warm cone */}
          <path d={`M${lx-80},10 L${lx+80},10 L${lx+110},450 L${lx-110},450 Z`} fill="rgba(255,210,120,0.02)" />
        </g>
      ))}

      {/* Reading table */}
      <rect x="200" y="415" width="400" height="16" rx="4" fill="rgba(35,24,55,0.9)" stroke="rgba(55,40,85,0.4)" strokeWidth="1" />
      <rect x="215" y="431" width="14" height="90" rx="2" fill="rgba(25,16,40,0.8)" />
      <rect x="571" y="431" width="14" height="90" rx="2" fill="rgba(25,16,40,0.8)" />

      {/* Desk lamp */}
      <g transform="translate(430, 412)">
        <rect x="-4" y="-60" width="8" height="60" rx="2" fill="rgba(60,50,80,0.7)" />
        <path d="M-4,-60 L-35,-80 L-35,-68 L-4,-50 Z" fill="rgba(200,160,60,0.4)" stroke="rgba(200,160,60,0.5)" strokeWidth="1" />
        <ellipse cx="-20" cy="-76" rx="10" ry="4" fill="rgba(255,220,120,0.6)" />
        <rect x="-20" y="-4" width="40" height="5" rx="2" fill="rgba(50,38,68,0.8)" />
      </g>

      {/* Books on table */}
      {[240,260,278].map((bx,i)=>(
        <g key={i} transform={`translate(${bx},405)`} style={{transform:`rotate(${i===1?-5:i===2?8:0}deg)`}}>
          <rect x="0" y="-55" width="16" height="55" rx="2"
            fill={i===0?"rgba(0,212,240,0.4)":i===1?"rgba(224,64,251,0.4)":"rgba(255,180,80,0.35)"} />
        </g>
      ))}

      {/* Desk lamp glow overlay */}
      <rect x="0" y="0" width="800" height="600" fill="url(#desk-lamp-lib)" />

      {/* Study notes / papers */}
      <rect x="320" y="400" width="80" height="14" rx="2" fill="rgba(240,238,230,0.08)" transform="rotate(-3,320,400)" />
      <rect x="420" y="402" width="60" height="12" rx="2" fill="rgba(240,238,230,0.06)" transform="rotate(2,420,402)" />

      {/* Vignette */}
      <radialGradient id="lib-vignette" cx="50%" cy="50%" r="75%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(4,3,10,0.72)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#lib-vignette)" />
    </svg>
  )
}

/* ─── 11. COMPUTER LAB ───────────────────────────────────────────────────── */
function ComputerLabEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lab-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0a0d1c" />
          <stop offset="100%" stopColor="#0c0f1e" />
        </linearGradient>
        <linearGradient id="lab-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0e1120" />
          <stop offset="100%" stopColor="#0c0f1c" />
        </linearGradient>
        <radialGradient id="screen-glow-l" cx="15%" cy="50%" r="25%">
          <stop offset="0%"   stopColor="rgba(80,140,255,0.14)" />
          <stop offset="100%" stopColor="rgba(60,110,255,0)" />
        </radialGradient>
        <radialGradient id="screen-glow-r" cx="85%" cy="50%" r="25%">
          <stop offset="0%"   stopColor="rgba(80,140,255,0.14)" />
          <stop offset="100%" stopColor="rgba(60,110,255,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#lab-wall)" />
      <rect x="0" y="455" width="800" height="145" fill="url(#lab-floor)" />
      <line x1="0" y1="455" x2="800" y2="455" stroke="rgba(60,80,160,0.15)" strokeWidth="1.5" />

      {/* Ceiling fluorescent strips */}
      {[0,200,400,600].map((lx,i)=>(
        <g key={i}>
          <rect x={lx} y="0" width="190" height="10" rx="2" fill="rgba(180,200,255,0.35)" />
          <rect x={lx+4} y="2" width="182" height="6" rx="1" fill="rgba(255,255,255,0.8)" />
        </g>
      ))}

      {/* Projector screen at front */}
      <rect x="160" y="30" width="480" height="280" rx="4" fill="rgba(5,8,20,0.7)" stroke="rgba(60,80,140,0.35)" strokeWidth="2" />
      <rect x="168" y="38" width="464" height="264" rx="2" fill="rgba(20,30,60,0.6)" />
      {/* Screen content — code editor look */}
      <rect x="176" y="46" width="40" height="248" rx="0" fill="rgba(15,20,40,0.6)" />
      {/* Line numbers */}
      {Array.from({length:16},(_,i)=>(
        <text key={i} x="184" y={62+i*15} fontFamily="monospace" fontSize="8" fill="rgba(100,120,160,0.5)">{i+1}</text>
      ))}
      {/* Code lines */}
      {[
        {x:220,w:180,c:"rgba(224,64,251,0.4)"},
        {x:220,w:220,c:"rgba(0,212,240,0.35)"},
        {x:220,w:160,c:"rgba(255,255,255,0.2)"},
        {x:220,w:240,c:"rgba(0,212,240,0.3)"},
        {x:220,w:120,c:"rgba(255,180,80,0.35)"},
        {x:220,w:200,c:"rgba(255,255,255,0.18)"},
        {x:220,w:260,c:"rgba(224,64,251,0.35)"},
        {x:220,w:180,c:"rgba(0,212,240,0.3)"},
        {x:220,w:140,c:"rgba(255,255,255,0.18)"},
        {x:220,w:220,c:"rgba(255,180,80,0.3)"},
        {x:220,w:200,c:"rgba(224,64,251,0.3)"},
        {x:220,w:160,c:"rgba(0,212,240,0.28)"},
      ].map((l,i)=>(
        <rect key={i} x={l.x} y={57+i*20} width={l.w} height="10" rx="2" fill={l.c} />
      ))}
      {/* Cursor blink */}
      <rect x="220" y="277" width="8" height="12" rx="1" fill="rgba(0,212,240,0.8)"
        style={{ animation:"env-cursor 1s step-end infinite" }} />

      {/* Projector device */}
      <rect x="360" y="0" width="80" height="20" rx="4" fill="rgba(20,16,35,0.9)" />
      <circle cx="400" cy="8" r="5" fill="rgba(60,80,160,0.6)" />
      {/* Projector beam */}
      <path d="M375,20 L160,34 L640,34 L425,20 Z" fill="rgba(200,220,255,0.03)" />

      {/* Computer rows — 2 rows of workstations */}
      {[340, 420].map((ry,row)=>
        [80,200,320,440,560,680].map((cx,col)=>(
          <g key={`${row}-${col}`}>
            {/* Monitor */}
            <rect x={cx-38} y={ry-65} width="76" height="52" rx="4" fill="rgba(6,5,14,0.95)" stroke="rgba(40,60,140,0.25)" strokeWidth="1" />
            <rect x={cx-33} y={ry-60} width="66" height="42" rx="2"
              fill={`rgba(${40+col*8},${60+row*20},${150+col*10},0.1)`} />
            {/* Screen glow variety */}
            {[0,10,20,30].map((dy,i)=>(
              <rect key={i} x={cx-26} y={ry-55+dy} width={20+i*8} height="6" rx="2" fill="rgba(255,255,255,0.05)" />
            ))}
            {/* Monitor stand */}
            <rect x={cx-4}  y={ry-12} width="8" height="14" rx="2" fill="rgba(20,15,30,0.9)" />
            <rect x={cx-18} y={ry+2}  width="36" height="4" rx="2" fill="rgba(15,12,25,0.9)" />
            {/* Keyboard */}
            <rect x={cx-32} y={ry+10} width="64" height="8" rx="2" fill="rgba(12,10,22,0.8)" stroke="rgba(35,28,60,0.4)" strokeWidth="0.8" />
          </g>
        ))
      )}

      {/* Screen glow ambients */}
      <rect x="0" y="0" width="800" height="600" fill="url(#screen-glow-l)" />
      <rect x="0" y="0" width="800" height="600" fill="url(#screen-glow-r)" />

      {/* Floor tiles */}
      {[0,100,200,300,400,500,600,700,800].map((tx,i)=>(
        <line key={i} x1={tx} y1="455" x2={tx} y2="600" stroke="rgba(60,80,160,0.07)" strokeWidth="1" />
      ))}
      {[470,490,510,530].map((ty,i)=>(
        <line key={i} x1="0" y1={ty} x2="800" y2={ty} stroke="rgba(60,80,160,0.07)" strokeWidth="1" />
      ))}

      {/* Vignette */}
      <radialGradient id="lab-vignette" cx="50%" cy="50%" r="75%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(3,4,12,0.72)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#lab-vignette)" />
    </svg>
  )
}

/* ─── 12. REHEARSAL STUDIO ───────────────────────────────────────────────── */
function RehearsalEnv({ tod }: { tod: TimeOfDay }) {
  return (
    <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="reh-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0c0a18" />
          <stop offset="100%" stopColor="#0a0816" />
        </linearGradient>
        <linearGradient id="reh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#14101e" />
          <stop offset="100%" stopColor="#100c1a" />
        </linearGradient>
        <radialGradient id="reh-warm" cx="50%" cy="30%" r="45%">
          <stop offset="0%"   stopColor="rgba(255,180,80,0.12)" />
          <stop offset="100%" stopColor="rgba(255,160,60,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0"   width="800" height="600" fill="url(#reh-wall)" />
      <rect x="0" y="440" width="800" height="160" fill="url(#reh-floor)" />
      <line x1="0" y1="440" x2="800" y2="440" stroke="rgba(80,65,120,0.18)" strokeWidth="1.5" />

      {/* Wall mirror — full length, left half */}
      <rect x="0" y="0" width="380" height="440" rx="0" fill="rgba(200,210,255,0.04)" stroke="rgba(80,80,130,0.2)" strokeWidth="1" />
      {/* Mirror reflections */}
      <rect x="2" y="2" width="376" height="436" fill="rgba(100,120,180,0.03)" />
      {/* Mirror frame top */}
      <rect x="0" y="0" width="380" height="6" fill="rgba(40,35,65,0.7)" />
      <rect x="0" y="434" width="380" height="6" fill="rgba(40,35,65,0.7)" />

      {/* Acoustic foam panels — right wall */}
      {Array.from({length:5},(_,col)=>
        Array.from({length:6},(_,row)=>(
          <rect key={`${col}-${row}`}
            x={420+col*76} y={row*74}
            width="72" height="70"
            rx="8"
            fill={`rgba(${20+col*3},${14+row*2},${30+col*2},${0.7+(col+row)%2*0.1})`}
            stroke="rgba(40,28,55,0.5)"
            strokeWidth="1"
          />
        ))
      )}

      {/* Ceiling track lights */}
      {[100, 250, 400].map((lx,i)=>(
        <g key={i}>
          <rect x={lx-60} y="0" width="120" height="8" rx="2" fill="rgba(30,24,45,0.8)" />
          {[-35,0,35].map((ox,j)=>(
            <g key={j}>
              <circle cx={lx+ox} cy="8" r="6" fill="rgba(255,200,100,0.7)" />
              <path d={`M${lx+ox-20},14 L${lx+ox+20},14 L${lx+ox+40},440 L${lx+ox-40},440 Z`}
                fill="rgba(255,200,100,0.025)" />
            </g>
          ))}
        </g>
      ))}

      {/* Warm light overlay */}
      <rect x="0" y="0" width="800" height="600" fill="url(#reh-warm)" />

      {/* Instruments around room */}

      {/* Violin case — leaning */}
      <g transform="translate(50, 350) rotate(-12)">
        <rect x="-18" y="-65" width="36" height="130" rx="12" fill="rgba(30,22,42,0.85)" stroke="rgba(60,48,80,0.5)" strokeWidth="1.5" />
        <rect x="-14" y="-60" width="28" height="120" rx="10" fill="rgba(20,14,30,0.7)" />
        {/* Case locks */}
        <rect x="-5" y="-10" width="10" height="5" rx="2" fill="rgba(80,65,100,0.8)" />
        <rect x="-5" y="20"  width="10" height="5" rx="2" fill="rgba(80,65,100,0.8)" />
      </g>

      {/* Guitar stand + guitar */}
      <g transform="translate(320, 400)">
        {/* Stand */}
        <path d="M-20,0 L-20,-20 L20,-20 L20,0" stroke="rgba(60,50,80,0.6)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <line x1="0" y1="-20" x2="0" y2="-100" stroke="rgba(60,50,80,0.6)" strokeWidth="4" />
        {/* Guitar */}
        <ellipse cx="0" cy="-100" rx="28" ry="35" fill="rgba(100,50,20,0.6)" />
        <ellipse cx="0" cy="-148" rx="24" ry="30" fill="rgba(100,50,20,0.6)" />
        <rect x="-14" y="-130" width="28" height="40" fill="rgba(100,50,20,0.6)" />
        <rect x="-5"  y="-215" width="10" height="75" rx="2" fill="rgba(80,38,12,0.7)" />
        <rect x="-9"  y="-245" width="18" height="35" rx="3" fill="rgba(80,38,12,0.7)" />
        <circle cx="0" cy="-100" r="10" fill="rgba(15,8,3,0.8)" />
        {[-4,-2,0,2,4,6].map((sx,i)=>(
          <line key={i} x1={sx} y1="-170" x2={sx*0.9} y2="-225"
            stroke={`rgba(180,160,120,${0.15+i*0.02})`} strokeWidth="0.8" />
        ))}
      </g>

      {/* Piano / keyboard — right area */}
      <g transform="translate(640, 420)">
        <rect x="-100" y="-18" width="200" height="18" rx="3" fill="rgba(15,10,25,0.9)" stroke="rgba(50,40,75,0.5)" strokeWidth="1" />
        {/* White keys */}
        {Array.from({length:14},(_,i)=>(
          <rect key={i} x={-98+i*14} y="-16" width="13" height="16" rx="1"
            fill="rgba(220,215,240,0.4)" stroke="rgba(60,50,90,0.4)" strokeWidth="0.5" />
        ))}
        {/* Black keys */}
        {[0,1,3,4,5,7,8,10,11].map((k,i)=>(
          <rect key={i} x={-90+k*14} y="-16" width="9" height="10" rx="1" fill="rgba(10,6,18,0.9)" />
        ))}
        {/* Stand legs */}
        <rect x="-90" y="0" width="10" height="30" rx="2" fill="rgba(20,14,32,0.8)" />
        <rect x="80"  y="0" width="10" height="30" rx="2" fill="rgba(20,14,32,0.8)" />
      </g>

      {/* Sheet music stands */}
      <g transform="translate(160, 400)">
        <rect x="-4" y="-140" width="8" height="140" rx="2" fill="rgba(55,45,80,0.7)" />
        <path d="M-40,-140 L40,-140 L34,-100 L-34,-100 Z" fill="rgba(70,58,100,0.6)" stroke="rgba(90,75,125,0.4)" strokeWidth="1" />
        <path d="M-4,0 L-35,20 M-4,0 L4,0 L35,20" stroke="rgba(55,45,80,0.6)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="-30" y="-135" width="60" height="28" rx="1" fill="rgba(240,235,255,0.09)" />
        {[0,8,16].map((dy,i)=>(
          <line key={i} x1="-22" y1={-130+dy} x2="22" y2={-130+dy} stroke="rgba(240,235,255,0.12)" strokeWidth="0.8" />
        ))}
      </g>

      {/* Floor reflection strip */}
      <line x1="0" y1="455" x2="380" y2="455" stroke="rgba(200,210,255,0.06)" strokeWidth="3" />

      {/* Vignette */}
      <radialGradient id="reh-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(4,3,10,0.7)" />
      </radialGradient>
      <rect x="0" y="0" width="800" height="600" fill="url(#reh-vignette)" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════════════ */
type Props = {
  location:      string
  opacity?:      number
  showCalendar?: boolean
  style?:        React.CSSProperties
}

export default function SceneEnvironment({ location, opacity = 1, showCalendar = true, style }: Props) {
  const { env, day, time, tod } = useMemo(() => parseLocation(location), [location])

  /* ── Smooth mouse-parallax on environment art ────────────────────────── */
  const envRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = envRef.current
    if (!el) return
    let raf: number
    let tx = 0, ty = 0, cx = 0, cy = 0
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const onMove = (e: MouseEvent) => {
      const wx = window.innerWidth / 2
      const wy = window.innerHeight / 2
      tx = ((e.clientX - wx) / wx) * 9
      ty = ((e.clientY - wy) / wy) * 5
    }
    const tick = () => {
      cx = lerp(cx, tx, 0.055)
      cy = lerp(cy, ty, 0.055)
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px) scale(1.025)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf) }
  }, [])

  /* ── inject animation keyframes once ────────────────────────────────── */
  useMemo(() => {
    if (typeof document === "undefined") return
    const id = "env-animation-keyframes"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes env-twinkle    { 0%,100%{opacity:.35}40%{opacity:1}70%{opacity:.55} }
      @keyframes env-steam      { 0%{transform:translateY(0) scaleX(1);opacity:0} 15%{opacity:.18} 80%{opacity:.06} 100%{transform:translateY(-32px) scaleX(1.6);opacity:0} }
      @keyframes env-city-blink { 0%,100%{opacity:.45}50%{opacity:1} }
      @keyframes env-cursor     { 0%,49%{opacity:.9}50%,100%{opacity:0} }
      @keyframes env-lamp-hum   { 0%,100%{opacity:.14}50%{opacity:.24} }
      @keyframes env-beam-pulse { 0%,100%{opacity:.025}50%{opacity:.065} }
      @keyframes env-screen-flicker { 0%,95%,100%{opacity:.09}97%{opacity:.14} }
      @keyframes env-light-col  { 0%,100%{opacity:.75}50%{opacity:1} }
    `
    document.head.appendChild(s)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const envEl = useMemo(() => {
    switch (env) {
      case "bedroom":     return <BedroomEnv     tod={tod} />
      case "hallway":     return <HallwayEnv     tod={tod} />
      case "classroom":   return <ClassroomEnv   tod={tod} />
      case "band":        return <BandEnv        tod={tod} />
      case "practice":    return <PracticeEnv    tod={tod} />
      case "coffee":      return <CoffeeShopEnv  tod={tod} />
      case "homeoffice":  return <HomeOfficeEnv  tod={tod} />
      case "office":      return <OfficeEnv      tod={tod} />
      case "stage":       return <StageEnv       tod={tod} />
      case "library":     return <LibraryEnv     tod={tod} />
      case "computerlab": return <ComputerLabEnv tod={tod} />
      case "rehearsal":   return <RehearsalEnv   tod={tod} />
      default:            return null
    }
  }, [env, tod])

  const hasCal = showCalendar && !!day

  return (
    <div style={{
      position: "absolute",
      inset:    0,
      opacity,
      overflow: "hidden",
      pointerEvents: "none",
      ...style,
    }}>
      {/* Environment art — wraps ref for mouse-parallax transform */}
      <div ref={envRef} style={{ position:"absolute", inset:"-2.5%", width:"105%", height:"105%" }}>
        {envEl}
      </div>

      {/* Calendar + time overlay — bottom-right corner */}
      {hasCal && (
        <div style={{
          position:  "absolute",
          bottom:    "1.5rem",
          right:     "1.5rem",
          display:   "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap:       "6px",
          pointerEvents: "none",
        }}>
          <CalendarWidget day={day} small />
          {time && <TimeChip time={time} />}
        </div>
      )}
    </div>
  )
}
