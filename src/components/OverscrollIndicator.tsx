interface OverscrollIndicatorProps {
  progress: number;
  direction: 'down' | 'up';
  isActive: boolean;
}

export default function OverscrollIndicator({ 
  progress, 
  direction, 
  isActive 
}: OverscrollIndicatorProps) {
  if (!isActive) return null;

  const clampedProgress = Math.min(progress, 1);
  const opacity = Math.min(clampedProgress * 2, 1); // Fade in as progress increases

  return (
    <div className={`fixed z-50 left-1/2 transform -translate-x-1/2 ${
      direction === 'down' ? 'bottom-8' : 'top-8'
    } transition-opacity duration-200`}
    style={{ opacity }}>
      <div className="flex flex-col items-center space-y-1">
        {/* Compact vertical progress bar */}
        <div className={`w-0.5 h-12 bg-border/30 rounded-full overflow-hidden ${
          direction === 'up' ? 'rotate-180' : ''
        }`}>
          <div 
            className="w-full bg-primary rounded-full transition-all duration-100 ease-out"
            style={{ height: `${clampedProgress * 100}%` }}
          />
        </div>
        
        {/* Small completion dot */}
        <div className={`w-1 h-1 rounded-full transition-all duration-200 ${
          progress >= 1 ? 'bg-primary' : 'bg-border/50'
        }`} />
      </div>
    </div>
  );
}