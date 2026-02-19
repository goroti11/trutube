import { useEffect, useState } from 'react';
import {
  ArrowLeft, UserPlus, Trash2, Shield, BarChart2,
  Edit2, CheckCircle, AlertCircle, User
} from 'lucide-react';
import {
  channelService, CreatorChannel, ChannelCollaborator,
  CollaboratorRole, COLLABORATOR_ROLES
} from '../services/channelService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  channelId: string;
  onNavigate: (page: string) => void;
}

export default function ChannelTeamPage({ channelId, onNavigate }: Props) {
  const { user } = useAuth();
  const [channel, setChannel] = useState<CreatorChannel | null>(null);
  const [collaborators, setCollaborators] = useState<ChannelCollaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('editor');
  const [inviting, setInviting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<CollaboratorRole>('editor');

  useEffect(() => {
    if (!user) { onNavigate('auth'); return; }
    load();
  }, [channelId, user]);

  const load = async () => {
    setLoading(true);
    const [ch, collabs] = await Promise.all([
      channelService.getChannel(channelId),
      channelService.getCollaborators(channelId),
    ]);
    setChannel(ch);
    setCollaborators(collabs);
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!user || !inviteUserId.trim()) return;
    setInviting(true);
    const collab = await channelService.addCollaborator(channelId, user.id, inviteUserId.trim(), inviteRole);
    if (collab) {
      setCollaborators(prev => [...prev, collab]);
      setShowInvite(false);
      setInviteUserId('');
      setInviteRole('editor');
    }
    setInviting(false);
  };

  const handleUpdateRole = async (id: string) => {
    const ok = await channelService.updateCollaboratorRole(id, editRole);
    if (ok) {
      setCollaborators(prev => prev.map(c => c.id === id ? { ...c, role: editRole } : c));
      setEditingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Retirer ce collaborateur ?')) return;
    const ok = await channelService.removeCollaborator(id);
    if (ok) setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  if (loading || !channel) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex justify-center items-center py-32 mt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 mt-16">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate(`channel-edit/${channelId}`)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white">Équipe — {channel.channel_name}</h1>
            <p className="text-sm text-gray-400">{collaborators.length} collaborateur{collaborators.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Inviter
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
          <h2 className="text-sm font-semibold text-white mb-3">Rôles disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COLLABORATOR_ROLES.map(role => (
              <div key={role.value} className="bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full bg-gray-700">{role.label}</span>
                </div>
                <p className="text-xs text-gray-400">{role.desc}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {role.perms.map(p => (
                    <span key={p} className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {collaborators.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
            <User className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">Aucun collaborateur</p>
            <p className="text-gray-600 text-xs mt-1">Invitez des membres de votre équipe</p>
            <button
              onClick={() => setShowInvite(true)}
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Inviter un collaborateur
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {collaborators.map(collab => {
              const roleInfo = COLLABORATOR_ROLES.find(r => r.value === collab.role);
              return (
                <div key={collab.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-white truncate">{collab.user_id}</p>
                        {collab.accepted ? (
                          <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Accepté</span>
                        ) : (
                          <span className="text-xs text-amber-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> En attente</span>
                        )}
                      </div>
                      {editingId === collab.id ? (
                        <div className="flex items-center gap-2 mt-2">
                          <select
                            value={editRole}
                            onChange={e => setEditRole(e.target.value as CollaboratorRole)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500"
                          >
                            {COLLABORATOR_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                          </select>
                          <button onClick={() => handleUpdateRole(collab.id)} className="text-xs text-green-400 hover:text-green-300 font-medium">Confirmer</button>
                          <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-400">Annuler</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{roleInfo?.label ?? collab.role}</span>
                          <p className="text-xs text-gray-600">{roleInfo?.desc}</p>
                        </div>
                      )}
                    </div>
                    {editingId !== collab.id && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingId(collab.id); setEditRole(collab.role); }}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemove(collab.id)}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />

      {showInvite && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-white mb-5">Inviter un collaborateur</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">ID utilisateur *</label>
                <input
                  value={inviteUserId}
                  onChange={e => setInviteUserId(e.target.value)}
                  placeholder="UUID de l'utilisateur Goroti"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
                <p className="text-xs text-gray-600 mt-1">L'utilisateur doit avoir un compte Goroti actif.</p>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Rôle</label>
                <div className="space-y-2">
                  {COLLABORATOR_ROLES.map(role => (
                    <button
                      key={role.value}
                      onClick={() => setInviteRole(role.value)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        inviteRole === role.value ? 'border-red-500 bg-red-600/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{role.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{role.desc} — {role.perms.join(', ')}</p>
                      </div>
                      {inviteRole === role.value && <CheckCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium transition-colors">
                Annuler
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteUserId.trim()}
                className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
              >
                {inviting ? 'Invitation...' : 'Inviter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
