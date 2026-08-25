import type { Brawler } from "@/types/brawlstars";

interface Props {
  brawlers: Brawler[];
}

const MILESTONES = [
  { min: 1000, label: "1000+", color: "text-sky-600 dark:text-sky-300", bar: "bg-sky-500" },
  { min: 750, label: "750+", color: "text-amber-600 dark:text-amber-300", bar: "bg-amber-500" },
  { min: 500, label: "500+", color: "text-emerald-600 dark:text-emerald-300", bar: "bg-emerald-500" },
  { min: 300, label: "300+", color: "text-foreground/70", bar: "bg-foreground/40" },
];

export default function BrawlerStats({ brawlers }: Props) {
  const total = brawlers.length;

  // Trophy milestones
  const milestoneCounts = MILESTONES.map(({ min, label, color, bar }) => ({
    label,
    color,
    bar,
    count: brawlers.filter((b) => b.trophies >= min).length,
  }));

  // By power level
  const powerMap = new Map<number, number>();
  for (const b of brawlers) {
    powerMap.set(b.power, (powerMap.get(b.power) ?? 0) + 1);
  }
  const powers = [...powerMap.entries()].sort(([a], [b]) => a - b);
  const maxPowerCount = Math.max(...powers.map(([, c]) => c));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Trophy milestones */}
      <section className="glass p-5">
        <h3 className="font-display text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase mb-4 flex items-center gap-2">
          🏆 Trophées brawler
        </h3>
        <div className="space-y-3">
          {milestoneCounts.map(({ label, color, bar, count }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <span className={`text-sm font-bold ${color}`}>{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-foreground/10">
                <div
                  className={`h-1.5 rounded-full ${bar}`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* By power level */}
      <section className="glass p-5">
        <h3 className="font-display text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase mb-4 flex items-center gap-2">
          Par niveau de puissance
        </h3>
        <div className="space-y-1.5">
          {powers.map(([power, count]) => (
            <div key={power} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-4 text-right">P{power}</span>
              <div className="flex-1 h-4 rounded bg-foreground/10 overflow-hidden">
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
