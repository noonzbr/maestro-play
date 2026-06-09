import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { TwitterApi } from "twitter-api-v2"
import { allGames } from "@/lib/games"

function getAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

function getTwitterClient() {
  const appKey = process.env.TWITTER_CONSUMER_KEY
  const appSecret = process.env.TWITTER_CONSUMER_SECRET
  const accessToken = process.env.TWITTER_ACCESS_TOKEN
  const accessSecret = process.env.TWITTER_ACCESS_SECRET

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return null
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  })
}

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    // 1. Authorization check: simple cron token validation to prevent public abuse
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    // If CRON_SECRET is configured in env, verify authorization bearer token
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Select a random chapter/game
    const playableGames = allGames.filter(g => g.slug && g.title)
    const randomIndex = Math.floor(Math.random() * playableGames.length)
    const game = playableGames[randomIndex]

    // 3. Generate tweet copy using Claude
    const anthropic = getAnthropicClient()
    const systemPrompt = `You are the voice of Maestro Academy. Confident, warm, punchy, slightly theatrical. You believe AI literacy is the great equalizer. Short declarative sentences. Use conductor/orchestra metaphors naturally. Never use jargon without explanation. End posts with a hook and the link. Never exceed 240 characters per post (leaving room for links).`

    const userPrompt = `Write a single, highly engaging, value-add X/Twitter post about Chapter ${game.week} of MaestroPlay: "${game.title}".
Character featured: ${game.characterName || "AI Tutor"} (${game.characterRole || "AI Co-pilot"}).
Chapter Description/Theme: "${game.description}".

Instructions:
- Give a 1-sentence value-add teaching point relevant to this theme.
- Pitch it as a playable simulation chapter: "Play Chapter ${game.week} free:"
- Append the URL: https://maestro-play-production.up.railway.app/games/${game.slug}
- Ensure the total length is strictly under 280 characters.`

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    const tweetText = message.content[0].type === "text" ? message.content[0].text.trim() : ""

    if (!tweetText) {
      return NextResponse.json({ error: "Failed to generate tweet copy" }, { status: 500 })
    }

    // 4. Post to Twitter/X if credentials are set
    const twitter = getTwitterClient()
    let posted = false
    let tweetId = null

    if (twitter) {
      const response = await twitter.v2.tweet(tweetText)
      tweetId = response.data.id
      posted = true
      console.log(`[MaestroPlay Auto-Twitter] Successfully posted tweet ${tweetId} for Chapter ${game.week}`)
    } else {
      console.warn("[MaestroPlay Auto-Twitter] Twitter API credentials not configured. Skipping post.")
    }

    return NextResponse.json({
      success: true,
      chapter: {
        week: game.week,
        title: game.title,
        slug: game.slug,
      },
      tweetText,
      posted,
      tweetId,
      configStatus: twitter ? "Active (Posted)" : "Testing Mode (Credentials Missing)",
    })
  } catch (err: any) {
    console.error("Auto-Twitter cron error:", err)
    return NextResponse.json({ error: err.message || "Failed to execute auto-twitter" }, { status: 500 })
  }
}
