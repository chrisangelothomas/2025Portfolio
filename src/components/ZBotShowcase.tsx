import { useEffect, useState } from 'react';
import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';
import { useLocation } from 'react-router-dom';

export default function ZBotShowcase() {
  const { virtualScrollY, springTransform, isTransitioning, isOverscrolling, isScrollingUp } = useOverscrollNavigation({
    prevPage: '/',
    threshold: 30
  });
  
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Page transition with initial load from top
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
      setIsInitialLoad(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Calculate combined transform values
  const getTransform = () => {
    let baseY = 50 - virtualScrollY * 0.1; // Default scroll-based position in vh
    
    // Override with initial page transition position
    if (isPageTransitioning && isInitialLoad) {
      baseY = 100; // Start from below viewport
    }
    
    // Add overscroll spring effect in pixels (convert to vh for consistency)
    const springOffset = isOverscrolling 
      ? (isScrollingUp ? springTransform : -springTransform) / window.innerHeight * 100
      : 0;
    
    return `translateY(${baseY + springOffset}vh)`;
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div
        className={`flex flex-col items-center ${
          isPageTransitioning ? 'transition-transform duration-800 ease-out' : ''
        }`}
        style={{
          transform: getTransform(),
        }}
      >
        <img
          src="/lovable-uploads/0b3292b6-1b3b-488a-8c3b-22fc5249055b.png"
          alt="Z-Bot"
          className="w-[100vw] h-[100vh] object-contain"
        />
      </div>
    </div>
  );
}