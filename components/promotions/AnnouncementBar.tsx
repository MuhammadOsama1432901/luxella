"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Truck, Gift, Tag, Flame, Clock } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  text: string;
  type: string;
  link?: string;
  active: boolean;
  priority: number;
}

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "d1",
    text: "✨ Free Shipping on Orders Above PKR 2,999",
    type: "free_shipping",
    link: "/shop",
    active: true,
    priority: 1
  },
  {
    id: "d2",
    text: "💎 Flat 20% OFF on Bridal Collection",
    type: "bridal",
    link: "/shop?category=Bridal",
    active: true,
    priority: 2
  },
  {
    id: "d3",
    text: "🎁 Free Luxury Gift Box on Orders Above PKR 7,500",
    type: "free_gift",
    link: "/gift-studio",
    active: true,
    priority: 3
  }
];

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(DEFAULT_ANNOUNCEMENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/promotions?type=announcements");
        if (res.ok) {
          const data = await res.json();
          const activeList = (data.announcements || []).filter((a: Announcement) => a.active);
          if (activeList.length > 0) {
            // Sort by priority (descending or ascending)
            activeList.sort((a: Announcement, b: Announcement) => a.priority - b.priority);
            setAnnouncements(activeList);
          }
        }
      } catch (err) {
        console.error("Failed to load announcements:", err);
      }
    }
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (!isVisible || announcements.length <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [announcements, isVisible, isHovered]);

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  // Helper to get matching icon for type
  const getIcon = (type: string) => {
    switch (type) {
      case "free_shipping":
        return <Truck className="w-3.5 h-3.5 text-[#C8A96A]" />;
      case "free_gift":
      case "packaging":
        return <Gift className="w-3.5 h-3.5 text-[#C8A96A]" />;
      case "flash_sale":
      case "clearance":
        return <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />;
      case "limited_offer":
      case "coupon":
        return <Clock className="w-3.5 h-3.5 text-[#C8A96A]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />;
    }
  };

  return (
    <div
      className="relative z-50 bg-[#0B0B0C] border-b border-[#C8A96A]/10 text-xs text-stone-300 py-2.5 px-8 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[16px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "_" + currentIndex}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
          >
            {getIcon(current.type)}
            {current.link ? (
              <Link href={current.link} className="hover:underline flex items-center gap-1">
                <span>{current.text}</span>
              </Link>
            ) : (
              <span>{current.text}</span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors p-1"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
