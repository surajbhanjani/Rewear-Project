import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.user && res.data.user.role) {
        localStorage.setItem('role', res.data.user.role);
      }
      toast.success('Signup successful!');
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-pink-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-teal-700">Sign Up</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-3 rounded font-semibold hover:bg-teal-700 transition flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Spinner size={8} /> : 'Sign Up'}
        </button>
        <div className="mt-4 text-center">
          <a href="/auth/login" className="text-teal-600 hover:underline">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
}
