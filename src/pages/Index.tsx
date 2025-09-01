import { useState, useEffect } from 'react';
import RobotShowcase from '../components/RobotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';

const Index = () => {
  // Create enough scroll height to see the full robot
  const scrollHeight = `400vh`;

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
              currentRobot={0} 
              onRobotSelect={() => {}}
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
