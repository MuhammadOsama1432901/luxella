"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Truck, RotateCcw, Star, Award, ChevronRight } from "lucide-react";

export default function HeroRedesign() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 pb-12 text-white">
      
      {/* ── Background Image & Gradient Overlays ────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/cinematic-bg.jpg"
          alt="Luxury Jewelry Cinematic Banner"
          fill
          priority
          className="object-cover object-center opacity-55 transition-transform duration-10000 scale-105 hover:scale-100"
        />
        {/* Cinematic dark overlay to make text highly readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(8, 8, 8, 0.4) 0%, rgba(8, 8, 8, 0.85) 80%), linear-gradient(180deg, rgba(8, 8, 8, 0.5) 0%, var(--bg-base) 100%)",
          }}
        />
      </div>

      {/* ── Subtle Floating Jewelry Particles ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Particle 1 */}
        <div
          className="absolute top-1/4 left-[10%] w-2 h-2 rounded-full bg-[#C8A96A]/60 blur-[1px] animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        {/* Particle 2 */}
        <div
          className="absolute top-1/3 right-[15%] w-3 h-3 rotate-45 border border-[#C8A96A]/40 flex items-center justify-center animate-bounce"
          style={{ animationDuration: "6s" }}
        >
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        {/* Particle 3 */}
        <div
          className="absolute bottom-1/4 left-[20%] w-1.5 h-1.5 rounded-full bg-white/40 animate-ping"
          style={{ animationDuration: "4s" }}
        />
        {/* Particle 4 */}
        <div
          className="absolute bottom-1/3 right-[8%] w-2 h-2 rounded-full bg-[#C8A96A]/50 blur-[2px] animate-pulse"
          style={{ animationDuration: "5s" }}
        />
      </div>

      {/* ── Main Content Container ─────────────────────────────────── */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center my-auto flex flex-col items-center justify-center space-y-10">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#C8A96A]" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] font-bold text-[#C8A96A]">
            ✦ LUXELLA ATELIER ✦
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#C8A96A]" />
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-wide leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="text-white">Timeless Splendor.</span>
            <br />
            <span className="gold-text">Crafted For You.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-gray-300 font-light"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          Explore Pakistan&apos;s most exquisite hand-finished artificial jewelry collections. 
          Perfected with 24K gold plating and premium zirconia stones.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center pt-2">
          <Link href="/shop" className="w-full sm:w-auto">
            <span
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs font-bold tracking-widest text-[#111] hover:text-white transition-all duration-300 hover:scale-105 shadow-2xl cursor-pointer w-full"
              style={{
                background: "linear-gradient(135deg, #C8A96A, #E2C97E)",
                boxShadow: "0 8px 24px rgba(200, 169, 106, 0.3)",
              }}
            >
              SHOP COLLECTION
              <ChevronRight size={14} />
            </span>
          </Link>
          <Link href="/try-on" className="w-full sm:w-auto">
            <span
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs font-bold tracking-widest text-[#C8A96A] hover:text-white transition-all duration-300 hover:scale-105 border cursor-pointer w-full bg-white/[0.01]"
              style={{
                borderColor: "rgba(200,169,106,0.35)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C8A96A")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,106,0.35)")}
            >
              <Sparkles size={14} />
              AI VIRTUAL TRY-ON
            </span>
          </Link>
        </div>

        {/* Floating Statistics Section */}
        <div
          className="rounded-3xl p-5 border shadow-2xl max-w-xl w-full"
          style={{
            background: "rgba(10, 10, 10, 0.45)",
            borderColor: "rgba(200, 169, 106, 0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="grid grid-cols-3 gap-2 divide-x divide-white/10 text-center">
            <div>
              <p className="text-base sm:text-xl font-bold text-[#C8A96A]" style={{ fontFamily: "var(--font-playfair)" }}>
                20,000+
              </p>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 mt-1">
                Happy Customers
              </p>
            </div>
            <div>
              <p className="text-base sm:text-xl font-bold text-[#C8A96A]" style={{ fontFamily: "var(--font-playfair)" }}>
                5,000+
              </p>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 mt-1">
                Orders Delivered
              </p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-base sm:text-xl font-bold text-[#C8A96A] flex items-center justify-center gap-0.5" style={{ fontFamily: "var(--font-playfair)" }}>
                4.9<Star size={12} fill="#C8A96A" className="text-[#C8A96A] inline-block" />
              </p>
              <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-gray-400 mt-1">
                Customer Rating
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom Trust Badges ───────────────────────────────────── */}
      <div className="relative z-20 border-t border-white/5 pt-6 w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Award size={14} className="text-[#C8A96A]" />, text: "Premium Quality" },
            { icon: <ShieldCheck size={14} className="text-[#C8A96A]" />, text: "Secure Checkout" },
            { icon: <Truck size={14} className="text-[#C8A96A]" />, text: "Fast Delivery" },
            { icon: <RotateCcw size={14} className="text-[#C8A96A]" />, text: "Easy Returns" },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-gray-400">
              {badge.icon}
              <span className="text-[10px] uppercase tracking-widest">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}