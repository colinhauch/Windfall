'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-black flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Authentication Error
        </h1>
        <div className="text-gray-700 mb-6">
          {error && <p className="font-semibold">Error: {error}</p>}
          {errorDescription && <p className="mt-2">{errorDescription}</p>}
          {!error && !errorDescription && (
            <p>Sorry, something went wrong with authentication.</p>
          )}
        </div>
        <a
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
