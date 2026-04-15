import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TILE_SKINS, TileSkin } from '../utils/tileSkins';

const SKIN_KEY = 'selected_skin_2048';
const OWNED_SKINS_KEY = 'owned_skins_2048';

export function useSkins() {
  const [selectedSkin, setSelectedSkin] = useState<TileSkin>(TILE_SKINS[0]);
  const [ownedSkinIds, setOwnedSkinIds] = useState<string[]>(['classic']);

  useEffect(() => {
    loadSkins();
  }, []);

  const loadSkins = async () => {
    const [skinId, ownedStr] = await Promise.all([
      AsyncStorage.getItem(SKIN_KEY),
      AsyncStorage.getItem(OWNED_SKINS_KEY),
    ]);
    if (ownedStr) {
      const owned = JSON.parse(ownedStr);
      setOwnedSkinIds(owned);
      if (skinId) {
        const skin = TILE_SKINS.find(s => s.id === skinId);
        if (skin && owned.includes(skin.id)) setSelectedSkin(skin);
      }
    }
  };

  const selectSkin = useCallback(async (skinId: string) => {
    const skin = TILE_SKINS.find(s => s.id === skinId);
    if (!skin) return;
    await AsyncStorage.setItem(SKIN_KEY, skinId);
    setSelectedSkin(skin);
  }, []);

  const purchaseSkin = useCallback(async (skinId: string): Promise<boolean> => {
    try {
      const owned = [...ownedSkinIds, skinId];
      await AsyncStorage.setItem(OWNED_SKINS_KEY, JSON.stringify(owned));
      setOwnedSkinIds(owned);
      await selectSkin(skinId);
      return true;
    } catch (e) {
      return false;
    }
  }, [ownedSkinIds, selectSkin]);

  const isSkinOwned = useCallback((skinId: string) => {
    return ownedSkinIds.includes(skinId);
  }, [ownedSkinIds]);

  return { selectedSkin, ownedSkinIds, selectSkin, purchaseSkin, isSkinOwned, allSkins: TILE_SKINS };
}
