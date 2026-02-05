import React, { useRef, useState } from 'react';
import { Tile as TileType, Direction } from '../types';
import { getTileColor } from '../utils/colors';
import './Board.css';

interface BoardProps {
  size: number;
  tiles: TileType[];
  onSwipe: (direction: Direction, tileId?: number) => void;
  onTap?: (row: number, col: number) => void;
  chainCount?: number;
  chainPosition?: { row: number; col: number } | null;
}

export const Board: React.FC<BoardProps> = ({ size, tiles, onSwipe, onTap, chainCount, chainPosition }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; tileId?: number } | null>(null);
  const [cellSize, setCellSize] = useState<number>(0);
  
  // Constants
  const CELL_GAP = 10; // Gap between cells in pixels

  // Calculate cell size when board is mounted or resized
  const calculateCellSize = () => {
    if (!boardRef.current) return;
    const width = boardRef.current.offsetWidth;
    const newCellSize = (width - (size + 1) * CELL_GAP) / size;
    setCellSize(newCellSize);
  };

  // Update cell size on mount and when size changes
  React.useEffect(() => {
    calculateCellSize();
  }, [size]);

  // Update cell size on window resize
  React.useEffect(() => {
    const handleResize = () => {
      calculateCellSize();
    };
    
    window.addEventListener('resize', handleResize);
    // Also calculate after a short delay to ensure the board is rendered
    const timer = setTimeout(calculateCellSize, 0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [size]);

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
      // タップと判定 - 空のセルをタップした場合
      if (!touchStart.tileId && onTap && boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const col = Math.floor((touch.clientX - rect.left - CELL_GAP) / (cellSize + CELL_GAP));
        const row = Math.floor((touch.clientY - rect.top - CELL_GAP) / (cellSize + CELL_GAP));
        
        if (row >= 0 && row < size && col >= 0 && col < size) {
          onTap(row, col);
        }
      }
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
      // クリックと判定 - 空のセルをクリックした場合
      if (!touchStart.tileId && onTap && boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left - CELL_GAP) / (cellSize + CELL_GAP));
        const row = Math.floor((e.clientY - rect.top - CELL_GAP) / (cellSize + CELL_GAP));
        
        if (row >= 0 && row < size && col >= 0 && col < size) {
          onTap(row, col);
        }
      }
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
    return (width - (size + 1) * CELL_GAP) / size;
  };

  const getTileStyle = (tile: TileType): React.CSSProperties => {
    // Use the state cellSize instead of calculating on the fly
    const safeSize = cellSize || 50;
    return {
      width: `${safeSize}px`,
      height: `${safeSize}px`,
      left: `${CELL_GAP + tile.position.col * (safeSize + CELL_GAP)}px`,
      top: `${CELL_GAP + tile.position.row * (safeSize + CELL_GAP)}px`,
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
      {(chainCount ?? 0) > 0 && chainPosition && (
        <div 
          className="chain-counter-overlay"
          style={{
            position: 'absolute',
            left: `${CELL_GAP + chainPosition.col * ((cellSize || 50) + CELL_GAP) + (cellSize || 50) / 2}px`,
            top: `${CELL_GAP + chainPosition.row * ((cellSize || 50) + CELL_GAP) + (cellSize || 50) / 2}px`,
            transform: 'translate(-50%, -50%)',
            fontSize: '40px',
            fontWeight: 'bold',
            color: '#667eea',
            textShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
            zIndex: 1000,
            animation: 'chainPulse 0.5s ease-out',
            pointerEvents: 'none',
          }}
        >
          {chainCount} CHAIN!
        </div>
      )}
    </div>
  );
};
