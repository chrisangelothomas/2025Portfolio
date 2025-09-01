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
      direction === 'down' ? 'bottom-12' : 'top-12'
    } transition-opacity duration-200`}
    style={{ opacity }}>
      <div className="flex flex-col items-center space-y-2">
        {/* Minimal progress bar */}
        <div className="w-16 h-1 bg-border/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-100 ease-out"
            style={{ width: `${clampedProgress * 100}%` }}
          />
        </div>
        
        {/* Simple arrow indicator */}
        <div className={`w-2 h-2 border border-primary rounded-full transition-all duration-200 ${
          progress >= 1 ? 'bg-primary scale-125' : 'bg-transparent'
        }`} />
      </div>
    </div>
  );
}