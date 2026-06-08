"use client"

/**
 * /tools/design-critic — Vera's Design Critique Tool
 *
 * Enter a URL → get a PhD-level design critique in 6 dimensions.
 * Powered by Claude claude-sonnet-4-6 with Vera's expert knowledge embedded.
 */

import { useState, useRef } from "react"
import type { DesignCritiqueResult, DesignDimension } from "@/app/api/design-critique/route"

// ─── Dimension config ──────────────────────────────────────────────────────────

const DIMENSIONS: { key: DesignDimension; label: string; icon: string; weight: string }[] = [
  { key: "accessibility", label: "Accessibility",  icon: "♿", weight: "25%" },
  { key: "typography",    label: "Typography",     icon: "Aa", weight: "20%" },
  { key: "hierarchy",     label: "Hierarchy",      icon: "⬡",  weight: "20%" },
  { key: "color",         label: "Color",          icon: "◉",  weight: "15%" },
  { key: "spacing",       label: "Spacing",        icon: "⊞",  weight: "10%" },
  { key: "performance",   label: "Performance",    icon: "⚡", weight: "10%" },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function GradeRing({ score, grade }: { score: number; grade: string }) {
  const color =
    score >= 90 ? "#22c55e" :
    score >= 80 ? "#84cc16" :
    score >= 70 ? "#eab308" :
    score >= 60 ? "#f97316" : "#ef4444"

  const r = 28
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c

  return (
    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
      <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <circle
          cx={36} cy={36} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1 }}>{grade}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  )
}

function DimensionCard({
  dimKey, label, icon, weight, data,
}: {
  dimKey: DesignDimension
  label: string
  icon: string
  weight: string
  data: DesignCritiqueResult["dimensions"][DesignDimension]
}) {
  const [open, setOpen] = useState(false)
  const score = data?.score ?? 0
  const grade = data?.grade ?? "F"

  const barColor =
    score >= 90 ? "#22c55e" :
    score >= 80 ? "#84cc16" :
    score >= 70 ? "#eab308" :
    score >= 60 ? "#f97316" : "#ef4444"

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      onClick={() => setOpen(o => !o)}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>{label}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>weight {weight}</span>
          </div>
          {/* Score bar */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6 }}>
            <div style={{
              width: `${score}%`, height: "100%", borderRadius: 4,
              background: barColor, transition: "width 1s ease",
            }} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
            {data?.headline ?? "—"}
          </p>
        </div>
        <GradeRing score={score} grade={grade} />
      </div>

      {/* Expanded detail */}
      {open && data && (
        <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
          {data.issues && data.issues.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Issues</p>
              {data.issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#ef4444", flexShrink: 0, marginTop: 2 }}>✕</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{issue}</span>
                </div>
              ))}
            </div>
          )}
          {data.wins && data.wins.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>What&apos;s Working</p>
              {data.wins.map((win, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#22c55e", flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{win}</span>
                </div>
              ))}
            </div>
          )}
          {data.fix && (
            <div style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              borderRadius: 8, padding: "10px 14px",
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Top Fix</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, margin: 0 }}>{data.fix}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DesignCriticPage() {
  const [url, setUrl]           = useState("")
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<DesignCritiqueResult | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/design-critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error ?? `HTTP ${res.status}`)
        return
      }

      setResult(data as DesignCritiqueResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
    } finally {
      setLoading(false)
    }
  }

  const overallColor = result
    ? result.overall >= 90 ? "#22c55e"
    : result.overall >= 80 ? "#84cc16"
    : result.overall >= 70 ? "#eab308"
    : result.overall >= 60 ? "#f97316" : "#ef4444"
    : "#06b6d4"

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #05060f 0%, #0a0d1a 100%)",
      color: "#fff",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13 }}>← MaestroPlay</a>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Design Critic</span>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)",
            borderRadius: 20, padding: "4px 14px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Vera Chen · Senior Frontend Developer
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 800, lineHeight: 1.1,
            margin: "0 0 16px",
            letterSpacing: "-0.02em",
          }}>
            PhD-Level Design Critique
          </h1>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.5)",
            maxWidth: 480, margin: "0 auto", lineHeight: 1.6,
          }}>
            Enter any URL. Get a senior designer's critique across 6 dimensions — typography, hierarchy, color, spacing, accessibility, and performance.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleAnalyze} style={{ marginBottom: 40 }}>
          <div style={{
            display: "flex", gap: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "6px 6px 6px 20px",
          }}>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#fff", fontSize: 15,
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              style={{
                background: loading ? "rgba(6,182,212,0.3)" : "#06b6d4",
                color: "#05060f",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s, opacity 0.2s",
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Analyzing…" : "Critique →"}
            </button>
          </div>
        </form>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              display: "inline-block", width: 40, height: 40,
              border: "3px solid rgba(6,182,212,0.2)",
              borderTopColor: "#06b6d4",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              Vera is reviewing the page…
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 12, padding: "16px 20px",
            color: "#fca5a5", fontSize: 14,
          }}>
            <strong>Critique failed:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div>

            {/* Overall score */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${overallColor}33`,
              borderRadius: 16, padding: "28px 32px",
              marginBottom: 32, textAlign: "center",
            }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: overallColor, lineHeight: 1 }}>
                {result.overallGrade}
              </div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", margin: "4px 0 16px" }}>
                {result.overall}/100 overall
              </div>
              <p style={{
                fontSize: 15, color: "rgba(255,255,255,0.65)",
                maxWidth: 520, margin: "0 auto", lineHeight: 1.6,
              }}>
                {result.summary}
              </p>
            </div>

            {/* Top priorities */}
            {result.topPriorities?.length > 0 && (
              <div style={{
                background: "rgba(6,182,212,0.05)",
                border: "1px solid rgba(6,182,212,0.15)",
                borderRadius: 14, padding: "20px 24px", marginBottom: 32,
              }}>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: "#06b6d4",
                  textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
                }}>
                  Top Priorities (highest impact first)
                </p>
                {result.topPriorities.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < result.topPriorities.length - 1 ? 10 : 0 }}>
                    <span style={{
                      background: "#06b6d4", color: "#05060f",
                      borderRadius: "50%", width: 20, height: 20, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Dimension cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              <p style={{
                fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4,
              }}>
                Dimensions (click to expand)
              </p>
              {DIMENSIONS.map(dim => (
                <DimensionCard
                  key={dim.key}
                  dimKey={dim.key}
                  label={dim.label}
                  icon={dim.icon}
                  weight={dim.weight}
                  data={result.dimensions[dim.key]}
                />
              ))}
            </div>

            {/* Vera's note */}
            {result.veraNote && (
              <div style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: "20px 24px",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(6,182,212,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  🎨
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Vera
                  </p>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                    {result.veraNote}
                  </p>
                </div>
              </div>
            )}

            {/* Footnote */}
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 24 }}>
              Analyzed from page HTML. Visual analysis (rendered font sizes, actual spacing) requires browser inspection.
              Critique generated {new Date(result.fetchedAt).toLocaleString()}.
            </p>

          </div>
        )}

        {/* Empty state — what you'll get */}
        {!result && !loading && !error && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12, opacity: 0.6,
          }}>
            {DIMENSIONS.map(dim => (
              <div key={dim.key} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{dim.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{dim.label}</span>
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>weight: {dim.weight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
