"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/providers/CartProvider";
import { CreditCard, Truck, ArrowLeft, Loader2, Sparkles, Smartphone, Landmark, CheckCircle, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { BANK_DETAILS } from "@/constants/business";

const PAK_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
];

// Luhn Algorithm validation for credit cards
function validateCardNumber(num: string) {
  const clean = num.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  if (!clean || clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, shippingFee, clearCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(PAK_CITIES[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Card Payment States
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // EasyPaisa States
  const [epWalletNumber, setEpWalletNumber] = useState("");
  const [epTxnId, setEpTxnId] = useState("");
  const [upgradeGift, setUpgradeGift] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    async function loadSettingsAndUser() {
      try {
        const [settingsRes, userRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/auth/me")
        ]);
        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }
        if (userRes.ok) {
          const uData = await userRes.json();
          setUser(uData.user);
        }
      } catch (err) {
        console.error("Failed to load checkout settings/user:", err);
      }
    }
    loadSettingsAndUser();
  }, []);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/promotions");
        if (res.ok) {
          const data = await res.json();
          const list = data.coupons || [];
          setAvailableCoupons(list);
          
          // Auto-apply check
          const autoApplied = list.find((c: any) => 
            c.active && 
            c.autoApply && 
            new Date(c.startDate) <= new Date() && 
            new Date(c.endDate) >= new Date() &&
            (!c.minSpend || cartTotal >= c.minSpend)
          );
          if (autoApplied) {
            setAppliedCoupon(autoApplied);
            toast.success(`Coupon "${autoApplied.code}" auto-applied successfully! ✨`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      }
    }
    if (mounted) fetchCoupons();
  }, [mounted, cartTotal]);

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const coupon = availableCoupons.find(c => c.code.toUpperCase() === code);
    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (!coupon.active) {
      setCouponError("This coupon is no longer active.");
      return;
    }

    const now = new Date();
    if (new Date(coupon.startDate) > now) {
      setCouponError("This promotion has not started yet.");
      return;
    }
    if (new Date(coupon.endDate) < now) {
      setCouponError("This coupon has expired.");
      return;
    }

    if (coupon.minSpend && cartTotal < coupon.minSpend) {
      setCouponError(`Minimum purchase of Rs. ${coupon.minSpend.toLocaleString()} required.`);
      return;
    }

    // Check email scope if customer specific
    if (coupon.customerScope && coupon.customerScope.length > 0) {
      if (!user) {
        setCouponError("Please login to use this customer-specific coupon.");
        return;
      }
      if (!coupon.customerScope.map((e: string) => e.toLowerCase()).includes(user.email.toLowerCase())) {
        setCouponError("This coupon is not valid for your account.");
        return;
      }
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied successfully! 💎`);
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === "free_shipping") {
      return shippingFee;
    }
    
    if (appliedCoupon.type === "free_gift") {
      return upgradeGift ? 499 : 0;
    }

    if (appliedCoupon.type === "percentage") {
      let discount = (cartTotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
      return Math.round(discount);
    }

    if (appliedCoupon.type === "fixed") {
      return appliedCoupon.value;
    }

    return 0;
  };

  const discountAmount = calculateDiscount();
  const taxAmount = settings?.taxRate > 0 ? Math.round((cartTotal - (appliedCoupon?.type === "percentage" || appliedCoupon?.type === "fixed" ? discountAmount : 0)) * (settings.taxRate / 100)) : 0;
  const grandTotal = Math.max(0, cartTotal + shippingFee + (upgradeGift ? 499 : 0) + taxAmount - discountAmount);

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardNumber(value.slice(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setCardExpiry(value.slice(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardCvv(value.slice(0, 4));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="w-12 h-12 rounded-full border-2 border-[#C8A96A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    router.replace("/shop");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone/WhatsApp number.");
      return;
    }

    // Payment validation
    let displayPaymentMethod = paymentMethod;
    if (paymentMethod === "Credit Card") {
      if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast.error("Please fill in all credit card details.");
        return;
      }
      if (!validateCardNumber(cardNumber)) {
        toast.error("Invalid credit card number. Please check and try again.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast.error("Please enter expiry in MM/YY format.");
        return;
      }
      if (cardCvv.length < 3) {
        toast.error("Please enter a valid CVV.");
        return;
      }
      const lastFour = cardNumber.replace(/\s/g, "").slice(-4);
      displayPaymentMethod = `Credit Card (Visa/MC ending in ${lastFour})`;
    } else if (paymentMethod === "EasyPaisa") {
      if (!epWalletNumber.trim()) {
        toast.error("Please enter your EasyPaisa mobile wallet number.");
        return;
      }
      if (epWalletNumber.replace(/\D/g, "").length < 10) {
        toast.error("Please enter a valid EasyPaisa phone number.");
        return;
      }
      displayPaymentMethod = `EasyPaisa (Wallet: ${epWalletNumber}${epTxnId ? `, TID: ${epTxnId}` : ""})`;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          name,
          phone: cleanPhone,
          email,
          address,
          city,
        },
        items: [
          ...cart.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          })),
          ...(upgradeGift
            ? [
                {
                  productId: 9999,
                  name: "Signature Premium Gift Package (Box + Ribbon + calligraphic Card)",
                  price: 499,
                  quantity: 1,
                  image: "/images/products/product2.jpg",
                },
              ]
            : []),
        ],
        subtotal: cartTotal + (upgradeGift ? 499 : 0),
        shipping: shippingFee,
        total: grandTotal,
        paymentMethod: displayPaymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const order = await res.json();
      
      toast.success("Order placed successfully!");
      clearCart();
      
      const queryParams = new URLSearchParams({
        orderId: order.id,
        name: order.customer.name,
        phone: order.customer.phone,
        total: order.total.toString(),
        address: `${order.customer.address}, ${order.customer.city}`,
        payment: order.paymentMethod,
      });

      const itemsParam = order.items.map((i: any) => `${i.name} x${i.quantity} (Rs. ${i.price.toLocaleString()})`).join("\n");
      queryParams.append("items", itemsParam);

      router.push(`/checkout/success?${queryParams.toString()}`);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen py-16 px-4 sm:px-6" style={{ background: "var(--bg-base)" }}>
        <div className="max-w-7xl mx-auto">
          {/* Back to Cart link */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={14} style={{ color: "#C8A96A" }} />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form Details (3/5 width) */}
            <div
              className="lg:col-span-3 rounded-3xl p-6 sm:p-10 border shadow-2xl space-y-8"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200, 169, 106, 0.12)",
              }}
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2 block" style={{ color: "#C8A96A" }}>
                  ✦ Secure Boutique checkout
                </span>
                <h2
                  className="text-2xl font-bold tracking-wide"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  Delivery &amp; Payment Details
                </h2>
                <div className="gold-divider w-16 mt-4 opacity-55" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── SECTION 1: CUSTOMER DETAILS ── */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold border-b pb-2" style={{ color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.06)" }}>
                    1. Shipping Information
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Osama Afzal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl px-4 py-3 text-xs outline-none transition w-full"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(200, 169, 106, 0.15)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 03495804586"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="rounded-xl px-4 py-3 text-xs outline-none transition w-full"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(200, 169, 106, 0.15)",
                          color: "var(--text-primary)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. osama@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl px-4 py-3 text-xs outline-none transition w-full"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(200, 169, 106, 0.15)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  {/* Street Address */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      placeholder="Street address, house number, area details..."
                      rows={2.5}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="rounded-xl px-4 py-3 text-xs outline-none transition w-full resize-none"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(200, 169, 106, 0.15)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="rounded-xl px-4 py-3 text-xs outline-none transition w-full"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(200, 169, 106, 0.15)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {PAK_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#111] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ── SECTION 2: PAYMENT METHODS ── */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-xs uppercase tracking-widest font-bold border-b pb-2" style={{ color: "var(--text-secondary)", borderColor: "rgba(255,255,255,0.06)" }}>
                    2. Payment Method
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* COD Option */}
                    <label
                      className="flex items-center gap-3.5 border p-4 rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: paymentMethod === "Cash on Delivery" ? "rgba(200, 169, 106, 0.06)" : "rgba(255,255,255,0.02)",
                        borderColor: paymentMethod === "Cash on Delivery" ? "#C8A96A" : "rgba(200, 169, 106, 0.15)",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          background: paymentMethod === "Cash on Delivery" ? "linear-gradient(135deg,#C8A96A,#8B6914)" : "rgba(255,255,255,0.05)",
                          borderColor: paymentMethod === "Cash on Delivery" ? "transparent" : "rgba(200,169,106,0.15)",
                          color: paymentMethod === "Cash on Delivery" ? "#111" : "#C8A96A",
                        }}
                      >
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>Cash on Delivery</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Pay at your doorstep</p>
                      </div>
                    </label>

                    {/* Bank Transfer Option */}
                    <label
                      className="flex items-center gap-3.5 border p-4 rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: paymentMethod === "Bank Transfer" ? "rgba(200, 169, 106, 0.06)" : "rgba(255,255,255,0.02)",
                        borderColor: paymentMethod === "Bank Transfer" ? "#C8A96A" : "rgba(200, 169, 106, 0.15)",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Bank Transfer"}
                        onChange={() => setPaymentMethod("Bank Transfer")}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          background: paymentMethod === "Bank Transfer" ? "linear-gradient(135deg,#C8A96A,#8B6914)" : "rgba(255,255,255,0.05)",
                          borderColor: paymentMethod === "Bank Transfer" ? "transparent" : "rgba(200,169,106,0.15)",
                          color: paymentMethod === "Bank Transfer" ? "#111" : "#C8A96A",
                        }}
                      >
                        <Landmark size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>Bank Transfer</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Transfer to bank account</p>
                      </div>
                    </label>

                    {/* EasyPaisa Wallet Option */}
                    <label
                      className="flex items-center gap-3.5 border p-4 rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: paymentMethod === "EasyPaisa" ? "rgba(200, 169, 106, 0.06)" : "rgba(255,255,255,0.02)",
                        borderColor: paymentMethod === "EasyPaisa" ? "#C8A96A" : "rgba(200, 169, 106, 0.15)",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "EasyPaisa"}
                        onChange={() => setPaymentMethod("EasyPaisa")}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          background: paymentMethod === "EasyPaisa" ? "linear-gradient(135deg,#C8A96A,#8B6914)" : "rgba(255,255,255,0.05)",
                          borderColor: paymentMethod === "EasyPaisa" ? "transparent" : "rgba(200,169,106,0.15)",
                          color: paymentMethod === "EasyPaisa" ? "#111" : "#C8A96A",
                        }}
                      >
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>EasyPaisa Wallet</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Mobile wallet checkout</p>
                      </div>
                    </label>

                    {/* Credit Card / Stripe Option */}
                    <label
                      className="flex items-center gap-3.5 border p-4 rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: paymentMethod === "Credit Card" ? "rgba(200, 169, 106, 0.06)" : "rgba(255,255,255,0.02)",
                        borderColor: paymentMethod === "Credit Card" ? "#C8A96A" : "rgba(200, 169, 106, 0.15)",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Credit Card"}
                        onChange={() => setPaymentMethod("Credit Card")}
                        className="sr-only"
                      />
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          background: paymentMethod === "Credit Card" ? "linear-gradient(135deg,#C8A96A,#8B6914)" : "rgba(255,255,255,0.05)",
                          borderColor: paymentMethod === "Credit Card" ? "transparent" : "rgba(200,169,106,0.15)",
                          color: paymentMethod === "Credit Card" ? "#111" : "#C8A96A",
                        }}
                      >
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>Credit / Debit Card</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Pay instantly via Stripe</p>
                      </div>
                    </label>
                  </div>

                  {/* ── PAYMENT DETAIL CONTAINERS ── */}

                  {/* 1. Bank Transfer details */}
                  {paymentMethod === "Bank Transfer" && (
                    <div
                      className="rounded-2xl p-5 text-xs space-y-2.5 border leading-relaxed animate-fadeIn"
                      style={{
                        background: "rgba(200,169,106,0.03)",
                        borderColor: "rgba(200,169,106,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Landmark size={14} style={{ color: "#C8A96A" }} />
                        <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: "var(--text-primary)" }}>Direct Bank Details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-gray-400">
                        <span>Bank Name:</span>
                        <span className="font-semibold text-white">{BANK_DETAILS.bankName}</span>
                        <span>Account Title:</span>
                        <span className="font-semibold text-white">{BANK_DETAILS.accountTitle}</span>
                        <span>Account Number:</span>
                        <span className="font-bold text-[#C8A96A]">{BANK_DETAILS.accountNumber}</span>
                        <span>IBAN:</span>
                        <span className="font-semibold text-white text-[10px] break-all">{BANK_DETAILS.iban}</span>
                      </div>
                      <p className="text-[9px] uppercase tracking-wider border-t pt-2 mt-2" style={{ color: "var(--text-muted)", borderColor: "rgba(255,255,255,0.05)" }}>
                        💡 Please transfer the total amount and send a screenshot of the receipt on WhatsApp to confirm your bank transfer.
                      </p>
                    </div>
                  )}

                  {/* 2. EasyPaisa instructions */}
                  {paymentMethod === "EasyPaisa" && (
                    <div
                      className="rounded-2xl p-5 text-xs space-y-4 border animate-fadeIn"
                      style={{
                        background: "rgba(200,169,106,0.03)",
                        borderColor: "rgba(200,169,106,0.2)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone size={14} style={{ color: "#C8A96A" }} />
                        <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: "var(--text-primary)" }}>EasyPaisa Transfer</span>
                      </div>

                      <div className="text-gray-400 space-y-1">
                        <p>Merchant Wallet ID: <span className="font-bold text-[#C8A96A]">{settings?.easyPaisaMerchantId || "03495804586"}</span></p>
                        <p>Account Title: <span className="font-semibold text-white">Luxella Boutique</span></p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-bold text-gray-500">Your EasyPaisa Phone *</label>
                          <input
                            type="text"
                            required
                            placeholder="03xxxxxxxxx"
                            value={epWalletNumber}
                            onChange={(e) => setEpWalletNumber(e.target.value)}
                            className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white outline-none focus:border-[#C8A96A]"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-bold text-gray-500">Transaction ID (TID)</label>
                          <input
                            type="text"
                            placeholder="Optional"
                            value={epTxnId}
                            onChange={(e) => setEpTxnId(e.target.value)}
                            className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white outline-none focus:border-[#C8A96A]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Credit Card Payment inputs */}
                  {paymentMethod === "Credit Card" && (
                    <div
                      className="rounded-2xl p-5 space-y-4 border animate-fadeIn text-xs"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(200,169,106,0.15)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard size={14} style={{ color: "#C8A96A" }} />
                          <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: "var(--text-primary)" }}>Secure Card Details</span>
                        </div>
                        <div className="flex gap-1.5 opacity-60">
                          <span className="text-[8px] border px-1 py-0.5 rounded font-bold text-white border-white/20">VISA</span>
                          <span className="text-[8px] border px-1 py-0.5 rounded font-bold text-white border-white/20">MC</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-bold text-gray-500">Cardholder Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Name on card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white outline-none focus:border-[#C8A96A]"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] uppercase font-bold text-gray-500">Card Number *</label>
                          <input
                            type="text"
                            required
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white outline-none focus:border-[#C8A96A] font-mono tracking-widest"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase font-bold text-gray-500">Expiry Date *</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white outline-none focus:border-[#C8A96A] text-center"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase font-bold text-gray-500">CVV / CVC *</label>
                            <input
                              type="password"
                              required
                              placeholder="***"
                              value={cardCvv}
                              onChange={handleCvvChange}
                              className="rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white outline-none focus:border-[#C8A96A] text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                        <CheckCircle size={10} className="text-emerald-400" />
                        <span>🔒 256-bit SSL encrypted connection. Powered by Stripe.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-4.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #C8A96A, #8B6914)",
                    boxShadow: "0 8px 30px rgba(200, 169, 106, 0.25)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Processing Security Transaction...
                    </>
                  ) : (
                    <>
                      Place order (Rs. {grandTotal.toLocaleString()})
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary (2/5 width) */}
            <div
              className="lg:col-span-2 rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-6 lg:sticky lg:top-28"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200, 169, 106, 0.12)",
              }}
            >
              <h3
                className="text-lg font-bold tracking-wide border-b pb-4"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)", borderColor: "rgba(255,255,255,0.06)" }}
              >
                Order Review
              </h3>

              {/* Items List */}
              <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-xs line-clamp-1" style={{ color: "var(--text-primary)" }}>
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Premium Packaging Upsell */}
              <div
                className="rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden"
                style={{
                  background: upgradeGift ? "rgba(200,169,106,0.05)" : "rgba(255,255,255,0.01)",
                  borderColor: upgradeGift ? "#C8A96A" : "rgba(200,169,106,0.12)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setUpgradeGift(!upgradeGift)}
                  className="flex items-start gap-3 text-left w-full cursor-pointer group"
                >
                  <div
                    className="w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 mt-0.5"
                    style={{
                      borderColor: upgradeGift ? "#C8A96A" : "rgba(255,255,255,0.2)",
                      background: upgradeGift ? "linear-gradient(135deg, #C8A96A, #8B6914)" : "transparent",
                    }}
                  >
                    {upgradeGift && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white group-hover:text-[#C8A96A] transition-colors">
                        🎁 Upgrade to Premium Gift Package
                      </p>
                      <span className="text-[9px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2 py-0.5 rounded">
                        + Rs. 499
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                      Includes a custom velvet-lined gold embossed box, silk wrapping, and a handwritten calligraphy greeting card.
                    </p>
                  </div>
                </button>
              </div>

              {/* Promo Coupon Application Box */}
              <div className="bg-black/35 border border-stone-850 p-4 rounded-2xl space-y-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Apply Promo Code</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#C8A96A]/10 border border-[#C8A96A]/20 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span className="font-mono text-[#C8A96A] font-bold">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-stone-400">
                        ({appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% OFF` : appliedCoupon.type === "free_shipping" ? "Free Ship" : `Rs. ${appliedCoupon.value} OFF`})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BRIDAL20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow rounded-xl px-3 py-2 text-xs outline-none bg-stone-900 border border-stone-800 text-white focus:border-[#C8A96A] uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-stone-900 hover:bg-[#C8A96A] text-stone-300 hover:text-black font-bold text-xs py-2 px-4 rounded-xl border border-stone-800 hover:border-transparent transition-all"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
              </div>

              {/* Subtotal & Delivery Costs */}
              <div className="space-y-3.5 text-xs border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex justify-between font-medium">
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span style={{ color: "var(--text-primary)" }}>Rs. {cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-medium">
                  <span style={{ color: "var(--text-secondary)" }}>Shipping &amp; Handling</span>
                  <span>
                    {appliedCoupon?.type === "free_shipping" || shippingFee === 0 ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                        FREE
                      </span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                {upgradeGift && (
                  <div className="flex justify-between font-medium">
                    <span style={{ color: "var(--text-secondary)" }}>🎁 Premium Gift Package</span>
                    <span className={appliedCoupon?.type === "free_gift" ? "text-emerald-400 font-bold" : "text-stone-200"}>
                      {appliedCoupon?.type === "free_gift" ? "FREE" : "Rs. 499"}
                    </span>
                  </div>
                )}

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between font-medium text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                {settings?.taxRate > 0 && (
                  <div className="flex justify-between font-medium">
                    <span style={{ color: "var(--text-secondary)" }}>Estimated Tax ({settings.taxRate}%)</span>
                    <span style={{ color: "var(--text-primary)" }}>Rs. {taxAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between text-sm font-bold" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span style={{ color: "var(--text-primary)" }}>Order Total</span>
                  <span style={{ color: "#C8A96A" }}>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
