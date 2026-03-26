import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_BONUS_KEY = 'last_daily_bonus_2048';
const STREAK_KEY = 'daily_bonus_streak_2048';
const BONUSES = [3, 3, 4, 4, 5, 5, 7];

export function useDailyBonus() {
  const [canClaim, setCanClaim] = useState(false);
  const [streak, setStreak] = useState(0);
  const [nextBonus, setNextBonus] = useState(3);

  useEffect(() => { checkBonus(); }, []);

  const checkBonus = async () => {
    const [lastBonus, savedStreak] = await Promise.all([
      AsyncStorage.getItem(LAST_BONUS_KEY),
      AsyncStorage.getItem(STREAK_KEY),
    ]);
    const now = Date.now();
    const last = lastBonus ? parseInt(lastBonus) : 0;
    const currentStreak = savedStreak ? parseInt(savedStreak) : 0;
    const elapsed = now - last;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const twoDaysMs = 48 * 60 * 60 * 1000;
    if (elapsed >= oneDayMs) {
      const newStreak = elapsed >= twoDaysMs ? 0 : currentStreak;
      setStreak(newStreak);
      setNextBonus(BONUSES[Math.min(newStreak, BONUSES.length - 1)]);
      setCanClaim(true);
    } else {
      setStreak(currentStreak);
      setNextBonus(BONUSES[Math.min(currentStreak, BONUSES.length - 1)]);
      setCanClaim(false);
    }
  };

  const claimBonus = useCallback(async (): Promise<number> => {
    if (!canClaim) return 0;
    const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
    const currentStreak = savedStreak ? parseInt(savedStreak) : 0;
    const bonus = BONUSES[Math.min(currentStreak, BONUSES.length - 1)];
    const newStreak = currentStreak + 1;
    await Promise.all([
      AsyncStorage.setItem(LAST_BONUS_KEY, Date.now().toString()),
      AsyncStorage.setItem(STREAK_KEY, newStreak.toString()),
    ]);
    setStreak(newStreak);
    setCanClaim(false);
    setNextBonus(BONUSES[Math.min(newStreak, BONUSES.length - 1)]);
    return bonus;
  }, [canClaim]);

  return { canClaim, streak, nextBonus, claimBonus };
}
