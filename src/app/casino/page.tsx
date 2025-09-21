import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Casino() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex flex-col items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-8">Casino</h1>
        <p className="text-xl mb-8">Welcome to the Casino floor!</p>
        <p className="text-gray-300 mb-8">BlackJack tables coming soon...</p>

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
