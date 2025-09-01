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
  const location = useLocation();
  const maxScrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const velocityRef = useRef(0);
  
  const thresholdPx = (threshold / 100) * window.innerHeight;

  const handleScroll = useCallback(() => {
    if (isTransitioning) return;

    const currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate velocity for momentum
    velocityRef.current = currentScroll - lastScrollRef.current;
    lastScrollRef.current = currentScroll;
    
    setScrollY(currentScroll);
    maxScrollRef.current = maxScroll;

    // Check if at bottom and trying to scroll further down
    if (currentScroll >= maxScroll && velocityRef.current > 0 && nextPage) {
      setIsOverscrolling(true);
      
      // Prevent default scroll behavior
      const overscroll = velocityRef.current * 3; // Amplify the effect
      setOverscrollAmount(prev => {
        const newAmount = Math.min(prev + overscroll, thresholdPx * 1.5);
        
        // If exceeded threshold, navigate to next page
        if (newAmount > thresholdPx && !isTransitioning) {
          setIsTransitioning(true);
          setTimeout(() => {
            navigate(nextPage);
            // Reset state after navigation
            setTimeout(() => {
              setIsTransitioning(false);
              setOverscrollAmount(0);
              setIsOverscrolling(false);
              window.scrollTo(0, 0);
            }, 100);
          }, 200);
        }
        
        return newAmount;
      });
    }
    // Check if at top and trying to scroll further up
    else if (currentScroll <= 0 && velocityRef.current < 0 && prevPage) {
      setIsOverscrolling(true);
      
      const overscroll = Math.abs(velocityRef.current) * 3;
      setOverscrollAmount(prev => {
        const newAmount = Math.min(prev + overscroll, thresholdPx * 1.5);
        
        if (newAmount > thresholdPx && !isTransitioning) {
          setIsTransitioning(true);
          setTimeout(() => {
            navigate(prevPage);
            setTimeout(() => {
              setIsTransitioning(false);
              setOverscrollAmount(0);
              setIsOverscrolling(false);
              // Scroll to bottom of previous page
              window.scrollTo(0, document.documentElement.scrollHeight);
            }, 100);
          }, 200);
        }
        
        return newAmount;
      });
    }
    else {
      // Spring back effect when not overscrolling
      if (isOverscrolling && overscrollAmount > 0) {
        setOverscrollAmount(prev => Math.max(0, prev * 0.85)); // Spring back
        if (overscrollAmount < 1) {
          setIsOverscrolling(false);
          setOverscrollAmount(0);
        }
      }
    }
  }, [navigate, nextPage, prevPage, thresholdPx, isTransitioning, isOverscrolling, overscrollAmount]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: false });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Calculate spring transform based on overscroll
  const springTransform = isOverscrolling 
    ? Math.sin((overscrollAmount / thresholdPx) * Math.PI * 0.5) * 20 
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