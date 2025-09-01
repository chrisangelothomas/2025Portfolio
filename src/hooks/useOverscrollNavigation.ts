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
    if (isTransitioning) return;

    const currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const atBottom = currentScroll >= maxScroll;
    const atTop = currentScroll <= 0;

    // Check if trying to scroll beyond boundaries
    const tryingToScrollDown = e.deltaY > 0 && atBottom && nextPage;
    const tryingToScrollUp = e.deltaY < 0 && atTop && prevPage;

    if (tryingToScrollDown || tryingToScrollUp) {
      e.preventDefault();
      
      setIsOverscrolling(true);
      
      // Progressive resistance with viscous feel
      const currentProgress = accumulatedOverscrollRef.current / thresholdPx;
      const baseResistance = Math.max(0.1, 1 - (currentProgress * 0.8));
      
      // Continue virtual scroll movement for smooth robot animation
      const virtualScrollDelta = Math.abs(e.deltaY) * 0.3;
      if (tryingToScrollDown) {
        setVirtualScrollY(prev => prev + virtualScrollDelta);
      } else if (tryingToScrollUp) {
        setVirtualScrollY(prev => Math.max(0, prev - virtualScrollDelta));
      }
      
      // Accumulate overscroll with viscous resistance
      accumulatedOverscrollRef.current += Math.abs(e.deltaY) * 0.4 * baseResistance;
      const newAmount = accumulatedOverscrollRef.current;
      
      setOverscrollAmount(newAmount);
      
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
          
          // Position scroll for optimal user experience
          requestAnimationFrame(() => {
            if (tryingToScrollUp) {
              // When going up, start at bottom so content can be read from top
              window.scrollTo(0, document.documentElement.scrollHeight);
            } else {
              // When going down, start at top
              window.scrollTo(0, 0);
            }
          });
        }, 200);
      }
    }
  }, [navigate, nextPage, prevPage, thresholdPx, isTransitioning]);

  // Bouncy spring back animation
  useEffect(() => {
    if (isOverscrolling && overscrollAmount > 0 && !isTransitioning) {
      const springBack = () => {
        setOverscrollAmount(prev => {
          // Bouncy spring physics
          const progress = prev / thresholdPx;
          const springForce = 0.88 + (Math.sin(progress * Math.PI * 4) * 0.02); // Add bounce
          const newAmount = prev * springForce;
          accumulatedOverscrollRef.current = newAmount;
          
          // Bounce virtual scroll back too
          setVirtualScrollY(current => {
            const currentScroll = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const atBottom = currentScroll >= maxScroll;
            const atTop = currentScroll <= 0;
            
            if (atBottom || atTop) {
              return currentScroll + (current - currentScroll) * springForce;
            }
            return current;
          });
          
          if (newAmount < 2) {
            setIsOverscrolling(false);
            accumulatedOverscrollRef.current = 0;
            // Snap virtual scroll back to actual scroll
            setVirtualScrollY(window.scrollY);
            return 0;
          }
          return newAmount;
        });
      };
      
      const timer = setTimeout(springBack, 16); // 60fps for smoother bounce
      return () => clearTimeout(timer);
    }
  }, [isOverscrolling, overscrollAmount, isTransitioning, thresholdPx]);

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