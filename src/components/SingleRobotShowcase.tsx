interface Robot {
  name: string;
  image: string;
  description: string;
}

interface SingleRobotShowcaseProps {
  robot: Robot;
}

export default function SingleRobotShowcase({ robot }: SingleRobotShowcaseProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="flex flex-col items-center">
        <img
          src={robot.image}
          alt={robot.name}
          className="w-96 h-96 object-contain"
        />
      </div>
    </div>
  );
}