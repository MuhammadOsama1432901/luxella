"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, Tag, Flame, Clock, Copy, Check, ChevronRight, AlertCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Promotion {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  active: boolean;
  startDate: string;
  endDate: string;
  discountBadge?: string;
  promoCode?: string;
  hasCountdown?: boolean;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  active: boolean;
  isOneTime: boolean;
  autoApply: boolean;
}

interface FlashSaleProduct {
  productId: number;
  name: string;
  image: string;
  price: number;
  flashPrice: number;
  stockLimit: number;
  stockSold: number;
}

interface FlashSale {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  products: FlashSaleProduct[];
  active: boolean;
}

// Inline Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2 text-stone-100 text-center font-mono">
      {[
        { label: "D", val: timeLeft.days },
        { label: "H", val: timeLeft.hours },
        { label: "M", val: timeLeft.minutes },
        { label: "S", val: timeLeft.seconds },
      ].map((item, idx) => (
        <div key={idx} className="bg-black/50 backdrop-blur-md border border-[#C8A96A]/20 px-2 py-1 rounded min-w-[38px]">
          <div className="text-sm font-bold text-[#C8A96A]">{String(item.val).padStart(2, "0")}</div>
          <div className="text-[8px] text-stone-400 uppercase tracking-widest">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function OffersPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch("/api/promotions");
        if (res.ok) {
          const data = await res.json();
          setPromotions(data.promotions || []);
          setCoupons(data.coupons || []);
          setFlashSales(data.flashSales || []);
        }
      } catch (err) {
        console.error("Failed to load offers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const now = new Date();

  // Filter Categories
  const activeDeals = promotions.filter(
    (p) => p.active && new Date(p.startDate) <= now && new Date(p.endDate) >= now
  );
  
  const upcomingDeals = promotions.filter(
    (p) => p.active && new Date(p.startDate) > now
  );

  const expiredDeals = promotions.filter(
    (p) => !p.active || new Date(p.endDate) < now
  );

  const activeFlashSales = flashSales.filter(
    (fs) => fs.active && new Date(fs.startDate) <= now && new Date(fs.endDate) >= now
  );

  return (
    <div className="min-h-screen bg-[#080809] text-stone-200">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative py-20 overflow-hidden border-b border-[#C8A96A]/10 bg-gradient-to-b from-[#0B0B0C] to-[#080809]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,106,0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="text-[10px] uppercase tracking-[0.6em] font-semibold text-[#C8A96A] mb-4 block">
            ✦ Luxella Atelier ✦
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Exclusive Promotions & Offers
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Discover tailored savings on our handcrafted fine jewelry. Acquire masterfully designed collections with limited-time boutique privileges.
          </p>
          <div className="gold-divider w-24 mx-auto mt-8" />
        </div>
      </section>

      {loading ? (
        <div className="py-32 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-14 space-y-20">
          
          {/* ── 1. FLASH SALES (IF ACTIVE) ────────────────────────────────────── */}
          {activeFlashSales.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-[#C8A96A]/10 pb-4">
                <Flame className="w-6 h-6 text-red-500 animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                  Limited Flash Privileges
                </h2>
                <div className="ml-auto bg-red-950/40 border border-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Active Now
                </div>
              </div>

              {activeFlashSales.map((fs) => (
                <div key={fs.id} className="bg-gradient-to-r from-stone-950 via-[#0B0B0C] to-stone-950 border border-[#C8A96A]/15 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                        {fs.title}
                      </h3>
                      <p className="text-xs text-stone-400">Prices slashed for a short duration. Stock is strictly capped.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase tracking-widest text-stone-400">Ends In:</span>
                      <CountdownTimer targetDate={fs.endDate} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {fs.products.map((p) => {
                      const percentOff = Math.round(((p.price - p.flashPrice) / p.price) * 100);
                      const stockProgress = (p.stockLimit - p.stockSold) / p.stockLimit;
                      const itemsLeft = p.stockLimit - p.stockSold;

                      return (
                        <div key={p.productId} className="bg-[#121214]/60 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between hover:border-[#C8A96A]/30 transition-all duration-300 group">
                          <div>
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 border border-stone-900 bg-stone-950">
                              <img
                                src={p.image || "/images/products/product1.jpg"}
                                alt={p.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-2 left-2 bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                                {percentOff}% OFF
                              </div>
                            </div>

                            <h4 className="font-bold text-sm text-stone-200 line-clamp-1 mb-1">{p.name}</h4>
                            
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="text-base font-bold text-[#C8A96A]">PKR {p.flashPrice.toLocaleString()}</span>
                              <span className="text-xs text-stone-500 line-through">PKR {p.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {/* Stock progress bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-stone-400">
                                <span>Stock Claimed</span>
                                <span className={itemsLeft <= 3 ? "text-red-400 font-bold" : "text-stone-300"}>
                                  {itemsLeft <= 3 ? `Only ${itemsLeft} Left!` : `${p.stockSold}/${p.stockLimit} Claimed`}
                                </span>
                              </div>
                              <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    itemsLeft <= 3 ? "bg-red-500" : "bg-[#C8A96A]"
                                  }`}
                                  style={{ width: `${Math.max(5, Math.min(100, (p.stockSold / p.stockLimit) * 100))}%` }}
                                />
                              </div>
                            </div>

                            <Link href={`/product/${p.productId}`} className="w-full bg-stone-900 hover:bg-[#C8A96A] text-stone-300 hover:text-black py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1">
                              <ShoppingBag className="w-3.5 h-3.5" /> Acquire Privileges
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── 2. ACTIVE OFFERS & DEALS ───────────────────────────────────────── */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-[#C8A96A]/10 pb-4">
              <Sparkles className="w-6 h-6 text-[#C8A96A]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                Active Deals & Collections
              </h2>
            </div>

            {activeDeals.length === 0 ? (
              <div className="text-center py-10 bg-[#0B0B0C] border border-stone-900 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-[#C8A96A]/60 mx-auto mb-2" />
                <p className="text-stone-400 text-xs">No active store-wide collection promotions at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {activeDeals.map((promo) => (
                  <div key={promo.id} className="relative bg-[#0B0B0C] border border-[#C8A96A]/15 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#C8A96A]/45 transition-all duration-300">
                    <div className="aspect-[21/9] relative w-full overflow-hidden border-b border-stone-900">
                      <img
                        src={promo.image || "/images/banners/banner1.jpg"}
                        alt={promo.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/40 to-transparent" />
                      {promo.discountBadge && (
                        <div className="absolute top-4 right-4 bg-[#C8A96A] text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          {promo.discountBadge}
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                          {promo.title}
                        </h3>
                        {promo.subtitle && <p className="text-xs text-stone-400 leading-relaxed">{promo.subtitle}</p>}
                      </div>

                      {promo.hasCountdown && (
                        <div className="flex items-center justify-between border-t border-stone-900 pt-4">
                          <span className="text-[10px] uppercase tracking-widest text-stone-500">Expiring in:</span>
                          <CountdownTimer targetDate={promo.endDate} />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-stone-900 pt-4">
                        {promo.promoCode ? (
                          <div className="flex items-center justify-between bg-black/40 border border-stone-800 rounded-xl px-4 py-2">
                            <span className="text-xs font-mono text-[#C8A96A] tracking-wider font-semibold mr-4">
                              Code: {promo.promoCode}
                            </span>
                            <button
                              onClick={() => handleCopyCode(promo.promoCode!)}
                              className="text-stone-400 hover:text-white transition-colors"
                              title="Copy promo code"
                            >
                              {copiedCode === promo.promoCode ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <div className="text-[10px] text-stone-500 uppercase tracking-widest">Auto-Applied at checkout</div>
                        )}

                        <Link href={promo.link || "/shop"} className="bg-[#C8A96A] hover:bg-[#b09259] text-black font-bold text-xs py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5">
                          View Pieces <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 3. VALUED COUPON VAULT ────────────────────────────────────────── */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-[#C8A96A]/10 pb-4">
              <Tag className="w-6 h-6 text-[#C8A96A]" />
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                Signature Coupon Vault
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.filter(c => c.active && new Date(c.endDate) >= now).map((coupon) => (
                <div key={coupon.id} className="relative bg-gradient-to-b from-[#121214] to-black border border-stone-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#C8A96A]/30 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-[#C8A96A]/10 border border-[#C8A96A]/20 px-3 py-1 rounded-lg">
                        <span className="text-xs font-bold text-[#C8A96A] uppercase tracking-wider">
                          {coupon.type === "percentage" ? `${coupon.value}% OFF` : coupon.type === "free_shipping" ? "Free Shipping" : `Rs. ${coupon.value} OFF`}
                        </span>
                      </div>
                      {coupon.autoApply && (
                        <div className="text-[9px] bg-stone-900 border border-stone-700 text-[#C8A96A] px-2 py-0.5 rounded uppercase tracking-wider">
                          Auto-Apply
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-white font-bold font-mono text-lg tracking-wider mb-1">{coupon.code}</h3>
                      <p className="text-xs text-stone-400">
                        {coupon.minSpend ? `Requires minimum purchase of Rs. ${coupon.minSpend.toLocaleString()}` : "No minimum spend required."}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-stone-900 mt-6 pt-4 flex items-center justify-between gap-4">
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest">
                      Expires: {new Date(coupon.endDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold py-1.5 px-4 rounded-xl border border-stone-850 hover:border-stone-700 transition-all flex items-center gap-1.5"
                    >
                      {copiedCode === coupon.code ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copiedCode === coupon.code ? "Copied" : "Copy Code"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. UPCOMING PROMOTIONS ────────────────────────────────────────── */}
          {upcomingDeals.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-[#C8A96A]/10 pb-4">
                <Clock className="w-6 h-6 text-stone-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                  Upcoming Exclusives
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 opacity-75">
                {upcomingDeals.map((promo) => (
                  <div key={promo.id} className="bg-[#0B0B0C]/40 border border-stone-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#C8A96A] uppercase tracking-[0.2em] font-semibold mb-2 block">
                        Starts {new Date(promo.startDate).toLocaleDateString()}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                        {promo.title}
                      </h3>
                      {promo.subtitle && <p className="text-xs text-stone-400 leading-relaxed">{promo.subtitle}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. RECENTLY EXPIRED OFFERS ─────────────────────────────────────── */}
          {expiredDeals.length > 0 && (
            <div className="space-y-8 opacity-50">
              <div className="flex items-center gap-3 border-b border-[#C8A96A]/10 pb-4">
                <AlertCircle className="w-6 h-6 text-stone-600" />
                <h2 className="text-xl md:text-2xl font-bold text-stone-400 tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                  Recently Expired Banners
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredDeals.slice(0, 3).map((promo) => (
                  <div key={promo.id} className="bg-[#0B0B0C]/20 border border-stone-950 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-stone-400 font-bold text-sm mb-1">{promo.title}</h3>
                      <p className="text-[10px] text-stone-600">Ended on {new Date(promo.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-stone-900/40 text-[10px] text-stone-600 uppercase tracking-widest">
                      Promotion Concluded
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <Footer />
    </div>
  );
}
