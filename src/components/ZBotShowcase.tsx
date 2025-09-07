import { useEffect, useState } from 'react';
import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';
import { useLocation } from 'react-router-dom';

export default function ZBotShowcase() {
  const { virtualScrollY } = useOverscrollNavigation({
    prevPage: '/',
    threshold: 30
  });
  
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(true);

  // Simple slide up + fade in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsPageTransitioning(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div
        className={`flex flex-col items-center transition-all duration-500 ease-out ${
          isPageTransitioning ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{
          transform: `translateY(${50 - virtualScrollY * 0.1}vh)`,
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