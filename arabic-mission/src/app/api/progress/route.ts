import { NextResponse } from "next/server";
import { parseProgress } from "@/lib/progress";
import { callAppsScript } from "@/lib/server/apps-script";
import { getSession } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  try {
    const result = await callAppsScript<{ progress_json?: string } | null>("getProgress", {
      user_id: session.id,
    });
    const progress = result?.progress_json ? parseProgress(result.progress_json) : null;
    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Arabic Mission get progress error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Progres belum dapat dimuat." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  try {
    const body = (await request.json()) as { progress?: unknown };
    const raw = JSON.stringify(body.progress);
    if (!body.progress || raw.length > 45_000)
      return NextResponse.json({ error: "Data progres tidak valid atau terlalu besar." }, { status: 400 });
    const progress = parseProgress(raw);
    await callAppsScript("saveProgress", {
      user_id: session.id,
      progress,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Arabic Mission save progress error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Progres belum dapat disimpan ke akun." }, { status: 503 });
  }
}
