import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('token');
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({ name: '', email: '' });
  const profileRef = React.useRef(null);

  React.useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  React.useEffect(() => {
    const closeProfile = () => setProfileOpen(false);
    router.events?.on('routeChangeStart', closeProfile);
    return () => router.events?.off('routeChangeStart', closeProfile);
  }, [router]);

  React.useEffect(() => {
    if (isLoggedIn) {
      // Try to get from localStorage first
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');
      if (name && email) {
        setUserInfo({ name, email });
      } else {
        // Fallback to API fetch
        fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
          .then(res => res.json())
          .then(data => {
            setUserInfo({ name: data.name, email: data.email });
            localStorage.setItem('name', data.name);
            localStorage.setItem('email', data.email);
          });
      }
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-teal-700">ReWear</Link>
        <div className="flex gap-4 items-center">
          <Link href="/browse" className="hover:text-teal-600 font-semibold">Browse</Link>
          {isLoggedIn && userRole !== 'admin' && <Link href="/dashboard" className="hover:text-teal-600 font-semibold">Dashboard</Link>}
          {isLoggedIn && userRole !== 'admin' && <Link href="/add-item" className="hover:text-teal-600 font-semibold">List Item</Link>}
          {isLoggedIn && userRole === 'admin' && <Link href="/admin" className="hover:text-pink-600 font-semibold">Admin</Link>}
          {isLoggedIn ? (
            <>
              <div className="relative flex items-center" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-lg shadow hover:bg-teal-700 transition border-2 border-white focus:outline-none"
                  aria-label="User profile"
                  style={{ minWidth: 36 }}
                >
                  {userInfo.name ? userInfo.name[0].toUpperCase() : <span className="opacity-60">U</span>}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg p-4 z-50 border border-gray-100 animate-fade-in">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
                        {userInfo.name ? userInfo.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="font-semibold text-lg">{userInfo.name}</div>
                      <div className="text-gray-500 text-sm">{userInfo.email}</div>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="ml-2 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition">Logout</button>
            </>
          ) : (
            <Link href="/auth/login" className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
