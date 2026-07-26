"use client";

import Link from "next/link";
import { Sparkles, Gift } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  image?: string;
  icon?: React.ReactNode;
  href: string;
}

const CATEGORIES_LIST: CategoryItem[] = [
  { id: "necklaces", name: "Necklaces",  image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200", href: "/shop?category=Necklaces" },
  { id: "earrings",  name: "Earrings",   image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=200", href: "/shop?category=Earrings"  },
  { id: "bracelets", name: "Bracelets",  image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200", href: "/shop?category=Bracelets" },
  { id: "rings",     name: "Rings",      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200", href: "/shop?category=Rings"     },
  { id: "bridal",    name: "Bridal Set", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200", href: "/shop?category=Bridal"    },
  { id: "gift",      name: "Gift Studio", icon: <Gift className="w-6 h-6 text-[#C8A14A]" />,      href: "/gift-studio" },
  { id: "tryon",     name: "AI Try-On",   icon: <Sparkles className="w-6 h-6 text-[#C8A14A]" />,  href: "/try-on"      },
];

export default function FeaturedCollections() {
  return (
    <section className="w-full py-10 bg-[#0B0B0C] border-b border-stone-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-[#F8F6F2]">
            Explore Collections
          </h2>
          <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold hidden sm:block">
            Browse by Category
          </span>
        </div>

        {/* On mobile: horizontal scroll. On desktop: centered row */}
        <div className="flex gap-6 overflow-x-auto scrollbar-none pb-2 sm:justify-center lg:gap-10">
          {CATEGORIES_LIST.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center gap-2.5 flex-shrink-0 text-center group cursor-pointer"
            >
              <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border border-stone-800/80 group-hover:border-[#C8A14A] bg-stone-950 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-md">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[#111111] group-hover:bg-[#1a1a1c] transition-colors">
                    {cat.icon}
                  </div>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 group-hover:text-white transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}