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
  { id: "anakyn380", name: "Anakyn380", tag: "#QPLY2VCQ0" },
  { id: "natnat", name: "Natnat", tag: "#2UYOO2RY9R" },
];

export const DEFAULT_PLAYER = PLAYERS[0];

export function getPlayerById(id: string): PlayerConfig {
  return PLAYERS.find((p) => p.id === id) ?? DEFAULT_PLAYER;
}

export function encodeTag(tag: string): string {
  return encodeURIComponent(tag);
}
