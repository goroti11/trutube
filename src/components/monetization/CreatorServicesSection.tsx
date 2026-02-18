import { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Video } from 'lucide-react';
import { digitalProductsService, Service } from '../../services/digitalProductsService';

interface CreatorServicesSectionProps {
  creatorId: string;
  onServiceClick?: (serviceId: string) => void;
}

export default function CreatorServicesSection({ creatorId, onServiceClick }: CreatorServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [creatorId]);

  const loadServices = async () => {
    setLoading(true);
    const data = await digitalProductsService.getActiveServices(creatorId);
    setServices(data.slice(0, 3));
    setLoading(false);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getServiceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      consultation: 'Consultation',
      coaching: 'Coaching',
      mentoring: 'Mentorat',
      review: 'Review / Feedback',
      custom: 'Service personnalisé',
    };

    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Calendar className="w-6 h-6 text-blue-400" />
        Services & Consultations
      </h3>

      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceClick?.(service.id)}
            className="w-full bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-all group text-left border border-gray-800 hover:border-blue-500"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-medium">
                    {getServiceTypeLabel(service.service_type)}
                  </span>
                  {service.requires_approval && (
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-medium">
                      Sur demande
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h4>

                {service.description && (
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    Visio
                  </span>
                  {service.average_rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {service.average_rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400 mb-1">
                  {formatPrice(service.price, service.currency)}
                </p>
                {service.total_bookings > 0 && (
                  <p className="text-xs text-gray-400">
                    {service.total_bookings} séances
                  </p>
                )}
              </div>
            </div>

            {service.booking_instructions && (
              <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300">
                <p className="line-clamp-2">{service.booking_instructions}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
        Réserver une session
      </button>
    </div>
  );
}
