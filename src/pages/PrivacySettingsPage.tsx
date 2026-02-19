import { useState, useEffect } from 'react';
import {
  ArrowLeft, Shield, Eye, Lock, Users, Save, Check,
  Cookie, Bell, BellOff, BarChart2, Zap, Settings,
  CheckCircle, AlertCircle, ExternalLink, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileEnhancedService } from '../services/profileEnhancedService';
import { getCookieConsent, saveCookieConsent, CookiePreferences } from '../components/CookieBanner';
import { NotificationStatusBadge, sendNotification } from '../components/NotificationManager';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  onNavigate: (page: string) => void;
}

type Tab = 'profile' | 'cookies' | 'notifications' | 'data';

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={!disabled ? onChange : undefined}
      disabled={disabled}
      className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-red-600' : 'bg-gray-700'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function PrivacySettingsPage({ onNavigate }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const [profileSettings, setProfileSettings] = useState({
    show_email: false,
    show_subscribers: true,
    allow_messages: true,
    show_activity: true,
    public_profile: true,
    show_liked_videos: false,
    show_playlists: true,
    allow_comments: true,
    allow_video_responses: true,
    mature_content_warning: true,
  });

  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [notifSettings, setNotifSettings] = useState({
    new_video: true,
    live_start: true,
    new_message: true,
    community_post: false,
    merch_promo: false,
  });

  useEffect(() => {
    loadSettings();
    const existing = getCookieConsent();
    if (existing) {
      setCookiePrefs({
        essential: true,
        functional: existing.functional ?? true,
        analytics: existing.analytics ?? false,
        marketing: existing.marketing ?? false,
      });
    }
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profile = await profileEnhancedService.getEnhancedProfile(user.id);
      if (profile?.privacy_settings) {
        setProfileSettings(s => ({ ...s, ...profile.privacy_settings }));
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const ok = await profileEnhancedService.updatePrivacySettings(user.id, profileSettings);
    if (ok) showSuccess('Paramètres de confidentialité enregistrés');
    setSaving(false);
  };

  const handleSaveCookies = () => {
    saveCookieConsent(cookiePrefs);
    showSuccess('Préférences de cookies enregistrées');
  };

  const handleResetCookies = () => {
    localStorage.removeItem('trutube_cookie_consent');
    setCookiePrefs({ essential: true, functional: true, analytics: false, marketing: false });
    showSuccess('Préférences réinitialisées — le bandeau réapparaîtra au prochain chargement');
  };

  const requestNotifications = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === 'granted') {
      sendNotification('Notifications activées', 'Vous recevrez des alertes en temps réel sur TruTube.');
      showSuccess('Notifications push activées');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleProfile = (key: keyof typeof profileSettings) => {
    setProfileSettings(s => ({ ...s, [key]: !s[key] }));
  };

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings(s => ({ ...s, [key]: !s[key] }));
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profil & Visibilité' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'data', label: 'Mes données' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex justify-center items-center py-32 mt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 mt-16">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Confidentialité</h1>
            <p className="text-sm text-gray-400">Gérez vos données, cookies et notifications</p>
          </div>
          {activeTab === 'profile' && (
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          )}
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-800 rounded-xl text-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Section title="Visibilité du profil" icon={<Eye className="w-4 h-4" />}>
              {[
                { key: 'public_profile' as const, label: 'Profil public', desc: 'Permettre aux autres de voir votre profil' },
                { key: 'show_email' as const, label: 'Afficher l\'email', desc: 'Rendre votre adresse email visible' },
                { key: 'show_subscribers' as const, label: 'Afficher les abonnés', desc: 'Montrer le nombre d\'abonnés' },
                { key: 'show_activity' as const, label: 'Afficher l\'activité', desc: 'Partager vos vues et interactions' },
                { key: 'show_liked_videos' as const, label: 'Vidéos aimées', desc: 'Rendre visible votre liste de likes' },
                { key: 'show_playlists' as const, label: 'Playlists publiques', desc: 'Rendre vos playlists visibles' },
              ].map(({ key, label, desc }) => (
                <SettingRow key={key} label={label} desc={desc}>
                  <Toggle checked={profileSettings[key]} onChange={() => toggleProfile(key)} />
                </SettingRow>
              ))}
            </Section>

            <Section title="Interactions" icon={<Users className="w-4 h-4" />}>
              {[
                { key: 'allow_messages' as const, label: 'Messages privés', desc: 'Recevoir des messages d\'autres utilisateurs' },
                { key: 'allow_comments' as const, label: 'Commentaires', desc: 'Permettre les commentaires sur vos vidéos' },
                { key: 'allow_video_responses' as const, label: 'Réponses vidéo', desc: 'Autoriser les réponses en format vidéo' },
              ].map(({ key, label, desc }) => (
                <SettingRow key={key} label={label} desc={desc}>
                  <Toggle checked={profileSettings[key]} onChange={() => toggleProfile(key)} />
                </SettingRow>
              ))}
            </Section>

            <Section title="Contenu sensible" icon={<Lock className="w-4 h-4" />}>
              <SettingRow label="Avertissement contenu mature" desc="Afficher un avertissement avant le contenu 18+">
                <Toggle checked={profileSettings.mature_content_warning} onChange={() => toggleProfile('mature_content_warning')} />
              </SettingRow>
            </Section>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                TruTube respecte le RGPD. Vos données ne sont jamais vendues à des tiers. Pour en savoir plus, consultez notre{' '}
                <button onClick={() => onNavigate('privacy')} className="text-red-400 hover:text-red-300 underline transition-colors">
                  politique de confidentialité
                </button>.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-5">
                <Cookie className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-white">Préférences de cookies</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Gérez les types de cookies que TruTube peut utiliser. Les cookies essentiels ne peuvent pas être désactivés.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'essential' as const,
                    label: 'Cookies essentiels',
                    desc: 'Authentification, sécurité, session utilisateur. Indispensables au fonctionnement.',
                    icon: <Shield className="w-4 h-4" />,
                    required: true,
                  },
                  {
                    key: 'functional' as const,
                    label: 'Cookies fonctionnels',
                    desc: 'Mémorisent vos préférences : thème, langue, lecture automatique, qualité vidéo.',
                    icon: <Settings className="w-4 h-4" />,
                    required: false,
                  },
                  {
                    key: 'analytics' as const,
                    label: 'Cookies analytiques',
                    desc: "Nous aident à comprendre l'utilisation du site pour améliorer l'expérience (anonymisés).",
                    icon: <BarChart2 className="w-4 h-4" />,
                    required: false,
                  },
                  {
                    key: 'marketing' as const,
                    label: 'Cookies marketing',
                    desc: 'Permettent des contenus et publicités personnalisés selon vos centres d\'intérêt.',
                    icon: <Zap className="w-4 h-4" />,
                    required: false,
                  },
                ].map(({ key, label, desc, icon, required }) => (
                  <div key={key} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`mt-0.5 ${required ? 'text-green-400' : 'text-gray-500'}`}>{icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-white">{label}</p>
                            {required && <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Obligatoire</span>}
                          </div>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                      </div>
                      {required ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Toggle
                          checked={cookiePrefs[key]}
                          onChange={() => setCookiePrefs(p => ({ ...p, [key]: !p[key] }))}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResetCookies}
                className="flex items-center gap-2 flex-1 py-3 text-sm font-medium text-gray-400 hover:text-white bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Réinitialiser
              </button>
              <button
                onClick={handleSaveCookies}
                className="flex items-center gap-2 flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors justify-center"
              >
                <Save className="w-4 h-4" /> Enregistrer
              </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
              En application du RGPD et de la directive ePrivacy, vous avez le droit de refuser tous les cookies non essentiels.
              Consultez notre{' '}
              <button onClick={() => onNavigate('privacy')} className="text-red-400 hover:text-red-300 underline">
                politique de confidentialité
              </button>{' '}
              pour plus d'informations.
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-semibold text-white">Notifications push</h2>
                    <p className="text-xs text-gray-400 mt-1">Alertes en temps réel dans votre navigateur</p>
                  </div>
                </div>
                <NotificationStatusBadge />
              </div>

              {notifPermission === 'default' && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-300 mb-3">
                    Activez les notifications pour recevoir des alertes sur les nouvelles vidéos, lives et messages de vos créateurs favoris.
                  </p>
                  <button
                    onClick={requestNotifications}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <Bell className="w-4 h-4" /> Activer les notifications
                  </button>
                </div>
              )}

              {notifPermission === 'denied' && (
                <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-300 font-medium">Notifications bloquées par le navigateur</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Pour les réactiver, rendez-vous dans les paramètres de votre navigateur et autorisez les notifications pour ce site.
                    </p>
                  </div>
                </div>
              )}

              {notifPermission === 'granted' && (
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-sm text-green-300">Les notifications push sont activées</p>
                  <button
                    onClick={() => sendNotification('Test TruTube', 'Les notifications fonctionnent correctement !')}
                    className="ml-auto text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Tester
                  </button>
                </div>
              )}

              <h3 className="text-sm font-semibold text-white mb-3">Types de notifications</h3>
              <div className="space-y-2">
                {[
                  { key: 'new_video' as const, label: 'Nouvelles vidéos', desc: 'Quand un créateur suivi publie une vidéo' },
                  { key: 'live_start' as const, label: 'Début de live', desc: 'Quand un live démarre sur une chaîne suivie' },
                  { key: 'new_message' as const, label: 'Messages privés', desc: 'Quand vous recevez un nouveau message' },
                  { key: 'community_post' as const, label: 'Posts communauté', desc: 'Nouveaux posts dans les communautés suivies' },
                  { key: 'merch_promo' as const, label: 'Offres exclusives', desc: 'Promotions et nouveautés des créateurs' },
                ].map(({ key, label, desc }) => (
                  <SettingRow key={key} label={label} desc={desc}>
                    <Toggle
                      checked={notifSettings[key]}
                      onChange={() => toggleNotif(key)}
                      disabled={notifPermission !== 'granted'}
                    />
                  </SettingRow>
                ))}
              </div>
            </div>

            <Section title="Notifications par email" icon={<Bell className="w-4 h-4" />}>
              {[
                { label: 'Nouvelles vidéos', desc: 'Digest hebdomadaire des nouvelles publications' },
                { label: 'Résumé mensuel', desc: 'Récapitulatif de votre activité TruTube' },
                { label: 'Alertes sécurité', desc: 'Connexions inhabituelles et modifications de compte' },
                { label: 'Emails marketing', desc: 'Offres spéciales et actualités TruTube' },
              ].map(({ label, desc }) => (
                <SettingRow key={label} label={label} desc={desc}>
                  <Toggle checked={label === 'Alertes sécurité'} onChange={() => {}} disabled={label === 'Alertes sécurité'} />
                </SettingRow>
              ))}
            </Section>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-5">
                <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-white">Vos droits RGPD</h2>
                  <p className="text-xs text-gray-400 mt-1">Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles.</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: 'Droit d\'accès',
                    desc: 'Obtenez une copie complète de toutes vos données personnelles détenues par TruTube.',
                    action: 'Demander mes données',
                  },
                  {
                    title: 'Droit de rectification',
                    desc: 'Corrigez ou mettez à jour vos informations personnelles inexactes.',
                    action: 'Modifier mon profil',
                    navigate: 'settings',
                  },
                  {
                    title: 'Droit à la portabilité',
                    desc: 'Exportez vos données dans un format lisible par machine (JSON).',
                    action: 'Exporter mes données',
                  },
                  {
                    title: 'Droit à l\'effacement',
                    desc: 'Demandez la suppression définitive de votre compte et de toutes vos données.',
                    action: 'Supprimer mon compte',
                    danger: true,
                  },
                  {
                    title: 'Droit d\'opposition',
                    desc: 'Opposez-vous au traitement de vos données à des fins de marketing ou de profilage.',
                    action: 'Contacter le DPO',
                  },
                ].map(({ title, desc, action, navigate, danger }) => (
                  <div key={title} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white mb-0.5">{title}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                      <button
                        onClick={() => navigate ? onNavigate(navigate) : undefined}
                        className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                          danger
                            ? 'text-red-400 bg-red-900/20 hover:bg-red-900/40'
                            : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2 font-medium text-white">Contact DPO</p>
              <p className="text-xs text-gray-500 mb-1">Pour exercer vos droits ou poser des questions sur vos données :</p>
              <a href="mailto:privacy@trutube.com" className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                privacy@trutube.com <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-gray-600 mt-2">Délai de réponse : 30 jours maximum (RGPD Art. 12)</p>
            </div>

            <button
              onClick={() => onNavigate('privacy')}
              className="w-full py-3 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl transition-colors"
            >
              Lire la politique de confidentialité complète <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-800">
        <span className="text-gray-400">{icon}</span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-gray-800">
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  );
}
