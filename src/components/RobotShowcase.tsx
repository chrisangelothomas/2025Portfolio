import { useEffect, useState } from 'react';

const robots = [
  { name: 'K-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Advanced humanoid platform' },
  { name: 'Z-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Compact tactical unit' },
  { name: 'P-Bot', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Precision assembly robot' },
  { name: 'PrismaX', image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png', description: 'Luxury service android' },
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
  const revealHeight = Math.min(sectionProgress * 1.2, 1); // Robot moves up and off screen completely

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10" style={{ top: '-5vh' }}>
      <div className="relative overflow-hidden bg-background" style={{ width: '170vw', height: '170vh' }}>
        {robots.map((robot, index) => (
          <div
            key={robot.name}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentRobot ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute bottom-0 w-full h-full transition-transform duration-500 ease-out bg-background"
              style={{
                transform: `translateY(${(1 - revealHeight) * 50}%) translateY(${revealHeight > 0.8 ? (revealHeight - 0.8) * 250 : 0}%)`,
              }}
            >
              <img
                src={robot.image}
                alt={robot.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}