interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { img: 'h-7', text: 'text-lg' },
  md: { img: 'h-9', text: 'text-xl' },
  lg: { img: 'h-14', text: 'text-3xl' },
  xl: { img: 'h-20', text: 'text-4xl' }
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showText ? (
        <img
          src="/GOROTI.png"
          alt="GOROTI"
          className={`${sizeClasses.img} w-auto object-contain`}
        />
      ) : (
        <div className="relative">
          <svg viewBox="0 0 100 100" className={`${sizeClasses.img} w-auto`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="#dc2626" />
            <path d="M 40 30 L 40 70 L 70 50 Z" fill="white" />
          </svg>
        </div>
      )}
    </div>
  );
}
