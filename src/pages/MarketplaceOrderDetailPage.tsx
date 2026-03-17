import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, Paperclip, CheckCircle, XCircle, AlertTriangle, Package,
  Clock, MessageCircle, FileText, Star
} from 'lucide-react';
import { marketplaceService, MarketplaceOrder, OrderMessage } from '../services/marketplaceService';
import { useAuth } from '../contexts/AuthContext';

export default function MarketplaceOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [revisionNote, setRevisionNote] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  const isProvider = order?.provider_id === user?.id;
  const isBuyer = order?.buyer_id === user?.id;

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId]);

  async function loadOrderDetails() {
    if (!orderId) return;
    try {
      setLoading(true);
      const [orderData, messagesData, deliveriesData] = await Promise.all([
        marketplaceService.getOrder(orderId),
        marketplaceService.getMessages(orderId),
        marketplaceService.getDeliveries(orderId),
      ]);
      setOrder(orderData);
      setMessages(messagesData);
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !user || !orderId) return;
    await marketplaceService.sendMessage(orderId, user.id, newMessage.trim());
    setNewMessage('');
    loadOrderDetails();
  }

  async function handleSubmitDelivery() {
    if (!orderId || !deliveryNote.trim()) return;
    const success = await marketplaceService.submitDelivery(orderId, deliveryNote, []);
    if (success) {
      setDeliveryNote('');
      setShowDeliveryForm(false);
      loadOrderDetails();
    }
  }

  async function handleRequestRevision() {
    if (!orderId || !revisionNote.trim()) return;
    const success = await marketplaceService.requestRevision(orderId, revisionNote);
    if (success) {
      setRevisionNote('');
      setShowRevisionForm(false);
      loadOrderDetails();
    }
  }

  async function handleCompleteOrder() {
    if (!orderId) return;
    const success = await marketplaceService.completeOrder(orderId, rating, reviewText);
    if (success) {
      setShowCompletionForm(false);
      loadOrderDetails();
    }
  }

  async function handleOpenDispute() {
    if (!orderId || !disputeReason.trim()) return;
    const result = await marketplaceService.openDisputeWithRpc(orderId, disputeReason, disputeDescription);
    if (result?.success) {
      setShowDisputeForm(false);
      loadOrderDetails();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Commande non trouvée</h2>
          <button
            onClick={() => navigate('/marketplace/orders')}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/marketplace/orders')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux commandes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-black mb-2">{order.service?.title}</h1>
                  <p className="text-sm text-gray-500">Commande {order.order_number}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{order.price}€</div>
                  <p className="text-xs text-gray-500">Formule {order.tier}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Statut</p>
                  <p className="font-medium">{order.status}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Livraison</p>
                  <p className="font-medium">{order.delivery_days} jours</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Révisions</p>
                  <p className="font-medium">{order.revisions_used}/{order.max_revisions}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md p-4 rounded-xl ${
                      msg.sender_id === user?.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Votre message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-red-600 hover:bg-red-500 p-3 rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {deliveries.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Livraisons</h2>
                <div className="space-y-4">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="bg-gray-800 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                          {new Date(delivery.created_at).toLocaleString('fr-FR')}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          delivery.status === 'accepted' ? 'bg-emerald-950/50 text-emerald-400' :
                          delivery.status === 'rejected' ? 'bg-red-950/50 text-red-400' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {delivery.status}
                        </span>
                      </div>
                      <p className="text-gray-300">{delivery.delivery_note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold">Actions</h2>

              {isProvider && order.status === 'in_progress' && (
                <button
                  onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Soumettre la livraison
                </button>
              )}

              {isBuyer && order.status === 'delivered' && order.revision_count < order.max_revisions && (
                <button
                  onClick={() => setShowRevisionForm(!showRevisionForm)}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Demander une révision
                </button>
              )}

              {isBuyer && order.status === 'delivered' && (
                <button
                  onClick={() => setShowCompletionForm(!showCompletionForm)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Valider la livraison
                </button>
              )}

              {order.status !== 'completed' && order.status !== 'disputed' && (
                <button
                  onClick={() => setShowDisputeForm(!showDisputeForm)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  Ouvrir un litige
                </button>
              )}
            </div>

            {showDeliveryForm && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Soumettre la livraison</h3>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Description de la livraison..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitDelivery}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Envoyer
                  </button>
                  <button
                    onClick={() => setShowDeliveryForm(false)}
                    className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {showRevisionForm && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Demander une révision</h3>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Décrivez les modifications souhaitées..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRequestRevision}
                    className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Envoyer
                  </button>
                  <button
                    onClick={() => setShowRevisionForm(false)}
                    className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {showCompletionForm && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4">Valider et noter</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Note</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRating(r)}
                        className="transition-colors"
                      >
                        <Star
                          className={`w-8 h-8 ${r <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Votre avis (optionnel)..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCompleteOrder}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Valider
                  </button>
                  <button
                    onClick={() => setShowCompletionForm(false)}
                    className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {showDisputeForm && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-red-400">Ouvrir un litige</h3>
                <input
                  type="text"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="Motif du litige"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-red-500"
                />
                <textarea
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="Description détaillée..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenDispute}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition-colors"
                  >
                    Ouvrir
                  </button>
                  <button
                    onClick={() => setShowDisputeForm(false)}
                    className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
