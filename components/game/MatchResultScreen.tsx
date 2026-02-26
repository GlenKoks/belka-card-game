import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface MatchResultScreenProps {
  matchScore: { us: number; them: number };
  onNewGame: () => void;
}

export function MatchResultScreen({ matchScore, onNewGame }: MatchResultScreenProps) {
  const weWon = matchScore.us > matchScore.them;

  return (
    <View style={styles.container}>
      {/* Background pattern */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.content}>
        <Text style={styles.suitRow}>♠ ♥ ♦ ♣</Text>

        <Text style={[styles.resultEmoji]}>
          {weWon ? '🏆' : '😔'}
        </Text>

        <Text style={[styles.resultTitle, { color: weWon ? '#F5C842' : '#E53935' }]}>
          {weWon ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ'}
        </Text>

        <Text style={styles.subtitle}>
          {weWon
            ? 'Ваша команда выиграла матч!'
            : 'Противники выиграли этот матч'}
        </Text>

        {/* Final score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>ФИНАЛЬНЫЙ СЧЁТ</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreBlock}>
              <Text style={styles.teamName}>МЫ</Text>
              <Text style={[styles.scoreNum, weWon && styles.winnerScore]}>
                {matchScore.us}
              </Text>
            </View>
            <Text style={styles.scoreSep}>:</Text>
            <View style={styles.scoreBlock}>
              <Text style={styles.teamName}>ОНИ</Text>
              <Text style={[styles.scoreNum, !weWon && styles.winnerScore]}>
                {matchScore.them}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={onNewGame}
        >
          <Text style={styles.buttonText}>Новая игра</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A3D1F',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(245,200,66,0.06)',
    top: -80,
    right: -80,
  },
  decorCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(245,200,66,0.04)',
    bottom: -60,
    left: -60,
  },
  content: {
    alignItems: 'center',
    padding: 32,
    gap: 16,
    width: '100%',
    maxWidth: 380,
  },
  suitRow: {
    color: '#2E7D4F',
    fontSize: 24,
    letterSpacing: 8,
  },
  resultEmoji: {
    fontSize: 72,
  },
  resultTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: '#A8C5A0',
    fontSize: 15,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D4F',
    gap: 12,
    marginTop: 8,
  },
  scoreLabel: {
    color: '#A8C5A0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  scoreBlock: {
    alignItems: 'center',
    minWidth: 80,
  },
  teamName: {
    color: '#A8C5A0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreNum: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
  },
  winnerScore: {
    color: '#F5C842',
  },
  scoreSep: {
    color: '#A8C5A0',
    fontSize: 32,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#F5C842',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 16,
    marginTop: 8,
  },
  buttonText: {
    color: '#0A3D1F',
    fontSize: 18,
    fontWeight: '800',
  },
});
