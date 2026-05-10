'use client';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>

      <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.5rem' }}>
        PlantApp
      </h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
        Gestionează-ți plantele și primește sfaturi de îngrijire personalizate de la un botanist AI.
      </p>

      <Link
        href="/login"
        style={{
          background: '#16a34a',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '1rem',
          display: 'inline-block'
        }}
      >
        Începe acum →
      </Link>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '4rem',
        flexWrap: 'wrap'
      }}>
        {[
          { icon: 'DB', title: 'MongoDB Atlas', desc: 'Plantele tale salvate în cloud' },
          { icon: 'Auth', title: 'Firebase Auth', desc: 'Autentificare securizată' },
          { icon: 'AI', title: 'Together AI', desc: 'Sfaturi de la un botanist AI' },
        ].map((f, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '1.5rem',
            width: '200px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{f.icon}</div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#15803d' }}>{f.title}</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}