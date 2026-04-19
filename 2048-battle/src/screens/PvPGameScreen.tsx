import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { GameBoard } from '../components/GameBoard';
import { SwipeHandler } from '../components/SwipeHandler';
import { Player } from '../hooks/usePlayer';
import { supabase } from '../utils/supabase';

const { width } = Dimensions.get('window');
const MATCH_DURATION = 120;

interface Props {
  player: Player;
  matchId: string;
  seed: number;
  isPlayer1: boolean;
  opponentNickname: string;
  onFinish: (won: boolean, myScore: number, opponentScore: number) => void;
}

export function PvPGameScreen({ player, matchId, seed, isPlayer1, opponentNickname, onFinish }: Props) {
  const { state, makeMove } = useGame(seed);
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION);
  const [finished, setFinished] = useState(false);
  const [opponentScore, setOpponentScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const subRef = useRef<any>(null);
  const finishedRef = useRef(false);
  const myScoreRef = useRef(0);
  const oppScoreRef = useRef(0);
  const OPPONENT_TIMEOUT = 15000; // 15 сек без обновления — считаем что вышел
  const oppLastUpdateRef = useRef(Date.now());
  const oppTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    subRef.current = supabase
      .channel('match:' + matchId)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'matches',
        filter: 'id=eq.' + matchId,
      }, (payload: any) => {
        const m = payload.new;
        const oppScore = isPlayer1 ? m.player2_score : m.player1_score;
        oppScoreRef.current = oppScore || 0;
        oppLastUpdateRef.current = Date.now();
        setOpponentScore(oppScore || 0);
        if (m.status === 'finished' && !finishedRef.current) {
          handleFinish(myScoreRef.current, oppScore || 0);
        }
      })
      .subscribe();

    timerRef.current = setInterval(() => {
      // Проверяем не вышел ли противник
      if (Date.now() - oppLastUpdateRef.current > OPPONENT_TIMEOUT) {
        // Противник неактивен — засчитываем победу
        if (!finishedRef.current) handleFinish(myScoreRef.current, -1);
        return;
      }
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      subRef.current?.unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
      if (oppTimeoutRef.current) clearTimeout(oppTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finished) handleFinish(state.score, opponentScore);
  }, [timeLeft]);

  useEffect(() => {
    myScoreRef.current = state.score;
    if (state.moves % 3 === 0 && state.moves > 0) {
      const update = isPlayer1
        ? { player1_score: state.score, player1_board: state.board }
        : { player2_score: state.score, player2_board: state.board };
      void supabase.from('matches').update(update).eq('id', matchId);
    }
  }, [state.moves]);

  const handleFinish = useCallback(async (myScore: number, oppScore: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (oppTimeoutRef.current) clearTimeout(oppTimeoutRef.current);
    const update = isPlayer1
      ? { player1_score: myScore, player1_board: state.board, status: 'finished' }
      : { player2_score: myScore, player2_board: state.board, status: 'finished' };
    await supabase.from('matches').update(update).eq('id', matchId);
    onFinish(myScore >= oppScore, myScore, oppScore);
  }, [finished, state.board, isPlayer1, matchId]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = minutes + ':' + seconds.toString().padStart(2, '0');
  const isLowTime = timeLeft <= 30;
  const boardSize = Math.floor((width - 48) / 4) - 8;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.timerContainer, isLowTime && styles.timerLow]}>
        <Text style={styles.timer}>{timeStr}</Text>
      </View>

      <View style={styles.scoresRow}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNickname}>👤 {player.nickname}</Text>
          <Text style={styles.scoreValue}>{state.score}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreNickname}>👤 {opponentNickname}</Text>
          <Text style={styles.scoreValue}>{opponentScore}</Text>
        </View>
      </View>

      <SwipeHandler onSwipe={makeMove}>
        <GameBoard board={state.board} size={boardSize} />
      </SwipeHandler>

      <Text style={styles.movesText}>Moves: {state.moves} | Best: {state.maxTile}</Text>

      <TouchableOpacity onPress={() => handleFinish(state.score, opponentScore)} style={styles.giveUpBtn}>
        <Text style={styles.giveUpText}>GIVE UP</Text>
      </TouchableOpacity>
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
  scoreCard: { alignItems: 'center', flex: 1 },
  scoreNickname: { fontSize: 12, color: '#776e65', fontWeight: '600', marginBottom: 4 },
  scoreValue: { fontSize: 24, fontWeight: '900', color: '#776e65' },
  vsText: { fontSize: 20, fontWeight: '900', color: '#f65e3b', marginHorizontal: 8 },
  movesText: { textAlign: 'center', color: '#bbada0', fontSize: 13, marginTop: 8 },
  giveUpBtn: {
    marginHorizontal: 20, marginTop: 12, backgroundColor: '#bbada0',
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  giveUpText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
});
