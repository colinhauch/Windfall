'use client';

import Link from 'next/link';

export default function Home() {
  const handleExit = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex flex-col items-center justify-center p-8">
      <div className="text-center">
        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-16 tracking-wider drop-shadow-lg">
          Windfall BlackJack
        </h1>

        {/* Menu Options */}
        <div className="space-y-6">
          <Link
            href="/casino"
            className="block w-64 mx-auto bg-green-700 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            🎰 Casino
          </Link>

          <Link
            href="/school"
            className="block w-64 mx-auto bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            🎓 School
          </Link>

          <Link
            href="/reports"
            className="block w-64 mx-auto bg-purple-700 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            📊 Reports
          </Link>

          <Link
            href="/settings"
            className="block w-64 mx-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            ⚙️ Settings
          </Link>

          <button
            onClick={handleExit}
            className="block w-64 mx-auto bg-red-700 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            🚪 Exit
          </button>
        </div>
      </div>
    </div>
  );
}
