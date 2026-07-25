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
      case "price_asc":
      case "Price Low → High":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price_desc":
      case "Price High → Low":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "rating":
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
      <div className="grid grid-cols-2 gap-4 py-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-[#121212] rounded-[18px] border border-stone-850 overflow-hidden">
            <div className="aspect-square bg-stone-900" />
            <div className="p-3.5 space-y-2">
              <div className="h-3 bg-stone-800 rounded w-3/4" />
              <div className="h-3 bg-stone-800 rounded w-1/2" />
              <div className="h-8 bg-stone-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">No Products Found</p>
        <p className="text-[10px] text-stone-600 mt-2">Try resetting filters or different search terms.</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <p className="text-[9px] uppercase tracking-widest text-stone-500 font-bold mb-4">
        {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''} found
      </p>
      {/* 2-column grid — works perfectly in the 430px mobile container */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}