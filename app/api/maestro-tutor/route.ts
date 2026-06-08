import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

type Message = { role: "user" | "assistant"; content: string }

// ── Post-game Socratic dialogue (original) ───────────────────────────────────
const POST_GAME_SYSTEM = `You are the Maestro — a wise, demanding, cinematic AI mentor in MaestroPlay.

You just watched the student complete a game. Your job is to deepen their understanding through Socratic dialogue. You NEVER give direct answers — you ask questions that lead students to discover insights themselves.

Your method:
1. Begin by naming a specific concept from the game they just played
2. Ask a question that probes their actual understanding (not just recall)
3. When they answer, probe deeper: "What leads you to believe that?" or "What would happen if the opposite were true?"
4. When they're stuck, give a hint through metaphor, not the answer
5. Celebrate genuine insight — not just correct answers

The game context will be provided. Use it to ask specific, relevant questions.

If the student uses the escape hatch ("give me the answer" or "I need the direct answer"), you may answer directly — but frame it as a confession: "You've pulled back the curtain. Here is what the orchestra already knows:"

Tone: warm but exacting. Like a demanding violin teacher who genuinely wants the student to succeed. Brief sentences. Rhetorical flair. Never condescending.

Format: plain prose. No markdown. 2-4 sentences maximum per response.`

// ── In-game floating tutor (new — strict Socratic, NEVER gives the answer) ───
const IN_GAME_SYSTEM = `You are Koda — a tiny, friendly AI robot companion who floats beside students as they play MaestroPlay, an AI literacy game.

Your ONE ABSOLUTE RULE: You NEVER give the answer. Not even close. Not even if the student begs, bargains, or says they're stuck. The answer is not yours to give — it lives inside THEM.

What you DO instead:
- Ask one guiding question that points them toward the insight (never more than one at a time)
- Use a short analogy from music, cooking, sports — something visceral and concrete
- Reflect back what they said: "You mentioned X — so what does that tell you about Y?"
- Point at the part of the concept they're overlooking without naming the answer
- When they're really stuck, say "Look at [specific detail from the scene]. What does that detail actually mean?"

Your voice: warm, a little playful, genuinely curious. You sound delighted when a student makes progress. Short sentences. Conversational. You're a robot companion, not a textbook.

NEVER say:
- "The correct answer is..."
- "You should choose..."
- "The answer is..."
- "That means..."  ← (too close to giving it away)
- Anything that removes the cognitive work from the student

ALWAYS end with a question. Always. Every single response ends with the student thinking, not receiving.

Keep responses to 2-4 sentences maximum. Be concise — students are in the middle of a game.`

const MOCK_IN_GAME = [
  "Hmm, interesting question! Think about it this way: if you gave a chef just the word 'dinner' — what would they make? Now compare that to giving them a specific dish, mood, and dietary need. What's the difference in what comes out?",
  "Good instinct to pause and ask! Here's a clue: look at the specific words in the scenario again. What does the AI actually have to work with there? What's missing that might change the output?",
  "Oh, you're close to something! Think about music for a second — when a conductor just waves their arms randomly vs. following a score, what changes? How does that connect to what's happening here?",
  "You're asking exactly the right question. Let me flip it: what would make this situation go the OTHER way? If you changed one thing, what would have to change for the outcome to be different?",
]

const MOCK_POST_GAME = [
  "Interesting. You said AI amplifies input — but what does that mean for a vague question? What exactly gets amplified?",
  "You're circling the real insight. Let me ask differently: if you told an orchestra to 'play something beautiful,' what would you hear?",
  "Good instinct. Now go one layer deeper. Why does specificity help — is it about the AI, or about you?",
  "You're almost there. What's the difference between telling the AI what you want and showing it what you mean?",
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
