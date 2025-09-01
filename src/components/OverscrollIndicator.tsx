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
    <div className={`fixed z-50 right-8 ${
      direction === 'down' ? 'bottom-1/2 translate-y-1/2' : 'top-1/2 -translate-y-1/2'
    } transition-opacity duration-200`}
    style={{ opacity }}>
      <div className="flex flex-col items-center">
        {/* Vertical progress bar */}
        <div className={`w-1 h-20 bg-border/30 rounded-full overflow-hidden ${
          direction === 'up' ? 'rotate-180' : ''
        }`}>
          <div 
            className="w-full bg-primary rounded-full transition-all duration-100 ease-out"
            style={{ height: `${clampedProgress * 100}%` }}
          />
        </div>
        
        {/* Direction indicator */}
        <div className={`mt-2 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
          progress >= 1 ? 'bg-primary' : 'bg-border/50'
        }`} />
      </div>
    </div>
  );
}