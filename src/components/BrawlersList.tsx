import Image from "next/image";
import { getBrawlerImageUrl } from "@/lib/brawlify";
import type { Brawler } from "@/types/brawlstars";
import type { BrawlifyMap } from "@/types/brawlify";

interface Props {
  brawlers: Brawler[];
  brawlifyMap: BrawlifyMap;
}

function rankColor(rank: number): string {
  if (rank >= 35) return "#ff6fcf";
  if (rank >= 25) return "#c77dff";
  if (rank >= 20) return "#9d4edd";
  if (rank >= 15) return "#4361ee";
  if (rank >= 10) return "#f9c74f";
  return "#adb5bd";
}

export default function BrawlersList({ brawlers, brawlifyMap }: Props) {
  const sorted = [...brawlers].sort((a, b) => b.trophies - a.trophies);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
          🎮 Les bagarreurs{" "}
          <span className="text-foreground">{brawlers.length}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {sorted.map((b) => {
          const meta = brawlifyMap.get(b.id);
          const rarityColor = meta?.rarity.color ?? "#888";
          const imgUrl = getBrawlerImageUrl(b.id);

          return (
            <div
              key={b.id}
              className="rounded-lg border border-border bg-muted/60 p-3 flex flex-col items-center gap-2 hover:bg-zinc-700/60 transition-colors"
            >
              {/* Brawler image */}
              <div className="relative w-16 h-16">
                <Image
                  src={meta?.imageUrl ?? imgUrl}
                  alt={b.name}
                  fill
                  className="object-contain drop-shadow-md"
                  unoptimized
                />
              </div>

              {/* Name */}
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-wide leading-tight">{b.name}</div>
                {meta && (
                  <div className="text-[10px] mt-0.5" style={{ color: rarityColor }}>
                    {meta.rarity.name}
                  </div>
                )}
              </div>

              {/* Stats row */}
              <div className="w-full flex justify-between items-center text-xs">
                <span className="font-bold text-yellow-400">🏆 {b.trophies.toLocaleString()}</span>
                <span
                  className="font-bold rounded-full w-6 h-6 flex items-center justify-center text-white text-[10px]"
                  style={{ backgroundColor: rankColor(b.rank) }}
                  title={`Rang ${b.rank}`}
                >
                  {b.rank}
                </span>
              </div>

              {/* Power level */}
              <div className="w-full flex items-center gap-1">
                <PowerBar power={b.power} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PowerBar({ power }: { power: number }) {
  return (
    <div className="w-full flex items-center gap-1">
      <span className="text-[10px] text-muted-foreground shrink-0">P{power}</span>
      <div className="flex-1 flex gap-px">
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-sm ${
              i < power
                ? power >= 11 ? "bg-violet-400" : power >= 9 ? "bg-blue-400" : "bg-green-400"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
