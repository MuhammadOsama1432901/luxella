"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/providers/CartProvider";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, total, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col transition-transform duration-500 ease-in-out"
        style={{
          background: "var(--bg-elevated)",
          borderLeft: "1px solid rgba(200,169,106,0.15)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(200,169,106,0.12)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} style={{ color: "#C8A96A" }} />
            <h2
              className="font-bold text-base"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            >
              Your Cart
            </h2>
            {cart.length > 0 && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(200,169,106,0.15)", color: "#C8A96A" }}
              >
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-[#C8A96A]/10 cursor-pointer"
            aria-label="Close cart"
          >
            <X size={16} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(200,169,106,0.08)", border: "1px solid rgba(200,169,106,0.15)" }}
              >
                <ShoppingBag size={24} style={{ color: "#C8A96A" }} />
              </div>
              <p
                className="font-bold text-sm mb-1"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
              >
                Your cart is empty
              </p>
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                Discover our curated collections
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
              >
                Shop Now
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,169,106,0.08)" }}
              >
                <Link href={`/product/${item.id}`} onClick={onClose} className="flex-shrink-0">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.id}`} onClick={onClose}>
                    <p
                      className="font-bold text-xs line-clamp-1 hover:text-[#C8A96A] transition-colors"
                      style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                    >
                      {item.name}
                    </p>
                  </Link>
                  <p className="text-[10px] font-bold mt-0.5" style={{ color: "#C8A96A" }}>
                    Rs. {item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{ border: "1px solid rgba(200,169,106,0.15)" }}
                    >
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#C8A96A]/10 transition cursor-pointer"
                      >
                        <Minus size={10} style={{ color: "var(--text-primary)" }} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-[#C8A96A]/10 transition cursor-pointer"
                      >
                        <Plus size={10} style={{ color: "var(--text-primary)" }} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-400 transition cursor-pointer p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            className="px-6 py-5 space-y-3"
            style={{ borderTop: "1px solid rgba(200,169,106,0.12)" }}
          >
            <div className="flex justify-between text-sm font-bold">
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ color: "var(--text-primary)" }}>Rs. {total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
            >
              Checkout
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex w-full items-center justify-center py-3 text-xs font-semibold uppercase tracking-wider transition"
              style={{ color: "var(--text-muted)" }}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
