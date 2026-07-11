import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await deleteSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("easymom_admin_session");
  return response;
}
