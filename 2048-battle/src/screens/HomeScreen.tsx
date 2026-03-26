import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Player } from '../hooks/usePlayer';
import { EnergyBar } from '../components/EnergyBar';
import { ShopModal } from '../components/ShopModal';
import { LanguageModal } from '../components/LanguageModal';
import { useLanguage } from '../i18n/useLanguage';
import { theme } from '../utils/theme';

interface Props {
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
  onSettings: () => void;
}

export function HomeScreen({ player, energy, maxEnergy, timeUntilRegen, onWatchAd, onBuy, adLoaded, onPlayPvP, onPlayBot, onPlaySolo, onLeaderboard, onSettings }: Props) {
  const [showShop, setShowShop] = React.useState(false);
  const [showLang, setShowLang] = React.useState(false);
  const [showBotModal, setShowBotModal] = React.useState(false);
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <ShopModal visible={showShop} energy={energy} maxEnergy={maxEnergy}
        onClose={() => setShowShop(false)}
        onWatchAd={() => { onWatchAd?.(); setShowShop(false); }}
        onBuy={onBuy} adLoaded={adLoaded || false} />
      <LanguageModal visible={showLang} onClose={() => setShowLang(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onSettings} style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>⚙️</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>2048</Text>
          <Text style={styles.subtitle}>BATTLE</Text>
        </View>
        <TouchableOpacity onPress={() => setShowLang(true)} style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>🌍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playerCard}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>👤 {player.nickname}</Text>
          <Text style={styles.playerElo}>⚡ {player.elo} ELO</Text>
        </View>
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{player.total_games}</Text>
            <Text style={styles.statLabel}>{t('games')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{player.total_wins}</Text>
            <Text style={styles.statLabel}>{t('wins')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {player.total_games > 0 ? Math.round(player.total_wins / player.total_games * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>WR</Text>
          </View>
        </View>
      </View>

      <EnergyBar energy={energy} maxEnergy={maxEnergy}
        timeUntilRegen={timeUntilRegen}
        onWatchAd={() => setShowShop(true)} />

      <View style={styles.buttons}>
        <TouchableOpacity onPress={onPlayPvP} style={styles.pvpBtn}>
          <Text style={styles.pvpBtnTitle}>{t('pvpBattle')}</Text>
          <Text style={styles.pvpBtnSub}>{t('pvpSub')}</Text>
        </TouchableOpacity>

        <View style={styles.row2}>
          <TouchableOpacity onPress={() => setShowBotModal(true)} style={styles.botBtn}>
            <Text style={styles.btn2Title}>{t('vsBot')}</Text>
            <Text style={styles.btn2Sub}>{t('vsBotSub')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlaySolo} style={styles.soloBtn}>
            <Text style={styles.btn2Title}>{t('solo')}</Text>
            <Text style={styles.btn2Sub}>{t('soloSub')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onLeaderboard} style={styles.leaderboardBtn}>
          <Text style={styles.leaderboardBtnText}>{t('leaderboard')} ›</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tagline}>{t('tagline')}</Text>

      <Modal visible={showBotModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('selectDifficulty')}</Text>
            <TouchableOpacity onPress={() => { setShowBotModal(false); onPlayBot('easy'); }} style={[styles.diffBtn, { backgroundColor: '#1E8449' }]}>
              <Text style={styles.diffBtnTitle}>{t('easy')}</Text>
              <Text style={styles.diffBtnSub}>{t('easySub')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowBotModal(false); onPlayBot('medium'); }} style={[styles.diffBtn, { backgroundColor: '#D4AC0D' }]}>
              <Text style={styles.diffBtnTitle}>{t('medium')}</Text>
              <Text style={styles.diffBtnSub}>{t('mediumSub')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowBotModal(false); onPlayBot('hard'); }} style={[styles.diffBtn, { backgroundColor: '#C0392B' }]}>
              <Text style={styles.diffBtnTitle}>{t('hard')}</Text>
              <Text style={styles.diffBtnSub}>{t('hardSub')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBotModal(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: theme.colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconBtnText: { fontSize: 18 },
  titleContainer: { alignItems: 'center' },
  title: { fontSize: 42, fontWeight: '900', color: theme.colors.text, letterSpacing: -1 },
  subtitle: { fontSize: 16, fontWeight: '900', color: theme.colors.accent1, letterSpacing: 8, marginTop: -8 },
  playerCard: {
    marginHorizontal: 20, marginBottom: 12, backgroundColor: theme.colors.bgCard,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  playerInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  playerName: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  playerElo: { fontSize: 16, fontWeight: '800', color: theme.colors.accent1 },
  playerStats: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  statLabel: { fontSize: 11, color: theme.colors.text2, fontWeight: '600', letterSpacing: 1 },
  statDivider: { width: 1, backgroundColor: theme.colors.border },
  buttons: { paddingHorizontal: 20, gap: 10, flex: 1 },
  pvpBtn: {
    backgroundColor: theme.colors.accent1, borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 24,
    shadowColor: theme.colors.accent1, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  pvpBtnTitle: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 2 },
  pvpBtnSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  row2: { flexDirection: 'row', gap: 10 },
  botBtn: {
    flex: 1, backgroundColor: theme.colors.bgCard, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 16,
    borderWidth: 2, borderColor: theme.colors.accent3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  soloBtn: {
    flex: 1, backgroundColor: theme.colors.bgCard, borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 16,
    borderWidth: 2, borderColor: theme.colors.accent2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  btn2Title: { fontSize: 16, fontWeight: '900', color: theme.colors.text, marginBottom: 2 },
  btn2Sub: { fontSize: 12, color: theme.colors.text2 },
  leaderboardBtn: {
    backgroundColor: theme.colors.bgCard, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 24,
    borderWidth: 2, borderColor: theme.colors.warning, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  leaderboardBtnText: { fontSize: 16, fontWeight: '900', color: theme.colors.warning, letterSpacing: 1 },
  tagline: { textAlign: 'center', color: theme.colors.text3, fontSize: 12, paddingBottom: 12, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: theme.colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 10 },
  modalTitle: { fontSize: 16, fontWeight: '900', color: theme.colors.text, letterSpacing: 2, marginBottom: 8, textAlign: 'center' },
  diffBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20 },
  diffBtnTitle: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1, marginBottom: 2 },
  diffBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  cancelBtn: { backgroundColor: theme.colors.bgCard2, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  cancelBtnText: { color: theme.colors.text2, fontWeight: '900', fontSize: 14, letterSpacing: 2 },
});
