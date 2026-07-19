"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Compass } from "lucide-react";

interface CollectionItem {
  name: string;
  desc: string;
  image: string;
  badge?: string;
  count: number;
  heightDesktop: string;
  translateDesktop: string;
}

const collectionsList: CollectionItem[] = [
  {
    name: "New Arrivals",
    desc: "Discover our latest handcrafted designs inspired by modern elegance.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    badge: "NEW",
    count: 14,
    heightDesktop: "460px",
    translateDesktop: "translate-y-4",
  },
  {
    name: "Best Sellers",
    desc: "Most-loved iconic statements curated by our master craftsmen.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    badge: "TRENDING",
    count: 28,
    heightDesktop: "390px",
    translateDesktop: "-translate-y-4",
  },
  {
    name: "Bridal Collection",
    desc: "Timeless pieces crafted for life's most memorable celebrations.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    badge: "EXCLUSIVE",
    count: 18,
    heightDesktop: "510px",
    translateDesktop: "translate-y-8",
  },
  {
    name: "Luxury Collection",
    desc: "Premium statement jewelry crafted with exceptional attention to detail.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop&q=80",
    badge: "BEST SELLER",
    count: 12,
    heightDesktop: "420px",
    translateDesktop: "-translate-y-6",
  },
  {
    name: "Personalized Jewelry",
    desc: "Engrave initials and custom lettering on precious metals.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
    badge: "EXCLUSIVE",
    count: 8,
    heightDesktop: "490px",
    translateDesktop: "translate-y-2",
  },
  {
    name: "Gift Collection",
    desc: "Elegant gifts beautifully designed for every special occasion.",
    image: "https://images.unsplash.com/photo-1549439602-43ebcb2328aa?w=600&auto=format&fit=crop&q=80",
    badge: "TRENDING",
    count: 22,
    heightDesktop: "410px",
    translateDesktop: "-translate-y-2",
  },
  {
    name: "Limited Edition",
    desc: "Extremely rare collector releases with restricted allocations.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80",
    badge: "LIMITED",
    count: 5,
    heightDesktop: "470px",
    translateDesktop: "translate-y-6",
  },
  {
    name: "Sale Collection",
    desc: "Special seasonal privileges on selected atelier masterpieces.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80",
    badge: "SALE",
    count: 31,
    heightDesktop: "380px",
    translateDesktop: "-translate-y-8",
  },
];

export default function FeaturedCollections() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── Background Gold Glows ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.02] blur-[80px]"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 space-y-16">
        
        {/* ── Section Title ────────────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.5em] font-bold"
            style={{ color: "var(--gold)" }}
          >
            ✦ Discover
          </p>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-wide"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Featured Collections
          </h2>
          <div className="gold-divider w-24 mx-auto my-4" />
          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
            Carefully curated jewelry collections crafted for every style, celebration, and unforgettable moment.
          </p>
        </div>

        {/* ── Grid/Carousel Container ───────────────────────────────── */}
        {/* On Mobile: Horizontal Swipe snap scroll. On Tablet/Desktop: Staggered Masonry columns. */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-6 scrollbar-hide snap-x snap-mandatory">
          {collectionsList.map((col, idx) => {
            return (
              <div
                key={col.name}
                className={[
                  "snap-center flex-shrink-0 w-[80vw] sm:w-[50vw] md:w-auto",
                  col.translateDesktop,
                  "transition-all duration-1000 ease-out transform",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                ].join(" ")}
                style={{
                  transitionDelay: `${idx * 100}ms`,
                }}
              >
                <Link
                  href={`/shop?collection=${encodeURIComponent(col.name)}`}
                  className="group block relative rounded-3xl overflow-hidden border cursor-pointer flex flex-col justify-end"
                  style={{
                    height: "380px", // Fixed height on mobile/tablet slider
                    borderColor: "rgba(200, 169, 106, 0.12)",
                    background: "var(--bg-card)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    e.currentTarget.style.boxShadow = "0 15px 40px rgba(200, 169, 106, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.12)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
                  }}
                >
                  {/* Dynamic Height Overwrite on Desktop grid */}
                  <div className="hidden lg:block absolute inset-0 z-0">
                    <div
                      className="absolute inset-0"
                      style={{ height: col.heightDesktop }}
                    />
                  </div>

                  {/* Premium Lifestyle Image with subtle scale */}
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />

                  {/* Dark Luxury Gradients */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(to top, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.4) 60%, transparent 100%)",
                    }}
                  />
                  {/* Richer hover gradient layer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(to top, rgba(200, 169, 106, 0.25) 0%, rgba(8, 8, 8, 0.6) 80%)",
                    }}
                  />

                  {/* Gold Top Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
                  />

                  {/* Optional Badges */}
                  {col.badge && (
                    <span
                      className="absolute top-4 right-4 rounded-md px-2.5 py-1 text-[8px] font-bold tracking-widest text-[#111] uppercase"
                      style={{ background: "linear-gradient(135deg, var(--gold-light), var(--gold))" }}
                    >
                      {col.badge}
                    </span>
                  )}

                  {/* Card Contents */}
                  <div className="relative z-10 p-6 space-y-3 transition-transform duration-500 transform group-hover:-translate-y-2">
                    
                    {/* Header line with small luxury icon & product count */}
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-[#C8A96A] font-bold">
                      <span className="flex items-center gap-1">
                        <Compass size={10} /> ATELIER
                      </span>
                      <span>{col.count} PIECES</span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-bold text-white font-serif tracking-wide"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {col.name}
                    </h3>

                    {/* Short description */}
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                      {col.desc}
                    </p>

                    {/* Action trigger */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#C8A96A] group-hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Collection <ChevronRight size={10} />
                      </span>
                    </div>

                  </div>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}