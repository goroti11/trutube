interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 'w-6 h-6', text: 'text-lg' },
  md: { icon: 'w-8 h-8', text: 'text-xl' },
  lg: { icon: 'w-12 h-12', text: 'text-3xl' },
  xl: { icon: 'w-16 h-16', text: 'text-4xl' }
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClasses.icon}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#circleGradient)"
            strokeWidth="3"
            fill="none"
            className="opacity-20"
          />

          <circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#playGradient)"
            className="drop-shadow-lg"
          />

          <path
            d="M 40 30 L 40 70 L 70 50 Z"
            fill="white"
            className="drop-shadow-md"
          />

          <path
            d="M 48 25 L 48 35"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            className="opacity-80"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent`}>
            Tru
          </span>
          <span className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent -mt-1`}>
            Tube
          </span>
        </div>
      )}
    </div>
  );
}
