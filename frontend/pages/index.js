import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>ReWear – Community Clothing Exchange</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-pink-100 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-teal-700 mb-6 text-center">ReWear</h1>
        <p className="text-lg md:text-2xl text-gray-700 max-w-xl text-center mb-8">
          Exchange unused clothing through direct swaps or a point-based system. Join our community to promote sustainable fashion and reduce textile waste!
        </p>
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <Link href="/auth/login" className="px-6 py-3 rounded bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition">Start Swapping</Link>
          <Link href="/browse" className="px-6 py-3 rounded bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">Browse Items</Link>
          <Link href="/add-item" className="px-6 py-3 rounded bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition">List an Item</Link>
        </div>
        <div className="w-full max-w-2xl">
          {/* Featured Items Carousel Placeholder */}
          <div className="rounded-lg bg-white shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-teal-700">Featured Items</h2>
            <div className="flex gap-4 overflow-x-auto">
              {/* Carousel items will be implemented */}
              <div className="w-44 h-56 bg-gray-200 rounded shadow flex items-center justify-center text-gray-400">Coming Soon</div>
              <div className="w-44 h-56 bg-gray-200 rounded shadow flex items-center justify-center text-gray-400">Coming Soon</div>
              <div className="w-44 h-56 bg-gray-200 rounded shadow flex items-center justify-center text-gray-400">Coming Soon</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
