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
  const [virtualScrollY, setVirtualScrollY] = useState(0); // Continuous scroll including overscroll
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
    setVirtualScrollY(currentScroll); // Update virtual scroll with actual scroll
    
    // Only detect boundaries when we actually have navigation pages
    const nearBoundaryThreshold = 1; // Smaller buffer to avoid interference
    const atBottom = nextPage && currentScroll >= maxScroll - nearBoundaryThreshold;
    const atTop = prevPage && currentScroll <= nearBoundaryThreshold;
    
    isAtBoundaryRef.current = atBottom || atTop;
    
    // Only handle overscroll if we're at a boundary AND have a corresponding page
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
    if (isTransitioning) return;

    const currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Only detect boundaries when we have corresponding navigation pages
    const nearBoundaryThreshold = 1; // Small buffer
    const atBottom = nextPage && currentScroll >= maxScroll - nearBoundaryThreshold;
    const atTop = prevPage && currentScroll <= nearBoundaryThreshold;
    
    // Also check if we would go past boundary with this scroll
    const wouldExceedBottom = currentScroll + e.deltaY >= maxScroll && e.deltaY > 0;
    const wouldExceedTop = currentScroll + e.deltaY <= 0 && e.deltaY < 0;

    // Check if trying to scroll beyond boundaries (current or anticipated)
    const tryingToScrollDown = (e.deltaY > 0 && (atBottom || wouldExceedBottom)) && nextPage;
    const tryingToScrollUp = (e.deltaY < 0 && (atTop || wouldExceedTop)) && prevPage;

    if (tryingToScrollDown || tryingToScrollUp) {
      e.preventDefault();
      
      setIsOverscrolling(true);
      
      // Immediately accumulate and update overscroll for real-time feedback
      accumulatedOverscrollRef.current += Math.abs(e.deltaY) * 0.3;
      const newAmount = accumulatedOverscrollRef.current;
      
      // Force immediate state update - this is key for responsive progress bar
      setOverscrollAmount(newAmount);
      
      // Continue virtual scroll movement for smooth robot animation
      const virtualScrollDelta = Math.abs(e.deltaY) * 0.15;
      if (tryingToScrollDown) {
        setVirtualScrollY(prev => prev + virtualScrollDelta);
      } else if (tryingToScrollUp) {
        setVirtualScrollY(prev => Math.max(0, prev - virtualScrollDelta));
      }
      
      // Check if exceeded threshold for navigation
      if (newAmount > thresholdPx && !isTransitioning) {
        setIsTransitioning(true);
        const targetPage = tryingToScrollDown ? nextPage : prevPage;
        
        setTimeout(() => {
          navigate(targetPage!);
          
          // Reset states immediately for smoother transition
          setIsTransitioning(false);
          setOverscrollAmount(0);
          setIsOverscrolling(false);
          accumulatedOverscrollRef.current = 0;
        }, 200);
      }
    }
  }, [navigate, nextPage, prevPage, thresholdPx, isTransitioning]);

  // Simple spring back - only when user stops scrolling
  useEffect(() => {
    if (isOverscrolling && overscrollAmount > 0 && !isTransitioning) {
      // Only spring back after a delay to avoid interfering with active scrolling
      const timer = setTimeout(() => {
        const springBack = () => {
          setOverscrollAmount(prev => {
            const newAmount = prev * 0.85; // Simple decay
            accumulatedOverscrollRef.current = newAmount;
            
            if (newAmount < 2) {
              setIsOverscrolling(false);
              accumulatedOverscrollRef.current = 0;
              // Don't manipulate virtualScrollY - let it stay in sync with actual scroll
              return 0;
            }
            return newAmount;
          });
          
          // Don't manipulate virtualScrollY during spring back - causes scroll conflicts
        };
        
        const springTimer = setInterval(springBack, 16);
        
        // Clean up after spring back completes
        setTimeout(() => {
          clearInterval(springTimer);
        }, 500);
      }, 100); // Delay to let active scrolling finish
      
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

  // Calculate spring transform - 10% of viewport height
  const maxTransform = window.innerHeight * 0.10;
  const springTransform = isOverscrolling 
    ? Math.sin((overscrollAmount / thresholdPx) * Math.PI * 0.5) * maxTransform
    : 0;

  return {
    scrollY,
    virtualScrollY, // Continuous scroll value for smooth animations
    overscrollAmount,
    isOverscrolling,
    isTransitioning,
    springTransform,
    thresholdProgress: overscrollAmount / thresholdPx,
    isScrollingUp: prevPage && window.scrollY <= 0,
    isScrollingDown: nextPage && window.scrollY >= document.documentElement.scrollHeight - window.innerHeight
  };
};