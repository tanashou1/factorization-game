import { RankingEntry, GameMode } from '../types';

const MAX_ENTRIES = 10;
const STORAGE_KEY = 'factorization-game-rankings';

function loadAll(): RankingEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RankingEntry[];
  } catch {
    return [];
  }
}

function saveAll(entries: RankingEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getRankings(mode: GameMode): RankingEntry[] {
  return loadAll()
    .filter(e => e.mode === mode)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
}

export function addRanking(entry: RankingEntry): void {
  const all = loadAll();
  all.push(entry);
  // Keep only top MAX_ENTRIES per mode, rest sorted by score desc
  const filtered = all.filter(e => e.mode !== entry.mode);
  const forMode = all
    .filter(e => e.mode === entry.mode)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
  saveAll([...filtered, ...forMode]);
}

export function clearRankings(mode: GameMode): void {
  const all = loadAll().filter(e => e.mode !== mode);
  saveAll(all);
}
