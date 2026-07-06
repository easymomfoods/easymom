import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderId } from "@/lib/format";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      notes,
      subtotal,
      discount,
      shipping,
      total,
      couponCode,
      itemsJson,
    } = body;

    if (!email || !name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = orderId();
    const order = await db.order.create({
      data: {
        orderId: id,
        email,
        name,
        phone,
        address,
        city,
        state,
        pincode,
        notes: notes ?? null,
        subtotal: Number(subtotal) || 0,
        discount: Number(discount) || 0,
        shipping: Number(shipping) || 0,
        total: Number(total) || 0,
        couponCode: couponCode ?? null,
        itemsJson: typeof itemsJson === "string" ? itemsJson : JSON.stringify(itemsJson ?? []),
        paymentRef: "demo_" + id,
        status: "confirmed",
      },
    });

    return NextResponse.json({ ok: true, orderId: order.orderId, id: order.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ orders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
