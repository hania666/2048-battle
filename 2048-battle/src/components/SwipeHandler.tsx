import React, { useRef } from 'react';
import { PanResponder, View, StyleSheet } from 'react-native';
import { Direction } from '../game/logic';

interface Props {
  onSwipe: (direction: Direction) => void;
  children: React.ReactNode;
}

const SWIPE_THRESHOLD = 30;

export function SwipeHandler({ onSwipe, children }: Props) {
  const startX = useRef(0);
  const startY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        startX.current = e.nativeEvent.pageX;
        startY.current = e.nativeEvent.pageY;
      },
      onPanResponderRelease: (e) => {
        const dx = e.nativeEvent.pageX - startX.current;
        const dy = e.nativeEvent.pageY - startY.current;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;
        if (absDx > absDy) {
          onSwipe(dx > 0 ? 'right' : 'left');
        } else {
          onSwipe(dy > 0 ? 'down' : 'up');
        }
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
