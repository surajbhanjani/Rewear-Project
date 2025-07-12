import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/items');
        const token = localStorage.getItem('token');
        let userId = null;
        if (token) {
          // Decode JWT to get user id
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id || payload._id || payload.userId;
        }
        // Only show items that are approved and not uploaded by the current user
        const filtered = res.data.filter(item => {
          // uploader may be an object or a string; always compare as string
          if (item.status !== 'approved') return false;
          if (!userId) return true;
          // item.uploader may be object or string (from population); handle both
          const uploaderId = typeof item.uploader === 'object' ? item.uploader._id : item.uploader;
          return String(uploaderId) !== String(userId);
        });
        setItems(filtered);
      } catch {
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={16} /></div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-teal-100 via-white to-pink-100">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Browse Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <Link key={item._id} href={`/item/${item._id}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <div className="h-48 bg-gray-100 rounded mb-2 flex items-center justify-center">
              {item.images && item.images[0] ? (
                <img src={item.images[0]} alt={item.title} className="object-cover h-full w-full rounded" />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="font-bold text-lg text-teal-700">{item.title}</div>
            <div className="text-gray-600">{item.category} • {item.size}</div>
            <div className="text-gray-500 text-sm mt-1">{item.condition}</div>
            <div className="text-yellow-700 font-semibold text-sm mt-1">Points: {item.points}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
