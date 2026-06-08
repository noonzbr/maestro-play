"use client"

import { useState, useEffect, useRef } from "react"
import { Scene } from "@/lib/games/types"

/* ── Types ──────────────────────────────────────────────────────────────── */
type Phase =
  | "idle"          // player hasn't submitted yet
  | "loading"       // ai-score mode: waiting for API
  | "self-reveal"   // self-assess mode: model answer revealed, awaiting self-rating
  | "scored"        // ai-score mode: result received
  | "complete"      // XP shown, Continue available
  | "error"

type ApiResult = {
  aiResponse: string
  scores: { clarity: number; context: number; goal: number }
  feedback: string
  xp: number
}

type Props = {
  scene: Scene
  onComplete: (xpEarned: number) => void
  accentColor?: string
}

/* ── Keyframes ──────────────────────────────────────────────────────────── */
const KF_ID = "construct-scene-kf"
function ensureKeyframes() {
  if (typeof document === "undefined") return
  if (document.getElementById(KF_ID)) return
  const s = document.createElement("style")
  s.id = KF_ID
  s.textContent = `
    @keyframes cs-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cs-slide-down {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cs-dot-pulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40%            { transform: scale(1);   opacity: 1;   }
    }
    @keyframes cs-xp-pop {
      0%   { transform: scale(0.3); opacity: 0; }
      60%  { transform: scale(1.25); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes cs-reveal-in {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cs-score-bar {
      from { width: 0%; }
    }
    @keyframes cs-glow-pulse {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 0.9; }
    }
  `
  document.head.appendChild(s)
}

/* ── Score bar (ai-score mode) ──────────────────────────────────────────── */
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

/* ── Main component ─────────────────────────────────────────────────────── */
export default function ConstructScene({ scene, onComplete, accentColor }: Props) {
  const accent = accentColor ?? "#00d4f0"

  const [phase, setPhase]           = useState<Phase>("idle")
  const [response, setResponse]     = useState("")
  const [apiResult, setApiResult]   = useState<ApiResult | null>(null)
  const [errorMsg, setErrorMsg]     = useState("")
  const [showScores, setShowScores] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showXp, setShowXp]         = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charCount   = response.length
  const canSubmit   = response.trim().length > 20 && phase === "idle"

  const mode = scene.constructMode ?? "self-assess"

  useEffect(() => { ensureKeyframes() }, [])

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [response])

  /* Cascade reveals after ai-score result */
  useEffect(() => {
    if (phase !== "scored" || !apiResult) return
    const t1 = setTimeout(() => setShowScores(true), 300)
    const t2 = setTimeout(() => setShowFeedback(true), 300 + 3 * 200 + 400)
    const t3 = setTimeout(() => setShowXp(true), 300 + 3 * 200 + 800)
    const t4 = setTimeout(() => setShowContinue(true), 300 + 3 * 200 + 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [phase, apiResult])

  /* ── Submit handlers ────────────────────────────────────────────────── */
  async function handleSubmit() {
    if (!canSubmit) return

    if (mode === "self-assess") {
      setPhase("self-reveal")
      return
    }

    /* ai-score mode */
    setPhase("loading")
    try {
      const res = await fetch("/api/ai-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: response.trim(),
          context: scene.scenarioText ?? "",
          goal: scene.question ?? "",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setApiResult(data)
      setPhase("scored")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
      setPhase("error")
    }
  }

  function handleSelfRate(gotIt: boolean) {
    const xp = gotIt ? scene.xpAward : Math.floor(scene.xpAward * 0.3)
    setApiResult({ aiResponse: "", scores: { clarity: 0, context: 0, goal: 0 }, feedback: "", xp })
    setShowXp(true)
    const t = setTimeout(() => setShowContinue(true), 600)
    setPhase("complete")
    return () => clearTimeout(t)
  }

  /* ── Shared card wrapper ────────────────────────────────────────────── */
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "20px",
    padding: "2rem",
    backdropFilter: "blur(12px)",
    animation: "cs-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both",
  }

  /* ── Shared label style ─────────────────────────────────────────────── */
  function Label({ children }: { children: React.ReactNode }) {
    return (
      <div style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "0.8rem",
        letterSpacing: "0.24em",
        textTransform: "uppercase" as const,
        color: accent,
        marginBottom: "0.6rem",
        opacity: 0.85,
      }}>
        {children}
      </div>
    )
  }

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
    }}>

      {/* ── Badge ─────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        animation: "cs-fade-up 0.4s ease both",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: `rgba(${hexToRgb(accent)},0.08)`,
          border: `1px solid rgba(${hexToRgb(accent)},0.22)`,
          borderRadius: "100px",
          padding: "0.3rem 1rem",
        }}>
          <span style={{ fontSize: "0.75rem", color: accent }}>✦</span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.88rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: accent,
          }}>
            Free-Form Challenge
          </span>
        </div>
      </div>

      {/* ── Main card ─────────────────────────────────────────────────── */}
      <div style={card}>

        {/* Scenario / task description */}
        {scene.scenarioText && (
          <div style={{ marginBottom: "1.25rem" }}>
            <Label>The Situation</Label>
            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontStyle: "italic",
              fontSize: "1.3rem",
              color: "rgba(240,238,255,0.65)",
              lineHeight: 1.7,
              margin: 0,
            }}>
              {scene.scenarioText}
            </p>
          </div>
        )}

        {/* Divider */}
        {scene.scenarioText && scene.question && (
          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, rgba(${hexToRgb(accent)},0.35), transparent)`,
            marginBottom: "1.25rem",
          }} />
        )}

        {/* Specific prompt challenge */}
        {scene.question && (
          <div style={{ marginBottom: "1.5rem" }}>
            <Label>Your Task</Label>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.15rem, 2.5vw, 1.3rem)",
              color: "rgba(240,238,255,0.92)",
              lineHeight: 1.55,
              margin: 0,
            }}>
              {scene.question}
            </p>
          </div>
        )}

        {/* ── Textarea (idle + loading) ────────────────────────────────── */}
        {(phase === "idle" || phase === "loading") && (
          <div style={{ animation: "cs-fade-up 0.45s 0.1s ease both" }}>
            <Label>Your Response</Label>
            <div style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                value={response}
                onChange={e => setResponse(e.target.value)}
                disabled={phase === "loading"}
                placeholder="Write your response here…"
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.04)",
                  border: `2px solid rgba(${hexToRgb(accent)},0.22)`,
                  borderRadius: "12px",
                  padding: "0.9rem 1rem 2.2rem",
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.05rem",
                  color: "rgba(240,238,255,0.92)",
                  lineHeight: 1.65,
                  resize: "none",
                  outline: "none",
                  minHeight: "80px",
                  overflow: "hidden",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  opacity: phase === "loading" ? 0.55 : 1,
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = `rgba(${hexToRgb(accent)},0.65)`
                  e.currentTarget.style.boxShadow   = `0 0 0 3px rgba(${hexToRgb(accent)},0.1)`
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = `rgba(${hexToRgb(accent)},0.22)`
                  e.currentTarget.style.boxShadow   = "none"
                }}
              />
              {/* Character count */}
              <span style={{
                position: "absolute",
                bottom: "0.55rem",
                right: "0.75rem",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.7rem",
                color: charCount > 20
                  ? "rgba(240,238,255,0.28)"
                  : "rgba(240,238,255,0.18)",
                pointerEvents: "none",
              }}>
                {charCount}
              </span>
            </div>

            {/* Minimum length hint */}
            {charCount > 0 && charCount <= 20 && (
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.72rem",
                color: "rgba(240,238,255,0.35)",
                margin: "0.4rem 0 0",
                animation: "cs-slide-down 0.25s ease both",
              }}>
                Keep going — at least a sentence or two.
              </p>
            )}

            {/* Loading dots */}
            {phase === "loading" && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginTop: "0.9rem",
                animation: "cs-fade-up 0.3s ease both",
              }}>
                <div style={{ display: "flex", gap: "5px" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: accent,
                      animation: `cs-dot-pulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                    }} />
                  ))}
                </div>
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(240,238,255,0.4)",
                }}>
                  Scoring your response…
                </span>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                marginTop: "1rem",
                width: "100%",
                padding: "0.9rem",
                border: "none",
                borderRadius: "12px",
                background: canSubmit
                  ? `linear-gradient(90deg, ${accent}, #e040fb)`
                  : "rgba(255,255,255,0.07)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: canSubmit ? "#08060f" : "rgba(240,238,255,0.3)",
                cursor: canSubmit ? "pointer" : "not-allowed",
                opacity: canSubmit ? 1 : 0.55,
                transition: "opacity 0.2s ease, transform 0.15s ease, filter 0.15s ease",
              }}
              onMouseEnter={e => {
                if (!canSubmit) return
                e.currentTarget.style.filter    = "brightness(1.08)"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter    = ""
                e.currentTarget.style.transform = ""
              }}
            >
              {mode === "self-assess" ? "Submit & See Model Answer →" : "Submit for Scoring →"}
            </button>
          </div>
        )}

        {/* ── Self-assess: model answer reveal ────────────────────────── */}
        {(phase === "self-reveal" || phase === "complete") && mode === "self-assess" && (
          <div style={{ animation: "cs-reveal-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>

            {/* Player's answer recap */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "rgba(240,238,255,0.35)",
                marginBottom: "0.45rem",
              }}>
                Your Response
              </div>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(240,238,255,0.75)",
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}>
                {response}
              </p>
            </div>

            {/* Model answer */}
            {scene.revealText && (
              <div style={{
                background: `rgba(${hexToRgb(accent)},0.05)`,
                border: `1px solid rgba(${hexToRgb(accent)},0.22)`,
                borderLeft: `3px solid ${accent}`,
                borderRadius: "0 12px 12px 0",
                padding: "0.9rem 1.1rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: accent,
                  marginBottom: "0.5rem",
                  opacity: 0.85,
                }}>
                  Model Answer
                </div>
                <p style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(0.95rem, 2.4vw, 1.08rem)",
                  color: "rgba(240,238,255,0.88)",
                  lineHeight: 1.65,
                  margin: 0,
                  animation: "cs-glow-pulse 3s ease-in-out infinite",
                }}>
                  {scene.revealText}
                </p>
              </div>
            )}

            {/* Self-rating buttons — only while awaiting rating */}
            {phase === "self-reveal" && (
              <div style={{ animation: "cs-reveal-in 0.4s 0.2s ease both" }}>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color: "rgba(240,238,255,0.5)",
                  textAlign: "center" as const,
                  marginBottom: "0.85rem",
                }}>
                  How did you do?
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleSelfRate(false)}
                    style={{
                      flex: 1,
                      padding: "0.78rem",
                      border: "1px solid rgba(255,75,75,0.35)",
                      borderRadius: "12px",
                      background: "rgba(255,75,75,0.06)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#ff6b6b",
                      cursor: "pointer",
                      transition: "background 0.15s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background  = "rgba(255,75,75,0.12)"
                      e.currentTarget.style.transform   = "translateY(-1px)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background  = "rgba(255,75,75,0.06)"
                      e.currentTarget.style.transform   = ""
                    }}
                  >
                    I missed it
                  </button>
                  <button
                    onClick={() => handleSelfRate(true)}
                    style={{
                      flex: 1,
                      padding: "0.78rem",
                      border: "1px solid rgba(88,204,2,0.35)",
                      borderRadius: "12px",
                      background: "rgba(88,204,2,0.06)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      color: "#58cc02",
                      cursor: "pointer",
                      transition: "background 0.15s ease, transform 0.15s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background  = "rgba(88,204,2,0.12)"
                      e.currentTarget.style.transform   = "translateY(-1px)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background  = "rgba(88,204,2,0.06)"
                      e.currentTarget.style.transform   = ""
                    }}
                  >
                    I got it ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI-score: scored result ──────────────────────────────────── */}
        {phase === "scored" && apiResult && (
          <div style={{ animation: "cs-reveal-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>

            {/* Player answer recap */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "rgba(240,238,255,0.35)",
                marginBottom: "0.45rem",
              }}>
                Your Response
              </div>
              <p style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "rgba(240,238,255,0.75)",
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}>
                {response}
              </p>
            </div>

            {/* Score bars */}
            {showScores && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
                marginBottom: "1.1rem",
                animation: "cs-fade-up 0.4s ease both",
              }}>
                <ScoreBar label="Clarity"  value={apiResult.scores.clarity}  delay={0}   />
                <ScoreBar label="Context"  value={apiResult.scores.context}  delay={200} />
                <ScoreBar label="Goal"     value={apiResult.scores.goal}     delay={400} />
              </div>
            )}

            {/* AI feedback */}
            {showFeedback && apiResult.feedback && (
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
                color: "rgba(240,238,255,0.45)",
                lineHeight: 1.6,
                margin: "0 0 1.25rem",
                animation: "cs-fade-up 0.5s ease both",
              }}>
                {apiResult.feedback}
              </p>
            )}
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {phase === "error" && (
          <div style={{ animation: "cs-fade-up 0.4s ease both" }}>
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
                border: `1px solid rgba(${hexToRgb(accent)},0.35)`,
                borderRadius: "12px",
                background: "transparent",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: accent,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── XP + Continue (both modes) ──────────────────────────────── */}
        {showXp && apiResult && (
          <div style={{
            textAlign: "center" as const,
            fontFamily: "Inter, sans-serif",
            fontWeight: 900,
            fontSize: "2rem",
            color: accent,
            marginTop: "0.5rem",
            marginBottom: "0.75rem",
            animation: "cs-xp-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            ✦ +{apiResult.xp} XP
          </div>
        )}

        {showContinue && apiResult && (
          <button
            onClick={() => onComplete(apiResult.xp)}
            style={{
              width: "100%",
              padding: "0.95rem",
              border: "none",
              borderRadius: "12px",
              background: `linear-gradient(90deg, ${accent}, #e040fb)`,
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#08060f",
              cursor: "pointer",
              animation: "cs-fade-up 0.5s ease both",
              transition: "transform 0.15s ease, filter 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-1px)"
              e.currentTarget.style.filter    = "brightness(1.08)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.filter    = ""
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Utility: hex → "r,g,b" for rgba() ─────────────────────────────────── */
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return "0,212,240"
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r},${g},${b}`
}
