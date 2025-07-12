import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-teal-700">ReWear</Link>
        <div className="flex gap-4 items-center">
          <Link href="/browse" className="hover:text-teal-600 font-semibold">Browse</Link>
          {isLoggedIn && <Link href="/dashboard" className="hover:text-teal-600 font-semibold">Dashboard</Link>}
          <Link href="/add-item" className="hover:text-teal-600 font-semibold">List Item</Link>
          {isLoggedIn && <Link href="/admin" className="hover:text-pink-600 font-semibold">Admin</Link>}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition">Logout</button>
          ) : (
            <Link href="/auth/login" className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
