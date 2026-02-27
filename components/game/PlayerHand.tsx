import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card } from '@/lib/game/types';
import { CardComponent } from './CardComponent';

interface PlayerHandProps {
  hand: Card[];
  validCards: Card[];
  onPlayCard: (card: Card) => void;
  isMyTurn: boolean;
}

export function PlayerHand({ hand, validCards, onPlayCard, isMyTurn }: PlayerHandProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const validIds = new Set(validCards.map(c => c.id));

  const handlePress = (card: Card) => {
    if (!isMyTurn) return;
    if (!validIds.has(card.id)) return;

    if (selectedId === card.id) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPlayCard(card);
      setSelectedId(null);
    } else {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setSelectedId(card.id);
    }
  };

  return (
    <View style={styles.container}>
      {isMyTurn && (
        <Text style={styles.turnHint}>
          {selectedId ? 'Нажмите ещё раз, чтобы сыграть' : 'Ваш ход — выберите карту'}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hand.map((card) => {
          const isValid = validIds.has(card.id);
          const isSelected = selectedId === card.id;
          const isDisabled = isMyTurn && !isValid;

          return (
            <View
              key={card.id}
              style={[
                styles.cardWrapper,
                isDisabled && styles.dimmed,
              ]}
            >
              <CardComponent
                card={card}
                highlighted={isMyTurn && isValid && !isSelected}
                selected={isSelected}
                onPress={() => handlePress(card)}
                size="medium"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 8,
  },
  turnHint: {
    color: '#227C9D',
    backgroundColor: 'rgba(254,249,239,0.88)',
    borderWidth: 1,
    borderColor: '#FFCB77',
    borderRadius: 10,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '700',
    paddingVertical: 4,
    marginHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 6,
    alignItems: 'flex-end',
  },
  cardWrapper: {
    marginHorizontal: 2,
  },
  dimmed: {
    opacity: 0.45,
  },
});
