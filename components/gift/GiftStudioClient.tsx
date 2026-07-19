"use client";

import { useState } from "react";
import Image from "next/image";
import { products } from "@/constants/products";
import { useCart } from "@/providers/CartProvider";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

// ── Packaging Options ─────────────────────────────────────────────────────────
const BOXES = [
  {
    id: "classic-noir",
    name: "Classic Noir Box",
    price: 250,
    desc: "Plush velvet interior, black textured card shell, gold foil embossed emblem.",
  },
  {
    id: "royal-drawer",
    name: "Royal Drawer Box",
    price: 450,
    desc: "Pull-out drawer design with silk ribbon handle and gold calligraphy stamp.",
  },
  {
    id: "atelier-envelope",
    name: "Atelier Envelope Case",
    price: 150,
    desc: "Rigid heavy-weight textured black card envelope with golden thread seal.",
  },
];

const WRAPPINGS = [
  { id: "none", name: "No Special Wrapping", price: 0, desc: "Standard secure packaging" },
  { id: "gold-foil", name: "Gold Foil Wrap", price: 150, desc: "Metallic gold wrapping paper with custom black seals" },
  { id: "satin-silk", name: "Satin Silk Wrap", price: 200, desc: "Rich velvet wrapping tied with a premium gold satin ribbon" },
];

const ACCESSORIES = [
  { id: "roses", name: "Fresh Red Roses Bouquet", price: 600, icon: "🌹" },
  { id: "chocolates", name: "Belgian Chocolate Truffles", price: 450, icon: "🍫" },
  { id: "teddy", name: "Luxury Mini Teddy Bear", price: 800, icon: "🧸" },
  { id: "perfume", name: "Velvet Oud Pocket Perfume", price: 1200, icon: "✨" },
  { id: "candle", name: "Scented Amber Candle", price: 500, icon: "🕯️" },
];

const CARDS = [
  {
    id: "thank-you",
    title: "Thank You Note",
    tagline: "WHERE ELEGANCE MEETS AFFORDABILITY",
    quote: "Thank you for choosing Luxella Studio. Crafted with elegance, style, and passion.",
  },
  {
    id: "birthday",
    title: "Happy Birthday",
    tagline: "A TIMELESS CELEBRATION",
    quote: "Wishing you a day as brilliant and beautiful as you are. May your year sparkle with joy.",
  },
  {
    id: "anniversary",
    title: "Happy Anniversary",
    tagline: "OUR LOVE STORY",
    quote: "Celebrating another year of beautiful memories, laughter, and timeless devotion.",
  },
  {
    id: "eid",
    title: "Eid Mubarak",
    tagline: "FESTIVE BLESSINGS",
    quote: "May the blessings of this special occasion bring immense joy, peace, and prosperity to your heart.",
  },
  {
    id: "wedding",
    title: "With Love & Blessings",
    tagline: "CONGRATULATIONS ON YOUR WEDDING",
    quote: "Wishing you a lifetime of love, companionate joy, and beautiful journeys together.",
  },
];

const FONTS = [
  { id: "font-playfair", name: "Playfair Script", className: "font-serif" },
  { id: "font-poppins", name: "Modern Sans", className: "font-sans" },
];

export default function GiftStudioClient() {
  const { addToCart } = useCart();

  // State
  const [selectedJewelry, setSelectedJewelry] = useState(products[0]);
  const [selectedBox, setSelectedBox]         = useState(BOXES[0]);
  const [selectedWrap, setSelectedWrap]       = useState(WRAPPINGS[0]);
  const [selectedCard, setSelectedCard]       = useState(CARDS[0]);
  const [selectedFont, setSelectedFont]       = useState(FONTS[0]);

  // Selected Accessories
  const [addons, setAddons]                   = useState<string[]>([]);

  // Calligraphy Note / Occasions
  const [toName, setToName]                   = useState("Amna");
  const [customMsg, setCustomMsg]             = useState("");

  // Delivery & Receipt Options
  const [deliveryDate, setDeliveryDate]       = useState("");
  const [isGiftReceipt, setIsGiftReceipt]     = useState(true);

  // Toggle Accessory
  function toggleAccessory(id: string) {
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Price calculations
  const accessoriesTotal = ACCESSORIES.filter((a) => addons.includes(a.id)).reduce((sum, item) => sum + item.price, 0);
  const totalBundlePrice = selectedJewelry.price + selectedBox.price + selectedWrap.price + accessoriesTotal;

  function handleAddToBag() {
    if (!deliveryDate) {
      toast.error("Please select a preferred delivery date.", {
        style: { background: "#111111", color: "#ffffff", border: "1px solid #ef4444" },
      });
      return;
    }

    const giftBundleProduct = {
      id: selectedJewelry.id + 2000, // unique id offset
      name: `${selectedJewelry.name} (Bespoke Gift Bundle)`,
      price: totalBundlePrice,
      oldPrice: selectedJewelry.oldPrice + selectedBox.price + selectedWrap.price + accessoriesTotal,
      rating: 5,
      sale: false,
      image: selectedJewelry.image,
      category: "Bespoke Gift",
      description: `Luxury custom pack: Includes ${selectedBox.name}, ${selectedWrap.name}, and accessories (${
        addons.length > 0 ? ACCESSORIES.filter((a) => addons.includes(a.id)).map((a) => a.name).join(", ") : "None"
      }). Custom note: "${customMsg || selectedCard.quote}" for ${toName}. Delivery on: ${deliveryDate}. ${
        isGiftReceipt ? "Gift Receipt included (prices hidden)." : ""
      }`,
    };

    addToCart(giftBundleProduct);
    toast.success("Bespoke Gift Bundle added to cart!", {
      style: {
        background: "rgba(20, 20, 20, 0.95)",
        color: "#ffffff",
        border: "1px solid #C8A96A",
      },
    });
  }

  return (
    <section className="py-20 px-4 md:px-8" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* ── LEFT COLUMN: interactive controls (7 cols) ───────────────── */}
          <div className="lg:col-span-7 space-y-8">

            {/* Introduction block */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col justify-center relative overflow-hidden"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200, 169, 106, 0.15)",
                backgroundImage: "linear-gradient(to right, rgba(200, 169, 106, 0.04), transparent)",
              }}
            >
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                Studio Customization Suite
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Configure your custom gift package step-by-step. Select your jewelry piece, add premium wrapping, write your custom calligraphy greeting note, add fresh flowers or chocolates, and choose your preferred delivery settings.
              </p>
            </div>

            {/* STEP 1: Select Jewelry */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#C8A96A] to-[#8B6914]">
                  1
                </span>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                  Select Jewelry Piece
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.map((item) => {
                  const active = selectedJewelry.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedJewelry(item)}
                      className={[
                        "text-left rounded-2xl overflow-hidden border p-2 transition-all duration-300 cursor-pointer",
                        active ? "shadow-lg scale-102" : "border-gray-800 hover:border-[#C8A96A]/40",
                      ].join(" ")}
                      style={active
                        ? { background: "rgba(200, 169, 106, 0.08)", borderColor: "#C8A96A" }
                        : { background: "rgba(255,255,255,0.02)" }
                      }
                    >
                      <div className="aspect-square relative rounded-xl overflow-hidden bg-black/40 mb-3">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </p>
                      <p className="text-[11px] font-semibold mt-1" style={{ color: "#C8A96A" }}>
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Choose Premium Gift Box */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#C8A96A] to-[#8B6914]">
                  2
                </span>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                  Choose Luxury Gift Box
                </h2>
              </div>

              <div className="space-y-4">
                {BOXES.map((box) => {
                  const active = selectedBox.id === box.id;
                  return (
                    <button
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      className={[
                        "w-full text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex justify-between items-center gap-4",
                        active ? "shadow-md scale-[1.01]" : "border-gray-800 hover:border-[#C8A96A]/40",
                      ].join(" ")}
                      style={active
                        ? { background: "rgba(200, 169, 106, 0.08)", borderColor: "#C8A96A" }
                        : { background: "rgba(255,255,255,0.02)" }
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: active ? "rgba(200, 169, 106, 0.2)" : "rgba(255,255,255,0.05)",
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{box.name}</p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{box.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C8A96A] whitespace-nowrap">
                        + Rs. {box.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Choose Premium Gift Wrapping */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#C8A96A] to-[#8B6914]">
                  3
                </span>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                  Premium Gift Wrapping
                </h2>
              </div>

              <div className="space-y-4">
                {WRAPPINGS.map((wrap) => {
                  const active = selectedWrap.id === wrap.id;
                  return (
                    <button
                      key={wrap.id}
                      onClick={() => setSelectedWrap(wrap)}
                      className={[
                        "w-full text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex justify-between items-center gap-4",
                        active ? "shadow-md scale-[1.01]" : "border-gray-800 hover:border-[#C8A96A]/40",
                      ].join(" ")}
                      style={active
                        ? { background: "rgba(200, 169, 106, 0.08)", borderColor: "#C8A96A" }
                        : { background: "rgba(255,255,255,0.02)" }
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: active ? "rgba(200, 169, 106, 0.2)" : "rgba(255,255,255,0.05)",
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#C8A96A]">
                            <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M12 7V3" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{wrap.name}</p>
                          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{wrap.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C8A96A] whitespace-nowrap">
                        {wrap.price > 0 ? `+ Rs. ${wrap.price}` : "Free"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Choose Occasion Card & Note */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#C8A96A] to-[#8B6914]">
                  4
                </span>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                  Personalized Greeting Card
                </h2>
              </div>

              {/* Occasion tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {CARDS.map((card) => {
                  const active = selectedCard.id === card.id;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      className={[
                        "rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer",
                        active ? "text-white border-transparent" : "border-gray-800",
                      ].join(" ")}
                      style={active
                        ? { background: "linear-gradient(135deg, #C8A96A, #8B6914)" }
                        : { background: "rgba(255, 255, 255, 0.03)", color: "var(--text-secondary)" }
                      }
                    >
                      {card.title}
                    </button>
                  );
                })}
              </div>

              {/* Note Details */}
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-gray-400">
                      To (Recipient Name)
                    </label>
                    <input
                      type="text"
                      value={toName}
                      onChange={(e) => setToName(e.target.value)}
                      placeholder="e.g. Ayesha"
                      className="w-full px-4 py-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-[#C8A96A]/20"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(200, 169, 106, 0.15)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-gray-400">
                      Calligraphy Font
                    </label>
                    <select
                      value={selectedFont.id}
                      onChange={(e) => setSelectedFont(FONTS.find((f) => f.id === e.target.value) || FONTS[0])}
                      className="w-full px-4 py-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-[#C8A96A]/20"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(200, 169, 106, 0.15)" }}
                    >
                      {FONTS.map((font) => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-gray-400">
                    Handwritten Custom Message Note
                  </label>
                  <textarea
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    placeholder="Write a custom note to print on the card... (Or leave blank to use our template quote)"
                    rows={3}
                    maxLength={140}
                    className="w-full px-4 py-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-[#C8A96A]/20 resize-none"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(200, 169, 106, 0.15)" }}
                  />
                </div>
              </div>
            </div>

            {/* STEP 5: Add-on Gift Accessories */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#C8A96A] to-[#8B6914]">
                  5
                </span>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                  Gift Accessories (Add-Ons)
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {ACCESSORIES.map((item) => {
                  const active = addons.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleAccessory(item.id)}
                      className={[
                        "text-left rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex justify-between items-center",
                        active ? "border-[#C8A96A]" : "border-gray-800 hover:border-[#C8A96A]/40",
                      ].join(" ")}
                      style={active
                        ? { background: "rgba(200, 169, 106, 0.06)" }
                        : { background: "rgba(255,255,255,0.02)" }
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Rs. {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div
                        className="w-5 h-5 rounded-md border flex items-center justify-center transition-all"
                        style={{
                          borderColor: active ? "#C8A96A" : "rgba(255,255,255,0.2)",
                          background: active ? "linear-gradient(135deg, #C8A96A, #8B6914)" : "transparent",
                        }}
                      >
                        {active && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 6: Delivery Settings */}
            <div
              className="rounded-3xl p-6 sm:p-8 border shadow-xl"
              style={{ background: "var(--bg-elevated)", borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#C8A96A] to-[#8B6914]">
                  6
                </span>
                <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                  Delivery Settings & Options
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2 text-gray-400">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // starts from tomorrow
                    className="w-full px-4 py-3 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-[#C8A96A]/20"
                    style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(200, 169, 106, 0.15)" }}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <button
                    type="button"
                    onClick={() => setIsGiftReceipt(!isGiftReceipt)}
                    className="flex items-center gap-3 text-left cursor-pointer group"
                  >
                    <div
                      className="w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0"
                      style={{
                        borderColor: isGiftReceipt ? "#C8A96A" : "rgba(255, 255, 255, 0.2)",
                        background: isGiftReceipt ? "linear-gradient(135deg, #C8A96A, #8B6914)" : "transparent",
                      }}
                    >
                      {isGiftReceipt && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white group-hover:text-[#C8A96A]">Include Gift Receipt</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Hides prices on physical delivery invoice</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: Interactive live card preview (5 cols) ───────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">

            {/* PREVIEW CONTAINER */}
            <div
              className="rounded-[2.5rem] p-8 border shadow-2xl flex flex-col justify-between"
              style={{
                background: "var(--bg-elevated)",
                borderColor: "rgba(200, 169, 106, 0.15)",
                backgroundImage: "linear-gradient(to bottom, rgba(200, 169, 106, 0.03) 0%, transparent 100%)",
              }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-[#C8A96A] mb-5">
                  Live Greeting Card Preview
                </p>

                {/* The Custom Gift Card Mockup */}
                <div
                  className="aspect-[1.58/1] rounded-2xl p-6 shadow-2xl border relative flex flex-col justify-between overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #121212 0%, #070707 100%)",
                    borderColor: "rgba(200, 169, 106, 0.25)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.9)",
                  }}
                >
                  <div className="absolute top-2 right-2 opacity-20 text-[#C8A96A] text-xs">✦</div>
                  <div className="absolute bottom-2 left-2 opacity-20 text-[#C8A96A] text-xs">✦</div>

                  <div className="text-center">
                    <h4
                      className="text-base font-bold tracking-[0.2em] text-[#C8A96A] uppercase"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {selectedCard.title}
                    </h4>
                    <p className="text-[7px] tracking-[0.3em] font-semibold text-gray-500 mt-1 uppercase">
                      {selectedCard.tagline}
                    </p>
                  </div>

                  <div className="text-center px-4 my-2 flex-grow flex items-center justify-center">
                    <p
                      className={[
                        "text-xs leading-relaxed text-gray-300 italic",
                        selectedFont.className,
                      ].join(" ")}
                    >
                      &ldquo;{customMsg ? customMsg : selectedCard.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-1 border-t border-gray-800/60 pt-3">
                    <p className="text-[7px] tracking-[0.2em] font-semibold text-gray-500 uppercase">
                      Exclusively Handcrafted For
                    </p>
                    <p
                      className={[
                        "text-xs font-bold text-[#C8A96A]",
                        selectedFont.className,
                      ].join(" ")}
                    >
                      {toName ? toName : "Valued Guest"}
                    </p>
                  </div>
                </div>

                {/* Detailed pricing breakdown */}
                <div className="mt-8 space-y-3.5 border-t border-gray-800 pt-6 text-sm">
                  <h4 className="text-xs uppercase tracking-widest text-[#C8A96A] font-semibold mb-4">
                    Bespoke Order Summary
                  </h4>

                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>Jewelry Piece</span>
                    <span className="font-semibold text-white">{selectedJewelry.name} (Rs. {selectedJewelry.price.toLocaleString()})</span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>Luxury Gift Box</span>
                    <span className="font-semibold text-white">{selectedBox.name} (Rs. {selectedBox.price})</span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-secondary)" }}>Gift Wrapping</span>
                    <span className="font-semibold text-white">
                      {selectedWrap.price > 0 ? `${selectedWrap.name} (+ Rs. ${selectedWrap.price})` : "Free"}
                    </span>
                  </div>

                  {addons.length > 0 && (
                    <div className="space-y-2 border-t border-gray-800/40 pt-2.5">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Accessories Added:</p>
                      {ACCESSORIES.filter((a) => addons.includes(a.id)).map((item) => (
                        <div key={item.id} className="flex justify-between pl-2 text-xs">
                          <span style={{ color: "var(--text-secondary)" }}>{item.icon} {item.name}</span>
                          <span className="text-gray-400 font-medium">Rs. {item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between border-t border-gray-800/40 pt-2.5">
                    <span style={{ color: "var(--text-secondary)" }}>Delivery Note</span>
                    <span className="font-semibold text-white text-xs">{deliveryDate ? deliveryDate : "Not Set"}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-800/40 pt-2.5">
                    <span style={{ color: "var(--text-secondary)" }}>Receipt Pricing</span>
                    <span className="font-semibold text-white text-xs">{isGiftReceipt ? "Hidden (Gift Receipt)" : "Visible"}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-800 pt-4 text-base font-bold">
                    <span className="text-white">Total Gift Pack</span>
                    <span className="text-[#C8A96A]">Rs. {totalBundlePrice.toLocaleString()}</span>
                  </div>
                </div>

              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToBag}
                className="w-full text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mt-8 cursor-pointer hover:scale-[1.01] hover:shadow-2xl active:scale-100"
                style={{
                  background: "linear-gradient(135deg, #C8A96A, #8B6914)",
                  boxShadow: "0 10px 30px rgba(200, 169, 106, 0.25)",
                }}
              >
                Secure Gift Bundle Purchase
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
