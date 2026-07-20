"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Order, DBProduct, DBUser, Category, Review, Coupon, GiftSetting, BannerSetting, CMSPage, WebsiteSetting } from "@/lib/db";
import {
  LayoutDashboard, ShoppingBag, Box, Boxes, FolderOpen, Star, Ticket, Gift, Sparkles,
  Image, FileText, Send, CreditCard, Truck, Users, BarChart2, Shield, Settings,
  LogOut, RefreshCw, AlertTriangle, Percent
} from "lucide-react";
import { toast } from "sonner";

// Tab Subcomponents
import { DashboardTab, OrdersTab, CustomersTab, ReportsTab, UsersTab } from "@/app/admin/components/SalesTabs";
import { ProductsTab, InventoryTab, ReviewsTab, CouponsTab, GiftTab, TryOnTab } from "@/app/admin/components/ProductTabs";
import { CategoriesTab, BannersTab, CmsTab, MarketingTab, PaymentsTab, ShippingTab, SettingsTab } from "@/app/admin/components/StoreTabs";
import { PromotionsTab } from "@/app/admin/components/PromotionsTab";

type TabKey =
  | "dashboard" | "orders" | "products" | "inventory" | "categories"
  | "reviews" | "coupons" | "gifts" | "tryon" | "banners"
  | "cms" | "marketing" | "payments" | "shipping" | "customers"
  | "reports" | "users" | "settings" | "promotions";

interface TabItem {
  key: TabKey;
  label: string;
  category: "sales" | "catalog" | "store";
  icon: React.ReactNode;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [loading, setLoading] = useState(true);

  // Centralized State
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<DBUser[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [gifts, setGifts] = useState<GiftSetting[]>([]);
  const [banners, setBanners] = useState<BannerSetting[]>([]);
  const [cms, setCms] = useState<CMSPage[]>([]);
  const [settings, setSettings] = useState<WebsiteSetting | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // ── Initial Fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    try {
      // Validate Auth & Admin role
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        toast.error("Please login to access the admin portal.");
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      const allowedRoles = ["super_admin", "admin", "manager", "inventory", "support", "marketing"];
      if (!allowedRoles.includes(meData.user?.role)) {
        toast.error("Access denied. Authorized roles only.");
        router.push("/");
        return;
      }

      // Fetch unified admin payload
      const adminRes = await fetch("/api/admin");
      if (!adminRes.ok) throw new Error("Failed to load admin metadata");
      const adminData = await adminRes.json();

      setCategories(adminData.categories || []);
      setReviews(adminData.reviews || []);
      setCoupons(adminData.coupons || []);
      setGifts(adminData.gifts || []);
      setBanners(adminData.banners || []);
      setCms(adminData.cms || []);
      setSettings(adminData.settings || null);
      setLogs(adminData.logs || []);
      setUsers(adminData.users || []);
      setStats(adminData.stats || null);

      // Fetch base models
      const [prodRes, orderRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());

    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  // ── Database Updates (POST Dispatchers) ────────────────────────────────────
  async function triggerPostAction(action: string, payload: any) {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload })
      });
      if (!res.ok) throw new Error("POST dispatch action failed");
      toast.success("Changes successfully persisted.");
      fetchAdminData(); // reload
    } catch {
      toast.error("Failed to save changes.");
    }
  }

  // ── CRUD Handlers ──────────────────────────────────────────────────────────
  async function handleSaveProduct(p: Partial<DBProduct>) {
    try {
      const method = p.id ? "PUT" : "POST";
      const url = p.id ? `/api/products/${p.id}` : "/api/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      if (!res.ok) throw new Error("Save product failed");
      toast.success(p.id ? "Product updated." : "Product added.");
      fetchAdminData();
    } catch {
      toast.error("Could not save product details.");
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm("Are you sure you want to delete this jewelry item?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted.");
      fetchAdminData();
    } catch {
      toast.error("Failed to delete product.");
    }
  }

  async function handleUpdateOrderStatus(orderId: string, status: any, trackingNumber?: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber })
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Order status updated.");
      fetchAdminData();
    } catch {
      toast.error("Failed to update status.");
    }
  }

  // Customer handlers
  const handleToggleVip = async (phone: string) => {
    try {
      const res = await fetch("/api/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, action: "toggleVip" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`VIP status toggled for ${phone}`);
      fetchAdminData();
    } catch {
      toast.error("Failed to update VIP status.");
    }
  };

  const handleToggleBlock = async (phone: string) => {
    try {
      const res = await fetch("/api/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, action: "toggleBlock" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(`Block status toggled for ${phone}`);
      fetchAdminData();
    } catch {
      toast.error("Failed to update block status.");
    }
  };

  // ── Tab Configs ────────────────────────────────────────────────────────────
  const tabItems: TabItem[] = [
    // Sales Tab Category
    { key: "dashboard",  label: "Dashboard",  category: "sales",   icon: <LayoutDashboard size={14} /> },
    { key: "orders",     label: "Orders",     category: "sales",   icon: <ShoppingBag size={14} /> },
    { key: "customers",  label: "Customers",  category: "sales",   icon: <Users size={14} /> },
    { key: "promotions", label: "Promotions", category: "sales",   icon: <Percent size={14} style={{ color: "#C8A96A" }} /> },
    { key: "reports",    label: "Reports",    category: "sales",   icon: <BarChart2 size={14} /> },
    { key: "users",      label: "Staff",      category: "sales",   icon: <Shield size={14} /> },
    // Catalog Tab Category
    { key: "products",   label: "Products",   category: "catalog", icon: <Box size={14} /> },
    { key: "inventory",  label: "Inventory",  category: "catalog", icon: <Boxes size={14} /> },
    { key: "reviews",    label: "Reviews",    category: "catalog", icon: <Star size={14} /> },
    { key: "coupons",    label: "Coupons",    category: "catalog", icon: <Ticket size={14} /> },
    { key: "gifts",      label: "Gifting",    category: "catalog", icon: <Gift size={14} /> },
    // Store Tab Category
    { key: "categories", label: "Categories", category: "store",   icon: <FolderOpen size={14} /> },
    { key: "tryon",      label: "AI Try-On",    category: "store",   icon: <Sparkles size={14} /> },
    { key: "banners",    label: "Banners",    category: "store",   icon: <Image size={14} /> },
    { key: "cms",        label: "CMS Pages",  category: "store",   icon: <FileText size={14} /> },
    { key: "marketing",  label: "Marketing",  category: "store",   icon: <Send size={14} /> },
    { key: "payments",   label: "Payments",   category: "store",   icon: <CreditCard size={14} /> },
    { key: "shipping",   label: "Shipping",   category: "store",   icon: <Truck size={14} /> },
    { key: "settings",   label: "Settings",   category: "store",   icon: <Settings size={14} /> },
  ];

  // Group tabs by category
  const getTabsByCat = (cat: "sales" | "catalog" | "store") => tabItems.filter(t => t.category === cat);

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex bg-[#0A0A0A]">
        {/* ── Left Sidebar (Desktop) ──────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-60 bg-[#111] min-h-screen border-r border-white/5 pt-10 pb-6 px-4 space-y-6">
          <div>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-bold mb-1">Luxury Atelier</p>
            <p className="text-white text-base font-bold" style={{ fontFamily: "Georgia, serif" }}>Luxella Control</p>
          </div>

          {/* Group 1: Business Sales */}
          <div className="space-y-1">
            <p className="text-[9px] text-[#C8A96A] uppercase tracking-wider font-bold mb-2">Sales & Audience</p>
            {getTabsByCat("sales").map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-left",
                  activeTab === tab.key ? "text-[#111]" : "text-gray-500 hover:text-white hover:bg-white/5",
                ].join(" ")}
                style={activeTab === tab.key ? { background: "linear-gradient(135deg,#C8A96A,#8B6914)" } : {}}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Group 2: Product Catalog */}
          <div className="space-y-1">
            <p className="text-[9px] text-[#C8A96A] uppercase tracking-wider font-bold mb-2">Catalog & Promos</p>
            {getTabsByCat("catalog").map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-left",
                  activeTab === tab.key ? "text-[#111]" : "text-gray-500 hover:text-white hover:bg-white/5",
                ].join(" ")}
                style={activeTab === tab.key ? { background: "linear-gradient(135deg,#C8A96A,#8B6914)" } : {}}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Group 3: Store Settings */}
          <div className="space-y-1">
            <p className="text-[9px] text-[#C8A96A] uppercase tracking-wider font-bold mb-2">Atelier & Web Settings</p>
            {getTabsByCat("store").map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-left",
                  activeTab === tab.key ? "text-[#111]" : "text-gray-500 hover:text-white hover:bg-white/5",
                ].join(" ")}
                style={activeTab === tab.key ? { background: "linear-gradient(135deg,#C8A96A,#8B6914)" } : {}}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main View Panel ────────────────────────────────────────────── */}
        <main className="flex-1 lg:ml-0 py-10 px-4 sm:px-8 space-y-8">
          {/* Mobile navigation toggle bar */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/5">
            {tabItems.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider flex-shrink-0 cursor-pointer",
                  activeTab === tab.key ? "text-[#111]" : "bg-[#121212] text-gray-500 border border-white/5",
                ].join(" ")}
                style={activeTab === tab.key ? { background: "linear-gradient(135deg,#C8A96A,#8B6914)" } : {}}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#C8A96A] border-t-transparent animate-spin" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Authorizing & Fetching atelier logs...</p>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {/* Tab Renderer */}
              {activeTab === "dashboard"  && stats && <DashboardTab stats={stats} orders={orders} logs={logs} />}
              {activeTab === "orders"     && <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
              {activeTab === "customers"  && <CustomersTab customers={users} onToggleVip={handleToggleVip} onToggleBlock={handleToggleBlock} />}
              {activeTab === "reports"    && <ReportsTab orders={orders} />}
              {activeTab === "users"      && <UsersTab users={users} onUpdateRole={(userId, role) => triggerPostAction("update_user_role", { userId, role })} />}
              {activeTab === "promotions" && <PromotionsTab products={products} categories={categories} onRefresh={fetchAdminData} />}
              
              {activeTab === "products"   && <ProductsTab products={products} onSaveProduct={handleSaveProduct} onDeleteProduct={handleDeleteProduct} />}
              {activeTab === "inventory"  && <InventoryTab products={products} onUpdateStock={(id, stock) => handleSaveProduct({ id, stock })} />}
              {activeTab === "reviews"    && <ReviewsTab reviews={reviews} onModerateReview={(id, status, reply) => triggerPostAction("save_reviews", reviews.map(r => r.id === id ? { ...r, status, reply } : r))} />}
              {activeTab === "coupons"    && <CouponsTab coupons={coupons} onSaveCoupon={(c) => triggerPostAction("save_coupons", c)} />}
              {activeTab === "gifts"      && <GiftTab gifts={gifts} onSaveGifts={(g) => triggerPostAction("save_gifts", g)} />}
              {activeTab === "tryon"      && <TryOnTab />}

              {activeTab === "categories" && <CategoriesTab categories={categories} onSaveCategories={(c) => triggerPostAction("save_categories", c)} />}
              {activeTab === "banners"    && <BannersTab banners={banners} onSaveBanners={(b) => triggerPostAction("save_banners", b)} />}
              {activeTab === "cms"        && <CmsTab cms={cms} onSaveCms={(c) => triggerPostAction("save_cms", c)} />}
              {activeTab === "marketing"  && <MarketingTab />}
              {activeTab === "payments"   && settings && <PaymentsTab settings={settings} onSaveSettings={(s) => triggerPostAction("save_settings", s)} />}
              {activeTab === "shipping"   && settings && <ShippingTab settings={settings} onSaveSettings={(s) => triggerPostAction("save_settings", s)} />}
              {activeTab === "settings"   && settings && <SettingsTab settings={settings} onSaveSettings={(s) => triggerPostAction("save_settings", s)} />}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
