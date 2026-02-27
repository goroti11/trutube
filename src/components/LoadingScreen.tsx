import AnimatedLogo from './AnimatedLogo';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative">
        <AnimatedLogo size="lg" />
      </div>
    </div>
  );
};
