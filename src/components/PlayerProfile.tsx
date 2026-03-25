import type { Player } from "@/types/brawlstars";

interface Props {
  player: Player;
}

export default function PlayerProfile({ player }: Props) {
  const totalBrawlers = player.brawlers.length;
  const maxTrophiesSum = player.brawlers.reduce((s, b) => s + b.highestTrophies, 0);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Name */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xl font-bold" style={{ color: player.nameColor?.replace("0xff", "#") ?? undefined }}>
              {player.name}
            </div>
            <div className="text-sm text-muted-foreground">{player.tag}</div>
            {player.club && (
              <div className="text-sm text-blue-400 mt-0.5">🏛 {player.club.name}</div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBlock label="Trophées" value={player.trophies.toLocaleString()} icon="🏆" highlight />
          <StatBlock label="Record" value={player.highestTrophies.toLocaleString()} icon="⭐" />
          <StatBlock label="Max potentiel" value={maxTrophiesSum.toLocaleString()} icon="🎯" />
          <StatBlock label="Niveau" value={`${player.expLevel}`} icon="⚡" />
        </div>
      </div>

      {/* Victories row */}
      <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
        <VictoryStat label="Victoires 3v3" value={player["3vs3Victories"]} icon="🤝" />
        <VictoryStat label="Victoires Solo" value={player.soloVictories} icon="🥊" />
        <VictoryStat label="Victoires Duo" value={player.duoVictories} icon="👥" />
        <VictoryStat label="Bagarreurs" value={`${totalBrawlers}`} icon="🎮" />
        <VictoryStat label="XP" value={player.expPoints.toLocaleString()} icon="✨" />
        <VictoryStat label="Best Robo" value={player.bestRoboRumbleTime > 0 ? `${player.bestRoboRumbleTime}s` : "—"} icon="🤖" />
      </div>
    </section>
  );
}

function StatBlock({ label, value, icon, highlight }: { label: string; value: string; icon: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-muted/60 px-4 py-3">
      <div className="text-xs text-muted-foreground mb-1">{icon} {label}</div>
      <div className={`text-xl font-bold ${highlight ? "text-yellow-400" : ""}`}>{value}</div>
    </div>
  );
}

function VictoryStat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div>
      <div className="text-lg font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-xs text-muted-foreground">{icon} {label}</div>
    </div>
  );
}
