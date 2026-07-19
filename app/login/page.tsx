import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Luxella",
  description: "Sign in to your Luxella account to track orders and manage your profile.",
};

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #C8A96A, transparent 70%)" }}
        />
      </div>

      <LoginForm />
    </main>
  );
}
