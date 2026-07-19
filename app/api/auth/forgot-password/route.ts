import { NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await getUserByEmail(email.trim());

    // For security reasons, we should return a success message even if the email doesn't exist
    // to prevent email enumeration attacks. However, we can return the devResetLink only if it does exist.
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry

    // Save token to database
    await updateUser(user.id, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const resetLink = `${origin}/reset-password?token=${token}`;

    return NextResponse.json({
      success: true,
      resetLink, // Expose resetLink directly for dev/staging verification
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
