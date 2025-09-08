import ZBotShowcase from '@/components/ZBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import { useCallback, useEffect, useRef, useState } from 'react';

const ZBot = () => {
  // Minimal overscroll-up interaction to transition back to K-Bot
  const [overscrollPx, setOverscrollPx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entering, setEntering] = useState(true);
  const overscrollRef = useRef(0);

  const thresholdPx = Math.round(window.innerHeight * 0.30);
  const resistance = 0.2; // smaller = more resistance
  const boundaryBuffer = 4; // px buffer to consider near top

  const onWheel = useCallback((e: WheelEvent) => {
    if (isAnimating) return;

    const atTop = window.scrollY <= boundaryBuffer;

    if (e.deltaY < 0 && atTop) {
      e.preventDefault();
      overscrollRef.current = Math.max(0, overscrollRef.current + Math.abs(e.deltaY) * resistance);
      setOverscrollPx(overscrollRef.current);

      if (overscrollRef.current >= thresholdPx) {
        setIsAnimating(true);
        setOverscrollPx(window.innerHeight); // slide full screen height
        setTimeout(() => {
          window.location.assign('/');
        }, 250);
      }
    }
  }, [isAnimating, resistance, thresholdPx]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => onWheel(e);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel as any);
  }, [onWheel]);

  useEffect(() => {
    if (isAnimating) return;
    if (overscrollPx > 0) {
      const id = window.setInterval(() => {
        overscrollRef.current *= 0.85;
        if (overscrollRef.current < 1) {
          overscrollRef.current = 0;
          setOverscrollPx(0);
          window.clearInterval(id);
        } else {
          setOverscrollPx(overscrollRef.current);
        }
      }, 16);
      return () => window.clearInterval(id);
    }
  }, [overscrollPx, isAnimating]);

  // Fade-in + slide-up on mount (opposite direction animation is handled by overscroll)
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="bg-background min-h-screen font-geometric">
      {/* Sticky Header/Layout (fixed, not moved by transforms) */}
      <div className="fixed inset-0 grid grid-cols-12 gap-8 px-16 py-24 z-20 pointer-events-none">
        <div className="col-span-4 flex items-center pointer-events-auto">
          <ProfileSection />
        </div>
        <div className="col-span-4"></div>
        <div className="col-span-4 flex justify-end items-center pointer-events-auto">
          <Navigation currentRobot={1} onRobotSelect={() => {}} />
        </div>
      </div>

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
            transform: `translateY(${overscrollPx}px)`,
            transition: isAnimating ? 'transform 250ms ease-out' : 'transform 0ms',
            willChange: 'transform',
          }}
        >
          <ZBotShowcase />
          <div className="h-[30vh]"></div>
        </div>
      </div>
    </div>
  );
};

export default ZBot;


