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
// Teams: [0,2] vs [1,3]

export type Team = 'us' | 'them';
// Team "us" = players 0 and 2
// Team "them" = players 1 and 3

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
  teamTricks: { us: number; them: number };
  cardPoints: { us: number; them: number };
  pointsEarned: { us: number; them: number };
}

export interface GameState {
  phase: GamePhase;
  // Match state
  matchScore: { us: number; them: number };
  winThreshold: number;
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
  // Trick state
  currentTrick: Trick;
  completedTricks: Trick[];
  // Results
  lastRoundResult: RoundResult | null;
  // Player names
  playerNames: Record<PlayerId, string>;
}
