import { Card, PlayerId, Suit, Team, Trick, TrickCard, RoundResult } from './types';
import { RANK_ORDER } from './deck';

/**
 * Determine which cards in hand are valid to play given the current trick state.
 * Rules:
 * 1. Must follow lead suit if possible
 * 2. If no lead suit, must play trump if possible
 * 3. If neither, can play any card
 */
export function getValidCards(
  hand: Card[],
  currentTrick: Trick,
  trumpSuit: Suit | null
): Card[] {
  const { cards, leadSuit } = currentTrick;

  // First card of trick — anything goes
  if (cards.length === 0 || leadSuit === null) {
    return hand;
  }

  // Try to follow suit
  const suitCards = hand.filter(c => c.suit === leadSuit);
  if (suitCards.length > 0) return suitCards;

  // No lead suit — must play trump if available
  if (trumpSuit) {
    const trumpCards = hand.filter(c => c.suit === trumpSuit);
    if (trumpCards.length > 0) return trumpCards;
  }

  // No suit, no trump — play anything
  return hand;
}

/**
 * Determine the winner of a completed trick (4 cards played).
 */
export function determineTrickWinner(trick: Trick, trumpSuit: Suit | null): PlayerId {
  const { cards, leadSuit } = trick;
  if (cards.length !== 4) throw new Error('Trick must have 4 cards to determine winner');

  let winner = cards[0];

  for (let i = 1; i < cards.length; i++) {
    const challenger = cards[i];
    if (beats(challenger.card, winner.card, leadSuit!, trumpSuit)) {
      winner = challenger;
    }
  }

  return winner.playerId;
}

/**
 * Returns true if challenger beats current best card.
 */
function beats(
  challenger: Card,
  current: Card,
  leadSuit: Suit,
  trumpSuit: Suit | null
): boolean {
  const challengerIsTrump = trumpSuit !== null && challenger.suit === trumpSuit;
  const currentIsTrump = trumpSuit !== null && current.suit === trumpSuit;
  const challengerIsLead = challenger.suit === leadSuit;
  const currentIsLead = current.suit === leadSuit;

  // Trump beats non-trump
  if (challengerIsTrump && !currentIsTrump) return true;
  if (!challengerIsTrump && currentIsTrump) return false;

  // Both trump — higher rank wins
  if (challengerIsTrump && currentIsTrump) {
    return RANK_ORDER[challenger.rank] > RANK_ORDER[current.rank];
  }

  // No trump involved — lead suit beats off-suit
  if (challengerIsLead && !currentIsLead) return true;
  if (!challengerIsLead && currentIsLead) return false;

  // Both same suit — higher rank wins
  if (challenger.suit === current.suit) {
    return RANK_ORDER[challenger.rank] > RANK_ORDER[current.rank];
  }

  // Different off-suits — first played wins (challenger doesn't beat)
  return false;
}

/**
 * Get team for a player ID.
 * Team "us" = players 0 and 2
 * Team "them" = players 1 and 3
 */
export function getTeam(playerId: PlayerId): Team {
  return playerId === 0 || playerId === 2 ? 'us' : 'them';
}

/**
 * Calculate round result from completed tricks.
 */
export function calculateRoundResult(completedTricks: Trick[]): RoundResult {
  const trickCounts: Record<PlayerId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (const trick of completedTricks) {
    if (trick.winnerId !== null) {
      trickCounts[trick.winnerId]++;
    }
  }

  const teamTricks = {
    us: trickCounts[0] + trickCounts[2],
    them: trickCounts[1] + trickCounts[3],
  };

  const pointsEarned = { us: 0, them: 0 };

  // All 9 tricks = 2 points
  if (teamTricks.us === 9) {
    pointsEarned.us = 2;
  } else if (teamTricks.them === 9) {
    pointsEarned.them = 2;
  } else if (teamTricks.us >= 5) {
    pointsEarned.us = 1;
  } else if (teamTricks.them >= 5) {
    pointsEarned.them = 1;
  }

  return { trickCounts, teamTricks, pointsEarned };
}

/**
 * Get next player clockwise.
 */
export function nextPlayer(playerId: PlayerId): PlayerId {
  return ((playerId + 1) % 4) as PlayerId;
}

/**
 * Get player to the left of dealer (first to play).
 */
export function firstPlayer(dealerId: PlayerId): PlayerId {
  return nextPlayer(dealerId);
}
