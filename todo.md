# Белка Card Game — TODO

## Core Game Engine
- [x] Card and deck types (36 cards, 4 suits, 9 ranks)
- [x] Deck shuffle and deal (9 cards per player)
- [x] Trump/Volt determination (last card of dealer)
- [x] Game state machine (DEALING → TRUMP_REVEALED → PLAYING_TRICK → TRICK_RESOLVED → ROUND_FINISHED → MATCH_FINISHED)
- [x] Valid move validation (must follow suit, must trump if no suit)
- [x] Trick winner determination (highest trump or highest lead suit)
- [x] Round scoring (5+ tricks = 1pt, all 9 = 2pts)
- [x] Match scoring (first to 10 points wins)
- [x] Dealer rotation (clockwise each round)
- [x] First player (left of dealer)

## AI Opponents
- [x] Basic AI: follow suit if possible, else trump, else discard lowest
- [x] AI plays automatically with short delay

## App Structure & Navigation
- [x] Theme config update (green felt palette)
- [x] Home screen with New Game button
- [x] Game Table screen (full gameplay)
- [x] Round Result overlay
- [x] Match Result screen
- [x] Settings screen (win threshold, player names)
- [x] Tab navigation setup

## Game Table UI
- [x] Score bar (top)
- [x] Trump badge indicator
- [x] Opponent hands (face-down fans) — top, left, right
- [x] Trick area (center, 4 card slots)
- [x] Player hand (bottom, face-up, horizontal fan)
- [x] Card component (face-up/down, highlight, press)
- [x] Player labels with card count
- [x] Turn indicator
- [x] Volt card display

## UX Polish
- [x] Playable cards highlighted (gold glow)
- [x] Hand auto-sorted by suit then rank (trump last)
- [x] Invalid cards dimmed
- [x] Trump suit displayed prominently
- [x] Phase status text (whose turn it is)
- [x] Trick score counter
- [x] Haptic feedback on card play
- [x] Settings save persists to game state

## Branding
- [x] App logo generated
- [x] Theme colors updated (green felt)
- [x] App name set to "Белка"
