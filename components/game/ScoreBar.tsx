import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreBarProps {
  blackScore: number;
  redScore: number;
  winThreshold: number;
  round: number;
}

const THEME = {
  blue: '#227C9D',
  mint: '#17C3B2',
  amber: '#FFCB77',
  cream: '#FEF9EF',
  coral: '#FE6D73',
};

export function ScoreBar({
  blackScore,
  redScore,
  winThreshold,
  round,
}: ScoreBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.teamBlock}>
        <View style={styles.eyesContainer}>
          {Array.from({ length: blackScore }).map((_, i) => (
            <View key={i} style={[styles.eye, styles.blackEye]} />
          ))}
          {Array.from({ length: Math.max(0, winThreshold - blackScore) }).map((_, i) => (
            <View key={`empty-${i}`} style={[styles.eye, styles.emptyEye]} />
          ))}
        </View>
        <Text style={styles.teamLabel}>ЧЁРНЫЕ</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.roundText}>Раунд {round}</Text>
        <Text style={styles.threshold}>до {winThreshold} глаз</Text>
      </View>

      <View style={styles.teamBlock}>
        <View style={styles.eyesContainer}>
          {Array.from({ length: redScore }).map((_, i) => (
            <View key={i} style={[styles.eye, styles.redEye]} />
          ))}
          {Array.from({ length: Math.max(0, winThreshold - redScore) }).map((_, i) => (
            <View key={`empty-${i}`} style={[styles.eye, styles.emptyEye]} />
          ))}
        </View>
        <Text style={styles.teamLabel}>КРАСНЫЕ</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.cream,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 2,
    borderBottomColor: THEME.amber,
    gap: 8,
  },
  teamBlock: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  eyesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 3,
    maxWidth: 84,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  blackEye: {
    backgroundColor: THEME.blue,
    borderColor: '#1C6781',
  },
  redEye: {
    backgroundColor: THEME.coral,
    borderColor: '#E75C63',
  },
  emptyEye: {
    backgroundColor: '#F2E7D3',
    borderColor: '#DEC8A5',
  },
  teamLabel: {
    color: '#775238',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  roundText: {
    color: THEME.blue,
    fontSize: 12,
    fontWeight: '800',
  },
  threshold: {
    color: '#896243',
    fontSize: 9,
    fontWeight: '600',
  },
});
