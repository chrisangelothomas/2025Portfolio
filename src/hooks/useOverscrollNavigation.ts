import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UseOverscrollNavigationProps {
  nextPage?: string;
  prevPage?: string;
  threshold?: number; // in vh units
}

export const useOverscrollNavigation = ({
  nextPage,
  prevPage,
  threshold = 30
}: UseOverscrollNavigationProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [overscrollAmount, setOverscrollAmount] = useState(0);
  const [isOverscrolling, setIsOverscrolling] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const navigate = useNavigate();
  const accumulatedOverscrollRef = useRef(0);
  const isAtBoundaryRef = useRef(false);
  const thresholdPx = (threshold / 100) * window.innerHeight;

  const handleScroll = useCallback(() => {
    if (isTransitioning) return;

    const currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    setScrollY(currentScroll);
    
    // Check if we're at boundaries
    const atBottom = currentScroll >= maxScroll;
    const atTop = currentScroll <= 0;
    
    isAtBoundaryRef.current = atBottom || atTop;
    
    // Only handle overscroll if we're at a boundary
    if (!isAtBoundaryRef.current) {
      // Reset overscroll when scrolling normally
      if (isOverscrolling) {
        setIsOverscrolling(false);
        setOverscrollAmount(0);
        accumulatedOverscrollRef.current = 0;
        document.body.style.transform = ''; // Reset page transform
      }
      return;
    }
  }, [isTransitioning, isOverscrolling]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isTransitioning || !isAtBoundaryRef.current) return;

    const currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const atBottom = currentScroll >= maxScroll;
    const atTop = currentScroll <= 0;

    // Check if trying to scroll beyond boundaries
    const tryingToScrollDown = e.deltaY > 0 && atBottom && nextPage;
    const tryingToScrollUp = e.deltaY < 0 && atTop && prevPage;

    if (tryingToScrollDown || tryingToScrollUp) {
      e.preventDefault(); // Only prevent default when overscrolling
      
      setIsOverscrolling(true);
      
      // Progressive resistance - smoother calculation
      const currentProgress = accumulatedOverscrollRef.current / thresholdPx;
      const resistance = Math.max(0.2, 1 - (currentProgress * 0.7)); // Gentler resistance curve
      
      accumulatedOverscrollRef.current += Math.abs(e.deltaY) * 0.3 * resistance;
      const newAmount = accumulatedOverscrollRef.current;
      
      // Create viscous page movement by transforming the body
      const scrollMovement = Math.min(currentProgress * 30, 15); // Max 15px movement
      if (tryingToScrollDown) {
        document.body.style.transform = `translateY(-${scrollMovement}px)`;
      } else if (tryingToScrollUp) {
        document.body.style.transform = `translateY(${scrollMovement}px)`;
      }
      
      setOverscrollAmount(newAmount);
      
      // Check if exceeded threshold for navigation
      if (newAmount > thresholdPx && !isTransitioning) {
        setIsTransitioning(true);
        const targetPage = tryingToScrollDown ? nextPage : prevPage;
        
        setTimeout(() => {
          navigate(targetPage!);
          setTimeout(() => {
            setIsTransitioning(false);
            setOverscrollAmount(0);
            setIsOverscrolling(false);
            accumulatedOverscrollRef.current = 0;
            document.body.style.transform = ''; // Reset page transform
            
            if (tryingToScrollUp) {
              // Scroll to bottom of previous page
              requestAnimationFrame(() => {
                window.scrollTo(0, document.documentElement.scrollHeight);
              });
            } else {
              window.scrollTo(0, 0);
            }
          }, 100);
        }, 300);
      }
    }
  }, [navigate, nextPage, prevPage, thresholdPx, isTransitioning]);

  // Smoother spring back animation with less frequent updates
  useEffect(() => {
    if (isOverscrolling && overscrollAmount > 0 && !isTransitioning) {
      const springBack = () => {
        setOverscrollAmount(prev => {
          const newAmount = prev * 0.85; // Faster spring back
          accumulatedOverscrollRef.current = newAmount;
          
          if (newAmount < 2) {
            setIsOverscrolling(false);
            accumulatedOverscrollRef.current = 0;
            document.body.style.transform = ''; // Reset page transform
            return 0;
          }
          return newAmount;
        });
      };
      
      const timer = setTimeout(springBack, 32); // 30fps instead of 60fps
      return () => clearTimeout(timer);
    }
  }, [isOverscrolling, overscrollAmount, isTransitioning]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleScroll, handleWheel]);

  // Calculate spring transform
  const springTransform = isOverscrolling 
    ? Math.sin((overscrollAmount / thresholdPx) * Math.PI * 0.5) * 15 
    : 0;

  return {
    scrollY,
    overscrollAmount,
    isOverscrolling,
    isTransitioning,
    springTransform,
    thresholdProgress: overscrollAmount / thresholdPx
  };
};