"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/providers/CartProvider";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Shield, Search, X, Home, ShoppingBag, Heart, Settings, ClipboardList, FileText, Sparkles, Gift, Menu } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/providers/ThemeProvider";
import AnnouncementBar from "@/components/promotions/AnnouncementBar";

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
      <AnnouncementBar />
      {/* ── Sticky Header (hides on scroll down, shows on scroll up) ── */}
      <header
        className={`sticky top-0 z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        } bg-[#0B0B0C] border-b border-stone-900/60`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          
          {/* Left: Hamburger Menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center p-2 text-stone-400 hover:text-[#C8A14A] transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Center: Luxella Logo Wordmark */}
          <Link href="/" className="flex items-center justify-center group">
            <span
              className="text-xl font-bold tracking-[0.25em] text-[#F8F6F2] group-hover:text-[#C8A14A] transition-colors"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              LUXELLA
            </span>
          </Link>

          {/* Right: Search, Wishlist, Cart */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setShowSearchOverlay(true)}
              className="p-2 text-stone-400 hover:text-[#C8A14A] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist / Offers */}
            <Link
              href="/offers"
              className="p-2 text-stone-400 hover:text-[#C8A14A] transition-colors"
              aria-label="Offers & Deals"
            >
              <Heart size={18} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-stone-400 hover:text-[#C8A14A] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 min-w-[14px] h-3.5 px-0.5 flex items-center justify-center rounded-full text-[8px] font-bold text-black font-sans shadow"
                  style={{ background: "linear-gradient(135deg, #EAD09D, #C8A96A)" }}
                >
                  {cart.length}
                </span>
              )}
            </Link>
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
                <Gift size={16} /> Gift Studio
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