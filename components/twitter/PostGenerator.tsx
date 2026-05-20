"use client"

import { useState } from "react"

type GeneratedPost = { type: "posts"; posts: string[] } | { type: "thread"; tweets: string[] }

export default function PostGenerator() {
  const [concept, setConcept] = useState("")
  const [result, setResult] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<number | null>(null)

  const generate = async (type: "posts" | "thread") => {
    if (!concept.trim()) return
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept, type }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const items = result?.type === "posts" ? result.posts : result?.type === "thread" ? result.tweets : []

  return (
    <div>
      {/* Input */}
      <div className="glass-card" style={{ borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "rgba(240,238,255,0.8)", marginBottom: "0.75rem" }}>
          Today&apos;s concept or game being featured
        </label>
        <textarea
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g. Why most people get poor AI results (Week 1 launch), The Maestro Method 4 pillars, AI for HR professionals..."
          rows={3}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "0.875rem 1rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9rem",
            color: "#fff",
            resize: "vertical",
            outline: "none",
            marginBottom: "1rem",
          }}
          onFocus={e => (e.target.style.borderColor = "rgba(0,212,240,0.4)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => generate("posts")}
            disabled={loading || !concept.trim()}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "#08060f",
              background: loading ? "rgba(255,255,255,0.15)" : "linear-gradient(90deg,#00d4f0,#e040fb)",
              padding: "0.65rem 1.5rem",
              borderRadius: "100px",
              border: "none",
              cursor: loading || !concept.trim() ? "not-allowed" : "pointer",
              opacity: !concept.trim() ? 0.5 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate 3 Posts"}
          </button>
          <button
            onClick={() => generate("thread")}
            disabled={loading || !concept.trim()}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "rgba(240,238,255,0.8)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "0.65rem 1.5rem",
              borderRadius: "100px",
              cursor: loading || !concept.trim() ? "not-allowed" : "pointer",
              opacity: !concept.trim() ? 0.5 : 1,
            }}
          >
            Generate Thread (5 tweets)
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "#ff8080" }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "1rem" }}>
            {result.type === "thread" ? "Generated Thread" : "Generated Posts"} — Review & Copy
          </div>
          <div style={{ display: "grid", gridTemplateColumns: result.type === "posts" ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr", gap: "1rem" }}>
            {items.map((item, i) => (
              <div key={i} className="glass-card" style={{ borderRadius: "14px", padding: "1.25rem", position: "relative" }}>
                {result.type === "thread" && (
                  <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>
                    Tweet {i + 1}/{items.length}
                  </div>
                )}
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(240,238,255,0.9)", lineHeight: 1.65, marginBottom: "1rem", whiteSpace: "pre-wrap" }}>
                  {item}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: item.length > 280 ? "#ff8080" : "var(--muted)" }}>
                    {item.length} / 280 chars
                  </span>
                  <button
                    onClick={() => copyToClipboard(item, i)}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: copied === i ? "#00ff80" : "var(--cyan)",
                      background: "none",
                      border: "1px solid",
                      borderColor: copied === i ? "rgba(0,255,128,0.3)" : "rgba(0,212,240,0.3)",
                      padding: "0.3rem 0.85rem",
                      borderRadius: "100px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {copied === i ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--muted)", marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "10px" }}>
            💡 Review above → copy approved posts → schedule via Buffer or Hypefury at 9am, 1pm, 6pm. Max 3 posts/day on a growing account.
          </p>
        </div>
      )}

      {/* Content pillars reference */}
      <div style={{ marginTop: "2rem" }}>
        <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "1rem" }}>Content Pillar Reference</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {[
            { type: "INSIGHT", desc: "Most people use AI like a search engine. The ones who get 10x results treat it like an orchestra conductor." },
            { type: "MYTH-BUST", desc: "AI myth: You need to be technical to get great results. Reality: You need to be clear." },
            { type: "GAME DROP", desc: "New game just dropped on Maestro Play. [Topic]. Takes 6 minutes. Free. Link in bio." },
            { type: "ENGAGEMENT", desc: "What's the worst AI output you've ever received? Drop it below — I'll show you what prompt would have fixed it." },
            { type: "BTS", desc: "Building an AI game that teaches prompt engineering in 5 minutes. No videos. No lectures. Just play." },
          ].map((p) => (
            <div key={p.type} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--cyan)", flexShrink: 0, paddingTop: "2px" }}>{p.type}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.825rem", color: "var(--muted)", lineHeight: 1.5 }}>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
