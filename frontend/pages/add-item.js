import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function AddItem() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', type: '', size: '', condition: '', tags: '', images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleUploadImages = async () => {
    const token = localStorage.getItem('token');
    const urls = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post('/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      urls.push(res.data.url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const imageUrls = await handleUploadImages();
      const token = localStorage.getItem('token');
      await axios.post('/api/items', {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()),
        images: imageUrls,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Item listed successfully!');
      toast.success('Item listed successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list item');
      toast.error(err.response?.data?.message || 'Failed to list item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-pink-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-teal-700">List a New Item</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="w-full p-3 mb-4 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="w-full p-3 mb-4 border rounded" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category (e.g. Men, Women)" required className="w-full p-3 mb-4 border rounded" />
        <input name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g. Shirt, Pants)" required className="w-full p-3 mb-4 border rounded" />
        <input name="size" value={form.size} onChange={handleChange} placeholder="Size (e.g. M, L)" required className="w-full p-3 mb-4 border rounded" />
        <input name="condition" value={form.condition} onChange={handleChange} placeholder="Condition (e.g. New, Gently Used)" required className="w-full p-3 mb-4 border rounded" />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-3 mb-4 border rounded" />
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mb-4" />
        <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded font-semibold hover:bg-teal-700 transition flex items-center justify-center">
          {loading ? <Spinner size={8} /> : 'List Item'}
        </button>
      </form>
    </div>
  );
}
