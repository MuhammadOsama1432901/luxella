import { NextResponse } from "next/server";
import { getUserByEmail, updateUser, getSystemLogs, createSystemLog } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Rate Limiting Check (Max 3 attempts per 15 minutes per IP)
    const logs = await getSystemLogs().catch(() => []);
    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    const recentRequests = logs.filter(
      (l) =>
        l.action === "forgot_password_request" &&
        l.ip === ip &&
        new Date(l.timestamp).getTime() > fifteenMinutesAgo
    );

    if (recentRequests.length >= 3) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    // 2. Log this attempt
    await createSystemLog(
      undefined,
      undefined,
      "forgot_password_request",
      `Password reset request for ${cleanEmail}`,
      ip
    );

    // 3. User Lookup
    const user = await getUserByEmail(cleanEmail);

    // User Enumeration Prevention: Return generic success if user does not exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If the email is registered in our database, a secure reset link will be sent shortly.",
      });
    }

    // 4. Secure Reset Token Generation
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15-minute expiry

    // Save hashed token and expiry to database
    await updateUser(user.id, {
      resetToken: hashedToken,
      resetTokenExpiry: expiry,
    });

    // 5. Send Professional HTML Reset Email using Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password?token=${rawToken}`;

    const logoUrl = `${appUrl}/images/logo/logo-crest.jpg`;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Luxella Password</title>
        <style>
          body {
            font-family: 'Playfair Display', Georgia, serif;
            background-color: #0A0A0A;
            color: #E2E2E2;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #121212;
            border: 1px solid rgba(200, 169, 106, 0.15);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          }
          .header {
            text-align: center;
            padding: 40px 20px;
            border-bottom: 1px solid rgba(200, 169, 106, 0.08);
            background: linear-gradient(180deg, #181818 0%, #121212 100%);
          }
          .logo {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            border: 1px solid rgba(200, 169, 106, 0.2);
            margin-bottom: 15px;
          }
          .brand {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.25em;
            color: #FFFFFF;
            text-transform: uppercase;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
          }
          .headline {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 22px;
            color: #C8A96A;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
          }
          .p-text {
            color: #A3A3A3;
            margin-bottom: 30px;
            text-align: center;
          }
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #C8A96A 0%, #8B6914 100%);
            color: #000000 !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            box-shadow: 0 4px 15px rgba(200, 169, 106, 0.25);
            transition: all 0.3s;
          }
          .warning {
            font-size: 11px;
            color: #6B7280;
            text-align: center;
            margin-top: 25px;
            line-height: 1.5;
            padding: 15px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.03);
          }
          .footer {
            padding: 30px;
            text-align: center;
            font-size: 10px;
            color: #525252;
            letter-spacing: 0.1em;
            border-top: 1px solid rgba(200, 169, 106, 0.08);
            background-color: #0E0E0E;
          }
          .footer a {
            color: #C8A96A;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="Luxella Crest" class="logo">
            <div class="brand">Luxella</div>
          </div>
          <div class="content">
            <h2 class="headline">Password Recovery Request</h2>
            <p class="p-text">
              We received a request to reset the password for your Luxella account. 
              Click the button below to configure your new secure credentials.
            </p>
            <div class="btn-container">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <div class="warning">
              This reset link is active for <strong>15 minutes</strong> and can only be used once.<br>
              If you did not request this modification, you can safely ignore this correspondence.
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} LUXELLA. All rights reserved.<br>
            Factory No 51, Model Town, Islamabad, Pakistan<br>
            Need help? Contact <a href="mailto:osamaafzal1432901@gmail.com">support@luxella.com</a>
          </div>
        </div>
      </body>
      </html>
    `;

    let emailSent = false;
    let resendError = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const mailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "Luxella <onboarding@resend.dev>",
            to: cleanEmail,
            subject: "Reset Your Luxella Password",
            html: htmlTemplate,
          }),
        });

        if (mailRes.ok) {
          emailSent = true;
        } else {
          const errData = await mailRes.json();
          resendError = errData;
          console.error("Resend API failed:", errData);
        }
      } catch (err) {
        console.error("Failed to call Resend API:", err);
      }
    }

    // Expose reset link in local/preview environments for seamless testing
    const devResetLink =
      !process.env.RESEND_API_KEY || process.env.NODE_ENV === "development"
        ? resetLink
        : undefined;

    return NextResponse.json({
      success: true,
      message: "If the email is registered in our database, a secure reset link will be sent shortly.",
      devResetLink, // Passed in development/preview for easy integration testing
      emailSent,
      resendError,
    });
  } catch (error) {
    console.error("Forgot password handler error:", error);
    return NextResponse.json({ error: "Failed to process recovery request." }, { status: 500 });
  }
}
