import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const db = await readDB();

    // Initialise subscribers array if it doesn't exist
    if (!db.subscribers) {
      db.subscribers = [];
    }

    const normalised = email.toLowerCase().trim();

    // Check for duplicate
    const alreadySubscribed = db.subscribers.some(
      (s: { email: string }) => s.email === normalised
    );

    if (alreadySubscribed) {
      return NextResponse.json(
        { message: "You're already subscribed to the Inner Circle!" },
        { status: 409 }
      );
    }

    db.subscribers.push({
      email: normalised,
      subscribedAt: new Date().toISOString(),
    });

    await writeDB(db);

    return NextResponse.json({ success: true, message: "Subscribed successfully." });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ message: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
