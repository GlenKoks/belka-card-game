// ============================================================
// Белка Card Game — Core Types
// ============================================================

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // e.g. "A_spades"
}

export type PlayerId = 0 | 1 | 2 | 3;
// Seating: 0=Bottom (human), 1=Left, 2=Top, 3=Right

export type Team = 'black' | 'red';
// Team assignment determined in round 1 by Валет Крести holder
// Black team: Валет Крести holder + opposite player
// Red team: remaining two players

export interface TrickCard {
  card: Card;
  playerId: PlayerId;
}

export interface Trick {
  cards: TrickCard[];
  leadSuit: Suit | null;
  winnerId: PlayerId | null;
}

export type GamePhase =
  | 'WAITING'
  | 'DEALING'
  | 'TRUMP_REVEALED'
  | 'PLAYING_TRICK'
  | 'TRICK_RESOLVED'
  | 'ROUND_FINISHED'
  | 'MATCH_FINISHED';

export interface RoundResult {
  trickCounts: Record<PlayerId, number>;
  teamTricks: { black: number; red: number };
  cardPoints: { black: number; red: number };
  eyesEarned: { black: number; red: number };
  wasEggs: boolean; // true if both teams had equal points
}

export interface GameState {
  phase: GamePhase;
  // Match state
  matchScore: { black: number; red: number };
  winThreshold: number;
  // Team assignment (determined in round 1, fixed for entire match)
  teamAssignment: Record<PlayerId, Team>; // which team each player belongs to
  // Round state
  round: number;
  dealerId: PlayerId;
  currentPlayerId: PlayerId;
  // Suit assignment (determined in round 1, fixed for entire match)
  suitAssignment: Record<PlayerId, Suit | null>;
  // Cards
  hands: Record<PlayerId, Card[]>;
  trumpSuit: Suit | null;
  voltCard: Card | null; // the card that revealed trump
  trumpHolderId: PlayerId | null; // player who has the trump-determining jack
  // Trick state
  currentTrick: Trick;
  completedTricks: Trick[];
  // Results
  lastRoundResult: RoundResult | null;
  previousRoundWasEggs: boolean; // true if previous round had equal points
  // Player names
  playerNames: Record<PlayerId, string>;
}
