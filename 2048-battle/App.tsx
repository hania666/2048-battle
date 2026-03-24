import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MatchmakingScreen } from './src/screens/MatchmakingScreen';

import { GameScreen } from './src/screens/GameScreen';
import { PvPGameScreen } from './src/screens/PvPGameScreen';
import { MatchResultScreen } from './src/screens/MatchResultScreen';
import { usePlayer } from './src/hooks/usePlayer';

type Screen = 'home' | 'matchmaking' | 'pvp' | 'solo' | 'result';

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
  const [screen, setScreen] = useState<Screen>('home');
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);

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
          onPlayPvP={() => setScreen('matchmaking')}
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
            setResultData({
              won, myScore, opponentScore,
              opponentNickname: matchData.opponentNickname,
            });
            setScreen('result');
          }}
        />
      )}

      {screen === 'solo' && (
        <GameScreen
          player={player}
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
