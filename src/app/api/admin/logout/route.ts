import { NextResponse } from "next/server";
import { deleteAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  await deleteAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("easymom_admin_session");
  return response;
}
