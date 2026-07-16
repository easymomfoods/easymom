import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from '@/lib/auth';
import { cacheDel } from '@/lib/cache';

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const faqs = await db.faq.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ faqs });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const faq = await db.faq.create({
      data: {
        question: body.question || "",
        answer: body.answer || "",
        sortOrder: Number(body.sortOrder) || 0,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ ok: true, faq });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

