import React, { useState } from 'react';
import { RankingEntry, GameMode } from '../types';
import { getRankings, clearRankings } from '../utils/ranking';
import './Ranking.css';

interface RankingProps {
  mode: GameMode;
  onClose: () => void;
}

export const Ranking: React.FC<RankingProps> = ({ mode, onClose }) => {
  const [entries, setEntries] = useState<RankingEntry[]>(() => getRankings(mode));

  const handleClear = () => {
    if (window.confirm('ランキングをリセットしますか？')) {
      clearRankings(mode);
      setEntries([]);
    }
  };

  const modeLabel = mode === 'challenge' ? 'チャレンジモード' : 'フリーモード';

  return (
    <div className="ranking-overlay" onClick={onClose}>
      <div className="ranking-container" onClick={e => e.stopPropagation()}>
        <h2>🏆 ランキング</h2>
        <div className="ranking-mode-label">{modeLabel}</div>

        {entries.length === 0 ? (
          <p className="ranking-empty">まだ記録がありません</p>
        ) : (
          <table className="ranking-table">
            <thead>
              <tr>
                <th>順位</th>
                <th>名前</th>
                <th>スコア</th>
                {mode === 'challenge' && <th>レベル</th>}
                <th>日付</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className={index === 0 ? 'ranking-top' : ''}>
                  <td className="ranking-rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}位`}
                  </td>
                  <td>{entry.name}</td>
                  <td className="ranking-score">{entry.score.toLocaleString()}</td>
                  {mode === 'challenge' && <td>Lv.{entry.level ?? '-'}</td>}
                  <td className="ranking-date">{new Date(entry.date).toLocaleDateString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="ranking-buttons">
          <button className="ranking-btn ranking-btn-secondary" onClick={handleClear}>
            🗑️ リセット
          </button>
          <button className="ranking-btn ranking-btn-primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
