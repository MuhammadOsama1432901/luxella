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
          // Load 6 featured products for a premium grid look
          setFeaturedProds(data.slice(0, 6));
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
    <section className="py-12 bg-[#0B0B0C] border-b border-stone-900/60">
      <div className="px-4">
        
        {/* Section Header */}
        <div className="mb-8">
          <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#C8A14A] mb-1">
            ✦ Curated Elegance
          </p>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-playfair)" }}>
            Featured Jewels
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="aspect-square bg-stone-900 animate-pulse rounded-[18px]" />
            ))}
          </div>
        ) : featuredProds.length === 0 ? (
          <p className="text-center text-[10px] text-stone-500 font-bold uppercase tracking-wider py-8">No Featured Jewels Available</p>
        ) : (
          /* Premium 2-column Grid */
          <div className="grid grid-cols-2 gap-4">
            {featuredProds.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A14A] border border-[#C8A14A]/30 hover:border-[#C8A14A] transition-all bg-black/20"
          >
            Explore Full Collection
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}