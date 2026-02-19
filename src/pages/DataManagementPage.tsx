import { useState } from 'react';
import {
  ArrowLeft, Database, Download, Trash2, Archive,
  FileText, AlertTriangle, Shield, HardDrive
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DataManagementPageProps {
  onNavigate: (page: string) => void;
}

export default function DataManagementPage({ onNavigate }: DataManagementPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleExportData = async () => {
    setLoading(true);
    alert('Export de données - Cette fonctionnalité téléchargera toutes vos données dans un fichier JSON');
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.')) {
      if (confirm('Dernière confirmation: toutes vos données seront définitivement supprimées.')) {
        alert('Suppression de compte - Fonctionnalité à implémenter avec authentification');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 bg-gray-950 bg-opacity-95 backdrop-blur border-b border-gray-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-primary-400" />
            <h1 className="text-xl font-bold">Gestion des données</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold">Exporter vos données</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Téléchargez une copie de toutes vos données Goroti, y compris votre profil,
              vidéos, commentaires, abonnements et historique.
            </p>

            <button
              onClick={handleExportData}
              disabled={loading}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {loading ? 'Préparation...' : 'Télécharger mes données'}
            </button>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold">Utilisation du stockage</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Vidéos uploadées</p>
                  <p className="text-sm text-gray-400">Total des fichiers vidéo</p>
                </div>
                <span className="text-xl font-bold">2.4 GB</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Images et bannières</p>
                  <p className="text-sm text-gray-400">Photos de profil et bannières</p>
                </div>
                <span className="text-xl font-bold">15 MB</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Autres fichiers</p>
                  <p className="text-sm text-gray-400">Miniatures et documents</p>
                </div>
                <span className="text-xl font-bold">8 MB</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                <div>
                  <p className="font-semibold">Stockage total utilisé</p>
                  <p className="text-sm text-gray-400">Sur 10 GB disponibles</p>
                </div>
                <span className="text-2xl font-bold text-primary-400">2.42 GB</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold">Types de données collectées</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Informations de profil</h3>
                <p className="text-sm text-gray-400">
                  Nom, email, photo de profil, bio et préférences
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Contenu créé</h3>
                <p className="text-sm text-gray-400">
                  Vidéos, commentaires, likes et playlists
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Activité</h3>
                <p className="text-sm text-gray-400">
                  Historique de visionnage, recherches et interactions
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Données techniques</h3>
                <p className="text-sm text-gray-400">
                  Adresse IP, appareil, navigateur et localisation approximative
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Archive className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-semibold">Archiver le compte</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Désactivez temporairement votre compte. Vous pourrez le réactiver à tout moment
              en vous reconnectant. Votre profil et contenu seront masqués mais conservés.
            </p>

            <button className="px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Archiver mon compte
            </button>
          </div>

          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Zone dangereuse</h2>
            </div>

            <p className="text-gray-300 mb-6">
              Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
              Cette action est <strong>irréversible</strong> et ne peut pas être annulée.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Supprimer définitivement mon compte
            </button>
          </div>

          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Vos droits sur vos données</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Conformément au RGPD et aux lois sur la protection des données, vous avez le droit de:
                </p>
                <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                  <li>Accéder à vos données personnelles</li>
                  <li>Rectifier vos informations</li>
                  <li>Demander la suppression de vos données</li>
                  <li>Limiter le traitement de vos données</li>
                  <li>Porter vos données vers un autre service</li>
                  <li>Vous opposer au traitement automatisé</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
