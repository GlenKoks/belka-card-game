import { GameState, GamePhase, PlayerId, Card, Trick } from './types';
import { dealCards, sortHand } from './deck';
import {
  getValidCards,
  determineTrickWinner,
  calculateRoundResult,
  firstPlayer,
  nextPlayer,
  getTeam,
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
  winThreshold = 10,
  playerNames?: Record<PlayerId, string>
): GameState {
  return {
    phase: 'WAITING',
    matchScore: { us: 0, them: 0 },
    winThreshold,
    round: 0,
    dealerId: Math.floor(Math.random() * 4) as PlayerId,
    currentPlayerId: 0,
    hands: { 0: [], 1: [], 2: [], 3: [] },
    trumpSuit: null,
    voltCard: null,
    currentTrick: { cards: [], leadSuit: null, winnerId: null },
    completedTricks: [],
    lastRoundResult: null,
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
      // Deal immediately
      return dealRound({ ...base, phase: 'DEALING', round: 1 });
    }

    case 'DEAL_CARDS': {
      return dealRound(state);
    }

    case 'PLAY_CARD': {
      const { playerId, card } = action;
      if (state.phase !== 'PLAYING_TRICK') return state;
      if (state.currentPlayerId !== playerId) return state;

      // Validate card is in hand
      const hand = state.hands[playerId];
      if (!hand.find(c => c.id === card.id)) return state;

      // Validate card is a valid play
      const valid = getValidCards(hand, state.currentTrick, state.trumpSuit);
      if (!valid.find(c => c.id === card.id)) return state;

      // Remove card from hand
      const newHand = hand.filter(c => c.id !== card.id);

      // Determine lead suit
      const leadSuit = state.currentTrick.cards.length === 0
        ? card.suit
        : state.currentTrick.leadSuit;

      // Add card to trick
      const newTrickCards = [
        ...state.currentTrick.cards,
        { card, playerId },
      ];

      const newTrick: Trick = {
        ...state.currentTrick,
        cards: newTrickCards,
        leadSuit,
      };

      const newHands = { ...state.hands, [playerId]: newHand };

      // If trick is complete (4 cards), resolve it
      if (newTrickCards.length === 4) {
        const winnerId = determineTrickWinner(
          { ...newTrick, winnerId: null },
          state.trumpSuit
        );
        const resolvedTrick: Trick = { ...newTrick, winnerId };
        const completedTricks = [...state.completedTricks, resolvedTrick];

        // Check if round is over (9 tricks)
        if (completedTricks.length === 9) {
          const result = calculateRoundResult(completedTricks);
          const newMatchScore = {
            us: state.matchScore.us + result.pointsEarned.us,
            them: state.matchScore.them + result.pointsEarned.them,
          };

          const isMatchOver =
            newMatchScore.us >= state.winThreshold ||
            newMatchScore.them >= state.winThreshold;

          return {
            ...state,
            hands: newHands,
            currentTrick: resolvedTrick,
            completedTricks,
            currentPlayerId: winnerId,
            matchScore: newMatchScore,
            lastRoundResult: result,
            phase: isMatchOver ? 'MATCH_FINISHED' : 'ROUND_FINISHED',
          };
        }

        // Trick resolved, winner leads next
        return {
          ...state,
          hands: newHands,
          currentTrick: resolvedTrick,
          completedTricks,
          currentPlayerId: winnerId,
          phase: 'TRICK_RESOLVED',
        };
      }

      // Trick in progress — next player's turn
      return {
        ...state,
        hands: newHands,
        currentTrick: newTrick,
        currentPlayerId: nextPlayer(playerId),
        phase: 'PLAYING_TRICK',
      };
    }

    case 'RESOLVE_TRICK': {
      // Start next trick — winner already set as currentPlayerId
      if (state.phase !== 'TRICK_RESOLVED') return state;
      return {
        ...state,
        currentTrick: { cards: [], leadSuit: null, winnerId: null },
        phase: 'PLAYING_TRICK',
      };
    }

    case 'NEXT_ROUND': {
      if (state.phase !== 'ROUND_FINISHED') return state;
      const newDealerId = nextPlayer(state.dealerId);
      return dealRound({
        ...state,
        round: state.round + 1,
        dealerId: newDealerId,
        phase: 'DEALING',
        completedTricks: [],
        currentTrick: { cards: [], leadSuit: null, winnerId: null },
        lastRoundResult: null,
      });
    }

    case 'RESET_MATCH': {
      return createInitialState(state.winThreshold, state.playerNames);
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

    default:
      return state;
  }
}

function dealRound(state: GameState): GameState {
  const { hands, voltCard } = dealCards(state.dealerId);
  const trumpSuit = voltCard.suit;

  // Sort all hands
  const sortedHands = {
    0: sortHand(hands[0], trumpSuit),
    1: sortHand(hands[1], trumpSuit),
    2: sortHand(hands[2], trumpSuit),
    3: sortHand(hands[3], trumpSuit),
  };

  const first = firstPlayer(state.dealerId);

  return {
    ...state,
    hands: sortedHands,
    trumpSuit,
    voltCard,
    currentPlayerId: first,
    currentTrick: { cards: [], leadSuit: null, winnerId: null },
    completedTricks: [],
    phase: 'TRUMP_REVEALED',
  };
}
