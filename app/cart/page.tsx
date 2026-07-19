"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  return (
    <>
      <Navbar />

      <main
        className="min-h-screen py-20 px-4 sm:px-6"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <CartItem />
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}