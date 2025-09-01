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
  const isCharged = progress >= 1;

  return (
    <div className={`fixed z-50 left-1/2 transform -translate-x-1/2 ${
      direction === 'down' ? 'bottom-8' : 'top-8'
    } transition-all duration-300`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Circular Progress Indicator */}
        <div className="relative w-16 h-16">
          {/* Background Circle */}
          <div className="w-16 h-16 rounded-full border-2 border-border/30"></div>
          
          {/* Progress Circle */}
          <svg 
            className="absolute top-0 left-0 w-16 h-16 -rotate-90 transition-all duration-200"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${clampedProgress * 188.4} 188.4`}
              className={`transition-all duration-200 ${isCharged ? 'animate-pulse' : ''}`}
              style={{
                filter: isCharged ? 'drop-shadow(0 0 8px hsl(var(--primary)))' : 'none'
              }}
            />
          </svg>

          {/* Center Icon/Arrow */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            isCharged ? 'scale-110' : 'scale-100'
          }`}>
            <div className={`w-3 h-3 border-2 border-primary rounded-sm transform transition-all duration-200 ${
              direction === 'down' ? 'rotate-45 border-t-0 border-l-0' : '-rotate-45 border-b-0 border-r-0'
            } ${isCharged ? 'animate-bounce' : ''}`}>
            </div>
          </div>
        </div>

        {/* Text Label */}
        <p className={`text-xs font-geometric transition-all duration-200 ${
          isCharged ? 'text-primary font-medium scale-105' : 'text-muted-foreground'
        }`}>
          {isCharged 
            ? (direction === 'down' ? 'Release to continue' : 'Release to go back')
            : (direction === 'down' ? 'Pull to next' : 'Pull to previous')
          }
        </p>
      </div>
    </div>
  );
}