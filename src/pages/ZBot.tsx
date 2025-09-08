import ZBotShowcase from '../components/ZBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import { useCallback, useEffect, useRef, useState } from 'react';

const ZBot = () => {
  // Minimal overscroll-up interaction to transition back to K-Bot
  const [overscrollPx, setOverscrollPx] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [entering, setEntering] = useState(true);
  const [condensed, setCondensed] = useState(true);
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
        requestAnimationFrame(() => {
          setOverscrollPx(window.innerHeight); // slide full screen height
          setTimeout(() => {
            window.location.assign('/');
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

  // Collapse profile when user starts scrolling normally on this page
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 0);
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
          <div className="absolute inset-0 flex items-center transition-all duration-300" style={{ opacity: condensed ? 0 : 1, transform: condensed ? 'translateY(-12px)' : 'translateY(0)' }}>
            <ProfileSection condensed={false} />
          </div>
          {/* Condensed header at top-left with More... */}
          <div className="absolute top-16 left-0 transition-all duration-300" style={{ opacity: condensed ? 1 : 0, transform: condensed ? 'translateY(0)' : 'translateY(12px)' }}>
            <ProfileSection condensed={true} onExpand={() => setCondensed(false)} />
          </div>
          {/* Project copy centered when condensed */}
          <div className="absolute inset-0 flex items-center transition-all duration-300" style={{ opacity: condensed ? 1 : 0, transform: condensed ? 'translateY(0)' : 'translateY(12px)' }}>
            <div className="space-y-1.5">
              <h2 className="font-geometric text-lg font-bold text-foreground tracking-wide leading-normal">Z-Bot</h2>
              <p className="font-geometric text-lg text-foreground leading-normal">
                Accessible and auditable general purpose humanoid robot designed for developers.
              </p>
              <p className="font-geometric text-lg text-foreground leading-normal opacity-70">
                I was the founding design engineer, industrial and product designer.
              </p>
              <button className="font-geometric text-base underline underline-offset-4 text-muted-foreground hover:text-foreground transition">Learn more...</button>
            </div>
          </div>
        </div>
        <div className="col-span-4"></div>
        <div className="col-span-4 flex justify-end items-center pointer-events-auto">
          <Navigation currentRobot={1} onRobotSelect={() => {}} />
        </div>
      </div>

      {/* Moving Content (images only) */}
      <div className="relative z-10" style={{ transform: `translateY(${entering ? 24 : 0}px)`, opacity: entering ? 0 : 1, transition: 'transform 300ms ease, opacity 300ms ease', willChange: 'transform, opacity' }}>
        <div style={{ transform: `translateY(${overscrollPx}px)`, transition: isAnimating ? 'transform 250ms ease-out' : 'transform 0ms', willChange: 'transform' }}>
          <ZBotShowcase />
          <div className="h-[30vh]"></div>
        </div>
      </div>
    </div>
  );
}

export default ZBot;


