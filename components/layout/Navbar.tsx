"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/providers/CartProvider";
import { CartIcon, UserIcon, MenuIcon } from "@/components/ui/icons";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Shield, Search, X, Home, ShoppingBag, Heart, Settings, ClipboardList, FileText, Sparkles, Compass } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/providers/ThemeProvider";

const navLinks = [
  { href: "/",            label: "Home"        },
  { href: "/shop",        label: "Shop"        },
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

  // Scroll visibility states
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Global search states
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
          setSearchResults(data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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

  // Helper to determine active path link
  const isActivePath = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* ── Sticky Header (hides on scroll down, shows on scroll up) ── */}
      <header
        className={`sticky top-0 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(200,169,106,0.12)",
        }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[rgba(200,169,106,0.2)] flex-shrink-0">
              <Image
                src="/images/logo/logo-crest.jpg"
                alt="LUXELLA Crest"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span
              className="text-2xl font-bold tracking-[0.22em] transition-all duration-300 text-[var(--text-primary)] group-hover:text-[#C8A96A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              LUXELLA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="group-hover:text-[var(--text-primary)] transition-colors">
                  {link.label}
                </span>
                <span
                  className="absolute bottom-1 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, #C8A96A, transparent)" }}
                />
              </Link>
            ))}

            {/* Try-On special pill */}
            <Link
              href="/try-on"
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ml-2"
              style={{
                background: "linear-gradient(135deg, #C8A96A, #8B6914)",
                color: "white",
                boxShadow: "0 4px 16px rgba(200,169,106,0.3)",
              }}
            >
              ✦ Try-On
            </Link>
          </nav>

          {/* Right Controls Container */}
          <div className="flex items-center gap-2">
            
            {/* User Section (Desktop) */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent hover:border-[#C8A96A]/30 cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md"
                    style={{ background: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))" }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="group-hover:text-[var(--text-primary)] transition-colors">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl py-2 border text-left z-50"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "rgba(200, 169, 106, 0.15)",
                    }}
                  >
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                      >
                        <Shield size={14} className="text-[#C8A96A]" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors uppercase tracking-wider text-left cursor-pointer"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group border border-transparent hover:border-[#C8A96A]/30"
                style={{ color: "var(--text-secondary)" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(200, 169, 106, 0.1)" }}
                >
                  <UserIcon size={14} className="text-[#C8A96A]" />
                </span>
                <span className="group-hover:text-[var(--text-primary)] transition-colors">Login</span>
              </Link>
            )}

            {/* Global Search Button */}
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 group cursor-pointer"
              style={{
                background: "rgba(200,169,106,0.06)",
                border: "1px solid rgba(200,169,106,0.15)",
              }}
              aria-label="Search"
            >
              <Search size={18} className="text-[#C8A96A] group-hover:scale-110 transition-transform" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 group cursor-pointer"
              style={{
                background: "rgba(200,169,106,0.06)",
                border: "1px solid rgba(200,169,106,0.15)",
              }}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A] group-hover:scale-110 transition-transform">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A] group-hover:scale-110 transition-transform">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {/* Cart Link (Desktop only) */}
            <Link
              href="/cart"
              className="relative hidden md:flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 group"
              style={{
                background: "rgba(200,169,106,0.06)",
                border: "1px solid rgba(200,169,106,0.15)",
              }}
              aria-label="Cart"
            >
              <CartIcon size={20} className="text-[#C8A96A] group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  {cart.length}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Menu (Full-screen trigger) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 cursor-pointer"
              style={{ background: "rgba(200,169,106,0.06)", border: "1px solid rgba(200,169,106,0.15)" }}
              aria-label="Menu"
            >
              <MenuIcon size={20} className="text-[#C8A96A]" />
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile Fullscreen Navigation Slide-In Menu ─────────────────── */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0A0A0A]/98 backdrop-blur-xl flex flex-col justify-between p-6 transition-transform duration-500 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#C8A96A]/20">
              <img src="/images/logo/logo-crest.jpg" alt="LUXELLA Crest" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] font-serif text-white" style={{ fontFamily: "var(--font-playfair)" }}>
              LUXELLA
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links Navigation Scroll container */}
        <div className="flex-grow overflow-y-auto py-8 space-y-6 text-sm">
          <div className="space-y-4">
            <p className="text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold">Maison Navigation</p>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium">
                <Home size={16} /> Home
              </Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium">
                <ShoppingBag size={16} /> Shop Catalog
              </Link>
              <Link href="/try-on" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-[#C8A96A] font-semibold">
                <Sparkles size={16} /> AI Virtual Try-On
              </Link>
              <Link href="/gift-studio" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 font-medium">
                <Compass size={16} /> Gift Studio
              </Link>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Customer Privilege</p>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300">
                <ClipboardList size={16} /> Our History
              </Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300">
                <FileText size={16} /> Support & Contact
              </Link>
              <Link href="/terms" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300">
                <Settings size={16} /> Terms & Privacy Policies
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Area inside Menu */}
        <div className="border-t border-white/5 pt-4">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C8A96A] text-[#111] font-bold flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[9px] text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[#111] uppercase tracking-widest text-xs"
              style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            >
              Sign In Account
            </Link>
          )}
        </div>
      </div>

      {/* ── Floating Mobile Bottom Navigation Bar ──────────────────────── */}
      <nav
        className="fixed bottom-5 inset-x-6 z-40 md:hidden flex justify-around items-center rounded-2xl border px-2 py-3 shadow-2xl backdrop-blur-lg"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "rgba(200, 169, 106, 0.18)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Item 1: Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            isActivePath("/") ? "text-[#C8A96A]" : "text-gray-500 hover:text-white"
          }`}
        >
          <Home size={18} />
          <span className="text-[8px] uppercase tracking-wider font-bold mt-1">Home</span>
        </Link>

        {/* Item 2: Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            isActivePath("/shop") ? "text-[#C8A96A]" : "text-gray-500 hover:text-white"
          }`}
        >
          <ShoppingBag size={18} />
          <span className="text-[8px] uppercase tracking-wider font-bold mt-1">Shop</span>
        </Link>

        {/* Item 3: AI Try-On */}
        <Link
          href="/try-on"
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            isActivePath("/try-on") ? "text-[#C8A96A]" : "text-gray-500 hover:text-white"
          }`}
        >
          <Sparkles size={18} />
          <span className="text-[8px] uppercase tracking-wider font-bold mt-1">Try-On</span>
        </Link>

        {/* Item 4: Cart */}
        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            isActivePath("/cart") ? "text-[#C8A96A]" : "text-gray-500 hover:text-white"
          }`}
        >
          <CartIcon size={18} />
          <span className="text-[8px] uppercase tracking-wider font-bold mt-1">Cart</span>
          {cart.length > 0 && (
            <span
              className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-[7px] font-bold text-white flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            >
              {cart.length}
            </span>
          )}
        </Link>

        {/* Item 5: Account (routes to login or admin panel based on session) */}
        <Link
          href={user ? (user.role === "admin" ? "/admin" : "/") : "/login"}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            isActivePath("/login") || isActivePath("/admin") ? "text-[#C8A96A]" : "text-gray-500 hover:text-white"
          }`}
        >
          <UserIcon size={18} />
          <span className="text-[8px] uppercase tracking-wider font-bold mt-1">Account</span>
        </Link>
      </nav>

      {/* ── Global Search Overlay Modal ───────────────────────────────── */}
      {showSearchOverlay && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center pt-24 px-6 text-white overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => {
              setShowSearchOverlay(false);
              setSearchQuery("");
            }}
            className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-2xl space-y-8">
            {/* Search Input Box */}
            <div className="relative border-b border-[#C8A96A]/60 pb-3 flex items-center">
              <Search size={22} className="text-[#C8A96A] mr-4" />
              <input
                type="text"
                autoFocus
                placeholder="Search catalog collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xl md:text-2xl font-serif text-white outline-none placeholder-gray-600 tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Trending tags (when query is empty) */}
            {!searchQuery && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Gold Rings", "Pearl Necklace", "Bridal Set", "Luxury Bracelet", "Minimal Earrings"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-4 py-2 rounded-full border border-white/5 hover:border-[#C8A96A] bg-white/[0.02] text-xs text-gray-400 hover:text-white transition duration-300 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results listing */}
            {searchQuery && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  {searchLoading ? "Searching collections..." : `${searchResults.length} matches found`}
                </p>

                {searchLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C8A96A]" />
                  </div>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No matching jewelry found. Try searching for rings, necklaces or earrings.</p>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.id}`}
                        onClick={() => {
                          setShowSearchOverlay(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl border border-white/5 hover:border-[#C8A96A]/30 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
                      >
                        <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain p-0.5" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-[#C8A96A] transition-colors">{prod.name}</h4>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{prod.category}</p>
                        </div>
                        <span className="text-xs font-bold text-[#C8A96A] flex-shrink-0">Rs. {prod.price.toLocaleString()}</span>
                      </Link>
                    ))}

                    <div className="pt-4 text-center">
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setShowSearchOverlay(false);
                          setSearchQuery("");
                        }}
                        className="inline-block px-6 py-2.5 rounded-full border border-[#C8A96A] hover:bg-[#C8A96A] text-xs font-bold text-[#C8A96A] hover:text-[#111] uppercase tracking-widest transition-colors cursor-pointer"
                      >
                        View all results
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}