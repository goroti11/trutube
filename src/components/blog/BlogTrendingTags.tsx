import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { blogService } from '../../services/blogService';

interface BlogTrendingTagsProps {
  onTagClick: (tag: string) => void;
  selectedTag: string | null;
}

export default function BlogTrendingTags({ onTagClick, selectedTag }: BlogTrendingTagsProps) {
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const trendingTags = await blogService.getTrendingTags(8);
      setTags(trendingTags);
    } catch (error) {
      console.error('Failed to load trending tags:', error);
    }
  };

  if (tags.length === 0) return null;

  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-red-500" />
        Tags populaires
      </h3>

      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedTag === tag
                ? 'bg-red-600 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            #{tag}
            <span className="ml-1 text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
