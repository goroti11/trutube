import { useState } from 'react';
import { ArrowLeft, Upload, Globe, Users as UsersIcon, Lock, Crown, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';

type CommunityType = 'universe' | 'creator' | 'premium' | 'private';

export default function CreateCommunityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CommunityType>('creator');
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPrice, setPremiumPrice] = useState(4.99);
  const [rules, setRules] = useState(['Soyez respectueux', 'Pas de spam', 'Contenu approprié uniquement']);

  const communityTypes = [
    {
      type: 'creator' as CommunityType,
      icon: UsersIcon,
      label: 'Créateur',
      description: 'Communauté officielle de créateur',
    },
    {
      type: 'universe' as CommunityType,
      icon: Globe,
      label: 'Univers',
      description: 'Communauté thématique basée sur un univers',
    },
    {
      type: 'premium' as CommunityType,
      icon: Crown,
      label: 'Premium',
      description: 'Communauté payante avec avantages exclusifs',
    },
    {
      type: 'private' as CommunityType,
      icon: Lock,
      label: 'Privée',
      description: 'Accès sur invitation uniquement',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      window.location.hash = 'auth';
      return;
    }

    setLoading(true);
    try {
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: name.trim(),
          slug,
          description: description.trim(),
          type,
          creator_id: user.id,
          is_premium: isPremium,
          premium_price: isPremium ? premiumPrice : 0,
          rules,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await supabase.from('community_members').insert({
          community_id: data.id,
          user_id: user.id,
          role: 'owner',
        });

        window.location.hash = `community/${slug}`;
      }
    } catch (error: any) {
      console.error('Error creating community:', error);
      alert(error.message || 'Erreur lors de la création de la communauté');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connexion requise
            </h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour créer une communauté.
            </p>
            <a
              href="#auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Se connecter / S'inscrire
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
        <a
          href="#community"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux communautés
        </a>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Créer une communauté
          </h1>
          <p className="text-gray-600 mb-8">
            Rassemblez votre audience autour de discussions et contenus exclusifs
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la communauté *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ma super communauté"
                required
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                {name.length}/50 caractères
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="De quoi parle votre communauté..."
                required
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                {description.length}/500 caractères
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de communauté *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communityTypes.map((ct) => (
                  <button
                    key={ct.type}
                    type="button"
                    onClick={() => setType(ct.type)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      type === ct.type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <ct.icon
                        className={`w-6 h-6 mt-0.5 ${
                          type === ct.type ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900 mb-1">{ct.label}</div>
                        <div className="text-xs text-gray-600">{ct.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    Communauté payante
                  </div>
                  <div className="text-sm text-gray-600">
                    Monétisez votre communauté avec un abonnement mensuel
                  </div>
                </div>
              </label>

              {isPremium && (
                <div className="mt-4 ml-8">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Prix mensuel (€)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(parseFloat(e.target.value))}
                    min="0.99"
                    max="99.99"
                    step="0.01"
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommandé : entre 2.99€ et 9.99€/mois
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Règles de la communauté
              </label>
              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[index] = e.target.value;
                        setRules(newRules);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    {rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setRules(rules.filter((_, i) => i !== index))}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {rules.length < 10 && (
                <button
                  type="button"
                  onClick={() => setRules([...rules, ''])}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Ajouter une règle
                </button>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Images (optionnel)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Avatar</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">
                      Carré 512x512px
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Bannière</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">
                      1920x384px
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2">
                Avant de créer votre communauté
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vous serez propriétaire et administrateur</li>
                <li>• Vous pourrez nommer des modérateurs</li>
                <li>• Vous devrez modérer le contenu selon nos règles</li>
                <li>• Les communautés inactives peuvent être archivées</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-4">
              <a
                href="#community"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-block"
              >
                Annuler
              </a>
              <button
                type="submit"
                disabled={!name.trim() || !description.trim() || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer la communauté'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
