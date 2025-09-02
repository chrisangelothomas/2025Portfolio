import { useEffect, useState } from 'react';
import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';
import { useLocation } from 'react-router-dom';

export default function RobotShowcase() {
  const { virtualScrollY, springTransform, isTransitioning, isOverscrolling, isScrollingDown } = useOverscrollNavigation({
    nextPage: '/zbot',
    threshold: 30
  });
  
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(true);

  // Smooth page transition - K-Bot slides down from above
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
            ? 'translateY(-100vh)' 
            : `translateY(${(50 - virtualScrollY * 0.1) + (isOverscrolling ? (isScrollingDown ? springTransform * 0.01 : -springTransform * 0.01) : 0)}vh)`,
        }}
      >
        <img
          src="/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png"
          alt="K-Bot"
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}