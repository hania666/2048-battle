import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Achievement } from '../hooks/useAchievements';
import { useLanguage } from '../i18n/useLanguage';
import { theme } from '../utils/theme';

interface Props {
  achievements: Achievement[];
  unlockedCount: number;
  onBack: () => void;
}

export function AchievementsScreen({ achievements, unlockedCount, onBack }: Props) {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('achievements')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {unlockedCount}/{achievements.length} {t('winsLabel').toLowerCase()}
        </Text>
        <View style={styles.summaryBar}>
          <View style={[styles.summaryFill, { width: `${(unlockedCount / achievements.length) * 100}%` as any }]} />
        </View>
      </View>

      <FlatList
        data={achievements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.unlocked ? styles.itemUnlocked : styles.itemLocked]}>
            <Text style={[styles.icon, !item.unlocked && styles.iconLocked]}>{item.icon}</Text>
            <View style={styles.info}>
              <Text style={[styles.itemTitle, !item.unlocked && styles.textLocked]}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.reward}>+{item.reward}⚡</Text>
              {item.unlocked && <Text style={styles.check}>✓</Text>}
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
  summary: { paddingHorizontal: 20, marginBottom: 12 },
  summaryText: { fontSize: 14, fontWeight: '700', color: theme.colors.text2, marginBottom: 6 },
  summaryBar: { height: 8, backgroundColor: theme.colors.bgCard2, borderRadius: 4 },
  summaryFill: { height: 8, backgroundColor: theme.colors.accent1, borderRadius: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.bgCard, borderRadius: 14,
    padding: 14, marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
  },
  itemUnlocked: { borderColor: theme.colors.accent1 + '40' },
  itemLocked: { opacity: 0.6 },
  icon: { fontSize: 32, marginRight: 12 },
  iconLocked: { opacity: 0.4 },
  info: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 2 },
  textLocked: { color: theme.colors.text2 },
  itemDesc: { fontSize: 12, color: theme.colors.text2 },
  right: { alignItems: 'flex-end', gap: 4 },
  reward: { fontSize: 13, fontWeight: '900', color: theme.colors.accent1 },
  check: { fontSize: 16, color: theme.colors.success, fontWeight: '900' },
});
