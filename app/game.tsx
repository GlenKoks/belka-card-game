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
import { Card, Team } from '@/lib/game/types';

const THEME = {
  blue: '#227C9D',
  mint: '#17C3B2',
  amber: '#FFCB77',
  cream: '#FEF9EF',
  coral: '#FE6D73',
  wood: '#B57A4B',
  woodDark: '#8D5A34',
};

export default function GameTableScreen() {
  const { state, playCard, nextRound, startGame, getValidCardsForPlayer } = useGame();

  const {
    phase,
    hands,
    trumpSuit,
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
  const revealTeams = round >= 2 || phase === 'MATCH_FINISHED';

  const getTeamColor = (playerId: 0 | 1 | 2 | 3): Team | undefined => {
    if (!revealTeams) return undefined;
    return state.teamAssignment[playerId];
  };

  const handlePlayCard = (card: Card) => {
    playCard(card);
  };

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

  const myTricks = completedTricks.filter(t => t.winnerId === 0 || t.winnerId === 2).length;
  const theirTricks = completedTricks.filter(t => t.winnerId === 1 || t.winnerId === 3).length;

  const getPhaseText = () => {
    switch (phase) {
      case 'TRUMP_REVEALED': return 'Козырь определён...';
      case 'TRICK_RESOLVED': return 'Взятка разыграна...';
      case 'PLAYING_TRICK':
        if (currentPlayerId === 0) return null;
        return `Ход: ${playerNames[currentPlayerId]}`;
      default: return null;
    }
  };

  const phaseText = getPhaseText();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.cream} />

      <View style={styles.tableFrame}>
        <ScoreBar
          blackScore={matchScore.black}
          redScore={matchScore.red}
          winThreshold={winThreshold}
          round={round}
        />

        <View style={styles.gameArea}>
          <View style={styles.topOpponent}>
            <OpponentHand
              cardCount={hands[2].length}
              name={playerNames[2]}
              isCurrentPlayer={currentPlayerId === 2}
              position="top"
              team={getTeamColor(2)}
            />
          </View>

          <View style={styles.middleRow}>
            <View style={styles.sideOpponent}>
              <OpponentHand
                cardCount={hands[1].length}
                name={playerNames[1]}
                isCurrentPlayer={currentPlayerId === 1}
                position="left"
                team={getTeamColor(1)}
              />
            </View>

            <View style={styles.centerArea}>
              <View style={styles.trumpContainer}>
                <TrumpBadge suit={trumpSuit} />
              </View>

              {currentTrick.leadSuit && phase !== 'ROUND_FINISHED' && (
                <View style={styles.leadSuitContainer}>
                  <Text style={styles.leadSuitText}>Ход: {currentTrick.leadSuit === 'clubs' ? '♣' : currentTrick.leadSuit === 'spades' ? '♠' : currentTrick.leadSuit === 'hearts' ? '♥' : '♦'}</Text>
                </View>
              )}

              {phaseText && (
                <View style={styles.phaseTextContainer}>
                  <Text style={styles.phaseText}>{phaseText}</Text>
                </View>
              )}

              {phase !== 'ROUND_FINISHED' && (
                <TrickArea
                  trick={currentTrick}
                  playerNames={playerNames}
                  trumpSuit={trumpSuit}
                  phase={phase}
                />
              )}

              {phase !== 'ROUND_FINISHED' && (
                <View style={styles.trickScore}>
                  <Text style={styles.trickScoreText}>
                    Взятки: {myTricks} — {theirTricks}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.sideOpponent}>
              <OpponentHand
                cardCount={hands[3].length}
                name={playerNames[3]}
                isCurrentPlayer={currentPlayerId === 3}
                position="right"
                team={getTeamColor(3)}
              />
            </View>
          </View>

          <View style={styles.playerHandArea}>
            <View style={[styles.playerLabel, getTeamColor(0) === 'black' && styles.playerLabelBlack, getTeamColor(0) === 'red' && styles.playerLabelRed]}>
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
      </View>

      {lastRoundResult && (
        <RoundResultModal
          visible={phase === 'ROUND_FINISHED'}
          result={lastRoundResult}
          matchScore={matchScore}
          winThreshold={winThreshold}
          onNextRound={nextRound}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.cream,
    padding: 8,
  },
  tableFrame: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: THEME.wood,
    borderWidth: 3,
    borderColor: THEME.woodDark,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 10,
    gap: 6,
    backgroundColor: '#D09B6B',
  },
  topOpponent: {
    alignItems: 'center',
    paddingVertical: 4,
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
    top: -34,
    left: -4,
    zIndex: 10,
    alignItems: 'center',
  },
  phaseTextContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  phaseText: {
    color: THEME.blue,
    fontSize: 11,
    fontWeight: '700',
  },
  trickScore: {
    backgroundColor: 'rgba(254,249,239,0.88)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.amber,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  trickScoreText: {
    color: THEME.blue,
    fontSize: 11,
    fontWeight: '700',
  },
  playerHandArea: {
    paddingBottom: 8,
  },
  playerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 4,
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(254,249,239,0.7)',
  },
  playerLabelBlack: {
    backgroundColor: 'rgba(34,124,157,0.2)',
    borderColor: THEME.blue,
  },
  playerLabelRed: {
    backgroundColor: 'rgba(254,109,115,0.22)',
    borderColor: THEME.coral,
  },
  turnIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.mint,
  },
  turnIndicatorActive: {
    backgroundColor: THEME.coral,
  },
  playerName: {
    color: '#4A2F1B',
    fontSize: 13,
    fontWeight: '700',
  },
  cardCountLabel: {
    color: '#7A4F2D',
    fontSize: 11,
    fontWeight: '600',
  },
  exitButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: THEME.blue,
    borderRadius: 8,
  },
  exitText: {
    color: THEME.cream,
    fontSize: 11,
    fontWeight: '700',
  },
  leadSuitContainer: {
    position: 'absolute',
    top: -34,
    right: -2,
    zIndex: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(254,249,239,0.92)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: THEME.amber,
  },
  leadSuitText: {
    color: THEME.blue,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
