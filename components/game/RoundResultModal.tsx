import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { RoundResult } from '@/lib/game/types';

interface RoundResultModalProps {
  visible: boolean;
  result: RoundResult | null;
  matchScore: { us: number; them: number };
  winThreshold: number;
  onNextRound: () => void;
}

export function RoundResultModal({
  visible,
  result,
  matchScore,
  winThreshold,
  onNextRound,
}: RoundResultModalProps) {
  if (!result) return null;

  const usWon = result.pointsEarned.us > 0;
  const themWon = result.pointsEarned.them > 0;
  const usAllTricks = result.teamTricks.us === 9;
  const themAllTricks = result.teamTricks.them === 9;

  let resultTitle = 'Ничья';
  let resultColor = '#A8C5A0';
  let pointsText = '';

  if (usWon) {
    resultTitle = usAllTricks ? '🏆 Все взятки!' : '✅ Победа в раунде!';
    resultColor = '#4CAF50';
    pointsText = `+${result.pointsEarned.us} очко${result.pointsEarned.us === 2 ? '!' : ''}`;
  } else if (themWon) {
    resultTitle = themAllTricks ? '😔 Противник взял всё' : '❌ Раунд проигран';
    resultColor = '#E53935';
    pointsText = `Они получают +${result.pointsEarned.them}`;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Раунд завершён</Text>

          <Text style={[styles.resultTitle, { color: resultColor }]}>
            {resultTitle}
          </Text>

          {/* Trick counts */}
          <View style={styles.tricksRow}>
            <View style={styles.trickBlock}>
              <Text style={styles.trickLabel}>МЫ</Text>
              <Text style={styles.trickCount}>{result.teamTricks.us}</Text>
              <Text style={styles.trickSub}>взяток</Text>
            </View>
            <Text style={styles.trickSep}>vs</Text>
            <View style={styles.trickBlock}>
              <Text style={styles.trickLabel}>ОНИ</Text>
              <Text style={styles.trickCount}>{result.teamTricks.them}</Text>
              <Text style={styles.trickSub}>взяток</Text>
            </View>
          </View>

          {/* Points */}
          {pointsText ? (
            <Text style={[styles.pointsText, { color: resultColor }]}>{pointsText}</Text>
          ) : null}

          {/* Match score */}
          <View style={styles.matchScore}>
            <Text style={styles.matchScoreLabel}>Счёт матча</Text>
            <Text style={styles.matchScoreValue}>
              {matchScore.us} : {matchScore.them}
            </Text>
            <Text style={styles.matchScoreSub}>до {winThreshold} очков</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
            onPress={onNextRound}
          >
            <Text style={styles.buttonText}>Следующий раунд →</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#1A5C32',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5C842',
    gap: 16,
  },
  title: {
    color: '#A8C5A0',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  tricksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  trickBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  trickLabel: {
    color: '#A8C5A0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  trickCount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  trickSub: {
    color: '#A8C5A0',
    fontSize: 10,
  },
  trickSep: {
    color: '#A8C5A0',
    fontSize: 16,
    fontWeight: '600',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '700',
  },
  matchScore: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  matchScoreLabel: {
    color: '#A8C5A0',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  matchScoreValue: {
    color: '#F5C842',
    fontSize: 32,
    fontWeight: '800',
  },
  matchScoreSub: {
    color: '#A8C5A0',
    fontSize: 10,
  },
  button: {
    backgroundColor: '#F5C842',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#0A3D1F',
    fontSize: 16,
    fontWeight: '800',
  },
});
