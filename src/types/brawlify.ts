export interface BrawlifyAbility {
  id: number;
  name: string;
  imageUrl: string;
}

export interface BrawlifyBrawler {
  id: number;
  name: string;
  hash: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  rarity: {
    id: number;
    name: string;
    color: string;
  };
  class: {
    id: number;
    name: string;
  };
  released: boolean;
  starPowers: BrawlifyAbility[];
  gadgets: BrawlifyAbility[];
}

export interface BrawlifyResponse {
  list: BrawlifyBrawler[];
}

// Map brawler ID → Brawlify metadata
export type BrawlifyMap = Map<number, BrawlifyBrawler>;
