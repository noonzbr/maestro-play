"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect } from "react"
import { useState } from "react"
import { allGames } from "@/lib/games"
import GameCard from "@/components/ui/GameCard"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false })

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function LiveDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const choices = [
    { label: "A", text: "AI isn't smart enough yet", correct: false },
    { label: "B", text: "They don't pay for Pro", correct: false },
    { label: "C", text: "They describe without structure", correct: true },
    { label: "D", text: "Only works for developers", correct: false },
  ]

  const handleSelect = (label: string) => {
    if (answered) return
    setSelected(label)
    setAnswered(true)
  }

  const reset = () => { setSelected(null); setAnswered(false) }

  return (
    <div className="glass-card" style={{ borderRadius: "20px", padding: "2rem", height: "100%" }}>
      <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>Live Preview · Week 1</div>
      <div style={{ background: "rgba(0,212,240,0.05)", border: "1px solid rgba(0,212,240,0.15)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(240,238,255,0.85)", lineHeight: 1.7 }}>
          Your colleague automated her report in <strong style={{ color: "#fff" }}>4 minutes</strong>. You spent <strong style={{ color: "#fff" }}>3 hours</strong>. Same tool. What does she know?
        </p>
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#fff", marginBottom: "1rem" }}>
        Why do most people get poor results from AI?
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" }}>
        {choices.map((c) => {
          const isSelected = selected === c.label
          const showResult = answered
          const bgColor = showResult && c.correct ? "rgba(0,255,128,0.08)" : showResult && isSelected && !c.correct ? "rgba(255,80,80,0.08)" : isSelected ? "rgba(0,212,240,0.08)" : "rgba(255,255,255,0.03)"
          const borderColor = showResult && c.correct ? "rgba(0,255,128,0.5)" : showResult && isSelected && !c.correct ? "rgba(255,80,80,0.5)" : isSelected ? "rgba(0,212,240,0.4)" : "rgba(255,255,255,0.08)"
          return (
            <button key={c.label} onClick={() => handleSelect(c.label)} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "10px", border: `1px solid ${borderColor}`, background: bgColor, cursor: answered ? "default" : "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", color: showResult && c.correct ? "#00ff80" : showResult && isSelected ? "#ff8080" : "rgba(240,238,255,0.5)", flexShrink: 0 }}>
                {showResult && c.correct ? "✓" : showResult && isSelected ? "✗" : c.label}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.825rem", color: showResult && c.correct ? "#00ff80" : showResult && isSelected && !c.correct ? "#ff8080" : "rgba(240,238,255,0.8)" }}>
                {c.text}
              </span>
            </button>
          )
        })}
      </div>
      {answered && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "var(--cyan)", fontWeight: 700 }}>
            {selected === "C" ? "✓ Correct! +100 XP" : "Not quite — C is correct"}
          </span>
          <button onClick={reset} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}>Try again</button>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  useReveal()

  return (
    <>
      <Nav />
      <main style={{ background: "var(--bg-primary)", overflowX: "hidden" }}>

        {/* HERO */}
        <section style={{ position: "relative", height: "100vh", minHeight: "700px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <HeroScene />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(8,6,15,0.85) 100%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 1.5rem", maxWidth: "800px", animation: "fade-rise 1.2s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1.5rem" }}>♪ Maestro Play · AI Education Gaming</div>
            <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "clamp(2.8rem, 8vw, 6rem)", color: "#fff", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
              You Don&apos;t Need to Code.
            </h1>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(2rem, 6vw, 4.5rem)", background: "linear-gradient(90deg,#00d4f0,#7b2fbe,#e040fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.1, marginBottom: "2rem" }}>
              You Need to Conduct.
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "rgba(240,238,255,0.65)", marginBottom: "2.5rem", maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Gamified AI literacy for professionals. 5 minutes a day. No code required.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/games/welcome-to-ai" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.85rem 2.2rem", borderRadius: "100px", textDecoration: "none" }}>
                Play Free →
              </Link>
              <Link href="/games" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "rgba(240,238,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.85rem 2.2rem", borderRadius: "100px", textDecoration: "none" }}>
                View All Games
              </Link>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", animation: "pulse-glow 2s ease-in-out infinite" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>Scroll</span>
            <div style={{ width: "1px", height: "40px", background: "linear-gradient(180deg, rgba(0,212,240,0.6), transparent)" }} />
          </div>
        </section>

        {/* TICKER */}
        <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.875rem 0", overflow: "hidden" }}>
          <div style={{ display: "flex", width: "max-content" }} className="animate-ticker">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", whiteSpace: "nowrap" }}>
                {["Prompt Engineering", "AI Orchestration", "Machine Learning", "Generative AI", "The What", "The What Not", "The How", "The Why", "5 Minutes a Day", "No Code Required"].map((item, i) => (
                  <span key={i} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", padding: "0 2rem" }}>
                    {item} <span style={{ color: "var(--cyan)", margin: "0 0.5rem" }}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* TOOLS STRIP */}
        <section style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Works with</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {["ChatGPT", "Claude.ai", "Gemini", "Midjourney", "Perplexity"].map((tool) => (
              <span key={tool} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.45rem 1.1rem", borderRadius: "100px", letterSpacing: "0.02em", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,240,0.4)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}>
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* VISION */}
        <section style={{ position: "relative", minHeight: "55vh", display: "flex", alignItems: "center", overflow: "hidden", margin: "2rem 0" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d0b14 0%, #1a0d2e 40%, #0d0b14 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(123,47,190,0.15) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
            <div className="label-caps reveal" style={{ color: "var(--purple)", marginBottom: "1.5rem" }}>The Vision</div>
            <blockquote className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.3, marginBottom: "1.5rem" }}>
              &ldquo;The most powerful professionals of this decade won&apos;t be the ones who know how to code. They&apos;ll be the ones who know how to conduct.&rdquo;
            </blockquote>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted)" }}>
              Felipe Mercado · Maestro Academy
            </p>
          </div>
        </section>

        {/* GAMES CATALOG */}
        <section style={{ padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>The Curriculum</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", lineHeight: 1.1 }}>
              Four Games. One Transformation.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {allGames.map((game, i) => (
              <div key={game.slug} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </section>

        {/* LIVE DEMO */}
        <section style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <div className="label-caps reveal" style={{ color: "var(--pink)", marginBottom: "1rem" }}>Try It Now</div>
            <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Learn by playing,<br /><em>not watching.</em>
            </h2>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "2rem" }}>
              Every concept hits harder when you feel the stakes. Real scenarios. Real consequences. Real insight. No video to pause.
            </p>
            <div className="reveal">
              <Link href="/games/welcome-to-ai" style={{ display: "inline-flex", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.75rem 1.8rem", borderRadius: "100px", textDecoration: "none" }}>
                Start Week 1 Free →
              </Link>
            </div>
          </div>
          <div className="reveal"><LiveDemo /></div>
        </section>

        {/* FOUR PILLARS */}
        <section style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "1rem" }}>The Method</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.1 }}>
              The Four Maestro Pillars
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { num: "01", title: "The What", desc: "Define the exact output you need. Be specific about deliverable type, scope, and objective.", color: "var(--cyan)" },
              { num: "02", title: "The What Not", desc: "Name constraints, exclusions, and anti-patterns. Boundaries are as powerful as instructions.", color: "var(--purple)" },
              { num: "03", title: "The How", desc: "Specify format, tone, length, structure, and audience. Shape the vessel before filling it.", color: "var(--pink)" },
              { num: "04", title: "The Why", desc: "Give AI the purpose and stakes. Context unlocks relevance. Relevance unlocks quality.", color: "#f0c040" },
            ].map((pillar, i) => (
              <div key={pillar.num} className="glass-card gradient-border reveal" style={{ borderRadius: "16px", padding: "2rem", transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "4rem", color: "rgba(255,255,255,0.04)", lineHeight: 1, marginBottom: "1rem" }}>{pillar.num}</div>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1rem", color: pillar.color, marginBottom: "0.75rem", letterSpacing: "0.02em" }}>{pillar.title}</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7 }}>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT FELIPE */}
        <section style={{ padding: "5rem 2rem", maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "200px", height: "200px", borderRadius: "50%", background: "linear-gradient(135deg, #00d4f0, #7b2fbe, #e040fb)", padding: "3px" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🎵</div>
            </div>
          </div>
          <div>
            <div className="label-caps reveal" style={{ color: "var(--muted)", marginBottom: "1rem" }}>The Conductor</div>
            <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#fff", marginBottom: "1rem" }}>Felipe Mercado</h2>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Founder of Maestro Academy. AI educator, strategist, and firm believer that the future belongs to professionals who learn to conduct AI — not just consume it.
            </p>
            <a className="reveal" href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "var(--cyan)", textDecoration: "none", borderBottom: "1px solid rgba(0,212,240,0.3)", paddingBottom: "2px" }}>
              aimaestro.academy ↗
            </a>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "4rem 2rem" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.1) 30%, transparent 65%)", pointerEvents: "none", animation: "pulse-glow 4s ease-in-out infinite" }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 10, maxWidth: "700px" }}>
            <div className="label-caps reveal" style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>The orchestra is ready.</div>
            <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "#fff", lineHeight: 1.05, marginBottom: "2rem" }}>Are you?</h2>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              Start your first game free. No signup required.
            </p>
            <div className="reveal" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/games/welcome-to-ai" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none" }}>
                Play Free →
              </Link>
              <a href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "1rem", color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none" }}>
                Visit Academy ↗
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
