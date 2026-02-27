import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Team } from '@/lib/game/types';
import { CardComponent } from './CardComponent';

interface OpponentHandProps {
  cardCount: number;
  name: string;
  isCurrentPlayer: boolean;
  position: 'top' | 'left' | 'right';
  team?: Team;
}

export function OpponentHand({ cardCount, name, isCurrentPlayer, position, team }: OpponentHandProps) {
  const isVertical = position === 'left' || position === 'right';
  const cards = Array.from({ length: cardCount }, (_, i) => i);

  return (
    <View style={[styles.container, isVertical ? styles.vertical : styles.horizontal]}>
      {/* Player name badge */}
      <View style={[styles.nameBadge, team === 'black' && styles.blackTeamBadge, team === 'red' && styles.redTeamBadge, isCurrentPlayer && styles.activeBadge]}>
        {isCurrentPlayer && <View style={styles.turnDot} />}
        <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
        <Text style={styles.cardCount}>{cardCount}</Text>
      </View>

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
    backgroundColor: 'rgba(254,249,239,0.88)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FFCB77',
  },
  activeBadge: {
    borderColor: '#17C3B2',
    shadowColor: '#17C3B2',
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  blackTeamBadge: {
    backgroundColor: 'rgba(34,124,157,0.22)',
    borderColor: '#227C9D',
  },
  redTeamBadge: {
    backgroundColor: 'rgba(254,109,115,0.22)',
    borderColor: '#FE6D73',
  },

  blackTeamBadge: {
    backgroundColor: 'rgba(40,40,40,0.65)',
    borderColor: '#6F6F6F',
  },
  redTeamBadge: {
    backgroundColor: 'rgba(183,28,28,0.45)',
    borderColor: '#E57373',
  },
  turnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#17C3B2',
  },
  nameText: {
    color: '#4A2F1B',
    fontSize: 11,
    fontWeight: '700',
    maxWidth: 80,
  },
  cardCount: {
    color: '#227C9D',
    fontSize: 10,
    fontWeight: '800',
  },
});
