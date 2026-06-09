import { chromium } from "playwright"
import path from "path"
import fs from "fs"
import { loadEnvConfig } from "@next/env"
import Anthropic from "@anthropic-ai/sdk"
import { BskyAgent } from "@atproto/api"
import { allGames } from "../lib/games"

// Load env variables from .env.local
loadEnvConfig(process.cwd())

interface BotState {
  lastChapterIndex: number
  lastPostText: string
  postCount: number
}

const STATE_FILE = path.join(process.cwd(), "scripts", "bot-state.json")

function getBotState(): BotState {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
    } catch (e) {
      console.warn("⚠️ Warning: Failed to parse bot-state.json. Resetting state.")
    }
  }
  return { lastChapterIndex: -1, lastPostText: "", postCount: 0 }
}

function saveBotState(state: BotState) {
  const dir = path.dirname(STATE_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8")
}

// Determine time of day for context
function getTimeOfDay(): { name: "morning" | "afternoon" | "dinner"; promptContext: string } {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return {
      name: "morning",
      promptContext: "It is morning. Frame the hook around starting the workday, morning routines, or kicking off tasks (e.g. morning coffee, checking email backlog, or starting a new coding session)."
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      name: "afternoon",
      promptContext: "It is afternoon. Frame the hook around mid-day struggles, workflow slumps, meeting fatigue, or debugging blockers that slow down productivity."
    }
  } else {
    return {
      name: "dinner",
      promptContext: "It is evening/dinner time. Frame the post as a reflection, winding down, or a bigger-picture thought to ponder after the workday is done."
    }
  }
}

async function run() {
  console.log("🚀 Starting Local Twitter Bot (with Continuity & Time-of-Day)...")

  // 1. Verify Anthropic API Key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error("❌ Error: ANTHROPIC_API_KEY is not defined in .env.local")
    process.exit(1)
  }

  // 2. Check Playwright Authentication State
  const authPath = path.join(process.cwd(), "auth.json")
  if (!fs.existsSync(authPath)) {
    console.error("❌ Error: auth.json not found!")
    console.error("Please run the following command to log in and save your session first:")
    console.error("  npx playwright codegen twitter.com --save-storage=auth.json")
    process.exit(1)
  }

  // 3. Load State and Select Next Chapter (Continuity)
  const state = getBotState()
  const playableGames = allGames.filter(g => g.slug && g.title)
  if (playableGames.length === 0) {
    console.error("❌ Error: No playable games/chapters found.")
    process.exit(1)
  }

  const nextIndex = (state.lastChapterIndex + 1) % playableGames.length
  const game = playableGames[nextIndex]
  const timeContext = getTimeOfDay()

  console.log(`📖 Next Chapter in Sequence: Chapter ${game.week} ("${game.title}")`)
  console.log(`⏰ Time of Day Context: ${timeContext.name.toUpperCase()}`)

  // 4. Generate Tweet Copy with Claude
  console.log("🤖 Generating post copy via Claude...")
  const anthropic = new Anthropic({ apiKey })
  
  const systemPrompt = `You are the voice of Maestro Academy. Confident, warm, punchy, slightly theatrical. You believe AI literacy is the great equalizer.
Your writing style is heavily optimized for X/Twitter virality (SuperX/Tweet Hunter style):
- Start with a strong, scroll-stopping hook (a mistake, a contrarian opinion, or a painful struggle).
- Write in short, declarative, single-sentence paragraphs.
- Use double line breaks between sentences to create plenty of white space.
- Keep the tone authoritative, educational, and slightly philosophical.
- NO hashtags. Emojis only if highly relevant (max 1).
- DO NOT include any links, URLs, or promotional calls-to-action to MaestroPlay yet.
- Keep the output under 260 characters.`

  let userPrompt = `Write a single, highly engaging viral-style X/Twitter post about an AI learning struggle or misconception, inspired by the theme: "${game.description}" (from Chapter ${game.week}: "${game.title}").

Follow this SuperX layout:
1. Hook (Line 1): Start with a short, painful, or counter-intuitive statement. Tailor it to the time context: ${timeContext.promptContext}
2. Pivot (Line 2): Point out why this happens (e.g. "That's not an AI limit. That's a system limit.").
3. The Shift (Line 3): Give them a new way to think about it (e.g. the conductor metaphor).
4. Takeaway (Line 4): A short, punchy summary sentence that people will want to bookmark.

CRITICAL constraints:
- Must use double line breaks between lines.
- No links, no promos.
- Must be under 260 characters.`

  if (state.lastPostText) {
    userPrompt += `\n\n5. CONTINUITY: Your previous post was:\n"${state.lastPostText}"\nMake sure this new post builds naturally upon or flows conceptually from the previous one, continuing the serial narrative of learning AI step-by-step without repeating the same phrasing.`
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  })

  const tweetText = message.content[0].type === "text" ? message.content[0].text.trim() : ""
  if (!tweetText) {
    console.error("❌ Error: Failed to generate tweet text.")
    process.exit(1)
  }
  console.log(`\n📝 Generated Copy (${tweetText.length} chars):\n\n"${tweetText}"\n`)

  // 5. Run Playwright to Post
  console.log("🌐 Launching browser...")
  const headful = process.env.HEADFUL === "true"
  const browser = await chromium.launch({ headless: !headful })

  try {
    const context = await browser.newContext({
      storageState: authPath,
      viewport: { width: 1280, height: 720 },
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })

    const page = await context.newPage()
    
    console.log("🔗 Navigating to X/Twitter compose...")
    await page.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded" })

    // Check if we are redirected to login (meaning session expired)
    if (page.url().includes("x.com/i/flow/login") || page.url().includes("twitter.com/login")) {
      console.error("❌ Error: Saved session cookies have expired! Please log in again using:")
      console.error("  npx playwright codegen twitter.com --save-storage=auth.json")
      await browser.close()
      process.exit(1)
    }

    console.log("✍️ Locating composer textbox...")
    const textbox = await page.waitForSelector('[role="textbox"], [data-testid="tweetTextarea_0"]', { timeout: 15000 })
    
    console.log("⌨️ Typing the post...")
    await textbox.focus()
    await textbox.type(tweetText, { delay: 10 })
    
    await page.waitForTimeout(1000)

    console.log("🚀 Clicking the Post button...")
    const postButton = await page.waitForSelector('[data-testid="tweetButtonInline"], [data-testid="tweetButton"]', { timeout: 5000 })
    await postButton.click()

    console.log("⏳ Waiting for post confirmation...")
    await page.waitForTimeout(5000)

    console.log("✅ Success! Tweet posted successfully.")

    // 6. Cross-post to Bluesky if configured
    const bskyId = process.env.BLUESKY_IDENTIFIER
    const bskyPassword = process.env.BLUESKY_PASSWORD
    if (bskyId && bskyPassword) {
      console.log("🦋 Cross-posting to Bluesky...")
      try {
        const agent = new BskyAgent({ service: "https://bsky.social" })
        await agent.login({ identifier: bskyId, password: bskyPassword })
        await agent.post({
          text: tweetText,
          createdAt: new Date().toISOString()
        })
        console.log("✅ Success! Posted to Bluesky successfully.")
      } catch (bskyError: any) {
        console.error("⚠️ Warning: Failed to post to Bluesky:", bskyError.message || bskyError)
      }
    } else {
      console.log("ℹ️ Bluesky credentials not configured. Skipping Bluesky cross-post.")
    }

    // 7. Save State
    state.lastChapterIndex = nextIndex
    state.lastPostText = tweetText
    state.postCount += 1
    saveBotState(state)
    console.log(`💾 Saved bot state. Total posts: ${state.postCount}`)

  } catch (error: any) {
    console.error("❌ Error during browser execution:", error)
    process.exit(1)
  } finally {
    await browser.close()
    console.log("🚪 Browser closed. Done!")
  }
}

run()
