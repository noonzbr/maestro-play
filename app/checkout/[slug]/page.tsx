"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { getGame } from "@/lib/games"
import { getPricing } from "@/lib/pricing"
import Nav from "@/components/ui/Nav"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const game = getGame(slug)
  const pricing = getPricing(slug)

  // Bundle fallback
  const displayName = game?.title || (slug === "bundle" ? "Full Bundle — All 4 Weeks" : "Game")
  const displayPrice = pricing ? (pricing.amount / 100).toFixed(2) : "9.99"
  const displayEmoji = game?.emoji || "🎵"

  const handleCheckout = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
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
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        {/* Glow */}
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(123,47,190,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "480px", width: "100%", position: "relative" }}>
          <div className="glass-card" style={{ borderRadius: "24px", padding: "2.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>{displayEmoji}</div>

            <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "0.75rem" }}>Unlock Game</div>

            <h1 style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}>
              {displayName}
            </h1>

            {game && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
                {game.description}
              </p>
            )}

            <div style={{ marginBottom: "2rem" }}>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 900,
                fontSize: "3rem",
                color: "#fff",
              }}>
                ${displayPrice}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted)", marginLeft: "0.5rem" }}>
                one-time
              </span>
            </div>

            <ul style={{ textAlign: "left", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {["Instant permanent access", "4 interactive scenarios", "XP system + streak rewards", "Conductor certificate (Week 4)", "Works on any device"].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(240,238,255,0.8)" }}>
                  <span style={{ color: "var(--cyan)", fontSize: "0.9rem" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {error && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.825rem", color: "#ff8080", marginBottom: "1rem", background: "rgba(255,80,80,0.08)", padding: "0.75rem", borderRadius: "8px" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: "100%",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#08060f",
                background: loading ? "rgba(255,255,255,0.2)" : "linear-gradient(90deg,#00d4f0,#e040fb)",
                padding: "1rem 2rem",
                borderRadius: "100px",
                border: "none",
                cursor: loading ? "wait" : "pointer",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Redirecting to Stripe..." : `Unlock for $${displayPrice} →`}
            </button>

            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--muted)", marginTop: "1rem" }}>
              Secure payment via Stripe · No subscription
            </p>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button onClick={() => router.back()} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>
              ← Go back
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
