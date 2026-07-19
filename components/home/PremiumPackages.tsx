"use client";

import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";
import { Sparkles, ShoppingBag, ArrowRight, Gift, Check } from "lucide-react";
import Image from "next/image";

interface CuratedPackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  originalPrice: number;
  packagePrice: number;
  items: string[];
  features: string[];
  badge?: string;
  slug: string;
}

const PREMIUM_PACKAGES: CuratedPackage[] = [
  {
    id: "pkg-empress",
    name: "The Empress Bridal Suite",
    tagline: "ROYAL CELEBRATION BUNDLE",
    description: "Curated for the modern bride. Includes our heavy Kundan collar set, matching statement drop earrings, and a velvet-lined jewelry drawer vault.",
    image: "/images/categories/bridal.jpg",
    originalPrice: 14000,
    packagePrice: 11999,
    items: [
      "Royal Bridal Kundan Set (Rs. 12,500)",
      "Elegant Earrings (Rs. 1,499)",
      "Royal Velvet Drawer Case (Rs. 500)"
    ],
    features: [
      "Gold-Embossed Gift Box",
      "Scented Amber Candle included",
      "Handwritten Calligraphy Wish Card",
      "Premium Silk Ribbon wrapping"
    ],
    badge: "Most Luxurious",
    slug: "empress-bridal-suite"
  },
  {
    id: "pkg-anniversary",
    name: "Timeless Anniversary Set",
    tagline: "ELEGANCE & ROMANCE BUNDLE",
    description: "The ultimate expression of devotion. Features our 24K gold plated crystal pendant necklace paired with emerald drop earrings and a fresh rose bouquet.",
    image: "/images/products/product1.jpg",
    originalPrice: 4500,
    packagePrice: 3499,
    items: [
      "Luxury Gold Necklace (Rs. 2,498)",
      "Elegant Earrings (Rs. 1,499)",
      "Classic Noir Velvet Box (Rs. 250)",
      "Fresh Red Roses Bouquet (Rs. 600)"
    ],
    features: [
      "Premium Gold Foil Wrapping",
      "Anniversary Custom calligraphy card",
      "Belgian Chocolate Truffles",
      "Same-day delivery option"
    ],
    badge: "Best Seller",
    slug: "anniversary-elegance-set"
  },
  {
    id: "pkg-minimalist",
    name: "The Classic Silhouette Set",
    tagline: "EVERYDAY MINIMALIST BUNDLE",
    description: "Understated luxury. Highlights our sterling silver brilliant-cut diamond stimulant ring paired with a freshwater pearl bracelet.",
    image: "/images/products/product3.jpg",
    originalPrice: 3500,
    packagePrice: 2799,
    items: [
      "Diamond Ring (Rs. 1,999)",
      "Pearl Bracelet (Rs. 1,299)",
      "Atelier Envelope Case (Rs. 150)",
      "Scented Amber Candle (Rs. 500)"
    ],
    features: [
      "Rigid Golden Thread envelope seal",
      "Minimalist Congratulations card",
      "Durable velvet storage pouch",
      "Complimentary shipping across Pakistan"
    ],
    badge: "Great Value",
    slug: "silhouette-minimalist-set"
  }
];

export default function PremiumPackages() {
  const { addToCart } = useCart();

  const handleAddBundle = (pkg: CuratedPackage) => {
    addToCart({
      id: parseFloat(pkg.id.replace(/\D/g, "") || "99") + 5000, // unique id offset
      name: `${pkg.name} (Premium Gift Package)`,
      price: pkg.packagePrice,
      oldPrice: pkg.originalPrice,
      rating: 5,
      sale: true,
      image: pkg.image,
      category: "Premium Bundle",
      description: `Premium package includes: ${pkg.items.join(", ")}. Gift features: ${pkg.features.join(", ")}`,
      stock: 5
    });

    toast.success(`${pkg.name} added to your bag!`, {
      style: {
        background: "rgba(20, 20, 20, 0.95)",
        color: "#ffffff",
        border: "1px solid #C8A96A",
      },
    });
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Decorative radial glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(200,169,106,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(200,169,106,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-4" style={{ color: "#C8A96A" }}>
            ✦ Curated Combinations
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
            Bespoke Gift Packages
          </h2>
          <p className="mt-3 text-xs text-gray-400 max-w-md mx-auto">
            Experience the art of gifting. Handpicked jewelry bundles combined with luxury packaging, cards, and fresh elements at an exclusive package value.
          </p>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {PREMIUM_PACKAGES.map((pkg) => {
            const savings = pkg.originalPrice - pkg.packagePrice;
            return (
              <div
                key={pkg.id}
                className="rounded-[2.5rem] border overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(200,169,106,0.15)] hover:border-[#C8A96A]/40"
                style={{
                  background: "var(--bg-elevated)",
                  borderColor: "rgba(200,169,106,0.12)",
                }}
              >
                <div>
                  {/* Image banner */}
                  <div className="h-64 relative overflow-hidden bg-black/40">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Badge */}
                    {pkg.badge && (
                      <span className="absolute top-5 left-5 text-[9px] uppercase tracking-widest font-bold text-black px-3 py-1.5 rounded-full"
                        style={{ background: "linear-gradient(135deg,#C8A96A,#FAF0D8)" }}>
                        {pkg.badge}
                      </span>
                    )}

                    {/* Savings tag */}
                    <span className="absolute top-5 right-5 text-[9px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-3 py-1.5 rounded-full">
                      Save Rs. {savings.toLocaleString()}
                    </span>

                    {/* Bottom title info */}
                    <div className="absolute bottom-5 left-6 right-6">
                      <p className="text-[8px] uppercase tracking-[0.25em] font-bold text-[#C8A96A]">
                        {pkg.tagline}
                      </p>
                      <h3 className="text-xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-playfair)" }}>
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-6">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Included Items */}
                    <div className="space-y-2.5">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-gray-500">Items Included:</p>
                      <div className="space-y-1.5 pl-1.5">
                        {pkg.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A96A]/60 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Premium Touches */}
                    <div className="space-y-2.5 border-t border-white/5 pt-5">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-[#C8A96A]">Signature Touches:</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {pkg.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-400">
                            <Check size={11} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer pricing & Add to cart */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between gap-4 mt-4 bg-white/[0.01]">
                  <div>
                    <p className="text-[9px] text-gray-500 line-through">Rs. {pkg.originalPrice.toLocaleString()}</p>
                    <p className="text-lg font-bold text-[#C8A96A]">Rs. {pkg.packagePrice.toLocaleString()}</p>
                  </div>
                  
                  <button
                    onClick={() => handleAddBundle(pkg)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#111] transition-all hover:scale-105 active:scale-100 cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                  >
                    <ShoppingBag size={12} /> Add Package
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
