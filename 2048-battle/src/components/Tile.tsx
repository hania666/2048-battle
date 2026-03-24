import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface Props {
  value: number;
  size: number;
}

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  0:    { bg: '#cdc1b4', text: '#776e65' },
  2:    { bg: '#eee4da', text: '#776e65' },
  4:    { bg: '#ede0c8', text: '#776e65' },
  8:    { bg: '#f2b179', text: '#f9f6f2' },
  16:   { bg: '#f59563', text: '#f9f6f2' },
  32:   { bg: '#f67c5f', text: '#f9f6f2' },
  64:   { bg: '#f65e3b', text: '#f9f6f2' },
  128:  { bg: '#edcf72', text: '#f9f6f2' },
  256:  { bg: '#edcc61', text: '#f9f6f2' },
  512:  { bg: '#edc850', text: '#f9f6f2' },
  1024: { bg: '#9945FF', text: '#f9f6f2' },
  2048: { bg: '#14F195', text: '#f9f6f2' },
};

function getFontSize(value: number, size: number): number {
  if (value >= 1024) return size * 0.28;
  if (value >= 128) return size * 0.33;
  if (value >= 16) return size * 0.38;
  return size * 0.42;
}

export function Tile({ value, size }: Props) {
  const scaleAnim = useRef(new Animated.Value(value ? 0.8 : 1)).current;

  useEffect(() => {
    if (value) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [value]);

  const colors = TILE_COLORS[value] || { bg: '#3c3a32', text: '#f9f6f2' };

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size * 0.1,
          backgroundColor: colors.bg,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {value > 0 && (
        <Text style={[styles.text, { color: colors.text, fontSize: getFontSize(value, size) }]}>
          {value}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  text: {
    fontWeight: '900',
  },
});
