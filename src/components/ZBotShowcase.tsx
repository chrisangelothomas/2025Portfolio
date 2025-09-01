import { useEffect, useState } from 'react';

export default function ZBotShowcase() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div
        className="flex flex-col items-center"
        style={{
          transform: `translateY(${200 - scrollY * 0.5}px)`, // Start with 50% visible
        }}
      >
        <img
          src="/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png"
          alt="Z-Bot"
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}