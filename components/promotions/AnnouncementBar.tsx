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
        return <Truck className="w-3.5 h-3.5 text-[#0F0F10]" />;
      case "free_gift":
      case "packaging":
        return <Gift className="w-3.5 h-3.5 text-[#0F0F10]" />;
      case "flash_sale":
      case "clearance":
        return <Flame className="w-3.5 h-3.5 text-[#9E1B1B] animate-pulse" />;
      case "limited_offer":
      case "coupon":
        return <Clock className="w-3.5 h-3.5 text-[#0F0F10]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#0F0F10]" />;
    }
  };

  return (
    <div
      className="relative z-50 w-full h-[44px] flex items-center justify-center px-8 select-none mb-2 shadow-md transition-all duration-300"
      style={{
        background: "linear-gradient(90deg, #EAD09D 0%, #C8A96A 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "_" + currentIndex}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center gap-2 cursor-pointer font-medium uppercase tracking-[0.1em] text-[10px] md:text-xs text-[#0F0F10] hover:opacity-85 transition-opacity"
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
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0F0F10]/60 hover:text-[#0F0F10] transition-colors p-1"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
