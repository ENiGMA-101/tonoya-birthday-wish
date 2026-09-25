import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { wishes } from "@/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await db.select().from(wishes).orderBy(desc(wishes.createdAt)).limit(40);
    return NextResponse.json({ wishes: rows });
  } catch {
    return NextResponse.json({ wishes: [], degraded: true });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const body = (payload ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 400) : "";
  if (name.length < 2) return NextResponse.json({ error: "Name required." }, { status: 422 });
  if (message.length < 2) return NextResponse.json({ error: "Wish required." }, { status: 422 });

  try {
    const [row] = await db.insert(wishes).values({ name, message }).returning();
    return NextResponse.json({ ok: true, persisted: true, wish: row });
  } catch (error) {
    console.error("wish.persist.failed", error);
    return NextResponse.json({
      ok: true,
      persisted: false,
      wish: { id: Date.now(), name, message, createdAt: new Date().toISOString() },
    });
  }
}
