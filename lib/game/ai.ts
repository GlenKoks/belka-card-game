import { Card, GameState, PlayerId, Suit } from './types';
import { getValidCards } from './rules';
import { RANK_ORDER } from './deck';

/**
 * AI strategy for selecting a card to play.
 * Strategy: 
 * - If leading: play highest card of longest non-trump suit, or highest trump if only trump left
 * - If following: 
 *   - If can win the trick: play lowest winning card
 *   - If can't win: play lowest card (discard)
 */
export function selectAICard(state: GameState, playerId: PlayerId): Card {
  const hand = state.hands[playerId];
  const valid = getValidCards(hand, state.currentTrick, state.trumpSuit);

  if (valid.length === 1) return valid[0];

  const isLeading = state.currentTrick.cards.length === 0;

  if (isLeading) {
    return selectLeadCard(valid, state.trumpSuit);
  } else {
    return selectFollowCard(valid, state.currentTrick.cards, state.currentTrick.leadSuit!, state.trumpSuit);
  }
}

function selectLeadCard(valid: Card[], trumpSuit: Suit | null): Card {
  // Prefer non-trump cards; play highest of most common suit
  const nonTrump = valid.filter(c => c.suit !== trumpSuit);
  const pool = nonTrump.length > 0 ? nonTrump : valid;

  // Group by suit
  const bySuit: Record<string, Card[]> = {};
  for (const card of pool) {
    if (!bySuit[card.suit]) bySuit[card.suit] = [];
    bySuit[card.suit].push(card);
  }

  // Find suit with most cards
  let bestSuit = pool[0].suit;
  let bestCount = 0;
  for (const [suit, cards] of Object.entries(bySuit)) {
    if (cards.length > bestCount) {
      bestCount = cards.length;
      bestSuit = suit as Suit;
    }
  }

  // Play highest card of that suit
  const suitCards = bySuit[bestSuit];
  return suitCards.reduce((best, c) =>
    RANK_ORDER[c.rank] > RANK_ORDER[best.rank] ? c : best
  );
}

function selectFollowCard(
  valid: Card[],
  playedCards: Array<{ card: Card; playerId: PlayerId }>,
  leadSuit: string,
  trumpSuit: Suit | null
): Card {
  // Find current best card in trick
  const currentBest = getCurrentBest(playedCards, leadSuit as Suit, trumpSuit);

  // Try to find lowest card that beats current best
  const winning = valid.filter(c => cardBeats(c, currentBest, leadSuit as Suit, trumpSuit));

  if (winning.length > 0) {
    // Play lowest winning card
    return winning.reduce((best, c) =>
      RANK_ORDER[c.rank] < RANK_ORDER[best.rank] ? c : best
    );
  }

  // Can't win — discard lowest card
  return valid.reduce((best, c) =>
    RANK_ORDER[c.rank] < RANK_ORDER[best.rank] ? c : best
  );
}

function getCurrentBest(
  playedCards: Array<{ card: Card; playerId: PlayerId }>,
  leadSuit: Suit,
  trumpSuit: Suit | null
): Card {
  let best = playedCards[0].card;
  for (let i = 1; i < playedCards.length; i++) {
    const c = playedCards[i].card;
    if (cardBeats(c, best, leadSuit, trumpSuit)) {
      best = c;
    }
  }
  return best;
}

function cardBeats(challenger: Card, current: Card, leadSuit: Suit, trumpSuit: Suit | null): boolean {
  const challengerIsTrump = trumpSuit !== null && challenger.suit === trumpSuit;
  const currentIsTrump = trumpSuit !== null && current.suit === trumpSuit;

  if (challengerIsTrump && !currentIsTrump) return true;
  if (!challengerIsTrump && currentIsTrump) return false;
  if (challengerIsTrump && currentIsTrump) {
    return RANK_ORDER[challenger.rank] > RANK_ORDER[current.rank];
  }

  const challengerIsLead = challenger.suit === leadSuit;
  const currentIsLead = current.suit === leadSuit;

  if (challengerIsLead && !currentIsLead) return true;
  if (!challengerIsLead && currentIsLead) return false;
  if (challenger.suit === current.suit) {
    return RANK_ORDER[challenger.rank] > RANK_ORDER[current.rank];
  }

  return false;
}
