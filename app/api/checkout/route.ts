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
      return NextResponse.json({ error: "Invalid game slug" }, { status: 404 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: pricing.name },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/games/${slug}?success=true`,
      cancel_url: `${baseUrl}/checkout/${slug}`,
      metadata: {
        gameSlug: slug,
        userId: userId ?? "",
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
