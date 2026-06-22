"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Scene, Game } from "@/lib/games/types"

type Message = { role: "user" | "assistant"; content: string }

interface Props {
  scene:        Scene
  game:         Game
  accentColor?: string
  /** Pass true briefly when the player gets a wrong answer — triggers a nudge */
  playerStuck?: boolean
  /**
   * Lock Koda while choices are visible and selectable.
   * Protects the core mechanic: players must make their own decision first.
   * Koda unlocks the moment the choice is made (state = "answered").
   */
  locked?: boolean
}

const GREETING = "Hey! I'm Coda 👋 I can't give you answers — but I can help you think. What's confusing you right now?"

export default function TutorBot({ scene, game, accentColor = "#00d4f0", playerStuck = false, locked = false }: Props) {
  const [isOpen,     setIsOpen]     = useState(false)
  const [messages,   setMessages]   = useState<Message[]>([])
  const [input,      setInput]      = useState("")
  const [loading,    setLoading]    = useState(false)
  const [nudging,    setNudging]    = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const [showIntro,  setShowIntro]  = useState(false)   // one-time "Hi, I'm Coda" bubble
  const scrollRef  = useRef<HTMLDivElement | null>(null)
  const inputRef   = useRef<HTMLInputElement | null>(null)
  const abortRef   = useRef<AbortController | null>(null)

  /* One-time intro — appears on first scene and PERSISTS until the player
     dismisses it (so it's never missed). Marked seen only after dismissal. */
  useEffect(() => {
    try {
      if (localStorage.getItem("coda_intro_seen")) return
    } catch {}
    const showT = setTimeout(() => setShowIntro(true), 1000)   // let scene settle first
    return () => clearTimeout(showT)
  }, [])

  function dismissIntro() {
    setShowIntro(false)
    try { localStorage.setItem("coda_intro_seen", "1") } catch {}
  }

  /* Auto-scroll to bottom when messages arrive */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  /* Focus input when panel opens */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 180)
      if (!hasGreeted) {
        setMessages([{ role: "assistant", content: GREETING }])
        setHasGreeted(true)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  /* Nudge animation when player is stuck (gets a wrong answer) */
  useEffect(() => {
    if (playerStuck && !isOpen) {
      setNudging(true)
      const t = setTimeout(() => setNudging(false), 3000)
      return () => clearTimeout(t)
    }
  }, [playerStuck, isOpen])

  /* Close the panel the moment choices appear — protect the decision */
  useEffect(() => {
    if (locked && isOpen) setIsOpen(false)
  }, [locked, isOpen])

  /* Reset conversation when scene changes */
  useEffect(() => {
    setMessages([])
    setHasGreeted(false)
  }, [scene.id])

  const send = useCallback(async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput("")

    const next: Message[] = [...messages, { role: "user", content: userText }]
    setMessages(next)
    setLoading(true)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/maestro-tutor", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  abortRef.current.signal,
        body: JSON.stringify({
          messages:          next,
          gameTitle:         game.title,
          gameSlug:          game.slug,
          sceneConcept:      scene.concept?.title,
          sceneConceptBody:  scene.concept?.body,
          sceneScenario:     scene.scenarioText,
          sceneQuestion:     scene.question,
          inGame:            true,
        }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: "assistant", content: data.reply ?? "Hmm, something went wrong. Try again?" }])
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setMessages(m => [...m, { role: "assistant", content: "Having trouble connecting right now. Ask me again?" }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, game.title, game.slug, scene.concept, scene.scenarioText, scene.question])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  /* ── Styles (inline — no Tailwind dependency) ─────────────────────────── */
  const glowColor = `${accentColor}55`

  return (
    <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 200 }}>

      {/* ── One-time intro bubble — "Hi, I'm Coda" ───────────────────────── */}
      <AnimatePresence>
        {showIntro && !isOpen && (
          <motion.div
            key="coda-intro"
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{    opacity: 0, y: 14, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{
              position:      "absolute",
              bottom:        "calc(100% + 0.75rem)",
              right:         0,
              width:         "min(86vw, 300px)",
              background:    "rgba(8,6,15,0.98)",
              border:        `1.5px solid ${accentColor}`,
              borderRadius:  "16px 16px 4px 16px",
              padding:       "0.95rem 1rem 0.85rem",
              fontFamily:    "Inter, sans-serif",
              boxShadow:     `0 0 42px ${accentColor}66, 0 12px 40px rgba(0,0,0,0.55)`,
              backdropFilter:"blur(20px)",
              pointerEvents: "auto",
            }}
          >
            <div style={{
              display:"flex", alignItems:"center", gap:"0.45rem", marginBottom:"0.45rem",
            }}>
              <span style={{ fontSize:"1.2rem" }}>👋</span>
              <span style={{
                fontWeight:800, fontSize:"0.72rem", letterSpacing:"0.16em",
                textTransform:"uppercase", color:accentColor,
              }}>
                Meet Coda — your AI tutor
              </span>
            </div>
            <p style={{
              margin:"0 0 0.7rem", fontSize:"0.84rem", lineHeight:1.6, color:"rgba(240,238,255,0.9)",
            }}>
              I&apos;m your thinking partner. I&apos;ll <em>never</em> hand you the answer —
              but tap me any time and I&apos;ll help you reason it out. 🎼
            </p>
            {/* Explicit dismiss — the bubble stays until you tap this */}
            <button
              onClick={dismissIntro}
              style={{
                width:"100%", fontFamily:"Inter, sans-serif", fontWeight:700,
                fontSize:"0.78rem", color:"#08060f",
                background:`linear-gradient(90deg, ${accentColor}, #e040fb)`,
                border:"none", borderRadius:"10px", padding:"0.5rem", cursor:"pointer",
                letterSpacing:"0.02em",
                transition:"filter 0.15s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.filter="brightness(1.1)"; e.currentTarget.style.transform="translateY(-1px)" }}
              onMouseLeave={e => { e.currentTarget.style.filter=""; e.currentTarget.style.transform="" }}
            >
              Got it 👍
            </button>
            {/* little pointer tail toward the bot */}
            <div style={{
              position:"absolute", bottom:"-6px", right:"24px",
              width:"12px", height:"12px",
              background:"rgba(8,6,15,0.98)",
              borderRight:`1.5px solid ${accentColor}`,
              borderBottom:`1.5px solid ${accentColor}`,
              transform:"rotate(45deg)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tooltips & Bubbles ─────────────────────────────────────────── */}
      <AnimatePresence>
        {(!isOpen && !locked && !nudging && !showIntro) && (
          <motion.div
            key="ask-coda-bubble"
            initial={{ opacity: 0, x: 12, scale: 0.88 }}
            animate={{ opacity: 1, x: 0,   scale: 1    }}
            exit={{    opacity: 0, x: 12, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            style={{
              position:      "absolute",
              right:         "calc(100% + 0.8rem)",
              bottom:        "20px",
              background:    "rgba(8,6,15,0.96)",
              border:        `1.5px solid ${accentColor}`,
              borderRadius:  "12px 12px 4px 12px",
              padding:       "0.5rem 0.85rem",
              whiteSpace:    "nowrap",
              fontFamily:    "Inter, sans-serif",
              fontSize:      "0.76rem",
              fontWeight:    800,
              color:         "#fff",
              boxShadow:     `0 0 20px ${glowColor}`,
              pointerEvents: "none",
            }}
          >
            Ask Coda 👋
            {/* tail pointing right */}
            <div style={{
              position:      "absolute",
              top:           "50%",
              right:         "-6px",
              transform:     "translateY(-50%) rotate(45deg)",
              width:         "8px",
              height:        "8px",
              background:    "rgba(8,6,15,0.96)",
              borderTop:     `1.5px solid ${accentColor}`,
              borderRight:    `1.5px solid ${accentColor}`,
            }} />
          </motion.div>
        )}
        {(nudging && !isOpen && !locked) && (
          <motion.div
            key="nudge"
            initial={{ opacity: 0, x: 12, scale: 0.88 }}
            animate={{ opacity: 1, x: 0,   scale: 1    }}
            exit={{    opacity: 0, x: 12, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            style={{
              position:      "absolute",
              right:         "calc(100% + 0.8rem)",
              bottom:        "20px",
              background:    "rgba(8,6,15,0.94)",
              border:        `1px solid ${accentColor}44`,
              borderRadius:  "12px 12px 4px 12px",
              padding:       "0.5rem 0.85rem",
              whiteSpace:    "nowrap",
              fontFamily:    "Inter, sans-serif",
              fontSize:      "0.72rem",
              color:         "rgba(240,238,255,0.8)",
              boxShadow:     `0 0 20px ${glowColor}`,
              pointerEvents: "none",
            }}
          >
            💡 Need a clue? Ask me!
            {/* tail pointing right */}
            <div style={{
              position:      "absolute",
              top:           "50%",
              right:         "-5px",
              transform:     "translateY(-50%) rotate(45deg)",
              width:         "8px",
              height:        "8px",
              background:    "rgba(8,6,15,0.94)",
              borderTop:     `1px solid ${accentColor}44`,
              borderRight:    `1px solid ${accentColor}44`,
            }} />
          </motion.div>
        )}
        {locked && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, x: 12, scale: 0.88 }}
            animate={{ opacity: 1, x: 0,   scale: 1    }}
            exit={{    opacity: 0, x: 12, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            style={{
              position:      "absolute",
              right:         "calc(100% + 0.8rem)",
              bottom:        "20px",
              background:    "rgba(8,6,15,0.94)",
              border:        "1px solid rgba(255,255,255,0.1)",
              borderRadius:  "12px 12px 4px 12px",
              padding:       "0.5rem 0.85rem",
              whiteSpace:    "nowrap",
              fontFamily:    "Inter, sans-serif",
              fontSize:      "0.72rem",
              color:         "rgba(240,238,255,0.4)",
              pointerEvents: "none",
            }}
          >
            🔒 Make your choice first
            {/* tail pointing right */}
            <div style={{
              position:      "absolute",
              top:           "50%",
              right:         "-5px",
              transform:     "translateY(-50%) rotate(45deg)",
              width:         "8px",
              height:        "8px",
              background:    "rgba(8,6,15,0.94)",
              borderTop:     "1px solid rgba(255,255,255,0.1)",
              borderRight:   "1px solid rgba(255,255,255,0.1)",
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="tutor-panel"
            initial={{ opacity: 0, y: 18, scale: 0.93 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 18, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              position:       "absolute",
              bottom:         "calc(100% + 0.75rem)",
              right:          0,
              width:          "clamp(280px, 90vw, 340px)",
              background:     "rgba(8,6,15,0.96)",
              border:         `1px solid ${accentColor}33`,
              borderRadius:   "20px",
              overflow:       "hidden",
              boxShadow:      `0 0 40px ${glowColor}, 0 16px 48px rgba(0,0,0,0.6)`,
              backdropFilter: "blur(24px)",
            }}
          >

            {/* Header */}
            <div style={{
              display:         "flex",
              alignItems:      "center",
              gap:             "0.65rem",
              padding:         "0.85rem 1rem 0.75rem",
              borderBottom:    `1px solid rgba(255,255,255,0.07)`,
              background:      `linear-gradient(135deg, ${accentColor}0a 0%, transparent 100%)`,
            }}>
              {/* Tiny robot avatar */}
              <div style={{
                width:        "32px",
                height:       "32px",
                borderRadius: "50%",
                overflow:     "hidden",
                flexShrink:   0,
                background:   "rgba(0,0,0,0.4)",
                border:       `1px solid ${accentColor}44`,
              }}>
                <img
                  src="/images/ai-tutor.png"
                  alt="Coda"
                  style={{
                    width:     "100%",
                    height:    "100%",
                    objectFit: "cover",
                    mixBlendMode: "screen" as React.CSSProperties["mixBlendMode"],
                    transform: "scale(1.15)",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily:    "Inter, sans-serif",
                  fontWeight:    800,
                  fontSize:      "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color:         accentColor,
                }}>
                  Coda · AI Tutor
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize:   "0.6rem",
                  color:      "rgba(240,238,255,0.3)",
                  marginTop:  "0.1rem",
                }}>
                  Clues only — the answer is yours to find
                </div>
              </div>
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background:  "none",
                  border:      "none",
                  cursor:      "pointer",
                  color:       "rgba(240,238,255,0.3)",
                  fontSize:    "1rem",
                  lineHeight:  1,
                  padding:     "0.15rem",
                  flexShrink:  0,
                  transition:  "color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,238,255,0.3)" }}
              >
                ×
              </button>
            </div>

            {/* Current concept chip (context anchor) */}
            {scene.concept?.title && (
              <div style={{
                padding:    "0.45rem 1rem",
                background: `${accentColor}08`,
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
              }}>
                <span style={{
                  fontFamily:    "Inter, sans-serif",
                  fontSize:      "0.58rem",
                  fontWeight:    700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color:         `${accentColor}88`,
                }}>
                  Topic: {scene.concept.title}
                </span>
              </div>
            )}

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                maxHeight:   "260px",
                overflowY:   "auto",
                padding:     "0.85rem 1rem",
                display:     "flex",
                flexDirection: "column",
                gap:          "0.65rem",
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display:       "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth:     "85%",
                    padding:      "0.55rem 0.85rem",
                    borderRadius: msg.role === "user"
                      ? "14px 14px 4px 14px"
                      : "14px 14px 14px 4px",
                    background: msg.role === "user"
                      ? `linear-gradient(135deg, ${accentColor}33, ${accentColor}1a)`
                      : "rgba(255,255,255,0.05)",
                    border: msg.role === "user"
                      ? `1px solid ${accentColor}44`
                      : "1px solid rgba(255,255,255,0.08)",
                    fontFamily:  "Inter, sans-serif",
                    fontSize:    "0.8rem",
                    color:       msg.role === "user" ? "rgba(240,238,255,0.9)" : "rgba(240,238,255,0.78)",
                    lineHeight:  1.55,
                  }}>
                    {msg.content.split("**").map((chunk, idx) => (
                      idx % 2 === 1 ? <strong key={idx} style={{ color: accentColor, fontWeight: 800, textShadow: `0 0 6px ${accentColor}55` }}>{chunk}</strong> : chunk
                    ))}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding:      "0.55rem 0.85rem",
                    borderRadius: "14px 14px 14px 4px",
                    background:   "rgba(255,255,255,0.05)",
                    border:       "1px solid rgba(255,255,255,0.08)",
                    display:      "flex",
                    gap:          "4px",
                    alignItems:   "center",
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width:     "5px",
                        height:    "5px",
                        borderRadius: "50%",
                        background: accentColor,
                        opacity:   0.6,
                        animation: `tutor-dot-pulse 1.2s ${i * 0.18}s ease-in-out infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding:      "0.65rem 0.85rem",
              borderTop:    "1px solid rgba(255,255,255,0.07)",
              display:      "flex",
              gap:          "0.5rem",
              alignItems:   "center",
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask a question..."
                maxLength={300}
                style={{
                  flex:        1,
                  background:  "rgba(255,255,255,0.05)",
                  border:      `1px solid ${input.trim() ? accentColor + "44" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "10px",
                  padding:     "0.5rem 0.75rem",
                  fontFamily:  "Inter, sans-serif",
                  fontSize:    "0.8rem",
                  color:       "#fff",
                  outline:     "none",
                  transition:  "border-color 0.2s",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = `${accentColor}66` }}
                onBlur={e => { e.currentTarget.style.borderColor = input.trim() ? `${accentColor}44` : "rgba(255,255,255,0.1)" }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                style={{
                  width:        "34px",
                  height:       "34px",
                  borderRadius: "50%",
                  border:       "none",
                  background:   input.trim() && !loading
                    ? `linear-gradient(135deg, ${accentColor}, #e040fb)`
                    : "rgba(255,255,255,0.08)",
                  cursor:       input.trim() && !loading ? "pointer" : "default",
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                  flexShrink:   0,
                  transition:   "background 0.2s, transform 0.15s",
                  fontSize:     "0.85rem",
                }}
                onMouseEnter={e => { if (input.trim() && !loading) e.currentTarget.style.transform = "scale(1.08)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "" }}
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating bot button ────────────────────────────────────────────── */}
      <motion.button
        onClick={() => { if (!locked) { if (showIntro) dismissIntro(); setIsOpen(o => !o) } }}
        animate={nudging && !isOpen && !locked
          ? { y: [0, -10, 0, -6, 0], rotate: [0, -5, 5, -3, 0] }
          : { y: [0, -9, 0] }
        }
        transition={nudging && !isOpen && !locked
          ? { duration: 0.7, repeat: 3, ease: "easeInOut" }
          : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
        }
        style={{
          width:        "72px",
          height:       "72px",
          borderRadius: "50%",
          border:       locked
            ? "2px solid rgba(255,255,255,0.1)"
            : `2px solid ${isOpen ? accentColor + "88" : accentColor + "44"}`,
          background:   locked
            ? "rgba(8,6,15,0.6)"
            : isOpen
              ? `radial-gradient(circle at 40% 35%, ${accentColor}22 0%, rgba(8,6,15,0.9) 70%)`
              : "rgba(8,6,15,0.85)",
          cursor:         locked ? "not-allowed" : "pointer",
          overflow:       "hidden",
          position:       "relative",
          opacity:        locked ? 0.45 : 1,
          boxShadow:      locked ? "none" : isOpen
            ? `0 0 32px ${glowColor}, 0 0 0 3px ${accentColor}22`
            : `0 0 20px ${glowColor}`,
          backdropFilter: "blur(12px)",
          transition:     "border-color 0.25s, background 0.25s, box-shadow 0.25s, opacity 0.35s",
          padding:        0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
        onMouseEnter={e => {
          if (locked) return
          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 36px ${glowColor}, 0 0 0 3px ${accentColor}33`
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = `${accentColor}88`
        }}
        onMouseLeave={e => {
          if (locked) return
          (e.currentTarget as HTMLButtonElement).style.boxShadow = isOpen
            ? `0 0 32px ${glowColor}, 0 0 0 3px ${accentColor}22`
            : `0 0 20px ${glowColor}`
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = isOpen ? `${accentColor}88` : `${accentColor}44`
        }}
        aria-label={locked ? "Coda is waiting — make your choice first" : "Ask Coda, your AI tutor"}
        title={locked ? "Make your choice first" : "Ask Coda, your AI tutor"}
      >
        <img
          src="/images/ai-tutor.png"
          alt="Coda the AI Tutor"
          style={{
            width:        "100%",
            height:       "100%",
            objectFit:    "cover",
            objectPosition: "center",
            mixBlendMode: "screen" as React.CSSProperties["mixBlendMode"],
            transform:    "scale(1.1)",
          }}
        />

        {/* Unread badge — shown when there are unseen tutor messages */}
        {!isOpen && hasGreeted && messages.length > 0 && (
          <div style={{
            position:     "absolute",
            top:          "2px",
            right:        "2px",
            width:        "12px",
            height:       "12px",
            borderRadius: "50%",
            background:   "#e040fb",
            border:       "2px solid rgba(8,6,15,0.9)",
            boxShadow:    "0 0 8px rgba(224,64,251,0.6)",
          }} />
        )}
      </motion.button>

      {/* Dot-pulse keyframes injected once */}
      <style>{`
        @keyframes tutor-dot-pulse {
          0%,100% { transform:scale(0.7); opacity:0.4; }
          50%     { transform:scale(1.2); opacity:1; }
        }
      `}</style>
    </div>
  )
}
