import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { BlackjackTable } from './BlackjackTable';
import { getTableConfig } from '@/types/gameSettings';

interface PageProps {
  params: Promise<{ tableId: string }>;
}

export default async function TablePage({ params }: PageProps) {
  const { tableId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const tableConfig = getTableConfig(tableId);

  if (!tableConfig) {
    redirect('/casino');
  }

  // TODO: Fetch user's current chip count from Supabase
  const userChips = 1000; // Placeholder

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      <BlackjackTable tableConfig={tableConfig} userChips={userChips} />
    </div>
  );
}
