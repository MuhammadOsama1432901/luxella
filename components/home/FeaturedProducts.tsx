"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const [featuredProds, setFeaturedProds] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/products?featured=true");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProds(data.slice(0, 8)); // More products on desktop
        }
      } catch (err) {
        console.error("Error loading featured products", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-14 border-b border-stone-900/60" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#C8A14A] mb-2">
              ✦ Curated Elegance
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              Featured Jewels
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#C8A14A] hover:text-white transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="aspect-square bg-stone-900 rounded-[18px] mb-3" />
                <div className="h-3 bg-stone-900 rounded w-3/4 mb-2" />
                <div className="h-3 bg-stone-900 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredProds.length === 0 ? (
          <p className="text-center text-[10px] text-stone-500 font-bold uppercase tracking-wider py-12">
            No Featured Jewels Available
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredProds.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All CTA */}
        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A14A] border border-[#C8A14A]/30 hover:border-[#C8A14A] transition-all"
          >
            Explore Full Collection
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}