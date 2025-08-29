import { useState, useEffect } from 'react';
import RobotShowcase from '../components/RobotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';

const Index = () => {
  const [currentRobot, setCurrentRobot] = useState(0);

  // Create scroll height for 2 robots (3 screen heights per robot)
  const scrollHeight = `${300 * 2}vh`; // 2 robots

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

          {/* Center Robot Display - Handled by RobotShowcase */}
          <div className="col-span-4"></div>

          {/* Right Navigation - Centered */}
          <div className="col-span-4 flex justify-end items-center">
            <Navigation 
              currentRobot={currentRobot} 
              onRobotSelect={setCurrentRobot}
            />
          </div>
        </div>

        {/* Robot Showcase */}
        <RobotShowcase />

        {/* Scroll Spacer */}
        <div style={{ height: scrollHeight }} className="relative"></div>
      </div>
    </div>
  );
};

export default Index;
