import { describe, it, expect } from 'vitest';
import { createInitialState, gameReducer } from '../gameReducer';
import { getValidCards, determineTrickWinner, calculateCardPoints, calculateEyes } from '../rules';
import { Card, Trick, PlayerId, GameState } from '../types';

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

  it('must play trump/jack if jack was led', () => {
    const hand: Card[] = [
      { id: 'A_spades', suit: 'spades', rank: 'A' },
      { id: 'K_hearts', suit: 'hearts', rank: 'K' },
      { id: 'J_diamonds', suit: 'diamonds', rank: 'J' },
    ];
    const trick: Trick = {
      cards: [{ card: { id: 'J_clubs', suit: 'clubs', rank: 'J' }, playerId: 1 }],
      leadSuit: 'clubs',
      winnerId: null,
    };
    const valid = getValidCards(hand, trick, 'hearts');
    expect(valid.length).toBeGreaterThan(0);
    expect(valid.some(c => c.suit === 'hearts' || c.rank === 'J')).toBe(true);
  });

  it('cannot play jack when following suit', () => {
    const hand: Card[] = [
      { id: '8_spades', suit: 'spades', rank: '8' },
      { id: 'J_spades', suit: 'spades', rank: 'J' },
    ];
    const trick: Trick = {
      cards: [{ card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 1 }],
      leadSuit: 'spades',
      winnerId: null,
    };
    const valid = getValidCards(hand, trick, 'hearts');
    expect(valid).toHaveLength(1);
    expect(valid[0].id).toBe('8_spades');
  });
});

describe('determineTrickWinner', () => {
  it('highest lead suit wins when no trump', () => {
    const trick: Trick = {
      cards: [
        { card: { id: '6_spades', suit: 'spades', rank: '6' }, playerId: 0 },
        { card: { id: 'A_spades', suit: 'spades', rank: 'A' }, playerId: 1 },
      ],
      leadSuit: 'spades',
      winnerId: null,
    };
    const winner = determineTrickWinner(trick, 'hearts');
    expect(winner).toBe(1);
  });

  it('trump beats non-trump', () => {
    const trick: Trick = {
      cards: [
        { card: { id: 'A_spades', suit: 'spades', rank: 'A' }, playerId: 0 },
        { card: { id: '6_hearts', suit: 'hearts', rank: '6' }, playerId: 1 },
      ],
      leadSuit: 'spades',
      winnerId: null,
    };
    const winner = determineTrickWinner(trick, 'hearts');
    expect(winner).toBe(1);
  });

  it('jack beats non-jack', () => {
    const trick: Trick = {
      cards: [
        { card: { id: 'A_spades', suit: 'spades', rank: 'A' }, playerId: 0 },
        { card: { id: 'J_hearts', suit: 'hearts', rank: 'J' }, playerId: 1 },
      ],
      leadSuit: 'spades',
      winnerId: null,
    };
    const winner = determineTrickWinner(trick, 'diamonds');
    expect(winner).toBe(1);
  });

  it('higher jack beats lower jack', () => {
    const trick: Trick = {
      cards: [
        { card: { id: 'J_diamonds', suit: 'diamonds', rank: 'J' }, playerId: 0 },
        { card: { id: 'J_clubs', suit: 'clubs', rank: 'J' }, playerId: 1 },
      ],
      leadSuit: 'diamonds',
      winnerId: null,
    };
    const winner = determineTrickWinner(trick, 'hearts');
    expect(winner).toBe(1);
  });
});

describe('calculateCardPoints', () => {
  it('sums card points from tricks won by team', () => {
    const tricks: Trick[] = [
      {
        cards: [
          { card: { id: 'K_spades', suit: 'spades', rank: 'K' }, playerId: 0 },
          { card: { id: '6_hearts', suit: 'hearts', rank: '6' }, playerId: 1 },
        ],
        leadSuit: 'spades',
        winnerId: 0,
      },
      {
        cards: [
          { card: { id: 'A_hearts', suit: 'hearts', rank: 'A' }, playerId: 1 },
          { card: { id: '7_spades', suit: 'spades', rank: '7' }, playerId: 0 },
        ],
        leadSuit: 'hearts',
        winnerId: 1,
      },
    ];
    const points = calculateCardPoints(tricks, [0, 2]);
    expect(points).toBe(4);
  });
});

describe('calculateEyes', () => {
  it('returns 0 eyes for Eggs', () => {
    const result = calculateEyes(50, 50, 5, 4, 0, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(0);
    expect(result.red).toBe(0);
    expect(result.wasEggs).toBe(true);
  });

  it('returns 12 eyes for all 9 tricks', () => {
    const result = calculateEyes(100, 0, 9, 0, 0, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(12);
    expect(result.red).toBe(0);
  });

  it('returns 4 eyes after Eggs', () => {
    const result = calculateEyes(50, 40, 5, 4, 0, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, true);
    expect(result.black).toBe(4);
    expect(result.red).toBe(0);
  });

  it('returns 5 eyes for opponent <14 points, trump with winner', () => {
    const result = calculateEyes(60, 10, 5, 4, 0, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(5);
    expect(result.red).toBe(0);
  });

  it('returns 6 eyes for opponent <14 points, trump with loser', () => {
    const result = calculateEyes(60, 10, 5, 4, 1, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(6);
    expect(result.red).toBe(0);
  });

  it('returns 3 eyes for opponent 14-30 points, trump with winner', () => {
    const result = calculateEyes(60, 20, 5, 4, 0, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(3);
    expect(result.red).toBe(0);
  });

  it('returns 4 eyes for opponent 14-30 points, trump with loser', () => {
    const result = calculateEyes(60, 20, 5, 4, 1, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(4);
    expect(result.red).toBe(0);
  });

  it('returns 1 eye for opponent 31+ points, trump with winner', () => {
    const result = calculateEyes(60, 40, 5, 4, 0, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(1);
    expect(result.red).toBe(0);
  });

  it('returns 2 eyes for opponent 31+ points, trump with loser', () => {
    const result = calculateEyes(60, 40, 5, 4, 1, { 0: 'black', 1: 'red', 2: 'black', 3: 'red' }, false);
    expect(result.black).toBe(2);
    expect(result.red).toBe(0);
  });
});

describe('gameReducer', () => {
  it('START_GAME initializes game to TRUMP_REVEALED', () => {
    let state = gameReducer(createInitialState(), { type: 'START_GAME' });
    expect(state.phase).toBe('TRUMP_REVEALED');
    expect(state.round).toBe(1);
    expect(state.trumpSuit).toBe('clubs');
  });

  it('RESET_MATCH returns to WAITING', () => {
    let state = gameReducer(createInitialState(), { type: 'START_GAME' });
    state = gameReducer(state, { type: 'RESET_MATCH' });
    expect(state.phase).toBe('WAITING');
    expect(state.matchScore.black).toBe(0);
    expect(state.matchScore.red).toBe(0);
  });
});

describe('round transitions', () => {
  it('stores round result on last trick so next round can start from modal action', () => {
    const finishedTricks: Trick[] = Array.from({ length: 8 }, (_, i) => ({
      cards: [
        { card: { id: `6_spades_${i}`, suit: 'spades', rank: '6' }, playerId: 0 as PlayerId },
      ],
      leadSuit: 'spades',
      winnerId: 0 as PlayerId,
    }));

    const stateBeforeLastTrick: GameState = {
      ...createInitialState(100),
      phase: 'TRICK_RESOLVED' as const,
      round: 1,
      teamAssignment: { 0: 'black', 1: 'red', 2: 'black', 3: 'red' } as const,
      trumpHolderId: 0 as PlayerId,
      trumpSuit: 'clubs' as const,
      completedTricks: finishedTricks,
      currentTrick: {
        cards: [
          { card: { id: 'A_spades', suit: 'spades', rank: 'A' }, playerId: 0 as PlayerId },
          { card: { id: 'K_spades', suit: 'spades', rank: 'K' }, playerId: 1 as PlayerId },
          { card: { id: 'Q_spades', suit: 'spades', rank: 'Q' }, playerId: 2 as PlayerId },
          { card: { id: '7_spades', suit: 'spades', rank: '7' }, playerId: 3 as PlayerId },
        ],
        leadSuit: 'spades' as const,
        winnerId: null,
      },
    };

    const roundFinished = gameReducer(stateBeforeLastTrick, { type: 'RESOLVE_TRICK' });

    expect(roundFinished.phase).toBe('ROUND_FINISHED');
    expect(roundFinished.lastRoundResult).not.toBeNull();
    expect(roundFinished.matchScore.black).toBeGreaterThan(0);

    const nextRound = gameReducer(roundFinished, { type: 'NEXT_ROUND' });
    expect(nextRound.round).toBe(2);
    expect(nextRound.phase).toBe('PLAYING_TRICK');
    expect(nextRound.lastRoundResult).toBeNull();
  });
});
