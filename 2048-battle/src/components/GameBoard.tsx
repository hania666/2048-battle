import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Board } from '../game/logic';
import { Tile } from './Tile';
import { theme } from '../utils/theme';

interface Props {
  board: Board;
  size?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DEFAULT_SIZE = Math.floor((SCREEN_WIDTH - 48) / 4) - 8;

export function GameBoard({ board, size = DEFAULT_SIZE }: Props) {
  const boardSize = (size + 8) * 4 + 8;
  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, borderRadius: 16 }]}>
      {board.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((value, c) => (
            <Tile key={`${r}-${c}-${value}`} value={value} size={size} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#0A0A14',
    padding: 4,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  row: { flexDirection: 'row' },
});
