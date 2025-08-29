import { useEffect, useState } from 'react';
import zBotImage from '../assets/z-bot.png';
import pBotImage from '../assets/p-bot.png';
import prismaxImage from '../assets/prismax.png';

const robots = [
  { name: 'K-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Advanced humanoid platform' },
  { name: 'Z-Bot', image: zBotImage, description: 'Compact tactical unit' },
  { name: 'P-Bot', image: pBotImage, description: 'Precision assembly robot' },
  { name: 'PrismaX', image: prismaxImage, description: 'Luxury service android' },
];

export default function RobotShowcase() {
  const [currentRobot, setCurrentRobot] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrolled / scrollHeight;
      
      setScrollProgress(progress);
      
      // Calculate which robot should be displayed based on scroll with smoother transitions
      const sectionProgress = progress * robots.length;
      const robotIndex = Math.floor(sectionProgress);
      const clampedIndex = Math.min(robotIndex, robots.length - 1);
      
      // Only update if we've crossed a threshold for smoother snapping
      const threshold = 0.1; // 10% into each section
      const sectionOffset = sectionProgress - robotIndex;
      
      if (sectionOffset > threshold || robotIndex === 0) {
        setCurrentRobot(clampedIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate robot reveal and transition progress
  const sectionProgress = (scrollProgress * robots.length) % 1;
  const revealHeight = Math.min(sectionProgress * 1.5, 1); // Robot moves up faster
  const nextRobotProgress = Math.max(0, (sectionProgress - 0.7) * 3.33); // Next robot starts appearing at 70% through section

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10" style={{ top: '-10vh' }}>
      <div className="relative w-[96vw] h-[96vh] overflow-hidden bg-background">
        {robots.map((robot, index) => {
          const isCurrentRobot = index === currentRobot;
          const isNextRobot = index === currentRobot + 1;
          
          return (
            <div key={robot.name}>
              {/* Current Robot */}
              {isCurrentRobot && (
                <div className="absolute inset-0">
                  <div
                    className="absolute bottom-0 w-full h-full transition-transform duration-300 ease-out bg-background"
                    style={{
                      transform: `translateY(${(1 - revealHeight) * 40}%)`,
                    }}
                  >
                    <img
                      src={robot.image}
                      alt={robot.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 0 40px rgba(0, 255, 255, 0.3))',
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Next Robot sliding up from below */}
              {isNextRobot && nextRobotProgress > 0 && (
                <div className="absolute inset-0">
                  <div
                    className="absolute bottom-0 w-full h-full transition-transform duration-300 ease-out bg-background"
                    style={{
                      transform: `translateY(${100 - (nextRobotProgress * 100)}%)`,
                    }}
                  >
                    <img
                      src={robot.image}
                      alt={robot.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{
                        filter: 'drop-shadow(0 0 40px rgba(0, 255, 255, 0.3))',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}