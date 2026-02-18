import { useState } from 'react';
import { MessageSquare, Share2, ThumbsUp, Heart, Lightbulb, HelpCircle, Smile, Eye } from 'lucide-react';
import { CommunityPost } from '../../services/communityService';

interface CommunityPostCardProps {
  post: CommunityPost;
  communitySlug: string;
}

export default function CommunityPostCard({ post, communitySlug }: CommunityPostCardProps) {
  const [showReactions, setShowReactions] = useState(false);

  const getPostTypeIcon = () => {
    switch (post.post_type) {
      case 'qa':
        return <HelpCircle className="w-4 h-4" />;
      case 'poll':
        return <Lightbulb className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPostTypeLabel = () => {
    switch (post.post_type) {
      case 'text':
        return 'Discussion';
      case 'image':
        return 'Image';
      case 'video':
        return 'Vidéo';
      case 'poll':
        return 'Sondage';
      case 'thread':
        return 'Thread';
      case 'qa':
        return 'Q&A';
    }
  };

  const reactions = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-600' },
    { type: 'love', icon: Heart, label: 'Love', color: 'text-red-600' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-600' },
    { type: 'helpful', icon: HelpCircle, label: 'Helpful', color: 'text-green-600' },
    { type: 'funny', icon: Smile, label: 'Funny', color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          A
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">Anonyme</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                Épinglé
              </span>
            )}
            {getPostTypeIcon() && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {getPostTypeIcon()}
                {getPostTypeLabel()}
              </span>
            )}
          </div>

          {post.title && (
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
              {post.title}
            </h3>
          )}

          <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={post.media_urls[0]}
                alt=""
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="relative">
              <button
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{post.reaction_count}</span>
              </button>

              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 flex gap-2 z-10">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.type}
                      className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${reaction.color}`}
                      title={reaction.label}
                    >
                      <reaction.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href={`#community/${communitySlug}/post/${post.id}`}
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{post.comment_count}</span>
            </a>

            <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>{post.share_count}</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <Eye className="w-5 h-5" />
              <span>{post.view_count.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
