import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { fontSize: '1rem' },
        success: { style: { background: '#14b8a6', color: 'white' } },
        error: { style: { background: '#f43f5e', color: 'white' } },
      }} />
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
