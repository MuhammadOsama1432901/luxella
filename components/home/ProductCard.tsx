"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types/product";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: "rgba(20, 20, 20, 0.95)",
        color: "#ffffff",
        border: "1px solid #C8A96A",
        backdropFilter: "blur(12px)",
      },
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast.success("Added to wishlist!", {
        style: {
          background: "rgba(20, 20, 20, 0.95)",
          color: "#ffffff",
          border: "1px solid #C8A96A",
        },
      });
    }
  };

  return (
    <div
      className="group rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full border border-gray-800/40"
      style={{ background: "var(--bg-elevated)" }}
    >
      {/* Product Image Area */}
      <div className="relative overflow-hidden aspect-square bg-[#0b0b0b] border-b border-gray-800/30">
        {product.sale && (
          <span
            className="absolute top-4 left-4 text-white px-3 py-1 rounded-md text-[9px] font-bold tracking-[0.2em] uppercase z-10 shadow-lg"
            style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
          >
            SALE
          </span>
        )}

        <button
          onClick={handleLike}
          className="absolute top-4 right-4 rounded-full p-2.5 z-10 transition-all duration-200 border hover:scale-105 active:scale-95"
          style={{
            background: "rgba(10, 10, 10, 0.75)",
            borderColor: isLiked ? "#C8A96A" : "rgba(200, 169, 106, 0.15)",
            backdropFilter: "blur(8px)",
          }}
          aria-label="Wishlist"
        >
          <Heart
            size={14}
            fill={isLiked ? "#C8A96A" : "transparent"}
            color={isLiked ? "#C8A96A" : "#F5F0E8"}
            className="transition-colors"
          />
        </button>

        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
          />
        </Link>

        {/* Custom luxury card border inset hover effect */}
        <div className="absolute inset-0 border border-transparent group-hover:border-[#C8A96A]/30 transition-all duration-300 pointer-events-none rounded-2xl" />
      </div>

      {/* Product Info */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="transition-colors group-hover:text-[#C8A96A]">
          <h3
            className="font-bold text-base tracking-wide line-clamp-1 group-hover:text-[#C8A96A] transition-colors"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex mt-2 mb-3.5 items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < product.rating ? "#C8A96A" : "transparent"}
              color={i < product.rating ? "#C8A96A" : "#3e372e"}
            />
          ))}
          <span className="text-[10px] ml-2 font-semibold tracking-wider" style={{ color: "var(--text-muted)" }}>
            ({product.rating}.0)
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-5 flex-grow">
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Rs. {product.price.toLocaleString()}
          </span>

          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className="w-full text-white py-3.5 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer hover:shadow-lg active:scale-98"
          style={{
            background: "linear-gradient(135deg, #181818, #111111)",
            border: "1px solid rgba(200, 169, 106, 0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #C8A96A, #8B6914)";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #181818, #111111)";
            e.currentTarget.style.borderColor = "rgba(200, 169, 106, 0.2)";
          }}
        >
          <ShoppingCart size={13} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}