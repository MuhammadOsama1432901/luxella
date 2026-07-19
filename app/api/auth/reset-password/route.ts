import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    }

    // 1. Validate Password Strength (Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password does not meet strength criteria. It must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.",
        },
        { status: 400 }
      );
    }

    // 2. Hash the incoming raw token to look up the stored hash in the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const db = await readDB();
    const userIndex = db.users.findIndex(
      (u: { resetToken?: string; resetTokenExpiry?: string }) =>
        u.resetToken === hashedToken
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "The recovery link is invalid or has already been used." },
        { status: 400 }
      );
    }

    const user = db.users[userIndex];

    // 3. Expiration Check (15 minutes limit)
    if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry).getTime() < Date.now()) {
      return NextResponse.json(
        { error: "The recovery link has expired. Please request a new password reset." },
        { status: 400 }
      );
    }

    // 4. Hash the new password using bcryptjs (salt factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Update user and invalidate token (One-time use - delete reset fields immediately)
    db.users[userIndex].passwordHash = passwordHash;
    delete db.users[userIndex].resetToken;
    delete db.users[userIndex].resetTokenExpiry;

    await writeDB(db);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset password handler error:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
