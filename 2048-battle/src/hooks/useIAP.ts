import { useEffect, useCallback } from 'react';
import {
  initConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  endConnection,
  Purchase,
} from 'expo-iap';

const PRODUCT_IDS = ['energy-10', 'energy-25', 'energy-unlimited', 'no-ads'];

export function useIAP(onPurchaseSuccess: (productId: string) => void) {
  useEffect(() => {
    let purchaseUpdateSub: any;
    let purchaseErrorSub: any;

    const init = async () => {
      try {
        await initConnection();
        await fetchProducts({ skus: PRODUCT_IDS });

        purchaseUpdateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
          if (purchase.transactionId) {
            await finishTransaction({ purchase, isConsumable: purchase.productId !== 'no-ads' });
            onPurchaseSuccess(purchase.productId);
          }
        });

        purchaseErrorSub = purchaseErrorListener((error: any) => {
          console.warn('Purchase error:', error);
        });
      } catch (e) {
        console.warn('IAP init error:', e);
      }
    };

    init();

    return () => {
      purchaseUpdateSub?.remove();
      purchaseErrorSub?.remove();
      endConnection();
    };
  }, []);

  const buyProduct = useCallback(async (productId: string) => {
    try {
      await requestPurchase({ request: { google: { skus: [productId] } }, type: 'in-app' });
    } catch (e) {
      console.warn('Buy error:', e);
    }
  }, []);

  return { buyProduct };
}
