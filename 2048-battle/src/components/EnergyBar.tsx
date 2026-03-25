import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  energy: number;
  maxEnergy: number;
  timeUntilRegen: string | null;
  onWatchAd?: () => void;
}

export function EnergyBar({ energy, maxEnergy, timeUntilRegen, onWatchAd }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.label}>ENERGY</Text>
        <View style={styles.dotsRow}>
          {Array(maxEnergy).fill(null).map((_, i) => (
            <View key={i} style={[styles.dot, i < energy ? styles.dotFull : styles.dotEmpty]} />
          ))}
        </View>
        {energy < maxEnergy && timeUntilRegen && (
          <Text style={styles.regenText}>+1 in {timeUntilRegen}</Text>
        )}
        {energy >= maxEnergy && <Text style={styles.fullText}>Full!</Text>}
      </View>
      {energy < maxEnergy && onWatchAd && (
        <TouchableOpacity onPress={onWatchAd} style={styles.adBtn}>
          <Text style={styles.adBtnText}>Watch Ad +2</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  left: { flex: 1 },
  label: { fontSize: 11, fontWeight: '800', color: '#bbada0', letterSpacing: 1.5, marginBottom: 6 },
  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  dot: { width: 18, height: 18, borderRadius: 9 },
  dotFull: { backgroundColor: '#f65e3b' },
  dotEmpty: { backgroundColor: '#e0d6cc' },
  regenText: { fontSize: 11, color: '#bbada0', fontWeight: '600' },
  fullText: { fontSize: 11, color: '#6db56d', fontWeight: '700' },
  adBtn: { backgroundColor: '#edcf72', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  adBtnText: { fontSize: 13, fontWeight: '900', color: '#776e65' },
});
