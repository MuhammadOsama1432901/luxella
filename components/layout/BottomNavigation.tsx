"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ShoppingBag, Sparkles, Heart, User } from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60) {
        if (currentScrollY > lastScrollY) {
          // Scroll down - hide bar
          setIsVisible(false);
        } else {
          // Scroll up - show bar
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/shop", label: "Shop", icon: <ShoppingBag className="w-5 h-5" /> },
    { href: "/offers", label: "Offers", icon: <Sparkles className="w-5 h-5" /> },
    { href: "/cart", label: "Cart", icon: <Heart className="w-5 h-5" /> },
    { href: "/login", label: "Profile", icon: <User className="w-5 h-5" /> }
  ];

  // Adjust label checks for active state
  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[380px]"
      >
        {/* Luxury Glassmorphic Pill */}
        <nav
          className="flex justify-between items-center px-6 py-3.5 rounded-full border shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-stone-800/40 backdrop-blur-lg bg-black/60"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center text-stone-500 hover:text-stone-300 transition-colors py-1 px-3 group"
              >
                <motion.div
                  animate={{ 
                    scale: active ? 1.15 : 1,
                    color: active ? "#C8A14A" : "#A5A5A5"
                  }}
                  className="relative z-10 transition-colors"
                >
                  {item.icon}
                </motion.div>
                
                {/* Active indicator dot */}
                {active && (
                  <motion.span
                    layoutId="bottomNavDot"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#C8A14A]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </AnimatePresence>
  );
}
