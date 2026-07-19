"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, KeyRound } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [devResetLink, setDevResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setDevResetLink("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        if (data.resetLink) {
          // Dev helper reset link
          setDevResetLink(data.resetLink);
        }
      } else {
        setError(data.error || "Something went wrong. Please check your email.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen py-24 px-4 flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="max-w-md w-full">
          {/* Back button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={14} style={{ color: "#C8A96A" }} />
            Back to Sign In
          </Link>

          {/* Card */}
          <div
            className="rounded-3xl p-8 border shadow-2xl space-y-6"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "rgba(200, 169, 106, 0.12)",
            }}
          >
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 border"
                style={{
                  background: "rgba(200, 169, 106, 0.05)",
                  borderColor: "rgba(200, 169, 106, 0.15)",
                }}
              >
                <KeyRound size={22} style={{ color: "#C8A96A" }} />
              </div>
              <h1
                className="text-2xl font-bold tracking-wide text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Recover Password
              </h1>
              <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                Enter your email address and we&apos;ll send you recovery details.
              </p>
            </div>

            {success ? (
              <div className="space-y-4 text-center py-4">
                <div className="p-4 rounded-2xl text-xs leading-relaxed" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", color: "var(--text-secondary)" }}>
                  🎉 <strong className="text-white">Success!</strong> If this email exists in our records, a secure reset link has been generated.
                </div>

                {devResetLink && (
                  <div
                    className="p-4 rounded-2xl text-left border space-y-2.5 animate-fadeIn"
                    style={{
                      background: "rgba(200, 169, 106, 0.05)",
                      borderColor: "rgba(200, 169, 106, 0.2)",
                    }}
                  >
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#C8A96A]">🔧 Development Preview Reset Link</span>
                    <p className="text-[10px] text-gray-400 break-all leading-normal">
                      We detected local/preview mode. Copy and paste or click the link below to test the reset password page:
                    </p>
                    <Link
                      href={devResetLink}
                      className="block text-[11px] font-bold text-[#C8A96A] hover:underline break-all"
                    >
                      {devResetLink}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="e.g. osama@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="rounded-xl pl-10 pr-4 py-3.5 text-xs outline-none transition w-full disabled:opacity-50"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(200, 169, 106, 0.15)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <Mail
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-rose-400 text-center font-semibold">
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.01] active:scale-100 disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #C8A96A, #8B6914)",
                    boxShadow: "0 6px 20px rgba(200,169,106,0.18)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating Key...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
