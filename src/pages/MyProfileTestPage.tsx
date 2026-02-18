import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { User, Mail, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function MyProfileTestPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20 mt-16">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Non connecté
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour voir cette page.
            </p>
            <a
              href="#auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test de profil utilisateur
          </h1>
          <p className="text-gray-600 mb-8">
            Vérification que votre profil a été créé correctement
          </p>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations d'authentification
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-blue-800 font-medium w-32">ID:</span>
                  <span className="text-blue-900 font-mono break-all">{user.id}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-800 font-medium w-32">Email:</span>
                  <span className="text-blue-900">{user.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-800 font-medium w-32">Créé le:</span>
                  <span className="text-blue-900">
                    {new Date(user.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-800 font-medium w-32">Username:</span>
                  <span className="text-blue-900">
                    {user.user_metadata?.username || 'Non défini'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-800 font-medium w-32">Display Name:</span>
                  <span className="text-blue-900">
                    {user.user_metadata?.display_name || 'Non défini'}
                  </span>
                </div>
              </div>
            </div>

            <div className={`border rounded-lg p-6 ${
              profile ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`font-bold mb-4 flex items-center gap-2 ${
                profile ? 'text-green-900' : 'text-red-900'
              }`}>
                {profile ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Profil créé avec succès
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Profil non trouvé
                  </>
                )}
              </h3>

              {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chargement du profil...
                </div>
              ) : error ? (
                <div className="text-red-800 text-sm">
                  <p className="font-medium mb-2">Erreur:</p>
                  <p className="bg-red-100 p-3 rounded">{error}</p>
                </div>
              ) : profile ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className={`font-medium w-48 ${
                      profile ? 'text-green-800' : 'text-red-800'
                    }`}>ID:</span>
                    <span className={`font-mono break-all ${
                      profile ? 'text-green-900' : 'text-red-900'
                    }`}>{profile.id}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Username:</span>
                    <span className="text-green-900">{profile.username || 'Non défini'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Display Name:</span>
                    <span className="text-green-900">{profile.display_name || 'Non défini'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Bio:</span>
                    <span className="text-green-900">{profile.bio || 'Aucune'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Statut:</span>
                    <span className="text-green-900">{profile.user_status || 'Non défini'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Score de confiance:</span>
                    <span className="text-green-900">{profile.trust_score || '0'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Support activé:</span>
                    <span className="text-green-900">
                      {profile.support_enabled ? 'Oui' : 'Non'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Montant minimum:</span>
                    <span className="text-green-900">
                      {profile.minimum_support_amount || 0}€
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-800 font-medium w-48">Créé le:</span>
                    <span className="text-green-900">
                      {profile.created_at ? new Date(profile.created_at).toLocaleString('fr-FR') : 'Non défini'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-red-800 text-sm">
                  <p className="mb-2">Le profil n'a pas été créé automatiquement.</p>
                  <button
                    onClick={loadProfile}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Actions disponibles
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#my-profile"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir mon profil
                </a>
                <a
                  href="#settings"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Paramètres
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Rafraîchir la page
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
