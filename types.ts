export interface Bite {
  id: number;
  x: number;
  y: number;
  r: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  time: number; // in milliseconds
  date: number;
}

export interface HotdogState {
  bites: Bite[];
  isFinished: boolean;
  progress: number; // 0 to 100
}

export enum GameState {
  IDLE = 'IDLE',
  EATING = 'EATING',
  FINISHED = 'FINISHED',
}
