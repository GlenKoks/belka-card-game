import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreBarProps {
  blackScore: number;
  redScore: number;
  winThreshold: number;
  round: number;
  blackTeamPlayers?: string[];
  redTeamPlayers?: string[];
}

export function ScoreBar({
  blackScore,
  redScore,
  winThreshold,
  round,
  blackTeamPlayers = [],
  redTeamPlayers = [],
}: ScoreBarProps) {
  return (
    <View style={styles.container}>
      {/* Black Team */}
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

      {/* Center */}
      <View style={styles.center}>
        <Text style={styles.roundText}>Раунд {round}</Text>
        <Text style={styles.threshold}>до {winThreshold} Глаз</Text>
      </View>

      {/* Red Team */}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2E7D4F',
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
    maxWidth: 80,
  },
  eye: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  blackEye: {
    backgroundColor: '#2a2a2a',
    borderColor: '#555555',
  },
  redEye: {
    backgroundColor: '#FF5252',
    borderColor: '#E53935',
  },
  emptyEye: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333333',
  },
  teamLabel: {
    color: '#A8C5A0',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  roundText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  threshold: {
    color: '#A8C5A0',
    fontSize: 9,
  },
});
