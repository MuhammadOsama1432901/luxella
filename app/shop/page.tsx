"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import { X, Filter, ChevronDown, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("All");
  const [collection, setCollection]   = useState("All");
  const [maxPrice, setMaxPrice]       = useState(50000);
  const [material, setMaterial]       = useState("All");
  const [availability, setAvailability] = useState(false);
  const [sort, setSort]               = useState("Featured");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  useEffect(() => {
    async function getCats() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setDbCategories(data.map((c: any) => c.name));
        }
      } catch (err) {
        console.error(err);
      }
    }
    getCats();
  }, []);

  const handleClearAll = () => {
    setCategory("All");
    setCollection("All");
    setMaxPrice(50000);
    setMaterial("All");
    setAvailability(false);
    setSort("Featured");
  };

  const activeFiltersCount = [
    category !== "All",
    material !== "All",
    maxPrice < 50000,
    availability,
  ].filter(Boolean).length;

  return (
    <>
      <Navbar />

      <main className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="border-b border-stone-900/60 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#C8A14A] mb-2">
              ✦ Luxella Atelier
            </p>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Shop Catalogue
            </h1>
            {category !== "All" && (
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-widest mt-1">
                Category: {category}
              </p>
            )}
          </div>
        </div>

        {/* ── Sticky Filters Bar ────────────────────────────────────── */}
        <div
          className="sticky top-16 z-30 border-b border-stone-900/60"
          style={{ background: "rgba(11,11,12,0.95)", backdropFilter: "blur(12px)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Filter button */}
              <button
                onClick={() => setIsSheetOpen(true)}
                className="relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-300 hover:border-[#C8A14A] hover:text-white active:scale-95 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A14A]" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-[#C8A14A] text-black text-[8px] font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-stone-950 border border-stone-800 rounded-xl pl-3 sm:pl-4 pr-8 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-300 outline-none cursor-pointer hover:border-[#C8A14A] transition-colors"
                >
                  <option value="Featured">Featured</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="Newest">Newest</option>
                </select>
                <ChevronDown className="w-3 h-3 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Active filters summary pill */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#C8A14A]/10 border border-[#C8A14A]/30 text-[10px] font-bold text-[#C8A14A] hover:bg-[#C8A14A]/20 transition-all cursor-pointer"
                >
                  <X size={11} /> Clear All
                </button>
              )}
            </div>

            {/* Category quick pills — desktop only */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {["All", ...dbCategories].slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    category === cat
                      ? "bg-[#C8A14A] text-black"
                      : "bg-stone-950 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Grid ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ProductGrid
            search={search}
            category={category}
            collection={collection}
            maxPrice={maxPrice}
            material={material}
            stone="All"
            color="All"
            availability={availability}
            rating={0}
            occasion="All"
            style="All"
            sort={sort}
          />
        </div>

        {/* ── Filter Sheet / Sidebar ─────────────────────────────────── */}
        <AnimatePresence>
          {isSheetOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSheetOpen(false)}
                className="absolute inset-0 bg-black"
              />

              {/* Panel */}
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className="relative w-full sm:w-[420px] sm:max-h-[80vh] rounded-t-[28px] sm:rounded-[24px] shadow-2xl z-50 flex flex-col overflow-hidden"
                style={{ background: "var(--bg-elevated)", border: "1px solid rgba(200,169,106,0.12)" }}
              >
                {/* Handle */}
                <div className="w-10 h-1.5 bg-stone-700 rounded-full mx-auto mt-4 sm:hidden flex-shrink-0" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 flex-shrink-0">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>
                      Refine Collection
                    </h3>
                    <p className="text-[9px] text-stone-500 font-bold">LUXURY ATELIER FILTERS</p>
                  </div>
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Filters Content */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 text-xs">

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["All", ...dbCategories].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                            category === cat
                              ? "bg-[#C8A14A] text-black border-[#C8A14A]"
                              : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-600 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Material */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Metal & Material</label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-stone-200 outline-none focus:border-[#C8A14A] text-xs"
                    >
                      <option value="All">All Materials</option>
                      <option value="Gold Plating">24K Gold Plated</option>
                      <option value="Sterling Silver 925">Sterling Silver 925</option>
                      <option value="Kundan">Traditional Kundan</option>
                      <option value="Brass">Fine Brass / Alloy</option>
                      <option value="Pearl">Natural Pearls</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Max Budget</label>
                      <span className="text-[#C8A14A] font-bold font-mono text-[10px]">Rs. {maxPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min={1000} max={50000} step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#C8A14A]"
                    />
                    <div className="flex justify-between text-[8px] text-stone-600 font-bold uppercase tracking-wider">
                      <span>Rs. 1,000</span>
                      <span>Rs. 50,000+</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between py-3 border-t border-stone-800">
                    <div>
                      <label htmlFor="sheet-stock" className="text-[10px] font-bold uppercase tracking-widest text-[#C8A14A] cursor-pointer block">
                        In Stock Only
                      </label>
                      <p className="text-[9px] text-stone-500 mt-0.5">Hide sold out items</p>
                    </div>
                    <input
                      id="sheet-stock"
                      type="checkbox"
                      checked={availability}
                      onChange={(e) => setAvailability(e.target.checked)}
                      className="w-4 h-4 accent-[#C8A14A] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="grid grid-cols-2 gap-3 px-6 py-4 border-t border-stone-800 flex-shrink-0">
                  <button
                    onClick={handleClearAll}
                    className="py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-stone-700 text-stone-400 hover:text-white hover:border-stone-500 transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider text-black transition-all cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                  >
                    Show Results
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}