import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NO_ADS_KEY = 'no_ads_purchased_2048';

export function useNoAds() {
  const [noAds, setNoAds] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NO_ADS_KEY).then(val => {
      if (val === 'true') setNoAds(true);
    });
  }, []);

  const purchaseNoAds = async () => {
    try {
      await AsyncStorage.setItem(NO_ADS_KEY, 'true');
      setNoAds(true);
      return true;
    } catch (e) {
      console.warn('Purchase error:', e);
    }
    return false;
  };

  const restorePurchases = async () => {
    const saved = await AsyncStorage.getItem(NO_ADS_KEY);
    if (saved === 'true') {
      setNoAds(true);
      return true;
    }
    return false;
  };

  return { noAds, purchaseNoAds, restorePurchases };
}
