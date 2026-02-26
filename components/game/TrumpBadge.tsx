import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Suit } from '@/lib/game/types';
import { SUIT_SYMBOLS, SUIT_NAMES_RU } from '@/lib/game/deck';

interface TrumpBadgeProps {
  suit: Suit | null;
}

const SUIT_COLORS: Record<Suit, string> = {
  spades: '#1A1A1A',
  clubs: '#1A1A1A',
  hearts: '#E53935',
  diamonds: '#E53935',
};

export function TrumpBadge({ suit }: TrumpBadgeProps) {
  if (!suit) return null;

  const symbol = SUIT_SYMBOLS[suit];
  const name = SUIT_NAMES_RU[suit];
  const color = SUIT_COLORS[suit];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>КОЗЫРЬ</Text>
      <View style={[styles.circle, { borderColor: '#F5C842' }]}>
        <Text style={[styles.symbol, { color }]}>{symbol}</Text>
      </View>
      <Text style={styles.suitName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F5C842',
  },
  label: {
    color: '#F5C842',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  symbol: {
    fontSize: 26,
    fontWeight: '700',
  },
  suitName: {
    color: '#FFFFFF',
    fontSize: 9,
    marginTop: 2,
    fontWeight: '600',
  },
});
