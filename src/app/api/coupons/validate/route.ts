import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = await rateLimit("coupons", ip, 10);
  if (!rl.success) {
    return NextResponse.json({ valid: false });
  }
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ valid: false });

    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.active) return NextResponse.json({ valid: false });

    if (coupon.usageLimit !== null) {
      // For now, just check if coupon exists and is active
      // Usage tracking could be added later
    }

    return NextResponse.json({ valid: true, discountPct: coupon.discountPct, code: coupon.code });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
