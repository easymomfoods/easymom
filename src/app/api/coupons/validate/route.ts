import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

interface StoredCoupon {
  id: string;
  code: string;
  discountPct: number;
  active: boolean;
  usageLimit: number | null;
  used?: number;
  expiresAt?: string | null;
  description?: string;
}

function getCoupons(): StoredCoupon[] {
  // Coupons are stored in site_content (canonical source, same as the admin editor + cart display)
  return [];
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rl = await rateLimit("coupons", ip, 10);
  if (!rl.success) {
    return NextResponse.json({ valid: false });
  }
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ valid: false });

    const sc = await db.siteContent.findUnique({ where: { key: "coupons" } });
    if (!sc) return NextResponse.json({ valid: false });

    const coupons: StoredCoupon[] = JSON.parse(sc.value || "[]");
    const coupon = coupons.find(
      (c) => c.code === String(code).toUpperCase() && c.active
    );
    if (!coupon) return NextResponse.json({ valid: false });

    // Expiry check
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ valid: false });
    }

    // Usage limit check
    if (coupon.usageLimit != null && (coupon.used || 0) >= coupon.usageLimit) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      discountPct: coupon.discountPct,
      code: coupon.code,
    });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
