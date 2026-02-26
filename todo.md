# Белка Card Game — TODO (Eyes System Update)

## Eyes Scoring System (NEW)
- [ ] Rename "очки" to "Глаза" (Eyes)
- [ ] Win threshold: 12 Eyes (instead of 12 points)
- [ ] Team assignment: Round 1 determines teams (Валет Крести holder + opposite = Black team, others = Red team)
- [ ] Teams persist throughout entire match
- [ ] Implement Eyes calculation with conditional rules:
  - Opponent <14 points: Winner gets 5 Eyes (trump with winner) or 6 Eyes (trump with loser)
  - Opponent 14-30 points: Winner gets 3 Eyes (trump with winner) or 2 Eyes (trump with loser) or 4 Eyes (no save)
  - Opponent 31+ points: Winner gets 1 Eye (trump with winner) or 2 Eyes (trump with loser)
  - Opponent 0 tricks: Winner gets 12 Eyes
- [ ] Eggs (equal points): No Eyes awarded, next round winner gets 4 Eyes regardless
- [ ] Track if previous round was Eggs

## UI Updates for Eyes System
- [ ] Create Eyes visualization component (black/red eyes)
- [ ] Update ScoreBar to show Eyes with team colors
- [ ] Add Eyes animation on round result
- [ ] Update RoundResultModal to show Eyes calculation breakdown

## Testing
- [ ] Unit tests for team assignment
- [ ] Unit tests for Eyes calculation (all conditional rules)
- [ ] Unit tests for Eggs handling
- [ ] Unit tests for post-Eggs bonus

## Completed (Previous)
- [x] App logo generated
- [x] Theme colors updated (green felt)
- [x] App name set to "Белка"
- [x] Core game structure
- [x] AI opponents
- [x] Basic UI screens
- [x] Card point scoring: К=4, Д=3, В=2, 10=10, Т=11
- [x] Jack hierarchy: Валет Крести > Пики > Черви > Буби
- [x] All jacks are treated as trump (not by their suit)
- [x] Round 1: trump is always Clubs (Крести)
- [x] Round 1 determines suit assignment for each player
- [x] Rounds 2+: trump determined by which player has the jack for their assigned suit
- [x] Jack-led trick: must play trump/jack only
- [x] Regular card led: follow suit (jacks excluded), then trump/jack, then any
- [x] Jacks have no suit - they are always trump
- [x] Cannot play jack when following suit (jack is not a suit card)
- [x] Move trump badge to top-left to avoid overlapping right player card
- [x] Add lead suit indicator at top-right showing which suit was led
