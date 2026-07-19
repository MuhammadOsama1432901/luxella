"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { GoogleIcon, FacebookIcon, TikTokIcon, InstagramIcon } from "@/components/auth/SocialIcons";

export default function LoginForm() {
  const router = useRouter();
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      // Redirect to home after successful login
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Card */}
      <div
        className="rounded-3xl shadow-2xl overflow-hidden border"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "rgba(200, 169, 106, 0.15)",
        }}
      >
        {/* Top gold gradient line bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C8A96A] via-[#E8C98A] to-[#C8A96A]" />

        <div className="px-8 sm:px-10 py-12">
          {/* Logo & heading */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[rgba(200,169,106,0.25)] flex-shrink-0">
                <Image
                  src="/images/logo/logo-crest.jpg"
                  alt="LUXELLA Crest"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
              <span
                className="text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#C8A96A] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                LUXELLA
              </span>
            </Link>
            <p className="text-[#C8A96A] text-[9px] uppercase tracking-[0.35em] font-semibold mt-2">
              Fine Jewelry Atelier
            </p>

            <div className="mt-8">
              <h1
                className="text-2xl font-bold text-white tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Welcome Back
              </h1>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
                Sign in to your private atelier account
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-[10px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    borderColor: "rgba(200, 169, 106, 0.15)",
                    color: "var(--text-primary)",
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="block text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] font-bold text-[#C8A96A] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    borderColor: "rgba(200, 169, 106, 0.15)",
                    color: "var(--text-primary)",
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full text-[#111] py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer hover:shadow-lg active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                  Signing In…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-800/40" />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>or continue with</span>
            <div className="flex-1 h-px bg-gray-800/40" />
          </div>

          {/* Social auth buttons — icon only */}
          <div className="flex items-center justify-center gap-3 mb-7">
            {[
              { label: "Google",    Icon: GoogleIcon },
              { label: "Facebook",  Icon: FacebookIcon },
              { label: "TikTok",    Icon: TikTokIcon },
              { label: "Instagram", Icon: InstagramIcon },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                title={`Continue with ${label}`}
                onClick={() => alert(`${label} login coming soon — add OAuth credentials in .env.local`)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(200,169,106,0.15)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(200,169,106,0.1)";
                  e.currentTarget.style.borderColor = "rgba(200,169,106,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(200,169,106,0.15)";
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Sign up link */}
          <p className="text-center text-xs" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#C8A96A] font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Back to shop */}
      <p className="text-center mt-6">
        <Link href="/" className="text-xs transition-colors hover:text-[#C8A96A]" style={{ color: "var(--text-muted)" }}>
          ← Back to Luxella
        </Link>
      </p>
    </div>
  );
}
