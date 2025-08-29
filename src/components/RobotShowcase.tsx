import { useEffect, useState } from 'react';

const robots = [
  { name: 'K-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Advanced humanoid platform' },
  { name: 'Z-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Compact tactical unit' },
];

export default function RobotShowcase() {
  const [currentRobot, setCurrentRobot] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Each robot gets 3 screen heights of scroll
      const sectionHeight = windowHeight * 3;
      const robotIndex = Math.floor(scrollY / sectionHeight);
      const clampedIndex = Math.min(Math.max(robotIndex, 0), robots.length - 1);
      
      setCurrentRobot(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate scroll progress within current robot section
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const sectionHeight = windowHeight * 3;
  const sectionProgress = (scrollY % sectionHeight) / sectionHeight;
  
  // Robot moves up as you scroll (0 = bottom, 1 = top)
  const translateY = sectionProgress * 100;

  return (
    <div className="fixed inset-0 flex items-end justify-center pointer-events-none z-10">
      <div className="relative w-screen h-screen flex items-center justify-center">
        <div
          className="transition-transform duration-100 ease-linear"
          style={{
            transform: `translateY(-${translateY}%)`,
          }}
        >
          <img
            src={robots[currentRobot].image}
            alt={robots[currentRobot].name}
            className="w-[100vw] h-[100vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
}