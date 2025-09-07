import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';

export default function ZBotShowcase() {
  const { virtualScrollY } = useOverscrollNavigation({
    prevPage: '/',
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
          src="/lovable-uploads/0b3292b6-1b3b-488a-8c3b-22fc5249055b.png"
          alt="Z-Bot"
          className="w-[200vw] h-[200vh] object-contain"
        />
      </div>
    </div>
  );
}