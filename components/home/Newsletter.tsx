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
    <section className="relative py-28 overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,106,0.08) 0%, transparent 70%)" }} />
      </div>

      {/* Top divider */}
      <div className="gold-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">

        {/* Eyebrow */}
        <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-5" style={{ color: "#C8A96A" }}>
          ✦ Stay Connected
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          The Inner Circle
        </h2>
        <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
          Join our exclusive community. Be the first to receive new arrivals,
          styling tips, and members-only offers — delivered with elegance.
        </p>

        {sent ? (
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold"
            style={{ background: "rgba(200,169,106,0.12)", border: "1px solid rgba(200,169,106,0.3)", color: "#C8A96A" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Welcome to the Inner Circle, darling 💎
          </div>
        ) : (
          <form onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address…"
              required
              disabled={loading}
              className="flex-1 px-5 py-4 rounded-full text-sm outline-none transition-all disabled:opacity-60"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(200,169,106,0.25)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #C8A96A, #8B6914)",
                boxShadow: "0 8px 24px rgba(200,169,106,0.3)",
              }}
            >
              {loading ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-3 text-xs text-rose-400 text-center">{error}</p>
        )}

        {/* Trust line */}
        <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          No spam. Unsubscribe anytime. Your privacy is sacred to us.
        </p>
      </div>
    </section>
  );
}