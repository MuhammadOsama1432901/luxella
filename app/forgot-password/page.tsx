"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        if (data.devResetLink) {
          setDevResetLink(data.devResetLink);
        }
      } else {
        setError(data.error || "Something went wrong. Please check your email.");
      }
    } catch {
      setError("Failed to connect to the server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen py-24 px-4 flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Subtle decorative radial glows */}
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(200,169,106,0.04) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(200,169,106,0.04) 0%, transparent 70%)" }}
        />

        <div className="max-w-md w-full relative z-10">
          {/* Back button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6 transition-colors hover:text-white"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Back to Sign In page"
          >
            <ArrowLeft size={14} style={{ color: "#C8A96A" }} />
            Back to Sign In
          </Link>

          {/* Form Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-8 border shadow-2xl space-y-6"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "rgba(200, 169, 106, 0.12)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Header branding */}
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 border"
                style={{
                  background: "rgba(200, 169, 106, 0.04)",
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

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center py-4"
                >
                  <div
                    className="p-4 rounded-2xl text-xs leading-relaxed"
                    style={{
                      background: "rgba(16,185,129,0.04)",
                      border: "1px solid rgba(16,185,129,0.15)",
                      color: "var(--text-secondary)",
                    }}
                    role="alert"
                  >
                    🎉 <strong className="text-white">Request Received!</strong> If the email is registered in our database, a secure reset link will be sent shortly.
                  </div>

                  {devResetLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl text-left border space-y-2.5"
                      style={{
                        background: "rgba(200, 169, 106, 0.04)",
                        borderColor: "rgba(200, 169, 106, 0.2)",
                      }}
                    >
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#C8A96A]">
                        🔧 Development Preview Reset Link
                      </span>
                      <p className="text-[10px] text-gray-400 break-all leading-normal">
                        No live key configured or in dev mode. Click the link below to test:
                      </p>
                      <Link
                        href={devResetLink}
                        className="block text-[11px] font-bold text-[#C8A96A] hover:underline break-all"
                      >
                        {devResetLink}
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="form-state"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="recovery-email"
                      className="text-[10px] uppercase font-bold tracking-wider text-gray-500"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="recovery-email"
                        type="email"
                        required
                        placeholder="e.g. customer@luxella.pk"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        aria-required="true"
                        className="rounded-xl pl-10 pr-4 py-3.5 text-xs outline-none transition w-full disabled:opacity-50"
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
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
                    <p
                      className="text-xs text-rose-400 text-center font-semibold animate-pulse"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  {/* Submit Button */}
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
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
