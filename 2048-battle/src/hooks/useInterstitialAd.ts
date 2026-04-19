import { useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MATCH_COUNT_KEY = 'match_count_ads_2048';
const INTERSTITIAL_EVERY = 3;

export function useInterstitialAd(onAdClosed?: () => void) {
  const adRef = useRef<any>(null);
  const loadedRef = useRef(false);

  const loadAd = useCallback(async () => {
    if (__DEV__) return;
    try {
      const { InterstitialAd, AdEventType } = await import('react-native-google-mobile-ads');
      const ad = InterstitialAd.createForAdRequest(
        'ca-app-pub-7052877159805288/9154678741',
        { requestNonPersonalizedAdsOnly: true }
      );
      ad.addAdEventListener(AdEventType.LOADED, () => {
        loadedRef.current = true;
        adRef.current = ad;
      });
      ad.addAdEventListener(AdEventType.CLOSED, () => {
        loadedRef.current = false;
        adRef.current = null;
        onAdClosed?.();
        loadAd();
      });
      ad.load();
    } catch (e) {}
  }, []);

  const showAfterMatch = useCallback(async () => {
    if (__DEV__) {
      onAdClosed?.();
      return;
    }
    try {
      const saved = await AsyncStorage.getItem(MATCH_COUNT_KEY);
      const count = saved ? parseInt(saved) + 1 : 1;
      await AsyncStorage.setItem(MATCH_COUNT_KEY, count.toString());

      if (count % INTERSTITIAL_EVERY === 0 && loadedRef.current && adRef.current) {
        adRef.current.show();
      } else {
        onAdClosed?.();
      }
    } catch (e) {
      onAdClosed?.();
    }
  }, []);

  return { loadAd, showAfterMatch };
}
