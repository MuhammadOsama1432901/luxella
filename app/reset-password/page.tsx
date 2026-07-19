"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, ShieldCheck, AlertTriangle, Eye, EyeOff, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  // Page States
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  // Input States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Verify Token on Mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setTokenError("Reset token is missing from the link URL.");
      setVerifying(false);
      return;
    }

    async function verifyToken() {
      try {
        const res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        const data = await res.json();
        if (res.ok && data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setTokenError(data.error || "Reset link is invalid or has expired.");
        }
      } catch {
        setTokenError("Connection error while validating reset token.");
      } finally {
        setVerifying(false);
      }
    }

    verifyToken();
  }, [token]);

  // Live Password Strength Criteria
  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(criteria).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isSubmitDisabled = !isPasswordValid || !doPasswordsMatch || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

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
        }, 4000);
      } else {
        setError(data.error || "Failed to reset password. The link may have expired.");
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render Verification Spinner
  if (verifying) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin text-[#C8A96A] mx-auto h-10 w-10 mb-4" />
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          Verifying security signature...
        </p>
      </div>
    );
  }

  return (
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

      {/* Card Container */}
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
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 border"
            style={{
              background: "rgba(200, 169, 106, 0.04)",
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
            Please enter and confirm your new account credentials.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Invalid/Expired Link State */}
          {!tokenValid ? (
            <motion.div
              key="error-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-2xl text-center border space-y-4"
              style={{
                background: "rgba(239, 68, 68, 0.02)",
                borderColor: "rgba(239, 68, 68, 0.15)",
              }}
            >
              <div className="flex justify-center text-rose-500">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Invalid Recovery Link</p>
                <p className="text-[11px] text-gray-400 leading-normal">
                  {tokenError}
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="inline-block px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-[#C8A96A] border transition-colors hover:bg-[#C8A96A]/10"
                style={{ borderColor: "rgba(200,169,106,0.25)" }}
              >
                Request New Link
              </Link>
            </motion.div>
          ) : success ? (
            /* Success Update State */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl text-center border space-y-5"
              style={{
                background: "rgba(16, 185, 129, 0.02)",
                borderColor: "rgba(16, 185, 129, 0.15)",
              }}
            >
              <div className="flex justify-center text-emerald-400">
                <ShieldCheck size={36} />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Password Updated</p>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Your password has been successfully updated. Redirecting to sign in page...
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-black text-center transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
              >
                Back to Login
              </Link>
            </motion.div>
          ) : (
            /* Main Form Input State */
            <motion.form
              key="form-state"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="rounded-xl pl-10 pr-10 py-3.5 text-xs outline-none transition w-full disabled:opacity-50 font-mono tracking-widest"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(200, 169, 106, 0.15)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C8A96A] cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="rounded-xl pl-10 pr-10 py-3.5 text-xs outline-none transition w-full disabled:opacity-50 font-mono tracking-widest"
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(200, 169, 106, 0.15)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <Lock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C8A96A] cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Live Strength Criteria Checkpoints */}
              {password.length > 0 && (
                <div
                  className="p-4 rounded-2xl border text-[11px] space-y-2.5"
                  style={{
                    background: "rgba(255, 255, 255, 0.01)",
                    borderColor: "rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password Security Status</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      {criteria.length ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                      <span className={criteria.length ? "text-gray-300" : "text-gray-500"}>Minimum 8 chars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {criteria.uppercase ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                      <span className={criteria.uppercase ? "text-gray-300" : "text-gray-500"}>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {criteria.lowercase ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                      <span className={criteria.lowercase ? "text-gray-300" : "text-gray-500"}>Lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {criteria.number ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                      <span className={criteria.number ? "text-gray-300" : "text-gray-500"}>Number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {criteria.special ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                      <span className={criteria.special ? "text-gray-300" : "text-gray-500"}>Special char (@$!%*?&)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {doPasswordsMatch ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                      <span className={doPasswordsMatch ? "text-gray-300" : "text-gray-500"}>Passwords match</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-rose-400 text-center font-semibold animate-pulse" role="alert">
                  {error}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.01] active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #C8A96A, #8B6914)",
                  boxShadow: isSubmitDisabled ? "none" : "0 6px 20px rgba(200,169,106,0.18)",
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
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />

      <main
        className="min-h-screen py-24 px-4 flex items-center justify-center relative overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Subtle decorative glows */}
        <div
          className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(200,169,106,0.04) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, rgba(200,169,106,0.04) 0%, transparent 70%)" }}
        />

        <Suspense
          fallback={
            <div className="text-center py-12">
              <Loader2 className="animate-spin text-[#C8A96A] mx-auto h-10 w-10 mb-4" />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Loading secure shell...
              </p>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
