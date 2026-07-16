import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderId } from "@/lib/format";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_CITIES = ["Mangalore", "Bangalore", "Kasaragod"];

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
      paymentRef,
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

    // Recalculate prices from database (skip free items — they have -free suffix)
    const parentIds = items.filter((i) => !i.productId.endsWith("-free")).map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: { id: { in: parentIds }, active: true },
    });
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let serverSubtotal = 0;
    for (const item of items) {
      if (item.productId.endsWith("-free")) continue; // free items have price 0
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      const qty = Math.max(1, Math.min(99, Math.floor(item.qty)));
      serverSubtotal += product.price * qty;
    }

    // Validate and apply coupon (canonical store is site_content)
    let serverDiscount = 0;
    let appliedCouponCode: string | null = null;
    if (couponCode) {
      const normalized = couponCode.toUpperCase();
      const sc = await db.siteContent.findUnique({ where: { key: "coupons" } });
      const coupons: { code: string; discountPct: number; active: boolean; usageLimit: number | null; used?: number; expiresAt?: string | null }[] =
        sc ? JSON.parse(sc.value || "[]") : [];
      const coupon = coupons.find((c) => c.code === normalized && c.active);
      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }
      if (coupon.usageLimit != null && (coupon.used || 0) >= coupon.usageLimit) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      serverDiscount = Math.round(serverSubtotal * (coupon.discountPct / 100));
      appliedCouponCode = coupon.code;

      // Increment usage count in site_content
      coupon.used = (coupon.used || 0) + 1;
      await db.siteContent.update({
        where: { key: "coupons" },
        data: { value: JSON.stringify(coupons) },
      });
    }

    const serverShipping = 0;
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
        couponCode: appliedCouponCode,
        paymentMethod: paymentMethod === "upi_qr" ? "upi_qr" : "cod",
        paymentStatus: "pending",
        paymentRef: paymentRef || null,
        itemsJson: JSON.stringify(
          items.map((i) => {
            const p = productMap.get(i.productId);
            const isFree = i.productId.endsWith("-free");
            return {
              productId: i.productId,
              name: isFree ? (i as any).name || "Free Item" : (p?.name || ""),
              price: isFree ? 0 : p.price,
              qty: Math.max(1, Math.min(99, Math.floor(i.qty))),
              img: isFree ? (i as any).img || "" : (p?.img || ""),
              weight: isFree ? "Free" : (p?.weight || ""),
              isFree,
              freeItemName: isFree ? (i as any).freeItemName : undefined,
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
