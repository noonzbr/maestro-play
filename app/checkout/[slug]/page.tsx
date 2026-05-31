"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { getGame } from "@/lib/games"
import Nav from "@/components/ui/Nav"

type Plan = "monthly" | "annual" | "single"

const PLAN_PRICES: Record<Plan, { label: string; amount: string; sub: string; slug: string }> = {
  monthly: { label: "$29",    amount: "29",    sub: "/month",            slug: "pro-monthly" },
  annual:  { label: "$249",   amount: "249",   sub: "/year (save $99)",  slug: "pro-annual"  },
  single:  { label: "$4.99",  amount: "4.99",  sub: "one-time",          slug: ""            },
}

const PRO_FEATURES = [
  "All 12 games — every track unlocked",
  "AI Tutor (Socratic Maestro) after each game",
  "Spaced repetition daily challenges",
  "XP + conductor levels that persist",
  "LinkedIn-shareable track certificates",
  "Cancel anytime",
]

const SINGLE_FEATURES = [
  "Permanent access to this one game",
  "Full XP + streak rewards",
  "Play on any device",
]

export default function CheckoutPage() {
  const params    = useParams()
  const router    = useRouter()
  const slug      = params.slug as string
  const [plan,    setPlan]    = useState<Plan>("monthly")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const game = getGame(slug)
  const displayName  = game?.title || "MaestroPlay Pro"
  const displayEmoji = game?.emoji || "🎵"
  const accentColor  = game?.accentColor ?? "#00d4f0"

  const handleCheckout = async () => {
    setLoading(true)
    setError("")
    // Determine which slug to pass to the checkout API
    const checkoutSlug = plan === "single" ? slug : PLAN_PRICES[plan].slug
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
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{displayEmoji}</div>
            <div style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.58rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "var(--muted)", marginBottom: "0.6rem",
            }}>
              Unlock Game
            </div>
            <h1 style={{
              fontFamily: "Cormorant Garamond, serif", fontWeight: 700,
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)", color: "#fff", lineHeight: 1.15,
              marginBottom: "0.75rem",
            }}>
              {displayName}
            </h1>
            {game?.description && (
              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.9rem",
                color: "rgba(240,238,255,0.5)", lineHeight: 1.7,
                maxWidth: "480px", margin: "0 auto",
              }}>
                {game.description}
              </p>
            )}
          </div>

          {/* ── Plan toggle ── */}
          <div style={{
            display: "flex", gap: "0.75rem", justifyContent: "center",
            marginBottom: "2rem", flexWrap: "wrap",
          }}>
            {(["monthly", "annual", "single"] as Plan[]).map(p => (
              <button
                key={p}
                onClick={() => setPlan(p)}
                style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 700,
                  fontSize: "0.78rem", letterSpacing: "0.04em",
                  padding: "0.55rem 1.35rem", borderRadius: "100px",
                  border: `1.5px solid ${plan === p ? accentColor : "rgba(255,255,255,0.12)"}`,
                  background: plan === p ? `${accentColor}18` : "transparent",
                  color: plan === p ? accentColor : "rgba(240,238,255,0.45)",
                  cursor: "pointer", transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {p === "monthly" ? "Monthly Pro" : p === "annual" ? "Annual Pro" : "Single Game"}
                {p === "annual" && (
                  <span style={{
                    position: "absolute", top: "-10px", right: "-8px",
                    background: "#58cc02", color: "#000",
                    fontFamily: "Inter, sans-serif", fontWeight: 800,
                    fontSize: "0.48rem", letterSpacing: "0.12em",
                    padding: "0.15rem 0.45rem", borderRadius: "100px",
                    textTransform: "uppercase",
                  }}>Save $99</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Plan cards grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: plan !== "single" ? "1fr 1fr" : "1fr",
            gap: "1.5rem",
            maxWidth: plan !== "single" ? "800px" : "480px",
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
                {plan === "single" ? "This Game Includes" : "Pro Includes"}
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.7rem", margin: 0, padding: 0, listStyle: "none" }}>
                {(plan === "single" ? SINGLE_FEATURES : PRO_FEATURES).map(f => (
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
                    {PLAN_PRICES[plan].label}
                  </span>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontSize: "0.875rem",
                    color: "var(--muted)", marginLeft: "0.45rem",
                  }}>
                    {PLAN_PRICES[plan].sub}
                  </span>
                </div>

                {plan !== "single" && (
                  <p style={{
                    fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                    fontSize: "1rem", color: "rgba(240,238,255,0.55)", lineHeight: 1.55,
                    marginBottom: "1.5rem",
                  }}>
                    "Learn AI the way you'd learn guitar — by playing until it's yours."
                  </p>
                )}
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
                  : plan === "single"
                  ? `Unlock for ${PLAN_PRICES[plan].label} →`
                  : `Start Pro — ${PLAN_PRICES[plan].label}${plan === "monthly" ? "/mo" : "/yr"} →`
                }
              </button>

              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
                color: "var(--muted)", textAlign: "center", marginTop: "0.85rem",
              }}>
                {plan === "single"
                  ? "Secure payment via Stripe · Permanent access"
                  : "Secure payment via Stripe · Cancel anytime"}
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
              ← Back to tracks
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
