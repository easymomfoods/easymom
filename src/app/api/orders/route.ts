import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderId } from "@/lib/format";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = await rateLimit("orders", ip, 5);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
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
      paymentMethod,
      itemsJson,
    } = body;

    if (!email || !name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ALLOWED_CITIES = ["Mangalore", "Bangalore", "Kasaragod"];
    if (!ALLOWED_CITIES.includes(city)) {
      return NextResponse.json(
        { error: "We currently deliver only to Mangalore, Bangalore, and Kasaragod." },
        { status: 400 }
      );
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
        paymentMethod: paymentMethod === "upi_qr" ? "upi_qr" : "cod",
        paymentStatus: "pending",
        itemsJson: typeof itemsJson === "string" ? itemsJson : JSON.stringify(itemsJson ?? []),
        status: "confirmed",
      },
    });

    return NextResponse.json({ ok: true, orderId: order.orderId, id: order.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
