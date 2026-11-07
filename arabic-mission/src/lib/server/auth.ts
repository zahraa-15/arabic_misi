import { cookies } from "next/headers";
import { promisify } from "node:util";
import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "arabic_mission_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number;
};

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET_INVALID");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return { salt, hash: derived.toString("hex") };
}

export async function verifyPassword(
  password: string,
  salt: string,
  storedHash: string,
) {
  try {
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    const expected = Buffer.from(storedHash, "hex");
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  } catch {
    return false;
  }
}

export function createSessionToken(user: {
  user_id: string;
  full_name: string;
  email: string;
  role: string;
}) {
  const payload: SessionUser = {
    id: user.user_id,
    name: user.full_name,
    email: user.email,
    role: user.role || "student",
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expected = Buffer.from(sign(encoded));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
      return null;
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionUser;
    if (
      !payload.id ||
      !payload.email ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= Math.floor(Date.now() / 1000)
    )
      return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function publicUser(user: Record<string, unknown>) {
  return {
    id: String(user.user_id || ""),
    name: String(user.full_name || ""),
    email: String(user.email || ""),
    role: String(user.role || "student"),
    createdAt: String(user.created_at || ""),
  };
}
