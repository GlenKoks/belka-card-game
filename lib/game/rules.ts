import { Card, Suit, Rank, Trick, Team, PlayerId, RoundResult } from './types';
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
 * 1. If lead card is a Jack → must play trump/jack only (jacks have no suit)
 * 2. If lead card is regular card → must follow lead suit (excluding jacks, which are trump)
 *    - If no suit cards → must play trump/jack
 * 3. If no valid cards from above → play any card
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

  // Check if lead card is a Jack
  const leadCard = cards[0]?.card;
  const leadIsJack = leadCard?.rank === 'J';

  if (leadIsJack) {
    // Jack was led: must play trump or jack
    const trumpAndJacks = hand.filter(c => c.rank === 'J' || c.suit === trumpSuit);
    return trumpAndJacks.length > 0 ? trumpAndJacks : hand;
  }

  // Regular card was led: must follow suit (but not jacks, which are trump)
  const suitCards = hand.filter(c => c.suit === leadSuit && c.rank !== 'J');
  if (suitCards.length > 0) {
    return suitCards;
  }

  // No suit cards: must play trump or jack
  const trumpAndJacks = hand.filter(c => c.rank === 'J' || c.suit === trumpSuit);
  if (trumpAndJacks.length > 0) {
    return trumpAndJacks;
  }

  // No trump/jacks: play any card
  return hand;
}

/**
 * Determine the winner of a trick
 */
export function determineTrickWinner(
  trick: Trick,
  trumpSuit: Suit | null
): PlayerId | null {
  if (trick.cards.length === 0) return null;

  let winner = trick.cards[0];
  let winnerRank = RANK_ORDER[winner.card.rank];
  let winnerIsJack = winner.card.rank === 'J';
  let winnerJackOrder = winnerIsJack ? JACK_ORDER[winner.card.suit] : -1;

  for (let i = 1; i < trick.cards.length; i++) {
    const card = trick.cards[i].card;
    const isJack = card.rank === 'J';
    const jackOrder = isJack ? JACK_ORDER[card.suit] : -1;

    // Jacks always beat non-jacks
    if (isJack && !winnerIsJack) {
      winner = trick.cards[i];
      winnerRank = RANK_ORDER[card.rank];
      winnerIsJack = true;
      winnerJackOrder = jackOrder;
      continue;
    }

    // Both jacks: higher jack wins
    if (isJack && winnerIsJack) {
      if (jackOrder > winnerJackOrder) {
        winner = trick.cards[i];
        winnerJackOrder = jackOrder;
      }
      continue;
    }

    // Neither is jack
    if (!isJack && !winnerIsJack) {
      // Trump beats non-trump
      const cardIsTrump = card.suit === trumpSuit;
      const winnerIsTrump = winner.card.suit === trumpSuit;

      if (cardIsTrump && !winnerIsTrump) {
        winner = trick.cards[i];
        winnerRank = RANK_ORDER[card.rank];
        continue;
      }

      if (!cardIsTrump && winnerIsTrump) {
        continue;
      }

      // Same suit: higher rank wins
      if (card.suit === winner.card.suit) {
        if (RANK_ORDER[card.rank] > winnerRank) {
          winner = trick.cards[i];
          winnerRank = RANK_ORDER[card.rank];
        }
      }
    }
  }

  return winner.playerId;
}

/**
 * Calculate card points for a team from their tricks
 */
export function calculateCardPoints(
  tricks: Trick[],
  teamPlayers: PlayerId[]
): number {
  let points = 0;
  for (const trick of tricks) {
    if (trick.winnerId !== null && teamPlayers.includes(trick.winnerId)) {
      for (const trickCard of trick.cards) {
        points += CARD_POINTS[trickCard.card.rank];
      }
    }
  }
  return points;
}

/**
 * Calculate Eyes earned based on opponent points and trump holder
 * trumpHolderId: player who has the trump-determining jack
 * winnerTeam: team that won the round
 */
export function calculateEyes(
  blackPoints: number,
  redPoints: number,
  blackTricks: number,
  redTricks: number,
  trumpHolderId: PlayerId | null,
  teamAssignment: Record<PlayerId, Team>,
  previousRoundWasEggs: boolean
): { black: number; red: number; wasEggs: boolean } {
  // Determine winner and loser
  const blackWon = blackPoints > redPoints;
  const redWon = redPoints > blackPoints;
  const isEggs = blackPoints === redPoints;

  if (isEggs) {
    return { black: 0, red: 0, wasEggs: true };
  }

  // Determine if opponent got 0 tricks (all 9 tricks to winner)
  const blackGotAllTricks = blackTricks === 9 && redTricks === 0;
  const redGotAllTricks = redTricks === 9 && blackTricks === 0;

  // If previous round was Eggs, next winner gets 4 Eyes
  if (previousRoundWasEggs) {
    if (blackWon) return { black: 4, red: 0, wasEggs: false };
    if (redWon) return { black: 0, red: 4, wasEggs: false };
  }

  // Determine if trump is with winner or loser
  const trumpHolderTeam = trumpHolderId !== null ? teamAssignment[trumpHolderId] : null;

  // All 9 tricks to one team
  if (blackGotAllTricks) {
    return { black: 12, red: 0, wasEggs: false };
  }
  if (redGotAllTricks) {
    return { black: 0, red: 12, wasEggs: false };
  }

  // Black won
  if (blackWon) {
    const opponentPoints = redPoints;
    const trumpWithWinner = trumpHolderTeam === 'black';

    if (opponentPoints < 14) {
      return { black: trumpWithWinner ? 5 : 6, red: 0, wasEggs: false };
    } else if (opponentPoints <= 30) {
      // Check if it's a "save" (opponent has 14-30 points)
      // If trump with loser, it's a save (4 eyes), otherwise 3 eyes
      const eyes = trumpWithWinner ? 3 : 4;
      return { black: eyes, red: 0, wasEggs: false };
    } else {
      // opponentPoints >= 31
      return { black: trumpWithWinner ? 1 : 2, red: 0, wasEggs: false };
    }
  }

  // Red won
  if (redWon) {
    const opponentPoints = blackPoints;
    const trumpWithWinner = trumpHolderTeam === 'red';

    if (opponentPoints < 14) {
      return { black: 0, red: trumpWithWinner ? 5 : 6, wasEggs: false };
    } else if (opponentPoints <= 30) {
      const eyes = trumpWithWinner ? 3 : 4;
      return { black: 0, red: eyes, wasEggs: false };
    } else {
      // opponentPoints >= 31
      return { black: 0, red: trumpWithWinner ? 1 : 2, wasEggs: false };
    }
  }

  return { black: 0, red: 0, wasEggs: false };
}
