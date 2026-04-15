import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { translations, Language, TranslationKey } from './translations';

const LANGUAGE_KEY = 'app_language_2048';

function detectLanguage(): Language {
  const locale = Localization.getLocales()[0]?.languageCode || 'en';
  if (locale === 'ru') return 'ru';
  if (locale === 'uk') return 'uk';
  if (locale === 'es') return 'es';
  if (locale === 'fr') return 'fr';
  return 'en';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then(saved => {
      const lang = (saved as Language) || detectLanguage();
      setLang(lang);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    setLang(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
