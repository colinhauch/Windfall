import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { TableSelector } from './components/TableSelector';
import { ChipDisplay } from './components/ChipDisplay';

export default async function Casino() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // TODO: Fetch user's chip count from Supabase
  const userChips = 1000; // Placeholder value

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-red-900 to-yellow-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm border border-gray-600/50"
          >
            ← Main Menu
          </Link>
        </div>

        <ChipDisplay chips={userChips} />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            🎰 CASINO FLOOR 🎰
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Choose your table and test your skills!
          </p>
        </div>

        <TableSelector />

        {/* Additional Actions */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            💰 Get More Chips
          </button>

          <Link
            href="/reports"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            📊 View Stats
          </Link>

          <Link
            href="/school"
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🎓 Learn Strategy
          </Link>
        </div>

        {/* Casino Atmosphere Text */}
        <div className="mt-16 text-center text-white/70 max-w-2xl">
          <p className="text-sm italic">
            &ldquo;The house always wins... unless you know how to count cards.
            😉&rdquo;
          </p>
        </div>
      </main>
    </div>
  );
}
