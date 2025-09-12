import ZBotShowcase from '@/components/ZBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';

const ZBot = () => {
  // Minimal overscroll-up interaction to transition back to K-Bot
  const [overscrollPx, setOverscrollPx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entering, setEntering] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const [isScrollingToTop, setIsScrollingToTop] = useState(false);
  const springRafRef = useRef<number | null>(null);
  const overscrollRef = useRef(0);
  const { scrollY } = useScroll();

  const thresholdPx = Math.round(window.innerHeight * 0.21); // 30% reduction from 0.30
  const resistance = 0.2; // smaller = more resistance
  const boundaryBuffer = 4; // px buffer to consider near top

  const onWheel = useCallback((e: WheelEvent) => {
    if (isAnimating || isScrollingToTop) return;

    const atTop = window.scrollY <= boundaryBuffer;

    if (e.deltaY < 0 && atTop) {
      e.preventDefault();
      overscrollRef.current = Math.max(0, overscrollRef.current + Math.abs(e.deltaY) * resistance);
      setOverscrollPx(overscrollRef.current);

      if (overscrollRef.current >= thresholdPx) {
        setIsAnimating(true);
        // Cancel any ongoing spring animation
        if (springRafRef.current) {
          cancelAnimationFrame(springRafRef.current);
          springRafRef.current = null;
        }
        setOverscrollPx(window.innerHeight); // slide full screen height
        setTimeout(() => {
          window.location.assign('/');
        }, 250);
      }
    }
  }, [isAnimating, resistance, thresholdPx, isScrollingToTop]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setActive(latest < 60);
    
    // If we're scrolling to top and reach the top (or very close), clear the flag
    if (isScrollingToTop && latest < 5) {
      setIsScrollingToTop(false);
    }
    
    // If bio is expanded and user scrolls down, collapse it
    // But don't collapse if we're currently scrolling to top
    if (bioExpanded && latest > 60 && !isScrollingToTop) {
      setBioExpanded(false);
    }
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => onWheel(e);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel as any);
  }, [onWheel]);

  useEffect(() => {
    if (isAnimating) return;
    if (overscrollPx <= 0) return;

    if (springRafRef.current) cancelAnimationFrame(springRafRef.current);
    let lastTs = performance.now();
    const animate = (ts: number) => {
      const dt = Math.max(0, Math.min(32, ts - lastTs));
      lastTs = ts;
      const decayPerMs = 0.006;
      const factor = Math.exp(-decayPerMs * dt);
      overscrollRef.current *= factor;
      if (overscrollRef.current < 0.5) {
        overscrollRef.current = 0;
        setOverscrollPx(0);
        springRafRef.current = null;
        return;
      }
      setOverscrollPx(overscrollRef.current);
      springRafRef.current = requestAnimationFrame(animate);
    };
    springRafRef.current = requestAnimationFrame(animate);
    return () => {
      if (springRafRef.current) cancelAnimationFrame(springRafRef.current);
      springRafRef.current = null;
    };
  }, [overscrollPx, isAnimating]);

  // Fade-in + slide-up on mount (opposite direction animation is handled by overscroll)
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(id);
  }, []);

  // Shift+G keybind to toggle grid visibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setShowGrid(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <div className="bg-background min-h-screen font-geometric">
      {/* 12-column grid with 40px margins and 24px gutters */}
      <div className="fixed inset-0 z-20 pointer-events-none" style={{ padding: '40px' }}>
        <div className="grid grid-cols-12 gap-6 h-full">
          {/* Left column - Profile (columns 1-4) */}
          <div className="col-span-4 flex items-center pointer-events-auto">
            <main className="flex h-full flex-col gap-[32px] row-start-2" style={{
                  justifyContent: (bioExpanded && active) ? "center" : "start",
                }}>
              <motion.div
                layout="position"
                key="zbot-profile"
                transition={{ 
                  duration: 0.5, 
                  ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoother easing
                }}
                className="text-2xl"
              >
                <ProfileSection 
                  isCollapsed={!bioExpanded} 
                  onExpand={() => {
                    setBioExpanded(true);
                    setIsScrollingToTop(true);
                    
                    // Use smooth scroll and wait for completion
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Wait for scroll to complete, then clear the flag
                    const checkScrollComplete = () => {
                      if (window.scrollY <= 5) {
                        setIsScrollingToTop(false);
                      } else {
                        setTimeout(checkScrollComplete, 50);
                      }
                    };
                    
                    setTimeout(checkScrollComplete, 100);
                  }} 
                />
              </motion.div>
            </main>
          </div>
          
          {/* Center column - Empty (columns 5-8) */}
          <div className="col-span-4"></div>
          
          {/* Right column - Navigation (columns 9-12) */}
          <div className="col-span-4 flex justify-end items-center pointer-events-auto">
            <Navigation currentRobot={1} onRobotSelect={() => {}} />
          </div>
        </div>
      </div>

      {/* Grid overlay - toggled with Shift+G */}
      <AnimatePresence>
        {showGrid && (
          <motion.div 
            className="fixed inset-0 z-30 pointer-events-none" 
            style={{ padding: '40px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-12 gap-6 h-full">
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div 
                  key={i} 
                  className="bg-red-500" 
                  style={{ opacity: 0.1 }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Moving Content (images only) */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          animate={{ y: isScrollingToTop ? 0 : overscrollPx }}
          transition={isAnimating ? { duration: 0.25, ease: "easeOut" } : { duration: 0 }}
        >
          <ZBotShowcase />
          <div className="h-[30vh]"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ZBot;


