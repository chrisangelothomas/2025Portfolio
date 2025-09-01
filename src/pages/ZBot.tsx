import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import SingleRobotShowcase from '../components/SingleRobotShowcase';
import { useOverscroll } from '../hooks/useOverscroll';

const robot = {
  name: 'Z-Bot',
  image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png',
  description: 'Compact tactical unit'
};

const ZBot = () => {
  useOverscroll({
    threshold: 30,
    nextRoute: undefined, // Add next robot route when available
    prevRoute: '/'
  });

  const scrollHeight = `400vh`;

  return (
    <div className="bg-background min-h-screen font-geometric">
      <div className="relative">
        {/* Fixed Layout Container */}
        <div className="fixed inset-0 grid grid-cols-12 gap-8 px-16 py-24 z-20">
          {/* Left Profile Section */}
          <div className="col-span-4 flex items-center">
            <ProfileSection />
          </div>

          {/* Center Robot Display */}
          <div className="col-span-4"></div>

          {/* Right Navigation */}
          <div className="col-span-4 flex justify-end items-center">
            <Navigation 
              currentRobot={1} 
              onRobotSelect={() => {}}
            />
          </div>
        </div>

        {/* Robot Showcase */}
        <SingleRobotShowcase robot={robot} />

        {/* Scroll Spacer */}
        <div style={{ height: scrollHeight }} className="relative"></div>
      </div>
    </div>
  );
};

export default ZBot;