import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GiftStudioClient from "@/components/gift/GiftStudioClient";

export const metadata: Metadata = {
  title: "Bespoke Gift Studio | Luxella — Custom Packaging & Notes",
  description:
    "Design the perfect gift. Choose luxury packaging, customize occasion cards, write personalized notes, and select premium jewelry.",
};

export default function GiftStudioPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Banner Hero ───────────────────────────────────────────── */}
        <section className="relative h-[380px] w-full overflow-hidden flex items-center justify-center">
          {/* Background Image */}
          <Image
            src="/images/banners/gift-packaging.jpg"
            alt="Bespoke Gift Packaging Banner"
            fill
            priority
            className="object-cover opacity-60"
          />

          {/* Dark Overlay with gold radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 10%, var(--bg-base) 90%), rgba(8, 8, 8, 0.45)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-4">
            <p className="text-[#C8A96A] uppercase tracking-[0.4em] text-[10px] font-bold">
              ✦ The Art of Giving
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Bespoke <span className="gold-text">Gift Studio</span>
            </h1>
            <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Create an unforgettable moment. Select luxury gold-embossed packaging, personalize occasion cards, and write a custom calligraphy note paired with our premium jewelry pieces.
            </p>
          </div>

          {/* Bottom gold line */}
          <div className="gold-divider absolute bottom-0 left-0 right-0" />
        </section>

        {/* Gift Studio Interactive Builder */}
        <GiftStudioClient />
      </main>
      <Footer />
    </>
  );
}
