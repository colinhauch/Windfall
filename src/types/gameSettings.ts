// Game Settings Types for Windfall Blackjack Tables

export interface GameSettings {
  id: string;
  signature: string; // Unique identifier for the table configuration
  gameType: string; // e.g., "blackjack", "spanish21", etc.

  // Betting Rules
  minBet: number;
  maxBet: number;

  // Deck Configuration
  numOfDecks: number; // 1, 2, 4, 6, or 8 decks
  shuffleFrequency:
    | 'every-hand'
    | 'penetration-75'
    | 'penetration-50'
    | 'penetration-25';

  // Dealer Rules
  dealerHitsSoft17: boolean; // Dealer hits or stands on soft 17

  // Player Options
  allowDoubleAfterSplit: boolean; // Can double down after splitting
  allowResplitAces: boolean; // Can split aces more than once
  allowSurrender: boolean; // Can surrender hand for half bet back
  insuranceAllowed: boolean; // Can take insurance against dealer ace
  maxSplits: number; // Maximum number of times can split (0 = no splitting)

  // Payouts
  payoutBlackjack: number; // Multiplier for blackjack (e.g., 1.5 for 3:2, 1.2 for 6:5)

  // Metadata
  created_at: string;
}

export interface TableConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  gradientFrom: string;
  gradientTo: string;
  gameSettings: GameSettings;
}

// Predefined table configurations
export const TABLE_CONFIGS: Record<string, TableConfig> = {
  rookie: {
    id: 'rookie',
    name: 'Rookie Table',
    description: 'Perfect for beginners learning the basics',
    difficulty: 'Beginner',
    color: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-600',
    gameSettings: {
      id: 'rookie-settings',
      signature: 'ROOKIE_BEGINNER_FRIENDLY',
      gameType: 'blackjack',
      minBet: 5,
      maxBet: 50,
      numOfDecks: 1, // Single deck for easier learning
      shuffleFrequency: 'every-hand', // No card counting advantage
      dealerHitsSoft17: false, // Dealer stands on soft 17 (player favorable)
      allowDoubleAfterSplit: true, // More flexible for learning
      allowResplitAces: false, // Simpler rules
      allowSurrender: true, // Safety net for beginners
      insuranceAllowed: true, // Let them learn about insurance
      maxSplits: 2, // Limited splitting to keep it simple
      payoutBlackjack: 1.5, // Traditional 3:2 blackjack payout
      created_at: new Date().toISOString(),
    },
  },

  'high-roller': {
    id: 'high-roller',
    name: 'High Roller Table',
    description: 'For experienced players seeking bigger wins',
    difficulty: 'Intermediate',
    color: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-violet-600',
    gameSettings: {
      id: 'high-roller-settings',
      signature: 'HIGHROLLER_STANDARD_RULES',
      gameType: 'blackjack',
      minBet: 25,
      maxBet: 500,
      numOfDecks: 6, // Standard casino setup
      shuffleFrequency: 'penetration-75', // More realistic penetration
      dealerHitsSoft17: true, // House favorable rule
      allowDoubleAfterSplit: true,
      allowResplitAces: true, // More advanced splitting rules
      allowSurrender: false, // No surrender (house edge)
      insuranceAllowed: true,
      maxSplits: 3, // Standard casino rules
      payoutBlackjack: 1.5, // 3:2 payout
      created_at: new Date().toISOString(),
    },
  },

  vip: {
    id: 'vip',
    name: 'VIP Elite Table',
    description: 'Exclusive table for card counting masters',
    difficulty: 'Advanced',
    color: 'gold',
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-orange-600',
    gameSettings: {
      id: 'vip-settings',
      signature: 'VIP_ELITE_HARDCORE',
      gameType: 'blackjack',
      minBet: 100,
      maxBet: 2000,
      numOfDecks: 8, // Harder for card counting
      shuffleFrequency: 'penetration-50', // Less penetration, harder counting
      dealerHitsSoft17: true, // House favorable
      allowDoubleAfterSplit: false, // Stricter rules
      allowResplitAces: false, // No resplitting aces
      allowSurrender: false, // No surrender
      insuranceAllowed: false, // No insurance (advanced players know it's bad)
      maxSplits: 1, // Limited splits
      payoutBlackjack: 1.2, // Worse 6:5 payout (realistic high-limit table)
      created_at: new Date().toISOString(),
    },
  },
};

// Utility functions for game settings
export const getTableConfig = (tableId: string): TableConfig | null => {
  return TABLE_CONFIGS[tableId] || null;
};

export const getAllTableConfigs = (): TableConfig[] => {
  return Object.values(TABLE_CONFIGS);
};

export const getGameSettingsById = (
  settingsId: string
): GameSettings | null => {
  const table = Object.values(TABLE_CONFIGS).find(
    (table) => table.gameSettings.id === settingsId
  );
  return table?.gameSettings || null;
};

// Validation functions
export const isValidBet = (amount: number, settings: GameSettings): boolean => {
  return amount >= settings.minBet && amount <= settings.maxBet;
};

export const calculateBlackjackPayout = (
  bet: number,
  settings: GameSettings
): number => {
  return Math.floor(bet * settings.payoutBlackjack);
};

// Card interface for game logic
interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank:
    | 'A'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | 'J'
    | 'Q'
    | 'K';
  value: number;
  isAce: boolean;
}

export const shouldDealerHitSoft17 = (
  dealerHand: Card[],
  settings: GameSettings
): boolean => {
  // This would need the actual hand calculation logic
  return settings.dealerHitsSoft17;
};
