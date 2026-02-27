import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Plus, Settings, Sparkles, Clock, Globe } from 'lucide-react';
import { socialService, type SocialPost } from '../services/socialService';
import { useAuth } from '../contexts/AuthContext';

export default function SocialFeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedMode, setFeedMode] = useState<'chronological' | 'intelligent' | 'universe_only'>('intelligent');
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [feedMode]);

  const loadFeed = async () => {
    try {
      const data = await socialService.getFeed(user?.id, feedMode);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      await socialService.likePost(postId, user.id);
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const getFeedModeInfo = () => {
    switch (feedMode) {
      case 'chronological':
        return {
          icon: Clock,
          title: 'Latest',
          description: 'Chronological order, pure and transparent'
        };
      case 'intelligent':
        return {
          icon: Sparkles,
          title: 'For You',
          description: '3-layer algorithm: Followed → Universe → Discovery'
        };
      case 'universe_only':
        return {
          icon: Globe,
          title: 'Universe',
          description: 'Content from your selected universes only'
        };
    }
  };

  const modeInfo = getFeedModeInfo();
  const ModeIcon = modeInfo.icon;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Goroti Community</h1>
            {user && (
              <button
                onClick={() => setShowPreferences(true)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <ModeIcon className="w-5 h-5 text-cyan-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-cyan-400">{modeInfo.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{modeInfo.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setFeedMode('chronological')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  feedMode === 'chronological'
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Latest
              </button>
              <button
                onClick={() => setFeedMode('intelligent')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  feedMode === 'intelligent'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />
                For You
              </button>
              <button
                onClick={() => setFeedMode('universe_only')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  feedMode === 'universe_only'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Universe
              </button>
            </div>

            {user && (
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Post</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={post.profiles?.avatar_url || '/default-avatar.png'}
                      alt={post.profiles?.username}
                      className="w-10 h-10 rounded-full ring-2 ring-gray-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">{post.profiles?.username}</p>
                        {post.profiles?.is_verified && (
                          <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {post.is_official_announcement && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400 font-bold text-sm">
                          {post.announcement_type === 'album' && '🎵 Album Announcement'}
                          {post.announcement_type === 'live' && '🎥 Live Event'}
                          {post.announcement_type === 'merch' && '🛍️ Merch Drop'}
                          {post.announcement_type === 'collaboration' && '🤝 Collaboration'}
                          {!post.announcement_type && '📢 Official Announcement'}
                        </span>
                      </div>
                    </div>
                  )}

                  {post.caption && (
                    <p className="mb-4 text-gray-200 leading-relaxed">{post.caption}</p>
                  )}

                  {post.content?.url && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-black">
                      {post.post_type === 'image' && (
                        <img
                          src={post.content.url}
                          alt="Post content"
                          className="w-full"
                        />
                      )}
                      {post.post_type === 'video' && (
                        <video
                          src={post.content.url}
                          controls
                          className="w-full"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                      <Heart className="w-5 h-5 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
                      <span className="text-sm font-medium">{post.likes_count}</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors group">
                      <MessageCircle className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm font-medium">{post.comments_count}</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors group">
                      <Share2 className="w-5 h-5 group-hover:text-green-400 transition-colors" />
                      <span className="text-sm font-medium">{post.shares_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <ImageIcon className="w-20 h-20 mx-auto mb-6 opacity-30" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-sm">
                  {feedMode === 'intelligent' && "Follow creators to see their posts in your feed"}
                  {feedMode === 'chronological' && "No recent posts available"}
                  {feedMode === 'universe_only' && "Select universes to see content"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
