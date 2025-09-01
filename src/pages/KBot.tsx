import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import SingleRobotShowcase from '../components/SingleRobotShowcase';
import { useOverscroll } from '../hooks/useOverscroll';

const robot = {
  name: 'K-Bot',
  image: '/lovable-uploads/b1ef3f37-b46d-4a5b-8911-cfcbece79ac4.png',
  description: 'Advanced humanoid platform'
};

const KBot = () => {
  useOverscroll({
    threshold: 30,
    nextRoute: '/zbot'
  });

  const scrollHeight = `400vh`;

  return (
    <div className="bg-background min-h-screen font-geometric">
      <div className="relative">
        {/* Fixed Layout Container */}
        <div className="fixed inset-0 grid grid-cols-12 gap-8 px-8 py-8 z-20">
          {/* Left Profile Section */}
          <div className="col-span-4 flex items-start pt-16">
            <ProfileSection />
          </div>

          {/* Center Robot Display */}
          <div className="col-span-4"></div>

          {/* Right Navigation */}
          <div className="col-span-4 flex justify-end items-center">
            <Navigation 
              currentRobot={0} 
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

export default KBot;