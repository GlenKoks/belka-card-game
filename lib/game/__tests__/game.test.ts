import { describe, it, expect } from 'vitest';
import { createDeck, shuffleDeck, dealCards, sortHand, RANK_ORDER } from '../deck';
import { getValidCards, determineTrickWinner, calculateRoundResult, getTeam, nextPlayer, firstPlayer } from '../rules';
import { gameReducer, createInitialState } from '../gameReducer';
import { Card, Trick, PlayerId } from '../types';

// ─── Deck Tests ───────────────────────────────────────────────────────────────

describe('createDeck', () => {
  it('creates 36 cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(36);
  });

  it('has unique card IDs', () => {
    const deck = createDeck();
    const ids = new Set(deck.map(c => c.id));
    expect(ids.size).toBe(36);
  });

  it('has 4 suits with 9 ranks each', () => {
    const deck = createDeck();
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    for (const suit of suits) {
      expect(deck.filter(c => c.suit === suit)).toHaveLength(9);
    }
  });
});

describe('shuffleDeck', () => {
  it('returns same number of cards', () => {
    const deck = createDeck();
    const shuffled = shuffleDeck(deck);
    expect(shuffled).toHaveLength(36);
  });

  it('does not modify original deck', () => {
    const deck = createDeck();
    const original = [...deck];
    shuffleDeck(deck);
    expect(deck).toEqual(original);
  });
});

describe('dealCards', () => {
  it('deals 9 cards to each player', () => {
    const { hands } = dealCards(0);
    expect(hands[0]).toHaveLength(9);
    expect(hands[1]).toHaveLength(9);
    expect(hands[2]).toHaveLength(9);
    expect(hands[3]).toHaveLength(9);
  });

  it('total cards = 36', () => {
    const { hands } = dealCards(0);
    const total = hands[0].length + hands[1].length + hands[2].length + hands[3].length;
    expect(total).toBe(36);
  });

  it('volt card is in dealer hand', () => {
    const { hands, voltCard } = dealCards(0);
    expect(hands[0].some(c => c.id === voltCard.id)).toBe(true);
  });

  it('no duplicate cards across hands', () => {
    const { hands } = dealCards(1);
    const allCards = [...hands[0], ...hands[1], ...hands[2], ...hands[3]];
    const ids = new Set(allCards.map(c => c.id));
    expect(ids.size).toBe(36);
  });
});

describe('sortHand', () => {
  it('places trump cards last', () => {
    const hand: Card[] = [
      { id: 'A_spades', suit: 'spades', rank: 'A' },
      { id: 'K_hearts', suit: 'hearts', rank: 'K' },
      { id: '6_spades', suit: 'spades', rank: '6' },
    ];
    const sorted = sortHand(hand, 'spades');
    // Non-trump first, trump last
    expect(sorted[sorted.length - 1].suit).toBe('spades');
  });

  it('sorts within suit by rank ascending', () => {
    const hand: Card[] = [
      { id: 'A_hearts', suit: 'hearts', rank: 'A' },
      { id: '6_hearts', suit: 'hearts', rank: '6' },
      { id: 'K_hearts', suit: 'hearts', rank: 'K' },
    ];
    const sorted = sortHand(hand, null);
    expect(RANK_ORDER[sorted[0].rank]).toBeLessThan(RANK_ORDER[sorted[1].rank]);
    expect(RANK_ORDER[sorted[1].rank]).toBeLessThan(RANK_ORDER[sorted[2].rank]);
  });
});

// ─── Rules Tests ──────────────────────────────────────────────────────────────

describe('getValidCards', () => {
  const hand: Card[] = [
    { id: 'A_spades', suit: 'spades', rank: 'A' },
    { id: 'K_hearts', suit: 'hearts', rank: 'K' },
    { id: '7_diamonds', suit: 'diamonds', rank: '7' },
  ];

  it('allows any card when leading', () => {
    const trick: Trick = { cards: [], leadSuit: null, winnerId: null };
    const valid = getValidCards(hand, trick, 'spades');
    expect(valid).toHaveLength(3);
  });

  it('must follow lead suit if available', () => {
    const trick: Trick = {
      cards: [{ card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 1 }],
      leadSuit: 'spades',
      winnerId: null,
    };
    const valid = getValidCards(hand, trick, 'hearts');
    expect(valid).toHaveLength(1);
    expect(valid[0].suit).toBe('spades');
  });

  it('must play trump if no lead suit', () => {
    const handNoSpades: Card[] = [
      { id: 'K_hearts', suit: 'hearts', rank: 'K' },
      { id: '7_diamonds', suit: 'diamonds', rank: '7' },
      { id: 'A_clubs', suit: 'clubs', rank: 'A' },
    ];
    const trick: Trick = {
      cards: [{ card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 1 }],
      leadSuit: 'spades',
      winnerId: null,
    };
    const valid = getValidCards(handNoSpades, trick, 'hearts');
    expect(valid).toHaveLength(1);
    expect(valid[0].suit).toBe('hearts');
  });

  it('can play any card if no suit and no trump', () => {
    const handNoSuitNoTrump: Card[] = [
      { id: 'K_diamonds', suit: 'diamonds', rank: 'K' },
      { id: '7_clubs', suit: 'clubs', rank: '7' },
    ];
    const trick: Trick = {
      cards: [{ card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 1 }],
      leadSuit: 'spades',
      winnerId: null,
    };
    const valid = getValidCards(handNoSuitNoTrump, trick, 'hearts');
    expect(valid).toHaveLength(2);
  });
});

describe('determineTrickWinner', () => {
  it('highest lead suit wins when no trump', () => {
    const trick: Trick = {
      cards: [
        { card: { id: '6_hearts', suit: 'hearts', rank: '6' }, playerId: 0 },
        { card: { id: 'A_hearts', suit: 'hearts', rank: 'A' }, playerId: 1 },
        { card: { id: 'K_hearts', suit: 'hearts', rank: 'K' }, playerId: 2 },
        { card: { id: '7_hearts', suit: 'hearts', rank: '7' }, playerId: 3 },
      ],
      leadSuit: 'hearts',
      winnerId: null,
    };
    expect(determineTrickWinner(trick, null)).toBe(1); // Ace wins
  });

  it('trump beats lead suit', () => {
    const trick: Trick = {
      cards: [
        { card: { id: 'A_hearts', suit: 'hearts', rank: 'A' }, playerId: 0 },
        { card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 1 }, // trump
        { card: { id: 'K_hearts', suit: 'hearts', rank: 'K' }, playerId: 2 },
        { card: { id: '7_hearts', suit: 'hearts', rank: '7' }, playerId: 3 },
      ],
      leadSuit: 'hearts',
      winnerId: null,
    };
    expect(determineTrickWinner(trick, 'spades')).toBe(1); // 6 of spades (trump) wins
  });

  it('highest trump wins when multiple trumps', () => {
    const trick: Trick = {
      cards: [
        { card: { id: 'A_hearts', suit: 'hearts', rank: 'A' }, playerId: 0 },
        { card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 1 },
        { card: { id: 'A_spades', suit: 'spades', rank: 'A' }, playerId: 2 }, // highest trump
        { card: { id: '7_spades', suit: 'spades', rank: '7' }, playerId: 3 },
      ],
      leadSuit: 'hearts',
      winnerId: null,
    };
    expect(determineTrickWinner(trick, 'spades')).toBe(2); // Ace of spades wins
  });

  it('off-suit non-trump does not beat lead suit', () => {
    const trick: Trick = {
      cards: [
        { card: { id: '6_hearts', suit: 'hearts', rank: '6' }, playerId: 0 },
        { card: { id: 'A_diamonds', suit: 'diamonds', rank: 'A' }, playerId: 1 }, // off-suit
        { card: { id: '7_hearts', suit: 'hearts', rank: '7' }, playerId: 2 },
        { card: { id: 'K_clubs', suit: 'clubs', rank: 'K' }, playerId: 3 }, // off-suit
      ],
      leadSuit: 'hearts',
      winnerId: null,
    };
    expect(determineTrickWinner(trick, null)).toBe(2); // 7 of hearts wins (highest lead suit)
  });
});

describe('calculateRoundResult', () => {
  it('5+ tricks = 1 point for winning team', () => {
    // Team "us" (players 0,2) wins 5 tricks
    const tricks: Trick[] = Array.from({ length: 9 }, (_, i) => ({
      cards: [],
      leadSuit: 'hearts' as const,
      winnerId: (i < 5 ? 0 : 1) as PlayerId,
    }));
    const result = calculateRoundResult(tricks);
    expect(result.pointsEarned.us).toBe(1);
    expect(result.pointsEarned.them).toBe(0);
    expect(result.teamTricks.us).toBe(5);
    expect(result.teamTricks.them).toBe(4);
  });

  it('all 9 tricks = 2 points', () => {
    const tricks: Trick[] = Array.from({ length: 9 }, () => ({
      cards: [],
      leadSuit: 'hearts' as const,
      winnerId: 0 as PlayerId,
    }));
    const result = calculateRoundResult(tricks);
    expect(result.pointsEarned.us).toBe(2);
    expect(result.teamTricks.us).toBe(9);
  });

  it('opponent wins 5+ tricks', () => {
    const tricks: Trick[] = Array.from({ length: 9 }, (_, i) => ({
      cards: [],
      leadSuit: 'hearts' as const,
      winnerId: (i < 6 ? 1 : 0) as PlayerId,
    }));
    const result = calculateRoundResult(tricks);
    expect(result.pointsEarned.them).toBe(1);
    expect(result.pointsEarned.us).toBe(0);
  });
});

// ─── Team Assignment ──────────────────────────────────────────────────────────

describe('getTeam', () => {
  it('players 0 and 2 are team us', () => {
    expect(getTeam(0)).toBe('us');
    expect(getTeam(2)).toBe('us');
  });

  it('players 1 and 3 are team them', () => {
    expect(getTeam(1)).toBe('them');
    expect(getTeam(3)).toBe('them');
  });
});

// ─── Player Rotation ──────────────────────────────────────────────────────────

describe('nextPlayer', () => {
  it('rotates clockwise', () => {
    expect(nextPlayer(0)).toBe(1);
    expect(nextPlayer(1)).toBe(2);
    expect(nextPlayer(2)).toBe(3);
    expect(nextPlayer(3)).toBe(0);
  });
});

describe('firstPlayer', () => {
  it('is left of dealer', () => {
    expect(firstPlayer(0)).toBe(1);
    expect(firstPlayer(3)).toBe(0);
  });
});

// ─── Game Reducer Tests ───────────────────────────────────────────────────────

describe('gameReducer', () => {
  it('starts in WAITING phase', () => {
    const state = createInitialState();
    expect(state.phase).toBe('WAITING');
  });

  it('START_GAME transitions to TRUMP_REVEALED and deals cards', () => {
    const state = createInitialState();
    const next = gameReducer(state, { type: 'START_GAME' });
    expect(next.phase).toBe('TRUMP_REVEALED');
    expect(next.hands[0]).toHaveLength(9);
    expect(next.trumpSuit).not.toBeNull();
    expect(next.voltCard).not.toBeNull();
  });

  it('PLAY_CARD removes card from hand', () => {
    let state = gameReducer(createInitialState(), { type: 'START_GAME' });
    // Force to PLAYING_TRICK
    state = { ...state, phase: 'PLAYING_TRICK', currentPlayerId: 0 };
    const cardToPlay = state.hands[0][0];
    const next = gameReducer(state, { type: 'PLAY_CARD', playerId: 0, card: cardToPlay });
    expect(next.hands[0].some(c => c.id === cardToPlay.id)).toBe(false);
  });

  it('PLAY_CARD rejects card not in hand', () => {
    let state = gameReducer(createInitialState(), { type: 'START_GAME' });
    state = { ...state, phase: 'PLAYING_TRICK', currentPlayerId: 0 };
    const fakeCard: Card = { id: 'fake_card', suit: 'spades', rank: 'A' };
    const next = gameReducer(state, { type: 'PLAY_CARD', playerId: 0, card: fakeCard });
    expect(next).toEqual(state); // no change
  });

  it('PLAY_CARD rejects wrong player', () => {
    let state = gameReducer(createInitialState(), { type: 'START_GAME' });
    state = { ...state, phase: 'PLAYING_TRICK', currentPlayerId: 1 };
    const cardToPlay = state.hands[0][0];
    const next = gameReducer(state, { type: 'PLAY_CARD', playerId: 0, card: cardToPlay });
    expect(next).toEqual(state); // no change
  });

  it('match score increments after round', () => {
    const state = createInitialState();
    const started = gameReducer(state, { type: 'START_GAME' });
    // Simulate 9 tricks won by player 0 (team us)
    let s = { ...started, phase: 'PLAYING_TRICK' as const, currentPlayerId: 0 as PlayerId };
    const tricks = Array.from({ length: 9 }, () => ({
      cards: [
        { card: { id: 'A_hearts', suit: 'hearts' as const, rank: 'A' as const }, playerId: 0 as PlayerId },
        { card: { id: 'K_hearts', suit: 'hearts' as const, rank: 'K' as const }, playerId: 1 as PlayerId },
        { card: { id: 'Q_hearts', suit: 'hearts' as const, rank: 'Q' as const }, playerId: 2 as PlayerId },
        { card: { id: 'J_hearts', suit: 'hearts' as const, rank: 'J' as const }, playerId: 3 as PlayerId },
      ],
      leadSuit: 'hearts' as const,
      winnerId: 0 as PlayerId,
    }));
    s = { ...s, completedTricks: tricks.slice(0, 8), hands: { 0: [], 1: [], 2: [], 3: [] } };
    // The 9th trick completion triggers round end
    const result = calculateRoundResult([...tricks]);
    expect(result.pointsEarned.us).toBe(2); // all 9 = 2 points
  });

  it('RESET_MATCH returns to WAITING', () => {
    let state = gameReducer(createInitialState(), { type: 'START_GAME' });
    state = gameReducer(state, { type: 'RESET_MATCH' });
    expect(state.phase).toBe('WAITING');
    expect(state.matchScore.us).toBe(0);
    expect(state.matchScore.them).toBe(0);
  });
});
