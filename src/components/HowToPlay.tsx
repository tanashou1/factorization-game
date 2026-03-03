import React from 'react';
import './HowToPlay.css';

interface HowToPlayProps {
  onClose: () => void;
}

// ゲームタイルを模したミニタイルコンポーネント
const MiniTile: React.FC<{ value: number | string; color: string }> = ({ value, color }) => (
  <div className="howtoplay-mini-tile" style={{ background: color }}>
    {value}
  </div>
);

// ミニボードコンポーネント（2×2グリッド）
const MiniBoard: React.FC<{ cells: (React.ReactNode)[] }> = ({ cells }) => (
  <div className="howtoplay-mini-board">
    {cells.map((cell, i) => (
      <div key={i} className="howtoplay-mini-cell">{cell}</div>
    ))}
  </div>
);

export const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
  return (
    <div className="howtoplay-overlay" onClick={onClose}>
      <div className="howtoplay-container" onClick={e => e.stopPropagation()}>
        <h2>📖 遊び方</h2>

        <section className="howtoplay-section">
          <h3>🎯 ゲームの目的</h3>
          <p>
            タイルをスワイプして約数・同値の関係にあるタイル同士を反応させ、
            できるだけ多くのスコアを獲得しましょう。
            盤面が満杯になり、これ以上反応できなくなるとゲームオーバーです。
          </p>
        </section>

        <section className="howtoplay-section">
          <h3>🕹️ 操作方法</h3>
          <ul>
            <li>
              <strong>タイルをスワイプ</strong>：タイルに触れてスワイプすると、
              そのタイルだけが指定方向へ移動します。
              {/* タイル単体スワイプのイラスト */}
              <div className="howtoplay-diagram">
                <div className="diagram-scene">
                  <MiniBoard cells={[
                    null, null,
                    <MiniTile value="7" color="linear-gradient(135deg, #64d964 0%, #32cd32 100%)" />, null
                  ]} />
                  <div className="diagram-arrow-right">→</div>
                  <MiniBoard cells={[
                    null, <MiniTile value="7" color="linear-gradient(135deg, #64d964 0%, #32cd32 100%)" />,
                    null, null
                  ]} />
                </div>
                <div className="diagram-caption">タイル「7」を右スワイプ → タイルだけ移動</div>
              </div>
            </li>
            <li>
              <strong>空きマスをスワイプ</strong>：空きマスをスワイプすると、
              盤面上のすべてのタイルが一緒に移動します。
              {/* 全タイル移動のイラスト */}
              <div className="howtoplay-diagram">
                <div className="diagram-scene">
                  <MiniBoard cells={[
                    <MiniTile value="2" color="linear-gradient(135deg, #ff6384 0%, #ff6384 100%)" />, null,
                    null, <MiniTile value="3" color="linear-gradient(135deg, #1e90ff 0%, #1e90ff 100%)" />
                  ]} />
                  <div className="diagram-arrow-right">→</div>
                  <MiniBoard cells={[
                    null, <MiniTile value="2" color="linear-gradient(135deg, #ff6384 0%, #ff6384 100%)" />,
                    null, <MiniTile value="3" color="linear-gradient(135deg, #1e90ff 0%, #1e90ff 100%)" />
                  ]} />
                </div>
                <div className="diagram-caption">空きマスを右スワイプ → 全タイルが一緒に移動</div>
              </div>
            </li>
            <li>
              <strong>空きマスをタップ</strong>：空きマスをタップすると、
              その位置にランダムな素数タイルが生成されます。
              {/* タップで新タイル生成のイラスト */}
              <div className="howtoplay-diagram">
                <div className="diagram-scene">
                  <MiniBoard cells={[
                    <MiniTile value="2" color="linear-gradient(135deg, #ff6384 0%, #ff6384 100%)" />, null,
                    null, null
                  ]} />
                  <div className="diagram-arrow-right">→</div>
                  <MiniBoard cells={[
                    <MiniTile value="2" color="linear-gradient(135deg, #ff6384 0%, #ff6384 100%)" />, null,
                    <MiniTile value="5" color="linear-gradient(135deg, #ffce56 0%, #ffce56 100%)" />, null
                  ]} />
                </div>
                <div className="diagram-caption">空きマスをタップ → その位置に素数タイルが出現</div>
              </div>
            </li>
          </ul>
        </section>

        <section className="howtoplay-section">
          <h3>⚗️ タイルの反応</h3>
          <p>タイルが隣接すると、以下の条件で自動的に反応が起きます：</p>
          <ul>
            <li>
              <strong>約数関係（割り算）</strong>：小さいタイルが大きいタイルの約数の場合、
              大きいタイルの値が小さいタイルの値で割られます。小さいタイルは消滅し、
              大きいタイルの値が更新されます。値が 1 になった場合も消滅します。
              {/* 割り算反応のイラスト */}
              <div className="howtoplay-diagram">
                <div className="diagram-scene">
                  <div className="diagram-tiles-row">
                    <MiniTile value="6" color="linear-gradient(135deg, #ff6384 0%, #1e90ff 100%)" />
                    <MiniTile value="2" color="linear-gradient(135deg, #ff6384 0%, #ff6384 100%)" />
                  </div>
                  <div className="diagram-arrow-right">→</div>
                  <div className="diagram-tiles-row">
                    <MiniTile value="3" color="linear-gradient(135deg, #1e90ff 0%, #1e90ff 100%)" />
                  </div>
                </div>
                <div className="diagram-caption">「6」と「2」が隣接 → 6÷2＝「3」が残る</div>
              </div>
            </li>
            <li>
              <strong>同じ値（消滅）</strong>：同じ値のタイルが隣接すると、両方とも消滅します。
              {/* 同値消滅のイラスト */}
              <div className="howtoplay-diagram">
                <div className="diagram-scene">
                  <div className="diagram-tiles-row">
                    <MiniTile value="5" color="linear-gradient(135deg, #ffce56 0%, #ffce56 100%)" />
                    <MiniTile value="5" color="linear-gradient(135deg, #ffce56 0%, #ffce56 100%)" />
                  </div>
                  <div className="diagram-arrow-right">→</div>
                  <div className="diagram-tiles-row diagram-empty-result">
                    <span className="diagram-gone">消滅！</span>
                  </div>
                </div>
                <div className="diagram-caption">「5」と「5」が隣接 → 両方消滅</div>
              </div>
            </li>
          </ul>
          <p>
            1回の移動で複数の反応が連続して起きることを<strong>連鎖（チェイン）</strong>と呼びます。
            連鎖が多いほどスコアが大幅に増加します。
          </p>
        </section>

        <section className="howtoplay-section">
          <h3>🆕 タイルの出現</h3>
          <ul>
            <li>k 回移動するごとに、新しいタイルが自動で出現します（出現間隔 k）。</li>
            <li>
              合成数タイルが消滅し、盤面が素数タイルだけになった場合も、
              新しいタイルが出現します。
            </li>
          </ul>
        </section>

        <section className="howtoplay-section">
          <h3>🔢 スコアの計算方法</h3>
          <p>スコアは連鎖の各ステップで計算されます：</p>
          <div className="howtoplay-formula">
            <div className="formula-row">
              <span className="formula-label">基本スコア</span>
              <span className="formula-eq">＝ 反応した 2 枚のタイルの値の合計</span>
            </div>
            <div className="formula-row">
              <span className="formula-label">連鎖倍率</span>
              <span className="formula-eq">
                ＝ 2<sup>（連鎖数 − 1）</sup>
                &nbsp;（1連鎖目: ×1、2連鎖目: ×2、3連鎖目: ×4 …）
              </span>
            </div>
            <div className="formula-row formula-final">
              <span className="formula-label">このステップのスコア</span>
              <span className="formula-eq">
                ＝ （基本スコア ＋ 直前までの累積スコア） × 連鎖倍率
              </span>
            </div>
          </div>
          <p>
            連鎖が続くほど累積スコアが増え、さらに連鎖倍率も乗算されるため、
            長い連鎖ほど爆発的にスコアが増加します。
          </p>
          <div className="howtoplay-example">
            <strong>計算例（2連鎖）：</strong>
            <ol>
              <li>1連鎖目：タイル「6」と「2」が反応 → 基本スコア 8、倍率 ×1 → <strong>8点</strong></li>
              <li>2連鎖目：タイル「5」と「5」が反応 → 基本スコア 10、累積スコア 8、倍率 ×2 → <strong>36点</strong></li>
              <li>合計：8 ＋ 36 ＝ <strong>44点</strong></li>
            </ol>
          </div>
        </section>

        <section className="howtoplay-section">
          <h3>🎮 ゲームモード</h3>
          <ul>
            <li>
              <strong>フリーモード</strong>：ボードサイズ・最大素数・出現間隔などをすべて自由に設定できます。
              自分のペースで練習したい方に最適です。
            </li>
            <li>
              <strong>チャレンジモード</strong>：レベル 2 からスタートし、目標スコアを達成するごとに
              レベルが素数の順番（2 → 3 → 5 → 7 …）で上がっていきます。
              レベルが上がるにつれて使える素数の種類が増え、より複雑な反応が起きます。
              目標スコア ＝ レベル<sup>4</sup>（例：レベル 3 なら 81点）。
            </li>
          </ul>
        </section>

        <button className="howtoplay-close-btn" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};
