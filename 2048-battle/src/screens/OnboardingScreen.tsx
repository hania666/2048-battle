import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../i18n/useLanguage';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface Props {
  onStart: (nickname: string) => void;
  loading: boolean;
}

export function OnboardingScreen({ onStart, loading }: Props) {
  const [nickname, setNickname] = useState('');
  const { t } = useLanguage();
  const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Player';
      onStart(name);
    }
  };

  const handleStart = () => {
    const name = nickname.trim() || 'Player' + Math.floor(Math.random() * 9999);
    onStart(name);
  };

  const featureTexts = [t('feature1'), t('feature2'), t('feature3'), t('feature4')];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>2048</Text>
            <View style={styles.battleBadge}>
              <Text style={styles.battleText}>BATTLE</Text>
            </View>
          </View>
          <Text style={styles.desc}>{t('pvpDesc')}</Text>
        </View>

        <View style={styles.featuresGrid}>
          {featureTexts.map((text, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>{t('yourNickname')}</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder={t('enterNickname')}
            placeholderTextColor="#c4b8af"
            maxLength={16}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={handleStart}
            disabled={loading}
            style={[styles.startBtn, loading && styles.btnDisabled]}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>
              {loading ? t('loading') : t('startPlaying')}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
            style={[styles.googleBtn, googleLoading && styles.btnDisabled]}
            activeOpacity={0.85}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>
              {googleLoading ? '...' : 'Sign in with Google'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  title: { fontSize: 64, fontWeight: '900', color: '#776e65', letterSpacing: -2, lineHeight: 68 },
  battleBadge: { backgroundColor: '#f65e3b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'center', marginTop: 4 },
  battleText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 4 },
  desc: { fontSize: 15, color: '#bbada0', textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 20 },
  featureCard: { width: '47.5%', backgroundColor: '#fff', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 14, borderWidth: 1.5, borderColor: '#ede8e3' },
  featureText: { fontSize: 13, fontWeight: '600', color: '#776e65', lineHeight: 18 },
  form: { width: '100%' },
  label: { fontSize: 11, fontWeight: '800', color: '#a09080', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 15, fontSize: 17, fontWeight: '600', color: '#776e65', borderWidth: 2, borderColor: '#ede8e3', marginBottom: 12 },
  startBtn: { backgroundColor: '#f65e3b', borderRadius: 14, paddingVertical: 18, alignItems: 'center', shadowColor: '#f65e3b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  btnDisabled: { opacity: 0.55 },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ede8e3' },
  dividerText: { marginHorizontal: 12, color: '#c4b8af', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  googleBtn: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 2, borderColor: '#ede8e3' },
  googleIcon: { fontSize: 16, fontWeight: '900', color: '#4285f4', width: 22, textAlign: 'center' },
  googleBtnText: { color: '#776e65', fontSize: 15, fontWeight: '700' },
});