import { useState } from 'react';
import { X, Heart, DollarSign, Crown, Star, Check } from 'lucide-react';
import { creatorSupportService, MembershipTier } from '../services/creatorSupportService';
import { useAuth } from '../contexts/AuthContext';

interface SupportCreatorModalProps {
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SupportCreatorModal({
  creatorId,
  creatorName,
  creatorAvatar,
  onClose,
  onSuccess
}: SupportCreatorModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tip' | 'membership'>('tip');
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);

  const presetAmounts = [1, 5, 10, 25, 50, 100];

  const membershipTiers: MembershipTier[] = [
    {
      tier: 'basic',
      name: 'Supporter',
      amount: 9.99,
      benefits: ['Badge exclusif', 'Emojis personnalisés', 'Nom dans les crédits']
    },
    {
      tier: 'premium',
      name: 'Fan',
      amount: 9.99,
      benefits: [
        'Tous les avantages Supporter',
        'Accès anticipé aux vidéos',
        'Contenu exclusif mensuel',
        'Badge animé'
      ]
    },
    {
      tier: 'vip',
      name: 'Super Fan',
      amount: 24.99,
      benefits: [
        'Tous les avantages Fan',
        'Chat privé mensuel',
        'Influence sur le contenu',
        'Badge premium animé',
        'Accès Discord VIP'
      ]
    }
  ];

  const handleSendTip = async () => {
    if (!user) {
      alert('Vous devez être connecté pour soutenir un créateur');
      return;
    }

    const finalAmount = customAmount ? parseFloat(customAmount) : amount;

    if (finalAmount < 1) {
      alert('Le montant minimum est de 1€');
      return;
    }

    setProcessing(true);

    const result = await creatorSupportService.createSupport(
      user.id,
      creatorId,
      finalAmount,
      'tip',
      message,
      isPublic
    );

    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } else {
      alert('Erreur lors de l\'envoi du pourboire');
    }

    setProcessing(false);
  };

  const handleSubscribeTier = async (tier: MembershipTier) => {
    if (!user) {
      alert('Vous devez être connecté pour vous abonner');
      return;
    }

    setProcessing(true);

    const result = await creatorSupportService.createMembership(
      user.id,
      creatorId,
      tier.tier,
      tier.amount,
      30
    );

    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } else {
      alert('Erreur lors de l\'abonnement');
    }

    setProcessing(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Merci pour votre soutien!</h2>
          <p className="text-gray-400">
            Votre contribution aide {creatorName} à continuer de créer du contenu incroyable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden">
              {creatorAvatar ? (
                <img src={creatorAvatar} alt={creatorName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {creatorName[0]}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">Soutenir {creatorName}</h2>
              <p className="text-sm text-gray-400">Montrez votre appréciation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('tip')}
              className={`flex-1 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === 'tip'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Pourboire
            </button>
            <button
              onClick={() => setActiveTab('membership')}
              className={`flex-1 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === 'membership'
                  ? 'border-primary-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-5 h-5 inline mr-2" />
              Abonnement
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'tip' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Choisir un montant</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`py-3 rounded-lg font-semibold transition-colors ${
                        amount === preset && !customAmount
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-800 hover:bg-gray-750'
                      }`}
                    >
                      {preset}€
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(0);
                    }}
                    placeholder="Montant personnalisé"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message (optionnel)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez un message pour encourager le créateur..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 min-h-[100px] resize-none"
                  maxLength={200}
                />
                <p className="text-sm text-gray-400 mt-1">{message.length}/200 caractères</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm">
                  Afficher publiquement mon soutien
                  <span className="block text-gray-400 text-xs">
                    Votre nom apparaîtra dans la liste des supporters
                  </span>
                </span>
              </label>

              <button
                onClick={handleSendTip}
                disabled={processing || (!amount && !customAmount)}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                {processing ? 'Traitement...' : `Envoyer ${customAmount || amount}€`}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 mb-6">
                Devenez membre et profitez d'avantages exclusifs tout en soutenant {creatorName}
              </p>

              {membershipTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className={`bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer ${
                    selectedTier?.tier === tier.tier
                      ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                      : 'border-transparent hover:border-gray-700'
                  }`}
                  onClick={() => setSelectedTier(tier)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {tier.tier === 'vip' && <Crown className="w-5 h-5 text-yellow-400" />}
                        {tier.tier === 'premium' && <Star className="w-5 h-5 text-primary-400" />}
                        {tier.tier === 'basic' && <Heart className="w-5 h-5 text-pink-400" />}
                        <h3 className="text-xl font-bold">{tier.name}</h3>
                      </div>
                      <p className="text-2xl font-bold text-primary-400">
                        {tier.amount}€<span className="text-sm text-gray-400">/mois</span>
                      </p>
                    </div>
                    {selectedTier?.tier === tier.tier && (
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <button
                onClick={() => selectedTier && handleSubscribeTier(selectedTier)}
                disabled={processing || !selectedTier}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                {processing
                  ? 'Traitement...'
                  : selectedTier
                  ? `S'abonner à ${selectedTier.name}`
                  : 'Sélectionnez un niveau'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Renouvellement automatique mensuel. Annulez à tout moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
