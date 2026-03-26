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
import { usePlayer } from './src/hooks/usePlayer';
import { getEloDiff } from './src/game/elo';
import { supabase } from './src/utils/supabase';
import { useEnergy } from './src/hooks/useEnergy';
import { useDailyBonus } from './src/hooks/useDailyBonus';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Screen = 'home' | 'matchmaking' | 'pvp' | 'bot' | 'solo' | 'result' | 'leaderboard' | 'settings';

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
}

export default function App() {
  const { player, loading, createPlayer } = usePlayer();
  const { energy, maxEnergy, useEnergy: spendEnergy, addEnergy, getTimeUntilRegen } = useEnergy();
  const { canClaim, streak, nextBonus, claimBonus } = useDailyBonus();
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
          onWatchAd={() => addEnergy(2)}
          onBuy={(product) => {
            if (product === 'energy_10') addEnergy(10);
            else if (product === 'energy_25') addEnergy(25);
            else if (product === 'energy_unlimited') addEnergy(999);
          }}
          adLoaded={false}
          onSettings={() => setScreen('settings')}
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
              await supabase.from('players').update({
                elo: newElo,
                total_games: player.total_games + 1,
                total_wins: player.total_wins + (won ? 1 : 0),
              }).eq('id', player.id);
            } catch (e) { console.warn('ELO update error:', e); }
            setResultData({ won, myScore, opponentScore, opponentNickname: matchData.opponentNickname, eloDiff });
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
        <SettingsScreen onBack={() => setScreen('home')} />
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
          onPlayAgain={() => setScreen('matchmaking')}
          onHome={() => setScreen('home')}
        />
      )}
    </SafeAreaProvider>
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
