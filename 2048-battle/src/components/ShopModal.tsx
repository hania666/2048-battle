import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  energy: number;
  maxEnergy: number;
  onClose: () => void;
  onWatchAd: () => void;
  onBuy: (product: string) => void;
  adLoaded: boolean;
}

export function ShopModal({ visible, energy, maxEnergy, onClose, onWatchAd, onBuy, adLoaded }: Props) {
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
            {/* Бесплатно */}
            <Text style={styles.sectionTitle}>FREE</Text>

            <TouchableOpacity
              onPress={onWatchAd}
              style={[styles.item, !adLoaded && styles.itemDisabled]}
              disabled={!adLoaded}
            >
              <View style={styles.itemLeft}>
                <Text style={styles.itemIcon}>📺</Text>
                <View>
                  <Text style={styles.itemTitle}>Watch Ad</Text>
                  <Text style={styles.itemSub}>30 second video</Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemReward}>+2 ⚡</Text>
                <Text style={styles.itemPrice}>FREE</Text>
              </View>
            </TouchableOpacity>

            {/* Платно */}
            <Text style={styles.sectionTitle}>PURCHASE</Text>

            <TouchableOpacity
              onPress={() => onBuy('energy_10')}
              style={styles.item}
            >
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

            <TouchableOpacity
              onPress={() => onBuy('energy_25')}
              style={styles.item}
            >
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

            <TouchableOpacity
              onPress={() => onBuy('energy_unlimited')}
              style={[styles.item, styles.itemFeatured]}
            >
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

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Purchases help support development 🙏
              </Text>
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
    backgroundColor: '#faf8ef', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, maxHeight: '85%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '900', color: '#776e65', letterSpacing: 1 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#e0d6cc', alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 16, fontWeight: '900', color: '#776e65' },
  currentEnergy: { fontSize: 14, color: '#bbada0', marginBottom: 20, fontWeight: '600' },
  sectionTitle: {
    fontSize: 11, fontWeight: '800', color: '#bbada0',
    letterSpacing: 2, marginBottom: 8, marginTop: 8,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 8, borderWidth: 2, borderColor: 'transparent',
  },
  itemFeatured: { borderColor: '#f65e3b', backgroundColor: '#fff8f6' },
  itemDisabled: { opacity: 0.5 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemIcon: { fontSize: 28 },
  itemTitle: { fontSize: 15, fontWeight: '800', color: '#776e65', marginBottom: 2 },
  itemSub: { fontSize: 12, color: '#bbada0' },
  itemRight: { alignItems: 'flex-end' },
  itemReward: { fontSize: 16, fontWeight: '900', color: '#f65e3b', marginBottom: 2 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: '#776e65' },
  footer: { paddingVertical: 16, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#bbada0', textAlign: 'center' },
});
