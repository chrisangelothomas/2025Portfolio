import { useEffect, useState } from 'react';
import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';
import { useLocation } from 'react-router-dom';

export default function ZBotShowcase() {
  const { virtualScrollY, springTransform, isTransitioning, isOverscrolling, isScrollingUp } = useOverscrollNavigation({
    prevPage: '/',
    threshold: 30
  });
  
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(true);

  // Smooth page transition - Z-Bot slides up from below
  useEffect(() => {
    const timer = setTimeout(() => setIsPageTransitioning(false), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div
        className={`flex flex-col items-center ${
          isPageTransitioning ? 'transition-transform duration-800 ease-out' : (isTransitioning ? 'transition-transform duration-500 ease-out' : '')
        }`}
        style={{
          transform: isPageTransitioning 
            ? 'translateY(200vh)' 
            : `translateY(${(50 - virtualScrollY * 0.1) + (isOverscrolling ? (isScrollingUp ? springTransform * 0.01 : -springTransform * 0.01) : 0)}vh)`,
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