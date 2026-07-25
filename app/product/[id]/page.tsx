"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/providers/CartProvider";
import { Star, ShoppingBag, ArrowLeft, Heart, Sparkles, Gift, ChevronDown, HelpCircle, Truck } from "lucide-react";
import { DBProduct } from "@/lib/db";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

  // Variant States
  const [selectedColor, setSelectedColor] = useState("Gold Finish");
  const [selectedSize, setSelectedSize] = useState("Standard");

  // Accordion Toggle States
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

        // Fetch related products
        if (data.category) {
          const relatedRes = await fetch(`/api/products?category=${data.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedProducts(
              relatedData.filter((p: DBProduct) => p.id !== data.id).slice(0, 4)
            );
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
    toast.success(`${product.name} (${selectedColor}, Size: ${selectedSize}) added to bag! ✨`);
  };

  const handleWishlist = () => {
    const newWish = !isWishlisted;
    setIsWishlisted(newWish);
    if (product) {
      try {
        const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
        const updated = newWish
          ? [...wishlist, product.id]
          : wishlist.filter((wid) => wid !== product.id);
        localStorage.setItem("luxella_wishlist", JSON.stringify(updated));
      } catch { /* ignore */ }
    }
    toast.success(newWish ? "Added to wishlist! 💎" : "Removed from wishlist!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex flex-col justify-center items-center gap-2">
        <div className="w-8 h-8 border-2 border-[#C8A14A] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Curating jewelry details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <h2 className="text-xl font-bold text-white font-serif" style={{ fontFamily: "var(--font-playfair)" }}>Product Not Found</h2>
          <p className="text-xs text-stone-500 max-w-xs">This piece does not exist in our catalog collections.</p>
          <Link href="/shop" className="bg-[#C8A14A] text-black text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-full">Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Build a real image list — if product has multiple images use them, otherwise show single
  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <>
      <Navbar />

      <main className="bg-[#0B0B0C] text-[#F8F6F2] min-h-screen pb-28 relative">
        <div className="px-4 py-4 flex items-center justify-between border-b border-stone-900/40">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-stone-400">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-500">Maison Piece</span>
        </div>

        {/* ── Image Carousel Swiper ── */}
        <div className="relative w-full h-[380px] bg-stone-950 flex items-center justify-center">
          <img
            src={productImages[activeImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Swipe indicator */}
          <span className="absolute bottom-4 right-4 bg-black/60 border border-white/5 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold font-mono text-stone-300">
            {activeImageIndex + 1} / {productImages.length}
          </span>

          {/* Carousel dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {productImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full pointer-events-auto ${idx === activeImageIndex ? "bg-[#C8A14A] w-3" : "bg-white/20"}`}
              />
            ))}
          </div>
        </div>

        {/* ── Details Content ── */}
        <div className="px-4 py-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-[#C8A14A]">✦ {product.category}</span>
                <h1 className="text-xl font-bold uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {product.name}
                </h1>
              </div>
              
              {/* Floating Wishlist Icon */}
              <button
                onClick={handleWishlist}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-stone-800 bg-[#111111] text-[#F8F6F2] active:scale-90 transition-all cursor-pointer"
              >
                <Heart size={16} fill={isWishlisted ? "#C8A14A" : "transparent"} className={isWishlisted ? "text-[#C8A14A]" : "text-stone-400"} />
              </button>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between border-t border-stone-900/60 pt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#C8A14A] font-mono">Rs. {product.price.toLocaleString()}</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-xs line-through text-stone-500 font-mono">Rs. {product.oldPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill={i < product.rating ? "#C8A14A" : "transparent"} className="text-[#C8A14A]" />
                  ))}
                </div>
                <span className="text-[9px] text-stone-500 font-bold ml-1">({product.rating}.0)</span>
              </div>
            </div>
          </div>

          {/* ── Variant Selectors ── */}
          <div className="space-y-4 border-t border-stone-900/60 pt-4">
            
            {/* Color Plating Finish */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Color Finish</label>
              <div className="flex gap-2.5">
                {["Gold Finish", "Silver Finish", "Rose Gold"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      selectedColor === color ? "border-[#C8A14A] bg-[#C8A14A]/10 text-[#C8A14A]" : "border-stone-850 bg-stone-950 text-stone-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#C8A14A]">Select Size</label>
              <div className="flex gap-2.5">
                {["Standard", "Size 6", "Size 7", "Size 8"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      selectedSize === size ? "border-[#C8A14A] bg-[#C8A14A]/10 text-[#C8A14A]" : "border-stone-850 bg-stone-950 text-stone-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── Action buttons: Try-on & Gift Studio ── */}
          <div className="grid grid-cols-2 gap-3.5 border-t border-stone-900/60 pt-4">
            {product.virtualTryOn && (
              <Link
                href={`/try-on?product=${product.id}`}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-[#C8A14A]/30 bg-[#C8A14A]/5 text-[#C8A14A] text-[9px] font-bold uppercase tracking-widest"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Virtual Try-On
              </Link>
            )}
            <Link
              href="/gift-studio"
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-stone-850 bg-stone-950 text-stone-300 text-[9px] font-bold uppercase tracking-widest"
            >
              <Gift className="w-3.5 h-3.5" /> Gift wrapping
            </Link>
          </div>

          {/* ── Product Description Accordion ── */}
          <div className="border-t border-stone-900/60 pt-4">
            <button
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="w-full flex items-center justify-between py-2 text-stone-300 cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">Description &amp; Story</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDescOpen ? "rotate-180" : ""}`} />
            </button>
            {isDescOpen && (
              <p className="text-[11px] text-stone-400 leading-relaxed pt-2">
                {product.description || "Every piece is carefully detailed, crafted in lead-free alloy, and double-dipped in 24K gold plating for absolute longevity."}
              </p>
            )}
          </div>

          {/* ── FAQ Accordion ── */}
          <div className="border-t border-stone-900/40 pt-2">
            <button
              onClick={() => setIsFaqOpen(!isFaqOpen)}
              className="w-full flex items-center justify-between py-2 text-stone-300 cursor-pointer"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">Shipping &amp; Care guide</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFaqOpen ? "rotate-180" : ""}`} />
            </button>
            {isFaqOpen && (
              <div className="text-[11px] text-stone-400 space-y-2 pt-2">
                <p>🚚 <strong className="text-stone-300">Shipping:</strong> Delivery within 3-5 working days across Pakistan. Free shipping on orders above PKR 2,999.</p>
                <p>✨ <strong className="text-stone-300">Care:</strong> Avoid direct contact with perfumes, hairsprays, or water. Keep secured in velvet boxes to preserve plating color.</p>
              </div>
            )}
          </div>

          {/* ── Related Collection List ── */}
          {relatedProducts.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-stone-900/40">
              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] font-bold text-[#C8A14A]">✦ Complete Your Look</p>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Suggested Pairings</h3>
              </div>

              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="w-[140px] flex-shrink-0 bg-[#111] border border-stone-850 rounded-xl overflow-hidden p-2 space-y-2"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-stone-950">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-bold text-white uppercase tracking-wider truncate">{p.name}</h4>
                      <p className="text-[9px] font-mono text-[#C8A14A] mt-0.5">Rs. {p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Sticky Bottom Purchase Bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-t border-stone-850 p-4 flex items-center justify-between max-w-[430px] mx-auto">
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-bold text-stone-500">Order Amount</span>
            <span className="text-sm font-bold text-white font-mono">Rs. {(product.price * quantity).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Simple quantity toggle */}
            <div className="flex items-center bg-stone-900 border border-stone-850 rounded-xl text-xs">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2.5 text-stone-400 font-bold">-</button>
              <span className="px-2 font-mono text-[10px] text-white font-bold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock ?? 99, quantity + 1))} className="px-3 py-2.5 text-stone-400 font-bold">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 rounded-xl px-6 py-2.5 text-[9px] font-bold uppercase tracking-wider text-black bg-[#C8A14A] hover:bg-[#b09241] shadow-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Bag
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
