import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreBarProps {
  usScore: number;
  themScore: number;
  winThreshold: number;
  round: number;
}

export function ScoreBar({ usScore, themScore, winThreshold, round }: ScoreBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.teamBlock}>
        <Text style={styles.teamLabel}>МЫ</Text>
        <Text style={styles.score}>{usScore}</Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.separator}>:</Text>
        <Text style={styles.roundText}>Раунд {round}</Text>
        <Text style={styles.threshold}>до {winThreshold}</Text>
      </View>

      <View style={styles.teamBlock}>
        <Text style={styles.teamLabel}>ОНИ</Text>
        <Text style={styles.score}>{themScore}</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2E7D4F',
  },
  teamBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  teamLabel: {
    color: '#A8C5A0',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  score: {
    color: '#F5C842',
    fontSize: 22,
    fontWeight: '800',
  },
  center: {
    alignItems: 'center',
  },
  separator: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
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
