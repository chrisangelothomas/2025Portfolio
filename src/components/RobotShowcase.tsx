import { useEffect, useState } from 'react';

const robots = [
  { name: 'K-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Advanced humanoid platform' },
  { name: 'Z-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Compact tactical unit' },
  { name: 'P-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Precision assembly robot' },
  { name: 'PrismaX', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Luxury service android' },
];

export default function RobotShowcase() {
  const [currentRobot, setCurrentRobot] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Simple: each robot gets equal scroll sections
      const sectionHeight = windowHeight * 4; // Each robot visible for 4 screen heights
      const robotIndex = Math.floor(scrollY / sectionHeight);
      const clampedIndex = Math.min(Math.max(robotIndex, 0), robots.length - 1);
      
      setCurrentRobot(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="relative w-screen h-screen flex items-center justify-center">
        <img
          src={robots[currentRobot].image}
          alt={robots[currentRobot].name}
          className="max-w-[50vw] max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}