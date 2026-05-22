"use client"

import { useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Game } from "@/lib/games/types"

// ─── Track definitions ───────────────────────────────────────────────────────

const TRACKS = [
  {
    id: "ai-fundamentals",
    number: "01",
    name: "AI Fundamentals",
    color: "#00d4f0",
    description:
      "Build your foundation. Understand how AI thinks, craft prompts that actually work, and apply AI to real professional tasks.",
    certification: "AI Foundations",
    weeks: [1, 2, 3, 4],
  },
  {
    id: "claude-mastery",
    number: "02",
    name: "Claude & Prompt Mastery",
    color: "#e040fb",
    description:
      "Go deep with Claude. Code generation, creative writing, research workflows, and the prompt frameworks pros use every day.",
    certification: "Claude Expert",
    weeks: [5, 6, 7],
  },
  {
    id: "ai-toolkit",
    number: "03",
    name: "The AI Toolkit",
    color: "#00e676",
    description:
      "Expand beyond Claude. Midjourney, Gemini, Perplexity, and every tool that separates AI-fluent professionals from the rest.",
    certification: "AI Explorer",
    weeks: [8, 9, 10],
  },
  {
    id: "microsoft-ai",
    number: "04",
    name: "Microsoft AI",
    color: "#0078d4",
    description:
      "Own the AI already inside Microsoft 365. Copilot, Copilot Studio, and your first no-code AI agent — deployed.",
    certification: "Microsoft AI",
    weeks: [11, 12],
  },
]

// ─── Individual pathway card ─────────────────────────────────────────────────

function PathwayCard({
  game,
  trackColor,
  purchased,
}: {
  game: Game
  trackColor: string
  purchased?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isLocked = !game.free && !purchased
  const href = isLocked ? `/checkout/${game.slug}` : `/games/${game.slug}`
  const accent = game.accentColor ?? trackColor

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateY(-8px) scale(1.02)`
    el.style.boxShadow = `0 24px 64px ${accent}30, 0 0 0 1px ${accent}45, inset 0 1px 0 rgba(255,255,255,0.08)`
  }, [accent])

  const onLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = ""
    el.style.boxShadow = `0 4px 20px ${accent}12`
  }, [accent])

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {/* Node on path line */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* The card itself */}
        <Link href={href} style={{ textDecoration: "none", display: "block" }}>
          <div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              background: "rgba(12, 8, 22, 0.92)",
              border: `1px solid ${accent}30`,
              borderRadius: "20px",
              padding: "1.5rem",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.1s ease, box-shadow 0.3s ease",
              boxShadow: `0 4px 20px ${accent}12`,
              width: "230px",
              minHeight: "290px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top accent bar */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, transparent, ${accent}cc, transparent)`,
            }} />

            {/* Glow orb behind character */}
            <div style={{
              position: "absolute",
              bottom: "-30px", right: "-30px",
              width: "140px", height: "140px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            {/* Faded character image */}
            {game.characterImage && (
              <div style={{
                position: "absolute",
                bottom: 0, right: "-8px",
                width: "110px", height: "150px",
                opacity: 0.14,
                maskImage: "linear-gradient(135deg, transparent 20%, black 80%)",
                WebkitMaskImage: "linear-gradient(135deg, transparent 20%, black 80%)",
                pointerEvents: "none",
              }}>
                <Image
                  src={game.characterImage}
                  alt=""
                  fill
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                />
              </div>
            )}

            {/* Week badge */}
            <div style={{
              position: "absolute",
              top: "1.1rem", right: "1.1rem",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700, fontSize: "0.55rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: accent, opacity: 0.8,
              background: `${accent}18`,
              padding: "0.15rem 0.5rem",
              borderRadius: "100px",
              border: `1px solid ${accent}28`,
            }}>
              #{game.week}
            </div>

            {/* Lock overlay */}
            {isLocked && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "20px",
                background: "rgba(8,6,15,0.75)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)", zIndex: 3,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: "0.35rem" }}>🔒</div>
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700, fontSize: "0.8rem", color: accent,
                  }}>
                    ${game.price?.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Emoji */}
            <div style={{ fontSize: "1.8rem", marginBottom: "0.65rem" }}>{game.emoji}</div>

            {/* Title */}
            <h3 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700, fontSize: "0.9rem",
              color: "#fff", lineHeight: 1.35,
              marginBottom: "0.6rem",
              paddingRight: "2rem",
            }}>
              {game.title}
            </h3>

            {/* Character name */}
            {game.characterName && (
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700, fontSize: "0.75rem",
                color: accent, marginBottom: "0.2rem",
              }}>
                {game.characterName}
              </div>
            )}

            {/* Role */}
            {game.characterRole && (
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.67rem",
                color: "rgba(240,238,255,0.35)",
                marginBottom: "0.5rem",
                letterSpacing: "0.02em",
              }}>
                {game.characterRole}
              </div>
            )}

            {/* Blurb */}
            {game.characterBlurb && (
              <p style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                color: "rgba(240,238,255,0.5)",
                lineHeight: 1.55,
                flex: 1,
                maxHeight: "58px",
                overflow: "hidden",
              }}>
                {game.characterBlurb}
              </p>
            )}

            {/* Footer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.63rem",
                color: "rgba(240,238,255,0.28)",
                letterSpacing: "0.08em",
              }}>
                {game.free ? "Free" : `$${game.price?.toFixed(2)}`} · {game.duration}
              </span>
              <div style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700, fontSize: "0.7rem",
                color: "#08060f",
                background: `linear-gradient(90deg, ${accent}, ${accent}bb)`,
                padding: "0.32rem 0.8rem",
                borderRadius: "100px",
              }}>
                {isLocked ? "Unlock" : "Play →"}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ─── Main page component ─────────────────────────────────────────────────────

export default function PathwayPage({ games }: { games: Game[] }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "80px" }}>

      {/* ── HERO ── */}
      <section style={{
        padding: "5rem 2rem 4rem",
        textAlign: "center",
        maxWidth: "760px",
        margin: "0 auto",
      }}>
        {/* Logo mark */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
          animation: "mp-hero-rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <Image src="/icons/icon.svg" alt="MaestroPlay" width={52} height={52} />
        </div>

        <div
          className="label-caps"
          style={{ color: "var(--cyan)", marginBottom: "1rem" }}
        >
          Learning Pathway
        </div>

        <h1 style={{
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 700,
          fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
          color: "#fff",
          lineHeight: 1.08,
          marginBottom: "1.5rem",
        }}>
          Play Your Way to<br />
          <em style={{
            background: "linear-gradient(90deg, #00d4f0 0%, #e040fb 50%, #00e676 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            AI Mastery.
          </em>
        </h1>

        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1.05rem",
          color: "var(--muted)",
          lineHeight: 1.75,
          maxWidth: "560px",
          margin: "0 auto 2.5rem",
        }}>
          Four certification tracks. Twelve story-driven games. Each one 5–10 minutes of pure interactive learning.
          No lectures. No videos. Just play.
        </p>

        {/* Track badges */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          justifyContent: "center",
        }}>
          {TRACKS.map(t => (
            <div key={t.id} style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: t.color,
              background: `${t.color}15`,
              border: `1px solid ${t.color}30`,
              padding: "0.3rem 0.8rem",
              borderRadius: "100px",
            }}>
              {t.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── TRACKS ── */}
      <div style={{ paddingBottom: "8rem" }}>
        {TRACKS.map((track, ti) => {
          const trackGames = games.filter(g => track.weeks.includes(g.week))
          if (trackGames.length === 0) return null

          return (
            <section
              key={track.id}
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "3.5rem 0 3.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Track background glow */}
              <div style={{
                position: "absolute",
                top: "50%", left: "0",
                transform: "translateY(-50%)",
                width: "600px", height: "600px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${track.color}09 0%, transparent 65%)`,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute",
                top: "50%", right: "-100px",
                transform: "translateY(-50%)",
                width: "300px", height: "300px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${track.color}06 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 2rem",
              }}>
                {/* Track header row */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "2rem",
                  flexWrap: "wrap",
                  marginBottom: "2.25rem",
                }}>
                  {/* Left: track info */}
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.65rem",
                      marginBottom: "0.6rem",
                    }}>
                      <div style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 900,
                        fontSize: "0.58rem",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: track.color,
                        background: `${track.color}18`,
                        border: `1px solid ${track.color}35`,
                        padding: "0.2rem 0.65rem",
                        borderRadius: "100px",
                      }}>
                        Track {track.number}
                      </div>
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.6rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(240,238,255,0.3)",
                      }}>
                        {trackGames.length} game{trackGames.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <h2 style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                      color: "#fff",
                      lineHeight: 1.15,
                      marginBottom: "0.5rem",
                    }}>
                      {track.name}
                    </h2>

                    <p style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.875rem",
                      color: "rgba(240,238,255,0.42)",
                      lineHeight: 1.7,
                      maxWidth: "440px",
                    }}>
                      {track.description}
                    </p>
                  </div>

                  {/* Right: certification badge */}
                  <div style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7rem",
                    background: `${track.color}0e`,
                    border: `1px solid ${track.color}28`,
                    borderRadius: "14px",
                    padding: "0.85rem 1.15rem",
                    alignSelf: "flex-start",
                  }}>
                    <div style={{
                      width: "36px", height: "36px",
                      borderRadius: "50%",
                      background: `${track.color}20`,
                      border: `1px solid ${track.color}40`,
                      display: "flex", alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}>
                      🎓
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        color: track.color,
                        letterSpacing: "0.04em",
                      }}>
                        {track.certification}
                      </div>
                      <div style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.6rem",
                        color: "rgba(240,238,255,0.28)",
                        marginTop: "0.15rem",
                      }}>
                        Complete all games to earn
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Card row with path line ── */}
                <div style={{ position: "relative" }}>
                  {/* Path connector line */}
                  <div style={{
                    position: "absolute",
                    top: "64px",
                    left: "12px",
                    right: "12px",
                    height: "1px",
                    background: `linear-gradient(90deg, ${track.color}50, ${track.color}20, transparent)`,
                    pointerEvents: "none",
                    zIndex: 0,
                  }} />

                  {/* Scrollable cards */}
                  <div
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      overflowX: "auto",
                      paddingBottom: "1rem",
                      paddingTop: "0.25rem",
                      position: "relative",
                      zIndex: 1,
                    }}
                    className="pathway-scroll"
                  >
                    {trackGames.map((game) => (
                      <PathwayCard
                        key={game.slug}
                        game={game}
                        trackColor={track.color}
                      />
                    ))}

                    {/* Cert finish node */}
                    <div style={{
                      flexShrink: 0,
                      width: "90px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      paddingTop: "0.25rem",
                    }}>
                      <div style={{
                        width: "50px", height: "50px",
                        borderRadius: "50%",
                        border: `1.5px dashed ${track.color}50`,
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        opacity: 0.55,
                        background: `${track.color}08`,
                      }}>
                        🎓
                      </div>
                      <div style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.52rem",
                        color: track.color,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        textAlign: "center",
                        fontWeight: 700,
                        lineHeight: 1.5,
                        opacity: 0.6,
                      }}>
                        {track.certification}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* ── FOOTER CTA ── */}
      <section style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "5rem 2rem 7rem",
        textAlign: "center",
      }}>
        <Image
          src="/icons/icon.svg"
          alt="MaestroPlay"
          width={40}
          height={40}
          style={{ marginBottom: "1.5rem", opacity: 0.7 }}
        />
        <h2 style={{
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: 700,
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          color: "#fff",
          lineHeight: 1.15,
          marginBottom: "1rem",
        }}>
          Start free. Play one game.<br />
          <em style={{ color: "var(--cyan)" }}>See what changes.</em>
        </h2>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.95rem",
          color: "var(--muted)",
          marginBottom: "2.5rem",
          maxWidth: "420px",
          margin: "0 auto 2.5rem",
          lineHeight: 1.7,
        }}>
          Every track starts with a free game. No account required. Pick a character and start playing.
        </p>
        <Link
          href="/games/welcome-to-ai"
          style={{
            display: "inline-flex",
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#08060f",
            background: "linear-gradient(90deg, #00d4f0, #e040fb)",
            padding: "0.9rem 2.75rem",
            borderRadius: "100px",
            textDecoration: "none",
          }}
        >
          Play Game 1 Free →
        </Link>
      </section>

      <style>{`
        .pathway-scroll::-webkit-scrollbar { display: none; }
        .pathway-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes mp-hero-rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
