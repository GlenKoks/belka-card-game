import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useGame } from '@/lib/game/GameContext';
import { ScoreBar } from '@/components/game/ScoreBar';
import { TrumpBadge } from '@/components/game/TrumpBadge';
import { TrickArea } from '@/components/game/TrickArea';
import { PlayerHand } from '@/components/game/PlayerHand';
import { OpponentHand } from '@/components/game/OpponentHand';
import { RoundResultModal } from '@/components/game/RoundResultModal';
import { MatchResultScreen } from '@/components/game/MatchResultScreen';
import { VoltCard } from '@/components/game/VoltCard';
import { Card } from '@/lib/game/types';

export default function GameTableScreen() {
  const { state, playCard, nextRound, startNextRound, startGame, getValidCardsForPlayer } = useGame();

  const {
    phase,
    hands,
    trumpSuit,
    voltCard,
    currentTrick,
    completedTricks,
    matchScore,
    winThreshold,
    round,
    currentPlayerId,
    playerNames,
    lastRoundResult,
  } = state;

  const isMyTurn = phase === 'PLAYING_TRICK' && currentPlayerId === 0;
  const validCards = getValidCardsForPlayer(0);

  const handlePlayCard = (card: Card) => {
    playCard(card);
  };

  // Match finished screen
  if (phase === 'MATCH_FINISHED') {
    return (
      <MatchResultScreen
        matchScore={matchScore}
        onNewGame={() => {
          startGame(winThreshold, playerNames);
        }}
      />
    );
  }

  // Trick counts for display
  const myTricks = completedTricks.filter(t => t.winnerId === 0 || t.winnerId === 2).length;
  const theirTricks = completedTricks.filter(t => t.winnerId === 1 || t.winnerId === 3).length;

  // Phase display text
  const getPhaseText = () => {
    switch (phase) {
      case 'TRUMP_REVEALED': return 'Козырь определён...';
      case 'TRICK_RESOLVED': return 'Взятка разыграна...';
      case 'PLAYING_TRICK':
        if (currentPlayerId === 0) return null; // shown in PlayerHand
        return `Ход: ${playerNames[currentPlayerId]}`;
      default: return null;
    }
  };

  const phaseText = getPhaseText();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A3D1F" />

      {/* Score bar */}
      <ScoreBar
        blackScore={matchScore.black}
        redScore={matchScore.red}
        winThreshold={winThreshold}
        round={round}
      />

      {/* Main game area */}
      <View style={styles.gameArea}>

        {/* Top opponent (Player 2 = Partner) */}
        <View style={styles.topOpponent}>
          <OpponentHand
            cardCount={hands[2].length}
            name={playerNames[2]}
            isCurrentPlayer={currentPlayerId === 2}
            position="top"
          />
        </View>

        {/* Middle row: left opponent, trick area, right opponent */}
        <View style={styles.middleRow}>
          {/* Left opponent (Player 1) */}
          <View style={styles.sideOpponent}>
            <OpponentHand
              cardCount={hands[1].length}
              name={playerNames[1]}
              isCurrentPlayer={currentPlayerId === 1}
              position="left"
            />
          </View>

          {/* Center: trick area + trump */}
          <View style={styles.centerArea}>
            {/* Trump badge — top left of center */}
            <View style={styles.trumpContainer}>
              <TrumpBadge suit={trumpSuit} />
              {voltCard && (
                <View style={styles.voltContainer}>
                  <VoltCard card={voltCard} />
                </View>
              )}
            </View>

            {/* Lead suit indicator — top right */}
            {currentTrick.leadSuit && phase !== 'ROUND_FINISHED' && (
              <View style={styles.leadSuitContainer}>
                <Text style={styles.leadSuitText}>Ход: {currentTrick.leadSuit === 'clubs' ? '♣' : currentTrick.leadSuit === 'spades' ? '♠' : currentTrick.leadSuit === 'hearts' ? '♥' : '♦'}</Text>
              </View>
            )}

            {/* Phase status text */}
            {phaseText && (
              <View style={styles.phaseTextContainer}>
                <Text style={styles.phaseText}>{phaseText}</Text>
              </View>
            )}

            {/* Trick area */}
            {phase !== 'ROUND_FINISHED' && (
              <TrickArea
                trick={currentTrick}
                playerNames={playerNames}
                trumpSuit={trumpSuit}
                phase={phase}
              />
            )}

            {/* Trick score */}
            {phase !== 'ROUND_FINISHED' && (
              <View style={styles.trickScore}>
                <Text style={styles.trickScoreText}>
                  Взятки: {myTricks} — {theirTricks}
                </Text>
              </View>
            )}
          </View>

          {/* Right opponent (Player 3) */}
          <View style={styles.sideOpponent}>
            <OpponentHand
              cardCount={hands[3].length}
              name={playerNames[3]}
              isCurrentPlayer={currentPlayerId === 3}
              position="right"
            />
          </View>
        </View>

        {/* Player hand (bottom) */}
        <View style={styles.playerHandArea}>
          {/* Player label */}
          <View style={styles.playerLabel}>
            <View style={[styles.turnIndicator, isMyTurn && styles.turnIndicatorActive]} />
            <Text style={styles.playerName}>{playerNames[0]}</Text>
            <Text style={styles.cardCountLabel}>{hands[0].length} карт</Text>
            <Pressable
              style={styles.exitButton}
              onPress={() => router.back()}
            >
              <Text style={styles.exitText}>← Меню</Text>
            </Pressable>
          </View>

          <PlayerHand
            hand={hands[0]}
            validCards={validCards}
            onPlayCard={handlePlayCard}
            isMyTurn={isMyTurn}
          />
        </View>
      </View>

      {/* Round result modal */}
      {lastRoundResult && (
        <RoundResultModal
          visible={phase === 'ROUND_FINISHED'}
          result={lastRoundResult}
          matchScore={matchScore}
          winThreshold={winThreshold}
          onNextRound={startNextRound}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A3D1F',
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 6,
    gap: 2,
  },
  topOpponent: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  middleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideOpponent: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    position: 'relative',
  },
  trumpContainer: {
    position: 'absolute',
    top: -36,
    left: -4,
    zIndex: 10,
    alignItems: 'center',
    gap: 4,
  },
  voltContainer: {
    marginTop: 2,
  },
  phaseTextContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  phaseText: {
    color: '#F5C842',
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  trickScore: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  trickScoreText: {
    color: '#A8C5A0',
    fontSize: 11,
    fontWeight: '600',
  },
  playerHandArea: {
    paddingBottom: 6,
  },
  playerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 4,
    gap: 6,
  },
  turnIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D4F',
  },
  turnIndicatorActive: {
    backgroundColor: '#F5C842',
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardCountLabel: {
    color: '#A8C5A0',
    fontSize: 11,
  },
  exitButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  exitText: {
    color: '#A8C5A0',
    fontSize: 11,
  },
  leadSuitContainer: {
    position: "absolute",
    top: -36,
    right: -4,
    zIndex: 10,
    alignItems: "center",
  },
  leadSuitText: {
    color: "#F5C842",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
