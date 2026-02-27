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

const POSITIONS = {
  0: { bottom: 4, left: '50%', marginLeft: -29 },
  1: { top: '50%', marginTop: -43, left: 4 },
  2: { top: 4, left: '50%', marginLeft: -29 },
  3: { top: '50%', marginTop: -43, right: 4 },
};

export function TrickArea({ trick, playerNames }: TrickAreaProps) {
  const isResolved = trick.winnerId !== null;

  return (
    <View style={styles.container}>
      <View style={styles.tableCircleOuter}>
        <View style={styles.tableCircleInner} />
      </View>

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

      {trick.cards.length === 0 && (
        <Text style={styles.emptyHint}>Ваш ход</Text>
      )}

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
    width: 228,
    height: 228,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCircleOuter: {
    position: 'absolute',
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: '#C98A57',
    borderWidth: 2,
    borderColor: '#8D5A34',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCircleInner: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#DDAA78',
    borderWidth: 1,
    borderColor: '#B57A4B',
  },
  cardSlot: {
    position: 'absolute',
    alignItems: 'center',
  },
  playerLabel: {
    color: '#5B3A24',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
    maxWidth: 58,
    fontWeight: '700',
  },
  emptyHint: {
    color: '#227C9D',
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  winnerBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,203,119,0.96)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FE6D73',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  winnerText: {
    color: '#8D3E45',
    fontWeight: '800',
    fontSize: 12,
  },
});
