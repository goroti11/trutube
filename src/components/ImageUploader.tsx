import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { imageUploadService, ImageBucket } from '../services/imageUploadService';
import { useAuth } from '../contexts/AuthContext';

interface ImageUploaderProps {
  bucket: ImageBucket;
  currentImageUrl?: string;
  onUploadComplete: (url: string) => void;
  aspectRatio?: string;
  maxSizeMB?: number;
  label: string;
  description?: string;
}

export default function ImageUploader({
  bucket,
  currentImageUrl,
  onUploadComplete,
  aspectRatio = '16/9',
  maxSizeMB = 5,
  label,
  description
}: ImageUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError(null);

    const validation = imageUploadService.validateImageFile(file, maxSizeMB);
    if (!validation.valid) {
      setError(validation.error || 'Fichier invalide');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const result = await imageUploadService.uploadImage(file, bucket, user.id);

      if (bucket === 'avatars') {
        await imageUploadService.updateProfileAvatar(user.id, result.url);
      } else if (bucket === 'banners') {
        await imageUploadService.updateProfileBanner(user.id, result.url);
      }

      onUploadComplete(result.url);
    } catch (err) {
      setError('Erreur lors de l\'upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-white font-semibold mb-2">{label}</label>
        {description && (
          <p className="text-gray-400 text-sm mb-3">{description}</p>
        )}
      </div>

      <div className="relative">
        <div
          className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-700 hover:border-red-600 transition-colors cursor-pointer"
          style={{ aspectRatio }}
          onClick={handleClick}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  disabled={uploading}
                >
                  <Upload className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  disabled={uploading}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                  <Loader className="w-8 h-8 text-red-500 animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium mb-1">Cliquez pour uploader</p>
              <p className="text-xs">JPG, PNG, WEBP, GIF (max {maxSizeMB}MB)</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {uploading && (
        <div className="p-3 bg-blue-900/50 border border-blue-600 rounded-lg">
          <p className="text-blue-300 text-sm flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Upload en cours...
          </p>
        </div>
      )}
    </div>
  );
}
