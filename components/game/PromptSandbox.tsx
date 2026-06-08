"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PromptSandbox() {
  const [persona, setPersona] = useState(false)
  const [specificity, setSpecificity] = useState(false)
  const [constraints, setConstraints] = useState(false)
  
  const [conducting, setConducting] = useState(false)
  const [conducted, setConducted] = useState(false)
  const [typewriterText, setTypewriterText] = useState("")

  // Generate target prompt based on toggled states
  const getPromptText = () => {
    let p = ""
    if (persona) p += "As an award-winning indie music producer, "
    p += "Write a song about leaving Westbrook Heights"
    if (specificity) p += ", with a raw Arctic Monkeys grit, dynamic tempo shifts, and overdriven lead guitar"
    if (constraints) p += ", avoiding any predictable rhymes, pop clichés, or resolving the bridge too quickly"
    p += "."
    return p
  }

  const promptText = getPromptText()

  // Typewriter effect for prompt editor
  useEffect(() => {
    let active = true
    let idx = 0
    setTypewriterText("")
    
    const interval = setInterval(() => {
      if (!active) return
      if (idx < promptText.length) {
        setTypewriterText(promptText.slice(0, idx + 1))
        idx++
      } else {
        clearInterval(interval)
      }
    }, 15)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [persona, specificity, constraints])

  const handleConduct = () => {
    setConducting(true)
    setConducted(false)
    setTimeout(() => {
      setConducting(false)
      setConducted(true)
    }, 1800)
  }

  // Determine output based on state
  const getAIOutput = () => {
    const activeCount = (persona ? 1 : 0) + (specificity ? 1 : 0) + (constraints ? 1 : 0)
    
    if (activeCount === 0) {
      return {
        grade: "D- ( Elevator Music )",
        color: "#ef4444",
        feedback: "No direction provided. The model returned a generic, nursery-rhyme style structure.",
        lyrics: `[Verse 1]
Westbrook Heights is far away,
I am leaving here today.
My guitar is packed, I'm feeling sad,
This is the worst show I have had.

[Chorus]
Oh I'm going, yes I'm gone,
Goodbye Westbrook, hello dawn...`
      }
    } else if (activeCount === 1) {
      return {
        grade: "C+ ( Amateur Demo )",
        color: "#fbbf24",
        feedback: "Better details, but missing constraints or persona context. Lyrics are still slightly predictable.",
        lyrics: `[Verse 1]
The green room hums at midnight,
Westbrook Heights is fading in the rearview mirror.
I've got my guitar packed in the backseat,
We played our last show and it was loud...

[Chorus]
But the feedback is still in my ears,
As I drive away from all these years...`
      }
    } else if (activeCount === 2) {
      return {
        grade: "B+ ( Studio Draft )",
        color: "#00d4f0",
        feedback: "Strong structure and texture. Adding the final parameter will unlock professional-grade lyricism.",
        lyrics: `[Verse 1]
Midnight glare on the cardboard seams,
The amp is cold in the hallway.
We didn't talk about the last set at Riverside,
We just let the overdriven feedback bleed out.

[Chorus]
Now the tires whine on the Westbrook highway,
No soft endings, just concrete noise and empty seats...`
      }
    } else {
      return {
        grade: "A+ ( Professional Masterpiece )",
        color: "#10b981",
        feedback: "Perfect Conductor setup! The model matches the style, maintains narrative grit, and avoids all pop tropes.",
        lyrics: `[Verse 1]
Fluorescent flickers on cardboard boxes,
The amp is still warm, humming a low static in the hallway.
Two hundred kids watched the lead guitar cut out,
Tyler said it was a hit, but we both heard the cracks in the bridge.

[Chorus]
Now Westbrook is just an afterglow in the side mirror,
A slow unraveling. No cheap resolution.
Just twenty miles of overdriven tire hum and Westbrook receding...`
      }
    }
  }

  const output = getAIOutput()

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "0 auto",
      background: "rgba(12, 8, 22, 0.65)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "24px",
      padding: "2.5rem",
      backdropFilter: "blur(20px)",
      boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,212,240,0.03)"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "2.5rem",
        alignItems: "start"
      }}>
        {/* Left Column: Toggles */}
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(0, 212, 240, 0.1)",
            border: "1px solid rgba(0, 212, 240, 0.25)",
            padding: "0.3rem 0.8rem",
            borderRadius: "100px",
            marginBottom: "1.25rem"
          }}>
            <span style={{ fontSize: "0.8rem" }}>🎹</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", color: "#00d4f0", letterSpacing: "0.1em" }}>Interactive Console</span>
          </div>
          
          <h3 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 700,
            fontSize: "2rem",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: "1rem"
          }}>
            Conduct the Prompt
          </h3>
          
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.85rem",
            color: "rgba(240, 238, 255, 0.7)",
            lineHeight: 1.6,
            marginBottom: "2rem"
          }}>
            AI behaves like an orchestra. Tweak the conductor parameters below to watch how the draft prompt constructs itself, then click <strong>Conduct AI</strong> to generate the output.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            {/* Toggle 1 */}
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              borderRadius: "14px",
              background: persona ? "rgba(168, 85, 247, 0.08)" : "rgba(255,255,255,0.02)",
              border: `1.5px solid ${persona ? "#a855f7" : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              <input
                type="checkbox"
                checked={persona}
                onChange={() => { setPersona(!persona); setConducted(false) }}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#a855f7",
                  cursor: "pointer"
                }}
              />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff", marginBottom: "0.15rem" }}>Add Persona</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "rgba(240, 238, 255, 0.5)" }}>Instructs the AI to think like an expert music producer.</div>
              </div>
            </label>

            {/* Toggle 2 */}
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              borderRadius: "14px",
              background: specificity ? "rgba(0, 212, 240, 0.08)" : "rgba(255,255,255,0.02)",
              border: `1.5px solid ${specificity ? "#00d4f0" : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              <input
                type="checkbox"
                checked={specificity}
                onChange={() => { setSpecificity(!specificity); setConducted(false) }}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#00d4f0",
                  cursor: "pointer"
                }}
              />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff", marginBottom: "0.15rem" }}>Add Specificity</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "rgba(240, 238, 255, 0.5)" }}>Provides rich style, texture, and instrument details.</div>
              </div>
            </label>

            {/* Toggle 3 */}
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1rem",
              borderRadius: "14px",
              background: constraints ? "rgba(224, 64, 251, 0.08)" : "rgba(255,255,255,0.02)",
              border: `1.5px solid ${constraints ? "#e040fb" : "rgba(255,255,255,0.08)"}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
              <input
                type="checkbox"
                checked={constraints}
                onChange={() => { setConstraints(!constraints); setConducted(false) }}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#e040fb",
                  cursor: "pointer"
                }}
              />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff", marginBottom: "0.15rem" }}>Add Constraints</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "rgba(240, 238, 255, 0.5)" }}>Excludes clichés and shapes the structural path.</div>
              </div>
            </label>
          </div>

          <button
            onClick={handleConduct}
            disabled={conducting}
            style={{
              width: "100%",
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#08060f",
              background: "linear-gradient(90deg, #00d4f0, #e040fb)",
              padding: "1rem",
              borderRadius: "100px",
              border: "none",
              cursor: conducting ? "wait" : "pointer",
              boxShadow: "0 0 24px rgba(0, 212, 240, 0.3)",
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)" }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
          >
            {conducting ? "Conducting Orchestra..." : "Conduct AI →"}
          </button>
        </div>

        {/* Right Column: Console screens */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", height: "100%" }}>
          {/* Prompt Editor Output */}
          <div style={{
            background: "rgba(8, 6, 15, 0.9)",
            border: "1.5px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "1.25rem",
            position: "relative",
            minHeight: "130px"
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "rgba(240, 238, 255, 0.4)",
              textTransform: "uppercase",
              marginBottom: "0.6rem"
            }}>
              Conductor's Prompt Console
            </div>
            
            <div style={{
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: "#00d4f0",
              lineHeight: 1.5,
              wordBreak: "break-word"
            }}>
              {typewriterText}
              <span className="animate-pulse" style={{ display: "inline-block", width: "7px", height: "14px", background: "#00d4f0", marginLeft: "2px", verticalAlign: "middle" }}></span>
            </div>
          </div>

          {/* AI Response Output */}
          <div style={{
            background: "rgba(5, 3, 10, 0.95)",
            border: "1.5px solid rgba(255, 255, 255, 0.08)",
            borderTop: "2px solid #e040fb",
            borderRadius: "16px",
            padding: "1.5rem",
            minHeight: "260px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "rgba(240, 238, 255, 0.4)",
              textTransform: "uppercase",
              marginBottom: "1rem"
            }}>
              AI Response Box
            </div>

            <AnimatePresence mode="wait">
              {conducting ? (
                <motion.div
                  key="conducting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem"
                  }}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "3px solid rgba(0, 212, 240, 0.15)",
                    borderTop: "3px solid #00d4f0",
                    animation: "felipe-glow-pulse 1s linear infinite"
                  }} />
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.78rem",
                    color: "rgba(240, 238, 255, 0.6)",
                    letterSpacing: "0.05em"
                  }}>
                    Synthesizing Lyric Outputs...
                  </div>
                </motion.div>
              ) : conducted ? (
                <motion.div
                  key="conducted"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {/* Grade Badge */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    alignSelf: "flex-start",
                    background: `${output.color}15`,
                    border: `1.5px solid ${output.color}77`,
                    borderRadius: "8px",
                    padding: "0.4rem 0.8rem",
                    marginBottom: "1rem"
                  }}>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      color: output.color
                    }}>
                      {output.grade}
                    </span>
                  </div>

                  {/* Lyrics Typewriter */}
                  <div style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontStyle: "italic",
                    fontSize: "1.1rem",
                    color: "#fff",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                    marginBottom: "1.25rem",
                    flex: 1
                  }}>
                    {output.lyrics}
                  </div>

                  {/* Feedback summary */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "8px",
                    padding: "0.8rem",
                    fontSize: "0.7rem",
                    fontFamily: "Inter, sans-serif",
                    color: "rgba(240, 238, 255, 0.55)",
                    lineHeight: 1.4,
                    borderLeft: `3.5px solid ${output.color}`
                  }}>
                    <strong>Feedback:</strong> {output.feedback}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "2.2rem" }}>🎼</span>
                  <div style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontStyle: "italic",
                    fontSize: "1.2rem",
                    color: "rgba(240, 238, 255, 0.8)",
                    lineHeight: 1.2
                  }}>
                    Waiting for the Conductor
                  </div>
                  <div style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(240, 238, 255, 0.4)",
                    maxWidth: "260px"
                  }}>
                    Toggle parameters and click Conduct to activate the simulated model response.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
