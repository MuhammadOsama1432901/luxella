"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/providers/CartProvider";
import { Star, ShoppingBag, ArrowLeft, Heart, Sparkles, Gift, ChevronDown, Truck, Shield, RotateCcw } from "lucide-react";
import { DBProduct } from "@/lib/db";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [selectedColor, setSelectedColor] = useState("Gold Finish");
  const [selectedSize, setSelectedSize] = useState("Standard");
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
      return wishlist.includes(Number(id));
    } catch { return false; }
  });
  const [relatedProducts, setRelatedProducts] = useState<DBProduct[]>([]);

  useEffect(() => {
    async function fetchProductData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        if (data.category) {
          const relatedRes = await fetch(`/api/products?category=${data.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedProducts(relatedData.filter((p: DBProduct) => p.id !== data.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to bag! ✨`);
  };

  const handleWishlist = () => {
    const newWish = !isWishlisted;
    setIsWishlisted(newWish);
    if (product) {
      try {
        const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
        const updated = newWish ? [...wishlist, product.id] : wishlist.filter((wid) => wid !== product.id);
        localStorage.setItem("luxella_wishlist", JSON.stringify(updated));
      } catch { /* ignore */ }
    }
    toast.success(newWish ? "Added to wishlist! 💎" : "Removed from wishlist!");
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3" style={{ background: "var(--bg-base)" }}>
          <div className="w-8 h-8 border-2 border-[#C8A14A] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Curating jewelry details...</p>
        </div>
      </>
    );
  }

  // ── Not Found ─────────────────────────────────────────────────
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4" style={{ background: "var(--bg-base)" }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>Product Not Found</h2>
          <p className="text-xs text-stone-500 max-w-xs">This piece does not exist in our catalog.</p>
          <Link href="/shop" className="bg-[#C8A14A] text-black text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-full">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const savings = product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;
  const savingsPct = savings > 0 ? Math.round((savings / product.oldPrice!) * 100) : 0;

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-24 md:pb-12" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-[10px] text-stone-500 font-bold uppercase tracking-wider border-b border-stone-900/50">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 hover:text-[#C8A14A] transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C8A14A] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-stone-400">{product.category}</span>
        </div>

        {/* ── Main Product Layout ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-14 xl:gap-20">

            {/* ── LEFT: Image Gallery ─────────────────────────────── */}
            <div className="space-y-3 mb-8 lg:mb-0">
              {/* Main image */}
              <div className="relative aspect-square bg-stone-950 rounded-2xl overflow-hidden border border-stone-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={productImages[activeImageIndex]}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.sale && savingsPct > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-black bg-[#C8A14A]">
                      {savingsPct}% OFF
                    </span>
                  )}
                  {product.virtualTryOn && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#C8A14A] bg-[#C8A14A]/10 border border-[#C8A14A]/20 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Try-On
                    </span>
                  )}
                </div>

                {/* Wishlist floating */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border border-stone-700 bg-black/60 backdrop-blur-sm hover:border-[#C8A14A] transition-all cursor-pointer"
                >
                  <Heart size={15} fill={isWishlisted ? "#C8A14A" : "transparent"} className={isWishlisted ? "text-[#C8A14A]" : "text-stone-400"} />
                </button>

                {/* Image counter */}
                {productImages.length > 1 && (
                  <span className="absolute bottom-3 right-3 bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold font-mono text-stone-300">
                    {activeImageIndex + 1} / {productImages.length}
                  </span>
                )}
              </div>

              {/* Thumbnail row */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex ? "border-[#C8A14A]" : "border-stone-800 hover:border-stone-600"
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Details ──────────────────────────── */}
            <div className="space-y-6">
              {/* Title & category */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#C8A14A]">✦ {product.category}</span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill={i < product.rating ? "#C8A14A" : "transparent"} className="text-[#C8A14A]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold">({product.rating}.0) · {product.stock} in stock</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-stone-900/60">
                <span className="text-3xl font-bold text-[#C8A14A] font-mono">Rs. {product.price.toLocaleString()}</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <>
                    <span className="text-sm line-through text-stone-500 font-mono">Rs. {product.oldPrice.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-400">Save Rs. {savings.toLocaleString()}</span>
                  </>
                )}
              </div>

              {/* Color Finish */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">
                  Color Finish: <span className="text-stone-300">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Gold Finish", "Silver Finish", "Rose Gold"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedColor === color
                          ? "border-[#C8A14A] bg-[#C8A14A]/10 text-[#C8A14A]"
                          : "border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">
                  Size: <span className="text-stone-300">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Standard", "Size 6", "Size 7", "Size 8"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-20 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-[#C8A14A] bg-[#C8A14A]/10 text-[#C8A14A]"
                          : "border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to Bag */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-stone-400 hover:text-white font-bold text-lg cursor-pointer hover:bg-stone-800 transition-colors">−</button>
                  <span className="px-4 font-mono text-sm text-white font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-3 text-stone-400 hover:text-white font-bold text-lg cursor-pointer hover:bg-stone-800 transition-colors">+</button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
                </button>

                <button
                  onClick={handleWishlist}
                  className="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center border border-stone-800 hover:border-[#C8A14A] bg-stone-950 transition-all cursor-pointer"
                >
                  <Heart size={18} fill={isWishlisted ? "#C8A14A" : "none"} className={isWishlisted ? "text-[#C8A14A]" : "text-stone-400"} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-4 border-y border-stone-900/60">
                {[
                  { icon: <Truck size={14} />, label: "Free Shipping", sub: "Orders PKR 2,999+" },
                  { icon: <Shield size={14} />, label: "Authenticity", sub: "100% Genuine" },
                  { icon: <RotateCcw size={14} />, label: "Easy Returns", sub: "7-day policy" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center gap-1 p-2 rounded-xl bg-stone-950/60 border border-stone-900">
                    <span className="text-[#C8A14A]">{item.icon}</span>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-stone-300">{item.label}</p>
                    <p className="text-[8px] text-stone-600">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="flex gap-3">
                {product.virtualTryOn && (
                  <Link
                    href={`/try-on?product=${product.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#C8A14A]/30 bg-[#C8A14A]/5 text-[#C8A14A] text-[10px] font-bold uppercase tracking-widest hover:bg-[#C8A14A]/10 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Virtual Try-On
                  </Link>
                )}
                <Link
                  href="/gift-studio"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-800 bg-stone-950 text-stone-300 text-[10px] font-bold uppercase tracking-widest hover:border-stone-600 transition-colors"
                >
                  <Gift className="w-3.5 h-3.5" /> Gift Wrap
                </Link>
              </div>

              {/* Description */}
              <div className="border-t border-stone-900/60">
                <button
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className="w-full flex items-center justify-between py-3.5 text-stone-300 cursor-pointer hover:text-white transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">Description & Story</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDescOpen ? "rotate-180" : ""}`} />
                </button>
                {isDescOpen && (
                  <p className="text-sm text-stone-400 leading-relaxed pb-4">
                    {product.description || "Every piece is carefully detailed, crafted in lead-free alloy, and double-dipped in 24K gold plating for absolute longevity."}
                  </p>
                )}
              </div>

              {/* Shipping & Care */}
              <div className="border-t border-stone-900/60">
                <button
                  onClick={() => setIsFaqOpen(!isFaqOpen)}
                  className="w-full flex items-center justify-between py-3.5 text-stone-300 cursor-pointer hover:text-white transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">Shipping & Care Guide</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFaqOpen ? "rotate-180" : ""}`} />
                </button>
                {isFaqOpen && (
                  <div className="text-sm text-stone-400 space-y-2.5 pb-4 leading-relaxed">
                    <p>🚚 <strong className="text-stone-300">Shipping:</strong> Delivery within 3–5 working days across Pakistan. Free shipping on orders above PKR 2,999.</p>
                    <p>✨ <strong className="text-stone-300">Care:</strong> Avoid direct contact with perfumes, hairsprays, or water. Keep secured in velvet box to preserve plating.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ─────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-stone-900/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-7">
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#C8A14A] mb-1">✦ Complete Your Look</p>
                <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>You May Also Like</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile Sticky Add-to-Bag Bar (only on mobile) ────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-stone-800"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[8px] uppercase font-bold text-stone-500">Order Amount</p>
              <p className="text-sm font-bold text-white font-mono">Rs. {(product.price * quantity).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-stone-400 font-bold cursor-pointer">−</button>
                <span className="px-2 font-mono text-[11px] text-white font-bold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 text-stone-400 font-bold cursor-pointer">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-black cursor-pointer"
                style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
              </button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
