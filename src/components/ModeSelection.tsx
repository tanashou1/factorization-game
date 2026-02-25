import React, { useState } from 'react';
import { GameMode } from '../types';
import { Ranking } from './Ranking';
import './ModeSelection.css';

interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  const [rankingMode, setRankingMode] = useState<GameMode | null>(null);

  return (
    <div className="mode-selection-overlay">
      <div className="mode-selection-container">
        <h1>🔢 因数分解ゲーム</h1>
        <h2>ゲームモードを選択してください</h2>
        
        <div className="mode-cards">
          <button
            className="mode-card free-mode"
            onClick={() => onSelectMode('free')}
          >
            <div className="mode-icon">🎮</div>
            <h3>フリーモード</h3>
            <p>
              自由にパラメータを設定して遊べるモードです。
              <br />
              ボードサイズ、最大素数など、すべての設定を変更できます。
            </p>
            <ul>
              <li>パラメータを自由に調整</li>
              <li>自分のペースでプレイ</li>
              <li>練習に最適</li>
            </ul>
          </button>

          <button
            className="mode-card challenge-mode"
            onClick={() => onSelectMode('challenge')}
          >
            <div className="mode-icon">🏆</div>
            <h3>チャレンジモード</h3>
            <p>
              レベルがどんどん上がる挑戦モードです。
              <br />
              レベルは素数の順番に上がっていきます（2, 3, 5, 7...）。
            </p>
            <ul>
              <li>レベル2からスタート</li>
              <li>目標スコア達成で次のレベルへ</li>
              <li>使える数字が徐々に増加</li>
            </ul>
          </button>
        </div>

        <div className="ranking-links">
          <button className="ranking-link-btn" onClick={() => setRankingMode('free')}>
            📊 フリーモードのランキング
          </button>
          <button className="ranking-link-btn" onClick={() => setRankingMode('challenge')}>
            📊 チャレンジモードのランキング
          </button>
        </div>
      </div>

      {rankingMode && (
        <Ranking mode={rankingMode} onClose={() => setRankingMode(null)} />
      )}
    </div>
  );
};
