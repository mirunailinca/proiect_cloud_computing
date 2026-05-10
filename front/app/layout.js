import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import "./globals.css";

export const metadata = {
  title: "PlantApp - Grădina ta inteligentă",
  description: "Aplicație cloud pentru îngrijirea plantelor cu ajutorul AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body style={{ margin: 0, minHeight: '100vh', background: '#f0fdf4' }}>
        <AuthProvider>
          <Navigation />
          <main style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}