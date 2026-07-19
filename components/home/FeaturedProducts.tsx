"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types/product";

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
          setFeaturedProds(data.slice(0, 4));
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
    <section className="py-14 relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Subtle decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,169,106,0.03) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-4" style={{ color: "#C8A96A" }}>
            ✦ Curated Elegance
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Featured Pieces
          </h2>
          <div className="gold-divider w-24 mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A96A]" />
          </div>
        ) : featuredProds.length === 0 ? (
          <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-wider py-8">No Featured Jewels Available</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProds.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.25em] text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)", boxShadow: "0 8px 24px rgba(200,169,106,0.25)" }}
          >
            View Full Collection
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}