import Link from 'next/link';

export default function School() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center justify-center p-8">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-8">BlackJack School</h1>
        <p className="text-xl mb-8">Learn the art of BlackJack</p>
        <p className="text-gray-300 mb-8">
          Tutorials and strategy guides coming soon...
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
