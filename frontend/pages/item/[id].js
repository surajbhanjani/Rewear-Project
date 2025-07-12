import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

export default function ItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    axios.get(`/api/items/${id}`)
      .then(res => setItem(res.data))
      .catch(() => toast.error('Failed to load item'))
      .finally(() => setLoading(false));
  }, [id]);

  // Get logged-in user id from JWT
  let userId = null;
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id || payload._id || payload.userId;
      } catch {}
    }
  }

  const handleSwap = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/items/${id}/swap`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Swap request sent!');
      toast.success('Swap request sent!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Swap request failed');
      toast.error(err.response?.data?.message || 'Swap request failed');
    }
  };

  const handleRedeem = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/items/${id}/redeem`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Redeemed with points!');
      toast.success('Redeemed with points!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Redemption failed');
      toast.error(err.response?.data?.message || 'Redemption failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={16} /></div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center">Item not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-teal-100 via-white to-pink-100">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-full md:w-80 h-80 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
            {item.images && item.images[0] ? (
              <img src={item.images[0]} alt={item.title} className="object-cover h-full w-full rounded" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-teal-700 mb-2">{item.title}</h1>
            <div className="mb-2 text-gray-600">{item.category} • {item.type} • {item.size}</div>
            <div className="mb-2 text-gray-500">Condition: {item.condition}</div>
            <div className="mb-4">{item.description}</div>
            <div className="mb-2 text-sm text-gray-500">Tags: {item.tags?.join(', ')}</div>
            <div className="mb-2 text-yellow-700 font-semibold text-base">Points: {item.points}</div>
            <div className="mb-2 text-sm">Uploaded by: <span className="text-teal-700 font-semibold">{item.uploader?.name}</span></div>
            <div className="mb-4 text-sm">Status: <span className="font-semibold capitalize">{item.status}</span></div>
            {item && userId && item.uploader !== userId && (
            <div className="flex gap-4">
              <button onClick={handleSwap} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Swap Request</button>
              <button onClick={handleRedeem} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">Redeem via Points</button>
            </div>
          )}
            {message && <div className="mt-4 text-pink-600 font-semibold">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
