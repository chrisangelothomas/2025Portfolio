import { useEffect, useState } from 'react';

const robots = [
  { name: 'K-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Advanced humanoid platform' },
  { name: 'Z-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Compact tactical unit' },
];

export default function RobotShowcase() {
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
      {/* Container that moves up with scroll */}
      <div
        className="flex flex-col items-center"
        style={{
          transform: `translateY(${1900 - scrollY * 0.5}px)`, // Start 200px down so robot is visible
        }}
      >
        {/* First Robot (K-Bot) */}
        <div className="mb-32">
          <img
            src={robots[0].image}
            alt={robots[0].name}
            className="w-[200vw] h-[200vh] object-contain"
          />
        </div>
        
        {/* Second Robot (Z-Bot) */}
        <div>
          <img
            src={robots[1].image}
            alt={robots[1].name}
            className="w-[200vw] h-[200vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}