import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PLAYERS, getPlayerById } from "@/lib/players";
import { getPlayer, getBattleLog } from "@/lib/brawlstars";
import { getBrawlifyMap } from "@/lib/brawlify";
import PlayerProfile from "@/components/PlayerProfile";
import BrawlersList from "@/components/BrawlersList";
import BattleLog from "@/components/BattleLog";
import PlayerSwitcher from "@/components/PlayerSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import TopBrawlers from "@/components/TopBrawlers";
import BrawlerStats from "@/components/BrawlerStats";

interface PageProps {
  searchParams: Promise<{ player?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { player: playerId } = await searchParams;
  const currentPlayer = getPlayerById(playerId ?? "adhes");

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-6xl h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-black text-lg tracking-tight">🎮 BS Dashboard</span>
            <PlayerSwitcher players={PLAYERS} currentId={currentPlayer.id} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Suspense fallback={<DashboardSkeleton />}>
          <PlayerDashboard tag={currentPlayer.tag} />
        </Suspense>
      </div>
    </main>
  );
}

async function PlayerDashboard({ tag }: { tag: string }) {
  const [player, battleLog, brawlifyMap] = await Promise.all([
    getPlayer(tag),
    getBattleLog(tag),
    getBrawlifyMap(),
  ]);

  return (
    <div className="space-y-6">
      <PlayerProfile player={player} />

      {/* Top brawlers + stats */}
      <TopBrawlers brawlers={player.brawlers} brawlifyMap={brawlifyMap} />
      <BrawlerStats brawlers={player.brawlers} brawlifyMap={brawlifyMap} />

      {/* Battle log */}
      <BattleLog battles={battleLog.items} playerTag={player.tag} brawlifyMap={brawlifyMap} />

      {/* Full brawlers grid */}
      <BrawlersList brawlers={player.brawlers} brawlifyMap={brawlifyMap} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
