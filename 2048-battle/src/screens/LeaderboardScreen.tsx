import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLeaderboard, LeaderboardEntry } from '../hooks/useLeaderboard';

interface Props {
  currentPlayerId?: string;
  onBack: () => void;
}

type SortBy = 'elo' | 'best_score' | 'total_wins';

const MEDALS = ['🥇', '🥈', '🥉'];

export function LeaderboardScreen({ currentPlayerId, onBack }: Props) {
  const { entries, loading, fetchLeaderboard } = useLeaderboard();
  const [sortBy, setSortBy] = useState<SortBy>('elo');

  const handleSort = (sort: SortBy) => {
    setSortBy(sort);
    fetchLeaderboard(sort);
  };

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isMe = item.player_id === currentPlayerId;
    const medal = MEDALS[index] || `#${index + 1}`;

    return (
      <View style={[styles.row, isMe && styles.rowMe]}>
        <Text style={styles.rank}>{medal}</Text>
        <View style={styles.info}>
          <Text style={[styles.nickname, isMe && styles.nicknameMe]}>
            {item.nickname} {isMe ? '(YOU)' : ''}
          </Text>
          <Text style={styles.stats}>
            🎮 {item.total_games} · 🏆 {item.total_wins} · 📊 {item.win_rate}%
          </Text>
        </View>
        <View style={styles.right}>
          {sortBy === 'elo' && <Text style={styles.mainValue}>{item.elo}</Text>}
          {sortBy === 'best_score' && <Text style={styles.mainValue}>{item.best_score.toLocaleString()}</Text>}
          {sortBy === 'total_wins' && <Text style={styles.mainValue}>{item.total_wins}</Text>}
          <Text style={styles.mainLabel}>
            {sortBy === 'elo' ? 'ELO' : sortBy === 'best_score' ? 'BEST' : 'WINS'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LEADERBOARD</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.sortRow}>
        {(['elo', 'best_score', 'total_wins'] as SortBy[]).map(sort => (
          <TouchableOpacity
            key={sort}
            onPress={() => handleSort(sort)}
            style={[styles.sortBtn, sortBy === sort && styles.sortBtnActive]}
          >
            <Text style={[styles.sortBtnText, sortBy === sort && styles.sortBtnTextActive]}>
              {sort === 'elo' ? '⚡ ELO' : sort === 'best_score' ? '🎯 SCORE' : '🏆 WINS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && entries.length === 0 ? (
        <ActivityIndicator color="#f65e3b" size="large" style={styles.loader} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No players yet</Text>
          <Text style={styles.emptySub}>Play a match to appear here!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchLeaderboard(sortBy)}
              tintColor="#f65e3b"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  backBtnText: { fontSize: 20, fontWeight: '900', color: '#776e65' },
  title: { fontSize: 18, fontWeight: '900', color: '#776e65', letterSpacing: 2 },
  placeholder: { width: 40 },
  sortRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  sortBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    backgroundColor: '#fff', alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  sortBtnActive: { borderColor: '#f65e3b', backgroundColor: '#fff8f6' },
  sortBtnText: { fontSize: 12, fontWeight: '700', color: '#bbada0' },
  sortBtnTextActive: { color: '#f65e3b' },
  loader: { marginTop: 60 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#776e65' },
  emptySub: { fontSize: 14, color: '#bbada0', marginTop: 6 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    borderWidth: 2, borderColor: 'transparent',
  },
  rowMe: { borderColor: '#f65e3b', backgroundColor: '#fff8f6' },
  rank: { fontSize: 22, marginRight: 12, minWidth: 36 },
  info: { flex: 1 },
  nickname: { fontSize: 15, fontWeight: '800', color: '#776e65', marginBottom: 3 },
  nicknameMe: { color: '#f65e3b' },
  stats: { fontSize: 12, color: '#bbada0' },
  right: { alignItems: 'flex-end' },
  mainValue: { fontSize: 20, fontWeight: '900', color: '#776e65' },
  mainLabel: { fontSize: 10, color: '#bbada0', fontWeight: '700', letterSpacing: 1 },
});
