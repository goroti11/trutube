import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Crown } from 'lucide-react';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Community {
  id: string;
  name: string;
}

interface PremiumTier {
  id?: string;
  community_id: string;
  tier_name: string;
  price_monthly: number;
  price_yearly: number | null;
  benefits: string[];
  max_members: number | null;
  is_active: boolean;
}

interface CommunityPremiumPricingPageProps {
  onNavigate: (page: string) => void;
}

export default function CommunityPremiumPricingPage({ onNavigate }: CommunityPremiumPricingPageProps) {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [tiers, setTiers] = useState<PremiumTier[]>([]);
  const [editingTier, setEditingTier] = useState<Partial<PremiumTier> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, [user]);

  useEffect(() => {
    if (selectedCommunity) {
      loadTiers();
    }
  }, [selectedCommunity]);

  const loadCommunities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name')
        .eq('creator_id', user.id);

      if (error) throw error;
      setCommunities(data || []);

      if (data && data.length > 0) {
        setSelectedCommunity(data[0].id);
      }
    } catch (error) {
      console.error('Erreur chargement communautés:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTiers = async () => {
    try {
      const { data, error } = await supabase
        .from('community_premium_pricing')
        .select('*')
        .eq('community_id', selectedCommunity);

      if (error) throw error;
      setTiers(data || []);
    } catch (error) {
      console.error('Erreur chargement tiers:', error);
    }
  };

  const handleAddTier = () => {
    setEditingTier({
      community_id: selectedCommunity,
      tier_name: '',
      price_monthly: 0,
      price_yearly: null,
      benefits: [''],
      max_members: null,
      is_active: true
    });
  };

  const handleSaveTier = async () => {
    if (!editingTier || !editingTier.tier_name || !editingTier.price_monthly) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      if (editingTier.id) {
        const { error } = await supabase
          .from('community_premium_pricing')
          .update(editingTier)
          .eq('id', editingTier.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('community_premium_pricing')
          .insert([editingTier]);

        if (error) throw error;
      }

      await loadTiers();
      setEditingTier(null);
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur: ' + error.message);
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce tier ?')) return;

    try {
      const { error } = await supabase
        .from('community_premium_pricing')
        .delete()
        .eq('id', tierId);

      if (error) throw error;
      await loadTiers();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const updateBenefit = (index: number, value: string) => {
    if (!editingTier) return;
    const newBenefits = [...(editingTier.benefits || [''])];
    newBenefits[index] = value;
    setEditingTier({ ...editingTier, benefits: newBenefits });
  };

  const addBenefit = () => {
    if (!editingTier) return;
    setEditingTier({
      ...editingTier,
      benefits: [...(editingTier.benefits || []), '']
    });
  };

  const removeBenefit = (index: number) => {
    if (!editingTier) return;
    const newBenefits = editingTier.benefits?.filter((_, i) => i !== index) || [];
    setEditingTier({ ...editingTier, benefits: newBenefits });
  };

  if (loading) {
    return (
      <>
        <Header onNavigate={onNavigate} showNavigation={true} />
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
        </div>
      </>
    );
  }

  if (communities.length === 0) {
    return (
      <>
        <Header onNavigate={onNavigate} showNavigation={true} />
        <div className="min-h-screen bg-gray-950 text-white pt-20">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Aucune communauté</h2>
            <p className="text-gray-400 mb-6">
              Vous devez créer une communauté avant de définir des prix Premium
            </p>
            <button
              onClick={() => onNavigate('create-community')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
            >
              Créer une communauté
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="min-h-screen bg-gray-950 text-white pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Tarifs Premium - Communautés</h1>

          {/* Community Selector */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <label className="block text-sm font-semibold mb-2">Sélectionner une communauté</label>
            <select
              value={selectedCommunity}
              onChange={(e) => setSelectedCommunity(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tiers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tiers.map((tier) => (
              <div key={tier.id} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{tier.tier_name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTier(tier)}
                      className="p-2 text-blue-500 hover:bg-gray-800 rounded"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => tier.id && handleDeleteTier(tier.id)}
                      className="p-2 text-red-500 hover:bg-gray-800 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-red-500">
                    {tier.price_monthly.toFixed(2)}€/mois
                  </p>
                  {tier.price_yearly && (
                    <p className="text-sm text-gray-400">
                      ou {tier.price_yearly.toFixed(2)}€/an
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-400">Avantages:</p>
                  <ul className="space-y-1">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.max_members && (
                  <p className="mt-4 text-sm text-gray-400">
                    Max: {tier.max_members} membres
                  </p>
                )}
              </div>
            ))}

            {/* Add Button */}
            <button
              onClick={handleAddTier}
              className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-red-600 transition-colors"
            >
              <Plus className="w-12 h-12 text-gray-600 mb-2" />
              <span className="text-gray-400">Ajouter un tier</span>
            </button>
          </div>

          {/* Edit Modal */}
          {editingTier && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingTier.id ? 'Éditer' : 'Nouveau'} Tier Premium
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nom du tier</label>
                    <input
                      type="text"
                      value={editingTier.tier_name || ''}
                      onChange={(e) => setEditingTier({ ...editingTier, tier_name: e.target.value })}
                      placeholder="VIP, Elite, Supporter..."
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Prix mensuel (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingTier.price_monthly || 0}
                        onChange={(e) => setEditingTier({ ...editingTier, price_monthly: parseFloat(e.target.value) })}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Prix annuel (€, optionnel)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingTier.price_yearly || ''}
                        onChange={(e) => setEditingTier({ ...editingTier, price_yearly: e.target.value ? parseFloat(e.target.value) : null })}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Max membres (optionnel)</label>
                    <input
                      type="number"
                      value={editingTier.max_members || ''}
                      onChange={(e) => setEditingTier({ ...editingTier, max_members: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Laissez vide pour illimité"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold">Avantages</label>
                      <button
                        onClick={addBenefit}
                        className="text-sm text-red-500 hover:text-red-400"
                      >
                        + Ajouter
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editingTier.benefits || ['']).map((benefit, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => updateBenefit(idx, e.target.value)}
                            placeholder="Ex: Accès anticipé aux vidéos"
                            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                          {idx > 0 && (
                            <button
                              onClick={() => removeBenefit(idx)}
                              className="p-2 text-red-500 hover:bg-gray-800 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveTier}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditingTier(null)}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
