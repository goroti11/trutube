import { Filter } from 'lucide-react';
import { BlogCategory } from '../../services/blogService';

interface BlogCategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export default function BlogCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange
}: BlogCategoryFilterProps) {
  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-red-500" />
        Catégories
      </h3>

      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-red-600 text-white font-medium'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          Tous les articles
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
              selectedCategory === category.slug
                ? 'text-white font-medium'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
            style={{
              backgroundColor: selectedCategory === category.slug ? category.color : undefined
            }}
          >
            <span>{category.name}</span>
            {category.icon && <span className="text-lg">{category.icon}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
