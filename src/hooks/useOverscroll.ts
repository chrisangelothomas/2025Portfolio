import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface OverscrollConfig {
  threshold: number; // percentage of viewport height
  nextRoute?: string;
  prevRoute?: string;
}

export function useOverscroll(config: OverscrollConfig) {
  const navigate = useNavigate();
  const location = useLocation();
  const [overscrollY, setOverscrollY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rafRef = useRef<number>();
  
  const maxOverscroll = window.innerHeight * (config.threshold / 100);
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let velocity = 0;
    const springStrength = 0.1;
    const damping = 0.8;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate velocity
      velocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      // Check for overscroll conditions
      if (currentScrollY <= 0) {
        // Overscroll at top
        const overscroll = Math.abs(currentScrollY);
        setOverscrollY(-overscroll);
        
        if (overscroll > maxOverscroll && config.prevRoute && !isTransitioning) {
          setIsTransitioning(true);
          navigate(config.prevRoute);
        }
      } else if (currentScrollY >= maxScroll) {
        // Overscroll at bottom
        const overscroll = currentScrollY - maxScroll;
        setOverscrollY(overscroll);
        
        if (overscroll > maxOverscroll && config.nextRoute && !isTransitioning) {
          setIsTransitioning(true);
          navigate(config.nextRoute);
        }
      } else {
        setOverscrollY(0);
      }
    };
    
    const animate = () => {
      if (overscrollY !== 0) {
        // Apply spring physics to body transform
        const springForce = -overscrollY * springStrength;
        const dampedVelocity = velocity * damping;
        
        document.body.style.transform = `translateY(${Math.max(-50, Math.min(50, overscrollY * 0.5))}px)`;
        document.body.style.transition = 'transform 0.1s ease-out';
      } else {
        document.body.style.transform = 'translateY(0px)';
        document.body.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    animate();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.body.style.transform = 'translateY(0px)';
      document.body.style.transition = '';
    };
  }, [config, overscrollY, maxOverscroll, isTransitioning, navigate]);
  
  // Reset transitioning state when location changes
  useEffect(() => {
    setIsTransitioning(false);
    setOverscrollY(0);
  }, [location.pathname]);
  
  return { overscrollY, isTransitioning };
}