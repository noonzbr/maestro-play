"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Game } from "@/lib/games/types"

// ─── Problem hooks — what each character faces BEFORE they learn ──────────────

const HOOKS: Record<number, string> = {
  1:  "While Jake perfected one riff for weeks, his rival dropped an AI-assisted EP. Same talent. One method makes the difference.",
  2:  "Zoe spends three hours on AI sessions that should take twenty minutes. She understands music — not how the model actually thinks.",
  3:  "47 unread emails. Board meeting in 3 hours. Carlos is drowning while his AI-fluent colleagues run circles around him.",
  4:  "Aria trained 20 years to master the violin. AI now composes symphonies in minutes. She must find what the machine can never replicate.",
  5:  "Jordan asked Claude for strategic help and got generic blog-post advice. She didn't know how to unlock what it's actually capable of.",
  6:  "Kai writes clean code. His colleague ships the same features 4× faster using Claude Code. Same salary. Radically different trajectory.",
  7:  "Priya handles 12 workflows manually that AI could run in twenty minutes — if she knew how to build the pipeline.",
  8:  "Alex uses ChatGPT like a search engine and gets search engine results. The version of him who treats it as a thought partner books 40% more clients.",
  9:  "Luna's ear is better than any algorithm. But algorithms are booking gigs and scoring films. Instinct plus AI beats instinct alone.",
  10: "Sam built complex systems by hand for 15 years. AI prototypes them in hours now. The builder who becomes the architect is the one who survives.",
  11: "Copilot appeared in Jake's Office 365 toolbar. His manager now expects an AI productivity report. He has 48 hours to figure out what it actually does.",
  12: "Jake wants to build AI tools without writing code. Copilot Studio promises no-code agents. The gap between promise and reality is exactly where this game lives.",
}

// ─── Track definitions ────────────────────────────────────────────────────────

const TRACKS = [
  {
    number: "01",
    name: "AI Fundamentals",
    color: "#00d4f0",
    weeks: [1, 2, 3, 4],
    tagline: "Before you can conduct, you have to hear the music.",
    cert: "AI Foundations",
  },
  {
    number: "02",
    name: "Claude & Prompt Mastery",
    color: "#e040fb",
    weeks: [5, 6, 7, 8],
    tagline: "Stop describing. Start conducting.",
    cert: "Claude Expert",
  },
  {
    number: "03",
    name: "The AI Toolkit",
    color: "#00e676",
    weeks: [9, 10],
    tagline: "Every instrument matters. Know which one to pick.",
    cert: "AI Explorer",
  },
  {
    number: "04",
    name: "Microsoft AI",
    color: "#4488ff",
    weeks: [11, 12],
    tagline: "The AI is already in your tools. Start using it.",
    cert: "Microsoft AI",
  },
]

// ─── GameCard ─────────────────────────────────────────────────────────────────

function GameCard({ game, hook, color }: { game: Game; hook: string; color: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/games/${game.slug}`}
      style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start", display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "272px",
          height: "436px",
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",
          background: "#0c0a14",
          border: `1px solid ${hovered ? color + "88" : "rgba(255,255,255,0.07)"}`,
          boxShadow: hovered ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${color}22` : "0 4px 24px rgba(0,0,0,0.3)",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Character photo ──────────────────────────────────────── */}
        <div style={{ height: "58%", position: "relative", flexShrink: 0, background: "#0c0a14" }}>
          {game.characterImage ? (
            <img
              src={game.characterImage}
              alt={game.characterName || game.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: `linear-gradient(160deg, ${color}14, #0c0a14)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "4rem", color: `${color}44`, userSelect: "none" }}>
                {game.characterName?.[0] ?? "?"}
              </span>
            </div>
          )}

          {/* Gradient — image fades into content area */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 25%, rgba(12,10,20,0.35) 60%, rgba(12,10,20,0.97) 100%)",
            pointerEvents: "none",
          }} />

          {/* Game number badge — top left */}
          <div style={{
            position: "absolute", top: "0.65rem", left: "0.65rem",
            background: `${color}18`, border: `1px solid ${color}44`,
            borderRadius: "100px", padding: "0.18rem 0.55rem",
          }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color }}>
              Game {game.week}
            </span>
          </div>

          {/* Free badge — top right */}
          {game.free && (
            <div style={{
              position: "absolute", top: "0.65rem", right: "0.65rem",
              background: "rgba(0,255,128,0.1)", border: "1px solid rgba(0,255,128,0.28)",
              borderRadius: "100px", padding: "0.18rem 0.55rem",
            }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#00ff80" }}>
                Free
              </span>
            </div>
          )}

          {/* Character name overlay — bottom of photo */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0.9rem 0.7rem" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#fff", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {game.characterName || game.title}
            </p>
            {game.characterRole && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "rgba(240,238,255,0.45)", margin: "0.15rem 0 0", letterSpacing: "0.06em" }}>
                {game.characterRole}
              </p>
            )}
          </div>
        </div>

        {/* ── Content area ─────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0.65rem 0.9rem 0.85rem" }}>
          {/* Game title */}
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#fff", margin: "0 0 0.45rem", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
            {game.title}
          </p>

          {/* Hook — sells the problem */}
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "0.83rem", color: "rgba(240,238,255,0.5)", lineHeight: 1.65, flex: 1, margin: "0 0 0.65rem" }}>
            {hook || game.description}
          </p>

          {/* Bottom row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.65rem", color: "rgba(240,238,255,0.3)", letterSpacing: "0.06em" }}>
              {game.duration}
            </span>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.75rem",
              color: "#08060f", background: hovered ? color : `${color}cc`,
              padding: "0.35rem 0.9rem", borderRadius: "100px",
              transition: "background 0.2s ease",
              letterSpacing: "0.04em",
            }}>
              Play →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Cert node (end of each track) ───────────────────────────────────────────

function CertNode({ track }: { track: typeof TRACKS[0] }) {
  return (
    <div style={{
      width: "140px", height: "436px", flexShrink: 0, scrollSnapAlign: "start",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "0.65rem", padding: "0 1rem",
    }}>
      {/* Connector line */}
      <div style={{ width: "1px", height: "60px", background: `linear-gradient(180deg, transparent, ${track.color}55)` }} />
      {/* Badge */}
      <div style={{
        width: "56px", height: "56px", borderRadius: "50%",
        background: `${track.color}12`, border: `1.5px solid ${track.color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 24px ${track.color}22`,
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke={track.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: track.color, margin: "0 0 0.2rem" }}>
          {track.cert}
        </p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.55rem", color: "rgba(240,238,255,0.25)", margin: 0, letterSpacing: "0.05em" }}>
          Certificate
        </p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = { games: Game[] }

export default function PathwayPage({ games }: Props) {
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([])

  const scroll = (idx: number, dir: number) => {
    const el = scrollRefs.current[idx]
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: "smooth" })
  }

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── HERO — sells the problem ─────────────────────────────────────── */}
      <section style={{ padding: "7rem 2rem 5rem", textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem",
          letterSpacing: "0.38em", textTransform: "uppercase",
          color: "rgba(0,212,240,0.65)", marginBottom: "1.75rem",
        }}>
          The Curriculum
        </div>

        <h1 style={{
          fontFamily: "Cormorant Garamond, serif", fontWeight: 700,
          fontSize: "clamp(2.8rem, 7vw, 5rem)", color: "#fff",
          lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: "1.5rem",
        }}>
          Everyone&apos;s using AI.
          <br />
          <em style={{ color: "rgba(240,238,255,0.55)" }}>Almost nobody&apos;s using it right.</em>
        </h1>

        {/* Problem narrative block */}
        <div style={{
          maxWidth: "640px", margin: "0 auto 2.5rem",
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px", padding: "1.5rem 2rem",
          textAlign: "left",
        }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.55)", lineHeight: 1.85, margin: "0 0 1rem" }}>
            Jake&apos;s rival released an AI-assisted EP while Jake spent three weeks on a single riff.
            Carlos&apos;s colleague cleared her inbox in 20 minutes while Carlos drowned in 47 emails.
            Priya&apos;s replacement will manage 200 workflows where Priya manages 12.
          </p>
          <p style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "#fff", lineHeight: 1.6, margin: 0 }}>
            The tool is the same. The method is everything.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {[
            { stat: "12", label: "Characters. 12 real situations." },
            { stat: "4", label: "Tracks. One complete method." },
            { stat: "0", label: "Code required. Ever." },
          ].map(({ stat, label }) => (
            <div key={stat} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "2.5rem", color: "var(--cyan)", lineHeight: 1 }}>
                {stat}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(240,238,255,0.4)", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/games/welcome-to-ai"
          style={{
            display: "inline-block",
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem",
            color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)",
            padding: "0.9rem 2.5rem", borderRadius: "100px", textDecoration: "none",
            boxShadow: "0 0 32px rgba(0,212,240,0.2)",
          }}
        >
          Start the First Game Free →
        </Link>
      </section>

      {/* ── TRACKS ──────────────────────────────────────────────────────────── */}
      {TRACKS.map((track, ti) => {
        const trackGames = games.filter(g => track.weeks.includes(g.week))
        if (trackGames.length === 0) return null

        return (
          <section
            key={track.number}
            style={{ padding: "3.5rem 0 4rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {/* Track header */}
            <div style={{ padding: "0 2rem", maxWidth: "1400px", margin: "0 auto 1.75rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: "Cormorant Garamond, serif", fontWeight: 700,
                  fontSize: "3.5rem", color: `${track.color}14`, lineHeight: 1,
                  userSelect: "none",
                }}>
                  {track.number}
                </span>
                <div>
                  <h2 style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 800,
                    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "#fff",
                    margin: 0, letterSpacing: "-0.02em",
                  }}>
                    {track.name}
                  </h2>
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                    fontSize: "1rem", color: `${track.color}99`,
                    margin: "0.2rem 0 0",
                  }}>
                    {track.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Carousel wrapper */}
            <div style={{ position: "relative" }}>
              {/* Left arrow */}
              <button
                onClick={() => scroll(ti, -1)}
                aria-label="Scroll left"
                style={{
                  position: "absolute", left: "0.5rem", top: "50%",
                  transform: "translateY(-50%)", zIndex: 20,
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(12,10,20,0.85)", border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  color: "rgba(240,238,255,0.7)", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = track.color; e.currentTarget.style.color = track.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}
              >
                ←
              </button>

              {/* Scrollable row */}
              <div
                ref={el => { scrollRefs.current[ti] = el }}
                style={{
                  display: "flex",
                  gap: "1rem",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                  padding: "0.5rem 3rem",
                  // Edge fades
                  maskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
                } as React.CSSProperties}
              >
                {trackGames.map(game => (
                  <GameCard
                    key={game.slug}
                    game={game}
                    hook={HOOKS[game.week] || game.description}
                    color={track.color}
                  />
                ))}
                <CertNode track={track} />
              </div>

              {/* Right arrow */}
              <button
                onClick={() => scroll(ti, 1)}
                aria-label="Scroll right"
                style={{
                  position: "absolute", right: "0.5rem", top: "50%",
                  transform: "translateY(-50%)", zIndex: 20,
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "rgba(12,10,20,0.85)", border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  color: "rgba(240,238,255,0.7)", cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = track.color; e.currentTarget.style.color = track.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}
              >
                →
              </button>
            </div>
          </section>
        )
      })}

      {/* ── CLOSING CTA ─────────────────────────────────────────────────────── */}
      <section style={{
        textAlign: "center", padding: "5rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.2, marginBottom: "0.75rem" }}>
          The orchestra is ready.
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(240,238,255,0.4)", marginBottom: "2rem" }}>
          Game 1 is free. No signup. Start in thirty seconds.
        </p>
        <Link
          href="/games/welcome-to-ai"
          style={{
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.95rem",
            color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)",
            padding: "0.9rem 2.5rem", borderRadius: "100px", textDecoration: "none",
          }}
        >
          Play Game 1 Free →
        </Link>
      </section>
    </div>
  )
}
