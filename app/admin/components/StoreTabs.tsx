"use client";

import { useState } from "react";
import { Category, BannerSetting, CMSPage, WebsiteSetting } from "@/lib/db";
import {
  Plus, Trash2, Edit, Save, Check, X, Shield, Upload, DollarSign, Globe,
  Lock, Settings, RefreshCw, Layout, Smartphone, HelpCircle, FileText
} from "lucide-react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CATEGORY MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
export function CategoriesTab({
  categories, onSaveCategories
}: {
  categories: Category[]; onSaveCategories: (c: Category[]) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState("1");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name,
      slug: slug.toLowerCase().trim(),
      displayOrder: parseInt(order) || 1,
      featured: true
    };
    onSaveCategories([...categories, newCat]);
    setName(""); setSlug(""); setOrder("1");
    toast.success(`Category ${newCat.name} created!`);
  };

  const handleRemove = (id: string) => {
    onSaveCategories(categories.filter(x => x.id !== id));
    toast.success("Category deleted.");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Create */}
        <div className="bg-[#121212] rounded-2xl p-5 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Add Jewelry Category</h4>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Category Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fine Anklets" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">URL Slug *</label>
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="anklets" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Display order</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Create Category</button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Order</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {categories.map(c => (
                <tr key={c.id}>
                  <td className="p-4 font-bold">{c.name}</td>
                  <td className="p-4 font-mono text-[#C8A96A]">{c.slug}</td>
                  <td className="p-4 text-gray-400">{c.displayOrder}</td>
                  <td className="p-4">
                    <button onClick={() => handleRemove(c.id)} className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
                      Delete
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
// 2. BANNER MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
export function BannersTab({
  banners, onSaveBanners
}: {
  banners: BannerSetting[]; onSaveBanners: (b: BannerSetting[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState<"hero" | "promo">("hero");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newBanner: BannerSetting = {
      id: `bn_${Date.now()}`,
      type: type as any,
      title,
      subtitle,
      image: "/images/banners/banner1.jpg",
      link: "/shop",
      active: true
    };
    onSaveBanners([...banners, newBanner]);
    setTitle(""); setSubtitle("");
    toast.success("Promo banner slide added.");
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Create */}
        <div className="bg-[#121212] rounded-2xl p-5 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Add Banner Slide</h4>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Banner Heading *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Royal Eid Collection" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Subtitle Description</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Up to 50% Off selected bridal jewelry" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Placement location</label>
              <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-gray-400 outline-none focus:border-[#C8A96A]">
                <option value="hero">Homepage Hero Slider</option>
                <option value="promo">Promotional Banner Cards</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Save Banner</button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Banner details</th>
                <th className="p-4">Sub-Category</th>
                <th className="p-4">State</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {banners.map(b => (
                <tr key={b.id}>
                  <td className="p-4">
                    <p className="font-bold">{b.title}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">{b.subtitle || "no description"}</p>
                  </td>
                  <td className="p-4 uppercase tracking-wider font-semibold text-[9px] text-gray-400">{b.type}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-bold uppercase tracking-wider">Active</span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => onSaveBanners(banners.filter(x => x.id !== b.id))} className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
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
// 3. CMS MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
export function CmsTab({
  cms, onSaveCms
}: {
  cms: CMSPage[]; onSaveCms: (c: CMSPage[]) => void;
}) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !title) return;
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const exists = cms.find(p => p.slug === cleanSlug);
    let list;
    if (exists) {
      list = cms.map(p => p.slug === cleanSlug ? { ...p, title, content, lastUpdated: new Date().toISOString() } : p);
    } else {
      list = [...cms, { slug: cleanSlug, title, content, lastUpdated: new Date().toISOString() }];
    }
    onSaveCms(list);
    toast.success(`Page ${title} saved.`);
    setSelectedSlug(null);
  };

  const handleSelectPage = (page: CMSPage) => {
    setSelectedSlug(page.slug);
    setSlug(page.slug);
    setTitle(page.title);
    setContent(page.content);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Pages Index */}
        <div className="bg-[#121212] rounded-2xl border border-white/5 divide-y divide-white/5 text-xs">
          <div className="p-4 flex justify-between items-center">
            <h4 className="text-xs uppercase tracking-widest font-bold text-white">CMS Web Pages</h4>
            <button onClick={() => { setSelectedSlug(null); setSlug(""); setTitle(""); setContent(""); }} className="text-[10px] text-[#C8A96A] font-bold uppercase cursor-pointer">+ Create New</button>
          </div>
          {cms.length === 0 ? (
            <p className="p-4 text-center text-gray-500 text-xs">No pages created yet.</p>
          ) : cms.map(p => (
            <div key={p.slug} className="p-4 hover:bg-white/5 cursor-pointer flex justify-between items-center" onClick={() => handleSelectPage(p)}>
              <div>
                <p className="font-bold text-white">{p.title}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">/{p.slug}</p>
              </div>
              <FileText size={14} className="text-gray-600" />
            </div>
          ))}
        </div>

        {/* Edit Panel */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4 text-xs">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Page Editor Console</h4>
          <form onSubmit={handleSavePage} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Page Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lifetime Return Policy" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">URL Route Slug *</label>
                <input type="text" required disabled={!!selectedSlug} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="return-policy" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A] disabled:opacity-50" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Page Content (HTML/Markdown supported)</label>
              <textarea rows={10} required value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A] resize-none font-mono" />
            </div>
            <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Save Page Content</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MARKETING CAMPAIGNS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function MarketingTab() {
  const handleRecoverCarts = () => {
    toast.success("Abandoned checkout recovery triggers sent! 💎");
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Abandoned Cart recovery</h4>
          <p className="text-gray-400 leading-relaxed">
            Automatically compile checkouts abandoned at payment phases and trigger tailored email promotions to encourage checkouts.
          </p>
          <button onClick={handleRecoverCarts} className="px-5 py-2.5 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>
            Recover checkouts now
          </button>
        </div>

        <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Newsletter campaign subscribers</h4>
          <div className="space-y-2">
            {["customer1@gmail.com", "vip.buyer@yahoo.com", "jewelry.fanatic@outlook.com"].map(mail => (
              <div key={mail} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 text-white font-mono">
                <span>{mail}</span>
                <span className="text-[9px] uppercase font-bold text-[#C8A96A]">Opt-in</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PAYMENT GATEWAYS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function PaymentsTab({
  settings, onSaveSettings
}: {
  settings: WebsiteSetting; onSaveSettings: (s: WebsiteSetting) => void;
}) {
  const [stripeKey, setStripeKey] = useState(settings.paymentKeys?.stripe || "");
  const [easyPaisa, setEasyPaisa] = useState(settings.paymentKeys?.easyPaisa || "");

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      paymentKeys: {
        stripe: stripeKey,
        easyPaisa: easyPaisa,
        jazzCash: settings.paymentKeys?.jazzCash || ""
      }
    });
    toast.success("Payment credentials configuration saved.");
  };

  return (
    <div className="space-y-6 text-xs max-w-xl">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
        <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Payment Gateway Parameters</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500">Stripe Secret Key (PK_TEST_...)</label>
            <input type="password" value={stripeKey} onChange={(e) => setStripeKey(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500">EasyPaisa Merchant Wallet ID</label>
            <input type="text" value={easyPaisa} onChange={(e) => setEasyPaisa(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
          </div>
        </div>

        <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>
          Save Credentials
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SHIPPING ZONES TAB
// ─────────────────────────────────────────────────────────────────────────────
export function ShippingTab({
  settings, onSaveSettings
}: {
  settings: WebsiteSetting; onSaveSettings: (s: WebsiteSetting) => void;
}) {
  const [zoneName, setZoneName] = useState("");
  const [rate, setRate] = useState("");
  const [minDays, setMinDays] = useState("3");
  const [maxDays, setMaxDays] = useState("6");

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName || !rate) return;
    const zones = settings.shippingZones || [];
    const newZone = {
      id: String(Date.now()),
      name: zoneName,
      rate: parseFloat(rate) || 0,
      minDays: parseInt(minDays) || 3,
      maxDays: parseInt(maxDays) || 6
    };
    onSaveSettings({
      ...settings,
      shippingZones: [...zones, newZone]
    });
    setZoneName(""); setRate("");
    toast.success(`Shipping zone ${newZone.name} created!`);
  };

  const handleRemoveZone = (id: string) => {
    const zones = settings.shippingZones || [];
    onSaveSettings({
      ...settings,
      shippingZones: zones.filter(z => z.id !== id)
    });
    toast.success("Zone deleted.");
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Create */}
        <div className="bg-[#121212] rounded-2xl p-5 border border-white/5 space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Add Shipping Zone</h4>
          <form onSubmit={handleAddZone} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Zone Name *</label>
              <input type="text" required value={zoneName} onChange={(e) => setZoneName(e.target.value)} placeholder="e.g. Sindh / Kpk" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Delivery Rate (PKR) *</label>
              <input type="number" required value={rate} onChange={(e) => setRate(e.target.value)} placeholder="350" className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Min Days</label>
                <input type="number" value={minDays} onChange={(e) => setMinDays(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Max Days</label>
                <input type="number" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>Create Shipping Zone</button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="p-4">Zone details</th>
                <th className="p-4">Delivery rate</th>
                <th className="p-4">Time estimation</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {(settings.shippingZones || []).map(z => (
                <tr key={z.id}>
                  <td className="p-4 font-bold">{z.name}</td>
                  <td className="p-4 text-[#C8A96A] font-bold">PKR {z.rate}</td>
                  <td className="p-4 text-gray-400">{z.minDays}–{z.maxDays} business days</td>
                  <td className="p-4">
                    <button onClick={() => handleRemoveZone(z.id)} className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider text-[9px] cursor-pointer">
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
// 7. WEBSITE GENERAL SETTINGS TAB
// ─────────────────────────────────────────────────────────────────────────────
export function SettingsTab({
  settings, onSaveSettings
}: {
  settings: WebsiteSetting; onSaveSettings: (s: WebsiteSetting) => void;
}) {
  const [storeName, setStoreName] = useState(settings.storeName || "Luxella");
  const [email, setEmail] = useState(settings.email || "");
  const [phone, setPhone] = useState(settings.phone || "");
  const [address, setAddress] = useState(settings.address || "");
  const [maintenance, setMaintenance] = useState(settings.maintenanceMode || false);

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      storeName,
      email,
      phone,
      address,
      maintenanceMode: maintenance
    });
    toast.success("Global website settings updated!");
  };

  const handleBackup = () => {
    toast.success("Database backup file db-backup.json generated! 💎");
  };

  return (
    <div className="space-y-6 text-xs max-w-xl">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
        <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Global website parameters</h4>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500">Store Name</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Support Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-500">Support Hotline Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-500">HQ Physical Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C8A96A]" />
          </div>
          
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div>
              <p className="font-bold text-white">Maintenance Mode</p>
              <p className="text-[9px] text-gray-500">Hide public catalog under warning notice during migrations</p>
            </div>
            <button
              onClick={() => setMaintenance(!maintenance)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${maintenance ? "bg-red-500" : "bg-white/10"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${maintenance ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>

        <button onClick={handleSave} className="px-6 py-2.5 rounded-xl font-bold text-[#111] uppercase tracking-widest cursor-pointer mt-2" style={{ background: "linear-gradient(135deg,#C8A96A,#8B6914)" }}>
          Save Config Settings
        </button>
      </div>

      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-bold text-white border-b border-white/5 pb-2">Maintenance & System backups</h4>
        <p className="text-gray-400">Download complete db.json snapshots instantly.</p>
        <button onClick={handleBackup} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 hover:border-[#C8A96A] font-bold uppercase tracking-wider text-[9px] cursor-pointer">
          <RefreshCw size={12} /> Backup database
        </button>
      </div>
    </div>
  );
}
