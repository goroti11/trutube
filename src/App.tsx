import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { NotificationBell } from './components/NotificationBell';
import { GamingLayout } from './modules/gaming/layouts/GamingLayout';
import { GamingHub } from './modules/gaming/pages/GamingHub';
import { Tournaments } from './modules/gaming/pages/Tournaments';
import { Leaderboards } from './modules/gaming/pages/Leaderboards';
import { LegendPage } from './pages/LegendPage';
import { HallOfFamePage } from './pages/HallOfFamePage';

function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">GOROTI Platform</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-yellow-400 transition-colors">
            GOROTI
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/legende"
              className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-colors font-semibold"
            >
              🏛️ LÉGENDE
            </Link>
            <Link
              to="/gaming"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gaming Division
            </Link>
            <NotificationBell />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to GOROTI</h2>
          <p className="text-xl text-gray-400 mb-8">
            Enterprise-grade streaming and gaming platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Link
              to="/legende"
              className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-xl hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-bold mb-2">🏛️ LÉGENDE</h3>
              <p className="text-yellow-100">Contenu exceptionnel</p>
            </Link>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Live Streaming</h3>
              <p className="text-gray-400">Stream and watch live content</p>
            </div>
            <Link
              to="/gaming"
              className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-xl font-bold mb-2">Gaming Division</h3>
              <p className="text-gray-400">Compete in tournaments</p>
            </Link>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-2">TruCoins</h3>
              <p className="text-gray-400">Platform virtual currency</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/legende"
          element={
            <ProtectedRoute>
              <LegendPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hall-of-fame"
          element={
            <ProtectedRoute>
              <HallOfFamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gaming/*"
          element={
            <ProtectedRoute>
              <GamingLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<GamingHub />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="leaderboards" element={<Leaderboards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
