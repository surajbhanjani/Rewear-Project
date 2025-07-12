import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchData = async () => {
      try {
        const [profileRes, itemsRes, swapsRes] = await Promise.all([
          axios.get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/user/items', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/user/swaps', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProfile(profileRes.data);
        setItems(itemsRes.data);
        setSwaps(swapsRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={16} /></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Please log in.</div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-teal-100 via-white to-pink-100">
      <h1 className="text-3xl font-bold text-teal-700 mb-4">Dashboard</h1>
      <div className="mb-6 bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
        <div>
          <div className="text-xl font-semibold mb-2">{profile.name}</div>
          <div className="text-gray-600 mb-1">{profile.email}</div>
          <div className="text-yellow-600 font-bold">Points: {profile.points}</div>
        </div>
        <div className="flex-1">
          <Link href="/add-item" className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 transition">List New Item</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-teal-700">Your Items</h2>
          {items.length === 0 ? <div>No items uploaded yet.</div> : (
            <ul>
              {items.map(item => (
                <li key={item._id} className="mb-2 flex items-center">
                  <span className="flex-1">{item.title} <span className="text-gray-500">({item.status})</span></span>
                  <Link href={`/item/${item._id}`} className="text-teal-600 hover:underline ml-2">View</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-teal-700">Your Swaps</h2>
          {swaps.length === 0 ? <div>No swaps yet.</div> : (
            <ul>
              {swaps.map(swap => (
                <li key={swap._id} className="mb-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">{swap.item?.title || 'Item'}</span>
                    <span className="text-gray-500 text-sm">Status: {swap.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
