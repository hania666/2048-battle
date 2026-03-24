import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Board } from '../game/logic';
import { Tile } from './Tile';

interface Props {
  board: Board;
  size?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const DEFAULT_SIZE = Math.floor((SCREEN_WIDTH - 48) / 4) - 8;

export function GameBoard({ board, size = DEFAULT_SIZE }: Props) {
  const boardSize = (size + 8) * 4 + 8;
  return (
    <View style={[styles.board, { width: boardSize, height: boardSize, borderRadius: 8 }]}>
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
    backgroundColor: '#bbada0',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
  },
});
