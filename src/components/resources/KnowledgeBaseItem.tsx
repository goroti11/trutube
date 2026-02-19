import { useState } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { KnowledgeBase } from '../../services/resourceService';

interface KnowledgeBaseItemProps {
  item: KnowledgeBase;
}

export default function KnowledgeBaseItem({ item }: KnowledgeBaseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-900 transition-colors text-left"
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-white font-medium mb-1">{item.question}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-0.5 bg-gray-800 rounded">{item.category}</span>
            {item.keywords.length > 0 && (
              <>
                {item.keywords.slice(0, 3).map(keyword => (
                  <span key={keyword} className="text-gray-600">#{keyword}</span>
                ))}
              </>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-800">
          <div className="pt-5 text-gray-300 text-sm whitespace-pre-line mb-4">
            {item.answer}
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
            <span className="text-xs text-gray-500">Cette réponse est-elle utile ?</span>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-green-600/20 rounded-lg text-xs text-gray-400 hover:text-green-400 transition-colors">
              <ThumbsUp className="w-3 h-3" />
              Oui ({item.helpful_count})
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-red-600/20 rounded-lg text-xs text-gray-400 hover:text-red-400 transition-colors">
              <ThumbsDown className="w-3 h-3" />
              Non ({item.not_helpful_count})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
