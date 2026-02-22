import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user, signOut } = useAuth();

  const styles = {
    page: {
      minHeight: '100vh',
      padding: '4rem 1rem'
    },
    title: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#cbd5e1',
      maxWidth: '42rem',
      margin: '0 auto 2rem'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap' as const
    }
  };

  return (
    <div style={styles.page}>
      <div className="container text-center space-y-8">
        <h1 style={styles.title}>
          Welcome to <span style={{ color: '#10b981' }}>GOROTI</span>
        </h1>

        <p style={styles.subtitle}>
          The ultimate platform for creators to connect, stream, and monetize their content.
        </p>

        {user ? (
          <div className="space-y-4">
            <p style={{ fontSize: '1.125rem' }}>
              Welcome back, <span style={{ fontWeight: 600, color: '#10b981' }}>{user.email}</span>
            </p>
            <button onClick={signOut} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        ) : (
          <div style={styles.buttonGroup}>
            <a href="/login">
              <button className="btn btn-primary">Get Started</button>
            </a>
            <a href="/login">
              <button className="btn btn-secondary">Sign In</button>
            </a>
          </div>
        )}

        <div className="grid-3" style={{ maxWidth: '80rem', margin: '3rem auto 0' }}>
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎥</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Live Streaming
            </h3>
            <p style={{ color: '#94a3b8' }}>
              Stream to your audience with advanced features and real-time interaction
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Monetization
            </h3>
            <p style={{ color: '#94a3b8' }}>
              Multiple revenue streams including subscriptions, tips, and merchandise
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎮</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Gaming Hub
            </h3>
            <p style={{ color: '#94a3b8' }}>
              Compete in tournaments, earn rewards, and climb the leaderboards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
