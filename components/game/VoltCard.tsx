import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/lib/game/types';
import { RANK_DISPLAY, SUIT_SYMBOLS } from '@/lib/game/deck';

interface VoltCardProps {
  card: Card | null;
}

const SUIT_COLORS: Record<string, string> = {
  spades: '#1A1A1A',
  clubs: '#1A1A1A',
  hearts: '#E53935',
  diamonds: '#E53935',
};

export function VoltCard({ card }: VoltCardProps) {
  if (!card) return null;

  const color = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];
  const rank = RANK_DISPLAY[card.rank];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ВОЛЬТ</Text>
      <View style={styles.card}>
        <Text style={[styles.rank, { color }]}>{rank}</Text>
        <Text style={[styles.suit, { color }]}>{symbol}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    color: '#F5C842',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    width: 36,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5C842',
    shadowColor: '#F5C842',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  rank: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
  },
  suit: {
    fontSize: 18,
    lineHeight: 20,
  },
});
