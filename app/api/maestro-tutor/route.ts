import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

type Message = { role: "user" | "assistant"; content: string }

// ── Post-game Socratic dialogue (original) ───────────────────────────────────
const POST_GAME_SYSTEM = `You are the Maestro — a wise, demanding, cinematic AI mentor in MaestroPlay.

You just watched the student complete a game. Your job is to deepen their understanding through Socratic dialogue. You NEVER give direct answers — you ask questions that lead students to discover insights themselves.

Your method:
1. Begin by naming a specific concept from the game they just played
2. Ask a question that probes their actual understanding
3. Celebrate genuine insight

Rules:
- MUST be strictly under 25 words
- Highlight key terminology using double asterisks (e.g. "**Role Assignment**")
- Keep it extremely concise for a quick chat bubble
- End with a thought-provoking question`

// ── In-game floating tutor (new — strict Socratic, NEVER gives the answer) ───
const IN_GAME_SYSTEM = `You are Koda — a tiny, friendly AI robot companion who floats beside students as they play MaestroPlay, an AI literacy game.

Your ONE ABSOLUTE RULE: You NEVER give the answer. Not even close. The answer lives inside them.

What you DO instead:
- Ask one guiding question pointing toward the insight
- Use a short visceral analogy
- Reflect back what they said

Rules:
- MUST be strictly under 25 words
- Highlight key terminology using double asterisks (e.g. "**Prompt Constraints**")
- Keep it extremely concise for a quick chat bubble
- ALWAYS end with a question`

const MOCK_IN_GAME = [
  "If you request 'dinner', what does the chef make? Try **prompt constraints** like a specific recipe. How does that change the **output quality**?",
  "What words does the AI have here? What **context** is missing that would change the **generated output**?",
  "Think of a conductor. What is the difference between waving randomly versus following a **structured score**? How does that map to **prompt structure**?",
  "What would make this go the opposite way? What **variable** must you change to shift the **predictive pattern**?",
]

const MOCK_POST_GAME = [
  "You say AI amplifies input. What happens to a vague question? What exactly does **input amplification** do to noise?",
  "If you tell an orchestra to 'play something beautiful,' what happens? How does **role assignment** guide them?",
  "Why does **specificity** help? Is it about restricting the AI's **predictive path**, or about clarifying your goal?",
  "What is the difference between telling the AI what you want and showing it via **one-shot examples**?",
]

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      gameTitle,
      gameSlug,
      sceneConcept,
      sceneConceptBody,
      sceneScenario,
      sceneQuestion,
      inGame,
      direct,
    } = await req.json() as {
      messages:          Message[]
      gameTitle?:        string
      gameSlug?:         string
      /** In-game: current scene concept title */
      sceneConcept?:     string
      /** In-game: current scene concept body */
      sceneConceptBody?: string
      /** In-game: current scene scenario text */
      sceneScenario?:    string
      /** In-game: the question the player is currently facing */
      sceneQuestion?:    string
      /** true = student is mid-game, use strict Socratic mode */
      inGame?:           boolean
      /** post-game escape hatch — ignored for in-game mode */
      direct?:           boolean
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array required" }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_key_here") {
      const mocks = inGame ? MOCK_IN_GAME : MOCK_POST_GAME
      const mock = mocks[Math.floor(Math.random() * mocks.length)]
      return NextResponse.json({ reply: mock })
    }

    const client = new Anthropic({ apiKey })

    let systemPrompt: string

    if (inGame) {
      // Strict in-game mode — no escape hatch, full scene context
      const contextLines: string[] = [
        `Game: "${gameTitle ?? "an AI literacy game"}" (${gameSlug ?? "unknown"})`,
      ]
      if (sceneConcept)     contextLines.push(`Current concept being taught: "${sceneConcept}"`)
      if (sceneConceptBody) contextLines.push(`Concept explanation: ${sceneConceptBody}`)
      if (sceneScenario)    contextLines.push(`Current scene situation: ${sceneScenario}`)
      if (sceneQuestion)    contextLines.push(`The question the student is currently facing: ${sceneQuestion}`)

      systemPrompt = `${IN_GAME_SYSTEM}

---
CURRENT GAME CONTEXT (use this to give specific, relevant hints):
${contextLines.join("\n")}`
    } else {
      // Post-game mode — original behavior with optional escape hatch
      systemPrompt = `${POST_GAME_SYSTEM}

Game the student just completed: "${gameTitle ?? "an AI literacy game"}" (${gameSlug ?? "unknown"}).
${direct ? "\nThe student has invoked the direct answer escape hatch. Answer directly this one time." : ""}`
    }

    const message = await client.messages.create({
      model:      "claude-haiku-4-5",  // Haiku for speed — tutor needs to feel instant
      max_tokens: 250,
      system:     systemPrompt,
      messages:   messages.map(m => ({ role: m.role, content: m.content })),
    })

    const reply = message.content[0].type === "text" ? message.content[0].text.trim() : ""
    return NextResponse.json({ reply })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    console.error("maestro-tutor error:", err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
