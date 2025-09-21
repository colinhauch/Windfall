import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Settings() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <p className="text-xl mb-8">Configure Your Experience</p>
        <p className="text-gray-300 mb-8">
          Game settings and preferences coming soon...
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
