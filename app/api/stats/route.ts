import { NextResponse } from "next/server";
import { getOrders, getProducts } from "@/lib/db";

export async function GET() {
  try {
    const [orders, products] = await Promise.all([getOrders(), getProducts()]);

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const activeOrders = orders.filter((o) => o.status !== "cancelled");

    // Revenue this month vs last month
    const revenueThisMonth = activeOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((s, o) => s + o.total, 0);

    const revenueLastMonth = activeOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((s, o) => s + o.total, 0);

    // Orders this month
    const ordersThisMonth = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // Unique customers
    const uniqueCustomers = new Set(
      orders.map((o) => o.customer.phone || o.customer.email)
    ).size;

    // Low stock products
    const lowStock = products.filter((p) => (p.stock ?? 0) <= 5).length;

    // Revenue by day — last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const dailyRevenue = last7Days.map((day) => {
      const label = day.toLocaleDateString("en-US", { weekday: "short" });
      const revenue = activeOrders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (
            d.getDate() === day.getDate() &&
            d.getMonth() === day.getMonth() &&
            d.getFullYear() === day.getFullYear()
          );
        })
        .reduce((s, o) => s + o.total, 0);
      return { label, revenue };
    });

    // Revenue by month — last 6 months
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return d;
    });

    const monthlyRevenue = last6Months.map((m) => {
      const label = m.toLocaleDateString("en-US", { month: "short" });
      const revenue = activeOrders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
        })
        .reduce((s, o) => s + o.total, 0);
      return { label, revenue };
    });

    // Status breakdown
    const statusCounts = {
      pending:   orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      shipped:   orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    // Top products
    const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
    for (const order of activeOrders) {
      for (const item of order.items) {
        const key = String(item.productId);
        if (!productSales[key]) {
          productSales[key] = { name: item.name, qty: 0, revenue: 0 };
        }
        productSales[key].qty += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      }
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalRevenue: activeOrders.reduce((s, o) => s + o.total, 0),
      revenueThisMonth,
      revenueLastMonth,
      revenueGrowth: revenueLastMonth > 0
        ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
        : 100,
      totalOrders: orders.length,
      ordersThisMonth,
      pendingOrders: statusCounts.pending,
      uniqueCustomers,
      lowStockProducts: lowStock,
      totalProducts: products.length,
      statusCounts,
      dailyRevenue,
      monthlyRevenue,
      topProducts,
      recentOrders: orders.slice(0, 5),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({}, { status: 500 });
  }
}
