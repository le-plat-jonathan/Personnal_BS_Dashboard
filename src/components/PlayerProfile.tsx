import type { Player } from "@/types/brawlstars";

interface Props {
  player: Player;
}

export default function PlayerProfile({ player }: Props) {
  const totalBrawlers = player.brawlers.length;

  return (
    <section className="glass p-6">
      {/* Le pseudo passe sur sa propre ligne : a cote de cinq cartes il les
          aurait comprimees a une centaine de pixels, ou il aurait fallu
          tronquer les libelles. */}
      <div className="mb-5">
        <div
          className="font-display text-3xl font-extrabold tracking-tight leading-none"
          style={{ color: player.nameColor?.replace("0xff", "#") ?? undefined }}
        >
          {player.name}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{player.tag}</div>
        {player.club && (
          <div className="text-sm text-sky-600 dark:text-sky-300 mt-0.5">{player.club.name}</div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatBlock label="Trophées" value={player.trophies.toLocaleString()} icon="🏆" highlight />
        <StatBlock label="Victoires 3v3" value={player["3vs3Victories"].toLocaleString()} />
        <StatBlock label="Victoires solo" value={player.soloVictories.toLocaleString()} />
        <StatBlock label="Victoires duo" value={player.duoVictories.toLocaleString()} />
        <StatBlock label="Brawlers" value={`${totalBrawlers}`} />
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
      <div className={`font-display tabular text-xl sm:text-2xl font-extrabold leading-none ${highlight ? "text-amber-600 dark:text-amber-300" : ""}`}>{value}</div>
    </div>
  );
}
