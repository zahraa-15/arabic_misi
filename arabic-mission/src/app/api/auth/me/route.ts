import { NextResponse } from "next/server";
import { callAppsScript } from "@/lib/server/apps-script";
import { clearSessionCookie, getSession, publicUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  try {
    const user = await callAppsScript<Record<string, unknown> | null>("getUserById", {
      user_id: session.id,
    });
    if (!user || user.status !== "active") {
      await clearSessionCookie();
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Arabic Mission session check error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Tidak dapat memeriksa sesi akun." }, { status: 503 });
  }
}
