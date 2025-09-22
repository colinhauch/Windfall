# 02_casino.md

## Casino System Implementation

The casino system serves as a core gameplay domain for Windfall, providing a comprehensive blackjack experience with configurable rule variations, multiple table types, and detailed session tracking. This implementation moves beyond simple card games to create an authentic casino atmosphere where users can practice card counting techniques across different rule sets that mirror real-world casino variations.

The system architecture emphasizes educational value through gamification, allowing users to experience how different blackjack rules affect strategy and outcomes. Each table configuration represents a different learning challenge, from beginner-friendly environments to advanced scenarios that replicate high-stakes casino conditions.

## Architecture Overview

### Component Hierarchy

The casino system follows a hub-and-spoke architecture centered around the main casino lobby, which serves as the entry point for all gaming activities. The lobby connects to individual table instances through dynamic routing, with each table maintaining its own game state and rule configuration.

```
/casino (Lobby)
├── TableSelector Component
├── ChipDisplay Component
└── /table/[tableId] (Dynamic Route)
    ├── BlackjackTable Component
    └── Game State Management
```

### Data Flow Architecture

Game sessions flow through a structured pipeline from initial table selection through gameplay completion and result recording. The system maintains separation between UI state (current cards, betting interface) and persistent data (chip counts, game history) while ensuring immediate feedback for user actions.

The game settings system provides the foundation for rule variations, with each table referencing a specific configuration that defines everything from betting limits to payout ratios. This allows for consistent gameplay experiences while maintaining flexibility for future rule variations.

## Game Settings System

### Configuration Schema

The game settings system uses a comprehensive configuration structure that captures all major blackjack rule variations found in real casinos. Each setting directly impacts gameplay mechanics and strategy considerations.

```typescript
interface GameSettings {
  id: string;
  signature: string;
  gameType: string;

  // Betting Configuration
  minBet: number;
  maxBet: number;

  // Deck Management
  numOfDecks: number;
  shuffleFrequency:
    | 'every-hand'
    | 'penetration-75'
    | 'penetration-50'
    | 'penetration-25';

  // Dealer Behavior
  dealerHitsSoft17: boolean;

  // Player Options
  allowDoubleAfterSplit: boolean;
  allowResplitAces: boolean;
  allowSurrender: boolean;
  insuranceAllowed: boolean;
  maxSplits: number;

  // Payout Structure
  payoutBlackjack: number; // 1.5 for 3:2, 1.2 for 6:5

  created_at: string;
}
```

### Table Configurations

The system defines three distinct table types, each targeting different skill levels and learning objectives. These configurations reflect authentic casino variations and provide progressive difficulty for skill development.

#### Rookie Table (Beginner-Friendly Configuration)

The rookie table implements player-favorable rules designed to provide a supportive learning environment. Single deck play reduces complexity for card counting practice, while surrender options provide safety nets for learning optimal strategy.

```typescript
gameSettings: {
  signature: 'ROOKIE_BEGINNER_FRIENDLY',
  minBet: 5, maxBet: 50,
  numOfDecks: 1,
  shuffleFrequency: 'every-hand',
  dealerHitsSoft17: false,
  allowDoubleAfterSplit: true,
  allowResplitAces: false,
  allowSurrender: true,
  insuranceAllowed: true,
  maxSplits: 2,
  payoutBlackjack: 1.5
}
```

#### High Roller Table (Standard Casino Rules)

The high roller configuration mirrors typical casino conditions found in mid-stakes gaming areas. Six-deck shoes with realistic penetration provide authentic card counting challenges, while standard rule sets match common casino offerings.

```typescript
gameSettings: {
  signature: 'HIGHROLLER_STANDARD_RULES',
  minBet: 25, maxBet: 500,
  numOfDecks: 6,
  shuffleFrequency: 'penetration-75',
  dealerHitsSoft17: true,
  allowDoubleAfterSplit: true,
  allowResplitAces: true,
  allowSurrender: false,
  insuranceAllowed: true,
  maxSplits: 3,
  payoutBlackjack: 1.5
}
```

#### VIP Elite Table (Hardcore Challenge)

The VIP configuration implements house-favorable rules commonly found in high-limit gaming areas. Eight-deck shoes with reduced penetration create maximum difficulty for card counting, while restricted player options and reduced payouts reflect real high-stakes table conditions.

```typescript
gameSettings: {
  signature: 'VIP_ELITE_HARDCORE',
  minBet: 100, maxBet: 2000,
  numOfDecks: 8,
  shuffleFrequency: 'penetration-50',
  dealerHitsSoft17: true,
  allowDoubleAfterSplit: false,
  allowResplitAces: false,
  allowSurrender: false,
  insuranceAllowed: false,
  maxSplits: 1,
  payoutBlackjack: 1.2
}
```

## Database Schema Design

### Game Settings Storage

The database schema supports dynamic table configurations through a dedicated game_settings table that stores all rule variations. This approach enables easy addition of new table types without code changes while maintaining referential integrity for historical game sessions.

```sql
CREATE TABLE game_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signature VARCHAR(100) UNIQUE NOT NULL,
  game_type VARCHAR(50) DEFAULT 'blackjack' NOT NULL,

  -- Betting Rules
  min_bet INTEGER NOT NULL CHECK (min_bet > 0),
  max_bet INTEGER NOT NULL CHECK (max_bet > min_bet),

  -- Deck Configuration
  num_of_decks INTEGER DEFAULT 6 CHECK (num_of_decks IN (1, 2, 4, 6, 8)),
  shuffle_frequency VARCHAR(50) DEFAULT 'penetration-75',

  -- Game Rules
  dealer_hits_soft17 BOOLEAN DEFAULT true,
  allow_double_after_split BOOLEAN DEFAULT true,
  allow_resplit_aces BOOLEAN DEFAULT false,
  allow_surrender BOOLEAN DEFAULT false,
  insurance_allowed BOOLEAN DEFAULT true,
  max_splits INTEGER DEFAULT 3 CHECK (max_splits >= 0 AND max_splits <= 10),
  payout_blackjack DECIMAL(3,2) DEFAULT 1.50 CHECK (payout_blackjack > 1.0),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Session and Hand Tracking

Game sessions maintain references to specific game settings configurations along with snapshot data for historical accuracy. This design ensures that past sessions can be properly analyzed even if table configurations change over time.

```sql
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_settings_id UUID REFERENCES game_settings(id) NOT NULL,
  table_type VARCHAR(50) NOT NULL,

  -- Session Statistics
  starting_chips INTEGER NOT NULL,
  ending_chips INTEGER,
  total_hands INTEGER DEFAULT 0,
  hands_won INTEGER DEFAULT 0,
  hands_lost INTEGER DEFAULT 0,
  hands_pushed INTEGER DEFAULT 0,
  blackjacks INTEGER DEFAULT 0,
  busts INTEGER DEFAULT 0,

  -- Settings Snapshot for Historical Accuracy
  settings_snapshot JSONB NOT NULL,

  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Individual hands are tracked with complete card and result information, enabling detailed post-game analysis and strategy review.

```sql
CREATE TABLE game_hands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Hand Details
  hand_number INTEGER NOT NULL,
  bet_amount INTEGER NOT NULL,
  player_cards JSONB NOT NULL,
  dealer_cards JSONB NOT NULL,
  player_total INTEGER NOT NULL,
  dealer_total INTEGER NOT NULL,
  result VARCHAR(20) NOT NULL CHECK (result IN ('win', 'lose', 'push', 'blackjack', 'bust')),
  winnings INTEGER NOT NULL,

  hand_start TIMESTAMPTZ DEFAULT NOW(),
  hand_end TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## User Interface Implementation

### Casino Lobby Design

The casino lobby creates an immersive atmosphere through gradient backgrounds, animated elements, and clear navigation paths. The design emphasizes the entertainment value while maintaining focus on educational objectives.

The lobby displays critical information for each table type, including betting ranges, deck counts, and payout ratios. This information helps users make informed decisions about which table best matches their skill level and learning goals.

### Table Selection Interface

Each table option presents a comprehensive overview of its configuration through visual cards that highlight key differences. The interface uses color coding and iconography to communicate difficulty levels and rule variations at a glance.

```typescript
// Table display includes:
- Difficulty indicator (Beginner/Intermediate/Advanced)
- Betting range display ($5-$50, etc.)
- Deck count information
- Blackjack payout ratio (3:2 vs 6:5)
- Visual styling that matches table theme
```

### Gameplay Interface

The blackjack table interface prioritizes clarity and immediate feedback while providing enough information for strategic decision-making. The design includes real-time rule reminders and current game state indicators.

Game controls are context-sensitive, appearing only when relevant actions are available. This approach reduces cognitive load while ensuring users understand their options at each decision point.

## Game Logic Implementation

### State Management Architecture

The game state system manages multiple layers of information, from immediate UI updates to persistent session data. State updates follow a unidirectional flow that ensures consistency between display and data layers.

```typescript
interface GameState {
  playerHand: Card[];
  dealerHand: Card[];
  currentBet: number;
  gamePhase: 'betting' | 'dealing' | 'playing' | 'dealer-turn' | 'game-over';
  gameResult: 'win' | 'lose' | 'push' | 'blackjack' | null;
  deck: Card[];
  playerTotal: number;
  dealerTotal: number;
  playerChips: number;
}
```

### Payout Calculation System

Winnings calculations incorporate table-specific rules through a centralized function that handles all payout scenarios. This approach ensures consistency across different table configurations while supporting future rule additions.

```typescript
const calculateWinnings = (
  result: GameResult,
  bet: number,
  settings: GameSettings
): number => {
  switch (result) {
    case 'blackjack':
      return bet + calculateBlackjackPayout(bet, settings);
    case 'win':
      return bet * 2;
    case 'push':
      return bet;
    case 'lose':
    default:
      return 0;
  }
};
```

### Card Management and Shuffling

The deck system implements realistic shuffling algorithms and penetration rules that affect card counting difficulty. Different tables use varying shuffle frequencies to create appropriate challenges for different skill levels.

Single deck games reshuffle after each hand to eliminate counting opportunities for beginners, while multi-deck shoes implement percentage-based penetration that mirrors casino practices.

## Integration Points

### Authentication and User Management

The casino system integrates with Supabase authentication to ensure all gaming activities are properly attributed to user accounts. Session management maintains user state across gameplay while protecting sensitive information.

User chip balances persist across sessions through the user_profiles table, with transaction logging providing complete audit trails for all chip movements.

### Analytics and Reporting Integration

Game data flows into the reporting system through structured event logging that captures both statistical outcomes and strategic decisions. This integration enables detailed performance analysis and progress tracking.

The session tracking system provides raw data for generating insights about rule impact on player performance, supporting the educational mission of the application.

## Future Enhancement Considerations

### Advanced Rule Variations

The game settings architecture supports extension to additional blackjack variations such as Spanish 21, Blackjack Switch, or Double Exposure. The configuration system can accommodate these variations through additional settings flags and specialized rule handlers.

### Card Counting Training Integration

The foundation exists for advanced card counting features through the deck penetration system and hand history tracking. Future implementations could provide running count displays, true count calculations, and strategy recommendations based on current deck composition.

## Security and Data Protection

### Input Validation

All betting actions and game decisions undergo server-side validation using the game settings constraints. This approach prevents client-side manipulation while maintaining responsive user interactions.

Chip balance updates follow strict validation rules that prevent impossible transactions or negative balances, with all changes logged through the transaction system.

### Session Integrity

Game sessions maintain cryptographic signatures to prevent tampering with historical data. The settings snapshot system ensures that session analysis remains accurate even if table configurations are modified after completion.

## Performance Optimization

### Client-Side Game Logic

Core gameplay mechanics execute on the client side to provide immediate feedback for user actions. This approach reduces server load while maintaining data integrity through periodic synchronization points.

### Database Query Optimization

The schema design includes strategic indexes on frequently queried fields such as user_id, session dates, and game results. These optimizations support efficient reporting and analytics generation.

### Caching Strategy

Table configurations are cached on the client side since they change infrequently, reducing database load while ensuring consistent rule application throughout gaming sessions.

This casino implementation provides a solid foundation for the educational gaming experience envisioned in Windfall, with room for sophisticated enhancements while maintaining focus on the core mission of teaching effective blackjack and card counting strategies.
