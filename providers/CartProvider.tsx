"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
  product: Product; // Backwards compatibility for app/checkout/page.tsx
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  total: number;
  cartTotal: number;
  shippingFee: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial mount (client-side only)
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("luxella_cart");
        if (saved) return JSON.parse(saved) as CartItem[];
      } catch { /* ignore corrupted data */ }
    }
    return [];
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("luxella_cart", JSON.stringify(cart));
    } catch { /* ignore storage quota errors */ }
  }, [cart]);

  function addToCart(product: Product, quantity = 1) {
    setCart((prev) => {
      const item = prev.find((p) => p.id === product.id);
      if (item) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { ...product, quantity, product }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function increaseQuantity(id: number) {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  }

  function decreaseQuantity(id: number) {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
    try { localStorage.removeItem("luxella_cart"); } catch { /* ignore */ }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = total;
  const shippingFee = 0; // Free shipping across all orders

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        total,
        cartTotal,
        shippingFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}