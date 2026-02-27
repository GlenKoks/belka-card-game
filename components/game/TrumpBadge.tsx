import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Suit } from '@/lib/game/types';
import { SUIT_SYMBOLS, SUIT_NAMES_RU } from '@/lib/game/deck';

interface TrumpBadgeProps {
  suit: Suit | null;
}

const SUIT_COLORS: Record<Suit, string> = {
  spades: '#227C9D',
  clubs: '#227C9D',
  hearts: '#FE6D73',
  diamonds: '#FE6D73',
};

export function TrumpBadge({ suit }: TrumpBadgeProps) {
  if (!suit) return null;

  const symbol = SUIT_SYMBOLS[suit];
  const name = SUIT_NAMES_RU[suit];
  const color = SUIT_COLORS[suit];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>КОЗЫРЬ</Text>
      <View style={styles.circle}>
        <Text style={[styles.symbol, { color }]}>{symbol}</Text>
      </View>
      <Text style={styles.suitName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(254,249,239,0.96)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFCB77',
  },
  label: {
    color: '#227C9D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#17C3B2',
  },
  symbol: {
    fontSize: 24,
    fontWeight: '700',
  },
  suitName: {
    color: '#227C9D',
    fontSize: 9,
    marginTop: 2,
    fontWeight: '700',
  },
});
