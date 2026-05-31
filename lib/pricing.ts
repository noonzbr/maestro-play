/**
 * MaestroPlay Pricing Registry
 *
 * Free tier  → 2 games per track + all bonus games, no purchase needed
 * Pro tier   → remaining games, $4.99 each OR $29/mo subscription (all games)
 *
 * Track 01 AI Fundamentals   (weeks 1–4):  free 1,2        | pro 3,4
 * Track 02 Claude & Prompts  (weeks 5–8):  free 5,6        | pro 7,8
 * Track 03 The AI Toolkit    (weeks 9–10): free 9          | pro 10
 * Track 04 Microsoft AI      (weeks 11–12):free 11         | pro 12
 * Bonus     Remastered        (week 13):   free (game1v2)  — "Welcome to AI v2"
 * Bonus     The Prompt Lab    (week 14):   free (game13)   — Maya, prompt engineering
 */

export type PricingEntry = {
  amount:  number   // in cents (USD)
  name:    string
  priceId: string   // Stripe Price ID
  mode?:   "payment" | "subscription"
}

export const PRICING: Record<string, PricingEntry> = {

  /* ─── Individual game unlocks ──────────────────────────────────────────── */
  "ai-for-professionals": {
    amount:  499,
    name:    "AI for Professionals — Game 3",
    priceId: process.env.STRIPE_PRICE_WEEK3 || "price_week3_placeholder",
  },
  "the-conductor-test": {
    amount:  499,
    name:    "The Conductor Test — Game 4",
    priceId: process.env.STRIPE_PRICE_WEEK4 || "price_week4_placeholder",
  },
  "claude-for-work": {
    amount:  499,
    name:    "Claude for Work — Game 7",
    priceId: process.env.STRIPE_PRICE_WEEK7 || "price_week7_placeholder",
  },
  "chatgpt-mastery": {
    amount:  499,
    name:    "ChatGPT — Beyond the Hype — Game 8",
    priceId: process.env.STRIPE_PRICE_WEEK8 || "price_week8_placeholder",
  },
  "gemini-cli-unlocked": {
    amount:  499,
    name:    "Gemini CLI — Game 10",
    priceId: process.env.STRIPE_PRICE_WEEK10 || "price_week10_placeholder",
  },
  "copilot-studio": {
    amount:  499,
    name:    "Copilot Studio — Game 12",
    priceId: process.env.STRIPE_PRICE_WEEK12 || "price_week12_placeholder",
  },

  /* ─── Bundle (all 14 games, one-time) ─────────────────────────────────── */
  bundle: {
    amount:  1999,
    name:    "MaestroPlay — Full Bundle (All 14 Games)",
    priceId: process.env.STRIPE_PRICE_BUNDLE || "price_bundle_placeholder",
  },

  /* ─── Pro subscription ─────────────────────────────────────────────────── */
  "pro-monthly": {
    amount:  2900,
    name:    "MaestroPlay Pro — Monthly ($29/mo, all 14 games)",
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly_placeholder",
    mode:    "subscription",
  },
  "pro-annual": {
    amount:  24900,
    name:    "MaestroPlay Pro — Annual ($249/yr, save $99, all 14 games)",
    priceId: process.env.STRIPE_PRICE_PRO_ANNUAL  || "price_pro_annual_placeholder",
    mode:    "subscription",
  },
}

export function getPricing(slug: string): PricingEntry | null {
  return PRICING[slug] ?? null
}

/** Returns true if this game slug requires a purchase (i.e. it's in PRICING) */
export function isProGame(slug: string): boolean {
  const individualSlugs = [
    "ai-for-professionals",
    "the-conductor-test",
    "claude-for-work",
    "chatgpt-mastery",
    "gemini-cli-unlocked",
    "copilot-studio",
  ]
  return individualSlugs.includes(slug)
}
