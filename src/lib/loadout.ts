import type { Brawler, CatalogueBrawler } from "@/types/brawlstars";
import type { BrawlifyBrawler } from "@/types/brawlify";

/**
 * Nettoie les jetons de gabarit laisses dans les descriptions.
 *
 * 81 des 430 capacites contiennent une balise non resolue du type
 * `<!card.value1.ticksasseconds>`, aussi bien dans `description` que dans
 * `descriptionHtml`. Les remplacer par une ellipse vaut mieux que d'afficher
 * le jeton brut ou de laisser un trou dans la phrase.
 */
function cleanDescription(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/<![^>]*>/g, "…").replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

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

/**
 * Descriptions des equipements, saisies a la main et en francais.
 *
 * Aucune source ne les fournit : ni l'API officielle, ni brawlapi, qui n'a pas
 * d'endpoint `gears`. C'est aussi le seul texte francais de l'interface — les
 * descriptions des Star Powers et des gadgets restent en anglais, faute de
 * traduction disponible cote API.
 *
 * Les identifiants sont ceux renvoyes par l'API. Un equipement absent d'ici
 * s'affiche simplement sans description, sa vignette n'est pas cliquable.
 */
const GEAR_DESCRIPTIONS: Record<number, string> = {
  // Universels — disponibles sur les 106 brawlers.
  62000000: "Augmente la vitesse de déplacement dans les buissons de 15 %.",
  62000001: "Régénère les PV 50 % plus vite.",
  62000002:
    "Inflige 15 % de dégâts supplémentaires lorsque la santé de votre brawler est inférieure à 50 %.",
  62000003: "Révèle les adversaires pendant 2 s après leur avoir infligé des dégâts.",
  62000004:
    "Donne 900 PV sous la forme d'un bouclier. Ce bouclier est régénéré en 10 s lorsque les PV sont au maximum.",
  62000017: "Réduit le temps de recharge des gadgets de 15 %.",

  // Semi-communs — une dizaine de brawlers chacun.
  62000005: "Augmente la vitesse de rechargement de 15 %.",
  62000006: "Charge le super 10 % plus rapidement.",

  // Specifiques a un ou quelques brawlers.
  62000007: "Le super de Tick a 1 000 PV supplémentaires.",
  62000008: "Augmente la portée de Tour de main de D'jinn.",
  62000012:
    "Les ennemis dans la tempête de sable d'Émeri infligent 20 % de dégâts en moins.",
  62000013:
    "Le liquide inflammable d'Ambre ralentit aussi les ennemis de 10 %.",
  62000014: "Augmente la puissance du familier de 25 %.",
  62000015: "Le super d'Eve invoque 1 larve de plus.",
  62000016: "Augmente les soins de la tourelle de Pam de 20 %.",
};

/**
 * Equipements retires du jeu lors de l'arrivee des buffies.
 *
 * Ils figurent toujours dans le catalogue officiel, mais ne sont plus
 * obtenables : les afficher grises laisserait croire qu'ils sont a debloquer.
 * Ils sont donc retires de la liste, pas seulement prives de description.
 */
const RETIRED_GEAR_IDS = new Set([
  62000009, // ENDURING TOXINS — Crow
  62000010, // STICKY SPIKES — Spike
  62000011, // LINGERING SMOKE — Leon
  62000018, // BAT STORM — Mortis
]);

export interface LoadoutItem {
  id: number;
  name: string;
  owned: boolean;
  /**
   * Provenance selon la famille : les Star Powers et gadgets viennent de
   * brawlapi, en anglais, aucune source ne les fournissant traduits ; les
   * equipements viennent de GEAR_DESCRIPTIONS ci-dessus, en francais et saisis
   * a la main. Les hypercharges n'en ont aucune.
   */
  description?: string;
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
  catalogue: CatalogueBrawler | undefined,
  meta: BrawlifyBrawler | undefined
): Loadout {
  // Les descriptions ne viennent que de Brawlify ; le catalogue officiel, lui,
  // ne renvoie qu'un identifiant et un nom. On les indexe par id, les deux
  // sources n'ecrivant pas les noms de la meme facon (SHELLY vs Shelly).
  const descriptions = new Map<number, string | undefined>(
    [...(meta?.starPowers ?? []), ...(meta?.gadgets ?? [])].map((a) => [
      a.id,
      cleanDescription(a.description),
    ])
  );

  const ownedGears = new Set((brawler.gears ?? []).map((g) => g.id));
  const ownedStarPowers = new Set((brawler.starPowers ?? []).map((s) => s.id));
  const ownedGadgets = new Set((brawler.gadgets ?? []).map((g) => g.id));
  const ownedHyper = new Set((brawler.hyperCharges ?? []).map((h) => h.id));

  const merge = (
    available: { id: number; name: string }[] | undefined,
    owned: Set<number>,
    fallback: { id: number; name: string }[]
  ): LoadoutItem[] =>
    available && available.length > 0
      ? available.map((a) => ({
          id: a.id,
          name: a.name,
          owned: owned.has(a.id),
          description: descriptions.get(a.id),
        }))
      : fallback.map((a) => ({
          id: a.id,
          name: a.name,
          owned: true,
          description: descriptions.get(a.id),
        }));

  const source =
    catalogue && catalogue.gears.length > 0
      ? catalogue.gears.map((g) => ({ id: g.id, name: g.name, owned: ownedGears.has(g.id) }))
      : (brawler.gears ?? []).map((g) => ({ id: g.id, name: g.name, owned: true }));

  const gears: LoadoutItem[] = source
    .filter((g) => !RETIRED_GEAR_IDS.has(g.id))
    .map((g) => ({ ...g, description: GEAR_DESCRIPTIONS[g.id] }));

  return {
    starPowers: merge(catalogue?.starPowers, ownedStarPowers, brawler.starPowers ?? []),
    gadgets: merge(catalogue?.gadgets, ownedGadgets, brawler.gadgets ?? []),
    gears,
    hyperCharges: merge(catalogue?.hyperCharges, ownedHyper, brawler.hyperCharges ?? []),
  };
}
