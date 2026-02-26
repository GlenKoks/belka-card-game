import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { useGame } from '@/lib/game/GameContext';
import { ScreenContainer } from '@/components/screen-container';

export default function HomeScreen() {
  const { state, startGame } = useGame();
  const { matchScore, winThreshold, round, phase } = state;

  const hasActiveGame = phase !== 'WAITING' && phase !== 'MATCH_FINISHED';

  const handleNewGame = () => {
    startGame(winThreshold);
    router.push('/game');
  };

  const handleContinue = () => {
    router.push('/game');
  };

  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Suit row */}
          <Text style={styles.suitRow}>♠ ♥ ♦ ♣</Text>

          {/* Title */}
          <Text style={styles.title}>БЕЛКА</Text>
          <Text style={styles.subtitle}>Карточная игра</Text>
        </View>

        {/* Active game card */}
        {hasActiveGame && (
          <View style={styles.activeGameCard}>
            <Text style={styles.activeGameLabel}>АКТИВНАЯ ИГРА</Text>
            <View style={styles.activeScoreRow}>
              <View style={styles.activeScoreBlock}>
                <Text style={styles.activeScoreTeam}>МЫ</Text>
                <Text style={styles.activeScoreNum}>{matchScore.us}</Text>
              </View>
              <Text style={styles.activeScoreSep}>:</Text>
              <View style={styles.activeScoreBlock}>
                <Text style={styles.activeScoreTeam}>ОНИ</Text>
                <Text style={styles.activeScoreNum}>{matchScore.them}</Text>
              </View>
            </View>
            <Text style={styles.activeRound}>Раунд {round} • до {winThreshold} очков</Text>

            <Pressable
              style={({ pressed }) => [styles.continueButton, pressed && { opacity: 0.85 }]}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Продолжить игру →</Text>
            </Pressable>
          </View>
        )}

        {/* New Game button */}
        <Pressable
          style={({ pressed }) => [
            styles.newGameButton,
            pressed && { transform: [{ scale: 0.97 }] },
          ]}
          onPress={handleNewGame}
        >
          <Text style={styles.newGameText}>
            {hasActiveGame ? 'Новая игра' : 'Начать игру'}
          </Text>
        </Pressable>

        {/* Rules card */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Правила игры</Text>

          <View style={styles.ruleRow}>
            <Text style={styles.ruleIcon}>👥</Text>
            <Text style={styles.ruleText}>4 игрока, 2 команды по диагонали</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleIcon}>🃏</Text>
            <Text style={styles.ruleText}>36 карт, каждому по 9</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleIcon}>♠</Text>
            <Text style={styles.ruleText}>Козырь определяется последней картой сдающего</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleIcon}>🎯</Text>
            <Text style={styles.ruleText}>5+ взяток = 1 очко; все 9 = 2 очка</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleIcon}>🏆</Text>
            <Text style={styles.ruleText}>Победа при {winThreshold} очках</Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleIcon}>📋</Text>
            <Text style={styles.ruleText}>Обязательно ходить в масть; при отсутствии — козырь</Text>
          </View>
        </View>

        {/* Card order */}
        <View style={styles.rankCard}>
          <Text style={styles.rulesTitle}>Старшинство карт</Text>
          <Text style={styles.rankOrder}>6 &lt; 7 &lt; 8 &lt; 9 &lt; 10 &lt; В &lt; Д &lt; К &lt; Т</Text>
          <Text style={styles.rankSub}>(от младшей к старшей)</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(245,200,66,0.06)',
    top: -40,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(245,200,66,0.04)',
    bottom: -20,
    left: -30,
  },
  suitRow: {
    color: '#2E7D4F',
    fontSize: 20,
    letterSpacing: 8,
    marginBottom: 8,
  },
  title: {
    color: '#F5C842',
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 8,
    textShadowColor: 'rgba(245,200,66,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    color: '#A8C5A0',
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  activeGameCard: {
    backgroundColor: '#1A5C32',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F5C842',
    alignItems: 'center',
    gap: 8,
  },
  activeGameLabel: {
    color: '#F5C842',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  activeScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activeScoreBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  activeScoreTeam: {
    color: '#A8C5A0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  activeScoreNum: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
  },
  activeScoreSep: {
    color: '#A8C5A0',
    fontSize: 24,
    fontWeight: '700',
  },
  activeRound: {
    color: '#A8C5A0',
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: 'rgba(245,200,66,0.15)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F5C842',
    marginTop: 4,
  },
  continueButtonText: {
    color: '#F5C842',
    fontSize: 14,
    fontWeight: '700',
  },
  newGameButton: {
    backgroundColor: '#F5C842',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F5C842',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newGameText: {
    color: '#0A3D1F',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  rulesCard: {
    backgroundColor: '#1A5C32',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E7D4F',
    gap: 10,
  },
  rulesTitle: {
    color: '#F5C842',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  ruleIcon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  ruleText: {
    color: '#FFFFFF',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  rankCard: {
    backgroundColor: '#1A5C32',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E7D4F',
    alignItems: 'center',
    gap: 6,
  },
  rankOrder: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  rankSub: {
    color: '#A8C5A0',
    fontSize: 11,
  },
});
