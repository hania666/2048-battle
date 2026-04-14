import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

interface Props {
  active: 'home' | 'leaders' | 'profile';
  onHome: () => void;
  onLeaders: () => void;
  onProfile: () => void;
}

export function BottomNav({ active, onHome, onLeaders, onProfile }: Props) {
  const tabs = [
    { key: 'home', icon: '🏠', label: 'Home', onPress: onHome },
    { key: 'leaders', icon: '🏆', label: 'Leaders', onPress: onLeaders },
    { key: 'profile', icon: '👤', label: 'Profile', onPress: onProfile },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity key={tab.key} onPress={tab.onPress} style={styles.tab}>
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.key && styles.labelActive]}>
            {tab.label}
          </Text>
          {active === tab.key && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', backgroundColor: theme.colors.bgCard,
    borderTopWidth: 1, borderTopColor: theme.colors.border,
    paddingBottom: 8, paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, position: 'relative' },
  icon: { fontSize: 22, marginBottom: 2 },
  label: { fontSize: 11, fontWeight: '600', color: theme.colors.text2 },
  labelActive: { color: theme.colors.accent1, fontWeight: '800' },
  indicator: {
    position: 'absolute', bottom: -4, width: 4, height: 4,
    borderRadius: 2, backgroundColor: theme.colors.accent1,
  },
});
