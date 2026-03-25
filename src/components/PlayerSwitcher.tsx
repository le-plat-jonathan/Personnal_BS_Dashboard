"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlayerConfig } from "@/lib/players";

interface Props {
  players: PlayerConfig[];
  currentId: string;
}

export default function PlayerSwitcher({ players, currentId }: Props) {
  const router = useRouter();

  return (
    <Tabs
      value={currentId}
      onValueChange={(value) => router.push(`/?player=${value}`)}
    >
      <TabsList>
        {players.map((p) => (
          <TabsTrigger key={p.id} value={p.id}>
            {p.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
