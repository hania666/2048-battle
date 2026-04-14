import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal,
} from 'react-native';
import { theme } from '../utils/theme';

interface Props {
  visible: boolean;
  energy: number;
  maxEnergy: number;
  noAds: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onBuy: (product: string) => void;
  onRemoveAds: () => void;
  adLoaded: boolean;
}

export function ShopModal({ visible, energy, maxEnergy, noAds, onClose, onWatchAd, onBuy, onRemoveAds, adLoaded }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>⚡ ENERGY SHOP</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.currentEnergy}>
            Current: {energy}/{maxEnergy} ⚡
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>FREE</Text>

            <TouchableOpacity
              onPress={onWatchAd}
              style={[styles.item, (!adLoaded || noAds) && styles.itemDisabled]}
              disabled={!adLoaded || noAds}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.itemIcon}>📺</Text>
                <View>
                  <Text style={styles.itemTitle}>Watch Ad</Text>
                  <Text style={styles.itemSub}>{noAds ? 'Ads removed!' : '30 second video'}</Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemReward}>+2 ⚡</Text>
                <Text style={styles.itemPrice}>FREE</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>PURCHASE</Text>

            <TouchableOpacity onPress={() => onBuy('energy_10')} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemIcon}>⚡</Text>
                <View>
                  <Text style={styles.itemTitle}>Small Pack</Text>
                  <Text style={styles.itemSub}>10 energy instantly</Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemReward}>+10 ⚡</Text>
                <Text style={styles.itemPrice}>$0.99</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onBuy('energy_25')} style={styles.item}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemIcon}>⚡</Text>
                <View>
                  <Text style={styles.itemTitle}>Medium Pack</Text>
                  <Text style={styles.itemSub}>25 energy instantly</Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemReward}>+25 ⚡</Text>
                <Text style={styles.itemPrice}>$1.99</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onBuy('energy_unlimited')} style={[styles.item, styles.itemFeatured]}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemIcon}>🔥</Text>
                <View>
                  <Text style={styles.itemTitle}>Unlimited 24h</Text>
                  <Text style={styles.itemSub}>Play as much as you want</Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemReward}>∞ ⚡</Text>
                <Text style={styles.itemPrice}>$4.99</Text>
              </View>
            </TouchableOpacity>

            {!noAds && (
              <TouchableOpacity onPress={onRemoveAds} style={[styles.item, styles.itemNoAds]}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemIcon}>🚫</Text>
                  <View>
                    <Text style={styles.itemTitle}>Remove Ads</Text>
                    <Text style={styles.itemSub}>Forever, one-time purchase</Text>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemReward}>∞</Text>
                  <Text style={styles.itemPrice}>$1.99</Text>
                </View>
              </TouchableOpacity>
            )}

            {noAds && (
              <View style={[styles.item, styles.itemOwned]}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemIcon}>✅</Text>
                  <View>
                    <Text style={styles.itemTitle}>Ads Removed</Text>
                    <Text style={styles.itemSub}>Thank you for your support!</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Purchases help support development 🙏</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  card: {
    backgroundColor: theme.colors.bg, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, maxHeight: '85%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '900', color: theme.colors.text, letterSpacing: 1 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: theme.colors.bgCard2, alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 16, fontWeight: '900', color: theme.colors.text },
  currentEnergy: { fontSize: 14, color: theme.colors.text2, marginBottom: 20, fontWeight: '600' },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: theme.colors.text3,
    letterSpacing: 2, marginBottom: 8, marginTop: 8,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: theme.colors.bgCard, borderRadius: 14, padding: 14,
    marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
  },
  itemFeatured: { borderColor: theme.colors.accent1, backgroundColor: '#fff8f6' },
  itemNoAds: { borderColor: theme.colors.accent3, backgroundColor: '#fdf0f8' },
  itemOwned: { borderColor: theme.colors.success, backgroundColor: '#f0fff4' },
  itemDisabled: { opacity: 0.5 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIcon: { fontSize: 28 },
  itemTitle: { fontSize: 15, fontWeight: '800', color: theme.colors.text, marginBottom: 2 },
  itemSub: { fontSize: 12, color: theme.colors.text2 },
  itemRight: { alignItems: 'flex-end' },
  itemReward: { fontSize: 16, fontWeight: '900', color: theme.colors.accent1, marginBottom: 2 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: theme.colors.text },
  footer: { paddingVertical: 16, alignItems: 'center' },
  footerText: { fontSize: 12, color: theme.colors.text3, textAlign: 'center' },
});
