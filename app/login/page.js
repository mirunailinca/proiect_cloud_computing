'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isRegistering) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push('/dashboard');
    } catch (err) {
      alert("Eroare: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto' }}>
      <div style={{
        background: 'white',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🌿</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#15803d', margin: '0.5rem 0 0.25rem' }}>
            {isRegistering ? 'Creare cont' : 'Conectare'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            {isRegistering ? 'Creează un cont nou' : 'Bine ai revenit!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: '#374151' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="email@exemplu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', color: '#374151' }}>
              Parolă
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '0.7rem',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '0.5rem'
            }}
          >
            {isLoading ? 'Se procesează...' : (isRegistering ? 'Înregistrare' : 'Conectare')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: 'none',
              border: 'none',
              color: '#16a34a',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {isRegistering ? 'Ai deja cont? Conectează-te' : 'Nu ai cont? Înregistrează-te'}
          </button>
        </div>
      </div>
    </div>
  );
}