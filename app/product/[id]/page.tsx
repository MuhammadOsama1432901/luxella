"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/providers/CartProvider";
import { Star, ShoppingBag, ArrowLeft, Heart, MessageSquare } from "lucide-react";
import { DBProduct } from "@/lib/db";
import { toast } from "sonner";
import { BUSINESS_PHONE, WHATSAPP_API } from "@/constants/business";

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
  const [activeTab, setActiveTab] = useState<"description" | "specifications">("description");
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
        // Fetch current product
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);

        // Fetch related products (same category)
        if (data.category) {
          const relatedRes = await fetch(`/api/products?category=${data.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            // Filter out current product
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

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity} x ${product.name} added to cart!`, {
      style: {
        background: "rgba(20, 20, 20, 0.95)",
        color: "#ffffff",
        border: "1px solid #C8A96A",
      },
    });
  };

  const handleBuyNowWhatsApp = () => {
    if (!product) return;
    const message = `Hello Luxella! I am interested in purchasing this product:\n\n*Product*: ${product.name}\n*Price*: Rs. ${product.price.toLocaleString()}\n*ID*: #${product.id}\n*Quantity*: ${quantity}\n\nIs it available? Please guide me on the next steps. Thank you!`;
    window.open(WHATSAPP_API(BUSINESS_PHONE, message), "_blank");
  };

  const handleWishlist = () => {
    const newWishlisted = !isWishlisted;
    setIsWishlisted(newWishlisted);
    // Persist to localStorage
    if (product) {
      try {
        const wishlist: number[] = JSON.parse(localStorage.getItem("luxella_wishlist") || "[]");
        const updated = newWishlisted
          ? [...wishlist, product.id]
          : wishlist.filter((wid) => wid !== product.id);
        localStorage.setItem("luxella_wishlist", JSON.stringify(updated));
      } catch { /* ignore */ }
    }
    toast.success(newWishlisted ? "Added to wishlist!" : "Removed from wishlist!", {
      style: { background: "rgba(20, 20, 20, 0.95)", color: "#ffffff", border: "1px solid #C8A96A" },
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ background: "var(--bg-base)", minHeight: "100vh" }} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="rounded-3xl aspect-square w-full" style={{ background: "var(--bg-elevated)" }} />
              <div className="space-y-6">
                <div className="h-4 w-1/4 rounded" style={{ background: "var(--bg-elevated)" }} />
                <div className="h-10 w-3/4 rounded" style={{ background: "var(--bg-elevated)" }} />
                <div className="h-6 w-1/3 rounded" style={{ background: "var(--bg-elevated)" }} />
                <div className="h-24 w-full rounded" style={{ background: "var(--bg-elevated)" }} />
                <div className="h-12 w-full rounded mt-8" style={{ background: "var(--bg-elevated)" }} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ background: "var(--bg-base)", minHeight: "100vh" }} className="py-32 text-center flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
            Product Not Found
          </h2>
          <p className="mb-8 max-w-sm" style={{ color: "var(--text-secondary)" }}>
            The jewelry piece you are looking for does not exist or has been removed from our collection.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <Navbar />

      <main style={{ background: "var(--bg-base)", minHeight: "100vh" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs / Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 transition-colors group cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A96A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#C8A96A]" />
            Back to collection
          </button>

          {/* Product Details Section */}
          <div
            className="grid md:grid-cols-2 gap-12 lg:gap-16 rounded-3xl p-6 sm:p-10 border shadow-2xl"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "rgba(200, 169, 106, 0.12)",
            }}
          >
            {/* Left: Product Image */}
            <div
              className="relative aspect-square overflow-hidden rounded-2xl bg-[#0b0b0b] border group flex items-center justify-center"
              style={{ borderColor: "rgba(200, 169, 106, 0.15)" }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.sale && (
                <span
                  className="absolute top-4 left-4 text-white px-3.5 py-1 rounded text-[9px] font-bold tracking-[0.2em] uppercase shadow-lg"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                >
                  SALE
                </span>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2 block" style={{ color: "#C8A96A" }}>
                  ✦ {product.category}
                </span>

                <h1
                  className="text-3xl sm:text-4xl font-bold mb-3 tracking-wide"
                  style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                >
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-6">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < product.rating ? "#C8A96A" : "transparent"}
                        color={i < product.rating ? "#C8A96A" : "#3e372e"}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>
                    ({product.rating % 1 === 0 ? product.rating : product.rating.toFixed(1)} Rating)
                  </span>
                </div>

                {/* Prices */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-base line-through" style={{ color: "var(--text-muted)" }}>
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Indicator */}
                <div className="mb-8">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                      Only {product.stock} items left in stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      In Stock (Available)
                    </span>
                  )}
                </div>

                {/* Tabs for description and specifications */}
                <div className="border-b mb-6" style={{ borderColor: "rgba(200, 169, 106, 0.15)" }}>
                  <div className="flex gap-6 -mb-px">
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                        activeTab === "description"
                          ? "border-[#C8A96A] text-[#C8A96A]"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab("specifications")}
                      className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                        activeTab === "specifications"
                          ? "border-[#C8A96A] text-[#C8A96A]"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      Details & Specs
                    </button>
                  </div>
                </div>

                <div className="mb-8 min-h-[100px]">
                  {activeTab === "description" ? (
                    <p className="leading-relaxed text-xs" style={{ color: "var(--text-secondary)" }}>
                      {product.description || "No description available for this jewelry piece."}
                    </p>
                  ) : (
                    <div
                      className="rounded-xl overflow-hidden text-xs border"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        borderColor: "rgba(200, 169, 106, 0.1)",
                      }}
                    >
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                            <tr
                              key={key}
                              style={{
                                background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                              }}
                            >
                              <td className="p-3 font-semibold w-1/3 border-b border-gray-800/40" style={{ color: "var(--text-primary)" }}>{key}</td>
                              <td className="p-3 border-b border-gray-800/40" style={{ color: "var(--text-secondary)" }}>{val}</td>
                            </tr>
                          ))}
                          {(!product.specifications || Object.keys(product.specifications).length === 0) && (
                            <tr>
                              <td className="p-3 italic text-gray-500">No specifications provided.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase controls */}
              {!isOutOfStock && (
                <div className="space-y-5 pt-4">
                  {/* Quantity selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Quantity:</span>
                    <div
                      className="flex items-center rounded-lg overflow-hidden border"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        borderColor: "rgba(200, 169, 106, 0.15)",
                      }}
                    >
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-[#C8A96A]/10 font-bold transition-colors text-white"
                      >
                        -
                      </button>
                      <span
                        className="px-4 py-2 text-xs font-bold w-12 text-center"
                        style={{ color: "var(--text-primary)", background: "rgba(255, 255, 255, 0.02)" }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 hover:bg-[#C8A96A]/10 font-bold transition-colors text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all shadow-lg hover:scale-[1.01] active:scale-100 cursor-pointer"
                      style={{ background: "linear-gradient(135deg, #C8A96A, #8B6914)" }}
                    >
                      <ShoppingBag size={15} />
                      Add to Cart
                    </button>

                    <button
                      onClick={handleBuyNowWhatsApp}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all shadow-md hover:scale-[1.01] active:scale-100 cursor-pointer border border-[#C8A96A]/30 hover:border-[#C8A96A]"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <MessageSquare size={15} className="text-[#C8A96A]" />
                      Order Chat +92 349 5804586
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <div className="text-center mb-12">
                <p className="text-[9px] uppercase tracking-[0.5em] font-semibold mb-3" style={{ color: "#C8A96A" }}>
                  ✦ Complete Your Look
                </p>
                <h2 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                  You May Also Like
                </h2>
                <div className="gold-divider w-16 mx-auto mt-4 opacity-55" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
                    style={{
                      background: "var(--bg-elevated)",
                      borderColor: "rgba(200, 169, 106, 0.12)",
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#0b0b0b] flex-shrink-0 border-b border-gray-800/30">
                      <Link href={`/product/${p.id}`}>
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <Link href={`/product/${p.id}`} className="transition-colors group-hover:text-[#C8A96A]">
                        <h4
                          className="font-bold text-sm line-clamp-1 group-hover:text-[#C8A96A] transition-colors"
                          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
                        >
                          {p.name}
                        </h4>
                      </Link>
                      <span className="text-[9px] text-[#C8A96A] mt-1.5 uppercase tracking-widest font-bold">{p.category}</span>
                      <span className="font-bold text-sm mt-3 block flex-grow" style={{ color: "var(--text-primary)" }}>
                        Rs. {p.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
