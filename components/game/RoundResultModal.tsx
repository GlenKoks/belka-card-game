import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { RoundResult } from '@/lib/game/types';

interface RoundResultModalProps {
  visible: boolean;
  result: RoundResult;
  matchScore: { black: number; red: number };
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
  const blackWon = result.eyesEarned.black > result.eyesEarned.red;
  const redWon = result.eyesEarned.red > result.eyesEarned.black;
  const isEggs = result.wasEggs;

  let resultTitle = 'Ничья';
  let resultColor = '#227C9D';
  let eyesText = '';

  if (isEggs) {
    resultTitle = '🥚 Яйца!';
    resultColor = '#17C3B2';
  } else if (blackWon) {
    resultTitle = '✅ Чёрные победили!';
    resultColor = '#227C9D';
    eyesText = `+${result.eyesEarned.black} глаз`;
  } else if (redWon) {
    resultTitle = '✅ Красные победили!';
    resultColor = '#FE6D73';
    eyesText = `+${result.eyesEarned.red} глаз`;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Раунд завершён</Text>

          <Text style={[styles.resultTitle, { color: resultColor }]}>
            {resultTitle}
          </Text>

          <View style={styles.pointsRow}>
            <View style={styles.pointBlock}>
              <Text style={styles.pointLabel}>Баллы</Text>
              <Text style={styles.pointValue}>{result.cardPoints.black}</Text>
              <Text style={styles.pointSub}>Чёрные</Text>
            </View>
            <Text style={styles.pointSep}>vs</Text>
            <View style={styles.pointBlock}>
              <Text style={styles.pointLabel}>Баллы</Text>
              <Text style={styles.pointValue}>{result.cardPoints.red}</Text>
              <Text style={styles.pointSub}>Красные</Text>
            </View>
          </View>

          <View style={styles.tricksRow}>
            <View style={styles.trickBlock}>
              <Text style={styles.trickLabel}>Взятки</Text>
              <Text style={styles.trickCount}>{result.teamTricks.black}</Text>
            </View>
            <Text style={styles.trickSep}>vs</Text>
            <View style={styles.trickBlock}>
              <Text style={styles.trickLabel}>Взятки</Text>
              <Text style={styles.trickCount}>{result.teamTricks.red}</Text>
            </View>
          </View>

          {eyesText ? (
            <Text style={[styles.eyesText, { color: resultColor }]}>{eyesText}</Text>
          ) : null}

          <View style={styles.matchScore}>
            <Text style={styles.matchScoreLabel}>Счёт матча</Text>
            <View style={styles.matchScoreRow}>
              <View style={styles.teamScore}>
                <Text style={styles.teamScoreLabel}>Чёрные</Text>
                <Text style={styles.matchScoreValue}>{matchScore.black}</Text>
              </View>
              <Text style={styles.matchScoreSep}>:</Text>
              <View style={styles.teamScore}>
                <Text style={styles.teamScoreLabel}>Красные</Text>
                <Text style={styles.matchScoreValue}>{matchScore.red}</Text>
              </View>
            </View>
            <Text style={styles.matchScoreSub}>до {winThreshold} глаз</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
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
    backgroundColor: 'rgba(34, 24, 16, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FEF9EF',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#FFCB77',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#227C9D',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FFCB77',
  },
  pointBlock: {
    alignItems: 'center',
    flex: 1,
  },
  pointLabel: {
    fontSize: 11,
    color: '#8B6748',
    fontWeight: '700',
    marginBottom: 4,
  },
  pointValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#227C9D',
  },
  pointSub: {
    fontSize: 10,
    color: '#8B6748',
    marginTop: 2,
  },
  pointSep: {
    fontSize: 14,
    color: '#17C3B2',
    marginHorizontal: 8,
    fontWeight: '700',
  },
  tricksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FFCB77',
  },
  trickBlock: {
    alignItems: 'center',
    flex: 1,
  },
  trickLabel: {
    fontSize: 11,
    color: '#8B6748',
    fontWeight: '700',
    marginBottom: 4,
  },
  trickCount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#227C9D',
  },
  trickSep: {
    fontSize: 14,
    color: '#17C3B2',
    marginHorizontal: 8,
    fontWeight: '700',
  },
  eyesText: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  matchScore: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCB77',
    padding: 12,
    marginBottom: 16,
  },
  matchScoreLabel: {
    fontSize: 11,
    color: '#8B6748',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  matchScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamScoreLabel: {
    fontSize: 10,
    color: '#8B6748',
    marginBottom: 4,
  },
  matchScoreValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#227C9D',
  },
  matchScoreSep: {
    fontSize: 16,
    color: '#17C3B2',
    marginHorizontal: 8,
    fontWeight: '700',
  },
  matchScoreSub: {
    fontSize: 10,
    color: '#8B6748',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#17C3B2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  buttonText: {
    color: '#FEF9EF',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});
