import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player } from '../hooks/usePlayer';
import { EnergyBar } from '../components/EnergyBar';
import { useLanguage } from '../i18n/useLanguage';
import { LanguageModal } from '../components/LanguageModal';
import { ShopModal } from '../components/ShopModal';

interface Props {
  onSettings: () => void;
  player: Player;
  energy: number;
  maxEnergy: number;
  timeUntilRegen: string | null;
  onWatchAd?: () => void;
  onBuy: (product: string) => void;
  adLoaded?: boolean;
  onPlayPvP: () => void;
  onPlayBot: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onPlaySolo: () => void;
  onLeaderboard: () => void;
}

export function HomeScreen({ player, energy, maxEnergy, timeUntilRegen, onWatchAd, onBuy, adLoaded, onPlayPvP, onPlayBot, onPlaySolo, onLeaderboard, onSettings }: Props) {
  const [showShop, setShowShop] = React.useState(false);
  const [showLang, setShowLang] = React.useState(false);
  const { t } = useLanguage();
  const [showBotModal, setShowBotModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSettings} style={styles.settingsBtn}>
          <Text style={styles.langBtnText}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowLang(true)} style={styles.langBtn}>
          <Text style={styles.langBtnText}>🌍</Text>
        </TouchableOpacity>
        <Text style={styles.title}>2048</Text>
        <Text style={styles.subtitle}>BATTLE</Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>👤 {player.nickname}</Text>
        <Text style={styles.playerElo}>⚡ {player.elo} ELO</Text>
        <Text style={styles.playerStats}>
          🎮 {player.total_games} {t('games')} · 🏆 {player.total_wins} {t('wins')}
        </Text>
      </View>

      <LanguageModal visible={showLang} onClose={() => setShowLang(false)} />
      <ShopModal
        visible={showShop}
        energy={energy}
        maxEnergy={maxEnergy}
        onClose={() => setShowShop(false)}
        onWatchAd={() => { onWatchAd?.(); setShowShop(false); }}
        onBuy={onBuy}
        adLoaded={adLoaded || false}
      />

      <EnergyBar
        energy={energy}
        maxEnergy={maxEnergy}
        timeUntilRegen={timeUntilRegen}
        onWatchAd={() => setShowShop(true)}
      />

      <View style={styles.buttons}>
        <TouchableOpacity onPress={onPlayPvP} style={styles.pvpBtn}>
          <Text style={styles.pvpBtnTitle}>{t('pvpBattle')}</Text>
          <Text style={styles.pvpBtnSub}>{t('pvpSub')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowBotModal(true)} style={styles.botBtn}>
          <Text style={styles.botBtnTitle}>{t('vsBot')}</Text>
          <Text style={styles.botBtnSub}>{t('vsBotSub')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLeaderboard} style={styles.leaderboardBtn}>
          <Text style={styles.leaderboardBtnTitle}>{t('leaderboard')}</Text>
          <Text style={styles.leaderboardBtnSub}>{t('leaderboardSub')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPlaySolo} style={styles.soloBtn}>
          <Text style={styles.soloBtnTitle}>{t('solo')}</Text>
          <Text style={styles.soloBtnSub}>{t('soloSub')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('tagline')}</Text>
      </View>

      <Modal visible={showBotModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('selectDifficulty')}</Text>

            <TouchableOpacity
              onPress={() => { setShowBotModal(false); onPlayBot('easy'); }}
              style={[styles.diffBtn, styles.easyBtn]}
            >
              <Text style={styles.diffBtnTitle}>{t('easy')}</Text>
              <Text style={styles.diffBtnSub}>{t('easySub')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setShowBotModal(false); onPlayBot('medium'); }}
              style={[styles.diffBtn, styles.mediumBtn]}
            >
              <Text style={styles.diffBtnTitle}>{t('medium')}</Text>
              <Text style={styles.diffBtnSub}>{t('mediumSub')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { setShowBotModal(false); onPlayBot('hard'); }}
              style={[styles.diffBtn, styles.hardBtn]}
            >
              <Text style={styles.diffBtnTitle}>{t('hard')}</Text>
              <Text style={styles.diffBtnSub}>{t('hardSub')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowBotModal(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ef' },
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 16, position: 'relative' },
  settingsBtn: {
    position: 'absolute', top: 32, left: 20,
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  langBtn: {
    position: 'absolute', top: 32, right: 20,
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  langBtnText: { fontSize: 20 },
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
  leaderboardBtn: {
    backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 24,
    borderWidth: 2, borderColor: '#edcf72',
  },
  leaderboardBtnTitle: { fontSize: 18, fontWeight: '900', color: '#776e65', letterSpacing: 2, marginBottom: 2 },
  leaderboardBtnSub: { fontSize: 13, color: '#bbada0' },
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
