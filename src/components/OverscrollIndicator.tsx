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

  return (
    <div className={`fixed z-50 left-1/2 transform -translate-x-1/2 ${
      direction === 'down' ? 'bottom-8' : 'top-8'
    }`}>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-1 h-16 bg-border rounded-full overflow-hidden">
          <div 
            className="w-full bg-primary rounded-full transition-all duration-200"
            style={{ 
              height: `${Math.min(progress * 100, 100)}%`,
              marginTop: direction === 'up' ? `${100 - Math.min(progress * 100, 100)}%` : '0'
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground font-geometric">
          {direction === 'down' ? 'Pull to next' : 'Pull to previous'}
        </p>
      </div>
    </div>
  );
}