import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const db = await readDB();
    const userIndex = db.users.findIndex(
      (u: { resetToken?: string; resetTokenExpiry?: string }) =>
        u.resetToken === token && u.resetTokenExpiry && new Date(u.resetTokenExpiry).getTime() > Date.now()
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Password reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    // Encrypt the new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update password and invalidate reset token
    db.users[userIndex].passwordHash = passwordHash;
    delete db.users[userIndex].resetToken;
    delete db.users[userIndex].resetTokenExpiry;

    await writeDB(db);

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
