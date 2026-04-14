import { useCallback, useEffect, useRef, useState } from 'react';

const IS_DEVELOPMENT = __DEV__;

const REWARDED_AD_UNIT = IS_DEVELOPMENT
  ? 'ca-app-pub-3940256099942544/5224354917'
  : 'ca-app-pub-7052877159805288/9201211590';

export function useRewardedAd(onRewarded: () => void) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const adRef = useRef<any>(null);

  const loadAd = useCallback(async () => {
    if (loading) return;
    if (__DEV__) {
      console.log('Ads disabled in Expo Go');
      return;
    }
    setLoading(true);
    try {
      const { RewardedAd, RewardedAdEventType, AdEventType } =
        await import('react-native-google-mobile-ads');

      const ad = RewardedAd.createForAdRequest(REWARDED_AD_UNIT, {
        requestNonPersonalizedAdsOnly: true,
      });

      ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setLoaded(true);
        setLoading(false);
        adRef.current = ad;
      });

      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        onRewarded();
        setLoaded(false);
        adRef.current = null;
        setTimeout(loadAd, 2000);
      });

      ad.addAdEventListener(AdEventType.CLOSED, () => {
        setLoaded(false);
        adRef.current = null;
        setTimeout(loadAd, 2000);
      });

      ad.addAdEventListener(AdEventType.ERROR, () => {
        setLoaded(false);
        setLoading(false);
        setTimeout(loadAd, 30000);
      });

      ad.load();
    } catch (e) {
      setLoading(false);
      console.warn('RewardedAd not available in Expo Go');
    }
  }, [onRewarded]);

  useEffect(() => {
    loadAd();
  }, []);

  const showAd = useCallback(() => {
    if (loaded && adRef.current) {
      adRef.current.show();
    }
  }, [loaded]);

  return { loaded, showAd };
}
