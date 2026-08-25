import Image from "next/image";
import { getBrawlerImageUrlBorderless } from "@/lib/brawlify";
import type { BattleLogItem } from "@/types/brawlstars";
interface Props {
  battles: BattleLogItem[];
  playerTag: string;
}
// L'API Brawl Stars en renvoie 25. Au-dela d'une dizaine la liste devient un
// mur : on garde les plus recentes, les seules qui disent quelque chose de la
// forme du joueur en ce moment.
const MAX_BATTLES = 10;
function formatDate(iso: string): string {
  const mo = iso.slice(4, 6);
  const d = iso.slice(6, 8);
  const h = iso.slice(9, 11);
  const mi = iso.slice(11, 13);
  return `${d}/${mo} · ${h}:${mi}`;
}
/**
 * Teinte d'une ligne selon son resultat.
 *
 * `tint` est diffuse et passe derriere le verre (cf. --tint dans globals.css),
 * `solid` ne sert qu'au lisere vertical de gauche. Les deux viennent de la
 * meme couleur : c'est ce qui donne l'impression d'une seule source lumineuse
 * placee derriere la plaque.
 */
function resultStyle(result?: string): {
  tint: string;
  solid: string;
  text: string;
  label: string;
} {
  if (result === "victory")
    return {
      tint: "oklch(0.72 0.19 155 / 0.3)",
      solid: "oklch(0.72 0.19 155)",
      text: "text-emerald-600 dark:text-emerald-300",
      label: "Victoire",
    };
  if (result === "defeat")
    return {
      tint: "oklch(0.65 0.24 20 / 0.28)",
      solid: "oklch(0.65 0.24 20)",
      text: "text-rose-600 dark:text-rose-300",
      label: "Défaite",
    };
  if (result === "draw")
    return {
      tint: "oklch(0.8 0.16 85 / 0.28)",
      solid: "oklch(0.8 0.16 85)",
      text: "text-amber-600 dark:text-amber-300",
      label: "Match nul",
    };
  return {
    tint: "transparent",
    solid: "oklch(0.6 0.02 292 / 0.5)",
    text: "text-muted-foreground",
    label: result ?? "—",
  };
}
function formatMode(mode?: string): string {
  if (!mode) return "—";
  return mode.replace(/([A-Z])/g, " $1").trim();
}
export default function BattleLog({ battles, playerTag }: Props) {
  const recent = battles.slice(0, MAX_BATTLES);
  return (
    <section className="glass p-6">
      <header className="flex items-baseline justify-between gap-3 mb-5">
        <h2 className="font-display text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase">
          Dernières parties
        </h2>
        <span className="font-display tabular text-xs font-bold text-muted-foreground">
          {recent.length}
        </span>
      </header>
      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune partie récente. Lance une game, elle apparaîtra ici.
        </p>
      ) : (
        <div className="space-y-2">
          {recent.map((item, i) => {
            const allPlayers = (
              item.battle.teams
                ? item.battle.teams.flatMap((t) => t.players ?? [])
                : item.battle.players ?? []
            ).filter(Boolean);
            const me = allPlayers.find((p) => p.tag === playerTag);
            const trophyChange =
              item.battle.trophyChange ?? me?.brawler?.trophyChange;
            const style = resultStyle(item.battle.result);
            const brawlerImgId = me?.brawler?.id;
            return (
              <div
                key={i}
                className="glass-row flex items-center gap-4 px-4 py-3"
                style={
                  {
                    "--tint": style.tint,
                    "--tint-solid": style.solid,
                  } as React.CSSProperties
                }
              >
                {/* Brawler icon */}
                <div className="relative w-10 h-10 shrink-0">
                  {brawlerImgId ? (
                    <Image
                      src={getBrawlerImageUrlBorderless(brawlerImgId)}
                      alt={me?.brawler?.name ?? ""}
                      fill
                      className="object-contain drop-shadow"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-foreground/10" />
                  )}
                </div>
                {/* Mode + map */}
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm capitalize">
                    {formatMode(item.event.mode)}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {item.event.map || "—"}
                  </div>
                  {me && (
                    <div className="text-xs text-muted-foreground">
                      {me.brawler.name} · P{me.brawler.power}
                    </div>
                  )}
                </div>
                {/* Result + trophy change */}
                <div className="flex flex-col items-end shrink-0 gap-0.5">
                  <span
                    className={`font-display text-sm font-extrabold ${style.text}`}
                  >
                    {style.label}
                  </span>
                  {trophyChange !== undefined && (
                    <span
                      className={`font-display tabular text-xs font-bold ${
                        trophyChange >= 0
                          ? "text-emerald-600 dark:text-emerald-300"
                          : "text-rose-600 dark:text-rose-300"
                      }`}
                    >
                      {trophyChange >= 0 ? "+" : ""}
                      {trophyChange} 🏆
                    </span>
                  )}
                  <span className="tabular text-[10px] text-muted-foreground">
                    {formatDate(item.battleTime)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
