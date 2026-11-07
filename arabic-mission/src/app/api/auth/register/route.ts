import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { callAppsScript } from "@/lib/server/apps-script";
import {
  createSessionToken,
  hashPassword,
  publicUser,
  setSessionCookie,
} from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (name.length < 2 || name.length > 60)
      return NextResponse.json({ error: "Nama harus berisi 2–60 karakter." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150)
      return NextResponse.json({ error: "Format email belum benar." }, { status: 400 });
    if (password.length < 8 || password.length > 128)
      return NextResponse.json({ error: "Password minimal 8 karakter dan maksimal 128 karakter." }, { status: 400 });

    const { salt, hash } = await hashPassword(password);
    const created = await callAppsScript<Record<string, unknown>>("createUser", {
      user_id: randomUUID(),
      full_name: name,
      email,
      password_salt: salt,
      password_hash: hash,
      role: "student",
    });

    const user = publicUser(created);
    await setSessionCookie(createSessionToken({
      user_id: String(created.user_id),
      full_name: String(created.full_name),
      email: String(created.email),
      role: String(created.role || "student"),
    }));
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "EMAIL_EXISTS")
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan masuk." }, { status: 409 });
    console.error("Arabic Mission register error:", message);
    return NextResponse.json({ error: "Pendaftaran belum berhasil. Periksa konfigurasi backend atau coba lagi." }, { status: 503 });
  }
}
