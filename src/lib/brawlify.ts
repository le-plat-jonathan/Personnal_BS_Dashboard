import type { BrawlifyBrawler, BrawlifyMap, BrawlifyResponse } from "@/types/brawlify";

let cache: BrawlifyMap | null = null;

export async function getBrawlifyMap(): Promise<BrawlifyMap> {
  if (cache) return cache;

  const res = await fetch("https://api.brawlify.com/v1/brawlers", {
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) return new Map();

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
