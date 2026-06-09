const { chromium } = require("playwright")
const path = require("path")
const fs = require("fs")
require("dotenv").config()
const Anthropic = require("@anthropic-ai/sdk")
const topics = require("./topics.json")

const STATE_FILE = path.join(__dirname, "bot-state.json")

function getBotState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
    } catch (e) {
      console.warn("⚠️ Warning: Failed to parse bot-state.json. Resetting state.")
    }
  }
  return { lastTopicIndex: -1, lastPostText: "", postCount: 0 }
}

function saveBotState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8")
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) {
    return {
      name: "morning",
      promptContext: "It is morning. Frame the hook around starting the workday, morning routines, or daily focus kickoffs."
    }
  } else if (hour >= 12 && hour < 17) {
    return {
      name: "afternoon",
      promptContext: "It is afternoon. Frame the hook around workflow blockages, mid-day routines, or professional productivity tips."
    }
  } else {
    return {
      name: "dinner",
      promptContext: "It is evening/dinner time. Frame the post as a reflection, winding down, or a bigger-picture thought to think about after the workday."
    }
  }
}

async function run() {
  console.log("🚀 Starting Standalone Twitter Bot...")

  // 1. Verify Anthropic API Key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error("❌ Error: ANTHROPIC_API_KEY is not defined in .env")
    process.exit(1)
  }

  // 2. Check Playwright Authentication State
  const authPath = path.join(__dirname, "auth.json")
  if (!fs.existsSync(authPath)) {
    console.error("❌ Error: auth.json not found!")
    console.error("Please read the README.md on how to extract and save your session to auth.json.")
    process.exit(1)
  }

  // 3. Load State and Select Next Topic
  const state = getBotState()
  if (topics.length === 0) {
    console.error("❌ Error: topics.json is empty.")
    process.exit(1)
  }

  const nextIndex = (state.lastTopicIndex + 1) % topics.length
  const topic = topics[nextIndex]
  const timeContext = getTimeOfDay()

  console.log(`📖 Next Topic in Sequence: "${topic.title}"`)
  console.log(`⏰ Time of Day Context: ${timeContext.name.toUpperCase()}`)

  // 4. Generate Tweet Copy with Claude
  console.log("🤖 Generating post copy via Claude...")
  const anthropic = new Anthropic({ apiKey })
  
  const systemPrompt = `You are an expert content creator. Confident, warm, punchy, and professional. You write highly engaging, thought-provoking marketing and educational posts.
Your writing style is heavily optimized for X/Twitter virality:
- Start with a strong, scroll-stopping hook (a common mistake, a contrarian opinion, or a painful struggle).
- Write in short, declarative, single-sentence paragraphs.
- Use double line breaks between sentences to create plenty of white space.
- Keep the tone authoritative, educational, and helpful.
- NO hashtags. Emojis only if highly relevant (max 1).
- DO NOT include any links or promotions.
- Keep the output under 260 characters.`

  let userPrompt = `Write a single, highly engaging viral-style X/Twitter post about:
Topic Title: "${topic.title}"
Topic Details: "${topic.description}"

Instructions:
1. Time Context: ${timeContext.promptContext}
2. Start with a relatable struggle, mistake, or insight related to the topic, tailored to this time of day.
3. Share a punchy educational takeaway or solution.
4. Keep the text under 260 characters total.`

  if (state.lastPostText) {
    userPrompt += `\n\n5. CONTINUITY: Your previous post was:\n"${state.lastPostText}"\nMake sure this new post builds naturally or flows conceptually from the previous one, continuing the serial narrative.`
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 200,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  })

  const tweetText = message.content[0].text ? message.content[0].text.trim() : ""
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
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, httpObject) Chrome/120.0.0.0 Safari/537.36"
    })

    const page = await context.newPage()
    
    console.log("🔗 Navigating to X/Twitter compose...")
    await page.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded" })

    // Check if session expired
    if (page.url().includes("x.com/i/flow/login") || page.url().includes("twitter.com/login")) {
      console.error("❌ Error: Saved session cookies have expired! Please re-extract your cookies to auth.json.")
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

    // 6. Save State
    state.lastTopicIndex = nextIndex
    state.lastPostText = tweetText
    state.postCount += 1
    saveBotState(state)
    console.log(`💾 Saved bot state. Total posts: ${state.postCount}`)

  } catch (error) {
    console.error("❌ Error during browser execution:", error)
    process.exit(1)
  } finally {
    await browser.close()
    console.log("🚪 Browser closed. Done!")
  }
}

run()
