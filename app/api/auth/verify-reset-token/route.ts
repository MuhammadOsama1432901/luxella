import { NextRequest, NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "Reset token is missing." }, { status: 400 });
    }

    // 1. Hash the incoming raw token to query the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Lookup token in DB
    const db = await readDB();
    const user = db.users.find(
      (u: { resetToken?: string }) => u.resetToken === hashedToken
    );

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "The recovery link is invalid or has already been used." },
        { status: 400 }
      );
    }

    // 3. Expiration Check (15 minutes limit)
    if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry).getTime() < Date.now()) {
      return NextResponse.json(
        { valid: false, error: "The recovery link has expired. Reset links are only active for 15 minutes." },
        { status: 400 }
      );
    }

    // Token is fully valid!
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ valid: false, error: "Server error during token verification." }, { status: 500 });
  }
}
