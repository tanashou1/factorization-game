import { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { ModeSelection } from './components/ModeSelection';
import { GameState, GameParams, Direction, GameMode, Tile } from './types';
import {
  createInitialState,
  moveAllTiles,
  moveSingleTile,
  processOneMergeStep,
  spawnTile,
  createEmptyBoard,
  getNextTileId,
  checkGameOver,
} from './utils/gameLogic';
import { getNextPrime } from './utils/math';
import packageJson from '../package.json';
import './App.css';

const defaultParams: GameParams = {
  boardSize: 4,
  initialTiles: 2,
  spawnInterval: 3,
  maxPrime: 7,
};

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [params, setParams] = useState<GameParams>(defaultParams);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [chainCount, setChainCount] = useState<number>(0);
  const [chainPosition, setChainPosition] = useState<{ row: number; col: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  // Initialize game state when mode is selected
  useEffect(() => {
    if (gameMode && !gameState) {
      const initialParams = gameMode === 'challenge' 
        ? { ...defaultParams, maxPrime: 2 }
        : defaultParams;
      setParams(initialParams);
      setGameState(createInitialState(initialParams, gameMode));
    }
  }, [gameMode]);

  const handleModeSelection = (mode: GameMode) => {
    setGameMode(mode);
    const initialParams = mode === 'challenge' 
      ? { ...defaultParams, maxPrime: 2 }
      : defaultParams;
    setParams(initialParams);
    setGameState(createInitialState(initialParams, mode));
  };

  const handleReset = () => {
    if (!gameMode) return;
    
    if (gameMode === 'challenge') {
      // Challenge mode: reset to level 2
      const resetParams = { ...params, maxPrime: 2 };
      setParams(resetParams);
      setGameState(createInitialState(resetParams, gameMode));
    } else {
      // Free mode: reset with current params
      setGameState(createInitialState(params, gameMode));
    }
    setChainCount(0);
    setChainPosition(null);
    setLevelUpMessage(null);
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    setGameState(null);
    setChainCount(0);
    setChainPosition(null);
    setLevelUpMessage(null);
  };

  // Check for level up in challenge mode
  useEffect(() => {
    if (!gameState || gameState.mode !== 'challenge') return;
    
    if (gameState.targetScore && gameState.score >= gameState.targetScore) {
      // Level up!
      const currentLevel = gameState.currentLevel || 2;
      const nextLevel = getNextPrime(currentLevel);
      const nextTargetScore = nextLevel ** 4;
      
      setLevelUpMessage(`Level ${nextLevel}`);
      
      // Update game state with new level
      setGameState({
        ...gameState,
        currentLevel: nextLevel,
        targetScore: nextTargetScore,
      });
      
      // Update params to use new maxPrime
      setParams({
        ...params,
        maxPrime: nextLevel,
      });
      
      // Clear level up message after 1 second
      setTimeout(() => {
        setLevelUpMessage(null);
      }, 1000);
    }
  }, [gameState, params]);

  if (!gameMode) {
    return <ModeSelection onSelectMode={handleModeSelection} />;
  }

  if (!gameState) {
    return <div>Loading...</div>;
  }

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

  const handleTap = (row: number, col: number) => {
    if (isAnimating) return;
    
    // その位置が空いているか確認
    if (gameState.board[row][col] !== null) {
      return;
    }
    
    // ランダムな素数でタイルを生成
    const primes = [2, 3, 5, 7, 11, 13, 17, 19].filter(p => p <= params.maxPrime);
    const randomPrime = primes[Math.floor(Math.random() * primes.length)];
    
    const newTile: Tile = {
      id: getNextTileId(),
      value: randomPrime,
      position: { row, col },
      isNew: true,
    };
    
    const newBoard = gameState.board.map(row => [...row]);
    newBoard[row][col] = newTile;
    
    setGameState({
      ...gameState,
      board: newBoard,
      tiles: [...gameState.tiles, newTile],
    });
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
        let firstPairPosition: { row: number; col: number } | null = null;
        stepResult.reactingPairs.forEach(pair => {
          const tile1 = currentState.tiles.find(t => t.id === pair.tile1Id);
          const tile2 = currentState.tiles.find(t => t.id === pair.tile2Id);
          if (tile1) tile1.isReacting = true;
          if (tile2) tile2.isReacting = true;
          
          // チェインカウンターの位置を計算（最初のペアの中間位置）
          if (tile1 && tile2 && !firstPairPosition) {
            const midRow = (tile1.position.row + tile2.position.row) / 2;
            const midCol = (tile1.position.col + tile2.position.col) / 2;
            firstPairPosition = { row: midRow, col: midCol };
          }
        });
        
        // チェインカウンターの位置を設定
        if (firstPairPosition) {
          setChainPosition(firstPairPosition);
        }
        
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
        setChainPosition(null);
      }, 1000);

      // k回移動ごとまたはタイルが消滅したら新タイル生成
      if (currentState.moveCount % params.spawnInterval === 0 || allRemovedTiles.length > 0) {
        setTimeout(() => {
          const tile = spawnTile(currentState.board, params.maxPrime);
          if (tile) {
            const spawnBoard = currentState.board.map(row => [...row]);
            spawnBoard[tile.position.row][tile.position.col] = tile;
            const newStateWithTile = {
              ...currentState,
              board: spawnBoard,
              tiles: [...currentState.tiles, tile],
            };
            setGameState(newStateWithTile);
            
            // ゲームオーバーチェック（新タイル生成後）
            setTimeout(() => {
              if (checkGameOver(newStateWithTile)) {
                setGameState({
                  ...newStateWithTile,
                  isGameOver: true,
                });
              }
            }, 100);
          } else {
            // タイルを生成できなかった場合もゲームオーバーチェック
            if (checkGameOver(currentState)) {
              setGameState({
                ...currentState,
                isGameOver: true,
              });
            }
          }
        }, 300);
      } else {
        // タイルを生成しない場合もゲームオーバーチェック
        setTimeout(() => {
          if (checkGameOver(currentState)) {
            setGameState({
              ...currentState,
              isGameOver: true,
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
          {gameMode === 'challenge' ? 'チャレンジモード - レベルを上げよう！' : 'タイルをスワイプして約数で割ろう！'}
        </p>
      </div>

      {gameMode === 'challenge' && (
        <div className="challenge-info">
          <div className="challenge-item">
            <div className="challenge-label">現在のレベル</div>
            <div className="challenge-value">{gameState.currentLevel}</div>
          </div>
          <div className="challenge-item">
            <div className="challenge-label">目標スコア</div>
            <div className="challenge-value">{gameState.targetScore}</div>
          </div>
        </div>
      )}

      <div className="score-display">
        <div className="score-item">
          <div className="score-label">スコア</div>
          <div className="score-value">{gameState.score}</div>
        </div>
      </div>

      <div className="game-board">
        <Board
          size={params.boardSize}
          tiles={gameState.tiles}
          onSwipe={handleSwipe}
          onTap={handleTap}
          chainCount={chainCount}
          chainPosition={chainPosition}
        />
      </div>

      {levelUpMessage && (
        <div className="level-up-message">
          {levelUpMessage}
        </div>
      )}

      {gameState.isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>🎮 ゲームオーバー</h2>
            <p>盤面が満杯で、これ以上反応ができません</p>
            <div className="final-score">
              最終スコア: {gameState.score}
            </div>
            <button onClick={handleReset}>
              🔄 リトライ
            </button>
          </div>
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
              disabled={gameMode === 'challenge'}
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
              disabled={gameMode === 'challenge'}
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
              disabled={gameMode === 'challenge'}
            />
          </div>
          {gameMode === 'free' && (
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
          )}
          {gameMode === 'challenge' && (
            <div className="param-control">
              <label>最大素数 (p): {params.maxPrime} (自動)</label>
              <div style={{ 
                padding: '12px', 
                background: '#f0f0f0', 
                borderRadius: '4px', 
                textAlign: 'center',
                color: '#666',
                fontSize: '14px'
              }}>
                レベルに応じて自動変更
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleReset}>
            🔄 リセット
          </button>
          <button className="btn btn-secondary" onClick={handleBackToMenu}>
            🏠 メニューに戻る
          </button>
        </div>

        <div className="instructions">
          <h3>📖 遊び方</h3>
          <p>
            <strong>タイルをスワイプ:</strong> タイルに触れてスワイプで移動<br />
            <strong>空きマスをスワイプ:</strong> 全タイルが一緒に移動<br />
            <strong>空きマスをタップ:</strong> その位置に新しいタイルを生成<br />
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
