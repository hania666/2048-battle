import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MatchmakingScreen } from './src/screens/MatchmakingScreen';
import { PvPGameScreen } from './src/screens/PvPGameScreen';
import { BotGameScreen } from './src/screens/BotGameScreen';
import { GameScreen } from './src/screens/GameScreen';
import { MatchResultScreen } from './src/screens/MatchResultScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { useAchievements } from './src/hooks/useAchievements';
import { useSkins } from './src/hooks/useSkins';
import { SkinsScreen } from './src/screens/SkinsScreen';
import { useDailyTasks } from './src/hooks/useDailyTasks';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { usePlayer } from './src/hooks/usePlayer';
import { getEloDiff } from './src/game/elo';
import { supabase } from './src/utils/supabase';
import { useEnergy } from './src/hooks/useEnergy';
import { useNoAds } from './src/hooks/useNoAds';
import { useRewardedAd } from './src/hooks/useRewardedAd';
import { useDailyBonus } from './src/hooks/useDailyBonus';
import { soundManager } from './src/utils/soundManager';
import { LanguageProvider, useLanguage } from './src/i18n/useLanguage';
import { BottomNav } from './src/components/BottomNav';
import { useNotifications } from './src/hooks/useNotifications';
import { useSettings } from './src/hooks/useSettings';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Screen = 'home' | 'matchmaking' | 'pvp' | 'bot' | 'solo' | 'result' | 'leaderboard' | 'settings' | 'privacy' | 'profile' | 'achievements' | 'skins';

interface MatchData {
  matchId: string;
  seed: number;
  isPlayer1: boolean;
  opponentNickname: string;
}

interface ResultData {
  won: boolean;
  myScore: number;
  opponentScore: number;
  opponentNickname: string;
  eloDiff: number;
  streak?: number;
}

export default function App() {
  const { player, loading, createPlayer } = usePlayer();
  const { energy, maxEnergy, useEnergy: spendEnergy, addEnergy, getTimeUntilRegen } = useEnergy();
  const { canClaim, streak, nextBonus, claimBonus } = useDailyBonus();
  const { settings } = useSettings();
  const { noAds, purchaseNoAds } = useNoAds();
  const { achievements, checkAchievements, unlockedCount } = useAchievements();
  const { selectedSkin, ownedSkinIds, selectSkin, purchaseSkin, isSkinOwned } = useSkins();
  const { updateProgress } = useDailyTasks();
  const { scheduleEnergyNotification, scheduleDailyBonusNotification } = useNotifications();
  const { loaded: adLoaded, showAd: showAdRaw } = useRewardedAd(() => addEnergy(2));

  React.useEffect(() => {
    const initSound = async () => {
      try {
        await soundManager.init();
        await soundManager.playMusic();
        console.log('Sound initialized OK');
      } catch (e) {
        console.warn('Sound init error:', e);
      }
    };
    initSound();
    return () => { soundManager.stopMusic(); };
  }, []);

  React.useEffect(() => {
    soundManager.updateSettings(settings.sound, settings.music);
  }, [settings.sound, settings.music]);
  const [showBonus, setShowBonus] = useState(false);

  React.useEffect(() => {
    if (canClaim) setShowBonus(true);
  }, [canClaim]);

  const handleClaimBonus = async () => {
    const bonus = await claimBonus();
    if (bonus > 0) await addEnergy(bonus);
    setShowBonus(false);
  };
  const [screen, setScreen] = useState<Screen>('home');
  const inGame = ['pvp', 'bot', 'matchmaking'].includes(screen);
  const showAd = inGame ? undefined : showAdRaw;
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  if (!player) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <OnboardingScreen onStart={createPlayer} loading={loading} />
      </SafeAreaProvider>
    );
  }

  return (
    <LanguageProvider>
    <SafeAreaProvider>
      <Modal visible={showBonus} transparent animationType="fade">
        <View style={bonusStyles.overlay}>
          <View style={bonusStyles.card}>
            <Text style={bonusStyles.emoji}>🎁</Text>
            <Text style={bonusStyles.title}>DAILY BONUS!</Text>
            <Text style={bonusStyles.streak}>Day {streak + 1} streak 🔥</Text>
            <Text style={bonusStyles.reward}>+{nextBonus} ⚡ Energy</Text>
            <TouchableOpacity onPress={handleClaimBonus} style={bonusStyles.btn}>
              <Text style={bonusStyles.btnText}>CLAIM!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <StatusBar style="dark" />

      {screen === 'home' && (
        <HomeScreen
          player={player}
          energy={energy}
          maxEnergy={maxEnergy}
          timeUntilRegen={getTimeUntilRegen()}
          onWatchAd={adLoaded && !noAds ? showAd : undefined}
          onBuy={(product) => {
            if (product === 'energy_10') addEnergy(10);
            else if (product === 'energy_25') addEnergy(25);
            else if (product === 'energy_unlimited') addEnergy(999);
          }}
          noAds={noAds}
          onRemoveAds={purchaseNoAds}
          adLoaded={adLoaded}
          onSettings={() => setScreen('settings')}
          onProfile={() => setScreen('profile')}
          onPlayPvP={() => setScreen('matchmaking')}
          onLeaderboard={() => setScreen('leaderboard')}
          onPlayBot={(diff) => { setBotDifficulty(diff); setScreen('bot'); }}
          onPlaySolo={() => setScreen('solo')}
        />
      )}

      {screen === 'matchmaking' && (
        <MatchmakingScreen
          player={player}
          onMatchFound={(matchId, seed, isPlayer1) => {
            setMatchData({ matchId, seed, isPlayer1, opponentNickname: '' });
            setScreen('pvp');
          }}
          onCancel={() => setScreen('home')}
          onSpendEnergy={() => spendEnergy(1)}
        />
      )}

      {screen === 'pvp' && matchData && (
        <PvPGameScreen
          player={player}
          matchId={matchData.matchId}
          seed={matchData.seed}
          isPlayer1={matchData.isPlayer1}
          opponentNickname={matchData.opponentNickname}
          onFinish={async (won: boolean, myScore: number, opponentScore: number) => {
            const eloDiff = getEloDiff(player.elo, 1000, won);
            const newElo = player.elo + eloDiff;
            try {
              const currentStreak = (player as any).win_streak || 0;
              const newStreak = won ? currentStreak + 1 : 0;
              const bestStreak = Math.max((player as any).best_streak || 0, newStreak);
              await supabase.from('players').update({
                elo: newElo,
                total_games: player.total_games + 1,
                total_wins: player.total_wins + (won ? 1 : 0),
                win_streak: newStreak,
                best_streak: bestStreak,
              }).eq('id', player.id);
              await supabase.from('match_history').insert({
                player_id: player.id,
                opponent_nickname: matchData?.opponentNickname || 'Unknown',
                my_score: myScore,
                opponent_score: opponentScore,
                won,
                elo_change: eloDiff,
              });
            await updateProgress('matches', 1);
            if (won) await updateProgress('wins', 1);
            await updateProgress('score', myScore);
            const newlyUnlocked = await checkAchievements({
              wins: player.total_wins + (won ? 1 : 0),
              matches: player.total_games + 1,
              streak: won ? ((player as any).win_streak || 0) + 1 : 0,
              elo: newElo,
            });
            if (newlyUnlocked.length > 0) {
              const totalReward = newlyUnlocked.reduce((s, a) => s + a.reward, 0);
              if (totalReward > 0) await addEnergy(totalReward);
            }
            } catch (e) { console.warn('ELO update error:', e); }
            const newStreak = won ? ((player as any).win_streak || 0) + 1 : 0;
            setResultData({ won, myScore, opponentScore, opponentNickname: matchData?.opponentNickname || '', eloDiff, streak: newStreak });
            setScreen('result');
          }}
        />
      )}

      {screen === 'bot' && (
        <BotGameScreen
          player={player}
          difficulty={botDifficulty}
          onFinish={(won, myScore, botScore) => {
            setResultData({
              won, myScore, opponentScore: botScore,
              opponentNickname: botDifficulty === 'easy' ? '🤖 EasyBot' :
                botDifficulty === 'medium' ? '🤖 MediumBot' : '🤖 HardBot',
              eloDiff: 0,
            });
            setScreen('result');
          }}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'solo' && (
        <GameScreen
          player={player}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen onBack={() => setScreen('home')} onPrivacyPolicy={() => setScreen('privacy')} />
      )}

      {screen === 'skins' && (
        <SkinsScreen
          selectedSkinId={selectedSkin.id}
          ownedSkinIds={ownedSkinIds}
          onSelect={selectSkin}
          onPurchase={purchaseSkin}
          onBack={() => setScreen('profile')}
          isVip={noAds}
        />
      )}

      {screen === 'achievements' && (
        <AchievementsScreen
          achievements={achievements}
          unlockedCount={unlockedCount}
          onBack={() => setScreen('profile')}
        />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          player={player}
          onBack={() => setScreen('home')}
          onNicknameChange={(nickname) => { player.nickname = nickname; }}
          onAchievements={() => setScreen('achievements')}
          onSkins={() => setScreen('skins')}
          unlockedCount={unlockedCount}
          totalAchievements={achievements.length}
        />
      )}

      {screen === 'privacy' && (
        <PrivacyPolicyScreen onBack={() => setScreen('settings')} />
      )}

      {screen === 'leaderboard' && (
        <LeaderboardScreen
          currentPlayerId={player.id}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'result' && resultData && (
        <MatchResultScreen
          won={resultData.won}
          myScore={resultData.myScore}
          opponentScore={resultData.opponentScore}
          myNickname={player.nickname}
          opponentNickname={resultData.opponentNickname}
          eloDiff={resultData.eloDiff}
          streak={resultData.streak}
          onPlayAgain={() => setScreen('home')}
          onHome={() => setScreen('home')}
        />
      )}
      {['home', 'leaderboard', 'profile', 'achievements', 'skins'].includes(screen) && (
        <BottomNav
          active={screen === 'leaderboard' ? 'leaders' : screen === 'achievements' || screen === 'skins' ? 'profile' : screen as any}
          onHome={() => setScreen('home')}
          onLeaders={() => setScreen('leaderboard')}
          onProfile={() => setScreen('profile')}
        />
      )}
    </SafeAreaProvider>
    </LanguageProvider>
  );
}

const bonusStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    backgroundColor: '#faf8ef', borderRadius: 24,
    padding: 32, alignItems: 'center', width: '80%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 12,
  },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '900', color: '#776e65', letterSpacing: 2, marginBottom: 8 },
  streak: { fontSize: 16, color: '#f65e3b', fontWeight: '700', marginBottom: 16 },
  reward: { fontSize: 36, fontWeight: '900', color: '#776e65', marginBottom: 24 },
  btn: {
    backgroundColor: '#f65e3b', borderRadius: 14,
    paddingHorizontal: 40, paddingVertical: 16,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
});
