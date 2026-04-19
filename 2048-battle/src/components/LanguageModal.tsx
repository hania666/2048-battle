import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useLanguage } from '../i18n/useLanguage';
import { Language } from '../i18n/translations';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageModal({ visible, onClose }: Props) {
  const { language, setLanguage } = useLanguage();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>🌍 LANGUAGE</Text>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => { setLanguage(lang.code as Language); onClose(); }}
              style={[styles.item, language === lang.code && styles.itemActive]}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.name, language === lang.code && styles.nameActive]}>
                {lang.name}
              </Text>
              {language === lang.code && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  card: {
    backgroundColor: '#F5F0EB', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, gap: 8,
  },
  title: { fontSize: 18, fontWeight: '900', color: '#776e65', letterSpacing: 2, marginBottom: 8, textAlign: 'center' },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F5F0EB', borderRadius: 14, padding: 16,
    borderWidth: 2, borderColor: 'transparent',
  },
  itemActive: { borderColor: '#f65e3b', backgroundColor: '#FDF0EC' },
  flag: { fontSize: 28 },
  name: { flex: 1, fontSize: 16, fontWeight: '700', color: '#776e65' },
  nameActive: { color: '#f65e3b' },
  check: { fontSize: 18, color: '#f65e3b', fontWeight: '900' },
  closeBtn: {
    backgroundColor: '#bbada0', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  closeBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 2 },
});
