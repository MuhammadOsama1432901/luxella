import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, trackingNumber } = body;

    if (!status) {
      return NextResponse.json({ error: "Missing status parameter" }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status, trackingNumber);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT order error", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
