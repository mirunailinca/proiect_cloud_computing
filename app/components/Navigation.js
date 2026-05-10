'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #bbf7d0',
      padding: '0.9rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#16a34a', fontWeight: 'bold', fontSize: '1.3rem' }}>
        🌿 PlantApp
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link href="/dashboard" style={{ textDecoration: 'none', color: '#374151', fontSize: '0.9rem' }}>
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: '#16a34a',
                border: '1px solid #16a34a',
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              background: '#16a34a',
              color: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

