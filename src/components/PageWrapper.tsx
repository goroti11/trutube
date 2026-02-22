import { ReactNode } from 'react';
import BackButton from './BackButton';

interface PageWrapperProps {
  children: ReactNode;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBack?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export default function PageWrapper({
  children,
  showBackButton = true,
  backButtonLabel = 'Retour',
  onBack,
  title,
  description,
  className = ''
}: PageWrapperProps) {
  return (
    <div className={`min-h-screen bg-gray-950 text-white ${className}`}>
      {(showBackButton || title) && (
        <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <BackButton onClick={onBack} label={backButtonLabel} />
              )}
              {title && (
                <div>
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {description && (
                    <p className="text-sm text-gray-400 mt-1">{description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
