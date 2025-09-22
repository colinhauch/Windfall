'use client';

import Link from 'next/link';
import { getAllTableConfigs, type TableConfig } from '@/types/gameSettings';

export function TableSelector() {
  const tables = getAllTableConfigs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
      {tables.map((table: TableConfig) => (
        <div
          key={table.id}
          className="group relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all duration-300 hover:transform hover:scale-105"
        >
          {/* Table Card Header */}
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${table.gradientFrom} ${table.gradientTo} rounded-full mb-4 shadow-lg`}
            >
              <span className="text-2xl font-bold text-white">
                {table.difficulty === 'Beginner' && '🟢'}
                {table.difficulty === 'Intermediate' && '🟠'}
                {table.difficulty === 'Advanced' && '🏆'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{table.name}</h3>
            <span
              className={`inline-block px-3 py-1 bg-gradient-to-r ${table.gradientFrom} ${table.gradientTo} text-white text-sm rounded-full font-medium`}
            >
              {table.difficulty}
            </span>
          </div>

          {/* Table Details */}
          <div className="space-y-4 mb-6">
            <p className="text-white/80 text-center">{table.description}</p>

            <div className="bg-black/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-white/90">
                <span className="font-medium">Min Bet:</span>
                <span className="text-green-400 font-bold">
                  ${table.gameSettings.minBet}
                </span>
              </div>
              <div className="flex justify-between items-center text-white/90">
                <span className="font-medium">Max Bet:</span>
                <span className="text-red-400 font-bold">
                  ${table.gameSettings.maxBet}
                </span>
              </div>
              <div className="flex justify-between items-center text-white/90 text-xs">
                <span className="font-medium">Decks:</span>
                <span className="text-blue-400 font-bold">
                  {table.gameSettings.numOfDecks}
                </span>
              </div>
              <div className="flex justify-between items-center text-white/90 text-xs">
                <span className="font-medium">Blackjack:</span>
                <span className="text-yellow-400 font-bold">
                  {table.gameSettings.payoutBlackjack === 1.5 ? '3:2' : '6:5'}
                </span>
              </div>
            </div>
          </div>

          {/* Join Table Button */}
          <Link
            href={`/casino/table/${table.id}`}
            className={`block w-full bg-gradient-to-r ${table.gradientFrom} ${table.gradientTo} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl text-center transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            Join Table
          </Link>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
}
