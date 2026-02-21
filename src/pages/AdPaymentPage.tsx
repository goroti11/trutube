import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Check,
  Lock,
  ArrowLeft,
  Info,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  name: string;
  icon: any;
  description: string;
}

export default function AdPaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [amount, setAmount] = useState('1000');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Carte Bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'bank',
      type: 'bank',
      name: 'Virement Bancaire',
      icon: Building2,
      description: 'Pour montants >5000€'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      alert('Veuillez accepter les conditions générales');
      return;
    }

    setProcessing(true);

    // Simuler le traitement du paiement
    setTimeout(() => {
      setProcessing(false);
      // Rediriger vers le dashboard avec confirmation
      window.location.hash = 'advertiser-dashboard?payment=success';
    }, 2000);
  };

  const getTVA = () => {
    return parseFloat(amount) * 0.20;
  };

  const getTotal = () => {
    return parseFloat(amount) + getTVA();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.location.hash = 'create-ad-campaign'}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            Paiement Campagne Publicitaire
          </h1>
          <p className="text-gray-400">
            Rechargez votre compte publicitaire en toute sécurité
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Montant du Budget</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Montant à créditer (€)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    step="50"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-2xl font-bold focus:outline-none focus:border-red-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Montant minimum: 100 €
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['500', '1000', '5000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        amount === preset
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {preset} €
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Méthode de Paiement</h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      disabled={method.id === 'bank' && parseFloat(amount) < 5000}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                        selectedMethod === method.id
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      } ${method.id === 'bank' && parseFloat(amount) < 5000 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`p-3 rounded-xl ${
                        selectedMethod === method.id ? 'bg-red-600' : 'bg-gray-700'
                      }`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{method.name}</h3>
                        <p className="text-sm text-gray-400">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <Check className="w-6 h-6 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {selectedMethod === 'card' && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    Informations de Carte
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom sur la carte
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Jean Dupont"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Info */}
              {selectedMethod === 'bank' && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Informations de Virement
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Bénéficiaire:</span>
                      <span className="text-white font-medium">Goroti SAS</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">IBAN:</span>
                      <span className="text-white font-mono">FR76 1234 5678 9012 3456 7890 123</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">BIC:</span>
                      <span className="text-white font-mono">AGRIFRPP882</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Référence:</span>
                      <span className="text-white font-mono">ADS-{Date.now()}</span>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300">
                          Après validation du virement (2-3 jours ouvrés), votre compte publicitaire sera crédité automatiquement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-800 text-red-600 focus:ring-red-600"
                  />
                  <span className="text-sm text-gray-300">
                    J'accepte les{' '}
                    <a href="#terms" className="text-red-500 hover:underline">
                      Conditions Générales de Vente
                    </a>
                    {' '}et la{' '}
                    <a href="#privacy" className="text-red-500 hover:underline">
                      Politique de Confidentialité
                    </a>
                    . Je confirme que je dispose de l'autorité nécessaire pour effectuer ce paiement au nom de mon entreprise.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!acceptTerms || processing}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  `Confirmer le paiement de ${getTotal().toFixed(2)} €`
                )}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Récapitulatif</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Budget publicitaire</span>
                  <span className="font-medium">{parseFloat(amount).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>TVA (20%)</span>
                  <span className="font-medium">{getTVA().toFixed(2)} €</span>
                </div>
                <div className="h-px bg-gray-800" />
                <div className="flex justify-between text-white text-lg">
                  <span className="font-bold">Total TTC</span>
                  <span className="font-bold">{getTotal().toFixed(2)} €</span>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-500 mb-1">Paiement Sécurisé</h3>
                    <p className="text-sm text-gray-300">
                      Transaction cryptée SSL. Vos données bancaires sont protégées.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Crédit immédiat après validation</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Facturation automatique</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Support dédié 24/7</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Remboursement du crédit non utilisé</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-center">
                  Vous recevrez un email de confirmation après le paiement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">SSL Sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">PCI-DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">3D Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
