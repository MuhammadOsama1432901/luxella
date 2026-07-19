"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/providers/CartProvider";
import { CreditCard, Truck, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, shippingFee, clearCart } = useCart();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(PAK_CITIES[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-[#F8F5F2]/20">
        <Loader2 className="animate-spin h-12 w-12 text-black" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0) {
    router.replace("/shop");
    return null;
  }

  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Basic phone validation (e.g. 03xx xxxxxxx or +92xxx xxxxxxx)
    const cleanPhone = phone.replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone/WhatsApp number.");
      return;
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
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal: cartTotal,
        shipping: shippingFee,
        total: grandTotal,
        paymentMethod,
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
      
      // Clear client cart
      clearCart();
      
      // Redirect to success page, passing details in query params
      const queryParams = new URLSearchParams({
        orderId: order.id,
        name: order.customer.name,
        phone: order.customer.phone,
        total: order.total.toString(),
        address: `${order.customer.address}, ${order.customer.city}`,
        payment: order.paymentMethod,
      });

      // We will also pass items information for formatting the WhatsApp message
      const itemsParam = order.items.map((i: any) => `${i.name} x${i.quantity} (Rs. ${i.price})`).join("\n");
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

      <main className="min-h-screen bg-[#F8F5F2]/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Column: Form Details (3/5 width) */}
            <div className="lg:col-span-3 bg-white border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-bold mb-8 text-gray-900 border-b border-gray-100 pb-4">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C8A96A] focus:outline-none transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                      WhatsApp Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 03001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C8A96A] focus:outline-none transition"
                    />
                    <span className="text-[10px] text-gray-400">
                      Used for order updates and tracking via WhatsApp.
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C8A96A] focus:outline-none transition"
                  />
                </div>

                {/* Street Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="House number, Street name, Apartment, Area..."
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C8A96A] focus:outline-none transition resize-none"
                  />
                </div>

                {/* City Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#C8A96A] focus:outline-none transition bg-white"
                  >
                    {PAK_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Methods */}
                <div className="pt-6">
                  <label className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-4 block">
                    Payment Method
                  </label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* COD */}
                    <label
                      className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "Cash on Delivery"
                          ? "border-[#C8A96A] bg-[#F8F5F2]/20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={() => setPaymentMethod("Cash on Delivery")}
                        className="sr-only"
                      />
                      <div className={`p-2.5 rounded-lg border ${paymentMethod === "Cash on Delivery" ? "bg-[#C8A96A] text-white border-[#C8A96A]" : "text-gray-400 border-gray-100"}`}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-400">Pay when jewelry arrives</p>
                      </div>
                    </label>

                    {/* Bank Transfer */}
                    <label
                      className={`flex items-center gap-4 border p-4 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "Bank Transfer"
                          ? "border-[#C8A96A] bg-[#F8F5F2]/20"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "Bank Transfer"}
                        onChange={() => setPaymentMethod("Bank Transfer")}
                        className="sr-only"
                      />
                      <div className={`p-2.5 rounded-lg border ${paymentMethod === "Bank Transfer" ? "bg-[#C8A96A] text-white border-[#C8A96A]" : "text-gray-400 border-gray-100"}`}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">Bank Transfer</p>
                        <p className="text-xs text-gray-400">Direct online payment</p>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === "Bank Transfer" && (
                    <div className="mt-4 bg-[#F8F5F2] border border-[#C8A96A]/20 p-4 rounded-xl text-xs text-gray-600 space-y-1.5 leading-relaxed">
                      <p className="font-bold text-gray-800">Direct Bank Transfer Details:</p>
                      <p>Bank Name: Bank Alfalah</p>
                      <p>Account Title: Luxella Jewelry</p>
                      <p>Account Number: 0192-100582049</p>
                      <p>IBAN: PK15ALFA0192100582049</p>
                      <p className="italic text-gray-500 mt-1">
                        * Please send a screenshot of the receipt on WhatsApp to confirm bank transfers.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-black/90 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      Processing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Order Summary (2/5 width) */}
            <div className="lg:col-span-2 bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm lg:sticky lg:top-28">
              <h3 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">
                Order Review
              </h3>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto pr-2 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F8F5F2] border border-gray-50 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-sm text-gray-800 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal & Delivery Costs */}
              <div className="space-y-3.5 text-xs border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-semibold">Rs. {cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping & Handling</span>
                  <span className="text-gray-900 font-semibold">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-bold uppercase tracking-wider text-[10px] bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3.5 flex justify-between text-sm font-bold text-gray-900">
                  <span>Order Total</span>
                  <span className="text-[#C8A96A] text-base">Rs. {grandTotal.toLocaleString()}</span>
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
