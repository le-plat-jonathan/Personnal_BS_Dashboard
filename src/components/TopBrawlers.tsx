import Image from "next/image";
import { getBrawlerImageUrl } from "@/lib/brawlify";
import type { Brawler } from "@/types/brawlstars";
import type { BrawlifyMap } from "@/types/brawlify";

interface Props {
  brawlers: Brawler[];
  brawlifyMap: BrawlifyMap;
}

const PODIUM_BG: Record<number, string> = {
  1: "bg-yellow-600/30 border-yellow-500",
  2: "bg-zinc-600/30 border-zinc-400",
  3: "bg-amber-800/30 border-amber-700",
};

const RANK_BG: Record<number, string> = {
  1: "bg-yellow-500",
  2: "bg-zinc-400",
  3: "bg-amber-700",
};

export default function TopBrawlers({ brawlers, brawlifyMap }: Props) {
  const top7 = [...brawlers]
    .sort((a, b) => b.trophies - a.trophies)
    .slice(0, 7);

  const [first, second, third, ...rest] = top7;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xs font-bold tracking-widest text-muted-foreground mb-6 uppercase flex items-center gap-2">
        🏆 Les meilleurs bagarreurs
      </h2>

      {/* Podium top 3 */}
      <div className="flex items-end justify-center gap-2 sm:gap-4 mb-6">
        {/* 2nd */}
        <PodiumCard brawler={second} rank={2} brawlifyMap={brawlifyMap} elevated={false} />
        {/* 1st */}
        <PodiumCard brawler={first} rank={1} brawlifyMap={brawlifyMap} elevated />
        {/* 3rd */}
        <PodiumCard brawler={third} rank={3} brawlifyMap={brawlifyMap} elevated={false} />
      </div>

      {/* 4th–7th */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {rest.map((b, i) => (
          <SmallBrawlerCard key={b.id} brawler={b} rank={i + 4} brawlifyMap={brawlifyMap} />
        ))}
      </div>
    </section>
  );
}

function PodiumCard({
  brawler,
  rank,
  brawlifyMap,
  elevated,
}: {
  brawler: Brawler;
  rank: number;
  brawlifyMap: BrawlifyMap;
  elevated: boolean;
}) {
  if (!brawler) return null;
  const meta = brawlifyMap.get(brawler.id);
  const imgUrl = getBrawlerImageUrl(brawler.id);

  return (
    <div className={`flex flex-col items-center ${elevated ? "mb-8" : ""}`}>
      {rank === 1 && <span className="text-2xl mb-1">👑</span>}
      <div className="relative w-20 h-20 mb-2">
        <Image
          src={meta?.imageUrl ?? imgUrl}
          alt={brawler.name}
          fill
          className="object-contain drop-shadow-lg"
          unoptimized
        />
      </div>
      <div
        className={`flex flex-col items-center border rounded-xl px-3 sm:px-5 py-3 min-w-[90px] sm:min-w-[110px] ${PODIUM_BG[rank]}`}
      >
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 ${RANK_BG[rank]}`}
        >
          {rank}
        </span>
        <span className="font-bold text-sm uppercase tracking-wide">{brawler.name}</span>
        <span className={`font-bold text-base ${rank === 1 ? "text-yellow-400" : "text-zinc-300"}`}>
          {brawler.trophies.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function SmallBrawlerCard({
  brawler,
  rank,
  brawlifyMap,
}: {
  brawler: Brawler;
  rank: number;
  brawlifyMap: BrawlifyMap;
}) {
  const meta = brawlifyMap.get(brawler.id);
  const imgUrl = getBrawlerImageUrl(brawler.id);

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-3 py-2">
      <span className="text-muted-foreground text-sm w-4 shrink-0">{rank}</span>
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src={meta?.imageUrl ?? imgUrl}
          alt={brawler.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm truncate uppercase">{brawler.name}</div>
        <div className="text-yellow-400 text-sm font-bold">{brawler.trophies.toLocaleString()}</div>
      </div>
    </div>
  );
}
