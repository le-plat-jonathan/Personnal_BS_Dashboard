import type { BrawlifyBrawler, BrawlifyMap, BrawlifyResponse } from "@/types/brawlify";

let cache: BrawlifyMap | null = null;

export async function getBrawlifyMap(): Promise<BrawlifyMap> {
  if (cache) return cache;

  // `api.brawlapi.com` et non `api.brawlify.com` : le domaine recent a ete
  // place derriere un challenge anti-bot (« Security Check ») qui refuse toute
  // requete serveur, quels que soient les en-tetes. L'ancien domaine sert les
  // memes donnees sans blocage. Il est hérité, donc considere comme faillible :
  // l'appelant journalise l'echec et se rabat proprement.
  const res = await fetch("https://api.brawlapi.com/v1/brawlers", {
    next: { revalidate: 86400 }, // cache 24h
  });

  // Remonter l'echec au lieu de renvoyer une Map vide : un `catch` en amont
  // decidera d'un repli, mais au moins l'erreur apparaitra dans les logs.
  if (!res.ok) {
    throw new Error(`Brawlify API error: ${res.status} ${res.statusText}`);
  }

  const data: BrawlifyResponse = await res.json();
  cache = new Map(data.list.map((b) => [b.id, b]));
  return cache;
}

export function getBrawlerImageUrl(id: number): string {
  return `https://cdn.brawlify.com/brawlers/borders/${id}.png`;
}

export function getBrawlerImageUrlBorderless(id: number): string {
  return `https://cdn.brawlify.com/brawlers/borderless/${id}.png`;
}

export function getProfileIconUrl(iconId: number): string {
  return `https://cdn.brawlify.com/profile-icons/${iconId}.png`;
}

export const RARITY_ORDER: Record<string, number> = {
  "Common": 1,
  "Rare": 2,
  "Super Rare": 3,
  "Epic": 4,
  "Mythic": 5,
  "Legendary": 6,
  "Ultra Legendary": 7,
};

export { type BrawlifyBrawler };
