"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, Check } from "lucide-react";
import { GoogleIcon, FacebookIcon, TikTokIcon, InstagramIcon } from "@/components/auth/SocialIcons";

export default function RegisterForm() {
  const router = useRouter();
  const [fullName,        setFullName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [agreed,          setAgreed]          = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState(false);

  // Password strength
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strengthScore = strength.filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Strong", "Very Strong"][strengthScore];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#10B981", "#C8A96A"][strengthScore];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      setSuccess(true);
      // Short delay then redirect to home
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1800);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md relative z-10 text-center">
        <div
          className="rounded-3xl shadow-2xl overflow-hidden border px-8 sm:px-10 py-14"
          style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.15)" }}
        >
          <div
            className="h-1.5 w-full bg-gradient-to-r from-[#C8A96A] via-[#E8C98A] to-[#C8A96A] mb-12"
            style={{ marginLeft: "-2.5rem", marginRight: "-2.5rem", width: "calc(100% + 5rem)" }}
          />
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ background: "rgba(200,169,106,0.12)" }}
          >
            <Check size={28} style={{ color: "#C8A96A" }} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Welcome to Luxella
          </h2>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            Your account has been created. Taking you home…
          </p>
          <div className="w-8 h-8 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin mx-auto mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Card */}
      <div
        className="rounded-3xl shadow-2xl overflow-hidden border"
        style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.15)" }}
      >
        {/* Gold top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C8A96A] via-[#E8C98A] to-[#C8A96A]" />

        <div className="px-8 sm:px-10 py-10">
          {/* Logo & heading */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[rgba(200,169,106,0.25)] flex-shrink-0">
                <Image src="/images/logo/logo-crest.jpg" alt="LUXELLA Crest" width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <span className="text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#C8A96A] transition-colors" style={{ fontFamily: "var(--font-playfair)" }}>
                LUXELLA
              </span>
            </Link>
            <p className="text-[#C8A96A] text-[9px] uppercase tracking-[0.35em] font-semibold mt-2">Fine Jewelry Atelier</p>
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>Create Account</h1>
              <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>Join Luxella — your private jewelry atelier</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl px-4 py-3">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input id="reg-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(200,169,106,0.15)", color: "var(--text-primary)" }}
                  autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Email Address *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(200,169,106,0.15)", color: "var(--text-primary)" }}
                  autoComplete="email" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="reg-phone" className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 0000000"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(200,169,106,0.15)", color: "var(--text-primary)" }}
                  autoComplete="tel" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input id="reg-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(200,169,106,0.15)", color: "var(--text-primary)" }}
                  autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0,1,2,3].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i < strengthScore ? strengthColor : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>Confirm Password *</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#C8A96A" }} />
                <input id="reg-confirm" type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl text-xs outline-none transition-all duration-200 border"
                  style={{ background: "rgba(255,255,255,0.04)", borderColor: confirmPassword && confirmPassword !== password ? "rgba(239,68,68,0.4)" : "rgba(200,169,106,0.15)", color: "var(--text-primary)" }}
                  autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[10px] text-rose-400 mt-1.5 font-medium">Passwords do not match</p>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer mt-1">
              <div onClick={() => setAgreed((v) => !v)}
                className="mt-0.5 w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer"
                style={{ background: agreed ? "linear-gradient(135deg,#C8A96A,#8B6914)" : "rgba(255,255,255,0.04)", borderColor: agreed ? "#C8A96A" : "rgba(200,169,106,0.2)" }}>
                {agreed && <Check size={11} color="#111" strokeWidth={3} />}
              </div>
              <span className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                I agree to Luxella&apos;s{" "}
                <Link href="/terms" className="text-[#C8A96A] hover:underline font-bold">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-[#C8A96A] hover:underline font-bold">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button id="register-submit-btn" type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer hover:shadow-lg active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)", color: "#111" }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />Creating Account…</>
              ) : (
                <><Sparkles size={14} />Create My Account</>
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
          <div className="flex items-center justify-center gap-3 mb-6">
            {[
              { label: "Google",    Icon: GoogleIcon },
              { label: "Facebook",  Icon: FacebookIcon },
              { label: "TikTok",    Icon: TikTokIcon },
              { label: "Instagram", Icon: InstagramIcon },
            ].map(({ label, Icon }) => (
              <button key={label} type="button" title={`Continue with ${label}`}
                onClick={() => alert(`${label} sign-up coming soon — add OAuth credentials in .env.local`)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 border"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(200,169,106,0.15)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,169,106,0.1)"; e.currentTarget.style.borderColor = "rgba(200,169,106,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(200,169,106,0.15)"; }}>
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Sign in link */}
          <p className="text-center text-xs" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-[#C8A96A] font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Back link */}
      <p className="text-center mt-6">
        <Link href="/" className="text-xs transition-colors hover:text-[#C8A96A]" style={{ color: "var(--text-muted)" }}>← Back to Luxella</Link>
      </p>
    </div>
  );
}
