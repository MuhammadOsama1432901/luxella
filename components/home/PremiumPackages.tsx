"use client";

import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";
import { Gift, ArrowRight } from "lucide-react";

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
    description: "Curated for the modern bride. Includes Kundan collar, statement drop earrings, and a velvet drawer case.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600",
    originalPrice: 14000,
    packagePrice: 11999,
    items: [
      "Royal Bridal Kundan Set",
      "Elegant Earrings",
      "Royal Velvet Drawer Case"
    ],
    features: [
      "Gold-Embossed Gift Box",
      "Scented Amber Candle included",
      "Handwritten Calligraphy Card"
    ],
    badge: "Most Luxurious",
    slug: "empress-bridal-suite"
  },
  {
    id: "pkg-anniversary",
    name: "Timeless Anniversary Set",
    tagline: "ELEGANCE & ROMANCE BUNDLE",
    description: "Features our 24K gold plated crystal pendant paired with emerald drop earrings and a fresh rose bouquet.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600",
    originalPrice: 4500,
    packagePrice: 3499,
    items: [
      "Luxury Gold Necklace",
      "Elegant Earrings",
      "Classic Noir Velvet Box"
    ],
    features: [
      "Premium Gold Foil Wrapping",
      "Fresh Red Roses Bouquet"
    ],
    badge: "Anniversary Edit",
    slug: "anniversary-edit"
  }
];

export default function PremiumPackages() {
  const { addToCart } = useCart();

  const handleAddBundle = (pkg: CuratedPackage) => {
    // Generate a unique stable ID for each package using slug hash
    const slugHash = pkg.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    addToCart({
      id: 5000 + slugHash, // Unique stable ID based on slug characters
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

    toast.success(`${pkg.name} added to your bag! 🎁`);
  };

  return (
    <section className="py-12 bg-[#0B0B0C] border-b border-stone-900/60">
      <div className="px-4">
        
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#C8A14A] mb-1">
            ✦ Curated Combinations
          </p>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
            Atelier Bundles
          </h2>
        </div>

        {/* Packages Horizontal Carousel */}
        <div className="flex gap-5 overflow-x-auto scrollbar-none pb-2 scroll-smooth">
          {PREMIUM_PACKAGES.map((pkg) => {
            const savings = pkg.originalPrice - pkg.packagePrice;
            return (
              <div
                key={pkg.id}
                className="w-[280px] flex-shrink-0 bg-[#111111] border border-stone-850 rounded-[18px] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 relative bg-stone-950">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                    
                    {pkg.badge && (
                      <span className="absolute top-3 left-3 text-[7px] uppercase tracking-widest font-bold text-black bg-[#C8A14A] px-2 py-0.5 rounded-full">
                        {pkg.badge}
                      </span>
                    )}

                    <span className="absolute top-3 right-3 text-[7px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Save Rs. {savings.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">{pkg.name}</h3>
                    <p className="text-[9px] text-[#A5A5A5] leading-relaxed line-clamp-2">{pkg.description}</p>
                    
                    <div className="pt-2 divide-y divide-stone-850">
                      {pkg.items.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="text-[8px] text-stone-400 py-1 flex items-center gap-1">
                          ✦ {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddBundle(pkg)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 bg-stone-900 border border-stone-850 hover:bg-[#C8A14A] hover:text-black transition-all duration-300 text-[8px] uppercase tracking-widest font-bold text-[#C8A14A] hover:text-black cursor-pointer"
                  >
                    <Gift className="w-3 h-3" /> Get Bundle (Rs. {pkg.packagePrice.toLocaleString()})
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
