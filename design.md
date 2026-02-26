# Белка — Card Game: Interface Design

## Brand & Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `background` | `#0A3D1F` | `#0A3D1F` | Green felt table background |
| `surface` | `#1A5C32` | `#1A5C32` | Card areas, panels |
| `primary` | `#F5C842` | `#F5C842` | Gold — highlights, trump indicator |
| `foreground` | `#FFFFFF` | `#FFFFFF` | Primary text |
| `muted` | `#A8C5A0` | `#A8C5A0` | Secondary text |
| `border` | `#2E7D4F` | `#2E7D4F` | Subtle dividers |
| `error` | `#E53935` | `#F87171` | Hearts/Diamonds suit color |
| `success` | `#4CAF50` | `#4ADE80` | Win states |

The app uses a **casino green felt** aesthetic throughout — dark green background simulating a card table, gold accents for trump and important UI, white card faces.

## Screen List

1. **Home Screen** — App entry, start game button, settings
2. **Game Table Screen** — Main gameplay screen (full screen, landscape-friendly portrait)
3. **Round Result Overlay** — Shows trick count, points earned after each round
4. **Match Result Screen** — Final winner announcement when a team reaches 10 points
5. **Settings Screen** — Win score threshold, player names

## Screen Designs

### 1. Home Screen
- Large "БЕЛКА" title with card suit icons (♠♥♦♣)
- "Новая игра" (New Game) primary button — gold, large
- "Настройки" (Settings) secondary button
- Brief rules summary card
- Team score display if a match is in progress

### 2. Game Table Screen (Portrait 9:16)
**Layout zones (top to bottom):**
- **Top zone** (opponent top): Player name + card count badge, cards shown face-down in fan
- **Left zone**: Left opponent — vertical card fan, face-down
- **Right zone**: Right opponent — vertical card fan, face-down
- **Center zone**: Trick area — 4 card slots showing played cards; trump suit indicator (large suit symbol + gold border)
- **Bottom zone** (human player): Card hand in horizontal fan, face-up; playable cards highlighted with gold glow

**Trump indicator**: Floating badge top-right — large suit symbol (♠/♥/♦/♣) in gold circle, "КОЗЫРЬ" label

**Score bar**: Slim top bar — "Мы: X | Они: X" with team colors

**Current trick**: Center table shows up to 4 played cards with player position indicators

**Hand sorting**: Cards auto-sorted by suit then rank; trump suit grouped last

### 3. Round Result Overlay
- Semi-transparent dark overlay
- "Раунд завершён" title
- Trick count: "Мы взяли: X | Они взяли: X"
- Points earned: "+1 очко" or "+2 очка (все взятки!)"
- Match score update
- "Следующий раунд" button

### 4. Match Result Screen
- Full screen celebration
- Winner team: "Победа!" or "Поражение!"
- Final score display
- "Новая игра" button

### 5. Settings Screen
- Win score threshold slider (5–15, default 10)
- Player name inputs (Player 1–4)
- Theme toggle

## Key User Flows

**Starting a game:**
Home → tap "Новая игра" → Game Table loads → Cards dealt → Trump revealed → Game begins

**Playing a card:**
Player's turn → valid cards glow gold → tap card → card animates to center → next player's turn (AI plays automatically)

**Trick resolution:**
All 4 cards played → winner highlighted → cards collected → next trick begins

**Round end:**
9 tricks complete → Round Result Overlay → tap continue → new round deals

**Match end:**
Team reaches 10 points → Match Result Screen → tap New Game → reset

## Component Inventory

- `CardComponent` — Renders a single card (face-up/down), supports glow highlight, press animation
- `CardFan` — Horizontal fan of cards for player hand
- `OpponentHand` — Face-down card fan for AI players
- `TrickArea` — Center 4-slot area showing current trick
- `TrumpBadge` — Gold circle with suit symbol
- `ScoreBar` — Top slim score display
- `PlayerLabel` — Name + card count badge
- `RoundResultModal` — Overlay with round summary
- `MatchResultScreen` — Full-screen winner display

## Card Visual Design

- **Face-up**: White card, rank top-left + bottom-right, large suit center
- **Face-down**: Dark green back with subtle pattern
- **Highlighted (playable)**: Gold border glow
- **Selected**: Slightly raised (translateY -8px)
- **Red suits** (♥♦): `#E53935` color
- **Black suits** (♠♣): `#1A1A1A` color
- Card size: ~60×90pt in hand, ~70×105pt in trick area
