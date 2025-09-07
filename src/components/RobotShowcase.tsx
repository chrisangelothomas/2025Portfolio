import { useEffect, useState } from 'react';
import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';
import { useLocation } from 'react-router-dom';

export default function RobotShowcase() {
  const { virtualScrollY } = useOverscrollNavigation({
    nextPage: '/zbot',
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
          src="/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png"
          alt="K-Bot"
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}