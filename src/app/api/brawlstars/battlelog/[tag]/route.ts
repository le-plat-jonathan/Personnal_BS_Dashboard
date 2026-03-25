import { NextResponse } from "next/server";
import { getBattleLog } from "@/lib/brawlstars";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  try {
    const battlelog = await getBattleLog(`#${tag}`);
    return NextResponse.json(battlelog);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
