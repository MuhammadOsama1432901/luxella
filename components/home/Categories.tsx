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
  {
    id: "necklaces",
    name: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=200",
    href: "/shop?category=Necklaces"
  },
  {
    id: "earrings",
    name: "Earrings",
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=200",
    href: "/shop?category=Earrings"
  },
  {
    id: "bracelets",
    name: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200",
    href: "/shop?category=Bracelets"
  },
  {
    id: "rings",
    name: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200",
    href: "/shop?category=Rings"
  },
  {
    id: "bridal",
    name: "Bridal Set",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=200",
    href: "/shop?category=Bridal"
  },
  {
    id: "gift",
    name: "Gift Studio",
    icon: <Gift className="w-6 h-6 text-[#C8A14A]" />,
    href: "/gift-studio"
  },
  {
    id: "tryon",
    name: "AI Try-On",
    icon: <Sparkles className="w-6 h-6 text-[#C8A14A]" />,
    href: "/try-on"
  }
];

export default function FeaturedCollections() {
  return (
    <section className="w-full py-8 bg-[#0B0B0C] border-b border-stone-900/60">
      <div className="px-4 mb-4 flex justify-between items-baseline">
        <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-[#F8F6F2]">
          Explore Collections
        </h2>
        <span className="text-[9px] uppercase tracking-wider text-[#A5A5A5] font-semibold">Swipe to Browse</span>
      </div>

      {/* Horizontal Scroll container */}
      <div className="flex gap-5 px-4 overflow-x-auto scrollbar-none pb-2 scroll-smooth">
        {CATEGORIES_LIST.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="flex flex-col items-center gap-2 flex-shrink-0 text-center group cursor-pointer"
          >
            {/* Circle Wrapper */}
            <div className="w-[72px] h-[72px] rounded-full border border-stone-800/80 group-hover:border-[#C8A14A] bg-stone-950 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-md">
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

            {/* Label */}
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A5A5A5] group-hover:text-white transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}