import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { theme } from '../utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  won: boolean;
  myScore: number;
  opponentScore: number;
  myNickname: string;
  opponentNickname: string;
  eloDiff?: number;
  streak?: number;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function MatchResultScreen({
  won, myScore, opponentScore,
  myNickname, opponentNickname,
  eloDiff, streak,
  onPlayAgain, onHome,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={[styles.result, won ? styles.win : styles.lose]}>
          {won ? '🏆 VICTORY!' : '💀 DEFEAT'}
        </Text>

        <View style={styles.scoresContainer}>
          <View style={[styles.scoreCard, won && styles.scoreCardWin]}>
            <Text style={styles.scoreCardName}>{myNickname}</Text>
            <Text style={styles.scoreCardValue}>{myScore.toLocaleString()}</Text>
            <Text style={styles.scoreCardLabel}>YOUR SCORE</Text>
          </View>

          <Text style={styles.vsText}>VS</Text>

          <View style={[styles.scoreCard, !won && styles.scoreCardWin]}>
            <Text style={styles.scoreCardName}>{opponentNickname}</Text>
            <Text style={styles.scoreCardValue}>{opponentScore.toLocaleString()}</Text>
            <Text style={styles.scoreCardLabel}>THEIR SCORE</Text>
          </View>
        </View>

        {won && streak && streak >= 3 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>
              {streak >= 10 ? '👑' : streak >= 5 ? '💥' : '🔥'} {streak} WIN STREAK!
            </Text>
          </View>
        )}

        {eloDiff !== undefined && (
          <View style={styles.eloChange}>
            <Text style={[styles.eloChangeText, eloDiff >= 0 ? styles.eloUp : styles.eloDown]}>
              {eloDiff >= 0 ? '+' : ''}{eloDiff} ELO
            </Text>
          </View>
        )}

        <View style={styles.diff}>
          <Text style={styles.diffText}>
            {won
              ? `You won by ${(myScore - opponentScore).toLocaleString()} points!`
              : `Lost by ${(opponentScore - myScore).toLocaleString()} points`}
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity onPress={onPlayAgain} style={styles.playAgainBtn}>
            <Text style={styles.playAgainText}>🎮 PLAY AGAIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onHome} style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>🏠 HOME</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  result: { fontSize: 42, fontWeight: '900', marginBottom: 40, letterSpacing: 2 },
  win: { color: '#f65e3b' },
  lose: { color: '#bbada0' },
  scoresContainer: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 24, width: '100%',
  },
  scoreCard: {
    flex: 1, backgroundColor: theme.colors.bgCard, borderRadius: 16,
    padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
    borderWidth: 2, borderColor: 'transparent',
  },
  scoreCardWin: { borderColor: '#f65e3b' },
  scoreCardName: { fontSize: 14, fontWeight: '700', color: '#776e65', marginBottom: 8 },
  scoreCardValue: { fontSize: 28, fontWeight: '900', color: '#776e65', marginBottom: 4 },
  scoreCardLabel: { fontSize: 10, color: '#bbada0', letterSpacing: 1, fontWeight: '600' },
  vsText: { fontSize: 20, fontWeight: '900', color: '#bbada0' },
  diff: { marginBottom: 40 },
  diffText: { fontSize: 16, color: '#776e65', fontWeight: '600', textAlign: 'center' },
  eloChange: { marginBottom: 16, alignItems: 'center' },
  eloChangeText: { fontSize: 28, fontWeight: '900' },
  eloUp: { color: '#6db56d' },
  eloDown: { color: '#e05454' },
  streakBadge: {
    backgroundColor: '#FFF3E0', borderRadius: 12, paddingHorizontal: 20,
    paddingVertical: 10, marginBottom: 12, borderWidth: 2, borderColor: '#FF9800',
  },
  streakText: { fontSize: 18, fontWeight: '900', color: '#E65100' },
  buttons: { width: '100%', gap: 12 },
  playAgainBtn: {
    backgroundColor: '#f65e3b', borderRadius: 12,
    paddingVertical: 18, alignItems: 'center',
  },
  playAgainText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  homeBtn: {
    backgroundColor: '#bbada0', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});
