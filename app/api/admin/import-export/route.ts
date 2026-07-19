import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getProducts, createProduct, getOrders } from "@/lib/db";

// Authenticate staff
async function checkStaff() {
  const session = await getSession();
  if (!session) return false;
  return ["super_admin", "admin", "manager", "inventory"].includes(session.role);
}

// POST: Handles CSV Import
export async function POST(req: Request) {
  const authorized = await checkStaff();
  if (!authorized) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const { type, csvContent } = await req.json();

    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json({ error: "CSV content required." }, { status: 400 });
    }

    const lines = csvContent.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV lacks data rows." }, { status: 400 });
    }

    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    const importedCount = 0;

    if (type === "products") {
      const dbProducts = await getProducts();
      let count = 0;

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        // Map row to DBProduct
        if (!row.name || !row.price) continue;

        await createProduct({
          name: row.name,
          image: row.image || "/images/products/product1.jpg",
          price: parseFloat(row.price) || 999,
          oldPrice: row.oldPrice ? parseFloat(row.oldPrice) : parseFloat(row.price),
          rating: parseInt(row.rating) || 5,
          sale: row.sale === "true",
          category: row.category || "Earrings",
          description: row.description || "",
          stock: parseInt(row.stock) || 10,
          featured: row.featured === "true",
          specifications: {
            Material: row.material || "Sterling Silver",
            Stone: row.stone || "Zirconia"
          },
          sku: row.sku || `SKU-${Date.now()}-${i}`,
          barcode: row.barcode || "",
          costPrice: row.costPrice ? parseFloat(row.costPrice) : undefined,
          visibility: "visible"
        });
        count++;
      }
      return NextResponse.json({ success: true, count });
    }

    return NextResponse.json({ error: "Invalid import type" }, { status: 400 });
  } catch (err) {
    console.error("[csv import]", err);
    return NextResponse.json({ error: "Failed to parse and import CSV" }, { status: 500 });
  }
}

// GET: Handles CSV Export
export async function GET(req: Request) {
  const authorized = await checkStaff();
  if (!authorized) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "products") {
      const products = await getProducts();
      const headers = ["name", "price", "oldPrice", "rating", "sale", "category", "stock", "featured", "material", "stone", "sku", "barcode", "costPrice"];
      const rows = products.map(p => [
        p.name,
        p.price,
        p.oldPrice || p.price,
        p.rating,
        p.sale,
        p.category,
        p.stock,
        p.featured,
        p.specifications?.Material || "",
        p.specifications?.Stone || "",
        p.sku || "",
        p.barcode || "",
        p.costPrice || ""
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="luxella-products.csv"'
        }
      });
    }

    if (type === "orders") {
      const orders = await getOrders();
      const headers = ["orderId", "customerName", "phone", "email", "city", "itemsCount", "subtotal", "shipping", "total", "paymentMethod", "status", "createdAt"];
      const rows = orders.map(o => [
        o.id,
        o.customer.name,
        o.customer.phone,
        o.customer.email,
        o.customer.city,
        o.items.length,
        o.subtotal,
        o.shipping,
        o.total,
        o.paymentMethod,
        o.status,
        o.createdAt
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="luxella-orders.csv"'
        }
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (err) {
    console.error("[csv export]", err);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
