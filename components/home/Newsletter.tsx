"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Failed to subscribe. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative py-14 overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[400px] h-[250px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,106,0.08) 0%, transparent 70%)" }}
        />
      </div>

      {/* Top divider */}
      <div className="gold-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 px-4 text-center">
        {/* Eyebrow */}
        <p className="text-[9px] uppercase tracking-[0.4em] font-bold mb-3" style={{ color: "#C8A96A" }}>
          ✦ Stay Connected
        </p>

        <h2
          className="text-2xl font-bold mb-3 text-white"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          The Inner Circle
        </h2>
        <p className="text-[11px] leading-relaxed mb-6 max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>
          Be the first to receive new arrivals, styling tips, and members-only offers — delivered with elegance.
        </p>

        {sent ? (
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold"
            style={{ background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.3)", color: "#C8A96A" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Welcome to the Inner Circle 💎
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address…"
              required
              disabled={loading}
              className="px-5 py-3.5 rounded-full text-xs outline-none transition-all disabled:opacity-60"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,169,106,0.25)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-black transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #E2C97E, #C8A96A, #8B6914)",
                boxShadow: "0 6px 20px rgba(200,169,106,0.25)",
              }}
            >
              {loading ? "Subscribing…" : "Subscribe Now"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-3 text-[10px] text-rose-400 text-center">{error}</p>
        )}

        <p className="mt-5 text-[9px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          No spam · Unsubscribe anytime · Privacy guaranteed
        </p>
      </div>
    </section>
  );
}