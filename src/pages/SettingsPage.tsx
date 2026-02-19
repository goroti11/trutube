import { useState, useEffect } from 'react';
import {
  Bell, Shield, Eye,
  Trash2, Lock, Check, AlertCircle, Loader2, Moon, Sun, Monitor, Crown, Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import PremiumBadge from '../components/PremiumBadge';
import { paymentService, PremiumSubscription } from '../services/paymentService';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  privacy_public_profile: boolean;
  privacy_show_activity: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export const SettingsPage = ({ onNavigate }: SettingsPageProps) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [premiumSubscription, setPremiumSubscription] = useState<PremiumSubscription | null>(null);

  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
    privacy_public_profile: true,
    privacy_show_activity: true,
    theme: 'dark',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadSettings();
    loadPremiumSubscription();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? false,
          marketing_emails: data.marketing_emails ?? false,
          privacy_public_profile: data.privacy_public_profile ?? true,
          privacy_show_activity: data.privacy_show_activity ?? true,
          theme: data.theme ?? 'dark',
        });
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPremiumSubscription = async () => {
    if (!user) return;
    const subscription = await paymentService.getPremiumSubscription(user.id);
    setPremiumSubscription(subscription);
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          ...settings,
        });

      if (error) throw error;

      setSuccess('Paramètres enregistrés avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setSuccess('Mot de passe mis à jour avec succès!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setSaving(true);
      setError('');

      const { error } = await supabase.rpc('delete_user_account', {
        user_id: user?.id,
      });

      if (error) throw error;

      await signOut();
      onNavigate('home');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header onNavigate={onNavigate} showNavigation={true} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-white mb-8">Paramètres</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-6">
            {premiumSubscription && premiumSubscription.status === 'active' && (
              <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 border-2 border-primary-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-primary-400" />
                    <h2 className="text-xl font-semibold text-white">Abonnement Premium</h2>
                  </div>
                  <PremiumBadge
                    tier={premiumSubscription.tier as 'premium' | 'platine' | 'gold'}
                    size="lg"
                    animated={true}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Forfait</span>
                    <span className="text-white font-semibold">{premiumSubscription.tier.toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Prix mensuel</span>
                    <span className="text-white font-semibold">{premiumSubscription.price.toFixed(2)}€</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Statut</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                      <Check className="w-4 h-4" />
                      Actif
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Date d'expiration</span>
                    <span className="text-white">
                      {new Date(premiumSubscription.expires_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Renouvellement automatique</span>
                    <span className={`${premiumSubscription.auto_renew ? 'text-green-400' : 'text-gray-400'}`}>
                      {premiumSubscription.auto_renew ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => onNavigate('subscriptions')}
                    className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
                  >
                    Changer d'abonnement
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Voulez-vous vraiment annuler votre abonnement?')) {
                        await paymentService.cancelPremiumSubscription(user!.id);
                        setSuccess('Abonnement annulé. Vous conservez l\'accès jusqu\'à la fin de la période.');
                        loadPremiumSubscription();
                      }
                    }}
                    className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {!premiumSubscription && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <h2 className="text-xl font-semibold text-white">Passez à Premium</h2>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Débloquez des fonctionnalités exclusives et soutenez la plateforme
                    </p>
                    <button
                      onClick={() => onNavigate('subscriptions')}
                      className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-medium transition-colors"
                    >
                      Voir les offres Premium
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <Crown className="w-24 h-24 text-gray-700" />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-400">Recevoir des emails pour les nouvelles vidéos</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Notifications push</p>
                    <p className="text-sm text-gray-400">Recevoir des notifications dans le navigateur</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.push_notifications}
                    onChange={(e) => setSettings({ ...settings, push_notifications: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Emails marketing</p>
                    <p className="text-sm text-gray-400">Nouveautés, conseils et offres spéciales</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.marketing_emails}
                    onChange={(e) => setSettings({ ...settings, marketing_emails: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-white">Confidentialité</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Profil public</p>
                    <p className="text-sm text-gray-400">Permettre aux autres de voir votre profil</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy_public_profile}
                    onChange={(e) => setSettings({ ...settings, privacy_public_profile: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Afficher l'activité</p>
                    <p className="text-sm text-gray-400">Partager vos vues et interactions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy_show_activity}
                    onChange={(e) => setSettings({ ...settings, privacy_show_activity: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-white">Apparence</h2>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    settings.theme === 'light'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <Sun className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Clair</p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    settings.theme === 'dark'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <Moon className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Sombre</p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, theme: 'auto' })}
                  className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                    settings.theme === 'auto'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <Monitor className="w-6 h-6 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Auto</p>
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-white">Changer le mot de passe</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <button
                  onClick={updatePassword}
                  disabled={saving || !passwordData.newPassword}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-red-900/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-white">Zone de danger</h2>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 rounded-lg font-medium transition-colors"
                >
                  Supprimer mon compte
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-sm">
                      Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={deleteAccount}
                      disabled={saving}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Confirmer la suppression
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveSettings}
                disabled={saving}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Enregistrer les paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
