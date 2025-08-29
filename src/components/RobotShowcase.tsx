import { useEffect, useState } from 'react';
import kBotImage from '../assets/k-bot.png';
import zBotImage from '../assets/z-bot.png';
import pBotImage from '../assets/p-bot.png';
import prismaxImage from '../assets/prismax.png';

const robots = [
  { name: 'K-Bot', image: kBotImage, description: 'Advanced humanoid platform' },
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
      
      // Calculate which robot should be displayed based on scroll
      const robotIndex = Math.floor(progress * robots.length);
      const clampedIndex = Math.min(robotIndex, robots.length - 1);
      setCurrentRobot(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate robot reveal progress (0-1 for each robot)
  const robotProgress = (scrollProgress * robots.length) % 1;
  const revealHeight = Math.min(robotProgress * 2, 1); // Reveal full robot by 50% scroll through each section

  return (
    <div className="fixed inset-0 flex items-end justify-center pointer-events-none z-10">
      <div className="relative w-[60vw] h-[60vh] overflow-hidden bg-background">
        {robots.map((robot, index) => (
          <div
            key={robot.name}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentRobot ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute bottom-0 w-full h-full transition-transform duration-500 ease-out bg-background"
              style={{
                transform: `translateY(${(1 - revealHeight) * 60}%)`,
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
        ))}
      </div>
    </div>
  );
}