export interface AARR {
  acq: number;
  act: number;
  ret: number;
  ref: number;
  rev: number;
}

export interface XP {
  current: number;
  max: number;
}

export interface Player {
  id: string;
  name: string;
  xp: XP;
  aarr: AARR;
  cohort?: string;
  lastSeen?: string;
  sessions7d?: number;
}

export interface PlayerWithMetrics extends Player {
  percentXP: number;
  noteGlobale: number;
}