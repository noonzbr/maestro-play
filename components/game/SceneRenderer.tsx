"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { Scene, Choice } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"
import GameIcon from "./GameIcon"
import CinematicVideo from "./CinematicVideo"
import PredictScene from "./PredictScene"
import AICompareScene from "./AICompareScene"

/* ── keyframes ─────────────────────────────────────────────────────────── */
const SCENE_KF_ID = "scene-renderer-kf"
function ensureSceneKeyframes() {
  if (typeof document === "undefined") return
  if (document.getElementById(SCENE_KF_ID)) return
  const s = document.createElement("style")
  s.id = SCENE_KF_ID
  s.textContent = `
    @keyframes fw-burst {
      0%   { transform:translate(0,0) scale(1.4); opacity:1; }
      100% { transform:translate(var(--tx),var(--ty)) scale(0); opacity:0; }
    }
    @keyframes feedback-slide-up {
      from { transform:translateY(100%); opacity:0.6; }
      to   { transform:translateY(0);   opacity:1; }
    }
    @keyframes feedback-icon-pop {
      0%   { transform:scale(0) rotate(-20deg); opacity:0; }
      60%  { transform:scale(1.3) rotate(6deg); opacity:1; }
      100% { transform:scale(1)   rotate(0deg); opacity:1; }
    }
    @keyframes feedback-text-in {
      from { opacity:0; transform:translateX(-8px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes continue-btn-in {
      from { opacity:0; transform:translateY(8px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes npc-cursor-blink {
      0%,100% { opacity:1; }
      50%     { opacity:0; }
    }
    @keyframes pill-glow-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,212,240,0); }
      50%     { box-shadow: 0 0 16px 2px rgba(0,212,240,0.2); }
    }
    @keyframes boss-pill-glow-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(224,64,251,0); }
      50%     { box-shadow: 0 0 16px 2px rgba(224,64,251,0.28); }
    }
    @keyframes section-enter {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes pulse-glow {
      0%,100% { opacity:0.4; }
      50%     { opacity:1; }
    }
    @keyframes revelation-glow {
      0%,100% { opacity:0.35; }
      50%     { opacity:0.65; }
    }
    @keyframes float {
      0%,100% { opacity:0.7; transform:scale(1); }
      50%     { opacity:1;   transform:scale(1.08); }
    }
    @keyframes maestro-glow-pulse {
      0%,100% { box-shadow:0 0 18px rgba(255,75,75,0.3), 0 0 0 0 rgba(255,75,75,0); }
      50%     { box-shadow:0 0 32px rgba(255,75,75,0.55), 0 0 0 4px rgba(255,75,75,0.08); }
    }
    @keyframes maestro-line-in {
      from { opacity:0; transform:translateY(6px) skewX(-1deg); }
      to   { opacity:1; transform:translateY(0) skewX(0deg); }
    }
    @keyframes correct-burst {
      0%   { transform:scale(0.5); opacity:0; }
      50%  { transform:scale(1.25); opacity:1; }
      100% { transform:scale(1); opacity:1; }
    }
    @keyframes streak-badge-in {
      from { opacity:0; transform:translateX(10px) scale(0.85); }
      to   { opacity:1; transform:translateX(0) scale(1); }
    }
    @keyframes skeleton-shimmer {
      0%   { background-position:-200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes ai-insight-in {
      from { opacity:0; transform:translateY(6px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `
  document.head.appendChild(s)
}

/* ── Fireworks ─────────────────────────────────────────────────────────── */
const FW_COLORS = ["#00d4f0","#e040fb","#ffeb3b","#ff4081","#69ff47","#ff9800"]
const BURST_ORIGINS = [
  { x:"18%", y:"22%" },{ x:"75%", y:"15%" },{ x:"50%", y:"30%" },
  { x:"28%", y:"12%" },{ x:"68%", y:"28%" },{ x:"82%", y:"18%" },
]
function FireworkBurst({ x, y, delay }: { x:string; y:string; delay:number }) {
  const particles = useMemo(() =>
    Array.from({ length:22 }, (_, i) => {
      const angle = (i/22)*Math.PI*2
      const dist  = 55 + Math.random()*110
      return { tx:Math.cos(angle)*dist, ty:Math.sin(angle)*dist,
               color:FW_COLORS[i%FW_COLORS.length], size:3+Math.random()*5,
               dur:0.55+Math.random()*0.35, jitter:Math.random()*0.15 }
    }), [])
  return (
    <div style={{ position:"fixed", left:x, top:y, pointerEvents:"none", zIndex:60 }}>
      {particles.map((p,i) => (
        <div key={i} style={{
          position:"absolute", width:`${p.size}px`, height:`${p.size}px`,
          borderRadius:"50%", background:p.color,
          boxShadow:`0 0 8px ${p.color}`,
          ["--tx" as string]:`${p.tx}px`, ["--ty" as string]:`${p.ty}px`,
          animation:`fw-burst ${p.dur}s ${delay+p.jitter}s ease-out both`,
        }} />
      ))}
    </div>
  )
}
function Fireworks() {
  useEffect(() => { ensureSceneKeyframes() }, [])
  return <>{BURST_ORIGINS.map((b,i) => <FireworkBurst key={i} x={b.x} y={b.y} delay={i*0.28} />)}</>
}

/* ── Maestro's AI insight (loading skeleton → elaboration text) ─────────── */
function MaestroInsight({ elaboration }: { elaboration: string | null | undefined }) {
  // undefined = correct answer or no AI needed — don't render at all
  if (elaboration === undefined || elaboration === "") return null

  return (
    <div style={{ marginBottom: "0.95rem" }}>
      {/* Section header */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.5rem" }}>
        <div style={{ width:"3px", height:"3px", borderRadius:"50%", background:"rgba(255,75,75,0.55)", flexShrink:0 }} />
        <span style={{
          fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.5rem",
          letterSpacing:"0.32em", textTransform:"uppercase",
          color:"rgba(255,75,75,0.55)",
        }}>
          Maestro's Insight
        </span>
        {elaboration === null && (
          <span style={{
            fontFamily:"Inter, sans-serif", fontSize:"0.52rem",
            color:"rgba(255,75,75,0.35)", letterSpacing:"0.08em",
            animation:"pulse-glow 1s ease-in-out infinite",
          }}>
            thinking…
          </span>
        )}
      </div>

      {elaboration === null ? (
        /* Loading skeleton */
        <div style={{ display:"flex", flexDirection:"column", gap:"0.42rem", minHeight:"4.2rem" }}>
          {[88, 100, 72].map((w, i) => (
            <div key={i} style={{
              height:"0.72rem", width:`${w}%`, borderRadius:"4px",
              background:"linear-gradient(90deg, rgba(255,75,75,0.06) 25%, rgba(255,75,75,0.14) 50%, rgba(255,75,75,0.06) 75%)",
              backgroundSize:"200% 100%",
              animation:`skeleton-shimmer 1.5s ${i * 0.18}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      ) : (
        /* AI elaboration text */
        <p style={{
          fontFamily:"Cormorant Garamond, serif", fontStyle:"italic",
          fontSize:"1rem", lineHeight:1.7,
          color:"rgba(255,210,210,0.82)",
          margin:0,
          animation:"ai-insight-in 0.55s 0.05s cubic-bezier(0.34,1.1,0.64,1) both",
        }}>
          {elaboration}
        </p>
      )}
    </div>
  )
}

/* ── Feedback panel ────────────────────────────────────────────────────── */
function FeedbackPanel({
  correct, feedbackText, streakCount, onNext, aiElaboration
}: {
  correct:        boolean
  feedbackText:   string
  streakCount:    number
  onNext:         () => void
  aiElaboration?: string | null
}) {
  const [btnReady, setBtnReady] = useState(false)
  useEffect(() => {
    // brief delay so player must see the explanation before continuing
    const t = setTimeout(() => setBtnReady(true), correct ? 0 : 500)
    return () => clearTimeout(t)
  }, [correct])

  /* ── WRONG: Maestro Intervenes ──────────────────────────────────────── */
  if (!correct) {
    return (
      <div style={{
        position:      "fixed",
        bottom:        0, left:0, right:0,
        background:    "linear-gradient(180deg, rgba(30,8,8,0.98) 0%, rgba(22,6,6,0.99) 100%)",
        borderTop:     "3px solid #ff4b4b",
        backdropFilter:"blur(24px)",
        padding:       "1rem 1.5rem 1.25rem",
        zIndex:        90,
        animation:     "feedback-slide-up 0.42s cubic-bezier(0.34,1.1,0.64,1) both",
      }}>
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>

          {/* ── Maestro header row ──── */}
          <div style={{ display:"flex", alignItems:"flex-start", gap:"0.8rem", marginBottom:"0.85rem" }}>
            {/* Conductor icon */}
            <div style={{
              width:"42px", height:"42px", borderRadius:"50%", flexShrink:0,
              background:"linear-gradient(135deg, #ff4b4b 0%, #c62828 100%)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.3rem",
              animation:"feedback-icon-pop 0.55s 0.04s cubic-bezier(0.34,1.56,0.64,1) both, maestro-glow-pulse 3s 0.6s ease-in-out infinite",
            }}>
              🎼
            </div>
            {/* Label + italic line */}
            <div>
              <div style={{
                fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.55rem",
                letterSpacing:"0.3em", textTransform:"uppercase",
                color:"rgba(255,75,75,0.65)", marginBottom:"0.22rem",
                animation:"feedback-text-in 0.3s 0.1s ease both",
              }}>
                The Maestro Intervenes
              </div>
              <div style={{
                fontFamily:"Cormorant Garamond, serif", fontStyle:"italic",
                fontWeight:600, fontSize:"1.12rem", color:"rgba(255,200,200,0.95)",
                lineHeight:1.3,
                animation:"maestro-line-in 0.45s 0.18s cubic-bezier(0.34,1.1,0.64,1) both",
              }}>
                {streakCount === 0
                  ? "Let's look at this differently."
                  : "Even conductors miss a beat. Here's why."}
              </div>
            </div>
          </div>

          {/* ── Elaborative feedback ──── */}
          {feedbackText && (
            <div style={{
              background:"rgba(255,75,75,0.07)",
              border:"1px solid rgba(255,75,75,0.18)",
              borderLeft:"3px solid #ff4b4b",
              borderRadius:"0 12px 12px 0",
              padding:"0.75rem 1rem 0.8rem",
              marginBottom:"0.8rem",
              animation:"feedback-text-in 0.4s 0.28s ease both",
            }}>
              <p style={{
                fontFamily:"Inter, sans-serif", fontSize:"0.9rem",
                color:"rgba(240,238,255,0.88)", lineHeight:1.75, margin:0,
              }}>
                {feedbackText}
              </p>
            </div>
          )}

          {/* ── Maestro's AI-generated insight ──── */}
          <MaestroInsight elaboration={aiElaboration} />

          {/* ── Got it button ──── */}
          <button
            onClick={btnReady ? onNext : undefined}
            style={{
              width:"100%", fontFamily:"Inter, sans-serif", fontWeight:800,
              fontSize:"0.95rem", color:"#fff",
              background: btnReady
                ? "linear-gradient(90deg, #ff4b4b, #c62828)"
                : "rgba(255,75,75,0.28)",
              padding:"0.75rem", borderRadius:"12px", border:"none",
              cursor: btnReady ? "pointer" : "default",
              letterSpacing:"0.04em", textTransform:"uppercase",
              opacity: btnReady ? 1 : 0.55,
              transition:"opacity 0.35s ease, background 0.35s ease, filter 0.15s ease, transform 0.15s ease",
              animation:"continue-btn-in 0.4s 0.35s cubic-bezier(0.34,1.3,0.64,1) both",
            }}
            onMouseEnter={e => { if (!btnReady) return; e.currentTarget.style.filter="brightness(1.12)"; e.currentTarget.style.transform="translateY(-1px)" }}
            onMouseLeave={e => { e.currentTarget.style.filter=""; e.currentTarget.style.transform="" }}
          >
            {btnReady ? "Got it — continue →" : "Read the Maestro's insight…"}
          </button>
        </div>
      </div>
    )
  }

  /* ── CORRECT ────────────────────────────────────────────────────────── */
  const isStreak = streakCount >= 2
  return (
    <div style={{
      position:      "fixed",
      bottom:        0, left:0, right:0,
      background:    "linear-gradient(180deg, rgba(8,28,8,0.98) 0%, rgba(6,20,6,0.99) 100%)",
      borderTop:     "3px solid #58cc02",
      backdropFilter:"blur(24px)",
      padding:       "0.85rem 1.5rem 1.1rem",
      zIndex:        90,
      animation:     "feedback-slide-up 0.38s cubic-bezier(0.34,1.15,0.64,1) both",
    }}>
      <div style={{ maxWidth:"680px", margin:"0 auto" }}>

        {/* header row */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem" }}>
          <div style={{
            width:"34px", height:"34px", borderRadius:"50%",
            background:"linear-gradient(135deg, #58cc02, #33a500)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.05rem", fontWeight:900, color:"#fff", flexShrink:0,
            boxShadow:"0 0 18px rgba(88,204,2,0.45)",
            animation:"correct-burst 0.5s 0.04s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            ✓
          </div>

          <span style={{
            fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"1.05rem",
            color:"#58cc02", letterSpacing:"-0.01em",
            animation:"feedback-text-in 0.35s 0.1s ease both",
          }}>
            {streakCount >= 5 ? `${streakCount} in a row! 🔥🔥` :
             streakCount >= 3 ? `${streakCount} in a row! 🔥` :
             streakCount === 2 ? "Nice streak! 🔥" :
             "Correct!"}
          </span>

          {/* Streak badge */}
          {isStreak && (
            <div style={{
              marginLeft:"auto",
              background:"rgba(88,204,2,0.12)", border:"1px solid rgba(88,204,2,0.3)",
              borderRadius:"100px", padding:"0.2rem 0.65rem",
              fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.68rem",
              color:"#58cc02", letterSpacing:"0.05em",
              animation:"streak-badge-in 0.4s 0.25s cubic-bezier(0.34,1.3,0.64,1) both",
            }}>
              🔥 streak ×{streakCount}
            </div>
          )}
        </div>

        {feedbackText && (
          <p style={{
            fontFamily:"Inter, sans-serif", fontSize:"0.875rem",
            color:"rgba(240,238,255,0.75)", lineHeight:1.65,
            margin:"0 0 0.9rem",
            animation:"feedback-text-in 0.38s 0.18s ease both",
          }}>
            {feedbackText}
          </p>
        )}

        <button
          onClick={onNext}
          style={{
            width:"100%", fontFamily:"Inter, sans-serif", fontWeight:800,
            fontSize:"0.95rem", color:"#fff",
            background:"linear-gradient(90deg, #58cc02, #33a500)",
            padding:"0.7rem", borderRadius:"12px", border:"none", cursor:"pointer",
            letterSpacing:"0.04em", textTransform:"uppercase",
            boxShadow:"0 0 20px rgba(88,204,2,0.25)",
            transition:"filter 0.15s ease, transform 0.15s ease",
            animation:"continue-btn-in 0.4s 0.22s cubic-bezier(0.34,1.3,0.64,1) both",
          }}
          onMouseEnter={e => { e.currentTarget.style.filter="brightness(1.12)"; e.currentTarget.style.transform="translateY(-1px)" }}
          onMouseLeave={e => { e.currentTarget.style.filter="";                  e.currentTarget.style.transform="" }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

/* ── Typewriter hook ───────────────────────────────────────────────────── */
function useTypewriter(text: string, speed = 28, active = true) {
  const [displayed, setDisplayed] = useState("")
  const [done,      setDone]      = useState(false)
  useEffect(() => {
    if (!active) { setDisplayed(text); setDone(true); return }
    setDisplayed(""); setDone(false)
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(iv); setDone(true) }
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed, active])
  return { displayed, done }
}

/* ── Revelation scene ─────────────────────────────────────────────────── */
function RevelationScene({ scene, onNext, playFireworks }: { scene:Scene; onNext:()=>void; playFireworks?:()=>void }) {
  const text = scene.revealText || ""

  /**
   * If the scene has a revelationVideo, we show a full-screen cinematic
   * clip first. Once it ends (or after 7 seconds, whichever comes first),
   * we fade into the typewriter text as usual.
   * If no video is defined, we skip straight to text.
   */
  const [videoPhase, setVideoPhase] = useState<"video" | "text">(
    scene.revelationVideo ? "video" : "text"
  )
  const videoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (videoPhase !== "video" || !scene.revelationVideo) return
    // Auto-advance after 7 s so a user who can't see the video doesn't get stuck
    videoTimerRef.current = setTimeout(() => setVideoPhase("text"), 7000)
    return () => { if (videoTimerRef.current) clearTimeout(videoTimerRef.current) }
  }, [videoPhase, scene.revelationVideo])

  function advanceFromVideo() {
    if (videoTimerRef.current) clearTimeout(videoTimerRef.current)
    setVideoPhase("text")
  }

  /* ── Cinematic video phase ─────────────────────────────────────────── */
  if (videoPhase === "video" && scene.revelationVideo) {
    return (
      <div
        onClick={advanceFromVideo}
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     25,
          background: "#000",
          cursor:     "pointer",
          animation:  "vi-fade-in 0.4s ease both",
        }}
      >
        <CinematicVideo
          src={scene.revelationVideo}
          loop={false}
          onEnded={advanceFromVideo}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          objectFit="cover"
        />
        {/* Skip hint */}
        <div style={{
          position:  "absolute", bottom:"1.5rem", right:"1.5rem",
          fontFamily:"Inter, sans-serif", fontSize:"0.65rem",
          color:     "rgba(255,255,255,0.35)", letterSpacing:"0.18em",
          textTransform:"uppercase",
        }}>
          tap to continue
        </div>
      </div>
    )
  }

  /* ── Text phase (existing typewriter experience) ───────────────────── */
  return <RevelationText scene={scene} onNext={onNext} playFireworks={playFireworks} />
}

function RevelationText({ scene, onNext, playFireworks }: { scene:Scene; onNext:()=>void; playFireworks?:()=>void }) {
  const text = scene.revealText || ""
  const { displayed, done } = useTypewriter(text, 22)
  const [showButton,    setShowButton]    = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    ensureSceneKeyframes()
    if (!done) return
    playFireworks?.()
    setShowFireworks(true)
    const t  = setTimeout(() => setShowButton(true), 800)
    const t2 = setTimeout(() => setShowFireworks(false), 3000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [done, playFireworks])

  return (
    <div style={{ textAlign:"center", padding:"1rem 1rem 1.5rem", position:"relative" }}>
      {showFireworks && <Fireworks />}
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:"400px", height:"400px",
        background:"radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.08) 40%, transparent 70%)",
        pointerEvents:"none",
        animation:"revelation-glow 4s ease-in-out infinite",
      }} />
      <div style={{ fontSize:"2.5rem", marginBottom:"1rem", filter:"drop-shadow(0 0 20px rgba(0,212,240,0.6))", animation:"float 5s ease-in-out infinite", display:"inline-block" }}>♪</div>
      <blockquote style={{
        fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontWeight:300,
        fontSize:"clamp(1rem, 2.6vw, 1.35rem)", color:"#fff", lineHeight:1.5,
        maxWidth:"560px", margin:"0 auto 1.25rem", position:"relative", zIndex:1,
      }}>
        &ldquo;{displayed}
        {!done && <span style={{ animation:"pulse-glow 0.7s ease-in-out infinite", color:"var(--cyan)" }}>|</span>}
        {done && <>&rdquo;</>}
      </blockquote>
      {done && (
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(0,212,240,0.08)", border:"1px solid rgba(0,212,240,0.2)", borderRadius:"100px", padding:"0.4rem 1rem", marginBottom:"1.25rem", animation:"section-enter 0.5s ease both" }}>
          <span style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.95rem", color:"var(--cyan)" }}>+{scene.xpAward} XP</span>
          <span style={{ fontFamily:"Inter, sans-serif", fontSize:"0.75rem", color:"var(--muted)" }}>revelation bonus</span>
        </div>
      )}
      {showButton && (
        <div style={{ animation:"section-enter 0.5s ease both" }}>
          <button onClick={onNext} style={{
            fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.95rem",
            color:"#08060f", background:"linear-gradient(90deg,#00d4f0,#e040fb)",
            padding:"0.8rem 2.25rem", borderRadius:"100px", border:"none", cursor:"pointer",
            transition:"transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 32px rgba(0,212,240,0.3)" }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="" }}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Learn scene ──────────────────────────────────────────────────────── */
function storyHook(text?: string): string | null {
  if (!text) return null
  const match = text.match(/^.{30,}?[.!?—](?=\s|$)/)
  const raw   = match ? match[0] : text.slice(0, 130)
  return raw.length > 130 ? raw.slice(0, 130) + "…" : raw
}

function LearnScene({ scene, onNext }: { scene: Scene; onNext: () => void }) {
  useEffect(() => { ensureSceneKeyframes() }, [])
  const hook = storyHook(scene.scenarioText)

  return (
    <div style={{ animation:"section-enter 0.45s ease both", paddingBottom:"2rem" }}>

      {scene.concept && (
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0, type:"spring", stiffness:380, damping:28 }}
          style={{ marginBottom:"1.25rem" }}
        >
          <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"rgba(0,212,240,0.08)", border:"1px solid rgba(0,212,240,0.28)", borderRadius:"100px", padding:"0.28rem 0.9rem", marginBottom:"0.85rem" }}>
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--cyan)", boxShadow:"0 0 8px var(--cyan)", flexShrink:0 }} />
            <span style={{ fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--cyan)" }}>
              {scene.concept.title}
            </span>
          </div>
          <p style={{ fontFamily:"Inter, sans-serif", fontSize:"0.92rem", color:"rgba(240,238,255,0.72)", lineHeight:1.75, margin:0 }}>
            {scene.concept.body}
          </p>
        </motion.div>
      )}

      {hook && (
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.07, type:"spring", stiffness:380, damping:28 }}
          style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"1.1rem" }}
        >
          <div style={{ width:"3px", minHeight:"100%", flexShrink:0, alignSelf:"stretch", background:"linear-gradient(180deg, var(--cyan), #e040fb)", borderRadius:"2px", marginTop:"2px" }} />
          <p style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontSize:"1.05rem", color:"rgba(240,238,255,0.9)", lineHeight:1.6, margin:0 }}>
            &ldquo;{hook}&rdquo;
          </p>
        </motion.div>
      )}

      {scene.learnHighlight && (
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.13, type:"spring", stiffness:380, damping:28 }}
          style={{ background:"linear-gradient(135deg, rgba(0,212,240,0.06) 0%, rgba(224,64,251,0.06) 100%)", border:"1px solid rgba(0,212,240,0.22)", borderRadius:"16px", padding:"1.1rem 1.25rem", marginBottom:"1.75rem", position:"relative", overflow:"hidden" }}
        >
          <div style={{ position:"absolute", top:0, right:0, width:"100px", height:"100px", background:"radial-gradient(circle at top right, rgba(224,64,251,0.12), transparent 70%)", pointerEvents:"none" }} />
          <div style={{ fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.58rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--cyan)", marginBottom:"0.5rem", opacity:0.8 }}>
            Key Insight
          </div>
          <p style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontWeight:600, fontSize:"1.18rem", color:"#fff", lineHeight:1.45, margin:0 }}>
            {scene.learnHighlight}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2, type:"spring", stiffness:380, damping:28 }}
        style={{ display:"flex", alignItems:"center", gap:"1rem" }}
      >
        {scene.xpAward > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"rgba(0,212,240,0.08)", border:"1px solid rgba(0,212,240,0.22)", borderRadius:"100px", padding:"0.28rem 0.8rem" }}>
            <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"var(--cyan)", boxShadow:"0 0 6px var(--cyan)" }} />
            <span style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.8rem", color:"var(--cyan)" }}>+{scene.xpAward} XP</span>
          </div>
        )}
        <button
          onClick={onNext}
          style={{ marginLeft:"auto", fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.95rem", color:"#08060f", background:"linear-gradient(90deg,#00d4f0,#e040fb)", padding:"0.75rem 2.25rem", borderRadius:"100px", border:"none", cursor:"pointer", boxShadow:"0 0 20px rgba(0,212,240,0.25)", transition:"transform 0.2s, box-shadow 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 32px rgba(0,212,240,0.45)" }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 0 20px rgba(0,212,240,0.25)" }}
        >
          Got it →
        </button>
      </motion.div>
    </div>
  )
}

/* ── Main renderer ────────────────────────────────────────────────────── */
type Props = {
  scene:           Scene
  answered:        boolean
  selectedLabel:   string | null
  onAnswer:        (choice: Choice) => void
  onNext:          () => void
  streakCount?:    number
  playFireworks?:  () => void
  aiElaboration?:  string | null
}

export default function SceneRenderer({ scene, answered, selectedLabel, onAnswer, onNext, streakCount=0, playFireworks, aiElaboration }: Props) {
  useEffect(() => { ensureSceneKeyframes() }, [])

  // Typewriter for NPC quote — called before early returns (React hook rules)
  const { displayed: npcDisplayed, done: npcDone } = useTypewriter(scene.npcLine || "", 26)

  if (scene.type === "predict") {
    return (
      <PredictScene
        scene={scene}
        answered={answered}
        selectedLabel={selectedLabel}
        onAnswer={onAnswer}
        onNext={onNext}
        streakCount={streakCount}
        aiElaboration={aiElaboration}
      />
    )
  }
  if (scene.type === "ai-compare") {
    return (
      <AICompareScene
        scene={scene}
        answered={answered}
        selectedLabel={selectedLabel}
        onAnswer={onAnswer}
        onNext={onNext}
        streakCount={streakCount}
        aiElaboration={aiElaboration}
      />
    )
  }
  if (scene.type === "handoff") {
    // Handoff scenes are purely dialogue — NovelScene handles them.
    // SceneRenderer is never actually shown for handoff (GameEngine guards it).
    return null
  }
  if (scene.type === "revelation") {
    return <RevelationScene scene={scene} onNext={onNext} playFireworks={playFireworks} />
  }
  if (scene.type === "learn") {
    return <LearnScene scene={scene} onNext={onNext} />
  }

  const isBoss      = scene.type === "boss"
  const hasDialogue = !!(scene.dialogue?.length)

  const selectedChoice = answered && selectedLabel
    ? scene.choices?.find(c => c.label === selectedLabel)
    : null
  const correct      = selectedChoice?.correct ?? false
  // Wrong answers can have a dedicated wrongFeedback string; fall back to feedback
  const feedbackText = selectedChoice
    ? (!selectedChoice.correct && selectedChoice.wrongFeedback)
      ? selectedChoice.wrongFeedback
      : selectedChoice.feedback
    : ""

  /* spring preset reused across elements */
  const spring = { type: "spring" as const, stiffness: 380, damping: 30 }

  return (
    <div>

      {/* ── Character / location header ─────────────────────────────── */}
      {(scene.character || scene.location) && (
        <motion.div
          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          transition={{ ...spring, delay:0 }}
          style={{ display:"flex", alignItems:"center", gap:"0.875rem", marginBottom:"0.75rem", flexWrap:"wrap" }}
        >
          {scene.character && (
            <div style={{
              display:"flex", alignItems:"center", gap:"0.45rem",
              background: isBoss ? "rgba(224,64,251,0.08)" : "rgba(0,212,240,0.07)",
              border:`1px solid ${isBoss ? "rgba(224,64,251,0.22)" : "rgba(0,212,240,0.2)"}`,
              borderRadius:"100px", padding:"0.28rem 0.75rem",
              animation: isBoss ? "boss-pill-glow-pulse 2.8s ease-in-out infinite" : "pill-glow-pulse 3s ease-in-out infinite",
            }}>
              <GameIcon name={isBoss ? "baton" : "guitar"} size={20} />
              <span style={{ fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"0.7rem", letterSpacing:"0.12em", textTransform:"uppercase", color:isBoss?"var(--pink)":"var(--cyan)" }}>
                {scene.character}
              </span>
            </div>
          )}
          {scene.location && (
            <span style={{ fontFamily:"Inter, sans-serif", fontSize:"0.66rem", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--muted)", fontWeight:500 }}>
              {scene.location}
            </span>
          )}
        </motion.div>
      )}

      {/* ── Scenario card ───────────────────────────────────────────── */}
      {!hasDialogue && (scene.scenarioText || scene.npcLine) && (
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ ...spring, delay:0.04 }}
          style={{
            background: isBoss ? "rgba(224,64,251,0.04)" : "rgba(0,212,240,0.04)",
            borderTop:    `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
            borderRight:  `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
            borderBottom: `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
            borderLeft:   `3px solid ${isBoss ? "var(--pink)" : "var(--cyan)"}`,
            borderRadius: "0 12px 12px 0",
            padding: "0.75rem 1.1rem",
            marginBottom: "0.75rem",
          }}
        >
          {/* NPC quote — typewriter reveal, cursor before closing quote */}
          {scene.npcLine && (
            <p style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontSize:"1.1rem", color:isBoss?"var(--pink)":"var(--cyan)", marginBottom:scene.scenarioText?"0.75rem":0, lineHeight:1.5 }}>
              &ldquo;{npcDisplayed}
              {!npcDone && (
                <span style={{ animation:"npc-cursor-blink 0.75s ease-in-out infinite", color:isBoss?"var(--pink)":"var(--cyan)", fontStyle:"normal", marginLeft:"1px" }}>|</span>
              )}
              {npcDone && <>&rdquo;</>}
            </p>
          )}
          {scene.scenarioText && (
            <p style={{ fontFamily:"Inter, sans-serif", fontSize:"0.925rem", color:"rgba(240,238,255,0.85)", lineHeight:1.75 }}>
              {scene.scenarioText}
            </p>
          )}
        </motion.div>
      )}

      {/* ── Concept card ────────────────────────────────────────────── */}
      {!hasDialogue && scene.concept && (
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ ...spring, delay:0.09 }}
          style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"0.7rem 1rem", marginBottom:"0.75rem" }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.5rem" }}>
            <GameIcon name="tuningFork" size={18} />
            <span style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>
              {scene.concept.title}
            </span>
          </div>
          <p style={{ fontFamily:"Inter, sans-serif", fontSize:"0.9rem", color:"rgba(240,238,255,0.7)", lineHeight:1.7, margin:0 }}>
            {scene.concept.body}
          </p>
        </motion.div>
      )}

      {/* ── Question ────────────────────────────────────────────────── */}
      {scene.question && (
        <>
          <motion.div
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ ...spring, delay:0.14 }}
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.4rem" }}
          >
            <GameIcon name={isBoss?"baton":"headphones"} size={16} />
            <span style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", color:isBoss?"var(--pink)":"rgba(0,212,240,0.6)" }}>
              {isBoss ? "Final Challenge" : "Your Turn"}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ ...spring, delay:0.18 }}
            style={{ fontFamily:"Inter, sans-serif", fontWeight:700, fontSize:"clamp(0.9rem, 2.3vw, 1.05rem)", color:"#fff", lineHeight:1.4, marginBottom:"0.5rem", letterSpacing:"-0.01em" }}
          >
            {scene.question}
          </motion.h2>
        </>
      )}

      {/* ── Choices — staggered spring entrance ─────────────────────── */}
      {scene.choices && (
        <div style={{ display:"flex", flexDirection:"column", gap:"0.38rem", marginBottom:"0.5rem" }}>
          {scene.choices.map((choice, i) => (
            <motion.div
              key={choice.label}
              initial={{ opacity:0, x:16 }}
              animate={{ opacity:1, x:0 }}
              transition={{ ...spring, delay: 0.22 + i * 0.06 }}
            >
              <ChoiceButton
                choice={choice}
                index={i}
                answered={answered}
                selectedLabel={selectedLabel}
                onSelect={onAnswer}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Feedback panel ──────────────────────────────────────────── */}
      {answered && selectedChoice && (
        <FeedbackPanel
          correct={correct}
          feedbackText={feedbackText}
          streakCount={streakCount}
          onNext={onNext}
          aiElaboration={correct ? undefined : aiElaboration}
        />
      )}
    </div>
  )
}
