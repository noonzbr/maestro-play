import { NextRequest, NextResponse } from "next/server"
import { recordPurchase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { licenseKey, userId } = await req.json()

    if (!licenseKey || !userId) {
      return NextResponse.json(
        { error: "Missing licenseKey or userId" },
        { status: 400 }
      )
    }

    // Call Gumroad license verification API
    const productId = process.env.GUMROAD_PRODUCT_ID || "akautn"
    const verifyUrl = "https://api.gumroad.com/v2/licenses/verify"

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        product_id: productId,
        license_key: licenseKey.trim(),
        increment_uses_count: "true",
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { error: data.message || "Invalid license key" },
        { status: 400 }
      )
    }

    // Map Gumroad purchase information to purchases table
    const purchaseId = data.purchase.id
    const amountPaid = data.purchase.price // in cents

    await recordPurchase({
      stripeSessionId: `gumroad_${purchaseId}`,
      gameSlug: "conductor-edition",
      userId,
      amount: amountPaid,
    })

    return NextResponse.json({
      success: true,
      email: data.purchase.email,
      variants: data.purchase.variants,
    })
  } catch (err) {
    console.error("Error verifying Gumroad license:", err)
    return NextResponse.json(
      { error: "Internal server error verification failed" },
      { status: 500 }
    )
  }
}
