import type { Player, BattleLog } from "@/types/brawlstars";

const BASE_URL = process.env.BRAWL_STARS_API_BASE!;
const API_KEY = process.env.BRAWL_STARS_API_KEY!;

async function bsGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // cache 60s
  });

  if (!res.ok) {
    throw new Error(`Brawl Stars API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getPlayer(tag: string): Promise<Player> {
  const encoded = encodeURIComponent(tag);
  return bsGet<Player>(`/players/${encoded}`);
}

export async function getBattleLog(tag: string): Promise<BattleLog> {
  const encoded = encodeURIComponent(tag);
  return bsGet<BattleLog>(`/players/${encoded}/battlelog`);
}
