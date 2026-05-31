"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import { allGames } from "@/lib/games"
import GameCard from "@/components/ui/GameCard"
import Nav from "@/components/ui/Nav"
import Footer from "@/components/ui/Footer"
import FloatingNotes from "@/components/game/FloatingNotes"

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false })

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") }),
      { threshold: 0.10 }
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
      <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "1rem" }}>Live Preview</div>
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
  const carouselRef  = useRef<HTMLDivElement>(null)
  const carouselPaused = useRef(false)

  const scrollCarousel = useCallback((dir: "left" | "right") => {
    const el = carouselRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("div[data-card]")
    const step = (card?.offsetWidth ?? 320) + 20
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (carouselPaused.current) return
      const el = carouselRef.current
      if (!el) return
      const card = el.querySelector<HTMLElement>("div[data-card]")
      const step = (card?.offsetWidth ?? 320) + 20
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10
      el.scrollBy({ left: atEnd ? -(el.scrollWidth) : step, behavior: "smooth" })
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <Nav />
      <main style={{ background: "var(--bg-primary)", overflowX: "hidden" }}>

        {/* ── HERO ────────────────────────────────────────────────────────────── */}
        <section style={{ position: "relative", height: "100vh", minHeight: "700px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <HeroScene />
          <div style={{ position:"absolute", inset:0, zIndex:5, pointerEvents:"none", overflow:"hidden" }}>
            <FloatingNotes mood="normal" />
          </div>
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
              Gamified AI literacy for professionals. No code required.
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

        {/* ── SOCIAL PROOF BAR ────────────────────────────────────────────────── */}
        <div style={{ background:"rgba(0,212,240,0.04)", borderTop:"1px solid rgba(0,212,240,0.1)", borderBottom:"1px solid rgba(0,212,240,0.08)", padding:"1.25rem 2rem" }}>
          <div style={{ maxWidth:"900px", margin:"0 auto", display:"flex", justifyContent:"center", gap:"clamp(1.5rem,5vw,4rem)", flexWrap:"wrap", alignItems:"center" }}>
            {[
              { n:"14",  label:"Cinematic games" },
              { n:"4",   label:"AI skill tracks" },
              { n:"5+",  label:"AI tools mastered" },
              { n:"0",   label:"Lines of code required" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Inter,sans-serif", fontWeight:900, fontSize:"clamp(1.4rem,3vw,2rem)", color:"#00d4f0", letterSpacing:"-0.02em", lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:"Inter,sans-serif", fontSize:"0.65rem", color:"rgba(240,238,255,0.4)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:"0.25rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TICKER ──────────────────────────────────────────────────────────── */}
        <div style={{ background: "var(--bg-secondary)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "0.875rem 0", overflow: "hidden" }}>
          <div style={{ display: "flex", width: "max-content" }} className="animate-ticker">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: "flex", whiteSpace: "nowrap" }}>
                {["Prompt Engineering", "AI Orchestration", "Machine Learning", "Generative AI", "The What", "The What Not", "The How", "The Why", "No Code Required", "Career AI Fluency", "ChatGPT · Claude · Gemini", "Master Your Tools"].map((item, i) => (
                  <span key={i} style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)", padding: "0 2rem" }}>
                    {item} <span style={{ color: "var(--cyan)", margin: "0 0.5rem" }}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── THE PROFESSIONAL GAP ────────────────────────────────────────────── */}
        <section style={{ padding: "6rem 2rem", background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="label-caps" style={{ color: "#ff6b6b", marginBottom: "0.75rem" }}>The Reality Check</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2.2rem,5vw,3.8rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1rem" }}>
                The AI gap is widening.<br />
                <em style={{ color: "rgba(240,238,255,0.45)", fontStyle: "italic" }}>Every single week.</em>
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "rgba(240,238,255,0.55)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
                Your colleagues are using AI to do in minutes what you do in hours. The difference isn&apos;t the tool — it&apos;s the skill.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3.5rem" }}>
              {/* Without AI fluency */}
              <div className="reveal" style={{ borderRadius: "20px", padding: "2rem 2rem 2.5rem", background: "rgba(255,80,80,0.04)", border: "1px solid rgba(255,80,80,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,80,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>✗</div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "rgba(255,120,120,0.9)", letterSpacing: "0.02em" }}>Without AI fluency</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Hours on tasks your AI-fluent colleague finishes in minutes",
                    "Generic, forgettable outputs that need heavy editing",
                    "Watching others get credit for AI-augmented work",
                    "Nodding in AI strategy meetings you don't fully follow",
                    "A quiet fear that automation is coming for your role",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,120,120,0.5)", marginTop: "0.5rem", flexShrink: 0 }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(240,238,255,0.5)", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* With MaestroPlay */}
              <div className="reveal" style={{ borderRadius: "20px", padding: "2rem 2rem 2.5rem", background: "rgba(0,212,240,0.04)", border: "1px solid rgba(0,212,240,0.2)", transitionDelay: "0.1s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(0,212,240,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>♪</div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#00d4f0", letterSpacing: "0.02em" }}>With MaestroPlay</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Prompts that produce professional-quality output every time",
                    "The person your team turns to for AI strategy and decisions",
                    "Confidence to lead AI conversations at any seniority level",
                    "10× faster delivery on research, writing, and analysis",
                    "AI as your competitive advantage — not your threat",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "linear-gradient(135deg,#00d4f0,#e040fb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.15rem" }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#08060f" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(240,238,255,0.8)", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="reveal" style={{ textAlign: "center" }}>
              <Link href="/games/welcome-to-ai" style={{ display: "inline-flex", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.85rem 2.5rem", borderRadius: "100px", textDecoration: "none", letterSpacing: "0.02em" }}>
                Start Closing the Gap — Free →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TOOLS STRIP ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>Master the tools your company already uses</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {["ChatGPT", "Claude.ai", "Gemini", "Microsoft Copilot", "Midjourney", "Perplexity"].map((tool) => (
              <span key={tool} style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.45rem 1.1rem", borderRadius: "100px", letterSpacing: "0.02em", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,212,240,0.4)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(240,238,255,0.7)" }}>
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
        <section style={{ padding:"5rem 2rem", maxWidth:"1000px", margin:"0 auto" }}>
          <div className="reveal" style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div className="label-caps" style={{ color:"var(--cyan)", marginBottom:"0.75rem" }}>How It Works</div>
            <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"clamp(2rem,5vw,3rem)", color:"#fff", lineHeight:1.1, margin:0 }}>
              Learning that actually sticks.
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:"1.25rem" }}>
            {[
              { step:"01", icon:"🎭", title:"Enter the story", desc:"Each game drops you inside a real professional's crisis. AI concepts aren't explained — they're lived.", color:"var(--cyan)" },
              { step:"02", icon:"⚡", title:"Make decisions", desc:"Choose responses, craft prompts, direct the AI. Wrong moves have consequences. Right ones earn XP.", color:"var(--purple)" },
              { step:"03", icon:"🧠", title:"The Maestro intervenes", desc:"After key moments, your conductor reveals why your choice worked — or didn't. The WHY is the lesson.", color:"var(--pink)" },
              { step:"04", icon:"🎼", title:"Unlock real skills", desc:"Every game ends with a skill you can use at work tomorrow. Not theory — a prompt, a framework, a method.", color:"#f0c040" },
            ].map((s, i) => (
              <div key={s.step} className="glass-card reveal" style={{ borderRadius:"16px", padding:"1.75rem 1.5rem", transitionDelay:`${i*0.08}s`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:"-0.5rem", right:"0.75rem", fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"4.5rem", color:"rgba(255,255,255,0.03)", lineHeight:1, userSelect:"none" }}>{s.step}</div>
                <div style={{ fontSize:"1.8rem", marginBottom:"1rem" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"Inter,sans-serif", fontWeight:800, fontSize:"0.95rem", color:s.color, marginBottom:"0.65rem", letterSpacing:"-0.01em" }}>{s.title}</h3>
                <p style={{ fontFamily:"Inter,sans-serif", fontSize:"0.825rem", color:"rgba(240,238,255,0.55)", lineHeight:1.7, margin:0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── GAMES CATALOG ───────────────────────────────────────────────────── */}
        <section style={{ padding: "5rem 0", overflow: "hidden" }}>
          <div className="reveal" style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            padding: "0 max(2rem, calc((100vw - 1400px) / 2 + 2rem))",
            marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem",
          }}>
            <div>
              <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>The Curriculum</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", lineHeight: 1.1, margin: 0 }}>
                The Method Behind the Music.
              </h2>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "0.25rem" }}>
              {(["left", "right"] as const).map(dir => (
                <button key={dir} onClick={() => scrollCarousel(dir)} style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(0,212,240,0.35)", color: "#00d4f0", fontSize: "1.4rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", transition: "all 0.2s ease", fontFamily: "Inter, sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(0,212,240,0.15)"; e.currentTarget.style.borderColor="#00d4f0"; e.currentTarget.style.boxShadow="0 0 16px rgba(0,212,240,0.4)" }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(0,212,240,0.35)"; e.currentTarget.style.boxShadow="none" }}
                  aria-label={dir === "left" ? "Scroll left" : "Scroll right"}>
                  {dir === "left" ? "‹" : "›"}
                </button>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div ref={carouselRef}
              onMouseEnter={() => { carouselPaused.current = true }}
              onMouseLeave={() => { carouselPaused.current = false }}
              style={{ display: "flex", gap: "1.25rem", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", paddingLeft: "max(2rem, calc((100vw - 1400px) / 2 + 2rem))", paddingRight: "max(2rem, calc((100vw - 1400px) / 2 + 2rem))", paddingBottom: "2rem", msOverflowStyle: "none", scrollbarWidth: "none" } as React.CSSProperties}>
              {allGames.map((game) => (
                <div key={game.slug} data-card="true" style={{ flex: "0 0 clamp(280px, 28vw, 355px)", height: "540px", scrollSnapAlign: "start" }}>
                  <GameCard game={game} />
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, bottom: "2rem", width: "5rem", background: "linear-gradient(to right, var(--bg-primary), transparent)", pointerEvents: "none", zIndex: 2 }} />
            <div style={{ position: "absolute", top: 0, right: 0, bottom: "2rem", width: "5rem", background: "linear-gradient(to left, var(--bg-primary), transparent)", pointerEvents: "none", zIndex: 2 }} />
          </div>
        </section>

        {/* ── LIVE DEMO ───────────────────────────────────────────────────────── */}
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
                Start Playing Free →
              </Link>
            </div>
          </div>
          <div className="reveal"><LiveDemo /></div>
        </section>

        {/* ── WHO THIS IS FOR ─────────────────────────────────────────────────── */}
        <section style={{ padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="label-caps" style={{ color: "var(--muted)", marginBottom: "0.75rem" }}>Who It&apos;s For</div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3rem)", color: "#fff", lineHeight: 1.1 }}>
              Built for professionals, not developers.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              {
                icon: "📣",
                role: "Marketing & Content",
                pain: "You need 5× the output with the same team. Generic AI results aren't cutting it.",
                gain: "Brief AI like a Creative Director. Consistent, on-brand, publishable output every time.",
                color: "var(--pink)",
              },
              {
                icon: "⚙️",
                role: "Operations & Leadership",
                pain: "Your company is deploying AI tools. You need to lead that — not just manage it.",
                gain: "Build automations and lead AI strategy without writing a single line of code.",
                color: "var(--cyan)",
              },
              {
                icon: "👥",
                role: "HR & People Teams",
                pain: "You're evaluating, buying, and rolling out AI tools — often without proper training.",
                gain: "Understand exactly what any AI tool can do. Evaluate, train, and implement with confidence.",
                color: "var(--purple)",
              },
              {
                icon: "🎯",
                role: "Sales & Account Teams",
                pain: "Competitors are personalizing at AI scale. Manual outreach simply can't keep up.",
                gain: "Master AI-assisted research and outreach without losing your authentic voice.",
                color: "#f0c040",
              },
            ].map((p, i) => (
              <div key={p.role} className="glass-card gradient-border reveal" style={{ borderRadius: "16px", padding: "1.75rem", transitionDelay: `${i * 0.09}s` }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>{p.icon}</div>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.9rem", color: p.color, letterSpacing: "0.02em", marginBottom: "0.75rem" }}>{p.role}</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.45)", lineHeight: 1.65, marginBottom: "0.9rem" }}>{p.pain}</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.9rem" }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.75)", lineHeight: 1.65, margin: 0 }}>→ {p.gain}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOUR PILLARS ────────────────────────────────────────────────────── */}
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

        {/* ── WHAT YOU'LL LEARN ───────────────────────────────────────────────── */}
        <section style={{ padding:"5rem 2rem", maxWidth:"960px", margin:"0 auto" }}>
          <div className="reveal" style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div className="label-caps" style={{ color:"var(--muted)", marginBottom:"0.75rem" }}>What You Walk Away With</div>
            <h2 style={{ fontFamily:"Cormorant Garamond,serif", fontWeight:700, fontSize:"clamp(2rem,5vw,3rem)", color:"#fff", lineHeight:1.1, margin:0 }}>
              Skills you&apos;ll use in tomorrow&apos;s meeting.
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"0.9rem" }}>
            {[
              "Write prompts that actually work — every time",
              "Know when to trust AI output and when to challenge it",
              "Build automation pipelines without touching code",
              "Use Claude, ChatGPT & Copilot at a professional level",
              "Explain AI limitations to your team without sounding technical",
              "Design prompts that get consistent, repeatable results",
            ].map((skill, i) => (
              <div key={i} className="reveal" style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", padding:"1rem 1.25rem", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", transitionDelay:`${i*0.06}s` }}>
                <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"linear-gradient(135deg,#00d4f0,#e040fb)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"0.05rem" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="#08060f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily:"Inter,sans-serif", fontSize:"0.875rem", color:"rgba(240,238,255,0.75)", lineHeight:1.5 }}>{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT FELIPE ────────────────────────────────────────────────────── */}
        <section style={{ padding: "5rem 2rem", maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "center" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "260px", height: "300px", borderRadius: "20px", background: "linear-gradient(135deg, #00d4f0, #7b2fbe, #e040fb)", padding: "3px" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "18px", overflow: "hidden", background: "var(--bg-secondary)" }}>
                  <img src="/images/maestroplayer1.png" alt="Felipe Maestro" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                </div>
              </div>
              <div style={{ position: "absolute", bottom: "-1rem", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#00d4f0,#e040fb)", borderRadius: "100px", padding: "0.4rem 1.1rem", whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#08060f" }}>Meet Your Maestro</span>
              </div>
            </div>
          </div>
          <div>
            <div className="label-caps reveal" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>AI Interaction Architect & Founder</div>
            <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", marginBottom: "1rem", lineHeight: 1.05 }}>Felipe Maestro</h2>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.75)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Felipe built Maestro Academy around one conviction: <strong style={{ color: "#fff" }}>you don&apos;t need to be a developer to use AI like a professional.</strong> You just need a system.
            </p>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "rgba(240,238,255,0.6)", lineHeight: 1.85, marginBottom: "2rem" }}>
              After developing the Maestro Method — a 4-part prompting framework — Felipe set out to teach regular people how to conduct AI with the precision and intentionality of an orchestra conductor.
            </p>
            <a className="reveal" href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#08060f", background: "rgba(255,255,255,0.9)", padding: "0.6rem 1.4rem", borderRadius: "100px", textDecoration: "none" }}>
              Learn from Felipe ↗
            </a>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: "6rem 2rem", background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="label-caps" style={{ color: "var(--cyan)", marginBottom: "0.75rem" }}>Simple Pricing</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3.2rem)", color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem" }}>
                Start free. Level up when ready.
              </h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.7 }}>
                No credit card required to start. No tutorials. Just play.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", alignItems: "stretch" }}>

              {/* Free */}
              <div className="reveal glass-card" style={{ borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>Free</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "3rem", color: "#fff", letterSpacing: "-0.03em" }}>$0</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--muted)" }}>forever</span>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>2 games per track. No signup needed.</p>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2rem" }}>
                  {[
                    "8 free games (2 per track)",
                    "XP + daily streak tracking",
                    "AI Fluency Score",
                    "Conductor Dashboard",
                    "No credit card required",
                  ].map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="rgba(240,238,255,0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: "rgba(240,238,255,0.6)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/games/welcome-to-ai" style={{ display: "block", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(240,238,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.75rem", borderRadius: "100px", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)" }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)" }}>
                  Play Free →
                </Link>
              </div>

              {/* Pro — highlighted */}
              <div className="reveal" style={{ borderRadius: "20px", padding: "2px", background: "linear-gradient(135deg, #00d4f0, #7b2fbe, #e040fb)", transitionDelay: "0.1s", display: "flex", flexDirection: "column" }}>
                <div style={{ borderRadius: "18px", padding: "2rem", background: "rgba(10,7,20,0.98)", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "linear-gradient(90deg,#00d4f0,#e040fb)", borderRadius: "100px", padding: "0.2rem 0.75rem", marginBottom: "1.25rem", alignSelf: "flex-start" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#08060f" }}>Most Popular</span>
                  </div>
                  <div style={{ marginBottom: "1.75rem" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#00d4f0", marginBottom: "0.75rem" }}>Pro</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "3rem", color: "#fff", letterSpacing: "-0.03em" }}>$29</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--muted)" }}>/month</span>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>Or $249/year — save 28%</p>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2rem" }}>
                    {[
                      "All 14 games + every future release",
                      "AI Tutor — Socratic Maestro",
                      "FSRS Spaced Repetition reviews",
                      "LinkedIn-shareable Certificates",
                      "Full Conductor Dashboard",
                      "Lives + Power-ups system",
                      "Streak Shield protection",
                      "Priority support",
                    ].map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "linear-gradient(135deg,#00d4f0,#e040fb)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#08060f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: "rgba(240,238,255,0.85)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/games" style={{ display: "block", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "0.75rem", borderRadius: "100px", textDecoration: "none" }}>
                    Start Pro →
                  </Link>
                </div>
              </div>

              {/* Team */}
              <div className="reveal glass-card" style={{ borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", transitionDelay: "0.2s" }}>
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.75rem" }}>Team</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "3rem", color: "#fff", letterSpacing: "-0.03em" }}>$49</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--muted)" }}>/user/mo</span>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>Volume discounts available.</p>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2rem" }}>
                  {[
                    "Everything in Pro",
                    "Team AI Fluency analytics",
                    "Manager dashboard",
                    "Seat management",
                    "Leaderboards",
                    "Dedicated onboarding",
                  ].map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(123,47,190,0.25)", border: "1px solid rgba(123,47,190,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: "rgba(240,238,255,0.6)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "rgba(240,238,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "0.75rem", borderRadius: "100px", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.1)" }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)" }}>
                  Contact Us ↗
                </a>
              </div>

              {/* Simulation — Coming Soon */}
              <div className="reveal" style={{ borderRadius: "20px", padding: "2px", background: "linear-gradient(135deg, #ffb700, #ff6b35, #e040fb)", transitionDelay: "0.3s", display: "flex", flexDirection: "column", opacity: 0.9 }}>
                <div style={{ borderRadius: "18px", padding: "2rem", background: "rgba(10,7,20,0.97)", flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                  {/* Shimmer overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,183,0,0.04) 0%, rgba(255,107,53,0.03) 50%, rgba(224,64,251,0.04) 100%)", pointerEvents: "none" }} />

                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,183,0,0.12)", border: "1px solid rgba(255,183,0,0.3)", borderRadius: "100px", padding: "0.2rem 0.75rem", marginBottom: "1.25rem", alignSelf: "flex-start" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffb700" }}>Phase 6 · Coming Soon</span>
                  </div>
                  <div style={{ marginBottom: "1.75rem" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffb700", marginBottom: "0.75rem" }}>Simulation</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "3rem", color: "#fff", letterSpacing: "-0.03em" }}>$79</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "var(--muted)" }}>/month</span>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>Or $699/year — save 26%</p>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "2rem" }}>
                    {[
                      "Everything in Pro",
                      "Full AI Career Simulation",
                      "LLM-powered workplace NPCs",
                      "Real promotion + performance loop",
                      "Personalized skill prerequisite graph",
                      "The Twist Reveal — your AI mirror",
                      "Cheat codes that work in real life",
                    ].map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(255,183,0,0.15)", border: "1px solid rgba(255,183,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#ffb700" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: "rgba(240,238,255,0.55)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button disabled style={{ display: "block", width: "100%", textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#ffb700", background: "rgba(255,183,0,0.08)", border: "1px solid rgba(255,183,0,0.25)", padding: "0.75rem", borderRadius: "100px", cursor: "not-allowed", letterSpacing: "0.02em" }}>
                    Notify Me When Live →
                  </button>
                </div>
              </div>

            </div>

            {/* Enterprise footnote */}
            <div className="reveal" style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(240,238,255,0.3)", lineHeight: 1.7 }}>
                Need white-label, custom scenarios, or enterprise seat licensing?{" "}
                <a href="https://aimaestro.academy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(240,238,255,0.55)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                  Talk to us about Enterprise ↗
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── VISION ──────────────────────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "55vh", display: "flex", alignItems: "center", overflow: "hidden", margin: "2rem 0" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d0b14 0%, #1a0d2e 40%, #0d0b14 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(123,47,190,0.15) 0%, transparent 60%)" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: "800px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
            <div className="label-caps reveal" style={{ color: "var(--purple)", marginBottom: "1.5rem" }}>The Vision</div>
            <blockquote className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "#fff", lineHeight: 1.3, marginBottom: "1.5rem" }}>
              &ldquo;The most powerful professionals of this decade won&apos;t be the ones who know how to code. They&apos;ll be the ones who know how to conduct.&rdquo;
            </blockquote>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "var(--muted)" }}>
              Felipe Maestro · Maestro Academy
            </p>
          </div>
        </section>

        {/* ── CLOSING CTA ─────────────────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "4rem 2rem" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(0,212,240,0.07) 0%, rgba(123,47,190,0.1) 30%, transparent 65%)", pointerEvents: "none", animation: "pulse-glow 4s ease-in-out infinite" }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 10, maxWidth: "700px" }}>
            <div className="label-caps reveal" style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>The orchestra is ready.</div>
            <h2 className="reveal" style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "#fff", lineHeight: 1.05, marginBottom: "1.25rem" }}>
              Are you?
            </h2>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Start your first game free. No signup. No credit card.
            </p>
            <p className="reveal" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(240,238,255,0.3)", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              Join the professionals closing the AI gap — one game at a time.
            </p>
            <div className="reveal" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/games/welcome-to-ai" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#08060f", background: "linear-gradient(90deg,#00d4f0,#e040fb)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none", boxShadow: "0 0 40px rgba(0,212,240,0.25)" }}>
                Play Free →
              </Link>
              <Link href="/games" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "1rem", color: "rgba(240,238,255,0.7)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", padding: "1rem 2.5rem", borderRadius: "100px", textDecoration: "none" }}>
                See All 14 Games
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
