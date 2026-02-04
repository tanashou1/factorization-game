import { Tile, GameState, GameParams, Direction, MergeResult, MergeStep } from '../types';
import { generateTileValue, isDivisor } from './math';

let nextTileId = 1;

/**
 * 空のボードを作成
 */
export function createEmptyBoard(size: number): (Tile | null)[][] {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

/**
 * ランダムな空きマスを取得
 */
function getEmptyPositions(board: (Tile | null)[][]): { row: number; col: number }[] {
  const positions: { row: number; col: number }[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
}

/**
 * 新しいタイルを生成
 */
export function spawnTile(board: (Tile | null)[][], maxPrime: number): Tile | null {
  const emptyPositions = getEmptyPositions(board);
  if (emptyPositions.length === 0) return null;
  
  const position = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const tile: Tile = {
    id: nextTileId++,
    value: generateTileValue(maxPrime),
    position,
    isNew: true,
  };
  
  return tile;
}

/**
 * 初期ゲーム状態を作成
 */
export function createInitialState(params: GameParams): GameState {
  const board = createEmptyBoard(params.boardSize);
  const tiles: Tile[] = [];
  
  for (let i = 0; i < params.initialTiles; i++) {
    const tile = spawnTile(board, params.maxPrime);
    if (tile) {
      tiles.push(tile);
      board[tile.position.row][tile.position.col] = tile;
    }
  }
  
  return {
    board,
    score: 0,
    moveCount: 0,
    tiles,
  };
}

/**
 * タイルを指定方向に移動
 */
export function moveTile(
  tile: Tile,
  direction: Direction,
  board: (Tile | null)[][]
): { row: number; col: number } | null {
  const { row, col } = tile.position;
  let newRow = row;
  let newCol = col;
  
  switch (direction) {
    case 'up':
      newRow = row - 1;
      break;
    case 'down':
      newRow = row + 1;
      break;
    case 'left':
      newCol = col - 1;
      break;
    case 'right':
      newCol = col + 1;
      break;
  }
  
  // 盤面外チェック
  if (newRow < 0 || newRow >= board.length || newCol < 0 || newCol >= board[0].length) {
    return null;
  }
  
  // 既に他のタイルがある場合は移動しない
  if (board[newRow][newCol] !== null) {
    return null;
  }
  
  return { row: newRow, col: newCol };
}

/**
 * すべてのタイルを指定方向に移動
 */
export function moveAllTiles(
  state: GameState,
  direction: Direction
): GameState {
  const newBoard = createEmptyBoard(state.board.length);
  const newTiles = [...state.tiles];
  
  // 移動方向に応じてタイルを処理する順序を決定
  const sortedTiles = [...newTiles].sort((a, b) => {
    switch (direction) {
      case 'up':
        return a.position.row - b.position.row;
      case 'down':
        return b.position.row - a.position.row;
      case 'left':
        return a.position.col - b.position.col;
      case 'right':
        return b.position.col - a.position.col;
    }
  });
  
  // 各タイルを可能な限り移動
  sortedTiles.forEach(tile => {
    let currentPos = { ...tile.position };
    let moved = false;
    
    while (true) {
      const nextPos = moveTile({ ...tile, position: currentPos }, direction, newBoard);
      if (nextPos === null) break;
      currentPos = nextPos;
      moved = true;
    }
    
    if (moved) {
      tile.position = currentPos;
    }
    newBoard[currentPos.row][currentPos.col] = tile;
  });
  
  return {
    ...state,
    board: newBoard,
    tiles: newTiles,
    moveCount: state.moveCount + 1,
  };
}

/**
 * 隣接するタイルを取得
 */
function getAdjacentTiles(tile: Tile, board: (Tile | null)[][]): Tile[] {
  const { row, col } = tile.position;
  const adjacent: Tile[] = [];
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];
  
  directions.forEach(dir => {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[0].length) {
      const adjacentTile = board[newRow][newCol];
      if (adjacentTile !== null) {
        adjacent.push(adjacentTile);
      }
    }
  });
  
  return adjacent;
}

/**
 * タイルの合体・消滅処理
 */
export function processMerges(state: GameState): MergeResult {
  const result: MergeResult = {
    merged: false,
    chainCount: 0,
    score: 0,
    removedTiles: [],
    changedTiles: new Map(),
    steps: [],
  };
  
  let currentState = { ...state };
  let chainMultiplier = 1;
  let chainNumber = 1;
  
  while (true) {
    const stepResult = processOneMergeRound(currentState, chainMultiplier);
    if (!stepResult.mergeOccurred) break;
    
    result.merged = true;
    result.chainCount++;
    result.score += stepResult.score;
    
    // 各ステップの情報を記録
    const step: MergeStep = {
      removedTiles: stepResult.removedTiles,
      changedTiles: stepResult.changedTiles,
      score: stepResult.score,
      chainNumber: chainNumber,
    };
    result.steps.push(step);
    
    // 全体の削除・変更タイルを記録
    result.removedTiles.push(...stepResult.removedTiles);
    stepResult.changedTiles.forEach((value, id) => {
      result.changedTiles.set(id, value);
    });
    
    chainMultiplier *= 2;
    chainNumber++;
  }
  
  return result;
}

/**
 * 1回分の合体処理
 */
function processOneMergeRound(
  state: GameState,
  chainMultiplier: number
): {
  mergeOccurred: boolean;
  score: number;
  removedTiles: number[];
  changedTiles: Map<number, number>;
} {
  let mergeOccurred = false;
  const tilesToRemove: number[] = [];
  const tilesToChange = new Map<number, number>();
  let score = 0;
  
  // 小さい値のタイルから順に処理
  const sortedTiles = [...state.tiles].sort((a, b) => a.value - b.value);
  
  for (const tile of sortedTiles) {
    if (tilesToRemove.includes(tile.id)) continue;
    
    const adjacentTiles = getAdjacentTiles(tile, state.board);
    
    for (const adjacent of adjacentTiles) {
      if (tilesToRemove.includes(adjacent.id)) continue;
      
      // 同じ値のタイル同士
      if (tile.value === adjacent.value) {
        tilesToRemove.push(tile.id, adjacent.id);
        score += (tile.value + adjacent.value) * chainMultiplier;
        mergeOccurred = true;
        break;
      }
      
      // 約数関係
      if (tile.value < adjacent.value && isDivisor(tile.value, adjacent.value)) {
        const newValue = adjacent.value / tile.value;
        tilesToRemove.push(tile.id);
        tilesToChange.set(adjacent.id, newValue);
        score += tile.value * chainMultiplier;
        
        // 値が1になったら消滅
        if (newValue === 1) {
          tilesToRemove.push(adjacent.id);
          score += adjacent.value * chainMultiplier;
        }
        
        mergeOccurred = true;
        break;
      }
      
      if (adjacent.value < tile.value && isDivisor(adjacent.value, tile.value)) {
        const newValue = tile.value / adjacent.value;
        tilesToRemove.push(adjacent.id);
        tilesToChange.set(tile.id, newValue);
        score += adjacent.value * chainMultiplier;
        
        // 値が1になったら消滅
        if (newValue === 1) {
          tilesToRemove.push(tile.id);
          score += tile.value * chainMultiplier;
        }
        
        mergeOccurred = true;
        break;
      }
    }
  }
  
  // 状態を更新
  if (mergeOccurred) {
    // タイルを削除
    state.tiles = state.tiles.filter(t => !tilesToRemove.includes(t.id));
    
    // タイルの値を変更
    tilesToChange.forEach((newValue, tileId) => {
      const tile = state.tiles.find(t => t.id === tileId);
      if (tile) {
        tile.value = newValue;
      }
    });
    
    // ボードを再構築
    const newBoard = createEmptyBoard(state.board.length);
    state.tiles.forEach(tile => {
      newBoard[tile.position.row][tile.position.col] = tile;
    });
    state.board = newBoard;
  }
  
  return {
    mergeOccurred,
    score,
    removedTiles: tilesToRemove,
    changedTiles: tilesToChange,
  };
}

/**
 * 特定のタイルを移動
 */
export function moveSingleTile(
  state: GameState,
  tileId: number,
  direction: Direction
): GameState {
  const tile = state.tiles.find(t => t.id === tileId);
  if (!tile) return state;
  
  const newBoard = state.board.map(row => [...row]);
  const nextPos = moveTile(tile, direction, newBoard);
  
  if (nextPos === null) return state;
  
  // 古い位置をクリア
  newBoard[tile.position.row][tile.position.col] = null;
  
  // 新しい位置に配置
  tile.position = nextPos;
  newBoard[nextPos.row][nextPos.col] = tile;
  
  return {
    ...state,
    board: newBoard,
    moveCount: state.moveCount + 1,
  };
}

/**
 * 1ステップ分の合体処理を実行（App.tsxから呼ばれる）
 */
export function processOneMergeStep(
  state: GameState,
  chainNumber: number
): {
  merged: boolean;
  score: number;
  removedTiles: number[];
  changedTiles: Map<number, number>;
  newState: GameState;
} {
  const chainMultiplier = Math.pow(2, chainNumber - 1);
  const currentState = {
    ...state,
    board: state.board.map(row => [...row]),
    tiles: [...state.tiles],
  };
  
  const stepResult = processOneMergeRound(currentState, chainMultiplier);
  
  return {
    merged: stepResult.mergeOccurred,
    score: stepResult.score,
    removedTiles: stepResult.removedTiles,
    changedTiles: stepResult.changedTiles,
    newState: currentState,
  };
}
