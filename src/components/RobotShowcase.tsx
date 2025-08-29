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
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrolled / scrollHeight;
      
      // Simple calculation: divide scroll into equal sections for each robot
      const robotIndex = Math.floor(progress * robots.length);
      const clampedIndex = Math.min(robotIndex, robots.length - 1);
      setCurrentRobot(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate how far the current robot should be scrolled up
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  const totalProgress = scrolled / scrollHeight;
  
  // Progress within current robot section (0 to 1)
  const robotSectionProgress = (totalProgress * robots.length) % 1;
  
  // Robot moves from bottom (0) to completely off top (100% + extra to ensure it's gone)
  const robotTranslateY = robotSectionProgress * 150; // 150% ensures it goes completely off screen

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10" style={{ top: '-40vh' }}>
      <div className="relative overflow-hidden bg-background" style={{ width: '200vw', height: '200vh' }}>
        <div
          className="absolute bottom-0 w-full h-full transition-none bg-background"
          style={{
            transform: `translateY(-${robotTranslateY}%)`,
          }}
        >
          <img
            src={robots[currentRobot].image}
            alt={robots[currentRobot].name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}