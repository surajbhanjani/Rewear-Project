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
  const [userRole, setUserRole] = useState(null);
  const [swapToApprove, setSwapToApprove] = useState(null);
  const [offeredItemId, setOfferedItemId] = useState("");
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [incomingSwaps, setIncomingSwaps] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('role'));
    }
  }, []);

  useEffect(() => {
    if (userRole === 'admin') return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const resProfile = await axios.get('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
        setProfile(resProfile.data);
        const resItems = await axios.get('/api/user/items', { headers: { Authorization: `Bearer ${token}` } });
        setItems(resItems.data);
        const resSwaps = await axios.get('/api/user/swaps', { headers: { Authorization: `Bearer ${token}` } });
        setSwaps(resSwaps.data);
        // Fetch incoming swap requests for items uploaded by this user
        const resIncoming = await axios.get('/api/items');
        const myId = resProfile.data._id;
        const myItems = resIncoming.data.filter(item => item.uploader === myId);
        // Gather all swaps for my items
        let incoming = [];
        for (const item of myItems) {
          const resItemSwaps = await axios.get(`/api/items/${item._id}/swaps`);
          incoming = incoming.concat(resItemSwaps.data);
        }
        setIncomingSwaps(incoming);
      } catch (err) {
        toast.error('Failed to load dashboard');
      }
      setLoading(false);
    };
    fetchData();
  }, [userRole]);

  if (userRole === null) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={16} /></div>;
  if (profile && profile.role === 'admin') {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p>Admins do not have a user dashboard. Please use the Admin panel to manage items and users.</p>
      </div>
    );
  }

  function handleApprove(swapId, swapType) {
    if (swapType === 'swap') {
      setSwapToApprove(swapId);
      setShowSwapModal(true);
      setOfferedItemId("");
      return;
    }
    // For redeem
    const token = localStorage.getItem('token');
    axios.post(`/api/user/swap/${swapId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success('Redeem approved!');
        setIncomingSwaps(swaps => swaps.map(s => s._id === swapId ? { ...s, status: 'completed' } : s));
      })
      .catch(() => toast.error('Failed to approve redeem'));
  }

  function approveSwapWithItem() {
    if (!offeredItemId) return toast.error('Select an item to swap');
    const token = localStorage.getItem('token');
    axios.post(`/api/user/swap/${swapToApprove}/approve`, { offeredItem: offeredItemId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success('Swap approved!');
        setIncomingSwaps(swaps => swaps.map(s => s._id === swapToApprove ? { ...s, status: 'completed', offeredItem: offeredItemId } : s));
        setShowSwapModal(false);
        setSwapToApprove(null);
        setOfferedItemId("");
      })
      .catch(() => toast.error('Failed to approve swap'));
  }
  function handleReject(swapId) {
    const token = localStorage.getItem('token');
    axios.post(`/api/user/swap/${swapId}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        toast.success('Swap rejected!');
        setIncomingSwaps(swaps => swaps.map(s => s._id === swapId ? { ...s, status: 'rejected' } : s));
      })
      .catch(() => toast.error('Failed to reject swap'));
  }

  // Render incoming swaps
  function renderIncomingSwaps() {
    if (!incomingSwaps || incomingSwaps.length === 0) return null;
    return (
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Incoming Swap/Redeem Requests</h2>
        <div className="space-y-4">
          {incomingSwaps.map(swap => (
            <div key={swap._id} className="p-4 border rounded bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div><span className="font-semibold">Item:</span> {swap.item?.title || swap.item}</div>
                <div><span className="font-semibold">Requester:</span> {swap.requester?.name || swap.requester?.email}</div>
                <div><span className="font-semibold">Type:</span> {swap.type}</div>
                <div><span className="font-semibold">Status:</span> <span className={`font-bold ${swap.status === 'pending' ? 'text-yellow-700' : swap.status === 'completed' ? 'text-green-700' : 'text-red-700'}`}>{swap.status}</span></div>
              </div>
              {swap.status === 'pending' && (
                <div className="mt-2 md:mt-0 flex gap-2">
                  <button onClick={() => handleApprove(swap._id, swap.type)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approve</button>
                  <button onClick={() => handleReject(swap._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
                </div>
              )}
              {swap.offeredItem && (
                <div className="mt-2 text-sm text-teal-700">Offered Item: {items.find(i => i._id === swap.offeredItem)?.title || swap.offeredItem}</div>
              )}
            </div>
          ))}
        </div>
        {/* Swap approval modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
              <button onClick={() => setShowSwapModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
              <h3 className="text-lg font-bold mb-2">Select Item to Swap</h3>
              <select
                className="w-full p-2 mb-4 border rounded"
                value={offeredItemId}
                onChange={e => setOfferedItemId(e.target.value)}
              >
                <option value="">-- Select your item --</option>
                {items.filter(i => i.status !== 'swapped').map(item => (
                  <option key={item._id} value={item._id}>{item.title}</option>
                ))}
              </select>
              <button
                onClick={approveSwapWithItem}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                disabled={!offeredItemId}
              >Approve Swap</button>
            </div>
          </div>
        )}
      </div>
    );
  }

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
