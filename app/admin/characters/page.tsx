"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

/* ─── Character definitions ──────────────────────────────────────────────── */

interface CharacterItem {
  id: string
  name: string
  role: string
  game: string
  imagePath: string
  maestroImagePath?: string
  accentColor: string
  status: "done" | "pending" | "missing"
  imageExists?: boolean
  maestroExists?: boolean
  generationPrompt: string
  maestroPrompt?: string
  notes?: string
}

const CHARACTERS: CharacterItem[] = [
  {
    id: "jake",
    name: "Jake",
    role: "17-year-old guitarist",
    game: "Games 1, 11, 12 (welcome-to-ai, microsoft-copilot, copilot-studio)",
    imagePath: "/images/guitarplayer1.png",
    accentColor: "#ff6b35",
    status: "done",
    generationPrompt: "A confident 17-year-old male musician with a guitar, cinematic dark background, neon accent lighting, photorealistic portrait, from below looking up slightly, electric guitarist, teenage but mature for age, determined expression",
    notes: "Uses guitarplayer1.png — already generated",
  },
  {
    id: "zoe",
    name: "Zoe",
    role: "26-year-old data journalist",
    game: "Game 2 (how-ai-works)",
    imagePath: "/images/zoe.png",
    maestroImagePath: "/images/maestro-zoe.png",
    accentColor: "#a78bfa",
    status: "done",
    generationPrompt: "A curious 26-year-old Black woman data journalist, confident expression, modern office background with screens showing data visualizations, cinematic dark aesthetic, neon purple accent lighting, photorealistic portrait",
    maestroPrompt: "Same Zoe character in an orchestral performance hall, conductor pose, formal but artistic clothing, triumph expression, dark cinematic backdrop with purple neon glow",
  },
  {
    id: "carlos",
    name: "Carlos",
    role: "42-year-old operations manager",
    game: "Game 3 (ai-for-professionals)",
    imagePath: "/images/carlos.png",
    maestroImagePath: "/images/maestro-carlos.png",
    accentColor: "#00d4f0",
    status: "done",
    generationPrompt: "A competent 42-year-old Latino man in a modern office, operations manager, business casual, thoughtful expression, cinematic dark background with teal neon accent lighting, photorealistic portrait",
    maestroPrompt: "Same Carlos character holding a conductor's baton triumphantly, cinematic backstage setting, teal neon glow",
  },
  {
    id: "aria",
    name: "Aria",
    role: "33-year-old AI ethicist",
    game: "Game 4 (the-conductor-test)",
    imagePath: "/images/aria.png",
    maestroImagePath: "/images/maestro-aria.png",
    accentColor: "#f472b6",
    status: "done",
    generationPrompt: "A brilliant 33-year-old South Asian woman AI ethicist, intellectual expression, futuristic research lab background, cinematic dark aesthetic with pink neon accent lighting, photorealistic portrait",
    maestroPrompt: "Same Aria character in an orchestral hall, philosophical and triumphant, conductor gesture, pink neon glow, cinematic",
  },
  {
    id: "jordan",
    name: "Jordan",
    role: "29-year-old creative director",
    game: "Game 5 (claude-chat-unlocked)",
    imagePath: "/images/jordan.png",
    maestroImagePath: "/images/maestro-jordan.png",
    accentColor: "#34d399",
    status: "done",
    generationPrompt: "A stylish 29-year-old non-binary creative director, artistic studio background, confident pose, cinematic dark background with green neon accent lighting, photorealistic portrait, androgynous features",
    maestroPrompt: "Same Jordan character in a creative victory pose at a conductor's podium, green neon glow, cinematic dark",
  },
  {
    id: "kai",
    name: "Kai",
    role: "24-year-old software developer",
    game: "Game 6 (claude-code-unlocked)",
    imagePath: "/images/kai.png",
    maestroImagePath: "/images/maestro-kai.png",
    accentColor: "#10b981",
    status: "done",
    generationPrompt: "A focused 24-year-old Asian male software developer, multiple monitors in background showing code, cinematic dark aesthetic with emerald green neon accent lighting, photorealistic portrait, determined expression",
    maestroPrompt: "Same Kai character in developer victory pose with code screens behind, emerald neon glow, cinematic dark",
  },
  {
    id: "priya",
    name: "Priya",
    role: "38-year-old HR director",
    game: "Game 7 (claude-for-work)",
    imagePath: "/images/priya.png",
    maestroImagePath: "/images/maestro-priya.png",
    accentColor: "#818cf8",
    status: "done",
    generationPrompt: "A professional 38-year-old South Asian woman HR director, elegant business attire, modern corporate office background, cinematic dark aesthetic with indigo neon accent lighting, photorealistic portrait, warm but authoritative expression",
    maestroPrompt: "Same Priya in triumphant conductor pose, indigo neon glow, cinematic corporate concert hall",
  },
  {
    id: "alex",
    name: "Alex",
    role: "31-year-old marketing strategist",
    game: "Game 8 (chatgpt-mastery)",
    imagePath: "/images/alex.png",
    maestroImagePath: "/images/maestro-alex.png",
    accentColor: "#4ade80",
    status: "done",
    generationPrompt: "A dynamic 31-year-old marketing strategist, gender-neutral features, creative agency background, cinematic dark aesthetic with lime green neon accent lighting, photorealistic portrait, energetic expression",
    maestroPrompt: "Same Alex in a victorious marketing-themed conductor scene, lime neon glow, cinematic",
  },
  {
    id: "luna",
    name: "Luna",
    role: "27-year-old AI researcher",
    game: "Game 9 (gemini-unlocked)",
    imagePath: "/images/luna.png",
    maestroImagePath: "/images/maestro-luna.png",
    accentColor: "#60a5fa",
    status: "done",
    generationPrompt: "An imaginative 27-year-old woman AI researcher, dreamy futuristic lab background, cinematic dark aesthetic with blue neon accent lighting, photorealistic portrait, curious and visionary expression",
    maestroPrompt: "Same Luna in a cosmic research-themed conductor scene, blue neon glow, cinematic star-filled background",
  },
  {
    id: "sam",
    name: "Sam",
    role: "22-year-old computer science student",
    game: "Game 10 (gemini-cli-unlocked)",
    imagePath: "/images/sam.png",
    maestroImagePath: "/images/maestro-sam.png",
    accentColor: "#fbbf24",
    status: "done",
    generationPrompt: "A clever 22-year-old computer science student, gender-neutral features, terminal and CLI screens in background, cinematic dark aesthetic with amber neon accent lighting, photorealistic portrait, curious excited expression",
    maestroPrompt: "Same Sam in a tech-themed conductor victory scene, amber neon glow, cinematic",
  },
  {
    id: "maya",
    name: "Maya",
    role: "31-year-old UX designer & prompt engineer",
    game: "Game 13 / Week 14 (prompt-lab) — THE PROMPT LAB",
    imagePath: "/images/maya.png",
    maestroImagePath: "/images/maestro-maya.png",
    accentColor: "#e879f9",
    status: "missing",
    generationPrompt: `Photorealistic portrait of Maya, a 31-year-old South Asian woman UX designer and prompt engineer.
Cinematic dark background with fuchsia/magenta neon accent lighting.
She has a thoughtful, slightly mischievous expression — she knows something you don't yet.
Modern aesthetic: possibly wearing a stylish blazer or creative professional outfit.
She might have a tablet or laptop visible at the edge.
High-quality cinematic portrait, center frame, face clearly visible, 4K quality.
Style: dark cinematic, neon-lit, editorial photography feel.
Do NOT include text in the image.`,
    maestroPrompt: `Same Maya character after her breakthrough — she's at a digital "conductor's podium" (a glowing monitor/interface),
hands raised like a conductor directing the AI. Fuchsia/magenta neon glow fills the frame.
Expression: triumphant, joyful, electric. She has MASTERED this.
Same photorealistic style, dark cinematic background.`,
    notes: "CRITICAL — maya.png is missing. Game 13 (The Prompt Lab) cannot show a character portrait without it.",
  },
  {
    id: "felipe-maestro",
    name: "Felipe Maestro",
    role: "The Conductor — Maestro of AI",
    game: "All games — end screen MaestroTransformation + interstitials",
    imagePath: "/images/maestro-felipe.png",
    accentColor: "#ffb700",
    status: "missing",
    generationPrompt: `Photorealistic portrait of Felipe Maestro — THE conductor of an AI learning academy.
He is ageless but distinguished — mid-40s to 50s appearance, mixed heritage (Mediterranean/Latin), silver-streaked dark hair,
intense intelligent eyes, subtle knowing smile. He is dressed in a formal dark conductor's coat with subtle gold trim.
Background: concert hall at night, golden neon lighting emanating from behind him.
Expression: wise, welcoming, slightly mysterious — like a mentor who has seen everything.
He holds a conductor's baton, raised slightly.
Cinematic quality, dark aesthetic, gold accent lighting, 4K photorealistic.
This is the FACE of MaestroPlay — the mentor figure players look up to.
Do NOT include text in the image.`,
    maestroPrompt: `Felipe Maestro in full conductor stance — baton dramatically raised, concert hall behind him,
golden light radiating from the stage. His expression is one of pure mastery — this is his moment.
Full body or three-quarter shot preferred. Same photorealistic dark cinematic style.
This is the hero image for the MaestroTransformation end screen.`,
    notes: "Felipe Maestro is the master conductor — the face of the platform. Should be iconic, inspiring, memorable.",
  },
]

const GENERATION_TOOLS = [
  { name: "Gemini Imagen 3", url: "https://gemini.google.com", badge: "Recommended", color: "#4ade80" },
  { name: "Midjourney", url: "https://midjourney.com", badge: "Best Quality", color: "#60a5fa" },
  { name: "DALL-E 3 (ChatGPT)", url: "https://chat.openai.com", badge: "Easiest", color: "#f59e0b" },
  { name: "Adobe Firefly", url: "https://firefly.adobe.com", badge: "No Copyright", color: "#e040fb" },
]

const LS_KEY = "maestro_char_gen_checklist"

function getChecked(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}") } catch { return {} }
}

export default function CharacterGenPage() {
  const [checked,     setChecked]     = useState<Record<string, boolean>>({})
  const [expanded,    setExpanded]    = useState<string | null>(null)
  const [mounted,     setMounted]     = useState(false)
  const [copyMsg,     setCopyMsg]     = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setChecked(getChecked())
  }, [])

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  const copyPrompt = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMsg(`Copied ${label} prompt!`)
      setTimeout(() => setCopyMsg(null), 2000)
    })
  }

  const done    = CHARACTERS.filter(c => checked[c.id] || c.status === "done").length
  const total   = CHARACTERS.length
  const missing = CHARACTERS.filter(c => c.status === "missing")
  const pending = CHARACTERS.filter(c => c.status === "pending")

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem 1.5rem 5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/admin/twitter" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(240,238,255,0.4)", textDecoration: "none", marginBottom: "1rem", display: "inline-block" }}>
            ← Admin
          </Link>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "2.5rem", color: "#fff", marginBottom: "0.5rem" }}>
            Character Generation Dashboard
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(240,238,255,0.5)", marginBottom: "1.5rem" }}>
            Track which character portraits have been generated. Check off items as you complete them.
          </p>

          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", height: "10px", marginBottom: "0.5rem", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: mounted ? `${(done / total) * 100}%` : "0%",
              background: "linear-gradient(90deg, #10b981, #00d4f0)",
              borderRadius: "8px",
              transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(240,238,255,0.4)" }}>
            {done} of {total} characters complete
            {missing.length > 0 && <span style={{ color: "#f87171", marginLeft: "0.75rem" }}>· {missing.length} missing</span>}
          </div>
        </div>

        {/* ── Generation Tools ── */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,238,255,0.3)", marginBottom: "0.75rem" }}>
            AI Image Generation Tools
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {GENERATION_TOOLS.map(tool => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: `${tool.color}10`, border: `1px solid ${tool.color}30`,
                  borderRadius: "100px", padding: "0.35rem 0.85rem",
                  textDecoration: "none",
                  fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 600, color: tool.color,
                }}
              >
                {tool.name}
                <span style={{ fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.1em", opacity: 0.7 }}>
                  {tool.badge}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Copy toast ── */}
        {copyMsg && (
          <div style={{
            position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            background: "rgba(16,185,129,0.95)", borderRadius: "100px",
            padding: "0.55rem 1.4rem",
            fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff",
            boxShadow: "0 4px 24px rgba(16,185,129,0.3)", zIndex: 9999,
          }}>
            ✓ {copyMsg}
          </div>
        )}

        {/* ── Missing first (urgent) ── */}
        {missing.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#f87171", marginBottom: "0.75rem" }}>
              ⚠ Needs Generation ({missing.length})
            </div>
            {missing.map(char => (
              <CharacterRow
                key={char.id}
                char={char}
                checked={mounted ? !!checked[char.id] : false}
                expanded={expanded === char.id}
                onToggle={() => toggle(char.id)}
                onExpand={() => setExpanded(expanded === char.id ? null : char.id)}
                onCopy={(text, label) => copyPrompt(text, label)}
              />
            ))}
          </div>
        )}

        {/* ── All characters ── */}
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,238,255,0.3)", marginBottom: "0.75rem" }}>
            All Characters ({CHARACTERS.length})
          </div>
          {CHARACTERS.map(char => (
            <CharacterRow
              key={char.id}
              char={char}
              checked={mounted ? !!checked[char.id] : (char.status === "done")}
              expanded={expanded === char.id}
              onToggle={() => toggle(char.id)}
              onExpand={() => setExpanded(expanded === char.id ? null : char.id)}
              onCopy={(text, label) => copyPrompt(text, label)}
            />
          ))}
        </div>

        {/* ── Felipe Maestro highlight ── */}
        <div style={{
          marginTop: "3rem",
          background: "rgba(255,183,0,0.06)",
          border: "1px solid rgba(255,183,0,0.25)",
          borderRadius: "20px",
          padding: "1.75rem 2rem",
        }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#ffb700", marginBottom: "0.75rem" }}>
            🎼 Felipe Maestro — Priority Generation
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 700, fontSize: "1.8rem", color: "#fff", marginBottom: "0.5rem" }}>
            Generate Felipe Maestro
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(240,238,255,0.55)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            Felipe Maestro is the face of MaestroPlay — the wise conductor who presides over every student&apos;s transformation.
            He currently uses a placeholder image (maestroplayer1.png). Generate a definitive portrait using the prompt below.
          </p>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.12em", color: "#ffb700", marginBottom: "0.5rem" }}>
            GENERATION PROMPT
          </div>
          <div style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,183,0,0.15)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "rgba(240,238,255,0.8)",
            lineHeight: 1.7,
            marginBottom: "1rem",
            whiteSpace: "pre-wrap",
          }}>
            {CHARACTERS.find(c => c.id === "felipe-maestro")?.generationPrompt}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              onClick={() => copyPrompt(CHARACTERS.find(c => c.id === "felipe-maestro")?.generationPrompt ?? "", "Felipe Maestro")}
              style={{
                fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.75rem",
                color: "#08060f", background: "linear-gradient(90deg, #ffb700, #ff9800)",
                border: "none", borderRadius: "100px", padding: "0.5rem 1.25rem",
                cursor: "pointer",
              }}
            >
              Copy Prompt →
            </button>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "rgba(240,238,255,0.35)", alignSelf: "center" }}>
              Save result as: <code style={{ color: "#ffb700" }}>public/images/maestro-felipe.png</code>
            </div>
          </div>
        </div>

        {/* ── File naming guide ── */}
        <div style={{
          marginTop: "2rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
        }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(240,238,255,0.3)", marginBottom: "0.75rem" }}>
            File Naming Convention
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "rgba(240,238,255,0.6)", lineHeight: 2 }}>
            <div>Character portrait: <span style={{ color: "#00d4f0" }}>public/images/[name].png</span></div>
            <div>End-screen maestro: <span style={{ color: "#e040fb" }}>public/images/maestro-[name].png</span></div>
            <div>Recommended size: <span style={{ color: "#10b981" }}>512×768px or 1024×1536px (portrait ratio)</span></div>
            <div>Format: <span style={{ color: "#f59e0b" }}>PNG, transparent or dark background</span></div>
          </div>
        </div>

      </div>
    </main>
  )
}

/* ─── Character Row Component ────────────────────────────────────────────── */
function CharacterRow({
  char, checked, expanded, onToggle, onExpand, onCopy,
}: {
  char: CharacterItem
  checked: boolean
  expanded: boolean
  onToggle: () => void
  onExpand: () => void
  onCopy: (text: string, label: string) => void
}) {
  const isDone    = checked || char.status === "done"
  const isMissing = char.status === "missing" && !checked
  const color     = char.accentColor

  return (
    <div style={{
      background: isDone ? `${color}06` : isMissing ? "rgba(248,113,113,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${isDone ? color + "30" : isMissing ? "rgba(248,113,113,0.25)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: "16px",
      marginBottom: "0.6rem",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Row header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.9rem 1.25rem",
        cursor: "pointer",
      }}
        onClick={onExpand}
      >
        {/* Checkbox */}
        <div
          onClick={e => { e.stopPropagation(); onToggle() }}
          style={{
            width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
            border: `2px solid ${isDone ? color : "rgba(255,255,255,0.2)"}`,
            background: isDone ? color : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          {isDone && <span style={{ color: "#08060f", fontWeight: 900, fontSize: "0.75rem" }}>✓</span>}
        </div>

        {/* Image preview */}
        <div style={{
          width: "42px", height: "42px", borderRadius: "10px", overflow: "hidden", flexShrink: 0,
          background: `${color}20`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${color}30`,
        }}>
          {/* Try to load the image */}
          <img
            src={char.imagePath}
            alt={char.name}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: isDone ? "#fff" : isMissing ? "#fca5a5" : "rgba(240,238,255,0.7)" }}>
              {char.name}
            </span>
            <span style={{
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.5rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: isDone ? color : isMissing ? "#f87171" : "rgba(240,238,255,0.3)",
              background: isDone ? `${color}18` : isMissing ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isDone ? color + "40" : isMissing ? "rgba(248,113,113,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "100px", padding: "0.1rem 0.45rem",
            }}>
              {isDone ? "Done" : isMissing ? "Missing" : "Pending"}
            </span>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "rgba(240,238,255,0.38)", marginTop: "0.12rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {char.role} · {char.game}
          </div>
        </div>

        {/* Expand chevron */}
        <div style={{ color: "rgba(240,238,255,0.3)", fontSize: "0.8rem", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.25rem 1.5rem" }}>
          {char.notes && (
            <div style={{
              background: isMissing ? "rgba(248,113,113,0.06)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isMissing ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: "10px", padding: "0.65rem 0.9rem",
              fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
              color: isMissing ? "#fca5a5" : "rgba(240,238,255,0.5)",
              marginBottom: "1rem", lineHeight: 1.5,
            }}>
              {isMissing ? "⚠ " : "ℹ "}{char.notes}
            </div>
          )}

          {/* File paths */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,238,255,0.3)", marginBottom: "0.4rem" }}>
              File Paths
            </div>
            <code style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#00d4f0", display: "block" }}>{char.imagePath}</code>
            {char.maestroImagePath && (
              <code style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#e040fb", display: "block", marginTop: "0.2rem" }}>{char.maestroImagePath}</code>
            )}
          </div>

          {/* Generation prompt */}
          <div style={{ marginBottom: char.maestroPrompt ? "1rem" : 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,238,255,0.3)" }}>
                Portrait Prompt
              </div>
              <button
                onClick={() => onCopy(char.generationPrompt, `${char.name} portrait`)}
                style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem",
                  color: color, background: `${color}15`,
                  border: `1px solid ${color}30`,
                  borderRadius: "100px", padding: "0.2rem 0.65rem",
                  cursor: "pointer",
                }}
              >
                Copy
              </button>
            </div>
            <div style={{
              background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px", padding: "0.75rem 1rem",
              fontFamily: "monospace", fontSize: "0.73rem",
              color: "rgba(240,238,255,0.65)", lineHeight: 1.65, whiteSpace: "pre-wrap",
            }}>
              {char.generationPrompt}
            </div>
          </div>

          {/* Maestro prompt */}
          {char.maestroPrompt && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,238,255,0.3)" }}>
                  Maestro End-Screen Prompt
                </div>
                <button
                  onClick={() => onCopy(char.maestroPrompt!, `${char.name} maestro`)}
                  style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.6rem",
                    color: "#e040fb", background: "rgba(224,64,251,0.12)",
                    border: "1px solid rgba(224,64,251,0.25)",
                    borderRadius: "100px", padding: "0.2rem 0.65rem",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
              </div>
              <div style={{
                background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "0.75rem 1rem",
                fontFamily: "monospace", fontSize: "0.73rem",
                color: "rgba(240,238,255,0.65)", lineHeight: 1.65, whiteSpace: "pre-wrap",
              }}>
                {char.maestroPrompt}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
