import type { Player } from "@/types/brawlstars";

interface Props {
  player: Player;
}

export default function PlayerProfile({ player }: Props) {
  const totalBrawlers = player.brawlers.length;

  return (
    <section className="glass p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Name */}
        <div className="flex items-center gap-4">
          <div>
            <div className="font-display text-3xl font-extrabold tracking-tight leading-none" style={{ color: player.nameColor?.replace("0xff", "#") ?? undefined }}>
              {player.name}
            </div>
            <div className="text-sm text-muted-foreground">{player.tag}</div>
            {player.club && (
              <div className="text-sm text-sky-600 dark:text-sky-300 mt-0.5">{player.club.name}</div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          <StatBlock label="Trophées" value={player.trophies.toLocaleString()} icon="🏆" highlight />
          <StatBlock label="Record" value={player.highestTrophies.toLocaleString()} />
          <StatBlock label="Niveau" value={`${player.expLevel}`} />
        </div>
      </div>

      {/* Victories row */}
      {/* 4 infos : 2x2 sur mobile, 4 de front ensuite. Le nombre de colonnes
          suit le nombre d'elements, sinon la rangee s'arrete avant le bord. */}
      <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <VictoryStat label="Victoires 3v3" value={player["3vs3Victories"]} />
        <VictoryStat label="Victoires Solo" value={player.soloVictories} />
        <VictoryStat label="Victoires Duo" value={player.duoVictories} />
        <VictoryStat label="Brawlers" value={`${totalBrawlers}`} />
      </div>
    </section>
  );
}

// `icon` est optionnel : seuls les trophées gardent un pictogramme, il annote
// un chiffre plutot qu'il ne decore un libelle.
function StatBlock({ label, value, icon, highlight }: { label: string; value: string; icon?: string; highlight?: boolean }) {
  return (
    <div className="glass-inset px-4 py-3">
      <div className="text-xs text-muted-foreground mb-1">{icon ? `${icon} ` : ""}{label}</div>
      {/* Plus petit sur mobile : 3 colonnes y laissent ~110 px par carte, un
          compteur a 5 chiffres deborderait en text-2xl. */}
      <div className={`font-display tabular text-xl sm:text-2xl font-extrabold leading-none ${highlight ? "text-amber-600 dark:text-amber-300" : ""}`}>{value}</div>
    </div>
  );
}

function VictoryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="font-display tabular text-lg font-extrabold">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
