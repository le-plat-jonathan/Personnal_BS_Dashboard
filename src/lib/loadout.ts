import type { Brawler, CatalogueBrawler } from "@/types/brawlstars";

const CDN = "https://cdn.brawlify.com";

/**
 * Images des objets d'un brawler.
 *
 * Le CDN de Brawlify reste accessible alors que son API ne l'est plus : seule
 * cette derniere est passee derriere un challenge anti-bot. Les chemins sont
 * a prendre au pied de la lettre, `/gear/` ou `/gears/` renvoient 404 la ou
 * `/gears/regular/` fonctionne.
 *
 * Pas d'entree pour les hypercharges : aucune image n'est publiee pour elles,
 * elles sont donc rendues sans icone.
 */
export const iconUrl = {
  starPower: (id: number) => `${CDN}/star-powers/regular/${id}.png`,
  gadget: (id: number) => `${CDN}/gadgets/regular/${id}.png`,
  gear: (id: number) => `${CDN}/gears/regular/${id}.png`,
};

export interface LoadoutItem {
  id: number;
  name: string;
  owned: boolean;
  /** Renseigne pour les equipements seulement. */
  level?: number;
}

export interface Loadout {
  starPowers: LoadoutItem[];
  gadgets: LoadoutItem[];
  gears: LoadoutItem[];
  hyperCharges: LoadoutItem[];
}

/**
 * Croise ce que le brawler PEUT posseder (catalogue officiel) avec ce que le
 * joueur possede reellement.
 *
 * Sans catalogue — appel en echec — on se rabat sur les seuls objets possedes,
 * tous marques comme acquis : mieux vaut une liste incomplete qu'une liste
 * fausse ou vide.
 */
export function buildLoadout(
  brawler: Brawler,
  catalogue: CatalogueBrawler | undefined
): Loadout {
  const gearLevels = new Map((brawler.gears ?? []).map((g) => [g.id, g.level]));
  const ownedStarPowers = new Set((brawler.starPowers ?? []).map((s) => s.id));
  const ownedGadgets = new Set((brawler.gadgets ?? []).map((g) => g.id));
  const ownedHyper = new Set((brawler.hyperCharges ?? []).map((h) => h.id));

  const merge = (
    available: { id: number; name: string }[] | undefined,
    owned: Set<number>,
    fallback: { id: number; name: string }[]
  ): LoadoutItem[] =>
    available && available.length > 0
      ? available.map((a) => ({ id: a.id, name: a.name, owned: owned.has(a.id) }))
      : fallback.map((a) => ({ id: a.id, name: a.name, owned: true }));

  const gears: LoadoutItem[] =
    catalogue && catalogue.gears.length > 0
      ? catalogue.gears.map((g) => ({
          id: g.id,
          name: g.name,
          owned: gearLevels.has(g.id),
          level: gearLevels.get(g.id),
        }))
      : (brawler.gears ?? []).map((g) => ({
          id: g.id,
          name: g.name,
          owned: true,
          level: g.level,
        }));

  return {
    starPowers: merge(catalogue?.starPowers, ownedStarPowers, brawler.starPowers ?? []),
    gadgets: merge(catalogue?.gadgets, ownedGadgets, brawler.gadgets ?? []),
    gears,
    hyperCharges: merge(catalogue?.hyperCharges, ownedHyper, brawler.hyperCharges ?? []),
  };
}
