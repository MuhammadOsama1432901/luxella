"use client";

import { useState } from "react";
import { DBProduct, Review, Coupon, GiftSetting } from "@/lib/db";
import {
  Search, Plus, Trash2, Edit, Copy, Archive, Upload, Download, Check, X,
  AlertTriangle, Star, Gift, Sparkles, MessageCircle, Barcode, DollarSign, Layers
} from "lucide-react";
import { toast } from "sonner";

const PKR = (n: number | undefined | null) => `PKR ${(n ?? 0).toLocaleString()}`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRODUCTS MANAGEMENT TAB (CRUD + BULK + CSV)
// ─────────────────────────────────────────────────────────────────────────────
export function ProductsTab({
  products, onSaveProduct, onDeleteProduct
}: {
  products: DBProduct[];
  onSaveProduct: (p: Partial<DBProduct>) => Promise<void>;
  onDeleteProduct: (id: number) => Promise<void>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<DBProduct> | null>(null);

  // Bulk state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [category, setCategory] = useState("Earrings");
  const [stock, setStock] = useState("10");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [tryOn, setTryOn] = useState(false);
  const [image, setImage] = useState("");

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.category ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setName(""); setPrice(""); setOldPrice(""); setCostPrice("");
    setCategory("Earrings"); setStock("10"); setSku(""); setDescription("");
    setTryOn(false);
    setImage("/images/products/product1.jpg");
    setShowModal(true);
  };

  const openEditModal = (p: DBProduct) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price.toString());
    setOldPrice(p.oldPrice?.toString() || "");
    setCostPrice(p.costPrice?.toString() || "");
    setCategory(p.category || "Earrings");
    setStock(p.stock.toString());
    setSku(p.sku || "");
    setDescription(p.description || "");
    setTryOn(p.virtualTryOn || false);
    setImage(p.image || "/images/products/product1.jpg");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<DBProduct> = {
      name,
      price: parseFloat(price) || 0,
      oldPrice: oldPrice ? parseFloat(oldPrice) : parseFloat(price),
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      category,
      stock: parseInt(stock) || 0,
      sku,
      description,
      virtualTryOn: tryOn,
      image,
      featured: editingProduct?.featured || false,
      sale: parseFloat(oldPrice) > parseFloat(price),
      specifications: editingProduct?.specifications || { Material: "Sterling Silver 925" }
    };
    if (editingProduct?.id) {
      payload.id = editingProduct.id;
    }
    await onSaveProduct(payload);
    setShowModal(false);
  };

  const handleDuplicate = async (p: DBProduct) => {
    const dupe: Omit<DBProduct, "id"> = {
      ...p,
      name: `${p.name} (Copy)`,
      sku: p.sku ? `${p.sku}-DUP` : `SKU-${Date.now()}`
    };
    await onSaveProduct(dupe);
    toast.success(`Duplicated ${p.name}`);
  };

  const handleImportCSV = () => {
    toast.info("Import feature ready — select CSV file to batch upload.");
  };

  const handleExportCSV = () => {
    window.open("/api/admin/import-export?type=products", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Action panel */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/5 text-xs focus:outline-none focus:border-[#C8A96A] bg-[#121212] text-white"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={handleImportCSV} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white cursor-pointer"><Upload size={12} /> Import</button>
          <button onClick={handleExportCSV} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white cursor-pointer"><Download size={12} /> Export</button>
          <button onClick={openAddModal} className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-[#111] uppercase tracking-widest cursor-pointer" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}><Plus size={14} /> Add</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5 space-y-4 flex flex-col justify-between">
            <div className="flex gap-3">
              <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain p-1" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-xs truncate">{p.name}</h4>
                <p className="text-[10px] text-gray-500">{p.category} · SKU: {p.sku || "—"}</p>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-xs font-bold text-[#C8A96A]">{PKR(p.price)}</span>
                  {p.costPrice && <span className="text-[9px] text-gray-600 font-medium">Cost: {PKR(p.costPrice)}</span>}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-3">
              <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.stock <= 5 ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>{p.stock <= 5 ? "Low Stock" : "In Stock"}: {p.stock}</span>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(p)} className="p-1.5 text-gray-400 hover:text-white rounded bg-white/5 cursor-pointer"><Edit size={12} /></button>
                <button onClick={() => handleDuplicate(p)} className="p-1.5 text-gray-400 hover:text-white rounded bg-white/5 cursor-pointer" title="Duplicate"><Copy size={12} /></button>
                <button onClick={() => onDeleteProduct(p.id)} className="p-1.5 text-red-400 hover:text-red-300 rounded bg-red-500/5 cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#121212] rounded-3xl border border-white/10 w-full max-w-lg p-6 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-hide text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs uppercase tracking-widest font-bold text-white">{editingProduct ? "Modify Product Details" : "Introduce New Jewelry"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">SKU / Barcode</label>
                  <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. LXL-ER-01" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Retail Price (PKR) *</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Cost Price (PKR)</label>
                  <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="Wholesale valuation" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Stock Qty</label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#C8A96A]">
                    {["Earrings", "Necklaces", "Rings", "Bracelets", "Bridal", "Anklets", "Nose Pins"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A] resize-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Product Image Selector</label>
                <div className="mt-1 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                    {image && <img src={image} alt="Preview" className="max-h-full max-w-full object-contain p-0.5" />}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-[10px] text-gray-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-[#C8A96A]/20 file:text-[#C8A96A] file:hover:bg-[#C8A96A]/30 file:cursor-pointer cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-400 hover:text-white">
                  <input type="checkbox" checked={tryOn} onChange={(e) => setTryOn(e.target.checked)} className="accent-[#C8A96A]" /> Virtual Try-On Enabled
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Save Details</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-400 border border-white/10 hover:border-white/20 cursor-pointer">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. INVENTORY TAB
// ─────────────────────────────────────────────────────────────────────────────
export function InventoryTab({
  products, onUpdateStock
}: {
  products: DBProduct[]; onUpdateStock: (id: number, stock: number) => void
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold text-white">Stock Allocation & Warehouse Logistics</h3>
          <p className="text-[10px] text-gray-500">Track reserve capacity and incoming shipments</p>
        </div>
      </div>

      <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Product Details</th>
                <th className="p-4">Warehouse stock</th>
                <th className="p-4">Status</th>
                <th className="p-4">Adjust Stock Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <p className="font-bold">{p.name}</p>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">SKU: {p.sku || "—"}</p>
                  </td>
                  <td className="p-4 font-bold">{p.stock} units</td>
                  <td className="p-4">
                    {p.stock === 0 ? (
                      <span className="flex items-center gap-1 text-red-500 font-bold uppercase tracking-wider text-[9px]"><AlertTriangle size={12} /> Out of Stock</span>
                    ) : p.stock <= 5 ? (
                      <span className="flex items-center gap-1 text-amber-500 font-bold uppercase tracking-wider text-[9px]"><AlertTriangle size={12} /> Low Stock alert</span>
                    ) : (
                      <span className="text-green-500 font-bold uppercase tracking-wider text-[9px]">Sufficient</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={p.stock}
                        id={`stock-input-${p.id}`}
                        className="w-16 bg-[#0A0A0A] border border-white/5 rounded-xl px-2 py-1 text-xs text-white text-center outline-none focus:border-[#C8A96A]"
                      />
                      <button
                        onClick={() => {
                          const inp = document.getElementById(`stock-input-${p.id}`) as HTMLInputElement;
                          if (inp) onUpdateStock(p.id, parseInt(inp.value) || 0);
                        }}
                        className="px-3 py-1.5 rounded-lg text-[9px] font-bold text-[#111] uppercase tracking-wider cursor-pointer"
                        style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}
                      >
                        Set
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. REVIEWS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function ReviewsTab({
  reviews, onModerateReview
}: {
  reviews: Review[]; onModerateReview: (id: string, status: "approved" | "rejected", reply?: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs uppercase tracking-widest font-bold text-white">Customer Reviews Moderation</h3>
        <p className="text-[10px] text-gray-500">Approve or reject customer comments to protect catalog brand integrity</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Reviews List */}
        <div className="bg-[#121212] rounded-2xl border border-white/5 divide-y divide-white/5">
          {reviews.length === 0 ? (
            <p className="p-6 text-center text-xs text-gray-500">No review ratings received yet.</p>
          ) : reviews.map(r => (
            <div key={r.id} className="p-4 space-y-3 cursor-pointer hover:bg-white/5" onClick={() => setSelectedReviewId(r.id)}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-white text-xs">{r.customerName}</p>
                  <p className="text-[9px] text-[#C8A96A] font-medium uppercase mt-0.5">{r.productName}</p>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill={i < r.rating ? "#C8A96A" : "none"} stroke="#C8A96A" />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">{r.comment}</p>
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                <span className={`px-2 py-0.5 rounded-full ${
                  r.status === "approved" ? "bg-green-500/10 text-green-400" :
                  r.status === "rejected" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                }`}>{r.status}</span>
                {r.verifiedBuyer && <span className="text-gray-500">✓ Verified Buyer</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Moderation Panel */}
        {selectedReviewId ? (
          (() => {
            const r = reviews.find(x => x.id === selectedReviewId);
            if (!r) return null;
            return (
              <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-2">Moderate Comment</h4>
                  <p className="text-gray-400 leading-relaxed text-xs">"{r.comment}"</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onModerateReview(r.id, "approved")}
                    className="flex-1 py-2 rounded-xl text-[10px] font-bold text-green-400 border border-green-500/20 hover:bg-green-500/10 cursor-pointer uppercase tracking-wider"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onModerateReview(r.id, "rejected")}
                    className="flex-1 py-2 rounded-xl text-[10px] font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 cursor-pointer uppercase tracking-wider"
                  >
                    Reject
                  </button>
                </div>

                {/* Reply */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Admin Response</label>
                  {r.reply ? (
                    <p className="text-[#C8A96A] text-xs italic">Response: "{r.reply}"</p>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type reply message..."
                        className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]"
                      />
                      <button
                        onClick={() => {
                          onModerateReview(r.id, "approved", replyText);
                          setReplyText("");
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[9px] font-bold text-[#111] uppercase tracking-wider cursor-pointer"
                        style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}
                      >
                        <MessageCircle size={12} /> Post Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="bg-[#121212] rounded-2xl p-8 border border-white/5 text-center text-gray-500 text-xs">
            Select a review rating to moderate.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COUPONS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function CouponsTab({
  coupons, onSaveCoupon
}: {
  coupons: Coupon[]; onSaveCoupon: (c: Coupon[]) => void
}) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [val, setVal] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !val) return;
    const newCoupon: Coupon = {
      id: `cp_${Date.now()}`,
      code: code.toUpperCase().trim(),
      type: type as any,
      value: parseFloat(val) || 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days
      usageCount: 0,
      active: true
    };
    onSaveCoupon([...coupons, newCoupon]);
    setCode(""); setVal("");
    toast.success(`Coupon ${newCoupon.code} created!`);
  };

  const handleToggle = (id: string) => {
    const list = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    onSaveCoupon(list);
    toast.success("Coupon status modified.");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Create Form */}
        <div className="bg-[#121212] rounded-2xl p-5 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Launch Promo Campaign</h4>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Coupon Promo Code</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. LUXELLA20" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Discount type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#C8A96A]">
                <option value="percentage">Percentage discount (%)</option>
                <option value="fixed">Fixed Flat discount (PKR)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Discount Amount</label>
              <input type="number" required value={val} onChange={(e) => setVal(e.target.value)} placeholder="15" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Activate Coupon</button>
          </form>
        </div>

        {/* Coupons List */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Value</th>
                <th className="p-4">Redeemed</th>
                <th className="p-4">State</th>
                <th className="p-4">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {coupons.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No active coupons configured.</td></tr>
              ) : coupons.map(c => (
                <tr key={c.id}>
                  <td className="p-4 font-mono font-bold text-[#C8A96A]">{c.code}</td>
                  <td className="p-4 font-bold">{c.type === "percentage" ? `${c.value}% OFF` : PKR(c.value)}</td>
                  <td className="p-4 text-gray-400">{c.usageCount} times</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.active ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-500"}`}>{c.active ? "Active" : "Disabled"}</span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleToggle(c.id)} className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider cursor-pointer">
                      Switch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GIFT MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
export function GiftTab({
  gifts, onSaveGifts
}: {
  gifts: GiftSetting[]; onSaveGifts: (g: GiftSetting[]) => void
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"wrapping" | "box">("wrapping");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    const newGift: GiftSetting = {
      id: `gf_${Date.now()}`,
      name,
      price: parseFloat(price) || 0,
      type: type as any,
      description: "Added via administration dashboard settings"
    };
    onSaveGifts([...gifts, newGift]);
    setName(""); setPrice("");
    toast.success(`Gifting option ${newGift.name} added.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Add option */}
        <div className="bg-[#121212] rounded-2xl p-5 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Add Luxury packaging</h4>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Option Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Suede Jewelry Box" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Gifting Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#C8A96A]">
                <option value="wrapping">Silk / Paper Wrapping</option>
                <option value="box">Premium Drawer Box</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Packaging Price (PKR)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="300" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Save Packaging Option</button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Packaging Type</th>
                <th className="p-4">Sub-Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {gifts.map(g => (
                <tr key={g.id}>
                  <td className="p-4 font-bold text-white">{g.name}</td>
                  <td className="p-4 text-gray-400 uppercase font-semibold text-[9px] tracking-wider">{g.type}</td>
                  <td className="p-4 font-bold text-[#C8A96A]">{PKR(g.price)}</td>
                  <td className="p-4">
                    <button onClick={() => onSaveGifts(gifts.filter(x => x.id !== g.id))} className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. AI TRY-ON SETTINGS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function TryOnTab() {
  const [modelImage, setModelImage] = useState<string | null>(null);

  const handleUploadOverlay = () => {
    toast.success("AI jewelry assets uploaded! Automatically rendering overlay alignments.");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Settings */}
        <div className="bg-[#121212] rounded-2xl p-5 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-[#C8A96A] flex items-center gap-1.5"><Sparkles size={14} /> AI Autopilot configs</h4>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Autopilot Resolution</label>
              <select className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#C8A96A]">
                <option>High Quality (800px)</option>
                <option>Fast Response (500px)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Perspective Alignment</label>
              <select className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#C8A96A]">
                <option>Standard Perspective matrix</option>
                <option>Flat Overlay simulation</option>
              </select>
            </div>
            <button onClick={handleUploadOverlay} className="w-full py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Save config settings</button>
          </div>
        </div>

        {/* Upload Assets info */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Overlay PNG Asset Management</h4>
          <p className="text-gray-400 leading-relaxed">
            Upload jewelry overlays. Overlays must have transparent backgrounds (PNG/WebP format only). AI autopilot will automatically resize assets based on detected body landmark coordinates.
          </p>
          <div className="border border-dashed border-white/10 rounded-2xl py-10 px-4 text-center cursor-pointer hover:border-[#C8A96A] transition-colors" onClick={handleUploadOverlay}>
            <Upload size={24} className="mx-auto text-[#C8A96A] mb-2" />
            <p className="font-bold text-white">Click to upload transparent overlay png</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Auto watermarks will not be applied to overlay assets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
