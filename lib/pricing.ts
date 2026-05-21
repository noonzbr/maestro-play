export const PRICING: Record<string, { amount: number; name: string; priceId: string }> = {
  "ai-for-professionals": {
    amount: 499,
    name: "AI for Professionals — Game 3",
    priceId: process.env.STRIPE_PRICE_WEEK3 || "price_week3_placeholder",
  },
  "the-conductor-test": {
    amount: 499,
    name: "The Conductor Test — Game 4",
    priceId: process.env.STRIPE_PRICE_WEEK4 || "price_week4_placeholder",
  },
  bundle: {
    amount: 999,
    name: "Maestro Play — Full Bundle (All 5 Games)",
    priceId: process.env.STRIPE_PRICE_BUNDLE || "price_bundle_placeholder",
  },
}

export function getPricing(slug: string) {
  return PRICING[slug] ?? null
}
