import type { Player, BattleLog, CatalogueBrawler } from "@/types/brawlstars";

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

let catalogueCache: Map<number, CatalogueBrawler> | null = null;

/**
 * Catalogue officiel de tous les brawlers et de ce qu'ils peuvent posseder.
 *
 * Remplace l'API Brawlify, devenue inutilisable cote serveur : elle repond
 * desormais par une page « Security Check » a toute requete automatisee,
 * quels que soient les en-tetes. Son CDN d'images, lui, reste accessible.
 */
export async function getBrawlerCatalogue(): Promise<Map<number, CatalogueBrawler>> {
  if (catalogueCache) return catalogueCache;
  const data = await bsGet<{ items: CatalogueBrawler[] }>("/brawlers");
  catalogueCache = new Map(data.items.map((b) => [b.id, b]));
  return catalogueCache;
}
