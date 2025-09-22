# Casino Database Schema

This document outlines the database tables needed for the Windfall casino functionality.

# Casino Database Schema

This document outlines the database tables needed for the Windfall casino functionality.

## 1. Game Settings Table (game_settings)

Stores different table configurations and rule variations.

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
  shuffle_frequency VARCHAR(50) DEFAULT 'penetration-75' CHECK (
    shuffle_frequency IN ('every-hand', 'penetration-75', 'penetration-50', 'penetration-25')
  ),

  -- Dealer Rules
  dealer_hits_soft17 BOOLEAN DEFAULT true,

  -- Player Options
  allow_double_after_split BOOLEAN DEFAULT true,
  allow_resplit_aces BOOLEAN DEFAULT false,
  allow_surrender BOOLEAN DEFAULT false,
  insurance_allowed BOOLEAN DEFAULT true,
  max_splits INTEGER DEFAULT 3 CHECK (max_splits >= 0 AND max_splits <= 10),

  -- Payouts
  payout_blackjack DECIMAL(3,2) DEFAULT 1.50 CHECK (payout_blackjack > 1.0),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (though these might be public readable)
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow everyone to read game settings (public data)
CREATE POLICY "Anyone can view game settings" ON game_settings
  FOR SELECT TO authenticated, anon USING (true);

-- Only admins can modify (add specific admin role later)
CREATE POLICY "Only service role can modify settings" ON game_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Insert default table configurations
INSERT INTO game_settings (
  signature, game_type, min_bet, max_bet, num_of_decks, shuffle_frequency,
  dealer_hits_soft17, allow_double_after_split, allow_resplit_aces,
  allow_surrender, insurance_allowed, max_splits, payout_blackjack
) VALUES
  ('ROOKIE_BEGINNER_FRIENDLY', 'blackjack', 5, 50, 1, 'every-hand',
   false, true, false, true, true, 2, 1.50),
  ('HIGHROLLER_STANDARD_RULES', 'blackjack', 25, 500, 6, 'penetration-75',
   true, true, true, false, true, 3, 1.50),
  ('VIP_ELITE_HARDCORE', 'blackjack', 100, 2000, 8, 'penetration-50',
   true, false, false, false, false, 1, 1.20);
```

## 2. User Profiles Table (user_profiles)

Extends Supabase auth.users with casino-specific data.

````sql

## 2. Game Sessions Table (game_sessions)

Records each blackjack game session.

```sql
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  game_settings_id UUID REFERENCES game_settings(id) NOT NULL,
  table_type VARCHAR(50) NOT NULL CHECK (table_type IN ('rookie', 'high-roller', 'vip')),
  starting_chips INTEGER NOT NULL,
  ending_chips INTEGER,
  total_hands INTEGER DEFAULT 0,
  hands_won INTEGER DEFAULT 0,
  hands_lost INTEGER DEFAULT 0,
  hands_pushed INTEGER DEFAULT 0,
  blackjacks INTEGER DEFAULT 0,
  busts INTEGER DEFAULT 0,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,

  -- Store the game settings snapshot at session start for historical accuracy
  settings_snapshot JSONB NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own sessions
CREATE POLICY "Users can view their own sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);
````

## 3. Game Hands Table (game_hands)

Records individual blackjack hands within sessions.

```sql
CREATE TABLE game_hands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hand_number INTEGER NOT NULL,
  bet_amount INTEGER NOT NULL,
  player_cards JSONB NOT NULL,
  dealer_cards JSONB NOT NULL,
  player_total INTEGER NOT NULL,
  dealer_total INTEGER NOT NULL,
  result VARCHAR(20) NOT NULL CHECK (result IN ('win', 'lose', 'push', 'blackjack', 'bust')),
  winnings INTEGER NOT NULL, -- Negative for losses
  hand_start TIMESTAMPTZ DEFAULT NOW(),
  hand_end TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_hands ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own hands
CREATE POLICY "Users can view their own hands" ON game_hands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hands" ON game_hands
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 4. Chip Transactions Table (chip_transactions)

Records all chip transactions (winnings, losses, purchases).

```sql
CREATE TABLE chip_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('game_win', 'game_loss', 'purchase', 'bonus', 'refund')),
  amount INTEGER NOT NULL, -- Positive for gains, negative for losses
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reference_id UUID, -- Could reference game_hands.id or other entities
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chip_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own transactions
CREATE POLICY "Users can view their own transactions" ON chip_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON chip_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 5. User Achievements Table (user_achievements)

Tracks user achievements and milestones.

```sql
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  achievement_description TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Indexes for Performance

```sql
-- User profiles indexes
CREATE INDEX idx_user_profiles_chips ON user_profiles(chips);
CREATE INDEX idx_user_profiles_games_played ON user_profiles(games_played);

-- Game sessions indexes
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_table_type ON game_sessions(table_type);
CREATE INDEX idx_game_sessions_active ON game_sessions(is_active);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at);

-- Game hands indexes
CREATE INDEX idx_game_hands_session_id ON game_hands(session_id);
CREATE INDEX idx_game_hands_user_id ON game_hands(user_id);
CREATE INDEX idx_game_hands_result ON game_hands(result);
CREATE INDEX idx_game_hands_created_at ON game_hands(created_at);

-- Chip transactions indexes
CREATE INDEX idx_chip_transactions_user_id ON chip_transactions(user_id);
CREATE INDEX idx_chip_transactions_type ON chip_transactions(transaction_type);
CREATE INDEX idx_chip_transactions_created_at ON chip_transactions(created_at);

-- User achievements indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);
```

## Functions and Triggers

```sql
-- Function to update user profile stats after each hand
CREATE OR REPLACE FUNCTION update_user_stats_after_hand()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET
    games_played = games_played + 1,
    total_winnings = CASE
      WHEN NEW.winnings > 0 THEN total_winnings + NEW.winnings
      ELSE total_winnings
    END,
    total_losses = CASE
      WHEN NEW.winnings < 0 THEN total_losses + ABS(NEW.winnings)
      ELSE total_losses
    END,
    chips = chips + NEW.winnings,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  -- Record chip transaction
  INSERT INTO chip_transactions (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    reference_id,
    description
  ) VALUES (
    NEW.user_id,
    CASE WHEN NEW.winnings > 0 THEN 'game_win' ELSE 'game_loss' END,
    NEW.winnings,
    (SELECT chips FROM user_profiles WHERE id = NEW.user_id) - NEW.winnings,
    (SELECT chips FROM user_profiles WHERE id = NEW.user_id),
    NEW.id,
    'Blackjack hand result'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update stats after each hand
CREATE TRIGGER after_game_hand_insert
  AFTER INSERT ON game_hands
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_hand();
```

## Sample Data Insertion

```sql
-- Example of inserting a user profile (usually handled by trigger)
INSERT INTO user_profiles (id, chips)
VALUES ('user-uuid-here', 1000);

-- Example of starting a game session
INSERT INTO game_sessions (user_id, table_type, starting_chips)
VALUES ('user-uuid-here', 'rookie', 1000);

-- Example of recording a hand
INSERT INTO game_hands (
  session_id, user_id, hand_number, bet_amount,
  player_cards, dealer_cards, player_total, dealer_total,
  result, winnings
) VALUES (
  'session-uuid-here', 'user-uuid-here', 1, 25,
  '[{"suit":"♠","rank":"A","value":11},{"suit":"♥","rank":"K","value":10}]',
  '[{"suit":"♦","rank":"7","value":7},{"suit":"♣","rank":"5","value":5}]',
  21, 12, 'blackjack', 37
);
```
