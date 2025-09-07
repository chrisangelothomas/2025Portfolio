import { useState, useEffect } from 'react';
import RobotShowcase from '../components/RobotShowcase';
import Navigation from '../components/Navigation';
import ProfileSection from '../components/ProfileSection';
import OverscrollIndicator from '../components/OverscrollIndicator';
import { useOverscrollNavigation } from '../hooks/useOverscrollNavigation';

const Index = () => {
  // Create enough scroll height to see the full robot
  const scrollHeight = `200vh`;

  const { overscrollAmount, isOverscrolling, thresholdProgress } = useOverscrollNavigation({
    nextPage: '/zbot',
    threshold: 15
  });

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

        {/* Overscroll Indicator */}
        <OverscrollIndicator 
          progress={thresholdProgress}
          direction="down"
          isActive={isOverscrolling && thresholdProgress > 0}
        />
      </div>
    </div>
  );
};

export default Index;
