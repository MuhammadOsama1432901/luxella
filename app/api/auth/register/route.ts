import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/db";
import { setSession } from "@/lib/session";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "osamaafzal1432901@gmail.com";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // Validate
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check duplicate
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Determine role
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? "admin" : "customer";

    // Create user
    const user = await createUser({ name: name.trim(), email: email.toLowerCase().trim(), phone, passwordHash, role });

    // Auto sign-in after register
    await setSession({ userId: user.id, name: user.name, email: user.email, role: user.role });

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
