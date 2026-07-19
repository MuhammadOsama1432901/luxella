"use client";

import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { ShoppingBag, Truck, Tag, ArrowRight } from "lucide-react";
import { FREE_DELIVERY_THRESHOLD } from "@/constants/business";

export default function CartSummary() {
  const { total, shippingFee, cart } = useCart();
  const grandTotal = total + shippingFee;
  const remainingForFreeShipping = FREE_DELIVERY_THRESHOLD - total;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="rounded-3xl border p-6 sm:p-8 sticky top-28"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "rgba(200,169,106,0.18)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(200,169,106,0.12)" }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(200,169,106,0.1)", border: "1px solid rgba(200,169,106,0.2)" }}
        >
          <ShoppingBag size={16} style={{ color: "#C8A96A" }} />
        </div>
        <div>
          <h2 className="font-bold text-base" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Order Summary
          </h2>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {/* Free shipping progress */}
      {remainingForFreeShipping > 0 ? (
        <div className="mb-6 p-3.5 rounded-xl" style={{ background: "rgba(200,169,106,0.06)", border: "1px solid rgba(200,169,106,0.12)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Truck size={13} style={{ color: "#C8A96A" }} />
            <p className="text-[10px] font-semibold" style={{ color: "var(--text-secondary)" }}>
              Add{" "}
              <span style={{ color: "#C8A96A" }}>Rs. {remainingForFreeShipping.toLocaleString()}</span>{" "}
              more for FREE delivery
            </p>
          </div>
          <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100)}%`,
                background: "linear-gradient(90deg, #C8A96A, #E2C97E)",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3.5 rounded-xl flex items-center gap-2" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <Truck size={13} className="text-emerald-400" />
          <p className="text-[10px] font-semibold text-emerald-400">
            🎉 You've unlocked FREE delivery!
          </p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3.5 mb-5">
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Rs. {total.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--text-secondary)" }}>Shipping &amp; Handling</span>
          {shippingFee === 0 ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
              FREE
            </span>
          ) : (
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Rs. {shippingFee.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-5" style={{ background: "rgba(200,169,106,0.15)" }} />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
          Order Total
        </span>
        <span className="text-xl font-bold" style={{ color: "#C8A96A" }}>
          Rs. {grandTotal.toLocaleString()}
        </span>
      </div>

      {/* Coupon placeholder */}
      <div className="flex gap-2 mb-5">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,169,106,0.15)",
            color: "var(--text-muted)",
          }}
        >
          <Tag size={12} style={{ color: "#C8A96A" }} />
          <span>Coupon code</span>
        </div>
        <button
          className="px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
          style={{
            background: "rgba(200,169,106,0.1)",
            border: "1px solid rgba(200,169,106,0.25)",
            color: "#C8A96A",
          }}
          onClick={() => {}}
        >
          Apply
        </button>
      </div>

      {/* CTA */}
      <Link
        href="/checkout"
        className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-100"
        style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)", boxShadow: "0 8px 24px rgba(200,169,106,0.25)" }}
      >
        Proceed to Checkout
        <ArrowRight size={13} />
      </Link>

      {/* Trust badge */}
      <p className="text-[9px] text-center mt-4 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
        🔒 Secure Checkout · 7-Day Returns
      </p>
    </div>
  );
}