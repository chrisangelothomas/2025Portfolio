import ZBotShowcase from '../components/ZBotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';

const ZBot = () => {
  return (
    <div className="bg-background min-h-screen font-geometric">
      {/* Main Content Container */}
      <div className="relative">
        {/* Fixed Layout Container */}
        <div className="fixed inset-0 grid grid-cols-12 gap-8 px-16 py-24 z-20">
          {/* Left Profile Section - Centered */}
          <div className="col-span-4 flex items-center">
            <ProfileSection />
          </div>

          {/* Center Robot Display - Handled by ZBotShowcase */}
          <div className="col-span-4"></div>

          {/* Right Navigation - Centered */}
          <div className="col-span-4 flex justify-end items-center">
            <Navigation 
              currentRobot={1} 
              onRobotSelect={() => {}}
            />
          </div>
        </div>

        {/* Robot Showcase */}
        <ZBotShowcase />
      </div>
    </div>
  );
};

export default ZBot;