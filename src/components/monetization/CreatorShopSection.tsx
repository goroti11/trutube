import { useState, useEffect } from 'react';
import { ShoppingBag, ExternalLink,  } from 'lucide-react';
import { merchandisingService, MerchandiseProduct } from '../../services/merchandisingService';

interface CreatorShopSectionProps {
  creatorId: string;
  onProductClick?: (productId: string) => void;
}

export default function CreatorShopSection({ creatorId, onProductClick }: CreatorShopSectionProps) {
  const [products, setProducts] = useState<MerchandiseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [creatorId]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await merchandisingService.getActiveProducts(creatorId);
    setProducts(data.slice(0, 6));
    setLoading(false);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-green-400" />
          Boutique du créateur
        </h3>
        <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
          Voir tout
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick?.(product.id)}
            className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 ring-green-400 transition-all group"
          >
            <div className="aspect-square bg-gray-800 relative overflow-hidden">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gray-600" />
                </div>
              )}
              {product.is_featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  POPULAIRE
                </div>
              )}
            </div>

            <div className="p-3 text-left">
              <h4 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h4>
              <p className="text-lg font-bold text-green-400">
                {formatPrice(product.base_price, product.currency)}
              </p>
              {product.total_sales > 0 && (
                <p className="text-xs text-gray-400 mt-1">{product.total_sales} vendus</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
