"use client"

import { useState, useEffect, useRef } from "react"

type Message = { role: "user" | "assistant"; content: string }

type Props = {
  game: { slug: string; title: string; free: boolean; accentColor?: string }
  onClose: () => void
}

const MAX_DIRECT = 3  // escape hatch uses per session

/* ── Opening message from Maestro ─────────────────────────────────────────── */
const OPENING_MESSAGES: Record<string, string> = {
  "welcome-to-ai":          "You spent time inside a story about Jake and what happens when you give an orchestra no direction. Before you leave — what does 'conducting AI' actually mean to you now? Not the definition. What you feel when you imagine doing it.",
  "how-ai-works":           "You saw how the model predicts, hallucinates, and operates within a context window. Here's what I want to know: if AI doesn't 'know' anything — where does its usefulness actually come from?",
  "ai-for-professionals":   "Carlos was drowning. Three hours of email, board meeting looming. What made the difference in the story — and why do most professionals fail to make that same move?",
  "the-conductor-test":     "You passed the conductor's test. But here's the real one: if someone asked you right now to explain prompt engineering to a skeptic, how would you begin?",
  "claude-chat-unlocked":   "You've seen how Claude differs from a search engine. My question is simpler than you think: what's one thing you'd actually use it for this week?",
  "claude-code-unlocked":   "Kai shipped features four times faster. What exactly changed in how he thought about his work — not the tool, the thinking?",
  "claude-for-work":        "Priya had 12 manual workflows. What made AI the right solution there, and where would it have been the wrong one?",
  "chatgpt-mastery":        "Alex used it like a search engine. What specifically would have to change in how he prompted for it to become a genuine thought partner?",
  "gemini-unlocked":        "Luna's instinct is better than any algorithm. How do you think about the relationship between genuine expertise and AI assistance?",
  "gemini-cli-unlocked":    "Sam built systems by hand for fifteen years. What's the risk of making things too fast — and how do you guard against it?",
  "microsoft-copilot":      "Copilot appeared in the toolbar. What's the difference between a tool that's present and a tool that's actually used well?",
  "copilot-studio":         "No code. Your own AI agent. What would you actually build — and what would be the one thing that could go wrong?",
}

function getOpening(slug: string): string {
  return OPENING_MESSAGES[slug] ?? "You finished the game. Before you go — what's the one thing that actually surprised you in there?"
}

/* ── Keyframes ────────────────────────────────────────────────────────────── */
function ensureKf() {
  if (typeof document === "undefined") return
  const id = "tutor-kf"
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = `
    @keyframes tutor-slide-in {
      from { opacity:0; transform:translateY(32px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes tutor-msg-in {
      from { opacity:0; transform:translateX(-8px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes tutor-thinking {
      0%,100% { opacity:0.35; }
      50%     { opacity:1; }
    }
  `
  document.head.appendChild(s)
}

/* ── Message bubble ───────────────────────────────────────────────────────── */
function Bubble({ msg, accentColor }: { msg: Message; accentColor: string }) {
  const isUser = msg.role === "user"
  return (
    <div style={{
      display:       "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom:  "0.85rem",
      animation:     "tutor-msg-in 0.35s ease both",
    }}>
      {!isUser && (
        <div style={{
          width:"28px", height:"28px", borderRadius:"50%", flexShrink:0,
          background:`linear-gradient(135deg, ${accentColor}, #e040fb)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"0.75rem", marginRight:"0.6rem", alignSelf:"flex-end",
        }}>
          🎼
        </div>
      )}
      <div style={{
        maxWidth:     "78%",
        background:   isUser ? `${accentColor}18` : "rgba(255,255,255,0.04)",
        border:       `1px solid ${isUser ? accentColor + "44" : "rgba(255,255,255,0.1)"}`,
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding:      "0.7rem 1rem",
      }}>
        <p style={{
          fontFamily:"Inter, sans-serif", fontSize:"0.875rem", lineHeight:1.65,
          color: isUser ? "rgba(240,238,255,0.9)" : "#fff",
          margin: 0,
          fontStyle: isUser ? "normal" : "normal",
        }}>
          {msg.content}
        </p>
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function MaestroTutor({ game, onClose }: Props) {
  useEffect(() => { ensureKf() }, [])

  const accentColor   = game.accentColor ?? "#00d4f0"
  const opening       = getOpening(game.slug)

  const [messages,    setMessages]    = useState<Message[]>([
    { role: "assistant", content: opening }
  ])
  const [input,       setInput]       = useState("")
  const [loading,     setLoading]     = useState(false)
  const [directLeft,  setDirectLeft]  = useState(MAX_DIRECT)
  const bottomRef  = useRef<HTMLDivElement | null>(null)
  const inputRef   = useRef<HTMLTextAreaElement | null>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const isDirect = (text: string) =>
    /\b(give me the answer|i need the (direct )?answer|just tell me|direct answer)\b/i.test(text)

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const direct = isDirect(text) && directLeft > 0
    if (direct) setDirectLeft(d => d - 1)

    const newMessages: Message[] = [...messages, { role: "user" as const, content: text }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/maestro-tutor", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages:  newMessages,
          gameTitle: game.title,
          gameSlug:  game.slug,
          direct,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "The Maestro has stepped away momentarily. Try again in a moment." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{
      position:      "fixed", inset:0, zIndex:350,
      background:    "rgba(8,6,15,0.92)",
      backdropFilter:"blur(24px)",
      display:       "flex", alignItems:"flex-end", justifyContent:"center",
      padding:       "0",
    }}>
      <div style={{
        width:"100%", maxWidth:"720px",
        background:"rgba(10,7,20,0.99)",
        borderTop:`2px solid ${accentColor}55`,
        borderRadius:"24px 24px 0 0",
        display:"flex", flexDirection:"column",
        height:"75vh", maxHeight:"640px",
        animation:"tutor-slide-in 0.42s cubic-bezier(0.34,1.1,0.64,1) both",
        boxShadow:`0 -20px 80px ${accentColor}12, 0 -4px 24px rgba(0,0,0,0.5)`,
      }}>

        {/* Header */}
        <div style={{
          padding:"1rem 1.25rem 0.85rem",
          borderBottom:"1px solid rgba(255,255,255,0.07)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
            <div style={{
              width:"36px", height:"36px", borderRadius:"50%",
              background:`linear-gradient(135deg, ${accentColor}, #e040fb)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1rem", boxShadow:`0 0 18px ${accentColor}44`,
            }}>
              🎼
            </div>
            <div>
              <div style={{ fontFamily:"Inter, sans-serif", fontWeight:800, fontSize:"0.88rem", color:"#fff" }}>
                The Maestro
              </div>
              <div style={{ fontFamily:"Inter, sans-serif", fontSize:"0.62rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.06em" }}>
                Socratic AI Tutor · Pro Feature
              </div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            {/* Direct answer counter */}
            <div style={{
              fontFamily:"Inter, sans-serif", fontSize:"0.65rem",
              color:directLeft > 0 ? "rgba(240,238,255,0.4)" : "rgba(255,80,80,0.5)",
              letterSpacing:"0.06em",
            }}>
              {directLeft}/{MAX_DIRECT} direct answers left
            </div>
            <button
              onClick={onClose}
              style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(240,238,255,0.35)", fontSize:"1.1rem", lineHeight:1, transition:"color 0.2s", padding:"0.25rem" }}
              onMouseEnter={e => (e.currentTarget.style.color="rgba(240,238,255,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color="rgba(240,238,255,0.35)")}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"1.25rem 1.25rem 0.5rem", scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.08) transparent" }}>
          {messages.map((m, i) => (
            <Bubble key={i} msg={m} accentColor={accentColor} />
          ))}
          {loading && (
            <div style={{ display:"flex", gap:"0.6rem", marginBottom:"0.85rem" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", flexShrink:0, background:`linear-gradient(135deg, ${accentColor}, #e040fb)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", alignSelf:"flex-end" }}>🎼</div>
              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"18px 18px 18px 4px", padding:"0.7rem 1rem", display:"flex", alignItems:"center", gap:"0.35rem" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:accentColor, animation:`tutor-thinking 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Hint */}
        <div style={{ padding:"0.4rem 1.25rem 0", fontFamily:"Inter, sans-serif", fontSize:"0.62rem", color:"rgba(240,238,255,0.25)", letterSpacing:"0.06em" }}>
          Say "give me the answer" to use a direct answer ({directLeft} left)
        </div>

        {/* Input */}
        <div style={{
          padding:"0.75rem 1.25rem 1.25rem",
          display:"flex", gap:"0.6rem", alignItems:"flex-end", flexShrink:0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Respond to the Maestro…"
            rows={2}
            style={{
              flex:1, resize:"none",
              fontFamily:"Inter, sans-serif", fontSize:"0.9rem", lineHeight:1.55,
              color:"#fff",
              background:"rgba(255,255,255,0.04)",
              border:`1.5px solid ${input ? accentColor + "55" : "rgba(255,255,255,0.1)"}`,
              borderRadius:"14px",
              padding:"0.7rem 1rem",
              outline:"none",
              transition:"border-color 0.2s",
              scrollbarWidth:"none",
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width:"44px", height:"44px", borderRadius:"50%", flexShrink:0,
              background: input.trim() && !loading
                ? `linear-gradient(135deg, ${accentColor}, #e040fb)`
                : "rgba(255,255,255,0.06)",
              border:"none", cursor: input.trim() && !loading ? "pointer" : "default",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.1rem",
              transition:"background 0.2s, box-shadow 0.2s",
              boxShadow: input.trim() && !loading ? `0 0 20px ${accentColor}44` : "none",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
