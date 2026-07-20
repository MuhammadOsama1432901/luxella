import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { 
  getAnnouncements, saveAnnouncements,
  getCoupons, saveCoupons,
  getFlashSales, saveFlashSales,
  getPromotions, savePromotions,
  createSystemLog
} from "@/lib/db";

// Helper to check if current user is admin/marketing staff
async function checkStaff() {
  const session = await getSession();
  if (!session) return null;
  const allowed = ["super_admin", "admin", "manager", "marketing"];
  return allowed.includes(session.role) ? session : null;
}

// GET: Retrieves list of announcements, coupons, promotions, and flash sales
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "announcements") {
      const announcements = await getAnnouncements();
      return NextResponse.json({ announcements });
    }
    if (type === "coupons") {
      const coupons = await getCoupons();
      return NextResponse.json({ coupons });
    }
    if (type === "flash") {
      const flashSales = await getFlashSales();
      return NextResponse.json({ flashSales });
    }
    if (type === "promotions") {
      const promotions = await getPromotions();
      return NextResponse.json({ promotions });
    }

    // Unified payload for offers page / admin loading
    const [announcements, coupons, flashSales, promotions] = await Promise.all([
      getAnnouncements(),
      getCoupons(),
      getFlashSales(),
      getPromotions()
    ]);

    // Populate flash sales with real product info dynamically
    // Wait, let's fetch products list to merge details like name and image
    const prodRes = await fetch(new URL("/api/products", req.url).toString());
    const products = prodRes.ok ? await prodRes.json() : [];

    const enrichedFlashSales = flashSales.map(fs => ({
      ...fs,
      products: fs.products.map(p => {
        const prod = products.find((op: any) => op.id === p.productId);
        return {
          ...p,
          name: prod?.name || `Product #${p.productId}`,
          image: prod?.image || "/images/products/product1.jpg",
          price: prod?.price || 0
        };
      })
    }));

    return NextResponse.json({
      announcements,
      coupons,
      flashSales: enrichedFlashSales,
      promotions
    });
  } catch (err) {
    console.error("[promotions get error]", err);
    return NextResponse.json({ error: "Failed to load promotions" }, { status: 500 });
  }
}

// POST: Manage campaigns (Create/Edit/Delete promotions, coupons, announcements, flash sales)
export async function POST(req: Request) {
  const session = await checkStaff();
  if (!session) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const { action, payload } = await req.json();
    const ip = req.headers.get("x-forwarded-for") || undefined;

    switch (action) {
      // ── Announcements
      case "create_announcement": {
        const list = await getAnnouncements();
        list.push(payload);
        await saveAnnouncements(list);
        await createSystemLog(session.userId, session.name, "create_announcement", `Created announcement message: "${payload.text}"`, ip);
        return NextResponse.json({ success: true });
      }
      case "update_announcement": {
        let list = await getAnnouncements();
        list = list.map(a => a.id === payload.id ? payload : a);
        await saveAnnouncements(list);
        await createSystemLog(session.userId, session.name, "update_announcement", `Updated announcement: "${payload.text}"`, ip);
        return NextResponse.json({ success: true });
      }

      // ── Coupons
      case "create_coupon": {
        const list = await getCoupons();
        list.push(payload);
        await saveCoupons(list);
        await createSystemLog(session.userId, session.name, "create_coupon", `Created coupon code: "${payload.code}"`, ip);
        return NextResponse.json({ success: true });
      }
      case "update_coupon": {
        let list = await getCoupons();
        list = list.map(c => c.id === payload.id ? payload : c);
        await saveCoupons(list);
        await createSystemLog(session.userId, session.name, "update_coupon", `Updated coupon: "${payload.code}"`, ip);
        return NextResponse.json({ success: true });
      }

      // ── Promotions / Banners
      case "create_promotion": {
        const list = await getPromotions();
        list.push(payload);
        await savePromotions(list);
        await createSystemLog(session.userId, session.name, "create_promotion", `Created banner campaign: "${payload.title}"`, ip);
        return NextResponse.json({ success: true });
      }
      case "update_promotion": {
        let list = await getPromotions();
        list = list.map(p => p.id === payload.id ? payload : p);
        await savePromotions(list);
        await createSystemLog(session.userId, session.name, "update_promotion", `Updated campaign: "${payload.title}"`, ip);
        return NextResponse.json({ success: true });
      }

      // ── Flash Sales
      case "create_flash_sale": {
        const list = await getFlashSales();
        list.push(payload);
        await saveFlashSales(list);
        await createSystemLog(session.userId, session.name, "create_flash_sale", `Created flash campaign: "${payload.title}"`, ip);
        return NextResponse.json({ success: true });
      }
      case "update_flash_sale": {
        let list = await getFlashSales();
        list = list.map(fs => fs.id === payload.id ? payload : fs);
        await saveFlashSales(list);
        await createSystemLog(session.userId, session.name, "update_flash_sale", `Updated flash campaign: "${payload.title}"`, ip);
        return NextResponse.json({ success: true });
      }

      // ── Delete operation
      case "delete_item": {
        const { type, id } = payload;
        if (type === "announcement") {
          let list = await getAnnouncements();
          list = list.filter(a => a.id !== id);
          await saveAnnouncements(list);
        } else if (type === "coupon") {
          let list = await getCoupons();
          list = list.filter(c => c.id !== id);
          await saveCoupons(list);
        } else if (type === "promotion") {
          let list = await getPromotions();
          list = list.filter(p => p.id !== id);
          await savePromotions(list);
        } else if (type === "flash_sale") {
          let list = await getFlashSales();
          list = list.filter(fs => fs.id !== id);
          await saveFlashSales(list);
        }
        await createSystemLog(session.userId, session.name, "delete_campaign_item", `Deleted campaign ${type}: ${id}`, ip);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (err) {
    console.error("[promotions post error]", err);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
