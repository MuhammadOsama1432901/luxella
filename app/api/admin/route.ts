import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  getCategories, saveCategories,
  getReviews, saveReviews,
  getCoupons, saveCoupons,
  getGifts, saveGifts,
  getBanners, saveBanners,
  getCmsPages, saveCmsPages,
  getSettings, saveSettings,
  getSystemLogs, createSystemLog,
  getUsers, updateUser,
  getProducts, getOrders
} from "@/lib/db";

// Helper to check if current user is admin/staff
async function checkStaff() {
  const session = await getSession();
  if (!session) return null;
  const isStaff = ["super_admin", "admin", "manager", "inventory", "support", "marketing"].includes(session.role);
  return isStaff ? session : null;
}

// GET: Fetch all admin collections for dashboard tabs
export async function GET(req: Request) {
  const session = await checkStaff();
  if (!session) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const [
      categories, reviews, coupons, gifts, banners,
      cms, settings, logs, users, products, orders
    ] = await Promise.all([
      getCategories(), getReviews(), getCoupons(), getGifts(), getBanners(),
      getCmsPages(), getSettings(), getSystemLogs(), getUsers(), getProducts(), getOrders()
    ]);

    // Aggregate statistics
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todaySales = todayOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

    const activeOrders = orders.filter(o => o.status !== "cancelled");
    const monthlyRevenue = activeOrders.reduce((s, o) => s + o.total, 0); // simplifed all active orders total

    const stats = {
      todaySales,
      monthlyRevenue,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
      completedOrders: orders.filter(o => o.status === "delivered").length,
      cancelledOrders: orders.filter(o => o.status === "cancelled").length,
      customersCount: new Set(orders.map(o => o.customer.phone || o.customer.email)).size,
      productsCount: products.length,
      lowStockCount: products.filter(p => p.stock <= 5).length,
      conversionRate: 3.2, // mock value
      tryOnUsageCount: 412, // mock value
    };

    return NextResponse.json({
      categories,
      reviews,
      coupons,
      gifts,
      banners,
      cms,
      settings,
      logs,
      users,
      stats
    });
  } catch (err) {
    console.error("[admin get]", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

// POST: Handles custom actions/updates from tabs
export async function POST(req: Request) {
  const session = await checkStaff();
  if (!session) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    const ip = req.headers.get("x-forwarded-for") || undefined;

    switch (action) {
      // ── Categories
      case "save_categories":
        await saveCategories(payload);
        await createSystemLog(session.userId, session.name, "update_categories", "Updated categories list", ip);
        return NextResponse.json({ success: true });

      // ── Reviews
      case "save_reviews":
        await saveReviews(payload);
        await createSystemLog(session.userId, session.name, "moderate_reviews", "Moderated product reviews", ip);
        return NextResponse.json({ success: true });

      // ── Coupons
      case "save_coupons":
        await saveCoupons(payload);
        await createSystemLog(session.userId, session.name, "update_coupons", "Updated coupon campaigns list", ip);
        return NextResponse.json({ success: true });

      // ── Gifts
      case "save_gifts":
        await saveGifts(payload);
        await createSystemLog(session.userId, session.name, "update_gifts", "Updated packaging gift pricing and details", ip);
        return NextResponse.json({ success: true });

      // ── Banners
      case "save_banners":
        await saveBanners(payload);
        await createSystemLog(session.userId, session.name, "update_banners", "Updated promotional sliders and banners", ip);
        return NextResponse.json({ success: true });

      // ── CMS Page
      case "save_cms":
        await saveCmsPages(payload);
        await createSystemLog(session.userId, session.name, "update_cms", "Modified pages / policy guidelines via CMS", ip);
        return NextResponse.json({ success: true });

      // ── Website settings
      case "save_settings":
        await saveSettings(payload);
        await createSystemLog(session.userId, session.name, "update_settings", "Modified global store configurations", ip);
        return NextResponse.json({ success: true });

      // ── Staff management
      case "update_user_role":
        const { userId, role } = payload;
        await updateUser(userId, { role });
        await createSystemLog(session.userId, session.name, "update_staff_role", `Changed user role for ${userId} to ${role}`, ip);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }
  } catch (err) {
    console.error("[admin post]", err);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
