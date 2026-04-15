import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TILE_SKINS, TileSkin } from '../utils/tileSkins';
import { useLanguage } from '../i18n/useLanguage';
import { theme } from '../utils/theme';

interface Props {
  selectedSkinId: string;
  ownedSkinIds: string[];
  onSelect: (skinId: string) => void;
  onPurchase: (skinId: string) => void;
  onBack: () => void;
  isVip: boolean;
}

function SkinPreview({ skin }: { skin: TileSkin }) {
  const previewNums = [2, 8, 64, 512];
  return (
    <View style={styles.preview}>
      {previewNums.map(num => {
        const colors = skin.tiles[num] || { bg: '#CDC1B4', text: '#776E65' };
        return (
          <View key={num} style={[styles.previewTile, { backgroundColor: colors.bg }]}>
            <Text style={[styles.previewNum, { color: colors.text }]}>{num}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function SkinsScreen({ selectedSkinId, ownedSkinIds, onSelect, onPurchase, onBack, isVip }: Props) {
  const { t } = useLanguage();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('tileSkins')}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={TILE_SKINS}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const owned = ownedSkinIds.includes(item.id);
          const selected = selectedSkinId === item.id;
          const canUse = owned || (item.vipOnly && isVip);

          return (
            <TouchableOpacity
              style={[styles.skinCard, selected && styles.skinCardSelected]}
              onPress={() => canUse ? onSelect(item.id) : onPurchase(item.id)}
            >
              <SkinPreview skin={item} />
              <Text style={styles.skinName}>{item.name}</Text>
              {selected && <Text style={styles.selectedBadge}>ACTIVE</Text>}
              {!owned && !item.vipOnly && (
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>${item.price}</Text>
                </View>
              )}
              {item.vipOnly && !isVip && (
                <View style={[styles.priceBadge, styles.vipBadge]}>
                  <Text style={styles.priceText}>VIP</Text>
                </View>
              )}
              {owned && !selected && (
                <Text style={styles.ownedBadge}>OWNED</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: theme.colors.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: theme.colors.border,
  },
  backBtnText: { fontSize: 20, fontWeight: '900', color: theme.colors.text },
  title: { fontSize: 18, fontWeight: '900', color: theme.colors.text, letterSpacing: 2 },
  placeholder: { width: 40 },
  list: { paddingHorizontal: 12, paddingBottom: 40 },
  skinCard: {
    flex: 1, margin: 8, backgroundColor: theme.colors.bgCard,
    borderRadius: 16, padding: 12, alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  skinCardSelected: { borderColor: theme.colors.accent1 },
  preview: { flexDirection: 'row', flexWrap: 'wrap', width: 88, marginBottom: 8 },
  previewTile: {
    width: 40, height: 40, margin: 2, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  previewNum: { fontSize: 12, fontWeight: '900' },
  skinName: { fontSize: 14, fontWeight: '800', color: theme.colors.text, marginBottom: 4 },
  selectedBadge: {
    fontSize: 10, fontWeight: '900', color: theme.colors.accent1,
    letterSpacing: 1, backgroundColor: theme.colors.bgCard2,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  ownedBadge: {
    fontSize: 10, fontWeight: '700', color: theme.colors.success,
    letterSpacing: 1,
  },
  priceBadge: {
    backgroundColor: theme.colors.accent1, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  vipBadge: { backgroundColor: theme.colors.warning },
  priceText: { fontSize: 12, fontWeight: '900', color: '#fff' },
});
