import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  currentRobot: number;
  onRobotSelect: (index: number) => void;
}

const robots = [
  { name: 'K-Bot', path: '/' },
  { name: 'Z-Bot', path: '/zbot' }
];

export default function Navigation({ currentRobot, onRobotSelect }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="space-y-4">
      <h2 className="font-geometric text-lg font-medium text-foreground tracking-wide leading-normal">
        Projects
      </h2>
      <ul className="space-y-4">
        {robots.map((robot, index) => (
          <li key={robot.name}>
            <Link
              to={robot.path}
              className={`font-geometric text-xl font-light tracking-wide leading-normal transition-all duration-300 hover:text-foreground text-left block ${
                location.pathname === robot.path
                  ? 'text-foreground font-bold opacity-100'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {robot.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}