import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getPricing } from "@/lib/pricing"

export async function POST(req: NextRequest) {
  try {
    const { slug, userId } = await req.json()

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
    }

    const pricing = getPricing(slug)
    if (!pricing) {
      return NextResponse.json({ error: "Invalid product slug" }, { status: 404 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const isSubscription = pricing.mode === "subscription"

    // Build line_item differently for one-time vs recurring
    const lineItem = isSubscription
      ? {
          price_data: {
            currency: "usd",
            product_data: { name: pricing.name },
            unit_amount: pricing.amount,
            recurring: { interval: pricing.interval ?? "month" } as const,
          },
          quantity: 1,
        }
      : {
          price_data: {
            currency: "usd",
            product_data: { name: pricing.name },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        }

    // Power-up packs success → dashboard; game unlocks → games page
    const powerUpSlugs = ["starter-pack", "maestro-bundle", "conductor-pass"]
    const successPath = powerUpSlugs.includes(slug)
      ? `/dashboard?powerup=${slug}&success=true`
      : `/games/${slug}?success=true`

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [lineItem],
      success_url: `${baseUrl}${successPath}`,
      cancel_url:  `${baseUrl}/?cancelled=true`,
      metadata: {
        productSlug: slug,
        userId:      userId ?? "",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
