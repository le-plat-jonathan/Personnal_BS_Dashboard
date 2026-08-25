"use client";

import { useRouter } from "next/navigation";
import type { PlayerConfig } from "@/lib/players";

interface Props {
  players: PlayerConfig[];
  currentId: string;
}

export default function PlayerSwitcher({ players, currentId }: Props) {
  const router = useRouter();

  return (
    <select
      value={currentId}
      onChange={(e) => router.push(`/?player=${e.target.value}`)}
      className="glass-inset px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
    >
      {players.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
