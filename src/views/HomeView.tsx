import React from 'react';
import { BoardScene } from '../components/3d/BoardScene';
import { RightPanel } from '../components/layout/RightPanel';
import { LessonCarousel } from '../components/lessons/LessonCarousel';

export const HomeView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 3D Uno Viewer (Left) + Right Information & Pinout Tabs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[520px]">
        {/* Left: 3D Interactive Isometric Board Explorer (7 cols on desktop) */}
        <div className="lg:col-span-7 h-[460px] sm:h-[520px] w-full">
          <BoardScene />
        </div>

        {/* Right: Technical Inspector Tabs (5 cols on desktop) */}
        <div className="lg:col-span-5 h-[460px] sm:h-[520px] w-full">
          <RightPanel />
        </div>
      </div>

      {/* Bottom: 11 Curriculum Lessons Carousel */}
      <div>
        <LessonCarousel />
      </div>
    </div>
  );
};
