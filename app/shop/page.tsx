"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopHero from "@/components/shop/ShopHero";
import SearchBar from "@/components/shop/SearchBar";
import FilterBar from "@/components/shop/FilterBar";
import ProductGrid from "@/components/shop/ProductGrid";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, X, Gem, Compass, Gift, Watch, ChevronRight, Award, Trash2 } from "lucide-react";

// Curated Collection Data with High-Quality Luxury Lifestyle Images
const collectionsList = [
  {
    name: "New Arrivals",
    desc: "The latest handcrafted precious designs.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Best Sellers",
    desc: "Most loved pieces selected by our clients.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Bridal Collection",
    desc: "Majestic Kundan and pearl jewelry for weddings.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Luxury Collection",
    desc: "Exquisite 24K gold plated & diamond zirconia.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Personalized Jewelry",
    desc: "Custom engraved initials and name pendants.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Gift Collection",
    desc: "Velvet wrapped treasures for your loved ones.",
    image: "https://images.unsplash.com/photo-1549439602-43ebcb2328aa?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Limited Edition",
    desc: "Rare releases with limited stock allocations.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80"
  },
  {
    name: "Sale Collection",
    desc: "Exclusive seasonal offers on selected jewels.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80"
  }
];

// Curated Category Details
const categoryCards = [
  { name: "Necklaces", image: "/images/categories/necklace.jpg", icon: <Compass size={14} /> },
  { name: "Earrings", image: "/images/categories/earrings.jpg", icon: <Sparkles size={14} /> },
  { name: "Rings", image: "/images/categories/rings.jpg", icon: <Gem size={14} /> },
  { name: "Bracelets", image: "/images/categories/bracelet.jpg", icon: <Award size={14} /> },
  { name: "Bangles", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&auto=format&fit=crop&q=80", icon: <Sparkles size={14} /> },
  { name: "Anklets", image: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=400&auto=format&fit=crop&q=80", icon: <Gem size={14} /> },
  { name: "Watches", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&auto=format&fit=crop&q=80", icon: <Watch size={14} /> },
  { name: "Jewelry Sets", image: "/images/categories/bridal.jpg", icon: <Gift size={14} /> }
];

const trendingSearches = [
  "Gold Rings",
  "Pearl Necklace",
  "Bridal Set",
  "Luxury Bracelet",
  "Minimal Earrings",
  "Gift Set"
];

// Helper to clean display labels
const formatFilterKey = (key: string) => {
  switch (key) {
    case "maxPrice": return "Max Price";
    case "availability": return "Stock";
    default: return key.charAt(0).toUpperCase() + key.slice(1);
  }
};

export default function ShopPage() {
  // Main Search
  const [search, setSearch] = useState("");

  // Filters State Machine
  const [category, setCategory] = useState("All");
  const [collection, setCollection] = useState("All");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [material, setMaterial] = useState("All");
  const [stone, setStone] = useState("All");
  const [color, setColor] = useState("All");
  const [availability, setAvailability] = useState(false); // In Stock Only
  const [rating, setRating] = useState(0);
  const [occasion, setOccasion] = useState("All");
  const [style, setStyle] = useState("All");
  const [sort, setSort] = useState("Featured");

  // Drawer Controls
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Db Categories list (for select lists)
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

  // Compute Active Filters tag list
  const activeFilters = [];
  if (category !== "All") activeFilters.push({ key: "category", label: "Category", displayValue: category });
  if (collection !== "All") activeFilters.push({ key: "collection", label: "Collection", displayValue: collection });
  if (maxPrice < 50000) activeFilters.push({ key: "maxPrice", label: "Price", displayValue: `Under Rs. ${maxPrice.toLocaleString()}` });
  if (material !== "All") activeFilters.push({ key: "material", label: "Material", displayValue: material });
  if (stone !== "All") activeFilters.push({ key: "stone", label: "Stone", displayValue: stone });
  if (color !== "All") activeFilters.push({ key: "color", label: "Color", displayValue: color });
  if (availability) activeFilters.push({ key: "availability", label: "Stock", displayValue: "In Stock Only" });
  if (rating > 0) activeFilters.push({ key: "rating", label: "Rating", displayValue: `${rating}+ Stars` });
  if (occasion !== "All") activeFilters.push({ key: "occasion", label: "Occasion", displayValue: occasion });
  if (style !== "All") activeFilters.push({ key: "style", label: "Style", displayValue: style });

  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case "category": setCategory("All"); break;
      case "collection": setCollection("All"); break;
      case "maxPrice": setMaxPrice(50000); break;
      case "material": setMaterial("All"); break;
      case "stone": setStone("All"); break;
      case "color": setColor("All"); break;
      case "availability": setAvailability(false); break;
      case "rating": setRating(0); break;
      case "occasion": setOccasion("All"); break;
      case "style": setStyle("All"); break;
    }
  };

  const handleClearAll = () => {
    setCategory("All");
    setCollection("All");
    setMaxPrice(50000);
    setMaterial("All");
    setStone("All");
    setColor("All");
    setAvailability(false);
    setRating(0);
    setOccasion("All");
    setStyle("All");
  };

  return (
    <>
      <Navbar />
      <ShopHero />

      <main style={{ background: "var(--bg-base)" }} className="py-12 md:py-16 text-white min-h-screen relative">
        <div className="mx-auto max-w-7xl px-6 space-y-16">

          {/* Search bar & Trending tags */}
          <div className="max-w-2xl mx-auto space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Trending:</span>
              {trendingSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="px-3.5 py-1.5 rounded-full border border-white/5 hover:border-[#C8A96A] text-gray-400 hover:text-white transition duration-300 text-[10px] uppercase tracking-wider bg-white/[0.02] cursor-pointer"
                >
                  {tag}
                </button>
              ))}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  Clear <X size={10} />
                </button>
              )}
            </div>
          </div>

          {/* SECTION 1: Discover Collections */}
          <section className="space-y-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-2" style={{ color: "#C8A96A" }}>
                ✦ Luxury Atelier
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-wider font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                Discover Collections
              </h2>
              <div className="h-px bg-gradient-to-r from-[#C8A96A]/40 to-transparent w-48 mt-2 mx-auto md:mx-0" />
            </div>

            {/* Grid on Desktop, Horizontal swipe list on Mobile */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 scrollbar-hide snap-x scroll-smooth">
              {collectionsList.map((col) => {
                const isActive = collection === col.name;
                return (
                  <div
                    key={col.name}
                    onClick={() => {
                      setCollection(col.name);
                      window.scrollTo({ top: 1200, behavior: "smooth" });
                    }}
                    className={[
                      "snap-center flex-shrink-0 w-[80vw] sm:w-[50vw] md:w-auto group relative aspect-[4/5] rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer",
                      isActive ? "border-[#C8A96A] shadow-[0_0_25px_rgba(200,169,106,0.25)]" : "border-white/5"
                    ].join(" ")}
                  >
                    {/* Image Zoom */}
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Luxury dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    {/* Hover gold shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C8A96A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute inset-x-0 bottom-0 p-6 space-y-2 flex flex-col justify-end">
                      <h3 className="text-lg font-bold text-white tracking-wide font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                        {col.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                        {col.desc}
                      </p>
                      <span className="text-[10px] font-bold text-[#C8A96A] tracking-widest uppercase pt-2 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Collection <ChevronRight size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: Shop By Jewelry */}
          <section className="space-y-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase tracking-[0.5em] font-semibold mb-2" style={{ color: "#C8A96A" }}>
                ✦ Browse Category
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-wider font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                Shop by Jewelry
              </h2>
              <div className="h-px bg-gradient-to-r from-[#C8A96A]/40 to-transparent w-48 mt-2 mx-auto md:mx-0" />
            </div>

            {/* Horizontal slider on Mobile, 4 columns on Desktop */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 scrollbar-hide snap-x">
              {categoryCards.map((cat) => {
                const isActive = category.toLowerCase() === cat.name.toLowerCase();
                return (
                  <div
                    key={cat.name}
                    onClick={() => {
                      setCategory(cat.name);
                      window.scrollTo({ top: 1200, behavior: "smooth" });
                    }}
                    className={[
                      "snap-center flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-auto bg-[#121212] p-5 rounded-3xl border transition-all duration-300 flex items-center gap-4 group cursor-pointer",
                      isActive
                        ? "border-[#C8A96A] shadow-[0_0_20px_rgba(200,169,106,0.15)]"
                        : "border-white/5 hover:border-[#C8A96A]/40"
                    ].join(" ")}
                  >
                    {/* Circle Image with Zoom & Gold Glow */}
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 group-hover:border-[#C8A96A]/50 transition-all duration-300 relative flex-shrink-0">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Category Details */}
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-1.5 text-[#C8A96A] mb-1">
                        {cat.icon}
                        <span className="text-[8px] font-bold uppercase tracking-widest">Atelier</span>
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-wide truncate group-hover:text-[#C8A96A] transition-colors font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                        {cat.name}
                      </h4>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-[#C8A96A] group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Filtering Bar */}
          <FilterBar
            activeFilters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            sort={sort}
            setSort={setSort}
          />

          {/* Dynamic Grid */}
          <ProductGrid
            search={search}
            category={category}
            collection={collection}
            maxPrice={maxPrice}
            material={material}
            stone={stone}
            color={color}
            availability={availability}
            rating={rating}
            occasion={occasion}
            style={style}
            sort={sort}
          />
        </div>

        {/* ── Slide-Out Filter Drawer Modal ─────────────────────────────── */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop overlay */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            />

            {/* Drawer Body */}
            <div className="relative w-full max-w-md bg-[#121212] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-50 text-xs">
              
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-bold text-white font-serif" style={{ fontFamily: "var(--font-playfair)" }}>
                    Filter & Refine
                  </h3>
                  <p className="text-[10px] text-gray-500">Tailor your jewelry selections</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Filters list */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-hide">
                
                {/* 1. Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {dbCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* 2. Collection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Collection</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    <option value="All">All Collections</option>
                    {collectionsList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                {/* 3. Price slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Max Price</label>
                    <span className="text-white font-bold">Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={50000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#C8A96A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 font-semibold uppercase tracking-wider">
                    <span>Rs. 1,000</span>
                    <span>Rs. 50,000+</span>
                  </div>
                </div>

                {/* 4. Material */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Material</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    <option value="All">All Materials</option>
                    <option value="Gold Plating">Gold Plating</option>
                    <option value="Sterling Silver 925">Sterling Silver 925</option>
                    <option value="Kundan">Kundan Work</option>
                    <option value="Brass">Brass / Alloy</option>
                    <option value="Pearl">Freshwater Pearl</option>
                  </select>
                </div>

                {/* 5. Stone type */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Stone</label>
                  <select
                    value={stone}
                    onChange={(e) => setStone(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    <option value="All">All Stones</option>
                    <option value="Zirconia">Cubic Zirconia</option>
                    <option value="Emerald">Emerald</option>
                    <option value="Ruby">Ruby</option>
                    <option value="Sapphire">Sapphire</option>
                    <option value="Pearl">Pearl</option>
                    <option value="None">No Stone</option>
                  </select>
                </div>

                {/* 6. Color plating */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Color Plating</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    <option value="All">All Finishes</option>
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold / Silver</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Emerald Green">Emerald Green</option>
                  </select>
                </div>

                {/* 7. Rating */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]">Minimum Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-[#C8A96A] cursor-pointer"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={5}>★★★★★ (5 Stars Only)</option>
                    <option value={4}>★★★★☆ (4+ Stars)</option>
                    <option value={3}>★★★☆☆ (3+ Stars)</option>
                  </select>
                </div>

                {/* 8. Availability switch */}
                <div className="flex items-center justify-between py-2 border-t border-white/5 pt-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A] cursor-pointer" htmlFor="stock-switch">
                      In Stock Only
                    </label>
                    <p className="text-[9px] text-gray-500">Hide sold out jewelry items</p>
                  </div>
                  <input
                    id="stock-switch"
                    type="checkbox"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className="w-4 h-4 accent-[#C8A96A] cursor-pointer"
                  />
                </div>
              </div>

              {/* Bottom Actions footer */}
              <div className="p-6 border-t border-white/5 bg-[#0A0A0A] flex gap-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer text-[10px]"
                >
                  <Trash2 size={12} /> Reset
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-[#111] uppercase tracking-widest flex items-center justify-center cursor-pointer text-[10px]"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  Apply Filters
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}