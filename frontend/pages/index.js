import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Spinner from '../components/Spinner';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/items')
      .then(res => {
        // Pick 3 random approved items as featured
        const approved = res.data.filter(item => item.status === 'approved');
        const shuffled = approved.sort(() => 0.5 - Math.random());
        setFeatured(shuffled.slice(0, 3));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

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
          <div className="rounded-lg bg-white shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-teal-700">Featured Items</h2>
            {loading ? (
              <div className="flex justify-center items-center h-56"><Spinner size={16} /></div>
            ) : featured.length === 0 ? (
              <div className="flex gap-4 overflow-x-auto">
                <div className="w-44 h-56 bg-gray-200 rounded shadow flex items-center justify-center text-gray-400">No featured items</div>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto">
                {featured.map(item => (
                  <Link key={item._id} href={`/item/${item._id}`} className="w-44 h-56 bg-white rounded shadow flex flex-col items-center justify-between p-2 hover:shadow-lg transition">
                    <div className="w-full h-32 flex items-center justify-center mb-2">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.title} className="object-cover h-32 w-full rounded" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="font-bold text-base text-teal-700 text-center line-clamp-2">{item.title}</div>
                    <div className="text-gray-600 text-sm text-center">{item.category} • {item.size}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
