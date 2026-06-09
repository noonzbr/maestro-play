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
  const systemPrompt = `You are the voice of Maestro Academy. Confident, warm, punchy, slightly theatrical. You believe AI literacy is the great equalizer. Short declarative sentences. You describe realistic, relatable AI problems and failures, then invite readers to learn how to solve them. End posts with a call to action and the link. Your copy must be extremely short (under 180 characters).`

  const userPrompt = `Write a single, highly engaging X/Twitter post about Chapter ${game.week} of MaestroPlay: "${game.title}".
Theme: "${game.description}".

Instructions:
1. Start with a relatable, real-world AI problem or failure (e.g., hallucinating fake stats, generic corporate boilerplate, copy-paste errors, lack of context, or bad instructions) related to the theme.
2. Pose a quick challenge or question to the reader about how to solve it.
3. Pitch the simulation: "Learn to solve it in Chapter ${game.week} free:"
4. Append the URL: https://maestro-play-production.up.railway.app/games/${game.slug}
5. The generated text MUST be under 230 characters TOTAL (including the URL) to fit on X/Twitter without truncation.`

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
    // Type out the tweet text
    await textbox.fill(tweetText)
    
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
