import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

export interface LeaderboardEntry {
  id: string;
  player_id: string;
  nickname: string;
  elo: number;
  total_games: number;
  total_wins: number;
  best_score: number;
  win_rate: number;
  updated_at: string;
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (sortBy: 'elo' | 'best_score' | 'total_wins' = 'elo') => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order(sortBy, { ascending: false })
        .limit(50);
      if (data) setEntries(data);
    } catch (e) {
      console.warn('Leaderboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const upsert = useCallback(async (
    playerId: string,
    nickname: string,
    elo: number,
    totalGames: number,
    totalWins: number,
    bestScore: number,
  ) => {
    try {
      const winRate = totalGames > 0 ? Math.round(totalWins / totalGames * 100) : 0;
      await supabase
        .from('leaderboard')
        .upsert({
          player_id: playerId,
          nickname,
          elo,
          total_games: totalGames,
          total_wins: totalWins,
          best_score: bestScore,
          win_rate: winRate,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'player_id' });
    } catch (e) {
      console.warn('Leaderboard upsert error:', e);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return { entries, loading, fetchLeaderboard, upsert };
}
