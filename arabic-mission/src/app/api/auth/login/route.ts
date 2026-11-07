import { NextResponse } from "next/server";
import { callAppsScript } from "@/lib/server/apps-script";
import {
  createSessionToken,
  publicUser,
  setSessionCookie,
  verifyPassword,
} from "@/lib/server/auth";

export const runtime = "nodejs";

type StoredUser = Record<string, unknown> & {
  user_id: string;
  full_name: string;
  email: string;
  password_salt: string;
  password_hash: string;
  role: string;
  status: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password)
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });

    const user = await callAppsScript<StoredUser | null>("getUserByEmail", { email });
    if (
      !user ||
      user.status !== "active" ||
      !(await verifyPassword(password, user.password_salt, user.password_hash))
    ) {
      return NextResponse.json({ error: "Email atau password tidak sesuai." }, { status: 401 });
    }

    await callAppsScript("touchLogin", { user_id: user.user_id });
    await setSessionCookie(createSessionToken(user));
    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Arabic Mission login error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Login belum berhasil. Periksa konfigurasi backend atau coba lagi." }, { status: 503 });
  }
}
