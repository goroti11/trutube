import { useEffect, useState } from 'react';
import { ArrowLeft, Users, Shield, Settings as SettingsIcon, Ban, UserPlus, Crown, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Community, CommunityMember, communityService } from '../services/communityService';

interface CommunitySettingsPageProps {
  slug?: string;
}

type Tab = 'general' | 'members' | 'moderation';

export default function CommunitySettingsPage({ slug = '' }: CommunitySettingsPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('general');

  useEffect(() => {
    if (slug && user) {
      loadCommunityData();
    }
  }, [slug, user]);

  const loadCommunityData = async () => {
    if (!slug || !user) return;

    setLoading(true);
    try {
      const communityData = await communityService.getCommunityBySlug(slug);
      if (!communityData) return;

      setCommunity(communityData);

      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', communityData.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!memberError && memberData) {
        setUserRole(memberData.role);

        if (memberData.role === 'owner' || memberData.role === 'admin') {
          const { data: allMembers, error: membersError } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', communityData.id)
            .order('joined_at', { ascending: false });

          if (!membersError && allMembers) {
            setMembers(allMembers);
          }
        }
      }
    } catch (error) {
      console.error('Error loading community:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'moderator' | 'member') => {
    if (!community || !user || userRole !== 'owner') return;

    try {
      const { error } = await supabase
        .from('community_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (!error) {
        await loadCommunityData();
        alert(`Rôle mis à jour avec succès!`);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!community || !user || (userRole !== 'owner' && userRole !== 'admin')) return;

    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre?')) return;

    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('id', memberId);

      if (!error) {
        await loadCommunityData();
        alert('Membre retiré avec succès');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Erreur lors du retrait du membre');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder aux paramètres.
            </p>
            <a
              href="#auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!community || !userRole || (userRole !== 'owner' && userRole !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-6">
              Seuls les propriétaires et administrateurs peuvent accéder aux paramètres de la communauté.
            </p>
            <a
              href={`#community/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Retour à la communauté
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

      <main className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <a
          href={`#community/${slug}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à la communauté
        </a>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Paramètres de {community.name}
            </h1>
            <p className="text-blue-100">
              Gérez votre communauté, membres et paramètres
            </p>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === 'general'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <SettingsIcon className="w-5 h-5" />
                Général
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === 'members'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-5 h-5" />
                Membres ({members.length})
              </button>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === 'moderation'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-5 h-5" />
                Modération
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Informations de base
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <p className="text-gray-900">{community.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug
                      </label>
                      <p className="text-gray-600 font-mono text-sm">{community.slug}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <p className="text-gray-900">{community.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <p className="text-gray-900 capitalize">{community.type}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Statistiques
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-600">
                        {community.member_count.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-900">Membres</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600">
                        {community.post_count.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-900">Posts</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Gestion des membres
                </h3>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            User {member.user_id.slice(0, 8)}...
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              member.role === 'owner' ? 'bg-yellow-100 text-yellow-800' :
                              member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              member.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {member.role === 'owner' && <Crown className="w-3 h-3 inline mr-1" />}
                              {member.role}
                            </span>
                            <span>•</span>
                            <span>{member.post_count} posts</span>
                            <span>•</span>
                            <span>Réputation: {member.reputation_score}</span>
                          </div>
                        </div>
                      </div>

                      {userRole === 'owner' && member.role !== 'owner' && (
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="member">Membre</option>
                            <option value="moderator">Modérateur</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Retirer du membre"
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Outils de modération
                </h3>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      Règles de la communauté
                    </h4>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      {community.rules && community.rules.map((rule: any, index: number) => (
                        <li key={index}>• {rule}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Modération automatique
                    </h4>
                    <p className="text-sm text-blue-800">
                      Les posts et commentaires sont automatiquement modérés selon les règles de TruTube.
                      Les contenus signalés sont examinés par l'équipe de modération.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">
                      Statistiques de modération
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-green-800">Posts signalés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-green-800">Posts retirés</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-xs text-green-800">Membres bannis</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
