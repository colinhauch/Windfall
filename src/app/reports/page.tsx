import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Reports() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 flex flex-col items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-8">Reports</h1>
        <p className="text-xl mb-8">Game Statistics & Analytics</p>
        <p className="text-gray-300 mb-8">
          Performance tracking and reports coming soon...
        </p>

        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
