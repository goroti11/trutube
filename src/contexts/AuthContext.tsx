import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await ensureProfileExists(session.user);
      }

      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          await ensureProfileExists(session.user);
        }

        setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureProfileExists = async (user: User) => {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
      const displayName = user.user_metadata?.display_name || username;

      await supabase.from('profiles').insert({
        id: user.id,
        display_name: displayName,
        username: username,
        user_status: 'viewer',
        trust_score: 0.5,
        support_enabled: true,
        minimum_support_amount: 5.00,
        total_support_received: 0,
      });

      await supabase.from('user_trust_scores').insert({
        user_id: user.id,
        overall_trust: 0.5,
        view_authenticity: 0.5,
        report_accuracy: 0.5,
        engagement_quality: 0.5,
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
