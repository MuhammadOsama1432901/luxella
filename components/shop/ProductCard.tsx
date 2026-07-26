"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star, Sparkles, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
      return wishlist.includes(product.id);
    } catch { return false; }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart! ✨`, {
      style: {
        background: "rgba(20, 20, 20, 0.95)",
        color: "#ffffff",
        border: "1px solid #C8A14A",
      },
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    try {
      const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
      const updated = newLiked
        ? [...wishlist, product.id]
        : wishlist.filter((id) => id !== product.id);
      localStorage.setItem("luxella_wishlist", JSON.stringify(updated));
    } catch { /* ignore */ }
    
    if (newLiked) {
      toast.success("Added to wishlist! 💎");
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col bg-[#111111] border border-stone-850 rounded-[18px] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-stone-950">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleLike}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/5 text-[#F8F6F2] hover:text-[#C8A14A] active:scale-90 transition-all"
          aria-label="Wishlist"
        >
          <Heart size={14} fill={isLiked ? "#C8A14A" : "transparent"} className={isLiked ? "text-[#C8A14A]" : "text-white/80"} />
        </button>

        {/* AI Try-On Badge */}
        {product.virtualTryOn && (
          <span
            className="absolute left-2.5 bottom-2.5 rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest text-[#C8A14A] bg-black/60 border border-[#C8A14A]/30 backdrop-blur-sm flex items-center gap-0.5 z-10"
          >
            <Sparkles size={7} /> Try-On
          </span>
        )}

        {/* Sale / Discount Badge */}
        {product.oldPrice && product.oldPrice > product.price ? (
          <span
            className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest text-white bg-red-900 border border-red-500/20 shadow z-10"
          >
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </span>
        ) : null}
      </div>

      {/* Info Content Section */}
      <div className="p-3.5 flex flex-col justify-between flex-grow space-y-2.5">
        <div className="space-y-1">
          <Link href={`/product/${product.id}`}>
            <h3
              className="text-[11px] md:text-xs font-bold text-[#F8F6F2] line-clamp-1 group-hover:text-[#C8A14A] transition-colors uppercase tracking-wider"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Price & Rating row */}
          <div className="flex justify-between items-baseline gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] md:text-xs font-bold text-[#C8A14A] font-mono">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > product.price ? (
                <span className="text-[8px] line-through text-stone-500 font-mono">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-0.5">
              <Star size={9} fill="#C8A14A" className="text-[#C8A14A]" />
              <span className="text-[8px] text-[#A5A5A5] font-semibold">{product.rating}.0</span>
            </div>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0}
          className="w-full flex items-center justify-center gap-1 rounded-xl py-2 bg-stone-900 border border-stone-850 hover:bg-[#C8A14A] hover:text-black transition-all duration-300 text-[8px] uppercase tracking-widest font-bold text-stone-300 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Plus className="w-2.5 h-2.5" /> Quick Add
        </button>
      </div>
    </motion.div>
  );
}