import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Upload, Video, Wallet, ShoppingBag, Radio,  } from 'lucide-react';

interface StatusPageProps {
  onNavigate: (page: string) => void;
}

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'maintenance';

interface Service {
  name: string;
  status: ServiceStatus;
  description: string;
  icon: React.ElementType;
}

interface Incident {
  date: string;
  duration: string;
  service: string;
  cause: string;
  resolution: string;
  severity: 'minor' | 'major' | 'critical';
}

export default function StatusPage({ onNavigate }: StatusPageProps) {
  const services: Service[] = [
    {
      name: 'Streaming vidéo',
      status: 'operational',
      description: 'Distribution de contenu vidéo HLS',
      icon: Video,
    },
    {
      name: 'Upload de contenu',
      status: 'operational',
      description: 'Système d\'upload et d\'encodage',
      icon: Upload,
    },
    {
      name: 'Système de paiements',
      status: 'operational',
      description: 'Transactions et wallet TruCoin',
      icon: Wallet,
    },
    {
      name: 'Retraits créateurs',
      status: 'operational',
      description: 'Virements bancaires et payouts',
      icon: Activity,
    },
    {
      name: 'Marketplace',
      status: 'operational',
      description: 'Services et commandes marketplace',
      icon: ShoppingBag,
    },
    {
      name: 'Live streaming',
      status: 'operational',
      description: 'Diffusion en direct',
      icon: Radio,
    },
    {
      name: 'API publique',
      status: 'operational',
      description: 'Endpoints API créateurs',
      icon: Server,
    },
    {
      name: 'Base de données',
      status: 'operational',
      description: 'Infrastructure de stockage',
      icon: Database,
    },
  ];

  const incidents: Incident[] = [
    {
      date: '18 Janvier 2026',
      duration: '45 minutes',
      service: 'Upload de contenu',
      cause: 'Saturation du service d\'encodage lors d\'un pic de trafic',
      resolution: 'Augmentation de la capacité d\'encodage et mise en place d\'une file d\'attente prioritaire',
      severity: 'minor',
    },
    {
      date: '12 Janvier 2026',
      duration: '2 heures',
      service: 'Système de paiements',
      cause: 'Problème de synchronisation avec le processeur de paiement',
      resolution: 'Reconnexion au processeur et vérification de toutes les transactions en attente',
      severity: 'major',
    },
    {
      date: '5 Janvier 2026',
      duration: '15 minutes',
      service: 'Streaming vidéo',
      cause: 'Maintenance planifiée du CDN',
      resolution: 'Migration réussie vers les serveurs de backup, retour à la normale',
      severity: 'minor',
    },
  ];

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusText = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'Opérationnel';
      case 'degraded':
        return 'Performance dégradée';
      case 'down':
        return 'Hors service';
      case 'maintenance':
        return 'Maintenance';
    }
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'down':
        return 'text-red-400';
      case 'maintenance':
        return 'text-blue-400';
    }
  };

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'minor':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'major':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
      case 'critical':
        return 'bg-red-600/20 text-red-400 border-red-600/30';
    }
  };

  const getSeverityLabel = (severity: Incident['severity']) => {
    switch (severity) {
      case 'minor':
        return 'Mineur';
      case 'major':
        return 'Majeur';
      case 'critical':
        return 'Critique';
    }
  };

  const allOperational = services.every(s => s.status === 'operational');
  const someDown = services.some(s => s.status === 'down');
  const _someDegraded = services.some(s => s.status === 'degraded');

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">État de la Plateforme</h1>
          <p className="text-xl text-gray-400">
            Surveillance en temps réel de tous les services Goroti
          </p>
        </div>

        <div className={`border rounded-xl p-8 mb-12 ${
          allOperational
            ? 'bg-green-600/10 border-green-600/30'
            : someDown
            ? 'bg-red-600/10 border-red-600/30'
            : 'bg-yellow-600/10 border-yellow-600/30'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${
              allOperational ? 'bg-green-500' : someDown ? 'bg-red-500' : 'bg-yellow-500'
            } animate-pulse`} />
            <div>
              <h2 className={`text-2xl font-bold mb-1 ${
                allOperational ? 'text-green-400' : someDown ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {allOperational
                  ? 'Tous les systèmes sont opérationnels'
                  : someDown
                  ? 'Certains services sont indisponibles'
                  : 'Performance dégradée sur certains services'}
              </h2>
              <p className="text-gray-400">
                Dernière mise à jour : {new Date().toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Services</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900 rounded-lg">
                      <service.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{service.name}</h3>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                  <span className="text-xs text-gray-500">Uptime: 99.9%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Historique des incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-semibold">{incident.service}</span>
                      <span className={`px-2 py-0.5 rounded text-xs border ${getSeverityColor(incident.severity)}`}>
                        {getSeverityLabel(incident.severity)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {incident.date}
                      </span>
                      <span>Durée : {incident.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-1">Cause</h4>
                    <p className="text-sm text-gray-400">{incident.cause}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-1">Résolution</h4>
                    <p className="text-sm text-gray-400">{incident.resolution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Métriques de disponibilité</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { period: '24 heures', uptime: '100%', color: 'text-green-400' },
              { period: '7 jours', uptime: '99.95%', color: 'text-green-400' },
              { period: '30 jours', uptime: '99.87%', color: 'text-green-400' },
              { period: '90 jours', uptime: '99.92%', color: 'text-green-400' },
            ].map(({ period, uptime, color }) => (
              <div key={period} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 text-center">
                <div className={`text-3xl font-bold ${color} mb-2`}>{uptime}</div>
                <div className="text-gray-400 text-sm">{period}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-4">S'abonner aux mises à jour</h2>
            <p className="text-gray-400 mb-6">
              Recevez des notifications en temps réel sur l'état de la plateforme
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
                S'abonner par Email
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                Flux RSS
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
