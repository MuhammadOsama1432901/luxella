"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/CartProvider";

export default function CartItem() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 rounded-3xl text-center"
        style={{ background: "var(--bg-elevated)", border: "1px solid rgba(200,169,106,0.12)" }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "rgba(200,169,106,0.08)", border: "1px solid rgba(200,169,106,0.15)" }}
        >
          <ShoppingBag size={32} style={{ color: "#C8A96A" }} />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Your cart is empty
        </h2>
        <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--text-secondary)" }}>
          Discover our exquisite jewelry collections and find your perfect piece.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-105"
          style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
        >
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Shopping Cart
        </h1>
        <span
          className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full"
          style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.2)" }}
        >
          {cart.reduce((s, i) => s + i.quantity, 0)} items
        </span>
      </div>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 sm:gap-6 rounded-2xl p-4 sm:p-5 transition-all duration-200"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid rgba(200,169,106,0.1)",
          }}
        >
          {/* Image */}
          <Link
            href={`/product/${item.id}`}
            className="flex-shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <Link href={`/product/${item.id}`}>
                <h2
                  className="font-bold text-sm sm:text-base leading-tight line-clamp-1 hover:text-[#C8A96A] transition-colors"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {item.name}
                </h2>
              </Link>
              <p className="text-[10px] uppercase tracking-widest mt-0.5 font-semibold" style={{ color: "#C8A96A" }}>
                {item.category}
              </p>
            </div>

            {/* Qty controls + price row */}
            <div className="flex items-center justify-between mt-3">
              {/* Quantity */}
              <div
                className="flex items-center rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(200,169,106,0.2)", background: "rgba(255,255,255,0.02)" }}
              >
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="w-9 h-9 flex items-center justify-center transition hover:bg-[#C8A96A]/10 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} style={{ color: "var(--text-primary)" }} />
                </button>
                <span
                  className="w-8 text-center text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="w-9 h-9 flex items-center justify-center transition hover:bg-[#C8A96A]/10 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} style={{ color: "var(--text-primary)" }} />
                </button>
              </div>

              {/* Price + Remove */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Rs. {item.price.toLocaleString()} × {item.quantity}
                  </p>
                  <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    color: "#ef4444",
                  }}
                  aria-label="Remove item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}