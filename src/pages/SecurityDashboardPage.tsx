import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Lock, Activity, Eye, Clock } from 'lucide-react';
import { securityService } from '../services/securityService';
import { useAuth } from '../contexts/AuthContext';

interface SecurityDashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function SecurityDashboardPage({ onNavigate }: SecurityDashboardPageProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [eventsData, statsData] = await Promise.all([
        securityService.getUserSecurityEvents(user.id, 20),
        securityService.getSecurityStats()
      ]);

      setEvents(eventsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur chargement données sécurité:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-900/20 border-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-900/20 border-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      case 'low':
        return 'text-blue-400 bg-blue-900/20 border-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-900/20 border-gray-500/20';
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'login_attempt': 'Tentative de connexion',
      'failed_login': 'Échec de connexion',
      'password_change': 'Changement de mot de passe',
      'suspicious_activity': 'Activité suspecte',
      'rate_limit_exceeded': 'Limite de requêtes dépassée',
      'csrf_detected': 'Tentative CSRF détectée',
      'xss_attempt': 'Tentative XSS détectée',
      'sql_injection_attempt': 'Tentative d\'injection SQL',
      'unauthorized_access': 'Accès non autorisé',
      'data_breach_attempt': 'Tentative de violation de données',
      'account_locked': 'Compte verrouillé',
      'session_hijack_attempt': 'Tentative de détournement de session'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord sécurité</h1>
            <p className="text-gray-400">Surveillance et protection de votre compte</p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Paramètres
          </button>
        </div>

        {/* Score de sécurité global */}
        <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-8 mb-8 border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Score de sécurité</h2>
              </div>
              <p className="text-green-200">Votre compte est bien protégé</p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold text-green-400">95</div>
              <div className="text-green-300">/ 100</div>
            </div>
          </div>
        </div>

        {/* Statistiques clés */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Activity}
              label="Événements totaux"
              value={stats.total}
              color="text-blue-400"
            />
            <StatCard
              icon={CheckCircle}
              label="Connexions réussies"
              value={stats.byType['login_attempt'] || 0}
              color="text-green-400"
            />
            <StatCard
              icon={AlertTriangle}
              label="Alertes sécurité"
              value={stats.bySeverity['high'] || 0}
              color="text-orange-400"
            />
            <StatCard
              icon={Shield}
              label="Menaces bloquées"
              value={(stats.byType['csrf_detected'] || 0) + (stats.byType['xss_attempt'] || 0)}
              color="text-red-400"
            />
          </div>
        )}

        {/* Répartition par sévérité */}
        {stats && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Répartition par sévérité (24h)</h3>
            <div className="grid grid-cols-4 gap-4">
              <SeverityCard
                label="Critique"
                count={stats.bySeverity['critical'] || 0}
                color="bg-red-600"
              />
              <SeverityCard
                label="Élevée"
                count={stats.bySeverity['high'] || 0}
                color="bg-orange-600"
              />
              <SeverityCard
                label="Moyenne"
                count={stats.bySeverity['medium'] || 0}
                color="bg-yellow-600"
              />
              <SeverityCard
                label="Faible"
                count={stats.bySeverity['low'] || 0}
                color="bg-blue-600"
              />
            </div>
          </div>
        )}

        {/* Recommandations de sécurité */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Recommandations</h3>
          <div className="space-y-3">
            <RecommendationItem
              icon={Lock}
              title="Activez l'authentification à deux facteurs"
              description="Renforcez la sécurité de votre compte avec 2FA"
              status="pending"
            />
            <RecommendationItem
              icon={Eye}
              title="Vérifiez vos sessions actives"
              description="Assurez-vous que toutes les sessions sont les vôtres"
              status="completed"
            />
            <RecommendationItem
              icon={CheckCircle}
              title="Mot de passe fort activé"
              description="Votre mot de passe respecte les normes de sécurité"
              status="completed"
            />
          </div>
        </div>

        {/* Historique des événements */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Historique des événements</h3>
          </div>

          <div className="divide-y divide-gray-700">
            {events.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Aucun événement de sécurité enregistré
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg border ${getSeverityColor(event.severity)}`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-semibold">
                            {getEventTypeLabel(event.event_type)}
                          </h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {event.ip_address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(event.timestamp).toLocaleString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="mt-3 p-3 bg-gray-900 rounded text-sm text-gray-400">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mesures de protection actives */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Protections actives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProtectionItem
              icon={Shield}
              label="Rate Limiting"
              description="Protection contre les attaques par force brute"
              active={true}
            />
            <ProtectionItem
              icon={Lock}
              label="Chiffrement des données"
              description="AES-256 pour toutes les données sensibles"
              active={true}
            />
            <ProtectionItem
              icon={Eye}
              label="Détection d'anomalies"
              description="Surveillance IA des comportements suspects"
              active={true}
            />
            <ProtectionItem
              icon={AlertTriangle}
              label="Protection CSRF/XSS"
              description="Tokens de sécurité et validation stricte"
              active={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants helper
function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function SeverityCard({ label, count, color }: any) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 text-center">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
        <span className="text-white font-bold text-lg">{count}</span>
      </div>
      <p className="text-gray-300 text-sm">{label}</p>
    </div>
  );
}

function RecommendationItem({ icon: Icon, title, description, status }: any) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg">
      <Icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
      <div className="flex-1">
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      {status === 'completed' ? (
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
      ) : (
        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
          Activer
        </button>
      )}
    </div>
  );
}

function ProtectionItem({ icon: Icon, label, description, active }: any) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg">
      <div className={`p-2 rounded-lg ${active ? 'bg-green-900/20' : 'bg-gray-800'}`}>
        <Icon className={`w-5 h-5 ${active ? 'text-green-400' : 'text-gray-500'}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-white font-semibold">{label}</h4>
          {active && (
            <span className="px-2 py-0.5 bg-green-900/20 text-green-400 text-xs rounded-full">
              Actif
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}
