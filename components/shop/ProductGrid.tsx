"use client";

import { useMemo, useState, useEffect } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  search?: string;
  category?: string;
  collection?: string;
  maxPrice?: number;
  material?: string;
  stone?: string;
  color?: string;
  availability?: boolean;
  rating?: number;
  occasion?: string;
  style?: string;
  sort?: string;
}

export default function ProductGrid({
  search = "",
  category = "All",
  collection = "All",
  maxPrice = 50000,
  material = "All",
  stone = "All",
  color = "All",
  availability = false,
  rating = 0,
  occasion = "All",
  style = "All",
  sort = "Featured",
}: ProductGridProps) {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
        }
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [...productsList];

    // Search query
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Collection filter
    if (collection !== "All") {
      filtered = filtered.filter((p) => {
        const name = p.name.toLowerCase();
        const cat = (p.category ?? "").toLowerCase();
        const desc = (p.description ?? "").toLowerCase();

        switch (collection.toLowerCase()) {
          case "new arrivals":
            return p.featured === false || cat.includes("new") || name.includes("silver");
          case "best sellers":
            return p.rating === 5 || p.featured === true;
          case "bridal collection":
            return cat.includes("bridal") || name.includes("bridal") || name.includes("kundan");
          case "luxury collection":
            return p.price >= 2000 || name.includes("luxury") || name.includes("diamond");
          case "personalized jewelry":
            return name.includes("custom") || name.includes("personalized") || name.includes("name");
          case "gift collection":
            return p.price <= 2000 || name.includes("gift");
          case "limited edition":
            return (p.stock ?? 0) <= 5;
          case "sale collection":
            return p.sale === true || (p.oldPrice && p.oldPrice > p.price);
          default:
            return true;
        }
      });
    }

    // Max Price
    if (maxPrice > 0) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Material
    if (material !== "All") {
      filtered = filtered.filter((p) => {
        const mat = (p.specifications?.Material ?? "").toLowerCase();
        return mat.includes(material.toLowerCase());
      });
    }

    // Stone
    if (stone !== "All") {
      filtered = filtered.filter((p) => {
        const st = (
          p.specifications?.Stone ??
          p.specifications?.Stones ??
          ""
        ).toLowerCase();
        if (stone.toLowerCase() === "none") {
          return st === "" || st.includes("none");
        }
        return st.includes(stone.toLowerCase());
      });
    }

    // Color
    if (color !== "All") {
      filtered = filtered.filter((p) => {
        const colors = (p.variants?.color ?? []).map((c: string) => c.toLowerCase());
        const mat = (p.specifications?.Material ?? "").toLowerCase();
        return colors.includes(color.toLowerCase()) || mat.includes(color.toLowerCase());
      });
    }

    // Availability
    if (availability) {
      filtered = filtered.filter((p) => (p.stock ?? 0) > 0);
    }

    // Rating
    if (rating > 0) {
      filtered = filtered.filter((p) => p.rating >= rating);
    }

    // Sorting
    switch (sort) {
      case "Price Low → High":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "Price High → Low":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "Highest Rated":
      case "Most Popular":
        filtered.sort((a, b) => b.rating - a.rating);
        break;

      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;

      case "Best Selling":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
        break;

      case "Featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [productsList, search, category, collection, maxPrice, material, stone, color, availability, rating, sort]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex justify-center items-center py-12">
          {/* Skeleton Loaders */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#121212] rounded-3xl p-4 border border-white/5 space-y-4">
                <div className="aspect-square bg-white/5 rounded-2xl" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-8 bg-white/10 rounded-xl w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div
          className="rounded-3xl p-16 text-center border border-dashed"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "rgba(200, 169, 106, 0.15)",
          }}
        >
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            No Products Found
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Try resetting your filters or typing different search terms.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-0 py-8">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Products
          </h2>
          <p className="mt-1 text-xs uppercase tracking-wider font-semibold text-gray-500">
            {filteredProducts.length} Exquisite pieces matched
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}