"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000",
    title: "Timeless Splendor",
    subtitle: "Premium 24K gold plated artificial jewelry.",
    ctaText: "SHOP CATALOGUE",
    ctaLink: "/shop"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000",
    title: "The Bridal Edit",
    subtitle: "Bespoke Kundan & Polki sets for your special day.",
    ctaText: "EXPLORE BRIDAL",
    ctaLink: "/shop?category=Bridal"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000",
    title: "Minimal Elegance",
    subtitle: "Everyday fine jewelry embellished with premium Zirconia.",
    ctaText: "DISCOVER RINGS",
    ctaLink: "/shop?category=Rings"
  }
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Auto-play rotation: advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      // Next slide
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    } else if (info.offset.x > swipeThreshold) {
      // Prev slide
      setIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  const current = HERO_SLIDES[index];

  return (
    <section className="relative w-full h-[520px] overflow-hidden bg-black select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Edge-to-Edge Image */}
          <div className="absolute inset-0">
            <img
              src={current.image}
              alt={current.title}
              className="object-cover w-full h-full opacity-60"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
          </div>

          {/* Text & Action Content */}
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 pb-12 z-10 space-y-4">
            <div className="space-y-2">
              <h1
                className="text-3xl md:text-4xl font-bold tracking-wide text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {current.title}
              </h1>
              <p className="text-[11px] text-[#A5A5A5] font-light max-w-[280px] mx-auto uppercase tracking-widest leading-normal">
                {current.subtitle}
              </p>
            </div>

            <Link href={current.ctaLink} className="pt-2">
              <motion.span
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black bg-[#C8A14A] hover:bg-[#b09241] shadow-lg transition-colors cursor-pointer"
              >
                {current.ctaText}
                <ArrowRight className="w-3 h-3" />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swipe Gesture Handler — only covers upper 60% to avoid blocking CTA button */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 bottom-[140px] z-20 cursor-grab active:cursor-grabbing"
      />

      {/* Slide Dot Indicators — clickable for direct navigation */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-1.5">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${idx === index ? "bg-[#C8A14A] w-4 h-1.5" : "bg-white/20 w-1.5 h-1.5"}`}
          />
        ))}
      </div>
    </section>
  );
}