import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, FileText, Shield, DollarSign, Scale } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  partnerProgramService,
  PartnerProgramTerms,
  PaymentThreshold,
} from '../services/partnerProgramService';
import { navigate } from '../App';

export default function PartnerProgramPage() {
  const { user } = useAuth();
  const [terms, setTerms] = useState<PartnerProgramTerms | null>(null);
  const [thresholds, setThresholds] = useState<PaymentThreshold[]>([]);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const currentTerms = await partnerProgramService.getCurrentTerms();
    const accepted = await partnerProgramService.hasAcceptedLatestTerms(user.id);
    const paymentThresholds = await partnerProgramService.getPaymentThresholds();

    setTerms(currentTerms);
    setHasAccepted(accepted);
    setThresholds(paymentThresholds);
    setLoading(false);
  };

  const handleAccept = async () => {
    if (!user || !terms || !agreed) return;

    setAccepting(true);
    const success = await partnerProgramService.acceptTerms(user.id, terms.id, terms.version);

    if (success) {
      setHasAccepted(true);
      setTimeout(() => {
        navigate('#studio');
      }, 2000);
    }

    setAccepting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (hasAccepted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Déjà accepté</h2>
          <p className="text-gray-400 mb-6">
            Vous avez déjà accepté les conditions du Programme Partenaire GOROTI.
          </p>
          <button
            onClick={() => navigate('#studio')}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Retour au Studio
          </button>
        </div>
      </div>
    );
  }

  if (!terms) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Termes non disponibles</h2>
          <p className="text-gray-400">
            Les conditions du programme partenaire ne sont pas disponibles pour le moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Programme Partenaire GOROTI</h1>
            <p className="text-red-100">
              Rejoignez notre communauté de créateurs et monétisez votre contenu
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <FeatureCard
                icon={DollarSign}
                title="Revenus équitables"
                description="Jusqu'à 95% pour vous sur les tips"
              />
              <FeatureCard
                icon={Shield}
                title="Transparence totale"
                description="Pas de démonétisation opaque"
              />
              <FeatureCard
                icon={Scale}
                title="Protection juridique"
                description="Statut clair et conditions équitables"
              />
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Conditions du Programme Partenaire
              </h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {terms.content}
                </div>
              </div>
            </div>

            {thresholds.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Seuils de retrait</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {thresholds.map((threshold) => (
                    <div key={threshold.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-white mb-1">
                        {threshold.minimum_withdrawal} {threshold.currency}
                      </div>
                      <div className="text-gray-400 text-sm mb-2">Minimum de retrait</div>
                      <div className="text-gray-500 text-xs">
                        Traitement sous {threshold.processing_time_days} jours
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-6">
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-600 text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-300 text-sm">
                  J'ai lu, compris et j'accepte l'ensemble des conditions du Programme Partenaire
                  GOROTI (version {terms.version}). Je reconnais être seul responsable de mes
                  contenus, de mes déclarations fiscales et du respect des droits d'auteur.
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!agreed || accepting}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    agreed && !accepting
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {accepting ? 'Acceptation en cours...' : 'Accepter et rejoindre'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Version {terms.version} - Effective depuis le{' '}
          {new Date(terms.effective_date).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 text-center">
      <Icon className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
