import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const SETTINGS_KEY = 'settings_2048';

interface Settings {
  sound: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  vibration: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(data => {
      if (data) setSettings(JSON.parse(data));
    });
  }, []);

  const updateSetting = async (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const vibrate = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!settings.vibration) return;
    if (type === 'light') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'medium') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === 'heavy') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return { settings, updateSetting, vibrate };
}
