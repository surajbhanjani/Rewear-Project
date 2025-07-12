import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function AdminPanel() {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('/api/admin/pending-items', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPendingItems(res.data))
      .catch(() => toast.error('Failed to load pending items'))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/admin/${action}/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPendingItems(pendingItems.filter(item => item._id !== id));
      setMessage(`Item ${action}d successfully!`);
      toast.success(`Item ${action}d successfully!`);
    } catch (err) {
      setMessage(err.response?.data?.message || `Failed to ${action} item`);
      toast.error(err.response?.data?.message || `Failed to ${action} item`);
    }
  };

  const handleRemove = async (id) => {
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/admin/remove/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPendingItems(pendingItems.filter(item => item._id !== id));
      setMessage('Item removed successfully!');
      toast.success('Item removed successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to remove item');
      toast.error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={16} /></div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-teal-100 via-white to-pink-100">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Admin Panel</h1>
      {message && <div className="mb-4 text-pink-600 font-semibold">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingItems.length === 0 ? <div>No pending items.</div> : pendingItems.map(item => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                {item.images && item.images[0] ? (
                  <img src={item.images[0]} alt={item.title} className="object-cover h-full w-full rounded" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-teal-700">{item.title}</div>
                <div className="text-gray-600">{item.category} • {item.size}</div>
                <div className="text-gray-500 text-sm mt-1">{item.condition}</div>
                <div className="text-sm mt-1">Uploader: <span className="text-teal-700 font-semibold">{item.uploader?.name}</span></div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleAction(item._id, 'approve')} className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition">Approve</button>
                  <button onClick={() => handleAction(item._id, 'reject')} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Reject</button>
                  <button onClick={() => handleRemove(item._id)} className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition">Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
