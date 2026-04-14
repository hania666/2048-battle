import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';

interface Props {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last updated: April 2026</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>2048 Battle collects minimal information to provide our services: nickname, device ID, game statistics, and app settings.</Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>We use collected information to enable multiplayer matchmaking, display leaderboards, save your game progress, and improve game performance.</Text>

        <Text style={styles.sectionTitle}>3. Data Storage</Text>
        <Text style={styles.text}>Your data is stored securely using Supabase cloud services. Local data is stored on your device using AsyncStorage. We do not sell your data to third parties.</Text>

        <Text style={styles.sectionTitle}>4. Advertising</Text>
        <Text style={styles.text}>2048 Battle uses Google AdMob to display advertisements. AdMob may collect device information and advertising ID to show relevant ads. You can opt out of personalized ads in your device settings.</Text>

        <Text style={styles.sectionTitle}>5. Children Privacy</Text>
        <Text style={styles.text}>2048 Battle is not directed to children under 13. We do not knowingly collect personal information from children under 13.</Text>

        <Text style={styles.sectionTitle}>6. Data Deletion</Text>
        <Text style={styles.text}>You can request deletion of your data by contacting us at support@2048battle.app. You can also clear local data by uninstalling the app.</Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.text}>If you have questions about this Privacy Policy, contact us at support@2048battle.app</Text>
      </ScrollView>
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
  title: { fontSize: 18, fontWeight: '900', color: theme.colors.text },
  placeholder: { width: 40 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  updated: { fontSize: 13, color: theme.colors.text3, marginBottom: 20, fontStyle: 'italic' },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: theme.colors.text,
    marginTop: 20, marginBottom: 8,
  },
  text: { fontSize: 14, color: theme.colors.text2, lineHeight: 22 },
});
