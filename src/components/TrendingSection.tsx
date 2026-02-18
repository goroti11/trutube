import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Video } from '../types';
import VideoCard from './VideoCard';
import { useRef } from 'react';

interface TrendingSectionProps {
  title: string;
  videos: Video[];
  onVideoClick?: (video: Video) => void;
  showSeeAll?: boolean;
  variant?: 'default' | 'small';
}

export default function TrendingSection({
  title,
  videos,
  onVideoClick,
  showSeeAll = true,
  variant = 'default'
}: TrendingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {showSeeAll && (
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-sm">See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative group/section">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-all shadow-lg shadow-primary-500/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={scrollContainerRef}
          className={`flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth ${
            variant === 'default' ? 'pb-2' : ''
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <div
              key={video.id}
              className={variant === 'default' ? 'w-[280px]' : 'w-[200px]'}
            >
              <VideoCard
                video={video}
                onClick={() => onVideoClick?.(video)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-all shadow-lg shadow-primary-500/50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
