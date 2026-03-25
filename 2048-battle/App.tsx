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
import { usePlayer } from './src/hooks/usePlayer';
import { useEnergy } from './src/hooks/useEnergy';

type Screen = 'home' | 'matchmaking' | 'pvp' | 'bot' | 'solo' | 'result' | 'leaderboard';

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
}

export default function App() {
  const { player, loading, createPlayer } = usePlayer();
  const { energy, maxEnergy, useEnergy: spendEnergy, addEnergy, getTimeUntilRegen } = useEnergy();
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
          onPlayPvP={async () => {
            const ok = await spendEnergy(1);
            if (ok) setScreen('matchmaking');
          }}
          onLeaderboard={() => setScreen('leaderboard')}
          onPlayBot={async (diff) => {
            const ok = await spendEnergy(1);
            if (ok) { setBotDifficulty(diff); setScreen('bot'); }
          }}
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
        />
      )}

      {screen === 'pvp' && matchData && (
        <PvPGameScreen
          player={player}
          matchId={matchData.matchId}
          seed={matchData.seed}
          isPlayer1={matchData.isPlayer1}
          opponentNickname={matchData.opponentNickname}
          onFinish={(won: boolean, myScore: number, opponentScore: number) => {
            setResultData({ won, myScore, opponentScore, opponentNickname: matchData.opponentNickname });
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
          onPlayAgain={() => setScreen('matchmaking')}
          onHome={() => setScreen('home')}
        />
      )}
    </SafeAreaProvider>
  );
}
