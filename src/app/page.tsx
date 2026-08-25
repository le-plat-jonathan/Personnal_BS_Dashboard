import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PLAYERS, getPlayerById, normalizeTag } from "@/lib/players";
import { getPlayer, getBattleLog } from "@/lib/brawlstars";
import { getBrawlifyMap } from "@/lib/brawlify";
import PlayerProfile from "@/components/PlayerProfile";
import BrawlersList from "@/components/BrawlersList";
import BattleLog from "@/components/BattleLog";
import PlayerSwitcher from "@/components/PlayerSwitcher";
import PlayerSearch from "@/components/PlayerSearch";
import TopBrawlers from "@/components/TopBrawlers";
import BrawlerStats from "@/components/BrawlerStats";

interface PageProps {
  searchParams: Promise<{ player?: string; tag?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { player: playerId, tag: rawTag } = await searchParams;
  const currentPlayer = getPlayerById(playerId ?? "adhes");

  // `?tag=` prend le pas sur `?player=` : c'est une recherche libre, elle ne
  // correspond a aucune entree de PLAYERS. Le # est remis ici, il ne peut pas
  // voyager dans une query string sans etre pris pour un fragment.
  const searchedTag = rawTag ? normalizeTag(rawTag) : null;
  const activeTag = searchedTag ?? currentPlayer.tag;

  // Pas de `bg-background` sur <main> : ce fond opaque masquerait l'aurora.
  // La couleur de base est portee par <body>, l'aurora se glisse entre les
  // deux, et `relative z-10` fait passer le contenu par-dessus.
  return (
    <main className="relative z-10 min-h-screen text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="glass-bar sticky top-0 z-20">
        <div className="container mx-auto px-4 max-w-6xl h-14 flex items-center gap-3 sm:gap-4">
          <span className="font-display text-lg font-extrabold tracking-tight shrink-0">BS Dashboard</span>
          <PlayerSwitcher
            players={PLAYERS}
            currentId={searchedTag ? "" : currentPlayer.id}
            searching={Boolean(searchedTag)}
          />
          <div className="ml-auto">
            <PlayerSearch />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Suspense fallback={<DashboardSkeleton />}>
          <PlayerDashboard key={activeTag} tag={activeTag} />
        </Suspense>
      </div>
    </main>
  );
}

async function PlayerDashboard({ tag }: { tag: string }) {
  const [playerResult, battleLogResult, brawlifyMapResult] = await Promise.all([
    getPlayer(tag).catch((e: Error) => e),
    getBattleLog(tag).catch((e: Error) => e),
    getBrawlifyMap().catch(() => new Map()),
  ]);

  if (playerResult instanceof Error) {
    console.error(`[BS Dashboard] getPlayer(${tag}) failed:`, playerResult);
    // L'API repond 404 sur un tag inexistant : c'est une saisie a corriger,
    // pas une panne. Les deux mericent des messages differents.
    const notFound = playerResult.message.includes("404");
    return (
      <div className="glass p-8 text-center space-y-2">
        <p className="font-display text-lg font-extrabold">
          {notFound ? "Aucun joueur avec ce tag" : "Impossible de charger ce profil"}
        </p>
        <p className="text-sm text-muted-foreground">
          {notFound
            ? "Verifie le tag dans le profil du jeu, sous le pseudo."
            : playerResult.message}
        </p>
        <p className="text-xs text-muted-foreground font-mono">{tag}</p>
      </div>
    );
  }

  const player = playerResult;
  const battleLog = battleLogResult instanceof Error ? { items: [] } : battleLogResult;
  const brawlifyMap = brawlifyMapResult instanceof Map ? brawlifyMapResult : new Map();

  return (
    <div className="space-y-6">
      <PlayerProfile player={player} />

      {/* Top brawlers + stats */}
      <TopBrawlers brawlers={player.brawlers} brawlifyMap={brawlifyMap} />
      <BrawlerStats brawlers={player.brawlers} />

      {/* Battle log */}
      <BattleLog battles={battleLog.items} playerTag={player.tag} />

      {/* Full brawlers grid */}
      <BrawlersList
        brawlers={player.brawlers}
        brawlifyData={Object.fromEntries(brawlifyMap) as Record<number, import("@/types/brawlify").BrawlifyBrawler>}
      />
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
