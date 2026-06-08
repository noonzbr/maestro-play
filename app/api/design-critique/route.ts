/**
 * /api/design-critique
 *
 * Vera's PhD — a Claude-powered design critic agent.
 *
 * Input:  { url: string }
 * Output: { scores, issues, recommendations, overall, summary }
 *
 * The agent fetches the page HTML, analyzes it against 6 design dimensions,
 * and returns a structured critique that would take a senior designer 45 minutes
 * to produce manually.
 *
 * Dimensions scored (0-100):
 *   typography    — type scale, readability, font choices
 *   hierarchy     — visual priority, focal points, CTAs
 *   color         — contrast ratios, WCAG compliance, palette coherence
 *   spacing       — consistency, breathing room, grid alignment
 *   accessibility — WCAG 2.1 AA indicators, semantic HTML, labels
 *   performance   — image optimization signals, render-blocking indicators
 */

import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const maxDuration = 60   // allow up to 60s for fetch + AI analysis

// ─── Types ────────────────────────────────────────────────────────────────────

export type DesignDimension =
  | "typography"
  | "hierarchy"
  | "color"
  | "spacing"
  | "accessibility"
  | "performance"

export interface DimensionScore {
  score: number          // 0–100
  grade: "A" | "B" | "C" | "D" | "F"
  headline: string       // one-line verdict, e.g. "Body text below 16px minimum"
  issues: string[]       // specific problems found (max 3)
  wins: string[]         // what's working well (max 2)
  fix: string            // top recommendation for this dimension
}

export interface DesignCritiqueResult {
  url: string
  fetchedAt: string
  overall: number                            // weighted average 0–100
  overallGrade: "A" | "B" | "C" | "D" | "F"
  summary: string                            // 2-3 sentence executive verdict
  dimensions: Record<DesignDimension, DimensionScore>
  topPriorities: string[]                    // top 3 actionable fixes ranked by impact
  veraNote: string                           // Vera's in-character closing comment
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreToGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A"
  if (score >= 80) return "B"
  if (score >= 70) return "C"
  if (score >= 60) return "D"
  return "F"
}

function weightedAverage(scores: number[]): number {
  // Weights: accessibility 25%, typography 20%, hierarchy 20%, color 15%, spacing 10%, performance 10%
  const weights = [0.20, 0.20, 0.15, 0.10, 0.25, 0.10]
  const total = scores.reduce((sum, s, i) => sum + s * weights[i], 0)
  return Math.round(total)
}

// ─── Fetch page HTML ──────────────────────────────────────────────────────────

async function fetchPageHTML(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MaestroPlay-DesignCritic/1.0)",
      "Accept": "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`)
  }

  const raw = await res.text()

  // Strip inline scripts, Next.js data blobs, and style tags — they bloat the
  // payload without adding design-analysis signal. Keep structural HTML only.
  const stripped = raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")   // all <script> blocks
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")      // all <style> blocks
    .replace(/<!--[\s\S]*?-->/g, "")                        // HTML comments
    .replace(/\s{2,}/g, " ")                                // collapse whitespace
    .trim()

  // Truncate to ~30KB — enough for full structural analysis
  return stripped.slice(0, 30_000)
}

// ─── System prompt ────────────────────────────────────────────────────────────

const VERA_SYSTEM_PROMPT = `You are Vera Chen, Senior Frontend Developer and Design Systems Architect with 8 years of experience. You have a PhD-level understanding of web design. You have memorized:

- WCAG 2.1 AA/AAA success criteria (contrast ratios, keyboard navigation, semantic HTML, ARIA)
- Typography rules: 16px minimum body text, 1.5-1.7 line-height, 45-75 chars/line, modular type scales
- Visual hierarchy laws: Hick's Law (fewer choices = faster decisions), Fitts's Law (target size), Gestalt principles
- Color theory: 60-30-10 rule, WCAG contrast requirements (4.5:1 normal text, 3:1 large text/UI components)
- The 8pt grid system (spacing as multiples of 8: 8, 16, 24, 32, 48, 64)
- Core Web Vitals: LCP < 2.5s (optimize hero images, use WebP, preload), CLS < 0.1 (reserve space), INP < 200ms
- Mobile-first design: 44×44px touch targets, 16px+ body on mobile, critical content above fold at 375px
- Form accessibility: visible labels (not just placeholders), fieldset/legend for groups, error messages
- AI design tools: Figma AI, v0.dev, Framer AI, GitHub Copilot strengths and weaknesses

You analyze HTML with precision and pragmatism. You name specific violations, cite the WCAG criterion number when relevant, and give actionable fixes. You do NOT say "make it pop" or "more modern." You say: "The contrast ratio on line 47 is approximately 2.1:1 — it fails WCAG 2.1 SC 1.4.3 which requires 4.5:1 for normal text. Fix: change the text color to #1A1A2E on this background."

When you cannot measure a value exactly from HTML alone (e.g., actual rendered font size after CSS processing), you note this honestly and flag it as "needs visual verification."

Your critique is direct but constructive. You celebrate what works. You are not cruel, but you do not soften technical failures. A 1.19:1 contrast ratio is a failure, not "a potential area for improvement."

Respond ONLY with valid JSON matching the DesignCritiqueResult schema. No markdown. No preamble.`

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url } = body

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only http/https URLs allowed")
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_key_here") {
      return NextResponse.json({ error: "Claude API key not configured" }, { status: 503 })
    }

    // Fetch the page
    let html: string
    try {
      html = await fetchPageHTML(parsedUrl.href)
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
      return NextResponse.json({ error: `Could not fetch URL: ${msg}` }, { status: 422 })
    }

    // Build the analysis prompt
    const userPrompt = `Analyze the following HTML for the website: ${parsedUrl.href}

Produce a complete DesignCritiqueResult JSON object. Fields required:
- url: "${parsedUrl.href}"
- fetchedAt: current ISO timestamp
- overall: weighted score (typography 20%, hierarchy 20%, color 15%, spacing 10%, accessibility 25%, performance 10%)
- overallGrade: letter grade for overall
- summary: 2-3 sentence executive verdict — what is this site's biggest strength and biggest problem?
- dimensions: object with keys: typography, hierarchy, color, spacing, accessibility, performance
  Each dimension has: score (0-100), grade, headline (one-line verdict), issues (array max 3), wins (array max 2), fix (top recommendation)
- topPriorities: array of exactly 3 strings — the highest-impact fixes, in order of priority
- veraNote: Vera's in-character closing comment (1-2 sentences, her voice — direct, pragmatic, a little dry)

Be specific. Reference actual HTML patterns you observe. Cite WCAG criterion numbers for accessibility findings.
If CSS is not available, note "layout/spacing analysis limited — CSS not in HTML source."

HTML to analyze (may be truncated):
\`\`\`html
${html}
\`\`\``

    const client = new Anthropic({ apiKey })

    // claude-sonnet-4-6 does not support assistant prefill — use user-turn only.
    // The system prompt instructs Claude to output ONLY JSON (no preamble).
    // Greedy JSON extractor below handles any accidental wrapper text.
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: VERA_SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userPrompt },
      ],
    })

    const rawText = message.content[0].type === "text"
      ? message.content[0].text.trim()
      : ""

    // Parse JSON response — extract the outermost {...} block to survive any
    // accidental preamble/postamble text, markdown fences, or trailing commentary.
    let result: DesignCritiqueResult
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("no JSON object found in response")
      result = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      console.error("design-critique: failed to parse Claude JSON:", rawText.slice(0, 600))
      console.error("parse error:", parseErr)
      return NextResponse.json({ error: "Failed to parse critique — Claude returned non-JSON" }, { status: 500 })
    }

    // Recompute overall to be safe (client-side weights applied)
    const dimScores = [
      result.dimensions.typography?.score ?? 50,
      result.dimensions.hierarchy?.score ?? 50,
      result.dimensions.color?.score ?? 50,
      result.dimensions.spacing?.score ?? 50,
      result.dimensions.accessibility?.score ?? 50,
      result.dimensions.performance?.score ?? 50,
    ]
    result.overall = weightedAverage(dimScores)
    result.overallGrade = scoreToGrade(result.overall)
    result.fetchedAt = new Date().toISOString()

    return NextResponse.json(result)

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("design-critique error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
