"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  accent: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1400",
    eyebrow: "✦ New Collection 2025",
    title: "Timeless Splendor",
    subtitle: "Premium 24K gold plated artificial jewelry, crafted for the modern connoisseur.",
    ctaText: "Shop Catalogue",
    ctaLink: "/shop",
    accent: "#C8A14A",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400",
    eyebrow: "✦ Bridal Collection",
    title: "The Bridal Edit",
    subtitle: "Bespoke Kundan & Polki sets curated for your most precious moments.",
    ctaText: "Explore Bridal",
    ctaLink: "/shop?category=Bridal",
    accent: "#E2C97E",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1400",
    eyebrow: "✦ Everyday Luxury",
    title: "Minimal Elegance",
    subtitle: "Everyday fine jewelry embellished with premium Zirconia stones.",
    ctaText: "Discover Rings",
    ctaLink: "/shop?category=Rings",
    accent: "#C8A14A",
  }
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (next: number, dir = 1) => {
    setDirection(dir);
    setIndex((next + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goNext = () => goTo(index + 1, 1);
  const goPrev = () => goTo(index - 1, -1);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) goNext();
    else if (info.offset.x > 50) goPrev();
  };

  const current = HERO_SLIDES[index];

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-black select-none" style={{ height: "clamp(480px, 70vh, 720px)" }}>

      {/* ── Slide Images ───────────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={current.image}
              alt={current.title}
              className="object-cover w-full h-full"
              style={{ opacity: 0.55 }}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="max-w-xl space-y-5">
                {/* Eyebrow */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold"
                  style={{ color: current.accent }}
                >
                  {current.eyebrow}
                </motion.p>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.05]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {current.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-sm"
                >
                  {current.subtitle}
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 pt-2"
                >
                  <Link href={current.ctaLink}>
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black shadow-xl transition-all cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${current.accent}, #8B6914)` }}
                    >
                      {current.ctaText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.span>
                  </Link>

                  <Link
                    href="/shop"
                    className="text-[10px] font-semibold uppercase tracking-widest text-stone-300 hover:text-white transition-colors hidden sm:block"
                  >
                    View All →
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Swipe Gesture Zone (only upper portion to not block CTA) ── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 bottom-[160px] z-20 cursor-grab active:cursor-grabbing"
      />

      {/* ── Desktop Arrow Buttons ──────────────────────────────────── */}
      <button
        onClick={goPrev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70 hover:border-white/30 transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/40 border border-white/10 text-white hover:bg-black/70 hover:border-white/30 transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* ── Slide Count (desktop) ──────────────────────────────────── */}
      <div className="absolute bottom-6 right-6 lg:right-12 z-30 hidden md:flex items-center gap-2 text-white/50 text-xs font-mono">
        <span className="text-white font-bold">{String(index + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span>{String(HERO_SLIDES.length).padStart(2, "0")}</span>
      </div>

      {/* ── Dot Indicators ────────────────────────────────────────── */}
      <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-1.5 md:justify-start md:left-6 lg:left-12">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => goTo(idx, idx > index ? 1 : -1)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === index ? "bg-[#C8A14A] w-5 h-1.5" : "bg-white/25 w-1.5 h-1.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}