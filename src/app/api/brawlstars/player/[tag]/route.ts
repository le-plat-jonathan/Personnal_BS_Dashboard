import { NextResponse } from "next/server";
import { getPlayer } from "@/lib/brawlstars";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  try {
    const player = await getPlayer(`#${tag}`);
    return NextResponse.json(player);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
