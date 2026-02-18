import { useEffect, useState } from 'react';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Gift, Clock, DollarSign } from 'lucide-react';
import { trucoinService, TruCoinWallet, TruCoinTransaction } from '../services/trucoinService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

export default function TruCoinWalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<TruCoinWallet | null>(null);
  const [transactions, setTransactions] = useState<TruCoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);

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

      const transactionsData = await trucoinService.getTransactions(user.id);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchasePacks = [
    { amount: 10, price: 10, discount: 0 },
    { amount: 50, price: 47.5, discount: 5 },
    { amount: 100, price: 90, discount: 10 },
    { amount: 500, price: 425, discount: 15 },
  ];

  const getTransactionIcon = (type: TruCoinTransaction['transaction_type']) => {
    switch (type) {
      case 'purchase':
        return <Plus className="w-5 h-5 text-green-600" />;
      case 'tip':
        return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case 'subscription':
        return <DollarSign className="w-5 h-5 text-purple-600" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-yellow-600" />;
      default:
        return <ArrowDownLeft className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionLabel = (type: TruCoinTransaction['transaction_type']) => {
    switch (type) {
      case 'purchase':
        return 'Achat';
      case 'tip':
        return 'Tip envoyé';
      case 'subscription':
        return 'Abonnement';
      case 'badge':
        return 'Badge';
      case 'event':
        return 'Événement';
      case 'reward':
        return 'Récompense';
      case 'refund':
        return 'Remboursement';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20 mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Portefeuille TruCoin</h1>
          <p className="text-lg text-gray-600">
            Gérez votre monnaie interne TruTube
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="w-8 h-8" />
              <span className="text-xl font-medium">Solde TruCoin</span>
            </div>
            <div className="text-6xl font-bold mb-8">
              {wallet?.balance.toLocaleString() || 0}
              <span className="text-2xl ml-2 opacity-80">TC</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <span className="block opacity-80 mb-1">Total gagné</span>
                <span className="text-2xl font-bold">{wallet?.total_earned.toLocaleString() || 0}</span>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <span className="block opacity-80 mb-1">Total dépensé</span>
                <span className="text-2xl font-bold">{wallet?.total_spent.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowPurchase(!showPurchase)}
                className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Acheter TruCoins
                </span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
                <span className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5" />
                  Envoyer un tip
                </span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex justify-between">
                  <span>1 TruCoin =</span>
                  <span className="font-semibold text-gray-900">1€</span>
                </p>
                <p className="text-xs text-gray-500">
                  Pas de frais cachés, taux fixe garanti
                </p>
              </div>
            </div>
          </div>
        </div>

        {showPurchase && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Acheter des TruCoins</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {purchasePacks.map((pack) => (
                <button
                  key={pack.amount}
                  className="relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-md transition-all text-left group"
                >
                  {pack.discount > 0 && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{pack.discount}%
                    </span>
                  )}
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {pack.amount}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">TruCoins</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {pack.price}€
                  </div>
                  {pack.discount > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      {pack.amount}€
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">
                      {(pack.price / pack.amount).toFixed(2)}€ par TruCoin
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-6 text-center">
              Paiement sécurisé • Livraison instantanée • Garantie satisfait ou remboursé
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des transactions</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune transaction
              </h3>
              <p className="text-gray-600">
                Vos transactions apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getTransactionIcon(transaction.transaction_type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {getTransactionLabel(transaction.transaction_type)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      transaction.to_user_id === user?.id
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.to_user_id === user?.id ? '+' : '-'}
                    {transaction.amount.toLocaleString()} TC
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
