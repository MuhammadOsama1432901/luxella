import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account | Luxella",
  description: "Join Luxella — create your private atelier account to track orders, save your wishlist, and enjoy a personalised luxury experience.",
};

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background glow orb */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #C8A96A, transparent 70%)" }}
        />
      </div>

      <RegisterForm />
    </main>
  );
}
