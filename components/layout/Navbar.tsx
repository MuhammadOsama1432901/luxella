"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/providers/CartProvider";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut, Shield, Search, X, Home, ShoppingBag, Heart,
  Settings, ClipboardList, FileText, Sparkles, Gift, Menu, Sun, Moon, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/providers/ThemeProvider";
import AnnouncementBar from "@/components/promotions/AnnouncementBar";

const navLinks = [
  { href: "/",            label: "Home"        },
  { href: "/shop",        label: "Shop"        },
  { href: "/offers",      label: "Offers"      },
  { href: "/gift-studio", label: "Gift Studio" },
  { href: "/about",       label: "About"       },
  { href: "/contact",     label: "Contact"     },
];

interface UserSession {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll hide/reveal states
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollRef = useRef(0);

  // Global search states
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Scroll handler using ref (no stale closure)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80) {
        setShowHeader(currentScrollY < lastScrollRef.current);
      } else {
        setShowHeader(true);
      }
      lastScrollRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setShowDropdown(false);
        setMobileOpen(false);
        toast.success("Successfully logged out.");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }

  const isActivePath = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <AnnouncementBar />

      {/* ── Sticky Navbar ─────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* ── Left: Logo ─────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[rgba(200,169,106,0.25)] flex-shrink-0">
                <Image
                  src="/images/logo/logo-crest.jpg"
                  alt="LUXELLA Crest"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <span
                className="text-lg font-bold tracking-[0.22em] text-[#F8F6F2] group-hover:text-[#C8A14A] transition-colors hidden sm:block"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                LUXELLA
              </span>
            </Link>

            {/* ── Center: Desktop Navigation Links ───────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] rounded-lg transition-all duration-200 ${
                    isActivePath(link.href)
                      ? "text-[#C8A14A] bg-[rgba(200,169,106,0.08)]"
                      : "text-stone-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Right: Actions ──────────────────────────────────────────── */}
            <div className="flex items-center gap-1 flex-shrink-0">

              {/* Search */}
              <button
                onClick={() => setShowSearchOverlay(true)}
                className="p-2 text-stone-400 hover:text-[#C8A14A] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Theme toggle — desktop only */}
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 text-stone-400 hover:text-[#C8A14A] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-stone-400 hover:text-[#C8A14A] transition-colors rounded-lg hover:bg-white/5"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-0 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full text-[8px] font-bold text-black shadow"
                    style={{ background: "linear-gradient(135deg, #EAD09D, #C8A96A)" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account — desktop dropdown */}
              {user ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#C8A14A] text-black font-bold text-[10px] flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-semibold text-stone-300 max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={12} className="text-stone-500" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-stone-800 bg-[#111] shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-stone-800">
                        <p className="text-xs font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {user.role === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#C8A14A] hover:bg-white/5 font-semibold"
                          >
                            <Shield size={14} /> Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/cart"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-stone-300 hover:bg-white/5"
                        >
                          <ShoppingBag size={14} /> My Cart
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Hamburger — only on small screens */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center p-2 text-stone-400 hover:text-[#C8A14A] transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Fullscreen Navigation Slide-In Menu ─────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] z-[100] flex flex-col justify-between p-6 transition-transform duration-400 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "rgba(10,10,10,0.98)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#C8A96A]/20">
                <img src="/images/logo/logo-crest.jpg" alt="LUXELLA Crest" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold tracking-[0.2em] text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                LUXELLA
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Links */}
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold mb-3">Navigation</p>
            {[
              { href: "/", icon: <Home size={15} />, label: "Home" },
              { href: "/shop", icon: <ShoppingBag size={15} />, label: "Shop Catalog" },
              { href: "/offers", icon: <Sparkles size={15} />, label: "Offers & Deals" },
              { href: "/gift-studio", icon: <Gift size={15} />, label: "Gift Studio" },
              { href: "/about", icon: <ClipboardList size={15} />, label: "About Us" },
              { href: "/contact", icon: <FileText size={15} />, label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-[13px] font-medium transition-all ${
                  isActivePath(item.href)
                    ? "text-[#C8A14A] bg-[rgba(200,169,106,0.08)]"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-[9px] uppercase tracking-widest text-stone-600 font-bold mb-3">Policies</p>
            {[
              { href: "/terms", label: "Terms & Conditions" },
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/returns", label: "Returns & Refunds" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer area inside drawer */}
        <div className="border-t border-white/5 pt-5">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 mb-4 text-[11px] text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>

          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C8A14A] text-[#111] font-bold text-sm flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[9px] text-gray-500 truncate max-w-[140px]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-xl border border-[#C8A14A]/30 text-[#C8A14A]"
                  >
                    <Shield size={15} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[#111] uppercase tracking-widest text-xs"
              style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            >
              Sign In / Create Account
            </Link>
          )}
        </div>
      </div>

      {/* ── Global Search Overlay ──────────────────────────────────────── */}
      {showSearchOverlay && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center pt-20 px-4 sm:px-6 text-white overflow-y-auto">
          <button
            onClick={() => { setShowSearchOverlay(false); setSearchQuery(""); }}
            className="absolute top-5 right-5 p-3 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>

          <div className="w-full max-w-2xl space-y-8">
            <div className="relative border-b border-[#C8A96A]/60 pb-3 flex items-center">
              <Search size={22} className="text-[#C8A96A] mr-4 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xl sm:text-2xl font-serif text-white outline-none placeholder-gray-600 tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-white/5 transition-colors text-gray-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {!searchQuery && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Gold Rings", "Pearl Necklace", "Bridal Set", "Luxury Bracelet", "Minimal Earrings"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 rounded-full border border-white/8 hover:border-[#C8A96A] bg-white/[0.02] text-xs text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {searchLoading ? "Searching..." : `${searchResults.length} results`}
                </p>

                {searchLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#C8A96A]" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No results. Try rings, necklaces or earrings.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
                      {searchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.id}`}
                          onClick={() => { setShowSearchOverlay(false); setSearchQuery(""); }}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 hover:border-[#C8A96A]/30 bg-white/[0.01] hover:bg-white/[0.04] transition-all group"
                        >
                          <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate group-hover:text-[#C8A96A] transition-colors">{prod.name}</p>
                            <p className="text-[10px] text-stone-500 uppercase tracking-wider">{prod.category}</p>
                          </div>
                          <span className="text-xs font-bold text-[#C8A96A] flex-shrink-0">Rs. {prod.price?.toLocaleString()}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="text-center pt-2">
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => { setShowSearchOverlay(false); setSearchQuery(""); }}
                        className="inline-block px-6 py-2.5 rounded-full border border-[#C8A96A] hover:bg-[#C8A96A] text-xs font-bold text-[#C8A96A] hover:text-black uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        View all results
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}