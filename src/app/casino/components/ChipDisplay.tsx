'use client';

interface ChipDisplayProps {
  chips: number;
}

export function ChipDisplay({ chips }: ChipDisplayProps) {
  const formatChips = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  const getChipColor = (amount: number): string => {
    if (amount >= 10000) return 'from-purple-500 to-pink-500';
    if (amount >= 5000) return 'from-yellow-400 to-orange-500';
    if (amount >= 1000) return 'from-blue-500 to-indigo-600';
    if (amount >= 500) return 'from-green-500 to-emerald-600';
    return 'from-red-500 to-rose-600';
  };

  const getChipEmoji = (amount: number): string => {
    if (amount >= 10000) return '💎';
    if (amount >= 5000) return '🥇';
    if (amount >= 1000) return '🔵';
    if (amount >= 500) return '🟢';
    return '🔴';
  };

  const handleGetMoreChips = () => {
    // TODO: Implement chip purchase logic
    alert('Chip store coming soon! For now, enjoy your current chips.');
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        {/* Chip Count Display */}
        <div
          className={`bg-gradient-to-r ${getChipColor(chips)} p-1 rounded-2xl shadow-lg`}
        >
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center space-x-2">
            <span className="text-2xl">{getChipEmoji(chips)}</span>
            <div className="text-right">
              <div className="text-sm text-white/70 font-medium">Chips</div>
              <div className="text-xl font-bold text-white">
                {formatChips(chips)}
              </div>
            </div>
          </div>
        </div>

        {/* Get More Chips Button */}
        <button
          onClick={handleGetMoreChips}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
        >
          <span>💰</span>
          <span className="hidden sm:inline">Get Chips</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      {/* Low Chip Warning */}
      {chips < 100 && (
        <div className="absolute top-full mt-2 right-0 bg-red-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg shadow-lg animate-pulse">
          ⚠️ Low on chips!
        </div>
      )}
    </div>
  );
}
