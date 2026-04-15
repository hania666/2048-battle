import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../i18n/useLanguage';
import { LanguageModal } from '../components/LanguageModal';
import { theme } from '../utils/theme';

interface Props {
  onBack: () => void;
  onPrivacyPolicy: () => void;
}

export function SettingsScreen({ onBack, onPrivacyPolicy }: Props) {
  const { settings, updateSetting } = useSettings();
  const { t, language } = useLanguage();
  const [showLang, setShowLang] = React.useState(false);

  const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English', ru: 'Русский', uk: 'Українська', es: 'Español', fr: 'Français',
  };

  return (
    <SafeAreaView style={styles.container}>
      <LanguageModal visible={showLang} onClose={() => setShowLang(false)} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚙️ {t('settings')}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('audioFeedback')}</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🎵</Text>
            <View>
              <Text style={styles.rowTitle}>{t('backgroundMusic')}</Text>
              <Text style={styles.rowSub}>{t('musicSub')}</Text>
            </View>
          </View>
          <Switch value={settings.music} onValueChange={val => updateSetting('music', val)}
            trackColor={{ false: '#e0d6cc', true: theme.colors.accent1 }} thumbColor="#fff" />
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🔊</Text>
            <View>
              <Text style={styles.rowTitle}>{t('soundEffects')}</Text>
              <Text style={styles.rowSub}>{t('soundSub')}</Text>
            </View>
          </View>
          <Switch value={settings.sound} onValueChange={val => updateSetting('sound', val)}
            trackColor={{ false: '#e0d6cc', true: theme.colors.accent1 }} thumbColor="#fff" />
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>📳</Text>
            <View>
              <Text style={styles.rowTitle}>{t('vibration')}</Text>
              <Text style={styles.rowSub}>{t('vibrationSub')}</Text>
            </View>
          </View>
          <Switch value={settings.vibration} onValueChange={val => updateSetting('vibration', val)}
            trackColor={{ false: '#e0d6cc', true: theme.colors.accent1 }} thumbColor="#fff" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        <TouchableOpacity onPress={() => setShowLang(true)} style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🌍</Text>
            <View>
              <Text style={styles.rowTitle}>{t('language')}</Text>
              <Text style={styles.rowSub}>{LANGUAGE_NAMES[language] || 'English'}</Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about')}</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🎮</Text>
            <View>
              <Text style={styles.rowTitle}>2048 Battle</Text>
              <Text style={styles.rowSub}>{t('version')}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={onPrivacyPolicy} style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowIcon}>🔒</Text>
            <View>
              <Text style={styles.rowTitle}>{t('privacyPolicy')}</Text>
              <Text style={styles.rowSub}>{t('privacyPolicySub')}</Text>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>
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
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: theme.colors.text2, letterSpacing: 2, marginBottom: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.bgCard, borderRadius: 14, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: theme.colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rowIcon: { fontSize: 24 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  rowSub: { fontSize: 12, color: theme.colors.text2 },
  arrow: { fontSize: 24, color: theme.colors.text2 },
});
