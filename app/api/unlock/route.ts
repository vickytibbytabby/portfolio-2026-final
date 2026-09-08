import { NextResponse } from "next/server";
import { COOKIE, PASSWORD_HASH, hash } from "@/lib/unlock";

/** Trades the right password for the cookie the middleware looks for. */
export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };

  if (!password || (await hash(password)) !== PASSWORD_HASH) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, PASSWORD_HASH, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
