import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Video, Image, FileText, Tag, Globe, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { videoUploadService, VideoUploadData, VideoUploadProgress } from '../services/videoUploadService';
import { universeService } from '../services/universeService';
import { getUniverseDetail } from '../data/universeDetails';
import UniverseDetailsPanel from '../components/upload/UniverseDetailsPanel';

interface VideoUploadPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function VideoUploadPage({ onNavigate }: VideoUploadPageProps) {
  const { user } = useAuth();
  const [universes, setUniverses] = useState<any[]>([]);
  const [subUniverses, setSubUniverses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    transcription: '',
    universe_id: '',
    sub_universe_id: '',
    tags: '',
    quality: 'HD' as 'SD' | 'HD' | 'FHD' | '4K'
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<VideoUploadProgress>({
    status: 'idle',
    progress: 0,
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUniverses();
  }, []);

  useEffect(() => {
    if (formData.universe_id) {
      loadSubUniverses(formData.universe_id);
    } else {
      setSubUniverses([]);
    }
  }, [formData.universe_id]);

  const loadUniverses = async () => {
    const data = await universeService.getAllUniverses();
    setUniverses(data);
  };

  const loadSubUniverses = async (universeId: string) => {
    const data = await universeService.getSubUniverses(universeId);
    setSubUniverses(data);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = videoUploadService.validateVideoFile(file);
    if (!validation.valid) {
      setErrors({ ...errors, video: validation.error || '' });
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setErrors({ ...errors, video: '' });
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = videoUploadService.validateThumbnailFile(file);
    if (!validation.valid) {
      setErrors({ ...errors, thumbnail: validation.error || '' });
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setErrors({ ...errors, thumbnail: '' });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne doit pas dépasser 100 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.universe_id) {
      newErrors.universe = 'Vous devez sélectionner un univers';
    }

    if (!videoFile) {
      newErrors.video = 'Vous devez sélectionner une vidéo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !videoFile) return;

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const uploadData: VideoUploadData = {
      title: formData.title,
      description: formData.description,
      transcription: formData.transcription,
      universe_id: formData.universe_id,
      sub_universe_id: formData.sub_universe_id || undefined,
      tags,
      video: videoFile,
      thumbnail: thumbnailFile || undefined,
      quality: formData.quality
    };

    const result = await videoUploadService.uploadVideo(uploadData, setUploadProgress);

    if (result.success) {
      setTimeout(() => {
        onNavigate('creator-dashboard');
      }, 2000);
    } else {
      setUploadProgress({
        status: 'error',
        progress: 0,
        message: result.error || 'Erreur lors de l\'upload'
      });
    }
  };

  const isUploading = uploadProgress.status === 'uploading' || uploadProgress.status === 'processing';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={() => onNavigate('creator-dashboard')}
            disabled={isUploading}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Publier une vidéo</h1>
          <p className="text-gray-400">Partagez votre contenu avec votre communauté</p>
        </div>

        {uploadProgress.status === 'completed' && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-400">Vidéo publiée avec succès!</p>
              <p className="text-sm text-green-300">Redirection vers votre tableau de bord...</p>
            </div>
          </div>
        )}

        {uploadProgress.status === 'error' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-400">Erreur lors de l'upload</p>
              <p className="text-sm text-red-300">{uploadProgress.message}</p>
            </div>
          </div>
        )}

        {(uploadProgress.status === 'uploading' || uploadProgress.status === 'processing') && (
          <div className="mb-6 p-6 bg-primary-500/20 border border-primary-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">{uploadProgress.message}</p>
              <span className="text-primary-400 font-bold">{uploadProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.universe_id && getUniverseDetail(formData.universe_id) && (
            <UniverseDetailsPanel universe={getUniverseDetail(formData.universe_id)!} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  Informations de la vidéo
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titre de la vidéo <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      disabled={isUploading}
                      placeholder="Donnez un titre accrocheur à votre vidéo"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">{formData.title.length}/100 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      disabled={isUploading}
                      placeholder="Décrivez le contenu de votre vidéo..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                      maxLength={5000}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-400">{formData.description.length}/5000 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transcription (optionnel)
                    </label>
                    <textarea
                      value={formData.transcription}
                      onChange={(e) => setFormData({ ...formData, transcription: e.target.value })}
                      disabled={isUploading}
                      placeholder="Ajoutez la transcription complète de votre vidéo pour améliorer l'accessibilité et le référencement..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      La transcription aide les personnes malentendantes et améliore le référencement
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Univers <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.universe_id}
                        onChange={(e) => setFormData({ ...formData, universe_id: e.target.value, sub_universe_id: '' })}
                        disabled={isUploading}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 text-base"
                      >
                        <option value="">Choisir un univers...</option>
                        {universes.map((universe) => (
                          <option key={universe.id} value={universe.id}>
                            {universe.icon} {universe.name}
                          </option>
                        ))}
                      </select>
                      {errors.universe && (
                        <p className="mt-1 text-sm text-red-400">{errors.universe}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Sélectionnez l'univers qui correspond le mieux à votre contenu
                      </p>
                    </div>

                    {formData.universe_id && (
                      <div className="animate-fade-in">
                        <label className="block text-sm font-medium mb-2">
                          Sous-univers (optionnel)
                        </label>
                        <select
                          value={formData.sub_universe_id}
                          onChange={(e) => setFormData({ ...formData, sub_universe_id: e.target.value })}
                          disabled={isUploading || !formData.universe_id || subUniverses.length === 0}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          <option value="">Aucun sous-univers</option>
                          {subUniverses.map((subUniverse) => (
                            <option key={subUniverse.id} value={subUniverse.id}>
                              {subUniverse.icon} {subUniverse.name}
                            </option>
                          ))}
                        </select>
                        {subUniverses.length === 0 && formData.universe_id && (
                          <p className="mt-1 text-xs text-gray-400">
                            Aucun sous-univers disponible pour cet univers
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      disabled={isUploading}
                      placeholder="gaming, tutoriel, débutant"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Les tags aident les utilisateurs à trouver votre vidéo
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Qualité de la vidéo</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['SD', 'HD', 'FHD', '4K'] as const).map((quality) => (
                        <button
                          key={quality}
                          type="button"
                          onClick={() => setFormData({ ...formData, quality })}
                          disabled={isUploading}
                          className={`py-2 rounded-lg font-semibold transition-colors ${
                            formData.quality === quality
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-800 hover:bg-gray-700'
                          } disabled:opacity-50`}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary-400" />
                  Fichier vidéo
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vidéo <span className="text-red-400">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                      {videoPreview ? (
                        <div className="relative">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full rounded-lg mb-3"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVideoFile(null);
                              setVideoPreview('');
                            }}
                            disabled={isUploading}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          {videoFile && (
                            <div className="text-sm text-gray-400">
                              <p>{videoFile.name}</p>
                              <p>{videoUploadService.formatFileSize(videoFile.size)}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            disabled={isUploading}
                            className="hidden"
                            id="video-upload"
                          />
                          <label
                            htmlFor="video-upload"
                            className="cursor-pointer text-primary-400 hover:text-primary-300"
                          >
                            Cliquez pour sélectionner une vidéo
                          </label>
                          <p className="text-xs text-gray-400 mt-2">
                            MP4, WebM ou MOV • Max 2GB
                          </p>
                        </>
                      )}
                    </div>
                    {errors.video && (
                      <p className="mt-2 text-sm text-red-400">{errors.video}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Image className="w-4 h-4 inline mr-1" />
                      Miniature (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-primary-500 transition-colors">
                      {thumbnailPreview ? (
                        <div className="relative">
                          <img
                            src={thumbnailPreview}
                            alt="Miniature"
                            className="w-full rounded-lg mb-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnailFile(null);
                              setThumbnailPreview('');
                            }}
                            disabled={isUploading}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailFileChange}
                            disabled={isUploading}
                            className="hidden"
                            id="thumbnail-upload"
                          />
                          <label
                            htmlFor="thumbnail-upload"
                            className="cursor-pointer text-sm text-primary-400 hover:text-primary-300"
                          >
                            Ajouter une miniature
                          </label>
                          <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG ou WebP • Max 5MB
                          </p>
                        </>
                      )}
                    </div>
                    {errors.thumbnail && (
                      <p className="mt-2 text-sm text-red-400">{errors.thumbnail}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading || uploadProgress.status === 'completed'}
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Publier la vidéo
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
