"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/shop/ProductGrid";
import { X, Filter, Grid, List, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [collection, setCollection] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [material, setMaterial] = useState("All");
  const [availability, setAvailability] = useState(false); // In stock only
  const [sort, setSort] = useState("Featured");
  
  // Mobile Filter Sheet Control
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  return (
    <>
      <Navbar />

      <main className="bg-[#0B0B0C] text-[#F8F6F2] min-h-screen relative pt-4">
        
        {/* Sticky Filters Bar */}
        <div className="sticky top-16 z-30 bg-[#0B0B0C] border-b border-stone-900/60 px-4 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setIsSheetOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-950 border border-stone-850 text-[10px] font-bold uppercase tracking-wider text-stone-300 active:scale-95 transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#C8A14A]" /> Filter
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-stone-950 border border-stone-850 rounded-xl pl-4 pr-8 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-300 outline-none cursor-pointer"
              >
                <option value="Featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="w-3 h-3 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 bg-stone-950 border border-stone-850 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            {viewMode === "grid" ? <Grid size={14} /> : <List size={14} />}
          </button>
        </div>

        {/* Catalog Items Grid */}
        <div className="px-4 py-6">
          <div className="mb-4">
            <h1 className="text-lg font-bold uppercase tracking-widest font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
              Atelier Collections
            </h1>
            {category !== "All" && (
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">
                Category: {category}
              </p>
            )}
          </div>

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

        {/* ── Slide-Up Bottom Sheet Filter Menu ─────────────────────────────── */}
        <AnimatePresence>
          {isSheetOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              
              {/* Dark backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSheetOpen(false)}
                className="absolute inset-0 bg-black"
              />

              {/* Bottom Sheet Body */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-[430px] bg-[#111111] border-t border-stone-850 rounded-t-[32px] shadow-2xl z-50 p-6 space-y-6 max-h-[85vh] overflow-y-auto"
              >
                {/* Drag Handle indicator */}
                <div className="w-12 h-1.5 bg-stone-850 rounded-full mx-auto" />

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-900">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#F8F6F2]" style={{ fontFamily: "var(--font-playfair)" }}>
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
                <div className="space-y-5 text-xs">
                  
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Select Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A14A]"
                    >
                      <option value="All">All Categories</option>
                      {dbCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Metal / Material */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Metal &amp; Material</label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A14A]"
                    >
                      <option value="All">All Materials</option>
                      <option value="Gold Plating">24K Gold Plated</option>
                      <option value="Sterling Silver 925">Sterling Silver 925</option>
                      <option value="Kundan">Traditional Kundan</option>
                      <option value="Brass">Fine Brass / Alloy</option>
                      <option value="Pearl">Natural Pearls</option>
                    </select>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Maximum Budget</label>
                      <span className="text-[#C8A14A] font-bold font-mono text-[10px]">Rs. {maxPrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={50000}
                      step={500}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#C8A14A]"
                    />
                    <div className="flex justify-between text-[8px] text-stone-500 font-bold uppercase tracking-wider">
                      <span>Rs. 1,000</span>
                      <span>Rs. 50,000+</span>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between py-2 border-t border-stone-900 pt-4">
                    <div>
                      <label htmlFor="sheet-stock" className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A] cursor-pointer">
                        In Stock Only
                      </label>
                      <p className="text-[8px] text-stone-500">Hide sold out inventory pieces</p>
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

                {/* Actions Footer */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-900 bg-[#111111]">
                  <button
                    onClick={handleClearAll}
                    className="py-3 bg-stone-950 border border-stone-850 hover:border-transparent text-stone-400 hover:text-white rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="py-3 bg-[#C8A14A] hover:bg-[#b09241] text-black rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
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