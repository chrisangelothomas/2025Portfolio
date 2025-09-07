import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';

export default function RobotShowcase() {
  const { virtualScrollY } = useOverscrollNavigation({
    nextPage: '/zbot',
    threshold: 30
  });

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      <div
        className="flex flex-col items-center"
        style={{
          transform: `translateY(${50 - virtualScrollY * 0.1}vh)`,
        }}
      >
        <img
          src="/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png"
          alt="K-Bot"
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}