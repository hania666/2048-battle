import { useEffect, useRef, useCallback } from 'react';
import { Board, Direction, move, addRandomTile, hasMovesLeft } from '../game/logic';

const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

// Простая оценка доски — чем больше пустых клеток и выше максимальная плитка тем лучше
function evaluateBoard(board: Board): number {
  let score = 0;
  let empty = 0;
  let maxTile = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty++;
      if (board[r][c] > maxTile) maxTile = board[r][c];
    }
  }

  score += empty * 10;
  score += maxTile;

  // Бонус если максимальная плитка в углу
  if (
    board[0][0] === maxTile || board[0][3] === maxTile ||
    board[3][0] === maxTile || board[3][3] === maxTile
  ) {
    score += maxTile * 2;
  }

  return score;
}

// Выбираем лучший ход для бота
function getBestMove(board: Board, difficulty: 'easy' | 'medium' | 'hard'): Direction {
  // Easy — случайный ход
  if (difficulty === 'easy') {
    const valid = DIRECTIONS.filter(d => move(board, d).moved);
    return valid[Math.floor(Math.random() * valid.length)] || 'left';
  }

  // Medium — иногда случайный иногда лучший
  if (difficulty === 'medium' && Math.random() < 0.3) {
    const valid = DIRECTIONS.filter(d => move(board, d).moved);
    return valid[Math.floor(Math.random() * valid.length)] || 'left';
  }

  // Hard/Medium — выбираем лучший ход
  let bestScore = -1;
  let bestDir: Direction = 'left';

  for (const dir of DIRECTIONS) {
    const result = move(board, dir);
    if (!result.moved) continue;
    const score = evaluateBoard(result.board) + result.score;
    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  return bestDir;
}

interface BotOptions {
  difficulty?: 'easy' | 'medium' | 'hard';
  minDelay?: number;
  maxDelay?: number;
  onMove?: (board: Board, score: number) => void;
}

export function useBot(
  enabled: boolean,
  initialBoard: Board,
  options: BotOptions = {}
) {
  const {
    difficulty = 'medium',
    minDelay = 400,
    maxDelay = 900,
    onMove,
  } = options;

  const boardRef = useRef<Board>(initialBoard);
  const scoreRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  const makeNextMove = useCallback(() => {
    if (!runningRef.current) return;
    if (!runningRef.current) return;

    const board = boardRef.current;
    if (!hasMovesLeft(board)) {
      runningRef.current = false;
      return;
    }

    const dir = getBestMove(board, difficulty);
    const result = move(board, dir);

    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      boardRef.current = newBoard;
      scoreRef.current += result.score;
      onMove?.(newBoard, scoreRef.current);
    }

    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    timerRef.current = setTimeout(makeNextMove, delay);
  }, [difficulty, minDelay, maxDelay, onMove]);

  useEffect(() => {
    if (enabled) {
      runningRef.current = true;
      boardRef.current = initialBoard;
      scoreRef.current = 0;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      timerRef.current = setTimeout(makeNextMove, delay);
    } else {
      runningRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      runningRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled]);

  return {
    getScore: () => scoreRef.current,
    getBoard: () => boardRef.current,
  };
}
