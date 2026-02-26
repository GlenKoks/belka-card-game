import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { RoundResult } from '@/lib/game/types';

interface RoundResultModalProps {
  visible: boolean;
  result: RoundResult | null;
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
  if (!result) return null;

  const blackWon = result.eyesEarned.black > 0;
  const redWon = result.eyesEarned.red > 0;
  const isEggs = result.wasEggs;

  let resultTitle = 'Яйца!';
  let resultColor = '#FFB800';
  let eyesText = '';

  if (isEggs) {
    resultTitle = '🥚 Яйца! Баллы не начислены';
    resultColor = '#FFB800';
    eyesText = 'В следующем раунде победитель получит 4 Глаза';
  } else if (blackWon) {
    resultTitle = '✅ Чёрные победили!';
    resultColor = '#1a1a1a';
    eyesText = `+${result.eyesEarned.black} Глаз`;
  } else if (redWon) {
    resultTitle = '✅ Красные победили!';
    resultColor = '#E53935';
    eyesText = `+${result.eyesEarned.red} Глаз`;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Раунд завершён</Text>

          <Text style={[styles.resultTitle, { color: resultColor }]}>
            {resultTitle}
          </Text>

          {/* Card Points */}
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

          {/* Trick counts */}
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

          {/* Eyes earned */}
          {eyesText ? (
            <Text style={[styles.eyesText, { color: resultColor }]}>{eyesText}</Text>
          ) : null}

          {/* Match score */}
          <View style={styles.matchScore}>
            <Text style={styles.matchScoreLabel}>Счёт матча (Глаза)</Text>
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
            <Text style={styles.matchScoreSub}>до {winThreshold} Глаз</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a2a1a',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#2E7D4F',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
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
    borderColor: '#2E7D4F',
  },
  pointBlock: {
    alignItems: 'center',
    flex: 1,
  },
  pointLabel: {
    fontSize: 11,
    color: '#A8C5A0',
    fontWeight: '600',
    marginBottom: 4,
  },
  pointValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F5C842',
  },
  pointSub: {
    fontSize: 10,
    color: '#A8C5A0',
    marginTop: 2,
  },
  pointSep: {
    fontSize: 14,
    color: '#A8C5A0',
    marginHorizontal: 8,
  },
  tricksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2E7D4F',
  },
  trickBlock: {
    alignItems: 'center',
    flex: 1,
  },
  trickLabel: {
    fontSize: 11,
    color: '#A8C5A0',
    fontWeight: '600',
    marginBottom: 4,
  },
  trickCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trickSep: {
    fontSize: 14,
    color: '#A8C5A0',
    marginHorizontal: 8,
  },
  eyesText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  matchScore: {
    backgroundColor: 'rgba(46, 125, 79, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  matchScoreLabel: {
    fontSize: 11,
    color: '#A8C5A0',
    fontWeight: '600',
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
    color: '#A8C5A0',
    marginBottom: 4,
  },
  matchScoreValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F5C842',
  },
  matchScoreSep: {
    fontSize: 16,
    color: '#A8C5A0',
    marginHorizontal: 8,
  },
  matchScoreSub: {
    fontSize: 10,
    color: '#A8C5A0',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2E7D4F',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
