"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Star, Sparkles } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/providers/CartProvider";
import { useState } from "react";
import { toast } from "sonner";
import { BUSINESS_PHONE, WHATSAPP_API } from "@/constants/business";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(() => {
    // Persist wishlist in localStorage
    if (typeof window === "undefined") return false;
    try {
      const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
      return wishlist.includes(product.id);
    } catch { return false; }
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: "rgba(20, 20, 20, 0.95)",
        color: "#ffffff",
        border: "1px solid #C8A96A",
      },
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    // Persist to localStorage
    try {
      const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
      const updated = newLiked
        ? [...wishlist, product.id]
        : wishlist.filter((id) => id !== product.id);
      localStorage.setItem("luxella_wishlist", JSON.stringify(updated));
    } catch { /* ignore */ }
    if (newLiked) {
      toast.success("Added to wishlist!", {
        style: { background: "rgba(20, 20, 20, 0.95)", color: "#ffffff", border: "1px solid #C8A96A" },
      });
    }
  };

  const handleBuyNowWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hello Luxella! I am interested in purchasing this product:\n\n*Product*: ${product.name}\n*Price*: Rs. ${product.price.toLocaleString()}\n*ID*: #${product.id}\n\nIs it available? Please guide me on the next steps. Thank you!`;
    window.open(WHATSAPP_API(BUSINESS_PHONE, message), "_blank");
  };

  return (
    <div
      className="group overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl flex flex-col h-full"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "rgba(200, 169, 106, 0.12)",
      }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square bg-[#0b0b0b] border-b border-gray-800/30">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={700}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Discount / Sale Badge */}
        {product.oldPrice && product.oldPrice > product.price ? (
          <span
            className="absolute left-4 top-4 rounded-md px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-white shadow-lg uppercase z-20"
            style={{ background: "linear-gradient(135deg, #A82E2E, #7A1D1D)" }}
          >
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
          </span>
        ) : product.sale ? (
          <span
            className="absolute left-4 top-4 rounded-md px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-white shadow-lg uppercase z-20"
            style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
          >
            SALE
          </span>
        ) : null}

        {/* AI Try-On Badge */}
        {product.virtualTryOn && (
          <span
            className="absolute left-4 bottom-4 rounded-md px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest text-[#C8A96A] backdrop-blur-md flex items-center gap-1 z-20"
            style={{ background: "rgba(10, 10, 10, 0.8)", border: "1px solid #C8A96A" }}
          >
            <Sparkles size={8} /> Try-On
          </span>
        )}

        {/* Category Tag */}
        {product.category && (
          <span
            className="absolute right-4 bottom-4 rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md z-20"
            style={{ background: "rgba(10, 10, 10, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
          >
            {product.category}
          </span>
        )}

        {/* Floating Buttons — visible on hover (desktop) or always (mobile touch) */}
        <div className="absolute right-4 top-4 flex flex-col gap-2.5 z-30
          sm:translate-x-12 sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
          <button
            onClick={handleLike}
            className="rounded-xl p-2.5 shadow-lg transition border hover:scale-105 active:scale-95"
            style={{
              background: "rgba(10, 10, 10, 0.8)",
              borderColor: isLiked ? "#C8A96A" : "rgba(200, 169, 106, 0.15)",
              color: isLiked ? "#C8A96A" : "#F5F0E8",
            }}
            aria-label="Add to wishlist"
          >
            <Heart size={15} fill={isLiked ? "#C8A96A" : "transparent"} />
          </button>

          <Link
            href={`/product/${product.id}`}
            className="rounded-xl p-2.5 shadow-lg transition border hover:scale-105 active:scale-95"
            style={{
              background: "rgba(10, 10, 10, 0.8)",
              borderColor: "rgba(200, 169, 106, 0.15)",
              color: "#F5F0E8",
            }}
            aria-label="View product"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/product/${product.id}`}>
            <h3
              className="text-lg font-bold transition hover:text-[#C8A96A] line-clamp-1"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              {product.name}
            </h3>
          </Link>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              {product.description}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={12}
              fill={index < product.rating ? "#C8A96A" : "transparent"}
              color={index < product.rating ? "#C8A96A" : "#3e372e"}
            />
          ))}

          <span className="ml-2 text-[10px] font-semibold tracking-wider" style={{ color: "var(--text-muted)" }}>
            ({product.rating}.0)
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Rs. {product.price.toLocaleString()}
            </span>

            {product.oldPrice != null && product.oldPrice > product.price && (
              <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                Rs. {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div>
            {product.stock && product.stock > 0 ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                In Stock
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1c1c1c, #111111)",
              border: "1px solid rgba(200, 169, 106, 0.15)",
              color: "white",
            }}
            onMouseEnter={(e) => {
              if (product.stock && product.stock > 0) {
                e.currentTarget.style.background = "linear-gradient(135deg, #C8A96A, #8B6914)";
                e.currentTarget.style.borderColor = "transparent";
              }
            }}
            onMouseLeave={(e) => {
              if (product.stock && product.stock > 0) {
                e.currentTarget.style.background = "linear-gradient(135deg, #1c1c1c, #111111)";
                e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.15)";
              }
            }}
          >
            <ShoppingBag size={13} />
            Add to Cart
          </button>

          <button
            onClick={handleBuyNowWhatsApp}
            className="rounded-xl px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center cursor-pointer"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(200, 169, 106, 0.15)",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C8A96A")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.15)")}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}