"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { getGame } from "@/lib/games"
import Nav from "@/components/ui/Nav"

type Pack = "starter" | "bundle"

const PACK_DETAILS: Record<Pack, { label: string; amount: string; sub: string; slug: string; features: string[] }> = {
  starter: {
    label: "$2.99",
    amount: "2.99",
    sub: "one-time purchase",
    slug: "starter-pack",
    features: [
      "5 extra lives (replenish instantly)",
      "3 Hint Tokens for tough prompt tests",
      "2 Double XP boosts (lasts 24h)",
      "1 Second Chance safety net",
    ]
  },
  bundle: {
    label: "$6.99",
    amount: "6.99",
    sub: "one-time purchase (Best Value)",
    slug: "maestro-bundle",
    features: [
      "15 extra lives (replenish instantly)",
      "8 Hint Tokens for tough prompt tests",
      "5 Double XP boosts (lasts 24h)",
      "3 Streak Shields",
      "2 Second Chance safety nets",
      "1 Streak Restore",
      "1 XP Jackpot multiplier",
    ]
  }
}

export default function CheckoutPage() {
  const params    = useParams()
  const router    = useRouter()
  const slug      = params.slug as string
  const [pack,    setPack]    = useState<Pack>("bundle") // Default to bundle (best value)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const game = getGame(slug)
  const displayName  = game?.title || "MaestroPlay Power-up"
  const displayEmoji = game?.emoji || "⚡"
  const accentColor  = game?.accentColor ?? "#00d4f0"

  const handleCheckout = async () => {
    setLoading(true)
    setError("")
    const checkoutSlug = PACK_DETAILS[pack].slug
    try {
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ slug: checkoutSlug }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Something went wrong")
        setLoading(false)
      }
    } catch {
      setError("Network error — please try again")
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main style={{
        minHeight:       "100vh",
        background:      "var(--bg-primary)",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "5rem 1.5rem 3rem",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "fixed", top: "40%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "600px", height: "600px",
          background: `radial-gradient(circle, ${accentColor}12 0%, rgba(123,47,190,0.08) 50%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "940px", width: "100%", position: "relative" }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚡</div>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: "0.6rem",
            }}>
              Get Power-up Pack
            </div>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif", fontWeight: 700,
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#fff", lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}>
              Power up your learning
            </h1>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: "0.9rem",
              color: "rgba(240,238,255,0.5)", lineHeight: 1.7,
              maxWidth: "480px", margin: "0 auto",
            }}>
              All games are 100% free to play. Optional power-up packs help you bypass difficult questions, get hints, and maintain your streak.
            </p>
          </div>

          {/* ── Pack toggle ── */}
          <div style={{
            display: "flex", gap: "0.75rem", justifyContent: "center",
            marginBottom: "2rem", flexWrap: "wrap",
          }}>
            {(["starter", "bundle"] as Pack[]).map(p => (
              <button
                key={p}
                onClick={() => setPack(p)}
                style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 700,
                  fontSize: "0.78rem", letterSpacing: "0.04em",
                  padding: "0.55rem 1.35rem", borderRadius: "100px",
                  border: `1.5px solid ${pack === p ? accentColor : "rgba(255,255,255,0.12)"}`,
                  background: pack === p ? `${accentColor}18` : "transparent",
                  color: pack === p ? accentColor : "rgba(240,238,255,0.45)",
                  cursor: "pointer", transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {p === "starter" ? "Starter Pack" : "Maestro Bundle"}
                {p === "bundle" && (
                  <span style={{
                    position: "absolute", top: "-10px", right: "-8px",
                    background: "var(--pink)", color: "#000",
                    fontFamily: "Inter, sans-serif", fontWeight: 800,
                    fontSize: "0.48rem", letterSpacing: "0.12em",
                    padding: "0.15rem 0.45rem", borderRadius: "100px",
                    textTransform: "uppercase",
                  }}>Best Value</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Plan cards grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            maxWidth: "800px",
            margin: "0 auto 2rem",
          }}>

            {/* What's included box */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${accentColor}33`,
              borderRadius: "20px",
              padding: "1.75rem",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 800,
                fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase",
                color: accentColor, marginBottom: "1.1rem",
              }}>
                Pack Contents
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.7rem", margin: 0, padding: 0, listStyle: "none" }}>
                {PACK_DETAILS[pack].features.map(f => (
                  <li key={f} style={{
                    display: "flex", alignItems: "flex-start", gap: "0.65rem",
                    fontFamily: "Inter, sans-serif", fontSize: "0.875rem",
                    color: "rgba(240,238,255,0.82)", lineHeight: 1.5,
                  }}>
                    <span style={{ color: "#58cc02", flexShrink: 0, marginTop: "1px" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price + CTA box */}
            <div style={{
              background: `linear-gradient(135deg, ${accentColor}0a 0%, rgba(123,47,190,0.08) 100%)`,
              border: `1.5px solid ${accentColor}44`,
              borderRadius: "20px",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 900,
                    fontSize: "3rem", color: "#fff", lineHeight: 1,
                  }}>
                    {PACK_DETAILS[pack].label}
                  </span>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontSize: "0.875rem",
                    color: "var(--muted)", marginLeft: "0.45rem",
                  }}>
                    {PACK_DETAILS[pack].sub}
                  </span>
                </div>

                <p style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: "1rem", color: "rgba(240,238,255,0.55)", lineHeight: 1.55,
                  marginBottom: "1.5rem",
                }}>
                  "No recurring monthly charges. Purchase only what you need, when you need it."
                </p>
              </div>

              {error && (
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
                  color: "#ff8080", background: "rgba(255,80,80,0.08)",
                  padding: "0.65rem 0.9rem", borderRadius: "10px",
                  marginBottom: "1rem",
                }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: "100%",
                  fontFamily: "Inter, sans-serif", fontWeight: 800,
                  fontSize: "1rem", color: "#08060f",
                  background: loading
                    ? "rgba(255,255,255,0.2)"
                    : `linear-gradient(90deg, ${accentColor}, #e040fb)`,
                  padding: "1rem 2rem", borderRadius: "100px",
                  border: "none", cursor: loading ? "wait" : "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: `0 0 32px ${accentColor}33`,
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 0 48px ${accentColor}55` }}}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 0 32px ${accentColor}33` }}
              >
                {loading
                  ? "Redirecting to Stripe…"
                  : `Get Pack — ${PACK_DETAILS[pack].label} →`
                }
              </button>

              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
                color: "var(--muted)", textAlign: "center", marginTop: "0.85rem",
              }}>
                Secure payment via Stripe · One-time purchase
              </p>
            </div>

          </div>

          {/* ── Back link ── */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => router.back()}
              style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
                color: "var(--muted)", background: "none", border: "none", cursor: "pointer",
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
