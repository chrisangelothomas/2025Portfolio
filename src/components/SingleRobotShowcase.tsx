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
    <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-10 pt-16">
      <div className="flex flex-col items-center">
        <img
          src={robot.image}
          alt={robot.name}
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}