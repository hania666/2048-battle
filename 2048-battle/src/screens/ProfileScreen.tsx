import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player } from '../hooks/usePlayer';
import { supabase } from '../utils/supabase';
import { useLanguage } from '../i18n/useLanguage';
import { theme } from '../utils/theme';

interface MatchHistoryItem {
  id: string;
  opponent_nickname: string;
  my_score: number;
  opponent_score: number;
  won: boolean;
  elo_change: number;
  played_at: string;
}

interface Props {
  player: Player;
  onBack: () => void;
  onNicknameChange: (nickname: string) => void;
  onAchievements: () => void;
  onSkins: () => void;
  onSignOut: () => void;
  unlockedCount: number;
  totalAchievements: number;
}

export function ProfileScreen({ player, onBack, onNicknameChange, onAchievements, onSkins, onSignOut, unlockedCount, totalAchievements }: Props) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(player.nickname);
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const { data } = await supabase
        .from('match_history')
        .select('*')
        .eq('player_id', player.id)
        .order('played_at', { ascending: false })
        .limit(20);
      if (data) setHistory(data);
    } catch (e) {}
  };

  const saveNickname = async () => {
    if (!nickname.trim() || nickname === player.nickname) { setEditing(false); return; }
    setLoading(true);
    try {
      await supabase.from('players').update({ nickname: nickname.trim() }).eq('id', player.id);
      onNicknameChange(nickname.trim());
      setEditing(false);
    } catch (e) {
      Alert.alert('Error', 'Could not update nickname');
    } finally { setLoading(false); }
  };

  const winRate = player.total_games > 0 ? Math.round(player.total_wins / player.total_games * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile')}</Text>
        <View style={styles.placeholder} />
      </View>

      <TouchableOpacity onPress={onSignOut} style={styles.signOutBtn}>
        <Text style={styles.signOutText}>🚪 Sign Out</Text>
      </TouchableOpacity>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.profileCard}>
              <Text style={styles.avatar}>🎮</Text>
              {editing ? (
                <View style={styles.editRow}>
                  <TextInput style={styles.nicknameInput} value={nickname}
                    onChangeText={setNickname} maxLength={16} autoFocus autoCapitalize="none" />
                  <TouchableOpacity onPress={saveNickname} style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>{loading ? '...' : '✓'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => setEditing(true)} style={styles.nicknameRow}>
                  <Text style={styles.nickname}>{player.nickname}</Text>
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.eloText}>⚡ {player.elo} ELO</Text>
            <TouchableOpacity onPress={onSkins} style={styles.achBtn}>
              <Text style={styles.achBtnText}>🎨 Tile Skins</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAchievements} style={styles.achBtn}>
              <Text style={styles.achBtnText}>🏅 {unlockedCount}/{totalAchievements} Achievements</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{player.total_games}</Text>
                <Text style={styles.statLabel}>{t('gamesLabel')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{player.total_wins}</Text>
                <Text style={styles.statLabel}>{t('winsLabel')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{winRate}%</Text>
                <Text style={styles.statLabel}>WIN RATE</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{(player as any).win_streak || 0}</Text>
                <Text style={styles.statLabel}>{t('streakLabel')}</Text>
              </View>
            </View>

            <Text style={styles.historyTitle}>{t('matchHistory')}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyText}>No matches yet</Text>
            <Text style={styles.emptySub}>Play a match to see your history!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.historyItem, item.won ? styles.historyWin : styles.historyLose]}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyResult}>{item.won ? 'WIN' : 'LOSE'}</Text>
              <Text style={styles.historyOpponent}>vs {item.opponent_nickname}</Text>
            </View>
            <View style={styles.historyMiddle}>
              <Text style={styles.historyScore}>{item.my_score} - {item.opponent_score}</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={[styles.historyElo, item.elo_change >= 0 ? styles.eloUp : styles.eloDown]}>
                {item.elo_change >= 0 ? '+' : ''}{item.elo_change} ELO
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: theme.colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  backBtnText: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  title: { fontSize: 18, fontWeight: '900', color: theme.colors.text, letterSpacing: 2 },
  placeholder: { width: 40 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  profileCard: {
    backgroundColor: theme.colors.bgCard, borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border,
  },
  avatar: { fontSize: 56, marginBottom: 12 },
  nicknameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nickname: { fontSize: 24, fontWeight: '900', color: theme.colors.text },
  editIcon: { fontSize: 16 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nicknameInput: {
    fontSize: 20, fontWeight: '700', color: theme.colors.text,
    borderBottomWidth: 2, borderBottomColor: theme.colors.accent1,
    paddingVertical: 4, paddingHorizontal: 8, minWidth: 150,
  },
  saveBtn: { backgroundColor: theme.colors.accent1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  eloText: { fontSize: 18, fontWeight: '800', color: theme.colors.accent1 },
  signOutBtn: {
    marginHorizontal: 20, marginBottom: 8, backgroundColor: theme.colors.bgCard,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  signOutText: { fontSize: 14, fontWeight: '700', color: '#E74C3C' },
  achBtn: {
    marginTop: 8, backgroundColor: theme.colors.bgCard2,
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: theme.colors.warning,
  },
  achBtnText: { fontSize: 13, fontWeight: '700', color: theme.colors.warning },
  statsCard: {
    backgroundColor: theme.colors.bgCard, borderRadius: 16, padding: 16,
    flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: theme.colors.text },
  statLabel: { fontSize: 10, color: theme.colors.text2, fontWeight: '700', letterSpacing: 1, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: theme.colors.border },
  historyTitle: { fontSize: 12, fontWeight: '800', color: theme.colors.text2, letterSpacing: 2, marginBottom: 10 },
  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.bgCard, borderRadius: 12, padding: 12,
    marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
  },
  historyWin: { borderColor: '#27AE6040' },
  historyLose: { borderColor: '#E74C3C40' },
  historyLeft: { flex: 1 },
  historyResult: { fontSize: 13, fontWeight: '800', color: theme.colors.text, marginBottom: 2 },
  historyOpponent: { fontSize: 12, color: theme.colors.text2 },
  historyMiddle: { flex: 1, alignItems: 'center' },
  historyScore: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  historyRight: { flex: 1, alignItems: 'flex-end' },
  historyElo: { fontSize: 15, fontWeight: '900' },
  eloUp: { color: '#27AE60' },
  eloDown: { color: theme.colors.accent1 },
  emptyHistory: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 16, fontWeight: '700', color: theme.colors.text2 },
  emptySub: { fontSize: 13, color: theme.colors.text3, marginTop: 4 },
});
