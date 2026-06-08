/**
 * MaestroPlay Pricing Registry
 *
 * Freemium model — ALL 14 games are free forever.
 * Monetisation is entirely through optional power-up packs.
 *
 * Power-up packs:
 *   Starter Pack      → $2.99 one-time  (5 lives, 3 Hints, 2 Double XP, 1 Second Chance)
 *   Maestro Bundle    → $6.99 one-time  (15 lives, 8 Hints, 5 Double XP, 3 Shields, 2 Second Chances, 1 Restore, 1 Jackpot)
 *   Conductor Pass    → $9.99/month     (unlimited lives, 10 power-ups/mo, Conductor badge, early access)
 *
 * Legacy individual game purchases kept for backward compat (all games now free: true).
 */

export type PricingEntry = {
  amount:   number   // in cents (USD)
  name:     string
  priceId:  string   // Stripe Price ID
  mode?:    "payment" | "subscription"
  interval?: "month" | "year"  // for subscriptions
  contents?: string[]          // human-readable contents list
}

export const PRICING: Record<string, PricingEntry> = {

  /* ─── Power-up packs (primary revenue) ────────────────────────────────── */
  "starter-pack": {
    amount:   299,
    name:     "MaestroPlay — Starter Pack",
    priceId:  process.env.STRIPE_PRICE_STARTER || "price_starter_placeholder",
    mode:     "payment",
    contents: ["5 extra lives","3 Hint Tokens","2 Double XP boosts","1 Second Chance"],
  },
  "maestro-bundle": {
    amount:   699,
    name:     "MaestroPlay — Maestro Bundle",
    priceId:  process.env.STRIPE_PRICE_BUNDLE || "price_bundle_placeholder",
    mode:     "payment",
    contents: ["15 extra lives","8 Hint Tokens","5 Double XP boosts","3 Streak Shields","2 Second Chances","1 Streak Restore","1 XP Jackpot"],
  },
  "conductor-pass": {
    amount:   699,
    name:     "MaestroPlay — Conductor Pass (Monthly)",
    priceId:  process.env.STRIPE_PRICE_CONDUCTOR_PASS || "price_conductor_pass_placeholder",
    mode:     "subscription",
    interval: "month",
    contents: ["Unlimited daily lives","10 power-ups per month (your choice)","Exclusive Conductor badge","Early access to new games"],
  },
  "conductor-pass-annual": {
    amount:   4799,
    name:     "MaestroPlay — Conductor Pass (Annual)",
    priceId:  process.env.STRIPE_PRICE_CONDUCTOR_PASS_ANNUAL || "price_conductor_pass_annual_placeholder",
    mode:     "subscription",
    interval: "year",
    contents: ["Unlimited daily lives","10 power-ups per month (your choice)","Exclusive Conductor badge","Early access to new games"],
  },
  "conductor-pass-family": {
    amount:   7999,
    name:     "MaestroPlay — Conductor Pass (Family Plan)",
    priceId:  process.env.STRIPE_PRICE_CONDUCTOR_PASS_FAMILY || "price_conductor_pass_family_placeholder",
    mode:     "subscription",
    interval: "year",
    contents: ["Unlimited daily lives for up to 6 members","10 power-ups per month (your choice)","Exclusive Conductor badge","Early access to new games"],
  },

  /* ─── Legacy individual game unlocks (kept for backward compat) ────────── */
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

  /* ─── Legacy Pro subscription ──────────────────────────────────────────── */
  "pro-monthly": {
    amount:  699,
    name:    "MaestroPlay Pro — Monthly ($6.99/mo)",
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "price_pro_monthly_placeholder",
    mode:    "subscription",
    interval: "month",
  },
  "pro-annual": {
    amount:  4799,
    name:    "MaestroPlay Pro — Annual ($47.99/yr)",
    priceId: process.env.STRIPE_PRICE_PRO_ANNUAL || "price_pro_annual_placeholder",
    mode:    "subscription",
    interval: "year",
  },
}

export function getPricing(slug: string): PricingEntry | null {
  return PRICING[slug] ?? null
}

/** Returns true if this game slug requires a purchase (legacy — all games now free) */
export function isProGame(_slug: string): boolean {
  return false
}
