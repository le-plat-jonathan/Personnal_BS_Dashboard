import type { Brawler } from "@/types/brawlstars";
import type { BrawlifyMap } from "@/types/brawlify";
import { RARITY_ORDER } from "@/lib/brawlify";

interface Props {
  brawlers: Brawler[];
  brawlifyMap: BrawlifyMap;
}

const MILESTONES = [
  { min: 1000, label: "1000+", color: "text-blue-400", bar: "bg-blue-400" },
  { min: 750, label: "750+", color: "text-yellow-400", bar: "bg-yellow-400" },
  { min: 500, label: "500+", color: "text-green-400", bar: "bg-green-400" },
  { min: 300, label: "300+", color: "text-zinc-300", bar: "bg-zinc-400" },
];

export default function BrawlerStats({ brawlers, brawlifyMap }: Props) {
  const total = brawlers.length;

  // Trophy milestones
  const milestoneCounts = MILESTONES.map(({ min, label, color, bar }) => ({
    label,
    color,
    bar,
    count: brawlers.filter((b) => b.trophies >= min).length,
  }));

  // By rarity
  const rarityMap = new Map<string, { color: string; count: number }>();
  for (const b of brawlers) {
    const meta = brawlifyMap.get(b.id);
    const rarity = meta?.rarity.name ?? "Unknown";
    const color = meta?.rarity.color ?? "#888";
    const prev = rarityMap.get(rarity);
    rarityMap.set(rarity, { color, count: (prev?.count ?? 0) + 1 });
  }
  const rarities = [...rarityMap.entries()]
    .sort(([a], [b]) => (RARITY_ORDER[a] ?? 0) - (RARITY_ORDER[b] ?? 0));

  // By power level
  const powerMap = new Map<number, number>();
  for (const b of brawlers) {
    powerMap.set(b.power, (powerMap.get(b.power) ?? 0) + 1);
  }
  const powers = [...powerMap.entries()].sort(([a], [b]) => a - b);
  const maxPowerCount = Math.max(...powers.map(([, c]) => c));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Trophy milestones */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4 flex items-center gap-2">
          🏆 Trophées brawler
        </h3>
        <div className="space-y-3">
          {milestoneCounts.map(({ label, color, bar, count }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <span className={`text-sm font-bold ${color}`}>{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full ${bar}`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* By rarity */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4 flex items-center gap-2">
          💎 Par rareté
        </h3>
        <div className="space-y-2">
          {rarities.map(([rarity, { color, count }]) => (
            <div key={rarity} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm text-muted-foreground truncate">{rarity}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: color, width: `${(count / total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold w-6 text-right" style={{ color }}>{count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* By power level */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4 flex items-center gap-2">
          ⚡ Par niveau de puissance
        </h3>
        <div className="space-y-1.5">
          {powers.map(([power, count]) => (
            <div key={power} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4 text-right">P{power}</span>
              <div className="flex-1 h-4 rounded bg-muted overflow-hidden">
                <div
                  className="h-4 rounded bg-violet-500/80 flex items-center justify-end pr-1"
                  style={{ width: `${(count / maxPowerCount) * 100}%` }}
                >
                  {count > 1 && <span className="text-[10px] font-bold text-white">{count}</span>}
                </div>
              </div>
              <span className="text-xs font-bold w-4">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
