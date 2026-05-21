"use client"

import { useState, useEffect, useRef } from "react"
import { Scene } from "@/lib/games/types"

type Phase = "idle" | "loading" | "result" | "error"

type ApiResult = {
  aiResponse: string
  scores: { clarity: number; context: number; goal: number }
  feedback: string
  xp: number
}

type Props = {
  scene: Scene
  location?: string
  onComplete: (xp: number) => void
}

// Typewriter hook identical to DialogueScene pattern
function useTypewriter(text: string, speed: number, active: boolean) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    setDisplayed("")
    setDone(false)
    if (!text) { setDone(true); return }
    let i = 0
    const timer = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(timer); setDone(true) }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed, active])

  return { displayed, done }
}

function ScoreBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const pct = (value / 5) * 100
  const color =
    value >= 4 ? "#00ff80" :
    value === 3 ? "#ffd700" :
    "#ff4d6d"

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      opacity: filled ? 1 : 0,
      transition: `opacity 0.4s ease ${delay}ms`,
    }}>
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: "rgba(240,238,255,0.5)",
        width: "60px",
        flexShrink: 0,
      }}>
        {label}
      </span>

      <div style={{
        flex: 1,
        height: "6px",
        borderRadius: "3px",
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: filled ? `${pct}%` : "0%",
          borderRadius: "3px",
          background: "linear-gradient(90deg, #00d4f0, #e040fb)",
          transition: `width 0.7s cubic-bezier(0.16,1,0.3,1) ${delay + 80}ms`,
        }} />
      </div>

      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "0.8rem",
        color,
        width: "28px",
        textAlign: "right" as const,
        flexShrink: 0,
      }}>
        {value}/5
      </span>
    </div>
  )
}

export default function PromptChallenge({ scene, location, onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [userPrompt, setUserPrompt] = useState("")
  const [result, setResult] = useState<ApiResult | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [showScores, setShowScores] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  const charCount = userPrompt.length
  const maxChars = 280

  const challenge = scene.promptChallenge!
  const displayLocation = location ?? scene.location

  // Typewriter for AI response — only runs in result phase
  const { displayed: twText, done: twDone } = useTypewriter(
    result?.aiResponse ?? "",
    18,
    phase === "result",
  )

  // Cascade reveals after typewriter finishes
  useEffect(() => {
    if (!twDone || phase !== "result") return
    const t1 = setTimeout(() => setShowScores(true), 200)
    const t2 = setTimeout(() => setShowFeedback(true), 200 + 3 * 200 + 400)
    const t3 = setTimeout(() => setShowXp(true), 200 + 3 * 200 + 800)
    const t4 = setTimeout(() => setShowContinue(true), 200 + 3 * 200 + 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [twDone, phase])

  // Inject keyframes once
  useEffect(() => {
    const id = "prompt-challenge-kf"
    if (document.getElementById(id)) return
    const s = document.createElement("style")
    s.id = id
    s.textContent = `
      @keyframes pc-fade-in {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pc-slide-up {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes pc-dot-pulse {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40%            { transform: scale(1);   opacity: 1;   }
      }
      @keyframes pc-score-pop {
        0%   { transform: scale(0.4); opacity: 0; }
        70%  { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes pc-xp-pop {
        0%   { transform: scale(0.3); opacity: 0; }
        60%  { transform: scale(1.25); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `
    document.head.appendChild(s)
  }, [])

  async function handleSend() {
    if (!userPrompt.trim() || phase !== "idle") return
    setPhase("loading")
    setResult(null)
    setShowScores(false)
    setShowFeedback(false)
    setShowXp(false)
    setShowContinue(false)

    try {
      const res = await fetch("/api/ai-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: userPrompt.trim(),
          context: challenge.context,
          goal: challenge.goal,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setResult(data)
      setPhase("result")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
      setPhase("error")
    }
  }

  // ─── LAYOUT WRAPPERS ───────────────────────────────────────────────────────

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 20,
    background: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto",
    padding: "80px 1.5rem 3rem",
  }

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: "640px",
    animation: "pc-fade-in 0.55s cubic-bezier(0.16,1,0.3,1) both",
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div style={overlay}>
      <div style={card}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "2rem",
          animation: "pc-fade-in 0.5s ease both",
        }}>
          {displayLocation && (
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(240,238,255,0.25)",
            }}>
              {displayLocation}
            </div>
          )}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0,212,240,0.08)",
            border: "1px solid rgba(0,212,240,0.2)",
            borderRadius: "100px",
            padding: "0.3rem 1rem",
          }}>
            <span style={{ fontSize: "0.75rem", color: "var(--cyan)" }}>✦</span>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--cyan)",
            }}>
              Conductor Moment
            </span>
          </div>
        </div>

        {/* ── Card body ──────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "2rem",
          animation: "pc-fade-in 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both",
        }}>

          {/* Context paragraph */}
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
            color: "rgba(240,238,255,0.6)",
            lineHeight: 1.65,
            margin: "0 0 1.25rem",
          }}>
            {challenge.context}
          </p>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            margin: "0 0 1.25rem",
          }} />

          {/* Goal label */}
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--cyan)",
            marginBottom: "0.75rem",
          }}>
            Jake&apos;s Prompt
          </div>

          {/* ── IDLE / LOADING: textarea area ─────────────────────────── */}
          {(phase === "idle" || phase === "loading") && (
            <div style={{ animation: "pc-fade-in 0.45s 0.15s ease both" }}>
              <div style={{ position: "relative" }}>
                <textarea
                  value={userPrompt}
                  onChange={e => {
                    if (e.target.value.length <= maxChars) setUserPrompt(e.target.value)
                  }}
                  disabled={phase === "loading"}
                  placeholder={challenge.placeholder ?? "Type Jake's prompt to the AI..."}
                  rows={3}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)",
                    border: "2px solid rgba(0,212,240,0.25)",
                    borderRadius: "10px",
                    padding: "0.9rem 1rem 2rem",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.95rem",
                    color: "rgba(240,238,255,0.9)",
                    lineHeight: 1.6,
                    resize: "none",
                    outline: "none",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    opacity: phase === "loading" ? 0.55 : 1,
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "rgba(0,212,240,0.7)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,240,0.1)"
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "rgba(0,212,240,0.25)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
                {/* Character count */}
                <span style={{
                  position: "absolute",
                  bottom: "0.55rem",
                  right: "0.75rem",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.72rem",
                  color: charCount > maxChars * 0.85 ? "rgba(255,100,100,0.7)" : "rgba(240,238,255,0.25)",
                }}>
                  {charCount} / {maxChars}
                </span>
              </div>

              {/* Loading indicator */}
              {phase === "loading" && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  marginTop: "0.9rem",
                  animation: "pc-fade-in 0.3s ease both",
                }}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "var(--cyan)",
                        animation: `pc-dot-pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                      }} />
                    ))}
                  </div>
                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8rem",
                    color: "rgba(240,238,255,0.45)",
                  }}>
                    AI is composing...
                  </span>
                </div>
              )}

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!userPrompt.trim() || phase === "loading"}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "0.9rem",
                  border: "none",
                  borderRadius: "10px",
                  background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#08060f",
                  cursor: !userPrompt.trim() || phase === "loading" ? "not-allowed" : "pointer",
                  opacity: !userPrompt.trim() || phase === "loading" ? 0.4 : 1,
                  transition: "opacity 0.2s ease, transform 0.15s ease",
                }}
                onMouseEnter={e => {
                  if (!userPrompt.trim() || phase === "loading") return
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={e => { e.currentTarget.style.transform = "" }}
              >
                {phase === "loading" ? "Sending..." : "Send to AI →"}
              </button>
            </div>
          )}

          {/* ── ERROR ─────────────────────────────────────────────────── */}
          {phase === "error" && (
            <div style={{ animation: "pc-fade-in 0.4s ease both" }}>
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9rem",
                color: "#ff4d6d",
                marginBottom: "1rem",
                lineHeight: 1.5,
              }}>
                {errorMsg || "Something went wrong. Please try again."}
              </p>
              <button
                onClick={() => setPhase("idle")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  border: "1px solid rgba(0,212,240,0.35)",
                  borderRadius: "10px",
                  background: "transparent",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "var(--cyan)",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {/* ── RESULT ────────────────────────────────────────────────── */}
          {phase === "result" && result && (
            <div style={{ animation: "pc-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>

              {/* AI response box */}
              <div style={{
                background: "rgba(0,212,240,0.05)",
                border: "1px solid rgba(0,212,240,0.2)",
                borderLeft: "3px solid #00d4f0",
                borderRadius: "10px",
                padding: "1rem 1.1rem",
                marginBottom: "1.25rem",
              }}>
                {/* AI chip */}
                <div style={{
                  display: "inline-block",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--cyan)",
                  background: "rgba(0,212,240,0.1)",
                  border: "1px solid rgba(0,212,240,0.2)",
                  borderRadius: "100px",
                  padding: "0.15rem 0.6rem",
                  marginBottom: "0.6rem",
                }}>
                  AI
                </div>

                <p style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)",
                  color: "rgba(240,238,255,0.9)",
                  lineHeight: 1.6,
                  margin: 0,
                  minHeight: "2.8rem",
                }}>
                  {twText}
                  {!twDone && (
                    <span style={{ animation: "pulse-glow 0.7s ease-in-out infinite", color: "var(--cyan)", marginLeft: "2px" }}>|</span>
                  )}
                </p>
              </div>

              {/* Score bars */}
              {showScores && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  marginBottom: "1rem",
                  animation: "pc-fade-in 0.4s ease both",
                }}>
                  <ScoreBar label="Clarity" value={result.scores.clarity} delay={0} />
                  <ScoreBar label="Context" value={result.scores.context} delay={200} />
                  <ScoreBar label="Goal"    value={result.scores.goal}    delay={400} />
                </div>
              )}

              {/* Feedback tip */}
              {showFeedback && (
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(240,238,255,0.45)",
                  lineHeight: 1.5,
                  margin: "0 0 1.25rem",
                  animation: "pc-fade-in 0.5s ease both",
                }}>
                  {result.feedback}
                </p>
              )}

              {/* XP display */}
              {showXp && (
                <div style={{
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: "2rem",
                  color: "var(--cyan)",
                  marginBottom: "1.25rem",
                  animation: "pc-xp-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                }}>
                  ✦ +{result.xp} XP
                </div>
              )}

              {/* Continue button */}
              {showContinue && (
                <button
                  onClick={() => onComplete(result.xp)}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    border: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(90deg, #00d4f0, #e040fb)",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#08060f",
                    cursor: "pointer",
                    animation: "pc-fade-in 0.5s ease both",
                    transition: "transform 0.15s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "" }}
                >
                  Continue →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
