import { Card, Rank, Suit } from './types';

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Rank order: index = strength (higher = stronger)
export const RANK_ORDER: Record<Rank, number> = {
  '6': 0, '7': 1, '8': 2, '9': 3, '10': 4,
  'J': 5, 'Q': 6, 'K': 7, 'A': 8,
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export const SUIT_NAMES_RU: Record<Suit, string> = {
  spades: 'Пики',
  hearts: 'Червы',
  diamonds: 'Бубны',
  clubs: 'Трефы',
};

export const RANK_DISPLAY: Record<Rank, string> = {
  '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
  'J': 'В', 'Q': 'Д', 'K': 'К', 'A': 'Т',
};

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${rank}_${suit}` });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal 9 cards to each of 4 players.
 * Returns { hands, voltCard } where voltCard is the last card dealt to the dealer.
 */
export function dealCards(dealerId: 0 | 1 | 2 | 3): {
  hands: Record<0 | 1 | 2 | 3, Card[]>;
  voltCard: Card;
} {
  const deck = shuffleDeck(createDeck());
  const hands: Record<0 | 1 | 2 | 3, Card[]> = { 0: [], 1: [], 2: [], 3: [] };

  // Deal 9 cards to each player starting from player left of dealer
  // Order: (dealerId+1)%4, (dealerId+2)%4, (dealerId+3)%4, dealerId
  const dealOrder: (0 | 1 | 2 | 3)[] = [
    ((dealerId + 1) % 4) as 0 | 1 | 2 | 3,
    ((dealerId + 2) % 4) as 0 | 1 | 2 | 3,
    ((dealerId + 3) % 4) as 0 | 1 | 2 | 3,
    dealerId,
  ];

  let cardIndex = 0;
  for (let round = 0; round < 9; round++) {
    for (const playerId of dealOrder) {
      hands[playerId].push(deck[cardIndex++]);
    }
  }

  // Volt = last card dealt (last card of dealer's hand)
  const voltCard = hands[dealerId][hands[dealerId].length - 1];

  return { hands, voltCard };
}

/**
 * Sort a hand: group by suit, trump suit last, within suit sort by rank ascending.
 */
export function sortHand(hand: Card[], trumpSuit: Suit | null): Card[] {
  const suitOrder: Record<Suit, number> = {
    spades: 0, clubs: 1, hearts: 2, diamonds: 3,
  };

  return [...hand].sort((a, b) => {
    const aTrump = a.suit === trumpSuit ? 1 : 0;
    const bTrump = b.suit === trumpSuit ? 1 : 0;
    if (aTrump !== bTrump) return aTrump - bTrump; // trump last
    if (a.suit !== b.suit) return suitOrder[a.suit] - suitOrder[b.suit];
    return RANK_ORDER[a.rank] - RANK_ORDER[b.rank];
  });
}
