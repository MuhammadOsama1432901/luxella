"use client";

import React from "react";
import { CartProvider } from "@/providers/CartProvider";
import ChatWidget from "@/components/chatbot/ChatWidget";

import { ThemeProvider } from "@/providers/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <ChatWidget />
      </CartProvider>
    </ThemeProvider>
  );
}
