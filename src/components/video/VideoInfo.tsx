import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Eye, Hash } from 'lucide-react';

interface VideoInfoProps {
  title: string;
  description: string;
  viewCount: number;
  uploadDate: string;
  hashtags?: string[];
  transcript?: string;
}

export default function VideoInfo({
  title: _title,
  description,
  viewCount,
  uploadDate,
  hashtags = [],
  transcript
}: VideoInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{formatViews(viewCount)} vues</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(uploadDate)}</span>
          </div>
        </div>

        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {hashtags.map((tag, index) => (
              <button
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-full text-sm text-blue-400 transition-colors"
              >
                <Hash className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <p
            className={`text-gray-300 whitespace-pre-wrap ${
              !isExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {description}
          </p>

          {description.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {isExpanded ? (
                <>
                  <span>Voir moins</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Voir plus</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {transcript && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center justify-between w-full text-left group"
          >
            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
              Transcription
            </h3>
            {showTranscript ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showTranscript && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
