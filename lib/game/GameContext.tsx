import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { GameState, PlayerId, Card } from './types';
import { gameReducer, GameAction, createInitialState } from './gameReducer';
import { selectAICard } from './ai';
import { getValidCards } from './rules';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playCard: (card: Card) => void;
  startGame: (winThreshold?: number, playerNames?: Record<PlayerId, string>) => void;
  nextRound: () => void;
  startNextRound: () => void;
  resetMatch: () => void;
  getValidCardsForPlayer: (playerId: PlayerId) => Card[];
}

const GameContext = createContext<GameContextValue | null>(null);

const AI_DELAY_MS = 900; // ms between AI moves

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const clearAITimer = useCallback(() => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }, []);

  // AI automation: trigger AI moves when it's an AI player's turn
  useEffect(() => {
    const s = state;

    // AI plays during PLAYING_TRICK phase for players 1, 2, 3
    if (s.phase === 'PLAYING_TRICK' && s.currentPlayerId !== 0) {
      clearAITimer();
      aiTimerRef.current = setTimeout(() => {
        const currentState = stateRef.current;
        if (
          currentState.phase === 'PLAYING_TRICK' &&
          currentState.currentPlayerId !== 0
        ) {
          const card = selectAICard(currentState, currentState.currentPlayerId);
          dispatch({
            type: 'PLAY_CARD',
            playerId: currentState.currentPlayerId,
            card,
          });
        }
      }, AI_DELAY_MS);
    }

    // Auto-advance after trick resolved (brief pause to show result)
    if (s.phase === 'TRICK_RESOLVED') {
      clearAITimer();
      aiTimerRef.current = setTimeout(() => {
        const currentState = stateRef.current;
        if (currentState.phase === 'TRICK_RESOLVED') {
          dispatch({ type: 'RESOLVE_TRICK' });
        }
      }, 1200);
    }

    // Auto-start playing after trump revealed
    if (s.phase === 'TRUMP_REVEALED') {
      clearAITimer();
      aiTimerRef.current = setTimeout(() => {
        const currentState = stateRef.current;
        if (currentState.phase === 'TRUMP_REVEALED') {
          dispatch({ type: 'START_PLAYING' });
        }
      }, 1500);
    }

    return () => clearAITimer();
  }, [state.phase, state.currentPlayerId, clearAITimer]);

  const playCard = useCallback((card: Card) => {
    const s = stateRef.current;
    if (s.phase !== 'PLAYING_TRICK' || s.currentPlayerId !== 0) return;
    dispatch({ type: 'PLAY_CARD', playerId: 0, card });
  }, []);

  const startGame = useCallback(
    (winThreshold?: number, playerNames?: Record<PlayerId, string>) => {
      clearAITimer();
      dispatch({ type: 'START_GAME', winThreshold, playerNames });
    },
    [clearAITimer]
  );

  const nextRound = useCallback(() => {
    clearAITimer();
    dispatch({ type: 'NEXT_ROUND' });
  }, [clearAITimer]);

  const startNextRound = useCallback(() => {
    clearAITimer();
    dispatch({ type: 'START_NEXT_ROUND' });
  }, [clearAITimer]);

  const resetMatch = useCallback(() => {
    clearAITimer();
    dispatch({ type: 'RESET_MATCH' });
  }, [clearAITimer]);

  const getValidCardsForPlayer = useCallback(
    (playerId: PlayerId) => {
      const s = stateRef.current;
      if (s.phase !== 'PLAYING_TRICK' || s.currentPlayerId !== playerId) return [];
      return getValidCards(s.hands[playerId], s.currentTrick, s.trumpSuit);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  );

  return (
    <GameContext.Provider
      value={{ state, dispatch, playCard, startGame, nextRound, startNextRound, resetMatch, getValidCardsForPlayer }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
