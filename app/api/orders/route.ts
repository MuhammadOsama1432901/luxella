import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET orders error", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (
      !body.customer ||
      !body.customer.name ||
      !body.customer.phone ||
      !body.customer.address ||
      !body.customer.city ||
      !body.items ||
      body.items.length === 0
    ) {
      return NextResponse.json({ error: "Missing customer or item details" }, { status: 400 });
    }

    const orderData = {
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
        email: body.customer.email || "",
        address: body.customer.address,
        city: body.customer.city,
      },
      items: body.items.map((item: any) => ({
        productId: Number(item.productId),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image,
      })),
      subtotal: Number(body.subtotal),
      shipping: Number(body.shipping),
      total: Number(body.total),
      paymentMethod: body.paymentMethod || "Cash on Delivery",
    };

    const newOrder = await createOrder(orderData);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POST order error", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
