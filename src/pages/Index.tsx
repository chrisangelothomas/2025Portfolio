import KBotShowcase from '../components/KBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';

const Index = () => {
  // Minimal overscroll-down interaction to transition to Z-Bot
  const [overscrollPx, setOverscrollPx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entering, setEntering] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const springRafRef = useRef<number | null>(null);
  const overscrollRef = useRef(0);

  const thresholdPx = Math.round(window.innerHeight * 0.21); // 30% reduction from 0.30
  const resistance = 0.2; // smaller = more resistance
  const boundaryBuffer = 4; // px buffer to consider near bottom

  const onWheel = useCallback((e: WheelEvent) => {
    if (isAnimating) return;

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const atBottom = window.scrollY >= maxScroll - boundaryBuffer;

    if (e.deltaY > 0 && atBottom) {
      e.preventDefault();
      // accumulate with resistance
      overscrollRef.current = Math.max(0, overscrollRef.current + e.deltaY * resistance);
      setOverscrollPx(overscrollRef.current);

      if (overscrollRef.current >= thresholdPx) {
        // Trigger slide-out animation then navigate
        setIsAnimating(true);
        // Cancel any ongoing spring animation
        if (springRafRef.current) {
          cancelAnimationFrame(springRafRef.current);
          springRafRef.current = null;
        }
        setOverscrollPx(window.innerHeight); // slide full screen height
        setTimeout(() => {
          window.location.assign('/zbot');
        }, 250);
      }
    }
  }, [isAnimating, resistance, thresholdPx]);

  const [active, setActive] = useState(true);
  const { scrollY } = useScroll();

  const scrollRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log(latest);
    setActive(latest < 60);
    scrollRef.current = latest;
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => onWheel(e);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel as any);
  }, [onWheel]);

  // Smooth spring-back using requestAnimationFrame (viscous exponential decay)
  useEffect(() => {
    if (isAnimating) return;
    if (overscrollPx <= 0) return;

    if (springRafRef.current) cancelAnimationFrame(springRafRef.current);
    let lastTs = performance.now();
    const animate = (ts: number) => {
      const dt = Math.max(0, Math.min(32, ts - lastTs));
      lastTs = ts;
      const decayPerMs = 0.006; // lower = slower decay, tune for viscosity
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

  // Fade-in + slide-up for image container on mount
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
                  justifyContent: active? "center" : "start",
                }}>
              <motion.div
                layout="position"
                key="test"
                transition={{ 
                  duration: 0.5, 
                  ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier for smoother easing
                }}
                className="text-2xl"
              >
                <ProfileSection 
                  isCollapsed={!active} 
                  onExpand={() => {
                    setActive(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              </motion.div>
            </main>
          </div>
          
          {/* Center column - Empty (columns 5-8) */}
          <div className="col-span-4"></div>
          
          {/* Right column - Navigation (columns 9-12) */}
          <div className="col-span-4 flex justify-end items-center pointer-events-auto">
            <Navigation currentRobot={0} onRobotSelect={() => {}} />
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
          animate={{ y: -overscrollPx }}
          transition={isAnimating ? { duration: 0.25, ease: "easeOut" } : { duration: 0 }}
        >
          <KBotShowcase />
          <div className="h-[10vh]"></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
