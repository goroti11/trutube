import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    container: {
      maxWidth: '28rem',
      width: '100%'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#cbd5e1',
      marginBottom: '0.5rem'
    },
    footer: {
      marginTop: '1.5rem',
      textAlign: 'center' as const
    },
    link: {
      color: '#10b981',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    backLink: {
      marginTop: '2rem',
      textAlign: 'center' as const
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#94a3b8' }}>
            {isSignUp ? 'Join the GOROTI community' : 'Sign in to your account'}
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="error">{error}</div>
            )}

            <div>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div style={styles.footer}>
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              style={styles.link}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </span>
          </div>
        </div>

        <div style={styles.backLink}>
          <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
