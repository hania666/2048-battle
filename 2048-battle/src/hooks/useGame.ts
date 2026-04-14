import { useState, useCallback, useEffect } from 'react';
import { Board, Direction, MoveResult, initGame, move, addRandomTile, hasMovesLeft, getMaxTile } from '../game/logic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { soundManager } from '../utils/soundManager';

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  maxTile: number;
  gameOver: boolean;
  moves: number;
}

const BEST_SCORE_KEY = 'best_score_2048';

export function useGame(seed?: number) {
  const [state, setState] = useState<GameState>({
    board: initGame(seed),
    score: 0,
    bestScore: 0,
    maxTile: 2,
    gameOver: false,
    moves: 0,
  });

  useEffect(() => {
    AsyncStorage.getItem(BEST_SCORE_KEY).then(val => {
      if (val) setState(prev => ({ ...prev, bestScore: parseInt(val) }));
    });
  }, []);

  useEffect(() => {
    if (state.score > state.bestScore) {
      AsyncStorage.setItem(BEST_SCORE_KEY, state.score.toString());
      setState(prev => ({ ...prev, bestScore: state.score }));
    }
  }, [state.score]);

  const makeMove = useCallback((direction: Direction) => {
    setState(prev => {
      if (prev.gameOver) return prev;
      const result: MoveResult = move(prev.board, direction);
      if (!result.moved) return prev;
      const newBoard = addRandomTile(result.board);
      const newScore = prev.score + result.score;
      const maxTile = getMaxTile(newBoard);
      const gameOver = !hasMovesLeft(newBoard);
      if (result.score > 0) soundManager.playMerge();
      return { ...prev, board: newBoard, score: newScore, maxTile, gameOver, moves: prev.moves + 1 };
    });
  }, []);

  const resetGame = useCallback((newSeed?: number) => {
    setState(prev => ({ ...prev, board: initGame(newSeed), score: 0, maxTile: 2, gameOver: false, moves: 0 }));
  }, []);

  return { state, makeMove, resetGame };
}
