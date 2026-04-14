import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = 'achievements_2048';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_win', title: 'First Victory', description: 'Win your first match', icon: '🥇', reward: 3, unlocked: false },
  { id: 'wins_10', title: 'Veteran', description: 'Win 10 matches', icon: '🏆', reward: 5, unlocked: false },
  { id: 'wins_50', title: 'Champion', description: 'Win 50 matches', icon: '👑', reward: 10, unlocked: false },
  { id: 'wins_100', title: 'Legend', description: 'Win 100 matches', icon: '⭐', reward: 15, unlocked: false },
  { id: 'matches_10', title: 'Regular', description: 'Play 10 matches', icon: '🎮', reward: 3, unlocked: false },
  { id: 'matches_50', title: 'Dedicated', description: 'Play 50 matches', icon: '💪', reward: 5, unlocked: false },
  { id: 'streak_3', title: 'Hot Streak', description: 'Win 3 matches in a row', icon: '🔥', reward: 2, unlocked: false },
  { id: 'streak_5', title: 'On Fire', description: 'Win 5 matches in a row', icon: '💥', reward: 5, unlocked: false },
  { id: 'streak_10', title: 'Unstoppable', description: 'Win 10 matches in a row', icon: '⚡', reward: 10, unlocked: false },
  { id: 'tile_256', title: 'Getting There', description: 'Reach tile 256', icon: '🎯', reward: 3, unlocked: false },
  { id: 'tile_512', title: 'Halfway', description: 'Reach tile 512', icon: '🚀', reward: 5, unlocked: false },
  { id: 'tile_1024', title: 'Almost There', description: 'Reach tile 1024', icon: '💎', reward: 8, unlocked: false },
  { id: 'tile_2048', title: 'Master', description: 'Reach tile 2048', icon: '👑', reward: 15, unlocked: false },
  { id: 'elo_1200', title: 'Rising Star', description: 'Reach 1200 ELO', icon: '⚡', reward: 5, unlocked: false },
  { id: 'elo_1500', title: 'Pro', description: 'Reach 1500 ELO', icon: '🌟', reward: 10, unlocked: false },
];

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_LIST);

  useEffect(() => { loadAchievements(); }, []);

  const loadAchievements = async () => {
    const saved = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      const savedData = JSON.parse(saved);
      setAchievements(ACHIEVEMENTS_LIST.map(a => ({
        ...a,
        unlocked: savedData[a.id]?.unlocked || false,
        unlockedAt: savedData[a.id]?.unlockedAt,
      })));
    }
  };

  const checkAchievements = useCallback(async (stats: {
    wins?: number;
    matches?: number;
    streak?: number;
    maxTile?: number;
    elo?: number;
  }): Promise<Achievement[]> => {
    const saved = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    const savedData = saved ? JSON.parse(saved) : {};
    const newlyUnlocked: Achievement[] = [];

    const checks: Record<string, boolean> = {
      first_win: (stats.wins || 0) >= 1,
      wins_10: (stats.wins || 0) >= 10,
      wins_50: (stats.wins || 0) >= 50,
      wins_100: (stats.wins || 0) >= 100,
      matches_10: (stats.matches || 0) >= 10,
      matches_50: (stats.matches || 0) >= 50,
      streak_3: (stats.streak || 0) >= 3,
      streak_5: (stats.streak || 0) >= 5,
      streak_10: (stats.streak || 0) >= 10,
      tile_256: (stats.maxTile || 0) >= 256,
      tile_512: (stats.maxTile || 0) >= 512,
      tile_1024: (stats.maxTile || 0) >= 1024,
      tile_2048: (stats.maxTile || 0) >= 2048,
      elo_1200: (stats.elo || 0) >= 1200,
      elo_1500: (stats.elo || 0) >= 1500,
    };

    const updated = { ...savedData };
    for (const achievement of ACHIEVEMENTS_LIST) {
      if (!savedData[achievement.id]?.unlocked && checks[achievement.id]) {
        updated[achievement.id] = { unlocked: true, unlockedAt: new Date().toISOString() };
        newlyUnlocked.push(achievement);
      }
    }

    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
    await loadAchievements();
    return newlyUnlocked;
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return { achievements, checkAchievements, unlockedCount };
}
