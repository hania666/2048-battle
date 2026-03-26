import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../i18n/useLanguage';
import { LanguageModal } from '../components/LanguageModal';

interface Props {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: Props) {
  const { settings, updateSetting } = useSettings();
  const { t, language } = useLanguage();
  const [showLang, setShowLang] = React.useState(false);

  const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English 🇬🇧',
    ru: 'Русский 🇷🇺',
    uk: 'Українська 🇺🇦',
    es: 'Español 🇪🇸',
    fr: 'Français 🇫🇷',
  };

  return (
    <SafeAreaView style={styles.container}>
      <LanguageModal visible={showLang} onClose={() => setShowLang(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚙️ SETTINGS</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AUDIO & FEEDBACK</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🔊</Text>
            <View>
              <Text style={styles.rowTitle}>Sound Effects</Text>
              <Text style={styles.rowSub}>Game sounds and music</Text>
            </View>
          </View>
          <Switch
            value={settings.sound}
            onValueChange={val => updateSetting('sound', val)}
            trackColor={{ false: '#e0d6cc', true: '#f65e3b' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>📳</Text>
            <View>
              <Text style={styles.rowTitle}>Vibration</Text>
              <Text style={styles.rowSub}>Haptic feedback on actions</Text>
            </View>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={val => updateSetting('vibration', val)}
            trackColor={{ false: '#e0d6cc', true: '#f65e3b' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LANGUAGE</Text>

        <TouchableOpacity onPress={() => setShowLang(true)} style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🌍</Text>
            <View>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowSub}>{LANGUAGE_NAMES[language] || 'English'}</Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🎮</Text>
            <View>
              <Text style={styles.rowTitle}>2048 Battle</Text>
              <Text style={styles.rowSub}>Version 1.0.0</Text>
            </View>
          </View>
        </View>
      </View>
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
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: '#bbada0',
    letterSpacing: 2, marginBottom: 10,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rowIcon: { fontSize: 24 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: '#776e65', marginBottom: 2 },
  rowSub: { fontSize: 12, color: '#bbada0' },
  arrow: { fontSize: 24, color: '#bbada0', fontWeight: '300' },
});
