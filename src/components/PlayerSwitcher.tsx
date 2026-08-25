"use client";

import { useRouter } from "next/navigation";
import type { PlayerConfig } from "@/lib/players";

interface Props {
  players: PlayerConfig[];
  currentId: string;
  /** Un tag recherche est affiche : aucun joueur de la liste n'est selectionne. */
  searching?: boolean;
}

export default function PlayerSwitcher({ players, currentId, searching }: Props) {
  const router = useRouter();

  return (
    <select
      value={currentId}
      onChange={(e) => router.push(`/?player=${e.target.value}`)}
      aria-label="Choisir un joueur"
      className="glass-inset px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
    >
      {/* Sans cette option, `value=""` ne correspondrait a rien et le select
          afficherait le premier joueur de la liste, laissant croire que c'est
          lui qu'on regarde. */}
      {searching && <option value="">Joueur recherché</option>}
      {players.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
