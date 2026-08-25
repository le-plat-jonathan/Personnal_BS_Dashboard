export interface PlayerConfig {
  id: string;
  name: string;
  tag: string;
}

export const PLAYERS: PlayerConfig[] = [
  { id: "adhes", name: "Adhes", tag: "#Q9YV28JVC" },
  { id: "hermes", name: "Hermes", tag: "#2QLVV8UL8Q" },
  { id: "hephaïstos", name: "Hephaïstos", tag: "#2QROLUGL8U" },
  { id: "light", name: "Light", tag: "#2GOQV2LRCG" },
  { id: "anakyn380", name: "Anakyn380", tag: "#QPLY2VCQO" },
  { id: "natnat", name: "Natnat", tag: "#2UYOO2RY9R" },
];

export const DEFAULT_PLAYER = PLAYERS[0];

export function getPlayerById(id: string): PlayerConfig {
  return PLAYERS.find((p) => p.id === id) ?? DEFAULT_PLAYER;
}

export function encodeTag(tag: string): string {
  return encodeURIComponent(tag);
}

/**
 * Met un tag saisi a la main sous la forme attendue par l'API : `#` en tete,
 * majuscules, espaces retires.
 *
 * Volontairement tolerant. Verifie le 2026-08-25 sur l'API : la casse est
 * ignoree (`q9yv28jvc` fonctionne), et le `O` est equivalent au `0`. Inutile
 * donc de corriger la saisie au-dela de ca.
 */
export function normalizeTag(raw: string): string {
  return "#" + raw.trim().replace(/^#/, "").toUpperCase();
}

/**
 * Filtre les saisies manifestement absurdes avant d'appeler l'API.
 *
 * Ne PAS durcir a une longueur fixe : les tags des 6 joueurs de PLAYERS font
 * 9 ou 10 caracteres hors `#`, et rien ne garantit que ce soient les seules
 * longueurs possibles. Un tag valide mais inconnu doit remonter en 404 depuis
 * l'API, pas etre refuse ici sur une regle inventee.
 */
export function isPlausibleTag(raw: string): boolean {
  return /^[0-9A-Z]{3,14}$/i.test(raw.trim().replace(/^#/, ""));
}
