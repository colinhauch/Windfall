'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  type TableConfig,
  calculateBlackjackPayout,
  isValidBet,
} from '@/types/gameSettings';

interface BlackjackTableProps {
  tableConfig: TableConfig;
  userChips: number;
}

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

export function BlackjackTable({
  tableConfig,
  userChips,
}: BlackjackTableProps) {
  const [gameState, setGameState] = useState<GameState>({
    playerHand: [],
    dealerHand: [],
    currentBet: 0,
    gamePhase: 'betting',
    gameResult: null,
    deck: [],
    playerTotal: 0,
    dealerTotal: 0,
    playerChips: userChips,
  });

  // Calculate winnings based on game result and settings
  const calculateWinnings = (
    result: GameState['gameResult'],
    bet: number
  ): number => {
    switch (result) {
      case 'blackjack':
        return bet + calculateBlackjackPayout(bet, tableConfig.gameSettings);
      case 'win':
        return bet * 2; // Original bet + equal win
      case 'push':
        return bet; // Get bet back
      case 'lose':
      default:
        return 0; // Lose the bet
    }
  };

  // Create a standard 52-card deck
  const createDeck = (): Card[] => {
    const suits: Card['suit'][] = ['♠', '♥', '♦', '♣'];
    const ranks: Card['rank'][] = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'J',
      'Q',
      'K',
    ];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          suit,
          rank,
          value:
            rank === 'A'
              ? 11
              : ['J', 'Q', 'K'].includes(rank)
                ? 10
                : parseInt(rank),
          isAce: rank === 'A',
        });
      }
    }

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  };

  // Calculate hand total, handling Aces
  const calculateTotal = (hand: Card[]): number => {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.isAce) {
        aces++;
        total += 11;
      } else {
        total += card.value;
      }
    }

    // Adjust for Aces
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  };

  // Initialize new game
  const startNewGame = () => {
    const newDeck = createDeck();
    setGameState((prev) => ({
      ...prev,
      playerHand: [],
      dealerHand: [],
      gamePhase: 'betting',
      gameResult: null,
      deck: newDeck,
      playerTotal: 0,
      dealerTotal: 0,
    }));
  };

  // Place bet and deal initial cards
  const placeBet = (betAmount: number) => {
    if (
      !isValidBet(betAmount, tableConfig.gameSettings) ||
      betAmount > gameState.playerChips
    ) {
      return;
    }

    const deck = [...gameState.deck];
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];

    const playerTotal = calculateTotal(playerHand);
    const dealerTotal = calculateTotal([dealerHand[0]]); // Only show first card

    let gamePhase: GameState['gamePhase'] = 'playing';
    let gameResult: GameState['gameResult'] = null;

    // Check for blackjack
    let newPlayerChips = gameState.playerChips - betAmount;
    if (playerTotal === 21) {
      gamePhase = 'game-over';
      gameResult = calculateTotal(dealerHand) === 21 ? 'push' : 'blackjack';
      // Calculate immediate payout for blackjack or push
      const winnings = calculateWinnings(gameResult, betAmount);
      newPlayerChips = gameState.playerChips - betAmount + winnings;
    }

    setGameState((prev) => ({
      ...prev,
      playerHand,
      dealerHand,
      currentBet: betAmount,
      gamePhase,
      gameResult,
      deck,
      playerTotal,
      dealerTotal,
      playerChips: newPlayerChips,
    }));
  };

  // Player hits
  const hit = () => {
    const deck = [...gameState.deck];
    const newCard = deck.pop()!;
    const newHand = [...gameState.playerHand, newCard];
    const newTotal = calculateTotal(newHand);

    let gamePhase: GameState['gamePhase'] = 'playing';
    let gameResult: GameState['gameResult'] = null;

    if (newTotal > 21) {
      gamePhase = 'game-over';
      gameResult = 'lose';
    }

    setGameState((prev) => ({
      ...prev,
      playerHand: newHand,
      deck,
      playerTotal: newTotal,
      gamePhase,
      gameResult,
    }));
  };

  // Player stands - dealer plays
  const stand = () => {
    const deck = [...gameState.deck];
    const dealerHand = [...gameState.dealerHand];
    let dealerTotal = calculateTotal(dealerHand);

    // Dealer must hit on 16 and stand on 17
    while (dealerTotal < 17) {
      const newCard = deck.pop()!;
      dealerHand.push(newCard);
      dealerTotal = calculateTotal(dealerHand);
    }

    let gameResult: GameState['gameResult'];
    const playerTotal = gameState.playerTotal;

    if (dealerTotal > 21) {
      gameResult = 'win';
    } else if (dealerTotal > playerTotal) {
      gameResult = 'lose';
    } else if (dealerTotal < playerTotal) {
      gameResult = 'win';
    } else {
      gameResult = 'push';
    }

    // Calculate winnings using game settings
    const winnings = calculateWinnings(gameResult, gameState.currentBet);
    const newChips = gameState.playerChips + winnings;

    setGameState((prev) => ({
      ...prev,
      dealerHand,
      dealerTotal,
      gamePhase: 'game-over',
      gameResult,
      playerChips: newChips,
      deck,
    }));
  };

  // Initialize deck on component mount
  useEffect(() => {
    const newDeck = createDeck();
    setGameState((prev) => ({
      ...prev,
      playerHand: [],
      dealerHand: [],
      gamePhase: 'betting',
      gameResult: null,
      deck: newDeck,
      playerTotal: 0,
      dealerTotal: 0,
    }));
  }, []);

  const renderCard = (card: Card, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-blue-900 border border-white/20 rounded-lg flex items-center justify-center shadow-lg">
          <div className="text-white text-xs">🂠</div>
        </div>
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';

    return (
      <div
        className={`w-16 h-24 bg-white border border-gray-300 rounded-lg flex flex-col justify-between p-1 shadow-lg ${isRed ? 'text-red-600' : 'text-black'}`}
      >
        <div className="text-xs font-bold">{card.rank}</div>
        <div className="text-lg text-center">{card.suit}</div>
        <div className="text-xs font-bold transform rotate-180 self-end">
          {card.rank}
        </div>
      </div>
    );
  };

  const { minBet } = tableConfig.gameSettings;
  const betAmounts = [minBet, minBet * 2, minBet * 5, minBet * 10];

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/casino"
            className="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            ← Back to Casino
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {tableConfig.name}
            </h1>
            <div className="text-sm text-white/70 flex items-center space-x-4">
              <span>
                {tableConfig.gameSettings.numOfDecks} deck
                {tableConfig.gameSettings.numOfDecks > 1 ? 's' : ''}
              </span>
              <span>•</span>
              <span>
                Blackjack pays{' '}
                {tableConfig.gameSettings.payoutBlackjack === 1.5
                  ? '3:2'
                  : '6:5'}
              </span>
              <span>•</span>
              <span>
                Dealer{' '}
                {tableConfig.gameSettings.dealerHitsSoft17 ? 'hits' : 'stands'}{' '}
                on soft 17
              </span>
            </div>
          </div>
        </div>

        <div className="text-white text-right">
          <div className="text-sm opacity-75">Your Chips</div>
          <div className="text-xl font-bold">${gameState.playerChips}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full">
        {/* Dealer Area */}
        <div className="text-center mb-8">
          <h2 className="text-white text-lg mb-4">
            Dealer{' '}
            {gameState.gamePhase !== 'betting' &&
              `(${gameState.gamePhase === 'playing' ? '?' : gameState.dealerTotal})`}
          </h2>
          <div className="flex justify-center space-x-2">
            {gameState.dealerHand.map((card, index) => (
              <div key={index}>
                {renderCard(
                  card,
                  gameState.gamePhase === 'playing' && index === 1
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Player Area */}
        <div className="text-center">
          <h2 className="text-white text-lg mb-4">
            You{' '}
            {gameState.gamePhase !== 'betting' && `(${gameState.playerTotal})`}
          </h2>
          <div className="flex justify-center space-x-2 mb-8">
            {gameState.playerHand.map((card, index) => (
              <div key={index}>{renderCard(card)}</div>
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="text-center">
          {gameState.gamePhase === 'betting' && (
            <div className="space-y-4">
              <div className="text-white text-lg mb-4">Place Your Bet</div>
              <div className="flex flex-wrap justify-center gap-4">
                {betAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => placeBet(amount)}
                    disabled={amount > gameState.playerChips}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState.gamePhase === 'playing' && (
            <div className="space-y-4">
              <div className="text-white text-lg mb-4">
                Current Bet: ${gameState.currentBet}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={hit}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
                >
                  Hit
                </button>
                <button
                  onClick={stand}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
                >
                  Stand
                </button>
              </div>
            </div>
          )}

          {gameState.gamePhase === 'game-over' && (
            <div className="space-y-4">
              <div className="text-white text-xl mb-4">
                {gameState.gameResult === 'win' && '🎉 You Win!'}
                {gameState.gameResult === 'lose' && '😞 You Lose!'}
                {gameState.gameResult === 'push' && '🤝 Push!'}
                {gameState.gameResult === 'blackjack' && '🎰 Blackjack!'}
              </div>
              <button
                onClick={startNewGame}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
              >
                New Hand
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
