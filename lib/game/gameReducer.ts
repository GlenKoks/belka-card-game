import { Card, GameState, PlayerId, Team } from './types';
import { dealCards, sortHand } from './deck';
import {
  getValidCards,
  determineTrickWinner,
  calculateCardPoints,
  calculateEyes,
} from './rules';

export type GameAction =
  | { type: 'START_GAME'; winThreshold?: number; playerNames?: Record<PlayerId, string> }
  | { type: 'DEAL_CARDS' }
  | { type: 'PLAY_CARD'; playerId: PlayerId; card: Card }
  | { type: 'RESOLVE_TRICK' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESET_MATCH' }
  | { type: 'START_PLAYING' }
  | { type: 'UPDATE_SETTINGS'; winThreshold: number; playerNames: Record<PlayerId, string> };

export function createInitialState(
  winThreshold = 12,
  playerNames?: Record<PlayerId, string>
): GameState {
  return {
    phase: 'WAITING',
    matchScore: { black: 0, red: 0 },
    winThreshold,
    teamAssignment: { 0: 'red', 1: 'red', 2: 'red', 3: 'red' }, // will be set in round 1
    round: 0,
    dealerId: Math.floor(Math.random() * 4) as PlayerId,
    currentPlayerId: 0,
    suitAssignment: { 0: null, 1: null, 2: null, 3: null },
    hands: { 0: [], 1: [], 2: [], 3: [] },
    trumpSuit: null,
    voltCard: null,
    trumpHolderId: null,
    currentTrick: { cards: [], leadSuit: null, winnerId: null },
    completedTricks: [],
    lastRoundResult: null,
    previousRoundWasEggs: false,
    playerNames: playerNames ?? {
      0: 'Вы',
      1: 'Игрок 2',
      2: 'Партнёр',
      3: 'Игрок 4',
    },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const base = createInitialState(
        action.winThreshold ?? state.winThreshold,
        action.playerNames ?? state.playerNames
      );
      return dealRound({ ...base, phase: 'DEALING', round: 1 });
    }

    case 'DEAL_CARDS': {
      return dealRound(state);
    }

    case 'PLAY_CARD': {
      const { playerId, card } = action;
      if (state.phase !== 'PLAYING_TRICK') return state;
      if (state.currentPlayerId !== playerId) return state;

      const hand = state.hands[playerId];
      if (!hand.find(c => c.id === card.id)) return state;

      const valid = getValidCards(hand, state.currentTrick, state.trumpSuit);
      if (!valid.find(c => c.id === card.id)) return state;

      const newHand = hand.filter(c => c.id !== card.id);
      const newTrick = {
        ...state.currentTrick,
        cards: [...state.currentTrick.cards, { card, playerId }],
        leadSuit: state.currentTrick.leadSuit || card.suit,
      };

      const nextPlayerId = (playerId + 1) % 4 as PlayerId;
      const phase = newTrick.cards.length === 4 ? 'TRICK_RESOLVED' : 'PLAYING_TRICK';

      return {
        ...state,
        hands: { ...state.hands, [playerId]: newHand },
        currentTrick: newTrick,
        currentPlayerId: nextPlayerId,
        phase,
      };
    }

    case 'RESOLVE_TRICK': {
      if (state.phase !== 'TRICK_RESOLVED') return state;

      const winnerId = determineTrickWinner(state.currentTrick, state.trumpSuit);
      const completedTrick = { ...state.currentTrick, winnerId };
      const completedTricks = [...state.completedTricks, completedTrick];

      const phase = completedTricks.length === 9 ? 'ROUND_FINISHED' : 'PLAYING_TRICK';
      const currentPlayerId = winnerId ?? 0;

      return {
        ...state,
        completedTricks,
        currentTrick: { cards: [], leadSuit: null, winnerId: null },
        currentPlayerId,
        phase,
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'ROUND_FINISHED') return state;

      // Calculate round result
      const blackPlayers: PlayerId[] = [0, 1, 2, 3].filter(
        p => state.teamAssignment[p as PlayerId] === 'black'
      ) as PlayerId[];
      const redPlayers: PlayerId[] = [0, 1, 2, 3].filter(
        p => state.teamAssignment[p as PlayerId] === 'red'
      ) as PlayerId[];

      const blackPoints = calculateCardPoints(state.completedTricks, blackPlayers);
      const redPoints = calculateCardPoints(state.completedTricks, redPlayers);
      const blackTricks = state.completedTricks.filter(
        t => t.winnerId !== null && blackPlayers.includes(t.winnerId)
      ).length;
      const redTricks = state.completedTricks.filter(
        t => t.winnerId !== null && redPlayers.includes(t.winnerId)
      ).length;

      const { black: eyesBlack, red: eyesRed, wasEggs } = calculateEyes(
        blackPoints,
        redPoints,
        blackTricks,
        redTricks,
        state.trumpHolderId,
        state.teamAssignment,
        state.previousRoundWasEggs
      );

      const newMatchScore = {
        black: state.matchScore.black + eyesBlack,
        red: state.matchScore.red + eyesRed,
      };

      const roundResult = {
        trickCounts: {
          0: state.completedTricks.filter(t => t.winnerId === 0).length,
          1: state.completedTricks.filter(t => t.winnerId === 1).length,
          2: state.completedTricks.filter(t => t.winnerId === 2).length,
          3: state.completedTricks.filter(t => t.winnerId === 3).length,
        },
        teamTricks: { black: blackTricks, red: redTricks },
        cardPoints: { black: blackPoints, red: redPoints },
        eyesEarned: { black: eyesBlack, red: eyesRed },
        wasEggs,
      };

      // Check if match is finished
      if (
        newMatchScore.black >= state.winThreshold ||
        newMatchScore.red >= state.winThreshold
      ) {
        return {
          ...state,
          phase: 'MATCH_FINISHED',
          matchScore: newMatchScore,
          lastRoundResult: roundResult,
        };
      }

      // Continue to next round - prepare state and deal cards immediately
      const nextRound = state.round + 1;
      const nextDealerId = (state.dealerId + 1) % 4 as PlayerId;
      const newState: GameState = {
        ...state,
        round: nextRound,
        dealerId: nextDealerId,
        currentPlayerId: nextDealerId,
        hands: { 0: [], 1: [], 2: [], 3: [] },
        trumpSuit: null,
        voltCard: null,
        trumpHolderId: null,
        currentTrick: { cards: [], leadSuit: null, winnerId: null },
        completedTricks: [],
        phase: 'DEALING' as const,
        matchScore: newMatchScore,
        lastRoundResult: roundResult,
        previousRoundWasEggs: wasEggs,
      };

      // Deal cards for next round
      const dealtState = dealRound(newState);
      // Automatically transition to TRUMP_REVEALED phase
      return { ...dealtState, phase: 'TRUMP_REVEALED' as const };
    }

    case 'START_PLAYING': {
      if (state.phase !== 'TRUMP_REVEALED') return state;
      return { ...state, phase: 'PLAYING_TRICK' };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        winThreshold: action.winThreshold,
        playerNames: action.playerNames,
      };
    }

    case 'RESET_MATCH': {
      return createInitialState(state.winThreshold, state.playerNames);
    }

    default:
      return state;
  }
}

function dealRound(state: GameState): GameState {
  const dealerId = state.dealerId;
  const { hands, voltCard } = dealCards(dealerId);

  // Determine trump suit
  let trumpSuit = state.trumpSuit;
  let trumpHolderId = state.trumpHolderId;
  let teamAssignment = state.teamAssignment;
  let suitAssignment = state.suitAssignment;

  if (state.round === 1) {
    // Round 1: trump is always clubs
    trumpSuit = 'clubs';

    // Find who has Валет Крести (Jack of Clubs)
    for (let i = 0; i < 4; i++) {
      const playerId = i as PlayerId;
      const hasJackOfClubs = hands[playerId].some(c => c.rank === 'J' && c.suit === 'clubs');
      if (hasJackOfClubs) {
        trumpHolderId = playerId;
        // Black team: this player + opposite
        const oppositePlayer = (playerId + 2) % 4 as PlayerId;
        teamAssignment = {
          [playerId]: 'black',
          [oppositePlayer]: 'black',
          [(playerId + 1) % 4]: 'red',
          [(playerId + 3) % 4]: 'red',
        } as Record<PlayerId, Team>;
        break;
      }
    }

    // Set suit assignments based on which jack each player has
    for (let i = 0; i < 4; i++) {
      const playerId = i as PlayerId;
      const jacks = hands[playerId].filter(c => c.rank === 'J');
      if (jacks.length > 0) {
        suitAssignment[playerId] = jacks[0].suit;
      }
    }
  } else {
    // Rounds 2+: determine trump based on suit assignment
    // The player with the jack of their assigned suit determines the trump
    for (let i = 0; i < 4; i++) {
      const playerId = i as PlayerId;
      const assignedSuit = suitAssignment[playerId];
      if (assignedSuit) {
        const hasJack = hands[playerId].some(c => c.rank === 'J' && c.suit === assignedSuit);
        if (hasJack) {
          trumpSuit = assignedSuit;
          trumpHolderId = playerId;
          break;
        }
      }
    }
  }

  // Get volt card (last card dealt to dealer)
  const dealerHand = hands[dealerId];
  const volt = dealerHand[dealerHand.length - 1] || null;

  // Sort hands
  const sortedHands = {
    0: sortHand(hands[0], trumpSuit),
    1: sortHand(hands[1], trumpSuit),
    2: sortHand(hands[2], trumpSuit),
    3: sortHand(hands[3], trumpSuit),
  };

  // First player to play is the one after dealer
  const firstPlayerId = (dealerId + 1) % 4 as PlayerId;

  return {
    ...state,
    hands: sortedHands,
    trumpSuit,
    voltCard: volt,
    trumpHolderId,
    teamAssignment,
    suitAssignment,
    currentPlayerId: firstPlayerId,
    phase: 'TRUMP_REVEALED',
  };
}
