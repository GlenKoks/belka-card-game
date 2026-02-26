# Белка Card Game — TODO (Updated Rules)

## Game Rules Update
- [x] Card point scoring: К=4, Д=3, В=2, 10=10, Т=11 (only for taken tricks)
- [x] Jack hierarchy: Валет Крести (1st) > Пики (2nd) > Черви (3rd) > Буби (4th)
- [x] All jacks are treated as trump (not by their suit)
- [x] Round 1: trump is always Clubs (Крести)
- [x] Round 1 determines suit assignment for each player (based on which jack they get)
- [x] Rounds 2+: trump determined by which player has the jack for their assigned suit
- [x] Win threshold: 12 points (2 points per round to winner)

## Game Engine Updates
- [x] Update card point values in scoring
- [x] Implement jack hierarchy in trick winner determination
- [x] Implement suit assignment system (tracks which suit each player is responsible for)
- [x] Implement jack-based trump determination for round 2+
- [x] Update round result calculation with card point totals
- [x] Update match score logic (2 points per round to winner)

## UI Redesign (Easy Poker style)
- [x] Minimalist layout with large card display
- [x] Simplified player avatars/positions
- [x] Clean, spacious design
- [x] Larger cards in trick area
- [x] Simplified score display
- [x] Remove decorative elements, focus on clarity

## Round Result Screen
- [x] Show card point breakdown (which cards each team took)
- [x] Show total points for each team
- [x] Show round winner and points earned

## Match Result Screen
- [x] Update to show final score out of 12

## Testing
- [x] Unit tests for new card point scoring
- [x] Unit tests for jack hierarchy
- [x] Unit tests for suit assignment
- [x] Unit tests for jack-based trump determination

## Completed (Previous)
- [x] App logo generated
- [x] Theme colors updated (green felt)
- [x] App name set to "Белка"
- [x] Core game structure
- [x] AI opponents
- [x] Basic UI screens
