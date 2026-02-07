import { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'hotdog_eater_leaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse leaderboard", e);
    return [];
  }
};

export const saveScore = (name: string, time: number): LeaderboardEntry[] => {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    id: Date.now().toString(),
    name: name.trim() || 'Anonymous Eater',
    time,
    date: Date.now(),
  };

  const updated = [...current, newEntry]
    .sort((a, b) => a.time - b.time) // Sort by time ascending (fastest first)
    .slice(0, 10); // Keep top 10

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
