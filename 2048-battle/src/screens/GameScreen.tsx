import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../hooks/useGame';
import { GameBoard } from '../components/GameBoard';
import { SwipeHandler } from '../components/SwipeHandler';
import { Player } from '../hooks/usePlayer';
import { theme } from '../utils/theme';

export function GameScreen({ player, onBack }: { player: Player; onBack?: () => void }) {
  const { state, makeMove, resetGame } = useGame();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>2048</Text>
        <View style={styles.scores}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{state.score}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>BEST</Text>
            <Text style={styles.scoreValue}>{state.bestScore}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>👤 {player.nickname}</Text>
        <Text style={styles.statText}>Moves: {state.moves}</Text>
      </View>

      <SwipeHandler onSwipe={makeMove}>
        <GameBoard board={state.board} />
      </SwipeHandler>

      <View style={styles.buttons}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← BACK</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => resetGame()} style={styles.newGameBtn}>
          <Text style={styles.newGameText}>NEW GAME</Text>
        </TouchableOpacity>
      </View>

      {state.gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverTitle}>Game Over!</Text>
            <Text style={styles.gameOverScore}>Score: {state.score}</Text>
            <Text style={styles.gameOverTile}>Best tile: {state.maxTile}</Text>
            <TouchableOpacity onPress={() => resetGame()} style={styles.tryAgainBtn}>
              <Text style={styles.tryAgainText}>TRY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
  },
  title: { fontSize: 52, fontWeight: '900', color: theme.colors.text },
  scores: { flexDirection: 'row', gap: 8 },
  scoreBox: {
    backgroundColor: theme.colors.accent1, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', minWidth: 72,
  },
  scoreLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  scoreValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 4,
  },
  statText: { color: theme.colors.text2, fontSize: 14, fontWeight: '600' },
  buttons: { paddingHorizontal: 20, paddingTop: 8, gap: 8 },
  backBtn: {
    backgroundColor: theme.colors.bgCard2, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  backBtnText: { color: theme.colors.text2, fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  newGameBtn: {
    backgroundColor: theme.colors.accent1, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: theme.colors.accent1, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  newGameText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  gameOverOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(245,240,235,0.88)', alignItems: 'center', justifyContent: 'center',
  },
  gameOverCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 8,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  gameOverTitle: { fontSize: 36, fontWeight: '900', color: theme.colors.text, marginBottom: 12 },
  gameOverScore: { fontSize: 22, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  gameOverTile: { fontSize: 16, color: theme.colors.text2, marginBottom: 24 },
  tryAgainBtn: {
    backgroundColor: theme.colors.accent1, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14,
  },
  tryAgainText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});
