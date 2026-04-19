import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { soundManager } from '../utils/soundManager';

const SETTINGS_KEY = 'settings_2048';

interface Settings {
  sound: boolean;
  music: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  music: true,
  vibration: true,
};

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: boolean) => Promise<void>;
  vibrate: (type?: 'light' | 'medium' | 'heavy') => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSetting: async () => {},
  vibrate: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(data => {
      if (data) {
        const saved = JSON.parse(data);
        const parsed = { ...DEFAULT_SETTINGS, ...saved };
        setSettings(parsed);
        soundManager.updateSettings(parsed.sound, parsed.music);
      } else {
        soundManager.updateSettings(true, true);
      }
    });
  }, []);

  const updateSetting = async (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    await soundManager.updateSettings(newSettings.sound, newSettings.music);
  };

  const vibrate = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!settings.vibration) return;
    if (type === 'light') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'medium') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (type === 'heavy') await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  return React.createElement(
    SettingsContext.Provider,
    { value: { settings, updateSetting, vibrate } },
    children
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
