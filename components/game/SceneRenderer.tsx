"use client"

import { useEffect, useState, useMemo } from "react"
import { Scene, Choice } from "@/lib/games/types"
import ChoiceButton from "./ChoiceButton"
import GameIcon from "./GameIcon"

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
    @keyframes section-enter {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
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

/* ── Duolingo-style feedback panel ────────────────────────────────────── */
function FeedbackPanel({
  correct, feedbackText, streakCount, onNext
}: {
  correct:      boolean
  feedbackText: string
  streakCount:  number
  onNext:       () => void
}) {
  const green = correct
  const accent = green ? "#58cc02" : "#ff4b4b"
  const bg     = green ? "rgba(20,42,14,0.98)" : "rgba(42,14,14,0.98)"

  return (
    <div style={{
      position:      "fixed",
      bottom:        0, left:0, right:0,
      background:    bg,
      borderTop:     `3px solid ${accent}`,
      backdropFilter:"blur(20px)",
      padding:       "0.85rem 1.5rem 1.1rem",
      zIndex:        90,
      animation:     "feedback-slide-up 0.38s cubic-bezier(0.34,1.15,0.64,1) both",
    }}>
      <div style={{ maxWidth:"680px", margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.55rem", marginBottom:"0.35rem" }}>
          <div style={{
            width:"30px", height:"30px", borderRadius:"50%",
            background: accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1rem", fontWeight:900, color:"#fff",
            animation:"feedback-icon-pop 0.52s 0.05s cubic-bezier(0.34,1.56,0.64,1) both",
            flexShrink: 0,
          }}>
            {green ? "✓" : "✗"}
          </div>
          <span style={{
            fontFamily:    "Inter, sans-serif",
            fontWeight:    800,
            fontSize:      "1.05rem",
            color:         accent,
            letterSpacing: "-0.01em",
            animation:     "feedback-text-in 0.35s 0.12s ease both",
          }}>
            {green
              ? streakCount >= 3 ? `${streakCount} in a row! 🔥` : streakCount === 2 ? "Nice streak! 🔥" : "Correct!"
              : "Not quite!"}
          </span>
        </div>

        {/* Explanation */}
        {feedbackText && (
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize:   "0.875rem",
            color:      "rgba(240,238,255,0.72)",
            lineHeight: 1.65,
            margin:     "0 0 1rem",
            animation:  "feedback-text-in 0.38s 0.18s ease both",
          }}>
            {feedbackText}
          </p>
        )}

        {/* Continue button */}
        <button
          onClick={onNext}
          style={{
            width:         "100%",
            fontFamily:    "Inter, sans-serif",
            fontWeight:    800,
            fontSize:      "0.95rem",
            color:         "#fff",
            background:    accent,
            padding:       "0.7rem",
            borderRadius:  "12px",
            border:        "none",
            cursor:        "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            transition:    "filter 0.15s ease, transform 0.15s ease",
            animation:     "continue-btn-in 0.4s 0.22s cubic-bezier(0.34,1.3,0.64,1) both",
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.12)"; e.currentTarget.style.transform = "translateY(-1px)" }}
          onMouseLeave={e => { e.currentTarget.style.filter = "";                  e.currentTarget.style.transform = "" }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

/* ── Revelation scene ─────────────────────────────────────────────────── */
function useTypewriter(text:string, speed=28, active=true) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!active) { setDisplayed(text); setDone(true); return }
    setDisplayed(""); setDone(false)
    let i = 0
    const iv = setInterval(() => { i++; setDisplayed(text.slice(0,i)); if(i>=text.length){clearInterval(iv);setDone(true)} }, speed)
    return () => clearInterval(iv)
  }, [text, speed, active])
  return { displayed, done }
}

function RevelationScene({ scene, onNext, playFireworks }: { scene:Scene; onNext:()=>void; playFireworks?:()=>void }) {
  const text = scene.revealText || ""
  const { displayed, done } = useTypewriter(text, 22)
  const [showButton, setShowButton]     = useState(false)
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
        &ldquo;{displayed}{!done && <span style={{ animation:"pulse-glow 0.7s ease-in-out infinite", color:"var(--cyan)" }}>|</span>}&rdquo;
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

/* ── Main renderer ────────────────────────────────────────────────────── */
type Props = {
  scene:         Scene
  answered:      boolean
  selectedLabel: string | null
  onAnswer:      (choice: Choice) => void
  onNext:        () => void
  streakCount?:  number
  playFireworks?: () => void
}

export default function SceneRenderer({ scene, answered, selectedLabel, onAnswer, onNext, streakCount=0, playFireworks }: Props) {
  useEffect(() => { ensureSceneKeyframes() }, [])

  if (scene.type === "revelation") {
    return <RevelationScene scene={scene} onNext={onNext} playFireworks={playFireworks} />
  }

  const isBoss    = scene.type === "boss"
  const hasDialogue = !!(scene.dialogue?.length)

  /* derive selected choice for feedback panel */
  const selectedChoice = answered && selectedLabel
    ? scene.choices?.find(c => c.label === selectedLabel)
    : null
  const correct      = selectedChoice?.correct ?? false
  const feedbackText = selectedChoice?.feedback ?? ""

  return (
    <div>
      {/* ── Character / location header ─────────────────────────────── */}
      {(scene.character || scene.location) && (
        <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", marginBottom:"0.75rem", flexWrap:"wrap", animation:"section-enter 0.38s ease both" }}>
          {scene.character && (
            <div style={{
              display:"flex", alignItems:"center", gap:"0.45rem",
              background: isBoss ? "rgba(224,64,251,0.08)" : "rgba(0,212,240,0.07)",
              border:`1px solid ${isBoss ? "rgba(224,64,251,0.22)" : "rgba(0,212,240,0.2)"}`,
              borderRadius:"100px", padding:"0.28rem 0.75rem",
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
        </div>
      )}

      {/* ── Scenario card ───────────────────────────────────────────── */}
      {!hasDialogue && (scene.scenarioText || scene.npcLine) && (
        <div style={{
          background: isBoss ? "rgba(224,64,251,0.04)" : "rgba(0,212,240,0.04)",
          borderTop:    `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
          borderRight:  `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
          borderBottom: `1px solid ${isBoss ? "rgba(224,64,251,0.2)" : "rgba(0,212,240,0.15)"}`,
          borderLeft:   `3px solid ${isBoss ? "var(--pink)" : "var(--cyan)"}`,
          borderRadius: "0 12px 12px 0",
          padding: "0.75rem 1.1rem",
          marginBottom: "0.75rem",
          animation: "section-enter 0.42s 60ms ease both",
        }}>
          {scene.npcLine && (
            <p style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontSize:"1.1rem", color:isBoss?"var(--pink)":"var(--cyan)", marginBottom:scene.scenarioText?"0.75rem":0, lineHeight:1.5 }}>
              &ldquo;{scene.npcLine}&rdquo;
            </p>
          )}
          {scene.scenarioText && (
            <p style={{ fontFamily:"Inter, sans-serif", fontSize:"0.925rem", color:"rgba(240,238,255,0.85)", lineHeight:1.75 }}>
              {scene.scenarioText}
            </p>
          )}
        </div>
      )}

      {/* ── Concept card ────────────────────────────────────────────── */}
      {!hasDialogue && scene.concept && (
        <div style={{
          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"14px", padding:"0.7rem 1rem", marginBottom:"0.75rem",
          animation:"section-enter 0.42s 100ms ease both",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.5rem" }}>
            <GameIcon name="tuningFork" size={18} />
            <span style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>
              {scene.concept.title}
            </span>
          </div>
          <p style={{ fontFamily:"Inter, sans-serif", fontSize:"0.9rem", color:"rgba(240,238,255,0.7)", lineHeight:1.7, margin:0 }}>
            {scene.concept.body}
          </p>
        </div>
      )}

      {/* ── Question ────────────────────────────────────────────────── */}
      {scene.question && (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.4rem", animation:"section-enter 0.42s 140ms ease both" }}>
            <GameIcon name={isBoss?"baton":"headphones"} size={16} />
            <span style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.6rem", letterSpacing:"0.25em", textTransform:"uppercase", color:isBoss?"var(--pink)":"rgba(0,212,240,0.6)" }}>
              {isBoss ? "Final Challenge" : "Your Turn"}
            </span>
          </div>
          <h2 style={{
            fontFamily:"Inter, sans-serif", fontWeight:700,
            fontSize:"clamp(0.9rem, 2.3vw, 1.05rem)", color:"#fff",
            lineHeight:1.4, marginBottom:"0.5rem", letterSpacing:"-0.01em",
            animation:"section-enter 0.42s 180ms ease both",
          }}>
            {scene.question}
          </h2>
        </>
      )}

      {/* ── Choices ─────────────────────────────────────────────────── */}
      {scene.choices && (
        <div style={{
          display:"flex", flexDirection:"column", gap:"0.38rem",
          marginBottom: "0.5rem",
        }}>
          {scene.choices.map((choice, i) => (
            <ChoiceButton
              key={choice.label}
              choice={choice}
              index={i}
              answered={answered}
              selectedLabel={selectedLabel}
              onSelect={onAnswer}
            />
          ))}
        </div>
      )}

      {/* ── Duolingo feedback panel (fixed bottom) ───────────────────── */}
      {answered && selectedChoice && (
        <FeedbackPanel
          correct={correct}
          feedbackText={feedbackText}
          streakCount={streakCount}
          onNext={onNext}
        />
      )}
    </div>
  )
}
