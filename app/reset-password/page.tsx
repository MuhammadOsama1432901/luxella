"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Reset token is missing. Please request a new recovery link.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password. The link may have expired.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <Lock size={22} style={{ color: "#C8A96A" }} />
          </div>
          <h1
            className="text-2xl font-bold tracking-wide text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Reset Password
          </h1>
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            Please enter and confirm your new account password.
          </p>
        </div>

        {!token ? (
          <div
            className="p-5 rounded-2xl text-center border space-y-4"
            style={{
              background: "rgba(239, 68, 68, 0.03)",
              borderColor: "rgba(239, 68, 68, 0.15)",
            }}
          >
            <div className="flex justify-center text-rose-500">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-white uppercase">Invalid Recovery Link</p>
              <p className="text-[11px] text-gray-400">
                The password reset token is missing or malformed.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="inline-block px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#C8A96A] border transition-colors hover:bg-[#C8A96A]/10"
              style={{ borderColor: "rgba(200,169,106,0.25)" }}
            >
              Request New Link
            </Link>
          </div>
        ) : success ? (
          <div
            className="p-6 rounded-2xl text-center border space-y-4"
            style={{
              background: "rgba(16, 185, 129, 0.03)",
              borderColor: "rgba(16, 185, 129, 0.15)",
            }}
          >
            <div className="flex justify-center text-emerald-400">
              <ShieldCheck size={36} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-white uppercase">Password Updated</p>
              <p className="text-[11px] text-gray-400">
                Your password has been successfully reset. Redirecting to login page...
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="rounded-xl pl-10 pr-4 py-3.5 text-xs outline-none transition w-full disabled:opacity-50"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(200, 169, 106, 0.15)",
                    color: "var(--text-primary)",
                  }}
                />
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="rounded-xl pl-10 pr-4 py-3.5 text-xs outline-none transition w-full disabled:opacity-50"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(200, 169, 106, 0.15)",
                    color: "var(--text-primary)",
                  }}
                />
                <Lock
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
                  Updating Credentials...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />

      <main
        className="min-h-screen py-24 px-4 flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
            <div className="w-12 h-12 rounded-full border-2 border-[#C8A96A] border-t-transparent animate-spin" />
          </div>
        }>
          <ResetPasswordContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
