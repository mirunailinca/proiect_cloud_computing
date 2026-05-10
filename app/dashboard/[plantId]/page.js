'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PlantPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const plantId = resolvedParams.plantId;

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchPlant();
    }
  }, [user, router, plantId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchPlant = async () => {
    try {
      const res = await fetch(`/api/plants/${plantId}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Nu am găsit planta');
      }
      const data = await res.json();

      if (data.userId && data.userId !== user.uid) {
        router.push('/dashboard');
        return;
      }

      setPlant(data);
      setMessages([
        { role: 'assistant', content: `Salut! Sunt botanistul tău AI 🌱 Cu ce te pot ajuta în legătură cu "${data.name}"?` }
      ]);
    } catch (err) {
      console.error('fetchPlant error:', err.message);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, plant }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Eroare: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading || !plant) {
    return <p style={{ padding: '2rem', color: '#6b7280' }}>Se încarcă...</p>;
  }

  return (
    <div>
      <Link href="/dashboard" style={{ textDecoration: 'none', color: '#16a34a', fontSize: '0.9rem' }}>
        ← Înapoi la grădină
      </Link>

      {/* Detalii planta */}
      <div style={{
        background: 'white',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        padding: '1.5rem',
        margin: '1rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '3rem' }}>🌿</span>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d' }}>{plant.name}</h1>
          <p style={{ margin: '0.2rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>Specie: {plant.species || 'Necunoscută'}</p>
        </div>
      </div>

      {/* Chat */}
      <div style={{
        background: 'white',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Header chat */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #bbf7d0',
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#15803d' }}>Botanist AI</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Powered by Together AI (Llama 3)</div>
          </div>
        </div>

        {/* Mesaje */}
        <div style={{
          height: '420px',
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '0.65rem 1rem',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                background: msg.role === 'user' ? '#16a34a' : '#f0fdf4',
                color: msg.role === 'user' ? 'white' : '#1a2e1a',
                fontSize: '0.9rem',
                border: msg.role === 'user' ? 'none' : '1px solid #bbf7d0',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '0.65rem 1rem',
                borderRadius: '12px 12px 12px 2px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#9ca3af',
                fontSize: '0.85rem'
              }}>
                Se generează răspunsul...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} style={{
          padding: '0.75rem',
          borderTop: '1px solid #bbf7d0',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Întriabă-mă ceva despre ${plant.name}...`}
            disabled={isTyping}
            style={{ flex: 1, color: '#1a2e1a' }}
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: (isTyping || !input.trim()) ? 0.5 : 1
            }}
          >
            Trimite
          </button>
        </form>
      </div>
    </div>
  );
}
