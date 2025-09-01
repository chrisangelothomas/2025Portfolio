interface NavigationProps {
  currentRobot: number;
  onRobotSelect: (index: number) => void;
}

const robots = ['K-Bot', 'Z-Bot'];

export default function Navigation({ currentRobot, onRobotSelect }: NavigationProps) {
  const handleRobotClick = (index: number) => {
    // Scroll to the appropriate section
    const scrollPosition = (index / robots.length) * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    onRobotSelect(index);
  };

  return (
    <nav className="space-y-8">
      <h2 className="font-geometric text-lg font-medium text-foreground tracking-wider uppercase">
        Projects
      </h2>
      <ul className="space-y-4">
        {robots.map((robot, index) => (
          <li key={robot}>
            <button
              onClick={() => handleRobotClick(index)}
              className={`font-geometric text-xl font-light tracking-wide transition-all duration-300 hover:text-foreground text-left block ${
                index === currentRobot
                  ? 'text-foreground font-bold opacity-100'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {robot}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}