import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player } from '../hooks/usePlayer';

interface Props {
  player: Player;
  onPlayPvP: () => void;
  onPlayBot: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onPlaySolo: () => void;
}

export function HomeScreen({ player, onPlayPvP, onPlayBot, onPlaySolo }: Props) {
  const [showBotModal, setShowBotModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>2048</Text>
        <Text style={styles.subtitle}>BATTLE</Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>👤 {player.nickname}</Text>
        <Text style={styles.playerElo}>⚡ {player.elo} ELO</Text>
        <Text style={styles.playerStats}>
          🎮 {player.total_games} games · 🏆 {player.total_wins} wins
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity onPress={onPlayPvP} style={styles.pvpBtn}>
          <Text style={styles.pvpBtnTitle}>⚔️ PVP BATTLE</Text>
          <Text style={styles.pvpBtnSub}>Play against real players</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowBotModal(true)} style={styles.botBtn}>
          <Text style={styles.botBtnTitle}>🤖 VS BOT</Text>
          <Text style={styles.botBtnSub}>Practice against AI</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPlaySolo} style={styles.soloBtn}>
          <Text style={styles.soloBtnTitle}>🎲 SOLO</Text>
          <Text style={styles.soloBtnSub}>Practice mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Same board · Pure skill · No luck</Text>
      </View>

      <Modal visible={showBotModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>SELECT DIFFICULTY</Text>

            <TouchableOpacity
              onPress={() => { setShowBotModal(false); onPlayBot('easy'); }}
              style={[styles.diffBtn, styles.easyBtn]}
            >
              <Text style={styles.diffBtnTitle}>🟢 EASY</Text>
              <Text style={styles.diffBtnSub}>Slow moves, random strategy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setShowBotModal(false); onPlayBot('medium'); }}
              style={[styles.diffBtn, styles.mediumBtn]}
            >
              <Text style={styles.diffBtnTitle}>🟡 MEDIUM</Text>
              <Text style={styles.diffBtnSub}>Balanced speed and strategy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setShowBotModal(false); onPlayBot('hard'); }}
              style={[styles.diffBtn, styles.hardBtn]}
            >
              <Text style={styles.diffBtnTitle}>🔴 HARD</Text>
              <Text style={styles.diffBtnSub}>Fast moves, smart strategy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowBotModal(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 16 },
  title: { fontSize: 64, fontWeight: '900', color: '#776e65', letterSpacing: -2 },
  subtitle: { fontSize: 24, fontWeight: '900', color: '#f65e3b', letterSpacing: 8, marginTop: -8 },
  playerInfo: {
    backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16,
    padding: 16, alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  playerName: { fontSize: 20, fontWeight: '800', color: '#776e65', marginBottom: 4 },
  playerElo: { fontSize: 16, color: '#f65e3b', fontWeight: '700', marginBottom: 4 },
  playerStats: { fontSize: 13, color: '#bbada0' },
  buttons: { paddingHorizontal: 20, gap: 10 },
  pvpBtn: {
    backgroundColor: '#f65e3b', borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 24,
    shadowColor: '#f65e3b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  pvpBtnTitle: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 2 },
  pvpBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  botBtn: {
    backgroundColor: '#8f7a66', borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 24,
  },
  botBtnTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 2 },
  botBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  soloBtn: {
    backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 24,
    borderWidth: 2, borderColor: '#e0d6cc',
  },
  soloBtnTitle: { fontSize: 18, fontWeight: '900', color: '#776e65', letterSpacing: 2, marginBottom: 2 },
  soloBtnSub: { fontSize: 13, color: '#bbada0' },
  footer: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  footerText: { fontSize: 13, color: '#bbada0', fontStyle: 'italic' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#faf8ef', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, gap: 10,
  },
  modalTitle: {
    fontSize: 16, fontWeight: '900', color: '#776e65',
    letterSpacing: 2, marginBottom: 8, textAlign: 'center',
  },
  diffBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20 },
  easyBtn: { backgroundColor: '#6db56d' },
  mediumBtn: { backgroundColor: '#e8a838' },
  hardBtn: { backgroundColor: '#e05454' },
  diffBtnTitle: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1, marginBottom: 2 },
  diffBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  cancelBtn: {
    backgroundColor: '#bbada0', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  cancelBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 2 },
});
