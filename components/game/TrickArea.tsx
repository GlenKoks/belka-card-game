import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trick, PlayerId } from '@/lib/game/types';
import { CardComponent } from './CardComponent';

interface TrickAreaProps {
  trick: Trick;
  playerNames: Record<PlayerId, string>;
  trumpSuit: string | null;
  phase: string;
}

// Position of each player's card in the trick area
// 0=bottom, 1=left, 2=top, 3=right
const POSITIONS = {
  0: { bottom: 4, left: '50%', marginLeft: -29 },    // bottom center
  1: { top: '50%', marginTop: -43, left: 4 },         // left center
  2: { top: 4, left: '50%', marginLeft: -29 },        // top center
  3: { top: '50%', marginTop: -43, right: 4 },        // right center
};

export function TrickArea({ trick, playerNames, phase }: TrickAreaProps) {
  const isResolved = trick.winnerId !== null;

  return (
    <View style={styles.container}>
      {/* Felt circle */}
      <View style={styles.feltCircle} />

      {/* Played cards */}
      {trick.cards.map(({ card, playerId }) => {
        const isWinner = isResolved && trick.winnerId === playerId;
        return (
          <View
            key={card.id}
            style={[styles.cardSlot, POSITIONS[playerId] as object]}
          >
            <CardComponent
              card={card}
              size="medium"
              highlighted={isWinner}
            />
            <Text style={styles.playerLabel} numberOfLines={1}>
              {playerId === 0 ? 'Вы' : playerNames[playerId]}
            </Text>
          </View>
        );
      })}

      {/* Empty slots hint */}
      {trick.cards.length === 0 && (
        <Text style={styles.emptyHint}>Ваш ход</Text>
      )}

      {/* Winner announcement */}
      {isResolved && trick.winnerId !== null && (
        <View style={styles.winnerBadge}>
          <Text style={styles.winnerText}>
            {trick.winnerId === 0 ? 'Вы взяли!' : `${playerNames[trick.winnerId]} взял`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feltCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: '#2E7D4F',
  },
  cardSlot: {
    position: 'absolute',
    alignItems: 'center',
  },
  playerLabel: {
    color: '#A8C5A0',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
    maxWidth: 58,
  },
  emptyHint: {
    color: '#A8C5A0',
    fontSize: 13,
    fontStyle: 'italic',
  },
  winnerBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(245, 200, 66, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  winnerText: {
    color: '#0A3D1F',
    fontWeight: '700',
    fontSize: 12,
  },
});
