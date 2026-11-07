
type AppsScriptResponse<T> = { ok: boolean; data?: T; error?: string };

export async function callAppsScript<T>(
  action: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;

  if (!url || !secret) {
    throw new Error("BACKEND_NOT_CONFIGURED");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, secret, ...data }),
    cache: "no-store",
    redirect: "follow",
  });

  if (!response.ok) throw new Error("BACKEND_UNAVAILABLE");

  let result: AppsScriptResponse<T>;
  try {
    result = (await response.json()) as AppsScriptResponse<T>;
  } catch {
    throw new Error("BACKEND_INVALID_RESPONSE");
  }

  if (!result.ok || result.data === undefined) {
    throw new Error(result.error || "BACKEND_REQUEST_FAILED");
  }
  return result.data;
}
