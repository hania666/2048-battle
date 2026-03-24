export type Board = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface MoveResult {
  board: Board;
  score: number;
  moved: boolean;
}

export function createEmptyBoard(): Board {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

export function addRandomTile(board: Board, seed?: number): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return board;
  const newBoard = board.map(row => [...row]);
  const idx = seed !== undefined ? seed % empty.length : Math.floor(Math.random() * empty.length);
  const [r, c] = empty[idx];
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function slideLeft(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter(x => x !== 0);
  let score = 0;
  const merged: number[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const val = filtered[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i++;
    }
  }
  while (merged.length < 4) merged.push(0);
  return { row: merged, score };
}

function transpose(board: Board): Board {
  return board[0].map((_, i) => board.map(row => row[i]));
}

function flipH(board: Board): Board {
  return board.map(row => [...row].reverse());
}

export function move(board: Board, direction: Direction): MoveResult {
  let b = board.map(row => [...row]);
  let totalScore = 0;
  if (direction === 'left') {
    const rows = b.map(row => slideLeft(row));
    b = rows.map(r => r.row);
    totalScore = rows.reduce((s, r) => s + r.score, 0);
  } else if (direction === 'right') {
    b = flipH(b);
    const rows = b.map(row => slideLeft(row));
    b = rows.map(r => r.row);
    totalScore = rows.reduce((s, r) => s + r.score, 0);
    b = flipH(b);
  } else if (direction === 'up') {
    b = transpose(b);
    const rows = b.map(row => slideLeft(row));
    b = rows.map(r => r.row);
    totalScore = rows.reduce((s, r) => s + r.score, 0);
    b = transpose(b);
  } else if (direction === 'down') {
    b = transpose(b);
    b = flipH(b);
    const rows = b.map(row => slideLeft(row));
    b = rows.map(r => r.row);
    totalScore = rows.reduce((s, r) => s + r.score, 0);
    b = flipH(b);
    b = transpose(b);
  }
  const moved = JSON.stringify(b) !== JSON.stringify(board);
  return { board: b, score: totalScore, moved };
}

export function hasMovesLeft(board: Board): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return true;
      if (c < 3 && board[r][c] === board[r][c + 1]) return true;
      if (r < 3 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

export function getMaxTile(board: Board): number {
  return Math.max(...board.flat());
}

export function initGame(seed?: number): Board {
  let board = createEmptyBoard();
  board = addRandomTile(board, seed);
  board = addRandomTile(board, seed ? seed + 1 : undefined);
  return board;
}
