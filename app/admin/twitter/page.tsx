"use client"

import { useState } from "react"
import PostGenerator from "@/components/twitter/PostGenerator"

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HINT || ""

export default function TwitterAdminPage() {
  const [password, setPassword] = useState("")
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    // Simple client-side gate — real auth via next-auth or server-side check in production
    if (password === (process.env.NEXT_PUBLIC_ADMIN_HINT || "maestro2024")) {
      setAuthed(true)
    } else {
      setError("Incorrect password")
    }
  }

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="glass-card" style={{ borderRadius: "20px", padding: "2.5rem", maxWidth: "380px", width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>🔐</div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.8rem", color: "#fff", marginBottom: "0.5rem" }}>Admin Access</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1.5rem" }}>Twitter Content Engine</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.875rem 1rem", fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "#fff", outline: "none", marginBottom: "0.75rem" }}
          />
          {error && <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#ff8080", marginBottom: "0.75rem" }}>{error}</p>}
          <button onClick={handleLogin} style={{ width: "100%", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.85rem", borderRadius: "100px", border: "none", cursor: "pointer" }}>
            Enter →
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", paddingTop: "1rem" }}>
          <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>Maestro Play · Admin</div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            X/Twitter Content Engine
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)" }}>
            Claude drafts · You approve · Buffer/Hypefury schedules · Humans always in the loop.
          </p>
        </div>

        {/* Schedule reference */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {["9:00 AM", "1:00 PM", "6:00 PM"].map((time) => (
            <div key={time} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(0,212,240,0.06)", border: "1px solid rgba(0,212,240,0.15)", borderRadius: "100px", padding: "0.4rem 1rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--cyan)" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(240,238,255,0.8)" }}>{time}</span>
            </div>
          ))}
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)", alignSelf: "center" }}>· Max 3 posts/day</span>
        </div>

        <PostGenerator />
      </div>
    </main>
  )
}
