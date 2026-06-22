import { NextRequest, NextResponse } from "next/server"

const RESEND_API = "https://api.resend.com/emails"

export async function POST(req: NextRequest) {
  try {
    // Gumroad sends payload as application/x-www-form-urlencoded
    const formData = await req.formData()
    const email = formData.get("email")?.toString()
    const productPermalink = formData.get("product_permalink")?.toString()
    const licenseKey = formData.get("license_key")?.toString()
    const buyerName = formData.get("buyer_name")?.toString() || "Customer"

    if (!email || !productPermalink) {
      return NextResponse.json(
        { error: "Missing email or product_permalink" },
        { status: 400 }
      )
    }

    // Verify it is the HR automation product
    const expectedPermalink = process.env.HR_GUMROAD_PERMALINK || "hr-automation-frameworks"
    if (productPermalink !== expectedPermalink) {
      return NextResponse.json({ error: "Product mismatch" }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("RESEND_API_KEY is not set. Webhook logging only.")
      return NextResponse.json({
        received: true,
        message: "Logged sale, but Resend API key is missing. Cannot send email.",
      })
    }

    // Send the email with the download link and a plain text copy of the frameworks
    const subject = `Your HR Automation Frameworks Guide ⚡`
    const downloadUrl =
      process.env.HR_PDF_DOWNLOAD_URL ||
      "https://your-domain.com/downloads/hr_automation_frameworks.pdf"

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: sans-serif; padding: 20px; background-color: #fafafa; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7c3aed;">Thank you for purchasing the HR Automation Frameworks Guide!</h2>
        <p>Hi ${buyerName},</p>
        <p>You can download your PDF guide directly by clicking the link below:</p>
        <p style="margin: 20px 0;">
          <a href="${downloadUrl}" style="display:inline-block; padding:12px 24px; background-color:#7c3aed; color:#fff; text-decoration:none; border-radius:6px; font-weight: bold;">Download PDF Frameworks 📥</a>
        </p>
        <p>If you'd like to copy-paste the frameworks directly from this email, we've included them below for your convenience!</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <h3 style="color: #4c1d95;">📋 Framework 1: Cultured Onboarding Planner</h3>
        <p>Generate 30-60-90 day plans that integrate technical goals with company values.</p>
        
        <h3 style="color: #4c1d95;">💬 Framework 2: Socratic Performance Feedback</h3>
        <p>Translate bullet notes into constructive reviews that build psychological safety.</p>
        
        <h3 style="color: #4c1d95;">⚖️ Framework 3: De-Jargonized Policy Architect</h3>
        <p>Convert legal remote-work/conduct policies into 90-second plain language tables.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <p style="font-size: 13px; color: #666;">Your Gumroad License Key is: <strong>${licenseKey || "Generated at Checkout"}</strong></p>
        <p style="font-size: 13px; color: #666;">Best regards,<br/>The People Operations Team</p>
      </body>
      </html>
    `

    const textContent = `
      Thank you for purchasing the HR Automation Frameworks Guide!
      
      Download your PDF: ${downloadUrl}
      
      Your License Key: ${licenseKey || "N/A"}
    `

    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "HR Automation <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        text: textContent,
        html: htmlContent,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Resend API error:", errText)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Gumroad Webhook Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
