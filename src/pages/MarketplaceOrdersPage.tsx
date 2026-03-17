import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, Filter
} from 'lucide-react';
import { marketplaceService, MarketplaceOrder, OrderStatus } from '../services/marketplaceService';
import { useAuth } from '../contexts/AuthContext';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: 'En attente', color: 'text-gray-400 bg-gray-900 border-gray-700', icon: Clock },
  in_progress: { label: 'En cours', color: 'text-blue-400 bg-blue-950/40 border-blue-800/50', icon: Package },
  delivered: { label: 'Livré', color: 'text-purple-400 bg-purple-950/40 border-purple-800/50', icon: Package },
  revision_requested: { label: 'Révision demandée', color: 'text-amber-400 bg-amber-950/40 border-amber-800/50', icon: AlertCircle },
  completed: { label: 'Terminé', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: 'text-gray-500 bg-gray-900 border-gray-800', icon: XCircle },
  disputed: { label: 'Litige', color: 'text-red-400 bg-red-950/40 border-red-800/50', icon: AlertCircle },
};

export default function MarketplaceOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [buyerOrders, setBuyerOrders] = useState<MarketplaceOrder[]>([]);
  const [providerOrders, setProviderOrders] = useState<MarketplaceOrder[]>([]);
  const [view, setView] = useState<'buyer' | 'provider'>('buyer');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  async function loadOrders() {
    if (!user) return;
    try {
      setLoading(true);
      const [buyer, provider] = await Promise.all([
        marketplaceService.getBuyerOrders(user.id),
        marketplaceService.getProviderOrders(user.id),
      ]);
      setBuyerOrders(buyer);
      setProviderOrders(provider);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const currentOrders = view === 'buyer' ? buyerOrders : providerOrders;
  const filteredOrders = filterStatus === 'all'
    ? currentOrders
    : currentOrders.filter((o) => o.status === filterStatus);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
          <p className="text-gray-400 mb-6">Connectez-vous pour voir vos commandes</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Mes Commandes</h1>
          <p className="text-gray-400">Gérez vos achats et ventes sur le Marketplace</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1 flex gap-1 mb-6">
          <button
            onClick={() => setView('buyer')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              view === 'buyer'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mes Achats ({buyerOrders.length})
          </button>
          <button
            onClick={() => setView('provider')}
            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${
              view === 'provider'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mes Ventes ({providerOrders.length})
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-400">Filtrer :</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <option key={status} value={status}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
            <p className="text-gray-400 mb-6">
              {view === 'buyer'
                ? 'Vous n\'avez pas encore passé de commande'
                : 'Vous n\'avez pas encore reçu de commande'}
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Explorer le Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isProvider={view === 'provider'}
                onClick={() => navigate(`/marketplace/orders/${order.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, isProvider, onClick }: {
  order: MarketplaceOrder;
  isProvider: boolean;
  onClick: () => void;
}) {
  const config = STATUS_CONFIG[order.status];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-900 border border-gray-800 hover:border-red-600 rounded-2xl p-6 transition-all text-left"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-gray-500">{order.order_number}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${config.color} flex items-center gap-1.5`}>
              <Icon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-1">{order.service?.title || 'Service'}</h3>
          <p className="text-sm text-gray-500">
            {isProvider ? 'Client' : 'Prestataire'} • Formule {order.tier}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold mb-1">{order.price}€</div>
          <p className="text-xs text-gray-500">{order.currency}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {new Date(order.created_at).toLocaleDateString('fr-FR')}
          </span>
          {order.due_date && (
            <span className="flex items-center gap-1.5">
              Échéance : {new Date(order.due_date).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-red-400">
          Voir les détails
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
