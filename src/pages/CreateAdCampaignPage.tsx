import React, { useState } from 'react';
import {
  Target,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Image as ImageIcon,
  Video,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

type CampaignType = 'video' | 'banner' | 'sponsored';
type AdFormat = 'preroll' | 'midroll' | 'banner' | 'sidebar' | 'native';
type Step = 1 | 2 | 3 | 4;

export default function CreateAdCampaignPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1: Basic Info
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState<CampaignType>('video');
  const [objective, setObjective] = useState('awareness');

  // Step 2: Targeting
  const [selectedUniverses, setSelectedUniverses] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 });
  const [countries, setCountries] = useState<string[]>(['FR']);
  const [interests, setInterests] = useState<string[]>([]);

  // Step 3: Ad Format & Creative
  const [adFormat, setAdFormat] = useState<AdFormat>('preroll');
  const [adFile, setAdFile] = useState<File | null>(null);
  const [destinationUrl, setDestinationUrl] = useState('');

  // Step 4: Budget & Schedule
  const [budget, setBudget] = useState('1000');
  const [budgetType, setBudgetType] = useState<'daily' | 'total'>('total');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bidStrategy, setBidStrategy] = useState('cpc');

  const universes = [
    'Musique', 'Gaming', 'Tech', 'Sport', 'Cuisine',
    'Mode', 'Éducation', 'Divertissement', 'Voyage', 'Business'
  ];

  const interestOptions = [
    'Hip-Hop', 'Pop', 'Rock', 'Électronique', 'Jazz',
    'E-sports', 'RPG', 'FPS', 'Streaming',
    'Smartphones', 'IA', 'Cryptomonnaies',
    'Football', 'Basketball', 'Fitness'
  ];

  const campaignTypes = [
    {
      id: 'video' as CampaignType,
      name: 'Publicité Vidéo',
      description: 'Annonces vidéo avant ou pendant les vidéos',
      icon: Video,
      recommended: true
    },
    {
      id: 'banner' as CampaignType,
      name: 'Bannière Display',
      description: 'Annonces visuelles sur le site',
      icon: ImageIcon,
      recommended: false
    },
    {
      id: 'sponsored' as CampaignType,
      name: 'Contenu Sponsorisé',
      description: 'Partenariats avec créateurs',
      icon: Users,
      recommended: false
    }
  ];

  const objectives = [
    { id: 'awareness', name: 'Notoriété', description: 'Maximiser la visibilité' },
    { id: 'consideration', name: 'Considération', description: 'Générer de l\'intérêt' },
    { id: 'conversion', name: 'Conversion', description: 'Générer des actions' }
  ];

  const handleSubmit = async () => {
    // Validation
    if (!campaignName || !budget || !startDate || !endDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Créer la campagne
    console.log('Creating campaign:', {
      campaignName,
      campaignType,
      objective,
      targeting: { selectedUniverses, ageRange, countries, interests },
      adFormat,
      destinationUrl,
      budget: { amount: budget, type: budgetType },
      schedule: { startDate, endDate },
      bidStrategy
    });

    // Rediriger vers le paiement
    window.location.hash = 'ad-payment';
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return campaignName && campaignType && objective;
      case 2:
        return selectedUniverses.length > 0;
      case 3:
        return destinationUrl;
      case 4:
        return budget && startDate && endDate;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.location.hash = 'advertiser-dashboard'}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">
            Créer une Campagne Publicitaire
          </h1>
          <p className="text-gray-400">
            Configurez votre campagne en 4 étapes simples
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                      : 'bg-gray-800 text-gray-500'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  <div className="hidden md:block">
                    <div className={`font-medium ${step <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                      {step === 1 && 'Informations'}
                      {step === 2 && 'Ciblage'}
                      {step === 3 && 'Créatifs'}
                      {step === 4 && 'Budget'}
                    </div>
                  </div>
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    step < currentStep ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gray-800'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Informations de base</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom de la campagne *
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Ex: Lancement Été 2026"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Type de campagne *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {campaignTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCampaignType(type.id)}
                      className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                        campaignType === type.id
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      {type.recommended && (
                        <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Recommandé
                        </span>
                      )}
                      <type.icon className={`w-8 h-8 mb-3 ${
                        campaignType === type.id ? 'text-red-500' : 'text-gray-400'
                      }`} />
                      <h3 className={`font-bold mb-1 ${
                        campaignType === type.id ? 'text-white' : 'text-gray-300'
                      }`}>
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-400">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Objectif de la campagne *
                </label>
                <div className="space-y-3">
                  {objectives.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => setObjective(obj.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                        objective === obj.id
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        objective === obj.id ? 'border-red-600' : 'border-gray-600'
                      }`}>
                        {objective === obj.id && (
                          <div className="w-3 h-3 rounded-full bg-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className={`font-bold mb-1 ${
                          objective === obj.id ? 'text-white' : 'text-gray-300'
                        }`}>
                          {obj.name}
                        </h3>
                        <p className="text-sm text-gray-400">{obj.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Targeting */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Ciblage de l'audience</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Univers ciblés *
                </label>
                <div className="flex flex-wrap gap-2">
                  {universes.map((universe) => (
                    <button
                      key={universe}
                      onClick={() => {
                        if (selectedUniverses.includes(universe)) {
                          setSelectedUniverses(selectedUniverses.filter(u => u !== universe));
                        } else {
                          setSelectedUniverses([...selectedUniverses, universe]);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedUniverses.includes(universe)
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {universe}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Tranche d'âge
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Âge minimum</label>
                    <input
                      type="number"
                      value={ageRange.min}
                      onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) })}
                      min="13"
                      max="99"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Âge maximum</label>
                    <input
                      type="number"
                      value={ageRange.max}
                      onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) })}
                      min="13"
                      max="99"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Centres d'intérêt
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => {
                        if (interests.includes(interest)) {
                          setInterests(interests.filter(i => i !== interest));
                        } else {
                          setInterests([...interests, interest]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        interests.includes(interest)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-500 mb-1">Estimation d'audience</h4>
                    <p className="text-sm text-gray-300">
                      Avec ces paramètres, votre campagne peut atteindre environ{' '}
                      <span className="font-bold text-white">2.5M - 3.8M utilisateurs</span> uniques
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ad Format & Creative */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Format et créatifs</h2>

              {campaignType === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Format vidéo *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setAdFormat('preroll')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        adFormat === 'preroll'
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="font-bold text-white mb-1">Pre-roll</h3>
                      <p className="text-sm text-gray-400">Avant la vidéo (15-30s)</p>
                    </button>
                    <button
                      onClick={() => setAdFormat('midroll')}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        adFormat === 'midroll'
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="font-bold text-white mb-1">Mid-roll</h3>
                      <p className="text-sm text-gray-400">Pendant la vidéo (15-30s)</p>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fichier publicitaire
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors cursor-pointer">
                  <Video className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-300 mb-1">
                    Glissez-déposez votre fichier ou cliquez pour parcourir
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, MOV, AVI (max 500MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de destination *
                </label>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                />
                <p className="text-xs text-gray-500 mt-2">
                  URL vers laquelle les utilisateurs seront redirigés après le clic
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Budget & Schedule */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Budget et planification</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Type de budget *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setBudgetType('daily')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      budgetType === 'daily'
                        ? 'border-red-600 bg-red-600/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-bold text-white mb-1">Quotidien</h3>
                    <p className="text-sm text-gray-400">Dépense fixe par jour</p>
                  </button>
                  <button
                    onClick={() => setBudgetType('total')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      budgetType === 'total'
                        ? 'border-red-600 bg-red-600/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <h3 className="font-bold text-white mb-1">Total</h3>
                    <p className="text-sm text-gray-400">Budget sur toute la durée</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Montant (€) *
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="100"
                  step="50"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Budget minimum: 100 €
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Stratégie d'enchères
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'cpc', name: 'CPC (Coût par clic)', desc: 'Optimisé pour les clics' },
                    { id: 'cpm', name: 'CPM (Coût par mille)', desc: 'Optimisé pour les impressions' },
                    { id: 'cpa', name: 'CPA (Coût par action)', desc: 'Optimisé pour les conversions' }
                  ].map((strategy) => (
                    <button
                      key={strategy.id}
                      onClick={() => setBidStrategy(strategy.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-start gap-4 ${
                        bidStrategy === strategy.id
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        bidStrategy === strategy.id ? 'border-red-600' : 'border-gray-600'
                      }`}>
                        {bidStrategy === strategy.id && (
                          <div className="w-3 h-3 rounded-full bg-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1">{strategy.name}</h3>
                        <p className="text-sm text-gray-400">{strategy.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-500 mb-1">Estimation de performance</h4>
                    <p className="text-sm text-gray-300">
                      Avec ce budget, vous pouvez générer environ{' '}
                      <span className="font-bold text-white">150-250 clics</span> et{' '}
                      <span className="font-bold text-white">50K-80K impressions</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as Step)}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => window.location.hash = 'advertiser-dashboard'}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1) as Step)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Lancer la campagne
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
