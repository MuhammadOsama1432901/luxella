"use client";

import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Trash2, Plus, Minus, ShoppingBag, Truck, Gift, ArrowRight } from "lucide-react";
import { useState } from "react";
import { FREE_DELIVERY_THRESHOLD } from "@/constants/business";

export default function CartPage() {
  const { cart, total, shippingFee, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [upgradeGift, setUpgradeGift] = useState(false);

  const giftFee = upgradeGift ? 499 : 0;
  const grandTotal = total + shippingFee + giftFee;
  const remainingForFreeShipping = FREE_DELIVERY_THRESHOLD - total;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-24 md:pb-12" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-baseline border-b border-stone-900 pb-3">
            <h1 className="text-xl font-bold uppercase tracking-wider font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
              Shopping Bag
            </h1>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{itemCount} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-stone-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your bag is empty</h3>
                <p className="text-[10px] text-stone-500 max-w-[200px] mx-auto">Explore our premium collections to select your statements.</p>
              </div>
              <Link href="/shop" className="bg-[#C8A14A] hover:bg-[#b09241] text-black text-[9px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg">
                Shop the collections
              </Link>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress Meter */}
              {remainingForFreeShipping > 0 ? (
                <div className="bg-stone-950 border border-stone-850 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C8A14A]" />
                    <p className="text-[10px] text-stone-300">
                      Add <span className="text-[#C8A14A] font-bold">Rs. {remainingForFreeShipping.toLocaleString()}</span> more for free delivery
                    </p>
                  </div>
                  <div className="w-full h-1 bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#DFBA73] to-[#C8A96A] transition-all duration-300"
                      style={{ width: `${Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-500/25 p-4 rounded-2xl flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🎉 Free Delivery Unlocked!</p>
                </div>
              )}

              {/* Items List */}
              <div className="divide-y divide-stone-900/60">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4 items-center">
                    
                    {/* Image */}
                    <Link href={`/product/${item.id}`} className="w-20 h-20 bg-stone-950 rounded-xl overflow-hidden flex-shrink-0 border border-stone-850">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </Link>

                    {/* Details Info */}
                    <div className="flex-grow min-w-0 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/product/${item.id}`} className="group min-w-0 flex-grow">
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider truncate group-hover:text-[#C8A14A]">
                            {item.name}
                          </h4>
                          <p className="text-[9px] text-stone-500 font-semibold">{item.category}</p>
                        </Link>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Qty & Price Row */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center bg-stone-900 border border-stone-850 rounded-lg">
                          <button onClick={() => decreaseQuantity(item.id)} className="px-2.5 py-1 text-stone-400 font-bold">-</button>
                          <span className="px-1 text-[10px] font-mono font-bold text-white">{item.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)} className="px-2.5 py-1 text-stone-400 font-bold">+</button>
                        </div>

                        <span className="text-[11px] font-bold text-[#C8A14A] font-mono">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Gifting Packaging Selector */}
              <div className="bg-stone-950 border border-stone-850 p-4 rounded-2xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cart-gift"
                  checked={upgradeGift}
                  onChange={(e) => setUpgradeGift(e.target.checked)}
                  className="rounded mt-0.5 accent-[#C8A14A] cursor-pointer"
                />
                <div className="space-y-1 cursor-pointer" onClick={() => setUpgradeGift(!upgradeGift)}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5 cursor-pointer">
                    🎁 Upgrade to Gift Package (+ Rs. 499)
                  </label>
                  <p className="text-[8px] text-stone-500">Includes velvet-lined embossed drawer case and calligraphy wish card.</p>
                </div>
              </div>

              {/* Billing Breakdowns */}
              <div className="space-y-3.5 pt-4 border-t border-stone-900 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="font-mono text-stone-300">Rs. {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping &amp; Handling</span>
                  <span className="font-mono text-stone-300">
                    {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                {upgradeGift && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Premium Packaging</span>
                    <span className="font-mono text-stone-300">Rs. 499</span>
                  </div>
                )}
                <div className="h-px bg-stone-900" />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">Total Order</span>
                  <span className="font-bold text-[#C8A14A] font-mono text-base">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Sticky bottom checkout action bar */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-t border-stone-850 p-4 flex items-center justify-between max-w-[430px] mx-auto">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-bold text-stone-500">Final Total</span>
                  <span className="text-sm font-bold text-white font-mono">Rs. {grandTotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-1.5 bg-[#C8A14A] hover:bg-[#b09241] text-black text-[9px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}