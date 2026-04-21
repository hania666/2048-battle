import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Player {
  id: string;
  nickname: string;
  device_id: string;
  elo: number;
  total_games: number;
  total_wins: number;
  win_streak: number;
  best_streak: number;
}

const PLAYER_KEY = 'player_2048_local';

async function getOrCreateDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem('device_id_2048');
  if (!id) {
    id = 'device_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    await AsyncStorage.setItem('device_id_2048', id);
  }
  return id;
}

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PLAYER_KEY).then(data => {
      if (data) setPlayer(JSON.parse(data));
    });
  }, []);

  const createPlayer = useCallback(async (nickname: string) => {
    setLoading(true);
    try {
      const deviceId = await getOrCreateDeviceId();
      const newPlayer: Player = {
        id: 'local_' + deviceId,
        nickname: nickname.trim() || 'Player' + Math.floor(Math.random() * 9999),
        device_id: deviceId,
        elo: 1000,
        total_games: 0,
        total_wins: 0,
        win_streak: 0,
        best_streak: 0,
      };

      // Пробуем сохранить в Supabase
      try {
        const { supabase } = await import('../utils/supabase');
        const { data: existing } = await supabase
          .from('players')
          .select('*')
          .eq('device_id', deviceId)
          .single();

        if (existing) {
          await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(existing));
          setPlayer(existing);
          setLoading(false);
          return existing;
        }

        const { data } = await supabase
          .from('players')
          .insert({ nickname: newPlayer.nickname, device_id: deviceId })
          .select()
          .single();

        if (data) {
          await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(data));
          setPlayer(data);
          setLoading(false);
          return data;
        }
      } catch (e) {
        // Supabase недоступен — работаем локально
        console.warn('Supabase unavailable, using local player');
      }

      // Локальный режим
      await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(newPlayer));
      setPlayer(newPlayer);
      return newPlayer;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlayer = useCallback(async (updates: Partial<Player>) => {
    if (!player) return;
    const updated = { ...player, ...updates };
    // Сохраняем локально всегда
    await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(updated));
    setPlayer(updated);
    // Пробуем синхронизировать с Supabase
    if (!player.id.startsWith('local_')) {
      try {
        const { supabase } = await import('../utils/supabase');
        await supabase.from('players').update(updates).eq('id', player.id);
      } catch (e) {
        console.warn('Supabase sync error, saved locally:', e);
      }
    }
  }, [player]);

  const updateNickname = useCallback(async (nickname: string) => {
    if (!player) return;
    const updated = { ...player, nickname };
    await AsyncStorage.setItem(PLAYER_KEY, JSON.stringify(updated));
    setPlayer(updated);
  }, [player]);

  const resetPlayer = useCallback(async () => {
    await AsyncStorage.removeItem(PLAYER_KEY);
    setPlayer(null);
  }, []);

  return { player, loading, createPlayer, updateNickname, updatePlayer, resetPlayer };
}
