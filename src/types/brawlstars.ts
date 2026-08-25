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
  // L'API renvoie bien un `id` (ex. 62000002), il manquait dans ce type.
  gears: { id: number; name: string; level: number }[];
  starPowers: { id: number; name: string }[];
  gadgets: { id: number; name: string }[];
  hyperCharges?: { id: number; name: string }[];
  currentWinStreak?: number;
  maxWinStreak?: number;
  prestigeLevel?: number;
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

/**
 * Entree du catalogue officiel (`/v1/brawlers`) : la liste COMPLETE de ce
 * qu'un brawler peut posseder, la ou l'objet Brawler d'un joueur ne liste que
 * ce qu'il a deja. C'est ce qui permet de griser ce qui manque — et notamment
 * de savoir quels equipements sont eligibles, ce qui varie d'un brawler a
 * l'autre (NITA a PET POWER, COLT a RELOAD SPEED).
 */
export interface CatalogueBrawler {
  id: number;
  name: string;
  starPowers: { id: number; name: string }[];
  gadgets: { id: number; name: string }[];
  gears: { id: number; name: string; level: number }[];
  hyperCharges: { id: number; name: string }[];
}
