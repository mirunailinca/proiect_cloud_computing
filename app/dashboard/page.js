'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    } else if (user) {
      fetchPlants();
    }
  }, [user, router]);

  const fetchPlants = async () => {
    try {
      const res = await fetch('/api/plants');
      const data = await res.json();
      const userPlants = data.filter(p => p.userId === user.uid);
      setPlants(userPlants);
    } catch (err) {
      console.error("Eroare la fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPlant = async (e) => {
    e.preventDefault();
    if (!name) return;
    setIsAdding(true);

    await fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        species: species || 'Necunoscută',
        date: new Date().toISOString(),
        userId: user.uid
      }),
    });

    setName('');
    setSpecies('');
    await fetchPlants();
    setIsAdding(false);
  };

  const deletePlant = async (id) => {
    if (!confirm('Sigur vrei să ștergi planta?')) return;
    await fetch(`/api/plants/${id}`, { method: 'DELETE' });
    fetchPlants();
  };

  if (loading || !user) {
    return <p style={{ padding: '2rem', color: '#6b7280' }}>Se încarcă...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#15803d', margin: 0 }}>
          🌿 Grădina ta
        </h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{user.email}</span>
      </div>

      {/* Formular adaugare */}
      <div style={{
        background: 'white',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
          Adaugă o plantă nouă
        </h2>
        <form onSubmit={addPlant} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nume plantă (ex: Ficusul meu)"
            required
            style={{ flex: '1', minWidth: '180px' }}
          />
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="Specie (opțional)"
            style={{ flex: '1', minWidth: '150px' }}
          />
          <button
            type="submit"
            disabled={isAdding}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              opacity: isAdding ? 0.7 : 1
            }}
          >
            {isAdding ? 'Se salvează...' : 'Salvează'}
          </button>
        </form>
      </div>

      {/* Lista plante */}
      <h2 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
        Plantele tale ({plants.length})
      </h2>

      {plants.length === 0 ? (
        <div style={{
          background: 'white',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
          <p>Nu ai nicio plantă încă. Adaugă prima ta plantă!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {plants.map((plant) => (
            <div key={plant._id} style={{
              background: 'white',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌿</div>
              <div style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '0.2rem', color: '#1a2e1a' }}>
                {plant.name}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {plant.species}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '1rem' }}>
                Adăugată: {new Date(plant.date).toLocaleDateString('ro-RO')}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  href={`/dashboard/${plant._id}`}
                  style={{
                    background: '#16a34a',
                    color: 'white',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    flex: 1,
                    textAlign: 'center'
                  }}
                >
                  Chat AI
                </Link>
                <button
                  onClick={() => deletePlant(plant._id)}
                  style={{
                    background: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #fca5a5',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Sterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
