import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_ENERGY = 5;
const REGEN_INTERVAL = 30 * 60 * 1000; // 30 минут
const ENERGY_KEY = 'energy_2048';
const LAST_REGEN_KEY = 'energy_last_regen_2048';

export function useEnergy() {
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [nextRegen, setNextRegen] = useState<number | null>(null);

  useEffect(() => {
    loadEnergy();
    const interval = setInterval(checkRegen, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadEnergy = async () => {
    const [savedEnergy, savedLastRegen] = await Promise.all([
      AsyncStorage.getItem(ENERGY_KEY),
      AsyncStorage.getItem(LAST_REGEN_KEY),
    ]);

    let currentEnergy = savedEnergy ? parseInt(savedEnergy) : MAX_ENERGY;
    const lastRegen = savedLastRegen ? parseInt(savedLastRegen) : Date.now();
    const now2 = Date.now();
    // Защита от перевода времени назад
    if (lastRegen > now2) {
      await AsyncStorage.setItem(LAST_REGEN_KEY, now2.toString());
    }
    const now = Date.now();

    if (currentEnergy < MAX_ENERGY) {
      const elapsed = now - lastRegen;
      const regensEarned = Math.floor(elapsed / REGEN_INTERVAL);
      if (regensEarned > 0) {
        currentEnergy = Math.min(MAX_ENERGY, currentEnergy + regensEarned);
        const newLastRegen = lastRegen + regensEarned * REGEN_INTERVAL;
        await AsyncStorage.setItem(LAST_REGEN_KEY, newLastRegen.toString());
      }
      if (currentEnergy < MAX_ENERGY) {
        const timeUntilNext = REGEN_INTERVAL - ((now - lastRegen) % REGEN_INTERVAL);
        setNextRegen(Date.now() + timeUntilNext);
      }
    }

    setEnergy(currentEnergy);
    await AsyncStorage.setItem(ENERGY_KEY, currentEnergy.toString());
  };

  const checkRegen = async () => {
    const [savedEnergy, savedLastRegen] = await Promise.all([
      AsyncStorage.getItem(ENERGY_KEY),
      AsyncStorage.getItem(LAST_REGEN_KEY),
    ]);

    let currentEnergy = savedEnergy ? parseInt(savedEnergy) : MAX_ENERGY;
    if (currentEnergy >= MAX_ENERGY) return;

    const lastRegen = savedLastRegen ? parseInt(savedLastRegen) : Date.now();
    const now2 = Date.now();
    // Защита от перевода времени назад
    if (lastRegen > now2) {
      await AsyncStorage.setItem(LAST_REGEN_KEY, now2.toString());
    }
    const elapsed = Date.now() - lastRegen;

    if (elapsed >= REGEN_INTERVAL) {
      currentEnergy = Math.min(MAX_ENERGY, currentEnergy + 1);
      await AsyncStorage.setItem(ENERGY_KEY, currentEnergy.toString());
      await AsyncStorage.setItem(LAST_REGEN_KEY, Date.now().toString());
      setEnergy(currentEnergy);
      if (currentEnergy < MAX_ENERGY) {
        setNextRegen(Date.now() + REGEN_INTERVAL);
      } else {
        setNextRegen(null);
      }
    }
  };

  const useEnergy = useCallback(async (amount = 1): Promise<boolean> => {
    const saved = await AsyncStorage.getItem(ENERGY_KEY);
    const current = saved ? parseInt(saved) : MAX_ENERGY;
    if (current < amount) return false;

    const newEnergy = current - amount;
    await AsyncStorage.setItem(ENERGY_KEY, newEnergy.toString());

    if (current === MAX_ENERGY) {
      await AsyncStorage.setItem(LAST_REGEN_KEY, Date.now().toString());
      setNextRegen(Date.now() + REGEN_INTERVAL);
    }

    setEnergy(newEnergy);
    return true;
  }, []);

  const addEnergy = useCallback(async (amount: number) => {
    const saved = await AsyncStorage.getItem(ENERGY_KEY);
    const current = saved ? parseInt(saved) : 0;
    const newEnergy = Math.min(MAX_ENERGY, current + amount);
    await AsyncStorage.setItem(ENERGY_KEY, newEnergy.toString());
    setEnergy(newEnergy);
    if (newEnergy >= MAX_ENERGY) setNextRegen(null);
  }, []);

  const getTimeUntilRegen = useCallback(() => {
    if (!nextRegen) return null;
    const diff = nextRegen - Date.now();
    if (diff <= 0) return null;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return minutes + ':' + seconds.toString().padStart(2, '0');
  }, [nextRegen]);

  return { energy, maxEnergy: MAX_ENERGY, useEnergy, addEnergy, getTimeUntilRegen };
}
