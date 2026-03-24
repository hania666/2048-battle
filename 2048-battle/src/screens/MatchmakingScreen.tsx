import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player } from '../hooks/usePlayer';
import { useMatchmaking } from '../hooks/useMatchmaking';

interface Props {
  player: Player;
  onMatchFound: (matchId: string, seed: number, isPlayer1: boolean) => void;
  onCancel: () => void;
}

export function MatchmakingScreen({ player, onMatchFound, onCancel }: Props) {
  const { status, match, opponentNickname, findMatch, cancelSearch } = useMatchmaking(player);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    findMatch();
  }, []);

  useEffect(() => {
    if (status === 'found' && match) {
      const isPlayer1 = match.player1_id === player.id;
      setTimeout(() => {
        onMatchFound(match.id, match.seed, isPlayer1);
      }, 1500);
    }
  }, [status, match]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleCancel = async () => {
    await cancelSearch();
    onCancel();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>2048 BATTLE</Text>

        {status === 'searching' && (
          <>
            <Animated.View style={[styles.searchCircle, { transform: [{ scale: pulseAnim }] }]}>
              <ActivityIndicator size="large" color="#f65e3b" />
            </Animated.View>
            <Text style={styles.searchText}>Finding opponent...</Text>
            <Text style={styles.playerName}>👤 {player.nickname}</Text>
            <Text style={styles.eloText}>⚡ {player.elo} ELO</Text>
          </>
        )}

        {status === 'found' && (
          <>
            <View style={styles.foundContainer}>
              <View style={styles.playerCard}>
                <Text style={styles.playerCardName}>{player.nickname}</Text>
                <Text style={styles.playerCardElo}>{player.elo} ELO</Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.playerCard}>
                <Text style={styles.playerCardName}>{opponentNickname}</Text>
                <Text style={styles.playerCardElo}>??? ELO</Text>
              </View>
            </View>
            <Text style={styles.foundText}>Match found! Get ready...</Text>
          </>
        )}

        <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelBtnText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '900', color: '#776e65', letterSpacing: 4, marginBottom: 48 },
  searchCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#f65e3b', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
    marginBottom: 32,
  },
  searchText: { fontSize: 20, fontWeight: '700', color: '#776e65', marginBottom: 16 },
  playerName: { fontSize: 18, fontWeight: '800', color: '#f65e3b', marginBottom: 8 },
  eloText: { fontSize: 16, color: '#bbada0' },
  foundContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  playerCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    alignItems: 'center', minWidth: 120,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  playerCardName: { fontSize: 16, fontWeight: '800', color: '#776e65', marginBottom: 4 },
  playerCardElo: { fontSize: 14, color: '#bbada0' },
  vsText: { fontSize: 28, fontWeight: '900', color: '#f65e3b' },
  foundText: { fontSize: 18, fontWeight: '700', color: '#776e65', marginBottom: 32 },
  cancelBtn: {
    marginTop: 40, backgroundColor: '#bbada0',
    borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14,
  },
  cancelBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});
