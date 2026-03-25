import { useCallback, useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-7052877159805288/9201211590';

export function useRewardedAd(onRewarded: () => void) {
  const [loaded, setLoaded] = useState(false);
  const [ad, setAd] = useState<RewardedAd | null>(null);

  useEffect(() => {
    loadAd();
  }, []);

  const loadAd = useCallback(() => {
    const rewarded = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
      setAd(rewarded);
    });

    rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      onRewarded();
      setLoaded(false);
      setTimeout(loadAd, 1000);
    });

    rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      setTimeout(loadAd, 1000);
    });

    rewarded.addAdEventListener(AdEventType.ERROR, () => {
      setLoaded(false);
      setTimeout(loadAd, 30000);
    });

    rewarded.load();
  }, [onRewarded]);

  const showAd = useCallback(() => {
    if (loaded && ad) {
      ad.show();
    }
  }, [loaded, ad]);

  return { loaded, showAd };
}
