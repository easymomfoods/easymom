import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderId } from "@/lib/format";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_CITIES = ["Mangalore", "Bangalore", "Kasaragod"];
const SHIPPING_BY_CITY: Record<string, number> = {
  Mangalore: 40,
  Bangalore: 60,
  Kasaragod: 50,
};

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
      couponCode,
      paymentMethod,
      itemsJson,
    } = body;

    if (!email || !name || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ALLOWED_CITIES.includes(city)) {
      return NextResponse.json(
        { error: "We currently deliver only to Mangalore, Bangalore, and Kasaragod." },
        { status: 400 }
      );
    }

    const items: { productId: string; qty: number; price: number }[] =
      typeof itemsJson === "string" ? JSON.parse(itemsJson) : (itemsJson ?? []);

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Recalculate prices from database
    const productIds = items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let serverSubtotal = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      const qty = Math.max(1, Math.min(99, Math.floor(item.qty)));
      serverSubtotal += product.price * qty;
    }

    // Validate and apply coupon
    let serverDiscount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (!coupon || !coupon.active) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }
      serverDiscount = Math.round(serverSubtotal * (coupon.discountPct / 100));
    }

    const serverShipping = SHIPPING_BY_CITY[city] || 50;
    const serverTotal = Math.max(0, serverSubtotal - serverDiscount + serverShipping);

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
        subtotal: serverSubtotal,
        discount: serverDiscount,
        shipping: serverShipping,
        total: serverTotal,
        couponCode: couponCode?.toUpperCase() ?? null,
        paymentMethod: paymentMethod === "upi_qr" ? "upi_qr" : "cod",
        paymentStatus: "pending",
        itemsJson: JSON.stringify(
          items.map((i) => {
            const p = productMap.get(i.productId);
            return {
              productId: i.productId,
              name: p?.name || "",
              price: p?.price || 0,
              qty: Math.max(1, Math.min(99, Math.floor(i.qty))),
              img: p?.img || "",
            };
          })
        ),
        status: "confirmed",
      },
    });

    return NextResponse.json({ ok: true, orderId: order.orderId, id: order.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
