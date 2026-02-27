import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card, Suit } from '@/lib/game/types';
import { RANK_DISPLAY, SUIT_SYMBOLS } from '@/lib/game/deck';

interface CardComponentProps {
  card?: Card;
  faceDown?: boolean;
  highlighted?: boolean;
  selected?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: object;
}

const SUIT_COLORS: Record<Suit, string> = {
  spades: '#1A1A1A',
  clubs: '#1A1A1A',
  hearts: '#E53935',
  diamonds: '#E53935',
};

export function CardComponent({
  card,
  faceDown = false,
  highlighted = false,
  selected = false,
  onPress,
  size = 'medium',
  style,
}: CardComponentProps) {
  const dims = SIZE_DIMS[size];

  if (faceDown || !card) {
    return (
      <View
        style={[
          styles.card,
          dims,
          styles.faceDown,
          style,
        ]}
      />
    );
  }

  const suitColor = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];
  const rankLabel = RANK_DISPLAY[card.rank];

  const cardContent = (
    <View
      style={[
        styles.card,
        dims,
        styles.faceUp,
        highlighted && styles.highlighted,
        selected && styles.selected,
        style,
      ]}
    >
      {/* Top-left rank + suit */}
      <View style={styles.cornerTop}>
        <Text style={[styles.rankText, { color: suitColor }, dims.rankStyle]}>
          {rankLabel}
        </Text>
        <Text style={[styles.suitSmall, { color: suitColor }, dims.suitSmallStyle]}>
          {symbol}
        </Text>
      </View>

      {/* Center suit symbol */}
      <Text style={[styles.suitCenter, { color: suitColor }, dims.suitCenterStyle]}>
        {symbol}
      </Text>

      {/* Bottom-right rank + suit (rotated) */}
      <View style={[styles.cornerBottom]}>
        <Text style={[styles.rankText, { color: suitColor }, dims.rankStyle]}>
          {rankLabel}
        </Text>
        <Text style={[styles.suitSmall, { color: suitColor }, dims.suitSmallStyle]}>
          {symbol}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          { transform: [{ translateY: selected ? -8 : pressed ? -4 : 0 }] },
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
}

const SIZE_DIMS = {
  small: {
    width: 44,
    height: 64,
    borderRadius: 5,
    rankStyle: { fontSize: 10 },
    suitSmallStyle: { fontSize: 8 },
    suitCenterStyle: { fontSize: 18 },
  },
  medium: {
    width: 58,
    height: 86,
    borderRadius: 7,
    rankStyle: { fontSize: 13 },
    suitSmallStyle: { fontSize: 10 },
    suitCenterStyle: { fontSize: 26 },
  },
  large: {
    width: 70,
    height: 104,
    borderRadius: 8,
    rankStyle: { fontSize: 15 },
    suitSmallStyle: { fontSize: 12 },
    suitCenterStyle: { fontSize: 32 },
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 5,
    paddingBottom: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  faceUp: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  faceDown: {
    backgroundColor: '#1A5C32',
    borderWidth: 2,
    borderColor: '#F5C842',
    borderRadius: 7,
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#F5C842',
    shadowColor: '#F5C842',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#F5C842',
  },
  cornerTop: {
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  cornerBottom: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  rankText: {
    fontWeight: '700',
    includeFontPadding: false,
  },
  suitSmall: {
    includeFontPadding: false,
  },
  suitCenter: {
    fontWeight: '400',
  },
});
