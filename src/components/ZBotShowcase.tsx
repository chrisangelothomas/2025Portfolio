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

  // Handle page transition animations
  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div
        className={`flex flex-col items-center ${
          isTransitioning || isPageTransitioning ? 'transition-transform duration-500 ease-out' : ''
        }`}
        style={{
          transform: `translateY(${50 - virtualScrollY * 0.1}vh) ${
            isOverscrolling ? `translateY(${isScrollingUp ? springTransform : -springTransform}px)` : ''
          } ${isPageTransitioning ? 'translateY(-20vh)' : ''}`,
        }}
      >
        <img
          src="/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png"
          alt="Z-Bot"
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}