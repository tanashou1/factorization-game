import { useState } from 'react';
import { Board } from './components/Board';
import { GameState, GameParams, Direction } from './types';
import {
  createInitialState,
  moveAllTiles,
  moveSingleTile,
  processOneMergeStep,
  spawnTile,
  createEmptyBoard,
} from './utils/gameLogic';
import packageJson from '../package.json';
import './App.css';

const defaultParams: GameParams = {
  boardSize: 4,
  initialTiles: 2,
  spawnInterval: 3,
  maxPrime: 7,
};

function App() {
  const [params, setParams] = useState<GameParams>(defaultParams);
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(defaultParams));
  const [chainCount, setChainCount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleReset = () => {
    setGameState(createInitialState(params));
    setChainCount(0);
  };

  const handleSpawnTile = () => {
    const tile = spawnTile(gameState.board, params.maxPrime);
    if (tile) {
      const newBoard = gameState.board.map(row => [...row]);
      newBoard[tile.position.row][tile.position.col] = tile;
      setGameState({
        ...gameState,
        board: newBoard,
        tiles: [...gameState.tiles, tile],
      });
    }
  };

  const handleSwipe = async (direction: Direction, tileId?: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    
    // タイルを移動
    let newState: GameState;
    if (tileId !== undefined) {
      newState = moveSingleTile(gameState, tileId, direction);
    } else {
      newState = moveAllTiles(gameState, direction);
    }

    // タイルのisNewフラグをリセット
    newState.tiles.forEach(tile => {
      tile.isNew = false;
    });

    setGameState(newState);

    // 少し待ってから合体処理
    setTimeout(async () => {
      let currentState = newState;
      let chainNumber = 1;
      let totalScore = 0;
      let hasMoreMerges = true;
      let allRemovedTiles: number[] = [];

      // 連鎖を500msごとに1ステップずつ処理
      while (hasMoreMerges) {
        const stepResult = processOneMergeStep(currentState, chainNumber);
        
        if (!stepResult.merged) {
          hasMoreMerges = false;
          break;
        }

        // 反応中のタイルにフラグを設定
        stepResult.reactingPairs.forEach(pair => {
          const tile1 = currentState.tiles.find(t => t.id === pair.tile1Id);
          const tile2 = currentState.tiles.find(t => t.id === pair.tile2Id);
          if (tile1) tile1.isReacting = true;
          if (tile2) tile2.isReacting = true;
        });
        
        // 反応エフェクトを表示するために状態を更新
        setGameState({ ...currentState });
        
        // 反応アニメーションの完了を待つ (300ms)
        await new Promise(resolve => setTimeout(resolve, 300));

        // チェインカウンター表示
        setChainCount(chainNumber);
        
        // スコアを加算
        totalScore += stepResult.score;
        allRemovedTiles.push(...stepResult.removedTiles);
        
        // 新しい状態を適用（スコアも含めて新しいオブジェクトを作成）
        currentState = {
          ...stepResult.newState,
          score: newState.score + totalScore,
        };
        
        // isReactingフラグをリセット
        currentState.tiles.forEach(tile => {
          tile.isReacting = false;
        });
        
        setGameState({ ...currentState });
        
        chainNumber++;

        // 次の反応まで200ms待機
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // チェインカウンター非表示
      setTimeout(() => {
        setChainCount(0);
      }, 1000);

      // k回移動ごとまたはタイルが消滅したら新タイル生成
      if (currentState.moveCount % params.spawnInterval === 0 || allRemovedTiles.length > 0) {
        setTimeout(() => {
          const tile = spawnTile(currentState.board, params.maxPrime);
          if (tile) {
            const spawnBoard = currentState.board.map(row => [...row]);
            spawnBoard[tile.position.row][tile.position.col] = tile;
            setGameState({
              ...currentState,
              board: spawnBoard,
              tiles: [...currentState.tiles, tile],
            });
          }
        }, 300);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    }, 200);
  };

  const handleParamChange = (key: keyof GameParams, value: number) => {
    setParams({ ...params, [key]: value });
  };

  return (
    <div className="app">
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0 }}>🔢 因数分解ゲーム</h1>
          <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>v{packageJson.version}</span>
        </div>
        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
          タイルをスワイプして約数で割ろう！
        </p>
      </div>

      <div className="score-display">
        <div className="score-item">
          <div className="score-label">スコア</div>
          <div className="score-value">{gameState.score}</div>
        </div>
        <div className="score-item">
          <div className="score-label">移動回数</div>
          <div className="score-value">{gameState.moveCount}</div>
        </div>
        <div className="score-item">
          <div className="score-label">タイル数</div>
          <div className="score-value">{gameState.tiles.length}</div>
        </div>
      </div>

      <div className="game-board">
        <Board
          size={params.boardSize}
          tiles={gameState.tiles}
          onSwipe={handleSwipe}
        />
      </div>

      {chainCount > 0 && (
        <div className="chain-counter">
          {chainCount}連鎖！
        </div>
      )}

      <div className="controls">
        <div className="params-grid">
          <div className="param-control">
            <label>ボードサイズ (n): {params.boardSize}</label>
            <input
              type="range"
              min="3"
              max="8"
              value={params.boardSize}
              onChange={(e) => handleParamChange('boardSize', Number(e.target.value))}
            />
          </div>
          <div className="param-control">
            <label>初期タイル数 (m): {params.initialTiles}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={params.initialTiles}
              onChange={(e) => handleParamChange('initialTiles', Number(e.target.value))}
            />
          </div>
          <div className="param-control">
            <label>出現間隔 (k): {params.spawnInterval}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={params.spawnInterval}
              onChange={(e) => handleParamChange('spawnInterval', Number(e.target.value))}
            />
          </div>
          <div className="param-control">
            <label>最大素数 (p): {params.maxPrime}</label>
            <select
              value={params.maxPrime}
              onChange={(e) => handleParamChange('maxPrime', Number(e.target.value))}
              style={{ width: '100%', padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="11">11</option>
              <option value="13">13</option>
              <option value="17">17</option>
              <option value="19">19</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleReset}>
            🔄 リセット
          </button>
          <button className="btn btn-secondary" onClick={handleSpawnTile}>
            ➕ タイル生成
          </button>
        </div>

        <div className="instructions">
          <h3>📖 遊び方</h3>
          <p>
            <strong>タイルをスワイプ:</strong> タイルに触れてスワイプで移動<br />
            <strong>空きマスをスワイプ:</strong> 全タイルが一緒に移動<br />
            <strong>合体:</strong> 約数関係にあるタイルが隣接すると割り算が発生<br />
            <strong>同じ値:</strong> 同じ値のタイルが隣接すると両方消滅
          </p>
        </div>
      </div>

      <div className="footer">
        <p style={{ margin: '10px 0', fontSize: '12px' }}>
          © 2026 Factorization Game - 素因数分解パズル
        </p>
      </div>
    </div>
  );
}

export default App;
