import { NextResponse } from "next/server";
import { getOrders, readDB, writeDB } from "@/lib/db";

export async function GET() {
  try {
    const orders = await getOrders();

    const customerMap = new Map<string, {
      name: string;
      phone: string;
      email: string;
      address: string;
      city: string;
      totalOrders: number;
      totalSpend: number;
      lastOrderAt: string;
      status: string;
      isVip?: boolean;
      isBlocked?: boolean;
    }>();

    const db = await readDB();
    const customerMeta: Record<string, { isVip?: boolean; isBlocked?: boolean }> =
      db.customerMeta || {};

    for (const order of orders) {
      const key = order.customer.phone || order.customer.email;
      if (!key) continue;
      if (customerMap.has(key)) {
        const existing = customerMap.get(key)!;
        existing.totalOrders += 1;
        existing.totalSpend += order.total;
        if (order.createdAt > existing.lastOrderAt) {
          existing.lastOrderAt = order.createdAt;
          existing.status = order.status;
        }
      } else {
        customerMap.set(key, {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email,
          address: order.customer.address,
          city: order.customer.city,
          totalOrders: 1,
          totalSpend: order.total,
          lastOrderAt: order.createdAt,
          status: order.status,
          isVip: customerMeta[key]?.isVip ?? false,
          isBlocked: customerMeta[key]?.isBlocked ?? false,
        });
      }
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
    );

    return NextResponse.json(customers);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { phone, action } = await request.json();
    if (!phone || !action) {
      return NextResponse.json({ error: "Missing phone or action" }, { status: 400 });
    }

    const db = await readDB();
    if (!db.customerMeta) db.customerMeta = {};

    const meta = db.customerMeta[phone] || {};

    if (action === "toggleVip") {
      meta.isVip = !meta.isVip;
    } else if (action === "toggleBlock") {
      meta.isBlocked = !meta.isBlocked;
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    db.customerMeta[phone] = meta;
    await writeDB(db);

    return NextResponse.json({ success: true, ...meta });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
