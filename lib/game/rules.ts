import { Card, PlayerId, Suit, Team, Trick, TrickCard, RoundResult, Rank } from './types';
import { RANK_ORDER } from './deck';

/**
 * Card point values for scoring
 */
const CARD_POINTS: Record<Rank, number> = {
  '6': 0,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': 10,
  'J': 2,
  'Q': 3,
  'K': 4,
  'A': 11,
};

/**
 * Jack hierarchy (all jacks are trump)
 * Валет Крести (clubs) = 1st (highest)
 * Валет Пики (spades) = 2nd
 * Валет Черви (hearts) = 3rd
 * Валет Буби (diamonds) = 4th (lowest)
 */
const JACK_ORDER: Record<Suit, number> = {
  clubs: 3,    // 1st jack (highest)
  spades: 2,   // 2nd jack
  hearts: 1,   // 3rd jack
  diamonds: 0, // 4th jack (lowest)
};

/**
 * Determine which cards in hand are valid to play given the current trick state.
 * Rules:
 * 1. Must follow lead suit if possible (but jacks are always trump, not their suit)
 * 2. If no lead suit, must play trump/jack if possible
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

  // Try to follow lead suit (but jacks are trump, not their suit)
  const suitCards = hand.filter(c => c.suit === leadSuit && c.rank !== 'J');
  if (suitCards.length > 0) return suitCards;

  // No lead suit cards — must play trump/jack if available
  const trumpCards = hand.filter(c => c.suit === trumpSuit || c.rank === 'J');
  if (trumpCards.length > 0) return trumpCards;

  // No suit, no trump — play anything
  return hand;
}

/**
 * Determine the winner of a completed trick (4 cards played).
 * Jacks are always trump and beat all other cards.
 * Jack hierarchy: clubs > spades > hearts > diamonds
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
 * Jack hierarchy: clubs (1st) > spades (2nd) > hearts (3rd) > diamonds (4th)
 */
function beats(
  challenger: Card,
  current: Card,
  leadSuit: Suit,
  trumpSuit: Suit | null
): boolean {
  const challengerIsJack = challenger.rank === 'J';
  const currentIsJack = current.rank === 'J';

  // Both jacks — higher jack wins
  if (challengerIsJack && currentIsJack) {
    return JACK_ORDER[challenger.suit] > JACK_ORDER[current.suit];
  }

  // Challenger is jack, current is not — jack wins
  if (challengerIsJack && !currentIsJack) return true;

  // Current is jack, challenger is not — jack wins
  if (!challengerIsJack && currentIsJack) return false;

  // Neither is jack — use normal trump/lead suit logic
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
 * Scoring: team with higher card points wins 2 points
 * Card points: K=4, Q=3, J=2, 10=10, A=11
 */
export function calculateRoundResult(completedTricks: Trick[]): RoundResult {
  const trickCounts: Record<PlayerId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const cardPoints: Record<PlayerId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };

  for (const trick of completedTricks) {
    if (trick.winnerId !== null) {
      trickCounts[trick.winnerId]++;

      // Add card points for all cards in this trick to the winner
      for (const { card } of trick.cards) {
        cardPoints[trick.winnerId] += CARD_POINTS[card.rank];
      }
    }
  }

  const teamTricks = {
    us: trickCounts[0] + trickCounts[2],
    them: trickCounts[1] + trickCounts[3],
  };

  const teamCardPoints = {
    us: cardPoints[0] + cardPoints[2],
    them: cardPoints[1] + cardPoints[3],
  };

  const pointsEarned = { us: 0, them: 0 };

  // Team with higher card points wins 2 points
  if (teamCardPoints.us > teamCardPoints.them) {
    pointsEarned.us = 2;
  } else if (teamCardPoints.them > teamCardPoints.us) {
    pointsEarned.them = 2;
  }
  // If equal, no points awarded

  return { trickCounts, teamTricks, cardPoints: teamCardPoints, pointsEarned };
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

/**
 * Determine suit assignment for a player based on their jack in round 1.
 * Jack of Clubs → Clubs
 * Jack of Spades → Spades
 * Jack of Hearts → Hearts
 * Jack of Diamonds → Diamonds
 */
export function getSuitForJack(jackSuit: Suit): Suit {
  return jackSuit;
}

/**
 * Determine trump suit for a round based on suit assignments and which player has the jack.
 * In round 1, trump is always Clubs.
 * In round 2+, trump is determined by which player has the jack for their assigned suit.
 */
export function determineTrumpSuit(
  round: number,
  suitAssignment: Record<PlayerId, Suit | null>,
  hands: Record<PlayerId, Card[]>
): Suit | null {
  if (round === 1) {
    return 'clubs'; // Round 1 trump is always Clubs
  }

  // Round 2+: find which player has the jack for their assigned suit
  for (const playerId of [0, 1, 2, 3] as PlayerId[]) {
    const assignedSuit = suitAssignment[playerId];
    if (assignedSuit === null) continue;

    const hand = hands[playerId];
    const hasJack = hand.some(c => c.rank === 'J' && c.suit === assignedSuit);

    if (hasJack) {
      return assignedSuit;
    }
  }

  // Fallback (shouldn't happen if game state is correct)
  return 'clubs';
}
