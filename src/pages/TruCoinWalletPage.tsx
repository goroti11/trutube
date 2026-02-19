import { useEffect, useState } from 'react';
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, Clock,
  CreditCard, Zap, Star, Shield, TrendingUp, Lock, CheckCircle,
  ChevronRight, Package, Music, Users, ShoppingBag, RefreshCw
} from 'lucide-react';
import { trucoinService, TruCoinWallet, TruCoinTransaction } from '../services/trucoinService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

const BONUS_PACKS = [
  {
    id: 'starter',
    euros: 10,
    coins: 10,
    bonus: 0,
    label: 'Starter',
    color: 'from-gray-700 to-gray-600',
    badge: null,
  },
  {
    id: 'popular',
    euros: 50,
    coins: 52,
    bonus: 2,
    label: 'Popular',
    color: 'from-blue-800 to-blue-700',
    badge: null,
  },
  {
    id: 'boost',
    euros: 100,
    coins: 105,
    bonus: 5,
    label: 'Boost',
    color: 'from-amber-800 to-amber-700',
    badge: '+5% OFFERTS',
  },
  {
    id: 'creator',
    euros: 500,
    coins: 550,
    bonus: 50,
    label: 'Creator',
    color: 'from-red-800 to-red-700',
    badge: '+10% OFFERTS',
  },
  {
    id: 'label',
    euros: 1000,
    coins: 1150,
    bonus: 150,
    label: 'Label',
    color: 'from-rose-900 to-red-800',
    badge: '+15% OFFERTS',
  },
];

const MOCK_TRANSACTIONS: TruCoinTransaction[] = [
  {
    id: '1',
    to_user_id: 'me',
    amount: 105,
    transaction_type: 'purchase',
    description: 'Pack Boost — 100€ + 5 TC offerts',
    metadata: {},
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '2',
    from_user_id: 'me',
    amount: 25,
    transaction_type: 'tip',
    description: 'Tip à DJ Kalim — "Fire Remix"',
    metadata: {},
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: '3',
    from_user_id: 'me',
    amount: 15,
    transaction_type: 'subscription',
    description: 'Abonnement Premium — Accès Exclusif',
    metadata: {},
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '4',
    to_user_id: 'me',
    amount: 10,
    transaction_type: 'reward',
    description: 'Récompense parrainage — Niveau Or',
    metadata: {},
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: '5',
    from_user_id: 'me',
    amount: 8,
    transaction_type: 'purchase',
    description: 'Achat album "Midnight Sessions" (Phase Exclusive)',
    metadata: {},
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

type PaymentMethod = 'card' | 'trucoin' | 'mixed';
type ActiveTab = 'wallet' | 'buy' | 'history' | 'uses';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${days}j`;
}

export default function TruCoinWalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<TruCoinWallet | null>(null);
  const [transactions, setTransactions] = useState<TruCoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('wallet');
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardAmount, setCardAmount] = useState(0);
  const [trucoinAmount, setTrucoinAmount] = useState(0);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.hash = 'auth';
      return;
    }
    loadWallet();
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const walletData = await trucoinService.getWallet(user.id);
      setWallet(walletData);
      const txData = await trucoinService.getTransactions(user.id);
      setTransactions(txData.length > 0 ? txData : MOCK_TRANSACTIONS);
    } catch {
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  };

  const balance = wallet?.balance ?? 0;
  const blocked = 0;
  const available = balance - blocked;
  const totalEarned = wallet?.total_earned ?? 0;
  const totalSpent = wallet?.total_spent ?? 0;

  const selectedPackData = BONUS_PACKS.find(p => p.id === selectedPack);

  const handleSelectPack = (packId: string) => {
    setSelectedPack(packId);
    const pack = BONUS_PACKS.find(p => p.id === packId);
    if (pack) {
      setCardAmount(pack.euros);
      setTrucoinAmount(0);
      setPaymentMethod('card');
    }
  };

  const handleMixedCard = (val: number) => {
    if (!selectedPackData) return;
    const capped = Math.min(Math.max(0, val), selectedPackData.euros);
    setCardAmount(capped);
    setTrucoinAmount(selectedPackData.euros - capped);
  };

  const handlePurchase = async () => {
    if (!selectedPackData || !user) return;
    const success = await trucoinService.purchaseCoins(user.id, selectedPackData.coins, paymentMethod);
    if (success) {
      setPurchaseSuccess(true);
      await loadWallet();
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedPack(null);
        setActiveTab('wallet');
      }, 2500);
    }
  };

  const getTransactionMeta = (tx: TruCoinTransaction, userId?: string) => {
    const isIncoming = tx.to_user_id === userId || tx.to_user_id === 'me';
    let icon, iconBg, label, sign, color;

    switch (tx.transaction_type) {
      case 'purchase':
        if (isIncoming) {
          icon = <Plus className="w-4 h-4" />;
          iconBg = 'bg-green-900/50 text-green-400';
          label = 'Achat TruCoins';
          sign = '+';
          color = 'text-green-400';
        } else {
          icon = <ShoppingBag className="w-4 h-4" />;
          iconBg = 'bg-orange-900/50 text-orange-400';
          label = 'Achat contenu';
          sign = '-';
          color = 'text-red-400';
        }
        break;
      case 'tip':
        icon = <ArrowUpRight className="w-4 h-4" />;
        iconBg = isIncoming ? 'bg-blue-900/50 text-blue-400' : 'bg-pink-900/50 text-pink-400';
        label = isIncoming ? 'Tip reçu' : 'Tip envoyé';
        sign = isIncoming ? '+' : '-';
        color = isIncoming ? 'text-green-400' : 'text-red-400';
        break;
      case 'subscription':
        icon = <Star className="w-4 h-4" />;
        iconBg = 'bg-amber-900/50 text-amber-400';
        label = 'Abonnement';
        sign = '-';
        color = 'text-red-400';
        break;
      case 'reward':
        icon = <Gift className="w-4 h-4" />;
        iconBg = 'bg-emerald-900/50 text-emerald-400';
        label = 'Récompense';
        sign = '+';
        color = 'text-green-400';
        break;
      case 'refund':
        icon = <RefreshCw className="w-4 h-4" />;
        iconBg = 'bg-teal-900/50 text-teal-400';
        label = 'Remboursement';
        sign = '+';
        color = 'text-green-400';
        break;
      default:
        icon = <ArrowDownLeft className="w-4 h-4" />;
        iconBg = 'bg-gray-800 text-gray-400';
        label = 'Transaction';
        sign = '';
        color = 'text-gray-300';
    }

    return { icon, iconBg, label, sign, color };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex justify-center items-center py-32 mt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'wallet', label: 'Mon Portefeuille' },
    { id: 'buy', label: 'Acheter' },
    { id: 'history', label: 'Historique' },
    { id: 'uses', label: 'Utilisations' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 mt-16">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TruCoin Wallet</h1>
              <p className="text-sm text-gray-400">1 TC = 1€ — Taux fixe garanti</p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-8 bg-gray-900 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-white shadow'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-gradient-to-br from-red-900/40 via-gray-900 to-gray-900 border border-red-900/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Balance Totale</span>
                  <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Sécurisé
                  </span>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{balance.toLocaleString('fr-FR')}</span>
                  <span className="text-xl text-gray-400 ml-2">TC</span>
                  <p className="text-gray-400 text-sm mt-1">≈ {balance.toLocaleString('fr-FR')} €</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-gray-400">Bloqué (escrow)</span>
                    </div>
                    <span className="text-xl font-bold text-orange-400">{blocked.toLocaleString('fr-FR')} TC</span>
                    <p className="text-xs text-gray-500 mt-0.5">En attente de commandes</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-gray-400">Disponible</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">{available.toLocaleString('fr-FR')} TC</span>
                    <p className="text-xs text-gray-500 mt-0.5">Utilisable immédiatement</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-gray-300">Statistiques</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Total gagné</span>
                      <span className="text-green-400 font-semibold text-sm">+{totalEarned.toLocaleString('fr-FR')} TC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Total dépensé</span>
                      <span className="text-red-400 font-semibold text-sm">-{totalSpent.toLocaleString('fr-FR')} TC</span>
                    </div>
                    <div className="border-t border-gray-800 pt-3 flex justify-between">
                      <span className="text-gray-400 text-sm">Transactions</span>
                      <span className="text-gray-200 font-semibold text-sm">{transactions.length}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('buy')}
                  className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl px-4 py-3.5 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Recharger mon wallet
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Dernières transactions</h2>
                <button onClick={() => setActiveTab('history')} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                  Voir tout <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Aucune transaction pour l'instant</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((tx) => {
                    const meta = getTransactionMeta(tx, user?.id);
                    return (
                      <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/60 transition-colors">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.iconBg}`}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">{tx.description || meta.label}</p>
                          <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                        </div>
                        <span className={`text-sm font-bold flex-shrink-0 ${meta.color}`}>
                          {meta.sign}{tx.amount.toLocaleString('fr-FR')} TC
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'buy' && (
          <div className="space-y-6">
            {purchaseSuccess ? (
              <div className="bg-green-900/20 border border-green-800 rounded-2xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Achat confirmé !</h2>
                <p className="text-gray-400">Vos TruCoins ont été ajoutés à votre wallet.</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Choisir un pack</h2>
                  <p className="text-sm text-gray-400">Plus vous achetez, plus vous recevez de TruCoins bonus.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BONUS_PACKS.map(pack => (
                    <button
                      key={pack.id}
                      onClick={() => handleSelectPack(pack.id)}
                      className={`relative text-left rounded-2xl p-5 border-2 transition-all ${
                        selectedPack === pack.id
                          ? 'border-red-500 bg-gray-800'
                          : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      {pack.badge && (
                        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {pack.badge}
                        </span>
                      )}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pack.color} flex items-center justify-center mb-3`}>
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{pack.label}</p>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-3xl font-bold text-white">{pack.coins}</span>
                        <span className="text-gray-400 text-sm">TC</span>
                      </div>
                      {pack.bonus > 0 && (
                        <p className="text-xs text-green-400 mb-2">+{pack.bonus} TC offerts</p>
                      )}
                      <div className="border-t border-gray-700/50 pt-3 mt-3">
                        <span className="text-lg font-bold text-white">{pack.euros}€</span>
                        <span className="text-gray-500 text-xs ml-2">paiement unique</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedPackData && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                    <h3 className="font-semibold text-white">Mode de paiement — {selectedPackData.euros}€</h3>

                    <div className="flex gap-3">
                      {(['card', 'trucoin', 'mixed'] as PaymentMethod[]).map(method => (
                        <button
                          key={method}
                          onClick={() => {
                            setPaymentMethod(method);
                            if (method === 'card') { setCardAmount(selectedPackData.euros); setTrucoinAmount(0); }
                            if (method === 'trucoin') { setCardAmount(0); setTrucoinAmount(selectedPackData.euros); }
                            if (method === 'mixed') { setCardAmount(Math.ceil(selectedPackData.euros / 2)); setTrucoinAmount(Math.floor(selectedPackData.euros / 2)); }
                          }}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                            paymentMethod === method
                              ? 'border-red-500 bg-red-600/10 text-red-400'
                              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {method === 'card' && <><CreditCard className="w-4 h-4" />Carte</>}
                          {method === 'trucoin' && <><Wallet className="w-4 h-4" />TruCoins</>}
                          {method === 'mixed' && <><Zap className="w-4 h-4" />Mixte</>}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'mixed' && (
                      <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Répartition</span>
                          <span className="text-gray-300">{cardAmount}€ carte + {trucoinAmount} TC</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={selectedPackData.euros}
                          value={cardAmount}
                          onChange={e => handleMixedCard(Number(e.target.value))}
                          className="w-full accent-red-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>100% TC</span>
                          <span>100% Carte</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Par carte</p>
                            <p className="text-lg font-bold text-white">{cardAmount}€</p>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">En TruCoins</p>
                            <p className="text-lg font-bold text-amber-400">{trucoinAmount} TC</p>
                            {trucoinAmount > available && (
                              <p className="text-xs text-red-400 mt-1">Solde insuffisant</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'trucoin' && (
                      <div className="bg-gray-800 rounded-xl p-4">
                        <p className="text-sm text-gray-400 mb-2">Solde disponible: <span className="text-white font-semibold">{available} TC</span></p>
                        {available < selectedPackData.euros && (
                          <p className="text-sm text-orange-400">Solde insuffisant pour ce pack en TruCoins uniquement.</p>
                        )}
                      </div>
                    )}

                    <div className="bg-gray-800 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">TruCoins reçus</span>
                        <span className="text-white font-semibold">{selectedPackData.coins} TC</span>
                      </div>
                      {selectedPackData.bonus > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">Bonus offerts</span>
                          <span className="text-green-400">+{selectedPackData.bonus} TC</span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
                        <span className="text-gray-200">Total à payer</span>
                        <span className="text-white">{selectedPackData.euros}€</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePurchase}
                      disabled={paymentMethod === 'trucoin' && available < selectedPackData.euros}
                      className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl py-4 font-bold text-base transition-colors"
                    >
                      Confirmer l'achat — {selectedPackData.euros}€
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Paiement sécurisé • Livraison instantanée • 1 TC = 1€ garanti
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-5">Historique complet</h2>
            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">Aucune transaction pour l'instant</p>
              </div>
            ) : (
              <div className="space-y-1">
                {transactions.map((tx) => {
                  const meta = getTransactionMeta(tx, user?.id);
                  return (
                    <div key={tx.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-800/60 transition-colors group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.iconBg}`}>
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200">{tx.description || meta.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(tx.created_at).toLocaleString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${meta.color}`}>
                          {meta.sign}{tx.amount.toLocaleString('fr-FR')} TC
                        </p>
                        <p className={`text-xs ${meta.color} opacity-60`}>≈ {tx.amount}€</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'uses' && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Les TruCoins peuvent être utilisés pour tous ces services sur GOROTI.</p>
            {[
              {
                icon: <Music className="w-5 h-5" />,
                color: 'bg-blue-900/40 text-blue-400',
                title: 'Acheter de la musique',
                desc: 'Singles, albums, EP en accès exclusif ou permanent',
                examples: ['Album exclusif — 8 TC', 'Single limité — 3 TC', 'Bundle artist — 15 TC'],
              },
              {
                icon: <Star className="w-5 h-5" />,
                color: 'bg-amber-900/40 text-amber-400',
                title: 'Abonnements Premium',
                desc: 'Accéder aux contenus exclusifs des créateurs',
                examples: ['Accès mensuel — 5 TC/mois', 'Tier Gold — 10 TC/mois', 'Accès annuel — 50 TC/an'],
              },
              {
                icon: <ArrowUpRight className="w-5 h-5" />,
                color: 'bg-pink-900/40 text-pink-400',
                title: 'Tips & Pourboires',
                desc: 'Soutenir directement vos créateurs préférés',
                examples: ['Tip libre — montant libre', 'Super comment — 2 TC', 'Épingler un message — 5 TC'],
              },
              {
                icon: <Package className="w-5 h-5" />,
                color: 'bg-orange-900/40 text-orange-400',
                title: 'Marketplace & Services',
                desc: 'Payer des prestataires créatifs',
                examples: ['Beatmaker — dès 25 TC', 'Montage vidéo — dès 40 TC', 'Mix & Master — dès 80 TC'],
              },
              {
                icon: <ShoppingBag className="w-5 h-5" />,
                color: 'bg-emerald-900/40 text-emerald-400',
                title: 'Merchandising',
                desc: 'Acheter des produits dérivés de vos artistes',
                examples: ['T-shirt exclusif — 25 TC', 'Vinyle signé — 40 TC', 'Bundle collector — 80 TC'],
              },
              {
                icon: <Users className="w-5 h-5" />,
                color: 'bg-teal-900/40 text-teal-400',
                title: 'Communautés Premium',
                desc: 'Rejoindre des espaces privés et exclusifs',
                examples: ['Accès communauté — 5 TC/mois', 'Tier VIP — 20 TC/mois'],
              },
            ].map((use, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${use.color}`}>
                    {use.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{use.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{use.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {use.examples.map((ex, j) => (
                        <span key={j} className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
