import { chromium } from "playwright"
import path from "path"
import fs from "fs"
import { loadEnvConfig } from "@next/env"
import Anthropic from "@anthropic-ai/sdk"
import { allGames } from "../lib/games"

// Load env variables from .env.local
loadEnvConfig(process.cwd())

async function run() {
  console.log("🚀 Starting Local Twitter Bot...")

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

  // 3. Select a random chapter/game
  const playableGames = allGames.filter(g => g.slug && g.title)
  if (playableGames.length === 0) {
    console.error("❌ Error: No playable games/chapters found.")
    process.exit(1)
  }
  const game = playableGames[Math.floor(Math.random() * playableGames.length)]
  console.log(`📖 Selected Chapter ${game.week}: "${game.title}"`)

  // 4. Generate Tweet Copy with Claude
  console.log("🤖 Generating post copy via Claude...")
  const anthropic = new Anthropic({ apiKey })
  const systemPrompt = `You are the voice of Maestro Academy. Confident, warm, punchy, slightly theatrical. You believe AI literacy is the great equalizer. Short declarative sentences. You describe realistic, relatable AI struggles, misconceptions, and learning failures. Your tone is educational and thought-provoking. DO NOT include any links, URLs, or promotional calls-to-action to MaestroPlay yet. Keep the output under 260 characters.`

  const userPrompt = `Write a single, highly engaging X/Twitter post about a struggle people face when trying to use or learn AI, inspired by the theme: "${game.description}" (from Chapter ${game.week}: "${game.title}").

Instructions:
1. Start with a relatable, real-world AI struggle, misunderstanding, or prompt failure (e.g., getting generic corporate boilerplate, hallucination frustration, treating AI like a search engine instead of conducting it, or feeling overwhelmed by learning).
2. Share a punchy educational insight about why this happens or how to think about it differently.
3. CRITICAL: Do NOT include any links, URLs, prices, or calls-to-action to play or visit MaestroPlay yet.
4. The generated text MUST be under 260 characters total.`

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
  console.log(`📝 Generated Copy (${tweetText.length} chars):\n\n"${tweetText}"\n`)

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
    // Wait for the tweet composer editor box (role="textbox" or data-testid="tweetTextarea_0")
    const textbox = await page.waitForSelector('[role="textbox"], [data-testid="tweetTextarea_0"]', { timeout: 15000 })
    
    console.log("⌨️ Typing the post...")
    await textbox.focus()
    // Type out the tweet text sequentially to trigger keyboard events and enable the Post button
    await textbox.type(tweetText, { delay: 10 })
    
    // Give it a tiny pause to look organic
    await page.waitForTimeout(1000)

    console.log("🚀 Clicking the Post button...")
    // Find the post button
    const postButton = await page.waitForSelector('[data-testid="tweetButtonInline"], [data-testid="tweetButton"]', { timeout: 5000 })
    await postButton.click()

    console.log("⏳ Waiting for post confirmation...")
    // Wait for the composer to disappear or a confirmation toast to show up
    await page.waitForTimeout(5000)

    console.log("✅ Success! Tweet posted successfully.")

  } catch (error: any) {
    console.error("❌ Error during browser execution:", error)
    process.exit(1)
  } finally {
    await browser.close()
    console.log("🚪 Browser closed. Done!")
  }
}

run()
