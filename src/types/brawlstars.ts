export interface Club {
  tag: string;
  name: string;
}

export interface Icon {
  id: number;
}

export interface Brawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  gears: { name: string; level: number }[];
  starPowers: { id: number; name: string }[];
  gadgets: { id: number; name: string }[];
  hyperCharges?: { id: number; name: string }[];
}

export interface Player {
  tag: string;
  name: string;
  nameColor: string;
  icon: Icon;
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  expPoints: number;
  isQualifiedFromChampionshipChallenge: boolean;
  "3vs3Victories": number;
  soloVictories: number;
  duoVictories: number;
  bestRoboRumbleTime: number;
  bestTimeAsBigBrawler: number;
  club?: Club;
  brawlers: Brawler[];
}

export interface BattlePlayer {
  tag: string;
  name: string;
  brawler: {
    id: number;
    name: string;
    power: number;
    trophyChange?: number;
  };
}

export interface BattleTeam {
  players: BattlePlayer[];
}

export interface Battle {
  mode: string;
  type: string;
  result?: string;
  duration?: number;
  trophyChange?: number;
  starPlayer?: BattlePlayer;
  teams?: BattleTeam[];
  players?: BattlePlayer[];
}

export interface BattleLogItem {
  battleTime: string;
  event: {
    id: number;
    mode: string;
    map: string;
  };
  battle: Battle;
}

export interface BattleLog {
  items: BattleLogItem[];
}
