import { useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, TranslationKey } from './translations';

const LANGUAGE_KEY = 'app_language_2048';

function detectLanguage(): Language {
  const locale = Localization.getLocales()[0]?.languageCode || 'en';
  if (locale === 'ru') return 'ru';
  if (locale === 'uk') return 'uk';
  if (locale === 'es') return 'es';
  return 'en';
}

let currentLanguage: Language = 'en';
let listeners: (() => void)[] = [];

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(currentLanguage);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then(saved => {
      const lang = (saved as Language) || detectLanguage();
      currentLanguage = lang;
      setLanguage(lang);
    });

    const listener = () => setLanguage(currentLanguage);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  const setLang = async (lang: Language) => {
    currentLanguage = lang;
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    listeners.forEach(l => l());
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { language, setLanguage: setLang, t };
}
