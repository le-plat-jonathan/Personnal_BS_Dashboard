import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const encoded = encodeURIComponent(`#${tag}`);
  const base = process.env.BRAWL_STARS_API_BASE!;
  const key = process.env.BRAWL_STARS_API_KEY!;

  const res = await fetch(`${base}/players/${encoded}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  const data = await res.json();

  // Return only the first 3 brawlers with ALL fields to inspect unknown keys
  return NextResponse.json({
    status: res.status,
    sample: (data.brawlers ?? []).slice(0, 3),
    brawlerKeys: Object.keys((data.brawlers?.[0]) ?? {}),
  });
}
