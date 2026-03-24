import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  onStart: (nickname: string) => void;
  loading: boolean;
}

export function OnboardingScreen({ onStart, loading }: Props) {
  const [nickname, setNickname] = useState('');

  const handleStart = () => {
    const name = nickname.trim() || 'Player' + Math.floor(Math.random() * 9999);
    onStart(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>2048</Text>
        <Text style={styles.subtitle}>BATTLE</Text>
        <Text style={styles.desc}>Challenge players worldwide in real-time 2048 battles</Text>

        <View style={styles.form}>
          <Text style={styles.label}>YOUR NICKNAME</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter nickname..."
            placeholderTextColor="#bbada0"
            maxLength={16}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={handleStart}
            disabled={loading}
            style={[styles.startBtn, loading && styles.startBtnDisabled]}
          >
            <Text style={styles.startBtnText}>
              {loading ? 'LOADING...' : 'START PLAYING'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.feature}>🎮 Real-time PvP matches</Text>
          <Text style={styles.feature}>🏆 Global leaderboard</Text>
          <Text style={styles.feature}>⚡ ELO ranking system</Text>
          <Text style={styles.feature}>🎯 Skill-based gameplay</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 72, fontWeight: '900', color: '#776e65', letterSpacing: -2 },
  subtitle: {
    fontSize: 28, fontWeight: '900', color: '#f65e3b',
    letterSpacing: 8, marginTop: -8, marginBottom: 16,
  },
  desc: {
    fontSize: 16, color: '#bbada0', textAlign: 'center',
    lineHeight: 24, marginBottom: 40,
  },
  form: { width: '100%', marginBottom: 40 },
  label: {
    fontSize: 12, fontWeight: '700', color: '#776e65',
    letterSpacing: 2, marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 18, fontWeight: '600', color: '#776e65',
    borderWidth: 2, borderColor: '#e0d6cc', marginBottom: 16,
  },
  startBtn: {
    backgroundColor: '#f65e3b', borderRadius: 12,
    paddingVertical: 18, alignItems: 'center',
  },
  startBtnDisabled: { opacity: 0.6 },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  features: { gap: 10 },
  feature: { fontSize: 15, color: '#776e65', fontWeight: '500' },
});
