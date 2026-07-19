"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/CartProvider";

export default function EmptyCart() {
  const { cart } = useCart();

  if (cart.length > 0) return null;

  return (
    <div className="text-center py-20">
      <ShoppingBag className="mx-auto mb-5" size={60} />

      <h2 className="text-3xl font-bold">
        Your Cart is Empty
      </h2>

      <p className="mt-4 text-gray-500">
        Browse our latest collection.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-lg bg-black px-6 py-3 text-white"
      >
        Continue Shopping
      </Link>
    </div>
  );
}