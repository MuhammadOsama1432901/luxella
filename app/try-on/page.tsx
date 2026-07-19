import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TryOnStudio from "@/components/tryon/TryOnStudio";

export const metadata: Metadata = {
  title: "Virtual Try-On | Luxella – See It On You",
  description:
    "Upload your photo and see how any Luxella necklace, earring, ring, or bracelet looks on you — powered by AI.",
};

export default function TryOnPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#111] text-white py-14 px-6 text-center relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #C8A96A 0%, transparent 70%)" }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-[#C8A96A] uppercase tracking-[0.35em] text-xs font-medium mb-4">
              ✦ AI Powered Virtual Try-On
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              See It On You,{" "}
              <span className="text-[#C8A96A]">Before You Buy</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Upload a photo, choose any piece from our collection — necklaces, earrings, rings, or bracelets —
              and our AI will show you exactly how it looks on you in seconds.
            </p>

            {/* Category pills preview */}
            <div className="flex items-center justify-center gap-3 flex-wrap mt-8">
              {["📿 Necklaces", "💎 Earrings", "💍 Rings", "✨ Bracelets"].map((t) => (
                <span
                  key={t}
                  className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-4 py-1.5 rounded-full font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <TryOnStudio />
      </main>
      <Footer />
    </>
  );
}
