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
  const [step, setStep] = useState(1);

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

  // Redirect if cart is empty (use useEffect to avoid render-time navigation)
  useEffect(() => {
    if (mounted && cart.length === 0) {
      router.replace("/shop");
    }
  }, [mounted, cart.length, router]);

  if (mounted && cart.length === 0) {
    return null;
  }

  const validateStep1 = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    setStep(2);
  };

  const validateStep2 = (e: React.MouseEvent) => {
    e.preventDefault();
    if (paymentMethod === "Credit Card") {
      if (!cardName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
        toast.error("Please fill in all credit card details.");
        return;
      }
      if (!validateCardNumber(cardNumber)) {
        toast.error("Invalid credit card number.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast.error("MM/YY expiry format required.");
        return;
      }
      if (cardCvv.length < 3) {
        toast.error("Invalid CVV.");
        return;
      }
    } else if (paymentMethod === "EasyPaisa") {
      if (!epWalletNumber.trim()) {
        toast.error("Please enter your EasyPaisa phone number.");
        return;
      }
      if (epWalletNumber.replace(/\D/g, "").length < 10) {
        toast.error("Invalid EasyPaisa phone number.");
        return;
      }
    }
    setStep(3);
  };

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

      <main className="bg-[#0B0B0C] text-[#F8F6F2] min-h-screen pb-24 relative pt-4">
        <div className="px-4 py-4 space-y-6">

          {/* Minimal header */}
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-stone-500">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <h1 className="text-sm font-bold uppercase tracking-widest text-[#F8F6F2]">Secure Checkout</h1>
            <span className="text-[8px] uppercase tracking-wider text-stone-600">Step {step} of 3</span>
          </div>

          {/* Step indicators */}
          <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold uppercase tracking-wider">
            <div className={`pb-2 border-b-2 transition-all ${step >= 1 ? "border-[#C8A14A] text-white" : "border-stone-850 text-stone-500"}`}>
              1. Address
            </div>
            <div className={`pb-2 border-b-2 transition-all ${step >= 2 ? "border-[#C8A14A] text-white" : "border-stone-850 text-stone-500"}`}>
              2. Payment
            </div>
            <div className={`pb-2 border-b-2 transition-all ${step >= 3 ? "border-[#C8A14A] text-white" : "border-stone-850 text-stone-500"}`}>
              3. Review
            </div>
          </div>

          {/* STEP 1: Address & Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Shipping Address</h3>
                <p className="text-[9px] text-stone-500">Enter where we should ship your jewelry parcel</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-stone-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Osama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl px-4 py-3 bg-stone-950 border border-stone-850 text-white outline-none focus:border-[#C8A14A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-stone-400">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03495804586"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl px-4 py-3 bg-stone-950 border border-stone-850 text-white outline-none focus:border-[#C8A14A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-stone-400">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. osama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl px-4 py-3 bg-stone-950 border border-stone-850 text-white outline-none focus:border-[#C8A14A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-stone-400">Street Address *</label>
                  <textarea
                    required
                    placeholder="House number, street name, sector / area details..."
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded-xl px-4 py-3 bg-stone-950 border border-stone-850 text-white outline-none focus:border-[#C8A14A] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-stone-400">City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="rounded-xl px-4 py-3 bg-stone-950 border border-stone-850 text-white outline-none focus:border-[#C8A14A]"
                  >
                    {PAK_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={validateStep1}
                className="w-full py-3.5 bg-[#C8A14A] hover:bg-[#b09241] text-black rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-300 mt-4 cursor-pointer"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* STEP 2: Payment Option Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Payment Method</h3>
                <p className="text-[9px] text-stone-500">Select how you prefer to settle this security order</p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Method Options Selector list */}
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { key: "Cash on Delivery", label: "💵 Cash on Delivery (COD)" },
                    { key: "Bank Transfer", label: "🏛️ Direct Bank Transfer" },
                    { key: "EasyPaisa", label: "📱 EasyPaisa Wallet Transfer" },
                    { key: "Credit Card", label: "💳 Credit / Debit Card" }
                  ].map((method) => (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() => setPaymentMethod(method.key)}
                      className={`w-full py-3 px-4 rounded-xl text-left font-bold border transition-all cursor-pointer ${
                        paymentMethod === method.key ? "border-[#C8A14A] bg-[#C8A14A]/5 text-[#C8A14A]" : "border-stone-850 bg-stone-950 text-stone-400"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Sub-inputs based on payment choice */}
                {paymentMethod === "Bank Transfer" && (
                  <div className="p-4 bg-stone-950 border border-stone-850 rounded-xl space-y-2 text-[10px]">
                    <p className="font-bold text-[#C8A14A] uppercase tracking-wider text-[8px]">Luxella Bank Details</p>
                    <p className="text-stone-300">Bank: <span className="font-bold text-white">{BANK_DETAILS.bankName}</span></p>
                    <p className="text-stone-300">Title: <span className="font-bold text-white">{BANK_DETAILS.accountTitle}</span></p>
                    <p className="text-stone-300">Account: <span className="font-bold text-white">{BANK_DETAILS.accountNumber}</span></p>
                    <p className="text-[8px] text-stone-500 uppercase tracking-wide border-t border-stone-900 pt-2 mt-2">
                      💡 Please send payment screenshot on WhatsApp after placing order to confirm.
                    </p>
                  </div>
                )}

                {paymentMethod === "EasyPaisa" && (
                  <div className="p-4 bg-stone-950 border border-stone-850 rounded-xl space-y-3">
                    <p className="font-bold text-[#C8A14A] uppercase tracking-wider text-[8px]">{settings?.easyPaisaAccountTitle || "Luxella EasyPaisa wallet"}</p>
                    <p className="text-[10px] text-stone-300">Number: <span className="font-bold text-white">{settings?.easyPaisaMerchantId || "03495804586"}</span></p>
                    
                    <div className="grid grid-cols-2 gap-2 border-t border-stone-900 pt-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-stone-500">Your Phone *</label>
                        <input
                          type="text"
                          required
                          placeholder="03xxxxxxxxx"
                          value={epWalletNumber}
                          onChange={(e) => setEpWalletNumber(e.target.value)}
                          className="rounded-lg px-2.5 py-2 bg-stone-950 border border-stone-850 text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-stone-500">Transaction ID (TID)</label>
                        <input
                          type="text"
                          placeholder="Optional"
                          value={epTxnId}
                          onChange={(e) => setEpTxnId(e.target.value)}
                          className="rounded-lg px-2.5 py-2 bg-stone-950 border border-stone-850 text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "Credit Card" && (
                  <div className="p-4 bg-stone-950 border border-stone-850 rounded-xl space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Cardholder Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Osama Afzal"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="rounded-lg px-3 py-2 bg-stone-950 border border-stone-850 text-white outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] uppercase font-bold text-stone-500">Card Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="xxxx xxxx xxxx xxxx"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="rounded-lg px-3 py-2 bg-stone-950 border border-stone-850 text-white outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-stone-500">Expiry *</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="rounded-lg px-3 py-2 bg-stone-950 border border-stone-850 text-white outline-none text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] uppercase font-bold text-stone-500">CVV *</label>
                        <input
                          type="password"
                          required
                          placeholder="***"
                          value={cardCvv}
                          onChange={handleCvvChange}
                          className="rounded-lg px-3 py-2 bg-stone-950 border border-stone-850 text-white outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 bg-stone-950 border border-stone-850 text-stone-400 rounded-xl text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Back to Address
                </button>
                <button
                  type="button"
                  onClick={validateStep2}
                  className="py-3.5 bg-[#C8A14A] hover:bg-[#b09241] text-black rounded-xl text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Review & Submit */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Order Summary Review</h3>
                <p className="text-[9px] text-stone-500">Review your final statements and confirm dispatch</p>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-900/60 max-h-[160px] overflow-y-auto pr-1 bg-stone-950 border border-stone-850 rounded-xl p-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex justify-between items-center text-[10px]">
                    <span className="truncate max-w-[180px] font-semibold text-stone-300">{item.product.name}</span>
                    <span className="text-stone-500">Qty: {item.quantity}</span>
                    <span className="font-mono font-bold text-white">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Application Box */}
              <div className="bg-black/35 border border-stone-850 p-4 rounded-xl space-y-3">
                <p className="text-[8px] uppercase tracking-wider font-bold text-stone-400">Apply Promo Code</p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#C8A96A]/10 border border-[#C8A96A]/20 p-2 rounded-lg text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#C8A96A]" />
                      <span className="font-mono text-[#C8A96A] font-bold">{appliedCoupon.code}</span>
                      <span className="text-[8px] text-stone-400">
                        ({appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% OFF` : appliedCoupon.type === "free_shipping" ? "Free Ship" : `Rs. ${appliedCoupon.value} OFF`})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow rounded-lg px-2.5 py-1.5 text-[10px] outline-none bg-stone-900 border border-stone-800 text-white focus:border-[#C8A96A] uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#C8A14A] text-black font-bold text-[9px] px-3.5 py-1.5 rounded-lg transition-all"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-[8px] text-red-400">{couponError}</p>}
              </div>

              {/* Billing Summary List */}
              <div className="space-y-3 text-xs bg-stone-950 border border-stone-850 p-4 rounded-xl">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-300">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping &amp; Handling</span>
                  <span className="font-mono text-stone-300">
                    {appliedCoupon?.type === "free_shipping" || shippingFee === 0 ? "FREE" : `Rs. ${shippingFee.toLocaleString()}`}
                  </span>
                </div>
                {upgradeGift && (
                  <div className="flex justify-between text-stone-500">
                    <span>Premium Gift Packaging</span>
                    <span className="font-mono text-stone-300">Rs. 499</span>
                  </div>
                )}
                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-mono">- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-stone-900" />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">Grand Order Total</span>
                  <span className="font-bold text-[#C8A14A] font-mono text-sm">Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3.5 bg-stone-950 border border-stone-850 text-stone-400 rounded-xl text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Back to Payment
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="py-3.5 bg-[#C8A14A] hover:bg-[#b09241] text-black font-bold rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Confirming Dispatch..." : `Place Order (Rs. ${grandTotal.toLocaleString()})`}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
