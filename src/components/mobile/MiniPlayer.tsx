import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Maximize2 } from 'lucide-react';

interface MiniPlayerProps {
  videoUrl: string;
  title: string;
  creator: string;
  thumbnailUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onMaximize: () => void;
}

export default function MiniPlayer({
  videoUrl,
  title,
  creator,
  thumbnailUrl,
  isPlaying,
  onTogglePlay,
  onClose,
  onMaximize
}: MiniPlayerProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 220 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const miniPlayerRef = useRef<HTMLDivElement>(null);

  const snapToCorner = (x: number, y: number) => {
    const width = 160;
    const height = 90;
    const padding = 16;
    const bottomOffset = 80;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const snapLeft = x < windowWidth / 2 ? padding : windowWidth - width - padding;
    const snapTop = Math.max(padding, Math.min(y, windowHeight - height - bottomOffset));

    return { x: snapLeft, y: snapTop };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setPosition(prev => snapToCorner(prev.x, prev.y));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setPosition(prev => snapToCorner(prev.x, prev.y));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      ref={miniPlayerRef}
      className="fixed z-50 w-40 bg-[#1A1A1A] rounded-lg shadow-2xl overflow-hidden cursor-move transition-transform"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <div className="relative aspect-video bg-black">
        <video
          src={videoUrl}
          poster={thumbnailUrl}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            className="p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
          >
            {isPlaying ? (
              <Pause size={16} className="text-white" fill="white" />
            ) : (
              <Play size={16} className="text-white" fill="white" />
            )}
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-1 right-8 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
        >
          <Maximize2 size={12} className="text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-1 right-1 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
        >
          <X size={12} className="text-white" />
        </button>
      </div>
      <div className="p-2 bg-[#1A1A1A]">
        <div className="text-xs text-white font-medium truncate">{title}</div>
        <div className="text-xs text-gray-400 truncate">{creator}</div>
      </div>
    </div>
  );
}
