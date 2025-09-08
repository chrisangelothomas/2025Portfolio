import KBotShowcase from '../components/KBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import { useCallback, useEffect, useRef, useState } from 'react';

const Index = () => {
  // Minimal overscroll-down interaction to transition to Z-Bot
  const [overscrollPx, setOverscrollPx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entering, setEntering] = useState(true);
  const [condensed, setCondensed] = useState(false);
  const springRafRef = useRef<number | null>(null);
  const overscrollRef = useRef(0);

  const thresholdPx = Math.round(window.innerHeight * 0.30);
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
        // Trigger slide-out animation then navigate (ensure a frame before transition)
        setIsAnimating(true);
        requestAnimationFrame(() => {
          setOverscrollPx(window.innerHeight); // slide full screen height
          setTimeout(() => {
            window.location.assign('/zbot');
          }, 300);
        });
      }
    }
  }, [isAnimating, resistance, thresholdPx]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => onWheel(e);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel as any);
  }, [onWheel]);

  // Smooth spring-back using requestAnimationFrame
  useEffect(() => {
    if (isAnimating) return;
    if (overscrollPx <= 0) return;

    if (springRafRef.current) cancelAnimationFrame(springRafRef.current);
    let lastTs = performance.now();
    const animate = (ts: number) => {
      const dt = Math.max(0, Math.min(32, ts - lastTs));
      lastTs = ts;
      // exponential decay toward 0, time-based for smoothness
      const decayPerMs = 0.005; // lower = slower decay
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

  // Collapse profile when user starts scrolling the page normally
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 0;
      setCondensed(scrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-background min-h-screen font-geometric">
      {/* Sticky Header/Layout (fixed, not moved by transforms) */}
      <div className="fixed inset-0 grid grid-cols-12 gap-8 px-16 py-16 z-20 pointer-events-none">
        <div className="col-span-4 relative h-full pointer-events-auto">
          {/* Expanded profile centered vertically */}
          <div className="absolute inset-0 flex items-center transition-all duration-300"
               style={{ opacity: condensed ? 0 : 1, transform: condensed ? 'translateY(-12px)' : 'translateY(0)' }}>
            <ProfileSection condensed={false} />
          </div>
          {/* Condensed header at top-left with More... */}
          <div className="absolute top-16 left-0 transition-all duration-300"
               style={{ opacity: condensed ? 1 : 0, transform: condensed ? 'translateY(0)' : 'translateY(12px)' }}>
            <ProfileSection condensed={true} onExpand={() => setCondensed(false)} />
          </div>
          {/* Project copy centered when condensed */}
          <div className="absolute inset-0 flex items-center transition-all duration-300"
               style={{ opacity: condensed ? 1 : 0, transform: condensed ? 'translateY(0)' : 'translateY(12px)' }}>
            <div className="space-y-1.5">
              <h2 className="font-geometric text-lg font-bold text-foreground tracking-wide leading-normal">K-Bot</h2>
              <p className="font-geometric text-lg text-foreground leading-normal">
                Accessible and auditable general purpose humanoid robot designed for developers.
              </p>
              <p className="font-geometric text-lg text-foreground leading-normal opacity-70">
                I was the founding design engineer, industrial and product designer.
              </p>
              <button className="font-geometric text-base underline underline-offset-4 text-muted-foreground hover:text-foreground transition">
                Learn more...
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-4"></div>
        <div className="col-span-4 flex justify-end items-center pointer-events-auto">
          <Navigation currentRobot={0} onRobotSelect={() => {}} />
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
