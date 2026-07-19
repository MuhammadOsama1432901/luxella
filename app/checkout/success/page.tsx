"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, PhoneCall, ArrowRight, ClipboardCheck, Package } from "lucide-react";
import { BUSINESS_PHONE } from "@/constants/business";


function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("orderId") || "LXL-2026-XXXX";
  const name = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const total = searchParams.get("total") || "0";
  const address = searchParams.get("address") || "";
  const payment = searchParams.get("payment") || "Cash on Delivery";
  const itemsText = searchParams.get("items") || "";

  const businessPhone = BUSINESS_PHONE;

  // Construct the WhatsApp confirmation message
  const whatsappMessage = `Hello Luxella! I would like to confirm my order:\n\n` +
    `*Order ID*: ${orderId}\n` +
    `*Name*: ${name}\n` +
    `*Phone*: ${phone}\n` +
    `*Shipping Address*: ${address}\n` +
    `*Payment Method*: ${payment}\n` +
    `*Total Amount*: Rs. ${Number(total).toLocaleString()}\n\n` +
    `*Items Ordered*:\n${itemsText}\n\n` +
    `Please process my order. Thank you!`;

  const handleWhatsAppConfirm = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${businessPhone}&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="max-w-xl mx-auto text-center rounded-3xl p-8 sm:p-12 border"
      style={{ background: "var(--bg-elevated)", borderColor: "rgba(200,169,106,0.18)" }}
    >
      {/* Success Check */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
        style={{ background: "rgba(16,185,129,0.1)", border: "2px solid rgba(16,185,129,0.3)", boxShadow: "0 0 40px rgba(16,185,129,0.15)" }}
      >
        <CheckCircle2 size={48} className="text-emerald-400" />
      </div>

      <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-3" style={{ color: "#C8A96A" }}>✦ Order Confirmed</p>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
        Thank You{name ? `, ${name.split(" ")[0]}` : ""}!
      </h1>
      <p className="text-gray-500 mb-8 text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Your order has been received and saved. To speed up processing, please confirm your order on WhatsApp.
      </p>

      {/* Order Details Card */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-left mb-8 space-y-4"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,169,106,0.15)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Package size={14} style={{ color: "#C8A96A" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Order Details</span>
        </div>
        <div className="flex justify-between border-b pb-3 text-sm" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span style={{ color: "var(--text-muted)" }}>Order Number</span>
          <span className="font-bold" style={{ color: "#C8A96A" }}>{orderId}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span style={{ color: "var(--text-muted)" }}>Customer Name</span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{name}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span style={{ color: "var(--text-muted)" }}>Shipping Address</span>
          <span className="font-bold text-right max-w-[240px] truncate" style={{ color: "var(--text-primary)" }} title={address}>
            {address}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <span style={{ color: "var(--text-muted)" }}>Payment Method</span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{payment}</span>
        </div>

        <div className="flex justify-between pt-1 text-sm">
          <span style={{ color: "var(--text-muted)" }}>Grand Total</span>
          <span className="font-bold text-base" style={{ color: "#C8A96A" }}>Rs. {Number(total).toLocaleString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* WhatsApp Confirm Button */}
        <button
          onClick={handleWhatsAppConfirm}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba56] py-4 text-sm font-bold uppercase tracking-wider text-white transition-all shadow-md active:scale-98 cursor-pointer relative overflow-hidden group"
        >
          {/* Subtle pulse effect */}
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <PhoneCall size={18} />
          Confirm Order on WhatsApp
        </button>

        {/* Copy details to clipboard (backup option) */}
        <button
          onClick={handleCopyDetails}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          style={{ border: "1px solid rgba(200,169,106,0.2)", color: "var(--text-secondary)", background: "rgba(255,255,255,0.02)" }}
        >
          <ClipboardCheck size={16} />
          {copied ? "Copied!" : "Copy Order Details"}
        </button>

        <div className="pt-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
            style={{ color: "#C8A96A" }}
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen py-16 sm:py-24" style={{ background: "var(--bg-base)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Suspense
            fallback={
              <div className="max-w-xl mx-auto text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto" />
                <p className="text-gray-500 mt-4">Loading order details...</p>
              </div>
            }
          >
            <SuccessPageContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
