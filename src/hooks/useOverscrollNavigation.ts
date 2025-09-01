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
      
      // Progressive resistance - the closer to threshold, the more resistance
      const currentProgress = accumulatedOverscrollRef.current / thresholdPx;
      const resistance = Math.max(0.1, 1 - Math.pow(currentProgress, 1.5)); // Exponential resistance
      
      accumulatedOverscrollRef.current += Math.abs(e.deltaY) * 0.5 * resistance;
      const newAmount = Math.min(accumulatedOverscrollRef.current, thresholdPx * 1.5); // Allow 50% overshoot
      
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

  // Spring back animation
  useEffect(() => {
    if (isOverscrolling && overscrollAmount > 0 && !isTransitioning) {
      const springBack = () => {
        setOverscrollAmount(prev => {
          const newAmount = prev * 0.9; // Spring back
          accumulatedOverscrollRef.current = newAmount;
          
          if (newAmount < 1) {
            setIsOverscrolling(false);
            accumulatedOverscrollRef.current = 0;
            return 0;
          }
          return newAmount;
        });
      };
      
      const timer = setTimeout(springBack, 16); // 60fps
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