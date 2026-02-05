import React, { useRef, useState } from 'react';
import { Tile as TileType, Direction } from '../types';
import { getTileColor } from '../utils/colors';
import './Board.css';

interface BoardProps {
  size: number;
  tiles: TileType[];
  onSwipe: (direction: Direction, tileId?: number) => void;
}

export const Board: React.FC<BoardProps> = ({ size, tiles, onSwipe }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; tileId?: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent, tileId?: number) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY, tileId });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // スワイプの最小距離
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      setTouchStart(null);
      return;
    }

    let direction: Direction;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    onSwipe(direction, touchStart.tileId);
    setTouchStart(null);
  };

  const handleMouseDown = (e: React.MouseEvent, tileId?: number) => {
    setTouchStart({ x: e.clientX, y: e.clientY, tileId });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStart) return;

    const deltaX = e.clientX - touchStart.x;
    const deltaY = e.clientY - touchStart.y;

    const minSwipeDistance = 30;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      setTouchStart(null);
      return;
    }

    let direction: Direction;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    onSwipe(direction, touchStart.tileId);
    setTouchStart(null);
  };

  const getCellSize = () => {
    if (!boardRef.current) return 0;
    const width = boardRef.current.offsetWidth;
    const gap = 10;
    return (width - (size + 1) * gap) / size;
  };

  const getTileStyle = (tile: TileType): React.CSSProperties => {
    const cellSize = getCellSize();
    const gap = 10;
    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      left: `${gap + tile.position.col * (cellSize + gap)}px`,
      top: `${gap + tile.position.row * (cellSize + gap)}px`,
      fontSize: tile.value > 999 ? '16px' : '20px',
      background: getTileColor(tile.value), // 動的に色を設定
    };
  };

  return (
    <div
      ref={boardRef}
      className="board-container"
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={handleMouseUp}
    >
      <div
        className="board-grid"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {Array(size * size)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="board-cell" />
          ))}
      </div>
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className={`tile ${tile.isNew ? 'new' : ''} ${tile.isReacting ? 'reacting' : ''}`}
          data-value={tile.value}
          style={getTileStyle(tile)}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart(e, tile.id);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, tile.id);
          }}
        >
          <span className="tile-value">{tile.value}</span>
        </div>
      ))}
    </div>
  );
};
