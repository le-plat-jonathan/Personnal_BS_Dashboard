import Image from "next/image";
import { getBrawlerImageUrlBorderless } from "@/lib/brawlify";
import type { BattleLogItem } from "@/types/brawlstars";
import type { BrawlifyMap } from "@/types/brawlify";

interface Props {
  battles: BattleLogItem[];
  playerTag: string;
  brawlifyMap: BrawlifyMap;
}

function formatDate(iso: string): string {
  const y = iso.slice(0, 4);
  const mo = iso.slice(4, 6);
  const d = iso.slice(6, 8);
  const h = iso.slice(9, 11);
  const mi = iso.slice(11, 13);
  return `${d}/${mo}/${y} ${h}:${mi}`;
}

function resultStyle(result?: string): { bg: string; text: string; label: string } {
  if (result === "victory") return { bg: "border-green-500/40 bg-green-500/10", text: "text-green-400", label: "Victoire" };
  if (result === "defeat") return { bg: "border-red-500/40 bg-red-500/10", text: "text-red-400", label: "Défaite" };
  if (result === "draw") return { bg: "border-yellow-500/40 bg-yellow-500/10", text: "text-yellow-400", label: "Nul" };
  return { bg: "border-border bg-white/5", text: "text-muted-foreground", label: result ?? "—" };
}

function formatMode(mode: string): string {
  return mode.replace(/([A-Z])/g, " $1").trim();
}

export default function BattleLog({ battles, playerTag, brawlifyMap }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-5 flex items-center gap-2">
        ⚔️ Dernières parties{" "}
        <span className="text-foreground">{battles.length}</span>
      </h2>

      <div className="space-y-2">
        {battles.map((item, i) => {
          const allPlayers = (item.battle.teams
            ? item.battle.teams.flatMap((t) => t.players ?? [])
            : item.battle.players ?? []
          ).filter(Boolean);

          const me = allPlayers.find((p) => p.tag === playerTag);
          const trophyChange = item.battle.trophyChange ?? me?.brawler?.trophyChange;
          const style = resultStyle(item.battle.result);
          const brawlerImgId = me?.brawler?.id;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-lg border px-4 py-3 ${style.bg}`}
            >
              {/* Brawler icon */}
              <div className="relative w-10 h-10 shrink-0">
                {brawlerImgId ? (
                  <Image
                    src={getBrawlerImageUrlBorderless(brawlerImgId)}
                    alt={me?.brawler?.name ?? ""}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                )}
              </div>

              {/* Mode + map */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm capitalize">{formatMode(item.event.mode)}</div>
                <div className="text-xs text-muted-foreground truncate">{item.event.map || "—"}</div>
                {me && (
                  <div className="text-xs text-muted-foreground">
                    {me.brawler.name} · P{me.brawler.power}
                  </div>
                )}
              </div>

              {/* Result + trophy change */}
              <div className="flex flex-col items-end shrink-0 gap-1">
                <span className={`text-sm font-bold ${style.text}`}>{style.label}</span>
                {trophyChange !== undefined && (
                  <span className={`text-xs font-bold ${trophyChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {trophyChange >= 0 ? "+" : ""}{trophyChange} 🏆
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground">{formatDate(item.battleTime)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
