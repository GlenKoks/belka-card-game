import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardComponent } from './CardComponent';

interface OpponentHandProps {
  cardCount: number;
  name: string;
  isCurrentPlayer: boolean;
  position: 'top' | 'left' | 'right';
}

export function OpponentHand({ cardCount, name, isCurrentPlayer, position }: OpponentHandProps) {
  const isVertical = position === 'left' || position === 'right';

  const cards = Array.from({ length: cardCount }, (_, i) => i);

  return (
    <View style={[styles.container, isVertical ? styles.vertical : styles.horizontal]}>
      {/* Player name badge */}
      <View style={[styles.nameBadge, isCurrentPlayer && styles.activeBadge]}>
        {isCurrentPlayer && <View style={styles.turnDot} />}
        <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardCount}>{cardCount}</Text>
      </View>

      {/* Face-down cards */}
      <View style={[styles.cardsRow, isVertical && styles.cardsColumn]}>
        {cards.map((i) => (
          <View
            key={i}
            style={[
              styles.cardOffset,
              isVertical
                ? { marginTop: i === 0 ? 0 : -54 }
                : { marginLeft: i === 0 ? 0 : -40 },
            ]}
          >
            <CardComponent
              faceDown
              size="small"
              style={isVertical ? styles.rotatedCard : undefined}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  horizontal: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardOffset: {},
  rotatedCard: {
    transform: [{ rotate: '90deg' }],
  },
  nameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeBadge: {
    borderColor: '#F5C842',
  },
  turnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5C842',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 80,
  },
  cardCount: {
    color: '#A8C5A0',
    fontSize: 10,
    fontWeight: '700',
  },
});
