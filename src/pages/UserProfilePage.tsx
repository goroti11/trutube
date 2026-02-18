import { useState, useEffect } from 'react';
import { User, Mail, Globe, FileText, Loader2, Camera, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
}

interface UserProfilePageProps {
  onNavigate: (page: string) => void;
}

export const UserProfilePage = ({ onNavigate }: UserProfilePageProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          website: data.website || '',
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (!formData.username.trim()) {
        setError('Le nom d\'utilisateur est requis');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username.trim(),
          full_name: formData.full_name.trim() || null,
          bio: formData.bio.trim() || null,
          website: formData.website.trim() || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setSuccess('Profil mis à jour avec succès!');
      setEditing(false);
      await loadProfile();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || '',
      });
    }
    setEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <>
        <Header onNavigate={onNavigate} showNavigation={true} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"></div>

            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center relative group">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  {editing && (
                    <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {profile?.full_name || profile?.username}
                  </h1>
                  <p className="text-gray-400">@{profile?.username}</p>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Modifier le profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    Nom d'utilisateur
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={saving}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                      placeholder="votre_pseudo"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile?.username}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <User className="w-4 h-4" />
                    Nom complet
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={saving}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                      placeholder="Votre nom complet"
                    />
                  ) : (
                    <p className="text-white text-lg">
                      {profile?.full_name || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-white text-lg">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    L'email ne peut pas être modifié ici
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      disabled={saving}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 resize-none"
                      placeholder="Parlez-nous de vous..."
                    />
                  ) : (
                    <p className="text-white">
                      {profile?.bio || 'Aucune bio renseignée'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                    <Globe className="w-4 h-4" />
                    Site web
                  </label>
                  {editing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      disabled={saving}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                      placeholder="https://votre-site.com"
                    />
                  ) : profile?.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    <p className="text-white">Non renseigné</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
