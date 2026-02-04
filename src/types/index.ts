export interface Tile {
  id: number;
  value: number;
  position: { row: number; col: number };
  isNew?: boolean;
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  moveCount: number;
  tiles: Tile[];
}

export interface GameParams {
  boardSize: number;      // n: 3-8
  initialTiles: number;   // m: 1-10
  spawnInterval: number;  // k: 1-10
  maxPrime: number;       // p: 2-19
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface MergeStep {
  removedTiles: number[];
  changedTiles: Map<number, number>; // id -> new value
  score: number;
  chainNumber: number;
}

export interface MergeResult {
  merged: boolean;
  chainCount: number;
  score: number;
  removedTiles: number[];
  changedTiles: Map<number, number>; // id -> new value
  steps: MergeStep[]; // 各連鎖ステップの情報
}
