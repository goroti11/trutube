import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />

          <Route
            path="/legende"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="container section">
                    <h1 className="text-4xl font-bold mb-4">LÉGENDE</h1>
                    <p className="text-neutral-400">
                      Le système LÉGENDE sera bientôt disponible ici.
                    </p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/gaming"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="container section">
                    <h1 className="text-4xl font-bold mb-4">Gaming Division</h1>
                    <p className="text-neutral-400">
                      Les tournois et classements seront bientôt disponibles.
                    </p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="container section">
                    <h1 className="text-4xl font-bold mb-4">Live Streaming</h1>
                    <p className="text-neutral-400">
                      La section live sera bientôt disponible.
                    </p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/music"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="container section">
                    <h1 className="text-4xl font-bold mb-4">Music</h1>
                    <p className="text-neutral-400">
                      La plateforme musicale sera bientôt disponible.
                    </p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
