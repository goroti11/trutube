import { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Eye,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Award,
  CreditCard,
  FileText,
  Phone,
  Mail,
  User,
  Calendar,
  Video,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  monetizationEligibilityService,
  MonetizationEligibility,
  MonetizationStatus,
  KYCVerification,
  CreatorTier,
  RevenueSettings,
} from '../../services/monetizationEligibilityService';
import { partnerProgramService } from '../../services/partnerProgramService';
import CreatorTierBadge from '../CreatorTierBadge';
import { navigate } from '../../App';

export default function MonetizationDashboard() {
  const { user } = useAuth();
  const [eligibility, setEligibility] = useState<MonetizationEligibility | null>(null);
  const [status, setStatus] = useState<MonetizationStatus | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCVerification | null>(null);
  const [tiers, setTiers] = useState<CreatorTier[]>([]);
  const [revenueSettings, setRevenueSettings] = useState<RevenueSettings[]>([]);
  const [revenueByType, setRevenueByType] = useState<Record<string, number>>({});
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMonetizationData();
    }
  }, [user]);

  const loadMonetizationData = async () => {
    if (!user) return;

    setLoading(true);

    let monetizationStatus = await monetizationEligibilityService.getMonetizationStatus(user.id);
    if (!monetizationStatus) {
      monetizationStatus = await monetizationEligibilityService.initializeMonetizationStatus(user.id);
    }

    let kyc = await monetizationEligibilityService.getKYCStatus(user.id);
    if (!kyc) {
      kyc = await monetizationEligibilityService.initializeKYC(user.id);
    }

    const eligibilityData = await monetizationEligibilityService.checkEligibility(user.id);
    const tiersData = await monetizationEligibilityService.getCreatorTiers();
    const settingsData = await monetizationEligibilityService.getRevenueSettings();
    const revenueData = await monetizationEligibilityService.getRevenueByType(user.id);
    const acceptedTerms = await partnerProgramService.hasAcceptedLatestTerms(user.id);
    const balance = await partnerProgramService.getAvailableBalance(user.id);

    if (Object.keys(revenueData).length === 0) {
      await monetizationEligibilityService.createMockTransactions(user.id);
      const updatedRevenue = await monetizationEligibilityService.getRevenueByType(user.id);
      setRevenueByType(updatedRevenue);
    } else {
      setRevenueByType(revenueData);
    }

    setStatus(monetizationStatus);
    setKycStatus(kyc);
    setEligibility(eligibilityData);
    setTiers(tiersData);
    setRevenueSettings(settingsData);
    setHasAcceptedTerms(acceptedTerms);
    setAvailableBalance(balance);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  const totalEstimated = Object.values(revenueByType).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Monétisation</h1>
        {status?.tier && (
          <CreatorTierBadge tier={status.tier.name as 'Basic' | 'Pro' | 'Elite'} size="lg" />
        )}
      </div>

      {!hasAcceptedTerms && (
        <div className="bg-red-900 border border-red-600 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-300 mb-2">
                Programme Partenaire - Acceptation requise
              </h3>
              <p className="text-red-200 text-sm mb-4">
                Pour activer la monétisation, vous devez accepter les conditions du Programme Partenaire TruTube.
              </p>
              <button
                onClick={() => navigate('#partner-program')}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Voir et accepter les conditions
              </button>
            </div>
          </div>
        </div>
      )}

      {!eligibility?.eligible && (
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-yellow-300 mb-2">
                Monétisation non activée
              </h3>
              <p className="text-yellow-200 text-sm mb-3">
                Vous devez remplir toutes les conditions pour activer la monétisation.
              </p>
              <div className="space-y-2">
                {eligibility?.missing_conditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-yellow-200 text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueCard
          label="Revenus estimés"
          amount={`€${totalEstimated.toFixed(2)}`}
          sublabel="Ce mois"
          color="text-yellow-400"
          icon={DollarSign}
        />
        <RevenueCard
          label="Revenus validés"
          amount={`€${(totalEstimated * 0.9).toFixed(2)}`}
          sublabel="Prêt au retrait"
          color="text-green-400"
          icon={CheckCircle}
        />
        <RevenueCard
          label="Commission TruTube"
          amount="15%"
          sublabel={`€${(totalEstimated * 0.15).toFixed(2)}`}
          color="text-gray-400"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Conditions d'éligibilité</h2>
          <div className="space-y-4">
            <EligibilityItem
              label="Vérification KYC"
              checked={eligibility?.checks.kyc_completed || false}
              icon={Shield}
            />
            <EligibilityItem
              label="Score authenticité ≥ 80"
              checked={eligibility?.checks.authenticity_score_ok || false}
              icon={Award}
              detail={`Score actuel: ${eligibility?.stats.authenticity_score || 0}`}
            />
            <EligibilityItem
              label="Seuil d'audience"
              checked={eligibility?.checks.audience_threshold_met || false}
              icon={Users}
              detail={`${eligibility?.stats.subscribers || 0} abonnés`}
            />
            <EligibilityItem
              label="Minimum 3 vidéos"
              checked={eligibility?.checks.minimum_videos_ok || false}
              icon={Video}
              detail={`${eligibility?.stats.videos || 0} vidéos`}
            />
            <EligibilityItem
              label="30 jours d'activité"
              checked={eligibility?.checks.account_age_ok || false}
              icon={Calendar}
              detail={`${eligibility?.stats.account_age_days || 0} jours`}
            />
            <EligibilityItem
              label="Aucune violation"
              checked={eligibility?.checks.no_violations || false}
              icon={CheckCircle}
            />
            <EligibilityItem
              label="Compte bancaire validé"
              checked={eligibility?.checks.payment_method_ok || false}
              icon={CreditCard}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Vérification KYC</h2>
          <div className="space-y-4">
            <KYCItem
              label="Identité vérifiée"
              verified={kycStatus?.identity_verified || false}
              icon={User}
            />
            <KYCItem
              label="Email vérifié"
              verified={kycStatus?.email_verified || false}
              icon={Mail}
            />
            <KYCItem
              label="Téléphone vérifié"
              verified={kycStatus?.phone_verified || false}
              icon={Phone}
            />
            <KYCItem
              label="Âge vérifié (18+)"
              verified={kycStatus?.age_verified || false}
              icon={FileText}
            />
            <KYCItem
              label="Compte bancaire"
              verified={kycStatus?.bank_account_verified || false}
              icon={CreditCard}
            />
          </div>

          {kycStatus?.verification_status !== 'approved' && (
            <button className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              Compléter la vérification KYC
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">
          Partage des revenus
          <span className="ml-3 text-sm text-gray-400 font-normal">Transparence totale</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {revenueSettings.map((setting) => (
            <RevenueShareCard
              key={setting.setting_type}
              type={setting.description}
              creatorShare={setting.creator_share}
              platformShare={setting.platform_share}
              revenue={revenueByType[setting.setting_type] || 0}
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6">Paliers créateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              currentTier={status?.tier?.name === tier.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueCard({ label, amount, sublabel, color, icon: Icon }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-gray-400" />
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
      <div className={`text-3xl font-bold ${color} mb-1`}>{amount}</div>
      <p className="text-gray-500 text-xs">{sublabel}</p>
    </div>
  );
}

function EligibilityItem({ label, checked, icon: Icon, detail }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${checked ? 'text-green-400' : 'text-gray-600'}`} />
        <div>
          <p className={`font-medium ${checked ? 'text-white' : 'text-gray-400'}`}>
            {label}
          </p>
          {detail && (
            <p className="text-xs text-gray-500">{detail}</p>
          )}
        </div>
      </div>
      {checked ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-600" />
      )}
    </div>
  );
}

function KYCItem({ label, verified, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${verified ? 'text-green-400' : 'text-gray-600'}`} />
        <p className={`font-medium ${verified ? 'text-white' : 'text-gray-400'}`}>
          {label}
        </p>
      </div>
      {verified ? (
        <CheckCircle className="w-5 h-5 text-green-400" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-600" />
      )}
    </div>
  );
}

function RevenueShareCard({ type, creatorShare, platformShare, revenue }: any) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">{type}</h3>
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Créateur</span>
          <span className="text-green-400 font-bold">{creatorShare}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Plateforme</span>
          <span className="text-gray-500">{platformShare}%</span>
        </div>
      </div>
      {revenue > 0 && (
        <div className="pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Ce mois</span>
            <span className="text-sm text-white font-semibold">€{revenue.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TierCard({ tier, currentTier }: any) {
  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 border-2 ${
        currentTier ? 'border-red-600' : 'border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <CreatorTierBadge tier={tier.name} size="md" />
        {currentTier && (
          <span className="text-xs px-2 py-1 bg-red-900 text-red-300 rounded-full">
            Actuel
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-500">
          {tier.min_subscribers.toLocaleString()}+ abonnés
        </div>
        <div className="text-xs text-gray-500">
          Score {tier.min_authenticity_score}+
        </div>
      </div>
      <div className="space-y-2">
        {tier.benefits.map((benefit: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
            <span className="text-xs text-gray-300">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
