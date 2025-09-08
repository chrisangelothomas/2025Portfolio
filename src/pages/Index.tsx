import KBotShowcase from '../components/KBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import { useCallback, useEffect, useRef, useState } from 'react';

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
            <ProfileSection />
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
      {showGrid && (
        <div className="fixed inset-0 z-30 pointer-events-none" style={{ padding: '40px' }}>
          <div className="grid grid-cols-12 gap-6 h-full">
            {Array.from({ length: 12 }, (_, i) => (
              <div 
                key={i} 
                className="bg-red-500" 
                style={{ opacity: 0.1 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Moving Content (images only) */}
      <div className="relative z-10"
        style={{
          transform: `translateY(${entering ? 24 : 0}px)`,
          opacity: entering ? 0 : 1,
          transition: 'transform 300ms ease, opacity 300ms ease',
          willChange: 'transform, opacity',
        }}
      >
        <div
          style={{
            transform: `translateY(${-overscrollPx}px)`,
            transition: isAnimating ? 'transform 250ms ease-out' : 'transform 0ms',
            willChange: 'transform',
          }}
        >
          <KBotShowcase />
          <div className="h-[10vh]"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
