import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { theme } from '../utils/theme';

interface Props {
  value: number;
  size: number;
}

function getFontSize(value: number, size: number): number {
  if (value >= 1024) return size * 0.28;
  if (value >= 128) return size * 0.33;
  if (value >= 16) return size * 0.38;
  return size * 0.42;
}

export function Tile({ value, size }: Props) {
  const scaleAnim = useRef(new Animated.Value(value ? 0.7 : 1)).current;

  useEffect(() => {
    if (value) {
      Animated.spring(scaleAnim, {
        toValue: 1, friction: 4, tension: 300, useNativeDriver: true,
      }).start();
    }
  }, [value]);

  const colors = (theme.tiles as any)[value] || { bg: '#2D1B69', text: '#C4B5FD' };
  const isSpecial = value >= 128;

  return (
    <Animated.View style={[
      styles.tile,
      {
        width: size, height: size, borderRadius: size * 0.12,
        backgroundColor: colors.bg,
        transform: [{ scale: scaleAnim }],
        borderWidth: isSpecial ? 1 : 0,
        borderColor: isSpecial ? colors.text + '40' : 'transparent',
        shadowColor: isSpecial ? colors.text : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isSpecial ? 0.6 : 0,
        shadowRadius: isSpecial ? 8 : 0,
        elevation: isSpecial ? 8 : 0,
      },
    ]}>
      {value > 0 && (
        <Text style={[
          styles.text,
          {
            color: colors.text,
            fontSize: getFontSize(value, size),
            textShadowColor: colors.text + '80',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isSpecial ? 8 : 0,
          },
        ]}>
          {value}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', margin: 4 },
  text: { fontWeight: '900' },
});
