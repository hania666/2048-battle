import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { theme } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { useBot } from '../hooks/useBot';
import { GameBoard } from '../components/GameBoard';
import { SwipeHandler } from '../components/SwipeHandler';
import { Player } from '../hooks/usePlayer';
import { initGame } from '../game/logic';
import { AppState } from 'react-native';
import { soundManager } from '../utils/soundManager';

const { width } = Dimensions.get('window');
const MATCH_DURATION = 120;

interface Props {
  player: Player;
  difficulty?: 'easy' | 'medium' | 'hard';
  onFinish: (won: boolean, myScore: number, botScore: number) => void;
  onBack: () => void;
}

const BOT_NAMES = {
  easy: '🤖 EasyBot',
  medium: '🤖 MediumBot',
  hard: '🤖 HardBot',
};

const BOT_DELAYS = {
  easy: { min: 800, max: 1600 },
  medium: { min: 450, max: 900 },
  hard: { min: 200, max: 450 },
};

export function BotGameScreen({ player, difficulty = 'medium', onFinish, onBack }: Props) {
  const seed = useRef(Math.floor(Math.random() * 1000000)).current;
  const { state, makeMove } = useGame(seed);
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);

  React.useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'background') setPaused(true);
      if (state === 'active') setPaused(false);
    });
    return () => sub.remove();
  }, []);
  const [botScore, setBotScore] = useState(0);
  const [botScoreFlash, setBotScoreFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashAnim = useRef(new Animated.Value(1)).current;
  const delays = BOT_DELAYS[difficulty];

  const bot = useBot(true, initGame(seed), {
    difficulty,
    minDelay: delays.min,
    maxDelay: delays.max,
    onMove: (board, score) => {
      setBotScore(score);
      // Flash анимация когда бот набирает очки
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    },
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finished) handleFinish();
    if (timeLeft === 30) soundManager.playMusic();
  }, [timeLeft]);

  // Если у игрока game over — финишируем сразу с текущим счётом бота
  useEffect(() => {
    if (state.gameOver && !finished) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      const myScore = state.score;
      const bScore = bot.getScore();
      setTimeout(() => onFinish(myScore >= bScore, myScore, bScore), 500);
    }
  }, [state.gameOver]);

  const handleFinish = useCallback(() => {
    if (finished) return;
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const myScore = state.score;
    const bScore = bot.getScore();
    onFinish(myScore >= bScore, myScore, bScore);
  }, [finished, state.score, bot]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = minutes + ':' + seconds.toString().padStart(2, '0');
  const isLowTime = timeLeft <= 30;
  const boardSize = Math.floor((width - 48) / 4) - 8;
  const botName = BOT_NAMES[difficulty];
  const isWinning = state.score >= botScore;

  return (
    <SafeAreaView style={styles.container}>
      {/* Timer */}
      <View style={[styles.timerContainer, isLowTime && styles.timerLow]}>
        <Text style={styles.timer}>{timeStr}</Text>
      </View>

      {/* Scores */}
      <View style={styles.scoresRow}>
        <View style={[styles.scoreCard, isWinning && styles.scoreCardWinning]}>
          <Text style={styles.scoreNickname}>👤 {player.nickname}</Text>
          <Text style={[styles.scoreValue, isWinning && styles.scoreValueWinning]}>
            {state.score}
          </Text>
          {isWinning && <Text style={styles.winningBadge}>WINNING 🔥</Text>}
        </View>

        <View style={styles.middle}>
          <Text style={styles.vsText}>VS</Text>
          <Text style={styles.diffLabel}>{difficulty.toUpperCase()}</Text>
        </View>

        <View style={[styles.scoreCard, !isWinning && styles.scoreCardWinning]}>
          <Text style={styles.scoreNickname}>{botName}</Text>
          <Animated.Text style={[
            styles.scoreValue,
            !isWinning && styles.scoreValueWinning,
            { transform: [{ scale: flashAnim }] }
          ]}>
            {botScore}
          </Animated.Text>
          {!isWinning && <Text style={styles.winningBadge}>WINNING 🔥</Text>}
        </View>
      </View>

      {/* Board full banner */}
      {state.gameOver && !finished && (
        <View style={styles.boardFullBanner}>
          <Text style={styles.boardFullText}>⏳ Board full — scores are final!</Text>
        </View>
      )}

      {/* My board only */}
      <SwipeHandler onSwipe={makeMove}>
        <GameBoard board={state.board} size={boardSize} />
      </SwipeHandler>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>Moves: {state.moves}</Text>
        <Text style={styles.statText}>Best tile: {state.maxTile}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleFinish} style={styles.giveUpBtn}>
          <Text style={styles.giveUpText}>GIVE UP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← BACK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  timerContainer: {
    alignItems: 'center', paddingVertical: 8,
    backgroundColor: '#bbada0', marginHorizontal: 20,
    borderRadius: 12, marginTop: 8,
  },
  timerLow: { backgroundColor: '#f65e3b' },
  timer: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  scoresRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12,
  },
  scoreCard: {
    flex: 1, backgroundColor: theme.colors.bgCard, borderRadius: 14,
    padding: 12, alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  scoreCardWinning: { borderColor: '#f65e3b', backgroundColor: '#fff8f6' },
  scoreNickname: { fontSize: 11, color: '#776e65', fontWeight: '600', marginBottom: 4 },
  scoreValue: { fontSize: 26, fontWeight: '900', color: '#776e65' },
  scoreValueWinning: { color: '#f65e3b' },
  winningBadge: { fontSize: 10, color: '#f65e3b', fontWeight: '800', marginTop: 2 },
  middle: { alignItems: 'center', marginHorizontal: 8 },
  vsText: { fontSize: 18, fontWeight: '900', color: '#bbada0' },
  diffLabel: { fontSize: 9, color: '#bbada0', fontWeight: '700', letterSpacing: 1, marginTop: 2 },
  boardFullBanner: {
    backgroundColor: '#edcf72', marginHorizontal: 20,
    borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginBottom: 8,
  },
  boardFullText: { color: '#776e65', fontWeight: '800', fontSize: 13 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, marginTop: 8,
  },
  statText: { color: '#bbada0', fontSize: 13 },
  buttons: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  giveUpBtn: {
    flex: 1, backgroundColor: '#f65e3b',
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  giveUpText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  backBtn: {
    flex: 1, backgroundColor: '#bbada0',
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  backBtnText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
