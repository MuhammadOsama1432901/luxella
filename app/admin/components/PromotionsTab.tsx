"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Copy, Check, 
  Tag, Calendar, Gift, Percent, Flame, RefreshCw, Layers, DollarSign, 
  MousePointerClick, TrendingUp, AlertTriangle, Eye, ShieldAlert, Award, Truck
} from "lucide-react";
import { toast } from "sonner";

interface Promotion {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  image?: string;
  link?: string;
  active: boolean;
  startDate: string;
  endDate: string;
  discountBadge?: string;
  promoCode?: string;
  hasCountdown?: boolean;
  categoryScope?: string;
  collectionScope?: string;
  productScope?: number[];
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minSpend?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  isOneTime: boolean;
  customerScope?: string[];
  categoryScope?: string;
  autoApply: boolean;
}

interface Announcement {
  id: string;
  text: string;
  type: string;
  link?: string;
  active: boolean;
  priority: number;
}

interface FlashSaleProduct {
  productId: number;
  flashPrice: number;
  stockLimit: number;
  stockSold: number;
}

interface FlashSale {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  products: FlashSaleProduct[];
  active: boolean;
}

interface PromotionsTabProps {
  products: any[];
  categories: any[];
  onRefresh: () => void;
}

export function PromotionsTab({ products, categories, onRefresh }: PromotionsTabProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"dashboard" | "announcements" | "banners" | "coupons" | "flash">("dashboard");
  const [loading, setLoading] = useState(true);

  // Form Modals states
  const [showModal, setShowModal] = useState<string | null>(null); // "announcement" | "banner" | "coupon" | "flash"
  const [editingId, setEditingId] = useState<string | null>(null);

  // Announcement Form State
  const [annText, setAnnText] = useState("");
  const [annType, setAnnType] = useState("free_shipping");
  const [annLink, setAnnLink] = useState("");
  const [annPriority, setAnnPriority] = useState(1);
  const [annActive, setAnnActive] = useState(true);

  // Coupon Form State
  const [cpCode, setCpCode] = useState("");
  const [cpType, setCpType] = useState("percentage");
  const [cpValue, setCpValue] = useState(10);
  const [cpMinSpend, setCpMinSpend] = useState(0);
  const [cpMaxDiscount, setCpMaxDiscount] = useState(0);
  const [cpStartDate, setCpStartDate] = useState("");
  const [cpEndDate, setCpEndDate] = useState("");
  const [cpUsageLimit, setCpUsageLimit] = useState(0);
  const [cpActive, setCpActive] = useState(true);
  const [cpIsOneTime, setCpIsOneTime] = useState(false);
  const [cpAutoApply, setCpAutoApply] = useState(false);
  const [cpCustomerScope, setCpCustomerScope] = useState(""); // comma separated emails
  const [cpCategoryScope, setCpCategoryScope] = useState("");

  // Banner Form State
  const [bnType, setBnType] = useState("hero");
  const [bnTitle, setBnTitle] = useState("");
  const [bnSubtitle, setBnSubtitle] = useState("");
  const [bnImage, setBnImage] = useState("");
  const [bnLink, setBnLink] = useState("");
  const [bnStartDate, setBnStartDate] = useState("");
  const [bnEndDate, setBnEndDate] = useState("");
  const [bnDiscountBadge, setBnDiscountBadge] = useState("");
  const [bnPromoCode, setBnPromoCode] = useState("");
  const [bnHasCountdown, setBnHasCountdown] = useState(false);
  const [bnCategoryScope, setBnCategoryScope] = useState("");

  // Flash Sale Form State
  const [fsTitle, setFsTitle] = useState("");
  const [fsStartDate, setFsStartDate] = useState("");
  const [fsEndDate, setFsEndDate] = useState("");
  const [fsActive, setFsActive] = useState(true);
  const [fsSelectedProducts, setFsSelectedProducts] = useState<{productId: number, flashPrice: number, stockLimit: number, stockSold: number}[]>([]);

  // Flash Selection Temp State
  const [tempProdId, setTempProdId] = useState(products[0]?.id || 0);
  const [tempFlashPrice, setTempFlashPrice] = useState(1000);
  const [tempStockLimit, setTempStockLimit] = useState(10);

  useEffect(() => {
    loadPromotionsData();
  }, []);

  async function loadPromotionsData() {
    setLoading(true);
    try {
      const res = await fetch("/api/promotions");
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions || []);
        setCoupons(data.coupons || []);
        setAnnouncements(data.announcements || []);
        setFlashSales(data.flashSales || []);
      }
    } catch {
      toast.error("Failed to load promotions metadata.");
    } finally {
      setLoading(false);
    }
  }

  // ── Dispatch Changes helper ────────────────────────────────────────────────
  async function saveToServer(action: string, payload: any) {
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload })
      });
      if (res.ok) {
        toast.success("Promotional database updated.");
        loadPromotionsData();
        onRefresh();
        setShowModal(null);
        setEditingId(null);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  }

  // ── Announcement Actions ───────────────────────────────────────────────────
  function handleAddEditAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!annText.trim()) return;

    const payload = {
      id: editingId || `ann_${Date.now()}`,
      text: annText,
      type: annType,
      link: annLink || undefined,
      priority: Number(annPriority),
      active: annActive
    };

    saveToServer(editingId ? "update_announcement" : "create_announcement", payload);
  }

  function handleOpenEditAnnouncement(ann: Announcement) {
    setEditingId(ann.id);
    setAnnText(ann.text);
    setAnnType(ann.type);
    setAnnLink(ann.link || "");
    setAnnPriority(ann.priority);
    setAnnActive(ann.active);
    setShowModal("announcement");
  }

  // ── Coupon Actions ─────────────────────────────────────────────────────────
  function handleAddEditCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!cpCode.trim() || cpValue <= 0) return;

    const payload = {
      id: editingId || `cp_${Date.now()}`,
      code: cpCode.trim().toUpperCase(),
      type: cpType,
      value: Number(cpValue),
      minSpend: cpMinSpend ? Number(cpMinSpend) : undefined,
      maxDiscount: cpMaxDiscount ? Number(cpMaxDiscount) : undefined,
      startDate: cpStartDate || new Date().toISOString(),
      endDate: cpEndDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      usageLimit: cpUsageLimit ? Number(cpUsageLimit) : undefined,
      usageCount: editingId ? (coupons.find(c => c.id === editingId)?.usageCount || 0) : 0,
      active: cpActive,
      isOneTime: cpIsOneTime,
      autoApply: cpAutoApply,
      customerScope: cpCustomerScope ? cpCustomerScope.split(",").map(e => e.trim().toLowerCase()) : undefined,
      categoryScope: cpCategoryScope || undefined
    };

    saveToServer(editingId ? "update_coupon" : "create_coupon", payload);
  }

  function handleOpenEditCoupon(cp: Coupon) {
    setEditingId(cp.id);
    setCpCode(cp.code);
    setCpType(cp.type);
    setCpValue(cp.value);
    setCpMinSpend(cp.minSpend || 0);
    setCpMaxDiscount(cp.maxDiscount || 0);
    setCpStartDate(cp.startDate.substring(0, 16));
    setCpEndDate(cp.endDate.substring(0, 16));
    setCpUsageLimit(cp.usageLimit || 0);
    setCpActive(cp.active);
    setCpIsOneTime(cp.isOneTime || false);
    setCpAutoApply(cp.autoApply || false);
    setCpCustomerScope(cp.customerScope?.join(", ") || "");
    setCpCategoryScope(cp.categoryScope || "");
    setShowModal("coupon");
  }

  // ── Banner/Promotions Actions ──────────────────────────────────────────────
  function handleAddEditBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!bnTitle.trim()) return;

    const payload = {
      id: editingId || `promo_${Date.now()}`,
      type: bnType,
      title: bnTitle,
      subtitle: bnSubtitle || undefined,
      image: bnImage || undefined,
      link: bnLink || undefined,
      active: true,
      startDate: bnStartDate || new Date().toISOString(),
      endDate: bnEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      discountBadge: bnDiscountBadge || undefined,
      promoCode: bnPromoCode || undefined,
      hasCountdown: bnHasCountdown,
      categoryScope: bnCategoryScope || undefined
    };

    saveToServer(editingId ? "update_promotion" : "create_promotion", payload);
  }

  function handleOpenEditBanner(promo: Promotion) {
    setEditingId(promo.id);
    setBnType(promo.type);
    setBnTitle(promo.title);
    setBnSubtitle(promo.subtitle || "");
    setBnImage(promo.image || "");
    setBnLink(promo.link || "");
    setBnStartDate(promo.startDate.substring(0, 16));
    setBnEndDate(promo.endDate.substring(0, 16));
    setBnDiscountBadge(promo.discountBadge || "");
    setBnPromoCode(promo.promoCode || "");
    setBnHasCountdown(promo.hasCountdown || false);
    setBnCategoryScope(promo.categoryScope || "");
    setShowModal("banner");
  }

  // ── Flash Sale Actions ──────────────────────────────────────────────────────
  function handleAddEditFlash(e: React.FormEvent) {
    e.preventDefault();
    if (!fsTitle.trim() || fsSelectedProducts.length === 0) {
      toast.error("Please fill in the title and select at least 1 product.");
      return;
    }

    const payload = {
      id: editingId || `fs_${Date.now()}`,
      title: fsTitle,
      startDate: fsStartDate || new Date().toISOString(),
      endDate: fsEndDate || new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      active: fsActive,
      products: fsSelectedProducts
    };

    saveToServer(editingId ? "update_flash_sale" : "create_flash_sale", payload);
  }

  function handleOpenEditFlash(fs: FlashSale) {
    setEditingId(fs.id);
    setFsTitle(fs.title);
    setFsStartDate(fs.startDate.substring(0, 16));
    setFsEndDate(fs.endDate.substring(0, 16));
    setFsActive(fs.active);
    setFsSelectedProducts(fs.products);
    setShowModal("flash");
  }

  function addProductToFlashList() {
    const prod = products.find(p => p.id === Number(tempProdId));
    if (!prod) return;
    
    // Check duplication
    if (fsSelectedProducts.find(p => p.productId === prod.id)) {
      toast.error("Product is already listed in this flash sale.");
      return;
    }

    setFsSelectedProducts([
      ...fsSelectedProducts,
      {
        productId: prod.id,
        flashPrice: Number(tempFlashPrice),
        stockLimit: Number(tempStockLimit),
        stockSold: 0
      }
    ]);
  }

  function removeProductFromFlashList(id: number) {
    setFsSelectedProducts(fsSelectedProducts.filter(p => p.productId !== id));
  }

  // Delete Handlers
  function handleDeleteItem(type: "announcement" | "coupon" | "promotion" | "flash_sale", id: string) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    saveToServer("delete_item", { type, id });
  }

  // ── Calculate Dashboard Analytics Mock metrics based on live db ──────────────
  const totalPromotions = promotions.length;
  const activePromoCount = promotions.filter(p => p.active).length;
  const activeCoupons = coupons.filter(c => c.active).length;
  
  // Dynamic mock analytics calculations
  const mockRevenueGenerated = coupons.reduce((sum, c) => sum + (c.usageCount * 1250), 45000);
  const mockCouponsUsed = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const mockAov = 2499; 
  const mockCtr = "4.2%";
  const mockConversion = "2.8%";

  return (
    <div className="space-y-6 text-stone-300">
      
      {/* Tab Navigation header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8A96A]/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
            <BarChart3 className="w-5 h-5 text-[#C8A96A]" /> Redesigned Promotions &amp; Campaign Studio
          </h2>
          <p className="text-xs text-stone-400">Manage announcement sliders, coupons, and flash campaign events.</p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-1.5 bg-black/45 border border-stone-850 p-1.5 rounded-xl">
          {[
            { key: "dashboard", label: "Analytics" },
            { key: "announcements", label: "Announcements" },
            { key: "banners", label: "Banners" },
            { key: "coupons", label: "Coupons Vault" },
            { key: "flash", label: "Flash Sales" }
          ].map((sub) => (
            <button
              key={sub.key}
              onClick={() => setActiveSubTab(sub.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === sub.key ? "bg-[#C8A96A] text-black" : "text-stone-400 hover:text-white"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">

          {/* ── SUB-TAB 1: ANALYTICS DASHBOARD ────────────────────────────────── */}
          {activeSubTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Analytics summary row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Campaigns", val: totalPromotions + coupons.length + flashSales.length, sub: `${activePromoCount} Active Now`, icon: <Layers className="w-4 h-4 text-[#C8A96A]" /> },
                  { label: "Coupons Redeemed", val: mockCouponsUsed, sub: `${activeCoupons} Active Coupons`, icon: <Tag className="w-4 h-4 text-emerald-400" /> },
                  { label: "Promo Revenue", val: `Rs. ${mockRevenueGenerated.toLocaleString()}`, sub: `AOV: Rs. ${mockAov.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-amber-500" /> },
                  { label: "Campaign CTR", val: mockCtr, sub: `${mockConversion} Conversion`, icon: <TrendingUp className="w-4 h-4 text-[#C8A96A]" /> }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-b from-[#121214] to-black border border-stone-850 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{item.label}</p>
                      <h4 className="text-xl font-bold text-white tracking-wide">{item.val}</h4>
                      <p className="text-[9px] text-[#C8A96A]">{item.sub}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Best Performers card */}
              <div className="bg-[#0B0B0C] border border-[#C8A96A]/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5" style={{ fontFamily: "var(--font-playfair)" }}>
                  <Award className="w-4 h-4 text-[#C8A96A]" /> Top-Performing Coupon Codes
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-stone-900 rounded-xl p-4 flex items-center gap-3">
                    <Percent className="w-8 h-8 text-[#C8A96A] bg-[#C8A96A]/10 p-1.5 rounded-lg" />
                    <div>
                      <h4 className="font-bold text-white font-mono text-sm">WELCOME10 (10% Off)</h4>
                      <p className="text-xs text-stone-500">12 Redemptions | Generated Rs. 15,000 Revenue</p>
                    </div>
                  </div>
                  <div className="bg-black/30 border border-stone-900 rounded-xl p-4 flex items-center gap-3">
                    <Truck className="w-8 h-8 text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg" />
                    <div>
                      <h4 className="font-bold text-white font-mono text-sm">PKRFREE (Free Shipping)</h4>
                      <p className="text-xs text-stone-500">4 Redemptions | Generated Rs. 12,000 Revenue</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── SUB-TAB 2: ANNOUNCEMENTS ──────────────────────────────────────── */}
          {activeSubTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Announcement Messages Bar</h3>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setAnnText("");
                    setAnnType("free_shipping");
                    setAnnLink("");
                    setAnnPriority(1);
                    setAnnActive(true);
                    setShowModal("announcement");
                  }}
                  className="bg-[#C8A96A] hover:bg-[#b09259] text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Create Message
                </button>
              </div>

              <div className="border border-stone-850 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-900 text-stone-400 font-bold border-b border-stone-800">
                      <th className="p-4">Message Text</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {announcements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-stone-950">
                        <td className="p-4 font-semibold text-white">{ann.text}</td>
                        <td className="p-4 uppercase tracking-wider text-[10px] text-stone-400">{ann.type}</td>
                        <td className="p-4 font-mono text-[#C8A96A]">{ann.priority}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${ann.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                            {ann.active ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleOpenEditAnnouncement(ann)} className="text-stone-400 hover:text-white p-1" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteItem("announcement", ann.id)} className="text-stone-500 hover:text-red-400 p-1" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SUB-TAB 3: BANNERS & CAMPAIGNS ────────────────────────────────── */}
          {activeSubTab === "banners" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Home &amp; Shop Promo Banners</h3>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setBnType("hero");
                    setBnTitle("");
                    setBnSubtitle("");
                    setBnImage("");
                    setBnLink("");
                    setBnStartDate("");
                    setBnEndDate("");
                    setBnDiscountBadge("");
                    setBnPromoCode("");
                    setBnHasCountdown(false);
                    setBnCategoryScope("");
                    setShowModal("banner");
                  }}
                  className="bg-[#C8A96A] hover:bg-[#b09259] text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Create Banner
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                  <div key={promo.id} className="bg-gradient-to-b from-[#121214] to-black border border-stone-850 rounded-2xl p-5 flex flex-col justify-between hover:border-[#C8A96A]/20 transition-all">
                    <div className="space-y-4">
                      <div className="aspect-[21/9] rounded-xl border border-stone-900 relative overflow-hidden bg-stone-950">
                        {promo.image ? (
                          <img src={promo.image} alt={promo.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px] uppercase font-bold">No Image Banner Uploaded</div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/60 border border-[#C8A96A]/25 text-[#C8A96A] text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                          {promo.type}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-playfair)" }}>{promo.title}</h4>
                        {promo.subtitle && <p className="text-xs text-stone-400 mt-1">{promo.subtitle}</p>}
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] text-stone-400 font-semibold">
                        {promo.promoCode && <span className="bg-stone-900 border border-stone-850 px-2 py-1 rounded">Code: {promo.promoCode}</span>}
                        {promo.discountBadge && <span className="bg-stone-900 border border-stone-850 px-2 py-1 rounded">Badge: {promo.discountBadge}</span>}
                        {promo.hasCountdown && <span className="bg-red-950/20 border border-red-500/20 text-red-400 px-2 py-1 rounded">Timer Enabled</span>}
                      </div>
                    </div>

                    <div className="border-t border-stone-900 mt-5 pt-4 flex justify-between items-center">
                      <span className="text-[9px] text-stone-500 font-mono">Ends: {new Date(promo.endDate).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEditBanner(promo)} className="text-stone-400 hover:text-white p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteItem("promotion", promo.id)} className="text-stone-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUB-TAB 4: COUPONS VAULT ──────────────────────────────────────── */}
          {activeSubTab === "coupons" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Boutique Coupon System</h3>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setCpCode("");
                    setCpType("percentage");
                    setCpValue(10);
                    setCpMinSpend(0);
                    setCpMaxDiscount(0);
                    setCpStartDate("");
                    setCpEndDate("");
                    setCpUsageLimit(0);
                    setCpActive(true);
                    setCpIsOneTime(false);
                    setCpAutoApply(false);
                    setCpCustomerScope("");
                    setCpCategoryScope("");
                    setShowModal("coupon");
                  }}
                  className="bg-[#C8A96A] hover:bg-[#b09259] text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-gradient-to-b from-[#121214] to-black border border-stone-850 rounded-2xl p-5 flex flex-col justify-between hover:border-[#C8A96A]/20 transition-all">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-white text-base font-mono tracking-wider">{coupon.code}</span>
                        <span className="text-[10px] bg-[#C8A96A]/10 text-[#C8A96A] px-2 py-0.5 rounded border border-[#C8A96A]/20 uppercase tracking-widest font-bold">
                          {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "free_shipping" ? "Free Ship" : `Rs. ${coupon.value}`}
                        </span>
                      </div>

                      <div className="text-xs text-stone-400 space-y-1.5">
                        <p>{coupon.minSpend ? `Min Spend: Rs. ${coupon.minSpend.toLocaleString()}` : "No Minimum Spend Required"}</p>
                        {coupon.maxDiscount ? <p>Max Cap: Rs. {coupon.maxDiscount.toLocaleString()}</p> : null}
                        <p>Redemptions: <span className="font-bold text-white">{coupon.usageCount || 0} times</span></p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {coupon.autoApply && <span className="text-[8px] bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Auto-Apply</span>}
                        {coupon.isOneTime && <span className="text-[8px] bg-amber-950/20 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider">One-Time Only</span>}
                        {coupon.customerScope && <span className="text-[8px] bg-indigo-950/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Targeted</span>}
                      </div>
                    </div>

                    <div className="border-t border-stone-900 mt-5 pt-4 flex justify-between items-center">
                      <span className="text-[9px] text-stone-500 font-mono">Ends: {new Date(coupon.endDate).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenEditCoupon(coupon)} className="text-stone-400 hover:text-white p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteItem("coupon", coupon.id)} className="text-stone-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUB-TAB 5: FLASH SALES ────────────────────────────────────────── */}
          {activeSubTab === "flash" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>Flash Campaigns</h3>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setFsTitle("");
                    setFsStartDate("");
                    setFsEndDate("");
                    setFsActive(true);
                    setFsSelectedProducts([]);
                    setShowModal("flash");
                  }}
                  className="bg-[#C8A96A] hover:bg-[#b09259] text-black px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Create Flash Sale
                </button>
              </div>

              <div className="space-y-6">
                {flashSales.map((fs) => (
                  <div key={fs.id} className="bg-gradient-to-r from-stone-950 via-[#0B0B0C] to-stone-950 border border-stone-850 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-900 pb-3">
                      <div>
                        <h4 className="text-white font-bold font-mono text-sm">{fs.title}</h4>
                        <p className="text-[10px] text-stone-500">Starts: {new Date(fs.startDate).toLocaleString()} | Ends: {new Date(fs.endDate).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${fs.active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-stone-900 text-stone-600 border border-stone-800"}`}>
                          {fs.active ? "Live / Scheduled" : "Inactive"}
                        </span>
                        <button onClick={() => handleOpenEditFlash(fs)} className="text-stone-400 hover:text-white p-1"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteItem("flash_sale", fs.id)} className="text-stone-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {fs.products.map((p) => {
                        const originalProd = products.find(op => op.id === p.productId);
                        return (
                          <div key={p.productId} className="bg-black/35 border border-stone-900 rounded-xl p-3 text-xs space-y-2">
                            <h5 className="font-bold text-stone-300 line-clamp-1">{originalProd?.name || `Product #${p.productId}`}</h5>
                            <p className="text-[#C8A96A] font-bold">Price: Rs. {p.flashPrice.toLocaleString()}</p>
                            <p className="text-[10px] text-stone-500">Sold: {p.stockSold} / Limit: {p.stockLimit}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MODAL DIALOGS FOR FORMS ─────────────────────────────────────────── */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#0D0D0F] border border-[#C8A96A]/20 rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-6">
                
                <div className="flex justify-between items-center border-b border-stone-900 pb-4">
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                    {editingId ? "Edit" : "Create"} {showModal.replace(/^\w/, c => c.toUpperCase())}
                  </h3>
                  <button onClick={() => { setShowModal(null); setEditingId(null); }} className="text-stone-500 hover:text-white text-sm">Cancel</button>
                </div>

                {/* ── Announcement Form ── */}
                {showModal === "announcement" && (
                  <form onSubmit={handleAddEditAnnouncement} className="space-y-4 text-xs">
                    <div className="flex flex-col gap-2">
                      <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Message Text *</label>
                      <input
                        type="text"
                        required
                        value={annText}
                        onChange={(e) => setAnnText(e.target.value)}
                        placeholder="e.g. ✨ Free Shipping on Orders Above PKR 2,999"
                        className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Offer Type</label>
                        <select
                          value={annType}
                          onChange={(e) => setAnnType(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        >
                          <option value="free_shipping">Free Shipping</option>
                          <option value="discount">Flat Discount</option>
                          <option value="flash_sale">Flash Sale</option>
                          <option value="new_arrival">New Arrival</option>
                          <option value="bridal">Bridal Collection</option>
                          <option value="free_gift">Free Gift</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Priority Score *</label>
                        <input
                          type="number"
                          required
                          value={annPriority}
                          onChange={(e) => setAnnPriority(Number(e.target.value))}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Redirect Link (Optional)</label>
                      <input
                        type="text"
                        value={annLink}
                        onChange={(e) => setAnnLink(e.target.value)}
                        placeholder="e.g. /shop?category=Bridal"
                        className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="ann_active"
                        checked={annActive}
                        onChange={(e) => setAnnActive(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="ann_active" className="text-stone-300">Set Message Active immediately</label>
                    </div>

                    <button type="submit" className="w-full bg-[#C8A96A] text-black font-bold py-3 rounded-xl hover:bg-[#b09259] transition-all">
                      Save Announcement
                    </button>
                  </form>
                )}

                {/* ── Coupon Form ── */}
                {showModal === "coupon" && (
                  <form onSubmit={handleAddEditCoupon} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Coupon Code *</label>
                        <input
                          type="text"
                          required
                          value={cpCode}
                          onChange={(e) => setCpCode(e.target.value)}
                          placeholder="e.g. BRIDAL20"
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Discount Type</label>
                        <select
                          value={cpType}
                          onChange={(e) => setCpType(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        >
                          <option value="percentage">Percentage Discount</option>
                          <option value="fixed">Fixed Cash Discount</option>
                          <option value="free_shipping">Free Shipping</option>
                          <option value="free_gift">Free Gift Packaging</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Value Amount *</label>
                        <input
                          type="number"
                          required
                          value={cpValue}
                          onChange={(e) => setCpValue(Number(e.target.value))}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Min Purchase</label>
                        <input
                          type="number"
                          value={cpMinSpend}
                          onChange={(e) => setCpMinSpend(Number(e.target.value))}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Max discount cap</label>
                        <input
                          type="number"
                          value={cpMaxDiscount}
                          onChange={(e) => setCpMaxDiscount(Number(e.target.value))}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Start Campaign</label>
                        <input
                          type="datetime-local"
                          value={cpStartDate}
                          onChange={(e) => setCpStartDate(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">End Expiry</label>
                        <input
                          type="datetime-local"
                          value={cpEndDate}
                          onChange={(e) => setCpEndDate(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Target Category Scope</label>
                        <select
                          value={cpCategoryScope}
                          onChange={(e) => setCpCategoryScope(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        >
                          <option value="">Apply Storewide</option>
                          {categories.map((c) => (
                            <option key={c.slug} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Max Usage Limit</label>
                        <input
                          type="number"
                          value={cpUsageLimit}
                          onChange={(e) => setCpUsageLimit(Number(e.target.value))}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Target Customer Emails (Comma separated)</label>
                      <input
                        type="text"
                        value={cpCustomerScope}
                        onChange={(e) => setCpCustomerScope(e.target.value)}
                        placeholder="e.g. vip@gmail.com, osama@luxella.pk"
                        className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-stone-900 pt-4">
                      <div className="flex items-center gap-1.5">
                        <input type="checkbox" id="cp_active" checked={cpActive} onChange={(e) => setCpActive(e.target.checked)} />
                        <label htmlFor="cp_active" className="text-stone-300">Active</label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input type="checkbox" id="cp_one" checked={cpIsOneTime} onChange={(e) => setCpIsOneTime(e.target.checked)} />
                        <label htmlFor="cp_one" className="text-stone-300">One-Time</label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input type="checkbox" id="cp_auto" checked={cpAutoApply} onChange={(e) => setCpAutoApply(e.target.checked)} />
                        <label htmlFor="cp_auto" className="text-stone-300">Auto-Apply</label>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#C8A96A] text-black font-bold py-3 rounded-xl hover:bg-[#b09259] transition-all">
                      Save Coupon
                    </button>
                  </form>
                )}

                {/* ── Banner Form ── */}
                {showModal === "banner" && (
                  <form onSubmit={handleAddEditBanner} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Banner Type</label>
                        <select
                          value={bnType}
                          onChange={(e) => setBnType(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        >
                          <option value="hero">Hero Promotional Banner</option>
                          <option value="category">Category Showcase</option>
                          <option value="collection">Collection Banner</option>
                          <option value="flash_sale">Flash Sale Page Banner</option>
                          <option value="seasonal">Seasonal Banner</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Title Header *</label>
                        <input
                          type="text"
                          required
                          value={bnTitle}
                          onChange={(e) => setBnTitle(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Subtitle Text</label>
                      <input
                        type="text"
                        value={bnSubtitle}
                        onChange={(e) => setBnSubtitle(e.target.value)}
                        className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Banner Image URL</label>
                        <input
                          type="text"
                          value={bnImage}
                          onChange={(e) => setBnImage(e.target.value)}
                          placeholder="e.g. /images/categories/bridal.jpg"
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Redirect URL Link</label>
                        <input
                          type="text"
                          value={bnLink}
                          onChange={(e) => setBnLink(e.target.value)}
                          placeholder="e.g. /shop?category=Bridal"
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Display Start Date</label>
                        <input
                          type="datetime-local"
                          value={bnStartDate}
                          onChange={(e) => setBnStartDate(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Display End Date</label>
                        <input
                          type="datetime-local"
                          value={bnEndDate}
                          onChange={(e) => setBnEndDate(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Ribbon Discount Badge text</label>
                        <input
                          type="text"
                          value={bnDiscountBadge}
                          onChange={(e) => setBnDiscountBadge(e.target.value)}
                          placeholder="e.g. 20% OFF"
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Associate Promo Code</label>
                        <input
                          type="text"
                          value={bnPromoCode}
                          onChange={(e) => setBnPromoCode(e.target.value)}
                          placeholder="e.g. BRIDAL20"
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="bn_timer"
                        checked={bnHasCountdown}
                        onChange={(e) => setBnHasCountdown(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="bn_timer" className="text-stone-300">Show Countdown Timer Widget</label>
                    </div>

                    <button type="submit" className="w-full bg-[#C8A96A] text-black font-bold py-3 rounded-xl hover:bg-[#b09259] transition-all">
                      Save Campaign Banner
                    </button>
                  </form>
                )}

                {/* ── Flash Sale Form ── */}
                {showModal === "flash" && (
                  <form onSubmit={handleAddEditFlash} className="space-y-4 text-xs">
                    <div className="flex flex-col gap-2">
                      <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Flash Sale Title *</label>
                      <input
                        type="text"
                        required
                        value={fsTitle}
                        onChange={(e) => setFsTitle(e.target.value)}
                        placeholder="e.g. Midnight Glow Flash Sale"
                        className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">Start Date</label>
                        <input
                          type="datetime-local"
                          value={fsStartDate}
                          onChange={(e) => setFsStartDate(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-stone-400 font-bold uppercase tracking-wider text-[9px]">End Date</label>
                        <input
                          type="datetime-local"
                          value={fsEndDate}
                          onChange={(e) => setFsEndDate(e.target.value)}
                          className="rounded-xl px-4 py-3 bg-stone-900 border border-stone-800 text-white outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                    </div>

                    {/* Product Selection List inside Flash */}
                    <div className="bg-black/45 border border-stone-900 rounded-2xl p-4 space-y-3">
                      <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-stone-400">Select Campaign Products</h4>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <select
                            value={tempProdId}
                            onChange={(e) => setTempProdId(Number(e.target.value))}
                            className="w-full rounded-lg px-2.5 py-1.5 bg-stone-900 border border-stone-800 text-white outline-none text-[10px]"
                          >
                            {products.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            placeholder="Price"
                            value={tempFlashPrice}
                            onChange={(e) => setTempFlashPrice(Number(e.target.value))}
                            className="w-full rounded-lg px-2.5 py-1.5 bg-stone-900 border border-stone-800 text-white outline-none text-[10px]"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Limit"
                            value={tempStockLimit}
                            onChange={(e) => setTempStockLimit(Number(e.target.value))}
                            className="w-full rounded-lg px-2.5 py-1.5 bg-stone-900 border border-stone-800 text-white outline-none text-[10px]"
                          />
                          <button
                            type="button"
                            onClick={addProductToFlashList}
                            className="bg-[#C8A96A] text-black px-3.5 py-1.5 rounded-lg text-[10px] font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Render listed items */}
                      <div className="divide-y divide-stone-900 max-h-[120px] overflow-y-auto pr-1">
                        {fsSelectedProducts.map((p) => {
                          const originalProd = products.find(op => op.id === p.productId);
                          return (
                            <div key={p.productId} className="py-2 flex justify-between items-center text-[10px]">
                              <span>{originalProd?.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[#C8A96A]">Rs. {p.flashPrice}</span>
                                <span className="text-stone-500">Cap: {p.stockLimit}</span>
                                <button type="button" onClick={() => removeProductFromFlashList(p.productId)} className="text-red-500 hover:text-red-400 font-bold">Remove</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#C8A96A] text-black font-bold py-3 rounded-xl hover:bg-[#b09259] transition-all">
                      Save Flash Campaign
                    </button>
                  </form>
                )}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
